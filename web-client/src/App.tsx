import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import "./App.css";
import { useSelector } from "react-redux";
import { IStore } from "./app/store";
import HomepageContent from "./components/homepage/HomepageContent";
import { useSocket } from "./hooks/use-socket";
import GamePage from "./pages/GamePage";
import { useNotification } from "./hooks/use-notification";
import { useRooms } from "./hooks/use-rooms";

import { Suspense, lazy } from "react";
import OpenChallengePage from "./pages/OpenChallengePage";

const ChallengeUserForm = lazy(
    () => import("./components/forms/ChallengeUserForm")
);
const GameRoom = lazy(() => import("./components/rooms/GameRoom"));
const NotificationsPage = lazy(() => import("./pages/NotificationsPage"));
const RoomPageContent = lazy(
    () => import("./components/rooms/RoomPageContent")
);
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
// const Room;

const LazyComponent = ({ children }: { children: React.ReactNode }) => (
    <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
);

function App() {
    const userid = useSelector<IStore, string>((state) => state.user.userid);

    useSocket();
    useRooms();
    useNotification();

    return (
        <Layout>
            <Routes>
                <Route path="/" element={<HomePage />}>
                    <Route
                        path=""
                        element={
                            <LazyComponent>
                                <HomepageContent />
                            </LazyComponent>
                        }
                    />
                    <Route
                        path="challenge-user"
                        element={
                            <LazyComponent>
                                <ChallengeUserForm />
                            </LazyComponent>
                        }
                    />
                </Route>
                {userid === "" ? (
                    <>
                        <Route
                            path="/login"
                            element={
                                <LazyComponent>
                                    <LoginPage />
                                </LazyComponent>
                            }
                        />
                        <Route
                            path="/signup"
                            element={
                                <LazyComponent>
                                    <SignupPage />
                                </LazyComponent>
                            }
                        />
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
                            element={
                                <LazyComponent>
                                    <NotificationsPage />
                                </LazyComponent>
                            }
                        />
                    </>
                )}
                <Route path="/game" element={<GamePage />}>
                    <Route
                        path=""
                        element={
                            <LazyComponent>
                                <RoomPageContent />
                            </LazyComponent>
                        }
                    />
                    <Route
                        path="room/:roomid"
                        element={
                            <LazyComponent>
                                <GameRoom />
                            </LazyComponent>
                        }
                    />
                </Route>
                <Route path="/profile" element={<div>Comming Soon</div>} />
                <Route path="/social" element={<div>Comming Soon</div>} />
                <Route path="/open-challenge" element={<OpenChallengePage />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Layout>
    );
}

export default App;
