import { useState } from "react";
import { useTranslation } from "react-i18next";

import { SectionBoundary } from "../../../Common/ui/components/SectionBoundary";
import { AsyncSection } from "../../../Common/ui/components/AsyncSection";
import { useAsync } from "../../../Common/ui/hooks/useAsync";
import { tmdbService } from "../../../Common/data/tmdbService";
import HeroBanner from "../components/HeroBanner";
import GenreFilter from "../components/GenreFilter";
import BrowseRow from "../components/BrowseRow";
import "../../../styles/browse.css";

export default function HomePage() {
    const { t } = useTranslation();
    const [activeGenreId, setActiveGenreId] = useState<number | null>(null);

    const heroState = useAsync(() => tmdbService.getTrending(), []);
    const genresState = useAsync(() => tmdbService.getMovieGenres(), []);

    return (
        <div className="home">
            <SectionBoundary label={t("common:state.sectionFailed")}>
                <AsyncSection
                    state={heroState}
                    isEmpty={(data) => data.results.length === 0}
                >
                    {(data) =>
                        data.results[0] ? (
                            <HeroBanner movie={data.results[0]} />
                        ) : null
                    }
                </AsyncSection>
            </SectionBoundary>

            <SectionBoundary>
                <AsyncSection state={genresState}>
                    {(data) => (
                        <GenreFilter
                            genres={data.genres}
                            activeGenreId={activeGenreId}
                            onSelect={setActiveGenreId}
                        />
                    )}
                </AsyncSection>
            </SectionBoundary>

            {activeGenreId === null ? (
                <>
                    <BrowseRow
                        title={t("movies:rows.trending")}
                        fetcher={() => tmdbService.getTrending()}
                    />
                    <BrowseRow
                        title={t("movies:rows.popular")}
                        fetcher={() => tmdbService.getPopular()}
                    />
                    <BrowseRow
                        title={t("movies:rows.topRated")}
                        fetcher={() => tmdbService.getTopRated()}
                    />
                    <BrowseRow
                        title={t("movies:rows.upcoming")}
                        fetcher={() => tmdbService.getUpcoming()}
                    />
                </>
            ) : (
                <BrowseRow
                    key={activeGenreId}
                    title={t("movies:rows.filtered")}
                    deps={[activeGenreId]}
                    fetcher={() => tmdbService.discoverByGenre(activeGenreId)}
                />
            )}
        </div>
    );
}