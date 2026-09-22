/**
 * main.ts
 *
 * Entry point for the simulation. Initializes SceneryStack, creates the
 * screens, and starts the main event loop.
 *
 * !! CRITICAL IMPORT ORDER !!
 * brand.js MUST be the first import. Each module imports the next, so the import nesting is
 *
 *   main → brand → splash → assert → init
 *
 * and therefore the actual EXECUTION order (deepest import runs first) is the reverse:
 *
 *   init → assert → splash → brand → main
 *
 * SceneryStack requires this exact load order. Never reorder these imports.
 */

// brand.js MUST be first; importing it runs the whole chain (init→assert→splash→brand) before main.
import "./brand.js";

import { onReadyToLaunch, PreferencesModel, Sim } from "scenerystack/sim";
import { Tandem } from "scenerystack/tandem";
import { MercurySystemModel } from "./common/model/MercurySystemModel.js";
import { StringManager } from "./i18n/StringManager.js";
import MercuryElongationsColors from "./MercuryElongationsColors.js";
import { OrbitsScreen } from "./orbits/OrbitsScreen.js";
import { PlanetariumScreen } from "./planetarium/PlanetariumScreen.js";

onReadyToLaunch(() => {
  const stringManager = StringManager.getInstance();

  const system = new MercurySystemModel();

  const screens = [
    new PlanetariumScreen(system, {
      name: stringManager.getScreenNames().planetariumStringProperty,
      tandem: Tandem.ROOT.createTandem("planetariumScreen"),
      backgroundColorProperty: MercuryElongationsColors.backgroundColorProperty,
    }),
    new OrbitsScreen(system, {
      name: stringManager.getScreenNames().orbitsStringProperty,
      tandem: Tandem.ROOT.createTandem("orbitsScreen"),
      backgroundColorProperty: MercuryElongationsColors.backgroundColorProperty,
    }),
  ];

  const sim = new Sim(stringManager.getTitleStringProperty(), screens, {
    preferencesModel: new PreferencesModel({
      visualOptions: {
        // Adds a "Projector Mode" toggle in Preferences → Visual
        supportsProjectorMode: true,
        // Enables keyboard-navigation highlight outlines
        supportsInteractiveHighlights: true,
      },
      localizationOptions: {
        // Adds a language picker in Preferences → Language
        supportsDynamicLocale: true,
      },
    }),

    // Optional: fill in credits shown in Help → About
    credits: {
      leadDesign: "",
      softwareDevelopment: "",
      team: "",
      qualityAssurance: "",
    },
  });

  sim.start();
});
