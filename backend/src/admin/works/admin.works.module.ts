import { Module } from '@nestjs/common';
import { AdminWorksService } from './admin.works.service';
import { AdminWorksController } from './admin.works.controller';
@Module({
    controllers: [AdminWorksController],
    providers: [AdminWorksService],
})
export class AdminWorksModule {}
