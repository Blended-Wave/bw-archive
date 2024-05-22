import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { UserController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity,RoleEntity, UserRoleEntity,UserAvatarEntity} from './entities';
@Module({
    imports: [TypeOrmModule.forFeature([UserEntity,RoleEntity, UserRoleEntity,UserAvatarEntity])] ,
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}
