"use client";

import { useEffect } from "react";
import { Brand } from "@/components/Brand";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <div className="border-b border-line bg-header">
        <div className="mx-auto max-w-page px-4 py-3 desktop:px-6">
          <Brand />
        </div>
      </div>
      <div className="mx-auto max-w-page px-4 py-5 desktop:px-6 desktop:py-6">
        <div
          role="alert"
          className="rounded-card border border-status-none-border bg-status-none-bg p-5"
        >
          <h2 className="font-semibold">Couldn&apos;t load Citi Bike data</h2>
          <p className="mt-1 text-sm text-fg-2">
            The live feed didn&apos;t respond. This is usually brief.
          </p>
          <button
            type="button"
            onClick={() => retry()}
            className="mt-4 min-h-11 rounded-control bg-primary px-4 py-2 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Try again
          </button>
        </div>
      </div>
    </>
  );
}
