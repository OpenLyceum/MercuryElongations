import { logGlobal } from "scenerystack/phet-core";
import { QueryStringMachine } from "scenerystack/query-string-machine";
import {
  BEREA_LATITUDE_DEG,
  BEREA_LONGITUDE_DEG,
  CIVIL_TIME_MS_RANGE,
  DEFAULT_CIVIL_TIME_MS,
  LATITUDE_RANGE,
  LONGITUDE_RANGE,
} from "../MercuryElongationsConstants.js";
import MercuryElongationsNamespace from "../MercuryElongationsNamespace.js";

export function parseDateQueryParameter(value: string | null): number | null {
  if (!value) {
    return null;
  }
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) || !CIVIL_TIME_MS_RANGE.contains(parsed) ? null : parsed;
}

const mercuryElongationsQueryParameters = QueryStringMachine.getAll({
  date: {
    type: "string",
    defaultValue: "",
    isValidValue: (value: string | null) => value === null || value === "" || parseDateQueryParameter(value) !== null,
    public: true,
  },
  /** Observer latitude in degrees (+N). Defaults to Berea, Kentucky. */
  lat: {
    type: "number",
    defaultValue: BEREA_LATITUDE_DEG,
    isValidValue: (value: number) => LATITUDE_RANGE.contains(value),
    public: true,
  },
  /** Observer longitude in degrees (+E). Defaults to Berea, Kentucky. */
  lon: {
    type: "number",
    defaultValue: BEREA_LONGITUDE_DEG,
    isValidValue: (value: number) => LONGITUDE_RANGE.contains(value),
    public: true,
  },
});

export const resolveInitialLatitudeDeg = (): number => mercuryElongationsQueryParameters.lat;
export const resolveInitialLongitudeDeg = (): number => mercuryElongationsQueryParameters.lon;

export const resolveInitialCivilTimeMs = (): number =>
  parseDateQueryParameter(mercuryElongationsQueryParameters.date) ?? DEFAULT_CIVIL_TIME_MS;

MercuryElongationsNamespace.register("mercuryElongationsQueryParameters", mercuryElongationsQueryParameters);
logGlobal("phet.chipper.queryParameters");

export default mercuryElongationsQueryParameters;
