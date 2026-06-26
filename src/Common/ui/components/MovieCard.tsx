import { Link } from "react-router-dom";

import { posterUrl } from "../../core/images";
import type { MediaItem } from "../../data/tmdbSchemas";

interface MovieCardProps {
    item: MediaItem;
    isInWatchlist?: boolean;
    onToggleWatchlist?: () => void;
}

export default function MovieCard({
    item,
    isInWatchlist = false,
    onToggleWatchlist,
}: MovieCardProps) {
    const title = item.title ?? item.name ?? "Untitled";
    const poster = posterUrl(item.poster_path);
    const rating = item.vote_average ? item.vote_average.toFixed(1) : "—";
    const to = item.media_type === "tv" ? `/tv/${item.id}` : `/movie/${item.id}`;

    return (
        <div className="movie-card">
            <Link to={to} className="movie-card__link">
                <div className="movie-card__poster">
                    {poster ? (
                        <img src={poster} alt={title} loading="lazy" />
                    ) : (
                        <div className="movie-card__placeholder">No image</div>
                    )}
                    <span className="movie-card__rating">★ {rating}</span>
                </div>
                <p className="movie-card__title">{title}</p>
            </Link>
            {/* Watchlist toggle is a placeholder — wired in Milestone 5 */}
            <button
                type="button"
                className={
                    isInWatchlist
                        ? "movie-card__wl movie-card__wl--active"
                        : "movie-card__wl"
                }
                onClick={onToggleWatchlist}
                disabled={!onToggleWatchlist}
                aria-label="Toggle watchlist"
            >
                {isInWatchlist ? "✓ In list" : "+ Watchlist"}
            </button>
        </div>
    );
}