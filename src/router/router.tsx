import { createBrowserRouter } from "react-router-dom";

import { ROUTES } from "./routes";

import LoginPage from "../Auth/ui/pages/LoginPage";

import HomePage from "../Movies/ui/pages/HomePage";
import MovieDetailsPage from "../Movies/ui/pages/MovieDetailsPage";

import TVShowDetailsPage from "../TVShows/ui/pages/TVShowDetailsPage";
import SeasonDetailsPage from "../TVShows/ui/pages/SeasonDetailsPage";

import SearchPage from "../Search/ui/pages/SearchPage";

import WatchlistPage from "../Collection/ui/pages/WatchlistPage";
import CollectionsPage from "../Collection/ui/pages/CollectionsPage";

import SettingsPage from "../Preferences/ui/pages/SettingsPage";

import NotFoundPage from "../Common/ui/pages/NotFoundPage";

import ShellLayout from "../Common/ui/layouts/ShellLayout";
import ProtectedRoute from "./ProtectedRoute";

export const router = createBrowserRouter([
    {
        path: ROUTES.LOGIN,
        element: <LoginPage />,
    },

    {
        element: <ProtectedRoute />,
        children: [
            {
                element: <ShellLayout />,
                children: [
                    { path: ROUTES.HOME, element: <HomePage /> },
                    { path: ROUTES.SEARCH, element: <SearchPage /> },
                    { path: ROUTES.MOVIE_DETAILS, element: <MovieDetailsPage /> },
                    {
                        path: ROUTES.TV_SHOW_DETAILS,
                        element: <TVShowDetailsPage />,
                        children: [
                            {
                                path: "season/:seasonNumber",
                                element: <SeasonDetailsPage />,
                            },
                        ],
                    },
                    { path: ROUTES.WATCHLIST, element: <WatchlistPage /> },
                    { path: ROUTES.COLLECTIONS, element: <CollectionsPage /> },
                    { path: ROUTES.SETTINGS, element: <SettingsPage /> },
                ],
            },
        ],
    },

    {
        path: ROUTES.NOT_FOUND,
        element: <NotFoundPage />,
    },
]);