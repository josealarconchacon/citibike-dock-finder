import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { FavoriteStations } from "@/components/FavoriteStations";
import { makeStation } from "./fixtures";

// Server actions run on the server, so tests replace them with empty functions.
vi.mock("@/app/actions", () => ({
  addFavoriteAction: vi.fn(async () => ({ error: null })),
  removeFavoriteAction: vi.fn(),
}));

const origin = { lat: 40.7685, lon: -73.9645 };

afterEach(() => cleanup());

describe("FavoriteStations", () => {
  it("explains what it is for when nothing is saved", () => {
    render(<FavoriteStations favorites={[]} stationNames={[]} origin={origin} mode="bike" />);

    expect(screen.getByText(/Save your home or work station/)).toBeTruthy();
    expect(screen.getByText("+ Add a station")).toBeTruthy();
  });

  it("shows the useful count for the current mode", () => {
    const station = makeStation({ name: "W 4 St", classicBikes: 2, ebikes: 1, docks: 9 });
    const { rerender } = render(
      <FavoriteStations favorites={[station]} stationNames={[]} origin={origin} mode="bike" />,
    );
    expect(screen.getByText("3")).toBeTruthy();

    rerender(
      <FavoriteStations favorites={[station]} stationNames={[]} origin={origin} mode="dock" />,
    );
    expect(screen.getByText("9")).toBeTruthy();
  });

  it("gives each remove button a clear name", () => {
    render(
      <FavoriteStations
        favorites={[makeStation({ name: "W 4 St" })]}
        stationNames={[]}
        origin={origin}
        mode="bike"
      />,
    );

    expect(screen.getByRole("button", { name: "Remove W 4 St from your stations" })).toBeTruthy();
  });

  it("hides the add form when 5 stations are saved", () => {
    const five = ["a", "b", "c", "d", "e"].map((id) => makeStation({ id, name: id }));
    render(<FavoriteStations favorites={five} stationNames={[]} origin={origin} mode="bike" />);

    expect(screen.queryByText("+ Add a station")).toBeNull();
  });
});
