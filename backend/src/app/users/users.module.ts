import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { AdminUserController, ClinetUserController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity,RoleEntity, UserRoleEntity,UserAvatarEntity} from './entities';
@Module({
    imports: [TypeOrmModule.forFeature([UserEntity,RoleEntity, UserRoleEntity,UserAvatarEntity])] ,
    controllers: [ClinetUserController, AdminUserController],
    providers: [UserService],
})
export class UserModule {}
