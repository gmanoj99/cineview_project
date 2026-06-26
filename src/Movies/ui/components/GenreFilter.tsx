import type { Genre } from "../../../Common/data/tmdbSchemas";

interface GenreFilterProps {
    genres: Genre[];
    activeGenreId: number | null;
    onSelect: (id: number | null) => void;
}

export default function GenreFilter({
    genres,
    activeGenreId,
    onSelect,
}: GenreFilterProps) {
    return (
        <div className="genre-filter">
            <button
                type="button"
                className={
                    activeGenreId === null
                        ? "chip chip--active"
                        : "chip"
                }
                onClick={() => onSelect(null)}
            >
                All
            </button>
            {genres.map((genre) => (
                <button
                    key={genre.id}
                    type="button"
                    className={
                        activeGenreId === genre.id
                            ? "chip chip--active"
                            : "chip"
                    }
                    onClick={() => onSelect(genre.id)}
                >
                    {genre.name}
                </button>
            ))}
        </div>
    );
}