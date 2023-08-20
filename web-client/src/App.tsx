import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import "./App.css";
import SignUpForm from "./components/forms/SignUpForm";
import { useSelector } from "react-redux";
import { IStore } from "./app/store";

function App() {
    const userid = useSelector<IStore, string>((state) => state.user.userid);

    return (
        <Layout>
            <Routes>
                <Route path="/" element={<HomePage />} />
                {userid === "" ? (
                    <>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignUpForm />} />
                    </>
                ) : (
                    <>
                        <Route path="/login" element={<Navigate to="/" />} />
                        <Route path="/signup" element={<Navigate to="/" />} />
                    </>
                )}
            </Routes>
        </Layout>
    );
}

export default App;
