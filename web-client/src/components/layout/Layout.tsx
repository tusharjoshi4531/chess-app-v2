import React from "react";
import ResponsiveDrawer from "./ResponsiveDrawer";
import DrawerContent from "./DrawerContent";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import { IUserState } from "../../app/features/user/userSlice";
import { IStore } from "../../app/store";

interface LayoutProps {
    children: React.ReactNode;
}

const drawerButtonGroups = [["Home", "Game"], ["Social"]];

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const navigate = useNavigate();
    const user = useSelector<IStore, IUserState>((state) => state.user);

    console.log(user);

    const onClick = (buttonClick: string) => {
        navigate(`/${buttonClick}`);
    };

    return (
        <ResponsiveDrawer
            title="Chess"
            mainContent={children}
            drawerContent={
                <Box>
                    <DrawerContent
                        username={user.username}
                        buttonGroups={drawerButtonGroups}
                        onClick={onClick}
                    />
                </Box>
            }
        />
    );
};

export default Layout;
