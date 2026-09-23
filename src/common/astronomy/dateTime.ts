import { CIVIL_TIME_MS_RANGE, localMeanTimeOffsetMs } from "../../MercuryElongationsConstants.js";

export type LocalDateTimeParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
};

export const daysInMonth = (year: number, month: number): number => new Date(Date.UTC(year, month, 0)).getUTCDate();

/** Splits a UTC instant into local mean solar date/time parts at `longitudeDeg` (east-positive). */
export const civilTimeToLocalParts = (civilTimeMs: number, longitudeDeg: number): LocalDateTimeParts => {
  const local = new Date(civilTimeMs + localMeanTimeOffsetMs(longitudeDeg));
  return {
    year: local.getUTCFullYear(),
    month: local.getUTCMonth() + 1,
    day: local.getUTCDate(),
    hour: local.getUTCHours(),
    minute: local.getUTCMinutes(),
  };
};

/** Inverse of {@link civilTimeToLocalParts}; the day is clamped to the month's length. */
export const localPartsToCivilTime = (parts: LocalDateTimeParts, longitudeDeg: number): number => {
  const day = Math.min(parts.day, daysInMonth(parts.year, parts.month));
  const localAsUtc = Date.UTC(parts.year, parts.month - 1, day, parts.hour, parts.minute, 0);
  return CIVIL_TIME_MS_RANGE.constrainValue(localAsUtc - localMeanTimeOffsetMs(longitudeDeg));
};

const pad2 = (value: number): string => String(value).padStart(2, "0");

/** Local mean solar date and time, `YYYY-MM-DD HH:MM`. */
export const formatLocalDateTime = (civilTimeMs: number, longitudeDeg: number): string => {
  const p = civilTimeToLocalParts(civilTimeMs, longitudeDeg);
  return `${p.year}-${pad2(p.month)}-${pad2(p.day)} ${pad2(p.hour)}:${pad2(p.minute)}`;
};

/** UTC date and time, `YYYY-MM-DD HH:MM`. */
export const formatUtcDateTime = (civilTimeMs: number): string =>
  new Date(civilTimeMs).toISOString().replace("T", " ").slice(0, 16);

/** UTC date only, `YYYY-MM-DD`. */
export const formatUtcDate = (civilTimeMs: number): string => new Date(civilTimeMs).toISOString().slice(0, 10);
