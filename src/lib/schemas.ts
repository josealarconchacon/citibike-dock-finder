import { z } from "zod";

// The feed sends 0/1 for true/false. Accept either form and turn it into a boolean.
const flag = z.union([z.boolean(), z.number()]).transform((value) => Boolean(value));

// z.object() drops any field not listed here, so we only keep what to uses.
export const stationInfoSchema = z.object({
  station_id: z.string(),
  name: z.string(),
  lat: z.number(),
  lon: z.number(),
  capacity: z.number().default(0),
});

export const stationStatusSchema = z.object({
  station_id: z.string(),
  num_bikes_available: z.number(),
  num_ebikes_available: z.number().default(0),
  num_docks_available: z.number(),
  is_installed: flag,
  is_renting: flag,
  is_returning: flag,
  last_reported: z.number(),
});

export const stationInfoFeedSchema = z.object({
  last_updated: z.number(),
  data: z.object({ stations: z.array(stationInfoSchema) }),
});

export const stationStatusFeedSchema = z.object({
  last_updated: z.number(),
  data: z.object({ stations: z.array(stationStatusSchema) }),
});

export type StationInfo = z.infer<typeof stationInfoSchema>;
export type StationStatus = z.infer<typeof stationStatusSchema>;
export type StationInfoFeed = z.infer<typeof stationInfoFeedSchema>;
export type StationStatusFeed = z.infer<typeof stationStatusFeedSchema>;
