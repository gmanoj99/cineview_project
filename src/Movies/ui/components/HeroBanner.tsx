import { Link } from "react-router-dom";

import { backdropUrl } from "../../../Common/core/images";
import type { MediaItem } from "../../../Common/data/tmdbSchemas";

interface HeroBannerProps {
    movie: MediaItem;
}

export default function HeroBanner({ movie }: HeroBannerProps) {
    const backdrop = backdropUrl(movie.backdrop_path);
    const title = movie.title ?? movie.name ?? "Untitled";
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "—";

    return (
        <section
            className="hero"
            style={
                backdrop
                    ? { backgroundImage: `url(${backdrop})` }
                    : undefined
            }
        >
            <div className="hero__overlay">
                <h1 className="hero__title">{title}</h1>
                <div className="hero__rating">★ {rating}</div>
                <p className="hero__overview">{movie.overview}</p>
                <Link className="hero__cta" to={`/movie/${movie.id}`}>
                    ▶ Play Trailer
                </Link>
            </div>
        </section>
    );
}