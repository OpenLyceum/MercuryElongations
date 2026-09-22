import { describe, expect, it } from "vitest";
import {
  civilTimeToLocalParts,
  formatLocalDateTime,
  localPartsToCivilTime,
} from "../../../src/common/astronomy/dateTime.js";
import { DEFAULT_CIVIL_TIME_MS, LOCAL_MEAN_TIME_OFFSET_MS } from "../../../src/MercuryElongationsConstants.js";

describe("Berea local mean solar time", () => {
  it("starts at local noon on January 1, 1600", () => {
    expect(civilTimeToLocalParts(DEFAULT_CIVIL_TIME_MS)).toEqual({
      year: 1600,
      month: 1,
      day: 1,
      hour: 12,
      minute: 0,
    });
    expect(formatLocalDateTime(DEFAULT_CIVIL_TIME_MS)).toBe("1600-01-01 12:00 LMT");
  });

  it("round-trips local date/time parts", () => {
    const parts = { year: 2026, month: 9, day: 22, hour: 14, minute: 35 };
    expect(civilTimeToLocalParts(localPartsToCivilTime(parts))).toEqual(parts);
  });

  it("uses Berea longitude rather than a modern time zone", () => {
    expect(DEFAULT_CIVIL_TIME_MS + LOCAL_MEAN_TIME_OFFSET_MS).toBe(Date.UTC(1600, 0, 1, 12));
  });
});
