/**
 * MercuryElongationsAccordionBox.ts
 *
 * A collapsible, pre-themed panel (Zenith-style) for control groups that learners
 * may want to fold away to free up the play area. Owns its expandedProperty so
 * {@link reset} restores the initial expanded state.
 */

import { BooleanProperty, type TReadOnlyProperty } from "scenerystack/axon";
import type { Node } from "scenerystack/scenery";
import { Text } from "scenerystack/scenery";
import { PhetFont } from "scenerystack/scenery-phet";
import { AccordionBox } from "scenerystack/sun";
import MercuryElongationsColors from "../MercuryElongationsColors.js";
import { PANEL_CORNER_RADIUS, TITLE_FONT_SIZE } from "../MercuryElongationsConstants.js";

export type MercuryElongationsAccordionBoxOptions = {
  titleProperty: TReadOnlyProperty<string>;
  /** Accessible name of the expand/collapse button. */
  accessibleName: TReadOnlyProperty<string>;
  expanded?: boolean;
  titleMaxWidth?: number;
  minWidth?: number;
};

export class MercuryElongationsAccordionBox extends AccordionBox {
  private readonly ownExpandedProperty: BooleanProperty;

  public constructor(content: Node, options: MercuryElongationsAccordionBoxOptions) {
    const expandedProperty = new BooleanProperty(options.expanded ?? true);
    super(content, {
      titleNode: new Text(options.titleProperty, {
        font: new PhetFont({ size: TITLE_FONT_SIZE - 3, weight: "bold" }),
        fill: MercuryElongationsColors.textColorProperty,
        maxWidth: options.titleMaxWidth ?? 180,
      }),
      expandedProperty,
      resize: true,
      useExpandedBoundsWhenCollapsed: false,
      useContentWidthWhenCollapsed: false,
      cornerRadius: PANEL_CORNER_RADIUS,
      fill: MercuryElongationsColors.panelBackgroundColorProperty,
      stroke: MercuryElongationsColors.panelBorderColorProperty,
      contentXMargin: 10,
      contentYMargin: 8,
      contentYSpacing: 6,
      contentAlign: "left",
      titleAlignX: "left",
      titleXSpacing: 8,
      buttonXMargin: 8,
      buttonYMargin: 6,
      showTitleWhenExpanded: true,
      titleBarOptions: { fill: MercuryElongationsColors.panelBackgroundColorProperty },
      expandCollapseButtonOptions: { accessibleName: options.accessibleName },
      ...(options.minWidth === undefined ? {} : { minWidth: options.minWidth }),
    });
    this.ownExpandedProperty = expandedProperty;
  }

  public override reset(): void {
    super.reset();
    this.ownExpandedProperty.reset();
  }
}
