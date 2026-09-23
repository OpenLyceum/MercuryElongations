# Model and astronomy

`MercurySystemModel` is the single mutable session shared by both screens. It owns UTC milliseconds, play/pause state, a signed days-per-second rate, the observer's latitude/longitude (with a named-preset Property), a derived `MercurySnapshot`, and a derived event context (previous/next conjunction or greatest elongation). Screen models are thin `TModel` adapters that forward `step(dt)` and `reset()` and add per-screen view state: the planetarium camera (look direction, field of view) and atmosphere/cardinal toggles, and the orbit screen's elongation-angle toggle.

## Historical clock

The user edits local mean solar time (LMT) at the observer's longitude (Berea by default). Longitude is east-positive, so

```text
LMT = UTC + longitude / 15 hours
```

At Berea's 84.2963° W the offset is about −5 h 37 min. The opening local time, 1600-01-01 12:00 LMT, therefore maps to about 17:37 UTC. The calendar is proleptic Gregorian and the supported year range is 1500–2500. Changing the observer keeps the UTC instant and re-labels it in the new local time.

## Ephemeris snapshot

For each time change, Astronomy Engine supplies:

- topocentric, of-date equatorial positions for the Sun and Mercury;
- refracted altitude and azimuth for the current observer, plus local sidereal time for placing the star catalog;
- three-dimensional geocentric elongation and morning/evening visibility;
- heliocentric Earth and Mercury vectors rotated into ecliptic coordinates.

The displayed elongation is always Astronomy Engine's three-dimensional `Elongation.elongation`, not the longitude-only `ecliptic_separation`.

## Events

`mercuryEvents.ts` finds greatest elongations with `SearchMaxElongation` and inferior / superior conjunctions with `SearchRelativeLongitude(Mercury, 0 | 180)`. `MercuryEventTimeline` caches the events within ±150 days of the clock and refills only near the edge of that window, so animation frames do a lookup rather than a search.

## Rendering geometry

The planetarium converts altitude/azimuth into local horizon unit vectors. It centers on the Sun, on Mercury, or on a fixed direction the learner sets by dragging, and uses a stereographic projection whose field of view the learner zooms. The pink curve is sampled by spherical interpolation, so it follows the true minor great-circle arc.

The orbit screen projects heliocentric ecliptic `x/y` coordinates onto the canvas. Its pink arc is drawn at Earth between the instantaneous lines of sight to the Sun and Mercury. Because the screen intentionally drops the ecliptic `z` component, the diagram is explanatory while the numerical label remains the full 3-D apparent elongation.
