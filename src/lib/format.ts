import type { Mode, Station } from "@/types/station";

type Counts = Pick<Station, "classicBikes" | "ebikes" | "docks">;

// plural(1, "dock") -> "1 dock", plural(3, "dock") -> "3 docks"
export function plural(count: number, word: string): string {
  return `${count} ${word}${count === 1 ? "" : "s"}`;
}

// Shows only what matters for the current mode.
export function availabilityText(station: Counts, mode: Mode): string {
  if (mode === "dock") {
    return plural(station.docks, "open dock");
  }
  return `${plural(station.classicBikes, "classic bike")} · ${plural(station.ebikes, "e-bike")}`;
}

// The single number that matters for the current mode: bikes, or open docks.
export function usefulCount(station: Counts, mode: Mode): number {
  return mode === "dock" ? station.docks : station.classicBikes + station.ebikes;
}

export type AvailabilityLevel = "none" | "low" | "good";

// 0 = none, 1-3 = low, 4+ = good. Used to color map markers.
export function availabilityLevel(count: number): AvailabilityLevel {
  if (count === 0) return "none";
  if (count <= 3) return "low";
  return "good";
}
