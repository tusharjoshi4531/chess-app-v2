import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "@emotion/react";
import { mainTheme } from "./theme/themes.tsx";
import { BrowserRouter } from "react-router-dom";
import { store } from "./app/store.ts";
import { Provider } from "react-redux";
import Alert from "./components/layout/Alert.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
        <ThemeProvider theme={mainTheme}>
            <Provider store={store}>
                <App />
                <Alert />
            </Provider>
        </ThemeProvider>
    </BrowserRouter>
);
