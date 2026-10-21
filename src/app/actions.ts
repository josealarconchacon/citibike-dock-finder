"use server";

import { cookies } from "next/headers";
import { getAllStations } from "@/lib/data";
import {
  FAVORITES_COOKIE,
  ONE_YEAR_SECONDS,
  addFavorite,
  findStationByName,
  parseFavorites,
  removeFavorite,
} from "@/lib/favorites";

export type AddFavoriteState = { error: string | null };

async function saveFavorites(ids: string[]) {
  const cookieStore = await cookies();
  cookieStore.set(FAVORITES_COOKIE, ids.join(","), {
    maxAge: ONE_YEAR_SECONDS,
    path: "/",
    sameSite: "lax",
    httpOnly: true,
  });
}

// Runs on the server when the "Add" form is submitted.
export async function addFavoriteAction(
  _previous: AddFavoriteState,
  formData: FormData,
): Promise<AddFavoriteState> {
  const name = String(formData.get("name") ?? "");
  const { stations } = await getAllStations();
  const station = findStationByName(stations, name);

  if (!station) {
    return { error: "Pick a station name from the list." };
  }

  const cookieStore = await cookies();
  const current = parseFavorites(cookieStore.get(FAVORITES_COOKIE)?.value);
  await saveFavorites(addFavorite(current, station.id));
  return { error: null };
}

// Runs on the server when a "Remove" button is pressed.
export async function removeFavoriteAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  const cookieStore = await cookies();
  const current = parseFavorites(cookieStore.get(FAVORITES_COOKIE)?.value);
  await saveFavorites(removeFavorite(current, id));
}
