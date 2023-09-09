import axios from "axios";
import { SERVER_URL } from "../config/config";
import { makeRequest } from "../util/request";

export const removeNotifiation = (
    notificationId: string,
    accessToken: string,
    refreshToken: string
) => {
    const res = makeRequest(
        SERVER_URL,
        `/notifications/remove/${notificationId}`,
        "",
        (url) =>
            axios.post(
                url,
                { refreshToken },
                {
                    headers: {
                        authorization: `Bearer ${accessToken}`,
                    },
                }
            )
    );
    return res;
};
