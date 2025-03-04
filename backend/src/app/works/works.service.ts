import { UserService } from './../users/users.service';
import { UserReqDto } from './../users/dto/user.info.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SeriesEntity, ThumbnailEntity, WorksEntity, WorksFileEntity } from './entities';
import { Repository } from 'typeorm';
import { InstWorksResponseDto, WorksDetailResponseDto, WorksResponseDto, WorksReqDto, ArtistDto } from './dto/works.dto';
import { InstUserResponseDto } from '../users/dto/user.info.dto';
import { BaseError } from 'src/config/error';
import { status } from 'src/config/response.status';
import { UserEntity, UserWorksEntity } from '../users/entities';

@Injectable()
export class WorkService {
    constructor(
        private userService: UserService,
        @InjectRepository(WorksEntity)
        private worksRepository:  Repository<WorksEntity>,
        @InjectRepository(WorksFileEntity)
        private worksFileRepository: Repository<WorksFileEntity>,
        @InjectRepository(SeriesEntity) 
        private seriesRepository: Repository<SeriesEntity>,
        @InjectRepository(ThumbnailEntity)
        private thumbnailRepository: Repository<ThumbnailEntity>,
        @InjectRepository(UserWorksEntity)
        private userWorksRepository: Repository<UserWorksEntity>,
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>
    ) { }
    /** Works 도메인 공통 or 클라이언트 측 서비스 */
    async getPublicPinnedPubWorksSer(): Promise<WorksResponseDto[]> {
        //private, pinned, status 확인
        try{
            const worksDtos: WorksResponseDto[] = [];
            const pinnedWorks = await this.worksRepository.find({
                select: ['id', 'thumbnail'],
                where : { 
                    status: 'active',
                    pinned_option: 1, // 0 -> false, 1->true
                    private_option: 0 // public
                },
                order: {
                    created_at: 'DESC', // 최신 시간순으로 정렬
                }
            })

            for (const work of pinnedWorks) {
                const worksDto = new WorksResponseDto();
                const { id, thumbnail } = work; // works ID, thumbnail entity

                // thumbnail id로 thumb url 검색
                worksDto.works_id = id;
                worksDto.thumb_url = await this.getThumbUrlById(thumbnail.id);
                worksDtos.push(worksDto);
            }

            return worksDtos;
        } catch  (err) {
            throw new BaseError(status.WORK_NOT_FOUND)
        }

        
    }
    async getThumbUrlById(thumbId:number): Promise<string> {
        try{
            const thumb = await this.thumbnailRepository.findOneBy({id: thumbId});
            return thumb.image_url;
        } catch {
            throw new BaseError(status.THUMNAIL_NOT_FOUND)
        }
    }
    async getViewSortedPubWorksSer(): Promise<WorksResponseDto[]> {
        try {
            const worksDtos: WorksResponseDto[] = [];
            const sortedWorks = await this.worksRepository.find({
                select: ['id', 'thumbnail'],
                where: {
                    status: 'active',
                    pinned_option: 0, // false
                    private_option: 0 // public
                },
                order: {
                    views: 'DESC', // 조회수 내림차순 정렬
                }
            });
    
            for (const work of sortedWorks) {
                const worksDto = new WorksResponseDto();
                const { id, thumbnail } = work; // works ID, thumbnail entity
    
                // thumbnail id로 thumb url 검색
                worksDto.works_id = id;
                worksDto.thumb_url = await this.getThumbUrlById(thumbnail.id);
                worksDtos.push(worksDto);
            }
    
            return worksDtos;
        } catch (err) {
            throw new BaseError(status.WORK_NOT_FOUND);
        }
    }
    
        // 최신순(created_at) 기준으로 정렬된 공개된 게시물 리스트 반환
    async getRecentSortedPubWorksSer(): Promise<WorksResponseDto[]> {
        try {
            const worksDtos: WorksResponseDto[] = [];
            const sortedWorks = await this.worksRepository.find({
                select: ['id', 'thumbnail'],
                where: {
                    status: 'active',
                    pinned_option: 0, // pinned: false
                    private_option: 0 // public
                },
                order: {
                    created_at: 'DESC', // 최신 게시물 순으로 정렬
                }
            });

            for (const work of sortedWorks) {
                const worksDto = new WorksResponseDto();
                const { id, thumbnail } = work; // works ID, thumbnail entity

                // thumbnail id로 thumb url 검색
                worksDto.works_id = id;
                worksDto.thumb_url = await this.getThumbUrlById(thumbnail.id);
                worksDtos.push(worksDto);
            }

            return worksDtos;
        } catch (err) {
            throw new BaseError(status.WORK_NOT_FOUND);
        }
    }

    async getInstWorksSer(userId:number): Promise<InstWorksResponseDto[]> {
        try {
            const worksDtos: InstWorksResponseDto[] = [];
            const instWorks = await this.worksRepository.find({
                select: ['id', 'works_file'], // works id, works_file entity
                where: {
                    status: 'active',
                    private_option: 0,
                    type: 'image'
                },
                order: {
                    id: 'DESC'
                }
            })

            for (const work of instWorks) {
                const worksDto = new InstWorksResponseDto();
                const { works_file } = work;

                // works_file_id로 works_file_url 검색한
                worksDto.image_url = await  this.getWorksFileUrlById(works_file.id);
                worksDtos.push(worksDto);
            }

            return worksDtos;
        } catch(err) {
            throw new BaseError(status.WORK_NOT_FOUND);
        }
    }
    async getWorksFileUrlById(fileId:number): Promise<string >{
        try{
            const file = await this.worksFileRepository.findOneBy({id: fileId})
            return  file.file_url;
        }catch(err) {
            throw new BaseError(status.FILE_NOT_FOUND);
        }
    }
    
    async getWorksDetailSer(workId:number): Promise<WorksDetailResponseDto>{
        try {
            const workDto = new WorksDetailResponseDto();
            const workDetail = await this.worksRepository.findOne({
                where: {id: workId},
                relations: ['series']
            })
            workDto.title = workDetail.title;
            workDto.description = workDetail.description;
            workDto.series = workDetail.series.name;
            workDto.created_at = workDetail.created_at;
            workDto.main_artist = await this.userService.getMainArtistInfo(workId); // isMain true인 artist정보
            workDto.credits = await this.userService.getCreditsInfo(workId); // isMain이 false인 
            
            return workDto;
        } catch(err) {
            throw new BaseError(status.WORK_NOT_FOUND);
        }
    }
    /** Work도메인 admin 관련 서비스 */
    async getAllWorksSer(): Promise<WorksDetailResponseDto[]> {
        // 모든 works를 조회하고 series와 user_works 테이블의 관계를 조인
        const works = await this.worksRepository.find({
            relations: ['series', 'thumbnail'],  // works와 관련된 다른 엔티티만 로드
        });

        const workTableList: WorksDetailResponseDto[] = [];

        for (const work of works) {
            const thumbUrl = work.thumbnail?.image_url || null;
            const views = work.views || 0;
            const privateOption = work.private_option === 1;

            // userWorksRepository를 통해 해당 works_id에 해당하는 userWorks 레코드 조회
            const userWorks = await this.userWorksRepository.find({
                where: { works: { id: work.id } },  // work.id를 기준으로 userWorks 조회
                relations: ['user'],  // user 관계를 함께 로드
            });

            // is_main이 true인 아티스트를 메인 아티스트로, 나머지 아티스트는 크레딧으로
            const mainArtistWork = userWorks.find((userWork) => userWork.is_main === true);
            const mainArtist = mainArtistWork
                ? new ArtistDto(mainArtistWork.user.nickname)
                : null;

            // is_main이 false인 아티스트는 크레딧
            const credits = userWorks
                .filter((userWork) => !userWork.is_main)
                .map((userWork) => new ArtistDto(userWork.user.nickname));

            // WorksDetailResponseDto 객체에 데이터를 매핑
            const workDto = new WorksDetailResponseDto(); 
            workDto.works_id = work.id;
            workDto.thumb_url = thumbUrl;
            workDto.type = work.type;
            workDto.title = work.title;
            workDto.created_at = work.created_at;
            workDto.views = views;
            workDto.main_artist = mainArtist;
            workDto.credits = credits;
            workDto.private = privateOption;

            workTableList.push(workDto);
        }

        return workTableList;
    }
    

    async postWorksSer(worksReqDto: WorksReqDto): Promise<boolean> {
        try {
            // 1. SeriesEntity 처리 (시리즈가 없으면 새로 생성)
            let seriesEntity = await this.seriesRepository.findOne({ where: { name: worksReqDto.series } });
            if (!seriesEntity) {
                seriesEntity = new SeriesEntity();
                seriesEntity.name = worksReqDto.series;
                await this.seriesRepository.save(seriesEntity);
            }
    
            // 2. WorksFileEntity 처리 (file_url, type)
            const worksFileEntity = new WorksFileEntity();
            worksFileEntity.file_url = worksReqDto.file_url;
            worksFileEntity.type = worksReqDto.type; // type을 WorksFileEntity와 WorksEntity 모두에 설정(4번에서)
            await this.worksFileRepository.save(worksFileEntity);
    
            // 3. ThumbnailEntity 처리 (thumb_url)
            const thumbnailEntity = new ThumbnailEntity();
            thumbnailEntity.image_url = worksReqDto.thumb_url;
            await this.thumbnailRepository.save(thumbnailEntity);
    
            // 4. WorksEntity 처리
            const newWork = new WorksEntity();
            newWork.title = worksReqDto.title;
            newWork.description = worksReqDto.description;
            newWork.type = worksReqDto.type;
            newWork.views = 0; // 기본 조회수 0
            newWork.pinned_option = worksReqDto.pinned ? 1 : 0; // pinned 상태
            newWork.private_option = worksReqDto.private ? 1 : 0; // private 상태
            newWork.series = seriesEntity;
            newWork.works_file = worksFileEntity;
            newWork.thumbnail = thumbnailEntity;
            newWork.created_at = new Date();
            newWork.updated_at = new Date();
            await this.worksRepository.save(newWork);
    
            // 5. Main artist 처리 (main_artist.id로 검색)
            const mainArtist = await this.userRepository.findOne({ where: { id: worksReqDto.main_artist.id } });
            if (mainArtist) {
                const userWorksEntity = new UserWorksEntity();
                userWorksEntity.user = mainArtist;
                userWorksEntity.works = newWork;
                userWorksEntity.is_main = true; // main_artist는 is_main이 true
                await this.userWorksRepository.save(userWorksEntity);
            }
    
            // 6. Credits 처리 (credits 배열 처리)
            for (const credit of worksReqDto.credits) {
                const creditArtist = await this.userRepository.findOne({ where: { id: credit.id } });
                if (creditArtist) {
                    const userWorksEntity = new UserWorksEntity();
                    userWorksEntity.user = creditArtist;
                    userWorksEntity.works = newWork;
                    userWorksEntity.is_main = false; // credits는 is_main이 false
                    await this.userWorksRepository.save(userWorksEntity);
                }
            }
    
            return true;
        } catch (error) {
            console.error("Error creating work:", error);
            return false;
        }
    }
    
    async getWorksForEdit(worksId: number): Promise<WorksReqDto | null> {
        try {
            // worksId를 기준으로 게시글 정보 조회
            const work = await this.worksRepository.findOne({
                where: { id: worksId },
                relations: ['series', 'works_file', 'thumbnail']  // 연관된 엔티티들도 포함해서 조회
            });
    
            if (!work) {
                return null;  // 게시글이 존재하지 않으면 null 반환
            }
    
            // `WorksEntity`에서 받은 데이터를 `WorksReqDto` 형태로 변환
            const worksReqDto = new WorksReqDto();
            worksReqDto.works_id = work.id;
            worksReqDto.thumb_url = work.thumbnail?.image_url || null; // 썸네일 URL
            worksReqDto.type = work.works_file?.type || '';  // type은 works_file에서 가져옴
            worksReqDto.file_url = work.works_file?.file_url || '';  // file_url
            worksReqDto.title = work.title;
            worksReqDto.description = work.description;
            worksReqDto.series = work.series?.name || '';  // SeriesEntity에서 시리즈명
            worksReqDto.pinned = work.pinned_option === 1;
            worksReqDto.private = work.private_option === 1;
    
            // 기존의 main_artist 처리
            const mainArtistWork = await this.userWorksRepository.findOne({
                where: { works: { id: worksId }, is_main: true },
                relations: ['user']  // 메인 아티스트의 정보를 가져오기
            });
            
            // main_artist 정보를 dto에 포함 (id, nickname, avatar_url)
            worksReqDto.main_artist = mainArtistWork
                ? {
                    id: mainArtistWork.user.id,
                    nickname: mainArtistWork.user.nickname,
                    avatar_url: mainArtistWork.user.avatar_url || null
                }
                : null;
    
            // credits 아티스트들 처리
            const creditsWork = await this.userWorksRepository.find({
                where: { works: { id: worksId }, is_main: false },
                relations: ['user']  // 크레딧 아티스트들의 정보를 가져오기
            });
    
            // credits 아티스트들을 dto에 포함 (id, nickname, avatar_url)
            worksReqDto.credits = creditsWork.map(userWork => ({
                id: userWork.user.id,
                nickname: userWork.user.nickname,
                avatar_url: userWork.user.avatar_url || null
            }));
    
            return worksReqDto;
        } catch (error) {
            console.error("Error fetching work for edit:", error);
            return null;
        }
    }
    async patchWorksSer(worksId: number, worksReqDto: WorksReqDto): Promise<boolean> {
        try {
            // 1. 기존 works 찾기
            const existingWork = await this.worksRepository.findOne({
                where: { id: worksId },
                relations: ['series', 'works_file', 'thumbnail']
            });
    
            if (!existingWork) {
                return false; // 해당 works가 없으면 false 반환
            }
    
            // 2. WorksEntity 수정
            existingWork.title = worksReqDto.title || existingWork.title;
            existingWork.description = worksReqDto.description || existingWork.description;
            existingWork.type = worksReqDto.type || existingWork.type;
            existingWork.pinned_option = worksReqDto.pinned ? 1 : 0;
            existingWork.private_option = worksReqDto.private ? 1 : 0;
            existingWork.updated_at = new Date();
    
            // 관련된 entity들 수정
            if (worksReqDto.thumb_url) {
                existingWork.thumbnail.image_url = worksReqDto.thumb_url;
            }
            if (worksReqDto.file_url) {
                existingWork.works_file.file_url = worksReqDto.file_url;
                existingWork.works_file.type = worksReqDto.type; // type도 worksFile 테이블에 수정
            }
            if (worksReqDto.series) {
                existingWork.series.name = worksReqDto.series;
            }
    
            // 3. 업데이트된 worksEntity 저장
            await this.worksRepository.save(existingWork);
    
            // 4. Main artist 업데이트 (main_artist.id로 검색)
            const mainArtist = await this.userRepository.findOne({ where: { id: worksReqDto.main_artist.id } });
            if (mainArtist) {
                const mainArtistWork = await this.userWorksRepository.findOne({ where: { works: { id: worksId }, is_main: true } });
                if (mainArtistWork) {
                    mainArtistWork.user = mainArtist;
                    await this.userWorksRepository.save(mainArtistWork);
                }
            }
    
            // 5. Credits 업데이트 (credits 배열 처리)
            for (const credit of worksReqDto.credits) {
                const creditArtist = await this.userRepository.findOne({ where: { id: credit.id } });
                if (creditArtist) {
                    const creditWork = await this.userWorksRepository.findOne({ where: { works: { id: worksId }, user: { id: creditArtist.id } } });
                    if (creditWork) {
                        creditWork.user = creditArtist;
                        await this.userWorksRepository.save(creditWork);
                    }
                }
            }
    
            return true;
        } catch (error) {
            console.error("Error updating work:", error);
            return false;
        }
    }
    
    async inactiveWorksSer(worksId: number): Promise<boolean> {
        try {
            // worksId로 게시글 조회
            const existingWork = await this.worksRepository.findOne({
                where: { id: worksId }
            });
    
            if (!existingWork) {
                return false; // 게시글이 존재하지 않으면 false 반환
            }
    
            // 게시글 상태를 inactive로 설정
            existingWork.status = 'inactive';  // 상태를 'inactive'로 변경
            existingWork.updated_at = new Date();  // 수정 시간 갱신
    
            // 업데이트된 게시글 저장
            await this.worksRepository.save(existingWork);
    
            return true;  // 성공적으로 업데이트 완료
        } catch (error) {
            console.error("Error deactivating work:", error);
            return false;  // 오류 발생 시 false 반환
        }
    }
    
    async activeWorksSer(worksId: number): Promise<boolean> {
        try {
            // worksId로 게시글 조회
            const existingWork = await this.worksRepository.findOne({
                where: { id: worksId }
            });
    
            if (!existingWork) {
                return false; // 게시글이 존재하지 않으면 false 반환
            }
    
            // 게시글 상태를 active로 설정
            existingWork.status = 'active';  // 상태를 'active'로 변경
            existingWork.updated_at = new Date();  // 수정 시간 갱신
    
            // 업데이트된 게시글 저장
            await this.worksRepository.save(existingWork);
    
            return true;  // 성공적으로 업데이트 완료
        } catch (error) {
            console.error("Error activating work:", error);
            return false;  // 오류 발생 시 false 반환
        }
    }    
}