import {
  Body,
  Ecliptic,
  Elongation,
  Equator,
  HelioVector,
  Horizon,
  MakeTime,
  Observer,
  SiderealTime,
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
