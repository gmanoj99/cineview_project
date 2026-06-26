import { useTranslation } from "react-i18next";

export default function CollectionsPage() {
    const { t } = useTranslation();
    return (
        <div>
            <h1>{t("collection:collections.title")}</h1>
            <p className="state state--empty">
                {t("collection:collections.empty")}
            </p>
        </div>
    );
}