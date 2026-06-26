import { Link, Outlet, useParams } from "react-router-dom";

import { backdropUrl, posterUrl } from "../../../Common/core/images";
import { tmdbService } from "../../../Common/data/tmdbService";
import { TmdbError } from "../../../Common/data/tmdbClient";
import { useAsync } from "../../../Common/ui/hooks/useAsync";
import "../../../styles/browse.css";

export default function TVShowDetailsPage() {
    const { tvId } = useParams();
    const id = Number(tvId);
    const state = useAsync(() => tmdbService.getTvDetails(id), [id]);

    if (Number.isNaN(id)) {
        return <div className="state state--error">Invalid show id.</div>;
    }
    if (state.status === "loading") {
        return <div className="state state--loading">Loading…</div>;
    }
    if (state.status === "error") {
        const notFound =
            state.error instanceof TmdbError && state.error.status === 404;
        return (
            <div className="state state--error">
                {notFound
                    ? "Show not found (404)."
                    : `Failed to load. ${state.error.message}`}
            </div>
        );
    }

    const show = state.data;
    const backdrop = backdropUrl(show.backdrop_path);

    return (
        <div className="detail">
            <section
                className="detail__hero"
                style={backdrop ? { backgroundImage: `url(${backdrop})` } : undefined}
            >
                <div className="detail__hero-overlay">
                    <h1>{show.name}</h1>
                    <p className="detail__meta">
                        ★ {show.vote_average?.toFixed(1) ?? "—"}
                        {show.number_of_seasons
                            ? ` · ${show.number_of_seasons} seasons`
                            : ""}
                    </p>
                    <p className="detail__genres">
                        {show.genres?.map((g) => g.name).join(", ")}
                    </p>
                    <p className="detail__overview">{show.overview}</p>
                </div>
            </section>

            <h2 className="row__title">Seasons</h2>
            <div className="row__track">
                {(show.seasons ?? []).map((season) => {
                    const poster = posterUrl(season.poster_path);
                    return (
                        <Link
                            key={season.id}
                            to={`/tv/${id}/season/${season.season_number}`}
                            className="movie-card"
                        >
                            <div className="movie-card__poster">
                                {poster ? (
                                    <img src={poster} alt={season.name} loading="lazy" />
                                ) : (
                                    <div className="movie-card__placeholder">
                                        No image
                                    </div>
                                )}
                            </div>
                            <p className="movie-card__title">{season.name}</p>
                        </Link>
                    );
                })}
            </div>

            {/* Nested season detail renders here */}
            <Outlet />
        </div>
    );
}