import { mediaItemSchema, paginatedMediaSchema } from "./tmdbSchemas";

test("accepts a valid paginated media response", () => {
    const sample = {
        page: 1,
        results: [{ id: 1, title: "Inception", vote_average: 8.3 }],
    };
    expect(paginatedMediaSchema.safeParse(sample).success).toBe(true);
});

test("rejects a media item without an id", () => {
    expect(mediaItemSchema.safeParse({ title: "No id" }).success).toBe(false);
});