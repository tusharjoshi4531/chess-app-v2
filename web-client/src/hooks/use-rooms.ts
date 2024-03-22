import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IStore } from "../app/store";
import { useAlert } from "./use-alert";
import { SERVER_URL } from "../config/config";
import { IRoom, RoomsChangeType } from "../app/features/rooms/types";
import {
    addRoom as addRoomToRooms,
    removeRoom as removeRoomFromRooms,
    setRooms as setRoomsInRooms,
} from "../app/features/rooms/rooms-slice";

interface IRoomsChange {
    data: IRoom | IRoom[] | { id: string };
    type: RoomsChangeType;
}

const POLL_INTERVAL = 3000;

export const useRooms = () => {
    const source = useRef<EventSource | null>(null);
    const username = useSelector<IStore, string>(
        (state) => state.user.username
    );
    const alert = useAlert();

    const dispatch = useDispatch();

    const addRoom = useCallback(
        (room: IRoom) => {
            dispatch(addRoomToRooms(room));
            alert.info(`You have joined a game room`);
        },
        [alert, dispatch]
    );

    const setRooms = useCallback(
        (rooms: IRoom[]) => {
            dispatch(setRoomsInRooms(rooms));
        },
        [dispatch]
    );

    const removeRoom = useCallback(
        (id: string) => {
            dispatch(removeRoomFromRooms(id));
        },
        [dispatch]
    );

    const clearRooms = useCallback(() => {
        dispatch(setRoomsInRooms([]));
    }, [dispatch]);

    useEffect(() => {
        if (username === "") {
            clearRooms();
            return;
        }

        const sourceUrl = `${SERVER_URL}/rooms/subscribe/${username}`;
        source.current = new EventSource(sourceUrl);

        source.current.onmessage = (event) => {
            const data: IRoomsChange = JSON.parse(event.data);
            console.log(event);

            switch (data.type) {
                case RoomsChangeType.INITIAL_ROOMS:
                    setRooms(data.data as IRoom[]);
                    break;
                case RoomsChangeType.ROOM_INSERT:
                    addRoom(data.data as IRoom);
                    break;
                case RoomsChangeType.ROOM_DELETE:
                    removeRoom((data.data as { id: string }).id);
                    break;
                default:
                    break;
            }
        };

        source.current.onerror = (e) => {
            console.log(e);
        };

        const interval = setInterval(() => {
            if (source.current?.readyState === EventSource.CLOSED) {
                source.current?.close();
                source.current = null;
            }
        }, POLL_INTERVAL);

        return () => {
            clearInterval(interval);
            source.current?.close();
        };
    }, [username, source, addRoom, removeRoom, setRooms, clearRooms]);
};
