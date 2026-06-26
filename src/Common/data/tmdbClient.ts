import type { ZodType } from "zod";

import { ENV } from "../core/env";

export class TmdbError extends Error {
    status: number;
    constructor(status: number, message: string) {
        super(message);
        this.name = "TmdbError";
        this.status = status;
    }
}

export async function tmdbFetch<T>(
    path: string,
    schema: ZodType<T>,
    params: Record<string, string | number> = {}
): Promise<T> {
    const url = new URL(`${ENV.TMDB_BASE_URL}${path}`);
    url.searchParams.set("api_key", ENV.TMDB_API_KEY);
    for (const [key, value] of Object.entries(params)) {
        url.searchParams.set(key, String(value));
    }

    const response = await fetch(url.toString());
    if (!response.ok) {
        throw new TmdbError(
            response.status,
            `TMDB request failed (${response.status})`
        );
    }

    const json: unknown = await response.json();
    const parsed = schema.safeParse(json);
    if (!parsed.success) {
        throw new Error(`Invalid TMDB response for ${path}`);
    }
    return parsed.data;
}