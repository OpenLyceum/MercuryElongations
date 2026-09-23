# AGENTS.md — Mercury Elongations

Sim-specific context for AI assistants. General SceneryStack guidance: [OpenLyceum/.github/AGENTS.md](https://github.com/OpenLyceum/.github/blob/main/AGENTS.md).

## Project

Two-screen SceneryStack astronomy simulation connecting Mercury's apparent angular separation from the Sun with the heliocentric geometry that produces it.

- **Planetarium** (`src/planetarium/`) — draggable, zoomable horizon-coordinate view from the observer's location with a great-circle elongation arc, optional atmosphere (twilight sky, ground, star wash-out), and cardinal points.
- **Orbits** (`src/orbits/`) — ecliptic-plane projection of the Sun, Earth, Mercury, orbit paths, sight lines, the (toggleable) angle at Earth, and an events readout of conjunctions and greatest elongations.

Both screens reference one live `MercurySystemModel` constructed in `main.ts`; date, playback state, observer location, and ephemeris must remain synchronized across screen changes. Camera (look direction, field of view) and display toggles are per-screen in `PlanetariumModel` / `OrbitsModel`.

## Key files

| Area | Location |
|---|---|
| Shared clock and state | `src/common/model/MercurySystemModel.ts` |
| Ephemeris boundary | `src/common/astronomy/mercuryEphemeris.ts`, `mercuryEvents.ts` (conjunction / greatest-elongation search + cache) |
| Observer location | `src/common/model/LocationPreset.ts`, `src/common/view/ObserverLocationPanel.ts`, `ObserverLocationNode.ts` (world map + draggable pin, ported from Zenith), `EarthShoreData.ts` (generated Natural Earth coastlines — do not edit; exempt from Biome's `noApproximativeNumericConstant`) |
| Historical date conversion | `src/common/astronomy/dateTime.ts` |
| Shared controls | `src/common/view/LocalDateTimeControl.ts`, `TimeControlPanel.ts` |
| Sky renderer | `src/planetarium/view/MercurySkyNode.ts`, `skyAtmosphere.ts` (pure twilight/ground helpers ported from Zenith) |
| Orbit renderer | `src/orbits/view/MercuryOrbitNode.ts`, `OrbitEventsPanel.ts` |
| Theme/constants | `src/MercuryElongationsColors.ts`, `MercuryElongationsConstants.ts` |
| Localization | `src/i18n/` |

## Astronomy conventions

- Observer: default Berea, Kentucky, 37.5687° N, 84.2963° W; selectable via presets, the world-map pin (drag, or arrow keys when focused), latitude/longitude sliders, or `?lat=&lon=`. Picking a preset writes lat/lon; editing lat/lon off a preset flips the combo to "custom". Changing location keeps the UTC instant fixed (local solar time re-labels), matching Zenith.
- Local mean solar time is UTC + longitude/15 h at the current observer.
- Default: 1600-01-01 12:00 Berea local mean solar time, internally about 17:37 UTC, paused.
- Time rate ladder (`TIME_RATE_DAYS_PER_SECOND`) is symmetric with no zero (1 h/s … 30 d/s each way); ±1 sidereal day is `MILLISECONDS_PER_SIDEREAL_DAY`.
- Events: `SearchMaxElongation` for greatest elongations, `SearchRelativeLongitude(Mercury, 0 | 180)` for inferior / superior conjunction. `MercuryEventTimeline` caches ±150 days around the clock.
- Dates use a proleptic Gregorian calendar. Do not label the historical clock EST/EDT; standardized zones did not exist in 1600.
- `astronomy-engine` is isolated in `mercuryEphemeris.ts`. `Elongation(Body.Mercury)` supplies the canonical three-dimensional geocentric elongation and morning/evening classification.
- `Equator(..., ofdate=true, aberration=true)` plus `Horizon(..., "normal")` supplies topocentric sky positions.
- `HelioVector` converted by `Ecliptic` supplies orbit-screen positions. The orbit screen is explicitly a top-down projection; Mercury's out-of-plane component is not drawn.
- Orbit paths are resampled when the UTC year changes, not on every animation frame.

## Accessibility

Both screens have live summaries, localized accessible names, explicit PDOM order, and keyboard-help content. The time panel is duplicated visually but bound to the same shared Properties. Any new interactive control must be added to all locales and remain reachable through the panel's PDOM subtree.

## Testing

```bash
npm run lint && npm run check && npm run build && npm test
```

Model tests cover the historical default, local-time conversion, ephemeris invariants, shared screen state, playback, reset, and adjacent greatest elongations. The fleet memory-leak test covers `TimeModel`; the optional Playwright fuzz suite exercises the assembled UI.

## Known constraint

The repository was initially scaffolded locally because the configured GitHub CLI token was invalid. Publishing the `OpenLyceum/MercuryElongations` remote and performing Baton onboarding remain external operations until GitHub authentication is restored.
