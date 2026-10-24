import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
    expect(screen.getByRole("button", { name: "+ Add" })).toBeTruthy();
  });

  it("keeps the add form hidden until + Add is pressed, and Cancel closes it", async () => {
    render(<FavoriteStations favorites={[]} stationNames={[]} origin={origin} mode="bike" />);
    expect(screen.queryByLabelText("Station name")).toBeNull();

    await userEvent.click(screen.getByRole("button", { name: "+ Add" }));
    expect(screen.getByLabelText("Station name")).toBeTruthy();
    // Both open buttons (desktop header and phone rail card) now read "Cancel".
    const cancel = screen.getAllByRole("button", { name: "Cancel" });
    expect(cancel).toHaveLength(2);
    expect(cancel[0].getAttribute("aria-expanded")).toBe("true");

    await userEvent.click(cancel[0]);
    expect(screen.queryByLabelText("Station name")).toBeNull();
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

    expect(screen.getByRole("button", { name: "Remove W 4 St" })).toBeTruthy();
  });

  it("hides the add buttons when 5 stations are saved", () => {
    const five = ["a", "b", "c", "d", "e"].map((id) => makeStation({ id, name: id }));
    render(<FavoriteStations favorites={five} stationNames={[]} origin={origin} mode="bike" />);

    expect(screen.queryByRole("button", { name: /add/i })).toBeNull();
  });
});
