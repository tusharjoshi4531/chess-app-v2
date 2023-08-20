import axios from "axios";
import { makeRequest } from "../util/request";
import { SERVER_URL } from "../config/config";
import { IAuthResponse, ILoginData, ISignupData } from "./types";

export const signup = async (data: ISignupData) => {
    const res = await makeRequest<IAuthResponse>(
        SERVER_URL,
        "/auth/signup",
        "",
        (url) => axios.post(url, { ...data })
    );
    return res;
};

export const login = async (data: ILoginData) => {
    const res = await makeRequest<IAuthResponse>(
        SERVER_URL,
        "/auth/login",
        "",
        (url) => axios.post(url, { ...data })
    );
    return res;
};

export const logout = (userid: string) => {
    makeRequest<IAuthResponse>(SERVER_URL, "/auth/logout", "", (url) =>
        axios.post(url, { userid })
    );
};
