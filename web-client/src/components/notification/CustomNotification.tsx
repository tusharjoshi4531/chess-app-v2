import {
    Alert,
    AlertTitle,
    AlertColor,
    Button,
    Stack,
    Typography,
} from "@mui/material";

interface ICustonNotificationProps {
    title: string;
    body: string;
    severity?: AlertColor;
    onSuccess?: () => void;
    onCancel?: () => void;
}

const CustomNotification: React.FC<ICustonNotificationProps> = ({
    title,
    body,
    onSuccess,
    onCancel,
    severity = "info",
}) => {
    const actionComponents = (
        <Stack spacing={1} direction="row" marginY="auto">
            {onSuccess && (
                <Button
                    variant="contained"
                    onClick={onSuccess}
                    color="secondary"
                >
                    Yes
                </Button>
            )}
            <Button variant="contained" onClick={onCancel} color="secondary">
                No
            </Button>
        </Stack>
    );

    return (
        <Alert
            action={actionComponents}
            severity={severity}
            variant="filled"
            elevation={4}
        >
            <AlertTitle>
                <Typography fontWeight="bold">{title}</Typography>
            </AlertTitle>

            {body}
        </Alert>
    );
};

export default CustomNotification;
