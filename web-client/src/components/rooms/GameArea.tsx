import { Paper, Stack, Typography } from "@mui/material";
import React from "react";
import { Chessboard } from "react-chessboard";

interface IGameAreaProps {
    black: string;
    white: string;
    blackTime: number;
    whiteTime: number;
}

const GameArea: React.FC<IGameAreaProps> = () => {
    return (
        <Stack spacing={1}>
            <Stack direction={"row"} justifyContent={"space-between"}>
                <Paper sx={{ width: "fit-content" }}>
                    <Typography px={2}>Black Player</Typography>
                </Paper>
                <Paper sx={{ width: "fit-content" }}>
                    <Typography px={2}>5:00</Typography>
                </Paper>
            </Stack>
            <Chessboard position="start" />
            <Stack direction={"row"} justifyContent={"space-between"}>
                <Paper sx={{ width: "fit-content" }}>
                    <Typography px={2}>White Player</Typography>
                </Paper>
                <Paper sx={{ width: "fit-content" }}>
                    <Typography px={2}>5:00</Typography>
                </Paper>
            </Stack>
        </Stack>
    );
};

export default GameArea;
