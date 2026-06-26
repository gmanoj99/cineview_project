import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { AuthProvider } from "../AuthContext";
import { SESSION_STORAGE_KEY } from "../../core/constants";
import LoginPage from "./LoginPage";

function renderLogin(initialEntry = "/login") {
    return render(
        <AuthProvider>
            <MemoryRouter initialEntries={[initialEntry]}>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/" element={<h1>Home Screen</h1>} />
                </Routes>
            </MemoryRouter>
        </AuthProvider>
    );
}

beforeEach(() => {
    localStorage.clear();
});

test("shows an inline error for invalid credentials", async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByLabelText("Username"), "wrong");
    await user.type(screen.getByLabelText("Password"), "creds");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(
        await screen.findByText(/invalid username or password/i)
    ).toBeInTheDocument();
});

test("logs in with valid credentials and redirects home", async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByLabelText("Username"), "admin");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByText("Home Screen")).toBeInTheDocument();
});

test("redirects an already-authenticated user away from /login", () => {
    localStorage.setItem(
        SESSION_STORAGE_KEY,
        JSON.stringify({ username: "admin" })
    );
    renderLogin();

    expect(screen.getByText("Home Screen")).toBeInTheDocument();
});

test("toggles password visibility", async () => {
    const user = userEvent.setup();
    renderLogin();

    const password = screen.getByLabelText("Password");
    expect(password).toHaveAttribute("type", "password");

    await user.click(screen.getByRole("button", { name: /show password/i }));
    expect(password).toHaveAttribute("type", "text");
});