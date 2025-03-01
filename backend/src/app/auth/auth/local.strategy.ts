import { AuthService } from './auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    // passport 로컬 인증 전략 구현
    constructor(private authService: AuthService) {
        super({
            usernameField: 'login_id',
            passwordField: 'password'
        });
    }

    async validate(loginId: string, password: string) : Promise<any> {
        console.log(`Validating user: ${loginId}`);
        const user = await this.authService.validateUser(loginId, password);
        if(!user) {
            console.error(`Authentication failed for user: ${loginId}`);
            throw new UnauthorizedException('Invalid login credentials');
        }
        console.log(`User validated successfully: ${loginId}`);
    return user;
    }
}