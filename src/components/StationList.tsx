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
      <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center dark:border-slate-700">
        <p className="font-medium">
          No Citi Bike stations within {MAX_DISTANCE_METERS / 1000} km of this location.
        </p>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Citi Bike runs in New York City, Jersey City and Hoboken.
        </p>
        <Link
          href={buildHref({ mode, view: "list" })}
          className="mt-1 inline-flex min-h-11 items-center text-sm font-medium text-teal-700 underline dark:text-teal-400"
        >
          See stations near {DEFAULT_LOCATION_LABEL}
        </Link>
      </div>
    );
  }

  if (stations.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center dark:border-slate-700">
        <p className="font-medium">
          No stations with {mode === "bike" ? "bikes" : "open docks"} nearby right now.
        </p>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Try refreshing in a minute, or switch what you need.
        </p>
      </div>
    );
  }

  return (
    <section aria-labelledby="station-list-heading">
      <h2 id="station-list-heading" className="mb-3 font-semibold">
        Nearest stations with {mode === "bike" ? "bikes" : "open docks"}
      </h2>
      <ul className="space-y-3" aria-labelledby="station-list-heading">
        {stations.map((station) => (
          <StationCard key={station.id} station={station} mode={mode} />
        ))}
      </ul>
    </section>
  );
}
