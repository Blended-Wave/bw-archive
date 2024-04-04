import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { AdminUserService } from "./admin.users.service";

@Controller('admin/user')
export class AdminUserController {
    constructor(private readonly userSerivce: AdminUserService) {}

    @Get()
    // /user로 오는 get요청을 처리하는 로직
    findAll() {}
}