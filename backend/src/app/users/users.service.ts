import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {CreateUserDto} from './dto/create-user.dto'
import { ClinetUserDto } from './dto/client.user.dto';
import { UserEntity,UserRoleEntity,RoleEntity } from './entities';
@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>, // <> 은 제네릭 타입
        @InjectRepository(UserRoleEntity)
        private userRoleRepository: Repository<UserRoleEntity>,
        @InjectRepository(RoleEntity)
        private RoleRepository: Repository<RoleEntity>
    ) {}

    async getRoleIdByUserId(userId:number):Promise<number[]> {
        const userRoles = await this.userRoleRepository.find({where:{user:{id:userId}} , relations: ['user', 'role'] });
        return userRoles.map(userRole => userRole.role.id);
    }
    

    async findAll(): Promise<ClinetUserDto[]> {
        const users = await this.userRepository.find();
        const clientUserDtos: ClinetUserDto[] = [];
    
        for (const user of users) {
            const clientUserDto = new ClinetUserDto();
            clientUserDto.user_id = user.id;
            clientUserDto.nickname = user.nickname;
            clientUserDto.roles = await this.getRoleIdByUserId(user.id); // 비동기 작업이므로 await 사용
            clientUserDtos.push(clientUserDto);
        }
    
        return clientUserDtos;
    }

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