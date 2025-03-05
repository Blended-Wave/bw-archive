import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UserService } from './users.service';
import { AdminUserController, ClinetUserController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity,RoleEntity, UserRoleEntity, UserWorksEntity} from './entities';
import { AuthMiddleware } from 'src/common/middlewares/AuthMiddleware';
@Module({
    imports: [TypeOrmModule.forFeature([UserEntity,RoleEntity, UserRoleEntity, UserWorksEntity])] ,
    controllers: [ClinetUserController, AdminUserController],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule {
    // configure(consumer: MiddlewareConsumer) {
    //     consumer
    //         .apply(AuthMiddleware)
    //         .forRoutes(AdminUserController);  // Admin User Controller에만 미들웨어 적용
    // }
}
