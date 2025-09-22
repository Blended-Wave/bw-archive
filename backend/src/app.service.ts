import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LessThanOrEqual, Repository, DataSource } from 'typeorm';
import { UserEntity } from './app/users/entities';
import { WorksEntity } from './app/works/entities';
import { S3 } from 'aws-sdk';

@Injectable()
export class AppService {
  private s3 = new S3(); // AWS SDK S3 client

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(WorksEntity)
    private worksRepository: Repository<WorksEntity>,
    private dataSource: DataSource, // DataSource 주입 추가
  ) {}

  // 데이터베이스 연결 상태 체크 (환경별 다른 주기) - 임시 비활성화
  // @Cron(process.env.NODE_ENV === 'production' ? '0 */5 * * * *' : '0 */10 * * * *') // 운영: 5분마다, 개발: 10분마다
  async checkDatabaseConnection(): Promise<void> {
    try {
      // 간단한 쿼리로 연결 상태 확인
      await this.dataSource.query('SELECT 1');
      console.log('✅ Database connection is healthy');
    } catch (error: any) {
      console.error('❌ Database connection failed:', error.message);
      
      // Pool is closed, ECONNRESET, ECONNREFUSED 등 모든 연결 문제에 대해 재연결 시도
      if (error.message?.includes('Pool is closed') || 
          error.code === 'ECONNRESET' || 
          error.code === 'ECONNREFUSED' ||
          error.code === 'PROTOCOL_CONNECTION_LOST') {
        
        console.log('🔄 Attempting to reinitialize database connection pool...');
        
        try {
          // 1단계: 기존 DataSource 완전히 정리
          if (this.dataSource && this.dataSource.isInitialized) {
            console.log('📤 Destroying existing database connection...');
            await this.dataSource.destroy();
            console.log('✅ Database connection destroyed');
          }
          
          // 2단계: 약간의 대기 시간 (MySQL 서버가 연결을 정리할 시간 제공)
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // 3단계: DataSource 재초기화
          console.log('🔌 Reinitializing database connection...');
          await this.dataSource.initialize();
          
          // 4단계: 재연결 확인
          await this.dataSource.query('SELECT 1');
          console.log('✅ Database connection pool reinitialized successfully');
          
        } catch (reconnectError: any) {
          console.error('❌ Database reconnection failed:', reconnectError.message);
          
          // 재연결 실패 시 추가 대기 후 한 번 더 시도
          console.log('⏳ Waiting 5 seconds before retry...');
          await new Promise(resolve => setTimeout(resolve, 5000));
          
          try {
            await this.dataSource.initialize();
            await this.dataSource.query('SELECT 1');
            console.log('✅ Database connection restored after retry');
          } catch (finalError: any) {
            console.error('❌ Final reconnection attempt failed:', finalError.message);
          }
        }
      }
    }
  }

  // 매일 자정마다 inactive 상태로 전환된 데이터를 실제로 삭제하는 작업
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async deleteInactiveData(): Promise<void> {
    const currentTime = new Date();

    // 1. 1주일 이상 inactive 상태인 users 삭제
    const inactiveUsers = await this.userRepository.find({
      where: {
        status: 'inactive',
        inactive_date: LessThanOrEqual(
          new Date(currentTime.getTime() - 7 * 24 * 60 * 60 * 1000),
        ), // 1주일 이상 지난 데이터
      },
    });

    for (const user of inactiveUsers) {
      // S3에서 아바타 이미지 삭제
      if (user.avatar_url) {
        try {
          await this.deleteFileFromS3(user.avatar_url);
        } catch (error) {
          console.error(
            `Failed to delete user avatar from S3: ${user.avatar_url}`,
            error,
          );
        }
      }
      await this.userRepository.remove(user); // 실제 삭제
    }

    // 2. 1주일 이상 inactive 상태인 works 삭제
    const inactiveWorks = await this.worksRepository.find({
      where: {
        status: 'inactive',
        inactive_date: LessThanOrEqual(
          new Date(currentTime.getTime() - 7 * 24 * 60 * 60 * 1000),
        ), // 1주일 이상 지난 데이터
      },
      relations: ['works_file'], // works_file 관계 포함
    });

    for (const work of inactiveWorks) {
      // S3에서 썸네일 삭제
      if (work.thumb_url) {
        try {
          await this.deleteFileFromS3(work.thumb_url);
        } catch (error) {
          console.error(
            `Failed to delete work thumbnail from S3: ${work.thumb_url}`,
            error,
          );
        }
      }

      // S3에서 작업 파일 삭제
      if (work.works_file && work.works_file.file_url) {
        try {
          await this.deleteFileFromS3(work.works_file.file_url);
        } catch (error) {
          console.error(
            `Failed to delete work file from S3: ${work.works_file.file_url}`,
            error,
          );
        }
      }

      await this.worksRepository.remove(work); // 실제 삭제
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM) // 예시로 매일 1시에 실행
  async deleteOrphanFilesFromS3(): Promise<void> {
    const usedFileKeys = new Set<string>();

    // 1. DB에서 사용 중인 파일 경로를 모두 수집
    const users = await this.userRepository.find(); // 유저와 avatar 관계 포함
    const works = await this.worksRepository.find({
      relations: ['works_file'],
    });

    // 1-1. 유저에서 avatar_url 가져오기
    users.forEach((user) => {
      if (user.avatar_url) {
        // user와 avatar 엔티티에서 image_url 가져오기
        usedFileKeys.add(user.avatar_url);
      }
    });

    // 1-2. 작품에서 file_url, thumbnail_url 가져오기
    works.forEach((work) => {
      if (work.thumb_url) {
        usedFileKeys.add(work.thumb_url);
      }
      if (work.works_file && work.works_file.file_url) {
        // 파일의 경로 works_file에서 가져오기
        usedFileKeys.add(work.works_file.file_url);
      }
    });

    // 2. S3에서 파일 목록을 가져온 후 DB에 없는 파일 삭제
    try {
      const listObjectsParams = {
        Bucket: process.env.S3_BUCKET_NAME, // 버킷 이름
        Prefix: 'uploads/', // 업로드 파일이 저장되는 폴더 경로 (필요시 수정)
      };

      const s3Objects = await this.s3
        .listObjectsV2(listObjectsParams)
        .promise();

      for (const object of s3Objects.Contents) {
        if (object.Key && !usedFileKeys.has(object.Key)) {
          // DB에 존재하지 않는 파일을 S3에서 삭제
          await this.deleteFileFromS3(object.Key);
        }
      }
    } catch (error) {
      console.error('Error deleting orphan files from S3:', error);
    }
  }

  async deleteFileFromS3(fileKey: string): Promise<void> {
    try {
      await this.s3
        .deleteObject({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: fileKey, // fileKey를 이용해 삭제할 파일을 지정
        })
        .promise();
      console.log(`File ${fileKey} deleted from S3`);
    } catch (error) {
      console.error('Error deleting file from S3:', error);
    }
  }
}
