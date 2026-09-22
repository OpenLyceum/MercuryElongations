# Screen synchronization

The simulation has two concept-named screen packages, `planetarium/` and `orbits/`. They do not instantiate independent physics models.

```text
main.ts
  └─ MercurySystemModel (one live session)
      ├─ PlanetariumModel → PlanetariumScreenView
      └─ OrbitsModel      → OrbitsScreenView
```

Shared UI belongs under `src/common/view/`; shared astronomy and state belong under `src/common/astronomy/` and `src/common/model/`. Screen-specific projection code stays in its screen package. When adding state, put it in `MercurySystemModel` if changing it on one screen must be visible on the other.
