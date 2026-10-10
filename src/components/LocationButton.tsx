"use client";

import { useState } from "react";
import type { LatLon } from "@/types/station";

// Asks the browser for the user's location.
export function LocationButton({
  onLocated,
  onError,
  disabled = false,
}: {
  onLocated: (origin: LatLon) => void;
  onError: (message: string) => void;
  disabled?: boolean;
}) {
  const [locating, setLocating] = useState(false);

  function handleClick() {
    if (!("geolocation" in navigator)) {
      onError("Your browser can't share its location.");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocating(false);
        onLocated({ lat: position.coords.latitude, lon: position.coords.longitude });
      },
      (error) => {
        setLocating(false);
        onError(
          error.code === error.PERMISSION_DENIED
            ? "Location is blocked, so this list uses the default spot."
            : "Couldn't get your location. Try again in a moment.",
        );
      },
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 60_000 },
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || locating}
      className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60"
    >
      {locating ? "Finding you…" : "Use my location"}
    </button>
  );
}
