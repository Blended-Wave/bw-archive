import { StatusCodes } from "http-status-codes";

//명시적으로 타입 지정
interface Status {
    status: number; //상태코드
    isSuccess: boolean; //성공여부
    code: string | number;
    message: string;
}
// {[key:string]: Status} -> Key는 문자열, Value는 Status타입이라는 뜻
export const status: {[key:string]: Status} = {
    //success
    SUCCESS: {status:StatusCodes.ACCEPTED, isSuccess: true, code: 2000, message: "success!"},

    // error
    // common err
    INTERNAL_SERVER_ERROR: { status: StatusCodes.INTERNAL_SERVER_ERROR, isSuccess: false, code: "COMMON000", message: "서버 에러, 관리자에게 문의 바랍니다." },
    BAD_REQUEST: { status: StatusCodes.BAD_REQUEST, isSuccess: false, code: "COMMON001", message: "잘못된 요청입니다." },
    UNAUTHORIZED: { status: StatusCodes.UNAUTHORIZED, isSuccess: false, code: "COMMON002", message: "권한이 잘못되었습니다." },
    METHOD_NOT_ALLOWED: { status: StatusCodes.METHOD_NOT_ALLOWED, isSuccess: false, code: "COMMON003", message: "지원하지 않는 Http Method 입니다." },
    FORBIDDEN: { status: StatusCodes.FORBIDDEN, isSuccess: false, code: "COMMON004", message: "금지된 요청입니다." },
    NOT_FOUND: { status: StatusCodes.NOT_FOUND, isSuccess: false, code: "COMMON005", message: "요청한 페이지를 찾을 수 없습니다. 관리자에게 문의 바랍니다." },

    // db error
    PARAMETER_IS_WRONG: { status: StatusCodes.BAD_REQUEST, isSuccess: false, code: "DB001", message: "잘못된 파라미터입니다." },
    EMAIL_ALREADY_EXIST: { status: StatusCodes.BAD_REQUEST, isSuccess: false, code: "DB002", message: "중복된 이메일이 있습니다." },
    
    // member err
    MEMBER_NOT_FOUND: { status: StatusCodes.BAD_REQUEST, isSuccess: false, code: "MEMBER4001", message: "사용자가 없습니다." },
    NICKNAME_NOT_EXIST: { status: StatusCodes.BAD_REQUEST, isSuccess: false, code: "MEMBER4002", message: "닉네임은 필수입니다." },
    
    // article err
    ARTICLE_NOT_FOUND: { status: StatusCodes.NOT_FOUND, isSuccess: false, code: "ARTICLE4001", message: "게시글이 없습니다." }
};
