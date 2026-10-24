"use client";

import { useState, type ReactNode } from "react";
import { AddFavoriteForm } from "@/components/AddFavoriteForm";

// The "Your stations" frame. It is a client component only because the add form opens and
// closes; the saved rows are rendered on the server and arrive as children.
export function FavoritesPanel({
  count,
  canAddMore,
  stationNames,
  children,
}: {
  count: number;
  canAddMore: boolean;
  stationNames: string[];
  children: ReactNode;
}) {
  const [adding, setAdding] = useState(false);
  const toggle = () => setAdding((open) => !open);

  return (
    <section
      aria-labelledby="favorites-heading"
      className="desktop:rounded-card desktop:border desktop:border-line desktop:bg-surface desktop:p-4"
    >
      <div className="flex min-h-9 items-center justify-between gap-3">
        <h2 id="favorites-heading" className="flex items-center gap-2 font-semibold">
          Your stations
          {count > 0 && (
            <span className="font-normal text-muted desktop:rounded-full desktop:bg-line-2 desktop:px-2 desktop:text-xs desktop:text-fg-2">
              <span aria-hidden="true" className="desktop:hidden">
                ·{" "}
              </span>
              {count}
            </span>
          )}
        </h2>
        {canAddMore && (
          // Desktop only. Phones get the dashed card at the end of the rail instead.
          <button
            type="button"
            onClick={toggle}
            aria-expanded={adding}
            aria-controls="add-station-form"
            className="hidden min-h-9 items-center rounded-control border border-line-3 px-3 text-sm font-semibold text-accent hover:bg-line desktop:inline-flex"
          >
            {adding ? "Cancel" : "+ Add"}
          </button>
        )}
      </div>

      {count === 0 && (
        <p className="mt-1 text-sm text-muted">
          Save your home or work station to check it at a glance.
        </p>
      )}

      {/* Phones: a row of cards that scrolls sideways. Desktop: a list capped at 300px that
          scrolls on its own. Either way, saving more stations never pushes the results down. */}
      <ul className="-mx-4 mt-3 flex snap-x scroll-px-4 gap-3 overflow-x-auto px-4 pb-1 desktop:mx-0 desktop:mt-2 desktop:max-h-[300px] desktop:flex-col desktop:gap-0 desktop:divide-y desktop:divide-line desktop:overflow-x-hidden desktop:overflow-y-auto desktop:px-0 desktop:pb-0">
        {children}
        {canAddMore && (
          <li className="shrink-0 snap-start desktop:hidden">
            <button
              type="button"
              onClick={toggle}
              aria-expanded={adding}
              aria-controls="add-station-form"
              className="flex h-full min-h-24 w-[150px] items-center justify-center rounded-badge border border-dashed border-line-3 text-sm font-semibold text-accent"
            >
              {adding ? "Cancel" : "+ Add station"}
            </button>
          </li>
        )}
      </ul>

      {adding && (
        <AddFavoriteForm
          id="add-station-form"
          stationNames={stationNames}
          onSaved={() => setAdding(false)}
        />
      )}
    </section>
  );
}
