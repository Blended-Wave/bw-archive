import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['error', 'warn', 'log', 'debug']  });
  
  app.enableCors({
    origin: process.env.NODE_ENV === 'production' 
      ? ['http://3.36.166.34', 'http://localhost:3000'] // EC2 IP 허용
      : 'http://localhost:3000',
    credentials: true, // 쿠키를 포함한 요청 허용
  })

  app.setGlobalPrefix('api');	// <- global prefix

  await app.listen(4000);
}
bootstrap();