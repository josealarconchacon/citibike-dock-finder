import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StationCard } from "@/components/StationCard";
import { StationList } from "@/components/StationList";
import { ModeToggle } from "@/components/ModeToggle";
import { describeAge } from "@/components/LastUpdated";
import { makeStation } from "./fixtures";

afterEach(cleanup);

const station = { ...makeStation({ classicBikes: 1, ebikes: 0, docks: 12 }), distanceMeters: 347 };

describe("StationCard", () => {
  it("shows the name, distance and walking time", () => {
    render(<StationCard station={station} mode="bike" />);

    expect(screen.getByRole("heading", { name: "E 68 St & Lexington Ave" })).toBeTruthy();
    expect(screen.getByText("350 m")).toBeTruthy();
    expect(screen.getByText(/4 min walk/)).toBeTruthy();
  });

  it("shows counts as text, with singular and plural labels", () => {
    render(<StationCard station={station} mode="bike" />);

    expect(screen.getByText("bike")).toBeTruthy();
    expect(screen.getByText("e-bikes")).toBeTruthy();
    expect(screen.getByText("docks")).toBeTruthy();
    expect(screen.getByText("12")).toBeTruthy();
  });

  it("links to walking directions with an accessible name", () => {
    render(<StationCard station={station} mode="dock" />);

    const link = screen.getByRole("link", { name: /walking directions to e 68 st/i });
    expect(link.getAttribute("href")).toContain("travelmode=walking");
  });
});

describe("StationList", () => {
  it("shows a helpful empty state", () => {
    render(<StationList stations={[]} mode="dock" />);
    expect(screen.getByText(/no stations with open docks nearby/i)).toBeTruthy();
  });

  it("renders one item per station", () => {
    render(
      <StationList
        stations={[station, { ...station, id: "b", name: "Other station" }]}
        mode="bike"
      />,
    );
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });
});

describe("ModeToggle", () => {
  it("marks the selected mode and reports clicks", async () => {
    const onChange = vi.fn();
    render(<ModeToggle mode="bike" onChange={onChange} />);

    const bike = screen.getByRole("button", { name: "I need a bike" });
    const dock = screen.getByRole("button", { name: "I need a dock" });
    expect(bike.getAttribute("aria-pressed")).toBe("true");
    expect(dock.getAttribute("aria-pressed")).toBe("false");

    await userEvent.click(dock);
    expect(onChange).toHaveBeenCalledWith("dock");
  });
});

describe("describeAge", () => {
  it("describes how old the data is", () => {
    expect(describeAge(0, 20_000)).toBe("less than a minute ago");
    expect(describeAge(0, 60_000)).toBe("1 minute ago");
    expect(describeAge(0, 180_000)).toBe("3 minutes ago");
  });
});
