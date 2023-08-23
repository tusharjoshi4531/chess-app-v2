import { useDispatch } from "react-redux";
import { setNotification } from "../app/features/notification/notification-slice";

export const useNotification = () => {
    const dispatch = useDispatch();

    const success = (body: string) => {
        dispatch(
            setNotification({
                type: "success",
                body,
            })
        );
    };

    const error = (body: string) => {
        dispatch(
            setNotification({
                type: "error",
                body,
            })
        );
    };

    const warning = (body: string) => {
        dispatch(
            setNotification({
                type: "warning",
                body,
            })
        );
    };

    const info = (body: string) => {
        dispatch(
            setNotification({
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
