import { Request } from "express";

export interface ILiveUserData {
  username: string;
  userid: string;
  socketId: string;
}

// logger
export type ILoggerBody = {
  request: {
    id: string;
    endpoint: string;
    method: string;
    enteredAt: Date;
    latency: number;
    status: number;
  };
};
