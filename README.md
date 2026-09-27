# Mercury Elongations

[![CI](../../actions/workflows/ci.yml/badge.svg)](../../actions/workflows/ci.yml)

Explore why Mercury never appears far from the Sun. A synchronized planetarium and orbital view connect the angle measured in the observer's sky with the changing positions of Mercury and Earth.

## Features

- Star-filled planetarium view from any observer location (Berea, Kentucky by default; presets, a draggable world-map pin, or latitude/longitude sliders)
- Draggable, zoomable sky with Sun-, Mercury-, and fixed-sky camera frames and optional atmosphere and cardinal points
- Shaded planetary bodies, horizon coordinates, and the Sun–Mercury great-circle angle
- Top-down ecliptic view with real Earth and Mercury ephemerides, sampled orbit paths, and a toggleable elongation angle
- Readout of the last and next conjunction or greatest eastern/western elongation, flagged as the clock passes each one
- Shared historical clock starting January 1, 1600 at local mean solar noon, with local-solar and UTC readouts
- Previous and next greatest-elongation navigation
- Forward/reverse animation at several rates, solar- and sidereal-day stepping, and editable local date/time
- English, Spanish, and French localization; keyboard and screen-reader support
- Projector color profile and installable offline PWA

## Quick Start

```bash
npm install
npm start
```

The development server opens at `http://localhost:5173`. Use `?date=2026-09-22T12:00:00Z` to deep-link to a supported UTC instant, and `?lat=-33.87&lon=151.21` to set the observer (+N / +E degrees).

## Scripts

| Command | Description |
|---|---|
| `npm start` / `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check + production build → `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm test` | Run Vitest unit tests (includes memory-leak suite) |
| `npm run test:fuzz` | Optional Playwright fuzz smoke: pointer (`?fuzz`) + keyboard (`?fuzzBoard`), with `?ea`, 30s each |
| `npm run test:fuzz -- 90` | Same fuzz for 90 seconds (`--duration 90` or `FUZZ_DURATION=90` also work) |
| `npm run test:fuzz:quick` | Shorter fuzz smoke (10s) |
| `npm run test:fuzz:long` | Longer fuzz smoke (300s) |
| `npm run check` | TypeScript type check |
| `npm run lint` | Biome lint check |
| `npm run format` | Auto-format all files |
| `npm run fix` | Lint + auto-fix |
| `npm run icons` | Regenerate PNG icons from `public/icons/icon.svg` |
| `npm run release` | `check && lint && build && test`, then version patch + push tags |
| `npm run clean` | Remove `dist/` |

## Tech Stack

| Tool | Purpose |
|---|---|
| [SceneryStack](https://scenerystack.org/) | Simulation framework and accessible UI |
| [Astronomy Engine](https://github.com/cosinekitty/astronomy) | Planet positions, elongations, and event searches |
| Vite + TypeScript | Build system and type-safe implementation |
| Vitest + Playwright | Model tests, memory checks, and fuzz smoke testing |
| Biome | Formatting and linting |

## License

GNU Affero General Public License v3.0 — see the [OpenLyceum organization license](https://github.com/OpenLyceum/.github/blob/main/LICENSE).

## Contributing

See the [OpenLyceum contributing guidelines](https://github.com/OpenLyceum/.github/blob/main/CONTRIBUTING.md). Report bugs through GitHub Issues using the organization templates.
