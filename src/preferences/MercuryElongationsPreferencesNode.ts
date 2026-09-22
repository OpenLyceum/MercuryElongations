import { Node } from "scenerystack/scenery";
import MercuryElongationsNamespace from "../MercuryElongationsNamespace.js";

/** Empty conventional preferences node; the sim currently uses only framework preferences. */
export class MercuryElongationsPreferencesNode extends Node {}

MercuryElongationsNamespace.register("MercuryElongationsPreferencesNode", MercuryElongationsPreferencesNode);
