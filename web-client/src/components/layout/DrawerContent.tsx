import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";
import { Typography } from "@mui/material";

type DrawerButton = string;

export type DrawerButtonGroup = DrawerButton[];

interface ButtonGroupListProps {
    buttonGroup: DrawerButtonGroup;
    onClick: (buttonClicked: string) => void;
}

const ButtonGroupList: React.FC<ButtonGroupListProps> = ({
    buttonGroup,
    onClick,
}) => {
    return (
        <>
            <Divider />
            <List>
                {buttonGroup.map((text) => (
                    <ListItem key={text}>
                        <ListItemButton onClick={onClick.bind(this, text)}>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </>
    );
};

interface DrawerContentProps {
    username: string;
    buttonGroups: DrawerButtonGroup[];
    onClick: (buttonClicked: string) => void;
}

const DrawerContent: React.FC<DrawerContentProps> = ({
    username,
    buttonGroups,
    onClick,
}) => {
    const components = buttonGroups.map((group, index) => (
        <ButtonGroupList buttonGroup={group} key={index} onClick={onClick} />
    ));

    const profileComponent = (
        <>
            <Divider />
            {username && (
                <List>
                    <ListItem>
                        <Typography variant="h4">{username}</Typography>
                    </ListItem>
                    <ListItem>
                        <ListItemButton>
                            <ListItemText primary="Profile" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem>
                        <ListItemButton>
                            <ListItemText primary="Logout" />
                        </ListItemButton>
                    </ListItem>
                </List>
            )}
            {!username && (
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
            )}
        </>
    );

    return (
        <div>
            <Toolbar />
            {profileComponent}
            {components}
        </div>
    );
};

export default DrawerContent;
