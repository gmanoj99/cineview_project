import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import MovieCard from "./MovieCard";

test("renders title, rating, and links to the movie route", () => {
    render(
        <MemoryRouter>
            <MovieCard
                item={{
                    id: 42,
                    title: "Inception",
                    vote_average: 8.3,
                    media_type: "movie",
                }}
            />
        </MemoryRouter>
    );

    expect(screen.getByText("Inception")).toBeInTheDocument();
    expect(screen.getByText(/8\.3/)).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/movie/42");
});