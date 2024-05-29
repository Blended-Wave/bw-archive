import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true , logger: ['error', 'warn', 'log', 'debug']  });
  
  app.setGlobalPrefix('api');	// <- global prefix

  await app.listen(4000);
}
bootstrap();