import { useContext } from "react";
import { Stack } from "@mui/material";
import NotificationContext from "../context/notification.context";

const NotificationsPage = () => {
    const { notifications } = useContext(NotificationContext);

    // const notificationComponents = notifications.map((notif) => (
    //     <CustomNotification notificationData={notif} />
    // ));

    return <Stack height={"100%"}>{notifications.toString()}</Stack>;
};

export default NotificationsPage;
