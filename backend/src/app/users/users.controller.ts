import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { UserService } from "./users.service";
import { UserDto } from "./dto/user.dto";

@Controller('artist')
export class ClinetUserController {
    constructor(private readonly userSerivce: UserService) {}

    @Get('all_artists')
    async getAllUsersAtClient(): Promise<UserDto[]> { // 컨트롤러 메서드 이름은 중요하지않음
        return await this.userSerivce.getAllUsersAtClient();
    }
    @Get(':user_id')
    async getUserAtClinet(@Param('user_id') userId:number): Promise<UserDto> {
        console.log('요청 받은 user_id:', userId);
        return await this.userSerivce.getUserAtClinet(userId);
    }
}

@Controller('admin')
export class AdminUserController{
    constructor(private readonly userService: UserService) {}

    @Get('users')
    async getAllUsersAtAdmin(): Promise<UserDto[]> {
        return await this.userService.getAllUsersAtAdmin();
    }
}