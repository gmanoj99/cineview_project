import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { tmdbService } from "../../../Common/data/tmdbService";
import { useAsync } from "../../../Common/ui/hooks/useAsync";
import { useDebouncedValue } from "../../../Common/ui/hooks/useDebouncedValue";
import { SectionBoundary } from "../../../Common/ui/components/SectionBoundary";
import { AsyncSection } from "../../../Common/ui/components/AsyncSection";
import MovieCard from "../../../Common/ui/components/MovieCard";
import { posterUrl } from "../../../Common/core/images";
import {
    addToHistory,
    clearHistory,
    getHistory,
} from "../../data/SearchHistory";
import "../../../styles/browse.css";

export default function SearchPage() {
    const { t } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();
    const queryParam = searchParams.get("q") ?? "";

    const [query, setQuery] = useState(queryParam);
    const [history, setHistory] = useState<string[]>(() => getHistory());
    const debounced = useDebouncedValue(query.trim(), 400);

    useEffect(() => {
        setQuery(queryParam);
    }, [queryParam]);

    useEffect(() => {
        const current = searchParams.get("q") ?? "";
        if (debounced !== current) {
            setSearchParams(debounced ? { q: debounced } : {}, {
                replace: true,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debounced]);

    const state = useAsync(async () => {
        if (debounced.length < 2) {
            return { page: 1, results: [] };
        }
        return tmdbService.searchMulti(debounced);
    }, [debounced]);

    useEffect(() => {
        if (debounced.length >= 2 && state.status === "success") {
            setHistory(addToHistory(debounced));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.status]);

    const grouped = useMemo(() => {
        if (state.status !== "success") {
            return { movie: [], tv: [], person: [] };
        }
        return {
            movie: state.data.results.filter((r) => r.media_type === "movie"),
            tv: state.data.results.filter((r) => r.media_type === "tv"),
            person: state.data.results.filter((r) => r.media_type === "person"),
        };
    }, [state]);

    return (
        <div className="search">
            <input
                className="search__input"
                type="search"
                placeholder={t("search:placeholder")}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                autoFocus
            />

            {history.length > 0 && (
                <div className="search__history">
                    <span>{t("search:recent")}</span>
                    {history.map((term) => (
                        <button
                            key={term}
                            type="button"
                            className="chip"
                            onClick={() => setQuery(term)}
                        >
                            {term}
                        </button>
                    ))}
                    <button
                        type="button"
                        className="chip"
                        onClick={() => {
                            clearHistory();
                            setHistory([]);
                        }}
                    >
                        {t("search:clear")}
                    </button>
                </div>
            )}

            {debounced.length < 2 ? (
                <p className="state state--empty">{t("search:typeAtLeast")}</p>
            ) : (
                <SectionBoundary label={t("search:failed")}>
                    <AsyncSection
                        state={state}
                        isEmpty={(data) => data.results.length === 0}
                        emptyLabel={t("search:noResults")}
                    >
                        {() => (
                            <>
                                {grouped.movie.length > 0 && (
                                    <section className="row">
                                        <h2 className="row__title">
                                            {t("search:sections.movies")}
                                        </h2>
                                        <div className="row__track">
                                            {grouped.movie.map((item) => (
                                                <MovieCard
                                                    key={item.id}
                                                    item={{
                                                        ...item,
                                                        media_type: "movie",
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </section>
                                )}
                                {grouped.tv.length > 0 && (
                                    <section className="row">
                                        <h2 className="row__title">
                                            {t("search:sections.tv")}
                                        </h2>
                                        <div className="row__track">
                                            {grouped.tv.map((item) => (
                                                <MovieCard
                                                    key={item.id}
                                                    item={{
                                                        ...item,
                                                        media_type: "tv",
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </section>
                                )}
                                {grouped.person.length > 0 && (
                                    <section className="row">
                                        <h2 className="row__title">
                                            {t("search:sections.people")}
                                        </h2>
                                        <div className="row__track">
                                            {grouped.person.map((person) => {
                                                const photo = posterUrl(
                                                    person.profile_path
                                                );
                                                return (
                                                    <div
                                                        key={person.id}
                                                        className="movie-card"
                                                    >
                                                        <div className="movie-card__poster">
                                                            {photo ? (
                                                                <img
                                                                    src={photo}
                                                                    alt={
                                                                        person.name
                                                                    }
                                                                    loading="lazy"
                                                                />
                                                            ) : (
                                                                <div className="movie-card__placeholder">
                                                                    {t(
                                                                        "common:state.noImage"
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <p className="movie-card__title">
                                                            {person.name}
                                                        </p>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </section>
                                )}
                            </>
                        )}
                    </AsyncSection>
                </SectionBoundary>
            )}
        </div>
    );
}