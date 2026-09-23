import { Body, SearchMaxElongation } from "astronomy-engine";
import { DerivedProperty, NumberProperty, Property, type TReadOnlyProperty } from "scenerystack/axon";
import {
  CIVIL_TIME_MS_RANGE,
  DEFAULT_TIME_RATE_INDEX,
  LATITUDE_RANGE,
  LONGITUDE_RANGE,
  MILLISECONDS_PER_DAY,
  MILLISECONDS_PER_SIDEREAL_DAY,
  TIME_RATE_DAYS_PER_SECOND,
  TIME_RATE_INDEX_RANGE,
} from "../../MercuryElongationsConstants.js";
import {
  resolveInitialCivilTimeMs,
  resolveInitialLatitudeDeg,
  resolveInitialLongitudeDeg,
} from "../../preferences/mercuryElongationsQueryParameters.js";
import { type MercurySnapshot, mercurySnapshot, type ObserverLocation } from "../astronomy/mercuryEphemeris.js";
import { type MercuryEventContext, MercuryEventTimeline } from "../astronomy/mercuryEvents.js";
import { TimeModel } from "../TimeModel.js";
import { LOCATION_PRESET_COORDINATES, type LocationPreset, presetForLocation } from "./LocationPreset.js";

export class MercurySystemModel {
  public readonly timer = new TimeModel(false);
  public readonly civilTimeMsProperty = new NumberProperty(resolveInitialCivilTimeMs());
  public readonly timeRateIndexProperty = new NumberProperty(DEFAULT_TIME_RATE_INDEX, {
    range: TIME_RATE_INDEX_RANGE,
    numberType: "Integer",
  });
  public readonly timeRateDaysPerSecondProperty: TReadOnlyProperty<number>;

  /** Observer site (+N / +E degrees). Defaults to Berea, Kentucky. */
  public readonly latitudeProperty = new NumberProperty(resolveInitialLatitudeDeg(), { range: LATITUDE_RANGE });
  public readonly longitudeProperty = new NumberProperty(resolveInitialLongitudeDeg(), { range: LONGITUDE_RANGE });
  /** Named site matching the latitude/longitude, or "custom". Choosing a preset moves the observer. */
  public readonly locationPresetProperty: Property<LocationPreset>;
  public readonly locationProperty: TReadOnlyProperty<ObserverLocation>;

  public readonly snapshotProperty: TReadOnlyProperty<MercurySnapshot>;
  /** The conjunction or greatest elongation most recently passed, and the next one ahead. */
  public readonly eventContextProperty: TReadOnlyProperty<MercuryEventContext>;

  public constructor() {
    this.timeRateDaysPerSecondProperty = new DerivedProperty(
      [this.timeRateIndexProperty],
      (index) => TIME_RATE_DAYS_PER_SECOND[index] ?? 1,
    );

    this.locationProperty = new DerivedProperty(
      [this.latitudeProperty, this.longitudeProperty],
      (latitudeDeg, longitudeDeg) => ({ latitudeDeg, longitudeDeg }),
    );
    this.locationPresetProperty = new Property<LocationPreset>(presetForLocation(this.locationProperty.value));

    // Preset → coordinates, and hand-edited coordinates → matching preset (or "custom").
    let applyingPreset = false;
    this.locationPresetProperty.lazyLink((preset) => {
      const coordinates = preset === "custom" ? undefined : LOCATION_PRESET_COORDINATES.get(preset);
      if (coordinates) {
        applyingPreset = true;
        this.latitudeProperty.value = coordinates.latitudeDeg;
        this.longitudeProperty.value = coordinates.longitudeDeg;
        applyingPreset = false;
      }
    });
    this.locationProperty.lazyLink((location) => {
      if (!applyingPreset) {
        this.locationPresetProperty.value = presetForLocation(location);
      }
    });

    this.snapshotProperty = new DerivedProperty([this.civilTimeMsProperty, this.locationProperty], mercurySnapshot);

    const timeline = new MercuryEventTimeline();
    this.eventContextProperty = new DerivedProperty(
      [this.civilTimeMsProperty],
      (civilTimeMs) => timeline.contextAt(civilTimeMs),
      {
        valueComparisonStrategy: (a, b) =>
          a.previous?.timeMs === b.previous?.timeMs && a.next?.timeMs === b.next?.timeMs,
      },
    );
  }

  public setCivilTimeMs(civilTimeMs: number): void {
    this.civilTimeMsProperty.value = CIVIL_TIME_MS_RANGE.constrainValue(civilTimeMs);
  }

  public setCivilTimeAndPause(civilTimeMs: number): void {
    this.timer.isPlayingProperty.value = false;
    this.setCivilTimeMs(civilTimeMs);
  }

  /** Steps by whole mean solar days: the Sun returns to (nearly) the same place in the sky. */
  public jumpDays(days: number): void {
    this.setCivilTimeAndPause(this.civilTimeMsProperty.value + days * MILLISECONDS_PER_DAY);
  }

  /** Steps by whole sidereal days: the stars return to the same place while the Sun drifts ~1° east. */
  public jumpSiderealDays(siderealDays: number): void {
    this.setCivilTimeAndPause(this.civilTimeMsProperty.value + siderealDays * MILLISECONDS_PER_SIDEREAL_DAY);
  }

  /** One notch slower on the rate ladder; past the slowest forward rate it crosses into reverse. */
  public decreaseTimeRate(): void {
    this.timeRateIndexProperty.value = Math.max(TIME_RATE_INDEX_RANGE.min, this.timeRateIndexProperty.value - 1);
  }

  /** One notch faster on the rate ladder (or back toward forward play from reverse). */
  public increaseTimeRate(): void {
    this.timeRateIndexProperty.value = Math.min(TIME_RATE_INDEX_RANGE.max, this.timeRateIndexProperty.value + 1);
  }

  public goToNextGreatestElongation(): void {
    const start = new Date(this.civilTimeMsProperty.value + 60_000);
    this.setCivilTimeAndPause(SearchMaxElongation(Body.Mercury, start).time.date.getTime());
  }

  public goToPreviousGreatestElongation(): void {
    const currentMs = this.civilTimeMsProperty.value;
    let event = SearchMaxElongation(Body.Mercury, new Date(currentMs - 200 * MILLISECONDS_PER_DAY));
    let previousMs = event.time.date.getTime();
    for (let index = 0; index < 8; index++) {
      const next = SearchMaxElongation(Body.Mercury, new Date(previousMs + MILLISECONDS_PER_DAY));
      const nextMs = next.time.date.getTime();
      if (nextMs >= currentMs) {
        break;
      }
      event = next;
      previousMs = nextMs;
    }
    this.setCivilTimeAndPause(event.time.date.getTime());
  }

  public step(dt: number): void {
    if (this.timer.isPlayingProperty.value) {
      const deltaMs = dt * this.timeRateDaysPerSecondProperty.value * MILLISECONDS_PER_DAY;
      const next = this.civilTimeMsProperty.value + deltaMs;
      if (next <= CIVIL_TIME_MS_RANGE.min || next >= CIVIL_TIME_MS_RANGE.max) {
        this.timer.isPlayingProperty.value = false;
      }
      this.setCivilTimeMs(next);
    }
  }

  public reset(): void {
    this.timer.reset();
    this.civilTimeMsProperty.reset();
    this.timeRateIndexProperty.reset();
    this.latitudeProperty.reset();
    this.longitudeProperty.reset();
  }
}
