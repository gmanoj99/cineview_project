import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import "./i18n";
import { AuthProvider } from "./Auth/ui/AuthContext";
import { PreferencesProvider } from "./Preferences/state/PreferencesContext";
import { router } from "./router/router";

import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <PreferencesProvider>
            <AuthProvider>
                <RouterProvider router={router} />
            </AuthProvider>
        </PreferencesProvider>
    </React.StrictMode>
);