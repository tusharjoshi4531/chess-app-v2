import { AppError } from "./app.error";

class ErrorHandler {
    public handleError(error: Error) {
        console.log("error from handle error");
        console.error(error);
    }

    public isTrusedError(error: Error) {
        if (error instanceof AppError) return error.isOperational;
        return false;
    }
}

export const errorHandler = new ErrorHandler();
