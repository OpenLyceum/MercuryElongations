import { Range } from "scenerystack/dot";
import MercuryElongationsNamespace from "./MercuryElongationsNamespace.js";

export const SCREEN_VIEW_MARGIN = 18;
export const PANEL_CORNER_RADIUS = 8;
export const CONTROL_PANEL_WIDTH = 254;
export const PANEL_CONTENT_SPACING = 8;
export const CONTROL_FONT_SIZE = 13;
export const TITLE_FONT_SIZE = 19;

/** Berea city center. Longitude is east-positive. */
export const BEREA_LATITUDE_DEG = 37.5687;
export const BEREA_LONGITUDE_DEG = -84.2963;
export const BEREA_ELEVATION_METERS = 0;

export const MILLISECONDS_PER_DAY = 86_400_000;
export const MILLISECONDS_PER_HOUR = 3_600_000;
export const LOCAL_MEAN_TIME_OFFSET_MS = (BEREA_LONGITUDE_DEG / 15) * MILLISECONDS_PER_HOUR;

/** January 1, 1600 at 12:00 local mean solar time in Berea. */
export const DEFAULT_LOCAL_TIME_MS = Date.UTC(1600, 0, 1, 12, 0, 0);
export const DEFAULT_CIVIL_TIME_MS = DEFAULT_LOCAL_TIME_MS - LOCAL_MEAN_TIME_OFFSET_MS;

export const CIVIL_YEAR_RANGE = new Range(1500, 2500);
export const CIVIL_MONTH_RANGE = new Range(1, 12);
export const CIVIL_DAY_RANGE = new Range(1, 31);
export const CIVIL_HOUR_RANGE = new Range(0, 23);
export const CIVIL_MINUTE_RANGE = new Range(0, 59);
export const CIVIL_TIME_MS_RANGE = new Range(
  Date.UTC(CIVIL_YEAR_RANGE.min, 0, 1),
  Date.UTC(CIVIL_YEAR_RANGE.max, 11, 31, 23, 59, 59),
);

/** Simulated days per real second. Zero is deliberately omitted. */
export const TIME_RATE_DAYS_PER_SECOND = [-10, -2, -0.25, 0.25, 2, 10] as const;
export const DEFAULT_TIME_RATE_INDEX = 4;
export const TIME_RATE_INDEX_RANGE = new Range(0, TIME_RATE_DAYS_PER_SECOND.length - 1);

export const PLANETARIUM_WIDTH = 724;
export const PLANETARIUM_HEIGHT = 520;
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
