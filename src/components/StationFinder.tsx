"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type ReactNode } from "react";
import { Brand } from "@/components/Brand";
import { PinIcon } from "@/components/icons";
import { LastUpdated } from "@/components/LastUpdated";
import { LocationButton, type LocationProblem } from "@/components/LocationButton";
import { ModeToggle } from "@/components/ModeToggle";
import { ViewToggle } from "@/components/ViewToggle";
import { DEFAULT_LOCATION_LABEL } from "@/lib/constants";
import { buildHref } from "@/lib/href";
import type { LatLon, Mode, View } from "@/types/station";

// The interactive controls around the station list or map. The list or map arrives as
// children, chosen on the server.
export function StationFinder({
  mode,
  view = "list",
  origin,
  updatedAt,
  children,
}: {
  mode: Mode;
  view?: View;
  // The location the user shared. Leave out while the list uses the default location.
  origin?: LatLon;
  updatedAt: number; // milliseconds
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

      <main className="mx-auto w-full max-w-page space-y-4 px-4 py-5 desktop:px-6 desktop:py-6">
        {locationProblem && (
          <p role="alert" className="text-sm text-status-none-text">
            {locationMessages[locationProblem]}
          </p>
        )}

        <div className="flex justify-end">
          <ViewToggle view={view} mode={mode} origin={origin} />
        </div>

        <div
          aria-busy={isPending}
          className={`space-y-4 ${isPending ? "opacity-50 transition-opacity" : ""}`}
        >
          {children}
        </div>
      </main>
    </>
  );
}
