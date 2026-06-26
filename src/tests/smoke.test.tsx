import { screen } from "@testing-library/react";
import LoginPage from "../Auth/ui/pages/LoginPage";
import { renderWithProviders } from "./test-utils";

test("renders the login page", () => {
    renderWithProviders(<LoginPage />, { route: "/login" });

    expect(
        screen.getByRole("heading", { name: /sign in to cineview/i })
    ).toBeInTheDocument();
});