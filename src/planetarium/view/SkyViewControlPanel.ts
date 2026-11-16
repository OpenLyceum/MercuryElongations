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
import { FIELD_OF_VIEW_RANGE, SKY_VIEW_CONTROL_PANEL_SETTINGS } from "../../MercuryElongationsConstants.js";
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
    const font = new PhetFont(SKY_VIEW_CONTROL_PANEL_SETTINGS.FONT_SIZE);
    const panelText = (
      stringProperty: TReadOnlyProperty<string>,
      maxWidth: number = SKY_VIEW_CONTROL_PANEL_SETTINGS.DEFAULT_MAX_WIDTH,
    ): Text => new Text(stringProperty, { font, fill: MercuryElongationsColors.textColorProperty, maxWidth });
    const buttonText = (stringProperty: TReadOnlyProperty<string>): Text =>
      new Text(stringProperty, {
        font,
        fill: LIGHT_SURFACE_TEXT_FILL,
        maxWidth: SKY_VIEW_CONTROL_PANEL_SETTINGS.BUTTON_TEXT_MAX_WIDTH,
      });

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
        spacing: SKY_VIEW_CONTROL_PANEL_SETTINGS.VIEW_MODE_GROUP_SPACING,
        accessibleName: controls.viewModeStringProperty,
        radioButtonOptions: {
          baseColor: MercuryElongationsColors.controlSurfaceColorProperty,
          xMargin: SKY_VIEW_CONTROL_PANEL_SETTINGS.VIEW_MODE_GROUP_X_MARGIN,
          yMargin: SKY_VIEW_CONTROL_PANEL_SETTINGS.VIEW_MODE_GROUP_Y_MARGIN,
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
        content: new Text(label, {
          font: new PhetFont({ size: SKY_VIEW_CONTROL_PANEL_SETTINGS.ZOOM_BUTTON_FONT_SIZE, weight: "bold" }),
          fill: LIGHT_SURFACE_TEXT_FILL,
        }),
        xMargin: SKY_VIEW_CONTROL_PANEL_SETTINGS.ZOOM_BUTTON_X_MARGIN,
        yMargin: 1,
        accessibleName,
        enabledProperty,
        fireOnHold: true,
        listener,
      });
    const fieldOfViewProperty = model.fieldOfViewDegProperty;
    const zoomRow = new HBox({
      spacing: SKY_VIEW_CONTROL_PANEL_SETTINGS.ZOOM_ROW_SPACING,
      children: [
        panelText(controls.zoomStringProperty, SKY_VIEW_CONTROL_PANEL_SETTINGS.ZOOM_PANEL_TEXT_MAX_WIDTH),
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
          {
            font,
            fill: MercuryElongationsColors.textColorProperty,
            maxWidth: SKY_VIEW_CONTROL_PANEL_SETTINGS.ZOOM_ROW_MAX_WIDTH,
          },
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
        spacing: SKY_VIEW_CONTROL_PANEL_SETTINGS.CONSTRUCTOR_SPACING,
        children: [
          panelText(controls.viewModeStringProperty, SKY_VIEW_CONTROL_PANEL_SETTINGS.VIEW_MODE_PANEL_TEXT_MAX_WIDTH),
          viewModeGroup,
          zoomRow,
          new HBox({
            spacing: SKY_VIEW_CONTROL_PANEL_SETTINGS.ITEM_4_SPACING,
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
