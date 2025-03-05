import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository,  In, Not } from 'typeorm';
import { UserReqDto, CreateUserSeedDto, InstUserResponseDto } from './dto/user.info.dto'
import { UserResponseDto } from './dto/user.dto';
import { UserEntity, UserRoleEntity, RoleEntity, UserWorksEntity } from './entities';
import { BaseError } from 'src/config/error';
import { status } from 'src/config/response.status';
import { response } from 'src/config/response';
import * as bcrypt from 'bcrypt';
import { ArtistDto } from '../works/dto/works.dto';


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>, // <> 은 제네릭 타입
        @InjectRepository(UserRoleEntity)
        private userRoleRepository: Repository<UserRoleEntity>,
        @InjectRepository(RoleEntity)
        private roleRepository: Repository<RoleEntity>,
        @InjectRepository(UserWorksEntity)
        private userWorksRepository: Repository<UserWorksEntity>

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
    async getRoleNamesByIds(roleIds: number[]): Promise<string[]> {
        try {
            const roles = await this.roleRepository.findBy({
                id: In(roleIds) // findBy와 In을 사용하여 다중 ID 조회
            });
            return roles.map(role => role.name);
        } catch (err) {
            throw new BaseError(status.ROLE_NOT_FOUND);
        }
    }
    async getRoleNamesByUserId(userId: number): Promise<string[]> {
        const roleIds = await this.getRoleIdByUserId(userId);
        return await this.getRoleNamesByIds(roleIds);
    }
    
    

    async getAvatarUrlByUserId(userId: number): Promise<string> {
        const userAvatar = await this.userRepository.findOne({ where: { id: userId }});
        if (!userAvatar) { //Avatar 가 없는 경우 에러 처리 대신 기본 아바타로 대체
            return 'default avatar';
        }
        return userAvatar.avatar_url;
    }
    // Clinet User(Artist) Service

    async getAllUsersAtClient(): Promise<UserResponseDto[]> {
        try {
            const users = await this.userRepository.find();
            const clientUserDtos: UserResponseDto[] = [];

            for (const user of users) {
                const clientUserDto = new UserResponseDto();
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
    async getUserById(userId: number): Promise<UserResponseDto> {
        try {
            const user = await this.userRepository.findOneBy({ id: userId });
            const clientUserDto = new UserResponseDto();
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
    // works와 연관된 user 기능
    async getInstArtistSer(userId:number): Promise<InstUserResponseDto> {
            try {
                const userDto = new InstUserResponseDto();
                const user = await this.userRepository.findOneBy({id: userId});

                userDto.nickname = user?.nickname;
                userDto.instar_url = user?.instar_url;
                userDto.twitter_url = user?.twitter_url;
                userDto.roles = await this.getRoleIdByUserId(userId);

                return userDto;
            }catch(err) {
                throw new BaseError(status.USER_NOT_FOUND)
            }
    }
    async getMainArtistInfo(workId: number): Promise<ArtistDto> {
        // `user_works` 테이블에서 workId에 해당하는 record를 찾고, 관련된 user 정보를 가져온다
        const userWork = await this.userWorksRepository.findOne({
            where: { works: { id: workId }, is_main:true },  // works 테이블의 id를 통해 조회
            relations: ['user'],
        });
    
        if (!userWork) {
            throw new Error('Work not found or no user is associated with this work');
        }
    
        // user 정보 추출
        const { user } = userWork;
    
        // avatar_url 가져오기: 이제 user의 avatar_url을 직접 사용
        const avatarUrl = user.avatar_url;  // user.avatar_url로 바로 접근
    
        // nickname과 avatar_url을 포함한 ArtistDto 반환
        const artistDto = new ArtistDto();
        artistDto.nickname = user.nickname;
        artistDto.avatar_url = avatarUrl;
    
        return artistDto;
    }

    async getCreditsInfo(workId: number): Promise<ArtistDto[]> {
        // `user_works` 테이블에서 workId에 해당하는 record를 찾고, is_main이 false인 user들을 가져온다
        const userWorks = await this.userWorksRepository.find({
            where: {
                works: { id: workId },  // works 테이블의 id를 통해 조회
                is_main: false  // is_main이 false인 조건을 추가
            },
            relations: ['user'],  // user 관계만 로드
        });
    
        if (!userWorks || userWorks.length === 0) {
            throw new Error('No credits found for this work');
        }
    
        // Dto 배열을 생성
        const artistDtos: ArtistDto[] = userWorks.map(userWork => {
            const { user } = userWork;  // user 정보 추출
            const avatarUrl = user.avatar_url;  // avatar_url 직접 접근
            
            
            const artistDto = new ArtistDto();
            artistDto.nickname = user.nickname;
            artistDto.avatar_url = avatarUrl;
    
            return artistDto;
        });
    
        return artistDtos;
    }
    
    
    //admin
    async getAllUsersAtAdmin(): Promise<UserResponseDto[]> {
        try {
            const users = await this.userRepository.find();
            const adminUserDtos: UserResponseDto[] = [];
            
            for (const user of users) {
                const adminUserDto = new UserResponseDto();
                const { id, nickname, twitter_url, instar_url, status } = user;
                
                adminUserDto.user_id = id;
                adminUserDto.avatar_image_url = await this.getAvatarUrlByUserId(id);
                adminUserDto.nickname = nickname;
                adminUserDto.roles = await this.getRoleIdByUserId(id); // 비동기 작업이므로 await 사용
                adminUserDto.twitter_url = twitter_url;
                adminUserDto.instar_url = instar_url;
                adminUserDto.works_count = 0;
                // works 서비스 완성되면 count 값도 DB 연동
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
        console.log('userId:', userId);
        console.log('roles:', roles);
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
    
    
    async postCreateUser(userReqDto: UserReqDto): Promise<Object> {
        // 비밀번호 해시 처리
        let hashedPasswordUserInfo = { ...userReqDto };
        if (userReqDto.password) {
            const hashedPassword = await bcrypt.hash(userReqDto.password, 10);
            hashedPasswordUserInfo = {
                ...userReqDto,
                password: hashedPassword  // 새로운 객체에 암호화된 비밀번호 할당
            };
        }
    
        // login_id 중복 체크
        const existingUserByLoginId = await this.userRepository.findOne({
            where: { login_id: userReqDto.login_id }
        });
        if (existingUserByLoginId) {
            throw new BaseError(status.LOGIN_ID_ALREADY_EXIST);
        }
    
        // nickname 중복 체크
        const existingUserByNickname = await this.userRepository.findOne({
            where: { nickname: userReqDto.nickname }
        });
        if (existingUserByNickname) {
            throw new BaseError(status.NICKNAME_ALREADY_EXIST);
        }
    
        // 새로운 사용자 생성 및 저장
        const newUser = this.userRepository.create(hashedPasswordUserInfo);
        const savedUser = await this.userRepository.save(newUser);
    
        // 사용자 역할 연결
        let createdRoleConnections = await this.connectUserRole(savedUser.id, userReqDto.roles);
        createdRoleConnections = createdRoleConnections || [];  // 만약 역할 연결이 없으면 빈 배열 할당
    
        // 빈 배열을 처리하고 나서 map 호출
        const savedUserRoles = createdRoleConnections.map(userRole => userRole.role.id);
    
        return {
            created_user_info: savedUser,
            created_user_roles: savedUserRoles
        };
    }
    
    
    
    async updateUserInfo(userId: number, userReqDto: UserReqDto): Promise<Object> {
        const user = await this.getUserById(userId); // 정보 수정할 유저
        if (!user) {
            console.log('서비스에서 발생한 에러입니다.');
            throw new BaseError(status.USER_NOT_FOUND);
        }
        
        // login_id 중복 체크
        const existingUserByLoginId = await this.userRepository.findOne({
            where: { login_id: userReqDto.login_id, id: Not(userId) }  // 로그인 아이디 중복 체크 (자기 자신 제외)
        });
        if (existingUserByLoginId) {
            throw new BaseError(status.LOGIN_ID_ALREADY_EXIST);
        }
    
        // nickname 중복 체크
        const existingUserByNickname = await this.userRepository.findOne({
            where: { nickname: userReqDto.nickname, id: Not(userId) }  // nickname 중복 체크 (자기 자신 제외)
        });
        if (existingUserByNickname) {
            throw new BaseError(status.NICKNAME_ALREADY_EXIST);
        }
    
        // 입력받은 userDto에서 roles, avatar_image_url 추출 ⚠️ 추후 avatar_image_url 수정도 구현해야 함
        const { avatar_image_url, roles, ...userInfoWithoutRolesAvatar } = userReqDto;
        const updatedResult = await this.userRepository.update(userId, userInfoWithoutRolesAvatar);
    
        // 업데이트 결과 확인(수정 여부)
        if (updatedResult.affected === 0) {
            console.log('업데이트 된 행이 없습니다.');
            throw new BaseError(status.USER_UPDATE_FAILED);
        }
    
        // 업데이트된 유저 정보
        const updatedUser = await this.getUserById(userId);
    
        // user-role 관계 갱신
        const foundUserRoles = await this.userRoleRepository.find({
            where: { user: { id: userId } },
            relations: ['user', 'role']
        }); // 기존 user-role 관계 연결
        const roleIds = foundUserRoles.map(userRole => userRole.role.id); // 연결된 role 리스트
    
        // 기존 관계 테이블 유저-역할 연결 제거
        await this.unconnectUserRole(userId, roleIds);
    
        // 새로운 연결 생성
        const savedUserRoles = await this.connectUserRole(userId, userReqDto.roles);
    
        return {
            updated_user_info: updatedUser,
            created_user_roles: savedUserRoles,
        };
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