import { Alert, Button, Stack } from "@mui/material";
import { INotification } from "../../app/features/notification/types";
import { useDispatch } from "react-redux";
import { removeNotification } from "../../app/features/notification/notification-slice";

interface ICustonNotificationProps extends R {
    notificationData: INotification;
}

const CustomNotification: React.FC<ICustonNotificationProps> = ({
    notificationData,
}) => {
    const { actions, id, title, body } = notificationData;
    const dispatch = useDispatch();

    const actionClickHandler = (cb: () => void) => {
        cb();
        dispatch(removeNotification(id));
    };

    const actionComponents = (
        <Stack spacing={1} direction="column">
            {actions.map(({ label, fn }, index) => (
                <Button
                    id={index.toString()}
                    onClick={() => {
                        actionClickHandler(fn);
                    }}
                >
                    {label}
                </Button>
            ))}
        </Stack>
    );
    

    return (
        <Alert action={actionComponents} title={title} severity="info">
            {body}
        </Alert>
    );
};

export default CustomNotification;
