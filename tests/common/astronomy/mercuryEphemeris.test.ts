import { Body } from "astronomy-engine";
import { describe, expect, it } from "vitest";
import { heliocentricState, mercurySnapshot } from "../../../src/common/astronomy/mercuryEphemeris.js";
import {
  BEREA_LATITUDE_DEG,
  BEREA_LONGITUDE_DEG,
  DEFAULT_CIVIL_TIME_MS,
} from "../../../src/MercuryElongationsConstants.js";

const BEREA = { latitudeDeg: BEREA_LATITUDE_DEG, longitudeDeg: BEREA_LONGITUDE_DEG };

describe("Mercury ephemeris", () => {
  it("computes the approved opening geometry", () => {
    const snapshot = mercurySnapshot(DEFAULT_CIVIL_TIME_MS, BEREA);
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

  it("moves the sky with the observer but not the elongation", () => {
    const berea = mercurySnapshot(DEFAULT_CIVIL_TIME_MS, BEREA);
    const sydney = mercurySnapshot(DEFAULT_CIVIL_TIME_MS, { latitudeDeg: -33.87, longitudeDeg: 151.21 });
    expect(sydney.elongationDeg).toBeCloseTo(berea.elongationDeg, 3);
    // Local noon in Berea is the middle of the night in Sydney.
    expect(sydney.sun.altitudeDeg).toBeLessThan(0);
    const northPole = mercurySnapshot(DEFAULT_CIVIL_TIME_MS, { latitudeDeg: 90, longitudeDeg: 0 });
    // At the pole, altitude equals declination (small refraction aside).
    expect(northPole.sun.altitudeDeg).toBeCloseTo(northPole.sun.declinationDeg, 0);
  });
});
