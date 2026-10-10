"use client";

import { useEffect } from "react";

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
    <div
      role="alert"
      className="rounded-xl border border-rose-200 bg-rose-50 p-5 dark:border-rose-900 dark:bg-rose-950"
    >
      <h2 className="font-semibold">Couldn&apos;t load Citi Bike data</h2>
      <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
        The live feed didn&apos;t respond. This is usually brief.
      </p>
      <button
        type="button"
        onClick={() => retry()}
        className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 dark:bg-white dark:text-slate-900"
      >
        Try again
      </button>
    </div>
  );
}
