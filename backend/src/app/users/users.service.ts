import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {CreateUserDto} from './dto/create-user.dto'
import { ClinetUserDto } from './dto/client.user.dto';
import { UserEntity,UserRoleEntity,RoleEntity,UserAvatarEntity } from './entities';
import { BaseError } from 'src/config/error';
import { status } from 'src/config/response.status';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>, // <> 은 제네릭 타입
        @InjectRepository(UserRoleEntity)
        private userRoleRepository: Repository<UserRoleEntity>,
        @InjectRepository(RoleEntity)
        private RoleRepository: Repository<RoleEntity>,
        @InjectRepository(UserAvatarEntity)
        private userAvatarRepository: Repository<UserAvatarEntity>
    ) {}

    // Clinet User(Artist) Service
    async getRoleIdByUserId(userId:number):Promise<number[]> {
        try{
            const userRoles = await this.userRoleRepository.find({where:{user:{id:userId}} , relations: ['user', 'role'] });
            return userRoles.map(userRole => userRole.role.id);
        }catch (err){
            throw new BaseError(status.USER_ROLE_NOT_FOUND);
        }
    }
    
    async getAvatarUrlByUserId(userId:number):Promise<string> {
        const userAvatar = await this.userAvatarRepository.findOne({where:{user:{id:userId}}, relations: ['user']});
        if(!userAvatar){ //Avatar 가 없는 경우 에러 처리 대신 기본 아바타로 대체
            return 'default avatar';
        }
        return userAvatar.image_url;
    }

    async getAllUsersAtClient(): Promise<ClinetUserDto[]> {
        try{const users = await this.userRepository.find();
        const clientUserDtos: ClinetUserDto[] = [];
    
        for (const user of users) {
            const clientUserDto = new ClinetUserDto();
            clientUserDto.user_id = user.id;
            clientUserDto.nickname = user.nickname;
            clientUserDto.roles = await this.getRoleIdByUserId(user.id); // 비동기 작업이므로 await 사용
            clientUserDto.avatar = await this.getAvatarUrlByUserId(user.id);
            clientUserDtos.push(clientUserDto);
        }
    
        return clientUserDtos;}
        catch(err){
            throw new BaseError(status.USER_NOT_FOUND)
        }
    }



    async deleteUser(id: number): Promise<UserEntity> {
        const user = await this.userRepository.findOne({where: {id:id}});

        if (!user) {
          throw new BaseError(status.USER_NOT_FOUND);
        }
    
        user.status = 'inactive';
        return this.userRepository.save(user);
    }
    async createUserSeed(createUserDto: CreateUserDto): Promise<UserEntity> { //seeder 사용하는 경우
        const newUser = this.userRepository.create(createUserDto);
        return this.userRepository.save(newUser);
    }
}