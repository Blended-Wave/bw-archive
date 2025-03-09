import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AdminWorksController, WorksController } from './works.controller';
import { WorkService } from './works.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity, UserEntity, UserRoleEntity, UserWorksEntity } from '../users/entities';
import { SeriesEntity, WorksEntity, WorksFileEntity } from './entities';
import { UserService } from '../users/users.service';
import { AuthMiddleware } from 'src/common/middlewares/AuthMiddleware';
@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity, WorksEntity, WorksFileEntity, SeriesEntity, UserWorksEntity, UserRoleEntity, RoleEntity])
    ], 
    controllers: [WorksController, AdminWorksController],
    providers: [WorkService, UserService],
})
export class WorksModule {
    configure(consumer: MiddlewareConsumer) {
            consumer
                .apply(AuthMiddleware)
                .forRoutes(AdminWorksController);  // Admin User Controller에만 미들웨어 적용
    }
}
