import { describe, expect, it } from "vitest";
import { formatDistance, haversine, walkingMinutes } from "@/lib/distance";

const hunterCollege = { lat: 40.7685, lon: -73.9645 };
const timesSquare = { lat: 40.758, lon: -73.9855 };

describe("haversine", () => {
  it("returns 0 for the same point", () => {
    expect(haversine(hunterCollege, hunterCollege)).toBe(0);
  });

  it("measures Hunter College to Times Square as about 2.1 km", () => {
    const meters = haversine(hunterCollege, timesSquare);
    expect(meters).toBeGreaterThan(2050);
    expect(meters).toBeLessThan(2200);
  });

  it("gives the same answer in both directions", () => {
    expect(haversine(hunterCollege, timesSquare)).toBeCloseTo(
      haversine(timesSquare, hunterCollege),
    );
  });
});

describe("formatDistance", () => {
  it("rounds short distances to 10 m", () => {
    expect(formatDistance(347)).toBe("350 m");
  });

  it("shows kilometers with one decimal from 1 km", () => {
    expect(formatDistance(1234)).toBe("1.2 km");
  });
});

describe("walkingMinutes", () => {
  it("never shows 0 minutes", () => {
    expect(walkingMinutes(10)).toBe(1);
  });

  it("uses about 80 m per minute", () => {
    expect(walkingMinutes(800)).toBe(10);
  });
});
