// src/seeder.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UserService } from './app/users/users.service';
import { CreateUserDto } from './app/users/dto/create-user.dto';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userService = app.get(UserService);
  const users: CreateUserDto[] = [
    { login_id: 'test2', password:'test2', nickname:'test2',  twitterUrl: null, instarUrl: null,},
  ];

  for (const user of users) {
    await userService.createUserSeed(user);
  }

  await app.close();
}

bootstrap();
