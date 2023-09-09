import { useAlert } from "../../hooks/use-alert";
import { useAuthorizeRequest } from "../../hooks/use-authorize-request";
import { removeChallenge } from "../../services/challenge.service";
import { removeNotifiation } from "../../services/notification.service";
import CustomNotification from "./CustomNotification";

interface IChallengeNotificationProps {
    title: string;
    body: string;
    challengeId: string;
    notificationId: string;
}

const ChallengeNotification: React.FC<IChallengeNotificationProps> = ({
    title,
    body,
    challengeId,
    notificationId,
}) => {
    const alert = useAlert();
    const { multiAuthRequest } = useAuthorizeRequest();
    const acceptHandler = () => {
        console.log({ challengeId });
    };

    const cancelHandler = async () => {
        const { error } = await multiAuthRequest([
            removeChallenge.bind(this, challengeId),
            removeNotifiation.bind(this, notificationId),
        ]);
        if (error) {
            alert.error("couldn't remove challenge");
        }
    };

    return (
        <CustomNotification
            title={title}
            body={body}
            onSuccess={acceptHandler}
            onCancel={cancelHandler}
        />
    );
};

export default ChallengeNotification;
