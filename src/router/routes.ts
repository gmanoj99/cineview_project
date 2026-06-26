export const ROUTES = {
    HOME: "/",
    LOGIN: "/login",

    SEARCH: "/search",

    MOVIE_DETAILS: "/movie/:movieId",

    TV_SHOW_DETAILS: "/tv/:tvId",

    SEASON_DETAILS: "/tv/:tvId/season/:seasonNumber",

    WATCHLIST: "/watchlist",

    COLLECTIONS: "/collections",

    SETTINGS: "/settings",

    NOT_FOUND: "*",
} as const;