import { Property } from "scenerystack/axon";
import type { TModel } from "scenerystack/joist";
import type { MercurySystemModel } from "../../common/model/MercurySystemModel.js";

export type SkyViewMode = "fixed" | "sun" | "mercury";

export type SkyLookDirection = {
  altitudeDeg: number;
  azimuthDeg: number;
};

export class PlanetariumModel implements TModel {
  public readonly system: MercurySystemModel;
  public readonly skyViewModeProperty = new Property<SkyViewMode>("sun");

  private fixedLookDirection: SkyLookDirection;

  public constructor(system: MercurySystemModel) {
    this.system = system;
    this.fixedLookDirection = this.directionForMode("sun");

    // Entering fixed-sky mode freezes the direction the learner was looking at.
    // From then on, the celestial sphere and both bodies move through that frame.
    this.skyViewModeProperty.lazyLink((mode, previousMode) => {
      if (mode === "fixed") {
        this.fixedLookDirection = this.directionForMode(previousMode);
      }
    });
  }

  public getLookDirection(): SkyLookDirection {
    return this.directionForMode(this.skyViewModeProperty.value);
  }

  private directionForMode(mode: SkyViewMode): SkyLookDirection {
    if (mode === "fixed") {
      return this.fixedLookDirection;
    }
    const body = mode === "sun" ? this.system.snapshotProperty.value.sun : this.system.snapshotProperty.value.mercury;
    return { altitudeDeg: body.altitudeDeg, azimuthDeg: body.azimuthDeg };
  }

  public reset(): void {
    this.system.reset();
    this.skyViewModeProperty.reset();
    this.fixedLookDirection = this.directionForMode("sun");
  }

  public step(dt: number): void {
    this.system.step(dt);
  }
}
