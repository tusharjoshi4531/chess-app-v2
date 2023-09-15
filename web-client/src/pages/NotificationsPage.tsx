import { Stack } from "@mui/material";

import ChallengeNotification from "../components/notification/ChallengeNotification";
import { useSelector } from "react-redux";
import { IStore } from "../app/store";
import {
    INotification,
    NotificationType,
} from "../app/features/notification/types";

const NotificationsPage = () => {
    const notifications = useSelector<IStore, INotification[]>(
        (state) => state.notification.notifications
    );

    const notificationComponents = notifications.map((notif) => {
        switch (notif.type) {
            case NotificationType.CHALLENGE:
                return (
                    <ChallengeNotification
                        title={notif.title}
                        body={notif.body}
                        challengeId={notif.payload.challengeId}
                        key={notif.id}
                        notificationId={notif.id}
                    />
                );
            default:
                return <div></div>;
        }
    });

    return <Stack height={"100%"}>{notificationComponents}</Stack>;
};

export default NotificationsPage;
