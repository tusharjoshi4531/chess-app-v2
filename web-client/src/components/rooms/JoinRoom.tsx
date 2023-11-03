import { Fab, Stack, SxProps } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SpectateUserForm, {
    ISpectateUserFormValues,
} from "../forms/SpectateUserForm";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface IJoinRoomProps {
    sx?: SxProps;
}

const JoinRoom: React.FC<IJoinRoomProps> = ({ sx }) => {
    const navigate = useNavigate();

    const [formIsOpen, setFormIsOpen] = useState(false);

    const onSubmit = ({ roomId }: ISpectateUserFormValues) => {
        navigate(`/game/room/${roomId}`);
    };

    const fabClickHandler = () => {
        setFormIsOpen((state) => !state);
    };

    return (
        <Stack sx={sx} margin={2} spacing={2} alignItems="flex-end">
            {formIsOpen && <SpectateUserForm onSubmit={onSubmit} />}
            <Fab size="small" onClick={fabClickHandler}>
                <VisibilityIcon />
            </Fab>
        </Stack>
    );
};

export default JoinRoom;
