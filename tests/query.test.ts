import { describe, expect, it } from "vitest";
import { buildHref } from "@/lib/href";
import { parseQuery } from "@/lib/query";
import { DEFAULT_LOCATION } from "@/lib/constants";

describe("parseQuery", () => {
  it("uses the default location, bike mode and list view when nothing is given", () => {
    expect(parseQuery({})).toEqual({
      origin: DEFAULT_LOCATION,
      mode: "bike",
      view: "list",
      usingDefaultLocation: true,
    });
  });

  it("reads a valid location and mode", () => {
    expect(parseQuery({ lat: "40.68", lon: "-73.97", mode: "dock" })).toEqual({
      origin: { lat: 40.68, lon: -73.97 },
      mode: "dock",
      view: "list",
      usingDefaultLocation: false,
    });
  });

  it("reads the map view and falls back to list for an unknown view", () => {
    expect(parseQuery({ view: "map" }).view).toBe("map");
    expect(parseQuery({ view: "globe" }).view).toBe("list");
  });

  it("falls back when lat or lon is not a number or out of range", () => {
    expect(parseQuery({ lat: "abc", lon: "-73.97" }).usingDefaultLocation).toBe(true);
    expect(parseQuery({ lat: "200", lon: "-73.97" }).usingDefaultLocation).toBe(true);
    expect(parseQuery({ lat: "", lon: "" }).usingDefaultLocation).toBe(true);
  });

  it("falls back when lat or lon is text that JavaScript would turn into a number", () => {
    expect(parseQuery({ lat: " ", lon: " " }).usingDefaultLocation).toBe(true);
    expect(parseQuery({ lat: "0x10", lon: "-73.97" }).usingDefaultLocation).toBe(true);
    expect(parseQuery({ lat: "4e1", lon: "-73.97" }).usingDefaultLocation).toBe(true);
  });

  it("falls back when only one of lat and lon is given", () => {
    expect(parseQuery({ lat: "40.68" }).usingDefaultLocation).toBe(true);
  });

  it("accepts 0 as a real coordinate", () => {
    expect(parseQuery({ lat: "0", lon: "0" })).toMatchObject({
      origin: { lat: 0, lon: 0 },
      usingDefaultLocation: false,
    });
  });

  it("falls back to bike mode for an unknown mode", () => {
    expect(parseQuery({ mode: "scooter" }).mode).toBe("bike");
  });

  it("takes the first value when a param repeats", () => {
    expect(parseQuery({ mode: ["dock", "bike"] }).mode).toBe("dock");
  });
});

describe("buildHref", () => {
  it("builds a link with only the mode when there is no location", () => {
    expect(buildHref({ mode: "dock", view: "list" })).toBe("/?mode=dock");
  });

  it("adds the view only when it is the map", () => {
    expect(buildHref({ mode: "dock", view: "map" })).toBe("/?mode=dock&view=map");
  });

  it("adds the location rounded to 5 decimals", () => {
    expect(
      buildHref({ mode: "bike", view: "list", origin: { lat: 40.123456789, lon: -73.987654321 } }),
    ).toBe("/?mode=bike&lat=40.12346&lon=-73.98765");
  });

  it("produces a URL that parseQuery reads back to the same values", () => {
    const origin = { lat: 40.68, lon: -73.97 };
    const href = buildHref({ mode: "dock", view: "map", origin });
    const params = new URL(href, "http://localhost").searchParams;

    expect(parseQuery(Object.fromEntries(params))).toEqual({
      origin,
      mode: "dock",
      view: "map",
      usingDefaultLocation: false,
    });
  });
});
