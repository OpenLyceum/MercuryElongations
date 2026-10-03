import {
  Body,
  Ecliptic,
  Elongation,
  Equator,
  HelioVector,
  Horizon,
  MakeTime,
  Observer,
  RotateVector,
  Rotation_EQJ_EQD,
  SiderealTime,
  Vector,
} from "astronomy-engine";
import { OBSERVER_ELEVATION_METERS } from "../../MercuryElongationsConstants.js";

export type ObserverLocation = {
  latitudeDeg: number;
  /** East-positive. */
  longitudeDeg: number;
};

export type HorizontalBodyState = {
  altitudeDeg: number;
  azimuthDeg: number;
  raHours: number;
  declinationDeg: number;
  distanceAu: number;
};

export type HeliocentricState = {
  xAu: number;
  yAu: number;
  zAu: number;
  distanceAu: number;
};

export type MercurySnapshot = {
  civilTimeMs: number;
  location: ObserverLocation;
  /** Local apparent sidereal time in hours, wrapped to [0, 24). */
  localSiderealTimeHours: number;
  sun: HorizontalBodyState;
  mercury: HorizontalBodyState;
  earthHeliocentric: HeliocentricState;
  mercuryHeliocentric: HeliocentricState;
  elongationDeg: number;
  direction: "east" | "west";
  visibility: "morning" | "evening";
};

/** Transform a J2000 catalog direction to the true equator of the simulated date. */
export const createCatalogToDateTransform = (civilTimeMs: number) => {
  const time = MakeTime(new Date(civilTimeMs));
  const rotation = Rotation_EQJ_EQD(time);
  return (raHours: number, declinationDeg: number): { raHours: number; declinationDeg: number } => {
    const ra = (raHours * Math.PI) / 12;
    const dec = (declinationDeg * Math.PI) / 180;
    const catalogVector = new Vector(Math.cos(dec) * Math.cos(ra), Math.cos(dec) * Math.sin(ra), Math.sin(dec), time);
    const ofDate = RotateVector(rotation, catalogVector);
    return {
      raHours: ((Math.atan2(ofDate.y, ofDate.x) * 12) / Math.PI + 24) % 24,
      declinationDeg: (Math.atan2(ofDate.z, Math.hypot(ofDate.x, ofDate.y)) * 180) / Math.PI,
    };
  };
};

/** Angular separation of two apparent horizon directions, including topocentric effects and refraction. */
export const apparentAngularSeparationDeg = (a: HorizontalBodyState, b: HorizontalBodyState): number => {
  const altitudeA = (a.altitudeDeg * Math.PI) / 180;
  const altitudeB = (b.altitudeDeg * Math.PI) / 180;
  const azimuthDifference = ((a.azimuthDeg - b.azimuthDeg) * Math.PI) / 180;
  const cosine =
    Math.sin(altitudeA) * Math.sin(altitudeB) + Math.cos(altitudeA) * Math.cos(altitudeB) * Math.cos(azimuthDifference);
  return (Math.acos(Math.max(-1, Math.min(1, cosine))) * 180) / Math.PI;
};

const horizontalState = (body: Body, civilTimeMs: number, observer: Observer): HorizontalBodyState => {
  const time = MakeTime(new Date(civilTimeMs));
  const equatorial = Equator(body, time, observer, true, true);
  const horizontal = Horizon(time, observer, equatorial.ra, equatorial.dec, "normal");
  return {
    altitudeDeg: horizontal.altitude,
    azimuthDeg: horizontal.azimuth,
    raHours: equatorial.ra,
    declinationDeg: equatorial.dec,
    distanceAu: equatorial.dist,
  };
};

export const heliocentricState = (body: Body.Earth | Body.Mercury, civilTimeMs: number): HeliocentricState => {
  const ecliptic = Ecliptic(HelioVector(body, new Date(civilTimeMs)));
  return {
    xAu: ecliptic.vec.x,
    yAu: ecliptic.vec.y,
    zAu: ecliptic.vec.z,
    distanceAu: ecliptic.vec.Length(),
  };
};

export const localSiderealTimeHours = (civilTimeMs: number, longitudeDeg: number): number =>
  (((SiderealTime(new Date(civilTimeMs)) + longitudeDeg / 15) % 24) + 24) % 24;

export const mercurySnapshot = (civilTimeMs: number, location: ObserverLocation): MercurySnapshot => {
  const observer = new Observer(location.latitudeDeg, location.longitudeDeg, OBSERVER_ELEVATION_METERS);
  const elongation = Elongation(Body.Mercury, new Date(civilTimeMs));
  const visibility = elongation.visibility === "morning" ? "morning" : "evening";
  return {
    civilTimeMs,
    location,
    localSiderealTimeHours: localSiderealTimeHours(civilTimeMs, location.longitudeDeg),
    sun: horizontalState(Body.Sun, civilTimeMs, observer),
    mercury: horizontalState(Body.Mercury, civilTimeMs, observer),
    earthHeliocentric: heliocentricState(Body.Earth, civilTimeMs),
    mercuryHeliocentric: heliocentricState(Body.Mercury, civilTimeMs),
    elongationDeg: elongation.elongation,
    direction: visibility === "evening" ? "east" : "west",
    visibility,
  };
};

export const sampleOrbit = (
  body: Body.Earth | Body.Mercury,
  centerCivilTimeMs: number,
  periodDays: number,
  sampleCount: number,
): readonly HeliocentricState[] => {
  const samples: HeliocentricState[] = [];
  const millisecondsPerDay = 86_400_000;
  for (let index = 0; index <= sampleCount; index++) {
    const fraction = index / sampleCount - 0.5;
    samples.push(heliocentricState(body, centerCivilTimeMs + fraction * periodDays * millisecondsPerDay));
  }
  return samples;
};
