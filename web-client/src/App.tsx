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

function App() {
    const userid = useSelector<IStore, string>((state) => state.user.userid);

    useSocket();

    return (
        <Layout>
            <Routes>
                <Route path="/" element={<HomePage />}>
                    <Route path="" element={<HomepageContent />} />
                    <Route
                        path="challenge-user"
                        element={<ChallengeUserForm />}
                    />
                    {/* <Route path="challenge-user" element={<div>Hello</div>} /> */}
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
            </Routes>
        </Layout>
    );
}

export default App;
