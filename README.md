# Pack Simulator (Pokemon + MTG)

A browser-based pack-opening simulator with three entry points:

- `index.html` for Pokemon
- `mtg.html` for MTG
- `methodology.html` for model transparency and QA framing

## Core Features

- Weighted pull simulation with set-specific slot composition
- Per-card market-aware weighting and valuation modes
- Session economy, ROI, QA panels, RNG audit trail, and binder tracking
- PWA support (manifest + service worker) with offline fallback
- Independent column scrolling on desktop for controls, play area, and sidebar
- Keyboard accessibility for card reveal and inspection actions
- Sparkline ROI charts and gain/loss split bars in both game modes

## Security & Reliability

- CSP applied to all HTML entry points
- URL sanitization and HTML escaping for dynamic link/card rendering
- Snapshot freshness badges to surface stale pricing baselines
- Service worker cache key derived from asset-manifest hash for safer updates

## Project Structure

- `app.js`: Pokemon mode logic
- `mtg.js`: MTG mode logic
- `common.js`: shared cross-mode utilities (sanitization, date/freshness, service worker, sparkline rendering)
- `styles.css`: shared styling
- `sw.js`: offline and runtime caching strategy
- `tests/consistency.test.mjs`: static integrity checks
- `tests/e2e/smoke.spec.mjs`: browser smoke coverage for Pokemon and MTG
- `scripts/static_server.mjs`: zero-dependency local server for browser tests
- `scripts/build_set_imports.mjs`: generates the data-driven set import bundle
- `scripts/refresh_snapshots.mjs`: scheduled market snapshot refresh script
- `assets/data/imports/set-imports.json`: source of truth for imported set definitions
- `assets/data/set-imports.generated.js`: generated runtime bundle loaded by both entry points
- `assets/data/*.json`: market snapshots
- `assets/qa/*.json`: QA lockfiles

## Run Locally

If you have Node 20+ installed:

```powershell
npm install
npm run build:sets
npm run serve
```

Then open `index.html`, `mtg.html`, or `methodology.html` through the local server.

If you are only browsing manually, opening the HTML files directly still works, but PWA/service-worker behavior is more reliable through a hosted or local HTTP URL.

## Automated Checks

CI runs on push and pull request via `.github/workflows/ci.yml`.

Available commands:

```powershell
npx playwright install chromium
npm run test:consistency
npm run test:e2e
npm test
```

Current automated coverage:

- `tests/consistency.test.mjs`
  - verifies all Pokemon `localPackImage` assets are precached by `sw.js`
  - checks for duplicate service-worker pack asset entries
  - validates CSP presence on all HTML entry points
  - validates snapshot `updatedAt` format
- `tests/e2e/smoke.spec.mjs`
  - verifies Pokemon fallback mode still opens packs when the live API is unavailable
  - verifies analytics and ROI chart UI render after pack openings
  - verifies MTG can load fixture-backed Scryfall responses and open packs end-to-end

## Snapshot Refresh Automation

Scheduled refreshes run from `.github/workflows/refresh-snapshots.yml`.

The workflow expects these repository variables:

- `POKEMON_SNAPSHOT_SOURCE_URL`
- `MTG_SNAPSHOT_SOURCE_URL`

You can also run the refresh locally:

```powershell
$env:POKEMON_SNAPSHOT_SOURCE_URL="https://example.com/pokemon-market-snapshot.json"
$env:MTG_SNAPSHOT_SOURCE_URL="https://example.com/mtg-market-snapshot.json"
npm run refresh:snapshots
```

If either variable is missing, that game mode is skipped without failing the run.

## Adding New Sets

1. Add a new set definition to `assets/data/imports/set-imports.json`.
2. Run `npm run build:sets` to regenerate `assets/data/set-imports.generated.js`.
3. Refresh the relevant pricing snapshot if the new set should use authored market data.

## Deploy

GitHub Pages deployment is handled by `.github/workflows/deploy-pages.yml` on `main`.
