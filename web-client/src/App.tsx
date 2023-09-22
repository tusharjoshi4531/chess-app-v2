import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import "./App.css";
import SignUpForm from "./components/forms/SignUpForm";
import { useSelector } from "react-redux";
import { IStore } from "./app/store";
import HomepageContent from "./components/homepage/HomepageContent";
import ChallengeUserForm from "./components/forms/ChallengeUserForm";
import { useSocket } from "./hooks/use-socket";
import NotificationsPage from "./pages/NotificationsPage";
import GamePage from "./pages/GamePage";
import RoomPageContent from "./components/rooms/RoomPageContent";
import GameRoom from "./components/rooms/GameRoom";
import { useNotification } from "./hooks/use-notification";
import { useRooms } from "./hooks/use-rooms";

function App() {
    const userid = useSelector<IStore, string>((state) => state.user.userid);

    useSocket();
    useRooms();
    useNotification();

    return (
        <Layout>
            <Routes>
                <Route path="/" element={<HomePage />}>
                    <Route path="" element={<HomepageContent />} />
                    <Route
                        path="challenge-user"
                        element={<ChallengeUserForm />}
                    />
                </Route>
                {userid === "" ? (
                    <>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignUpForm />} />
                        <Route
                            path="/notification"
                            element={<Navigate to="/" />}
                        />
                    </>
                ) : (
                    <>
                        <Route path="/login" element={<Navigate to="/" />} />
                        <Route path="/signup" element={<Navigate to="/" />} />
                        <Route
                            path="/notification"
                            element={<NotificationsPage />}
                        />
                    </>
                )}
                <Route path="/game" element={<GamePage />}>
                    <Route path="" element={<RoomPageContent />} />
                    <Route path="room/:roomid" element={<GameRoom />} />
                </Route>
                <Route path="/profile" element={<div>Comming Soon</div>} />
                <Route path="/social" element={<div>Comming Soon</div>} />
                <Route path="/open-challenge" element={<div>Comming Soon</div>} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Layout>
    );
}

export default App;
