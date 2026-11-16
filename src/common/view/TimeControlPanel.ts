import { TIME_CONTROL_PANEL_SETTINGS } from "../../MercuryElongationsConstants.js";
/**
 * TimeControlPanel.ts
 *
 * Shared time panel (after Zenith's): local-date spinners, ±1 solar-day and
 * ±1 sidereal-day steps, a play/pause button flanked by slower/faster buttons
 * whose rate ladder crosses zero into reverse, local-solar and UTC readouts, and
 * Mercury's current elongation with jumps between greatest elongations.
 */

import { DerivedProperty, PatternStringProperty, type TReadOnlyProperty } from "scenerystack/axon";
import { Shape } from "scenerystack/kite";
import { StringUtils } from "scenerystack/phetcommon";
import { GridBox, HBox, Path, Text, VBox } from "scenerystack/scenery";
import { PhetFont, PlayPauseButton } from "scenerystack/scenery-phet";
import { ButtonNode, RectangularPushButton } from "scenerystack/sun";
import { StringManager } from "../../i18n/StringManager.js";
import MercuryElongationsColors from "../../MercuryElongationsColors.js";
import {
  CONTROL_FONT_SIZE,
  CONTROL_PANEL_WIDTH,
  PANEL_CONTENT_SPACING,
  TITLE_FONT_SIZE,
} from "../../MercuryElongationsConstants.js";
import { formatLocalDateTime, formatUtcDateTime } from "../astronomy/dateTime.js";
import { FLAT_PANEL_PUSH_BUTTON_OPTIONS, LIGHT_SURFACE_TEXT_FILL } from "../MercuryElongationsButtonOptions.js";
import { MercuryElongationsPanel } from "../MercuryElongationsPanel.js";
import type { MercurySystemModel } from "../model/MercurySystemModel.js";
import { LocalDateTimeControl } from "./LocalDateTimeControl.js";
import { createObserverLocationNameProperty } from "./observerLocationName.js";

/** Double-triangle glyph: points right for fast-forward, left (dir = -1) for rewind. */
const doubleTriangleShape = (dir: 1 | -1): Shape => {
  const w = 6;
  const h = 12;
  const shape = new Shape();
  for (const x of [0, dir * w]) {
    shape
      .moveTo(x, 0)
      .lineTo(x + dir * w, h / 2)
      .lineTo(x, h)
      .close();
  }
  return shape;
};

/** Rates under a day per second read better in hours ("6 hours/second"). */
const formatMagnitude = (value: number): string => {
  const rounded = Math.round(value * 100) / 100;
  return Number.isInteger(rounded) ? `${rounded}` : StringUtils.toFixedLTR(rounded, 2);
};

export class TimeControlPanel extends MercuryElongationsPanel {
  public constructor(model: MercurySystemModel) {
    const strings = StringManager.getInstance();
    const labels = strings.getLabels();
    const controls = strings.getControls();
    const patterns = strings.getPatterns();
    const a11y = strings.getCommonA11yStrings().controls;
    const font = new PhetFont(CONTROL_FONT_SIZE);
    const textOptions = {
      font,
      fill: MercuryElongationsColors.textColorProperty,
      maxWidth: CONTROL_PANEL_WIDTH - TIME_CONTROL_PANEL_SETTINGS.TEXT_OPTIONS_MAX_WIDTH_OFFSET,
    };

    const localTimeProperty = new PatternStringProperty(patterns.localSolarTimeStringProperty, {
      time: new DerivedProperty([model.civilTimeMsProperty, model.longitudeProperty], formatLocalDateTime),
    });
    const utcTimeProperty = new PatternStringProperty(patterns.utcTimeStringProperty, {
      time: new DerivedProperty([model.civilTimeMsProperty], formatUtcDateTime),
    });
    const directionProperty = new DerivedProperty(
      [model.snapshotProperty, labels.eastStringProperty, labels.westStringProperty],
      (snapshot, east, west) => (snapshot.direction === "east" ? east : west),
    );
    const visibilityProperty = new DerivedProperty(
      [model.snapshotProperty, labels.morningStringProperty, labels.eveningStringProperty],
      (snapshot, morning, evening) => (snapshot.visibility === "morning" ? morning : evening),
    );
    const elongationProperty = new PatternStringProperty(
      patterns.elongationStringProperty,
      {
        angle: new DerivedProperty([model.snapshotProperty], (snapshot) => snapshot.elongationDeg),
        direction: directionProperty,
        visibility: visibilityProperty,
      },
      { decimalPlaces: TIME_CONTROL_PANEL_SETTINGS.ELONGATION_DECIMAL_PLACES },
    );
    const rateProperty: TReadOnlyProperty<string> = new DerivedProperty(
      [
        model.timeRateDaysPerSecondProperty,
        patterns.rateDaysStringProperty,
        patterns.rateOneDayStringProperty,
        patterns.rateHoursStringProperty,
        patterns.rateOneHourStringProperty,
      ],
      (rate, daysPattern, oneDayPattern, hoursPattern, oneHourPattern) => {
        const sign = rate < 0 ? "−" : "";
        const inHours = Math.abs(rate) < 1;
        const magnitude = formatMagnitude(Math.abs(rate) * (inHours ? 24 : 1));
        const pattern =
          magnitude === "1" ? (inHours ? oneHourPattern : oneDayPattern) : inHours ? hoursPattern : daysPattern;
        return StringUtils.fillIn(pattern, { rate: `${sign}${magnitude}` });
      },
    );

    const textButton = (
      labelProperty: TReadOnlyProperty<string>,
      accessibleName: TReadOnlyProperty<string>,
      listener: () => void,
      maxWidth: number = TIME_CONTROL_PANEL_SETTINGS.DEFAULT_MAX_WIDTH,
    ): RectangularPushButton =>
      new RectangularPushButton({
        ...FLAT_PANEL_PUSH_BUTTON_OPTIONS,
        content: new Text(labelProperty, { font, fill: LIGHT_SURFACE_TEXT_FILL, maxWidth }),
        accessibleName,
        listener,
        xMargin: TIME_CONTROL_PANEL_SETTINGS.TEXT_BUTTON_X_MARGIN,
        yMargin: TIME_CONTROL_PANEL_SETTINGS.TEXT_BUTTON_Y_MARGIN,
      });

    const stepRow = (
      titleProperty: TReadOnlyProperty<string>,
      backwardName: TReadOnlyProperty<string>,
      forwardName: TReadOnlyProperty<string>,
      step: (direction: number) => void,
    ) => [
      new Text(titleProperty, { ...textOptions, maxWidth: TIME_CONTROL_PANEL_SETTINGS.STEP_ROW_MAX_WIDTH }),
      textButton(
        controls.stepBackwardStringProperty,
        backwardName,
        () => step(-1),
        TIME_CONTROL_PANEL_SETTINGS.STEP_BACKWARD_TEXT_BUTTON_MAX_WIDTH,
      ),
      textButton(
        controls.stepForwardStringProperty,
        forwardName,
        () => step(1),
        TIME_CONTROL_PANEL_SETTINGS.STEP_FORWARD_TEXT_BUTTON_MAX_WIDTH,
      ),
    ];

    const dayStepGrid = new GridBox({
      rows: [
        stepRow(
          controls.solarDayStringProperty,
          a11y.solarDayBackwardStringProperty,
          a11y.solarDayForwardStringProperty,
          (d) => model.jumpDays(d),
        ),
        stepRow(
          controls.siderealDayStringProperty,
          a11y.siderealDayBackwardStringProperty,
          a11y.siderealDayForwardStringProperty,
          (d) => model.jumpSiderealDays(d),
        ),
      ],
      xSpacing: TIME_CONTROL_PANEL_SETTINGS.DAY_STEP_GRID_X_SPACING,
      ySpacing: TIME_CONTROL_PANEL_SETTINGS.DAY_STEP_GRID_Y_SPACING,
      xAlign: "left",
    });

    const rateButton = (dir: 1 | -1, accessibleName: TReadOnlyProperty<string>, listener: () => void) =>
      new RectangularPushButton({
        ...FLAT_PANEL_PUSH_BUTTON_OPTIONS,
        content: new Path(doubleTriangleShape(dir), { fill: LIGHT_SURFACE_TEXT_FILL }),
        xMargin: TIME_CONTROL_PANEL_SETTINGS.RATE_BUTTON_X_MARGIN,
        yMargin: TIME_CONTROL_PANEL_SETTINGS.RATE_BUTTON_Y_MARGIN,
        accessibleName,
        listener,
      });

    const playPauseButton = new PlayPauseButton(model.timer.isPlayingProperty, {
      radius: TIME_CONTROL_PANEL_SETTINGS.PLAY_PAUSE_BUTTON_RADIUS,
      buttonAppearanceStrategy: ButtonNode.FlatAppearanceStrategy,
      startPlayingAccessibleName: a11y.startTimeStringProperty,
      endPlayingAccessibleName: a11y.stopTimeStringProperty,
    });

    const content = new VBox({
      align: "left",
      spacing: PANEL_CONTENT_SPACING,
      children: [
        new Text(createObserverLocationNameProperty(model), {
          font: new PhetFont({ size: TITLE_FONT_SIZE, weight: "bold" }),
          fill: MercuryElongationsColors.textColorProperty,
          maxWidth: CONTROL_PANEL_WIDTH - TIME_CONTROL_PANEL_SETTINGS.CONTENT_MAX_WIDTH_OFFSET,
        }),
        new Text(labels.localMeanTimeStringProperty, {
          ...textOptions,
          fill: MercuryElongationsColors.mutedTextColorProperty,
        }),
        new LocalDateTimeControl(model),
        dayStepGrid,
        new VBox({
          spacing: TIME_CONTROL_PANEL_SETTINGS.CONTENT_SPACING,
          children: [
            new HBox({
              spacing: TIME_CONTROL_PANEL_SETTINGS.CONTENT_ITEM_1_SPACING,
              children: [
                rateButton(-1, a11y.decreaseRateStringProperty, () => model.decreaseTimeRate()),
                playPauseButton,
                rateButton(1, a11y.increaseRateStringProperty, () => model.increaseTimeRate()),
              ],
            }),
            new Text(rateProperty, textOptions),
          ],
        }),
        new Text(localTimeProperty, textOptions),
        new Text(utcTimeProperty, { ...textOptions, fill: MercuryElongationsColors.mutedTextColorProperty }),
        new Text(labels.elongationStringProperty, {
          font: new PhetFont({ size: CONTROL_FONT_SIZE, weight: "bold" }),
          fill: MercuryElongationsColors.elongationColorProperty,
        }),
        new Text(elongationProperty, {
          font: new PhetFont({ size: TIME_CONTROL_PANEL_SETTINGS.CONTENT_FONT_SIZE, weight: "bold" }),
          fill: MercuryElongationsColors.elongationColorProperty,
          maxWidth: CONTROL_PANEL_WIDTH - TIME_CONTROL_PANEL_SETTINGS.CONTENT_MAX_WIDTH_OFFSET,
        }),
        new HBox({
          spacing: TIME_CONTROL_PANEL_SETTINGS.CONTENT_ITEM_10_SPACING,
          children: [
            textButton(
              controls.previousGreatestStringProperty,
              a11y.previousGreatestStringProperty,
              () => model.goToPreviousGreatestElongation(),
              TIME_CONTROL_PANEL_SETTINGS.PREVIOUS_GREATEST_TEXT_BUTTON_MAX_WIDTH,
            ),
            textButton(
              controls.nextGreatestStringProperty,
              a11y.nextGreatestStringProperty,
              () => model.goToNextGreatestElongation(),
              TIME_CONTROL_PANEL_SETTINGS.NEXT_GREATEST_TEXT_BUTTON_MAX_WIDTH,
            ),
          ],
        }),
      ],
    });

    super(content, { minWidth: CONTROL_PANEL_WIDTH, maxWidth: CONTROL_PANEL_WIDTH });
  }
}
