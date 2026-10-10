"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DEFAULT_LOCATION_LABEL } from "@/lib/constants";
import { formatDistance, walkingMinutes } from "@/lib/distance";
import type { Mode, NearbyStation, StationsResult } from "@/types/station";

const MODES: { value: Mode; label: string }[] = [
  { value: "bike", label: "I need a bike" },
  { value: "dock", label: "I need a dock" },
];

function availability(station: NearbyStation, mode: Mode): string {
  if (mode === "dock") {
    return `${station.docks} open docks`;
  }
  return `${station.classicBikes} classic · ${station.ebikes} e-bikes`;
}

export function StationFinder({ initial }: { initial: StationsResult }) {
  const router = useRouter();
  const [locationError, setLocationError] = useState<string | null>(null);
  const { stations, origin, mode, usingDefaultLocation } = initial;

  // Keeps the user's location in the URL when they switch modes.
  const hrefFor = (nextMode: Mode) => {
    const params = new URLSearchParams({ mode: nextMode });
    if (!usingDefaultLocation) {
      params.set("lat", String(origin.lat));
      params.set("lon", String(origin.lon));
    }
    return `/?${params}`;
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Your browser can't share a location.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocationError(null);
        router.push(`/?lat=${coords.latitude}&lon=${coords.longitude}&mode=${mode}`);
      },
      () => setLocationError("We couldn't get your location."),
    );
  };

  return (
    <div className="space-y-4">
      <nav className="grid grid-cols-2 gap-2" aria-label="What do you need?">
        {MODES.map(({ value, label }) => (
          <Link
            key={value}
            href={hrefFor(value)}
            aria-current={value === mode ? "page" : undefined}
            className={
              value === mode
                ? "rounded-lg bg-teal-700 px-3 py-2 text-center text-sm font-semibold text-white"
                : "rounded-lg border border-slate-300 px-3 py-2 text-center text-sm font-semibold dark:border-slate-700"
            }
          >
            {label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center justify-between gap-3 text-sm">
        <p className="text-slate-600 dark:text-slate-400">
          {usingDefaultLocation ? `Near ${DEFAULT_LOCATION_LABEL}` : "Near you"}
        </p>
        <button
          type="button"
          onClick={useMyLocation}
          className="font-semibold text-teal-700 underline dark:text-teal-400"
        >
          Use my location
        </button>
      </div>

      {locationError && (
        <p role="alert" className="text-sm text-red-700 dark:text-red-400">
          {locationError}
        </p>
      )}

      {stations.length === 0 ? (
        <p className="text-sm text-slate-600 dark:text-slate-400">No stations found nearby.</p>
      ) : (
        <ul className="space-y-2">
          {stations.map((station) => (
            <li
              key={station.id}
              className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="font-semibold">{station.name}</h2>
                <span className="shrink-0 text-sm text-slate-600 dark:text-slate-400">
                  {formatDistance(station.distanceMeters)} ·{" "}
                  {walkingMinutes(station.distanceMeters)} min walk
                </span>
              </div>
              <p className="mt-1 text-sm">{availability(station, mode)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
