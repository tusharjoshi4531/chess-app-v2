import { Server, Socket } from "socket.io";
import { makeRequest } from "../util/request";
import { AUTH_SERVER_URL } from "../config/config";
import axios from "axios";
import { addLiveUser, removeLiveUser } from "../service/database.service";

interface IAuthResult {
    user: {
        username: string;
        userid: string;
    };
    accessToken: string;
    refreshToken: string;
}
const connectionControllers = (io: Server, socket: Socket) => {
    const joinServer = async (
        data: any,
        callback: (
            error: any,
            accessToken: string,
            refreshToken: string
        ) => void
    ) => {
        try {
            const { status, response, error } = await makeRequest<IAuthResult>(
                AUTH_SERVER_URL,
                "/authorize",
                "",
                (url) => axios.post<IAuthResult>(url, data)
            );

            console.log({ error, response });

            if (error || !response) return callback(error, "", "");

            const { userid, username } = response.user;

            const addedUser = await addLiveUser({
                userid,
                username,
                socketId: socket.id,
            });

            console.log({ addedUser });

            callback(undefined, response!.accessToken, response!.refreshToken);
        } catch (error) {
            callback(error, "", "");
        }
    };

    const disconnect = async () => {
        removeLiveUser({ socketId: socket.id });
        console.log(`${socket.id} disconnected`);
    };

    socket.on("join-server", joinServer);
    socket.on("disconnect", disconnect);
};

export default connectionControllers;
