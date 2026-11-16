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
const MILLISECONDS_PER_HOUR = 3_600_000;

/** Offset from UTC to local mean solar time at `longitudeDeg` (east-positive). */
export const localMeanTimeOffsetMs = (longitudeDeg: number): number => (longitudeDeg / 15) * MILLISECONDS_PER_HOUR;

/**
 * One mean solar day is 1.00273790935 sidereal days, so a sidereal day — the
 * interval after which the stars return to the same place — is ~3 min 56 s shorter.
 */
export const MILLISECONDS_PER_SIDEREAL_DAY = MILLISECONDS_PER_DAY / 1.00273790935;

/** January 1, 1600 at 12:00 local mean solar time in Berea. */
const DEFAULT_LOCAL_TIME_MS = Date.UTC(1600, 0, 1, 12, 0, 0);
export const DEFAULT_CIVIL_TIME_MS = DEFAULT_LOCAL_TIME_MS - localMeanTimeOffsetMs(BEREA_LONGITUDE_DEG);

const CIVIL_YEAR_RANGE = new Range(1500, 2500);
/** Local mean solar time can cross a UTC year boundary at longitudes near ±180°. */
export const LOCAL_YEAR_RANGE = new Range(CIVIL_YEAR_RANGE.min - 1, CIVIL_YEAR_RANGE.max + 1);
export const CIVIL_MONTH_RANGE = new Range(1, 12);
export const CIVIL_DAY_RANGE = new Range(1, 31);
export const CIVIL_HOUR_RANGE = new Range(0, 23);
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

/** Settings for common/MercuryElongationsControlOptions.ts. */
export const MERCURY_ELONGATIONS_CONTROL_OPTIONS_SETTINGS = {
  /** Slider thumb size width (px). */
  SLIDER_THUMB_SIZE_WIDTH: 12,
  /** Slider thumb size height (px). */
  SLIDER_THUMB_SIZE_HEIGHT: 22,
  /** Standalone slider track size width (px). */
  STANDALONE_SLIDER_TRACK_SIZE_WIDTH: 150,
  /** Standalone slider track size height (px). */
  STANDALONE_SLIDER_TRACK_SIZE_HEIGHT: 3,
  /** Number control slider track size width (px). */
  NUMBER_CONTROL_SLIDER_TRACK_SIZE_WIDTH: 110,
  /** Number control slider track size height (px). */
  NUMBER_CONTROL_SLIDER_TRACK_SIZE_HEIGHT: 3,
  /** Checkbox box width (px). */
  CHECKBOX_BOX_WIDTH: 16,
  /** Mercury elongations number control options scale (dimensionless). */
  MERCURY_ELONGATIONS_NUMBER_CONTROL_OPTIONS_SCALE: 0.75,
  /** Mercury elongations number control options slider padding (px). */
  MERCURY_ELONGATIONS_NUMBER_CONTROL_OPTIONS_SLIDER_PADDING: 4,
  /** Mercury elongations number control options arrow button spacing (px). */
  MERCURY_ELONGATIONS_NUMBER_CONTROL_OPTIONS_ARROW_BUTTON_SPACING: 3,
  /** Mercury elongations number control options vertical spacing (px). */
  MERCURY_ELONGATIONS_NUMBER_CONTROL_OPTIONS_VERTICAL_SPACING: 4,
  /** Compact spinner number control options scale (dimensionless). */
  COMPACT_SPINNER_NUMBER_CONTROL_OPTIONS_SCALE: 0.62,
  /** Compact spinner number control options spacing (px). */
  COMPACT_SPINNER_NUMBER_CONTROL_OPTIONS_SPACING: 3,
  /** Mercury elongations checkbox options spacing (px). */
  MERCURY_ELONGATIONS_CHECKBOX_OPTIONS_SPACING: 4,
} as const;

/** Settings for common/MercuryElongationsPanel.ts. */
export const MERCURY_ELONGATIONS_PANEL_SETTINGS = {
  /** Options x margin (px). */
  OPTIONS_X_MARGIN: 12,
  /** Options y margin (px). */
  OPTIONS_Y_MARGIN: 10,
} as const;

/** Settings for common/MercuryElongationsScreenIcons.ts. */
export const MERCURY_ELONGATIONS_SCREEN_ICONS_SETTINGS = {
  CREATE_ORBITS_ICON_CENTER_X_OFFSET: 128, // px
  CREATE_ORBITS_ICON_CENTER_Y_OFFSET: 68, // px

  MEASURE_LINE_X_SEGMENT_2: 365, // px
  MEASURE_LINE_Y_SEGMENT_2: 165, // px
  CREATE_PLANETARIUM_ICON_RADIUS_SEGMENT_2: 29, // px
  CREATE_PLANETARIUM_ICON_RADIUS_SEGMENT_3: 17, // px
  CREATE_PLANETARIUM_ICON_ITEM_6_CENTER_X: 175, // px
  CREATE_PLANETARIUM_ICON_ITEM_6_CENTER_Y: 245, // px
  CREATE_ORBITS_ICON_RADIUS_SEGMENT_2: 62, // px
  CREATE_ORBITS_ICON_RADIUS_SEGMENT_3: 25, // px
  CREATE_ORBITS_ICON_RADIUS_SEGMENT_4: 16, // px
  CREATE_ORBITS_ICON_RADIUS_SEGMENT_5: 13, // px

  /** Measure line x (px). */
  MEASURE_LINE_X: 175,
  /** Measure line y (px). */
  MEASURE_LINE_Y: 245,
  /** Measure line line width (px). */
  MEASURE_LINE_LINE_WIDTH: 8,
  /** Create planetarium icon y (px). */
  CREATE_PLANETARIUM_ICON_Y: 300,
  /** Create planetarium icon control x (px). */
  CREATE_PLANETARIUM_ICON_CONTROL_X: 274,
  /** Create planetarium icon control y (px). */
  CREATE_PLANETARIUM_ICON_CONTROL_Y: 235,
  /** Create planetarium icon end y (px). */
  CREATE_PLANETARIUM_ICON_END_Y: 300,
  /** Create planetarium icon line width (px). */
  CREATE_PLANETARIUM_ICON_LINE_WIDTH: 4,
  /** Create planetarium icon radius (px). */
  CREATE_PLANETARIUM_ICON_RADIUS: 42,
  /** Create planetarium icon center x (px). */
  CREATE_PLANETARIUM_ICON_CENTER_X: 365,
  /** Create planetarium icon center y (px). */
  CREATE_PLANETARIUM_ICON_CENTER_Y: 165,
  /** Create planetarium icon opacity (dimensionless). */
  CREATE_PLANETARIUM_ICON_OPACITY: 0.3,
  /** Create orbits icon radius (px). */
  CREATE_ORBITS_ICON_RADIUS: 145,
  /** Create orbits icon line width (px). */
  CREATE_ORBITS_ICON_LINE_WIDTH: 5,
} as const;

/** Settings for common/model/LocationPreset.ts. */
export const LOCATION_PRESET_SETTINGS = {
  /** Coordinates within this many degrees of a preset count as that preset. */
  PRESET_MATCH_TOLERANCE_DEG: 1e-6,
} as const;

/** Settings for common/model/MercurySystemModel.ts. */
export const MERCURY_SYSTEM_MODEL_SETTINGS = {
  /** Start the "next greatest elongation" search a minute ahead, so the current event is skipped. */
  NEXT_EVENT_SEARCH_OFFSET_MS: 60_000,
  /** "Previous greatest elongation" searches forward from this far back (days), a bit more than one synodic period (~116 d), stepping event to event for at most PREVIOUS_EVENT_MAX_STEPS until it reaches the current time. */
  PREVIOUS_EVENT_LOOKBACK_DAYS: 200,
  /** Previous event max steps (count). */
  PREVIOUS_EVENT_MAX_STEPS: 8,
} as const;

/** Settings for common/view/LocalDateTimeControl.ts. */
export const LOCAL_DATE_TIME_CONTROL_SETTINGS = {
  /** Spinner max width (px). */
  SPINNER_MAX_WIDTH: 40,
  /** Constructor x spacing (px). */
  CONSTRUCTOR_X_SPACING: 8,
  /** Constructor y spacing (px). */
  CONSTRUCTOR_Y_SPACING: 5,
} as const;

/** Settings for common/view/ObserverLocationNode.ts. */
export const OBSERVER_LOCATION_NODE_SETTINGS = {
  PIN_RADIUS_SEGMENT_2: 3.5, // px
  PIN_ITEM_4_LINE_WIDTH: 0.75, // px

  /** Model view transform min x (px). */
  MODEL_VIEW_TRANSFORM_MIN_X: -180,
  /** Model view transform min y (px). */
  MODEL_VIEW_TRANSFORM_MIN_Y: -90,
  /** Model view transform max x (px). */
  MODEL_VIEW_TRANSFORM_MAX_X: 180,
  /** Model view transform max y (px). */
  MODEL_VIEW_TRANSFORM_MAX_Y: 90,
  /** Land path line width (px). */
  LAND_PATH_LINE_WIDTH: 0.35,
  /** Land path opacity (dimensionless). */
  LAND_PATH_OPACITY: 0.95,
  /** Grid path line width (px). */
  GRID_PATH_LINE_WIDTH: 0.5,
  /** Grid path opacity (dimensionless). */
  GRID_PATH_OPACITY: 0.7,
  /** Pin radius (px). */
  PIN_RADIUS: 12,
  /** Pin start x (px). */
  PIN_START_X: -9,
  /** Pin end x (px). */
  PIN_END_X: 9,
  /** Pin line width (px). */
  PIN_LINE_WIDTH: 1.5,
  /** Pin start y (px). */
  PIN_START_Y: -9,
  /** Pin end y (px). */
  PIN_END_Y: 9,
} as const;

/** Settings for common/view/ObserverLocationPanel.ts. */
export const OBSERVER_LOCATION_PANEL_SETTINGS = {
  COMBO_MAX_WIDTH_OFFSET: 70, // px
  COORDINATE_CONTROL_MAX_WIDTH_OFFSET: 100, // px

  /** Combo x margin (px). */
  COMBO_X_MARGIN: 8,
  /** Combo y margin (px). */
  COMBO_Y_MARGIN: 4,
  /** Coordinate control delta (control/model units). */
  COORDINATE_CONTROL_DELTA: 0.5,
  /** Coordinate control max width (px). */
  COORDINATE_CONTROL_MAX_WIDTH: 60,
  /** Constructor spacing (px). */
  CONSTRUCTOR_SPACING: 6,
} as const;

/** Settings for common/view/TimeControlPanel.ts. */
export const TIME_CONTROL_PANEL_SETTINGS = {
  TEXT_OPTIONS_MAX_WIDTH_OFFSET: 28, // px
  CONTENT_MAX_WIDTH_OFFSET: 28, // px

  STEP_BACKWARD_TEXT_BUTTON_MAX_WIDTH: 30, // px
  STEP_FORWARD_TEXT_BUTTON_MAX_WIDTH: 30, // px
  CONTENT_ITEM_1_SPACING: 10, // px
  CONTENT_ITEM_10_SPACING: 6, // px
  PREVIOUS_GREATEST_TEXT_BUTTON_MAX_WIDTH: 96, // px
  NEXT_GREATEST_TEXT_BUTTON_MAX_WIDTH: 96, // px

  /** Elongation decimal places (digits). */
  ELONGATION_DECIMAL_PLACES: 2,
  /** Default max width (px). */
  DEFAULT_MAX_WIDTH: 92,
  /** Text button x margin (px). */
  TEXT_BUTTON_X_MARGIN: 8,
  /** Text button y margin (px). */
  TEXT_BUTTON_Y_MARGIN: 4,
  /** Step row max width (px). */
  STEP_ROW_MAX_WIDTH: 110,
  /** Day step grid x spacing (px). */
  DAY_STEP_GRID_X_SPACING: 6,
  /** Day step grid y spacing (px). */
  DAY_STEP_GRID_Y_SPACING: 4,
  /** Rate button x margin (px). */
  RATE_BUTTON_X_MARGIN: 9,
  /** Rate button y margin (px). */
  RATE_BUTTON_Y_MARGIN: 7,
  /** Play pause button radius (px). */
  PLAY_PAUSE_BUTTON_RADIUS: 16,
  /** Content spacing (px). */
  CONTENT_SPACING: 4,
  /** Content font size (px). */
  CONTENT_FONT_SIZE: 15,
} as const;

/** Settings for orbits/view/MercuryOrbitNode.ts. */
export const MERCURY_ORBIT_NODE_SETTINGS = {
  CENTER_X_OFFSET: 22, // px
  CENTER_Y_OFFSET: 4, // px
  CONSTRUCTOR_TOP_OFFSET: 19, // px
  NOTE_MAX_WIDTH_OFFSET: 30, // px
  CONSTRUCTOR_BOTTOM_OFFSET: 10, // px
  UPDATE_BODIES_TOP_OFFSET: 13, // px
  CONSTRUCTOR_UPDATE_BODIES_TOP_OFFSET: 12, // px
  UPDATE_BODIES_CENTER_X_OFFSET: 20, // px
  UPDATE_BODIES_CENTER_Y_OFFSET: 20, // px
  CONSTRUCTOR_LEFT: 4, // px
  CONSTRUCTOR_LEFT_OFFSET: 4, // px

  /** Earth orbit path line width (px). */
  EARTH_ORBIT_PATH_LINE_WIDTH: 1.5,
  /** Earth orbit path opacity (dimensionless). */
  EARTH_ORBIT_PATH_OPACITY: 0.75,
  /** Mercury orbit path line width (px). */
  MERCURY_ORBIT_PATH_LINE_WIDTH: 1.5,
  /** Mercury orbit path opacity (dimensionless). */
  MERCURY_ORBIT_PATH_OPACITY: 0.85,
  /** Sight lines path line width (px). */
  SIGHT_LINES_PATH_LINE_WIDTH: 2,
  /** Angle path line width (px). */
  ANGLE_PATH_LINE_WIDTH: 3,
  /** Sun node radius (px). */
  SUN_NODE_RADIUS: 15,
  /** Earth node radius (px). */
  EARTH_NODE_RADIUS: 10,
  /** Mercury node radius (px). */
  MERCURY_NODE_RADIUS: 8,
  /** Label options font size (px). */
  LABEL_OPTIONS_FONT_SIZE: 14,
  /** Angle label font size (px). */
  ANGLE_LABEL_FONT_SIZE: 16,
  /** Note font size (px). */
  NOTE_FONT_SIZE: 12,
  /** Event label font size (px). */
  EVENT_LABEL_FONT_SIZE: 14,
  /** Event ring radius (px). */
  EVENT_RING_RADIUS: 14,
  /** Event ring line width (px). */
  EVENT_RING_LINE_WIDTH: 2,
  /** Arc radius (px). */
  ARC_RADIUS: 48,
} as const;

/** Settings for orbits/view/OrbitEventsPanel.ts. */
export const ORBIT_EVENTS_PANEL_SETTINGS = {
  ELONGATION_CHECKBOX_MAX_WIDTH_OFFSET: 24, // px

  /** Constructor spacing (px). */
  CONSTRUCTOR_SPACING: 5,
  /** Constructor x margin (px). */
  CONSTRUCTOR_X_MARGIN: 10,
  /** Constructor y margin (px). */
  CONSTRUCTOR_Y_MARGIN: 8,
} as const;

/** Settings for orbits/view/OrbitsScreenSummaryContent.ts. */
export const ORBITS_SCREEN_SUMMARY_CONTENT_SETTINGS = {
  /** Details decimal places (digits). */
  DETAILS_DECIMAL_PLACES: 2,
} as const;

/** Settings for orbits/view/OrbitsScreenView.ts. */
export const ORBITS_SCREEN_VIEW_SETTINGS = {
  CONSTRUCTOR_LEFT_OFFSET: 10, // px
  CONSTRUCTOR_TOP_OFFSET: 10, // px

  /** While playing, an event stays flagged as "now" for at least this many real seconds. */
  EVENT_NOW_MIN_REAL_SECONDS: 0.75,
} as const;

/** Settings for planetarium/model/BrightStarCatalog.ts. */
export const BRIGHT_STAR_CATALOG_SETTINGS = {
  /** Bright star count (count). */
  BRIGHT_STAR_COUNT: 4103,
} as const;

/** Settings for planetarium/view/MercurySkyNode.ts. */
export const MERCURY_SKY_NODE_SETTINGS = {
  CONSTRUCTOR_BOTTOM_OFFSET: 30, // px
  HINT_MAX_WIDTH_OFFSET: 20, // px
  CONSTRUCTOR_RIGHT_OFFSET: 12, // px

  MERCURY_NODE_RADIUS_SEGMENT_2: 1.6, // px
  MERCURY_NODE_RADIUS_SEGMENT_3: 1.1, // px
  MERCURY_NODE_ITEM_3_OPACITY: 0.32, // dimensionless
  MERCURY_NODE_ITEM_3_CENTER_X: 3, // px
  MERCURY_NODE_ITEM_3_CENTER_Y: -2.8, // px

  /** Faintest star magnitude drawn in the sky (dimensionless magnitude). */
  STAR_MAGNITUDE_LIMIT: 5.4,
  /** Zoom factor per wheel notch. */
  WHEEL_ZOOM_FACTOR: 1.1,
  /** Label offsets from the body or arc they name, view px (negative is above). */
  SUN_LABEL_OFFSET_Y: -31,
  /** Mercury label offset y (px). */
  MERCURY_LABEL_OFFSET_Y: -24,
  /** Angle label offset y (px). */
  ANGLE_LABEL_OFFSET_Y: 25,
  /** Horizon label offset y (px). */
  HORIZON_LABEL_OFFSET_Y: 14,
  /** Ground path opacity (dimensionless). */
  GROUND_PATH_OPACITY: 0.88,
  /** Stars glow path opacity (dimensionless). */
  STARS_GLOW_PATH_OPACITY: 0.18,
  /** Stars path opacity (dimensionless). */
  STARS_PATH_OPACITY: 0.82,
  /** Grid path opacity (dimensionless). */
  GRID_PATH_OPACITY: 0.34,
  /** Horizon path line width (px). */
  HORIZON_PATH_LINE_WIDTH: 2.5,
  /** Angle path line width (px). */
  ANGLE_PATH_LINE_WIDTH: 3,
  /** Sun glow outer radius (px). */
  SUN_GLOW_OUTER_RADIUS: 43,
  /** Sun glow outer opacity (dimensionless). */
  SUN_GLOW_OUTER_OPACITY: 0.07,
  /** Sun glow radius (px). */
  SUN_GLOW_RADIUS: 29,
  /** Sun glow opacity (dimensionless). */
  SUN_GLOW_OPACITY: 0.2,
  /** Sun node radius (px). */
  SUN_NODE_RADIUS: 18,
  /** Sun node line width (px). */
  SUN_NODE_LINE_WIDTH: 0.8,
  /** Mercury node radius (px). */
  MERCURY_NODE_RADIUS: 10,
  /** Mercury node line width (px). */
  MERCURY_NODE_LINE_WIDTH: 0.8,
  /** Mercury node opacity (dimensionless). */
  MERCURY_NODE_OPACITY: 0.42,
  /** Mercury node center x (px). */
  MERCURY_NODE_CENTER_X: -2.5,
  /** Mercury node center y (px). */
  MERCURY_NODE_CENTER_Y: 2,
  /** Label options font size (px). */
  LABEL_OPTIONS_FONT_SIZE: 14,
  /** Angle label font size (px). */
  ANGLE_LABEL_FONT_SIZE: 16,
  /** Horizon label font size (px). */
  HORIZON_LABEL_FONT_SIZE: 12,
  /** Sun altitude label font size (px). */
  SUN_ALTITUDE_LABEL_FONT_SIZE: 13,
  /** Mercury altitude label font size (px). */
  MERCURY_ALTITUDE_LABEL_FONT_SIZE: 13,
  /** Left inset for the sun/mercury altitude labels (px). */
  ALTITUDE_LABEL_LEFT: 14,
  /** Hint font size (px). */
  HINT_FONT_SIZE: 12,
  /** Hint opacity (dimensionless). */
  HINT_OPACITY: 0.6,
} as const;

/** Settings for planetarium/view/PlanetariumScreenSummaryContent.ts. */
export const PLANETARIUM_SCREEN_SUMMARY_CONTENT_SETTINGS = {
  /** Details decimal places (digits). */
  DETAILS_DECIMAL_PLACES: 2,
} as const;

/** Settings for planetarium/view/SkyViewControlPanel.ts. */
export const SKY_VIEW_CONTROL_PANEL_SETTINGS = {
  ZOOM_PANEL_TEXT_MAX_WIDTH: 60, // px
  VIEW_MODE_PANEL_TEXT_MAX_WIDTH: 200, // px
  ITEM_4_SPACING: 14, // px

  /** Control panel body font size (px). */
  FONT_SIZE: 12,
  /** Default max width (px). */
  DEFAULT_MAX_WIDTH: 110,
  /** Button text max width (px). */
  BUTTON_TEXT_MAX_WIDTH: 82,
  /** View mode group spacing (px). */
  VIEW_MODE_GROUP_SPACING: 4,
  /** View mode group x margin (px). */
  VIEW_MODE_GROUP_X_MARGIN: 8,
  /** View mode group y margin (px). */
  VIEW_MODE_GROUP_Y_MARGIN: 5,
  /** Zoom button font size (px). */
  ZOOM_BUTTON_FONT_SIZE: 14,
  /** Zoom button x margin (px). */
  ZOOM_BUTTON_X_MARGIN: 9,
  /** Zoom row spacing (px). */
  ZOOM_ROW_SPACING: 6,
  /** Zoom row max width (px). */
  ZOOM_ROW_MAX_WIDTH: 44,
  /** Constructor spacing (px). */
  CONSTRUCTOR_SPACING: 7,
} as const;

/** Settings for planetarium/view/skyAtmosphere.ts. */
export const SKY_ATMOSPHERE_SETTINGS = {
  /** Civil twilight sun altitude (deg). */
  CIVIL_TWILIGHT_DEG: -6,
  /** Astronomical twilight sun altitude (deg). */
  ASTRONOMICAL_TWILIGHT_DEG: -18,
} as const;

/** Settings for preferences/MercuryElongationsPreferencesNode.ts. */
export const MERCURY_ELONGATIONS_PREFERENCES_NODE_SETTINGS = {
  /** Header font size (px). */
  HEADER_FONT_SIZE: 18,
  /** Constructor spacing (px). */
  CONSTRUCTOR_SPACING: 12,
} as const;

/** Layout lengths in px; precision values count digits; factors are dimensionless. */
export const PLANETARIUM_SCREEN_VIEW_SETTINGS = {
  CONSTRUCTOR_LEFT_OFFSET: 12, // px
  CONSTRUCTOR_TOP_OFFSET: 12, // px
  CONSTRUCTOR_RIGHT_OFFSET: 12, // px
} as const;

MercuryElongationsNamespace.register("MercuryElongationsConstants", {
  SCREEN_VIEW_MARGIN,
  PANEL_CORNER_RADIUS,
  CONTROL_PANEL_WIDTH,
  BEREA_LATITUDE_DEG,
  BEREA_LONGITUDE_DEG,
  DEFAULT_CIVIL_TIME_MS,
});
