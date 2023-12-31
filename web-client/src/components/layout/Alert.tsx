import React, { useEffect, useState, useCallback } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { useSelector } from "react-redux";
import { IStore } from "../../app/store";
import { NOTIF_LIFE } from "../../config/config";
import { IAlertState } from "../../app/features/alert/types";

const AlertContent = React.forwardRef<HTMLDivElement, AlertProps>(
    function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    }
);

const Alert = () => {
    const notification = useSelector<IStore, IAlertState>(
        (state) => state.alert
    );

    const [alertQueue, setAlertQueue] = useState<IAlertState[]>([]);

    const removeNotification = useCallback(() => {
        setAlertQueue((state) => {
            if (state.length === 0) return [];
            const newState = state.filter((_, index) => index > 0);

            return newState;
        });
    }, []);

    const alertCloseHandler = () => {
        removeNotification();
    };

    useEffect(() => {
        if (!notification.type) return;

        setAlertQueue((state) => {
            const alert: IAlertState = {
                body: notification.body,
                type: notification.type,
            };
            return [...state, alert];
        });
    }, [notification.time]);

    useEffect(() => {
        if (alertQueue.length === 0) return;
        const timeout = setTimeout(() => {
            removeNotification();
        }, NOTIF_LIFE);

        return () => clearTimeout(timeout);
    }, [alertQueue, removeNotification]);

    const isAlertOpen = alertQueue.length > 0;
    const alertSeverity = isAlertOpen ? alertQueue[0].type : undefined;
    const alertBody = isAlertOpen ? alertQueue[0].body : undefined;

    return (
        <Snackbar
            open={isAlertOpen}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            autoHideDuration={NOTIF_LIFE}
        >
            <AlertContent onClose={alertCloseHandler} severity={alertSeverity}>
                {alertBody}
            </AlertContent>
        </Snackbar>
    );
};

export default Alert;
