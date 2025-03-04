import { Module } from '@nestjs/common';
import { WorksController } from './works.controller';
import { WorkService } from './works.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity, UserWorksEntity } from '../users/entities';
import { SeriesEntity, ThumbnailEntity, WorksEntity, WorksFileEntity } from './entities';
import { UserService } from '../users/users.service';
@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity, WorksEntity, WorksFileEntity, ThumbnailEntity, SeriesEntity, UserWorksEntity])
    ], 
    controllers: [WorksController],
    providers: [WorkService, UserService],
})
export class WorksModule {}
