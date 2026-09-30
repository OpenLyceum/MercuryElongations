/**
 * PlanetariumKeyboardHelpContent.ts
 *
 * Content for the keyboard-help dialog (the "?" button in the navigation bar).
 * The focused sky view pans with the arrow keys (or WASD) and zooms with + / −; the
 * panels use standard button, checkbox, combo-box, and slider interactions.
 */

import {
  BasicActionsKeyboardHelpSection,
  KeyboardHelpSection,
  KeyboardHelpSectionRow,
  MoveDraggableItemsKeyboardHelpSection,
  SliderControlsKeyboardHelpSection,
  TextKeyNode,
  TwoColumnKeyboardHelpContent,
} from "scenerystack/scenery-phet";
import { StringManager } from "../../i18n/StringManager.js";

export class PlanetariumKeyboardHelpContent extends TwoColumnKeyboardHelpContent {
  public constructor() {
    const keyboardHelp = StringManager.getInstance().getPlanetariumA11yStrings().keyboardHelp;
    const skyViewSection = new KeyboardHelpSection(keyboardHelp.skyViewStringProperty, [
      KeyboardHelpSectionRow.labelWithIcon(keyboardHelp.zoomInStringProperty, new TextKeyNode("+")),
      KeyboardHelpSectionRow.labelWithIcon(keyboardHelp.zoomOutStringProperty, new TextKeyNode("−")),
    ]);

    super(
      [new MoveDraggableItemsKeyboardHelpSection(), skyViewSection, new SliderControlsKeyboardHelpSection()],
      [new BasicActionsKeyboardHelpSection()],
    );
  }
}
