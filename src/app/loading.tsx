import { Brand } from "@/components/Brand";

// Shaped like the real page (header, saved stations, results), so nothing jumps when the
// data arrives.
export default function Loading() {
  const block = "animate-pulse rounded-control bg-line motion-reduce:animate-none";

  return (
    <div role="status">
      <span className="sr-only">Loading nearby stations…</span>
      <div aria-hidden="true">
        <div className="border-b border-line bg-header">
          <div className="mx-auto grid max-w-page gap-3 px-4 py-3 desktop:flex desktop:items-center desktop:justify-between desktop:px-6">
            <Brand />
            <div className={`h-11 desktop:w-64 ${block}`} />
            <div className={`h-11 desktop:w-72 ${block}`} />
          </div>
        </div>
        <div className="mx-auto grid max-w-page gap-5 px-4 py-5 desktop:grid-cols-[clamp(300px,30%,380px)_minmax(0,1fr)] desktop:gap-6 desktop:px-6 desktop:py-6">
          <div className={`h-32 rounded-card ${block}`} />
          <div className="space-y-3">
            <div className={`h-6 w-56 ${block}`} />
            <div className="overflow-hidden rounded-card border border-line bg-surface">
              {Array.from({ length: 6 }, (_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 border-b border-line p-3 last:border-0"
                >
                  <div
                    className={`size-[54px] shrink-0 rounded-badge desktop:h-[60px] desktop:w-16 ${block}`}
                  />
                  <div className="flex-1 space-y-2">
                    <div className={`h-4 w-40 ${block}`} />
                    <div className={`h-3 w-28 ${block}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
