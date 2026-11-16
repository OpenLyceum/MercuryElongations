import { MERCURY_ELONGATIONS_CONTROL_OPTIONS_SETTINGS } from "../MercuryElongationsConstants.js";
/**
 * MercuryElongationsControlOptions.ts
 *
 * Shared sizing and layout for panel controls (sliders, checkboxes, NumberControls).
 * Import these instead of repeating scale / track-size values in each screen view.
 *
 * Template-owned toolkit: each sim uses only some of these, so every export is tagged
 * `@public` to tell dead-code checkers (knip) that an unused one is not dead code.
 */

import { Dimension2 } from "scenerystack/dot";
import { HBox, type Node } from "scenerystack/scenery";
import { NumberControl } from "scenerystack/scenery-phet";
import type { CheckboxOptions, HSliderOptions } from "scenerystack/sun";
import MercuryElongationsColors from "../MercuryElongationsColors.js";
import { FLAT_RECTANGULAR_BUTTON_OPTIONS } from "./MercuryElongationsButtonOptions.js";

const SLIDER_THUMB_SIZE = new Dimension2(
  MERCURY_ELONGATIONS_CONTROL_OPTIONS_SETTINGS.SLIDER_THUMB_SIZE_WIDTH,
  MERCURY_ELONGATIONS_CONTROL_OPTIONS_SETTINGS.SLIDER_THUMB_SIZE_HEIGHT,
);
const STANDALONE_SLIDER_TRACK_SIZE = new Dimension2(
  MERCURY_ELONGATIONS_CONTROL_OPTIONS_SETTINGS.STANDALONE_SLIDER_TRACK_SIZE_WIDTH,
  MERCURY_ELONGATIONS_CONTROL_OPTIONS_SETTINGS.STANDALONE_SLIDER_TRACK_SIZE_HEIGHT,
);
const NUMBER_CONTROL_SLIDER_TRACK_SIZE = new Dimension2(
  MERCURY_ELONGATIONS_CONTROL_OPTIONS_SETTINGS.NUMBER_CONTROL_SLIDER_TRACK_SIZE_WIDTH,
  MERCURY_ELONGATIONS_CONTROL_OPTIONS_SETTINGS.NUMBER_CONTROL_SLIDER_TRACK_SIZE_HEIGHT,
);
const CHECKBOX_BOX_WIDTH: number = MERCURY_ELONGATIONS_CONTROL_OPTIONS_SETTINGS.CHECKBOX_BOX_WIDTH;

/** Options for standalone HSlider instances in control panels. @public */
export const MERCURY_ELONGATIONS_SLIDER_OPTIONS = {
  trackSize: STANDALONE_SLIDER_TRACK_SIZE,
  thumbSize: SLIDER_THUMB_SIZE,
  trackFillEnabled: MercuryElongationsColors.textColorProperty,
} satisfies HSliderOptions;

/** Base NumberControl options; spread into each instance and add titleNodeOptions as needed. @public */
export const MERCURY_ELONGATIONS_NUMBER_CONTROL_OPTIONS = {
  arrowButtonOptions: {
    ...FLAT_RECTANGULAR_BUTTON_OPTIONS,
    scale: MERCURY_ELONGATIONS_CONTROL_OPTIONS_SETTINGS.MERCURY_ELONGATIONS_NUMBER_CONTROL_OPTIONS_SCALE,
  },
  layoutFunction: NumberControl.createLayoutFunction4({
    sliderPadding:
      MERCURY_ELONGATIONS_CONTROL_OPTIONS_SETTINGS.MERCURY_ELONGATIONS_NUMBER_CONTROL_OPTIONS_SLIDER_PADDING,
    arrowButtonSpacing:
      MERCURY_ELONGATIONS_CONTROL_OPTIONS_SETTINGS.MERCURY_ELONGATIONS_NUMBER_CONTROL_OPTIONS_ARROW_BUTTON_SPACING,
    verticalSpacing:
      MERCURY_ELONGATIONS_CONTROL_OPTIONS_SETTINGS.MERCURY_ELONGATIONS_NUMBER_CONTROL_OPTIONS_VERTICAL_SPACING,
  }),
  sliderOptions: {
    trackSize: NUMBER_CONTROL_SLIDER_TRACK_SIZE,
    thumbSize: SLIDER_THUMB_SIZE,
    trackFillEnabled: MercuryElongationsColors.textColorProperty,
  },
};

export const COMPACT_SPINNER_NUMBER_CONTROL_OPTIONS = {
  arrowButtonOptions: {
    ...FLAT_RECTANGULAR_BUTTON_OPTIONS,
    scale: MERCURY_ELONGATIONS_CONTROL_OPTIONS_SETTINGS.COMPACT_SPINNER_NUMBER_CONTROL_OPTIONS_SCALE,
  },
  layoutFunction: (
    titleNode: Node,
    numberDisplay: Node,
    _slider: Node,
    decrementButton: Node | null,
    incrementButton: Node | null,
  ): Node =>
    new HBox({
      spacing: MERCURY_ELONGATIONS_CONTROL_OPTIONS_SETTINGS.COMPACT_SPINNER_NUMBER_CONTROL_OPTIONS_SPACING,
      align: "center",
      children: [
        titleNode,
        ...(decrementButton ? [decrementButton] : []),
        numberDisplay,
        ...(incrementButton ? [incrementButton] : []),
      ],
    }),
  sliderOptions: {
    trackSize: NUMBER_CONTROL_SLIDER_TRACK_SIZE,
    thumbSize: SLIDER_THUMB_SIZE,
    visible: false,
    pickable: false,
  },
};

/**
 * Themed checkbox chrome on dark panel backgrounds.
 *
 * The box fill matches the panel so the control reads as part of the panel, and
 * the tick/border use {@link MercuryElongationsColors.textColorProperty} (near-white in default
 * mode). Do not use {@link MercuryElongationsColors.controlSurfaceColorProperty} here — that
 * colour is for white chrome (push buttons, combo lists, Preferences).
 *
 * @public
 */
export const MERCURY_ELONGATIONS_CHECKBOX_OPTIONS = {
  boxWidth: CHECKBOX_BOX_WIDTH,
  spacing: MERCURY_ELONGATIONS_CONTROL_OPTIONS_SETTINGS.MERCURY_ELONGATIONS_CHECKBOX_OPTIONS_SPACING,
  checkboxColor: MercuryElongationsColors.textColorProperty,
  checkboxColorBackground: MercuryElongationsColors.panelBackgroundColorProperty,
} satisfies CheckboxOptions;
