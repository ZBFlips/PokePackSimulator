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
- Keyboard accessibility for card reveal/inspection actions

## Security & Reliability

- CSP applied to all HTML entry points
- URL sanitization and HTML escaping for dynamic link/card rendering
- Snapshot freshness badges to surface stale pricing baselines
- Service worker cache key derived from asset-manifest hash for safer updates

## Project Structure

- `app.js`: Pokemon mode logic
- `mtg.js`: MTG mode logic
- `common.js`: shared cross-mode utilities (sanitization, date/freshness, SW registration)
- `styles.css`: shared styling
- `sw.js`: offline/runtime caching strategy
- `assets/data/*.json`: market snapshots
- `assets/qa/*.json`: QA lockfiles

## Run Locally

1. Open `C:\Users\Zac\Desktop\pokemon card sim\index.html` in your browser, or run a static server.
2. For best PWA behavior, use a local/static hosted URL instead of `file://`.

## Automated Checks

CI runs on push/PR via `.github/workflows/ci.yml`.

Current automated test:

- `tests/consistency.test.mjs`:
  - verifies all Pokemon `localPackImage` assets are precached by `sw.js`
  - checks for duplicate SW pack asset entries
  - validates CSP presence on all HTML entry points
  - validates snapshot `updatedAt` format

Run locally (if Node is installed):

```powershell
node tests/consistency.test.mjs
```

## Deploy

GitHub Pages deployment is handled by `.github/workflows/deploy-pages.yml` on `main`.
