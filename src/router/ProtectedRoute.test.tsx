import { render, screen } from "@testing-library/react";
import { beforeEach } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { AuthProvider } from "../Auth/ui/AuthContext";
import ProtectedRoute from "./ProtectedRoute";

beforeEach(() => {
    localStorage.clear();
});

test("redirects unauthenticated users to login", () => {
    render(
        <AuthProvider>
            <MemoryRouter initialEntries={["/watchlist"]}>
                <Routes>
                    <Route path="/login" element={<h1>Login Screen</h1>} />
                    <Route element={<ProtectedRoute />}>
                        <Route
                            path="/watchlist"
                            element={<h1>Watchlist Screen</h1>}
                        />
                    </Route>
                </Routes>
            </MemoryRouter>
        </AuthProvider>
    );

    expect(screen.getByText("Login Screen")).toBeInTheDocument();
});