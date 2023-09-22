import axios from "axios";
import { SERVER_URL } from "../config/config";
import { makeRequest } from "../util/request";
import {
    ChoosePlayerColor,
    IChallengeUserPayload,
} from "../components/forms/ChallengeUserForm";

const constructChallenge = (challenge: IChallengeUserPayload) => ({
    status: "pending",
    time: challenge.time,
    black:
        challenge.color === ChoosePlayerColor.BLACK
            ? challenge.from
            : challenge.to,
    white:
        challenge.color === ChoosePlayerColor.WHITE
            ? challenge.from
            : challenge.to,
});

export const challengeUser = async (
    challenge: IChallengeUserPayload,
    accessToken: string,
    refreshToken: string
) => {
    if (challenge.color === ChoosePlayerColor.EITHER) {
        challenge.color =
            Math.random() > 0.5
                ? ChoosePlayerColor.WHITE
                : ChoosePlayerColor.BLACK;
    }

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

export const removeChallenge = async (
    challengeId: string,
    accessToken: string,
    refreshToken: string
) => {
    const res = await makeRequest(
        SERVER_URL,
        `/challenges/remove/${challengeId}`,
        "",
        (url) =>
            axios.post(
                url,
                {
                    refreshToken,
                },
                {
                    headers: {
                        authorization: `Bearer ${accessToken}`,
                    },
                }
            )
    );

    return res;
};

export const acceptChallenge = async (
    challengeId: string,
    username: string,
    accessToken: string,
    refreshToken: string
) => {
    console.log({ challengeId, username, accessToken, refreshToken });
    const res = await makeRequest(
        SERVER_URL,
        `/challenges/accept/${challengeId}`,
        "",
        (url) =>
            axios.post(
                url,
                {
                    username,
                    refreshToken,
                },
                {
                    headers: {
                        authorization: `Bearer ${accessToken}`,
                    },
                }
            )
    );

    return res;
};
