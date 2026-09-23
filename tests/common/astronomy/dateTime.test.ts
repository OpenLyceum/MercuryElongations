import { describe, expect, it } from "vitest";
import {
  civilTimeToLocalParts,
  formatLocalDateTime,
  localPartsToCivilTime,
} from "../../../src/common/astronomy/dateTime.js";
import {
  BEREA_LONGITUDE_DEG,
  DEFAULT_CIVIL_TIME_MS,
  localMeanTimeOffsetMs,
} from "../../../src/MercuryElongationsConstants.js";

describe("local mean solar time", () => {
  it("starts at Berea local noon on January 1, 1600", () => {
    expect(civilTimeToLocalParts(DEFAULT_CIVIL_TIME_MS, BEREA_LONGITUDE_DEG)).toEqual({
      year: 1600,
      month: 1,
      day: 1,
      hour: 12,
      minute: 0,
    });
    expect(formatLocalDateTime(DEFAULT_CIVIL_TIME_MS, BEREA_LONGITUDE_DEG)).toBe("1600-01-01 12:00");
  });

  it("round-trips local date/time parts at any longitude", () => {
    const parts = { year: 2026, month: 9, day: 22, hour: 14, minute: 35 };
    for (const longitude of [BEREA_LONGITUDE_DEG, 0, 151.2]) {
      expect(civilTimeToLocalParts(localPartsToCivilTime(parts, longitude), longitude)).toEqual(parts);
    }
  });

  it("uses the observer's longitude rather than a modern time zone", () => {
    expect(DEFAULT_CIVIL_TIME_MS + localMeanTimeOffsetMs(BEREA_LONGITUDE_DEG)).toBe(Date.UTC(1600, 0, 1, 12));
    expect(civilTimeToLocalParts(Date.UTC(2000, 0, 1, 12), 90).hour).toBe(18);
    expect(civilTimeToLocalParts(Date.UTC(2000, 0, 1, 12), 0).hour).toBe(12);
  });
});
