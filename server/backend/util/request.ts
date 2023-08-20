import { AxiosResponse, isAxiosError } from "axios";

const buildUrl = (serverUrl: string, query: string) => {
    const queryString = new URLSearchParams(query);
    const url = `${serverUrl}?${queryString}`;
    return url;
};

const detailsFromError = (error: unknown) => {
    if (isAxiosError(error)) {
        let status, err;
        if (error.response) {
            status = error.response.status;
            err = error.response.data;
        } else {
            status = error.request.status;
            err = error.request.data;
        }
        return { status, error: err };
    } else {
        return { status: 400, error: "Unknown error" };
    }
};

export const makeRequest = async <T>(
    serverUrl: string,
    path: string,
    query: string,
    reqCallback: (url: string) => Promise<AxiosResponse<T, unknown>>
) => {
    const url = buildUrl(`${serverUrl}${path}`, query);
    try {
        const res = await reqCallback(url);
        const { status, data } = res;
        return { status, error: undefined, response: data };
    } catch (err) {
        const { status, error } = detailsFromError(err);
        return { status, error, response: undefined };
    }
};
