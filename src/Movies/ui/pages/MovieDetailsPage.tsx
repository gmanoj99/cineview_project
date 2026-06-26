import { useState } from "react";
import { useParams } from "react-router-dom";

import { backdropUrl } from "../../../Common/core/images";
import { tmdbService } from "../../../Common/data/tmdbService";
import { TmdbError } from "../../../Common/data/tmdbClient";
import { useAsync } from "../../../Common/ui/hooks/useAsync";
import { SectionBoundary } from "../../../Common/ui/components/SectionBoundary";
import MovieCard from "../../../Common/ui/components/MovieCard";
import TrailerModal from "../../../Common/ui/components/TrailerModal";
import CastCarousel from "../components/CastCarousel";
import "../../../styles/browse.css";

export default function MovieDetailsPage() {
    const { movieId } = useParams();
    const id = Number(movieId);
    const [showTrailer, setShowTrailer] = useState(false);

    const state = useAsync(() => tmdbService.getMovieDetails(id), [id]);

    if (Number.isNaN(id)) {
        return <div className="state state--error">Invalid movie id.</div>;
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
                    ? "Movie not found (404)."
                    : `Failed to load. ${state.error.message}`}
            </div>
        );
    }

    const movie = state.data;
    const backdrop = backdropUrl(movie.backdrop_path);
    const trailer = movie.videos?.results.find(
        (v) => v.site === "YouTube" && v.type === "Trailer"
    );

    return (
        <div className="detail">
            <section
                className="detail__hero"
                style={backdrop ? { backgroundImage: `url(${backdrop})` } : undefined}
            >
                <div className="detail__hero-overlay">
                    <h1>{movie.title}</h1>
                    <p className="detail__meta">
                        ★ {movie.vote_average?.toFixed(1) ?? "—"}
                        {movie.runtime ? ` · ${movie.runtime} min` : ""}
                        {movie.release_date ? ` · ${movie.release_date}` : ""}
                    </p>
                    <p className="detail__genres">
                        {movie.genres?.map((g) => g.name).join(", ")}
                    </p>
                    <p className="detail__overview">{movie.overview}</p>
                    {trailer && (
                        <button
                            type="button"
                            className="hero__cta"
                            onClick={() => setShowTrailer(true)}
                        >
                            ▶ Play Trailer
                        </button>
                    )}
                </div>
            </section>

            <SectionBoundary label="Cast failed to load.">
                <h2 className="row__title">Cast</h2>
                <CastCarousel cast={movie.credits?.cast ?? []} />
            </SectionBoundary>

            <SectionBoundary label="Similar failed to load.">
                <h2 className="row__title">Similar</h2>
                <div className="row__track">
                    {(movie.similar?.results ?? []).map((item) => (
                        <MovieCard
                            key={item.id}
                            item={{ ...item, media_type: "movie" }}
                        />
                    ))}
                </div>
            </SectionBoundary>

            <SectionBoundary label="Recommendations failed to load.">
                <h2 className="row__title">Recommended</h2>
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