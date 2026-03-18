# Pokemon Pack Simulator

A browser-based pack-opening simulator for:

- Paldean Fates
- Prismatic Evolutions
- Surging Sparks
- Obsidian Flames
- Temporal Forces
- Twilight Masquerade
- Evolving Skies
- Brilliant Stars
- Lost Origin

## Features

- Pull simulation with set-specific slot odds (community sampled pull-rate tables)
- Per-card weighted odds model (not just tier-only rolls), with approximate specific-card odds shown in UI
- Live card image + market value loading from the PokemonTCG API
- Reveal modes:
  - Reveal all at once
  - Reveal one card at a time
- Display sorting:
  - Standard pack order
  - Highest value first
- Opening FX:
  - Pack burst and reveal animations
  - Optional synthesized sound effects
- Collection systems:
  - Session stats (packs opened, value, biggest hit, set completion)
  - Persistent binder collection with counts and best values

## Run It

1. Open `C:\Users\Zac\Desktop\pokemon card sim\index.html` in your browser.
2. If your browser blocks API requests from local files, run this folder with any local static server (for example VS Code Live Server) and open that served URL.

## Odds Sources

- Paldean Fates: https://www.pokepatch.com/articles/pokemon-paldean-fates-pull-rates
- Prismatic Evolutions: https://www.pokepatch.com/articles/pokemon-prismatic-evolutions-pull-rates
- Prismatic Evolutions notes: https://www.pokebeach.com/2025/01/prismatic-evolutions-pull-rates-higher-special-illustration-rare-rates-than-surging-sparks
- Surging Sparks: https://www.tcgplayer.com/content/article/Pok%C3%A9mon-TCG-Surging-Sparks-Pull-Rates/cf539776-6c2c-4cbf-a80f-2558e2f3e887/

## Important Note

Pokemon does not publish exact official pull rates, so this simulator uses high-sample community odds and a slot-based model to get as close as possible.
Per-card weighting uses live market-scarcity weighting inside each slot/tier to avoid flat same-tier pulls and better mimic chase-card rarity.
If the PokemonTCG API is blocked or unavailable, the app now auto-loads an offline fallback card pool so pack opening still works.

## Expand Later

To add more sets, update `PACK_CONFIG` in `app.js` with:

- `setAliases`
- `slotOdds`
- `oddsHighlights`
- `sources`

If you want your own local pack art, drop images in:

- `C:\\Users\\Zac\\Desktop\\pokemon card sim\\assets\\packs\\paldean-fates.png`
- `C:\\Users\\Zac\\Desktop\\pokemon card sim\\assets\\packs\\prismatic-evolutions.png`
- `C:\\Users\\Zac\\Desktop\\pokemon card sim\\assets\\packs\\surging-sparks.png`

## Publish To GitHub Pages

1. Create a new GitHub repo (for example `pokemon-pack-sim`).
2. In CMD from this folder:

```bat
cd "C:\Users\Zac\Desktop\pokemon card sim"
git init
git branch -M main
git add .
git commit -m "Initial pack simulator"
git remote add origin https://github.com/<your-username>/pokemon-pack-sim.git
git push -u origin main
```

3. In GitHub repo settings, enable **Pages** source: **GitHub Actions**.
4. Pushes to `main` will auto-deploy via `.github/workflows/deploy-pages.yml`.
