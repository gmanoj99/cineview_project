import { useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { posterUrl } from "../../../Common/core/images";
import { useWatchlist } from "../../state/WatchlistContext";
import {
    NOTE_MAX_LENGTH,
    WATCHLIST_STATUSES,
    type WatchlistEntry,
    type WatchlistStatus,
} from "../../data/watchlistSchemas";

type FilterValue = "all" | WatchlistStatus;
type SortValue = "dateAdded" | "rating" | "title";

const Page = styled.div`
    text-align: left;
`;

const Toolbar = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 24px;
`;

const Tabs = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
`;

const Tab = styled.button<{ $active: boolean }>`
    padding: 6px 14px;
    border-radius: 999px;
    cursor: pointer;
    font-size: 13px;
    border: 1px solid
        ${({ $active }) =>
            $active ? "var(--accent, #aa3bff)" : "var(--border, #2e303a)"};
    background: ${({ $active }) =>
        $active ? "var(--accent, #aa3bff)" : "transparent"};
    color: ${({ $active }) => ($active ? "#fff" : "var(--text, #9ca3af)")};
`;

const SortControl = styled.label`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;

    select {
        padding: 8px 12px;
        border-radius: 8px;
        border: 1px solid var(--border, #2e303a);
        background: var(--surface, transparent);
        color: var(--text-h, #f3f4f6);
        font: inherit;
    }
`;

const Grid = styled.ul`
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
`;

const Entry = styled.li`
    display: flex;
    gap: 12px;
    padding: 12px;
    border: 1px solid var(--border, #2e303a);
    border-radius: 12px;
    background: var(--surface, transparent);
`;

const Poster = styled.div`
    flex: 0 0 80px;
    width: 80px;
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

const Body = styled.div`
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const EntryTitle = styled(Link)`
    font-weight: 600;
    color: var(--text-h, #f3f4f6);
    text-decoration: none;

    &:hover {
        color: var(--accent, #aa3bff);
    }
`;

const Row = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;

    select {
        padding: 6px 10px;
        border-radius: 8px;
        border: 1px solid var(--border, #2e303a);
        background: transparent;
        color: var(--text-h, #f3f4f6);
        font: inherit;
    }
`;

const Note = styled.textarea`
    width: 100%;
    resize: vertical;
    min-height: 48px;
    padding: 8px 10px;
    border-radius: 8px;
    border: 1px solid var(--border, #2e303a);
    background: transparent;
    color: var(--text, #9ca3af);
    font: inherit;
    box-sizing: border-box;
`;

const NoteMeta = styled.span`
    font-size: 12px;
    opacity: 0.7;
`;

const RemoveButton = styled.button`
    border: 1px solid var(--border, #2e303a);
    background: transparent;
    color: var(--text, #9ca3af);
    border-radius: 8px;
    padding: 6px 12px;
    cursor: pointer;
    font-size: 13px;

    &:hover {
        border-color: #ef6b6b;
        color: #ef6b6b;
    }
`;

const Empty = styled.div`
    padding: 48px 24px;
    text-align: center;
    color: var(--text, #9ca3af);
`;

function sortEntries(entries: WatchlistEntry[], sort: SortValue) {
    const copy = [...entries];
    switch (sort) {
        case "rating":
            return copy.sort(
                (a, b) =>
                    (b.snapshot.voteAverage ?? 0) -
                    (a.snapshot.voteAverage ?? 0)
            );
        case "title":
            return copy.sort((a, b) =>
                a.snapshot.title.localeCompare(b.snapshot.title)
            );
        case "dateAdded":
        default:
            return copy.sort((a, b) => b.createdAt - a.createdAt);
    }
}

function WatchlistPage() {
    const store = useWatchlist();
    const { t } = useTranslation();
    const [filter, setFilter] = useState<FilterValue>("all");
    const [sort, setSort] = useState<SortValue>("dateAdded");

    const counts = store.countsByStatus;

    const tabs: { value: FilterValue; label: string; count: number }[] = [
        {
            value: "all",
            label: t("collection:watchlist.filters.all"),
            count: store.count,
        },
        ...WATCHLIST_STATUSES.map((status) => ({
            value: status,
            label: t(`collection:watchlist.filters.${status}`),
            count: counts[status],
        })),
    ];

    const visible = useMemo(() => {
        const filtered =
            filter === "all"
                ? store.entries
                : store.entries.filter((e) => e.status === filter);
        return sortEntries(filtered, sort);
    }, [store.entries, filter, sort]);

    return (
        <Page>
            <h1>{t("collection:watchlist.title")}</h1>

            {store.count === 0 ? (
                <Empty>
                    <p>{t("collection:watchlist.empty")}</p>
                    <p>{t("collection:watchlist.emptyHint")}</p>
                </Empty>
            ) : (
                <>
                    <Toolbar>
                        <Tabs>
                            {tabs.map((tab) => (
                                <Tab
                                    key={tab.value}
                                    type="button"
                                    $active={filter === tab.value}
                                    onClick={() => setFilter(tab.value)}
                                >
                                    {tab.label} ({tab.count})
                                </Tab>
                            ))}
                        </Tabs>

                        <SortControl>
                            {t("collection:watchlist.sort.label")}
                            <select
                                value={sort}
                                onChange={(e) =>
                                    setSort(e.target.value as SortValue)
                                }
                            >
                                <option value="dateAdded">
                                    {t("collection:watchlist.sort.dateAdded")}
                                </option>
                                <option value="rating">
                                    {t("collection:watchlist.sort.rating")}
                                </option>
                                <option value="title">
                                    {t("collection:watchlist.sort.title")}
                                </option>
                            </select>
                        </SortControl>
                    </Toolbar>

                    <Grid>
                        {visible.map((entry) => {
                            const poster = posterUrl(entry.snapshot.posterPath);
                            const to =
                                entry.mediaType === "tv"
                                    ? `/tv/${entry.mediaId}`
                                    : `/movie/${entry.mediaId}`;
                            return (
                                <Entry key={entry.id}>
                                    <Poster>
                                        {poster ? (
                                            <img
                                                src={poster}
                                                alt={entry.snapshot.title}
                                                loading="lazy"
                                            />
                                        ) : null}
                                    </Poster>
                                    <Body>
                                        <EntryTitle to={to}>
                                            {entry.snapshot.title}
                                        </EntryTitle>

                                        <Row>
                                            <select
                                                value={entry.status}
                                                aria-label={t(
                                                    "collection:watchlist.sort.label"
                                                )}
                                                onChange={(e) =>
                                                    store.updateStatus(
                                                        entry.id,
                                                        e.target
                                                            .value as WatchlistStatus
                                                    )
                                                }
                                            >
                                                {WATCHLIST_STATUSES.map((s) => (
                                                    <option key={s} value={s}>
                                                        {t(
                                                            `collection:watchlist.status.${s}`
                                                        )}
                                                    </option>
                                                ))}
                                            </select>
                                            <RemoveButton
                                                type="button"
                                                onClick={() =>
                                                    store.remove(entry.id)
                                                }
                                            >
                                                {t(
                                                    "collection:watchlist.remove"
                                                )}
                                            </RemoveButton>
                                        </Row>

                                        <Note
                                            value={entry.note}
                                            maxLength={NOTE_MAX_LENGTH}
                                            placeholder={t(
                                                "collection:watchlist.note.placeholder"
                                            )}
                                            onChange={(e) =>
                                                store.updateNote(
                                                    entry.id,
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <NoteMeta>
                                            {t(
                                                "collection:watchlist.note.remaining",
                                                {
                                                    count:
                                                        NOTE_MAX_LENGTH -
                                                        entry.note.length,
                                                }
                                            )}
                                        </NoteMeta>
                                    </Body>
                                </Entry>
                            );
                        })}
                    </Grid>
                </>
            )}
        </Page>
    );
}

export default observer(WatchlistPage);