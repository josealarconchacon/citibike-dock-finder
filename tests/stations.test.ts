import { describe, expect, it } from "vitest";
import { joinStations } from "@/lib/stations";
import { makeInfo, makeStatus } from "./fixtures";

describe("joinStations", () => {
  it("joins info and status by station_id", () => {
    const [station] = joinStations([makeInfo()], [makeStatus()]);

    expect(station).toMatchObject({
      id: "a",
      name: "E 68 St & Lexington Ave",
      docks: 20,
      isRenting: true,
    });
  });

  it("splits classic bikes from e-bikes", () => {
    const [station] = joinStations(
      [makeInfo()],
      [makeStatus({ num_bikes_available: 10, num_ebikes_available: 4 })],
    );

    expect(station.classicBikes).toBe(6);
    expect(station.ebikes).toBe(4);
  });

  it("converts last_reported from seconds to milliseconds", () => {
    const [station] = joinStations([makeInfo()], [makeStatus({ last_reported: 100 })]);
    expect(station.lastReported).toBe(100_000);
  });

  it("drops stations that are not installed", () => {
    expect(joinStations([makeInfo()], [makeStatus({ is_installed: false })])).toEqual([]);
  });

  it("drops stations with zero capacity", () => {
    expect(joinStations([makeInfo({ capacity: 0 })], [makeStatus()])).toEqual([]);
  });

  it("drops stations that have no status", () => {
    expect(joinStations([makeInfo({ station_id: "missing" })], [makeStatus()])).toEqual([]);
  });
});
