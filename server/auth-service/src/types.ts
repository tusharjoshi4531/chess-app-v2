import { Request } from "express";

// Auth
export interface ILoginReqBody {
  password: string;
  username: string;
}

export interface ISignupReqBody {
  username: string;
  password: string;
  firstname: string;
  lastname: string;
}

export interface IAuthorizeReqBody {
  accessToken: string;
  refreshToken: string;
}

// jwt
export interface IAccessTokenPayload {
  userid: string;
  username: string;
  firstname: string;
  lastname: string;
}