import { createContext } from "react";
import { INotificationState, useNotification } from "../hooks/use-notification";

export interface INotificationContext extends INotificationState {}

const notificationContex = createContext<INotificationContext>({
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
        notifications: state.notifications,
    };

    return (
        <notificationContex.Provider value={value}>
            {children}
        </notificationContex.Provider>
    );
};

export default notificationContex;
