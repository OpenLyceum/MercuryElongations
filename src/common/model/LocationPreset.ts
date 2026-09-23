import { BEREA_LATITUDE_DEG, BEREA_LONGITUDE_DEG } from "../../MercuryElongationsConstants.js";
import type { ObserverLocation } from "../astronomy/mercuryEphemeris.js";

/**
 * Named observer sites for the location combo box. "custom" means the latitude or
 * longitude was set by hand and no longer matches a named site.
 */
export type LocationPreset = "berea" | "greenwich" | "equator" | "northPole" | "southPole" | "sydney" | "custom";

export const DEFAULT_LOCATION_PRESET: LocationPreset = "berea";

/** Coordinates of each named preset (+N latitude, +E longitude). */
export const LOCATION_PRESET_COORDINATES: ReadonlyMap<Exclude<LocationPreset, "custom">, ObserverLocation> = new Map([
  ["berea", { latitudeDeg: BEREA_LATITUDE_DEG, longitudeDeg: BEREA_LONGITUDE_DEG }],
  ["greenwich", { latitudeDeg: 51.4779, longitudeDeg: 0 }],
  ["equator", { latitudeDeg: 0, longitudeDeg: 0 }],
  ["northPole", { latitudeDeg: 90, longitudeDeg: 0 }],
  ["southPole", { latitudeDeg: -90, longitudeDeg: 0 }],
  ["sydney", { latitudeDeg: -33.8688, longitudeDeg: 151.2093 }],
]);

/** Coordinates within this many degrees of a preset count as that preset. */
const PRESET_MATCH_TOLERANCE_DEG = 1e-6;

/** The named preset at `location`, or "custom" when none matches. */
export const presetForLocation = (location: ObserverLocation): LocationPreset => {
  for (const [preset, coordinates] of LOCATION_PRESET_COORDINATES) {
    if (
      Math.abs(coordinates.latitudeDeg - location.latitudeDeg) < PRESET_MATCH_TOLERANCE_DEG &&
      Math.abs(coordinates.longitudeDeg - location.longitudeDeg) < PRESET_MATCH_TOLERANCE_DEG
    ) {
      return preset;
    }
  }
  return "custom";
};
