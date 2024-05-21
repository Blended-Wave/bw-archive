import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import {CreateUserDto} from '../users/create-user.dto'
@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>, // <> 은 제네릭 타입
    ) {}

    async deleteUser(id: number): Promise<UserEntity> {
        const user = await this.userRepository.findOne({where: {id:id}});

        if (!user) {
          throw new Error('❎ User not found');
        }
    
        user.status = 'inactive';
        return this.userRepository.save(user);
    }
    async createUser(createUserDto: CreateUserDto): Promise<UserEntity> { //seeder 사용하는 경우
        const newUser = this.userRepository.create(createUserDto);
        return this.userRepository.save(newUser);
    }
}
    
        // findAll() : Promise<UserEntity[]> { //Promise + Generic 문법 공부 필요, UserEntites 자리에 User가 들어가야 하는지 그대로 둬도 되는지 확인필요
        //     return this.userRepository.find(); 
        // }