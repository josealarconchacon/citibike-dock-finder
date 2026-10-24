import { BikeIcon } from "@/components/icons";

// The app icon, title and subtitle at the left of the header.
export function Brand() {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-control bg-primary text-white">
        <BikeIcon className="size-5" />
      </span>
      <div className="min-w-0">
        <h1 className="truncate text-base font-bold tracking-tight">Citi Bike Dock Finder</h1>
        <p className="hidden truncate text-xs text-muted desktop:block">
          Live bikes and open docks near you
        </p>
      </div>
    </div>
  );
}
