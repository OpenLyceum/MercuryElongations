/**
 * MercuryElongationsControlOptions.ts
 *
 * Shared sizing and layout for panel controls (sliders, checkboxes, NumberControls).
 * Import these instead of repeating scale / track-size values in each screen view.
 */

import { Dimension2 } from "scenerystack/dot";
import { HBox, type Node } from "scenerystack/scenery";
import { NumberControl } from "scenerystack/scenery-phet";
import type { CheckboxOptions, HSliderOptions } from "scenerystack/sun";
import MercuryElongationsColors from "../MercuryElongationsColors.js";
import { FLAT_RECTANGULAR_BUTTON_OPTIONS } from "./MercuryElongationsButtonOptions.js";

const SLIDER_THUMB_SIZE = new Dimension2(12, 22);
const STANDALONE_SLIDER_TRACK_SIZE = new Dimension2(150, 3);
const NUMBER_CONTROL_SLIDER_TRACK_SIZE = new Dimension2(110, 3);
const CHECKBOX_BOX_WIDTH = 16;

/** Options for standalone HSlider instances in control panels. */
export const MERCURY_ELONGATIONS_SLIDER_OPTIONS = {
  trackSize: STANDALONE_SLIDER_TRACK_SIZE,
  thumbSize: SLIDER_THUMB_SIZE,
  trackFillEnabled: MercuryElongationsColors.textColorProperty,
} satisfies HSliderOptions;

/** Base NumberControl options; spread into each instance and add titleNodeOptions as needed. */
export const MERCURY_ELONGATIONS_NUMBER_CONTROL_OPTIONS = {
  arrowButtonOptions: { ...FLAT_RECTANGULAR_BUTTON_OPTIONS, scale: 0.75 },
  layoutFunction: NumberControl.createLayoutFunction4({
    sliderPadding: 4,
    arrowButtonSpacing: 3,
    verticalSpacing: 4,
  }),
  sliderOptions: {
    trackSize: NUMBER_CONTROL_SLIDER_TRACK_SIZE,
    thumbSize: SLIDER_THUMB_SIZE,
    trackFillEnabled: MercuryElongationsColors.textColorProperty,
  },
};

export const COMPACT_SPINNER_NUMBER_CONTROL_OPTIONS = {
  arrowButtonOptions: { ...FLAT_RECTANGULAR_BUTTON_OPTIONS, scale: 0.62 },
  layoutFunction: (
    titleNode: Node,
    numberDisplay: Node,
    _slider: Node,
    decrementButton: Node | null,
    incrementButton: Node | null,
  ): Node =>
    new HBox({
      spacing: 3,
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
 */
export const MERCURY_ELONGATIONS_CHECKBOX_OPTIONS = {
  boxWidth: CHECKBOX_BOX_WIDTH,
  spacing: 4,
  checkboxColor: MercuryElongationsColors.textColorProperty,
  checkboxColorBackground: MercuryElongationsColors.panelBackgroundColorProperty,
} satisfies CheckboxOptions;
