//더미 유저 데이터 생성용 DTO (seed로 새 유저 생성 가능)
export class CreateUserSeedDto {
    login_id: string;
    password: string;
    nickname: string;
    twitterUrl: string | null;
    instarUrl: string | null;
  }

// user 추가 시 Req Dto
export class CreateUserReqDto {
  readonly login_id: string;
  readonly password: string;
  readonly nickname: string;
  readonly roles: number[];
  readonly avatar_image_url?: string;
  readonly twitter_url?: string;
  readonly instar_url?: string;
}

// user 수정 시 Req Dto
export class UpdateUserReqDto {
    readonly nickname: string;
    readonly roles: number[];
    readonly avatar_image_url?: string;
    readonly twitter_url?: string;
    readonly instar_url?: string;
}

export class userStatusDto {
  readonly status: string;
}

export class InstUserResponseDto {
  nickname: string;
  twitter_url: string | null;
  instar_url: string | null;
  roles: number[];
}