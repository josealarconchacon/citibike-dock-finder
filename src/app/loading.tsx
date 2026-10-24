export default function Loading() {
  const block =
    "animate-pulse rounded-lg bg-slate-200 motion-reduce:animate-none dark:bg-slate-800";

  return (
    <div role="status" className="mx-auto max-w-page px-4 py-5 desktop:px-6">
      <span className="sr-only">Loading nearby stations…</span>
      <div aria-hidden="true" className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <div className={`h-11 ${block}`} />
          <div className={`h-11 ${block}`} />
        </div>
        <div className="flex h-11 items-center justify-between">
          <div className={`h-4 w-32 ${block}`} />
          <div className={`h-4 w-28 ${block}`} />
        </div>
        <div className={`h-4 w-44 ${block}`} />
        <div className={`h-6 w-56 ${block}`} />
        <div className="space-y-3">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className={`h-40 rounded-xl ${block}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
