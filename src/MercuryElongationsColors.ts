import { ProfileColorProperty } from "scenerystack/scenery";
import MercuryElongationsNamespace from "./MercuryElongationsNamespace.js";

const MercuryElongationsColors = {
  backgroundColorProperty: new ProfileColorProperty(MercuryElongationsNamespace, "background", {
    default: "#080d1b",
    projector: "#f7f9fc",
  }),
  accentColorProperty: new ProfileColorProperty(MercuryElongationsNamespace, "accent", {
    default: "#67d8ff",
    projector: "#075985",
  }),
  panelBackgroundColorProperty: new ProfileColorProperty(MercuryElongationsNamespace, "panelBackground", {
    default: "#15213a",
    projector: "#eef2f7",
  }),
  panelBorderColorProperty: new ProfileColorProperty(MercuryElongationsNamespace, "panelBorder", {
    default: "#365174",
    projector: "#667085",
  }),
  textColorProperty: new ProfileColorProperty(MercuryElongationsNamespace, "text", {
    default: "#f3f7ff",
    projector: "#172033",
  }),
  mutedTextColorProperty: new ProfileColorProperty(MercuryElongationsNamespace, "mutedText", {
    default: "#b8c7dd",
    projector: "#475467",
  }),
  skyColorProperty: new ProfileColorProperty(MercuryElongationsNamespace, "sky", {
    default: "#07142e",
    projector: "#dceeff",
  }),
  skyZenithColorProperty: new ProfileColorProperty(MercuryElongationsNamespace, "skyZenith", {
    default: "#020611",
    projector: "#c9e6f7",
  }),
  skyHorizonColorProperty: new ProfileColorProperty(MercuryElongationsNamespace, "skyHorizon", {
    default: "#102b4f",
    projector: "#eef8ff",
  }),
  starColorProperty: new ProfileColorProperty(MercuryElongationsNamespace, "star", {
    default: "#f4f7ff",
    projector: "#526b80",
  }),
  groundColorProperty: new ProfileColorProperty(MercuryElongationsNamespace, "ground", {
    default: "#19251d",
    projector: "#d7e5cf",
  }),
  skyDayZenithColorProperty: new ProfileColorProperty(MercuryElongationsNamespace, "skyDayZenith", {
    default: "#4a90d9",
    projector: "#9ec5f0",
  }),
  skyDayHorizonColorProperty: new ProfileColorProperty(MercuryElongationsNamespace, "skyDayHorizon", {
    default: "#a8c8e8",
    projector: "#c8daf0",
  }),
  skyTwilightHorizonColorProperty: new ProfileColorProperty(MercuryElongationsNamespace, "skyTwilightHorizon", {
    default: "#e09050",
    projector: "#d08040",
  }),
  groundDayColorProperty: new ProfileColorProperty(MercuryElongationsNamespace, "groundDay", {
    default: "#3a4a38",
    projector: "#8a9a78",
  }),
  gridColorProperty: new ProfileColorProperty(MercuryElongationsNamespace, "grid", {
    default: "#365f83",
    projector: "#6b8499",
  }),
  horizonColorProperty: new ProfileColorProperty(MercuryElongationsNamespace, "horizon", {
    default: "#9bc9dd",
    projector: "#36556a",
  }),
  sunColorProperty: new ProfileColorProperty(MercuryElongationsNamespace, "sun", {
    default: "#ffd34d",
    projector: "#e5a800",
  }),
  sunGlowColorProperty: new ProfileColorProperty(MercuryElongationsNamespace, "sunGlow", {
    default: "#fff2a3",
    projector: "#f7c948",
  }),
  sunHighlightColorProperty: new ProfileColorProperty(MercuryElongationsNamespace, "sunHighlight", {
    default: "#fff8cb",
    projector: "#fff3a6",
  }),
  sunLimbColorProperty: new ProfileColorProperty(MercuryElongationsNamespace, "sunLimb", {
    default: "#e99b19",
    projector: "#e99b19",
  }),
  sunRimColorProperty: new ProfileColorProperty(MercuryElongationsNamespace, "sunRim", {
    default: "#ffe999",
    projector: "#ffe999",
  }),
  mercuryColorProperty: new ProfileColorProperty(MercuryElongationsNamespace, "mercury", {
    default: "#c7c2b8",
    projector: "#615d55",
  }),
  mercuryHighlightColorProperty: new ProfileColorProperty(MercuryElongationsNamespace, "mercuryHighlight", {
    default: "#eee9df",
    projector: "#aaa49b",
  }),
  mercuryShadowColorProperty: new ProfileColorProperty(MercuryElongationsNamespace, "mercuryShadow", {
    default: "#514d49",
    projector: "#393633",
  }),
  earthColorProperty: new ProfileColorProperty(MercuryElongationsNamespace, "earth", {
    default: "#4aa8ff",
    projector: "#1261a0",
  }),
  earthOrbitColorProperty: new ProfileColorProperty(MercuryElongationsNamespace, "earthOrbit", {
    default: "#4aa8ff",
    projector: "#1261a0",
  }),
  mercuryOrbitColorProperty: new ProfileColorProperty(MercuryElongationsNamespace, "mercuryOrbit", {
    default: "#bdb7ae",
    projector: "#615d55",
  }),
  elongationColorProperty: new ProfileColorProperty(MercuryElongationsNamespace, "elongation", {
    default: "#ff8ab3",
    projector: "#b42355",
  }),
  eventHighlightColorProperty: new ProfileColorProperty(MercuryElongationsNamespace, "eventHighlight", {
    default: "#ffe066",
    projector: "#8a5a00",
  }),
  earthOceanColorProperty: new ProfileColorProperty(MercuryElongationsNamespace, "earthOcean", {
    default: "#12325a",
    projector: "#bcd6f0",
  }),
  earthLandColorProperty: new ProfileColorProperty(MercuryElongationsNamespace, "earthLand", {
    default: "#2f6b41",
    projector: "#7cae82",
  }),
  earthGraticuleColorProperty: new ProfileColorProperty(MercuryElongationsNamespace, "earthGraticule", {
    default: "#5a7ba6",
    projector: "#6b8fb5",
  }),
  locationPinColorProperty: new ProfileColorProperty(MercuryElongationsNamespace, "locationPin", {
    default: "#ff5a4d",
    projector: "#d5342a",
  }),
  /** Light ring around the pin so it reads on both land and ocean fills. */
  locationPinRingColorProperty: new ProfileColorProperty(MercuryElongationsNamespace, "locationPinRing", {
    default: "#ffffff",
    projector: "#ffffff",
  }),
  sightLineColorProperty: new ProfileColorProperty(MercuryElongationsNamespace, "sightLine", {
    default: "#f2c94c",
    projector: "#7a5b00",
  }),
  orbitBackgroundColorProperty: new ProfileColorProperty(MercuryElongationsNamespace, "orbitBackground", {
    default: "#070b15",
    projector: "#ffffff",
  }),
  controlSurfaceColorProperty: new ProfileColorProperty(MercuryElongationsNamespace, "controlSurface", {
    default: "#ffffff",
    projector: "#ffffff",
  }),
  controlSurfaceDisabledColorProperty: new ProfileColorProperty(MercuryElongationsNamespace, "controlSurfaceDisabled", {
    default: "#cccccc",
    projector: "#cccccc",
  }),
  controlSurfaceTextColorProperty: new ProfileColorProperty(MercuryElongationsNamespace, "controlSurfaceText", {
    default: "#1a1a1a",
    projector: "#1a1a1a",
  }),
};

export default MercuryElongationsColors;
