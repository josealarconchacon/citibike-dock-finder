"use client";

import { useActionState } from "react";
import { addFavoriteAction, type AddFavoriteState } from "@/app/actions";

const initialState: AddFavoriteState = { error: null };

export function AddFavoriteForm({
  id,
  stationNames,
  onSaved,
}: {
  id?: string;
  stationNames: string[];
  // Called after a station is saved, so the parent can close the form.
  onSaved?: () => void;
}) {
  const [state, formAction, isPending] = useActionState(
    async (previous: AddFavoriteState, formData: FormData) => {
      const result = await addFavoriteAction(previous, formData);
      if (!result.error) onSaved?.();
      return result;
    },
    initialState,
  );

  return (
    <form id={id} action={formAction} className="mt-3 space-y-2">
      <label htmlFor="favorite-name" className="block text-sm font-medium text-fg-2">
        Station name
      </label>
      <div className="flex gap-2">
        <input
          id="favorite-name"
          name="name"
          list="station-names"
          required
          autoComplete="off"
          // The form only appears after "+ Add" is pressed, so typing can start right away.
          autoFocus
          placeholder="e.g. E 68 St & Lexington Ave"
          aria-invalid={state.error ? true : undefined}
          aria-describedby={state.error ? "favorite-error" : undefined}
          className="min-h-11 w-full min-w-0 rounded-control border border-line-3 bg-page px-3 text-sm text-fg placeholder:text-muted"
        />
        <button
          type="submit"
          disabled={isPending}
          className="min-h-11 shrink-0 rounded-control bg-primary px-4 text-sm font-semibold text-white disabled:opacity-60"
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
        <p id="favorite-error" role="alert" className="text-sm text-status-none-text">
          {state.error}
        </p>
      )}
    </form>
  );
}
