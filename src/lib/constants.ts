import type { LatLon } from "@/types/station";

// Citi Bike's public GBFS feeds found in: https://gbfs.citibikenyc.com/gbfs/gbfs.json
export const STATION_INFO_URL = "https://gbfs.lyft.com/gbfs/1.1/bkn/en/station_information.json";
export const STATION_STATUS_URL = "https://gbfs.lyft.com/gbfs/1.1/bkn/en/station_status.json";

// Used until the user shares their location (or if they say no).
export const DEFAULT_LOCATION: LatLon = { lat: 40.7685, lon: -73.9645 };
export const DEFAULT_LOCATION_LABEL = "Hunter College";

export const RESULT_LIMIT = 10;

// Rough walking speed used for "X min walk" (about 4.8 km/h).
export const WALKING_METERS_PER_MINUTE = 80;
