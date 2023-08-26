import { Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import { makeRequest } from "../util/request";
import { AUTH_SERVER_URL } from "../config/config";
import axios from "axios";
import { addLiveUser } from "../service/database.service";

interface IAuthResult {
    user: {
        username: string;
        userid: string;
    };
    accessToken: string;
    refreshToken: string;
}

export const authenticateUser = async (
    socket: Socket,
    next: (err?: ExtendedError | undefined) => void
) => {
    try {
        const { accessToken, refreshToken } = socket.handshake.auth;
        const { status, response, error } = await makeRequest<IAuthResult>(
            AUTH_SERVER_URL,
            "/authorize",
            "",
            (url) => axios.post<IAuthResult>(url, { accessToken, refreshToken })
        );

        console.log({ error, response });

        if (error || !response)
            return next(new Error("Couldn't connect to live server"));

        const { userid, username } = response.user;

        const addedUser = await addLiveUser({
            userid,
            username,
            socketId: socket.id,
        });

        console.log({ addedUser });

        socket.emit("user-authenticated", {
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
        });

        next();
    } catch (error) {
        next(new Error("Couldn't connect to live server"));
    }
};
