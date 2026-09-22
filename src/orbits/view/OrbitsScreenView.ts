import { type EmptySelfOptions, optionize } from "scenerystack/phet-core";
import { Node, Rectangle } from "scenerystack/scenery";
import { ResetAllButton } from "scenerystack/scenery-phet";
import { ScreenView, type ScreenViewOptions } from "scenerystack/sim";
import { FLAT_RESET_ALL_BUTTON_OPTIONS } from "../../common/MercuryElongationsButtonOptions.js";
import { TimeControlPanel } from "../../common/view/TimeControlPanel.js";
import MercuryElongationsColors from "../../MercuryElongationsColors.js";
import { ORBIT_VIEW_HEIGHT, ORBIT_VIEW_WIDTH, SCREEN_VIEW_MARGIN } from "../../MercuryElongationsConstants.js";
import type { OrbitsModel } from "../model/OrbitsModel.js";
import { MercuryOrbitNode } from "./MercuryOrbitNode.js";
import { OrbitsScreenSummaryContent } from "./OrbitsScreenSummaryContent.js";

export type OrbitsScreenViewOptions = ScreenViewOptions;

export class OrbitsScreenView extends ScreenView {
  private readonly model: OrbitsModel;

  public constructor(model: OrbitsModel, providedOptions?: OrbitsScreenViewOptions) {
    const options = optionize<OrbitsScreenViewOptions, EmptySelfOptions, ScreenViewOptions>()(
      { screenSummaryContent: new OrbitsScreenSummaryContent(model) },
      providedOptions,
    );
    super(options);
    this.model = model;

    this.addChild(
      new Rectangle(0, 0, this.layoutBounds.width, this.layoutBounds.height, {
        fill: MercuryElongationsColors.backgroundColorProperty,
      }),
    );

    const orbits = new MercuryOrbitNode(model.system, ORBIT_VIEW_WIDTH, ORBIT_VIEW_HEIGHT);
    orbits.left = SCREEN_VIEW_MARGIN;
    orbits.top = SCREEN_VIEW_MARGIN;
    this.addChild(orbits);

    const timePanel = new TimeControlPanel(model.system);
    timePanel.right = this.layoutBounds.maxX - SCREEN_VIEW_MARGIN;
    timePanel.top = SCREEN_VIEW_MARGIN;
    this.addChild(timePanel);

    const resetAllButton = new ResetAllButton({
      ...FLAT_RESET_ALL_BUTTON_OPTIONS,
      listener: () => model.reset(),
      right: this.layoutBounds.maxX - SCREEN_VIEW_MARGIN,
      bottom: this.layoutBounds.maxY - SCREEN_VIEW_MARGIN,
    });
    this.addChild(resetAllButton);
    this.addChild(new Node({ pdomOrder: [timePanel, resetAllButton] }));
  }

  public override step(dt: number): void {
    this.model.step(dt);
  }
}
