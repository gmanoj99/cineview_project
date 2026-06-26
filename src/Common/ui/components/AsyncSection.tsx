import type { ReactNode } from "react";

import type { AsyncState } from "../hooks/useAsync";

interface AsyncSectionProps<T> {
    state: AsyncState<T>;
    children: (data: T) => ReactNode;
    isEmpty?: (data: T) => boolean;
    emptyLabel?: string;
    loadingLabel?: string;
}

export function AsyncSection<T>({
    state,
    children,
    isEmpty,
    emptyLabel = "Nothing to show.",
    loadingLabel = "Loading…",
}: AsyncSectionProps<T>) {
    if (state.status === "loading") {
        return <div className="state state--loading">{loadingLabel}</div>;
    }
    if (state.status === "error") {
        return (
            <div className="state state--error">
                Failed to load. {state.error.message}
            </div>
        );
    }
    if (isEmpty?.(state.data)) {
        return <div className="state state--empty">{emptyLabel}</div>;
    }
    return <>{children(state.data)}</>;
}