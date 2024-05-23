import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { UserService } from "./users.service";
import { ClinetUserDto } from "./dto/client.user.dto";

@Controller('artists')
export class UserController {
    constructor(private readonly userSerivce: UserService) {}

    @Get()
    async getAllUsersAtClient(): Promise<ClinetUserDto[]> { // 컨트롤러 메서드 이름은 중요하지않음
        return await this.userSerivce.getAllUsersAtClient();
    }
}