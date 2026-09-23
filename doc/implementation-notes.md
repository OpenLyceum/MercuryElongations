# Implementation notes

## Shared-screen architecture

`main.ts` creates one `MercurySystemModel` and passes it into both `PlanetariumScreen` and `OrbitsScreen`. Each SceneryStack screen still owns its conventional model/view pair, but the wrappers reference the same session. Only the active screen is stepped, preventing double advancement while preserving time across navigation.

## View performance

The instantaneous ephemeris is a `DerivedProperty` of civil time. Sky and body graphics update from that snapshot. Orbit curves require many ephemeris samples, so `MercuryOrbitNode` caches the last sampled UTC year and rebuilds the curves only when that year changes.

- Planetarium grid paths are rebuilt from lightweight horizon vectors.
- Orbit paths use 180 samples for each planet.
- The sky field of view is zoomable between 10° and 150° (default 72°).
- With the atmosphere on, the ground region is a fitted circle (the stereographic image of the horizon) and stars fade with the Sun's altitude; star paths are skipped entirely in full daylight.
- Conjunction / greatest-elongation searches are cached in a ±150-day window (`MercuryEventTimeline`).
- Scenery paths and body nodes are reused rather than replaced each frame.

## Controls

`LocalDateTimeControl` exposes year, month, day, and hour spinners in local mean solar time (editing keeps the current minute). Manual edits, solar- and sidereal-day steps, and greatest-elongation jumps pause playback. The rate ladder runs 1 h/s to 30 d/s in each direction with no zero, stepped by rewind/fast-forward buttons around play/pause (after Zenith). Reset All returns to the historical default, Berea, and pauses.

- Month and year changes update the allowed day range.
- The public `date` query parameter accepts ISO-8601 UTC dates from 1500 through 2500; `lat` / `lon` set the observer.
- The observer location panel (planetarium only, collapsed by default) has a preset combo box, a world map with a draggable pin (arrow keys nudge it 5° when focused), and latitude/longitude sliders; the time panel title names the site on both screens.
- Greatest-elongation buttons use Astronomy Engine's event search.
- Both control panels bind to the same Properties and therefore stay synchronized.

## Visual scale

Celestial body discs are intentionally exaggerated. The orbit view uses one shared AU-to-pixel scale for both planets. In Sun or Mercury view mode the camera follows that body, so both stay in view even below the horizon; dragging switches to a fixed look direction. Altitude readouts state the horizon status explicitly.

Projector mode changes every semantic color through `ProfileColorProperty`. Screen-selector icons are assembled from the same profile colors, so they remain legible in both themes.
