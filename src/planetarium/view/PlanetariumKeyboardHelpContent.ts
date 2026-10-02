/**
 * PlanetariumKeyboardHelpContent.ts
 *
 * Content for the keyboard-help dialog (the "?" button in the navigation bar).
 * The focused sky view pans with the arrow keys (or WASD) and zooms with + / −; the
 * panels use standard button, checkbox, combo-box, and slider interactions.
 */

import {
  BasicActionsKeyboardHelpSection,
  ComboBoxKeyboardHelpSection,
  KeyboardHelpSection,
  KeyboardHelpSectionRow,
  MoveDraggableItemsKeyboardHelpSection,
  SliderControlsKeyboardHelpSection,
  TextKeyNode,
  TimeControlsKeyboardHelpSection,
  TwoColumnKeyboardHelpContent,
} from "scenerystack/scenery-phet";
import MercuryElongationsHotkeyData from "../../common/MercuryElongationsHotkeyData.js";
import { StringManager } from "../../i18n/StringManager.js";

export class PlanetariumKeyboardHelpContent extends TwoColumnKeyboardHelpContent {
  public constructor() {
    const keyboardHelp = StringManager.getInstance().getPlanetariumA11yStrings().keyboardHelp;

    // Rows from the zoom listener's HotkeyData; icons given because plus and
    // minus have no entry in KeyboardHelpIconFactory's key map.
    const skyViewSection = new KeyboardHelpSection(keyboardHelp.skyViewStringProperty, [
      KeyboardHelpSectionRow.fromHotkeyData(MercuryElongationsHotkeyData.ZOOM_IN, { icon: new TextKeyNode("+") }),
      KeyboardHelpSectionRow.fromHotkeyData(MercuryElongationsHotkeyData.ZOOM_OUT, { icon: new TextKeyNode("−") }),
    ]);

    super(
      [new MoveDraggableItemsKeyboardHelpSection(), skyViewSection, new SliderControlsKeyboardHelpSection()],
      [
        new TimeControlsKeyboardHelpSection(),
        new ComboBoxKeyboardHelpSection(),
        new BasicActionsKeyboardHelpSection({ withCheckboxContent: true }),
      ],
    );
  }
}
