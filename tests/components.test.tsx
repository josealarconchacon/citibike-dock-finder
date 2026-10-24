import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { StationCard } from "@/components/StationCard";
import { StationList } from "@/components/StationList";
import { ModeToggle } from "@/components/ModeToggle";
import { StationFinder } from "@/components/StationFinder";
import { ViewToggle } from "@/components/ViewToggle";
import { describeAge } from "@/components/LastUpdated";
import { makeStation } from "./fixtures";

// The real router and <Link> need a running Next.js app, so tests use simple stand-ins.
const { push } = vi.hoisted(() => ({ push: vi.fn() }));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

type LinkProps = ComponentProps<"a"> & {
  onNavigate?: (event: { preventDefault: () => void }) => void;
};

vi.mock("next/link", () => ({
  // Like the real <Link>, a click calls onNavigate. jsdom can't load pages, so it stops there.
  default: ({ onNavigate, ...props }: LinkProps) => (
    <a
      {...props}
      onClick={(event) => {
        event.preventDefault();
        onNavigate?.({ preventDefault: () => {} });
      }}
    />
  ),
  useLinkStatus: () => ({ pending: false }),
}));

type Geolocate = (
  onSuccess: (position: { coords: { latitude: number; longitude: number } }) => void,
  onError: (error: { code: number; PERMISSION_DENIED: number }) => void,
) => void;

// jsdom has no navigator.geolocation, so each test supplies its own answer.
function stubGeolocation(getCurrentPosition: Geolocate) {
  Object.defineProperty(navigator, "geolocation", {
    configurable: true,
    value: { getCurrentPosition },
  });
}

afterEach(() => {
  cleanup();
  push.mockClear();
  vi.unstubAllGlobals();
  delete (navigator as { geolocation?: unknown }).geolocation;
});

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

  it("explains when the location is outside Citi Bike's area", () => {
    render(<StationList stations={[]} mode="dock" outsideServiceArea />);

    expect(screen.getByText(/no citi bike stations within 5 km/i)).toBeTruthy();
    const link = screen.getByRole("link", { name: "See stations near Hunter College" });
    expect(link.getAttribute("href")).toBe("/?mode=dock");
  });

  it("renders one item per station", () => {
    render(
      <StationList
        stations={[station, { ...station, id: "b", name: "Other station" }]}
        mode="bike"
      />,
    );
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(
      screen.getByRole("heading", { level: 2, name: "Nearest stations with bikes" }),
    ).toBeTruthy();
    expect(screen.getByRole("region", { name: "Nearest stations with bikes" })).toBeTruthy();
  });
});

describe("ModeToggle", () => {
  it("renders each mode as a link and marks the current one", () => {
    render(<ModeToggle mode="bike" />);

    const bike = screen.getByRole("link", { name: "I need a bike" });
    const dock = screen.getByRole("link", { name: "I need a dock" });
    expect(bike.getAttribute("aria-current")).toBe("page");
    expect(dock.getAttribute("aria-current")).toBeNull();
    expect(dock.getAttribute("href")).toBe("/?mode=dock");
  });

  it("keeps the map view in the mode links", () => {
    render(<ModeToggle mode="bike" view="map" />);

    expect(screen.getByRole("link", { name: "I need a dock" }).getAttribute("href")).toBe(
      "/?mode=dock&view=map",
    );
  });
});

describe("ViewToggle", () => {
  it("marks the current view and keeps mode and location in the links", () => {
    render(<ViewToggle view="list" mode="dock" origin={{ lat: 40.68, lon: -73.97 }} />);

    const list = screen.getByRole("link", { name: "List" });
    const map = screen.getByRole("link", { name: "Map" });
    expect(list.getAttribute("aria-current")).toBe("page");
    expect(map.getAttribute("aria-current")).toBeNull();
    expect(map.getAttribute("href")).toBe("/?mode=dock&view=map&lat=40.680&lon=-73.970");
  });
});

describe("StationFinder", () => {
  const userLocation = { lat: 40.68, lon: -73.97 };

  it("renders the list it is given", () => {
    render(
      <StationFinder mode="bike" updatedAt={0}>
        <StationList stations={[station]} mode="bike" />
      </StationFinder>,
    );

    // The page also has other lists (like the color key), so look only inside the results.
    const results = screen.getByRole("region", { name: "Nearest stations with bikes" });
    expect(within(results).getAllByRole("listitem")).toHaveLength(1);
  });

  it("leaves the location out of the mode links while on the default location", () => {
    render(
      <StationFinder mode="bike" updatedAt={0}>
        {null}
      </StationFinder>,
    );

    expect(screen.getByText("Near Hunter College")).toBeTruthy();
    expect(screen.getByRole("link", { name: "I need a dock" }).getAttribute("href")).toBe(
      "/?mode=dock",
    );
  });

  it("keeps the user's location in the mode links", () => {
    render(
      <StationFinder mode="bike" origin={userLocation} updatedAt={0}>
        {null}
      </StationFinder>,
    );

    expect(screen.getByText("Near you")).toBeTruthy();
    expect(screen.getByRole("link", { name: "I need a dock" }).getAttribute("href")).toBe(
      "/?mode=dock&lat=40.680&lon=-73.970",
    );
  });

  it("links to the other mode, keeping the user's location", async () => {
    render(
      <StationFinder mode="bike" origin={userLocation} updatedAt={0}>
        {null}
      </StationFinder>,
    );

    expect(screen.getByRole("link", { name: "I need a dock" }).getAttribute("href")).toBe(
      "/?mode=dock&lat=40.680&lon=-73.970",
    );
  });

  it("stays on the map when switching mode", async () => {
    render(
      <StationFinder mode="bike" view="map" updatedAt={0}>
        {null}
      </StationFinder>,
    );

    expect(screen.getByRole("link", { name: "Map" }).getAttribute("aria-current")).toBe("page");

    expect(screen.getByRole("link", { name: "I need a dock" }).getAttribute("href")).toBe(
      "/?mode=dock&view=map",
    );
  });

  it("stays on the map when going to the user's location", async () => {
    stubGeolocation((onSuccess) => onSuccess({ coords: { latitude: 40.68, longitude: -73.97 } }));
    render(
      <StationFinder mode="bike" view="map" updatedAt={0}>
        {null}
      </StationFinder>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Use my location" }));

    expect(push).toHaveBeenCalledWith("/?mode=bike&view=map&lat=40.680&lon=-73.970");
  });

  it("shows how old the data is", () => {
    render(
      <StationFinder mode="bike" updatedAt={Date.now()}>
        {null}
      </StationFinder>,
    );

    // "Updated" sits in its own span so phones can hide it visually.
    expect(screen.getByText("just now").textContent).toBe("Updated just now");
  });

  it("navigates to the user's location, keeping the current mode", async () => {
    stubGeolocation((onSuccess) => onSuccess({ coords: { latitude: 40.68, longitude: -73.97 } }));
    render(
      <StationFinder mode="dock" updatedAt={0}>
        {null}
      </StationFinder>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Use my location" }));

    expect(push).toHaveBeenCalledWith("/?mode=dock&lat=40.680&lon=-73.970");
  });

  it("shows an error and stays put when location is blocked", async () => {
    stubGeolocation((_onSuccess, onError) => onError({ code: 1, PERMISSION_DENIED: 1 }));
    render(
      <StationFinder mode="bike" updatedAt={0}>
        {null}
      </StationFinder>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Use my location" }));

    expect(screen.getByRole("alert").textContent).toBe(
      "Location is blocked, so this list still shows stations near Hunter College.",
    );
    expect(push).not.toHaveBeenCalled();
  });

  it("does not mention the default location when one was already shared", async () => {
    stubGeolocation((_onSuccess, onError) => onError({ code: 1, PERMISSION_DENIED: 1 }));
    render(
      <StationFinder mode="bike" origin={userLocation} updatedAt={0}>
        {null}
      </StationFinder>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Use my location" }));

    expect(screen.getByRole("alert").textContent).toBe(
      "Location is blocked, so this list still shows stations near your last location.",
    );
  });

  it("explains that location needs https instead of asking the browser", async () => {
    // Like opening the dev server on a phone at http://192.168.x.x.
    vi.stubGlobal("isSecureContext", false);
    const getCurrentPosition = vi.fn();
    stubGeolocation(getCurrentPosition);
    render(
      <StationFinder mode="bike" updatedAt={0}>
        {null}
      </StationFinder>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Use my location" }));

    expect(screen.getByRole("alert").textContent).toBe(
      "Your browser only shares your location on secure (https://) pages.",
    );
    expect(getCurrentPosition).not.toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();
  });
});

describe("describeAge", () => {
  it("describes how old the data is", () => {
    expect(describeAge(0, 20_000)).toBe("just now");
    expect(describeAge(0, 60_000)).toBe("1 min ago");
    expect(describeAge(0, 180_000)).toBe("3 min ago");
  });
});
