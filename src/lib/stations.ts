import type { StationInfo, StationStatus } from "@/lib/schemas";
import type { Station } from "@/types/station";

// The two feeds only share station_id, so we join them ourselves.
// Stations that are not installed, have no capacity, or have no status are dropped.
export function joinStations(info: StationInfo[], status: StationStatus[]): Station[] {
  const statusById = new Map(status.map((s) => [s.station_id, s]));
  const stations: Station[] = [];

  for (const station of info) {
    const live = statusById.get(station.station_id);

    if (!live || !live.is_installed || station.capacity <= 0) {
      continue;
    }

    stations.push({
      id: station.station_id,
      name: station.name,
      lat: station.lat,
      lon: station.lon,
      capacity: station.capacity,
      // num_bikes_available already includes e-bikes.
      classicBikes: Math.max(0, live.num_bikes_available - live.num_ebikes_available),
      ebikes: live.num_ebikes_available,
      docks: live.num_docks_available,
      isRenting: live.is_renting,
      isReturning: live.is_returning,
      lastReported: live.last_reported * 1000,
    });
  }

  return stations;
}
