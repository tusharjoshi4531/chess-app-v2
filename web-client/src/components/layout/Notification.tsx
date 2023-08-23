import React, { useEffect, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertColor, AlertProps } from "@mui/material/Alert";
import { useDispatch, useSelector } from "react-redux";
import {
    INotificationState,
    clearNotification,
} from "../../app/features/notification/notification-slice";
import { IStore } from "../../app/store";
import { NOTIF_LIFE } from "../../config/config";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Notification = () => {
    const notification = useSelector<IStore, INotificationState>(
        (state) => state.notification
    );
    const [currentType, setCurrentType] = useState<AlertColor | undefined>(
        undefined
    );
    const dispatch = useDispatch();

    const alertCloseHandler = () => dispatch(clearNotification());
    const snackbarCloseHandler = () => console.log("close");

    useEffect(() => {
        if (!notification.type) return;
        setCurrentType(notification.type);

        const timeout = setTimeout(() => {
            dispatch(clearNotification());
        }, NOTIF_LIFE);

        return () => clearTimeout(timeout);
    }, [notification.type]);

    return (
        <Snackbar
            open={!!notification.type}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            autoHideDuration={NOTIF_LIFE}
            onClose={snackbarCloseHandler}
            >
            <Alert onClose={alertCloseHandler} severity={currentType}>
                {notification.body}
            </Alert>
        </Snackbar>
    );
};

export default Notification;
