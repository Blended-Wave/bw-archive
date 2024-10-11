import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminWorksModule } from './admin/works/admin.works.module';
import { AdminUserModule } from './admin/users/admin.users.module';
import {UserModule} from './app/users/users.module'
import { TypeOrmModule } from '@nestjs/typeorm';
import * as session from 'express-session';
import * as passport from 'passport';
import RedisStore from 'connect-redis';
import * as redis from 'redis';
import * as ormconfig from './config/ormconfig'
import * as dotenv from 'dotenv';
import { APP_FILTER } from '@nestjs/core';
import { BaseErrorFilter } from './common/filters/base-error.filter';
import { AuthModule } from './app/auth/auth/auth.module';

const ENV_PATH = `src/config/.env.${process.env.NODE_ENV}`
dotenv.config({path: ENV_PATH}) 
console.log('REDIS_HOST:', process.env.REDIS_HOST);
console.log('REDIS_PORT:', process.env.REDIS_PORT);
console.log('SESSION_SECRET:', process.env.SESSION_SECRET);
@Module({
  imports: [AdminUserModule, 
            AdminWorksModule, 
            UserModule,
            AuthModule,
            TypeOrmModule.forRoot(ormconfig),],
  controllers: [AppController],
  providers: [
    AppService, 
    {
      provide: APP_FILTER, 
      useClass: BaseErrorFilter
    },],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer){
    const redisClient = redis.createClient({
      url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
    });

    redisClient.connect().catch(console.error);

    const redisStore = new RedisStore({
      client: redisClient
    })

    consumer
    .apply(
      session({ //세션 설정
        store: redisStore,
        secret: process.env.SESSION_SECRET, // 추후 Redis 도입
        resave: false,
        saveUninitialized: false,
        cookie: {
          secure:false,
          httpOnly: true, // 클라이언트 Javascript에서 쿠키 접근 불가
          maxAge: 24 * 60 * 60 * 1000, // 쿠키 유효기간 (밀리초 단위 - 24시간 기준)
          sameSite: 'lax' 
        }, // https를 쓸 경우 사용
      }),
      passport.initialize(), // passport초기화
      passport.session(), //passport 세션 관리
    ).forRoutes('*'); // 모든 루트에 대해 해당 미들웨어 적용
  }
}
