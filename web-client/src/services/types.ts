import { IUserState } from "../app/features/user/user-slice";

// Auth
export interface ISignupData {
    firstname: string;
    lastname: string;
    username: string;
    password: string;
}

export interface ILoginData {
    username: string;
    password: string;
}

export interface IAuthResponse {
    user: IUserState;
    accessToken: string;
    refreshToken: string;
}
