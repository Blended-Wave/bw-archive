export class UserResponseDto {
    user_id: number;
    avatar_image_url: string;
    nickname: string;
    roles : number[];
    twitter_url: string;
    instar_url: string;
    works: Object[]; // ? 아마 instruction 때문인듯한데 쓸일없을거같은데.. 
    works_count: number;
    status: string;
}