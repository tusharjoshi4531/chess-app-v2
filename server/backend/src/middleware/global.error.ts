import { ErrorRequestHandler } from "express";
import { errorHandler } from "../error/handle.error";

export const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if(errorHandler.isTrusedError(err)) {
        errorHandler.handleError(err);
        return res.status(err.statusCode).json({ message: err.message });
    }
    next(err);
}