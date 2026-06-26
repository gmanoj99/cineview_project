import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { MemoryRouter } from "react-router-dom";

import { AuthProvider } from "../Auth/ui/AuthContext";

export function renderWithProviders(
    ui: ReactElement,
    { route = "/" } = {}
) {
    return render(
        <AuthProvider>
            <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
        </AuthProvider>
    );
}