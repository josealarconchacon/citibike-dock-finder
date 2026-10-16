"use client";

import { useRouter } from "next/navigation";
import { useOptimistic, useState, useTransition, type ReactNode } from "react";
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

  // Both controls navigate inside one transition, so they share one loading state:
  // isPending stays true, and the list stays dimmed, until the new page has arrived.
  // The optimistic values show the user's choice straight away and reset by themselves
  // when the transition ends.
  const [shownMode, setShownMode] = useOptimistic(mode);
  const [loadingLocation, setLoadingLocation] = useOptimistic(false);

  const usingDefaultLocation = origin === undefined;

  // Says what the list is showing instead, which depends on whether a location was already set.
  const showing = usingDefaultLocation ? DEFAULT_LOCATION_LABEL : "your last location";
  const locationMessages: Record<LocationProblem, string> = {
    insecure: "Your browser only shares your location on secure (https://) pages.",
    unsupported: "Your browser can't share a location.",
    blocked: `Location is blocked, so this list still shows stations near ${showing}.`,
    unavailable: "We couldn't get your location. Try again.",
  };

  const switchMode = (nextMode: Mode) => {
    startTransition(() => {
      setShownMode(nextMode);
      router.push(buildHref({ mode: nextMode, view, origin }));
    });
  };

  const showStationsNear = (located: LatLon) => {
    setLocationProblem(null);
    startTransition(() => {
      setLoadingLocation(true);
      router.push(buildHref({ mode, view, origin: located }));
    });
  };

  return (
    <div className="space-y-4">
      <ModeToggle mode={shownMode} view={view} origin={origin} onSelect={switchMode} />

      <div className="flex items-center justify-between gap-3 text-sm">
        <p className="text-slate-600 dark:text-slate-400">
          {usingDefaultLocation ? `Near ${DEFAULT_LOCATION_LABEL}` : "Near you"}
        </p>
        <LocationButton
          onLocated={showStationsNear}
          onError={setLocationProblem}
          pending={loadingLocation}
        />
      </div>

      {locationProblem && (
        <p role="alert" className="text-sm text-red-700 dark:text-red-400">
          {locationMessages[locationProblem]}
        </p>
      )}

      <div className="flex items-center justify-between gap-3">
        <LastUpdated updatedAt={updatedAt} />
        <ViewToggle view={view} mode={mode} origin={origin} />
      </div>

      <div aria-busy={isPending} className={isPending ? "opacity-50 transition-opacity" : ""}>
        {children}
      </div>
    </div>
  );
}
