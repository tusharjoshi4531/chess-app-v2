import { createContext } from "react";
import { INotificationState } from "./types";
import { useNotification } from "../hooks/use-notification";

export interface INotificationContext extends INotificationState {}

const notificationContex = createContext<INotificationContext>({
    count: 0,
    notifications: [],
});

interface IProviderProps {
    children: React.ReactNode;
}

export const NotificationProvider: React.FC<IProviderProps> = ({
    children,
}) => {
    const { state } = useNotification();

    const value: INotificationContext = {
        count: state.count,
        notifications: state.notifications,
    };

    return (
        <notificationContex.Provider value={value}>
            {children}
        </notificationContex.Provider>
    );
};

export default notificationContex;
