import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { WorkService } from "./works.service";

@Controller('work')
export class WorksController {
    constructor(private readonly workSerivce: WorkService) {}

    @Get()
    // /work로 오는 get요청을 처리하는 로직
    findAll() {}
}