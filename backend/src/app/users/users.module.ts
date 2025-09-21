import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserService } from './users.service';
import { AdminUserController, ClinetUserController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  UserEntity,
  RoleEntity,
  UserRoleEntity,
  UserWorksEntity,
} from './entities';
import { AuthMiddleware } from 'src/common/middlewares/AuthMiddleware';
import { FileUploadModule } from '../file-upload/file-upload.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      RoleEntity,
      UserRoleEntity,
      UserWorksEntity,
    ]),
    FileUploadModule,
  ],
    controllers: [ClinetUserController, AdminUserController],
    providers: [UserService],
  exports: [UserService],
})
export class UserModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(AdminUserController);
    }
}
