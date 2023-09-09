import { useContext } from "react";
import { Stack } from "@mui/material";
import GlobalStateContext from "../context/globalstate.context";

import ChallengeNotification from "../components/notification/ChallengeNotification";
import { NotificationType } from "../context/types";

const NotificationsPage = () => {
    const { notifications } = useContext(GlobalStateContext).notificationState;

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
