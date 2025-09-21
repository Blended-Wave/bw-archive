import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { WorksEntity } from './entities/works.entity';
import { WorksFileEntity } from './entities/worksFile.entity';
import { SeriesEntity } from './entities/series.entity';
import {
  WorksReqDto,
  UpdateWorksReqDto,
  InstWorksResponseDto,
  ArtistDto,
  PagedWorksResponseDto,
  WorksDetailResponseDto,
  WorksResponseDto,
} from './dto/works.dto';
import { UserService, UserInfo } from '../users/users.service';
import { FileUploadService } from '../file-upload/file-upload.service';
import { UserEntity } from '../users/entities/user.entity';
import { UserWorksEntity } from '../users/entities/user.works.entity';
import { response } from '../../config/response';
import { status } from '../../config/response.status';
import { BaseError } from '../../config/error';

@Injectable()
export class WorkService {
  constructor(
    @InjectRepository(WorksEntity)
    private worksRepository: Repository<WorksEntity>,
    @InjectRepository(WorksFileEntity)
    private worksFileRepository: Repository<WorksFileEntity>,
    @InjectRepository(SeriesEntity)
    private seriesRepository: Repository<SeriesEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(UserWorksEntity)
    private userWorksRepository: Repository<UserWorksEntity>,
    private userService: UserService,
    private fileUploadService: FileUploadService,
  ) {}

  private parseBoolean(value: any): boolean {
    return value === true || value === 'true' || value === 1 || value === '1';
  }

  private toStringArray(value: any): string[] {
    if (Array.isArray(value)) return value as string[];
    if (typeof value === 'string') {
      return value
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
    }
    return [];
  }

  // --- Client Facing Methods ---

  async getPublicPinnedPubWorksSer(): Promise<WorksResponseDto[]> {
      const pinnedWorks = await this.worksRepository.find({
      where: { status: 'active', private_option: 0, pinned_option: 1 },
      order: { created_at: 'DESC' },
      relations: ['works_file'],
      });
    return pinnedWorks.map((work) => ({
      works_id: work.id,
      thumbnail_url: work.thumb_url,
      file_url: work.works_file?.file_url,
      type: work.works_file?.type || 'image',
      private_option: false,
    }));
    }

  async getViewSortedPubWorksSer(): Promise<WorksResponseDto[]> {
      const sortedWorks = await this.worksRepository.find({
      where: { status: 'active', private_option: 0 },
      order: { views: 'DESC' },
      relations: ['works_file'],
      });
    return sortedWorks.map((work) => ({
      works_id: work.id,
      thumbnail_url: work.thumb_url,
      file_url: work.works_file?.file_url,
      type: work.works_file?.type || 'image',
      private_option: false,
    }));
    }

  async getRecentSortedPubWorksSer(): Promise<WorksDetailResponseDto[]> {
    const works = await this.worksRepository.find({
      where: { status: 'active', private_option: 0 },
      order: { created_at: 'DESC' },
      relations: ['works_file', 'series', 'user_works', 'user_works.user'],
      });

    return works.map((work) => {
      const mainArtist = work.user_works.find((uw) => uw.is_main === 1)?.user;
      const credits = work.user_works
        .filter((uw) => uw.is_main === 0)
        .map((uw) => new ArtistDto(uw.user.nickname));

      return {
        works_id: work.id,
        title: work.title,
        thumbnail_url: work.thumb_url,
        file_url: work.works_file?.file_url, // work_file URL 추가
        series: work.series?.name,
        main_artist: mainArtist ? new ArtistDto(mainArtist.nickname) : null,
        credits: credits,
        created_at: work.created_at,
        views: work.views,
        type: work.works_file?.type,
        status: work.status,
        private_option: work.private_option === 1,
        pinned_option: work.pinned_option === 1,
      };
    });
  }

  async getWorksDetailSer(workId: number): Promise<WorksDetailResponseDto> {
    const work = await this.worksRepository.findOne({
      where: { id: workId, status: 'active', private_option: 0 },
      relations: ['works_file', 'series', 'user_works', 'user_works.user'],
    });
    if (!work) throw new BaseError(status.WORKS_NOT_FOUND);

    const mainArtist = work.user_works.find((uw) => uw.is_main === 1)?.user;
    const credits = work.user_works
      .filter((uw) => uw.is_main === 0)
      .map((uw) => new ArtistDto(uw.user.nickname, uw.user.avatar_url, uw.user.id));

    return {
      ...work,
      works_id: work.id,
      thumbnail_url: work.thumb_url,
      description: work.description, // description 필드 추가
      series: work.series?.name,
      file_url: work.works_file?.file_url,
      type: work.works_file?.type,
      main_artist: mainArtist ? new ArtistDto(mainArtist.nickname, mainArtist.avatar_url, mainArtist.id) : null,
      credits: credits,
      private_option: work.private_option === 1,
      pinned_option: work.pinned_option === 1,
    };
  }

  // --- Admin Facing Methods ---

  async getAllWorks(
    page: number = 1,
    limit: number = 15,
  ): Promise<PagedWorksResponseDto> {
    const [works, totalCount] = await this.worksRepository.findAndCount({
      relations: ['series', 'user_works', 'user_works.user', 'works_file'],
      skip: (page - 1) * limit,
      take: limit,
      order: {
        created_at: 'DESC',
      },
    });


    const workTableList: WorksDetailResponseDto[] = works.map((work) => {
      const mainArtistWork = work.user_works.find((uw) => uw.is_main === 1);
      const creditUserWorks = work.user_works.filter((uw) => uw.is_main === 0);

        const workDto = new WorksDetailResponseDto();
        workDto.works_id = work.id;
      workDto.thumbnail_url = work.thumb_url;
      workDto.type = work.works_file?.type;
        workDto.title = work.title;
      workDto.series = work.series?.name;
        workDto.created_at = work.created_at;
        workDto.views = work.views || 0;
      workDto.status = work.status;
      workDto.private_option = work.private_option === 1;
      workDto.pinned_option = work.pinned_option === 1;
      workDto.main_artist = mainArtistWork
        ? new ArtistDto(mainArtistWork.user.nickname)
        : null;
      workDto.credits = creditUserWorks.map(
        (uw) => new ArtistDto(uw.user.nickname),
      );
      // description과 file_url은 바둑판 렌더링에 불필요하므로 제거 (성능 최적화)
        return workDto;
    });

    return {
      works: workTableList,
      totalCount,
    };
  }

  async getInstWorksSer(userId: number): Promise<InstWorksResponseDto> {
    const userInfo = await this.userService.getUserInfo(userId);
    return {
      imgList: userInfo.works.map((work) => ({
        works_id: work.works_id,
        thumbnail_url: work.thumbnail_url,
        file_url: work.file_url, // 본문 파일 URL 전달
        type: work.type,
        private_option: work.private_option,
      })),
      artistInfo: userInfo,
    };
  }

  async getArtistInfo(userId: number): Promise<any> {
    const userInfo = await this.userService.getUserInfo(userId);
    if (!userInfo) {
      throw new BaseError(status.USER_NOT_FOUND);
    }
    return response(status.SUCCESS, {
      nickname: userInfo.name,
      instagramUrl: userInfo.instarUrl,
      twitterUrl: userInfo.twitterUrl,
      imgList: userInfo.works,
    });
  }

  async getWorksForEdit(works_id: number): Promise<WorksDetailResponseDto> {
    const workDetail = await this.worksRepository.findOne({
      where: { id: works_id },
      relations: ['series', 'works_file', 'user_works', 'user_works.user'],
    });

    if (!workDetail) {
      throw new BaseError(status.WORKS_NOT_FOUND);
    }

    const main_artist = workDetail.user_works.find(
      (user_work) => user_work.is_main === 1,
    )?.user.nickname;
    const credits = workDetail.user_works
      .filter((user_work) => user_work.is_main === 0)
      .map((user_work) => user_work.user.nickname);

    return {
      ...workDetail,
      works_id: workDetail.id,
      thumbnail_url: workDetail.thumb_url,
      series: workDetail.series?.name,
      file_url: workDetail.works_file?.file_url,
      type: workDetail.works_file?.type,
      main_artist: new ArtistDto(main_artist),
      credits: credits.map((credit) => new ArtistDto(credit)),
      private_option: workDetail.private_option === 1,
      pinned_option: workDetail.pinned_option === 1,
    };
  }

  async postWorksSer(
    worksReqDto: WorksReqDto,
    files: {
      thumbnail?: Express.Multer.File[];
      workFile?: Express.Multer.File[];
    },
  ): Promise<any> {
    const queryRunner =
      this.worksRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      let seriesEntity = await this.seriesRepository.findOne({
        where: { name: worksReqDto.series },
      });
      if (!seriesEntity && worksReqDto.series) {
        seriesEntity = this.seriesRepository.create({
          name: worksReqDto.series,
        });
        await queryRunner.manager.save(SeriesEntity, seriesEntity);
      }

      const newWork = new WorksEntity();
      newWork.title = worksReqDto.title;
      newWork.description = worksReqDto.description;
      newWork.private_option = this.parseBoolean(worksReqDto.private_option) ? 1 : 0;
      newWork.pinned_option = this.parseBoolean(worksReqDto.pinned_option) ? 1 : 0;
      if (seriesEntity) newWork.series = seriesEntity;
      newWork.status = 'active';

      if (files.thumbnail && files.thumbnail.length > 0) {
        const uploaded = await this.fileUploadService.uploadFiles({
          thumbnail_url: files.thumbnail,
        });
        newWork.thumb_url = uploaded?.thumbnail?.url;
      }

      const savedWork = await queryRunner.manager.save(WorksEntity, newWork);

      if (files.workFile && files.workFile.length > 0) {
        const uploaded = await this.fileUploadService.uploadFiles({
          file_url: files.workFile,
        });
        const workFileEntity = new WorksFileEntity();
        workFileEntity.file_url = uploaded?.file?.url;
        workFileEntity.type = uploaded?.file?.type ?? worksReqDto.type;
        workFileEntity.works = savedWork;
        await queryRunner.manager.save(WorksFileEntity, workFileEntity);

        if (!savedWork.thumb_url && (workFileEntity.type === 'image')) {
          savedWork.thumb_url = workFileEntity.file_url;
          await queryRunner.manager.save(WorksEntity, savedWork);
        }
      }

      const mainArtist = await this.userRepository.findOneBy({
        nickname: worksReqDto.main_artist,
      });
      if (!mainArtist) throw new NotFoundException('Main artist not found');

      const mainArtistWork = new UserWorksEntity();
      mainArtistWork.user = mainArtist;
      mainArtistWork.works = savedWork;
      mainArtistWork.is_main = 1;
      await queryRunner.manager.save(UserWorksEntity, mainArtistWork);

      const creditNicknames = this.toStringArray(worksReqDto.credits);
      if (creditNicknames.length > 0) {
        const creditUsers = await this.userRepository.find({
          where: { nickname: In(creditNicknames) },
        });
        for (const user of creditUsers) {
          const creditWork = new UserWorksEntity();
          creditWork.user = user;
          creditWork.works = savedWork;
          creditWork.is_main = 0;
          await queryRunner.manager.save(UserWorksEntity, creditWork);
        }
      }

      await queryRunner.commitTransaction();
      return response(status.CREATE_SUCCESS, {});
    } catch (error) {
      console.error('[API-ERROR] postWorksSer failed:', error);
      await queryRunner.rollbackTransaction();
      throw new BaseError(status.INTERNAL_SERVER_ERROR);
    } finally {
      await queryRunner.release();
    }
  }

  async modifyWork(
    workId: number,
    updateWorksReqDto: UpdateWorksReqDto,
    files: {
      thumbnail?: Express.Multer.File[];
      workFile?: Express.Multer.File[];
    },
  ): Promise<any> {
    const queryRunner =
      this.worksRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const work = await this.worksRepository.findOne({
        where: { id: workId },
        relations: ['series', 'works_file'],
      });
      if (!work) throw new NotFoundException('Work not found');

      // 1) 사전 준비: 시리즈 엔티티 조회/생성
      let seriesEntity: SeriesEntity | null = null;
      if (updateWorksReqDto.series) {
        seriesEntity = await this.seriesRepository.findOne({
          where: { name: updateWorksReqDto.series },
        });
        if (!seriesEntity) {
          seriesEntity = this.seriesRepository.create({
            name: updateWorksReqDto.series,
          });
          await queryRunner.manager.save(SeriesEntity, seriesEntity);
        }
      }

      // 2) works 기본 필드 먼저 업데이트 (잠금 충돌 최소화)
      work.title = updateWorksReqDto.title ?? work.title;
      work.description = updateWorksReqDto.description ?? work.description;
      if (updateWorksReqDto.private_option != null) {
        work.private_option = this.parseBoolean(updateWorksReqDto.private_option) ? 1 : 0;
      }
      if (updateWorksReqDto.pinned_option != null) {
        work.pinned_option = this.parseBoolean(updateWorksReqDto.pinned_option) ? 1 : 0;
      }
      if (seriesEntity) {
        work.series = seriesEntity;
      }
      await queryRunner.manager.save(WorksEntity, work);

      let prevFileId: number | null = null;
      let prevFileUrl: string | null = null;

      if (work.works_file?.id) {
        prevFileId = work.works_file.id;
        prevFileUrl = work.works_file.file_url;
      }

      // 3) 파일 처리 (썸네일/원본 파일 교체)
      if (files.thumbnail && files.thumbnail.length > 0) {
        if (work.thumb_url) {
          await this.fileUploadService.deleteFileFromS3(work.thumb_url);
        }
        const uploaded = await this.fileUploadService.uploadFiles({
          thumbnail_url: files.thumbnail,
        });
        work.thumb_url = uploaded?.thumbnail?.url;
        await queryRunner.manager.save(WorksEntity, work);
      }

      if (files.workFile && files.workFile.length > 0) {
        // 먼저 새 파일을 업로드하고 성공하면 기존 파일 관계를 변경
        const uploaded = await this.fileUploadService.uploadFiles({
          file_url: files.workFile,
        });
        
        if (!uploaded?.file?.url) {
          throw new Error('File upload failed');
        }
        
        const newWorkFile = new WorksFileEntity();
        newWorkFile.file_url = uploaded.file.url;
        // 업로드 결과의 타입을 우선 사용
        newWorkFile.type = uploaded.file.type ?? updateWorksReqDto.type;
        newWorkFile.works = work;
        await queryRunner.manager.save(WorksFileEntity, newWorkFile);

        // 새 파일이 성공적으로 저장된 후에만 기존 파일 관계를 업데이트
        if (prevFileId) {
          work.works_file = newWorkFile;
          await queryRunner.manager.save(WorksEntity, work);
        } else {
          work.works_file = newWorkFile;
          await queryRunner.manager.save(WorksEntity, work);
        }

        if (!work.thumb_url && (newWorkFile.type === 'image')) {
          work.thumb_url = newWorkFile.file_url;
          await queryRunner.manager.save(WorksEntity, work);
        }
      } else {
        // 새로운 workFile이 업로드되지 않은 경우: 기존 파일 관계 유지
        // 단, type 업데이트는 처리
        if (updateWorksReqDto.type && work.works_file) {
          work.works_file.type = updateWorksReqDto.type;
          await queryRunner.manager.save(WorksFileEntity, work.works_file);
        }
        
        // 기존 파일 관계 유지
      }

      // 4) user_works (main_artist, credits) 업데이트
      // 기존 user_works 모두 삭제
      await queryRunner.manager.delete(UserWorksEntity, { works: { id: workId } });
      
      // main_artist 추가
      const mainArtist = await this.userRepository.findOne({
        where: { nickname: updateWorksReqDto.main_artist }
      });
      if (!mainArtist) {
        throw new NotFoundException('Main artist not found: ' + updateWorksReqDto.main_artist);
      }
      
      const mainArtistWork = new UserWorksEntity();
      mainArtistWork.user = mainArtist;
      mainArtistWork.works = work;
      mainArtistWork.is_main = 1;
      await queryRunner.manager.save(UserWorksEntity, mainArtistWork);
      
      // credits 추가
      const creditNicknames = this.toStringArray(updateWorksReqDto.credits);
      if (creditNicknames.length > 0) {
        const creditUsers = await this.userRepository.find({
          where: { nickname: In(creditNicknames) },
        });
        
        for (const user of creditUsers) {
          const creditWork = new UserWorksEntity();
          creditWork.user = user;
          creditWork.works = work;
          creditWork.is_main = 0;
          await queryRunner.manager.save(UserWorksEntity, creditWork);
        }
      }
      

      await queryRunner.commitTransaction();

      if (prevFileId && prevFileUrl) {
        try {
          await this.fileUploadService.deleteFileFromS3(prevFileUrl);
        } catch (e) {
          console.error('[WARN] S3 delete failed (prev file):', prevFileUrl, e);
        }
        try {
          await this.worksFileRepository.delete(prevFileId);
        } catch (e) {
          console.error('[WARN] works_file row delete failed (prev id):', prevFileId, e);
        }
      }

      return response(status.SUCCESS, {});
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BaseError(status.INTERNAL_SERVER_ERROR);
    } finally {
      await queryRunner.release();
    }
  }

  async patchWorksStatus(work_id: number): Promise<any> {
    const work = await this.worksRepository.findOneBy({ id: work_id });
    if (!work) throw new BaseError(status.WORKS_NOT_FOUND);

    if (work.status === 'active') {
      await this.worksRepository.update(work_id, {
        status: 'inactive',
        inactive_date: new Date(),
      });
    } else {
      await this.worksRepository.update(work_id, {
        status: 'active',
        inactive_date: null,
      });
    }
    return response(status.SUCCESS, {});
  }

  async hardDeleteWork(work_id: number): Promise<any> {
    const work = await this.worksRepository.findOne({
      where: { id: work_id },
      relations: ['works_file'],
    });
    if (!work) {
      throw new NotFoundException(`Work with ID ${work_id} not found`);
    }

    await this.userWorksRepository.delete({ works: { id: work_id } });

    if (work.thumb_url) {
      await this.fileUploadService.deleteFileFromS3(work.thumb_url);
    }
    if (work.works_file && work.works_file.file_url) {
      await this.fileUploadService.deleteFileFromS3(work.works_file.file_url);
      await this.worksFileRepository.delete(work.works_file.id);
    }
    await this.worksRepository.delete(work_id);
    return response(status.SUCCESS, {});
  }
}
