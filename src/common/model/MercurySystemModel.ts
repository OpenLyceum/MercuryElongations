import { Body, SearchMaxElongation } from "astronomy-engine";
import { DerivedProperty, NumberProperty, type TReadOnlyProperty } from "scenerystack/axon";
import {
  CIVIL_TIME_MS_RANGE,
  DEFAULT_TIME_RATE_INDEX,
  MILLISECONDS_PER_DAY,
  TIME_RATE_DAYS_PER_SECOND,
  TIME_RATE_INDEX_RANGE,
} from "../../MercuryElongationsConstants.js";
import { resolveInitialCivilTimeMs } from "../../preferences/mercuryElongationsQueryParameters.js";
import { type MercurySnapshot, mercurySnapshot } from "../astronomy/mercuryEphemeris.js";
import { TimeModel } from "../TimeModel.js";

export class MercurySystemModel {
  public readonly timer = new TimeModel(false);
  public readonly civilTimeMsProperty = new NumberProperty(resolveInitialCivilTimeMs());
  public readonly timeRateIndexProperty = new NumberProperty(DEFAULT_TIME_RATE_INDEX, {
    range: TIME_RATE_INDEX_RANGE,
    numberType: "Integer",
  });
  public readonly timeRateDaysPerSecondProperty: TReadOnlyProperty<number>;
  public readonly snapshotProperty: TReadOnlyProperty<MercurySnapshot>;

  public constructor() {
    this.timeRateDaysPerSecondProperty = new DerivedProperty(
      [this.timeRateIndexProperty],
      (index) => TIME_RATE_DAYS_PER_SECOND[index] ?? 1,
    );
    this.snapshotProperty = new DerivedProperty([this.civilTimeMsProperty], mercurySnapshot);
  }

  public setCivilTimeMs(civilTimeMs: number): void {
    this.civilTimeMsProperty.value = CIVIL_TIME_MS_RANGE.constrainValue(civilTimeMs);
  }

  public setCivilTimeAndPause(civilTimeMs: number): void {
    this.timer.isPlayingProperty.value = false;
    this.setCivilTimeMs(civilTimeMs);
  }

  public jumpDays(days: number): void {
    this.setCivilTimeAndPause(this.civilTimeMsProperty.value + days * MILLISECONDS_PER_DAY);
  }

  public decreaseTimeRate(): void {
    this.timeRateIndexProperty.value = Math.max(TIME_RATE_INDEX_RANGE.min, this.timeRateIndexProperty.value - 1);
  }

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
  }
}
