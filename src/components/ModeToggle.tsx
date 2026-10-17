"use client";

import Link from "next/link";
import { buildHref } from "@/lib/href";
import type { LatLon, Mode, View } from "@/types/station";

const MODES: { value: Mode; label: string }[] = [
  { value: "bike", label: "I need a bike" },
  { value: "dock", label: "I need a dock" },
];

export function ModeToggle({
  mode,
  view = "list",
  origin,
}: {
  mode: Mode;
  // Switching mode keeps the current view.
  view?: View;
  origin?: LatLon;
}) {
  return (
    <nav className="grid grid-cols-2 gap-2" aria-label="What do you need?">
      {MODES.map(({ value, label }) => (
        <Link
          key={value}
          href={buildHref({ mode: value, view, origin })}
          aria-current={value === mode ? "page" : undefined}
          className={
            value === mode
              ? "flex min-h-11 items-center justify-center rounded-lg bg-teal-700 px-3 py-2 text-center text-sm font-semibold text-white"
              : "flex min-h-11 items-center justify-center rounded-lg border border-slate-300 px-3 py-2 text-center text-sm font-semibold dark:border-slate-700"
          }
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
