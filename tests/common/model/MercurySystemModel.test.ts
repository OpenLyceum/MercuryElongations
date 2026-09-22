import { describe, expect, it } from "vitest";
import { MercurySystemModel } from "../../../src/common/model/MercurySystemModel.js";
import { DEFAULT_CIVIL_TIME_MS, MILLISECONDS_PER_DAY } from "../../../src/MercuryElongationsConstants.js";
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
    expect(model.civilTimeMsProperty.value).toBe(DEFAULT_CIVIL_TIME_MS + MILLISECONDS_PER_DAY);
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
    expect(model.timeRateDaysPerSecondProperty.value).toBe(2);
    expect(model.timer.isPlayingProperty.value).toBe(false);
  });
});
