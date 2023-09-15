import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";
import { Badge, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { IStore } from "../../app/store";

type DrawerButton = string;

export type DrawerButtonGroup = DrawerButton[];

interface IButtonGroupListProps {
    onClick: (buttonClicked: string) => void;
}

const CommonButtonGroup: React.FC<IButtonGroupListProps> = ({ onClick }) => {
    const count = useSelector<IStore, number>((state) => state.rooms.count);
    return (
        <>
            <Divider />
            <List>
                <ListItem>
                    <ListItemButton onClick={onClick.bind(this, "Home")}>
                        <ListItemText primary={"Home"} />
                    </ListItemButton>
                </ListItem>
                <ListItem>
                    <Badge
                        badgeContent={count}
                        color="secondary"
                        overlap="rectangular"
                        variant="standard"
                    >
                        <ListItemButton onClick={onClick.bind(this, "Game")}>
                            <ListItemText primary={"Game"} />
                        </ListItemButton>
                    </Badge>
                </ListItem>
            </List>
            <Divider />
            <List>
                <ListItem>
                    <ListItemButton onClick={onClick.bind(this, "Social")}>
                        <ListItemText primary={"Social"} />
                    </ListItemButton>
                </ListItem>
            </List>
        </>
    );
};

const AuthenticatedProfileButtonGroup: React.FC<IButtonGroupListProps> = ({
    onClick,
}) => {
    const count = useSelector<IStore, number>(
        (state) => state.notification.count
    );

    return (
        <List>
            <ListItem>
                <ListItemButton>
                    <ListItemText
                        primary="Profile"
                        onClick={onClick.bind(this, "Profile")}
                    />
                </ListItemButton>
            </ListItem>
            <ListItem>
                <ListItemButton>
                    <Badge
                        badgeContent={count}
                        color="secondary"
                        overlap="rectangular"
                        variant="standard"
                    >
                        <ListItemText
                            primary="Notification"
                            onClick={onClick.bind(this, "Notification")}
                        />
                    </Badge>
                </ListItemButton>
            </ListItem>
            <ListItem>
                <ListItemButton>
                    <ListItemText
                        primary="Logout"
                        onClick={onClick.bind(this, "Logout")}
                    />
                </ListItemButton>
            </ListItem>
        </List>
    );
};

const UnauthenticatedProfileButtonGroup: React.FC<IButtonGroupListProps> = ({
    onClick,
}) => {
    return (
        <List>
            <ListItem>
                <ListItemButton>
                    <ListItemText
                        primary="Login"
                        onClick={onClick.bind(this, "Login")}
                    />
                </ListItemButton>
            </ListItem>
            <ListItem>
                <ListItemButton>
                    <ListItemText
                        primary="Signup"
                        onClick={onClick.bind(this, "Signup")}
                    />
                </ListItemButton>
            </ListItem>
        </List>
    );
};

interface DrawerContentProps {
    username: string;
    onClick: (buttonClicked: string) => void;
}

const DrawerContent: React.FC<DrawerContentProps> = ({ username, onClick }) => {
    return (
        <div>
            <Toolbar />
            <Divider />

            {username && (
                <>
                    <ListItem>
                        <Typography variant="h4" marginTop={2}>
                            {username}
                        </Typography>
                    </ListItem>
                    <AuthenticatedProfileButtonGroup onClick={onClick} />
                </>
            )}
            {!username && (
                <UnauthenticatedProfileButtonGroup onClick={onClick} />
            )}
            <CommonButtonGroup onClick={onClick} />
        </div>
    );
};

export default DrawerContent;
