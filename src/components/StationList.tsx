import Link from "next/link";
import { StationCard } from "@/components/StationCard";
import { DEFAULT_LOCATION_LABEL, MAX_DISTANCE_METERS } from "@/lib/constants";
import { buildHref } from "@/lib/href";
import type { Mode, NearbyStation } from "@/types/station";

export function StationList({
  stations,
  mode,
  outsideServiceArea = false,
}: {
  stations: NearbyStation[];
  mode: Mode;
  outsideServiceArea?: boolean;
}) {
  if (outsideServiceArea) {
    return (
      <div className="rounded-card border border-dashed border-line-3 p-6 text-center">
        <p className="font-medium">
          No Citi Bike stations within {MAX_DISTANCE_METERS / 1000} km of this location.
        </p>
        <p className="mt-1 text-sm text-muted">
          Citi Bike runs in New York City, Jersey City and Hoboken.
        </p>
        <Link
          href={buildHref({ mode, view: "list" })}
          className="mt-1 inline-flex min-h-11 items-center text-sm font-medium text-accent underline"
        >
          See stations near {DEFAULT_LOCATION_LABEL}
        </Link>
      </div>
    );
  }

  if (stations.length === 0) {
    return (
      <div className="rounded-card border border-dashed border-line-3 p-6 text-center">
        <p className="font-medium">
          No stations with {mode === "bike" ? "bikes" : "open docks"} nearby right now.
        </p>
        <p className="mt-1 text-sm text-muted">
          Try refreshing in a minute, or switch what you need.
        </p>
      </div>
    );
  }

  // The heading ("Nearest stations with …") sits above, next to the List/Map toggle.
  return (
    <ul
      aria-labelledby="results-heading"
      className="divide-y divide-line overflow-hidden rounded-card border border-line bg-surface"
    >
      {stations.map((station) => (
        <StationCard key={station.id} station={station} mode={mode} />
      ))}
    </ul>
  );
}
