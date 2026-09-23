/**
 * ObserverLocationPanel.ts
 *
 * Collapsible "Observer Location" panel (after Zenith): a preset combo box, a
 * world map with a draggable observer pin, and latitude / longitude sliders. Picking a preset moves the observer; moving a
 * slider off a preset turns the combo to "Custom".
 */

import { type Node, Text, VBox } from "scenerystack/scenery";
import { NumberControl, PhetFont } from "scenerystack/scenery-phet";
import { ComboBox } from "scenerystack/sun";
import { StringManager } from "../../i18n/StringManager.js";
import MercuryElongationsColors from "../../MercuryElongationsColors.js";
import { CONTROL_FONT_SIZE, LATITUDE_RANGE, LONGITUDE_RANGE } from "../../MercuryElongationsConstants.js";
import { MercuryElongationsAccordionBox } from "../MercuryElongationsAccordionBox.js";
import { LIGHT_SURFACE_TEXT_FILL, MERCURY_ELONGATIONS_COMBO_BOX_OPTIONS } from "../MercuryElongationsButtonOptions.js";
import { MERCURY_ELONGATIONS_NUMBER_CONTROL_OPTIONS } from "../MercuryElongationsControlOptions.js";
import type { LocationPreset } from "../model/LocationPreset.js";
import type { MercurySystemModel } from "../model/MercurySystemModel.js";
import { ObserverLocationNode } from "./ObserverLocationNode.js";
import { locationPresetNameProperty } from "./observerLocationName.js";

const PRESETS: readonly LocationPreset[] = [
  "berea",
  "greenwich",
  "equator",
  "northPole",
  "southPole",
  "sydney",
  "custom",
];

export class ObserverLocationPanel extends MercuryElongationsAccordionBox {
  public constructor(model: MercurySystemModel, listParent: Node, width: number) {
    const strings = StringManager.getInstance();
    const controls = strings.getControls();
    const labels = strings.getLabels();
    const a11y = strings.getCommonA11yStrings().controls;
    const font = new PhetFont(CONTROL_FONT_SIZE);

    const combo = new ComboBox(
      model.locationPresetProperty,
      PRESETS.map((preset) => ({
        value: preset,
        createNode: () =>
          new Text(locationPresetNameProperty(preset), { font, fill: LIGHT_SURFACE_TEXT_FILL, maxWidth: width - 70 }),
      })),
      listParent,
      {
        ...MERCURY_ELONGATIONS_COMBO_BOX_OPTIONS,
        xMargin: 8,
        yMargin: 4,
        accessibleName: a11y.locationStringProperty,
      },
    );

    const coordinateControl = (
      titleProperty: typeof controls.latitudeStringProperty,
      property: typeof model.latitudeProperty,
      range: typeof LATITUDE_RANGE,
      accessibleName: typeof a11y.latitudeStringProperty,
    ): NumberControl =>
      new NumberControl(titleProperty, property, range, {
        ...MERCURY_ELONGATIONS_NUMBER_CONTROL_OPTIONS,
        delta: 0.5,
        numberDisplayOptions: { decimalPlaces: 1, valuePattern: "{{value}}°", maxWidth: 60 },
        titleNodeOptions: { font, fill: MercuryElongationsColors.textColorProperty, maxWidth: width - 100 },
        sliderOptions: {
          ...MERCURY_ELONGATIONS_NUMBER_CONTROL_OPTIONS.sliderOptions,
          constrainValue: (value: number) => Math.round(value * 2) / 2,
        },
        accessibleName,
      });

    super(
      new VBox({
        align: "left",
        spacing: 6,
        children: [
          combo,
          new ObserverLocationNode(model.latitudeProperty, model.longitudeProperty, {
            mapWidth: width - 20,
            accessibleName: a11y.locationMapStringProperty,
            accessibleHelpText: a11y.locationMapHelpStringProperty,
          }),
          coordinateControl(
            controls.latitudeStringProperty,
            model.latitudeProperty,
            LATITUDE_RANGE,
            a11y.latitudeStringProperty,
          ),
          coordinateControl(
            controls.longitudeStringProperty,
            model.longitudeProperty,
            LONGITUDE_RANGE,
            a11y.longitudeStringProperty,
          ),
        ],
      }),
      {
        titleProperty: labels.observerLocationStringProperty,
        accessibleName: a11y.locationPanelStringProperty,
        expanded: false,
        titleMaxWidth: width - 50,
        minWidth: width,
      },
    );
  }
}
