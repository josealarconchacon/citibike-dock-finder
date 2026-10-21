import { removeFavoriteAction } from "@/app/actions";
import { AddFavoriteForm } from "@/components/AddFavoriteForm";
import { AvailabilityBadge } from "@/components/AvailabilityBadge";
import { MAX_FAVORITES } from "@/lib/constants";
import { formatDistance, haversine } from "@/lib/distance";
import { usefulCount } from "@/lib/format";
import type { LatLon, Mode, Station } from "@/types/station";

export function FavoriteStations({
  favorites,
  stationNames,
  origin,
  mode,
}: {
  favorites: Station[];
  stationNames: string[];
  origin: LatLon;
  mode: Mode;
}) {
  const label = mode === "dock" ? "docks" : "bikes";
  const canAddMore = favorites.length < MAX_FAVORITES;

  return (
    <section
      aria-labelledby="favorites-heading"
      className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
    >
      <h2 id="favorites-heading" className="font-semibold">
        Your stations
      </h2>

      {favorites.length === 0 ? (
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Save your home or work station to check it at a glance.
        </p>
      ) : (
        <ul className="mt-2 divide-y divide-slate-200 dark:divide-slate-800">
          {favorites.map((station) => (
            <li key={station.id} className="flex items-center justify-between gap-3 py-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{station.name}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {formatDistance(haversine(origin, station))} away
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <AvailabilityBadge count={usefulCount(station, mode)} label={label} />
                <form action={removeFavoriteAction}>
                  <input type="hidden" name="id" value={station.id} />
                  <button
                    type="submit"
                    aria-label={`Remove ${station.name} from your stations`}
                    className="inline-flex size-11 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <span aria-hidden="true">✕</span>
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}

      {canAddMore && (
        <details className="mt-2">
          <summary className="inline-flex min-h-11 cursor-pointer items-center text-sm font-semibold text-teal-700 dark:text-teal-400">
            + Add a station
          </summary>
          <AddFavoriteForm stationNames={stationNames} />
        </details>
      )}
    </section>
  );
}
