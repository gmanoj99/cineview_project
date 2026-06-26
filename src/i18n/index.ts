import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enCommon from "./locales/en/common.json";
import enAuth from "./locales/en/auth.json";
import enMovies from "./locales/en/movies.json";
import enTv from "./locales/en/tv.json";
import enSearch from "./locales/en/search.json";
import enSettings from "./locales/en/settings.json";
import enCollection from "./locales/en/collection.json";

import esCommon from "./locales/es/common.json";
import esAuth from "./locales/es/auth.json";
import esMovies from "./locales/es/movies.json";
import esTv from "./locales/es/tv.json";
import esSearch from "./locales/es/search.json";
import esSettings from "./locales/es/settings.json";
import esCollection from "./locales/es/collection.json";

import { loadPreferences } from "../Preferences/data/preferencesStorage";

export const NAMESPACES = [
    "common",
    "auth",
    "movies",
    "tv",
    "search",
    "settings",
    "collection",
] as const;

export const resources = {
    en: {
        common: enCommon,
        auth: enAuth,
        movies: enMovies,
        tv: enTv,
        search: enSearch,
        settings: enSettings,
        collection: enCollection,
    },
    es: {
        common: esCommon,
        auth: esAuth,
        movies: esMovies,
        tv: esTv,
        search: esSearch,
        settings: esSettings,
        collection: esCollection,
    },
} as const;

void i18n.use(initReactI18next).init({
    resources,
    lng: loadPreferences().language ?? "en",
    fallbackLng: "en",
    ns: NAMESPACES as unknown as string[],
    defaultNS: "common",
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;