"use client";

import { useSyncExternalStore } from "react";

// A shared clock that ticks every 15 seconds while the page is open.
function subscribe(callback: () => void) {
  const id = setInterval(callback, 15_000);
  return () => clearInterval(id);
}

// Round to 15 seconds
const getNow = () => Math.floor(Date.now() / 15_000) * 15_000;
// On the server there is no "now" yet; render nothing time-based to avoid a mismatch.
const getServerNow = () => null;

export function describeAge(updatedAt: number, now: number): string {
  const seconds = Math.max(0, Math.round((now - updatedAt) / 1000));
  if (seconds < 60) return "just now";
  return `${Math.round(seconds / 60)} min ago`;
}

export function LastUpdated({ updatedAt }: { updatedAt: number }) {
  const now = useSyncExternalStore(subscribe, getNow, getServerNow);

  return (
    <p className="flex items-center gap-1.5 text-xs whitespace-nowrap text-muted">
      <span aria-hidden="true" className="size-2 rounded-full bg-status-good-dot" />
      {now === null ? (
        "Live data"
      ) : (
        <span>
          {/* sr-only (not hidden) on phones, so screen readers still hear "Updated". */}
          <span className="sr-only desktop:not-sr-only">Updated </span>
          {describeAge(updatedAt, now)}
        </span>
      )}
    </p>
  );
}
