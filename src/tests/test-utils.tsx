import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { MemoryRouter } from "react-router-dom";

import { AuthProvider } from "../Auth/ui/AuthContext";
import { PreferencesProvider } from "../Preferences/state/PreferencesContext";
import { WatchlistProvider } from "../Collection/state/WatchlistContext";

export function renderWithProviders(ui: ReactElement, { route = "/" } = {}) {
    return render(
        <PreferencesProvider>
            <AuthProvider>
                <WatchlistProvider>
                    <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
                </WatchlistProvider>
            </AuthProvider>
        </PreferencesProvider>
    );
}