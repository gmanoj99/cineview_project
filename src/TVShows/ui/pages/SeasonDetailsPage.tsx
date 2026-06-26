import { useParams } from "react-router-dom";

import { tmdbService } from "../../../Common/data/tmdbService";
import { useAsync } from "../../../Common/ui/hooks/useAsync";
import { SectionBoundary } from "../../../Common/ui/components/SectionBoundary";
import { AsyncSection } from "../../../Common/ui/components/AsyncSection";
import "../../../styles/browse.css";

export default function SeasonDetailsPage() {
    const { tvId, seasonNumber } = useParams();
    const id = Number(tvId);
    const season = Number(seasonNumber);

    const state = useAsync(
        () => tmdbService.getSeasonDetails(id, season),
        [id, season]
    );

    return (
        <section className="season">
            <SectionBoundary label="Season failed to load.">
                <AsyncSection
                    state={state}
                    isEmpty={(data) => data.episodes.length === 0}
                    emptyLabel="No episodes found."
                >
                    {(data) => (
                        <>
                            <h2 className="row__title">{data.name}</h2>
                            <ul className="episodes">
                                {data.episodes.map((episode) => (
                                    <li key={episode.id} className="episode">
                                        {/* Episode checkbox is a placeholder — wired in Milestone 6 */}
                                        <input
                                            type="checkbox"
                                            disabled
                                            aria-label={`Mark episode ${episode.episode_number} watched`}
                                        />
                                        <div>
                                            <p className="episode__title">
                                                {episode.episode_number}.{" "}
                                                {episode.name}
                                            </p>
                                            <p className="episode__overview">
                                                {episode.overview}
                                            </p>
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