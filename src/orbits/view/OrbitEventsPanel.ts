/**
 * OrbitEventsPanel.ts
 *
 * Orbits-screen readout of Mercury's configurations: the conjunction or greatest
 * elongation most recently passed, the next one ahead, and a highlighted "Now"
 * line while the clock is passing through one. Also holds the checkbox that
 * shows or hides the elongation angle on the diagram.
 */

import { DerivedProperty, PatternStringProperty, type TReadOnlyProperty } from "scenerystack/axon";
import { HSeparator, Text, VBox } from "scenerystack/scenery";
import { PhetFont } from "scenerystack/scenery-phet";
import { Checkbox } from "scenerystack/sun";
import { formatUtcDate } from "../../common/astronomy/dateTime.js";
import type { MercuryEvent, MercuryEventKind } from "../../common/astronomy/mercuryEvents.js";
import { MERCURY_ELONGATIONS_CHECKBOX_OPTIONS } from "../../common/MercuryElongationsControlOptions.js";
import { MercuryElongationsPanel } from "../../common/MercuryElongationsPanel.js";
import { StringManager } from "../../i18n/StringManager.js";
import MercuryElongationsColors from "../../MercuryElongationsColors.js";
import { CONTROL_FONT_SIZE } from "../../MercuryElongationsConstants.js";
import type { OrbitsModel } from "../model/OrbitsModel.js";

/** Localized name of each event kind. */
export const mercuryEventNameProperty = (kind: MercuryEventKind): TReadOnlyProperty<string> => {
  const events = StringManager.getInstance().getEvents();
  return {
    inferiorConjunction: events.inferiorConjunctionStringProperty,
    superiorConjunction: events.superiorConjunctionStringProperty,
    greatestEastern: events.greatestEasternStringProperty,
    greatestWestern: events.greatestWesternStringProperty,
  }[kind];
};

/** Every event-name string, as dependencies for Properties that look names up by kind. */
export const allMercuryEventNameProperties = () => {
  const events = StringManager.getInstance().getEvents();
  return [
    events.inferiorConjunctionStringProperty,
    events.superiorConjunctionStringProperty,
    events.greatestEasternStringProperty,
    events.greatestWesternStringProperty,
  ] as const;
};

export class OrbitEventsPanel extends MercuryElongationsPanel {
  public constructor(model: OrbitsModel, currentEventNameProperty: TReadOnlyProperty<string | null>, width: number) {
    const strings = StringManager.getInstance();
    const labels = strings.getLabels();
    const patterns = strings.getPatterns();
    const system = model.system;
    const font = new PhetFont(CONTROL_FONT_SIZE);
    const contentWidth = width - 24;

    const eventText = (
      patternProperty: TReadOnlyProperty<string>,
      select: (context: typeof system.eventContextProperty.value) => MercuryEvent | null,
    ): Text[] => {
      const eventProperty = new DerivedProperty([system.eventContextProperty], select);
      const nameProperty = new DerivedProperty(
        [eventProperty, labels.noneStringProperty, ...allMercuryEventNameProperties()],
        (event, none) => (event ? mercuryEventNameProperty(event.kind).value : none),
      );
      const detailProperty = new PatternStringProperty(
        patterns.eventDateStringProperty,
        {
          date: new DerivedProperty([eventProperty], (event) => (event ? formatUtcDate(event.timeMs) : "")),
          angle: new DerivedProperty([eventProperty], (event) => event?.elongationDeg ?? 0),
        },
        { decimalPlaces: 1 },
      );
      return [
        new Text(new PatternStringProperty(patternProperty, { event: nameProperty }), {
          font,
          fill: MercuryElongationsColors.textColorProperty,
          maxWidth: contentWidth,
        }),
        new Text(detailProperty, {
          font: new PhetFont(CONTROL_FONT_SIZE - 1),
          fill: MercuryElongationsColors.mutedTextColorProperty,
          maxWidth: contentWidth,
        }),
      ];
    };

    const nowText = new Text(
      new PatternStringProperty(patterns.nowEventStringProperty, {
        event: new DerivedProperty([currentEventNameProperty], (name) => name ?? ""),
      }),
      {
        font: new PhetFont({ size: CONTROL_FONT_SIZE, weight: "bold" }),
        fill: MercuryElongationsColors.eventHighlightColorProperty,
        maxWidth: contentWidth,
        visibleProperty: new DerivedProperty([currentEventNameProperty], (name) => name !== null),
      },
    );

    const elongationCheckbox = new Checkbox(
      model.showElongationProperty,
      new Text(strings.getControls().showElongationStringProperty, {
        font,
        fill: MercuryElongationsColors.textColorProperty,
        maxWidth: contentWidth - 24,
      }),
      {
        ...MERCURY_ELONGATIONS_CHECKBOX_OPTIONS,
        accessibleName: strings.getOrbitsA11yStrings().controls.showElongationStringProperty,
      },
    );

    super(
      new VBox({
        align: "left",
        spacing: 5,
        children: [
          elongationCheckbox,
          new HSeparator({ stroke: MercuryElongationsColors.panelBorderColorProperty }),
          new Text(labels.eventsStringProperty, {
            font: new PhetFont({ size: CONTROL_FONT_SIZE + 1, weight: "bold" }),
            fill: MercuryElongationsColors.textColorProperty,
            maxWidth: contentWidth,
          }),
          ...eventText(patterns.lastEventStringProperty, (context) => context.previous),
          ...eventText(patterns.nextEventStringProperty, (context) => context.next),
          nowText,
        ],
      }),
      { minWidth: width, maxWidth: width, xMargin: 10, yMargin: 8 },
    );
  }
}
