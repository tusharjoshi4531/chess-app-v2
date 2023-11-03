import { useSelector } from "react-redux";
import RoomCard from "./RoomCard";
import { Grid } from "@mui/material";
import { IStore } from "../../app/store";
import { IRoom } from "../../app/features/rooms/types";

import JoinRoom from "./JoinRoom";

const RoomPageContent = () => {
    const rooms = useSelector<IStore, IRoom[]>((state) => state.rooms.rooms);

    const roomComponents = rooms.map((room) => {
        return (
            <Grid item md={6} sm={12} key={room.id}>
                <RoomCard roomData={room} />
            </Grid>
        );
    });

    return (
        <>
            <Grid container spacing={2} justifyContent="center">
                {roomComponents}
            </Grid>
            <JoinRoom sx={{ position: "absolute", bottom: 0, right: 0 }} />
        </>
    );
};

export default RoomPageContent;
