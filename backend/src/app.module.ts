import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminWorksModule } from './admin/works/admin.works.module';
import { AdminUserModule } from './admin/users/admin.users.module';
import { ConfigModule } from '@nestjs/config'; // process.env.NODE_ENV === 'prod' 에 삼항연산자를 통해 애플리케이션 모드에 따라서 다른 env파일을 불러오도록 한다
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './app/users/entities/user.entity';
@Module({
  imports: [AdminUserModule, AdminWorksModule, 
            ConfigModule.forRoot( {isGlobal:true , envFilePath: `src/config/.env.${process.env.NODE_ENV}`} ),
            TypeOrmModule.forRoot({ //host와 password는 외부에 알려지면 안됨, env설정
              type: 'mysql',
              host: process.env.DATABASE_HOST, // 로컬환경에서는 localhost 또는 외부 데이터베이스 서버의 IP주소 또는 도메인 이름
              port: +process.env.DATABASE_PORT,
              username: process.env.DATABASE_USERNAME,
              password: process.env.DATABASE_PASSWORD,
              database: process.env.DATABASE_DB,
              entities: [UserEntity],
              synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',  // 앱 실행 시 스키마 자동 생성 및 동기화 옵션, 개발 환경에서만 켜둘것
            }),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
