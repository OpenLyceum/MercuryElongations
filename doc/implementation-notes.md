# Implementation notes

## Shared-screen architecture

`main.ts` creates one `MercurySystemModel` and passes it into both `PlanetariumScreen` and `OrbitsScreen`. Each SceneryStack screen still owns its conventional model/view pair, but the wrappers reference the same session. Only the active screen is stepped, preventing double advancement while preserving time across navigation.

## View performance

The instantaneous ephemeris is a `DerivedProperty` of civil time. Sky and body graphics update from that snapshot. Orbit curves require many ephemeris samples, so `MercuryOrbitNode` caches the last sampled UTC year and rebuilds the curves only when that year changes.

- Planetarium grid paths are rebuilt from lightweight horizon vectors.
- Orbit paths use 180 samples for each planet.
- The sky field of view is clamped between 38° and 62°.
- Scenery paths and body nodes are reused rather than replaced each frame.

## Controls

`LocalDateTimeControl` exposes year, month, day, hour, and minute spinners. Manual edits, one-day steps, and greatest-elongation jumps pause playback. Playback rates include forward and reverse values; Reset All returns to the historical default and pauses.

- Month and year changes update the allowed day range.
- The public `date` query parameter accepts ISO-8601 UTC dates from 1500 through 2500.
- Greatest-elongation buttons use Astronomy Engine's event search.
- Both control panels bind to the same Properties and therefore stay synchronized.

## Visual scale

Celestial body discs are intentionally exaggerated. The orbit view uses one shared AU-to-pixel scale for both planets. The planetarium auto-selects a 38°–62° field of view based on current elongation, keeping both bodies visible even when they are below the horizon; altitude readouts state the horizon status explicitly.

Projector mode changes every semantic color through `ProfileColorProperty`. Screen-selector icons are assembled from the same profile colors, so they remain legible in both themes.
