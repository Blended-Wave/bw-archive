import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AdminWorksController, WorksController } from './works.controller';
import { WorkService } from './works.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  RoleEntity,
  UserEntity,
  UserRoleEntity,
  UserWorksEntity,
} from '../users/entities';
import { SeriesEntity, WorksEntity, WorksFileEntity } from './entities';
import { UserModule } from '../users/users.module';
import { AuthMiddleware } from 'src/common/middlewares/AuthMiddleware';
import { FileUploadModule } from '../file-upload/file-upload.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      WorksEntity,
      WorksFileEntity,
      SeriesEntity,
      UserWorksEntity,
      UserRoleEntity,
      RoleEntity,
    ]),
    UserModule,
    FileUploadModule,
  ],
  controllers: [WorksController, AdminWorksController],
  providers: [WorkService],
})
export class WorksModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(AdminWorksController);
  }
}
