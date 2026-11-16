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
import { MERCURY_ELONGATIONS_SCREEN_ICONS_SETTINGS } from "../MercuryElongationsConstants.js";

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
  const measureLine = new Path(
    new Shape()
      .moveTo(
        MERCURY_ELONGATIONS_SCREEN_ICONS_SETTINGS.MEASURE_LINE_X,
        MERCURY_ELONGATIONS_SCREEN_ICONS_SETTINGS.MEASURE_LINE_Y,
      )
      .lineTo(
        MERCURY_ELONGATIONS_SCREEN_ICONS_SETTINGS.MEASURE_LINE_X_SEGMENT_2,
        MERCURY_ELONGATIONS_SCREEN_ICONS_SETTINGS.MEASURE_LINE_Y_SEGMENT_2,
      ),
    {
      stroke: MercuryElongationsColors.elongationColorProperty,
      lineWidth: MERCURY_ELONGATIONS_SCREEN_ICONS_SETTINGS.MEASURE_LINE_LINE_WIDTH,
    },
  );
  return iconFrom(
    new Node({
      children: [
        background(),
        new Path(
          new Shape()
            .moveTo(0, MERCURY_ELONGATIONS_SCREEN_ICONS_SETTINGS.CREATE_PLANETARIUM_ICON_Y)
            .quadraticCurveTo(
              MERCURY_ELONGATIONS_SCREEN_ICONS_SETTINGS.CREATE_PLANETARIUM_ICON_CONTROL_X,
              MERCURY_ELONGATIONS_SCREEN_ICONS_SETTINGS.CREATE_PLANETARIUM_ICON_CONTROL_Y,
              W,
              MERCURY_ELONGATIONS_SCREEN_ICONS_SETTINGS.CREATE_PLANETARIUM_ICON_END_Y,
            ),
          {
            stroke: MercuryElongationsColors.horizonColorProperty,
            lineWidth: MERCURY_ELONGATIONS_SCREEN_ICONS_SETTINGS.CREATE_PLANETARIUM_ICON_LINE_WIDTH,
          },
        ),
        measureLine,
        new Circle(MERCURY_ELONGATIONS_SCREEN_ICONS_SETTINGS.CREATE_PLANETARIUM_ICON_RADIUS, {
          centerX: MERCURY_ELONGATIONS_SCREEN_ICONS_SETTINGS.CREATE_PLANETARIUM_ICON_CENTER_X,
          centerY: MERCURY_ELONGATIONS_SCREEN_ICONS_SETTINGS.CREATE_PLANETARIUM_ICON_CENTER_Y,
          fill: MercuryElongationsColors.sunGlowColorProperty,
          opacity: MERCURY_ELONGATIONS_SCREEN_ICONS_SETTINGS.CREATE_PLANETARIUM_ICON_OPACITY,
        }),
        new Circle(MERCURY_ELONGATIONS_SCREEN_ICONS_SETTINGS.CREATE_PLANETARIUM_ICON_RADIUS_SEGMENT_2, {
          centerX: MERCURY_ELONGATIONS_SCREEN_ICONS_SETTINGS.CREATE_PLANETARIUM_ICON_CENTER_X,
          centerY: MERCURY_ELONGATIONS_SCREEN_ICONS_SETTINGS.CREATE_PLANETARIUM_ICON_CENTER_Y,
          fill: MercuryElongationsColors.sunColorProperty,
        }),
        new Circle(MERCURY_ELONGATIONS_SCREEN_ICONS_SETTINGS.CREATE_PLANETARIUM_ICON_RADIUS_SEGMENT_3, {
          centerX: MERCURY_ELONGATIONS_SCREEN_ICONS_SETTINGS.CREATE_PLANETARIUM_ICON_ITEM_6_CENTER_X,
          centerY: MERCURY_ELONGATIONS_SCREEN_ICONS_SETTINGS.CREATE_PLANETARIUM_ICON_ITEM_6_CENTER_Y,
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
        new Circle(MERCURY_ELONGATIONS_SCREEN_ICONS_SETTINGS.CREATE_ORBITS_ICON_RADIUS, {
          centerX: W / 2,
          centerY: H / 2,
          fill: null,
          stroke: MercuryElongationsColors.earthOrbitColorProperty,
          lineWidth: MERCURY_ELONGATIONS_SCREEN_ICONS_SETTINGS.CREATE_ORBITS_ICON_LINE_WIDTH,
        }),
        new Circle(MERCURY_ELONGATIONS_SCREEN_ICONS_SETTINGS.CREATE_ORBITS_ICON_RADIUS_SEGMENT_2, {
          centerX: W / 2,
          centerY: H / 2,
          fill: null,
          stroke: MercuryElongationsColors.mercuryOrbitColorProperty,
          lineWidth: MERCURY_ELONGATIONS_SCREEN_ICONS_SETTINGS.CREATE_ORBITS_ICON_LINE_WIDTH,
        }),
        new Circle(MERCURY_ELONGATIONS_SCREEN_ICONS_SETTINGS.CREATE_ORBITS_ICON_RADIUS_SEGMENT_3, {
          centerX: W / 2,
          centerY: H / 2,
          fill: MercuryElongationsColors.sunColorProperty,
        }),
        new Circle(MERCURY_ELONGATIONS_SCREEN_ICONS_SETTINGS.CREATE_ORBITS_ICON_RADIUS_SEGMENT_4, {
          centerX: W / 2 + MERCURY_ELONGATIONS_SCREEN_ICONS_SETTINGS.CREATE_ORBITS_ICON_CENTER_X_OFFSET,
          centerY: H / 2 - MERCURY_ELONGATIONS_SCREEN_ICONS_SETTINGS.CREATE_ORBITS_ICON_CENTER_Y_OFFSET,
          fill: MercuryElongationsColors.earthColorProperty,
        }),
        new Circle(MERCURY_ELONGATIONS_SCREEN_ICONS_SETTINGS.CREATE_ORBITS_ICON_RADIUS_SEGMENT_5, {
          centerX: W / 2 - 54,
          centerY: H / 2 + 30,
          fill: MercuryElongationsColors.mercuryColorProperty,
        }),
      ],
    }),
  );
}
