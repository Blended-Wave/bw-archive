import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Not } from 'typeorm';
import {
  CreateUserSeedDto,
  InstUserResponseDto,
  CreateUserReqDto,
  UpdateUserReqDto,
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

export interface UserInfo {
  name: string;
  roles: string[];
  instarUrl?: string;
  twitterUrl?: string;
  works: {
    works_id: number;
    file_url: string;
    thumbnail_url: string;
    type: string;
    private_option: boolean;
  }[];
}

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
    private fileUploadService: FileUploadService,
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

  async getAllUsersAtClient(): Promise<object> {
    const allUsers = await this.userRepository.find({
      where: { status: 'active' },
    });

    const usersInfo = await Promise.all(
      allUsers.map(async (user) => {
        const { id, nickname, status: userStatus, avatar_url } = user;
        const roles = await this.getRoleIdByUserId(id);
        const works_count = await this.userWorksRepository.count({
          where: { user: { id: id } },
        });
        return {
          user_id: id,
          nickname,
          roles,
          status: userStatus,
          works_count: works_count,
          avatar_url, // Add avatar_url to the response
        };
      }),
    );
    return response(status.SUCCESS, usersInfo);
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

  async getUserInfo(userId: number): Promise<UserInfo> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['user_roles.role', 'user_works.works.works_file'],
    });

    if (!user) {
      throw new BaseError(status.USER_NOT_FOUND);
    }

    const activeWorks = user.user_works
      .map((uw) => uw.works)
      .filter(
        (work) =>
          work &&
          work.status === 'active' &&
          work.private_option === 0 &&
          !!work.works_file, // 파일 존재
      )
      .map((work) => ({
        works_id: work.id,
        file_url: work.works_file.file_url, // 본문 파일 URL
        thumbnail_url: work.thumb_url, // 썸네일(폴백용)
        type: work.works_file.type,
        private_option: work.private_option === 1,
      }));

    // 역할 이름을 영어로 변환하는 매핑 (DB 테이블 기준)
    const roleNameMapping: { [key: string]: string } = {
      '일러스트레이터': 'ILLUSTRATOR',
      '애니메이터': 'ANIMATOR',
      '작곡': 'COMPOSER', 
      '작가': 'WRITER'
    };

    return {
      name: user.nickname,
      roles: user.user_roles.map((ur) => roleNameMapping[ur.role.name] || ur.role.name),
      instarUrl: user.instar_url,
      twitterUrl: user.twitter_url,
      works: activeWorks,
    };
  }

  async getUserByIdAtAdmin(userId: number): Promise<UserResponseDto> {
    try {
      const user = await this.userRepository.findOneBy({ id: userId }); // status와 관계없이 유저 조회
      if (!user) {
        throw new BaseError(status.USER_NOT_FOUND);
      }

      const adminUserDto = new UserResponseDto();
      const {
        id,
        nickname,
        twitter_url,
        instar_url,
        status: userStatus,
      } = user;

      adminUserDto.user_id = id;
      adminUserDto.avatar_image_url = await this.getAvatarUrlByUserId(id);
      adminUserDto.nickname = nickname;
      adminUserDto.roles = await this.getRoleIdByUserId(id);
      adminUserDto.twitter_url = twitter_url;
      adminUserDto.instar_url = instar_url;
      adminUserDto.works_count = await this.userWorksRepository.count({
        where: { user: { id: id } },
      });
      adminUserDto.status = userStatus;

      return adminUserDto;
    } catch (err) {
      if (err instanceof BaseError) {
        throw err;
      }
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
  async getMainArtistInfo(works_id: number): Promise<ArtistDto> {
    const userWork = await this.userWorksRepository.findOne({
      where: { works: { id: works_id }, is_main: 1 },
      relations: ['user'],
    });
    if (userWork) {
      const nickname = userWork.user.nickname;
      const artistDto = new ArtistDto(nickname);
      return artistDto;
    }
    return null;
  }

  async getCreditsInfo(works_id: number): Promise<ArtistDto[]> {
    const userWorks = await this.userWorksRepository.find({
      where: { works: { id: works_id }, is_main: 0 },
      relations: ['user'],
    });

    const artistDtos = userWorks.map((userWork) => {
      const nickname = userWork.user.nickname;
      const artistDto = new ArtistDto(nickname);
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
          const {
            id,
            nickname,
            twitter_url,
            instar_url,
            status: userStatus,
          } = user;

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

          adminUserDto.status = userStatus;

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

  async postCreateUser(userReqDto: CreateUserReqDto): Promise<object> {
    // 비밀번호 해시 처리
    const hashedPasswordUserInfo = { ...userReqDto };
    if (userReqDto.password) {
      const hashedPassword = await bcrypt.hash(userReqDto.password, 10);
      hashedPasswordUserInfo.password = hashedPassword; // 복사된 객체의 비밀번호만 교체
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

    // 사용자 역할 연결 (roles가 없는 경우를 대비하여 기본값으로 빈 배열 사용)
    const rolesToConnect = userReqDto.roles || [];
    let createdRoleConnections = await this.connectUserRole(
      savedUser.id,
      rolesToConnect,
    );
    createdRoleConnections = createdRoleConnections || []; // 만약 역할 연결이 없으면 빈 배열 할당

    // 빈 배열을 처리하고 나서 map 호출
    const savedUserRoles = createdRoleConnections.map(
      (userRole) => userRole.role.id,
    );

    return response(status.CREATE_SUCCESS, {
      created_user_info: savedUser,
      created_user_roles: savedUserRoles,
    });
  }

  async updateUserInfo(
    userId: number,
    userReqDto: UpdateUserReqDto,
  ): Promise<object> {
    const user = await this.userRepository.findOneBy({ id: userId }); // 정보 수정할 유저 직접 조회
    if (!user) {
      console.log('서비스에서 발생한 에러입니다.');
      throw new BaseError(status.USER_NOT_FOUND);
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

    return response(status.SUCCESS, {
      updated_user_info: updatedUser,
      created_user_roles: savedUserRoles,
    });
  }

  async inactiveUser(userId: number): Promise<object> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new BaseError(status.USER_NOT_FOUND);
    }

    // S3에서 아바타 이미지 삭제 (실제 S3 URL인 경우만)
    if (user.avatar_url && user.avatar_url.startsWith('https://')) {
      try {
        await this.fileUploadService.deleteFileFromS3(user.avatar_url);
      } catch (error) {
        console.error('아바타 삭제 실패, 계속 진행:', error.message);
        // S3 삭제 실패해도 사용자 비활성화는 계속 진행
      }
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

  async hardDeleteUser(userId: number): Promise<object> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new BaseError(status.USER_NOT_FOUND);
    }
    // S3에 아바타 이미지가 있다면 삭제 (실제 S3 URL인 경우만)
    if (user.avatar_url && user.avatar_url.startsWith('https://')) {
      try {
        await this.fileUploadService.deleteFileFromS3(user.avatar_url);
      } catch (error) {
        console.error('아바타 삭제 실패, 계속 진행:', error.message);
        // S3 삭제 실패해도 사용자 삭제는 계속 진행
      }
    }

    // 사용자와 관련된 자식 레코드들 삭제
    await this.userWorksRepository.delete({ user: { id: userId } });
    await this.userRoleRepository.delete({ user: { id: userId } });

    // 사용자 삭제
    await this.userRepository.delete({ id: userId });

    return response(status.SUCCESS, {});
  }

  //seed
  async createUserSeed(createUserSeedDto: CreateUserSeedDto): Promise<object> {
    //seeder 사용하는 경우
    const newUser = await this.userRepository.create(createUserSeedDto);
    return await this.userRepository.save(newUser);
  }

  /*
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
  */
}
