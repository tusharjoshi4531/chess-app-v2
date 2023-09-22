import { Paper, Stack, Typography } from "@mui/material";
import { Chess } from "chess.js";
import React, { useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";
import { useSelector } from "react-redux";
import { IStore } from "../../app/store";
import { Piece, Square } from "react-chessboard/dist/chessboard/types";
import { IGameState } from "../../hooks/use-gameroom";
import _ from "lodash";

const Timer: React.FC<{
    username: string;
    timeInMs: number;
    startTimer: boolean;
    onTimeout?: () => void;
}> = ({ timeInMs, username, startTimer, onTimeout }) => {
    const [timeInSeconds, setTimeInSeconds] = useState(
        Math.round(timeInMs / 1000)
    );

    useEffect(() => {
        setTimeInSeconds(Math.round(timeInMs / 1000));

        if (!startTimer || !timeInSeconds) return;
        const interval = setInterval(() => {
            setTimeInSeconds((state) => {
                if (state === 1) onTimeout?.();
                return Math.max(0, state - 1);
            });
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [startTimer, timeInMs]);

    const secondsDigit = timeInSeconds % 60;
    const minutesDigit = Math.floor(timeInSeconds / 60);

    return (
        <Stack direction={"row"} justifyContent={"space-between"}>
            <Paper sx={{ width: "fit-content" }}>
                <Typography px={2}>{username}</Typography>
            </Paper>
            <Paper sx={{ width: "fit-content" }}>
                <Typography px={2}>
                    {minutesDigit} : {secondsDigit < 10 ? 0 : ""}
                    {secondsDigit}
                </Typography>
            </Paper>
        </Stack>
    );
};

interface IGameAreaProps {
    black: string;
    white: string;
    blackTime: number;
    whiteTime: number;
    timerStarted: boolean;
    boardHistory: string[];
    finished: boolean;
    onMoveComplete: (
        fen: string,
        turn: "w" | "b",
        gameState: "checkmate" | "draw" | "continue"
    ) => void;
    onTimeout: (username: string) => void;
}

const GameArea: React.FC<IGameAreaProps> = ({
    black,
    white,
    blackTime,
    whiteTime,
    timerStarted,
    boardHistory,
    finished,
    onMoveComplete,
    onTimeout,
}) => {
    console.log({ blackTime, whiteTime, timerStarted });

    const [game, setGame] = useState(new Chess());
    const username = useSelector<IStore, string>(
        (state) => state.user.username
    );

    const color = username === white ? "white" : "black";
    const oponent = username === white ? black : white;

    const pieceIsValid = (piece: Piece) => {
        const valid =
            !game.isCheckmate() &&
            piece[0] === color[0] &&
            game.turn() === color[0];

        return valid;
    };

    const pieceDropHandler = (
        sourceSquare: Square,
        targetSquare: Square,
        piece: Piece
    ) => {
        try {
            if (!pieceIsValid(piece) || finished) return false;

            const newGame = _.cloneDeep(game);

            game.move({
                from: sourceSquare,
                to: targetSquare,
                promotion: "q",
            });

            setGame(newGame);

            const isDraw =
                game.isThreefoldRepetition() ||
                game.isDraw() ||
                game.isStalemate() ||
                game.isInsufficientMaterial();

            let state: IGameState = "continue";
            state = game.isCheckmate() ? "checkmate" : state;
            state = isDraw ? "draw" : state;

            onMoveComplete(game.fen(), game.turn(), state);

            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    };

    useEffect(() => {
        if (
            boardHistory.length === 0 ||
            boardHistory[boardHistory.length - 1] === game.fen()
        )
            return;

        // Does not support viewing history yet
        // Does not support 3 - fold repitition yet
        const newGame = new Chess(boardHistory[boardHistory.length - 1]);
        setGame(newGame);
    }, [boardHistory]);

    return (
        <Stack spacing={1}>
            <Timer
                username={oponent}
                timeInMs={color === "white" ? blackTime : whiteTime}
                startTimer={
                    game.turn() !== color[0] && timerStarted && !finished
                }
                onTimeout={onTimeout.bind(null, username)}
            />
            <Chessboard
                position={game.fen()}
                onPieceDrop={pieceDropHandler}
                boardOrientation={color}
                arePiecesDraggable={!finished}
            />
            <Timer
                username={username}
                timeInMs={color === "black" ? blackTime : whiteTime}
                startTimer={
                    game.turn() === color[0] && timerStarted && !finished
                }
            />
        </Stack>
    );
};

export default GameArea;
