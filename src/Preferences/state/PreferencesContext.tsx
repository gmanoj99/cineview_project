import { createContext, useContext } from "react";
import type { ReactNode } from "react";

import { PreferencesStore, preferencesStore } from "./PreferenceStore";

const PreferencesContext = createContext<PreferencesStore>(preferencesStore);

export function PreferencesProvider({ children }: { children: ReactNode }) {
    return (
        <PreferencesContext value={preferencesStore}>
            {children}
        </PreferencesContext>
    );
}

export function usePreferences(): PreferencesStore {
    return useContext(PreferencesContext);
}