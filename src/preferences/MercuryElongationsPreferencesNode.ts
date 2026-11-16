import { MERCURY_ELONGATIONS_PREFERENCES_NODE_SETTINGS } from "../MercuryElongationsConstants.js";
/**
 * MercuryElongationsPreferencesNode.ts
 *
 * Custom preferences UI shown in Preferences → Simulation. Currently empty —
 * add controls here when the sim gains real preferences.
 */

import { Text, VBox } from "scenerystack/scenery";
import { PhetFont } from "scenerystack/scenery-phet";
import type { Tandem } from "scenerystack/tandem";
import { StringManager } from "../i18n/StringManager.js";
import MercuryElongationsColors from "../MercuryElongationsColors.js";
import MercuryElongationsNamespace from "../MercuryElongationsNamespace.js";
import type { MercuryElongationsPreferencesModel } from "./MercuryElongationsPreferencesModel.js";

/** Preferences dialog content sits on a light background regardless of color profile. */
const PREFERENCES_TEXT_FILL = MercuryElongationsColors.controlSurfaceTextColorProperty;

export class MercuryElongationsPreferencesNode extends VBox {
  public constructor(_preferencesModel: MercuryElongationsPreferencesModel, _tandem?: Tandem) {
    const prefStrings = StringManager.getInstance().getPreferences();

    const header = new Text(prefStrings.titleStringProperty, {
      font: new PhetFont({ size: MERCURY_ELONGATIONS_PREFERENCES_NODE_SETTINGS.HEADER_FONT_SIZE, weight: "bold" }),
      fill: PREFERENCES_TEXT_FILL,
    });

    super({
      align: "left",
      spacing: MERCURY_ELONGATIONS_PREFERENCES_NODE_SETTINGS.CONSTRUCTOR_SPACING,
      children: [header],
    });
  }
}

MercuryElongationsNamespace.register("MercuryElongationsPreferencesNode", MercuryElongationsPreferencesNode);
