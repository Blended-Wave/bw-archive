import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserInfoDto, CreateUserSeedDto } from './dto/user.info.dto'
import { UserDto } from './dto/user.dto';
import { UserEntity, UserRoleEntity, RoleEntity, UserAvatarEntity } from './entities';
import { BaseError } from 'src/config/error';
import { status } from 'src/config/response.status';
import { response } from 'src/config/response';
import * as bcrypt from 'bcrypt';


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
                const { id, nickname, status } = user;

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
    async getUserById(userId: number): Promise<UserDto> {
        try {
            const user = await this.userRepository.findOneBy({ id: userId });
            const clientUserDto = new UserDto();
            const { id, nickname, twitter_url, instar_url, } = user; //가독성을 위한 구조분해 할당

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

    //admin
    async getAllUsersAtAdmin(): Promise<UserDto[]> {
        try {
            const users = await this.userRepository.find();
            const adminUserDtos: UserDto[] = [];
            
            for (const user of users) {
                const adminUserDto = new UserDto();
                const { id, nickname, twitter_url, instar_url, status } = user;
                
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
    async unconnectUserRole(userId: number, roles: number[]) {
        for (const roleId of roles) {
            const target = await this.userRoleRepository.findOne({ where: { user: { id: userId }, role: { id: roleId } } });
            if (!target) {
                throw new BaseError(status.USER_ROLE_NOT_FOUND);
            }
            await this.userRoleRepository.remove(target);
        }
    }
    
    
    async postCreateUser(userInfoDto: UserInfoDto): Promise<Object> {
        // 비밀번호 해시 처리
        let hashedPasswordUserInfo = { ...userInfoDto };
        if (userInfoDto.password){
            const hashedPassword = await bcrypt.hash(userInfoDto.password, 10);
            hashedPasswordUserInfo = {
                ...userInfoDto,
                password: hashedPassword
            }
        }
        
        // 새로운 사용자 생성 및 저장
        const newUser = this.userRepository.create(hashedPasswordUserInfo);
        const savedUser = await this.userRepository.save(newUser);
        // 사용자 역할 연결
        const createdRoleConnections = await this.connectUserRole(savedUser.id, userInfoDto.roles);
        const savedUserRoles = createdRoleConnections.map(userRole => userRole.role.id);
        
        return {
            created_user_info: savedUser,
            created_user_roles: savedUserRoles
        };
    }
    
    async updateUserInfo(userId: number, userInfoDto: UserInfoDto): Promise<Object> {
        const user = await this.getUserById(userId); // 정보 수정할 유저
        if (!user) {
            console.log('서비스에서 발생한 에러입니다.');
            throw new BaseError(status.USER_NOT_FOUND);
        }
        // 입력받은 userDto에서 roles, avatar_image_url추출 ⚠️ 추후 avatar_image_url 수정도 구현 해야함
        const { avatar_image_url, roles, ...userInfoWithoutRolesAvatar } = userInfoDto;
        const updatedResult = await this.userRepository.update(userId, userInfoWithoutRolesAvatar);
        //업데이트 결과 확인(수정여부)
        if (updatedResult.affected === 0){
            console.log('업데이트 된 행이 없습니다.');
            throw new BaseError(status.USER_UPDATE_FAILED);
        }
        // 업데이트된 유저 정보
        const updatedUser = await this.getUserById(userId);
        
        // uesr - role 관계 갱신
        const foundUserRoles = await this.userRoleRepository.find({ where: { user: { id: userId } }, relations: ['user', 'role'] }); //기존 user-role 관계 연결
        const roleIds = foundUserRoles.map(userRole => userRole.role.id); // 연결된 role 리스트
        
        // 기존 관계 테이블 유저-역할 연결 제거
        await this.unconnectUserRole(userId, roleIds);
        // 새로운 연결 생성
        const savedUserRoles = await this.connectUserRole(userId, userInfoDto.roles);
        
        
        return {
            updated_user_info: updatedUser,
            created_user_roles: savedUserRoles,
        }
    }
    
    async inactiveUser(userId: number): Promise<string>{
        const user = await this.userRepository.findOneBy({id:userId});
        user.status = 'inactive';  
        await this.userRepository.save(user); 

        return user.status;
    }
    async activeUser(userId: number): Promise<string>{
        const user = await this.userRepository.findOneBy({id:userId});
        user.status = 'active';   
        await this.userRepository.save(user);

        return user.status;
    }
    
    
    //seed
    async createUserSeed(createUserSeedDto: CreateUserSeedDto): Promise<Object> { //seeder 사용하는 경우
        const newUser = await this.userRepository.create(createUserSeedDto);
        return await this.userRepository.save(newUser);
    }
}