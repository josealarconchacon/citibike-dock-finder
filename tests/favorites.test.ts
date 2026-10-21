import { describe, expect, it } from "vitest";
import {
  addFavorite,
  findStationByName,
  parseFavorites,
  pickFavorites,
  removeFavorite,
} from "@/lib/favorites";
import { makeStation } from "./fixtures";

describe("parseFavorites", () => {
  it("returns an empty list when there is no cookie", () => {
    expect(parseFavorites(undefined)).toEqual([]);
    expect(parseFavorites("")).toEqual([]);
  });

  it("splits ids, drops blanks and duplicates", () => {
    expect(parseFavorites("a,,b,a")).toEqual(["a", "b"]);
  });

  it("keeps at most 5", () => {
    expect(parseFavorites("a,b,c,d,e,f")).toEqual(["a", "b", "c", "d", "e"]);
  });
});

describe("addFavorite and removeFavorite", () => {
  it("adds to the front without duplicates", () => {
    expect(addFavorite(["a", "b"], "b")).toEqual(["b", "a"]);
  });

  it("drops the oldest when the list is full", () => {
    expect(addFavorite(["a", "b", "c", "d", "e"], "f")).toEqual(["f", "a", "b", "c", "d"]);
  });

  it("removes an id", () => {
    expect(removeFavorite(["a", "b"], "a")).toEqual(["b"]);
  });
});

describe("findStationByName", () => {
  const stations = [makeStation({ id: "a", name: "E 68 St & Lexington Ave" })];

  it("ignores case and extra spaces", () => {
    expect(findStationByName(stations, "  e 68 st & lexington ave ")?.id).toBe("a");
  });

  it("returns undefined for an unknown or empty name", () => {
    expect(findStationByName(stations, "Nowhere")).toBeUndefined();
    expect(findStationByName(stations, "   ")).toBeUndefined();
  });
});

describe("pickFavorites", () => {
  it("keeps the saved order and skips stations that left the feed", () => {
    const stations = [makeStation({ id: "a" }), makeStation({ id: "b" })];
    expect(pickFavorites(stations, ["b", "gone", "a"]).map((s) => s.id)).toEqual(["b", "a"]);
  });
});
