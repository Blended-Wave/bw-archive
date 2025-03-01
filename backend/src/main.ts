import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['error', 'warn', 'log', 'debug']  });
  
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true, // 쿠키를 포함한 요청 허용
  })

  app.setGlobalPrefix('api');	// <- global prefix

  await app.listen(4000);
}
bootstrap();