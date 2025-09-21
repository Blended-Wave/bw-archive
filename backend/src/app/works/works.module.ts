import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { WorksController, AdminWorksController } from './works.controller';
import { WorkService } from './works.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorksEntity, WorksFileEntity, SeriesEntity } from './entities';
import { UserModule } from '../users/users.module';
import { FileUploadModule } from '../file-upload/file-upload.module';
import { UserEntity, UserWorksEntity } from '../users/entities';
import { AuthMiddleware } from 'src/common/middlewares/AuthMiddleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WorksEntity,
      WorksFileEntity,
      SeriesEntity,
      UserEntity,
      UserWorksEntity,
    ]),
    UserModule,
    FileUploadModule,
  ],
  controllers: [WorksController, AdminWorksController],
  providers: [WorkService],
  exports: [WorkService],
})
export class WorksModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(AdminWorksController);
  }
}
