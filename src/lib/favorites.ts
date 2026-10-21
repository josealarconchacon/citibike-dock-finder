import { MAX_FAVORITES } from "./constants";
import type { Station } from "../types/station";

// Favorites are saved in a cookie, so the server can show them with live counts.
export const FAVORITES_COOKIE = "favorites";
export const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export function parseFavorites(value: string | undefined): string[] {
  if (!value) return [];
  const ids = value.split(",").filter((id) => id.length > 0);
  return [...new Set(ids)].slice(0, MAX_FAVORITES);
}

// Adds an id to the front, without duplicates, keeping at most MAX_FAVORITES.
export function addFavorite(ids: string[], id: string): string[] {
  return [id, ...ids.filter((existing) => existing !== id)].slice(0, MAX_FAVORITES);
}

export function removeFavorite(ids: string[], id: string): string[] {
  return ids.filter((existing) => existing !== id);
}

// Matches what the user typed to a station name, ignoring case and extra spaces.
export function findStationByName(stations: Station[], name: string): Station | undefined {
  const wanted = name.trim().toLowerCase();
  if (!wanted) return undefined;
  return stations.find((station) => station.name.toLowerCase() === wanted);
}

// Keeps the saved order, and skips ids that are no longer in the feed.
export function pickFavorites(stations: Station[], ids: string[]): Station[] {
  const byId = new Map(stations.map((station) => [station.id, station]));
  return ids.flatMap((id) => {
    const station = byId.get(id);
    return station ? [station] : [];
  });
}
