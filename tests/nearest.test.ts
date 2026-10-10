import { describe, expect, it } from "vitest";
import { nearest } from "@/lib/nearest";
import { makeStation } from "./fixtures";

const origin = { lat: 40.7685, lon: -73.9645 };

const close = makeStation({ id: "close", lat: 40.769, lon: -73.9645 });
const middle = makeStation({ id: "middle", lat: 40.772, lon: -73.9645 });
const far = makeStation({ id: "far", lat: 40.78, lon: -73.9645 });

describe("nearest", () => {
  it("sorts stations from closest to farthest", () => {
    const result = nearest([far, close, middle], origin, "bike");
    expect(result.map((s) => s.id)).toEqual(["close", "middle", "far"]);
  });

  it("adds the distance in meters", () => {
    const [first] = nearest([close], origin, "bike");
    expect(first.distanceMeters).toBeGreaterThan(50);
    expect(first.distanceMeters).toBeLessThan(60);
  });

  it("limits the number of results", () => {
    expect(nearest([far, close, middle], origin, "bike", 2)).toHaveLength(2);
  });

  it("in bike mode, hides stations with no bikes or not renting", () => {
    const empty = makeStation({ id: "empty", classicBikes: 0, ebikes: 0 });
    const notRenting = makeStation({ id: "off", isRenting: false });
    const onlyEbikes = makeStation({ id: "ebikes", classicBikes: 0, ebikes: 2 });

    const ids = nearest([empty, notRenting, onlyEbikes], origin, "bike").map((s) => s.id);
    expect(ids).toEqual(["ebikes"]);
  });

  it("in dock mode, hides stations with no docks or not returning", () => {
    const full = makeStation({ id: "full", docks: 0 });
    const notReturning = makeStation({ id: "off", isReturning: false });
    const open = makeStation({ id: "open", docks: 3 });

    const ids = nearest([full, notReturning, open], origin, "dock").map((s) => s.id);
    expect(ids).toEqual(["open"]);
  });

  it("returns an empty list when nothing matches", () => {
    expect(nearest([makeStation({ docks: 0 })], origin, "dock")).toEqual([]);
  });
});
