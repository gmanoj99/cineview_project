import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

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
    const { t } = useTranslation();
    const title = item.title ?? item.name ?? t("movies:card.untitled");
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
                        <div className="movie-card__placeholder">
                            {t("common:state.noImage")}
                        </div>
                    )}
                    <span className="movie-card__rating">
                        {t("common:rating", { value: rating })}
                    </span>
                </div>
                <p className="movie-card__title">{title}</p>
            </Link>
            <button
                type="button"
                className={
                    isInWatchlist
                        ? "movie-card__wl movie-card__wl--active"
                        : "movie-card__wl"
                }
                onClick={onToggleWatchlist}
                disabled={!onToggleWatchlist}
                aria-label={t("movies:card.toggle")}
            >
                {isInWatchlist
                    ? t("movies:card.added")
                    : t("movies:card.add")}
            </button>
        </div>
    );
}