import { tmdbFetch } from "./tmdbClient";
import {
    genreListSchema,
    movieDetailsSchema,
    paginatedMediaSchema,
    seasonDetailsSchema,
    tvDetailsSchema,
} from "./tmdbSchemas";

export const tmdbService = {
    getTrending: () =>
        tmdbFetch("/trending/movie/week", paginatedMediaSchema),
    getPopular: () => tmdbFetch("/movie/popular", paginatedMediaSchema),
    getTopRated: () => tmdbFetch("/movie/top_rated", paginatedMediaSchema),
    getUpcoming: () => tmdbFetch("/movie/upcoming", paginatedMediaSchema),

    getMovieGenres: () => tmdbFetch("/genre/movie/list", genreListSchema),
    discoverByGenre: (genreId: number) =>
        tmdbFetch("/discover/movie", paginatedMediaSchema, {
            with_genres: genreId,
            sort_by: "popularity.desc",
        }),

    getMovieDetails: (id: number) =>
        tmdbFetch(`/movie/${id}`, movieDetailsSchema, {
            append_to_response: "videos,credits,similar,recommendations",
        }),

    getTvDetails: (id: number) =>
        tmdbFetch(`/tv/${id}`, tvDetailsSchema, {
            append_to_response: "videos",
        }),

    getSeasonDetails: (tvId: number, seasonNumber: number) =>
        tmdbFetch(
            `/tv/${tvId}/season/${seasonNumber}`,
            seasonDetailsSchema
        ),

    searchMulti: (query: string) =>
        tmdbFetch("/search/multi", paginatedMediaSchema, { query }),
};