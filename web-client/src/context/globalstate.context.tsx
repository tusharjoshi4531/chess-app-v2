import { createContext } from "react";
import { INotificationState, IRoomState } from "./types";
import { useNotification } from "../hooks/use-notification";
import { useRooms } from "../hooks/use-rooms";

export interface IGlobalStateContext {
    notificationState: INotificationState;
    roomState: IRoomState;
}

const globalStateContext = createContext<IGlobalStateContext>({
    notificationState: {
        count: 0,
        notifications: [],
    },
    roomState: {
        count: 0,
        rooms: [],
    },
});

interface IProviderProps {
    children: React.ReactNode;
}

export const GlobalStateProvider: React.FC<IProviderProps> = ({ children }) => {
    const { state: notifState } = useNotification();
    const { state: roomsState } = useRooms();

    const value: IGlobalStateContext = {
        notificationState: {
            count: notifState.count,
            notifications: notifState.notifications,
        },
        roomState: {
            count: roomsState.count,
            rooms: roomsState.rooms,
        },
    };

    return (
        <globalStateContext.Provider value={value}>
            {children}
        </globalStateContext.Provider>
    );
};

export default globalStateContext;
