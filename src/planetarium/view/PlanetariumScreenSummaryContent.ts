import { DerivedProperty, PatternStringProperty } from "scenerystack/axon";
import { ScreenSummaryContent } from "scenerystack/sim";
import { formatLocalDateTime } from "../../common/astronomy/dateTime.js";
import { createObserverLocationNameProperty } from "../../common/view/observerLocationName.js";
import { StringManager } from "../../i18n/StringManager.js";
import type { PlanetariumModel } from "../model/PlanetariumModel.js";

export class PlanetariumScreenSummaryContent extends ScreenSummaryContent {
  public constructor(model: PlanetariumModel) {
    const strings = StringManager.getInstance();
    const a11y = strings.getPlanetariumA11yStrings();
    const labels = strings.getLabels();
    const patterns = strings.getPatterns();
    const directionProperty = new DerivedProperty(
      [model.system.snapshotProperty, labels.eastStringProperty, labels.westStringProperty],
      (snapshot, east, west) => (snapshot.direction === "east" ? east : west),
    );
    const detailsProperty = new PatternStringProperty(
      patterns.detailsStringProperty,
      {
        date: new DerivedProperty(
          [model.system.civilTimeMsProperty, model.system.longitudeProperty],
          formatLocalDateTime,
        ),
        location: createObserverLocationNameProperty(model.system),
        angle: new DerivedProperty([model.system.snapshotProperty], (snapshot) => snapshot.elongationDeg),
        direction: directionProperty,
      },
      { decimalPlaces: 2 },
    );
    super({
      playAreaContent: a11y.screenSummary.playAreaStringProperty,
      controlAreaContent: a11y.screenSummary.controlAreaStringProperty,
      currentDetailsContent: detailsProperty,
      interactionHintContent: a11y.screenSummary.interactionHintStringProperty,
    });
  }
}
