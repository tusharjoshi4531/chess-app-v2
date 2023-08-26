import { useDispatch } from "react-redux";
import { setAlert } from "../app/features/alert/alert-slice";

export const useAlert = () => {
    const dispatch = useDispatch();

    const success = (body: string) => {
        dispatch(
            setAlert({
                type: "success",
                body,
            })
        );
    };

    const error = (body: string) => {
        dispatch(
            setAlert({
                type: "error",
                body,
            })
        );
    };

    const warning = (body: string) => {
        dispatch(
            setAlert({
                type: "warning",
                body,
            })
        );
    };

    const info = (body: string) => {
        dispatch(
            setAlert({
                type: "info",
                body,
            })
        );
    };

    return {
        success,
        error,
        info,
        warning,
    };
};
