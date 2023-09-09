export enum HTTP_STATUS_CODE {
    OK = 200,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    NOT_FOUND = 404,
    INTERNAL_SERVER = 500,
}

export class AppError extends Error {
    statusCode: number;
    status: string;
    isOperational: boolean;
    name: string;

    constructor(
        name: string,
        message: string,
        statusCode: HTTP_STATUS_CODE,
        isOperational: boolean = true
    ) {
        super(message);
        this.name = name;
        this.statusCode = statusCode;
        this.status = statusCode.toString().startsWith("4") ? "fail" : "error";
        this.isOperational = isOperational;

        Error.captureStackTrace(this, this.constructor);
    }
}

export const error400 = (message: string) =>
    new AppError("BAD REQUEST", message, HTTP_STATUS_CODE.BAD_REQUEST);
export const error401 = (message: string) =>
    new AppError("UNAUTHORIZED", message, HTTP_STATUS_CODE.UNAUTHORIZED);
export const error404 = (message: string) =>
    new AppError("NOT FOUND", message, HTTP_STATUS_CODE.NOT_FOUND);
export const error500 = (message: string) =>
    new AppError("INTERNAL SERVER", message, HTTP_STATUS_CODE.INTERNAL_SERVER);
