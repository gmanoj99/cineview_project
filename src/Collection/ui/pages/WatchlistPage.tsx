import { useTranslation } from "react-i18next";

export default function WatchlistPage() {
    const { t } = useTranslation();
    return (
        <div>
            <h1>{t("collection:watchlist.title")}</h1>
            <p className="state state--empty">
                {t("collection:watchlist.empty")}
            </p>
        </div>
    );
}