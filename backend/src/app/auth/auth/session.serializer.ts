import { Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { AuthService } from "./auth.service";


@Injectable()
export class SessionSerializer extends PassportSerializer {
    constructor(private readonly authService: AuthService){
        super();
    }
    serializeUser(user: any, done: (err:Error, user:any)=>void):void {
        done(null, user.login_id);
    }

    async deserializeUser(loginId: any, done: (err: Error, user: any) => void): Promise<void> {
        const user = await this.authService.findUserByLoginId(loginId);
        done(null, user);
      }
}