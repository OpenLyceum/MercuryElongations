/**
 * MercuryElongationsScreenIcons.ts
 *
 * Programmatic home-screen / navigation-bar icons for each screen.
 * Drawn on the standard PhET 548 × 373 canvas using MercuryElongationsColors.
 */
import { Shape } from "scenerystack/kite";
import { Circle, Node, Path, Rectangle } from "scenerystack/scenery";
import { ScreenIcon } from "scenerystack/sim";
import MercuryElongationsColors from "../MercuryElongationsColors.js";

const W = 548;
const H = 373;

function background(): Rectangle {
  return new Rectangle(0, 0, W, H, { fill: MercuryElongationsColors.backgroundColorProperty });
}

function iconFrom(content: Node): ScreenIcon {
  return new ScreenIcon(content, {
    maxIconWidthProportion: 1,
    maxIconHeightProportion: 1,
    fill: MercuryElongationsColors.backgroundColorProperty,
  });
}

export function createPlanetariumIcon(): ScreenIcon {
  const measureLine = new Path(new Shape().moveTo(175, 245).lineTo(365, 165), {
    stroke: MercuryElongationsColors.elongationColorProperty,
    lineWidth: 8,
  });
  return iconFrom(
    new Node({
      children: [
        background(),
        new Path(new Shape().moveTo(0, 300).quadraticCurveTo(274, 235, W, 300), {
          stroke: MercuryElongationsColors.horizonColorProperty,
          lineWidth: 4,
        }),
        measureLine,
        new Circle(42, {
          centerX: 365,
          centerY: 165,
          fill: MercuryElongationsColors.sunGlowColorProperty,
          opacity: 0.3,
        }),
        new Circle(29, { centerX: 365, centerY: 165, fill: MercuryElongationsColors.sunColorProperty }),
        new Circle(17, {
          centerX: 175,
          centerY: 245,
          fill: MercuryElongationsColors.mercuryColorProperty,
          stroke: MercuryElongationsColors.textColorProperty,
        }),
      ],
    }),
  );
}

export function createOrbitsIcon(): ScreenIcon {
  return iconFrom(
    new Node({
      children: [
        background(),
        new Circle(145, {
          centerX: W / 2,
          centerY: H / 2,
          fill: null,
          stroke: MercuryElongationsColors.earthOrbitColorProperty,
          lineWidth: 5,
        }),
        new Circle(62, {
          centerX: W / 2,
          centerY: H / 2,
          fill: null,
          stroke: MercuryElongationsColors.mercuryOrbitColorProperty,
          lineWidth: 5,
        }),
        new Circle(25, { centerX: W / 2, centerY: H / 2, fill: MercuryElongationsColors.sunColorProperty }),
        new Circle(16, {
          centerX: W / 2 + 128,
          centerY: H / 2 - 68,
          fill: MercuryElongationsColors.earthColorProperty,
        }),
        new Circle(13, {
          centerX: W / 2 - 54,
          centerY: H / 2 + 30,
          fill: MercuryElongationsColors.mercuryColorProperty,
        }),
      ],
    }),
  );
}
