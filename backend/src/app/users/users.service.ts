import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepositry: Repository<UserEntity>, // <> 은 제네릭 타입
    ) {}

    findAll() : Promise<UserEntity[]> { //Promise + Generic 문법 공부 필요, UserEntites 자리에 User가 들어가야 하는지 그대로 둬도 되는지 확인필요
        return this.userRepositry.find(); 
    }
}