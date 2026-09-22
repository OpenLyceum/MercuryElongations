import type { TModel } from "scenerystack/joist";
import type { MercurySystemModel } from "../../common/model/MercurySystemModel.js";

export class PlanetariumModel implements TModel {
  public readonly system: MercurySystemModel;

  public constructor(system: MercurySystemModel) {
    this.system = system;
  }

  public reset(): void {
    this.system.reset();
  }

  public step(dt: number): void {
    this.system.step(dt);
  }
}
