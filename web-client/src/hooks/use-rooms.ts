import { useCallback, useEffect, useReducer, useRef } from "react";
import {
    IRoom,
    IRoomState,
    RoomsChangeType,
    initialRoomState,
} from "../context/types";
import { useSelector } from "react-redux";
import { IStore } from "../app/store";
import { useAlert } from "./use-alert";
import { SERVER_URL } from "../config/config";

interface IRoomsChange {
    data: IRoom | IRoom[] | { id: string };
    type: RoomsChangeType;
}

const POLL_INTERVAL = 3000;

const roomsReducer = (
    state: IRoomState,
    action: { type: string; payload: IRoom | IRoom[] | string }
) => {
    switch (action.type) {
        case "SET_ROOMS":
            return {
                rooms: action.payload as IRoom[],
                count: (action.payload as IRoom[]).length,
            };
        case "ADD_ROOM":
            return {
                rooms: [...state.rooms, action.payload as IRoom],
                count: state.count + 1,
            };
        case "ADD_MANY_ROOMS":
            return {
                rooms: [...state.rooms, ...(action.payload as IRoom[])],
                count: state.count + (action.payload as IRoom[]).length,
            };
        case "REMOVE_ROOM": {
            const newRooms = state.rooms.filter(
                (room) => room.id !== action.payload
            );

            return {
                ...state,
                rooms: newRooms,
                count: newRooms.length,
            };
        }
        default:
            return state;
    }
};

export const useRooms = () => {
    const source = useRef<EventSource | null>(null);
    const username = useSelector<IStore, string>(
        (state) => state.user.username
    );
    const alert = useAlert();

    const [state, dispatch] = useReducer(roomsReducer, { ...initialRoomState });

    const addRoom = useCallback(
        (room: IRoom) => {
            dispatch({ type: "ADD_ROOM", payload: room });
            alert.info(`You have joined a game room`);
        },
        [alert.info]
    );

    const setRooms = useCallback((rooms: IRoom[]) => {
        dispatch({ type: "SET_ROOMS", payload: rooms });
    }, []);

    const removeRoom = useCallback((id: string) => {
        dispatch({ type: "REMOVE_ROOM", payload: id });
    }, []);

    const clearRooms = useCallback(() => {
        dispatch({ type: "SET_ROOMS", payload: [] });
    }, []);

    useEffect(() => {
        if (username === "") {
            clearRooms();
            return;
        }

        const sourceUrl = `${SERVER_URL}/rooms/subscribe/${username}`;
        source.current = new EventSource(sourceUrl);
        console.log(source.current);
        source.current.onmessage = (event) => {
            const data: IRoomsChange = JSON.parse(event.data);
            console.log(data);

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
            source.current?.close();
            source.current = null;
        }, POLL_INTERVAL);

        return () => {
            clearInterval(interval);
            source.current?.close();
        };
    }, [username, addRoom, removeRoom, setRooms]);

    return { state };
};
