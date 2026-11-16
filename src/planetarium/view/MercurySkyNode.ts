import { Multilink } from "scenerystack/axon";
import { toFixed, Vector2 } from "scenerystack/dot";
import { Shape } from "scenerystack/kite";
import { StringUtils } from "scenerystack/phetcommon";
import {
  Circle,
  DragListener,
  KeyboardDragListener,
  KeyboardListener,
  LinearGradient,
  Node,
  Path,
  RadialGradient,
  Rectangle,
  Text,
} from "scenerystack/scenery";
import { AccessibleDraggableOptions, PhetFont } from "scenerystack/scenery-phet";
import { apparentAngularSeparationDeg, createCatalogToDateTransform } from "../../common/astronomy/mercuryEphemeris.js";
import MercuryElongationsHotkeyData from "../../common/MercuryElongationsHotkeyData.js";
import { StringManager } from "../../i18n/StringManager.js";
import MercuryElongationsColors from "../../MercuryElongationsColors.js";
import { LOOK_PAN_KEYBOARD_STEP_DEG, MERCURY_SKY_NODE_SETTINGS } from "../../MercuryElongationsConstants.js";
import {
  BRIGHT_STAR_COUNT,
  BRIGHT_STAR_DEC_DEG,
  BRIGHT_STAR_MAG,
  BRIGHT_STAR_RA_HOURS,
} from "../model/BrightStarCatalog.js";
import type { PlanetariumModel } from "../model/PlanetariumModel.js";
import { createCameraStateProperty } from "./cameraState.js";
import { groundShape, starVisibilityFromSolarAltitude, twilightSkyColors } from "./skyAtmosphere.js";

type Vec3 = { x: number; y: number; z: number };
type Point = { x: number; y: number };

const STAR_MAGNITUDE_LIMIT: number = MERCURY_SKY_NODE_SETTINGS.STAR_MAGNITUDE_LIMIT;
/** Zoom factor per wheel notch. */
const WHEEL_ZOOM_FACTOR: number = MERCURY_SKY_NODE_SETTINGS.WHEEL_ZOOM_FACTOR;

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

/** Horizon directions every 2° of azimuth, used to fit the ground region. */
const HORIZON_SAMPLES: readonly Vec3[] = Array.from({ length: 180 }, (_, index) => horizontalVector(0, index * 2));

/** The horizon line: the same 2° samples, closed back at 360° so the stroke has no gap. */
const HORIZON_LINE_SAMPLES: readonly Vec3[] = Array.from({ length: 181 }, (_, index) => horizontalVector(0, index * 2));

/** Label offsets from the body or arc they name, view px (negative is above). */
const SUN_LABEL_OFFSET_Y: number = MERCURY_SKY_NODE_SETTINGS.SUN_LABEL_OFFSET_Y;
const MERCURY_LABEL_OFFSET_Y: number = MERCURY_SKY_NODE_SETTINGS.MERCURY_LABEL_OFFSET_Y;
const ANGLE_LABEL_OFFSET_Y: number = MERCURY_SKY_NODE_SETTINGS.ANGLE_LABEL_OFFSET_Y;
const HORIZON_LABEL_OFFSET_Y: number = MERCURY_SKY_NODE_SETTINGS.HORIZON_LABEL_OFFSET_Y;

/** Converts a catalogue RA/Dec into the observer's north/east/up horizon frame. */
const equatorialToHorizonVector = (
  raHours: number,
  declinationDeg: number,
  latitudeDeg: number,
  localSiderealTimeHours: number,
): Vec3 => {
  const declination = toRadians(declinationDeg);
  const latitude = toRadians(latitudeDeg);
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

    const background = new Rectangle(0, 0, width, height);
    const groundPath = new Path(null, { opacity: MERCURY_SKY_NODE_SETTINGS.GROUND_PATH_OPACITY });
    const starsGlowPath = new Path(null, {
      fill: MercuryElongationsColors.starColorProperty,
      opacity: MERCURY_SKY_NODE_SETTINGS.STARS_GLOW_PATH_OPACITY,
    });
    const starsPath = new Path(null, {
      fill: MercuryElongationsColors.starColorProperty,
      opacity: MERCURY_SKY_NODE_SETTINGS.STARS_PATH_OPACITY,
    });
    const gridPath = new Path(null, {
      stroke: MercuryElongationsColors.gridColorProperty,
      lineWidth: 1,
      opacity: MERCURY_SKY_NODE_SETTINGS.GRID_PATH_OPACITY,
    });
    const horizonPath = new Path(null, {
      stroke: MercuryElongationsColors.horizonColorProperty,
      lineWidth: MERCURY_SKY_NODE_SETTINGS.HORIZON_PATH_LINE_WIDTH,
    });
    const anglePath = new Path(null, {
      stroke: MercuryElongationsColors.elongationColorProperty,
      lineWidth: MERCURY_SKY_NODE_SETTINGS.ANGLE_PATH_LINE_WIDTH,
    });

    const sunGlowOuter = new Circle(MERCURY_SKY_NODE_SETTINGS.SUN_GLOW_OUTER_RADIUS, {
      fill: MercuryElongationsColors.sunGlowColorProperty,
      opacity: MERCURY_SKY_NODE_SETTINGS.SUN_GLOW_OUTER_OPACITY,
    });
    const sunGlow = new Circle(MERCURY_SKY_NODE_SETTINGS.SUN_GLOW_RADIUS, {
      fill: MercuryElongationsColors.sunGlowColorProperty,
      opacity: MERCURY_SKY_NODE_SETTINGS.SUN_GLOW_OPACITY,
    });
    const sunGradient = new RadialGradient(-6, -7, 0, 0, 0, 18)
      .addColorStop(0, MercuryElongationsColors.sunHighlightColorProperty)
      .addColorStop(0.7, MercuryElongationsColors.sunColorProperty)
      .addColorStop(1, MercuryElongationsColors.sunLimbColorProperty);
    const sunNode = new Circle(MERCURY_SKY_NODE_SETTINGS.SUN_NODE_RADIUS, {
      fill: sunGradient,
      stroke: MercuryElongationsColors.sunRimColorProperty,
      lineWidth: MERCURY_SKY_NODE_SETTINGS.SUN_NODE_LINE_WIDTH,
    });

    const mercuryGradient = new RadialGradient(-3, -3, 0, 0, 0, 10)
      .addColorStop(0, MercuryElongationsColors.mercuryHighlightColorProperty)
      .addColorStop(0.62, MercuryElongationsColors.mercuryColorProperty)
      .addColorStop(1, MercuryElongationsColors.mercuryShadowColorProperty);
    const mercuryNode = new Node({
      children: [
        new Circle(MERCURY_SKY_NODE_SETTINGS.MERCURY_NODE_RADIUS, {
          fill: mercuryGradient,
          stroke: MercuryElongationsColors.textColorProperty,
          lineWidth: MERCURY_SKY_NODE_SETTINGS.MERCURY_NODE_LINE_WIDTH,
        }),
        new Circle(MERCURY_SKY_NODE_SETTINGS.MERCURY_NODE_RADIUS_SEGMENT_2, {
          fill: MercuryElongationsColors.mercuryShadowColorProperty,
          opacity: MERCURY_SKY_NODE_SETTINGS.MERCURY_NODE_OPACITY,
          centerX: MERCURY_SKY_NODE_SETTINGS.MERCURY_NODE_CENTER_X,
          centerY: MERCURY_SKY_NODE_SETTINGS.MERCURY_NODE_CENTER_Y,
        }),
        new Circle(MERCURY_SKY_NODE_SETTINGS.MERCURY_NODE_RADIUS_SEGMENT_3, {
          fill: MercuryElongationsColors.mercuryShadowColorProperty,
          opacity: MERCURY_SKY_NODE_SETTINGS.MERCURY_NODE_ITEM_3_OPACITY,
          centerX: MERCURY_SKY_NODE_SETTINGS.MERCURY_NODE_ITEM_3_CENTER_X,
          centerY: MERCURY_SKY_NODE_SETTINGS.MERCURY_NODE_ITEM_3_CENTER_Y,
        }),
      ],
    });

    const labelOptions = {
      font: new PhetFont({ size: MERCURY_SKY_NODE_SETTINGS.LABEL_OPTIONS_FONT_SIZE, weight: "bold" }),
      fill: MercuryElongationsColors.textColorProperty,
    };
    const sunLabel = new Text(labels.sunStringProperty, labelOptions);
    const mercuryLabel = new Text(labels.mercuryStringProperty, labelOptions);
    const angleLabel = new Text("", {
      font: new PhetFont({ size: MERCURY_SKY_NODE_SETTINGS.ANGLE_LABEL_FONT_SIZE, weight: "bold" }),
      fill: MercuryElongationsColors.elongationColorProperty,
    });
    const horizonLabel = new Text(labels.horizonStringProperty, {
      font: new PhetFont(MERCURY_SKY_NODE_SETTINGS.HORIZON_LABEL_FONT_SIZE),
      fill: MercuryElongationsColors.horizonColorProperty,
    });
    const cardinalLabels = [
      { azimuth: 0, node: new Text(labels.northStringProperty, labelOptions) },
      { azimuth: 90, node: new Text(labels.eastCardinalStringProperty, labelOptions) },
      { azimuth: 180, node: new Text(labels.southStringProperty, labelOptions) },
      { azimuth: 270, node: new Text(labels.westCardinalStringProperty, labelOptions) },
    ];
    const sunAltitudeLabel = new Text("", {
      font: new PhetFont(MERCURY_SKY_NODE_SETTINGS.SUN_ALTITUDE_LABEL_FONT_SIZE),
      fill: MercuryElongationsColors.mutedTextColorProperty,
    });
    const mercuryAltitudeLabel = new Text("", {
      font: new PhetFont(MERCURY_SKY_NODE_SETTINGS.MERCURY_ALTITUDE_LABEL_FONT_SIZE),
      fill: MercuryElongationsColors.mutedTextColorProperty,
    });
    sunAltitudeLabel.left = MERCURY_SKY_NODE_SETTINGS.ALTITUDE_LABEL_LEFT;
    sunAltitudeLabel.bottom = height - MERCURY_SKY_NODE_SETTINGS.CONSTRUCTOR_BOTTOM_OFFSET;
    mercuryAltitudeLabel.left = MERCURY_SKY_NODE_SETTINGS.ALTITUDE_LABEL_LEFT;
    mercuryAltitudeLabel.bottom = height - 10;

    this.addChild(background);
    this.addChild(starsGlowPath);
    this.addChild(starsPath);
    this.addChild(gridPath);
    this.addChild(groundPath);
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

    const hint = new Text(StringManager.getInstance().getControls().skyHintStringProperty, {
      font: new PhetFont(MERCURY_SKY_NODE_SETTINGS.HINT_FONT_SIZE),
      fill: MercuryElongationsColors.textColorProperty,
      opacity: MERCURY_SKY_NODE_SETTINGS.HINT_OPACITY,
      maxWidth: width / 2 - MERCURY_SKY_NODE_SETTINGS.HINT_MAX_WIDTH_OFFSET,
      pickable: false,
    });
    hint.boundsProperty.link(() => {
      hint.right = width - MERCURY_SKY_NODE_SETTINGS.CONSTRUCTOR_RIGHT_OFFSET;
      hint.bottom = height - 10;
    });
    this.addChild(hint);

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

    const colors = MercuryElongationsColors;
    const redrawStars = (
      civilTimeMs: number,
      latitudeDeg: number,
      localSiderealTimeHours: number,
      projection: SkyProjection,
    ): void => {
      const starsShape = new Shape();
      const glowShape = new Shape();
      const catalogToDate = createCatalogToDateTransform(civilTimeMs);

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
        const ofDate = catalogToDate(raHours, declinationDeg);
        const point = projection.project(
          equatorialToHorizonVector(ofDate.raHours, ofDate.declinationDeg, latitudeDeg, localSiderealTimeHours),
        );
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

    /**
     * Sky gradient, ground, and star fading. Without the atmosphere the sky keeps its
     * fixed night gradient, no ground is drawn, and every star shows.
     * @returns star opacity in [0, 1]
     */
    const drawAtmosphere = (solarAltitudeDeg: number, projection: SkyProjection): number => {
      const showAtmosphere = model.showAtmosphereProperty.value;
      const skyColors = twilightSkyColors(showAtmosphere ? solarAltitudeDeg : -90, {
        nightZenith: colors.skyZenithColorProperty.value,
        nightHorizon: colors.skyHorizonColorProperty.value,
        nightGround: colors.groundColorProperty.value,
        dayZenith: colors.skyDayZenithColorProperty.value,
        dayHorizon: colors.skyDayHorizonColorProperty.value,
        dayGround: colors.groundDayColorProperty.value,
        twilightHorizon: colors.skyTwilightHorizonColorProperty.value,
      });
      background.fill = new LinearGradient(0, 0, 0, height)
        .addColorStop(0, skyColors.zenith)
        .addColorStop(1, skyColors.horizon);

      groundPath.visible = showAtmosphere;
      if (showAtmosphere) {
        const toVector2 = (point: Point | null): Vector2 | null => (point ? new Vector2(point.x, point.y) : null);
        groundPath.fill = skyColors.ground;
        groundPath.shape = groundShape(
          HORIZON_SAMPLES.flatMap((vector) => toVector2(projection.project(vector)) ?? []),
          toVector2(projection.project({ x: 0, y: 0, z: 1 })),
          toVector2(projection.project({ x: 0, y: 0, z: -1 })),
          width,
          height,
        );
      }

      const starVisibility = showAtmosphere ? starVisibilityFromSolarAltitude(solarAltitudeDeg) : 1;
      starsPath.opacity = 0.82 * starVisibility;
      starsGlowPath.opacity = 0.18 * starVisibility;
      return starVisibility;
    };

    Multilink.multilinkAny(
      [
        system.snapshotProperty,
        model.skyViewModeProperty,
        model.fixedLookAzimuthDegProperty,
        model.fixedLookAltitudeDegProperty,
        model.fieldOfViewDegProperty,
        model.showAtmosphereProperty,
        model.showCardinalsProperty,
        labels.sunStringProperty,
        labels.mercuryStringProperty,
        labels.aboveHorizonStringProperty,
        labels.belowHorizonStringProperty,
        labels.altitudeReadoutPatternStringProperty,
        colors.skyZenithColorProperty,
        colors.skyHorizonColorProperty,
        colors.skyDayZenithColorProperty,
        colors.skyDayHorizonColorProperty,
        colors.skyTwilightHorizonColorProperty,
        colors.groundColorProperty,
        colors.groundDayColorProperty,
      ],
      () => {
        const snapshot = system.snapshotProperty.value;
        const sunName = labels.sunStringProperty.value;
        const mercuryName = labels.mercuryStringProperty.value;
        const aboveHorizon = labels.aboveHorizonStringProperty.value;
        const belowHorizon = labels.belowHorizonStringProperty.value;
        const sunVector = horizontalVector(snapshot.sun.altitudeDeg, snapshot.sun.azimuthDeg);
        const mercuryVector = horizontalVector(snapshot.mercury.altitudeDeg, snapshot.mercury.azimuthDeg);
        const lookDirection = model.getLookDirection();
        const projection = new SkyProjection(
          width,
          height,
          horizontalVector(lookDirection.altitudeDeg, lookDirection.azimuthDeg),
          model.fieldOfViewDegProperty.value,
        );

        const starVisibility = drawAtmosphere(snapshot.sun.altitudeDeg, projection);
        if (starVisibility > 0) {
          redrawStars(snapshot.civilTimeMs, snapshot.location.latitudeDeg, snapshot.localSiderealTimeHours, projection);
        }

        const sunPoint = projection.project(sunVector);
        const mercuryPoint = projection.project(mercuryVector);
        moveBody(sunGlowOuter, sunPoint);
        moveBody(sunGlow, sunPoint);
        moveBody(sunNode, sunPoint);
        moveBody(mercuryNode, mercuryPoint);
        moveBody(sunLabel, sunPoint ? { x: sunPoint.x, y: sunPoint.y + SUN_LABEL_OFFSET_Y } : null);
        moveBody(mercuryLabel, mercuryPoint ? { x: mercuryPoint.x, y: mercuryPoint.y + MERCURY_LABEL_OFFSET_Y } : null);

        const angleSamples = Array.from({ length: 33 }, (_, index) => slerp(sunVector, mercuryVector, index / 32));
        anglePath.shape = pathForSamples(angleSamples, projection);
        const midpoint = projection.project(slerp(sunVector, mercuryVector, 0.5));
        angleLabel.string = `${toFixed(apparentAngularSeparationDeg(snapshot.sun, snapshot.mercury), 2)}°`;
        moveBody(angleLabel, midpoint ? { x: midpoint.x, y: midpoint.y + ANGLE_LABEL_OFFSET_Y } : null);

        horizonPath.shape = pathForSamples(HORIZON_LINE_SAMPLES, projection);
        const horizonAnchor = projection.project(horizontalVector(0, lookDirection.azimuthDeg));
        moveBody(
          horizonLabel,
          horizonAnchor ? { x: horizonAnchor.x, y: horizonAnchor.y + HORIZON_LABEL_OFFSET_Y } : null,
        );

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
          cardinal.node.visible &&= model.showCardinalsProperty.value;
        }

        const sunStatus = snapshot.sun.altitudeDeg >= 0 ? aboveHorizon : belowHorizon;
        const mercuryStatus = snapshot.mercury.altitudeDeg >= 0 ? aboveHorizon : belowHorizon;
        // A localized pattern ("Soleil : …" in French), and toFixedLTR so a negative
        // altitude keeps its sign in place in right-to-left text.
        const altitudePattern = labels.altitudeReadoutPatternStringProperty.value;
        sunAltitudeLabel.string = StringUtils.fillIn(altitudePattern, {
          body: sunName,
          altitude: StringUtils.toFixedLTR(snapshot.sun.altitudeDeg, 1),
          status: sunStatus,
        });
        mercuryAltitudeLabel.string = StringUtils.fillIn(altitudePattern, {
          body: mercuryName,
          altitude: StringUtils.toFixedLTR(snapshot.mercury.altitudeDeg, 1),
          status: mercuryStatus,
        });
      },
    );

    // ── Interaction: drag or arrow keys look around; wheel or +/− zoom ─────────
    const a11y = StringManager.getInstance().getPlanetariumA11yStrings().controls;
    const cameraStateProperty = createCameraStateProperty(model);
    this.mutate({
      ...AccessibleDraggableOptions,
      accessibleName: a11y.skyViewStringProperty,
      accessibleHelpText: a11y.skyViewHelpStringProperty,
      cursor: "grab",
    });

    // Grab-and-drag: the sky follows the pointer, so dragging right turns the camera left.
    const degreesPerPixel = (): number => model.fieldOfViewDegProperty.value / width;
    let lastPoint: Vector2 | null = null;
    this.addInputListener(
      new DragListener({
        start: (event) => {
          lastPoint = this.globalToLocalPoint(event.pointer.point);
        },
        drag: (event) => {
          const point = this.globalToLocalPoint(event.pointer.point);
          if (lastPoint) {
            const scale = degreesPerPixel();
            model.panBy(-(point.x - lastPoint.x) * scale, (point.y - lastPoint.y) * scale);
          }
          lastPoint = point;
        },
        end: () => {
          lastPoint = null;
        },
      }),
    );

    // Arrows and WASD pan. Up is -y in the listener; altitude increases upward.
    // Zoom stays on its own listener so the drag listener does not claim +/−.
    this.addInputListener(
      new KeyboardDragListener({
        dragDelta: LOOK_PAN_KEYBOARD_STEP_DEG,
        shiftDragDelta: LOOK_PAN_KEYBOARD_STEP_DEG / 3,
        drag: (_event, listener) => {
          model.panBy(listener.modelDelta.x, -listener.modelDelta.y);
          this.addAccessibleResponse(cameraStateProperty.value);
        },
      }),
    );

    this.addInputListener(
      new KeyboardListener({
        keyStringProperties: [
          ...MercuryElongationsHotkeyData.ZOOM_IN.keyStringProperties,
          ...MercuryElongationsHotkeyData.ZOOM_OUT.keyStringProperties,
        ],
        fireOnHold: true,
        fire: (_event, keysPressed) => {
          if (MercuryElongationsHotkeyData.ZOOM_OUT.hasKeyStroke(keysPressed)) {
            model.zoomOut();
          } else {
            model.zoomIn();
          }
          this.addAccessibleResponse(cameraStateProperty.value);
        },
      }),
    );

    this.addInputListener({
      wheel: (event) => {
        const domEvent = event.domEvent;
        if (domEvent instanceof WheelEvent && domEvent.deltaY !== 0) {
          model.zoomBy(domEvent.deltaY > 0 ? WHEEL_ZOOM_FACTOR : 1 / WHEEL_ZOOM_FACTOR);
          event.abort();
        }
      },
    });
  }
}
