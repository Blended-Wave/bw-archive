import { IsOptional } from 'class-validator';

export class WorksResponseDto {
    works_id: number;
    thumb_url: string;
}


export class ArtistDto{
    id: number;
    avatar_url: string;
    nickname: string;

    constructor(nickname?: string, avatar_url?: string) {
        this.nickname = nickname;
        if (avatar_url) {  // avatar_url이 있으면 값을 할당
            this.avatar_url = avatar_url;
        }
    }
}

export class WorksDetailResponseDto {
    works_id: number;
    thumb_url: string | null; // 이문법맞냐
    type: string;  // type이 video냐 img에 따라 렌더링할 태그가 다름
    file_url: string;
    title: string;
    description?: string;
    series?: string;
    created_at: Date; //??
    views: number;
    main_artist: ArtistDto;
    credits: ArtistDto[];
    // 이 응답값을 화면에 렌더링할 일은 없지만 관리자 페이지에서 수정할 때, 사용가능
    pinned?: boolean; 
    private?: boolean;
    status?: boolean; 
}

export class PagedWorksResponseDto {
    data: WorksDetailResponseDto[]; // 페이지에 해당하는 데이터 목록
    totalCount: number; // 전체 데이터 개수
    totalPages: number; // 전체 페이지 수
    currentPage: number; // 현재 페이지 번호
    pageSize: number; // 한 페이지 당 데이터 개수
}


export class InstWorksResponseDto {
    image_url: string;
}

export class WorksReqDto {
    works_id: number;
    @IsOptional()
    thumb_url?: string | null; // 이문법맞냐
    type: string;  // type이 video냐 img에 따라 렌더링할 태그가 다름
    file_url: string;
    title: string;
    description: string;
    series: string;
    main_artist: ArtistDto // id만 받는게 맞는거같은데 쓰이는 곳 한번 확인해보자
    @IsOptional()
    credits?: ArtistDto[]
    pinned: boolean; 
    private: boolean;
}