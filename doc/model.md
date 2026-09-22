# Model and astronomy

`MercurySystemModel` is the single mutable session shared by both screens. It owns UTC milliseconds, play/pause state, a signed days-per-second rate, and a derived `MercurySnapshot`. Screen models are thin `TModel` adapters that forward `step(dt)` and `reset()`.

## Historical clock

The user edits local mean solar time (LMT) at Berea. Longitude is east-positive, so

```text
LMT = UTC + longitude / 15 hours
```

At 84.2963° W the offset is about −5 h 37 min. The opening local time, 1600-01-01 12:00 LMT, therefore maps to about 17:37 UTC. The calendar is proleptic Gregorian and the supported year range is 1500–2500.

## Ephemeris snapshot

For each time change, Astronomy Engine supplies:

- topocentric, of-date equatorial positions for the Sun and Mercury;
- refracted altitude and azimuth for the fixed Berea observer;
- three-dimensional geocentric elongation and morning/evening visibility;
- heliocentric Earth and Mercury vectors rotated into ecliptic coordinates.

The displayed elongation is always Astronomy Engine's three-dimensional `Elongation.elongation`, not the longitude-only `ecliptic_separation`.

## Rendering geometry

The planetarium converts altitude/azimuth into local horizon unit vectors. It centers on the normalized sum of the Sun and Mercury rays and uses a stereographic projection. The pink curve is sampled by spherical interpolation, so it follows the true minor great-circle arc.

The orbit screen projects heliocentric ecliptic `x/y` coordinates onto the canvas. Its pink arc is drawn at Earth between the instantaneous lines of sight to the Sun and Mercury. Because the screen intentionally drops the ecliptic `z` component, the diagram is explanatory while the numerical label remains the full 3-D apparent elongation.
