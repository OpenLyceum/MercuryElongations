/**
 * Memory-leak regression suite (fleet standard): each object below is collected after
 * dispose(), survives a double dispose(), and leaves no survivors across repeated cycles
 * (tests/helpers/memoryLeak.ts). TimeModel is the only class with a dispose();
 * MercurySystemModel, PlanetariumModel and OrbitsModel live for the whole sim (see
 * doc/implementation-notes.md, "Object lifetime"), so they are checked with create/drop + forceGC.
 *
 * In the sim one MercurySystemModel is shared by the Orbits and Planetarium models, so the
 * screen-model cases also drop each model while a long-lived system stays alive: the screen
 * model must not be pinned by the shared system's Properties.
 */

import { describe, expect, it } from "vitest";
import { MercurySystemModel } from "../src/common/model/MercurySystemModel.js";
import { TimeModel } from "../src/common/TimeModel.js";
import { OrbitsModel } from "../src/orbits/model/OrbitsModel.js";
import { PlanetariumModel } from "../src/planetarium/model/PlanetariumModel.js";
import { describeDisposalLeaks, forceGC } from "./helpers/memoryLeak.js";

type ScreenModel = OrbitsModel | PlanetariumModel;

function exercise(model: { timer?: TimeModel; step(dt: number): void; reset(): void }): void {
  if (model.timer) {
    model.timer.isPlayingProperty.value = true;
  }
  for (let i = 0; i < 30; i++) {
    model.step(1 / 60);
  }
  model.reset();
}

function createAndDropSystem(): WeakRef<object> {
  const system = new MercurySystemModel();
  system.timer.isPlayingProperty.value = true;
  exercise(system);
  return new WeakRef<object>(system);
}

/** Screen model plus its own system, both dropped. */
function createAndDropScreenModel(create: (system: MercurySystemModel) => ScreenModel): WeakRef<object> {
  const system = new MercurySystemModel();
  system.timer.isPlayingProperty.value = true;
  const model = create(system);
  exercise(model);
  return new WeakRef<object>(model);
}

/** Screen model dropped while the (long-lived) shared system survives. */
function createAndDropScreenModelOnSharedSystem(
  system: MercurySystemModel,
  create: (system: MercurySystemModel) => ScreenModel,
): WeakRef<object> {
  const model = create(system);
  exercise(model);
  return new WeakRef<object>(model);
}

const SCREEN_MODELS: readonly { name: string; create: (system: MercurySystemModel) => ScreenModel }[] = [
  { name: "OrbitsModel", create: (system) => new OrbitsModel(system) },
  { name: "PlanetariumModel", create: (system) => new PlanetariumModel(system) },
];

describe("Screen models (no dispose(): create/drop)", () => {
  it("MercurySystemModel is collected after drop", async () => {
    const ref = createAndDropSystem();
    await forceGC(ref);
    expect(ref.deref()).toBeUndefined();
  });

  it("MercurySystemModel: repeated create/drop cycles leave no survivors", async () => {
    const refs: WeakRef<object>[] = [];
    for (let i = 0; i < 10; i++) {
      refs.push(createAndDropSystem());
    }
    await forceGC(refs);
    expect(refs.filter((r) => r.deref() !== undefined).length).toBe(0);
  });

  for (const { name, create } of SCREEN_MODELS) {
    it(`${name} is collected after drop`, async () => {
      const ref = createAndDropScreenModel(create);
      await forceGC(ref);
      expect(ref.deref()).toBeUndefined();
    });

    it(`${name} is collected after drop while the shared system stays alive`, async () => {
      const system = new MercurySystemModel();
      const ref = createAndDropScreenModelOnSharedSystem(system, create);
      await forceGC(ref);
      expect(ref.deref()).toBeUndefined();
      expect(system.timer).toBeDefined();
    });

    it(`${name}: repeated create/drop cycles leave no survivors`, async () => {
      const system = new MercurySystemModel();
      const refs: WeakRef<object>[] = [];
      for (let i = 0; i < 10; i++) {
        refs.push(createAndDropScreenModelOnSharedSystem(system, create));
      }
      await forceGC(refs);
      expect(refs.filter((r) => r.deref() !== undefined).length).toBe(0);
    });
  }
});

describeDisposalLeaks([{ name: "TimeModel", create: () => new TimeModel(), idempotentDispose: true }]);
