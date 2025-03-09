//더미 유저 데이터 생성용 DTO (seed로 새 유저 생성 가능)
export class CreateUserSeedDto {
    login_id: string;
    password: string;
    nickname: string;
    twitterUrl: string | null;
    instarUrl: string | null;
  }

// user 추가 시 Req Dto
export class UserReqDto {
  readonly login_id: string;
  readonly password: string;
  readonly user_id: number; // 이건.. 왜있지(아직 쓰이는곳 없어보임)
  readonly avatar_image_url: string;
  readonly nickname: string;
  readonly roles: number[];
  readonly twitter_url: string;
  readonly instar_url: string;
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