import { DirectionsIcon } from "@/components/icons";
import { formatDistance, walkingMinutes } from "@/lib/distance";
import { plural, unitLabel, usefulCount } from "@/lib/format";
import { statusStyles } from "@/lib/status";
import type { Mode, NearbyStation } from "@/types/station";

// One small "● 4 classic" item. The dot color repeats what the number already says.
function Detail({ count, text }: { count: number; text: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span aria-hidden="true" className={`size-2 rounded-full ${statusStyles(count).dot}`} />
      {text}
    </span>
  );
}

export function StationCard({ station, mode }: { station: NearbyStation; mode: Mode }) {
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&travelmode=walking&destination=${station.lat},${station.lon}`;
  // The big number is whatever the user came for: bikes (classic + e-bikes) or open docks.
  const count = usefulCount(station, mode);
  const status = statusStyles(count);

  return (
    <li
      className={`flex items-center gap-3 px-3 py-3 desktop:gap-4 desktop:px-4 ${
        count === 0 ? "opacity-60" : ""
      }`}
    >
      <div
        className={`flex size-[54px] shrink-0 flex-col items-center justify-center rounded-badge border desktop:h-[60px] desktop:w-16 ${status.bg} ${status.border} ${status.text}`}
      >
        <span className="text-xl leading-none font-bold tabular-nums">{count}</span>
        <span className="mt-1 text-[11px] font-medium">{unitLabel(count, mode)}</span>
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="leading-snug font-semibold">{station.name}</h3>
        <p className="text-sm text-muted">
          {formatDistance(station.distanceMeters)} · {walkingMinutes(station.distanceMeters)} min
          walk
        </p>
        <p className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-fg-2">
          <Detail count={station.classicBikes} text={`${station.classicBikes} classic`} />
          <Detail count={station.ebikes} text={plural(station.ebikes, "e-bike")} />
          <Detail count={station.docks} text={plural(station.docks, "dock")} />
        </p>
      </div>

      {/* Phones: a 44px icon button. Desktop: the word "Directions" appears next to it. */}
      <a
        href={directionsUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Walking directions to ${station.name} (opens in a new tab)`}
        className="inline-flex size-11 shrink-0 items-center justify-center gap-2 rounded-control border border-line-3 text-sm font-semibold text-accent hover:bg-line desktop:h-9 desktop:w-auto desktop:px-3"
      >
        <DirectionsIcon className="size-4" />
        <span className="sr-only desktop:not-sr-only">Directions</span>
      </a>
    </li>
  );
}
