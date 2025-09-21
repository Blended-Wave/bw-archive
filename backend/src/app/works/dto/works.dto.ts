import { IsOptional } from 'class-validator';
import { UserInfo } from 'src/app/users/users.service';

export class WorksReqDto {
  works_id?: number;
  thumb_url?: string;
  work_file_url?: string;
  title: string;
  description: string;
  type: 'image' | 'video';
  series: string;
  main_artist: string;
  credits: string[];
  private_option: boolean;
  pinned_option: boolean;
  status?: 'active' | 'inactive';
  datetime?: string;
}

export class UpdateWorksReqDto {
  title: string;
  description: string;
  type: 'image' | 'video';
  series: string;
  main_artist: string;
  credits: string[];
  private_option: boolean;
  pinned_option: boolean;
}

export class WorksResponseDto {
  works_id: number;
  thumbnail_url: string;
  file_url?: string; // 본문 파일 URL (optional)
  type: string;
  private_option: boolean;
}

export class WorksDetailResponseDto {
  works_id: number;
  thumbnail_url: string;
  type: string;
  title: string;
  series?: string;
  created_at: Date;
  views: number;
  status: string;
  private_option: boolean;
  pinned_option: boolean;
  main_artist: ArtistDto;
  credits: ArtistDto[];
  description?: string;
  file_url?: string;
}

export class InstWorksResponseDto {
  imgList: WorksResponseDto[];
  artistInfo: UserInfo;
}

export class ArtistDto {
  constructor(nickname: string, avatar_url?: string, id?: number) {
    this.nickname = nickname;
    this.avatar_url = avatar_url;
    this.id = id;
  }
  nickname: string;
  avatar_url?: string;
  id?: number;
}

export class PagedWorksResponseDto {
  works: WorksDetailResponseDto[];
  totalCount: number;
}
