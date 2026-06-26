import { createContext, useContext } from "react";
import type { ReactNode } from "react";

import { WatchlistStore, watchlistStore } from "./WatchlistStore";

const WatchlistContext = createContext<WatchlistStore>(watchlistStore);

export function WatchlistProvider({ children }: { children: ReactNode }) {
    return (
        <WatchlistContext value={watchlistStore}>{children}</WatchlistContext>
    );
}

export function useWatchlist(): WatchlistStore {
    return useContext(WatchlistContext);
}