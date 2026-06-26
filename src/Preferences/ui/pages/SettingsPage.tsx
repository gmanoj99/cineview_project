import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../../Auth/ui/AuthContext";
import { usePreferences } from "../../state/PreferencesContext";
import { LANGUAGES, REGIONS } from "../../state/types";
import type { Language, Region } from "../../state/types";
import { ROUTES } from "../../../router/routes";
import "./settings.css";

function SettingsPage() {
    const prefs = usePreferences();
    const { logout } = useAuth();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate(ROUTES.LOGIN, { replace: true });
    };

    return (
        <div className="settings">
            <h1 className="settings__title">{t("settings:title")}</h1>

            <section className="settings__group">
                <label className="settings__row" htmlFor="settings-language">
                    <span>{t("settings:language.label")}</span>
                    <select
                        id="settings-language"
                        value={prefs.language}
                        onChange={(event) =>
                            prefs.setLanguage(event.target.value as Language)
                        }
                    >
                        {LANGUAGES.map((lng) => (
                            <option key={lng} value={lng}>
                                {t(`settings:language.${lng}`)}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="settings__row" htmlFor="settings-region">
                    <span>{t("settings:region.label")}</span>
                    <select
                        id="settings-region"
                        value={prefs.region}
                        onChange={(event) =>
                            prefs.setRegion(event.target.value as Region)
                        }
                    >
                        {REGIONS.map((region) => (
                            <option key={region} value={region}>
                                {region}
                            </option>
                        ))}
                    </select>
                </label>

                <div className="settings__row">
                    <span>{t("settings:theme.label")}</span>
                    <button
                        type="button"
                        className="settings__theme-toggle"
                        onClick={() => prefs.toggleTheme()}
                        aria-label={t("settings:theme.toggle")}
                    >
                        {prefs.theme === "dark"
                            ? t("settings:theme.dark")
                            : t("settings:theme.light")}
                    </button>
                </div>
            </section>

            <section className="settings__group">
                <h2 className="settings__subtitle">
                    {t("settings:account.label")}
                </h2>
                <button
                    type="button"
                    className="settings__logout"
                    onClick={handleLogout}
                >
                    {t("settings:account.logout")}
                </button>
            </section>
        </div>
    );
}

export default observer(SettingsPage);