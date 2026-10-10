import { AvailabilityBadge } from "@/components/AvailabilityBadge";
import { formatDistance, walkingMinutes } from "@/lib/distance";
import type { Mode, NearbyStation } from "@/types/station";

export function StationCard({ station, mode }: { station: NearbyStation; mode: Mode }) {
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&travelmode=walking&destination=${station.lat},${station.lon}`;

  return (
    <li className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold leading-snug">{station.name}</h3>
        <p className="shrink-0 text-right text-sm text-slate-600 dark:text-slate-400">
          <span className="font-medium text-slate-900 dark:text-slate-100">
            {formatDistance(station.distanceMeters)}
          </span>
          <br />
          {walkingMinutes(station.distanceMeters)} min walk
        </p>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <AvailabilityBadge
          count={station.classicBikes}
          label={station.classicBikes === 1 ? "bike" : "bikes"}
          highlight={mode === "bike"}
        />
        <AvailabilityBadge
          count={station.ebikes}
          label={station.ebikes === 1 ? "e-bike" : "e-bikes"}
          highlight={mode === "bike"}
        />
        <AvailabilityBadge
          count={station.docks}
          label={station.docks === 1 ? "dock" : "docks"}
          highlight={mode === "dock"}
        />
      </div>

      <a
        href={directionsUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Walking directions to ${station.name} (opens in a new tab)`}
        className="mt-3 inline-block text-sm font-medium text-teal-700 underline-offset-2 hover:underline dark:text-teal-400"
      >
        Walking directions
      </a>
    </li>
  );
}
