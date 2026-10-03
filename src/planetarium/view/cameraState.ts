import { DerivedProperty, PatternStringProperty, type TReadOnlyProperty } from "scenerystack/axon";
import { StringManager } from "../../i18n/StringManager.js";
import type { PlanetariumModel } from "../model/PlanetariumModel.js";

/** Localized look direction and horizontal field of view for screen-reader feedback. */
export const createCameraStateProperty = (model: PlanetariumModel): TReadOnlyProperty<string> => {
  const directionDependencies = [
    model.system.snapshotProperty,
    model.skyViewModeProperty,
    model.fixedLookAzimuthDegProperty,
    model.fixedLookAltitudeDegProperty,
  ] as const;
  return new PatternStringProperty(
    StringManager.getInstance().getPlanetariumA11yStrings().cameraStateStringProperty,
    {
      azimuth: new DerivedProperty(directionDependencies, () => model.getLookDirection().azimuthDeg),
      altitude: new DerivedProperty(directionDependencies, () => model.getLookDirection().altitudeDeg),
      fieldOfView: model.fieldOfViewDegProperty,
    },
    { decimalPlaces: 1 },
  );
};
