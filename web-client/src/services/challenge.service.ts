import axios from "axios";
import { SERVER_URL } from "../config/config";
import { makeRequest } from "../util/request";
import { IChallengeUserPayload } from "../components/forms/ChallengeUserForm";
import { INotification, NotificationType } from "../hooks/use-notification";

export const challengeUser = async (challenge: IChallengeUserPayload) => {
    const { from, to } = challenge;

    const challengeNotif: Omit<INotification, "id"> = {
        from,
        to,
        type: NotificationType.CHALLENGE,
        title: "New challenge",
        body: `${from} has challenged you to a game of chess`,
        payload: {
            challengeId: 0,
        },
    };

    const res = makeRequest(SERVER_URL, "/notifications/add", "", (url) =>
        axios.post(url, { ...challengeNotif })
    );
    return res;
};
