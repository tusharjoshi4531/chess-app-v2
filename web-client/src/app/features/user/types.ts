export interface IUserState {
    username: string;
    userid: string;
    firstname: string;
    lastname: string;
}

export const initialState: IUserState = {
    username: "",
    userid: "",
    firstname: "",
    lastname: "",
};