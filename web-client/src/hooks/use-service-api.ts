import { useDispatch, useSelector } from "react-redux";
import { IStore } from "../app/store";
import { IUserState } from "../app/features/user/types";
import { challengeUser } from "../services/challenge.service";
import { IChallengeUserPayload } from "../components/forms/ChallengeUserForm";
import { updateToken } from "../app/features/user/user-slice";

export const useServiceApi = () => {
    const { accessToken, refreshToken } = useSelector<IStore, IUserState>(
        (state) => state.user
    );

    const dispatch = useDispatch();

    const updateNewTokens = (accessToken: string, refreshToken: string) => {
        const AUTH_VALIDATED =
            accessToken &&
            refreshToken &&
            accessToken !== "" &&
            refreshToken !== "";

        if (AUTH_VALIDATED) {
            dispatch(updateToken({ accessToken, refreshToken }));
        }
    };

    const handleRequestResponse = (res: { response: any; error: any }) => {
        const { response, error } = res;
        console.log({ response, error });

        if (
            response !== undefined &&
            response.accessToken !== undefined &&
            response.refreshToken !== undefined
        ) {
            const { accessToken, refreshToken } = response;
            updateNewTokens(accessToken, refreshToken);
        }

        if (
            error !== undefined &&
            error.accessToken !== undefined &&
            error.refreshToken !== undefined
        ) {
            const { accessToken, refreshToken } = error;
            updateNewTokens(accessToken, refreshToken);
        }
    };

    const challengeUserApi = async (challenge: IChallengeUserPayload) => {
        const res = await challengeUser(challenge, accessToken, refreshToken);

        handleRequestResponse(res);

        return res;
    };

    return {
        challengeUser: challengeUserApi,
    };
};
