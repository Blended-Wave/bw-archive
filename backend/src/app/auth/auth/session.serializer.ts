import { Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { AuthService } from "./auth.service";


@Injectable()
export class SessionSerializer extends PassportSerializer {
    // 세션에 사용자 정보를 직렬화, 역직렬화
    constructor(private readonly authService: AuthService){
        super();
    }
    serializeUser(user: any, done: (err:Error, user:any)=>void):void {
        done(null, user.login_id);
    } // 로그인 성공 시 사용자의 login_id를 세션에 저장

    async deserializeUser(loginId: any, done: (err: Error, user: any) => void): Promise<void> {
        const user = await this.authService.findUserByLoginId(loginId);
        done(null, user);
      } // 세션에 저장된 login_iid를 사용하여 사용자 정보를 불러온다
}