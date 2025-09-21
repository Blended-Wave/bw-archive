import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './users.service';
import { UserResponseDto } from './dto/user.dto';
import { CreateUserReqDto, UpdateUserReqDto } from './dto/user.info.dto';
import { response } from 'src/config/response';
import { status } from 'src/config/response.status';
import { BaseError } from 'src/config/error';
@Controller('artist')
export class ClinetUserController {
  constructor(private readonly userSerivce: UserService) {}

  @Get('all_artists')
  async getAllUsersAtClient(): Promise<object> {
    // 컨트롤러 메서드 이름은 중요하지않음
    return await this.userSerivce.getAllUsersAtClient();
  }
  @Get(':user_id')
  async getUserById(
    @Param('user_id') userId: number,
  ): Promise<UserResponseDto> {
    console.log('Requested user_id:', userId);
    return await this.userSerivce.getUserById(userId);
  }
  //로그인 및 인증 로직은 auth 도메인에서 다루고있음
}

@Controller('admin')
export class AdminUserController {
  constructor(private readonly userService: UserService) {}
  // 모든 유저 정보 조회
  @Get('users')
  async getAllUsersAtAdmin(): Promise<UserResponseDto[]> {
    return await this.userService.getAllUsersAtAdmin();
  }

  // 유저 상세 정보 조회 (수정 모달용)
  @Get('users/:user_id')
  async getUserByIdAtAdmin(
    @Param('user_id') userId: number,
  ): Promise<UserResponseDto> {
    return await this.userService.getUserByIdAtAdmin(userId);
  }

  // 유저 역할 조회(params)
  @Get('user_roles/:user_id')
  async getRoleIdByUserId(@Param('user_id') userId: number): Promise<number[]> {
      return await this.userService.getRoleIdByUserId(userId);
  }
  // 유저 정보 추가
  @Post('user_add')
  async postCreateUser(@Body() userReqDto: CreateUserReqDto): Promise<object> {
    return await this.userService.postCreateUser(userReqDto);
  }
  // 유저 정보 수정
  @Patch('user_modify/:user_id')
  async updateUserInfo(
    @Param('user_id') userId: number,
    @Body() userReqDto: UpdateUserReqDto,
  ): Promise<object> {
    try {
      return await this.userService.updateUserInfo(userId, userReqDto);
    } catch (err) {
      console.log('컨트롤러에서 발생한 에러입니다: ', err);
      throw new BaseError(status.USER_NOT_FOUND);
    }
  }
  // 유저 정보 삭제
  @Patch('delete_user/:user_id')
  async inactiveUser(@Param('user_id') userId: number): Promise<object> {
    try {
      return await this.userService.inactiveUser(userId);
    } catch (err) {
      console.log('컨트롤러에서 발생한 에러입니다: ', err);
      throw new BaseError(status.USER_NOT_FOUND);
    }
  }
  // 유저 삭제 취소
  @Patch('cancle_delete_user/:user_id')
  async activeUser(@Param('user_id') userId: number): Promise<object> {
    try {
      return await this.userService.activeUser(userId);
    } catch (err) {
      throw new BaseError(status.USER_NOT_FOUND);
    }
  }

  // 유저 정보 영구 삭제
  @Delete('hard_delete_user/:user_id')
  async hardDeleteUser(@Param('user_id') userId: number): Promise<object> {
    try {
      return await this.userService.hardDeleteUser(userId);
    } catch (err) {
      if (err instanceof BaseError) {
        throw err;
      }
      throw new BaseError(status.USER_NOT_FOUND);
    }
  }
}
