import { DerivedProperty, PatternStringProperty } from "scenerystack/axon";
import { HBox, Text, VBox } from "scenerystack/scenery";
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

const signed = (value: number): string => (value < 0 ? `−${Math.abs(value)}` : `${value}`);

export class TimeControlPanel extends MercuryElongationsPanel {
  public constructor(model: MercurySystemModel) {
    const strings = StringManager.getInstance();
    const labels = strings.getLabels();
    const controls = strings.getControls();
    const patterns = strings.getPatterns();
    const a11y = strings.getCommonA11yStrings().controls;
    const font = new PhetFont(CONTROL_FONT_SIZE);
    const textOptions = { font, fill: MercuryElongationsColors.textColorProperty, maxWidth: CONTROL_PANEL_WIDTH - 28 };

    const localTimeProperty = new DerivedProperty([model.civilTimeMsProperty], formatLocalDateTime);
    const utcTimeProperty = new DerivedProperty([model.civilTimeMsProperty], formatUtcDateTime);
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
      { decimalPlaces: 2 },
    );
    const rateProperty = new PatternStringProperty(patterns.rateStringProperty, {
      rate: new DerivedProperty([model.timeRateDaysPerSecondProperty], signed),
    });

    const button = (
      labelProperty: typeof controls.backDayStringProperty,
      accessibleName: typeof a11y.backDayStringProperty,
      listener: () => void,
      maxWidth = 92,
    ): RectangularPushButton =>
      new RectangularPushButton({
        ...FLAT_PANEL_PUSH_BUTTON_OPTIONS,
        content: new Text(labelProperty, { font, fill: LIGHT_SURFACE_TEXT_FILL, maxWidth }),
        accessibleName,
        listener,
        xMargin: 8,
        yMargin: 5,
      });

    const playPauseButton = new PlayPauseButton(model.timer.isPlayingProperty, {
      radius: 16,
      buttonAppearanceStrategy: ButtonNode.FlatAppearanceStrategy,
      startPlayingAccessibleName: a11y.startTimeStringProperty,
      endPlayingAccessibleName: a11y.stopTimeStringProperty,
    });

    const content = new VBox({
      align: "left",
      spacing: PANEL_CONTENT_SPACING,
      children: [
        new Text(labels.bereaStringProperty, {
          font: new PhetFont({ size: TITLE_FONT_SIZE, weight: "bold" }),
          fill: MercuryElongationsColors.textColorProperty,
          maxWidth: CONTROL_PANEL_WIDTH - 28,
        }),
        new Text(labels.localMeanTimeStringProperty, textOptions),
        new LocalDateTimeControl(model),
        new Text(localTimeProperty, textOptions),
        new Text(utcTimeProperty, { ...textOptions, fill: MercuryElongationsColors.mutedTextColorProperty }),
        new HBox({
          spacing: 6,
          children: [
            button(controls.backDayStringProperty, a11y.backDayStringProperty, () => model.jumpDays(-1), 58),
            playPauseButton,
            button(controls.forwardDayStringProperty, a11y.forwardDayStringProperty, () => model.jumpDays(1), 58),
          ],
        }),
        new HBox({
          spacing: 6,
          children: [
            button(
              controls.decreaseRateShortStringProperty,
              a11y.decreaseRateStringProperty,
              () => model.decreaseTimeRate(),
              30,
            ),
            new Text(rateProperty, { ...textOptions, maxWidth: 116 }),
            button(
              controls.increaseRateShortStringProperty,
              a11y.increaseRateStringProperty,
              () => model.increaseTimeRate(),
              30,
            ),
          ],
        }),
        new Text(labels.elongationStringProperty, {
          font: new PhetFont({ size: CONTROL_FONT_SIZE, weight: "bold" }),
          fill: MercuryElongationsColors.elongationColorProperty,
        }),
        new Text(elongationProperty, {
          font: new PhetFont({ size: 16, weight: "bold" }),
          fill: MercuryElongationsColors.elongationColorProperty,
          maxWidth: CONTROL_PANEL_WIDTH - 28,
        }),
        new HBox({
          spacing: 6,
          children: [
            button(
              controls.previousGreatestStringProperty,
              a11y.previousGreatestStringProperty,
              () => model.goToPreviousGreatestElongation(),
              96,
            ),
            button(
              controls.nextGreatestStringProperty,
              a11y.nextGreatestStringProperty,
              () => model.goToNextGreatestElongation(),
              96,
            ),
          ],
        }),
      ],
    });

    super(content, { minWidth: CONTROL_PANEL_WIDTH, maxWidth: CONTROL_PANEL_WIDTH });
  }
}
