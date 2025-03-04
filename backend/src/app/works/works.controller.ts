import { UserService } from './../users/users.service';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { WorkService } from "./works.service";
import { InstWorksResponseDto, WorksDetailResponseDto, WorksReqDto, WorksResponseDto } from "./dto/works.dto";
import { TreeRepositoryUtils } from "typeorm";

//try-catch 적용해서 에러 처리는 한번에 지피티한테

@Controller('works')
export class WorksController {
    constructor(
        private readonly workService: WorkService,
        private readonly userService: UserService
    ) {}
    // client 단에서 불러오는 works는 pub, pin, active 를 체크해야함
    @Get('pub_works')
    async getPublicWorksCtr(@Query() query:any): Promise<WorksResponseDto[]> {
        const pinnedWorks = await this.workService.getPublicPinnedPubWorksSer(); // 고정 작품들은 반드시 시간순으로 배치
        let sortedWorks;
        
        // 그 외 작품들은 필터 조건에 따라 조회수순 or 시간순으로 정렬
        if (query.sort === 'view') {
            sortedWorks = await this.workService.getViewSortedPubWorksSer();
        } else {
            sortedWorks = await this.workService.getRecentSortedPubWorksSer();
        }
        
        const result = [...pinnedWorks, ...sortedWorks];

        return result;
    }
    @Get('art_inst_works/:user_id')
    async getInstWorksCtr(@Param('user_id') userId : number): Promise<Object> {
        const imgList = await this.workService.getInstWorksSer(userId); // userId로 검색한 InstWorksDto[]
        const artistInfo = await this.userService.getInstArtistSer(userId); // Object값 한개
        const result = { imgList, artistInfo }

        return result;
    }

    @Get('works_detail/:works_id')
    async getWorksDetail(@Param('works_id') worksId : number) : Promise<WorksDetailResponseDto> {
        return await this.workService.getWorksDetailSer(worksId);
    }
}

@Controller('admin') // 로그인 여부 체크 필요한 기능들
export class AdminWorksController {
    constructor(private readonly workService: WorkService) {}

    @Get('all_works')
    async getAllWorksCtr(): Promise<WorksDetailResponseDto[]> {
        return await this.workService.getAllWorksSer(); // 페이지네이션이 필요할까?
    }
    @Get('load_work_info/:works_id')
    async getWorksInfoCtr(@Param('works_id') worksId:number): Promise<WorksReqDto> {
        return await this.workService.getWorksForEdit(worksId);
    }
    @Post('add_works')
    async postWorksCtr(@Body() worksReqDto : WorksReqDto): Promise<boolean> {
        return await this.workService.postWorksSer(worksReqDto);;
    }
    @Patch('modify_works/:works_id')
    async patchWorksCtr(@Param('works_id') worksId : number, @Body() worksReqDto: WorksReqDto) : Promise<boolean>{
        return await this.workService.patchWorksSer(worksId, worksReqDto);;
    } 
    @Patch('delete_works/:works_id')
    async deleteWorksCtr(@Param('works_id') worksId : number, ) : Promise<boolean>{
        return await this.workService.inactiveWorksSer(worksId);
    }
    @Patch('cancle_delete_works/:works_id')
    async cancleDeleteWorksCtr(@Param('works_id') worksId : number) : Promise<boolean>{
        return await this.workService.activeWorksSer(worksId);
    }
}