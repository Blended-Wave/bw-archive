import { Controller, Req, Post, UseGuards, Get, Session, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Response } from 'express'; // Response 타입 명시적 지정
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  //로컬 전략으로 로그인
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Req() req: Request, @Res() res: Response) {
    // req.login은 passport 제공 메서드
    req.login(req.user, (err:any) => {
      if (err) {
        return res.status(500).json({message: 'Login Failed', error: err})
      }
      return res.json({ message: 'Login successful', user: req.user }); // 로그인 성공 메시지 반환
    });
  }
  @Get('protected') // 로그인 상태에 따라 다르게 응답하는 API
  async getProtectedData(@Req() req: Request, @Res() res: Response) {
    if (!req.isAuthenticated()) {
      // 로그인되지 않은 상태에서 접근할 경우
      return res.status(401).json({ message: 'Unauthorized, please login' });
    }
    return res.json({ message: 'Protected data' }); // 로그인된 상태일 때만 반환
  }

  @Get('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    req.logout((err: any) => {
      if (err) {
        return res.status(500).json({ message: 'Logout failed', error: err });
      }
      return res.json({ message: 'Logged out successfully' });
    });
  }
  //세션상태 확인
@Get('status')
async getAuthStatus(@Req() req: Request) {
  if (!req.isAuthenticated()) {
    return { isAuthenticated: false }; // 세션이 만료되었거나 로그인되지 않음
  }
  return { isAuthenticated: true, user: req.user }; // 인증된 상태
}

  @Get('profile') // 인증된 사용자의 프로필 정보를 반환 (안쓰일거같음)
  getProfile(@Req() req: Request) {
    if (req.isAuthenticated()) {
      return req.user;
    } else {
      return { message: 'Not authenticated' };
    }
  }
}
