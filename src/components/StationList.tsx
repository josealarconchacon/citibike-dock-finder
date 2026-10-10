import { StationCard } from "@/components/StationCard";
import type { Mode, NearbyStation } from "@/types/station";

export function StationList({ stations, mode }: { stations: NearbyStation[]; mode: Mode }) {
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
    <ul className="space-y-3" aria-label="Nearest stations">
      {stations.map((station) => (
        <StationCard key={station.id} station={station} mode={mode} />
      ))}
    </ul>
  );
}
