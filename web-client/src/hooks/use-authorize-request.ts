import { useDispatch, useSelector } from "react-redux";
import { IUserState } from "../app/features/user/types";
import { IStore } from "../app/store";
import { updateToken } from "../app/features/user/user-slice";

interface IAuthResponseData {
    accessToken: string | undefined;
    refreshToken: string | undefined;
}

export const useAuthorizeRequest = () => {
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

    const handleRequestResponse = (res: {
        response: IAuthResponseData | undefined;
        error: IAuthResponseData | undefined;
    }) => {
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

    const authRequest = async (
        requestFn: (
            accessToken: string,
            refreshToken: string
        ) => Promise<{
            response: IAuthResponseData | undefined;
            error: IAuthResponseData | undefined;
        }>
    ) => {
        const res = await requestFn(accessToken, refreshToken);
        handleRequestResponse(res);
        return res;
    };

    const multiAuthRequest = async (
        requestFns: {
            (accessToken: string, refreshToken: string): Promise<{
                response: IAuthResponseData | undefined;
                error: IAuthResponseData | undefined;
            }>;
        }[]
    ) => {
        let currentAccessToken = accessToken,
            currentRefreshToken = refreshToken;
        let handleRes: {
            response: IAuthResponseData | undefined;
            error: IAuthResponseData | undefined;
        } = { response: undefined, error: undefined };

        for (const requestFn of requestFns) {
            handleRes = await requestFn(
                currentAccessToken,
                currentRefreshToken
            );
            const { error, response } = handleRes;

            const AUTH_INVALID =
                error ||
                !response ||
                !response.accessToken ||
                !response.refreshToken;

            if (AUTH_INVALID) {
                break;
            }

            if (response.accessToken) currentAccessToken = response.accessToken;
            if (response.refreshToken)
                currentRefreshToken = response.refreshToken;
        }
        handleRequestResponse(handleRes);

        return handleRes;
    };

    return {
        authRequest,
        multiAuthRequest,
    };
};
