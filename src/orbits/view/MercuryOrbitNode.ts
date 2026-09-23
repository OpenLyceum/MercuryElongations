import { Body } from "astronomy-engine";
import { Multilink, type TReadOnlyProperty } from "scenerystack/axon";
import { Vector2 } from "scenerystack/dot";
import { Shape } from "scenerystack/kite";
import { Circle, Node, Path, Rectangle, Text } from "scenerystack/scenery";
import { PhetFont } from "scenerystack/scenery-phet";
import { type HeliocentricState, type MercurySnapshot, sampleOrbit } from "../../common/astronomy/mercuryEphemeris.js";
import { StringManager } from "../../i18n/StringManager.js";
import MercuryElongationsColors from "../../MercuryElongationsColors.js";
import {
  EARTH_ORBIT_DAYS,
  MERCURY_ORBIT_DAYS,
  ORBIT_SAMPLE_COUNT,
  ORBIT_SCALE_PX_PER_AU,
} from "../../MercuryElongationsConstants.js";
import type { OrbitsModel } from "../model/OrbitsModel.js";

type Point = { x: number; y: number };

export class MercuryOrbitNode extends Node {
  private orbitYear = Number.NaN;

  /**
   * @param currentEventNameProperty - name of the conjunction / greatest elongation happening now, or null
   */
  public constructor(
    orbitsModel: OrbitsModel,
    currentEventNameProperty: TReadOnlyProperty<string | null>,
    width: number,
    height: number,
  ) {
    super({ clipArea: Shape.rect(0, 0, width, height) });
    const model = orbitsModel.system;
    const labels = StringManager.getInstance().getLabels();
    // The Sun sits right of center, leaving a clear strip on the left for the events panel.
    const center = { x: width - ORBIT_SCALE_PX_PER_AU - 22, y: height / 2 - 4 };
    const map = (state: HeliocentricState): Point => ({
      x: center.x + state.xAu * ORBIT_SCALE_PX_PER_AU,
      y: center.y - state.yAu * ORBIT_SCALE_PX_PER_AU,
    });

    const background = new Rectangle(0, 0, width, height, {
      fill: MercuryElongationsColors.orbitBackgroundColorProperty,
    });
    const earthOrbitPath = new Path(null, {
      stroke: MercuryElongationsColors.earthOrbitColorProperty,
      lineWidth: 1.5,
      opacity: 0.75,
    });
    const mercuryOrbitPath = new Path(null, {
      stroke: MercuryElongationsColors.mercuryOrbitColorProperty,
      lineWidth: 1.5,
      opacity: 0.85,
    });
    const sightLinesPath = new Path(null, { stroke: MercuryElongationsColors.sightLineColorProperty, lineWidth: 2 });
    const anglePath = new Path(null, { stroke: MercuryElongationsColors.elongationColorProperty, lineWidth: 3 });
    const sunNode = new Circle(15, { fill: MercuryElongationsColors.sunColorProperty });
    const earthNode = new Circle(10, { fill: MercuryElongationsColors.earthColorProperty });
    const mercuryNode = new Circle(8, {
      fill: MercuryElongationsColors.mercuryColorProperty,
      stroke: MercuryElongationsColors.textColorProperty,
      lineWidth: 1,
    });
    sunNode.center = new Vector2(center.x, center.y);

    const labelOptions = {
      font: new PhetFont({ size: 14, weight: "bold" }),
      fill: MercuryElongationsColors.textColorProperty,
    };
    const sunLabel = new Text(labels.sunStringProperty, labelOptions);
    sunLabel.centerX = center.x;
    sunLabel.top = center.y + 19;
    const earthLabel = new Text(labels.earthStringProperty, labelOptions);
    const mercuryLabel = new Text(labels.mercuryStringProperty, labelOptions);
    const angleLabel = new Text("", {
      font: new PhetFont({ size: 16, weight: "bold" }),
      fill: MercuryElongationsColors.elongationColorProperty,
    });
    const note = new Text(labels.topViewNoteStringProperty, {
      font: new PhetFont(12),
      fill: MercuryElongationsColors.mutedTextColorProperty,
      maxWidth: width - 30,
    });
    note.centerX = center.x;
    note.bottom = height - 10;

    this.addChild(background);
    this.addChild(earthOrbitPath);
    this.addChild(mercuryOrbitPath);
    this.addChild(sightLinesPath);
    this.addChild(anglePath);
    this.addChild(sunNode);
    this.addChild(earthNode);
    this.addChild(mercuryNode);
    this.addChild(sunLabel);
    this.addChild(earthLabel);
    this.addChild(mercuryLabel);
    this.addChild(angleLabel);
    this.addChild(note);

    // Names the conjunction or greatest elongation as the clock passes through it.
    const eventLabel = new Text("", {
      font: new PhetFont({ size: 14, weight: "bold" }),
      fill: MercuryElongationsColors.eventHighlightColorProperty,
    });
    const eventRing = new Circle(14, { stroke: MercuryElongationsColors.eventHighlightColorProperty, lineWidth: 2 });
    this.addChild(eventRing);
    this.addChild(eventLabel);

    anglePath.visibleProperty = orbitsModel.showElongationProperty;
    angleLabel.visibleProperty = orbitsModel.showElongationProperty;

    const orbitShape = (samples: readonly HeliocentricState[]): Shape => {
      const shape = new Shape();
      samples.forEach((sample, index) => {
        const point = map(sample);
        if (index === 0) {
          shape.moveTo(point.x, point.y);
        } else {
          shape.lineTo(point.x, point.y);
        }
      });
      return shape;
    };

    const updateOrbitPaths = (civilTimeMs: number): void => {
      const year = new Date(civilTimeMs).getUTCFullYear();
      if (year === this.orbitYear) {
        return;
      }
      this.orbitYear = year;
      earthOrbitPath.shape = orbitShape(sampleOrbit(Body.Earth, civilTimeMs, EARTH_ORBIT_DAYS, ORBIT_SAMPLE_COUNT));
      mercuryOrbitPath.shape = orbitShape(
        sampleOrbit(Body.Mercury, civilTimeMs, MERCURY_ORBIT_DAYS, ORBIT_SAMPLE_COUNT),
      );
    };

    const updateBodies = (snapshot: MercurySnapshot): void => {
      updateOrbitPaths(snapshot.civilTimeMs);
      const earth = map(snapshot.earthHeliocentric);
      const mercury = map(snapshot.mercuryHeliocentric);
      earthNode.center = new Vector2(earth.x, earth.y);
      mercuryNode.center = new Vector2(mercury.x, mercury.y);
      earthLabel.centerX = earth.x;
      earthLabel.top = earth.y + 13;
      mercuryLabel.centerX = mercury.x;
      mercuryLabel.top = mercury.y + 12;

      sightLinesPath.shape = new Shape()
        .moveTo(earth.x, earth.y)
        .lineTo(center.x, center.y)
        .moveTo(earth.x, earth.y)
        .lineTo(mercury.x, mercury.y);

      const sunAngle = Math.atan2(center.y - earth.y, center.x - earth.x);
      const mercuryAngle = Math.atan2(mercury.y - earth.y, mercury.x - earth.x);
      let delta = mercuryAngle - sunAngle;
      while (delta > Math.PI) {
        delta -= 2 * Math.PI;
      }
      while (delta < -Math.PI) {
        delta += 2 * Math.PI;
      }
      const arcRadius = 48;
      anglePath.shape = new Shape().arc(earth.x, earth.y, arcRadius, sunAngle, sunAngle + delta, delta < 0);
      const midAngle = sunAngle + delta / 2;
      angleLabel.string = `${snapshot.elongationDeg.toFixed(2)}°`;
      angleLabel.centerX = earth.x + (arcRadius + 20) * Math.cos(midAngle);
      angleLabel.centerY = earth.y + (arcRadius + 20) * Math.sin(midAngle);
    };

    Multilink.multilink([model.snapshotProperty], updateBodies);

    Multilink.multilink([model.snapshotProperty, currentEventNameProperty], (snapshot, eventName) => {
      const mercury = map(snapshot.mercuryHeliocentric);
      eventRing.visible = eventLabel.visible = eventName !== null;
      eventRing.center = new Vector2(mercury.x, mercury.y);
      eventLabel.string = eventName ?? "";
      // Keep the label on the far side of Mercury from the Sun so it does not cover the Sun.
      const outward = new Vector2(mercury.x - center.x, mercury.y - center.y);
      const direction = outward.magnitude > 1e-6 ? outward.normalized() : new Vector2(0, -1);
      eventLabel.center = new Vector2(mercury.x, mercury.y).plus(
        direction.timesScalar(30 + (eventLabel.width / 2) * Math.abs(direction.x)),
      );
      eventLabel.left = Math.max(4, Math.min(width - eventLabel.width - 4, eventLabel.left));
    });
  }
}
