import { BooleanProperty } from "scenerystack/axon";
import type { TModel } from "scenerystack/joist";
import type { MercurySystemModel } from "../../common/model/MercurySystemModel.js";

export class OrbitsModel implements TModel {
  public readonly system: MercurySystemModel;

  /** Whether the elongation angle (arc and degree label at Earth) is drawn. */
  public readonly showElongationProperty = new BooleanProperty(true);

  public constructor(system: MercurySystemModel) {
    this.system = system;
  }

  public reset(): void {
    this.system.reset();
    this.showElongationProperty.reset();
  }

  public step(dt: number): void {
    this.system.step(dt);
  }
}
