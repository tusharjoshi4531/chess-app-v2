import { NextFunction, Request, RequestHandler, Response } from "express";
import { ILoggerBody } from "../types";
import { v4 as uuidv4 } from "uuid";

export function loggerMiddleware(
  req: Request<unknown, unknown, ILoggerBody, unknown>,
  _: Response,
  next: NextFunction
) {
  req.body.request = {
    id: uuidv4(),
    endpoint: req.url,
    method: req.method,
    enteredAt: new Date(),
    latency: 0,
    status: 0,
  };

  next();
}
