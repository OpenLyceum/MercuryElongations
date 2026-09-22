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
  gridColorProperty: profile("grid", "#365f83", "#6b8499"),
  horizonColorProperty: profile("horizon", "#9bc9dd", "#36556a"),
  sunColorProperty: profile("sun", "#ffd34d", "#e5a800"),
  sunGlowColorProperty: profile("sunGlow", "#fff2a3", "#f7c948"),
  sunHighlightColorProperty: profile("sunHighlight", "#fff8cb", "#fff3a6"),
  mercuryColorProperty: profile("mercury", "#c7c2b8", "#615d55"),
  mercuryHighlightColorProperty: profile("mercuryHighlight", "#eee9df", "#aaa49b"),
  mercuryShadowColorProperty: profile("mercuryShadow", "#514d49", "#393633"),
  earthColorProperty: profile("earth", "#4aa8ff", "#1261a0"),
  earthOrbitColorProperty: profile("earthOrbit", "#4aa8ff", "#1261a0"),
  mercuryOrbitColorProperty: profile("mercuryOrbit", "#bdb7ae", "#615d55"),
  elongationColorProperty: profile("elongation", "#ff8ab3", "#b42355"),
  sightLineColorProperty: profile("sightLine", "#f2c94c", "#7a5b00"),
  orbitBackgroundColorProperty: profile("orbitBackground", "#070b15", "#ffffff"),
  controlSurfaceColorProperty: profile("controlSurface", "#ffffff", "#ffffff"),
  controlSurfaceDisabledColorProperty: profile("controlSurfaceDisabled", "#cccccc", "#cccccc"),
  controlSurfaceTextColorProperty: profile("controlSurfaceText", "#1a1a1a", "#1a1a1a"),
};

export default MercuryElongationsColors;
