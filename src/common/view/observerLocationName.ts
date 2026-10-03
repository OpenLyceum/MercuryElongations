import { DerivedProperty, type NumberProperty, PatternStringProperty, type TReadOnlyProperty } from "scenerystack/axon";
import { StringUtils } from "scenerystack/phetcommon";
import { StringManager } from "../../i18n/StringManager.js";
import type { LocationPreset } from "../model/LocationPreset.js";
import type { MercurySystemModel } from "../model/MercurySystemModel.js";

/** Localized name of each location preset. */
export const locationPresetNameProperty = (preset: LocationPreset): TReadOnlyProperty<string> => {
  const locations = StringManager.getInstance().getLocations();
  return {
    berea: locations.bereaStringProperty,
    greenwich: locations.greenwichStringProperty,
    equator: locations.equatorStringProperty,
    northPole: locations.northPoleStringProperty,
    southPole: locations.southPoleStringProperty,
    sydney: locations.sydneyStringProperty,
    custom: locations.customStringProperty,
  }[preset];
};

/** Formatted coordinates (e.g. "12.5° N, 3.0° W") for the map and custom site. */
export const createObserverCoordinatesProperty = (
  latitudeProperty: NumberProperty,
  longitudeProperty: NumberProperty,
): TReadOnlyProperty<string> => {
  const strings = StringManager.getInstance();
  const labels = strings.getLabels();
  return new PatternStringProperty(strings.getPatterns().coordinatesStringProperty, {
    latitude: new DerivedProperty([latitudeProperty], (latitude) => StringUtils.toFixedLTR(Math.abs(latitude), 2)),
    longitude: new DerivedProperty([longitudeProperty], (longitude) => StringUtils.toFixedLTR(Math.abs(longitude), 2)),
    northSouth: new DerivedProperty(
      [latitudeProperty, labels.northStringProperty, labels.southStringProperty],
      (latitude, north, south) => (latitude >= 0 ? north : south),
    ),
    eastWest: new DerivedProperty(
      [longitudeProperty, labels.eastCardinalStringProperty, labels.westCardinalStringProperty],
      (longitude, east, west) => (longitude >= 0 ? east : west),
    ),
  });
};

/** The preset's name, or formatted coordinates for a custom site. */
export const createObserverLocationNameProperty = (model: MercurySystemModel): TReadOnlyProperty<string> => {
  const strings = StringManager.getInstance();
  const coordinatesProperty = createObserverCoordinatesProperty(model.latitudeProperty, model.longitudeProperty);
  const locations = strings.getLocations();
  return new DerivedProperty(
    [
      model.locationPresetProperty,
      coordinatesProperty,
      locations.bereaStringProperty,
      locations.greenwichStringProperty,
      locations.equatorStringProperty,
      locations.northPoleStringProperty,
      locations.southPoleStringProperty,
      locations.sydneyStringProperty,
    ],
    (preset, coordinates) => (preset === "custom" ? coordinates : locationPresetNameProperty(preset).value),
  );
};
