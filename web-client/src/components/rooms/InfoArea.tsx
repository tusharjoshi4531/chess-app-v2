import {
    Button,
    Card,
    Divider,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import React, { ChangeEvent, useState } from "react";

interface IInfoAreaProps {
    chats?: { id: string; username: string; message: string }[];
    onSendMessage?: (message: string) => void;
}

const InfoArea: React.FC<IInfoAreaProps> = ({
    chats = [],
    onSendMessage = () => {},
}) => {
    const [message, setMessage] = useState("");

    const messageChangeHandler = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setMessage(e.target.value);
    };

    const chatComponents = chats.map((chat) => {
        return (
            <Typography key={chat.id}>
                <b>{chat.username}</b>: {chat.message}
            </Typography>
        );
    });

    return (
        <Card sx={{ height: "100%", display: "flex" }} variant="outlined">
            <Stack flex={1} spacing={1} p={1}>
                <Paper variant="outlined" sx={{ flex: 1, minHeight: 300 }}>
                    <Typography textAlign="center" marginY="2px">
                        <b>Chat Box</b>
                    </Typography>
                    <Divider />
                </Paper>
                {chatComponents}
                <Stack direction="row" spacing={1}>
                    <TextField
                        fullWidth
                        size="small"
                        sx={{ flexGrow: 1 }}
                        onChange={messageChangeHandler}
                        value={message}
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        size="small"
                        sx={{ width: "fit-content" }}
                        onClick={onSendMessage.bind(null, message)}
                    >
                        Send
                    </Button>
                </Stack>
            </Stack>
        </Card>
    );
};

export default InfoArea;
