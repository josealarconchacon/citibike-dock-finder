"use client";

import { useState } from "react";
import type { LatLon } from "@/types/station";

// Why the browser couldn't give a location. The parent turns this into a message,
// because only it knows which stations are on screen.
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
    // Browsers only share location on https:// pages and localhost. Elsewhere they refuse
    // without asking, and report it as if the user had blocked it.
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
      className="inline-flex min-h-11 items-center font-semibold text-teal-700 underline disabled:opacity-60 dark:text-teal-400"
    >
      {busy ? "Finding you…" : "Use my location"}
    </button>
  );
}
