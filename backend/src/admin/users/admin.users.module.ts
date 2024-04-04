import { Module } from '@nestjs/common';
import { AdminUserService } from './admin.users.service';
import { AdminUserController } from './admin.users.controller';


@Module({
    controllers: [AdminUserController],
    providers: [AdminUserService],
})
export class AdminUserModule {}
