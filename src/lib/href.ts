import type { LatLon, Mode, View } from "@/types/station";

export function buildHref({
  mode,
  view,
  origin,
}: {
  mode: Mode;
  view: View;
  origin?: LatLon;
}): string {
  const params = new URLSearchParams({ mode });

  if (view === "map") {
    params.set("view", "map");
  }
  if (origin) {
    params.set("lat", origin.lat.toFixed(5));
    params.set("lon", origin.lon.toFixed(5));
  }

  return `/?${params}`;
}
