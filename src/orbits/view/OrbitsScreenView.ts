import { DerivedProperty, PatternStringProperty } from "scenerystack/axon";
import { type EmptySelfOptions, optionize } from "scenerystack/phet-core";
import { Node, Rectangle } from "scenerystack/scenery";
import { ResetAllButton } from "scenerystack/scenery-phet";
import { ScreenView, type ScreenViewOptions } from "scenerystack/sim";
import type { MercuryEvent } from "../../common/astronomy/mercuryEvents.js";
import { FLAT_RESET_ALL_BUTTON_OPTIONS } from "../../common/MercuryElongationsButtonOptions.js";
import { TimeControlPanel } from "../../common/view/TimeControlPanel.js";
import { StringManager } from "../../i18n/StringManager.js";
import MercuryElongationsColors from "../../MercuryElongationsColors.js";
import {
  EVENT_NOW_WINDOW_DAYS,
  MILLISECONDS_PER_DAY,
  ORBIT_VIEW_HEIGHT,
  ORBIT_VIEW_WIDTH,
  SCREEN_VIEW_MARGIN,
} from "../../MercuryElongationsConstants.js";
import type { OrbitsModel } from "../model/OrbitsModel.js";
import { MercuryOrbitNode } from "./MercuryOrbitNode.js";
import { allMercuryEventNameProperties, mercuryEventNameProperty, OrbitEventsPanel } from "./OrbitEventsPanel.js";
import { OrbitsScreenSummaryContent } from "./OrbitsScreenSummaryContent.js";

/** While playing, an event stays flagged as "now" for at least this many real seconds. */
const EVENT_NOW_MIN_REAL_SECONDS = 0.75;

export type OrbitsScreenViewOptions = ScreenViewOptions;

export class OrbitsScreenView extends ScreenView {
  private readonly model: OrbitsModel;

  public constructor(model: OrbitsModel, providedOptions?: OrbitsScreenViewOptions) {
    const options = optionize<OrbitsScreenViewOptions, EmptySelfOptions, ScreenViewOptions>()(
      { screenSummaryContent: new OrbitsScreenSummaryContent(model) },
      providedOptions,
    );
    super(options);
    this.model = model;
    const system = model.system;

    this.addChild(
      new Rectangle(0, 0, this.layoutBounds.width, this.layoutBounds.height, {
        fill: MercuryElongationsColors.backgroundColorProperty,
      }),
    );

    // The event the clock is passing through, if any. The window widens with the
    // playback rate so fast animation still shows each event for a moment.
    const currentEventProperty = new DerivedProperty(
      [system.eventContextProperty, system.civilTimeMsProperty, system.timeRateDaysPerSecondProperty],
      (context, civilTimeMs, rate): MercuryEvent | null => {
        const windowMs =
          Math.max(EVENT_NOW_WINDOW_DAYS, Math.abs(rate) * EVENT_NOW_MIN_REAL_SECONDS) * MILLISECONDS_PER_DAY;
        const candidates = [context.previous, context.next].filter(
          (event): event is MercuryEvent => event !== null && Math.abs(event.timeMs - civilTimeMs) <= windowMs,
        );
        candidates.sort((a, b) => Math.abs(a.timeMs - civilTimeMs) - Math.abs(b.timeMs - civilTimeMs));
        return candidates[0] ?? null;
      },
    );
    const currentEventNameProperty = new DerivedProperty(
      [currentEventProperty, ...allMercuryEventNameProperties()],
      (event) => (event ? mercuryEventNameProperty(event.kind).value : null),
    );

    const orbits = new MercuryOrbitNode(model, currentEventNameProperty, ORBIT_VIEW_WIDTH, ORBIT_VIEW_HEIGHT);
    orbits.left = SCREEN_VIEW_MARGIN;
    orbits.top = SCREEN_VIEW_MARGIN;
    this.addChild(orbits);

    const eventsPanel = new OrbitEventsPanel(model, currentEventNameProperty, 216);
    eventsPanel.left = orbits.left + 10;
    eventsPanel.top = orbits.top + 10;
    this.addChild(eventsPanel);

    const timePanel = new TimeControlPanel(system);
    timePanel.right = this.layoutBounds.maxX - SCREEN_VIEW_MARGIN;
    timePanel.top = SCREEN_VIEW_MARGIN;
    this.addChild(timePanel);

    const resetAllButton = new ResetAllButton({
      ...FLAT_RESET_ALL_BUTTON_OPTIONS,
      listener: () => model.reset(),
      right: this.layoutBounds.maxX - SCREEN_VIEW_MARGIN,
      bottom: this.layoutBounds.maxY - SCREEN_VIEW_MARGIN,
    });
    this.addChild(resetAllButton);
    this.addChild(new Node({ pdomOrder: [eventsPanel, timePanel, resetAllButton] }));

    // Announce each event as the clock passes through it (either direction).
    const eventPassedPattern = StringManager.getInstance().getCommonA11yStrings().eventPassedStringProperty;
    system.eventContextProperty.lazyLink((context, oldContext) => {
      const passed =
        context.previous && context.previous.timeMs === oldContext.next?.timeMs
          ? context.previous
          : context.next && context.next.timeMs === oldContext.previous?.timeMs
            ? context.next
            : null;
      if (passed && this.isVisible()) {
        this.addAccessibleResponse(
          new PatternStringProperty(eventPassedPattern, { event: mercuryEventNameProperty(passed.kind) }).value,
        );
      }
    });
  }

  public override step(dt: number): void {
    this.model.step(dt);
  }
}
