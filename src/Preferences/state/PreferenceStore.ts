import { makeAutoObservable, reaction } from "mobx";

import i18n from "../../i18n";
import { loadPreferences, savePreferences } from "../data/preferencesStorage";
import { applyTheme, resolveInitialTheme } from "./theme";
import type { Language, Region, Theme } from "./types";

export class PreferencesStore {
    language: Language;
    theme: Theme;
    region: Region;

    constructor() {
        const stored = loadPreferences();
        this.language = stored.language ?? "en";
        this.region = stored.region ?? "US";
        this.theme = stored.theme ?? resolveInitialTheme();

        makeAutoObservable(this);

        this.registerSideEffects();
        this.registerPersistence();
    }

    // TMDB expects an ISO language tag such as "en-US".
    get apiLanguage(): string {
        return `${this.language}-${this.region}`;
    }

    setLanguage(language: Language): void {
        this.language = language;
    }

    setRegion(region: Region): void {
        this.region = region;
    }

    setTheme(theme: Theme): void {
        this.theme = theme;
    }

    toggleTheme(): void {
        this.theme = this.theme === "dark" ? "light" : "dark";
    }

    private registerSideEffects(): void {
        reaction(
            () => this.theme,
            (theme) => applyTheme(theme),
            { fireImmediately: true }
        );

        reaction(
            () => this.language,
            (language) => {
                void i18n.changeLanguage(language);
                if (typeof document !== "undefined") {
                    document.documentElement.lang = language;
                }
            },
            { fireImmediately: true }
        );
    }

    private registerPersistence(): void {
        reaction(
            () => ({
                language: this.language,
                theme: this.theme,
                region: this.region,
            }),
            (prefs) => savePreferences(prefs)
        );
    }
}

// Single shared instance — the data layer (tmdbClient) reads from this directly,
// and the React context below distributes the same instance to components.
export const preferencesStore = new PreferencesStore();