import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "@emotion/react";
import { mainTheme } from "./theme/themes.tsx";
import { BrowserRouter } from "react-router-dom";
import { store } from "./app/store.ts";
import { Provider } from "react-redux";
import Notification from "./components/layout/Notification.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
        <ThemeProvider theme={mainTheme}>
            <Provider store={store}>
                <App />
                <Notification />
            </Provider>
        </ThemeProvider>
    </BrowserRouter>
);
