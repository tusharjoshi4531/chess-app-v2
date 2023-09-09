import { Alert, AlertColor, Button, Stack } from "@mui/material";

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
        <Stack spacing={1} direction="column">
            {onSuccess && (
                <Button variant="contained" onClick={onSuccess}>
                    Yes
                </Button>
            )}
            <Button variant="contained" onClick={onCancel}>
                No
            </Button>
        </Stack>
    );

    return (
        <Alert action={actionComponents} title={title} severity={severity}>
            {body}
        </Alert>
    );
};

export default CustomNotification;
