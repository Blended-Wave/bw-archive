import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Not } from 'typeorm';
import {
  UserReqDto,
  CreateUserSeedDto,
  InstUserResponseDto,
} from './dto/user.info.dto';
import { UserResponseDto } from './dto/user.dto';
import {
  UserEntity,
  UserRoleEntity,
  RoleEntity,
  UserWorksEntity,
} from './entities';
import { BaseError } from 'src/config/error';
import { status } from 'src/config/response.status';
import { response } from 'src/config/response';
import * as bcrypt from 'bcrypt';
import { ArtistDto } from '../works/dto/works.dto';
import { FileUploadService } from '../file-upload/file-upload.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(UserRoleEntity)
    private userRoleRepository: Repository<UserRoleEntity>,
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
    @InjectRepository(UserWorksEntity)
    private userWorksRepository: Repository<UserWorksEntity>,
    private fileUploadService: FileUploadService
  ) {}
  // Global User Service
  async getRoleIdByUserId(userId: number): Promise<number[]> {
    console.log(`  -> getRoleIdByUserId called for user: ${userId}`);
    const userRoles = await this.userRoleRepository.find({
      where: { user: { id: userId } },
      relations: ['role'],
    });

    if (!userRoles || userRoles.length === 0) {
      console.log(`  -> No roles found for user: ${userId}. Returning [].`);
      return [];
    }

    // userRole.role이 null이 아닌 경우에만 id를 매핑하여 데이터 무결성 문제를 방지
    const roles = userRoles
      .filter((userRole) => {
        if (!userRole.role) {
          console.warn(
            `  -> Found a userRole entry with a null role for user: ${userId}. Skipping.`,
          );
          return false;
        }
        return true;
      })
      .map((userRole) => userRole.role.id);

    console.log(
      `  -> Found roles for user ${userId}: ${JSON.stringify(roles)}`,
    );
    return roles;
  }
  async getRoleNamesByIds(roleIds: number[]): Promise<string[]> {
    try {
      const roles = await this.roleRepository.findBy({
        id: In(roleIds), // findBy와 In을 사용하여 다중 ID 조회
      });
      return roles.map((role) => role.name);
    } catch (err) {
      throw new BaseError(status.ROLE_NOT_FOUND);
    }
  }
  async getRoleNamesByUserId(userId: number): Promise<string[]> {
    const roleIds = await this.getRoleIdByUserId(userId);
    return await this.getRoleNamesByIds(roleIds);
  }

  async getAvatarUrlByUserId(userId: number): Promise<string> {
    console.log(`  -> getAvatarUrlByUserId called for user: ${userId}`);
    const user = await this.userRepository.findOne({ where: { id: userId } });
    // 사용자가 없거나 avatar_url이 null 또는 undefined인 경우 기본 아바타 반환
    if (!user || !user.avatar_url) {
      console.log(
        `  -> No user or avatar_url found for user: ${userId}. Returning 'default avatar'.`,
      );
      return 'default avatar';
    }
    console.log(`  -> Found avatar_url for user ${userId}: ${user.avatar_url}`);
    return user.avatar_url;
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
      throw new BaseError(status.USER_NOT_FOUND);
    }
  }
  async getUserById(userId: number): Promise<UserResponseDto> {
    try {
      const user = await this.userRepository.findOneBy({ id: userId });
      const clientUserDto = new UserResponseDto();
      const { id, nickname, twitter_url, instar_url } = user; //가독성을 위한 구조분해 할당

      clientUserDto.user_id = id;
      clientUserDto.nickname = nickname;
      clientUserDto.roles = await this.getRoleIdByUserId(id);
      clientUserDto.twitter_url = twitter_url;
      clientUserDto.instar_url = instar_url;
      clientUserDto.works = [];
      return clientUserDto;
    } catch (err) {
      throw new BaseError(status.USER_NOT_FOUND);
    }
  }
  // works와 연관된 user 기능
  async getInstArtistSer(userId: number): Promise<InstUserResponseDto> {
    try {
      const userDto = new InstUserResponseDto();
      const user = await this.userRepository.findOneBy({ id: userId });

      userDto.nickname = user?.nickname;
      userDto.instar_url = user?.instar_url;
      userDto.twitter_url = user?.twitter_url;
      userDto.roles = await this.getRoleIdByUserId(userId);

      return userDto;
    } catch (err) {
      throw new BaseError(status.USER_NOT_FOUND);
    }
  }
  async getMainArtistInfo(workId: number): Promise<ArtistDto | null> {
    // `user_works` 테이블에서 workId에 해당하는 record를 찾고, 관련된 user 정보를 가져온다
    const userWork = await this.userWorksRepository.findOne({
      where: { works: { id: workId }, is_main: 1 }, // works 테이블의 id를 통해 조회
      relations: ['user'],
    });

    if (!userWork) {
      return null; // 정보가 없으면 에러 대신 null 반환
    }

    // user 정보 추출
    const { user } = userWork;

    // avatar_url 가져오기: 이제 user의 avatar_url을 직접 사용
    const avatarUrl = user.avatar_url; // user.avatar_url로 바로 접근

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
        works: { id: workId }, // works 테이블의 id를 통해 조회
        is_main: 0, // is_main이 false인 조건을 추가
      },
      relations: ['user'], // user 관계만 로드
    });

    if (!userWorks || userWorks.length === 0) {
      return []; // 정보가 없으면 에러 대신 빈 배열 반환
    }

    // Dto 배열을 생성
    const artistDtos: ArtistDto[] = userWorks.map((userWork) => {
      const { user } = userWork; // user 정보 추출
      const avatarUrl = user.avatar_url; // avatar_url 직접 접근

      const artistDto = new ArtistDto();
      artistDto.nickname = user.nickname;
      artistDto.avatar_url = avatarUrl;

      return artistDto;
    });

    return artistDtos;
  }

  //admin
  async getAllUsersAtAdmin(): Promise<UserResponseDto[]> {
    console.log('--- Debugging getAllUsersAtAdmin ---');
    try {
      const users = await this.userRepository.find();
      console.log(`Found ${users.length} users.`);
      const adminUserDtos: UserResponseDto[] = [];

      for (const user of users) {
        try {
          console.log(
            `Processing user ID: ${user.id}, Nickname: ${user.nickname}`,
          );
          const adminUserDto = new UserResponseDto();
          const { id, nickname, twitter_url, instar_url, status } = user;

          adminUserDto.user_id = id;

          const avatarUrl = await this.getAvatarUrlByUserId(id);
          adminUserDto.avatar_image_url = avatarUrl;

          adminUserDto.nickname = nickname;

          const roles = await this.getRoleIdByUserId(id);
          adminUserDto.roles = roles;

          adminUserDto.twitter_url = twitter_url;
          adminUserDto.instar_url = instar_url;

          const worksCount = await this.userWorksRepository.count({
            where: { user: { id: id } },
          });
          adminUserDto.works_count = worksCount;

          adminUserDto.status = status;

          console.log(` -> Successfully created DTO for user ${id}`);
          adminUserDtos.push(adminUserDto);
        } catch (err) {
          console.error(
            `!!! FAILED to process user ID: ${user.id}, Nickname: ${user.nickname} !!!`,
          );
          console.error('Error details:', err);
        }
      }

      console.log('--- Finished processing all users. ---');
      console.log(`Returning ${adminUserDtos.length} user DTOs.`);
      return adminUserDtos;
    } catch (err) {
      console.error('--- A critical error occurred in getAllUsersAtAdmin ---');
      console.error(err);
      throw new BaseError(status.USER_NOT_FOUND);
    }
  }
  async connectUserRole(userId: number, roles: number[]) {
    console.log('userId:', userId);
    console.log('roles:', roles);
    const userRolePromises = roles.map(async (role) => {
      const userRole = this.userRoleRepository.create({
        user: { id: userId },
        role: { id: role },
      });
      return this.userRoleRepository.save(userRole); //생성된 값들을 모두 userRoleParmises에 저장
    });

    const result = await Promise.all(userRolePromises); //모든 Promise를 기다리고 배열로 반환
    return result;
  }
  async unconnectUserRole(userId: number, roles: number[]) {
    for (const roleId of roles) {
      const target = await this.userRoleRepository.findOne({
        where: { user: { id: userId }, role: { id: roleId } },
      });
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
        password: hashedPassword, // 새로운 객체에 암호화된 비밀번호 할당
      };
    }

    // login_id 중복 체크
    const existingUserByLoginId = await this.userRepository.findOne({
      where: { login_id: userReqDto.login_id },
    });
    if (existingUserByLoginId) {
      throw new BaseError(status.LOGIN_ID_ALREADY_EXIST);
    }

    // nickname 중복 체크
    const existingUserByNickname = await this.userRepository.findOne({
      where: { nickname: userReqDto.nickname },
    });
    if (existingUserByNickname) {
      throw new BaseError(status.NICKNAME_ALREADY_EXIST);
    }

    // 새로운 사용자 생성 및 저장
    const newUser = this.userRepository.create(hashedPasswordUserInfo);
    const savedUser = await this.userRepository.save(newUser);

    // 사용자 역할 연결
    let createdRoleConnections = await this.connectUserRole(
      savedUser.id,
      userReqDto.roles,
    );
    createdRoleConnections = createdRoleConnections || []; // 만약 역할 연결이 없으면 빈 배열 할당

    // 빈 배열을 처리하고 나서 map 호출
    const savedUserRoles = createdRoleConnections.map(
      (userRole) => userRole.role.id,
    );

    return {
      created_user_info: savedUser,
      created_user_roles: savedUserRoles,
    };
  }

  async updateUserInfo(
    userId: number,
    userReqDto: UserReqDto,
  ): Promise<Object> {
    const user = await this.getUserById(userId); // 정보 수정할 유저
    if (!user) {
      console.log('서비스에서 발생한 에러입니다.');
      throw new BaseError(status.USER_NOT_FOUND);
    }

    // login_id 중복 체크
    const existingUserByLoginId = await this.userRepository.findOne({
      where: { login_id: userReqDto.login_id, id: Not(userId) }, // 로그인 아이디 중복 체크 (자기 자신 제외)
    });
    if (existingUserByLoginId) {
      throw new BaseError(status.LOGIN_ID_ALREADY_EXIST);
    }

    // nickname 중복 체크
    const existingUserByNickname = await this.userRepository.findOne({
      where: { nickname: userReqDto.nickname, id: Not(userId) }, // nickname 중복 체크 (자기 자신 제외)
    });
    if (existingUserByNickname) {
      throw new BaseError(status.NICKNAME_ALREADY_EXIST);
    }

    const { roles, ...userInfoWithoutRoles } = userReqDto;
    const updatedResult = await this.userRepository.update(
      userId,
      userInfoWithoutRoles,
    );

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
      relations: ['user', 'role'],
    }); // 기존 user-role 관계 연결
    const roleIds = foundUserRoles.map((userRole) => userRole.role.id); // 연결된 role 리스트

    // 기존 관계 테이블 유저-역할 연결 제거
    await this.unconnectUserRole(userId, roleIds);

    // 새로운 연결 생성
    const savedUserRoles = await this.connectUserRole(userId, userReqDto.roles);

    return {
      updated_user_info: updatedUser,
      created_user_roles: savedUserRoles,
    };
  }

  async inactiveUser(userId: number): Promise<object> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new BaseError(status.USER_NOT_FOUND);
    }

    // S3에서 아바타 이미지 삭제
    if (user.avatar_url) {
      await this.fileUploadService.deleteFileFromS3(user.avatar_url);
    }

    user.status = 'inactive';
    await this.userRepository.save(user);
    return response(status.SUCCESS, {});
  }
  async activeUser(userId: number): Promise<object> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new BaseError(status.USER_NOT_FOUND);
    }
    user.status = 'active';
    await this.userRepository.save(user);
    return response(status.SUCCESS, {});
  }

  //seed
  async createUserSeed(createUserSeedDto: CreateUserSeedDto): Promise<Object> {
    //seeder 사용하는 경우
    const newUser = await this.userRepository.create(createUserSeedDto);
    return await this.userRepository.save(newUser);
  }

  async getAllUsers(): Promise<any> {
    const allUsersWithDuplicates = await this.userRepository.find();
    // 사용자 ID를 기준으로 중복 데이터를 제거합니다.
    const allUsers = [...new Map(allUsersWithDuplicates.map(user => [user.id, user])).values()];

    const result = await Promise.all(
      allUsers.map(async (user) => {
        const roles = await this.getRoleIdByUserId(user.id);
        // ... (rest of the function)
      })
    );
  }
}
