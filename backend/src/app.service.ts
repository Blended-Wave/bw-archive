import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LessThanOrEqual, Repository } from 'typeorm';
import { UserEntity } from './app/users/entities';
import { WorksEntity } from './app/works/entities';
import { S3 } from 'aws-sdk';


@Injectable()
export class AppService {
  private s3 = new S3();  // AWS SDK S3 client
  
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(WorksEntity)
    private worksRepository: Repository<WorksEntity>,
  ) {}

  // 매일 자정마다 inactive 상태로 전환된 데이터를 실제로 삭제하는 작업
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async deleteInactiveData(): Promise<void> {
    const currentTime = new Date();
    
    // 1. 1주일 이상 inactive 상태인 users 삭제
    const inactiveUsers = await this.userRepository.find({
      where: {
        status: 'inactive',
        inactive_date: LessThanOrEqual(new Date(currentTime.getTime() - 7 * 24 * 60 * 60 * 1000)),  // 1주일 이상 지난 데이터
      },
    });

    for (const user of inactiveUsers) {
      await this.userRepository.remove(user);  // 실제 삭제
    }

    // 2. 1주일 이상 inactive 상태인 works 삭제
    const inactiveWorks = await this.worksRepository.find({
      where: {
        status: 'inactive',
        inactive_date: LessThanOrEqual(new Date(currentTime.getTime() - 7 * 24 * 60 * 60 * 1000)),  // 1주일 이상 지난 데이터
      },
    });

    for (const work of inactiveWorks) {
      await this.worksRepository.remove(work);  // 실제 삭제
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM)  // 예시로 매일 1시에 실행
  async deleteOrphanFilesFromS3(): Promise<void> {
    const usedFileKeys = new Set<string>();

    // 1. DB에서 사용 중인 파일 경로를 모두 수집
    const users = await this.userRepository.find();  // 유저와 avatar 관계 포함
    const works = await this.worksRepository.find({ relations: ['works_file'] });  // works와 file, thumbnail 관계 포함

    // 1-1. 유저에서 avatar_url 가져오기
    users.forEach(user => {
      if (user.avatar_url) {  // user와 avatar 엔티티에서 image_url 가져오기
        usedFileKeys.add(user.avatar_url);
      }
    });

    // 1-2. 작품에서 file_url, thumbnail_url 가져오기
    works.forEach(work => {
      if (work.works_file && work.works_file.file_url) {  // 파일의 경로 works_file에서 가져오기
        usedFileKeys.add(work.works_file.file_url);
      }
      if (work.thumbnail_url) {  // works테이블에서 직접 썸네일 경로 가져오기
        usedFileKeys.add(work.thumbnail_url);
      }
    });

    // 2. S3에서 파일 목록을 가져온 후 DB에 없는 파일 삭제
    try {
      const listObjectsParams = {
        Bucket: process.env.S3_BUCKET_NAME,  // 버킷 이름
        Prefix: 'uploads/',  // 업로드 파일이 저장되는 폴더 경로 (필요시 수정)
      };

      const s3Objects = await this.s3.listObjectsV2(listObjectsParams).promise();

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
      await this.s3.deleteObject({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileKey, // fileKey를 이용해 삭제할 파일을 지정
      }).promise();
      console.log(`File ${fileKey} deleted from S3`);
    } catch (error) {
      console.error('Error deleting file from S3:', error);
    }
  }
}
