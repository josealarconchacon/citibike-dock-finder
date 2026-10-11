import type { StationInfo, StationStatus } from "@/lib/schemas";
import type { Station } from "@/types/station";

// Mock data shaped like the real feeds, so tests never call Citi Bike.
export function makeInfo(overrides: Partial<StationInfo> = {}): StationInfo {
  return {
    station_id: "a",
    name: "E 68 St & Lexington Ave",
    lat: 40.7685,
    lon: -73.9645,
    capacity: 30,
    ...overrides,
  };
}

export function makeStatus(overrides: Partial<StationStatus> = {}): StationStatus {
  return {
    station_id: "a",
    num_bikes_available: 10,
    num_ebikes_available: 4,
    num_docks_available: 20,
    is_installed: true,
    is_renting: true,
    is_returning: true,
    ...overrides,
  };
}

export function makeStation(overrides: Partial<Station> = {}): Station {
  return {
    id: "a",
    name: "E 68 St & Lexington Ave",
    lat: 40.7685,
    lon: -73.9645,
    classicBikes: 6,
    ebikes: 4,
    docks: 20,
    isRenting: true,
    isReturning: true,
    ...overrides,
  };
}
