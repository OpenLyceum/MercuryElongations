/**
 * OrbitsKeyboardHelpContent.ts
 *
 * Content for the keyboard-help dialog (the "?" button in the navigation bar).
 * Number spinners and playback controls use standard button/Tab interactions,
 * so the shared basic-actions section covers the screen.
 */

import { BasicActionsKeyboardHelpSection, TwoColumnKeyboardHelpContent } from "scenerystack/scenery-phet";

export class OrbitsKeyboardHelpContent extends TwoColumnKeyboardHelpContent {
  public constructor() {
    const leftColumn = [new BasicActionsKeyboardHelpSection()];

    const rightColumn: never[] = [];

    super(leftColumn, rightColumn);
  }
}
