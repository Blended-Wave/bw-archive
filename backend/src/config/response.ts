//매개변수와 반환 값에 대한 타입 명시적 지정(명확한 코드 작성을 위함)
interface ResponseParams{
    isSuccess: boolean;
    code: number;
    message: string;
}
interface ResponseObject{
    isSuccess: boolean;
    code: number;
    message: string;
    result: any;
}

export const response = ({isSuccess, code, message}:ResponseParams, result:any):ResponseObject =>{
    return {
        isSuccess: isSuccess,
        code: code,
        message: message,
        result: result
    }
}