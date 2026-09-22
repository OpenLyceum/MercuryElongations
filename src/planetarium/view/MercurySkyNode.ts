import { SiderealTime } from "astronomy-engine";
import { Multilink } from "scenerystack/axon";
import { Vector2 } from "scenerystack/dot";
import { Shape } from "scenerystack/kite";
import { Circle, LinearGradient, Node, Path, RadialGradient, Rectangle, Text } from "scenerystack/scenery";
import { PhetFont } from "scenerystack/scenery-phet";
import { StringManager } from "../../i18n/StringManager.js";
import MercuryElongationsColors from "../../MercuryElongationsColors.js";
import { BEREA_LATITUDE_DEG, BEREA_LONGITUDE_DEG } from "../../MercuryElongationsConstants.js";
import {
  BRIGHT_STAR_COUNT,
  BRIGHT_STAR_DEC_DEG,
  BRIGHT_STAR_MAG,
  BRIGHT_STAR_RA_HOURS,
} from "../model/BrightStarCatalog.js";
import type { PlanetariumModel } from "../model/PlanetariumModel.js";

type Vec3 = { x: number; y: number; z: number };
type Point = { x: number; y: number };

const STAR_MAGNITUDE_LIMIT = 5.4;
const SKY_FIELD_OF_VIEW_DEG = 72;

const toRadians = (degrees: number): number => (degrees * Math.PI) / 180;
const normalize = (v: Vec3): Vec3 => {
  const length = Math.hypot(v.x, v.y, v.z);
  return { x: v.x / length, y: v.y / length, z: v.z / length };
};
const dot = (a: Vec3, b: Vec3): number => a.x * b.x + a.y * b.y + a.z * b.z;
const horizontalVector = (altitudeDeg: number, azimuthDeg: number): Vec3 => {
  const altitude = toRadians(altitudeDeg);
  const azimuth = toRadians(azimuthDeg);
  const cosAltitude = Math.cos(altitude);
  return { x: cosAltitude * Math.cos(azimuth), y: cosAltitude * Math.sin(azimuth), z: Math.sin(altitude) };
};

/** Converts a catalogue RA/Dec into Berea's north/east/up horizon frame. */
const equatorialToHorizonVector = (raHours: number, declinationDeg: number, localSiderealTimeHours: number): Vec3 => {
  const declination = toRadians(declinationDeg);
  const latitude = toRadians(BEREA_LATITUDE_DEG);
  const hourAngle = toRadians((localSiderealTimeHours - raHours) * 15);
  return {
    x: Math.sin(declination) * Math.cos(latitude) - Math.cos(declination) * Math.sin(latitude) * Math.cos(hourAngle),
    y: -Math.cos(declination) * Math.sin(hourAngle),
    z: Math.sin(latitude) * Math.sin(declination) + Math.cos(latitude) * Math.cos(declination) * Math.cos(hourAngle),
  };
};

class SkyProjection {
  private readonly width: number;
  private readonly height: number;
  private readonly forward: Vec3;
  private readonly right: Vec3;
  private readonly up: Vec3;
  private readonly focalPx: number;

  public constructor(width: number, height: number, forward: Vec3, fieldOfViewDeg: number) {
    this.width = width;
    this.height = height;
    this.forward = normalize(forward);
    const azimuth = Math.atan2(this.forward.y, this.forward.x);
    this.right = { x: -Math.sin(azimuth), y: Math.cos(azimuth), z: 0 };
    this.up = {
      x: this.forward.y * this.right.z - this.forward.z * this.right.y,
      y: this.forward.z * this.right.x - this.forward.x * this.right.z,
      z: this.forward.x * this.right.y - this.forward.y * this.right.x,
    };
    this.focalPx = width / (4 * Math.tan(toRadians(fieldOfViewDeg) / 4));
  }

  public project(vector: Vec3): Point | null {
    const z = dot(vector, this.forward);
    if (z < -0.6) {
      return null;
    }
    const scale = (2 * this.focalPx) / (1 + z);
    return {
      x: this.width / 2 + scale * dot(vector, this.right),
      y: this.height / 2 - scale * dot(vector, this.up),
    };
  }
}

const slerp = (a: Vec3, b: Vec3, fraction: number): Vec3 => {
  const angle = Math.acos(Math.max(-1, Math.min(1, dot(a, b))));
  if (angle < 1e-8) {
    return a;
  }
  const denominator = Math.sin(angle);
  const aScale = Math.sin((1 - fraction) * angle) / denominator;
  const bScale = Math.sin(fraction * angle) / denominator;
  return normalize({ x: aScale * a.x + bScale * b.x, y: aScale * a.y + bScale * b.y, z: aScale * a.z + bScale * b.z });
};

const moveBody = (node: Node, point: Point | null): void => {
  node.visible = point !== null;
  if (point) {
    node.center = new Vector2(point.x, point.y);
  }
};

const starRadius = (magnitude: number): number => {
  const fraction = Math.max(0, Math.min(1, (magnitude + 1.5) / (STAR_MAGNITUDE_LIMIT + 1.5)));
  return 2.3 - 1.7 * fraction;
};

export class MercurySkyNode extends Node {
  public constructor(model: PlanetariumModel, width: number, height: number) {
    super({ clipArea: Shape.rect(0, 0, width, height) });
    const system = model.system;
    const labels = StringManager.getInstance().getLabels();

    const skyGradient = new LinearGradient(0, 0, 0, height)
      .addColorStop(0, MercuryElongationsColors.skyZenithColorProperty)
      .addColorStop(1, MercuryElongationsColors.skyHorizonColorProperty);
    const background = new Rectangle(0, 0, width, height, { fill: skyGradient });
    const starsGlowPath = new Path(null, {
      fill: MercuryElongationsColors.starColorProperty,
      opacity: 0.18,
    });
    const starsPath = new Path(null, {
      fill: MercuryElongationsColors.starColorProperty,
      opacity: 0.82,
    });
    const gridPath = new Path(null, {
      stroke: MercuryElongationsColors.gridColorProperty,
      lineWidth: 1,
      opacity: 0.34,
    });
    const horizonPath = new Path(null, {
      stroke: MercuryElongationsColors.horizonColorProperty,
      lineWidth: 2.5,
    });
    const anglePath = new Path(null, { stroke: MercuryElongationsColors.elongationColorProperty, lineWidth: 3 });

    const sunGlowOuter = new Circle(43, { fill: MercuryElongationsColors.sunGlowColorProperty, opacity: 0.07 });
    const sunGlow = new Circle(29, { fill: MercuryElongationsColors.sunGlowColorProperty, opacity: 0.2 });
    const sunGradient = new RadialGradient(-6, -7, 0, 0, 0, 18)
      .addColorStop(0, MercuryElongationsColors.sunHighlightColorProperty)
      .addColorStop(0.7, MercuryElongationsColors.sunColorProperty)
      .addColorStop(1, "#e99b19");
    const sunNode = new Circle(18, { fill: sunGradient, stroke: "#ffe999", lineWidth: 0.8 });

    const mercuryGradient = new RadialGradient(-3, -3, 0, 0, 0, 10)
      .addColorStop(0, MercuryElongationsColors.mercuryHighlightColorProperty)
      .addColorStop(0.62, MercuryElongationsColors.mercuryColorProperty)
      .addColorStop(1, MercuryElongationsColors.mercuryShadowColorProperty);
    const mercuryNode = new Node({
      children: [
        new Circle(10, {
          fill: mercuryGradient,
          stroke: MercuryElongationsColors.textColorProperty,
          lineWidth: 0.8,
        }),
        new Circle(1.6, {
          fill: MercuryElongationsColors.mercuryShadowColorProperty,
          opacity: 0.42,
          centerX: -2.5,
          centerY: 2,
        }),
        new Circle(1.1, {
          fill: MercuryElongationsColors.mercuryShadowColorProperty,
          opacity: 0.32,
          centerX: 3,
          centerY: -2.8,
        }),
      ],
    });

    const labelOptions = {
      font: new PhetFont({ size: 14, weight: "bold" }),
      fill: MercuryElongationsColors.textColorProperty,
    };
    const sunLabel = new Text(labels.sunStringProperty, labelOptions);
    const mercuryLabel = new Text(labels.mercuryStringProperty, labelOptions);
    const angleLabel = new Text("", {
      font: new PhetFont({ size: 16, weight: "bold" }),
      fill: MercuryElongationsColors.elongationColorProperty,
    });
    const horizonLabel = new Text(labels.horizonStringProperty, {
      font: new PhetFont(12),
      fill: MercuryElongationsColors.horizonColorProperty,
    });
    const cardinalLabels = [
      { azimuth: 0, node: new Text(labels.northStringProperty, labelOptions) },
      { azimuth: 90, node: new Text(labels.eastCardinalStringProperty, labelOptions) },
      { azimuth: 180, node: new Text(labels.southStringProperty, labelOptions) },
      { azimuth: 270, node: new Text(labels.westCardinalStringProperty, labelOptions) },
    ];
    const sunAltitudeLabel = new Text("", {
      font: new PhetFont(13),
      fill: MercuryElongationsColors.mutedTextColorProperty,
    });
    const mercuryAltitudeLabel = new Text("", {
      font: new PhetFont(13),
      fill: MercuryElongationsColors.mutedTextColorProperty,
    });
    sunAltitudeLabel.left = 14;
    sunAltitudeLabel.bottom = height - 30;
    mercuryAltitudeLabel.left = 14;
    mercuryAltitudeLabel.bottom = height - 10;

    this.addChild(background);
    this.addChild(starsGlowPath);
    this.addChild(starsPath);
    this.addChild(gridPath);
    this.addChild(horizonPath);
    this.addChild(anglePath);
    this.addChild(sunGlowOuter);
    this.addChild(sunGlow);
    this.addChild(sunNode);
    this.addChild(mercuryNode);
    this.addChild(sunLabel);
    this.addChild(mercuryLabel);
    this.addChild(angleLabel);
    this.addChild(horizonLabel);
    for (const cardinal of cardinalLabels) {
      this.addChild(cardinal.node);
    }
    this.addChild(sunAltitudeLabel);
    this.addChild(mercuryAltitudeLabel);

    const drawSamples = (shape: Shape, samples: readonly Vec3[], projection: SkyProjection): void => {
      let previous: Point | null = null;
      for (const vector of samples) {
        const point = projection.project(vector);
        const continuous = point && previous && Math.hypot(point.x - previous.x, point.y - previous.y) < width / 2;
        if (point) {
          if (continuous) {
            shape.lineTo(point.x, point.y);
          } else {
            shape.moveTo(point.x, point.y);
          }
        }
        previous = point;
      }
    };

    const pathForSamples = (samples: readonly Vec3[], projection: SkyProjection): Shape => {
      const shape = new Shape();
      drawSamples(shape, samples, projection);
      return shape;
    };

    const redrawStars = (civilTimeMs: number, projection: SkyProjection): void => {
      const localSiderealTimeHours =
        (((SiderealTime(new Date(civilTimeMs)) + BEREA_LONGITUDE_DEG / 15) % 24) + 24) % 24;
      const starsShape = new Shape();
      const glowShape = new Shape();

      for (let index = 0; index < BRIGHT_STAR_COUNT; index++) {
        const magnitude = BRIGHT_STAR_MAG[index];
        if (magnitude === undefined || magnitude > STAR_MAGNITUDE_LIMIT) {
          break;
        }
        const raHours = BRIGHT_STAR_RA_HOURS[index];
        const declinationDeg = BRIGHT_STAR_DEC_DEG[index];
        if (raHours === undefined || declinationDeg === undefined) {
          continue;
        }
        const point = projection.project(equatorialToHorizonVector(raHours, declinationDeg, localSiderealTimeHours));
        if (!(point && point.x >= -4 && point.x <= width + 4 && point.y >= -4 && point.y <= height + 4)) {
          continue;
        }
        const radius = starRadius(magnitude);
        starsShape.moveTo(point.x + radius, point.y).arc(point.x, point.y, radius, 0, Math.PI * 2);
        if (magnitude <= 1.5) {
          const glowRadius = radius * 2.4;
          glowShape.moveTo(point.x + glowRadius, point.y).arc(point.x, point.y, glowRadius, 0, Math.PI * 2);
        }
      }
      starsPath.shape = starsShape;
      starsGlowPath.shape = glowShape;
    };

    Multilink.multilink(
      [
        system.snapshotProperty,
        model.skyViewModeProperty,
        labels.sunStringProperty,
        labels.mercuryStringProperty,
        labels.aboveHorizonStringProperty,
        labels.belowHorizonStringProperty,
      ],
      (snapshot, _viewMode, sunName, mercuryName, aboveHorizon, belowHorizon) => {
        const sunVector = horizontalVector(snapshot.sun.altitudeDeg, snapshot.sun.azimuthDeg);
        const mercuryVector = horizontalVector(snapshot.mercury.altitudeDeg, snapshot.mercury.azimuthDeg);
        const lookDirection = model.getLookDirection();
        const projection = new SkyProjection(
          width,
          height,
          horizontalVector(lookDirection.altitudeDeg, lookDirection.azimuthDeg),
          SKY_FIELD_OF_VIEW_DEG,
        );
        redrawStars(snapshot.civilTimeMs, projection);

        const sunPoint = projection.project(sunVector);
        const mercuryPoint = projection.project(mercuryVector);
        moveBody(sunGlowOuter, sunPoint);
        moveBody(sunGlow, sunPoint);
        moveBody(sunNode, sunPoint);
        moveBody(mercuryNode, mercuryPoint);
        moveBody(sunLabel, sunPoint ? { x: sunPoint.x, y: sunPoint.y - 31 } : null);
        moveBody(mercuryLabel, mercuryPoint ? { x: mercuryPoint.x, y: mercuryPoint.y - 24 } : null);

        const angleSamples = Array.from({ length: 33 }, (_, index) => slerp(sunVector, mercuryVector, index / 32));
        anglePath.shape = pathForSamples(angleSamples, projection);
        const midpoint = projection.project(slerp(sunVector, mercuryVector, 0.5));
        angleLabel.string = `${snapshot.elongationDeg.toFixed(2)}°`;
        moveBody(angleLabel, midpoint ? { x: midpoint.x, y: midpoint.y + 25 } : null);

        const horizonSamples = Array.from({ length: 181 }, (_, index) => horizontalVector(0, index * 2));
        horizonPath.shape = pathForSamples(horizonSamples, projection);
        const horizonAnchor = projection.project(horizontalVector(0, lookDirection.azimuthDeg));
        moveBody(horizonLabel, horizonAnchor ? { x: horizonAnchor.x, y: horizonAnchor.y + 14 } : null);

        const gridShape = new Shape();
        for (const altitude of [-60, -30, 30, 60]) {
          const samples = Array.from({ length: 121 }, (_, index) => horizontalVector(altitude, index * 3));
          drawSamples(gridShape, samples, projection);
        }
        for (let azimuth = 0; azimuth < 360; azimuth += 30) {
          const samples = Array.from({ length: 61 }, (_, index) => horizontalVector(-90 + index * 3, azimuth));
          drawSamples(gridShape, samples, projection);
        }
        gridPath.shape = gridShape;

        for (const cardinal of cardinalLabels) {
          moveBody(cardinal.node, projection.project(horizontalVector(0, cardinal.azimuth)));
        }

        const sunStatus = snapshot.sun.altitudeDeg >= 0 ? aboveHorizon : belowHorizon;
        const mercuryStatus = snapshot.mercury.altitudeDeg >= 0 ? aboveHorizon : belowHorizon;
        sunAltitudeLabel.string = `${sunName}: ${snapshot.sun.altitudeDeg.toFixed(1)}° (${sunStatus})`;
        mercuryAltitudeLabel.string = `${mercuryName}: ${snapshot.mercury.altitudeDeg.toFixed(1)}° (${mercuryStatus})`;
      },
    );
  }
}
