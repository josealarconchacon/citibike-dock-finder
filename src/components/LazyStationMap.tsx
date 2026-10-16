"use client";

import dynamic from "next/dynamic";

// Leaflet reads `window` as soon as it loads, so the map only loads in the browser.
export const LazyStationMap = dynamic(
  () => import("@/components/StationMap").then((m) => m.StationMap),
  {
    ssr: false,
    loading: () => (
      <div
        aria-hidden="true"
        className="h-[60dvh] min-h-80 w-full animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800"
      />
    ),
  },
);
