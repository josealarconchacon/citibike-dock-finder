import { RESULT_LIMIT } from "@/lib/constants";
import { haversine } from "@/lib/distance";
import type { LatLon, Mode, NearbyStation, Station } from "@/types/station";

// check if this station help someone who needs a bike, or needs a dock.
export function isUseful(station: Station, mode: Mode): boolean {
  if (mode === "bike") {
    return station.isRenting && station.classicBikes + station.ebikes > 0;
  }
  return station.isReturning && station.docks > 0;
}

export function nearest(
  stations: Station[],
  origin: LatLon,
  mode: Mode,
  limit: number = RESULT_LIMIT,
): NearbyStation[] {
  return stations
    .filter((station) => isUseful(station, mode))
    .map((station) => ({ ...station, distanceMeters: haversine(origin, station) }))
    .sort((a, b) => a.distanceMeters - b.distanceMeters)
    .slice(0, limit);
}
