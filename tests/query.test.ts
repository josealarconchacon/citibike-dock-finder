import { describe, expect, it } from "vitest";
import { parseQuery } from "@/lib/query";
import { DEFAULT_LOCATION } from "@/lib/constants";

describe("parseQuery", () => {
  it("uses the default location and bike mode when nothing is given", () => {
    expect(parseQuery({})).toEqual({
      origin: DEFAULT_LOCATION,
      mode: "bike",
      usingDefaultLocation: true,
    });
  });

  it("reads a valid location and mode", () => {
    expect(parseQuery({ lat: "40.68", lon: "-73.97", mode: "dock" })).toEqual({
      origin: { lat: 40.68, lon: -73.97 },
      mode: "dock",
      usingDefaultLocation: false,
    });
  });

  it("falls back when lat or lon is not a number or out of range", () => {
    expect(parseQuery({ lat: "abc", lon: "-73.97" }).usingDefaultLocation).toBe(true);
    expect(parseQuery({ lat: "200", lon: "-73.97" }).usingDefaultLocation).toBe(true);
    expect(parseQuery({ lat: "", lon: "" }).usingDefaultLocation).toBe(true);
  });

  it("falls back to bike mode for an unknown mode", () => {
    expect(parseQuery({ mode: "scooter" }).mode).toBe("bike");
  });

  it("takes the first value when a param repeats", () => {
    expect(parseQuery({ mode: ["dock", "bike"] }).mode).toBe("dock");
  });
});
