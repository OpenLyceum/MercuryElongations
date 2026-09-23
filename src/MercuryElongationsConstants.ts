import { Range } from "scenerystack/dot";
import MercuryElongationsNamespace from "./MercuryElongationsNamespace.js";

export const SCREEN_VIEW_MARGIN = 18;
export const PANEL_CORNER_RADIUS = 8;
export const CONTROL_PANEL_WIDTH = 254;
export const PANEL_CONTENT_SPACING = 8;
export const CONTROL_FONT_SIZE = 13;
export const TITLE_FONT_SIZE = 19;

/** Berea city center, the default observer. Longitude is east-positive. */
export const BEREA_LATITUDE_DEG = 37.5687;
export const BEREA_LONGITUDE_DEG = -84.2963;
export const OBSERVER_ELEVATION_METERS = 0;

/** Allowed observer latitude / longitude (degrees, +N / +E). */
export const LATITUDE_RANGE = new Range(-90, 90);
export const LONGITUDE_RANGE = new Range(-180, 180);
/** Arrow-key nudge (degrees) for the observer pin on the location map. */
export const LOCATION_STEP_DEGREES = 5;

export const MILLISECONDS_PER_DAY = 86_400_000;
export const MILLISECONDS_PER_HOUR = 3_600_000;

/** Offset from UTC to local mean solar time at `longitudeDeg` (east-positive). */
export const localMeanTimeOffsetMs = (longitudeDeg: number): number => (longitudeDeg / 15) * MILLISECONDS_PER_HOUR;

/**
 * One mean solar day is 1.00273790935 sidereal days, so a sidereal day — the
 * interval after which the stars return to the same place — is ~3 min 56 s shorter.
 */
export const MILLISECONDS_PER_SIDEREAL_DAY = MILLISECONDS_PER_DAY / 1.00273790935;

/** January 1, 1600 at 12:00 local mean solar time in Berea. */
export const DEFAULT_LOCAL_TIME_MS = Date.UTC(1600, 0, 1, 12, 0, 0);
export const DEFAULT_CIVIL_TIME_MS = DEFAULT_LOCAL_TIME_MS - localMeanTimeOffsetMs(BEREA_LONGITUDE_DEG);

export const CIVIL_YEAR_RANGE = new Range(1500, 2500);
export const CIVIL_MONTH_RANGE = new Range(1, 12);
export const CIVIL_DAY_RANGE = new Range(1, 31);
export const CIVIL_HOUR_RANGE = new Range(0, 23);
export const CIVIL_MINUTE_RANGE = new Range(0, 59);
export const CIVIL_TIME_MS_RANGE = new Range(
  Date.UTC(CIVIL_YEAR_RANGE.min, 0, 1),
  Date.UTC(CIVIL_YEAR_RANGE.max, 11, 31, 23, 59, 59),
);

/**
 * Simulated days per real second. Symmetric with no zero, so stepping the rate
 * down past the slowest forward rate crosses straight into reverse (Zenith-style).
 * The sub-day rates (1 h/s and 6 h/s) make the diurnal motion readable.
 */
export const TIME_RATE_DAYS_PER_SECOND = [-30, -10, -3, -1, -0.25, -1 / 24, 1 / 24, 0.25, 1, 3, 10, 30] as const;
export const DEFAULT_TIME_RATE_INDEX = TIME_RATE_DAYS_PER_SECOND.indexOf(1);
export const TIME_RATE_INDEX_RANGE = new Range(0, TIME_RATE_DAYS_PER_SECOND.length - 1);

export const PLANETARIUM_WIDTH = 724;
export const PLANETARIUM_HEIGHT = 520;
/** Planetarium camera: field of view (degrees) and drag/keyboard pan rates. */
export const DEFAULT_FIELD_OF_VIEW_DEG = 72;
export const FIELD_OF_VIEW_RANGE = new Range(10, 150);
export const FIELD_OF_VIEW_ZOOM_FACTOR = 1.25;
export const LOOK_ALTITUDE_RANGE = new Range(-89, 89);
export const LOOK_PAN_KEYBOARD_STEP_DEG = 3;

/** Default planetarium display toggles. */
export const DEFAULT_SHOW_ATMOSPHERE = false;
export const DEFAULT_SHOW_CARDINALS = true;

/** Orbit-screen event readout: an event is "now" when the clock is within this many days of it. */
export const EVENT_NOW_WINDOW_DAYS = 1.5;

export const ORBIT_VIEW_WIDTH = 724;
export const ORBIT_VIEW_HEIGHT = 520;
export const ORBIT_SCALE_PX_PER_AU = 232;
export const EARTH_ORBIT_DAYS = 365.256;
export const MERCURY_ORBIT_DAYS = 87.969;
export const ORBIT_SAMPLE_COUNT = 180;

MercuryElongationsNamespace.register("MercuryElongationsConstants", {
  SCREEN_VIEW_MARGIN,
  PANEL_CORNER_RADIUS,
  CONTROL_PANEL_WIDTH,
  BEREA_LATITUDE_DEG,
  BEREA_LONGITUDE_DEG,
  DEFAULT_CIVIL_TIME_MS,
});
