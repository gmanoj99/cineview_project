import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

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
    emptyLabel,
    loadingLabel,
}: AsyncSectionProps<T>) {
    const { t } = useTranslation();

    if (state.status === "loading") {
        return (
            <div className="state state--loading">
                {loadingLabel ?? t("common:state.loading")}
            </div>
        );
    }
    if (state.status === "error") {
        return (
            <div className="state state--error">
                {t("common:state.failedWith", { message: state.error.message })}
            </div>
        );
    }
    if (isEmpty?.(state.data)) {
        return (
            <div className="state state--empty">
                {emptyLabel ?? t("common:state.empty")}
            </div>
        );
    }
    return <>{children(state.data)}</>;
}