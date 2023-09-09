import { RequestHandler } from "express";
import { INotification } from "../model/notification.model";
import {
    NotificationChagneType,
    createNotification,
    getNotifications,
    subscribeNotificationChange,
} from "../service/notification.service";
import { success201 } from "../error/app.error";

export const subscribe: RequestHandler<
    { username: string },
    {},
    { ssid: string },
    {}
> = async (req, res) => {
    if (!req.params.username)
        return res.status(400).json({ message: "User ID is required" });

    console.log(req.params.username);
    const notifications = await getNotifications(req.params.username);

    const notificationMessage = {
        type: NotificationChagneType.INITIAL_NOTIFICATIONS,
        data: notifications,
    };

    const changeStreem = subscribeNotificationChange(
        req.params.username,
        (notification) => {
            console.log(notification);
            const changeMessage = {
                type: notification.type,
                data: notification.data,
            };

            res.write(`id: ${req.body.ssid}\n`);
            res.write(`data: ${JSON.stringify(changeMessage)}\n\n`);
        }
    );

    res.write(`id: ${req.body.ssid}\n`);
    res.write(`data: ${JSON.stringify(notificationMessage)}\n\n`);

    req.on("close", () => {
        changeStreem.close();
    });

    // setInterval(() => {
    //     res.write(`id: ${req.body.ssid}\n`);
    //     res.write(
    //         `data: ${JSON.stringify({ message: "Hello from server" })}\n\n`
    //     );
    // }, 3000);
};

export const addNotification: RequestHandler<
    {},
    {},
    INotification,
    {}
> = async (req, res, next) => {
    try {
        await createNotification(req.body, 5000);
        // return res
        //     .status(201)
        //     .json({
        //         accessToken: req.accessToken,
        //         refreshToken: req.refreshToken,
        //     });
        next(success201());
    } catch (error) {
        next(error);
    }
};
