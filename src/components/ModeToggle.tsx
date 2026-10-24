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
    <nav
      aria-label="What do you need?"
      className="grid w-full grid-cols-2 gap-1 rounded-badge border border-line-2 bg-page p-1 desktop:w-max"
    >
      {MODES.map(({ value, label }) => (
        <Link
          key={value}
          href={buildHref({ mode: value, view, origin })}
          aria-current={value === mode ? "page" : undefined}
          className={`flex min-h-11 items-center justify-center rounded-control px-4 text-center text-sm font-semibold desktop:min-h-9 ${
            value === mode ? "bg-primary text-white" : "text-fg-2 hover:bg-surface hover:text-fg"
          }`}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
