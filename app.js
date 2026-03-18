const API_BASE = "https://api.pokemontcg.io/v2";
const BINDER_STORAGE_KEY = "pokemon-pack-sim-binder-v2";
const REQUEST_TIMEOUT_MS = 20000;
const REQUEST_RETRIES = 2;

const PACK_CONFIG = [
  {
    key: "paldean-fates",
    setId: "sv4pt5",
    displayName: "Paldean Fates",
    shortCode: "PAF",
    releaseLabel: "Scarlet & Violet Special Set",
    localPackImage: "",
    packImage: "https://archives.bulbagarden.net/media/upload/2/2e/Paldean_Fates_Booster_Pikachu.png",
    setAliases: ["Paldean Fates", "Scarlet & Violet-Paldean Fates", "Scarlet & Violet-Paldean-Fates"],
    slotOdds: {
      reverseA: {
        defaultTier: "reverseFoil",
        options: [{ tier: "shinyRare", probability: 0.254 }],
      },
      reverseB: {
        defaultTier: "reverseFoil",
        options: [
          { tier: "shinyUltraRare", probability: 0.072 },
          { tier: "illustrationRare", probability: 0.072 },
          { tier: "specialIllustrationRare", probability: 0.017 },
          { tier: "hyperRare", probability: 0.016 },
        ],
      },
      rare: {
        defaultTier: "rareHolo",
        options: [
          { tier: "doubleRare", probability: 0.159 },
          { tier: "ultraRare", probability: 0.066 },
        ],
      },
    },
    cardWeighting: {
      marketFloor: 0.4,
      tierExponents: {
        reverseFoil: 0.06,
        shinyRare: 0.28,
        shinyUltraRare: 0.36,
        doubleRare: 0.24,
        ultraRare: 0.31,
        illustrationRare: 0.34,
        specialIllustrationRare: 0.47,
        hyperRare: 0.46,
      },
    },
    oddsHighlights: [
      { label: "Shiny Rare", probability: 0.254 },
      { label: "Shiny Ultra Rare", probability: 0.072 },
      { label: "Illustration Rare", probability: 0.072 },
      { label: "Special Illustration Rare", probability: 0.017 },
      { label: "Double Rare", probability: 0.159 },
      { label: "Ultra Rare", probability: 0.066 },
    ],
    sources: [
      {
        label: "PokePatch pull-rate sample",
        url: "https://www.pokepatch.com/articles/pokemon-paldean-fates-pull-rates",
      },
    ],
  },
  {
    key: "prismatic-evolutions",
    setId: "sv8pt5",
    displayName: "Prismatic Evolutions",
    shortCode: "PRE",
    releaseLabel: "Scarlet & Violet Special Set",
    localPackImage: "",
    packImage: "https://archives.bulbagarden.net/media/upload/5/53/Prismatic_Evolutions_Booster_Eevee_Sylveon.png",
    setAliases: ["Prismatic Evolutions", "Scarlet & Violet-Prismatic Evolutions", "Scarlet & Violet-Prismatic-Evolutions"],
    slotOdds: {
      reverseA: {
        defaultTier: "reverseFoil",
        options: [
          { tier: "pokeBallFoil", probability: 0.331 },
          { tier: "aceSpec", probability: 0.048 },
        ],
      },
      reverseB: {
        defaultTier: "reverseFoil",
        options: [
          { tier: "masterBallFoil", probability: 0.049 },
          { tier: "specialIllustrationRare", probability: 0.022 },
          { tier: "hyperRare", probability: 0.006 },
        ],
      },
      rare: {
        defaultTier: "rareHolo",
        options: [
          { tier: "doubleRare", probability: 0.165 },
          { tier: "ultraRare", probability: 0.075 },
        ],
      },
    },
    cardWeighting: {
      marketFloor: 0.4,
      tierExponents: {
        reverseFoil: 0.08,
        pokeBallFoil: 0.09,
        masterBallFoil: 0.14,
        aceSpec: 0.2,
        doubleRare: 0.27,
        ultraRare: 0.31,
        specialIllustrationRare: 0.56,
        hyperRare: 0.5,
      },
    },
    oddsHighlights: [
      { label: "Poke Ball Foil", probability: 0.331 },
      { label: "Master Ball Foil", probability: 0.049 },
      { label: "ACE SPEC", probability: 0.048 },
      { label: "Special Illustration Rare", probability: 0.022 },
      { label: "Double Rare", probability: 0.165 },
      { label: "Ultra Rare", probability: 0.075 },
    ],
    sources: [
      {
        label: "PokePatch pull-rate sample",
        url: "https://www.pokepatch.com/articles/pokemon-prismatic-evolutions-pull-rates",
      },
      {
        label: "PokeBeach pull-rate notes",
        url: "https://www.pokebeach.com/2025/01/prismatic-evolutions-pull-rates-higher-special-illustration-rare-rates-than-surging-sparks",
      },
    ],
  },
  {
    key: "surging-sparks",
    setId: "sv8",
    displayName: "Surging Sparks",
    shortCode: "SSP",
    releaseLabel: "Scarlet & Violet Expansion",
    localPackImage: "",
    packImage: "https://archives.bulbagarden.net/media/upload/8/8b/SV8_Booster_Pikachu.png",
    setAliases: ["Surging Sparks", "Scarlet & Violet-Surging Sparks", "Scarlet & Violet-Surging-Sparks"],
    slotOdds: {
      reverseA: {
        defaultTier: "reverseFoil",
        options: [{ tier: "aceSpec", probability: 0.05 }],
      },
      reverseB: {
        defaultTier: "reverseFoil",
        options: [
          { tier: "illustrationRare", probability: 0.077 },
          { tier: "specialIllustrationRare", probability: 0.012 },
          { tier: "hyperRare", probability: 0.005 },
        ],
      },
      rare: {
        defaultTier: "rareHolo",
        options: [
          { tier: "doubleRare", probability: 0.169 },
          { tier: "ultraRare", probability: 0.067 },
        ],
      },
    },
    cardWeighting: {
      marketFloor: 0.4,
      tierExponents: {
        reverseFoil: 0.06,
        aceSpec: 0.21,
        doubleRare: 0.24,
        ultraRare: 0.3,
        illustrationRare: 0.35,
        specialIllustrationRare: 0.51,
        hyperRare: 0.46,
      },
    },
    oddsHighlights: [
      { label: "ACE SPEC", probability: 0.05 },
      { label: "Illustration Rare", probability: 0.077 },
      { label: "Special Illustration Rare", probability: 0.012 },
      { label: "Hyper Rare", probability: 0.005 },
      { label: "Double Rare", probability: 0.169 },
      { label: "Ultra Rare", probability: 0.067 },
    ],
    sources: [
      {
        label: "TCGplayer pull-rate sample",
        url: "https://www.tcgplayer.com/content/article/Pok%C3%A9mon-TCG-Surging-Sparks-Pull-Rates/cf539776-6c2c-4cbf-a80f-2558e2f3e887/",
      },
    ],
  },
  {
    key: "obsidian-flames",
    setId: "sv3",
    displayName: "Obsidian Flames",
    shortCode: "OBF",
    releaseLabel: "Scarlet & Violet Expansion",
    localPackImage: "",
    packImage: "https://archives.bulbagarden.net/media/upload/5/52/SV3_Booster_Charizard.png",
    setAliases: ["Obsidian Flames", "Scarlet & Violet-Obsidian Flames", "Scarlet & Violet-Obsidian-Flames"],
    slotOdds: {
      reverseA: {
        defaultTier: "reverseFoil",
        options: [],
      },
      reverseB: {
        defaultTier: "reverseFoil",
        options: [
          { tier: "illustrationRare", probability: 0.11 },
          { tier: "specialIllustrationRare", probability: 0.025 },
          { tier: "hyperRare", probability: 0.012 },
        ],
      },
      rare: {
        defaultTier: "rareHolo",
        options: [
          { tier: "doubleRare", probability: 0.17 },
          { tier: "ultraRare", probability: 0.08 },
        ],
      },
    },
    cardWeighting: {
      marketFloor: 0.4,
      tierExponents: {
        reverseFoil: 0.06,
        doubleRare: 0.24,
        ultraRare: 0.3,
        illustrationRare: 0.34,
        specialIllustrationRare: 0.5,
        hyperRare: 0.47,
      },
    },
    oddsHighlights: [
      { label: "Illustration Rare", probability: 0.11 },
      { label: "Special Illustration Rare", probability: 0.025 },
      { label: "Hyper Rare", probability: 0.012 },
      { label: "Double Rare", probability: 0.17 },
      { label: "Ultra Rare", probability: 0.08 },
    ],
    sources: [
      {
        label: "PokePatch pull-rate sample",
        url: "https://www.pokepatch.com/articles/pokemon-obsidian-flames-pull-rates",
      },
    ],
  },
  {
    key: "temporal-forces",
    setId: "sv5",
    displayName: "Temporal Forces",
    shortCode: "TEF",
    releaseLabel: "Scarlet & Violet Expansion",
    localPackImage: "",
    packImage: "https://archives.bulbagarden.net/media/upload/d/d7/SV5_Booster_Walking_Wake.png",
    setAliases: ["Temporal Forces", "Scarlet & Violet-Temporal Forces", "Scarlet & Violet-Temporal-Forces"],
    slotOdds: {
      reverseA: {
        defaultTier: "reverseFoil",
        options: [{ tier: "aceSpec", probability: 0.05 }],
      },
      reverseB: {
        defaultTier: "reverseFoil",
        options: [
          { tier: "illustrationRare", probability: 0.13 },
          { tier: "specialIllustrationRare", probability: 0.023 },
          { tier: "hyperRare", probability: 0.009 },
        ],
      },
      rare: {
        defaultTier: "rareHolo",
        options: [
          { tier: "doubleRare", probability: 0.168 },
          { tier: "ultraRare", probability: 0.076 },
        ],
      },
    },
    cardWeighting: {
      marketFloor: 0.4,
      tierExponents: {
        reverseFoil: 0.06,
        aceSpec: 0.2,
        doubleRare: 0.24,
        ultraRare: 0.3,
        illustrationRare: 0.35,
        specialIllustrationRare: 0.5,
        hyperRare: 0.46,
      },
    },
    oddsHighlights: [
      { label: "ACE SPEC", probability: 0.05 },
      { label: "Illustration Rare", probability: 0.13 },
      { label: "Special Illustration Rare", probability: 0.023 },
      { label: "Hyper Rare", probability: 0.009 },
      { label: "Double Rare", probability: 0.168 },
      { label: "Ultra Rare", probability: 0.076 },
    ],
    sources: [
      {
        label: "PokePatch pull-rate sample",
        url: "https://www.pokepatch.com/articles/pokemon-temporal-forces-pull-rates",
      },
    ],
  },
  {
    key: "twilight-masquerade",
    setId: "sv6",
    displayName: "Twilight Masquerade",
    shortCode: "TWM",
    releaseLabel: "Scarlet & Violet Expansion",
    localPackImage: "",
    packImage: "https://archives.bulbagarden.net/media/upload/a/a0/SV6_Booster_Ogerpon.png",
    setAliases: ["Twilight Masquerade", "Scarlet & Violet-Twilight Masquerade", "Scarlet & Violet-Twilight-Masquerade"],
    slotOdds: {
      reverseA: {
        defaultTier: "reverseFoil",
        options: [{ tier: "aceSpec", probability: 0.05 }],
      },
      reverseB: {
        defaultTier: "reverseFoil",
        options: [
          { tier: "illustrationRare", probability: 0.126 },
          { tier: "specialIllustrationRare", probability: 0.024 },
          { tier: "hyperRare", probability: 0.009 },
        ],
      },
      rare: {
        defaultTier: "rareHolo",
        options: [
          { tier: "doubleRare", probability: 0.169 },
          { tier: "ultraRare", probability: 0.074 },
        ],
      },
    },
    cardWeighting: {
      marketFloor: 0.4,
      tierExponents: {
        reverseFoil: 0.06,
        aceSpec: 0.2,
        doubleRare: 0.24,
        ultraRare: 0.3,
        illustrationRare: 0.35,
        specialIllustrationRare: 0.51,
        hyperRare: 0.46,
      },
    },
    oddsHighlights: [
      { label: "ACE SPEC", probability: 0.05 },
      { label: "Illustration Rare", probability: 0.126 },
      { label: "Special Illustration Rare", probability: 0.024 },
      { label: "Hyper Rare", probability: 0.009 },
      { label: "Double Rare", probability: 0.169 },
      { label: "Ultra Rare", probability: 0.074 },
    ],
    sources: [
      {
        label: "PokePatch pull-rate sample",
        url: "https://www.pokepatch.com/articles/pokemon-twilight-masquerade-pull-rates",
      },
    ],
  },
  {
    key: "evolving-skies",
    setId: "swsh7",
    displayName: "Evolving Skies",
    shortCode: "EVS",
    releaseLabel: "Sword & Shield Expansion",
    localPackImage: "",
    packImage: "https://archives.bulbagarden.net/media/upload/5/5b/SWSH7_Booster_Umbreon.jpg",
    setAliases: ["Evolving Skies", "Sword & Shield-Evolving Skies", "Sword & Shield-Evolving-Skies"],
    slotOdds: {
      reverseA: {
        defaultTier: "reverseFoil",
        options: [{ tier: "aceSpec", probability: 0.018 }],
      },
      reverseB: {
        defaultTier: "reverseFoil",
        options: [],
      },
      rare: {
        defaultTier: "rareHolo",
        options: [
          { tier: "doubleRare", probability: 0.158 },
          { tier: "ultraRare", probability: 0.064 },
          { tier: "hyperRare", probability: 0.018 },
        ],
      },
    },
    cardWeighting: {
      marketFloor: 0.35,
      tierExponents: {
        reverseFoil: 0.05,
        aceSpec: 0.18,
        doubleRare: 0.23,
        ultraRare: 0.3,
        hyperRare: 0.5,
      },
    },
    oddsHighlights: [
      { label: "Radiant / Special Slot", probability: 0.018 },
      { label: "V Slot Hits", probability: 0.158 },
      { label: "VMAX / Alternate Art Hits", probability: 0.064 },
      { label: "Secret Rare Hits", probability: 0.018 },
    ],
    sources: [
      {
        label: "Community pull-rate sample",
        url: "https://www.pokepatch.com/articles/pokemon-evolving-skies-pull-rates",
      },
    ],
  },
  {
    key: "brilliant-stars",
    setId: "swsh9",
    displayName: "Brilliant Stars",
    shortCode: "BRS",
    releaseLabel: "Sword & Shield Expansion",
    localPackImage: "",
    packImage: "https://archives.bulbagarden.net/media/upload/4/4f/SWSH9_Booster_Charizard.jpg",
    setAliases: ["Brilliant Stars", "Sword & Shield-Brilliant Stars", "Sword & Shield-Brilliant-Stars"],
    slotOdds: {
      reverseA: {
        defaultTier: "reverseFoil",
        options: [{ tier: "aceSpec", probability: 0.021 }],
      },
      reverseB: {
        defaultTier: "reverseFoil",
        options: [{ tier: "illustrationRare", probability: 0.12 }],
      },
      rare: {
        defaultTier: "rareHolo",
        options: [
          { tier: "doubleRare", probability: 0.167 },
          { tier: "ultraRare", probability: 0.071 },
          { tier: "hyperRare", probability: 0.02 },
        ],
      },
    },
    cardWeighting: {
      marketFloor: 0.35,
      tierExponents: {
        reverseFoil: 0.05,
        aceSpec: 0.18,
        illustrationRare: 0.31,
        doubleRare: 0.23,
        ultraRare: 0.3,
        hyperRare: 0.5,
      },
    },
    oddsHighlights: [
      { label: "Trainer Gallery", probability: 0.12 },
      { label: "V Slot Hits", probability: 0.167 },
      { label: "VSTAR / Full Art Hits", probability: 0.071 },
      { label: "Secret Rare Hits", probability: 0.02 },
    ],
    sources: [
      {
        label: "Community pull-rate sample",
        url: "https://www.pokepatch.com/articles/pokemon-brilliant-stars-pull-rates",
      },
    ],
  },
  {
    key: "lost-origin",
    setId: "swsh11",
    displayName: "Lost Origin",
    shortCode: "LOR",
    releaseLabel: "Sword & Shield Expansion",
    localPackImage: "",
    packImage: "https://archives.bulbagarden.net/media/upload/7/78/SWSH11_Booster_Enamorus.jpg",
    setAliases: ["Lost Origin", "Sword & Shield-Lost Origin", "Sword & Shield-Lost-Origin"],
    slotOdds: {
      reverseA: {
        defaultTier: "reverseFoil",
        options: [{ tier: "aceSpec", probability: 0.021 }],
      },
      reverseB: {
        defaultTier: "reverseFoil",
        options: [{ tier: "illustrationRare", probability: 0.125 }],
      },
      rare: {
        defaultTier: "rareHolo",
        options: [
          { tier: "doubleRare", probability: 0.165 },
          { tier: "ultraRare", probability: 0.07 },
          { tier: "hyperRare", probability: 0.02 },
        ],
      },
    },
    cardWeighting: {
      marketFloor: 0.35,
      tierExponents: {
        reverseFoil: 0.05,
        aceSpec: 0.18,
        illustrationRare: 0.31,
        doubleRare: 0.23,
        ultraRare: 0.3,
        hyperRare: 0.5,
      },
    },
    oddsHighlights: [
      { label: "Trainer Gallery", probability: 0.125 },
      { label: "V Slot Hits", probability: 0.165 },
      { label: "VSTAR / Full Art Hits", probability: 0.07 },
      { label: "Secret Rare Hits", probability: 0.02 },
    ],
    sources: [
      {
        label: "Community pull-rate sample",
        url: "https://www.pokepatch.com/articles/pokemon-lost-origin-pull-rates",
      },
    ],
  },
];

const SLOT_TIER_TO_POOL_KEY = {
  common: "common",
  uncommon: "uncommon",
  rare: "rare",
  rareHolo: "rareHoloOrRare",
  doubleRare: "doubleRare",
  ultraRare: "ultraRare",
  illustrationRare: "illustrationRare",
  specialIllustrationRare: "specialIllustrationRare",
  hyperRare: "hyperRare",
  aceSpec: "aceSpec",
  shinyRare: "shinyRare",
  shinyUltraRare: "shinyUltraRare",
  pokeBallFoil: "reverseBase",
  masterBallFoil: "reverseBase",
  reverseFoil: "reverseBase",
  energy: "energy",
};

const TIER_LABEL = {
  reverseFoil: "Reverse Foil",
  rareHolo: "Rare / Holo Rare",
  doubleRare: "Double Rare",
  ultraRare: "Ultra Rare",
  illustrationRare: "Illustration Rare",
  specialIllustrationRare: "Special Illustration Rare",
  hyperRare: "Hyper Rare",
  aceSpec: "ACE SPEC Rare",
  shinyRare: "Shiny Rare",
  shinyUltraRare: "Shiny Ultra Rare",
  pokeBallFoil: "Poke Ball Foil",
  masterBallFoil: "Master Ball Foil",
  energy: "Basic Energy",
};

const HIT_TIER_ORDER = [
  "specialIllustrationRare",
  "hyperRare",
  "shinyUltraRare",
  "illustrationRare",
  "ultraRare",
  "doubleRare",
  "shinyRare",
  "aceSpec",
];

const PACK_PLACEHOLDER_COLORS = {
  "paldean-fates": ["#2f8df9", "#88f8e1"],
  "prismatic-evolutions": ["#8f5cff", "#ffd35b"],
  "surging-sparks": ["#ff9d2f", "#7df0ff"],
  "obsidian-flames": ["#ff6a3d", "#ffd25f"],
  "temporal-forces": ["#26d9ff", "#7f91ff"],
  "twilight-masquerade": ["#6f5cff", "#7cf2a0"],
  "evolving-skies": ["#43a5ff", "#86ffd4"],
  "brilliant-stars": ["#49b8ff", "#ffd05f"],
  "lost-origin": ["#7b64ff", "#ff8bc0"],
};

const state = {
  selectedPackKey: PACK_CONFIG[0].key,
  revealMode: "all",
  sortMode: "standard",
  soundEnabled: true,
  setData: {},
  currentPack: null,
  revealedInstanceIds: new Set(),
  justRevealedInstanceId: "",
  loadErrors: [],
  loadingPackKeys: new Set(),
  liveLoadedPackKeys: new Set(),
  allSetsCache: null,
  session: {
    packsOpened: 0,
    totalValue: 0,
    totalCards: 0,
    biggestHit: null,
  },
  binder: loadBinderFromStorage(),
  audioContext: null,
};

const dom = {
  loadStatus: document.getElementById("loadStatus"),
  packSelector: document.getElementById("packSelector"),
  revealMode: document.getElementById("revealMode"),
  sortMode: document.getElementById("sortMode"),
  soundToggle: document.getElementById("soundToggle"),
  resetSessionBtn: document.getElementById("resetSessionBtn"),
  resetBinderBtn: document.getElementById("resetBinderBtn"),
  openPackBtn: document.getElementById("openPackBtn"),
  oddsPanel: document.getElementById("oddsPanel"),
  packArt: document.getElementById("packArt"),
  fxLayer: document.getElementById("fxLayer"),
  packImage: document.getElementById("packImage"),
  packLogo: document.getElementById("packLogo"),
  selectedPackName: document.getElementById("selectedPackName"),
  selectedPackSub: document.getElementById("selectedPackSub"),
  packStats: document.getElementById("packStats"),
  cardsGrid: document.getElementById("cardsGrid"),
  openedPackSummary: document.getElementById("openedPackSummary"),
  sessionStats: document.getElementById("sessionStats"),
  binderGrid: document.getElementById("binderGrid"),
  cardTemplate: document.getElementById("cardTemplate"),
};

init().catch((error) => {
  console.error(error);
  setStatus("Unable to load cards from PokemonTCG API.", "error");
});

async function init() {
  wireControls();
  seedFallbackData();
  setStatus("Ready in fallback mode. Loading live card data...");
  renderPackSelector();
  renderOddsPanel();
  renderPackHeader();
  renderCards();
  renderSessionStats();
  renderBinder();
  updateButtons();
  loadPackLiveData(state.selectedPackKey);
}

function wireControls() {
  dom.revealMode.addEventListener("change", () => {
    state.revealMode = dom.revealMode.value;
    state.justRevealedInstanceId = "";
    if (state.currentPack) {
      if (state.revealMode === "all") {
        state.revealedInstanceIds = new Set(state.currentPack.map((card) => card.instanceId));
      }
    }
    renderCards();
    updateButtons();
  });

  dom.sortMode.addEventListener("change", () => {
    state.sortMode = dom.sortMode.value;
    renderCards();
    updateButtons();
  });

  dom.soundToggle.addEventListener("change", () => {
    state.soundEnabled = dom.soundToggle.checked;
  });

  dom.resetSessionBtn.addEventListener("click", () => {
    const okay = window.confirm("Reset this session's stats? Binder cards are kept.");
    if (!okay) return;
    state.session = {
      packsOpened: 0,
      totalValue: 0,
      totalCards: 0,
      biggestHit: null,
    };
    renderSessionStats();
  });

  dom.resetBinderBtn.addEventListener("click", () => {
    const okay = window.confirm("Reset binder collection data? This cannot be undone.");
    if (!okay) return;
    state.binder = createEmptyBinder();
    persistBinder();
    renderPackHeader();
    renderSessionStats();
    renderBinder();
  });

  dom.openPackBtn.addEventListener("click", () => {
    openPack();
  });
}

function setStatus(message, type = "") {
  dom.loadStatus.textContent = message;
  dom.loadStatus.classList.remove("ready", "error");
  if (type) {
    dom.loadStatus.classList.add(type);
  }
}
function seedFallbackData() {
  for (const packDef of PACK_CONFIG) {
    if (!state.setData[packDef.key]) {
      state.setData[packDef.key] = buildSyntheticSetData(packDef);
    }
  }
}

async function loadPackLiveData(packKey) {
  const packDef = PACK_CONFIG.find((pack) => pack.key === packKey);
  if (!packDef) {
    return;
  }
  if (state.loadingPackKeys.has(packKey) || state.liveLoadedPackKeys.has(packKey)) {
    return;
  }

  state.loadingPackKeys.add(packKey);
  setStatus(`Loading live data for ${packDef.displayName}...`);

  try {
    if (!state.allSetsCache) {
      state.allSetsCache = await fetchAllSets();
    }

    const setMeta = matchSet(packDef.setAliases, state.allSetsCache, packDef.setId);
    if (!setMeta) {
      throw new Error(`Set not found in API for ${packDef.displayName}`);
    }

    const rawCards = await fetchSetCards(setMeta.id);
    const cards = rawCards.map(normalizeCard).filter((card) => card.image);
    const pools = buildPools(cards);
    const weightedPools = buildWeightedPools(packDef, pools);
    const approxCardOdds = buildApproxPackOdds(packDef, weightedPools);

    state.setData[packKey] = {
      setMeta,
      cards,
      pools,
      weightedPools,
      approxCardOdds,
    };
    state.liveLoadedPackKeys.add(packKey);

    setStatus("Ready to rip packs.", "ready");
  } catch (error) {
    state.loadErrors.push(`${packDef.displayName}: ${error.message}`);
    setStatus(`Using fallback data for ${packDef.displayName}.`, "error");
  } finally {
    state.loadingPackKeys.delete(packKey);
    renderPackSelector();
    renderPackHeader();
    renderOddsPanel();
    renderCards();
    renderSessionStats();
    renderBinder();
    updateButtons();
  }
}

async function fetchAllSets() {
  const url = `${API_BASE}/sets?pageSize=300`;
  const payload = await fetchJsonWithTimeout(url, REQUEST_TIMEOUT_MS, "Set lookup");
  return payload.data ?? [];
}

async function fetchSetCards(setId) {
  const cards = [];
  let page = 1;
  const seenIds = new Set();
  const MAX_PAGES = 12;

  while (page <= MAX_PAGES) {
    const params = new URLSearchParams({
      q: `set.id:${setId}`,
      pageSize: "250",
      page: String(page),
      select: "id,name,number,rarity,images,supertype,subtypes,set,tcgplayer",
    });

    const payload = await fetchJsonWithTimeout(`${API_BASE}/cards?${params.toString()}`, REQUEST_TIMEOUT_MS, `Card fetch (${setId})`);
    const pageData = payload.data ?? [];
    let newCount = 0;
    for (const card of pageData) {
      if (!card?.id || seenIds.has(card.id)) {
        continue;
      }
      seenIds.add(card.id);
      cards.push(card);
      newCount += 1;
    }

    if (!pageData.length || cards.length >= (payload.totalCount ?? cards.length)) {
      break;
    }

    if (newCount === 0) {
      break;
    }

    page += 1;
  }

  return cards;
}

async function fetchJsonWithTimeout(url, timeoutMs, label) {
  let lastError = null;
  for (let attempt = 0; attempt <= REQUEST_RETRIES; attempt += 1) {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok) {
        throw new Error(`${label} failed (${response.status})`);
      }
      return await response.json();
    } catch (error) {
      if (error?.name === "AbortError") {
        lastError = new Error(`${label} timed out after ${Math.round(timeoutMs / 1000)}s`);
      } else {
        lastError = error;
      }
      if (attempt < REQUEST_RETRIES) {
        await sleep(350 * (attempt + 1));
      }
    } finally {
      window.clearTimeout(timer);
    }
  }
  throw lastError || new Error(`${label} failed`);
}

function sleep(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function matchSet(aliases, allSets, preferredSetId = "") {
  if (preferredSetId) {
    const byId = allSets.find((set) => set.id === preferredSetId);
    if (byId) {
      return byId;
    }
  }
  const cleanedAliases = aliases.map(cleanName);
  return (
    allSets.find((set) => cleanedAliases.includes(cleanName(set.name))) ??
    allSets.find((set) => cleanedAliases.some((alias) => cleanName(set.name).includes(alias)))
  );
}

function cleanName(value) {
  return (value ?? "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[\u2013\u2014\u2010]/g, "-")
    .replace(/[^a-z0-9]/g, "");
}

function normalizeCard(rawCard) {
  return {
    id: rawCard.id,
    name: rawCard.name ?? "Unknown Card",
    image: rawCard.images?.large || rawCard.images?.small || "",
    number: String(rawCard.number ?? ""),
    rarity: rawCard.rarity ?? "",
    tier: rarityToTier(rawCard.rarity),
    marketValue: findMarketValue(rawCard.tcgplayer?.prices),
    supertype: rawCard.supertype ?? "",
    subtypes: rawCard.subtypes ?? [],
    setCode: rawCard.set?.ptcgoCode || rawCard.set?.id || "",
  };
}

function findMarketValue(priceTable) {
  if (!priceTable || typeof priceTable !== "object") {
    return 0;
  }

  let best = 0;
  for (const variant of Object.values(priceTable)) {
    if (!variant || typeof variant !== "object") {
      continue;
    }
    if (typeof variant.market === "number") {
      best = Math.max(best, variant.market);
    }
  }
  return best;
}

function rarityToTier(rarityValue) {
  const rarity = (rarityValue ?? "").toLowerCase();
  if (!rarity) return "unknown";
  if (rarity.includes("trainer gallery")) return "illustrationRare";
  if (rarity.includes("radiant rare")) return "aceSpec";
  if (rarity.includes("rare holo vmax") || rarity.includes("rare holo vstar")) return "ultraRare";
  if (rarity.includes("rare holo v")) return "doubleRare";
  if (rarity.includes("rare ultra")) return "ultraRare";
  if (rarity.includes("rare secret")) return "hyperRare";
  if (rarity.includes("amazing rare")) return "illustrationRare";
  if (rarity.includes("special illustration rare")) return "specialIllustrationRare";
  if (rarity.includes("illustration rare")) return "illustrationRare";
  if (rarity.includes("shiny ultra rare")) return "shinyUltraRare";
  if (rarity.includes("shiny rare")) return "shinyRare";
  if (rarity.includes("double rare")) return "doubleRare";
  if (rarity.includes("ultra rare")) return "ultraRare";
  if (rarity.includes("hyper rare")) return "hyperRare";
  if (rarity.includes("ace spec")) return "aceSpec";
  if (rarity.includes("rare holo") || rarity.includes("holo rare")) return "rareHolo";
  if (rarity === "rare") return "rare";
  if (rarity === "uncommon") return "uncommon";
  if (rarity === "common") return "common";
  return "unknown";
}

function buildPools(cards) {
  const pools = {
    all: cards,
    common: cards.filter((card) => card.tier === "common"),
    uncommon: cards.filter((card) => card.tier === "uncommon"),
    rare: cards.filter((card) => card.tier === "rare"),
    rareHolo: cards.filter((card) => card.tier === "rareHolo"),
    doubleRare: cards.filter((card) => card.tier === "doubleRare"),
    ultraRare: cards.filter((card) => card.tier === "ultraRare"),
    illustrationRare: cards.filter((card) => card.tier === "illustrationRare"),
    specialIllustrationRare: cards.filter((card) => card.tier === "specialIllustrationRare"),
    hyperRare: cards.filter((card) => card.tier === "hyperRare"),
    aceSpec: cards.filter((card) => card.tier === "aceSpec"),
    shinyRare: cards.filter((card) => card.tier === "shinyRare"),
    shinyUltraRare: cards.filter((card) => card.tier === "shinyUltraRare"),
    energy: cards.filter((card) => card.supertype.toLowerCase() === "energy"),
  };

  pools.reverseBase = cards.filter((card) => ["common", "uncommon", "rare", "rareHolo"].includes(card.tier));
  pools.rareHoloOrRare = pools.rareHolo.length ? pools.rareHolo : pools.rare;

  return pools;
}

function buildWeightedPools(packDef, pools) {
  const weightedPools = {};
  for (const [poolKey, cards] of Object.entries(pools)) {
    weightedPools[poolKey] = makeWeightedPool(cards, (card) => getCardWeight(packDef, poolKey, card));
  }
  return weightedPools;
}

function makeWeightedPool(cards, weightFn) {
  const entries = [];
  let totalWeight = 0;

  for (const card of cards) {
    const weight = Math.max(weightFn(card), 0.005);
    totalWeight += weight;
    entries.push({ card, weight, probability: 0 });
  }

  if (!entries.length || totalWeight <= 0) {
    return { entries: [], totalWeight: 0, probabilityById: new Map() };
  }

  const probabilityById = new Map();
  for (const entry of entries) {
    entry.probability = entry.weight / totalWeight;
    probabilityById.set(entry.card.id, entry.probability);
  }

  return { entries, totalWeight, probabilityById };
}

function getCardWeight(packDef, poolKey, card) {
  const weighting = packDef.cardWeighting ?? {};
  const tierHint = card.tier || poolKey;
  const poolExponent = weighting.tierExponents?.[poolKey];
  const tierExponent = weighting.tierExponents?.[tierHint];
  const exponent =
    typeof poolExponent === "number"
      ? poolExponent
      : typeof tierExponent === "number"
        ? tierExponent
        : 0;

  let weight = 1;
  if (exponent > 0) {
    const floor = typeof weighting.marketFloor === "number" ? weighting.marketFloor : 0.4;
    const value = Math.max(card.marketValue || 0, floor);
    weight *= 1 / Math.pow(1 + value, exponent);
  }

  return weight;
}

function buildApproxPackOdds(packDef, weightedPools) {
  const slotPlan = [
    { count: 4, outcomes: [{ tier: "common", probability: 1 }] },
    { count: 3, outcomes: [{ tier: "uncommon", probability: 1 }] },
    { count: 1, outcomes: expandSlotOutcomes(packDef.slotOdds.reverseA) },
    { count: 1, outcomes: expandSlotOutcomes(packDef.slotOdds.reverseB) },
    { count: 1, outcomes: expandSlotOutcomes(packDef.slotOdds.rare) },
    { count: 1, outcomes: [{ tier: "energy", probability: 1 }] },
  ];

  const notPulled = new Map();

  for (const slot of slotPlan) {
    const perDrawChance = new Map();

    for (const outcome of slot.outcomes) {
      const poolKey = resolvePoolKey(outcome.tier);
      const weightedPool = weightedPools[poolKey];
      if (!weightedPool || !weightedPool.entries.length) {
        continue;
      }

      for (const entry of weightedPool.entries) {
        const previous = perDrawChance.get(entry.card.id) || 0;
        perDrawChance.set(entry.card.id, previous + outcome.probability * entry.probability);
      }
    }

    for (const [cardId, chancePerDraw] of perDrawChance.entries()) {
      const chanceThisSlot = 1 - Math.pow(1 - chancePerDraw, slot.count);
      const priorNotPulled = notPulled.get(cardId) ?? 1;
      notPulled.set(cardId, priorNotPulled * (1 - chanceThisSlot));
    }
  }

  const result = new Map();
  for (const [cardId, notHitChance] of notPulled.entries()) {
    result.set(cardId, 1 - notHitChance);
  }
  return result;
}

function expandSlotOutcomes(slotConfig) {
  const outcomes = [...slotConfig.options];
  const used = slotConfig.options.reduce((sum, option) => sum + option.probability, 0);
  const defaultChance = Math.max(1 - used, 0);
  outcomes.push({ tier: slotConfig.defaultTier, probability: defaultChance });
  return outcomes;
}

function resolvePoolKey(tier) {
  return SLOT_TIER_TO_POOL_KEY[tier] || tier;
}

function buildSyntheticSetData(packDef) {
  const cards = createSyntheticCards(packDef);
  const pools = buildPools(cards);
  const weightedPools = buildWeightedPools(packDef, pools);
  const approxCardOdds = buildApproxPackOdds(packDef, weightedPools);
  return {
    setMeta: {
      id: `${packDef.key}-fallback`,
      name: `${packDef.displayName} (Offline Fallback)`,
      images: {
        symbol: createPackPlaceholderDataUri(packDef),
        logo: createPackLogoPlaceholderDataUri(packDef),
      },
    },
    cards,
    pools,
    weightedPools,
    approxCardOdds,
  };
}

function createSyntheticCards(packDef) {
  const tierCounts = {
    common: 16,
    uncommon: 14,
    rare: 10,
    rareHolo: 12,
    doubleRare: 10,
    ultraRare: 8,
    illustrationRare: 7,
    specialIllustrationRare: 5,
    hyperRare: 4,
    aceSpec: 4,
    shinyRare: 10,
    shinyUltraRare: 5,
    energy: 8,
  };

  const tierBaseValue = {
    common: 0.05,
    uncommon: 0.12,
    rare: 0.25,
    rareHolo: 0.6,
    doubleRare: 1.8,
    ultraRare: 4.8,
    illustrationRare: 8.2,
    specialIllustrationRare: 22,
    hyperRare: 26,
    aceSpec: 3.4,
    shinyRare: 2.1,
    shinyUltraRare: 9.3,
    energy: 0.03,
  };

  const cards = [];
  for (const [tier, count] of Object.entries(tierCounts)) {
    for (let i = 1; i <= count; i += 1) {
      const baseValue = tierBaseValue[tier] || 0.2;
      const marketValue = Number((baseValue + (i / count) * baseValue * 0.55).toFixed(2));
      cards.push({
        id: `${packDef.key}-${tier}-${i}`,
        name: `${formatTierName(tier)} ${i}`,
        image: createCardPlaceholderDataUri(packDef, tier, i),
        number: `${i}`,
        rarity: TIER_LABEL[tier] || "Card",
        tier,
        marketValue,
        supertype: tier === "energy" ? "Energy" : "Pokemon",
        subtypes: [],
        setCode: packDef.shortCode,
      });
    }
  }

  return cards;
}
function renderPackSelector() {
  dom.packSelector.innerHTML = "";
  const selectedPack = getCurrentPackDef();
  const select = document.createElement("select");
  select.id = "packSelect";
  select.setAttribute("aria-label", "Choose a pack");

  for (const packDef of PACK_CONFIG) {
    const option = document.createElement("option");
    option.value = packDef.key;

    const isLive = state.liveLoadedPackKeys.has(packDef.key);
    const isLoading = state.loadingPackKeys.has(packDef.key);
    const loadLabel = isLoading ? "loading..." : isLive ? "live" : "fallback";

    option.textContent = `${packDef.displayName} (${loadLabel})`;
    select.appendChild(option);
  }

  select.value = state.selectedPackKey;
  select.addEventListener("change", () => {
    const nextPack = PACK_CONFIG.find((pack) => pack.key === select.value);
    if (!nextPack) return;
    state.selectedPackKey = nextPack.key;
    state.currentPack = null;
    state.revealedInstanceIds = new Set();
    state.justRevealedInstanceId = "";
    renderPackSelector();
    renderPackHeader();
    renderOddsPanel();
    renderCards();
    renderSessionStats();
    updateButtons();
    loadPackLiveData(nextPack.key);
  });

  const helper = document.createElement("p");
  helper.className = "pack-select-meta";
  helper.textContent = selectedPack.releaseLabel;

  dom.packSelector.append(select, helper);
}

function renderPackHeader() {
  const packDef = getCurrentPackDef();
  const setData = state.setData[packDef.key];

  dom.selectedPackName.textContent = packDef.displayName;
  dom.selectedPackSub.textContent = packDef.releaseLabel;

  applyImageWithFallback(dom.packImage, [
    packDef.localPackImage,
    packDef.packImage,
    setData?.setMeta?.images?.symbol,
    setData?.setMeta?.images?.logo,
    createPackPlaceholderDataUri(packDef),
  ]);

  applyImageWithFallback(dom.packLogo, [setData?.setMeta?.images?.logo]);

  const stats = [];
  if (setData) {
    const completion = getSetCompletion(packDef.key);
    stats.push(`<span class="pack-stat">${setData.cards.length} cards loaded</span>`);
    stats.push(`<span class="pack-stat">${completion.unique}/${completion.total} binder (${completion.percent}%)</span>`);
  } else {
    stats.push("<span class=\"pack-stat\">Set data unavailable</span>");
  }
  stats.push(`<span class="pack-stat">${packDef.shortCode}</span>`);
  dom.packStats.innerHTML = stats.join("");
}

function renderOddsPanel() {
  const packDef = getCurrentPackDef();
  const setData = state.setData[packDef.key];

  const baseList = packDef.oddsHighlights
    .map((entry) => `<li><span>${entry.label}</span><strong>${formatPercent(entry.probability)}</strong></li>`)
    .join("");

  let chaseMarkup = "";
  if (setData) {
    const topChase = [...setData.cards]
      .filter((card) => card.marketValue > 0)
      .sort((a, b) => b.marketValue - a.marketValue)
      .slice(0, 3)
      .map((card) => {
        const packOdds = setData.approxCardOdds.get(card.id) || 0;
        return {
          name: card.name,
          oddsText: packOdds > 0 ? `~1 in ${Math.max(1, Math.round(1 / packOdds)).toLocaleString()}` : "n/a",
        };
      });

    chaseMarkup = `
      <div class="odds-title">Approx Specific Card Odds (Weighted)</div>
      <ul class="odds-list">
        ${topChase.map((item) => `<li><span>${item.name}</span><strong>${item.oddsText}</strong></li>`).join("")}
      </ul>
    `;
  }

  const sourceLinks = packDef.sources
    .map((source) => `<a href="${source.url}" target="_blank" rel="noreferrer">${source.label}</a>`)
    .join(" | ");

  dom.oddsPanel.innerHTML = `
    <div class="odds-title">Rarity Slot Odds (${packDef.displayName})</div>
    <ul class="odds-list">${baseList}</ul>
    ${chaseMarkup}
    <div class="odds-source">Per-card weighting: market-scarcity weighted by tier. Sources: ${sourceLinks}</div>
  `;
}

function openPack() {
  const packDef = getCurrentPackDef();
  const setData = state.setData[packDef.key];

  if (!setData) {
    setStatus(`Cannot open ${packDef.displayName} until cards load.`, "error");
    return;
  }

  triggerPackAnimation();
  playPackOpenSound();

  state.currentPack = simulatePack(packDef, setData);
  state.revealedInstanceIds =
    state.revealMode === "all"
      ? new Set(state.currentPack.map((card) => card.instanceId))
      : new Set();
  state.justRevealedInstanceId = "";

  registerOpenedPack(state.currentPack);

  if (state.revealMode === "all") {
    const topCard = [...state.currentPack].sort((a, b) => b.value - a.value)[0];
    playRevealSound(topCard);
  }

  renderPackHeader();
  renderOddsPanel();
  renderCards();
  renderSessionStats();
  renderBinder();
  updateButtons();
}

function simulatePack(packDef, setData) {
  const usedIds = new Set();
  const result = [];

  const pushCard = (slotLabel, tier, variant = "") => {
    const picked = pickCardFromTier(setData, tier, usedIds, variant);
    const packPullOdds = setData.approxCardOdds.get(picked.id) || 0;
    result.push({
      ...picked,
      slotLabel,
      pulledTier: tier,
      pulledTierLabel: variant || TIER_LABEL[tier] || picked.rarity || "Hit",
      standardIndex: result.length + 1,
      instanceId: `${picked.id}-${result.length}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      value: picked.marketValue || 0,
      packPullOdds,
      setKey: packDef.key,
    });
  };

  for (let i = 0; i < 4; i += 1) {
    pushCard(`Common ${i + 1}`, "common");
  }
  for (let i = 0; i < 3; i += 1) {
    pushCard(`Uncommon ${i + 1}`, "uncommon");
  }

  pushCard("Reverse Slot A", rollSlot(packDef.slotOdds.reverseA));
  pushCard("Reverse Slot B", rollSlot(packDef.slotOdds.reverseB));
  pushCard("Rare Slot", rollSlot(packDef.slotOdds.rare));
  pushCard("Energy", "energy");

  return result;
}

function rollSlot(slotConfig) {
  let cursor = 0;
  const roll = Math.random();
  for (const option of slotConfig.options) {
    cursor += option.probability;
    if (roll <= cursor) {
      return option.tier;
    }
  }
  return slotConfig.defaultTier;
}

function pickCardFromTier(setData, tier, usedIds, explicitVariant = "") {
  let variant = explicitVariant;

  if (tier === "energy" && !setData.pools.energy.length) {
    return makeEnergyFallbackCard();
  }

  if (tier === "pokeBallFoil") {
    variant = "Poke Ball Foil";
  } else if (tier === "masterBallFoil") {
    variant = "Master Ball Foil";
  } else if (tier === "reverseFoil") {
    variant = "Reverse Foil";
  }

  const poolKey = resolvePoolKey(tier);
  const weightedPool = setData.weightedPools[poolKey];
  let chosen = drawFromWeightedPool(weightedPool, usedIds);

  if (!chosen) {
    const fallbackPool = setData.pools[poolKey] || setData.pools.reverseBase || setData.pools.all;
    const fallbackCandidates = fallbackPool.filter((card) => !usedIds.has(card.id));
    const pickFrom = fallbackCandidates.length ? fallbackCandidates : fallbackPool;
    chosen = pickFrom[Math.floor(Math.random() * pickFrom.length)] ?? makeFallbackCard();
  }

  if (chosen.id) {
    usedIds.add(chosen.id);
  }

  return {
    ...chosen,
    rarity: chosen.rarity || variant || TIER_LABEL[tier] || "Unknown",
    variant,
  };
}

function drawFromWeightedPool(weightedPool, usedIds) {
  if (!weightedPool || !weightedPool.entries.length) {
    return null;
  }

  const availableEntries = weightedPool.entries.filter((entry) => !usedIds.has(entry.card.id));
  const drawPool = availableEntries.length ? availableEntries : weightedPool.entries;

  let totalWeight = 0;
  for (const entry of drawPool) {
    totalWeight += entry.weight;
  }
  if (totalWeight <= 0) {
    return drawPool[Math.floor(Math.random() * drawPool.length)]?.card || null;
  }

  let roll = Math.random() * totalWeight;
  for (const entry of drawPool) {
    roll -= entry.weight;
    if (roll <= 0) {
      return entry.card;
    }
  }

  return drawPool[drawPool.length - 1]?.card || null;
}
function registerOpenedPack(cards) {
  const packValue = cards.reduce((sum, card) => sum + (card.value || 0), 0);
  state.session.packsOpened += 1;
  state.session.totalCards += cards.length;
  state.session.totalValue += packValue;

  for (const card of cards) {
    if (!state.session.biggestHit || (card.value || 0) > state.session.biggestHit.value) {
      state.session.biggestHit = {
        id: card.id,
        name: card.name,
        image: card.image,
        value: card.value || 0,
        setKey: card.setKey,
      };
    }
  }

  ingestCardsIntoBinder(cards);
  persistBinder();
}

function ingestCardsIntoBinder(cards) {
  for (const card of cards) {
    const existing = state.binder.cards[card.id];
    if (existing) {
      existing.count += 1;
      existing.bestValue = Math.max(existing.bestValue, card.value || 0);
      existing.lastPulledAt = Date.now();
    } else {
      state.binder.cards[card.id] = {
        id: card.id,
        name: card.name,
        image: card.image,
        rarity: card.rarity,
        setKey: card.setKey,
        setCode: card.setCode || "",
        count: 1,
        bestValue: card.value || 0,
        lastPulledAt: Date.now(),
      };
    }
  }
}

function renderSessionStats() {
  const completion = getSetCompletion(state.selectedPackKey);
  const averagePackValue = state.session.packsOpened ? state.session.totalValue / state.session.packsOpened : 0;
  const biggest = state.session.biggestHit;

  const cards = [
    { label: "Packs Opened", value: state.session.packsOpened.toLocaleString() },
    { label: "Cards Pulled", value: state.session.totalCards.toLocaleString() },
    { label: "Session Value", value: formatUsd(state.session.totalValue) },
    { label: "Avg / Pack", value: formatUsd(averagePackValue) },
    { label: "Set Completion", value: `${completion.percent}%` },
    { label: "Biggest Hit", value: biggest ? `${biggest.name} (${formatUsd(biggest.value)})` : "None yet" },
  ];

  dom.sessionStats.innerHTML = cards
    .map((item) => `<div class="session-stat-card"><strong>${item.value}</strong><span>${item.label}</span></div>`)
    .join("");
}

function renderBinder() {
  if (!state.binder || !state.binder.cards || typeof state.binder.cards !== "object") {
    state.binder = createEmptyBinder();
  }

  const entries = Object.values(state.binder.cards)
    .sort((a, b) => b.bestValue - a.bestValue || b.count - a.count || b.lastPulledAt - a.lastPulledAt);

  if (!entries.length) {
    dom.binderGrid.classList.add("empty");
    dom.binderGrid.innerHTML = "No cards in the binder yet. Open a pack to start your collection.";
    return;
  }

  dom.binderGrid.classList.remove("empty");
  dom.binderGrid.innerHTML = entries
    .map(
      (entry) => `
      <article class="binder-entry">
        <img src="${entry.image}" alt="${entry.name}" loading="lazy" onerror="this.src='https://images.pokemontcg.io/base1/4_hires.png'" />
        <div class="binder-entry-copy">
          <h3>${entry.name}</h3>
          <p>x${entry.count} pulled</p>
          <p>Best value: ${formatUsd(entry.bestValue)}</p>
        </div>
      </article>
    `,
    )
    .join("");
}

function getSetCompletion(setKey) {
  const setData = state.setData[setKey];
  if (!setData) {
    return { unique: 0, total: 0, percent: 0 };
  }

  let unique = 0;
  for (const card of Object.values(state.binder.cards)) {
    if (card.setKey === setKey) {
      unique += 1;
    }
  }

  const total = setData.cards.length;
  const percent = total ? Math.round((unique / total) * 100) : 0;
  return { unique, total, percent };
}

function getDisplayCards() {
  if (!state.currentPack) {
    return [];
  }

  const cards = [...state.currentPack];
  if (state.sortMode === "value") {
    cards.sort((a, b) => b.value - a.value || a.standardIndex - b.standardIndex);
  } else {
    cards.sort((a, b) => a.standardIndex - b.standardIndex);
  }
  return cards;
}

function renderCards() {
  const cards = getDisplayCards();
  dom.cardsGrid.innerHTML = "";

  if (!cards.length) {
    dom.openedPackSummary.innerHTML = "<span>No pack opened yet.</span>";
    return;
  }

  const revealAll = state.revealMode === "all";

  cards.forEach((card, index) => {
    const isRevealed = revealAll || state.revealedInstanceIds.has(card.instanceId);
    const fragment = dom.cardTemplate.content.cloneNode(true);
    const article = fragment.querySelector(".card-slot");
    const image = fragment.querySelector(".card-image");
    const name = fragment.querySelector(".card-name");
    const slotLabel = fragment.querySelector(".card-slot-label");
    const rarity = fragment.querySelector(".card-rarity");
    const odds = fragment.querySelector(".card-odds");
    const value = fragment.querySelector(".card-value");

    image.src = card.image || "";
    image.alt = card.name;
    image.onerror = () => {
      image.src = "https://images.pokemontcg.io/base1/4_hires.png";
    };

    article.style.animationDelay = `${index * 40}ms`;

    if (isRevealed) {
      article.classList.add("revealed");
      if (card.instanceId === state.justRevealedInstanceId) {
        article.classList.add("just-revealed");
      }
      name.textContent = card.name;
      slotLabel.textContent = card.slotLabel;
      rarity.textContent = card.variant ? `${card.variant} (${card.rarity})` : card.rarity;
      odds.textContent = card.packPullOdds > 0 ? `Approx specific odds: 1 in ${Math.max(1, Math.round(1 / card.packPullOdds)).toLocaleString()}` : "Approx specific odds: n/a";
      value.textContent = card.value > 0 ? `${formatUsd(card.value)}` : "No market data";
    } else {
      if (state.revealMode === "step") {
        article.classList.add("can-reveal");
        article.addEventListener("click", () => {
          revealCardByClick(card);
        });
      }
      name.textContent = `Hidden Card ${index + 1}`;
      slotLabel.textContent = "Click card to reveal";
      rarity.textContent = "???";
      odds.textContent = "";
      value.textContent = "";
    }

    dom.cardsGrid.appendChild(fragment);
  });

  const revealedCards = cards.filter((card) => revealAll || state.revealedInstanceIds.has(card.instanceId));
  const revealedCount = revealedCards.length;
  const totalValue = revealedCards.reduce((sum, card) => sum + (card.value || 0), 0);
  const chase = revealedCards.reduce((best, card) => (card.value > (best?.value || 0) ? card : best), null);

  dom.openedPackSummary.innerHTML = `
    <span>Revealed ${revealedCount}/${cards.length} cards</span>
    <span>Total Revealed Value: <strong>${formatUsd(totalValue)}</strong></span>
    <span>${chase ? `Top Pull: ${chase.name} (${formatUsd(chase.value)})` : "Top Pull: ???"}</span>
  `;
}

function updateButtons() {
  const canOpen = Boolean(state.setData[state.selectedPackKey]);
  dom.openPackBtn.disabled = !canOpen;
}

function revealCardByClick(card) {
  if (!state.currentPack || state.revealMode !== "step") {
    return;
  }
  if (state.revealedInstanceIds.has(card.instanceId)) {
    return;
  }
  state.revealedInstanceIds.add(card.instanceId);
  state.justRevealedInstanceId = card.instanceId;
  playRevealSound(card);
  renderCards();
  updateButtons();
}

function triggerPackAnimation() {
  dom.packArt.classList.remove("opening");
  dom.fxLayer.classList.remove("burst");

  void dom.packArt.offsetWidth;

  dom.packArt.classList.add("opening");
  dom.fxLayer.classList.add("burst");

  window.setTimeout(() => {
    dom.packArt.classList.remove("opening");
    dom.fxLayer.classList.remove("burst");
  }, 700);
}

function playPackOpenSound() {
  if (!state.soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  playTone(ctx, now, 130, 0.12, 0.18, "triangle", 200);
  playTone(ctx, now + 0.09, 190, 0.08, 0.12, "sawtooth", 260);
}

function playRevealSound(card) {
  if (!state.soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const tierRank = HIT_TIER_ORDER.indexOf(card?.pulledTier);
  const isBigHit = tierRank > -1 && tierRank <= 2;

  if (isBigHit || (card?.value || 0) >= 30) {
    playTone(ctx, now, 520, 0.09, 0.08, "square", 660);
    playTone(ctx, now + 0.1, 660, 0.1, 0.09, "square", 840);
    return;
  }

  playTone(ctx, now, 300, 0.05, 0.07, "triangle", 360);
}

function playTone(ctx, startTime, startFreq, duration, gainPeak, type, endFreq = startFreq) {
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(startFreq, startTime);
  oscillator.frequency.exponentialRampToValueAtTime(Math.max(endFreq, 1), startTime + duration);

  gainNode.gain.setValueAtTime(0.0001, startTime);
  gainNode.gain.exponentialRampToValueAtTime(gainPeak, startTime + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.start(startTime);
  oscillator.stop(startTime + duration + 0.02);
}

function getAudioContext() {
  const AudioContextType = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextType) {
    return null;
  }

  if (!state.audioContext) {
    state.audioContext = new AudioContextType();
  }

  if (state.audioContext.state === "suspended") {
    state.audioContext.resume().catch(() => {});
  }

  return state.audioContext;
}

function createEmptyBinder() {
  return { cards: {} };
}

function loadBinderFromStorage() {
  try {
    const raw = window.localStorage.getItem(BINDER_STORAGE_KEY);
    if (!raw) return createEmptyBinder();
    const parsed = JSON.parse(raw);
    if (
      !parsed ||
      typeof parsed !== "object" ||
      !parsed.cards ||
      typeof parsed.cards !== "object" ||
      Array.isArray(parsed.cards)
    ) {
      return createEmptyBinder();
    }
    return parsed;
  } catch {
    return createEmptyBinder();
  }
}

function persistBinder() {
  try {
    window.localStorage.setItem(BINDER_STORAGE_KEY, JSON.stringify(state.binder));
  } catch {
    // Ignore storage failures in private windows.
  }
}

function makeFallbackCard() {
  return {
    id: "fallback",
    name: "Mystery Card",
    image: "",
    rarity: "Unknown",
    marketValue: 0,
    setCode: "",
  };
}

function makeEnergyFallbackCard() {
  return {
    id: `energy-fallback-${Math.random().toString(16).slice(2)}`,
    name: "Basic Energy",
    image: "https://images.pokemontcg.io/sv1/278_hires.png",
    rarity: "Basic Energy",
    marketValue: 0,
    setCode: "",
    variant: "",
  };
}

function getCurrentPackDef() {
  return PACK_CONFIG.find((pack) => pack.key === state.selectedPackKey) || PACK_CONFIG[0];
}

function applyImageWithFallback(imgEl, candidates) {
  const chain = candidates.filter(Boolean);
  let index = 0;

  if (!chain.length) {
    imgEl.removeAttribute("src");
    return;
  }

  imgEl.onerror = () => {
    index += 1;
    if (index >= chain.length) {
      imgEl.removeAttribute("src");
      return;
    }
    imgEl.src = chain[index];
  };

  imgEl.src = chain[index];
}

function createPackPlaceholderDataUri(packDef) {
  const colors = PACK_PLACEHOLDER_COLORS[packDef.key] || ["#366faf", "#9ad6ff"];
  const label = packDef.displayName.replace(/&/g, "and");
  const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' width='360' height='520' viewBox='0 0 360 520'>
      <defs>
        <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0%' stop-color='${colors[0]}' />
          <stop offset='100%' stop-color='${colors[1]}' />
        </linearGradient>
      </defs>
      <rect width='360' height='520' rx='24' fill='#0b1d33' />
      <rect x='18' y='18' width='324' height='484' rx='20' fill='url(#g)' opacity='0.35' />
      <text x='50%' y='45%' dominant-baseline='middle' text-anchor='middle' fill='#e9f5ff' font-size='34' font-family='Segoe UI, Arial, sans-serif'>${label}</text>
      <text x='50%' y='57%' dominant-baseline='middle' text-anchor='middle' fill='#d2e8ff' font-size='22' font-family='Segoe UI, Arial, sans-serif'>Booster Pack</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function createPackLogoPlaceholderDataUri(packDef) {
  const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' width='420' height='120' viewBox='0 0 420 120'>
      <rect width='420' height='120' rx='16' fill='#0b1d33' />
      <text x='50%' y='52%' dominant-baseline='middle' text-anchor='middle' fill='#ffe580' font-size='34' font-family='Segoe UI, Arial, sans-serif'>${packDef.displayName}</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function createCardPlaceholderDataUri(packDef, tier, index) {
  const colors = PACK_PLACEHOLDER_COLORS[packDef.key] || ["#366faf", "#9ad6ff"];
  const tierLabel = formatTierName(tier);
  const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' width='600' height='840' viewBox='0 0 600 840'>
      <defs>
        <linearGradient id='bg' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0%' stop-color='${colors[0]}' />
          <stop offset='100%' stop-color='${colors[1]}' />
        </linearGradient>
      </defs>
      <rect width='600' height='840' rx='28' fill='#0c1930' />
      <rect x='22' y='22' width='556' height='796' rx='24' fill='url(#bg)' opacity='0.36' />
      <text x='50%' y='18%' dominant-baseline='middle' text-anchor='middle' fill='#e9f5ff' font-size='34' font-family='Segoe UI, Arial, sans-serif'>${packDef.displayName}</text>
      <text x='50%' y='47%' dominant-baseline='middle' text-anchor='middle' fill='#ffe580' font-size='48' font-family='Segoe UI, Arial, sans-serif'>${tierLabel}</text>
      <text x='50%' y='58%' dominant-baseline='middle' text-anchor='middle' fill='#cde8ff' font-size='30' font-family='Segoe UI, Arial, sans-serif'>Card ${index}</text>
      <text x='50%' y='88%' dominant-baseline='middle' text-anchor='middle' fill='#d6ecff' font-size='24' font-family='Segoe UI, Arial, sans-serif'>Offline Placeholder</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function formatTierName(tier) {
  const label = TIER_LABEL[tier] || tier || "Card";
  return label.replace(/\s*\/\s*/g, " ");
}

function formatPercent(value) {
  return `${(value * 100).toFixed(1)}%`;
}

function formatUsd(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value || 0);
}
