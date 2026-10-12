import { z } from "zod";
import { DEFAULT_LOCATION } from "@/lib/constants";
import type { LatLon, Mode, View } from "@/types/station";

type RawParam = string | string[] | null | undefined;

const first = (value: RawParam) => (Array.isArray(value) ? value[0] : (value ?? undefined));

const latSchema = z.coerce.number().min(-90).max(90);
const lonSchema = z.coerce.number().min(-180).max(180);
const modeSchema = z.enum(["bike", "dock"]);
const viewSchema = z.enum(["list", "map"]);

// Turns ?lat=..&lon=..&mode=..&view=.. into safe values. Anything missing or invalid
// falls back to the default location, "bike" mode and "list" view instead of crashing.
export function parseQuery(params: {
  lat?: RawParam;
  lon?: RawParam;
  mode?: RawParam;
  view?: RawParam;
}): {
  origin: LatLon;
  mode: Mode;
  view: View;
  usingDefaultLocation: boolean;
} {
  const lat = latSchema.safeParse(first(params.lat));
  const lon = lonSchema.safeParse(first(params.lon));
  const mode = modeSchema.safeParse(first(params.mode));
  const view = viewSchema.safeParse(first(params.view));
  const hasLocation =
    lat.success && lon.success && first(params.lat) !== "" && first(params.lon) !== "";

  return {
    origin: hasLocation ? { lat: lat.data, lon: lon.data } : DEFAULT_LOCATION,
    mode: mode.success ? mode.data : "bike",
    view: view.success ? view.data : "list",
    usingDefaultLocation: !hasLocation,
  };
}
