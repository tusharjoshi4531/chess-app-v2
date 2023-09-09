import { useDispatch } from "react-redux";
import { setAlert } from "../app/features/alert/alert-slice";
import { useCallback } from "react";

export const useAlert = () => {
    const dispatch = useDispatch();

    const success = useCallback(
        (body: string) => {
            dispatch(
                setAlert({
                    type: "success",
                    body,
                })
            );
        },
        [dispatch]
    );

    const error = useCallback(
        (body: string) => {
            dispatch(
                setAlert({
                    type: "error",
                    body,
                })
            );
        },
        [dispatch]
    );

    const warning = useCallback(
        (body: string) => {
            dispatch(
                setAlert({
                    type: "warning",
                    body,
                })
            );
        },
        [dispatch]
    );

    const info = useCallback(
        (body: string) => {
            dispatch(
                setAlert({
                    type: "info",
                    body,
                })
            );
        },
        [dispatch]
    );

    return {
        success,
        error,
        info,
        warning,
    };
};
