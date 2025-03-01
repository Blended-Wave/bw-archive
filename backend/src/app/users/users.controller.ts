import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { UserService } from "./users.service";
import { UserDto } from "./dto/user.dto";
import { UserInfoDto } from "./dto/user.info.dto";
import { response } from "src/config/response";
import { status } from "src/config/response.status";
import { BaseError } from "src/config/error";
@Controller('artist')
export class ClinetUserController {
    constructor(private readonly userSerivce: UserService) {}

    @Get('all_artists')
    async getAllUsersAtClient(): Promise<UserDto[]> { // 컨트롤러 메서드 이름은 중요하지않음
        return await this.userSerivce.getAllUsersAtClient();
    }
    @Get(':user_id')
    async getUserById(@Param('user_id') userId:number): Promise<UserDto> {
        console.log('요청 받은 user_id:', userId);
        return await this.userSerivce.getUserById(userId);
    }
    //@Post() 로그인 구현
}

@Controller('admin')
export class AdminUserController{
    constructor(private readonly userService: UserService) {}

    @Get('users')
    async getAllUsersAtAdmin(): Promise<UserDto[]> {
        return await this.userService.getAllUsersAtAdmin();
    }
    @Post('user_add')
    async postCreateUser(@Body() userInfoDto: UserInfoDto):Promise<Object> {
        return response(status.CREATE_SUCCESS, await this.userService.postCreateUser(userInfoDto))
    }
    @Patch('user_modify/:user_id')
    async updateUserInfo(@Param('user_id') userId:number, @Body() userInfoDto: UserInfoDto) : Promise<Object> {
        try{
            return await this.userService.updateUserInfo(userId, userInfoDto);
        }catch (err){
            console.log('컨트롤러에서 발생한 에러입니다: ', err);
            throw new BaseError(status.USER_NOT_FOUND);
        }
    }
    @Patch('user_delete/:user_id')
    async inactiveUser(@Param('user_id') userId:number)
    :Promise<Object>{
        try {
            return await this.userService.inactiveUser(userId);
        }catch (err){
            console.log('컨트롤러에서 발생한 에러입니다: ', err);
            throw new BaseError(status.USER_NOT_FOUND);
        }
    };
    @Patch('user_delete_cancle/:user_id')
    async activeUser(@Param('user_id') userId:number)
    :Promise<Object>{
        try {
            return await this.userService.activeUser(userId);
        }catch (err){
            console.log('컨트롤러에서 발생한 에러입니다: ', err);
            throw new BaseError(status.USER_NOT_FOUND);
        }
    };
}