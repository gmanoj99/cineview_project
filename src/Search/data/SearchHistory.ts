import { z } from "zod";

const HISTORY_KEY = "cineview.searchHistory";
const MAX_ITEMS = 8;
const historySchema = z.array(z.string());

export function getHistory(): string[] {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) {
        return [];
    }
    try {
        const parsed: unknown = JSON.parse(raw);
        const result = historySchema.safeParse(parsed);
        return result.success ? result.data : [];
    } catch {
        return [];
    }
}

export function addToHistory(term: string): string[] {
    const trimmed = term.trim();
    if (!trimmed) {
        return getHistory();
    }
    const existing = getHistory().filter(
        (item) => item.toLowerCase() !== trimmed.toLowerCase()
    );
    const next = [trimmed, ...existing].slice(0, MAX_ITEMS);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
    return next;
}

export function clearHistory(): void {
    localStorage.removeItem(HISTORY_KEY);
}