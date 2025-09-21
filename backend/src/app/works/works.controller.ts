import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { WorkService } from './works.service';
import { WorksReqDto, UpdateWorksReqDto } from './dto/works.dto';
import { response } from 'src/config/response';
import { status } from 'src/config/response.status';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('works')
export class WorksController {
  constructor(private readonly workService: WorkService) {}

  @Get('/pinned')
  async getPublicPinnedPubWorksCtr() {
    return response(
      status.SUCCESS,
      await this.workService.getPublicPinnedPubWorksSer(),
    );
  }

  @Get('/sorted_by_view')
  async getViewSortedPubWorksCtr() {
    return response(
      status.SUCCESS,
      await this.workService.getViewSortedPubWorksSer(),
    );
  }

  @Get('/recent')
  async getRecentSortedPubWorksCtr() {
    return response(
      status.SUCCESS,
      await this.workService.getRecentSortedPubWorksSer(),
    );
  }

  @Get('/detail/:workId')
  async getWorksDetailCtr(@Param('workId') workId: number) {
    return response(
      status.SUCCESS,
      await this.workService.getWorksDetailSer(workId),
    );
  }

  @Get('/artist/:userId')
  async getInstWorksCtr(@Param('userId') userId: number) {
    const { imgList, artistInfo } = await this.workService.getInstWorksSer(userId);
    return response(status.SUCCESS, { imgList, artistInfo });
  }
}

@Controller('admin')
export class AdminWorksController {
  constructor(private readonly workService: WorkService) {}

  @Get('all_works')
  async getAllWorksCtr(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 15,
  ) {
    return response(
      status.SUCCESS,
      await this.workService.getAllWorks(page, limit),
    );
  }

  @Post('works_add')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'thumbnail', maxCount: 1 },
      { name: 'workFile', maxCount: 1 },
    ]),
  )
  async createWork(
    @Body() worksReqDto: WorksReqDto,
    @UploadedFiles()
    files: {
      thumbnail?: Express.Multer.File[];
      workFile?: Express.Multer.File[];
    },
  ) {
    return response(
      status.CREATE_SUCCESS,
      await this.workService.postWorksSer(worksReqDto, files),
    );
  }

  @Get('works_modify/:worksId')
  async getWorkForEdit(@Param('worksId') worksId: number) {
    const workData = await this.workService.getWorksForEdit(worksId);
    return response(status.SUCCESS, workData);
  }

  @Patch('works_modify/:worksId')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'thumbnail', maxCount: 1 },
      { name: 'workFile', maxCount: 1 },
    ]),
  )
  async modifyWork(
    @Param('worksId') worksId: number,
    @Body() updateWorksReqDto: UpdateWorksReqDto,
    @UploadedFiles()
    files: {
      thumbnail?: Express.Multer.File[];
      workFile?: Express.Multer.File[];
    },
  ) {
    return response(
      status.SUCCESS,
      await this.workService.modifyWork(worksId, updateWorksReqDto, files),
    );
  }

  @Patch('works_status/:works_id')
  async patchWorksStatus(@Param('works_id') works_id: number) {
    return await this.workService.patchWorksStatus(works_id);
  }

  @Delete('hard_delete_work/:works_id')
  async hardDeleteWork(@Param('works_id') works_id: number) {
    return await this.workService.hardDeleteWork(works_id);
  }
}
