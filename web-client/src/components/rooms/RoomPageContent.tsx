import React, { useContext } from "react";
import globalStateContext from "../../context/globalstate.context";

const RoomPageContent = () => {
    const { rooms } = useContext(globalStateContext).roomState;
    console.log(rooms);
    return <div>{rooms.toString()}</div>;
};

export default RoomPageContent;
