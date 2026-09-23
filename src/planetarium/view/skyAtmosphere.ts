/**
 * skyAtmosphere.ts
 *
 * Pure helpers for the planetarium's optional atmosphere (ported from Zenith's
 * SkyTwilight and sky-horizon): sky colors and star wash-out from the Sun's
 * altitude, and the on-screen ground region below the horizon.
 *
 * Twilight bands: day (Sun ≥ 0°), civil (−6°…0°), nautical (−12°…−6°),
 * astronomical (−18°…−12°), night (Sun < −18°).
 */

import { clamp, type Vector2 } from "scenerystack/dot";
import { Shape } from "scenerystack/kite";
import { Color } from "scenerystack/scenery";

export const CIVIL_TWILIGHT_DEG = -6;
export const ASTRONOMICAL_TWILIGHT_DEG = -18;

export type TwilightPalette = {
  readonly nightZenith: Color;
  readonly nightHorizon: Color;
  readonly nightGround: Color;
  readonly dayZenith: Color;
  readonly dayHorizon: Color;
  readonly dayGround: Color;
  readonly twilightHorizon: Color;
};

export type TwilightSkyColors = {
  readonly zenith: Color;
  readonly horizon: Color;
  readonly ground: Color;
};

const smoothstep = (value: number, lo: number, hi: number): number => {
  const t = clamp((value - lo) / (hi - lo), 0, 1);
  return t * t * (3 - 2 * t);
};

/** Star opacity: 1 below astronomical twilight, 0 once the Sun is up, fading between. */
export const starVisibilityFromSolarAltitude = (solarAltitudeDeg: number): number => {
  if (solarAltitudeDeg <= ASTRONOMICAL_TWILIGHT_DEG) {
    return 1;
  }
  if (solarAltitudeDeg >= 0) {
    return 0;
  }
  return 1 - smoothstep(solarAltitudeDeg, ASTRONOMICAL_TWILIGHT_DEG, 0);
};

/** Zenith / horizon / ground colors for the Sun's altitude; the horizon warms through twilight. */
export const twilightSkyColors = (solarAltitudeDeg: number, palette: TwilightPalette): TwilightSkyColors => {
  const dayAmount = smoothstep(solarAltitudeDeg, ASTRONOMICAL_TWILIGHT_DEG, CIVIL_TWILIGHT_DEG + 6);
  const warmPeak = Math.exp(-0.5 * ((solarAltitudeDeg - CIVIL_TWILIGHT_DEG) / 4) ** 2);
  const baseHorizon = Color.interpolateRGBA(palette.nightHorizon, palette.dayHorizon, dayAmount);
  return {
    zenith: Color.interpolateRGBA(palette.nightZenith, palette.dayZenith, dayAmount),
    horizon: Color.interpolateRGBA(baseHorizon, palette.twilightHorizon, warmPeak * (1 - dayAmount * 0.35)),
    ground: Color.interpolateRGBA(palette.nightGround, palette.dayGround, dayAmount),
  };
};

/** Circle through three points, or null when they are (nearly) collinear. */
export const circleThroughPoints = (
  a: Vector2,
  b: Vector2,
  c: Vector2,
): { centerX: number; centerY: number; radius: number } | null => {
  const d = 2 * (a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y));
  if (Math.abs(d) < 1e-6) {
    return null;
  }
  const a2 = a.x * a.x + a.y * a.y;
  const b2 = b.x * b.x + b.y * b.y;
  const c2 = c.x * c.x + c.y * c.y;
  const centerX = (a2 * (b.y - c.y) + b2 * (c.y - a.y) + c2 * (a.y - b.y)) / d;
  const centerY = (a2 * (c.x - b.x) + b2 * (a.x - c.x) + c2 * (b.x - a.x)) / d;
  return { centerX, centerY, radius: Math.hypot(a.x - centerX, a.y - centerY) };
};

/**
 * The ground region (below the horizon) in view pixels. A stereographic projection
 * maps the horizon to a circle, so it is fitted from projected horizon samples; the
 * ground is whichever side does not contain the zenith (or does contain the nadir).
 * Near a level view the circle degenerates to a line, handled as a half-plane.
 *
 * @param horizonPoints - projected horizon samples (visible ones only)
 * @param zenithPoint - projected zenith, or null when culled
 * @param nadirPoint - projected nadir, or null when culled
 */
export const groundShape = (
  horizonPoints: readonly Vector2[],
  zenithPoint: Vector2 | null,
  nadirPoint: Vector2 | null,
  width: number,
  height: number,
): Shape | null => {
  const n = horizonPoints.length;
  if (n < 3 || !(zenithPoint || nadirPoint)) {
    return null;
  }
  const view = Shape.rect(0, 0, width, height);
  const diagonal = Math.hypot(width, height);
  const first = horizonPoints[0] as Vector2;
  const circle = circleThroughPoints(
    first,
    horizonPoints[(n / 3) | 0] as Vector2,
    horizonPoints[((2 * n) / 3) | 0] as Vector2,
  );

  if (circle && circle.radius < 8 * diagonal) {
    const disc = Shape.circle(circle.centerX, circle.centerY, circle.radius);
    const inside = (p: Vector2): boolean => Math.hypot(p.x - circle.centerX, p.y - circle.centerY) < circle.radius;
    const groundInside = zenithPoint ? !inside(zenithPoint) : inside(nadirPoint as Vector2);
    return groundInside ? disc : view.shapeDifference(disc);
  }

  // Level view: the horizon is (nearly) a straight line; fill the half-plane away from the zenith.
  const second = horizonPoints[(n / 2) | 0] as Vector2;
  if (first.distance(second) < 1e-3) {
    return null;
  }
  const dir = second.minus(first).normalized();
  let normal = dir.perpendicular;
  const reference = zenithPoint ?? (nadirPoint as Vector2);
  const referenceSide = normal.dot(reference.minus(first));
  if ((zenithPoint && referenceSide > 0) || (!zenithPoint && referenceSide < 0)) {
    normal = normal.negated();
  }
  const big = 4 * diagonal;
  const a = first.minus(dir.timesScalar(big));
  const c = second.plus(dir.timesScalar(big));
  return new Shape()
    .moveToPoint(a)
    .lineToPoint(c)
    .lineToPoint(c.plus(normal.timesScalar(big)))
    .lineToPoint(a.plus(normal.timesScalar(big)))
    .close();
};
