import { describe, expect, it } from "vitest";
import { buildHref } from "@/lib/href";
import { parseQuery } from "@/lib/query";

describe("buildHref", () => {
  it("includes only the mode for the default list view with no location", () => {
    expect(buildHref({ mode: "dock", view: "list" })).toBe("/?mode=dock");
  });

  it("adds view=map for the map view", () => {
    expect(buildHref({ mode: "bike", view: "map" })).toBe("/?mode=bike&view=map");
  });

  it("rounds coordinates to 5 decimals", () => {
    expect(
      buildHref({ mode: "bike", view: "list", origin: { lat: 40.768512345, lon: -73.964598765 } }),
    ).toBe("/?mode=bike&lat=40.76851&lon=-73.96460");
  });

  it("builds URLs that parseQuery reads back", () => {
    const href = buildHref({ mode: "dock", view: "map", origin: { lat: 40.68, lon: -73.97 } });
    const url = new URL(href, "http://localhost");

    expect(parseQuery(Object.fromEntries(url.searchParams))).toEqual({
      origin: { lat: 40.68, lon: -73.97 },
      mode: "dock",
      view: "map",
      usingDefaultLocation: false,
    });
  });
});
