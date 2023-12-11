import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');	// <- global prefix

  
  // CORS 설정 옵션 정의
  const corsOptions: CorsOptions = {
    origin: true, // 모든 origin을 허용하거나, 특정 origin을 지정
    methods: 'GET, PUT, POST, DELETE', // 허용할 HTTP 메서드
    credentials: true, // 쿠키 등 인증 정보를 전송할 수 있도록 허용
  };

  // CORS 미들웨어를 적용
  app.enableCors(corsOptions);

  await app.listen(4000);
}
bootstrap();
