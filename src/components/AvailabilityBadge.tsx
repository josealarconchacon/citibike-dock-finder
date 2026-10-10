// A count with a label, colored by how many are left.
export function AvailabilityBadge({
  count,
  label,
  highlight = false,
}: {
  count: number;
  label: string;
  highlight?: boolean;
}) {
  const tone =
    count === 0
      ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200"
      : count <= 3
        ? "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200"
        : "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200";

  return (
    <span
      className={`inline-flex items-baseline gap-1 rounded-full px-2.5 py-1 text-sm ${tone} ${
        highlight ? "ring-2 ring-current/30" : ""
      }`}
    >
      <span className="font-semibold tabular-nums">{count}</span>
      <span>{label}</span>
    </span>
  );
}
