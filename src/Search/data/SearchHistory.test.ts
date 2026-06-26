import { beforeEach } from "vitest";

import { addToHistory, clearHistory, getHistory } from "./SearchHistory";

beforeEach(() => {
    localStorage.clear();
});

test("returns an empty array when nothing is stored", () => {
    expect(getHistory()).toEqual([]);
});

test("prepends new terms and dedupes case-insensitively", () => {
    addToHistory("Batman");
    addToHistory("Joker");
    const result = addToHistory("batman");

    expect(result).toEqual(["batman", "Joker"]);
});

test("caps history at 8 entries", () => {
    for (let i = 0; i < 12; i += 1) {
        addToHistory(`term-${i}`);
    }
    expect(getHistory()).toHaveLength(8);
});

test("clearHistory empties storage", () => {
    addToHistory("inception");
    clearHistory();
    expect(getHistory()).toEqual([]);
});