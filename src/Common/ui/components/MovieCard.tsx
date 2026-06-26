import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import { posterUrl } from "../../core/images";
import type { MediaItem } from "../../data/tmdbSchemas";
import WatchlistButton from "../../../Collection/ui/components/WatchlistButton";

interface MovieCardProps {
    item: MediaItem;
}

const Card = styled.div`
    flex: 0 0 160px;
    width: 160px;
    text-align: left;
`;

const CardLink = styled(Link)`
    text-decoration: none;
    color: inherit;
`;

const Poster = styled.div`
    position: relative;
    aspect-ratio: 2 / 3;
    border-radius: 8px;
    overflow: hidden;
    background: #2a2b33;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`;

const Placeholder = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    font-size: 12px;
    color: #888;
`;

const Rating = styled.span`
    position: absolute;
    bottom: 6px;
    left: 6px;
    background: rgba(0, 0, 0, 0.7);
    color: #ffd369;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 12px;
`;

const Title = styled.p`
    margin: 8px 0;
    font-size: 14px;
    color: var(--text-h, #f3f4f6);
`;

export default function MovieCard({ item }: MovieCardProps) {
    const { t } = useTranslation();
    const title = item.title ?? item.name ?? t("movies:card.untitled");
    const poster = posterUrl(item.poster_path);
    const rating = item.vote_average ? item.vote_average.toFixed(1) : "—";
    const to = item.media_type === "tv" ? `/tv/${item.id}` : `/movie/${item.id}`;

    return (
        <Card>
            <CardLink to={to}>
                <Poster>
                    {poster ? (
                        <img src={poster} alt={title} loading="lazy" />
                    ) : (
                        <Placeholder>{t("common:state.noImage")}</Placeholder>
                    )}
                    <Rating>{t("common:rating", { value: rating })}</Rating>
                </Poster>
                <Title>{title}</Title>
            </CardLink>
            <WatchlistButton item={item} variant="card" />
        </Card>
    );
}