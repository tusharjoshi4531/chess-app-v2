import axios from "axios";
import { SERVER_URL } from "../config/config";
import { makeRequest } from "../util/request";
import {
    ChoosePlayerColor,
    IChallengeUserPayload,
} from "../components/forms/ChallengeUserForm";
import { INotification, NotificationType } from "../hooks/use-notification";

const sendChallengeNotification = async (
    challenge: IChallengeUserPayload,
    accessToken: string,
    refreshToken: string
) => {
    const { from, to } = challenge;
    const challengeNotif: Omit<INotification, "id"> = {
        from,
        to,
        type: NotificationType.CHALLENGE,
        title: "New challenge",
        body: `${from} has challenged you to a game of chess`,
        payload: {
            challengeId: "?",
        },
    };
    const res = await makeRequest(SERVER_URL, "/notifications/add", "", (url) =>
        axios.post(
            url,
            { ...challengeNotif, refreshToken },
            { headers: { authorization: `Bearer ${accessToken}` } }
        )
    );

    return res;
};

const constructChallenge = (challenge: IChallengeUserPayload) => ({
    status: "pending",
    time: challenge.time,
    black: challenge.from,
    white: challenge.to,
});

export const challengeUser = async (
    challenge: IChallengeUserPayload,
    accessToken: string,
    refreshToken: string
) => {
    console.log(challenge);
    const challengeBody = {
        ...constructChallenge(challenge),
        from: challenge.from,
    };

    const res = await makeRequest(
        SERVER_URL,
        `/challenges/challenge-user/${challenge.to}`,
        "",
        (url) =>
            axios.post(
                url,
                { ...challengeBody, refreshToken },
                { headers: { authorization: `Bearer ${accessToken}` } }
            )
    );

    return res;
};
