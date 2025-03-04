import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/app/users/entities';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
    ){}
    // 로그인 ID와 비밀번호 검사하고 유효성 확인(Local Strategy에서 사용)
    async validateUser(loginId:string, password: string): Promise<any> {
        console.log(`Finding user with loginId: ${loginId}`);
        const user = await this.userRepository.findOne({where: {login_id: loginId}});
        console.log('User found:', user);
        if (user && (await bcrypt.compare(password, user.password))) {
            const {password, ...result} = user; //user 객체에서 password를 뽑아내고 나머지는 result에 할당
            return result;
        }
        console.error(`Password mismatch for user: ${loginId}`);
        return null;
    }
    // 로그인 ID로 사용자 찾기
    async findUserByLoginId(loginId: string): Promise<UserEntity> {
        return this.userRepository.findOneBy({login_id: loginId});
    }
}
