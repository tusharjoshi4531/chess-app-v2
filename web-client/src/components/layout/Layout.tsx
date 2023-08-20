import React from "react";
import ResponsiveDrawer from "./ResponsiveDrawer";
import DrawerContent from "./DrawerContent";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Box from "@mui/material/Box";
import { IUserState, clearUser } from "../../app/features/user/user-slice";
import { IStore } from "../../app/store";
import { logout } from "../../services/auth.service";

interface LayoutProps {
    children: React.ReactNode;
}

const drawerButtonGroups = [["Home", "Game"], ["Social"]];

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const navigate = useNavigate();
    const user = useSelector<IStore, IUserState>((state) => state.user);
    const dispatch = useDispatch();

    console.log(user);

    const onClick = (buttonClick: string) => {
        let targetUrl = `/${buttonClick}`;
        if (buttonClick === "Home") targetUrl = "/";
        if (buttonClick === "Logout") {
            dispatch(clearUser());
            logout(user.userid);
            return
        }
        if (buttonClick === "Profile") return;
        navigate(targetUrl);
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
