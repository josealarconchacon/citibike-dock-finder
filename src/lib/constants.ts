import type { LatLon } from "@/types/station";

// Citi Bike's public GBFS feeds found in: https://gbfs.citibikenyc.com/gbfs/gbfs.json
export const STATION_INFO_URL = "https://gbfs.lyft.com/gbfs/1.1/bkn/en/station_information.json";
export const STATION_STATUS_URL = "https://gbfs.lyft.com/gbfs/1.1/bkn/en/station_status.json";

// Give up on a feed that hasn't answered by then, so the page shows its error state
// instead of hanging.
export const FEED_TIMEOUT_MS = 8_000;

// Used until the user shares their location (or if they say no).
export const DEFAULT_LOCATION: LatLon = { lat: 40.7685, lon: -73.9645 };
export const DEFAULT_LOCATION_LABEL = "Hunter College";

export const RESULT_LIMIT = 10;

// Stations farther than this aren't a realistic walk (about an hour), so they are never listed.
export const MAX_DISTANCE_METERS = 5_000;

// Rough walking speed used for "X min walk" (about 4.8 km/h).
export const WALKING_METERS_PER_MINUTE = 80;

export const MAP_TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
export const MAP_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

// The maximum number of stations a user can favorite.
export const MAX_FAVORITES = 5;
