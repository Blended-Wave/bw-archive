import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { AdminWorksService } from "./admin.works.service";


@Controller('admin/works')
export class AdminWorksController {
    constructor(private readonly adminWorksSerivce: AdminWorksService) {}

    @Get()
    // /work로 오는 get요청을 처리하는 로직
    findAll():string {
        return 'Admin Works Controller';
    }
}