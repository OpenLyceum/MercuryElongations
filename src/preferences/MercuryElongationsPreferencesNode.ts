/**
 * MercuryElongationsPreferencesNode.ts
 *
 * Custom preferences UI shown in Preferences → Simulation. Currently empty —
 * add controls here when the sim gains real preferences.
 */

import { Node } from "scenerystack/scenery";
import type { Tandem } from "scenerystack/tandem";
import MercuryElongationsNamespace from "../MercuryElongationsNamespace.js";
import type { MercuryElongationsPreferencesModel } from "./MercuryElongationsPreferencesModel.js";

/** Empty conventional preferences node; the sim currently uses only framework preferences. */
export class MercuryElongationsPreferencesNode extends Node {
  public constructor(_preferencesModel: MercuryElongationsPreferencesModel, _tandem?: Tandem) {
    super();
  }
}

MercuryElongationsNamespace.register("MercuryElongationsPreferencesNode", MercuryElongationsPreferencesNode);
