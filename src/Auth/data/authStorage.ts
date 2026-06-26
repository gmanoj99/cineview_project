import { z } from "zod";

import { SESSION_STORAGE_KEY } from "../core/constants";

const sessionSchema = z.object({
    username: z.string().min(1),
});

export type Session = z.infer<typeof sessionSchema>;

export function readSession(): Session | null {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) {
        return null;
    }

    try {
        const parsed: unknown = JSON.parse(raw);
        const result = sessionSchema.safeParse(parsed);
        return result.success ? result.data : null;
    } catch {
        return null;
    }
}

export function writeSession(session: Session): void {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

export function clearSession(): void {
    localStorage.removeItem(SESSION_STORAGE_KEY);
}