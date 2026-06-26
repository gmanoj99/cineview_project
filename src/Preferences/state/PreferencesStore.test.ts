import { beforeEach, expect, test } from "vitest";

import { PreferencesStore } from "./PreferenceStore";
import {
    loadPreferences,
    PREFERENCES_STORAGE_KEY,
} from "../data/preferencesStorage";

beforeEach(() => {
    localStorage.clear();
});

test("persists language, theme and region to localStorage", () => {
    const store = new PreferencesStore();
    store.setLanguage("es");
    store.setTheme("light");
    store.setRegion("ES");

    expect(loadPreferences()).toEqual({
        language: "es",
        theme: "light",
        region: "ES",
    });
});

test("rehydrates from localStorage on construction", () => {
    localStorage.setItem(
        PREFERENCES_STORAGE_KEY,
        JSON.stringify({ language: "es", theme: "dark", region: "MX" })
    );

    const store = new PreferencesStore();
    expect(store.language).toBe("es");
    expect(store.theme).toBe("dark");
    expect(store.apiLanguage).toBe("es-MX");
});