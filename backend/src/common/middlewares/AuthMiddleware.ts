import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

//요청 처리 전에 인증 여부를 검사하여 인증되지 않은 사용자는 아예 해당 요청을 처리하지 못하도록 차단하는 역할 (status는 상태를 사용자에게 반환하는 역할)
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Passport.js의 isAuthenticated()를 사용하여 인증 상태 확인
    if (req.isAuthenticated()) {
      return next(); // 인증된 경우, 다음 미들웨어로 진행
    }
    // 인증되지 않은 경우, 401 상태 반환
    return res.status(401).json({ message: 'Unauthorized, please login' });
  }
}