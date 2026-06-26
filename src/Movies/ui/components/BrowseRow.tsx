import { useTranslation } from "react-i18next";

import { SectionBoundary } from "../../../Common/ui/components/SectionBoundary";
import { AsyncSection } from "../../../Common/ui/components/AsyncSection";
import MovieCard from "../../../Common/ui/components/MovieCard";
import { useAsync } from "../../../Common/ui/hooks/useAsync";
import type { PaginatedMedia } from "../../../Common/data/tmdbSchemas";

interface BrowseRowProps {
    title: string;
    fetcher: () => Promise<PaginatedMedia>;
    deps?: unknown[];
}

export default function BrowseRow({ title, fetcher, deps = [] }: BrowseRowProps) {
    const { t } = useTranslation();
    const state = useAsync(fetcher, [title, ...deps]);

    return (
        <section className="row">
            <h2 className="row__title">{title}</h2>
            <SectionBoundary label={t("movies:rowFailed", { title })}>
                <AsyncSection
                    state={state}
                    isEmpty={(data) => data.results.length === 0}
                    emptyLabel={t("movies:empty")}
                >
                    {(data) => (
                        <div className="row__track">
                            {data.results.map((item) => (
                                <MovieCard
                                    key={item.id}
                                    item={{
                                        ...item,
                                        media_type: item.media_type ?? "movie",
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </AsyncSection>
            </SectionBoundary>
        </section>
    );
}