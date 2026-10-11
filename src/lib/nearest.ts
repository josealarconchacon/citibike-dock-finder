import { MAX_DISTANCE_METERS, RESULT_LIMIT } from "@/lib/constants";
import { haversine } from "@/lib/distance";
import type { LatLon, Mode, NearbyStation, Station } from "@/types/station";

// check if this station help someone who needs a bike, or needs a dock.
export function isUseful(station: Station, mode: Mode): boolean {
  if (mode === "bike") {
    return station.isRenting && station.classicBikes + station.ebikes > 0;
  }
  return station.isReturning && station.docks > 0;
}

// True when any station at all is within range, even a full or empty one. Lets the page
// tell "everything nearby is taken" apart from "there is no Citi Bike around here".
export function isInServiceArea(stations: Station[], origin: LatLon): boolean {
  return stations.some((station) => haversine(origin, station) <= MAX_DISTANCE_METERS);
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
    .filter((station) => station.distanceMeters <= MAX_DISTANCE_METERS)
    .sort((a, b) => a.distanceMeters - b.distanceMeters)
    .slice(0, limit);
}
