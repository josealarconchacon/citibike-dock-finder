import { cacheLife } from "next/cache";
import { fetchFeeds } from "@/lib/gbfs";
import { nearest } from "@/lib/nearest";
import { joinStations } from "@/lib/stations";
import type { LatLon, Mode, Station, StationsResult } from "@/types/station";
import { parseValidStations, stationInfoSchema, stationStatusSchema } from "@/lib/schemas";

// Cached for 60 seconds (same as the feed), so we don't hit Citi Bike on every visit.
// Only cache the joined list because the raw feeds are big.
export async function getAllStations(): Promise<{ stations: Station[]; updatedAt: number }> {
  "use cache";
  cacheLife({ stale: 60, revalidate: 60, expire: 300 });

  const { info, status } = await fetchFeeds();

  return {
    stations: joinStations(
      parseValidStations(stationInfoSchema, info.data.stations),
      parseValidStations(stationStatusSchema, status.data.stations),
    ),
    updatedAt: status.last_updated * 1000,
  };
}

// Used by both the page (first load) and the API route refreshes.
export async function getNearbyStations(query: {
  origin: LatLon;
  mode: Mode;
  usingDefaultLocation: boolean;
}): Promise<StationsResult> {
  const { stations, updatedAt } = await getAllStations();

  return {
    stations: nearest(stations, query.origin, query.mode),
    origin: query.origin,
    mode: query.mode,
    usingDefaultLocation: query.usingDefaultLocation,
    updatedAt,
  };
}
