import { autorun, makeAutoObservable, toJS } from "mobx";
import { v4 as uuidv4 } from "uuid";

import type { MediaItem } from "../../Common/data/tmdbSchemas";
import { loadWatchlist, saveWatchlist } from "../data/watchlistStorage";
import {
    NOTE_MAX_LENGTH,
    watchlistEntrySchema,
    watchlistKey,
    type MediaRefType,
    type WatchlistEntry,
    type WatchlistStatus,
} from "../data/watchlistSchemas";

function mediaTypeOf(item: MediaItem): MediaRefType {
    return item.media_type === "tv" ? "tv" : "movie";
}

export class WatchlistStore {
    entries: WatchlistEntry[] = [];

    constructor() {
        this.entries = loadWatchlist();
        makeAutoObservable(this);

        // Persist (validated) on any change to entries, notes, or status.
        autorun(() => {
            saveWatchlist(toJS(this.entries));
        });
    }

    // O(1) lookups; recomputed only when entries change.
    get index(): Map<string, WatchlistEntry> {
        const map = new Map<string, WatchlistEntry>();
        for (const entry of this.entries) {
            map.set(watchlistKey(entry.mediaId, entry.mediaType), entry);
        }
        return map;
    }

    get count(): number {
        return this.entries.length;
    }

    get countsByStatus(): Record<WatchlistStatus, number> {
        const counts: Record<WatchlistStatus, number> = {
            want: 0,
            watching: 0,
            completed: 0,
        };
        for (const entry of this.entries) {
            counts[entry.status] += 1;
        }
        return counts;
    }

    has(mediaId: number, mediaType: MediaRefType): boolean {
        return this.index.has(watchlistKey(mediaId, mediaType));
    }

    isInList(item: MediaItem): boolean {
        return this.has(item.id, mediaTypeOf(item));
    }

    add(item: MediaItem, status: WatchlistStatus = "want"): void {
        const mediaType = mediaTypeOf(item);
        if (this.has(item.id, mediaType)) {
            return;
        }

        const now = Date.now();
        const candidate: WatchlistEntry = {
            id: uuidv4(),
            mediaId: item.id,
            mediaType,
            status,
            note: "",
            snapshot: {
                title: item.title ?? item.name ?? "Untitled",
                posterPath: item.poster_path ?? null,
                voteAverage: item.vote_average,
            },
            createdAt: now,
            updatedAt: now,
        };

        const parsed = watchlistEntrySchema.safeParse(candidate);
        if (!parsed.success) {
            console.error("Invalid watchlist entry", parsed.error);
            return;
        }

        this.entries.push(parsed.data);
    }

    remove(id: string): void {
        this.entries = this.entries.filter((entry) => entry.id !== id);
    }

    // Adds with "want to watch" if absent, removes if present.
    toggle(item: MediaItem): void {
        const mediaType = mediaTypeOf(item);
        const existing = this.index.get(watchlistKey(item.id, mediaType));
        if (existing) {
            this.remove(existing.id);
        } else {
            this.add(item);
        }
    }

    updateStatus(id: string, status: WatchlistStatus): void {
        const entry = this.entries.find((e) => e.id === id);
        if (!entry) {
            return;
        }
        entry.status = status;
        entry.updatedAt = Date.now();
    }

    updateNote(id: string, note: string): void {
        const entry = this.entries.find((e) => e.id === id);
        if (!entry) {
            return;
        }
        // Enforce the model's max length before writing.
        const next = note.slice(0, NOTE_MAX_LENGTH);
        entry.note = next;
        entry.updatedAt = Date.now();
    }
}

// Single shared instance (same pattern as preferencesStore).
export const watchlistStore = new WatchlistStore();