import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { AdminUserController, ClinetUserController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity,RoleEntity, UserRoleEntity, UserWorksEntity} from './entities';
@Module({
    imports: [TypeOrmModule.forFeature([UserEntity,RoleEntity, UserRoleEntity, UserWorksEntity])] ,
    controllers: [ClinetUserController, AdminUserController],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule {}
