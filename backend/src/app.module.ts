import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminWorkModule } from './admin/work/admin.work.module';
import { AdminUserModule } from './admin/user/admin.user.module';

@Module({
  imports: [AdminUserModule, AdminWorkModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
