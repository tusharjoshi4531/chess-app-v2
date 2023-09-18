import {
    Button,
    Card,
    CardContent,
    Grid,
    Stack,
    Toolbar,
    Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import GameArea from "./GameArea";
import InfoArea from "./InfoArea";
import { IGameState, useGameRoom } from "../../hooks/use-gameroom";
import { useSelector } from "react-redux";
import { IStore } from "../../app/store";

const GameRoom = () => {
    const navigate = useNavigate();
    const username = useSelector<IStore, string>(
        (state) => state.user.username
    );
    const {
        roomState,
        roomid,
        sendMessageHandler,
        sendMoveHandler,
        sendResign,
        sendChckmate,
    } = useGameRoom();

    console.log(roomState);

    const moveCompleteHandler = (
        fen: string,
        turn: "w" | "b",
        gameStatus: IGameState = "continue"
    ) => {
        sendMoveHandler(fen, turn);

        if (gameStatus === "checkmate") {
            sendChckmate(username);
        }
    };

    const resignHandler = () => {
        sendResign(username);
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
                            <GameArea
                                black={roomState.black}
                                white={roomState.white}
                                blackTime={roomState.blackRemainigTime}
                                whiteTime={roomState.whiteRemainigTime}
                                boardHistory={roomState.boardHistory}
                                timerStarted={roomState.timerStarted}
                                finished={roomState.finished}
                                onMoveComplete={moveCompleteHandler}
                            />
                        </Grid>
                        <Grid item md={4} xs={12}>
                            <InfoArea
                                onSendMessage={sendMessageHandler}
                                chats={roomState.chats ? roomState.chats : []}
                            />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            <Stack direction="row" my={2} justifyContent="center">
                <Button
                    variant="contained"
                    color="error"
                    onClick={resignHandler}
                >
                    Resign
                </Button>
            </Stack>
        </>
    );
};

export default GameRoom;
