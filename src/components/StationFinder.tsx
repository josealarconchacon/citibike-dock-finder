"use client";

import Link, { useLinkStatus } from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { StationList } from "@/components/StationList";
import { DEFAULT_LOCATION_LABEL } from "@/lib/constants";
import type { LatLon, Mode, StationsResult } from "@/types/station";

const MODES: { value: Mode; label: string }[] = [
  { value: "bike", label: "I need a bike" },
  { value: "dock", label: "I need a dock" },
];

// The one place that builds URLs, so the mode links and "Use my location" always agree.
// Rounds to 5 decimals (about 1 m) so an exact GPS fix never lands in browser history.
function buildHref(mode: Mode, origin?: LatLon): string {
  const params = new URLSearchParams({ mode });
  if (origin) {
    params.set("lat", origin.lat.toFixed(5));
    params.set("lon", origin.lon.toFixed(5));
  }
  return `/?${params}`;
}

// Pulses while a mode link is loading. Must render inside a <Link>.
function PendingDot() {
  const { pending } = useLinkStatus();
  return (
    <span
      aria-hidden="true"
      className={`ml-2 inline-block size-2 rounded-full bg-current ${
        pending ? "animate-pulse" : "invisible"
      }`}
    />
  );
}

export function StationFinder({ initial }: { initial: StationsResult }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const { stations, origin, mode, usingDefaultLocation } = initial;
  const currentOrigin = usingDefaultLocation ? undefined : origin;
  const busy = locating || isPending;

  const locateMe = () => {
    if (!("geolocation" in navigator)) {
      setLocationError("Your browser can't share a location.");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocating(false);
        setLocationError(null);
        // isPending stays true until the new page has arrived.
        startTransition(() => {
          router.push(buildHref(mode, { lat: coords.latitude, lon: coords.longitude }));
        });
      },
      (error) => {
        setLocating(false);
        setLocationError(
          error.code === error.PERMISSION_DENIED
            ? "Location is blocked, so this list uses the default spot."
            : "We couldn't get your location. Try again.",
        );
      },
      // Without a timeout, the browser can wait forever.
      { timeout: 10_000, maximumAge: 60_000 },
    );
  };

  return (
    <div className="space-y-4">
      <nav className="grid grid-cols-2 gap-2" aria-label="What do you need?">
        {MODES.map(({ value, label }) => (
          <Link
            key={value}
            href={buildHref(value, currentOrigin)}
            aria-current={value === mode ? "page" : undefined}
            className={
              value === mode
                ? "rounded-lg bg-teal-700 px-3 py-2 text-center text-sm font-semibold text-white"
                : "rounded-lg border border-slate-300 px-3 py-2 text-center text-sm font-semibold dark:border-slate-700"
            }
          >
            {label}
            <PendingDot />
          </Link>
        ))}
      </nav>

      <div className="flex items-center justify-between gap-3 text-sm">
        <p className="text-slate-600 dark:text-slate-400">
          {usingDefaultLocation ? `Near ${DEFAULT_LOCATION_LABEL}` : "Near you"}
        </p>
        <button
          type="button"
          onClick={locateMe}
          disabled={busy}
          className="font-semibold text-teal-700 underline disabled:opacity-60 dark:text-teal-400"
        >
          {busy ? "Finding you…" : "Use my location"}
        </button>
      </div>

      {locationError && (
        <p role="alert" className="text-sm text-red-700 dark:text-red-400">
          {locationError}
        </p>
      )}

      <div aria-busy={isPending} className={isPending ? "opacity-50 transition-opacity" : ""}>
        <StationList stations={stations} mode={mode} />
      </div>
    </div>
  );
}
