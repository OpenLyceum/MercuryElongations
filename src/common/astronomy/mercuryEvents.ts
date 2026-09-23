import { Body, Elongation, SearchMaxElongation, SearchRelativeLongitude } from "astronomy-engine";
import { MILLISECONDS_PER_DAY } from "../../MercuryElongationsConstants.js";

/**
 * Configurations of Mercury as seen from Earth. For an inferior planet, a heliocentric
 * relative longitude of 0° is inferior conjunction and 180° is superior conjunction.
 */
export type MercuryEventKind = "inferiorConjunction" | "superiorConjunction" | "greatestEastern" | "greatestWestern";

export type MercuryEvent = {
  kind: MercuryEventKind;
  timeMs: number;
  elongationDeg: number;
};

export type MercuryEventContext = {
  previous: MercuryEvent | null;
  next: MercuryEvent | null;
};

/** All conjunctions and greatest elongations in [startMs, endMs), sorted by time. */
export const findMercuryEvents = (startMs: number, endMs: number): MercuryEvent[] => {
  const events: MercuryEvent[] = [];

  let searchMs = startMs;
  for (;;) {
    const max = SearchMaxElongation(Body.Mercury, new Date(searchMs));
    const timeMs = max.time.date.getTime();
    if (timeMs >= endMs) {
      break;
    }
    events.push({
      kind: max.visibility === "evening" ? "greatestEastern" : "greatestWestern",
      timeMs,
      elongationDeg: max.elongation,
    });
    searchMs = timeMs + MILLISECONDS_PER_DAY;
  }

  const conjunctions: [number, MercuryEventKind][] = [
    [0, "inferiorConjunction"],
    [180, "superiorConjunction"],
  ];
  for (const [relativeLongitudeDeg, kind] of conjunctions) {
    searchMs = startMs;
    for (;;) {
      const date = SearchRelativeLongitude(Body.Mercury, relativeLongitudeDeg, new Date(searchMs)).date;
      const timeMs = date.getTime();
      if (timeMs >= endMs) {
        break;
      }
      events.push({ kind, timeMs, elongationDeg: Elongation(Body.Mercury, date).elongation });
      searchMs = timeMs + MILLISECONDS_PER_DAY;
    }
  }

  return events.sort((a, b) => a.timeMs - b.timeMs);
};

/** Half-width of the cached event window. Mercury's synodic period is ~116 days. */
const WINDOW_HALF_WIDTH_MS = 150 * MILLISECONDS_PER_DAY;
/** Refill the cache once the clock gets this close to either end of it. */
const WINDOW_REFRESH_MARGIN_MS = 60 * MILLISECONDS_PER_DAY;

/**
 * Caches the events around the clock so animation frames only do a lookup;
 * the ephemeris searches rerun only when the clock nears the edge of the window.
 */
export class MercuryEventTimeline {
  private events: MercuryEvent[] = [];
  private windowStartMs = Number.NaN;
  private windowEndMs = Number.NaN;

  /** The most recent event at or before `timeMs` and the first one after it. */
  public contextAt(timeMs: number): MercuryEventContext {
    if (
      !(
        timeMs - this.windowStartMs >= WINDOW_REFRESH_MARGIN_MS && this.windowEndMs - timeMs >= WINDOW_REFRESH_MARGIN_MS
      )
    ) {
      this.windowStartMs = timeMs - WINDOW_HALF_WIDTH_MS;
      this.windowEndMs = timeMs + WINDOW_HALF_WIDTH_MS;
      this.events = findMercuryEvents(this.windowStartMs, this.windowEndMs);
    }
    const nextIndex = this.events.findIndex((event) => event.timeMs > timeMs);
    const previousIndex = (nextIndex < 0 ? this.events.length : nextIndex) - 1;
    return {
      previous: this.events[previousIndex] ?? null,
      next: nextIndex < 0 ? null : (this.events[nextIndex] ?? null),
    };
  }
}
