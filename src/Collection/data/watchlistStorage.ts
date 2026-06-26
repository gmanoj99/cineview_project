import { watchlistSchema, type WatchlistEntry } from "./watchlistSchemas";

export const WATCHLIST_STORAGE_KEY = "cineview.watchlist";

export function loadWatchlist(): WatchlistEntry[] {
    if (typeof localStorage === "undefined") {
        return [];
    }

    const raw = localStorage.getItem(WATCHLIST_STORAGE_KEY);
    if (!raw) {
        return [];
    }

    try {
        const parsed: unknown = JSON.parse(raw);
        const result = watchlistSchema.safeParse(parsed);
        return result.success ? result.data : [];
    } catch {
        return [];
    }
}

// Every write is validated with Zod before it touches localStorage.
export function saveWatchlist(entries: WatchlistEntry[]): void {
    if (typeof localStorage === "undefined") {
        return;
    }

    const result = watchlistSchema.safeParse(entries);
    if (!result.success) {
        console.error("Refusing to persist invalid watchlist", result.error);
        return;
    }

    localStorage.setItem(
        WATCHLIST_STORAGE_KEY,
        JSON.stringify(result.data)
    );
}