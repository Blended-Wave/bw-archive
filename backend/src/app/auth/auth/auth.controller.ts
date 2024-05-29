import { Controller, Request, Post, UseGuards, Get, Session, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Response } from 'express'; // Response 타입 명시적 지정

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  //로컬 전략으로 로그인
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req, @Res() res: Response) {
    req.login(req.user, (err) => {
      if (err) {
        throw err;
      }
      return res.json({ message: 'Login successful' }); // 로그인 성공 메시지 반환
    });
  }

  @Get('logout')
  logout(@Request() req, @Res() res: Response) {
    req.logout((err: any) => {
      if (err) {
        return res.status(500).json({ message: 'Logout failed', error: err });
      }
      return res.json({ message: 'Logged out' });
    });
  }
  //세션상태 확인
  @Get('status')
  status(@Session() session: Record<string, any>) {
    return session;
  }
  @Get('profile')
  getProfile(@Request() req) {
    if (req.isAuthenticated()) {
      return req.user;
    } else {
      return { message: 'Not authenticated' };
    }
  }
}
