import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { UserService } from "./users.service";

@Controller('user')
export class UserController {
    constructor(private readonly userSerivce: UserService) {}

    @Get()
    // /user로 오는 get요청을 처리하는 로직
    findAll() {}
}