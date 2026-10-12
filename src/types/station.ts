export type Mode = "bike" | "dock";

// Howstations are shown: a list (default) or a map.
export type View = "list" | "map";

export type LatLon = {
  lat: number;
  lon: number;
};

export type Station = LatLon & {
  id: string;
  name: string;
  classicBikes: number; // num_bikes_available minus num_ebikes_available
  ebikes: number;
  docks: number;
  isRenting: boolean;
  isReturning: boolean;
};

export type NearbyStation = Station & {
  distanceMeters: number;
};

// What getNearbyStations() hands to the page.
export type StationsResult = {
  stations: NearbyStation[];
  origin: LatLon;
  mode: Mode;
  usingDefaultLocation: boolean;
  outsideServiceArea: boolean; // no station of any kind within MAX_DISTANCE_METERS
  updatedAt: number; // milliseconds
};
