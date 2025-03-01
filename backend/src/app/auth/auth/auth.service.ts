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

    async findUserByLoginId(loginId: string): Promise<UserEntity> {
        return this.userRepository.findOneBy({login_id: loginId});
    }
}
