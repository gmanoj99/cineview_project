const required = (key: string, value: string | undefined): string => {
    if (!value) {
        throw new Error(`Missing environment variable: ${key}`);
    }
    return value;
};

export const ENV = {
    TMDB_API_KEY: required("VITE_TMDB_API_KEY", import.meta.env.VITE_TMDB_API_KEY),
    TMDB_BASE_URL: required("VITE_TMDB_BASE_URL", import.meta.env.VITE_TMDB_BASE_URL),
    IMAGE_BASE_URL:
        import.meta.env.VITE_TMDB_IMAGE_BASE_URL ??
        "https://image.tmdb.org/t/p/original",
    POSTER_BASE_URL:
        import.meta.env.VITE_TMDB_POSTER_BASE_URL ??
        "https://image.tmdb.org/t/p/w500",
};