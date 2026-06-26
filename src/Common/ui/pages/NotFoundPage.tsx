import { useTranslation } from "react-i18next";

export default function NotFoundPage() {
    const { t } = useTranslation();
    return (
        <div>
            <h1>{t("common:notFound.title")}</h1>
        </div>
    );
}