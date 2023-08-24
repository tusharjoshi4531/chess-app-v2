import { Server, Socket } from "socket.io";
import { makeRequest } from "../../util/request";
import { AUTH_SERVER_URL } from "../config/config";
import axios from "axios";

const connectionControllers = (io: Server, socket: Socket) => {
    const joinServer = async (
        data: any,
        callback: (
            error: any,
            accessToken: string,
            refreshToken: string
        ) => void
    ) => {
        const { status, response, error } = await makeRequest<{
            accessToken: string;
            refreshToken: string;
        }>(AUTH_SERVER_URL, "/authorize", "", (url) =>
            axios.post<{ accessToken: string; refreshToken: string }>(url, data)
        );

        console.log({ error, response });

        if (error) return callback(error, "", "");
        else
            return callback(
                undefined,
                response!.accessToken,
                response!.refreshToken
            );
    };

    socket.on("join-server", joinServer);
};

export default connectionControllers;
