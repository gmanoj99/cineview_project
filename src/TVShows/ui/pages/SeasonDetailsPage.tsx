import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { tmdbService } from "../../../Common/data/tmdbService";
import { useAsync } from "../../../Common/ui/hooks/useAsync";
import { SectionBoundary } from "../../../Common/ui/components/SectionBoundary";
import { AsyncSection } from "../../../Common/ui/components/AsyncSection";
import "../../../styles/browse.css";

export default function SeasonDetailsPage() {
    const { tvId, seasonNumber } = useParams();
    const { t } = useTranslation();
    const id = Number(tvId);
    const season = Number(seasonNumber);

    const state = useAsync(
        () => tmdbService.getSeasonDetails(id, season),
        [id, season]
    );

    return (
        <section className="season">
            <SectionBoundary label={t("tv:season.failed")}>
                <AsyncSection
                    state={state}
                    isEmpty={(data) => data.episodes.length === 0}
                    emptyLabel={t("tv:season.noEpisodes")}
                >
                    {(data) => (
                        <>
                            <h2 className="row__title">
                                {data.name} ·{" "}
                                {t("tv:season.episodeCount", {
                                    count: data.episodes.length,
                                })}
                            </h2>
                            <ul className="episodes">
                                {data.episodes.map((episode) => (
                                    <li key={episode.id} className="episode">
                                        <input
                                            type="checkbox"
                                            disabled
                                            aria-label={t(
                                                "tv:season.markWatched",
                                                {
                                                    number: episode.episode_number,
                                                }
                                            )}
                                        />
                                        <div>
                                            <p className="episode__title">
                                                {episode.episode_number}.{" "}
                                                {episode.name}
                                            </p>
                                            <p className="episode__overview">
                                                {episode.overview}
                                            </p>
                                            {episode.air_date && (
                                                <p className="episode__overview">
                                                    {t("tv:season.aired", {
                                                        date: new Date(
                                                            episode.air_date
                                                        ),
                                                    })}
                                                </p>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </AsyncSection>
            </SectionBoundary>
        </section>
    );
}