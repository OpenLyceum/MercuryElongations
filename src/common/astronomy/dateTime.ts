import { CIVIL_TIME_MS_RANGE, LOCAL_MEAN_TIME_OFFSET_MS } from "../../MercuryElongationsConstants.js";

export type LocalDateTimeParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
};

export const daysInMonth = (year: number, month: number): number => new Date(Date.UTC(year, month, 0)).getUTCDate();

export const civilTimeToLocalParts = (civilTimeMs: number): LocalDateTimeParts => {
  const local = new Date(civilTimeMs + LOCAL_MEAN_TIME_OFFSET_MS);
  return {
    year: local.getUTCFullYear(),
    month: local.getUTCMonth() + 1,
    day: local.getUTCDate(),
    hour: local.getUTCHours(),
    minute: local.getUTCMinutes(),
  };
};

export const localPartsToCivilTime = (parts: LocalDateTimeParts): number => {
  const day = Math.min(parts.day, daysInMonth(parts.year, parts.month));
  const localAsUtc = Date.UTC(parts.year, parts.month - 1, day, parts.hour, parts.minute, 0);
  return CIVIL_TIME_MS_RANGE.constrainValue(localAsUtc - LOCAL_MEAN_TIME_OFFSET_MS);
};

const pad2 = (value: number): string => String(value).padStart(2, "0");

export const formatLocalDateTime = (civilTimeMs: number): string => {
  const p = civilTimeToLocalParts(civilTimeMs);
  return `${p.year}-${pad2(p.month)}-${pad2(p.day)} ${pad2(p.hour)}:${pad2(p.minute)} LMT`;
};

export const formatUtcDateTime = (civilTimeMs: number): string =>
  `${new Date(civilTimeMs).toISOString().replace("T", " ").slice(0, 16)} UTC`;
