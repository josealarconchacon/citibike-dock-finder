import { describe, expect, it } from "vitest";
import { availabilityLevel, availabilityText, plural, unitLabel, usefulCount } from "@/lib/format";

const station = { classicBikes: 1, ebikes: 2, docks: 1 };

describe("plural", () => {
  it("uses the singular for exactly one", () => {
    expect(plural(1, "dock")).toBe("1 dock");
  });

  it("uses the plural for zero and for many", () => {
    expect(plural(0, "dock")).toBe("0 docks");
    expect(plural(3, "dock")).toBe("3 docks");
  });
});

describe("availabilityText", () => {
  it("shows open docks in dock mode", () => {
    expect(availabilityText(station, "dock")).toBe("1 open dock");
  });

  it("shows classic bikes and e-bikes in bike mode", () => {
    expect(availabilityText(station, "bike")).toBe("1 classic bike · 2 e-bikes");
  });
});

describe("usefulCount", () => {
  it("counts all bikes in bike mode and docks in dock mode", () => {
    expect(usefulCount(station, "bike")).toBe(3);
    expect(usefulCount(station, "dock")).toBe(1);
  });
});

describe("unitLabel", () => {
  it("names the unit for the mode, singular for 1", () => {
    expect(unitLabel(1, "bike")).toBe("bike");
    expect(unitLabel(0, "bike")).toBe("bikes");
    expect(unitLabel(1, "dock")).toBe("dock");
    expect(unitLabel(7, "dock")).toBe("docks");
  });
});

describe("availabilityLevel", () => {
  it("groups counts into none, low and good", () => {
    expect(availabilityLevel(0)).toBe("none");
    expect(availabilityLevel(1)).toBe("low");
    expect(availabilityLevel(3)).toBe("low");
    expect(availabilityLevel(4)).toBe("good");
  });
});
