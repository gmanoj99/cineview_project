import { Link, Outlet, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { backdropUrl, posterUrl } from "../../../Common/core/images";
import { tmdbService } from "../../../Common/data/tmdbService";
import { TmdbError } from "../../../Common/data/tmdbClient";
import { useAsync } from "../../../Common/ui/hooks/useAsync";
import "../../../styles/browse.css";
import WatchlistButton from "../../../Collection/ui/components/WatchlistButton";
export default function TVShowDetailsPage() {
    const { tvId } = useParams();
    const { t } = useTranslation();
    const id = Number(tvId);
    const state = useAsync(() => tmdbService.getTvDetails(id), [id]);

    if (Number.isNaN(id)) {
        return (
            <div className="state state--error">{t("tv:details.invalidId")}</div>
        );
    }
    if (state.status === "loading") {
        return (
            <div className="state state--loading">
                {t("common:state.loading")}
            </div>
        );
    }
    if (state.status === "error") {
        const notFound =
            state.error instanceof TmdbError && state.error.status === 404;
        return (
            <div className="state state--error">
                {notFound
                    ? t("tv:details.notFound")
                    : t("common:state.failedWith", {
                          message: state.error.message,
                      })}
            </div>
        );
    }

    const show = state.data;
    const backdrop = backdropUrl(show.backdrop_path);

    return (
        <div className="detail">
            <section
                className="detail__hero"
                style={
                    backdrop
                        ? { backgroundImage: `url(${backdrop})` }
                        : undefined
                }
            >
                <div className="detail__hero-overlay">
                    <h1>{show.name}</h1>
                    <p className="detail__meta">
                        {t("common:rating", {
                            value: show.vote_average?.toFixed(1) ?? "—",
                        })}
                        {show.number_of_seasons
                            ? ` · ${t("tv:details.seasonCount", {
                                  count: show.number_of_seasons,
                              })}`
                            : ""}
                    </p>
                    <p className="detail__genres">
                        {show.genres?.map((g) => g.name).join(", ")}
                    </p>
                    <p className="detail__overview">{show.overview}</p>
                    <WatchlistButton
                        variant="detail"
                        item={{
                            id: show.id,
                            name: show.name,
                            poster_path: show.poster_path,
                            vote_average: show.vote_average,
                            media_type: "tv",
                        }}
                    />
                </div>
            </section>

            <h2 className="row__title">{t("tv:details.seasonsHeading")}</h2>
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
                                    <img
                                        src={poster}
                                        alt={season.name}
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="movie-card__placeholder">
                                        {t("common:state.noImage")}
                                    </div>
                                )}
                            </div>
                            <p className="movie-card__title">{season.name}</p>
                        </Link>
                    );
                })}
            </div>

            <Outlet />
        </div>
    );
}