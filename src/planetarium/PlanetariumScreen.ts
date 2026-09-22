/**
 * PlanetariumScreen.ts
 *
 * The top-level Screen component. It wires together the model and view
 * factories and passes screen-level options (name, background color, tandem)
 * to the parent Screen class.
 *
 * Registered in the screens array in src/main.ts. Its home-screen and navigation-bar
 * icons come from createPlanetariumIcon() in src/common/MercuryElongationsScreenIcons.ts
 * (see doc/multi-screen.md).
 */
import { type EmptySelfOptions, optionize } from "scenerystack/phet-core";
import type { ScreenOptions } from "scenerystack/sim";
import { Screen } from "scenerystack/sim";
import type { Tandem } from "scenerystack/tandem";
import { createPlanetariumIcon } from "../common/MercuryElongationsScreenIcons.js";
import type { MercurySystemModel } from "../common/model/MercurySystemModel.js";
import MercuryElongationsColors from "../MercuryElongationsColors.js";
import { PlanetariumModel } from "./model/PlanetariumModel.js";
import { PlanetariumKeyboardHelpContent } from "./view/PlanetariumKeyboardHelpContent.js";
import { PlanetariumScreenView } from "./view/PlanetariumScreenView.js";

// Require tandem to be explicit — accidental omission would break PhET-iO.
type PlanetariumScreenOptions = ScreenOptions & { tandem: Tandem };

export class PlanetariumScreen extends Screen<PlanetariumModel, PlanetariumScreenView> {
  public constructor(system: MercurySystemModel, options: PlanetariumScreenOptions) {
    super(
      // Model factory — called once when the screen is first shown
      () => new PlanetariumModel(system),
      // View factory — receives the model instance
      (model) =>
        new PlanetariumScreenView(model, {
          tandem: options.tandem.createTandem("view"),
        }),
      optionize<PlanetariumScreenOptions, EmptySelfOptions, ScreenOptions>()(
        {
          backgroundColorProperty: MercuryElongationsColors.backgroundColorProperty,
          createKeyboardHelpNode: () => new PlanetariumKeyboardHelpContent(),
          homeScreenIcon: createPlanetariumIcon(),
          navigationBarIcon: createPlanetariumIcon(),
        },
        options,
      ),
    );
  }
}
