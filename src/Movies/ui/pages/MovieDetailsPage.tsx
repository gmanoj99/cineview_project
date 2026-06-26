import { useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { backdropUrl } from "../../../Common/core/images";
import { tmdbService } from "../../../Common/data/tmdbService";
import { TmdbError } from "../../../Common/data/tmdbClient";
import { useAsync } from "../../../Common/ui/hooks/useAsync";
import { SectionBoundary } from "../../../Common/ui/components/SectionBoundary";
import MovieCard from "../../../Common/ui/components/MovieCard";
import TrailerModal from "../../../Common/ui/components/TrailerModal";
import CastCarousel from "../components/CastCarousel";
import "../../../styles/browse.css";
import WatchlistButton from "../../../Collection/ui/components/WatchlistButton";

export default function MovieDetailsPage() {
    const { movieId } = useParams();
    const { t } = useTranslation();
    const id = Number(movieId);
    const [showTrailer, setShowTrailer] = useState(false);

    const state = useAsync(() => tmdbService.getMovieDetails(id), [id]);

    if (Number.isNaN(id)) {
        return (
            <div className="state state--error">
                {t("movies:details.invalidId")}
            </div>
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
                    ? t("movies:details.notFound")
                    : t("common:state.failedWith", {
                          message: state.error.message,
                      })}
            </div>
        );
    }

    const movie = state.data;
    const backdrop = backdropUrl(movie.backdrop_path);
    const releaseDate = movie.release_date ? new Date(movie.release_date) : null;
    const trailer = movie.videos?.results.find(
        (v) => v.site === "YouTube" && v.type === "Trailer"
    );

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
                    <h1>{movie.title}</h1>
                    <p className="detail__meta">
                        {t("common:rating", {
                            value: movie.vote_average?.toFixed(1) ?? "—",
                        })}
                        {movie.runtime
                            ? ` · ${t("movies:details.runtime", {
                                  count: movie.runtime,
                              })}`
                            : ""}
                        {releaseDate
                            ? ` · ${t("movies:releaseDate", {
                                  date: releaseDate,
                              })}`
                            : ""}
                    </p>
                    <p className="detail__genres">
                        {movie.genres?.map((g) => g.name).join(", ")}
                    </p>
                    <p className="detail__overview">{movie.overview}</p>
                    <div className="detail__actions">
                        {trailer && (
                            <button
                                type="button"
                                className="hero__cta"
                                onClick={() => setShowTrailer(true)}
                            >
                                {t("common:actions.playTrailer")}
                            </button>
                        )}
                        <WatchlistButton
                            variant="detail"
                            item={{
                                id: movie.id,
                                title: movie.title,
                                poster_path: movie.poster_path,
                                vote_average: movie.vote_average,
                                media_type: "movie",
                            }}
                        />
                    </div>
                </div>
            </section>

            <SectionBoundary label={t("movies:details.castFailed")}>
                <h2 className="row__title">{t("movies:details.cast")}</h2>
                <CastCarousel cast={movie.credits?.cast ?? []} />
            </SectionBoundary>

            <SectionBoundary label={t("movies:details.similarFailed")}>
                <h2 className="row__title">{t("movies:details.similar")}</h2>
                <div className="row__track">
                    {(movie.similar?.results ?? []).map((item) => (
                        <MovieCard
                            key={item.id}
                            item={{ ...item, media_type: "movie" }}
                        />
                    ))}
                </div>
            </SectionBoundary>

            <SectionBoundary
                label={t("movies:details.recommendationsFailed")}
            >
                <h2 className="row__title">
                    {t("movies:details.recommended")}
                </h2>
                <div className="row__track">
                    {(movie.recommendations?.results ?? []).map((item) => (
                        <MovieCard
                            key={item.id}
                            item={{ ...item, media_type: "movie" }}
                        />
                    ))}
                </div>
            </SectionBoundary>

            {showTrailer && trailer && (
                <TrailerModal
                    youtubeKey={trailer.key}
                    onClose={() => setShowTrailer(false)}
                />
            )}
        </div>
    );
}