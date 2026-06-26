import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import type { MediaItem } from "../../../Common/data/tmdbSchemas";
import { useWatchlist } from "../../state/WatchlistContext";

interface WatchlistButtonProps {
    item: MediaItem;
    variant?: "card" | "detail";
}

const Button = styled.button<{ $active: boolean; $variant: "card" | "detail" }>`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    width: ${({ $variant }) => ($variant === "card" ? "100%" : "auto")};
    padding: ${({ $variant }) =>
        $variant === "card" ? "6px 8px" : "10px 18px"};
    font-size: ${({ $variant }) => ($variant === "card" ? "12px" : "15px")};
    font-weight: 600;
    border-radius: ${({ $variant }) => ($variant === "card" ? "6px" : "8px")};
    cursor: pointer;
    transition: background-color 0.15s ease, color 0.15s ease,
        border-color 0.15s ease;

    border: 1px solid
        ${({ $active }) =>
            $active ? "var(--accent, #aa3bff)" : "var(--border, #2e303a)"};
    background: ${({ $active }) =>
        $active ? "var(--accent, #aa3bff)" : "transparent"};
    color: ${({ $active }) => ($active ? "#fff" : "var(--text, #9ca3af)")};

    &:hover {
        border-color: var(--accent, #aa3bff);
        color: ${({ $active }) => ($active ? "#fff" : "var(--accent, #aa3bff)")};
    }
`;

function WatchlistButton({ item, variant = "card" }: WatchlistButtonProps) {
    const store = useWatchlist();
    const { t } = useTranslation();
    const active = store.isInList(item);

    return (
        <Button
            type="button"
            $active={active}
            $variant={variant}
            aria-pressed={active}
            aria-label={t("movies:card.toggle")}
            onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                store.toggle(item);
            }}
        >
            {active ? t("movies:card.added") : t("movies:card.add")}
        </Button>
    );
}

export default observer(WatchlistButton);