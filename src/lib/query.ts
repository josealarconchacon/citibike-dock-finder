import { z } from "zod";
import { DEFAULT_LOCATION } from "@/lib/constants";
import type { LatLon, Mode } from "@/types/station";

type RawParam = string | string[] | null | undefined;

const first = (value: RawParam) => (Array.isArray(value) ? value[0] : (value ?? undefined));

// Only a plain decimal such as "40.68" or "-73.97" counts as a coordinate. Checking the text
// first matters because Number("") and Number(" ") are both 0, which is a valid latitude.
const decimal = z
  .string()
  .trim()
  .regex(/^-?\d+(\.\d+)?$/)
  .transform(Number);

const latSchema = decimal.pipe(z.number().min(-90).max(90));
const lonSchema = decimal.pipe(z.number().min(-180).max(180));
const modeSchema = z.enum(["bike", "dock"]);

// Turns ?lat=..&lon=..&mode=.. into safe values. Anything missing or invalid
// falls back to the default location
export function parseQuery(params: { lat?: RawParam; lon?: RawParam; mode?: RawParam }): {
  origin: LatLon;
  mode: Mode;
  usingDefaultLocation: boolean;
} {
  const lat = latSchema.safeParse(first(params.lat));
  const lon = lonSchema.safeParse(first(params.lon));
  const mode = modeSchema.safeParse(first(params.mode));
  const hasLocation = lat.success && lon.success;

  return {
    origin: hasLocation ? { lat: lat.data, lon: lon.data } : DEFAULT_LOCATION,
    mode: mode.success ? mode.data : "bike",
    usingDefaultLocation: !hasLocation,
  };
}

// The opposite of parseQuery: the one place that builds URLs, so the mode links and
// "Use my location" always agree.
// Rounds to 3 decimals (about 110 m): close enough to rank stations, but an exact
// GPS fix never lands in browser history or server logs.
export function buildHref(mode: Mode, origin?: LatLon): string {
  const params = new URLSearchParams({ mode });
  if (origin) {
    params.set("lat", origin.lat.toFixed(3));
    params.set("lon", origin.lon.toFixed(3));
  }
  return `/?${params}`;
}
