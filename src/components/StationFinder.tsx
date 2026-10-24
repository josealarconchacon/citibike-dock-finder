"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type ReactNode } from "react";
import { Brand } from "@/components/Brand";
import { PinIcon } from "@/components/icons";
import { LastUpdated } from "@/components/LastUpdated";
import { LocationButton, type LocationProblem } from "@/components/LocationButton";
import { ModeToggle } from "@/components/ModeToggle";
import { StatusLegend } from "@/components/StatusLegend";
import { ViewToggle } from "@/components/ViewToggle";
import { DEFAULT_LOCATION_LABEL } from "@/lib/constants";
import { buildHref } from "@/lib/href";
import type { LatLon, Mode, View } from "@/types/station";

// The page frame: header controls, saved stations, and the list or map. The list or map
// arrives as children and the saved stations as `sidebar`, both rendered on the server.
export function StationFinder({
  mode,
  view = "list",
  origin,
  updatedAt,
  sidebar,
  children,
}: {
  mode: Mode;
  view?: View;
  // The location the user shared. Leave out while the list uses the default location.
  origin?: LatLon;
  updatedAt: number; // milliseconds
  sidebar?: ReactNode;
  children: ReactNode;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [locationProblem, setLocationProblem] = useState<LocationProblem | null>(null);

  const usingDefaultLocation = origin === undefined;

  // Says what the list is showing instead, which depends on whether a location was already set.
  const showing = usingDefaultLocation ? DEFAULT_LOCATION_LABEL : "your last location";
  const locationMessages: Record<LocationProblem, string> = {
    insecure: "Your browser only shares your location on secure (https://) pages.",
    unsupported: "Your browser can't share a location.",
    blocked: `Location is blocked, so this list still shows stations near ${showing}.`,
    unavailable: "We couldn't get your location. Try again.",
  };

  const showStationsNear = (located: LatLon) => {
    setLocationProblem(null);
    startTransition(() => {
      router.push(buildHref({ mode, view, origin: located }));
    });
  };

  return (
    <>
      <header className="border-b border-line bg-header">
        {/* One grid, three arrangements. Phones: brand + time, then the mode toggle, then the
            location, each on its own row. From 900px: toggle and location share row 2.
            From 1100px: everything on one row. */}
        <div className="mx-auto grid max-w-page grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-3 px-4 py-3 desktop:px-6 wide:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto] wide:gap-x-6">
          <div className="col-start-1 row-start-1 min-w-0">
            <Brand />
          </div>

          <div className="col-start-2 row-start-1 justify-self-end wide:col-start-4">
            <LastUpdated updatedAt={updatedAt} />
          </div>

          <div className="col-span-2 row-start-2 desktop:col-span-1 desktop:col-start-1 wide:col-start-2 wide:row-start-1">
            <ModeToggle mode={mode} view={view} origin={origin} />
          </div>

          <div className="col-span-2 row-start-3 flex min-h-11 min-w-0 items-center justify-between gap-3 rounded-badge border border-line-2 bg-surface px-3 text-sm desktop:col-span-1 desktop:col-start-2 desktop:row-start-2 desktop:justify-start wide:col-start-3 wide:row-start-1 wide:justify-self-end">
            <p className="flex min-w-0 items-center gap-2 text-fg-2">
              <PinIcon className="size-4 shrink-0 text-accent" />
              <span className="truncate">
                {usingDefaultLocation ? `Near ${DEFAULT_LOCATION_LABEL}` : "Near you"}
              </span>
            </p>
            <span aria-hidden="true" className="hidden h-5 w-px bg-line-3 desktop:block" />
            <LocationButton
              onLocated={showStationsNear}
              onError={setLocationProblem}
              pending={isPending}
            />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-page px-4 py-5 desktop:px-6 desktop:py-6">
        {locationProblem && (
          <p role="alert" className="mb-4 text-sm text-status-none-text">
            {locationMessages[locationProblem]}
          </p>
        )}

        {/* Phones: one column in source order (saved, results, legend, footer).
            Desktop: saved and legend stack on the left; results and footer on the right.
            The results span the first two rows, so the 1fr row absorbs their height and the
            legend stays tucked under the saved stations. */}
        <div className="grid grid-cols-1 gap-5 desktop:grid-cols-[clamp(300px,30%,380px)_minmax(0,1fr)] desktop:grid-rows-[auto_1fr_auto] desktop:gap-x-6 desktop:gap-y-4">
          {sidebar && (
            <div className="min-w-0 desktop:col-start-1 desktop:row-start-1">{sidebar}</div>
          )}

          <div
            aria-busy={isPending}
            className={`min-w-0 space-y-3 desktop:col-start-2 desktop:row-span-2 desktop:row-start-1 ${
              isPending ? "opacity-50 transition-opacity" : ""
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <h2 id="results-heading" className="font-semibold">
                Nearest stations with {mode === "bike" ? "bikes" : "open docks"}
              </h2>
              <ViewToggle view={view} mode={mode} origin={origin} />
            </div>
            {children}
          </div>

          <StatusLegend className="desktop:col-start-1 desktop:row-start-2 desktop:self-start" />

          <footer className="text-xs text-muted desktop:col-start-2 desktop:row-start-3">
            Data: Citi Bike&apos;s public GBFS feed. Counts can be about a minute behind; reload the
            page for the latest. Not affiliated with Citi Bike or Lyft.
          </footer>
        </div>
      </main>
    </>
  );
}
