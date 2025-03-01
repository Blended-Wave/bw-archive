//기존 에러보다 많은 정보 출력을 위한 확장
interface ErrorData {
    message: string;
    status: number;
    [key: string]: any; //추가적인 속성들 허용
}

export class BaseError extends Error {
    public data: ErrorData;

    constructor(data: ErrorData){
        super(data.message);
        this.data = data;
        Object.setPrototypeOf(this, BaseError.prototype); // ES5이하 환경에서 호환성 유지
    }

    getStatus(): number {
        return this.data.status;
    }
}