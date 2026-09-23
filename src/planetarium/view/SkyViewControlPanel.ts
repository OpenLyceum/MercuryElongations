import { DerivedProperty, PatternStringProperty, type TReadOnlyProperty } from "scenerystack/axon";
import { HBox, Text, VBox } from "scenerystack/scenery";
import { PhetFont } from "scenerystack/scenery-phet";
import { Checkbox, RectangularPushButton, RectangularRadioButtonGroup } from "scenerystack/sun";
import { Tandem } from "scenerystack/tandem";
import { MercuryElongationsAccordionBox } from "../../common/MercuryElongationsAccordionBox.js";
import {
  FLAT_PANEL_PUSH_BUTTON_OPTIONS,
  LIGHT_SURFACE_TEXT_FILL,
} from "../../common/MercuryElongationsButtonOptions.js";
import { MERCURY_ELONGATIONS_CHECKBOX_OPTIONS } from "../../common/MercuryElongationsControlOptions.js";
import { StringManager } from "../../i18n/StringManager.js";
import MercuryElongationsColors from "../../MercuryElongationsColors.js";
import { FIELD_OF_VIEW_RANGE } from "../../MercuryElongationsConstants.js";
import type { PlanetariumModel, SkyViewMode } from "../model/PlanetariumModel.js";

/**
 * Collapsible in-sky "View" panel: which direction the camera follows, zoom, and
 * the atmosphere / cardinal-point display toggles (after Zenith's display panel).
 */
export class SkyViewControlPanel extends MercuryElongationsAccordionBox {
  public constructor(model: PlanetariumModel) {
    const strings = StringManager.getInstance();
    const controls = strings.getControls();
    const a11y = strings.getPlanetariumA11yStrings().controls;
    const font = new PhetFont(12);
    const panelText = (stringProperty: TReadOnlyProperty<string>, maxWidth = 110): Text =>
      new Text(stringProperty, { font, fill: MercuryElongationsColors.textColorProperty, maxWidth });
    const buttonText = (stringProperty: TReadOnlyProperty<string>): Text =>
      new Text(stringProperty, { font, fill: LIGHT_SURFACE_TEXT_FILL, maxWidth: 82 });

    const viewModeGroup = new RectangularRadioButtonGroup<SkyViewMode>(
      model.skyViewModeProperty,
      [
        { value: "fixed", createNode: () => buttonText(controls.fixedSkyStringProperty) },
        { value: "sun", createNode: () => buttonText(controls.followSunStringProperty) },
        { value: "mercury", createNode: () => buttonText(controls.followMercuryStringProperty) },
      ],
      {
        tandem: Tandem.OPT_OUT,
        orientation: "horizontal",
        spacing: 4,
        accessibleName: controls.viewModeStringProperty,
        radioButtonOptions: {
          baseColor: MercuryElongationsColors.controlSurfaceColorProperty,
          xMargin: 8,
          yMargin: 5,
        },
      },
    );

    const zoomButton = (
      label: string,
      accessibleName: TReadOnlyProperty<string>,
      enabledProperty: TReadOnlyProperty<boolean>,
      listener: () => void,
    ): RectangularPushButton =>
      new RectangularPushButton({
        ...FLAT_PANEL_PUSH_BUTTON_OPTIONS,
        content: new Text(label, { font: new PhetFont({ size: 14, weight: "bold" }), fill: LIGHT_SURFACE_TEXT_FILL }),
        xMargin: 9,
        yMargin: 1,
        accessibleName,
        enabledProperty,
        fireOnHold: true,
        listener,
      });
    const fieldOfViewProperty = model.fieldOfViewDegProperty;
    const zoomRow = new HBox({
      spacing: 6,
      children: [
        panelText(controls.zoomStringProperty, 60),
        zoomButton(
          "−",
          a11y.zoomOutStringProperty,
          new DerivedProperty([fieldOfViewProperty], (fov) => fov < FIELD_OF_VIEW_RANGE.max),
          () => model.zoomOut(),
        ),
        new Text(
          new PatternStringProperty(
            strings.getPatterns().fieldOfViewStringProperty,
            { angle: fieldOfViewProperty },
            { decimalPlaces: 0 },
          ),
          { font, fill: MercuryElongationsColors.textColorProperty, maxWidth: 44 },
        ),
        zoomButton(
          "+",
          a11y.zoomInStringProperty,
          new DerivedProperty([fieldOfViewProperty], (fov) => fov > FIELD_OF_VIEW_RANGE.min),
          () => model.zoomIn(),
        ),
      ],
    });

    const checkbox = (
      property: typeof model.showAtmosphereProperty,
      labelProperty: TReadOnlyProperty<string>,
      accessibleName: TReadOnlyProperty<string>,
    ): Checkbox =>
      new Checkbox(property, panelText(labelProperty), {
        ...MERCURY_ELONGATIONS_CHECKBOX_OPTIONS,
        accessibleName,
      });

    super(
      new VBox({
        align: "left",
        spacing: 7,
        children: [
          panelText(controls.viewModeStringProperty, 200),
          viewModeGroup,
          zoomRow,
          new HBox({
            spacing: 14,
            children: [
              checkbox(
                model.showAtmosphereProperty,
                controls.showAtmosphereStringProperty,
                a11y.showAtmosphereStringProperty,
              ),
              checkbox(
                model.showCardinalsProperty,
                controls.showCardinalsStringProperty,
                a11y.showCardinalsStringProperty,
              ),
            ],
          }),
        ],
      }),
      {
        titleProperty: strings.getLabels().viewStringProperty,
        accessibleName: a11y.viewPanelStringProperty,
        titleMaxWidth: 200,
      },
    );
  }
}
