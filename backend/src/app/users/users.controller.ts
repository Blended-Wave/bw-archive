import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { UserService } from "./users.service";
import { ClinetUserDto } from "./dto/client.user.dto";

@Controller('artists')
export class UserController {
    constructor(private readonly userSerivce: UserService) {}

    @Get()
    async findAll(): Promise<ClinetUserDto[]> {
        return await this.userSerivce.findAll();
    }
}