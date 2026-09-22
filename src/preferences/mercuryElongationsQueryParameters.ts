import { logGlobal } from "scenerystack/phet-core";
import { QueryStringMachine } from "scenerystack/query-string-machine";
import { CIVIL_TIME_MS_RANGE, DEFAULT_CIVIL_TIME_MS } from "../MercuryElongationsConstants.js";
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
});

export const resolveInitialCivilTimeMs = (): number =>
  parseDateQueryParameter(mercuryElongationsQueryParameters.date) ?? DEFAULT_CIVIL_TIME_MS;

MercuryElongationsNamespace.register("mercuryElongationsQueryParameters", mercuryElongationsQueryParameters);
logGlobal("phet.chipper.queryParameters");

export default mercuryElongationsQueryParameters;
