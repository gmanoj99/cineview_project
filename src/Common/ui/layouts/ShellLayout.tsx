import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";

import { useAuth } from "../../../Auth/ui/AuthContext";
import { usePreferences } from "../../../Preferences/state/PreferencesContext";
import { ROUTES } from "../../../router/routes";
import "./shell.css";
import styled from "styled-components";
import { useWatchlist } from "../../../Collection/state/WatchlistContext";


const NavItem = styled.span`
    position: relative;
    display: inline-flex;
    align-items: center;
`;

const Badge = styled.span`
    margin-left: 6px;
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
    border-radius: 999px;
    background: var(--accent, #aa3bff);
    color: #fff;
    font-size: 11px;
    font-weight: 700;
    line-height: 18px;
    text-align: center;
`;

const NAV_LINKS = [
    { to: ROUTES.HOME, key: "nav.home" },
    { to: ROUTES.WATCHLIST, key: "nav.watchlist" },
    { to: ROUTES.COLLECTIONS, key: "nav.collections" },
    { to: ROUTES.SETTINGS, key: "nav.settings" },
];

function ShellLayout() {
    const { user, logout } = useAuth();
    const prefs = usePreferences();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const watchlist = useWatchlist();
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearchSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const term = searchTerm.trim();
        if (!term) {
            navigate(ROUTES.SEARCH);
            return;
        }
        navigate(`${ROUTES.SEARCH}?q=${encodeURIComponent(term)}`);
    };

    const handleLogout = () => {
        logout();
        navigate(ROUTES.LOGIN, { replace: true });
    };

    const avatarInitial = user?.username.charAt(0).toUpperCase() ?? "?";

    return (
        <div className="shell">
            <header className="navbar">
                <NavLink to={ROUTES.HOME} className="navbar__logo">
                    {t("common:appName")}
                </NavLink>

                <nav className="navbar__links">
                {NAV_LINKS.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            end={link.to === ROUTES.HOME}
                            className={({ isActive }) =>
                                isActive
                                    ? "navbar__link navbar__link--active"
                                    : "navbar__link"
                            }
                        >
                            <NavItem>
                                {t(`common:${link.key}`)}
                                {link.to === ROUTES.WATCHLIST &&
                                    watchlist.count > 0 && (
                                        <Badge aria-label={t(
                                            "collection:watchlist.badge",
                                            { count: watchlist.count }
                                        )}>
                                            {watchlist.count}
                                        </Badge>
                                    )}
                            </NavItem>
                        </NavLink>
                    ))}
                </nav>

                <form className="navbar__search" onSubmit={handleSearchSubmit}>
                    <input
                        type="search"
                        placeholder={t("common:search.navbarPlaceholder")}
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        aria-label={t("common:search.navbarPlaceholder")}
                    />
                </form>

                <div className="navbar__actions">
                    <button
                        type="button"
                        className="navbar__lang"
                        onClick={() =>
                            prefs.setLanguage(
                                prefs.language === "en" ? "es" : "en"
                            )
                        }
                        title={t("settings:language.label")}
                    >
                        {prefs.language.toUpperCase()}
                    </button>

                    <button
                        type="button"
                        className="navbar__theme"
                        onClick={() => prefs.toggleTheme()}
                        aria-label={t("settings:theme.toggle")}
                        title={t("settings:theme.toggle")}
                    >
                        {prefs.theme === "dark" ? "☀️" : "🌙"}
                    </button>

                    <span className="navbar__avatar" title={user?.username}>
                        {avatarInitial}
                    </span>

                    <button
                        type="button"
                        className="navbar__logout"
                        onClick={handleLogout}
                    >
                        {t("common:actions.logout")}
                    </button>
                </div>
            </header>

            <main className="shell__content">
                {/* Remounting on language change forces every page to re-fetch
                    from TMDB with the new `language` parameter. */}
                <div key={prefs.language} className="shell__page">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

export default observer(ShellLayout);