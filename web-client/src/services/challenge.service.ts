import axios from "axios";
import { SERVER_URL } from "../config/config";
import { makeRequest } from "../util/request";
import { IChallengeUserPayload } from "../components/forms/ChallengeUserForm";

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
