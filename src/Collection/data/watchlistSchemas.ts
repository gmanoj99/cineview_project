import { z } from "zod";

export const WATCHLIST_STATUSES = ["want", "watching", "completed"] as const;
export const watchlistStatusSchema = z.enum(WATCHLIST_STATUSES);
export type WatchlistStatus = z.infer<typeof watchlistStatusSchema>;

export const mediaRefTypeSchema = z.enum(["movie", "tv"]);
export type MediaRefType = z.infer<typeof mediaRefTypeSchema>;

export const NOTE_MAX_LENGTH = 300;

// Cached so the watchlist page renders without re-fetching from TMDB.
export const mediaSnapshotSchema = z.object({
    title: z.string(),
    posterPath: z.string().nullable(),
    voteAverage: z.number().optional(),
});
export type MediaSnapshot = z.infer<typeof mediaSnapshotSchema>;

export const watchlistEntrySchema = z.object({
    id: z.string().min(1),
    mediaId: z.number().int(),
    mediaType: mediaRefTypeSchema,
    status: watchlistStatusSchema,
    note: z.string().max(NOTE_MAX_LENGTH).default(""),
    snapshot: mediaSnapshotSchema,
    createdAt: z.number().int(),
    updatedAt: z.number().int(),
});
export type WatchlistEntry = z.infer<typeof watchlistEntrySchema>;

export const watchlistSchema = z.array(watchlistEntrySchema);

export function watchlistKey(mediaId: number, mediaType: MediaRefType): string {
    return `${mediaType}:${mediaId}`;
}