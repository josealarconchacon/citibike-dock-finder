"use client";

import { useActionState } from "react";
import { addFavoriteAction, type AddFavoriteState } from "@/app/actions";

const initialState: AddFavoriteState = { error: null };

export function AddFavoriteForm({ stationNames }: { stationNames: string[] }) {
  const [state, formAction, isPending] = useActionState(addFavoriteAction, initialState);

  return (
    <form action={formAction} className="mt-3 space-y-2">
      <label htmlFor="favorite-name" className="block text-sm font-medium">
        Station name
      </label>
      <div className="flex gap-2">
        <input
          id="favorite-name"
          name="name"
          list="station-names"
          required
          autoComplete="off"
          placeholder="e.g. E 68 St & Lexington Ave"
          aria-invalid={state.error ? true : undefined}
          aria-describedby={state.error ? "favorite-error" : undefined}
          className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900"
        />
        <button
          type="submit"
          disabled={isPending}
          className="min-h-11 shrink-0 rounded-lg bg-teal-700 px-4 text-sm font-semibold text-white disabled:opacity-60"
        >
          {isPending ? "Saving…" : "Save"}
        </button>
      </div>
      <datalist id="station-names">
        {stationNames.map((name) => (
          <option key={name} value={name} />
        ))}
      </datalist>
      {state.error && (
        <p id="favorite-error" role="alert" className="text-sm text-red-700 dark:text-red-400">
          {state.error}
        </p>
      )}
    </form>
  );
}
