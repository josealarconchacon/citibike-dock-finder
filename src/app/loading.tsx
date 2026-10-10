// Shown automatically while page.tsx waits for the station data.
export default function Loading() {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading nearby stations…</span>
      <div className="mb-4 h-10 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
      <ul className="space-y-3">
        {Array.from({ length: 5 }, (_, i) => (
          <li key={i} className="h-24 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
        ))}
      </ul>
    </div>
  );
}
