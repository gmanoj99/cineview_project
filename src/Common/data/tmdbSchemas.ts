import { z } from "zod";

export const genreSchema = z.object({
    id: z.number(),
    name: z.string(),
});
export type Genre = z.infer<typeof genreSchema>;

export const genreListSchema = z.object({
    genres: z.array(genreSchema),
});

export const mediaItemSchema = z.object({
    id: z.number(),
    title: z.string().optional(),
    name: z.string().optional(),
    poster_path: z.string().nullable().optional(),
    backdrop_path: z.string().nullable().optional(),
    profile_path: z.string().nullable().optional(),
    vote_average: z.number().optional(),
    release_date: z.string().optional(),
    first_air_date: z.string().optional(),
    overview: z.string().optional(),
    media_type: z.enum(["movie", "tv", "person"]).optional(),
});
export type MediaItem = z.infer<typeof mediaItemSchema>;

export const paginatedMediaSchema = z.object({
    page: z.number(),
    results: z.array(mediaItemSchema),
    total_pages: z.number().optional(),
    total_results: z.number().optional(),
});
export type PaginatedMedia = z.infer<typeof paginatedMediaSchema>;

export const videoSchema = z.object({
    id: z.string(),
    key: z.string(),
    name: z.string(),
    site: z.string(),
    type: z.string(),
    official: z.boolean().optional(),
});
export const videosSchema = z.object({ results: z.array(videoSchema) });
export type Video = z.infer<typeof videoSchema>;

export const castMemberSchema = z.object({
    id: z.number(),
    name: z.string(),
    character: z.string().optional(),
    profile_path: z.string().nullable().optional(),
});
export const creditsSchema = z.object({ cast: z.array(castMemberSchema) });
export type CastMember = z.infer<typeof castMemberSchema>;

export const movieDetailsSchema = z.object({
    id: z.number(),
    title: z.string(),
    overview: z.string().nullable().optional(),
    poster_path: z.string().nullable().optional(),
    backdrop_path: z.string().nullable().optional(),
    vote_average: z.number().optional(),
    runtime: z.number().nullable().optional(),
    release_date: z.string().optional(),
    tagline: z.string().nullable().optional(),
    genres: z.array(genreSchema).optional(),
    videos: videosSchema.optional(),
    credits: creditsSchema.optional(),
    similar: paginatedMediaSchema.optional(),
    recommendations: paginatedMediaSchema.optional(),
});
export type MovieDetails = z.infer<typeof movieDetailsSchema>;

export const seasonSummarySchema = z.object({
    id: z.number(),
    name: z.string(),
    season_number: z.number(),
    episode_count: z.number().optional(),
    poster_path: z.string().nullable().optional(),
    air_date: z.string().nullable().optional(),
});
export type SeasonSummary = z.infer<typeof seasonSummarySchema>;

export const tvDetailsSchema = z.object({
    id: z.number(),
    name: z.string(),
    overview: z.string().nullable().optional(),
    poster_path: z.string().nullable().optional(),
    backdrop_path: z.string().nullable().optional(),
    vote_average: z.number().optional(),
    first_air_date: z.string().optional(),
    number_of_seasons: z.number().optional(),
    genres: z.array(genreSchema).optional(),
    seasons: z.array(seasonSummarySchema).optional(),
    videos: videosSchema.optional(),
});
export type TvDetails = z.infer<typeof tvDetailsSchema>;

export const episodeSchema = z.object({
    id: z.number(),
    name: z.string(),
    episode_number: z.number(),
    overview: z.string().nullable().optional(),
    still_path: z.string().nullable().optional(),
    air_date: z.string().nullable().optional(),
    vote_average: z.number().optional(),
    runtime: z.number().nullable().optional(),
});
export type Episode = z.infer<typeof episodeSchema>;

export const seasonDetailsSchema = z.object({
    id: z.number(),
    name: z.string(),
    season_number: z.number(),
    overview: z.string().nullable().optional(),
    poster_path: z.string().nullable().optional(),
    air_date: z.string().nullable().optional(),
    episodes: z.array(episodeSchema),
});
export type SeasonDetails = z.infer<typeof seasonDetailsSchema>;