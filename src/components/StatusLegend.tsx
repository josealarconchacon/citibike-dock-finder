import { statusStyles } from "@/lib/status";

const ITEMS = [
  { count: 4, label: "Plenty (4+)" },
  { count: 1, label: "Running low (1–3)" },
  { count: 0, label: "None" },
];

// What the badge colors mean.
export function StatusLegend({ className = "" }: { className?: string }) {
  return (
    <ul
      aria-label="Color key"
      className={`flex flex-wrap gap-x-4 gap-y-2 rounded-card border border-line bg-surface px-4 py-3 text-xs text-fg-2 ${className}`}
    >
      {ITEMS.map(({ count, label }) => (
        <li key={label} className="flex items-center gap-1.5">
          <span aria-hidden="true" className={`size-2.5 rounded-full ${statusStyles(count).dot}`} />
          {label}
        </li>
      ))}
    </ul>
  );
}
