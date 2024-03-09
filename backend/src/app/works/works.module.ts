import { Module } from '@nestjs/common';
import { WorkController } from './works.controller';
import { WorkService } from './works.service';
@Module({
    controllers: [WorkController],
    providers: [WorkService],
})
export class WorkModule {}
