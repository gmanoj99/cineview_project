import { z } from "zod";

export const PREFERENCES_STORAGE_KEY = "cineview.preferences";

const storedPreferencesSchema = z.object({
    language: z.enum(["en", "es"]).optional(),
    theme: z.enum(["light", "dark"]).optional(),
    region: z.string().optional(),
});

export type StoredPreferences = z.infer<typeof storedPreferencesSchema>;

export function loadPreferences(): StoredPreferences {
    if (typeof localStorage === "undefined") {
        return {};
    }

    const raw = localStorage.getItem(PREFERENCES_STORAGE_KEY);
    if (!raw) {
        return {};
    }

    try {
        const parsed: unknown = JSON.parse(raw);
        const result = storedPreferencesSchema.safeParse(parsed);
        return result.success ? result.data : {};
    } catch {
        return {};
    }
}

export function savePreferences(prefs: StoredPreferences): void {
    if (typeof localStorage === "undefined") {
        return;
    }
    localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(prefs));
}