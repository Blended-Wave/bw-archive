//더미 유저 데이터 생성용 DTO (seed로 새 유저 생성 가능)
export class CreateUserSeedDto {
    login_id: string;
    password: string;
    nickname: string;
    twitterUrl: string | null;
    instarUrl: string | null;
  }

export class UserInfoDto {
  readonly login_id: string;
  readonly password: string;
  readonly user_id: number;
  readonly avatar_image_url: string;
  readonly nickname: string;
  readonly roles: number[];
  readonly twitter_url: string;
  readonly instar_url: string;
}

export class userStatusDto {
  readonly status: string;
}