import { BooleanProperty, NumberProperty, Property } from "scenerystack/axon";
import type { TModel } from "scenerystack/joist";
import type { MercurySystemModel } from "../../common/model/MercurySystemModel.js";
import {
  DEFAULT_FIELD_OF_VIEW_DEG,
  DEFAULT_SHOW_ATMOSPHERE,
  DEFAULT_SHOW_CARDINALS,
  FIELD_OF_VIEW_RANGE,
  FIELD_OF_VIEW_ZOOM_FACTOR,
  LOOK_ALTITUDE_RANGE,
} from "../../MercuryElongationsConstants.js";

export type SkyViewMode = "fixed" | "sun" | "mercury";

export type SkyLookDirection = {
  altitudeDeg: number;
  azimuthDeg: number;
};

const wrapAzimuth = (azimuthDeg: number): number => ((azimuthDeg % 360) + 360) % 360;

export class PlanetariumModel implements TModel {
  public readonly system: MercurySystemModel;
  public readonly skyViewModeProperty = new Property<SkyViewMode>("sun");

  /** Camera direction used in "fixed" mode; dragging the sky writes it. */
  public readonly fixedLookAzimuthDegProperty = new NumberProperty(0);
  public readonly fixedLookAltitudeDegProperty = new NumberProperty(0, { range: LOOK_ALTITUDE_RANGE });

  /** Horizontal field of view (degrees); narrower zooms in. */
  public readonly fieldOfViewDegProperty = new NumberProperty(DEFAULT_FIELD_OF_VIEW_DEG, {
    range: FIELD_OF_VIEW_RANGE,
  });

  /** Daylight/twilight sky colors, ground shading, and star wash-out driven by the Sun's altitude. */
  public readonly showAtmosphereProperty = new BooleanProperty(DEFAULT_SHOW_ATMOSPHERE);
  public readonly showCardinalsProperty = new BooleanProperty(DEFAULT_SHOW_CARDINALS);

  public constructor(system: MercurySystemModel) {
    this.system = system;
    this.setFixedLookDirection(this.directionForMode("sun"));

    // Entering fixed-sky mode freezes the direction the learner was looking at.
    // From then on, the celestial sphere and both bodies move through that frame.
    this.skyViewModeProperty.lazyLink((mode, previousMode) => {
      if (mode === "fixed") {
        this.setFixedLookDirection(this.directionForMode(previousMode));
      }
    });
  }

  public getLookDirection(): SkyLookDirection {
    return this.directionForMode(this.skyViewModeProperty.value);
  }

  /**
   * Turns the camera by the given angles. Panning away from a followed body
   * switches to fixed mode, starting from the direction the camera was facing.
   */
  public panBy(deltaAzimuthDeg: number, deltaAltitudeDeg: number): void {
    const start = this.getLookDirection();
    this.skyViewModeProperty.value = "fixed";
    this.setFixedLookDirection({
      azimuthDeg: start.azimuthDeg + deltaAzimuthDeg,
      altitudeDeg: start.altitudeDeg + deltaAltitudeDeg,
    });
  }

  /** Multiplies the field of view by `factor` (<1 zooms in), clamped to its range. */
  public zoomBy(factor: number): void {
    this.fieldOfViewDegProperty.value = FIELD_OF_VIEW_RANGE.constrainValue(this.fieldOfViewDegProperty.value * factor);
  }

  public zoomIn(): void {
    this.zoomBy(1 / FIELD_OF_VIEW_ZOOM_FACTOR);
  }

  public zoomOut(): void {
    this.zoomBy(FIELD_OF_VIEW_ZOOM_FACTOR);
  }

  private setFixedLookDirection(direction: SkyLookDirection): void {
    this.fixedLookAzimuthDegProperty.value = wrapAzimuth(direction.azimuthDeg);
    this.fixedLookAltitudeDegProperty.value = LOOK_ALTITUDE_RANGE.constrainValue(direction.altitudeDeg);
  }

  private directionForMode(mode: SkyViewMode): SkyLookDirection {
    if (mode === "fixed") {
      return {
        altitudeDeg: this.fixedLookAltitudeDegProperty.value,
        azimuthDeg: this.fixedLookAzimuthDegProperty.value,
      };
    }
    const body = mode === "sun" ? this.system.snapshotProperty.value.sun : this.system.snapshotProperty.value.mercury;
    return { altitudeDeg: body.altitudeDeg, azimuthDeg: body.azimuthDeg };
  }

  public reset(): void {
    this.system.reset();
    this.skyViewModeProperty.reset();
    this.fieldOfViewDegProperty.reset();
    this.showAtmosphereProperty.reset();
    this.showCardinalsProperty.reset();
    this.setFixedLookDirection(this.directionForMode("sun"));
  }

  public step(dt: number): void {
    this.system.step(dt);
  }
}
