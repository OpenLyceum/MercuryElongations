import { ProfileColorProperty } from "scenerystack/scenery";
import MercuryElongationsNamespace from "./MercuryElongationsNamespace.js";

const profile = (name: string, dark: string, light: string): ProfileColorProperty =>
  new ProfileColorProperty(MercuryElongationsNamespace, name, { default: dark, projector: light });

const MercuryElongationsColors = {
  backgroundColorProperty: profile("background", "#080d1b", "#f7f9fc"),
  accentColorProperty: profile("accent", "#67d8ff", "#075985"),
  panelBackgroundColorProperty: profile("panelBackground", "#15213a", "#eef2f7"),
  panelBorderColorProperty: profile("panelBorder", "#365174", "#667085"),
  textColorProperty: profile("text", "#f3f7ff", "#172033"),
  mutedTextColorProperty: profile("mutedText", "#b8c7dd", "#475467"),
  skyColorProperty: profile("sky", "#07142e", "#dceeff"),
  skyZenithColorProperty: profile("skyZenith", "#020611", "#c9e6f7"),
  skyHorizonColorProperty: profile("skyHorizon", "#102b4f", "#eef8ff"),
  starColorProperty: profile("star", "#f4f7ff", "#526b80"),
  groundColorProperty: profile("ground", "#19251d", "#d7e5cf"),
  skyDayZenithColorProperty: profile("skyDayZenith", "#4a90d9", "#9ec5f0"),
  skyDayHorizonColorProperty: profile("skyDayHorizon", "#a8c8e8", "#c8daf0"),
  skyTwilightHorizonColorProperty: profile("skyTwilightHorizon", "#e09050", "#d08040"),
  groundDayColorProperty: profile("groundDay", "#3a4a38", "#8a9a78"),
  gridColorProperty: profile("grid", "#365f83", "#6b8499"),
  horizonColorProperty: profile("horizon", "#9bc9dd", "#36556a"),
  sunColorProperty: profile("sun", "#ffd34d", "#e5a800"),
  sunGlowColorProperty: profile("sunGlow", "#fff2a3", "#f7c948"),
  sunHighlightColorProperty: profile("sunHighlight", "#fff8cb", "#fff3a6"),
  sunLimbColorProperty: profile("sunLimb", "#e99b19", "#e99b19"),
  sunRimColorProperty: profile("sunRim", "#ffe999", "#ffe999"),
  mercuryColorProperty: profile("mercury", "#c7c2b8", "#615d55"),
  mercuryHighlightColorProperty: profile("mercuryHighlight", "#eee9df", "#aaa49b"),
  mercuryShadowColorProperty: profile("mercuryShadow", "#514d49", "#393633"),
  earthColorProperty: profile("earth", "#4aa8ff", "#1261a0"),
  earthOrbitColorProperty: profile("earthOrbit", "#4aa8ff", "#1261a0"),
  mercuryOrbitColorProperty: profile("mercuryOrbit", "#bdb7ae", "#615d55"),
  elongationColorProperty: profile("elongation", "#ff8ab3", "#b42355"),
  eventHighlightColorProperty: profile("eventHighlight", "#ffe066", "#8a5a00"),
  earthOceanColorProperty: profile("earthOcean", "#12325a", "#bcd6f0"),
  earthLandColorProperty: profile("earthLand", "#2f6b41", "#7cae82"),
  earthGraticuleColorProperty: profile("earthGraticule", "#5a7ba6", "#6b8fb5"),
  locationPinColorProperty: profile("locationPin", "#ff5a4d", "#d5342a"),
  /** Light ring around the pin so it reads on both land and ocean fills. */
  locationPinRingColorProperty: profile("locationPinRing", "#ffffff", "#ffffff"),
  sightLineColorProperty: profile("sightLine", "#f2c94c", "#7a5b00"),
  orbitBackgroundColorProperty: profile("orbitBackground", "#070b15", "#ffffff"),
  controlSurfaceColorProperty: profile("controlSurface", "#ffffff", "#ffffff"),
  controlSurfaceDisabledColorProperty: profile("controlSurfaceDisabled", "#cccccc", "#cccccc"),
  controlSurfaceTextColorProperty: profile("controlSurfaceText", "#1a1a1a", "#1a1a1a"),
};

export default MercuryElongationsColors;
