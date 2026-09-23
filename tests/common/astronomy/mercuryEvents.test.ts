import { describe, expect, it } from "vitest";
import { findMercuryEvents, MercuryEventTimeline } from "../../../src/common/astronomy/mercuryEvents.js";
import { DEFAULT_CIVIL_TIME_MS, MILLISECONDS_PER_DAY } from "../../../src/MercuryElongationsConstants.js";

describe("Mercury events", () => {
  const start = DEFAULT_CIVIL_TIME_MS;
  const events = findMercuryEvents(start, start + 365 * MILLISECONDS_PER_DAY);

  it("finds every configuration about three times a year, in time order", () => {
    for (const kind of ["inferiorConjunction", "superiorConjunction", "greatestEastern", "greatestWestern"]) {
      const count = events.filter((event) => event.kind === kind).length;
      expect(count).toBeGreaterThanOrEqual(3);
      expect(count).toBeLessThanOrEqual(4);
    }
    for (let i = 1; i < events.length; i++) {
      expect(events[i]?.timeMs).toBeGreaterThan(events[i - 1]?.timeMs ?? 0);
    }
  });

  it("cycles greatest eastern → inferior conjunction → greatest western → superior conjunction", () => {
    const order = ["greatestEastern", "inferiorConjunction", "greatestWestern", "superiorConjunction"];
    const firstIndex = order.indexOf(events[0]?.kind ?? "");
    events.forEach((event, i) => {
      expect(event.kind).toBe(order[(firstIndex + i) % order.length]);
    });
  });

  it("reports small elongations at conjunction and large ones at greatest elongation", () => {
    for (const event of events) {
      if (event.kind.endsWith("Conjunction")) {
        expect(event.elongationDeg).toBeLessThan(6);
      } else {
        expect(event.elongationDeg).toBeGreaterThan(17);
        expect(event.elongationDeg).toBeLessThan(29);
      }
    }
  });

  it("brackets the clock with the previous and next events", () => {
    const timeline = new MercuryEventTimeline();
    for (let day = 0; day < 400; day += 13) {
      const t = start + day * MILLISECONDS_PER_DAY;
      const { previous, next } = timeline.contextAt(t);
      expect(previous?.timeMs).toBeLessThanOrEqual(t);
      expect(next?.timeMs).toBeGreaterThan(t);
    }
  });
});
