import { type EmptySelfOptions, optionize } from "scenerystack/phet-core";
import { Node, Rectangle } from "scenerystack/scenery";
import { ResetAllButton } from "scenerystack/scenery-phet";
import { ScreenView, type ScreenViewOptions } from "scenerystack/sim";
import { FLAT_RESET_ALL_BUTTON_OPTIONS } from "../../common/MercuryElongationsButtonOptions.js";
import { TimeControlPanel } from "../../common/view/TimeControlPanel.js";
import MercuryElongationsColors from "../../MercuryElongationsColors.js";
import { PLANETARIUM_HEIGHT, PLANETARIUM_WIDTH, SCREEN_VIEW_MARGIN } from "../../MercuryElongationsConstants.js";
import type { PlanetariumModel } from "../model/PlanetariumModel.js";
import { MercurySkyNode } from "./MercurySkyNode.js";
import { PlanetariumScreenSummaryContent } from "./PlanetariumScreenSummaryContent.js";

export type PlanetariumScreenViewOptions = ScreenViewOptions;

export class PlanetariumScreenView extends ScreenView {
  private readonly model: PlanetariumModel;

  public constructor(model: PlanetariumModel, providedOptions?: PlanetariumScreenViewOptions) {
    const options = optionize<PlanetariumScreenViewOptions, EmptySelfOptions, ScreenViewOptions>()(
      { screenSummaryContent: new PlanetariumScreenSummaryContent(model) },
      providedOptions,
    );
    super(options);
    this.model = model;

    this.addChild(
      new Rectangle(0, 0, this.layoutBounds.width, this.layoutBounds.height, {
        fill: MercuryElongationsColors.backgroundColorProperty,
      }),
    );

    const sky = new MercurySkyNode(model.system, PLANETARIUM_WIDTH, PLANETARIUM_HEIGHT);
    sky.left = SCREEN_VIEW_MARGIN;
    sky.top = SCREEN_VIEW_MARGIN;
    this.addChild(sky);

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
