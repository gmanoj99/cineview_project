import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

import { useAuth } from "../../../Auth/ui/AuthContext";
import { ROUTES } from "../../../router/routes";
import "./shell.css";

const NAV_LINKS = [
    { to: ROUTES.HOME, label: "Home" },
    { to: ROUTES.WATCHLIST, label: "Watchlist" },
    { to: ROUTES.COLLECTIONS, label: "Collections" },
    { to: ROUTES.SETTINGS, label: "Settings" },
];

export default function ShellLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearchSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        navigate(ROUTES.SEARCH);
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
                    CineView
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
                            {link.label}
                        </NavLink>
                    ))}
                </nav>

                <form className="navbar__search" onSubmit={handleSearchSubmit}>
                    <input
                        type="search"
                        placeholder="Search movies, shows, people..."
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        aria-label="Global search"
                    />
                </form>

                <div className="navbar__actions">
                    {/* Language switcher placeholder — wired in Milestone 4 */}
                    <button
                        type="button"
                        className="navbar__lang"
                        disabled
                        title="Language switcher (coming soon)"
                    >
                        EN
                    </button>

                    <span className="navbar__avatar" title={user?.username}>
                        {avatarInitial}
                    </span>

                    <button
                        type="button"
                        className="navbar__logout"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </header>

            <main className="shell__content">
                <Outlet />
            </main>
        </div>
    );
}