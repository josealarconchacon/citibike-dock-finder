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
      className="inline-flex rounded-lg border border-slate-300 p-0.5 text-sm dark:border-slate-700"
    >
      {VIEWS.map(({ value, label }) => (
        <Link
          key={value}
          href={buildHref({ mode, view: value, origin })}
          aria-current={value === view ? "page" : undefined}
          className={`inline-flex min-h-11 items-center rounded-md px-3 font-semibold ${
            value === view
              ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
              : "text-slate-700 dark:text-slate-300"
          }`}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
