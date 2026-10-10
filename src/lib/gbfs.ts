import { STATION_INFO_URL, STATION_STATUS_URL } from "@/lib/constants";
import {
  stationInfoFeedSchema,
  stationStatusFeedSchema,
  type StationInfoFeed,
  type StationStatusFeed,
} from "@/lib/schemas";
import type { z } from "zod";

// Grabs one feed and throws if the request fails or the JSON isn't what we expect.
async function fetchFeed<T>(url: string, schema: z.ZodType<T>): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Citi Bike feed failed (${response.status}): ${url}`);
  }

  const json: unknown = await response.json();
  const parsed = schema.safeParse(json);

  if (!parsed.success) {
    throw new Error(`Citi Bike feed had an unexpected shape: ${url}`);
  }

  return parsed.data;
}

// Fetches both feeds at the same time and checks their shape.
export async function fetchFeeds(): Promise<{
  info: StationInfoFeed;
  status: StationStatusFeed;
}> {
  const [info, status] = await Promise.all([
    fetchFeed(STATION_INFO_URL, stationInfoFeedSchema),
    fetchFeed(STATION_STATUS_URL, stationStatusFeedSchema),
  ]);

  return { info, status };
}
