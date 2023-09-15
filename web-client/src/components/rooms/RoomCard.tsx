import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import { IStore } from "../../app/store";
import { useNavigate } from "react-router-dom";
import { IRoom } from "../../app/features/rooms/types";

interface IRoomCardProps {
    roomData: IRoom;
}

const RoomCard: React.FC<IRoomCardProps> = ({ roomData }) => {
    const { black, white } = roomData;
    const username = useSelector<IStore, string>(
        (state) => state.user.username
    );

    const navigate = useNavigate();

    const oponent = username === black ? white : black;

    const cardClickHandler = () => {
        navigate(`/game/room/${roomData.id}`);
    };

    return (
        <Card>
            <CardActionArea onClick={cardClickHandler}>
                <CardMedia
                    sx={{ height: 200 }}
                    image="/static/images/cards/contemplative-reptile.jpg"
                    title="green iguana"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        Game with {oponent}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        White: <b>{white}</b>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Black: <b>{black}</b>
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default RoomCard;
