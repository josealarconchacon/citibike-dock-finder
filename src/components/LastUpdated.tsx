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
  if (seconds < 60) return "less than a minute ago";
  const minutes = Math.round(seconds / 60);
  return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
}

export function LastUpdated({ updatedAt }: { updatedAt: number }) {
  const now = useSyncExternalStore(subscribe, getNow, getServerNow);

  return (
    <p className="text-xs text-slate-500 dark:text-slate-400" aria-live="polite">
      {now === null ? "Live data" : `Updated ${describeAge(updatedAt, now)}`}
    </p>
  );
}
