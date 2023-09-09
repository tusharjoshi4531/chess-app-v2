import CustomNotification from "./CustomNotification";

interface IChallengeNotificationProps {
    title: string;
    body: string;
    challengeId: string;
}

const ChallengeNotification: React.FC<IChallengeNotificationProps> = ({
    title,
    body,
    challengeId,
}) => {
    const acceptHandler = () => {

    }

    const cancelHandler = () => {

    }
    
    return <CustomNotification title={title} body={body} />;
};

export default ChallengeNotification;
