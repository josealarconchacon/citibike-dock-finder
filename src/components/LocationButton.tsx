"use client";

import { useState } from "react";
import type { LatLon } from "@/types/station";

export type LocationProblem = "insecure" | "unsupported" | "blocked" | "unavailable";

// Asks the browser for the user's location.
export function LocationButton({
  onLocated,
  onError,
  pending = false,
}: {
  onLocated: (origin: LatLon) => void;
  onError: (problem: LocationProblem) => void;
  // True while the parent is still loading the list for the new location.
  pending?: boolean;
}) {
  const [locating, setLocating] = useState(false);
  const busy = locating || pending;

  function handleClick() {
    if (window.isSecureContext === false) {
      onError("insecure");
      return;
    }
    if (!("geolocation" in navigator)) {
      onError("unsupported");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocating(false);
        onLocated({ lat: coords.latitude, lon: coords.longitude });
      },
      (error) => {
        setLocating(false);
        onError(error.code === error.PERMISSION_DENIED ? "blocked" : "unavailable");
      },
      // Without a timeout, the browser can wait forever.
      { timeout: 10_000, maximumAge: 60_000 },
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={busy}
      className="inline-flex min-h-11 shrink-0 items-center font-semibold text-accent hover:underline disabled:opacity-60"
    >
      {busy ? "Finding you…" : "Use my location"}
    </button>
  );
}
