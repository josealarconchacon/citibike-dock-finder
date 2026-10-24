import Link from "next/link";
import { buildHref } from "@/lib/href";
import type { LatLon, Mode, View } from "@/types/station";

const VIEWS: { value: View; label: string }[] = [
  { value: "list", label: "List" },
  { value: "map", label: "Map" },
];

export function ViewToggle({ view, mode, origin }: { view: View; mode: Mode; origin?: LatLon }) {
  return (
    <nav
      aria-label="Show stations as"
      className="inline-flex shrink-0 gap-1 rounded-badge border border-line-2 bg-page p-1 text-sm"
    >
      {VIEWS.map(({ value, label }) => (
        <Link
          key={value}
          href={buildHref({ mode, view: value, origin })}
          aria-current={value === view ? "page" : undefined}
          className={`inline-flex min-h-11 items-center rounded-control px-3 font-semibold desktop:min-h-8 ${
            value === view ? "bg-primary text-white" : "text-fg-2 hover:bg-surface hover:text-fg"
          }`}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
