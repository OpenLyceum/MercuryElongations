import { Text, VBox } from "scenerystack/scenery";
import { PhetFont } from "scenerystack/scenery-phet";
import { RectangularRadioButtonGroup } from "scenerystack/sun";
import { Tandem } from "scenerystack/tandem";
import { LIGHT_SURFACE_TEXT_FILL } from "../../common/MercuryElongationsButtonOptions.js";
import { MercuryElongationsPanel } from "../../common/MercuryElongationsPanel.js";
import { StringManager } from "../../i18n/StringManager.js";
import MercuryElongationsColors from "../../MercuryElongationsColors.js";
import type { PlanetariumModel, SkyViewMode } from "../model/PlanetariumModel.js";

/** Compact in-sky selector for choosing which direction the camera follows. */
export class SkyViewControlPanel extends MercuryElongationsPanel {
  public constructor(model: PlanetariumModel) {
    const controls = StringManager.getInstance().getControls();
    const buttonText = (stringProperty: typeof controls.fixedSkyStringProperty): Text =>
      new Text(stringProperty, {
        font: new PhetFont(12),
        fill: LIGHT_SURFACE_TEXT_FILL,
        maxWidth: 82,
      });

    const group = new RectangularRadioButtonGroup<SkyViewMode>(
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

    super(
      new VBox({
        align: "left",
        spacing: 5,
        children: [
          new Text(controls.viewModeStringProperty, {
            font: new PhetFont({ size: 12, weight: "bold" }),
            fill: MercuryElongationsColors.textColorProperty,
          }),
          group,
        ],
      }),
      { xMargin: 8, yMargin: 7 },
    );
  }
}
