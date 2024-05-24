import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, CreateUserSeedDto } from './dto/create-user.dto'
import { UserDto } from './dto/user.dto';
import { UserEntity, UserRoleEntity, RoleEntity, UserAvatarEntity } from './entities';
import { BaseError } from 'src/config/error';
import { status } from 'src/config/response.status';
import { response } from 'src/config/response';

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
    ) { }
    // Global User Service
    async getRoleIdByUserId(userId: number): Promise<number[]> {
        try {
            const userRoles = await this.userRoleRepository.find({ where: { user: { id: userId } }, relations: ['user', 'role'] });
            return userRoles.map(userRole => userRole.role.id);
        } catch (err) {
            throw new BaseError(status.USER_ROLE_NOT_FOUND);
        }
    }

    async getAvatarUrlByUserId(userId: number): Promise<string> {
        const userAvatar = await this.userAvatarRepository.findOne({ where: { user: { id: userId } }, relations: ['user'] });
        if (!userAvatar) { //Avatar 가 없는 경우 에러 처리 대신 기본 아바타로 대체
            return 'default avatar';
        }
        return userAvatar.image_url;
    }
    // Clinet User(Artist) Service

    async getAllUsersAtClient(): Promise<UserDto[]> {
        try {
            const users = await this.userRepository.find();
            const clientUserDtos: UserDto[] = [];

            for (const user of users) {
                const clientUserDto = new UserDto();
                const {id, nickname,status} = user;

                clientUserDto.user_id = id;
                clientUserDto.nickname = nickname;
                clientUserDto.roles = await this.getRoleIdByUserId(id); // 비동기 작업이므로 await 사용
                clientUserDto.avatar_image_url = await this.getAvatarUrlByUserId(id);
                clientUserDto.status = status;
                clientUserDtos.push(clientUserDto);
            }

            return clientUserDtos;
        } catch (err) {
            throw new BaseError(status.USER_NOT_FOUND)
        }
    }
    async getUserAtClinet(userId: number): Promise<UserDto> {
        try {
            const user = await this.userRepository.findOne({ where: { id: userId } });
            const clientUserDto = new UserDto();
            const {id, nickname, twitter_url, instar_url, } = user; //가독성을 위한 구조분해 할당

            clientUserDto.user_id = id;
            clientUserDto.nickname = nickname;
            clientUserDto.roles = await this.getRoleIdByUserId(id);
            clientUserDto.twitter_url = twitter_url;
            clientUserDto.instar_url = instar_url;
            clientUserDto.works = [];
            return clientUserDto;
        } catch (err) {
            throw new BaseError(status.USER_NOT_FOUND)
        }
    }


    // async deleteUser(id: number): Promise<UserEntity> {  << ㅂ
    //     const user = await this.userRepository.findOne({where: {id:id}});

    //     if (!user) {
    //       throw new BaseError(status.USER_NOT_FOUND);
    //     }

    //     user.status = 'inactive';
    //     return this.userRepository.save(user);
    // }
    //admin
    async getAllUsersAtAdmin(): Promise<UserDto[]> {
        try {
            const users = await this.userRepository.find();
            const adminUserDtos: UserDto[] = [];
            
            for (const user of users) {
                const adminUserDto = new UserDto();
                const {id, nickname, twitter_url, instar_url, status} = user;

                adminUserDto.user_id = id;
                adminUserDto.avatar_image_url = await this.getAvatarUrlByUserId(id);
                adminUserDto.nickname = nickname;
                adminUserDto.roles = await this.getRoleIdByUserId(id); // 비동기 작업이므로 await 사용
                adminUserDto.twitter_url = twitter_url;
                adminUserDto.instar_url = instar_url;
                adminUserDto.works_count = 0;
                adminUserDto.status = status;
                adminUserDtos.push(adminUserDto);
            }

            return adminUserDtos;
        }
        catch (err) {
            throw new BaseError(status.USER_NOT_FOUND)
        }
    }
    async connectUserRole(userId: number, roles: number[]) {
        const userRolePromises = roles.map(async (role) => {
            const userRole = this.userRoleRepository.create({
                user: { id: userId },
                role: { id: role }
            });
            return this.userRoleRepository.save(userRole); //생성된 값들을 모두 userRoleParmises에 저장
        });

        const result = await Promise.all(userRolePromises); //모든 Promise를 기다리고 배열로 반환
        return result;
    }
    async postCreateUser(createUserDto: CreateUserDto): Promise<Object> {
        const newUser = this.userRepository.create(createUserDto);
        const savedUser = await this.userRepository.save(newUser);
        const createdRoleConnections = await this.connectUserRole(savedUser.id, createUserDto.roles);

        const savedUserRoles = createdRoleConnections.map(userRole=>userRole.role.id);

        return {
            created_user_info: savedUser,
            created_user_roles: savedUserRoles
        };
    }
    async updateUserInfo(updateUserDto) {

    }




    //seed
    async createUserSeed(createUserSeedDto: CreateUserSeedDto): Promise<Object> { //seeder 사용하는 경우
        const newUser = await this.userRepository.create(createUserSeedDto);
        return await this.userRepository.save(newUser);
    }
}