import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { AdminWorkService } from "./admin.work.service";


@Controller('admin/work')
export class AdminWorkController {
    constructor(private readonly adminWorkSerivce: AdminWorkService) {}

    @Get()
    // /work로 오는 get요청을 처리하는 로직
    findAll():string {
        return 'Admin Work Controller';
    }
}