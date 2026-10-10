import { WALKING_METERS_PER_MINUTE } from "@/lib/constants";
import type { LatLon } from "@/types/station";

const EARTH_RADIUS_METERS = 6_371_000;

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

// straight-line distance between two points on Earth, in meters.
export function haversine(a: LatLon, b: LatLon): number {
  const dLat = toRadians(b.lat - a.lat);
  const dLon = toRadians(b.lon - a.lon);
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);

  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

  return 2 * EARTH_RADIUS_METERS * Math.asin(Math.sqrt(h));
}

// 347 -> "350 m", 1234 -> "1.2 km"
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters / 10) * 10} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}

export function walkingMinutes(meters: number): number {
  return Math.max(1, Math.round(meters / WALKING_METERS_PER_MINUTE));
}
