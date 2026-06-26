export type Language = "en" | "es";
export type Theme = "light" | "dark";
export type Region = string;

export const LANGUAGES: Language[] = ["en", "es"];

export const REGIONS = [
    "US",
    "GB",
    "ES",
    "IN",
    "FR",
    "DE",
    "JP",
    "BR",
    "MX",
] as const;