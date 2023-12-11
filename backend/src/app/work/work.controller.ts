import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { WorkService } from "./work.service";

@Controller('work')
export class WorkController {
    constructor(private readonly workSerivce: WorkService) {}

    @Get()
    // /work로 오는 get요청을 처리하는 로직
    findAll() {}
}