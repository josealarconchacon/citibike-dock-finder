import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchFeeds } from "@/lib/gbfs";
import { STATION_INFO_URL } from "@/lib/constants";
import { parseValidStations, stationInfoSchema, stationStatusSchema } from "@/lib/schemas";
import { makeInfo, makeStatus } from "./fixtures";

// Mockfeeds: info first, status second.
function mockFeeds(info: unknown, status: unknown, ok = true) {
  const fetchMock = vi.fn(async (url: string) => ({
    ok,
    status: ok ? 200 : 503,
    json: async () => (url === STATION_INFO_URL ? info : status),
  }));
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

const infoFeed = { last_updated: 1, ttl: 60, data: { stations: [makeInfo()] } };
// The live feed uses 0/1, not true/false.
const statusFeed = {
  last_updated: 2,
  ttl: 60,
  data: {
    stations: [{ ...makeStatus(), is_installed: 1, is_renting: 1, is_returning: 0 }],
  },
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("fetchFeeds", () => {
  it("fetches both feeds and parses them", async () => {
    const fetchMock = mockFeeds(infoFeed, statusFeed);
    const { info, status } = await fetchFeeds();

    expect(fetchMock).toHaveBeenCalledTimes(2);
    // fetchFeeds only checks the envelope, so the stations are parsed here.
    const [infoStation] = parseValidStations(stationInfoSchema, info.data.stations);
    const [statusStation] = parseValidStations(stationStatusSchema, status.data.stations);

    expect(infoStation.name).toBe("E 68 St & Lexington Ave");
    expect(statusStation.is_returning).toBe(false);
  });

  it("drops fields the app does not use", async () => {
    mockFeeds(
      { ...infoFeed, data: { stations: [{ ...makeInfo(), rental_uris: { ios: "x" } }] } },
      statusFeed,
    );
    const { info } = await fetchFeeds();

    const [station] = parseValidStations(stationInfoSchema, info.data.stations);

    expect(station).not.toHaveProperty("rental_uris");
  });

  it("throws a clear error when Citi Bike is down", async () => {
    mockFeeds(infoFeed, statusFeed, false);
    await expect(fetchFeeds()).rejects.toThrow(/feed failed \(503\)/);
  });

  it("throws when the data has an unexpected shape", async () => {
    mockFeeds({ nope: true }, statusFeed);
    await expect(fetchFeeds()).rejects.toThrow(/unexpected shape/);
  });
});
