/**
 * MercuryElongationsHotkeyData.ts
 *
 * Key bindings that no stock keyboard-help section covers. The sky view's zoom
 * KeyboardListener and its keyboard-help rows both read these, so the keys the
 * view handles and the keys the dialog shows cannot drift apart.
 */

import { HotkeyData } from "scenerystack/scenery";
import { StringManager } from "../i18n/StringManager.js";

const REPO_NAME = "mercury-elongations";
const keyboardHelp = StringManager.getInstance().getPlanetariumA11yStrings().keyboardHelp;

const MercuryElongationsHotkeyData = {
  ZOOM_IN: new HotkeyData({
    keys: ["equals", "plus"],
    repoName: REPO_NAME,
    keyboardHelpDialogLabelStringProperty: keyboardHelp.zoomInStringProperty,
  }),

  ZOOM_OUT: new HotkeyData({
    keys: ["minus"],
    repoName: REPO_NAME,
    keyboardHelpDialogLabelStringProperty: keyboardHelp.zoomOutStringProperty,
  }),
} as const;

export default MercuryElongationsHotkeyData;
