import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { errorHandler } from "../error/handle.error";
import { IAuthorizedRequest } from "./authorize";
import { ILoggerBody } from "../types";
import { entriesIn } from "lodash";

export const globalErrorHandler: ErrorRequestHandler = (
  err,
  _req: Request<{}, {}, ILoggerBody, {}>,
  res,
  next
) => {
  // Logging
  const { request } = _req.body;
  request.latency = new Date().getTime() - request.enteredAt.getTime();
  request.status = err.statusCode;
  console.log(
    `\n[id: ${request.id}  endpoint: ${request.endpoint}  enteredAd:${request.enteredAt}  status: ${request.status} latency: ${request.latency}ms\n]`
  );

  const req = _req as IAuthorizedRequest<{}, ILoggerBody, {}>;
  const { accessToken, refreshToken } = req;
  const IS_AUTH_PROTECTED =
    accessToken &&
    refreshToken &&
    accessToken !== "" &&
    refreshToken !== "" &&
    accessToken !== "undefined" &&
    refreshToken !== "undefined";

  if (!errorHandler.isTrusedError(err)) {
    const resBody = !IS_AUTH_PROTECTED
      ? { message: "Unhandled exception" }
      : {
          message: "Unhandled exception",
          refreshToken,
          accessToken,
        };

    res.status(500).json(resBody);

    return next(err);
  }

  if (!errorHandler.isOk(err)) {
    errorHandler.handleError(err);

    const resBody = !IS_AUTH_PROTECTED
      ? { message: err.message }
      : {
          message: err.message,
          refreshToken,
          accessToken,
        };

    return res.status(err.statusCode).json(resBody);
  }

  if (!IS_AUTH_PROTECTED) return res.status(200).json(err.resBody);
  res.status(200).json({
    ...err.resBody,
    accessToken,
    refreshToken,
  });
};
