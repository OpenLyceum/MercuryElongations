# CLAUDE.md — Mercury Elongations

Sim-specific context for AI assistants. General SceneryStack guidance: [OpenLyceum/.github/CLAUDE.md](https://github.com/OpenLyceum/.github/blob/main/CLAUDE.md).

## Project

Two-screen SceneryStack astronomy simulation connecting Mercury's apparent angular separation from the Sun with the heliocentric geometry that produces it.

- **Planetarium** (`src/planetarium/`) — auto-framed horizon-coordinate view from Berea with a great-circle elongation arc.
- **Orbits** (`src/orbits/`) — ecliptic-plane projection of the Sun, Earth, Mercury, orbit paths, sight lines, and the angle at Earth.

Both screens reference one live `MercurySystemModel` constructed in `main.ts`; date, playback state, and ephemeris must remain synchronized across screen changes.

## Key files

| Area | Location |
|---|---|
| Shared clock and state | `src/common/model/MercurySystemModel.ts` |
| Ephemeris boundary | `src/common/astronomy/mercuryEphemeris.ts` |
| Historical date conversion | `src/common/astronomy/dateTime.ts` |
| Shared controls | `src/common/view/LocalDateTimeControl.ts`, `TimeControlPanel.ts` |
| Sky renderer | `src/planetarium/view/MercurySkyNode.ts` |
| Orbit renderer | `src/orbits/view/MercuryOrbitNode.ts` |
| Theme/constants | `src/MercuryElongationsColors.ts`, `MercuryElongationsConstants.ts` |
| Localization | `src/i18n/` |

## Astronomy conventions

- Observer: Berea, Kentucky, 37.5687° N, 84.2963° W.
- Default: 1600-01-01 12:00 local mean solar time, internally about 17:37 UTC, paused.
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
