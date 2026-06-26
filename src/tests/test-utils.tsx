import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { MemoryRouter } from "react-router-dom";

import { AuthProvider } from "../Auth/ui/AuthContext";
import { PreferencesProvider } from "../Preferences/state/PreferencesContext";

export function renderWithProviders(ui: ReactElement, { route = "/" } = {}) {
    return render(
        <PreferencesProvider>
            <AuthProvider>
                <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
            </AuthProvider>
        </PreferencesProvider>
    );
}