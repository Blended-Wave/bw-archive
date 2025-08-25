import { UserService } from './../users/users.service';
import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { WorkService } from "./works.service";
import { PagedWorksResponseDto, WorksDetailResponseDto, WorksReqDto, WorksResponseDto } from "./dto/works.dto";

@Controller('works')
export class WorksController {
    constructor(
        private readonly workService: WorkService,
        private readonly userService: UserService
    ) {}

    // 클라이언트에서 불러오는 works는 pub, pin, active 를 체크해야 함
    @Get('pub_works')
    async getPublicWorksCtr(@Query() query: any): Promise<WorksDetailResponseDto[]> {
        // const pinnedWorks = await this.workService.getPublicPinnedPubWorksSer(); // 고정 작품들
        let sortedWorks;

        // 필터 조건에 따라 조회수순 또는 시간순으로 정렬
        if (query.sort === 'view') {
            sortedWorks = await this.workService.getViewSortedPubWorksSer();
        } else {
            sortedWorks = await this.workService.getRecentSortedPubWorksSer();
        }

        return sortedWorks;
    }

    @Get('art_inst_works/:user_id')
    async getInstWorksCtr(@Param('user_id') userId: number): Promise<Object> {
        const imgList = await this.workService.getInstWorksSer(userId); // InstWorksDto[]
        const artistInfo = await this.userService.getInstArtistSer(userId); // Object
        return { imgList, artistInfo };
    }

    @Get('works_detail/:works_id')
    async getWorksDetail(@Param('works_id') worksId: number): Promise<WorksDetailResponseDto> {
        return await this.workService.getWorksDetailSer(worksId);
    }
}

@Controller('admin') // 로그인 여부 체크가 필요한 관리자 기능들
export class AdminWorksController {
    constructor(private readonly workService: WorkService) {}

    // 페이지네이션을 고려하여 모든 작품을 반환
    @Get('all_works')
    async getAllWorksCtr(
        @Query('page') page: number = 1, // 기본 페이지 값은 1
        @Query('pageSize') pageSize: number = 15, // 기본 페이지 사이즈는 15
    ): Promise<PagedWorksResponseDto> { // PagedWorksResponseDto 반환
        return await this.workService.getAllWorksSer(page, pageSize); // 페이지네이션 적용
    }

    // 작품 상세 정보를 불러오는 메서드
    @Get('load_work_info/:works_id')
    async getWorksInfoCtr(@Param('works_id') worksId: number): Promise<WorksReqDto> {
        return await this.workService.getWorksForEdit(worksId);
    }

    // 작품 추가
    @Post('add_works')
    async postWorksCtr(@Body() worksReqDto: WorksReqDto): Promise<boolean> {
        return await this.workService.postWorksSer(worksReqDto);
    }

    // 작품 수정
    @Patch('modify_works/:works_id')
    async patchWorksCtr(@Param('works_id') worksId: number, @Body() worksReqDto: WorksReqDto): Promise<boolean> {
        return await this.workService.patchWorksSer(worksId, worksReqDto);
    }

    // 작품 삭제 (비활성화 처리)
    @Patch('delete_works/:works_id')
    async deleteWorksCtr(@Param('works_id') worksId: number): Promise<boolean> {
        return await this.workService.inactiveWorksSer(worksId);
    }

    // 삭제 취소 (활성화 처리)
    @Patch('cancle_delete_works/:works_id')
    async cancleDeleteWorksCtr(@Param('works_id') worksId: number): Promise<boolean> {
        return await this.workService.activeWorksSer(worksId);
    }
}
