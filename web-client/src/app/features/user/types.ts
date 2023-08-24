export interface IUserState {
    username: string;
    userid: string;
    firstname: string;
    lastname: string;
    refreshToken: string;
    accessToken: string;
}

export const initialState: IUserState = {
    username: "",
    userid: "",
    firstname: "",
    lastname: "",
    accessToken: "",
    refreshToken: "",
};
