// src/seeder.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UserService } from './app/users/users.service';
import { CreateUserDto } from './app/users/create-user.dto';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userService = app.get(UserService);
  const users: CreateUserDto[] = [
    { login_id: 'test', password:'test', nickname:'test',  twitterUrl: null, instarUrl: null,},
  ];

  for (const user of users) {
    await userService.createUser(user);
  }

  await app.close();
}

bootstrap();
