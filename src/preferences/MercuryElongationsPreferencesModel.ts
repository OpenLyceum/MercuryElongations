import MercuryElongationsNamespace from "../MercuryElongationsNamespace.js";

/** Reserved for future simulation-specific preferences. */
export class MercuryElongationsPreferencesModel {
  public reset(): void {
    // No simulation-specific preferences yet.
  }
}

MercuryElongationsNamespace.register("MercuryElongationsPreferencesModel", MercuryElongationsPreferencesModel);
