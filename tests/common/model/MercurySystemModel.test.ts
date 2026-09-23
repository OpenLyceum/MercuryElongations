import { describe, expect, it } from "vitest";
import { MercurySystemModel } from "../../../src/common/model/MercurySystemModel.js";
import {
  BEREA_LATITUDE_DEG,
  BEREA_LONGITUDE_DEG,
  DEFAULT_CIVIL_TIME_MS,
  DEFAULT_FIELD_OF_VIEW_DEG,
  MILLISECONDS_PER_DAY,
  MILLISECONDS_PER_SIDEREAL_DAY,
} from "../../../src/MercuryElongationsConstants.js";
import { OrbitsModel } from "../../../src/orbits/model/OrbitsModel.js";
import { PlanetariumModel } from "../../../src/planetarium/model/PlanetariumModel.js";

describe("MercurySystemModel", () => {
  it("starts paused at the historical default", () => {
    const model = new MercurySystemModel();
    expect(model.timer.isPlayingProperty.value).toBe(false);
    expect(model.civilTimeMsProperty.value).toBe(DEFAULT_CIVIL_TIME_MS);
  });

  it("advances at the selected days-per-second rate", () => {
    const model = new MercurySystemModel();
    model.timer.isPlayingProperty.value = true;
    model.step(0.5);
    expect(model.civilTimeMsProperty.value).toBe(DEFAULT_CIVIL_TIME_MS + 0.5 * MILLISECONDS_PER_DAY);
  });

  it("shares one live state across both screens", () => {
    const system = new MercurySystemModel();
    const planetarium = new PlanetariumModel(system);
    const orbits = new OrbitsModel(system);
    planetarium.system.jumpDays(3);
    expect(orbits.system.civilTimeMsProperty.value).toBe(DEFAULT_CIVIL_TIME_MS + 3 * MILLISECONDS_PER_DAY);
  });

  it("supports fixed, Sun-centered, and Mercury-centered planetarium frames", () => {
    const planetarium = new PlanetariumModel(new MercurySystemModel());
    const sunDirection = planetarium.getLookDirection();
    expect(planetarium.skyViewModeProperty.value).toBe("sun");

    planetarium.skyViewModeProperty.value = "fixed";
    planetarium.system.jumpDays(10);
    expect(planetarium.getLookDirection()).toEqual(sunDirection);

    planetarium.skyViewModeProperty.value = "mercury";
    expect(planetarium.getLookDirection().azimuthDeg).toBe(
      planetarium.system.snapshotProperty.value.mercury.azimuthDeg,
    );
    planetarium.reset();
    expect(planetarium.skyViewModeProperty.value).toBe("sun");
  });

  it("jumps to adjacent greatest elongations", () => {
    const model = new MercurySystemModel();
    const initial = model.civilTimeMsProperty.value;
    model.goToNextGreatestElongation();
    const next = model.civilTimeMsProperty.value;
    expect(next).toBeGreaterThan(initial);
    expect(model.snapshotProperty.value.elongationDeg).toBeGreaterThan(18);
    model.goToPreviousGreatestElongation();
    expect(model.civilTimeMsProperty.value).toBeLessThan(next);
    expect(model.snapshotProperty.value.elongationDeg).toBeGreaterThan(18);
  });

  it("reset restores the date, rate, and paused state", () => {
    const model = new MercurySystemModel();
    model.jumpDays(12);
    model.increaseTimeRate();
    model.timer.isPlayingProperty.value = true;
    model.reset();
    expect(model.civilTimeMsProperty.value).toBe(DEFAULT_CIVIL_TIME_MS);
    expect(model.timeRateDaysPerSecondProperty.value).toBe(1);
    expect(model.timer.isPlayingProperty.value).toBe(false);
  });

  it("walks the rate ladder across zero into reverse", () => {
    const model = new MercurySystemModel();
    const seen = new Set<number>();
    for (let i = 0; i < 20; i++) {
      model.decreaseTimeRate();
      seen.add(model.timeRateDaysPerSecondProperty.value);
    }
    expect(model.timeRateDaysPerSecondProperty.value).toBeLessThan(0);
    expect(seen.has(0)).toBe(false);
    model.timer.isPlayingProperty.value = true;
    model.step(0.1);
    expect(model.civilTimeMsProperty.value).toBeLessThan(DEFAULT_CIVIL_TIME_MS);
  });

  it("steps by solar and sidereal days", () => {
    const model = new MercurySystemModel();
    model.jumpSiderealDays(1);
    expect(model.civilTimeMsProperty.value).toBeCloseTo(DEFAULT_CIVIL_TIME_MS + MILLISECONDS_PER_SIDEREAL_DAY, 0);
    const before = model.snapshotProperty.value.localSiderealTimeHours;
    model.jumpSiderealDays(1);
    expect(model.snapshotProperty.value.localSiderealTimeHours).toBeCloseTo(before, 3);
    model.jumpDays(-1);
    expect(model.snapshotProperty.value.localSiderealTimeHours).not.toBeCloseTo(before, 2);
  });

  it("defaults to Berea and follows the location presets", () => {
    const model = new MercurySystemModel();
    expect(model.locationPresetProperty.value).toBe("berea");
    expect(model.latitudeProperty.value).toBe(BEREA_LATITUDE_DEG);
    const bereaAltitude = model.snapshotProperty.value.sun.altitudeDeg;

    model.locationPresetProperty.value = "sydney";
    expect(model.latitudeProperty.value).toBeCloseTo(-33.87, 2);
    expect(model.snapshotProperty.value.location.longitudeDeg).toBeCloseTo(151.21, 2);
    expect(model.snapshotProperty.value.sun.altitudeDeg).not.toBeCloseTo(bereaAltitude, 0);

    model.latitudeProperty.value = 10;
    expect(model.locationPresetProperty.value).toBe("custom");
    model.latitudeProperty.value = 0;
    model.longitudeProperty.value = 0;
    expect(model.locationPresetProperty.value).toBe("equator");

    model.reset();
    expect(model.locationPresetProperty.value).toBe("berea");
    expect(model.longitudeProperty.value).toBe(BEREA_LONGITUDE_DEG);
  });

  it("brackets the clock between the previous and next Mercury events", () => {
    const model = new MercurySystemModel();
    const { previous, next } = model.eventContextProperty.value;
    expect(previous?.timeMs).toBeLessThanOrEqual(DEFAULT_CIVIL_TIME_MS);
    expect(next?.timeMs).toBeGreaterThan(DEFAULT_CIVIL_TIME_MS);
    model.goToNextGreatestElongation();
    expect(model.eventContextProperty.value.previous?.kind).toMatch(/^greatest/);
  });
});

describe("PlanetariumModel camera", () => {
  it("dragging away from a followed body switches to a fixed look direction", () => {
    const planetarium = new PlanetariumModel(new MercurySystemModel());
    const sun = planetarium.getLookDirection();
    planetarium.panBy(10, 5);
    expect(planetarium.skyViewModeProperty.value).toBe("fixed");
    expect(planetarium.getLookDirection().azimuthDeg).toBeCloseTo((sun.azimuthDeg + 10) % 360, 6);
    expect(planetarium.getLookDirection().altitudeDeg).toBeCloseTo(sun.altitudeDeg + 5, 6);
    planetarium.panBy(0, 500);
    expect(planetarium.getLookDirection().altitudeDeg).toBeLessThan(90);
  });

  it("zooms within the field-of-view range and resets display options", () => {
    const planetarium = new PlanetariumModel(new MercurySystemModel());
    for (let i = 0; i < 50; i++) {
      planetarium.zoomIn();
    }
    expect(planetarium.fieldOfViewDegProperty.value).toBe(planetarium.fieldOfViewDegProperty.range.min);
    planetarium.showAtmosphereProperty.value = true;
    planetarium.showCardinalsProperty.value = false;
    planetarium.reset();
    expect(planetarium.fieldOfViewDegProperty.value).toBe(DEFAULT_FIELD_OF_VIEW_DEG);
    expect(planetarium.showAtmosphereProperty.value).toBe(false);
    expect(planetarium.showCardinalsProperty.value).toBe(true);
  });
});

describe("OrbitsModel", () => {
  it("shows the elongation angle by default and restores it on reset", () => {
    const orbits = new OrbitsModel(new MercurySystemModel());
    expect(orbits.showElongationProperty.value).toBe(true);
    orbits.showElongationProperty.value = false;
    orbits.reset();
    expect(orbits.showElongationProperty.value).toBe(true);
  });
});
