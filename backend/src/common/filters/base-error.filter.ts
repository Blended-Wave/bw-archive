import { HttpException, HttpStatus, Catch, ArgumentsHost } from '@nestjs/common';
import { BaseError } from '../../config/error'; // 사용자 정의 에러 클래스

@Catch(BaseError)
export class BaseErrorFilter {
  catch(exception: BaseError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      message: exception.message,
    });
  }
}
