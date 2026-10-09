export type Mode = "bike" | "dock";

export type LatLon = {
  lat: number;
  lon: number;
};

export type Station = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  capacity: number;
  classicBikes: number; // num_bikes_available minus num_ebikes_available
  ebikes: number;
  docks: number;
  isRenting: boolean;
  isReturning: boolean;
  lastReported: number; // milliseconds (the feed sends seconds)
};

export type NearbyStation = Station & {
  distanceMeters: number;
};

// What the page and the API route both send to the browser.
export type StationsResult = {
  stations: NearbyStation[];
  origin: LatLon;
  mode: Mode;
  usingDefaultLocation: boolean;
  updatedAt: number; // milliseconds
};
