import { HttpException, HttpStatus, Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { BaseError } from '../../config/error'; // 사용자 정의 에러 클래스

@Catch(BaseError)
export class BaseErrorFilter implements ExceptionFilter {
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

// 데이터베이스 연결 오류 처리를 위한 전역 예외 필터
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = '서버 내부 오류가 발생했습니다.';

    // 데이터베이스 연결 오류 처리
    if (exception.code === 'ECONNRESET' || exception.code === 'ECONNREFUSED') {
      status = HttpStatus.SERVICE_UNAVAILABLE;
      message = '데이터베이스 연결 오류입니다. 잠시 후 다시 시도해주세요.';
      console.error('Database connection error:', exception);
    }
    // TypeORM QueryFailedError 처리
    else if (exception.name === 'QueryFailedError') {
      if (exception.driverError?.code === 'ECONNRESET') {
        status = HttpStatus.SERVICE_UNAVAILABLE;
        message = '데이터베이스 연결이 끊어졌습니다. 잠시 후 다시 시도해주세요.';
      }
      console.error('Database query error:', exception);
    }
    // HTTP 예외 처리
    else if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    }
    // 인증 오류 처리
    else if (exception.status === 401 || exception.status === 403) {
      status = exception.status;
      message = '인증이 필요합니다. 다시 로그인해주세요.';
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
    });
  }
}
