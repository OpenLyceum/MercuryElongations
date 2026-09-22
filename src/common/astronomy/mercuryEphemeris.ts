import { Body, Ecliptic, Elongation, Equator, HelioVector, Horizon, MakeTime, Observer } from "astronomy-engine";
import { BEREA_ELEVATION_METERS, BEREA_LATITUDE_DEG, BEREA_LONGITUDE_DEG } from "../../MercuryElongationsConstants.js";

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
  sun: HorizontalBodyState;
  mercury: HorizontalBodyState;
  earthHeliocentric: HeliocentricState;
  mercuryHeliocentric: HeliocentricState;
  elongationDeg: number;
  direction: "east" | "west";
  visibility: "morning" | "evening";
};

const observer = new Observer(BEREA_LATITUDE_DEG, BEREA_LONGITUDE_DEG, BEREA_ELEVATION_METERS);

const horizontalState = (body: Body, civilTimeMs: number): HorizontalBodyState => {
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

export const mercurySnapshot = (civilTimeMs: number): MercurySnapshot => {
  const elongation = Elongation(Body.Mercury, new Date(civilTimeMs));
  const visibility = elongation.visibility === "morning" ? "morning" : "evening";
  return {
    civilTimeMs,
    sun: horizontalState(Body.Sun, civilTimeMs),
    mercury: horizontalState(Body.Mercury, civilTimeMs),
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
