import { Module } from '@nestjs/common';
import { AdminWorkService } from './admin.work.service';
import { AdminWorkController } from './admin.work.controller';
@Module({
    controllers: [AdminWorkController],
    providers: [AdminWorkService],
})
export class AdminWorkModule {}
