import { Body } from "astronomy-engine";
import { describe, expect, it } from "vitest";
import { heliocentricState, mercurySnapshot } from "../../../src/common/astronomy/mercuryEphemeris.js";
import { DEFAULT_CIVIL_TIME_MS } from "../../../src/MercuryElongationsConstants.js";

describe("Mercury ephemeris", () => {
  it("computes the approved opening geometry", () => {
    const snapshot = mercurySnapshot(DEFAULT_CIVIL_TIME_MS);
    expect(snapshot.elongationDeg).toBeCloseTo(8.216, 2);
    expect(snapshot.direction).toBe("east");
    expect(snapshot.visibility).toBe("evening");
    expect(snapshot.sun.altitudeDeg).toBeGreaterThan(25);
    expect(snapshot.mercury.altitudeDeg).toBeGreaterThan(20);
  });

  it("returns plausible heliocentric distances", () => {
    const earth = heliocentricState(Body.Earth, DEFAULT_CIVIL_TIME_MS);
    const mercury = heliocentricState(Body.Mercury, DEFAULT_CIVIL_TIME_MS);
    expect(earth.distanceAu).toBeGreaterThan(0.98);
    expect(earth.distanceAu).toBeLessThan(1.02);
    expect(mercury.distanceAu).toBeGreaterThan(0.3);
    expect(mercury.distanceAu).toBeLessThan(0.47);
  });
});
