import type { Theme } from "./types";

export function resolveInitialTheme(): Theme {
    if (typeof window !== "undefined" && typeof window.matchMedia === "function") {
        return window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
    }
    return "dark";
}

export function applyTheme(theme: Theme): void {
    if (typeof document !== "undefined") {
        document.documentElement.dataset.theme = theme;
    }
}