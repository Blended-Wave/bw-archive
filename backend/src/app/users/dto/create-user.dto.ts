//더미 유저 데이터 생성용 DTO (seed로 새 유저 생성 가능)
export class CreateUserDto {
    login_id: string;
    password: string;
    nickname: string;
    twitterUrl: string | null;
    instarUrl: string | null;
  }