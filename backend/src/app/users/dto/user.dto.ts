export class UserDto {
    user_id: number;
    avatar_image_url: string;
    nickname: string;
    roles : number[];
    twitter_url: string;
    instar_url: string;
    works: Object[];
    works_count: number;
    status: string;
}