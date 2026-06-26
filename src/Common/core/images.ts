import { ENV } from "./env";

export function backdropUrl(path: string | null | undefined): string | null {
    return path ? `${ENV.IMAGE_BASE_URL}${path}` : null;
}

export function posterUrl(path: string | null | undefined): string | null {
    return path ? `${ENV.POSTER_BASE_URL}${path}` : null;
}