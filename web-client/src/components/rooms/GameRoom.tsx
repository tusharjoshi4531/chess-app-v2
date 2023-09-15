import {
    Button,
    Card,
    CardContent,
    Grid,
    Stack,
    Toolbar,
    Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useSocket } from "../../hooks/use-socket";
import { useEffect } from "react";
import GameArea from "./GameArea";
import InfoArea from "./InfoArea";
import { useAlert } from "../../hooks/use-alert";

interface IRoomData {
    white: string;
    whiteConnected: boolean;
    whiteRemainigTime: number;
    black: string;
    blackConnected: boolean;
    blackRemainigTime: number;
    lastMoveTime: number;
    boardHistory: string[];
    spectators: string[];
    chats: { id: string; username: string; message: string }[];
}

const GameRoom = () => {
    const { roomid } = useParams();
    const navigate = useNavigate();
    const alert = useAlert();

    const { socket, connect, disconnect } = useSocket();

    useEffect(() => {
        if (!socket) {
            connect();
            return;
        }

        const receiveRoomData = (
            error: unknown | undefined,
            data: IRoomData
        ) => {
            console.log(error, data);
        };

        const onOtherJoinRoom = (username: string) => {
            alert.info(`${username} joined the room`);
        };

        const onConnect = () => {
            socket.emit("room/join", { roomid }, receiveRoomData);
        };

        const onRoomData = (data: IRoomData) => {
            console.log(data);
        };

        socket.on("user-connected", onConnect);
        socket.on("room/user-joined", onOtherJoinRoom);
        socket.on("room/data", onRoomData);

        return () => {
            disconnect();
            socket.off("user-connected", onConnect);
            socket.off("room/user-joined", onOtherJoinRoom);
        };
    }, [socket]);

    const sendMessageHandler = (message: string) => {
        if (!socket || !roomid) return;
        console.log(message);
        socket.emit("room/send-message", { roomid, message });
    };

    if (!roomid) {
        return (
            <Stack>
                <Typography variant="h4" textAlign="center" my={2}>
                    Can't find Room Id
                </Typography>
                <Button variant="contained" onClick={() => navigate("/game")}>
                    Go back
                </Button>
            </Stack>
        );
    }

    return (
        <>
            <Toolbar />
            <Card
                sx={{
                    backgroundColor: "primary.main",
                    maxWidth: { xs: 600, md: 800 },
                    marginX: "auto",
                }}
            >
                <CardContent>
                    <Grid
                        container
                        justifyContent="center"
                        spacing={2}
                        height={"100%"}
                    >
                        <Grid item md={8} xs={12}>
                            <GameArea />
                        </Grid>
                        <Grid item md={4} xs={12}>
                            <InfoArea
                                onSendMessage={sendMessageHandler}
                                chats={[]}
                            />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </>
    );
};

export default GameRoom;
