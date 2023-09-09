import { useSelector } from "react-redux";
import { useAlert } from "../../hooks/use-alert";
import { useAuthorizeRequest } from "../../hooks/use-authorize-request";
import {
    acceptChallenge,
    removeChallenge,
} from "../../services/challenge.service";
import { removeNotifiation } from "../../services/notification.service";
import CustomNotification from "./CustomNotification";
import { IStore } from "../../app/store";

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

    const username = useSelector<IStore, string>(
        (state) => state.user.username
    );

    const acceptHandler = async () => {
        const results = await multiAuthRequest([
            acceptChallenge.bind(this, challengeId, username),
            removeNotifiation.bind(this, notificationId),
        ]);

        const { response, error: errorAccept } = results[0];
        if (errorAccept) alert.error("couldn't accept challenge");

        console.log(results); 

        if (results.length > 1) {
            const { error: errorNotif } = results[1];
            if (errorNotif) alert.error("couldn't remove notification");
        }

        console.log(response);
    };

    const cancelHandler = async () => {
        const results = await multiAuthRequest([
            removeChallenge.bind(this, challengeId),
            removeNotifiation.bind(this, notificationId),
        ]);
        const { error } = results[1];
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
