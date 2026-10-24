import { removeFavoriteAction } from "@/app/actions";
import { FavoritesPanel } from "@/components/FavoritesPanel";
import { CloseIcon } from "@/components/icons";
import { MAX_FAVORITES } from "@/lib/constants";
import { formatDistance, haversine } from "@/lib/distance";
import { unitLabel, usefulCount } from "@/lib/format";
import { statusStyles } from "@/lib/status";
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
  return (
    <FavoritesPanel
      count={favorites.length}
      canAddMore={favorites.length < MAX_FAVORITES}
      stationNames={stationNames}
    >
      {favorites.map((station) => {
        const count = usefulCount(station, mode);
        const unit = unitLabel(count, mode);
        const status = statusStyles(count);

        return (
          <li
            key={station.id}
            className="flex w-[150px] shrink-0 snap-start flex-col gap-2 rounded-badge border border-line bg-surface p-3 desktop:w-auto desktop:flex-row desktop:items-center desktop:gap-3 desktop:rounded-none desktop:border-0 desktop:bg-transparent desktop:px-0 desktop:py-2.5"
          >
            {/* Phones: the badge and × share the top of the card. Desktop: `contents` drops
                this wrapper so both join the row, and order-last moves × to the end. */}
            <div className="flex items-start justify-between desktop:contents">
              <span
                className={`inline-flex shrink-0 items-baseline justify-center gap-1 rounded-control border px-2 py-1 text-sm font-bold tabular-nums desktop:min-w-9 ${status.bg} ${status.border} ${status.text}`}
              >
                {count}
                <span className="text-xs font-medium desktop:hidden">{unit}</span>
              </span>
              <form
                action={removeFavoriteAction}
                className="-mt-2 -mr-2 desktop:order-last desktop:m-0"
              >
                <input type="hidden" name="id" value={station.id} />
                <button
                  type="submit"
                  aria-label={`Remove ${station.name}`}
                  className="inline-flex size-11 items-center justify-center rounded-control text-muted hover:bg-line hover:text-fg desktop:size-8"
                >
                  <CloseIcon className="size-4" />
                </button>
              </form>
            </div>

            <div className="min-w-0 desktop:flex-1">
              <p
                title={station.name}
                className="line-clamp-2 text-sm font-semibold desktop:block desktop:truncate"
              >
                {station.name}
              </p>
              <p className="text-xs text-muted">
                <span className="hidden desktop:inline">{`${count} ${unit} · `}</span>
                {formatDistance(haversine(origin, station))} away
              </p>
            </div>
          </li>
        );
      })}
    </FavoritesPanel>
  );
}
