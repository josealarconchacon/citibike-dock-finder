"use client";

import Link from "next/link";
import { buildHref } from "@/lib/href";
import type { LatLon, Mode } from "@/types/station";

const MODES: { value: Mode; label: string }[] = [
  { value: "bike", label: "I need a bike" },
  { value: "dock", label: "I need a dock" },
];

// Each mode is a link, so the URL stays the source of truth for which one is selected.
// Pass origin only when the user has shared a location, so the links keep it.
export function ModeToggle({
  mode,
  origin,
  onSelect,
}: {
  mode: Mode;
  origin?: LatLon;
  // Lets the parent run the navigation itself, so it can show its own loading state.
  // Without it the links navigate on their own.
  onSelect?: (mode: Mode) => void;
}) {
  return (
    <nav className="grid grid-cols-2 gap-2" aria-label="What do you need?">
      {MODES.map(({ value, label }) => (
        <Link
          key={value}
          href={buildHref({ mode: value, view: "list", origin })}
          // onNavigate only fires for in-app navigation, so Cmd/Ctrl+click still opens a new tab.
          onNavigate={
            onSelect &&
            ((event) => {
              event.preventDefault();
              onSelect(value);
            })
          }
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
