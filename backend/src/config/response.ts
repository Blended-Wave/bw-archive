//매개변수와 반환 값에 대한 타입 명시적 지정(명확한 코드 작성을 위함)
import { Status as ResponseParams } from './response.status';
export interface ResponseObject {
  status: number;
  isSuccess: boolean;
  code: string | number;
  message: string;
  result: any;
}

export const response = (
  { status, isSuccess, code, message }: ResponseParams,
  result: any,
): ResponseObject => {
  return {
    status: status,
    isSuccess: isSuccess,
    code: code,
    message: message,
    result: result,
  };
};
