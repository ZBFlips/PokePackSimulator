const API_BASE = "https://api.pokemontcg.io/v2";
const BINDER_STORAGE_KEY = "pokemon-pack-sim-binder-v2";
const PROFILE_STORAGE_KEY = "pokemon-pack-sim-profile-v1";
const CHASE_STORAGE_KEY = "pokemon-pack-sim-chase-v1";
const LIVE_SET_CACHE_PREFIX = "pokemon-pack-sim-live-set-v1-";
const LIVE_SET_CACHE_TTL_MS = 1000 * 60 * 60 * 12;
const REQUEST_TIMEOUT_MS = 20000;
const REQUEST_RETRIES = 2;
const IMAGE_FALLBACK_TIMEOUT_MS = 4500;
const SHARE_RENDER_TIMEOUT_MS = 9000;
const CHASE_SLOT_COUNT = 2;
const CHASE_CANDIDATE_LIMIT = 40;

const PACK_CONFIG = [
  {
    key: "paldean-fates",
    setId: "sv4pt5",
    displayName: "Paldean Fates",
    shortCode: "PAF",
    releaseLabel: "Scarlet & Violet Special Set",
    localPackImage: "assets/packs/paldean-fates.png",
    packImage: "",
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
    localPackImage: "assets/packs/prismatic-evolutions.png",
    packImage: "",
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
    localPackImage: "assets/packs/surging-sparks.png",
    packImage: "",
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
    localPackImage: "assets/packs/obsidian-flames.png",
    packImage: "",
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
    localPackImage: "assets/packs/temporal-forces.png",
    packImage: "",
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
    localPackImage: "assets/packs/twilight-masquerade.png",
    packImage: "",
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
    localPackImage: "assets/packs/evolving-skies.jpg",
    packImage: "",
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
    localPackImage: "assets/packs/brilliant-stars.jpg",
    packImage: "",
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
    localPackImage: "assets/packs/lost-origin.jpg",
    packImage: "",
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

const ACHIEVEMENTS = [
  {
    id: "first-pack",
    title: "First Rip",
    description: "Open your first pack.",
    xp: 20,
    condition: ({ session }) => session.packsOpened >= 1,
  },
  {
    id: "value-spike",
    title: "Value Spike",
    description: "Open a pack worth $12 or more.",
    xp: 35,
    condition: ({ packValue }) => packValue >= 12,
  },
  {
    id: "ultra-hunter",
    title: "Ultra Hunter",
    description: "Pull an Ultra Rare, IR, SIR, or better.",
    xp: 45,
    condition: ({ cards }) => cards.some((card) => isUltraPlusTier(card.pulledTier)),
  },
  {
    id: "sir-sniper",
    title: "SIR Sniper",
    description: "Pull a Special Illustration Rare / Hyper Rare tier card.",
    xp: 80,
    condition: ({ cards }) => cards.some((card) => isSirPlusTier(card.pulledTier)),
  },
  {
    id: "binder-builder",
    title: "Binder Builder",
    description: "Collect 50 unique cards in your binder.",
    xp: 60,
    condition: ({ binderUnique }) => binderUnique >= 50,
  },
  {
    id: "big-hit",
    title: "Big Hit",
    description: "Pull a single card worth $25 or more.",
    xp: 70,
    condition: ({ cards }) => cards.some((card) => (card.value || 0) >= 25),
  },
  {
    id: "grinder",
    title: "Grinder",
    description: "Open 25 packs this session.",
    xp: 75,
    condition: ({ session }) => session.packsOpened >= 25,
  },
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
  chaseTargetsBySet: loadChaseTargetsFromStorage(),
  profile: loadProfileFromStorage(),
  inspectCard: null,
  session: {
    packsOpened: 0,
    totalValue: 0,
    totalCards: 0,
    biggestHit: null,
    xpEarned: 0,
    unlockedAchievements: [],
    pity: {
      ultraPlus: 0,
      sirPlus: 0,
    },
    chaseStats: {},
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
  sharePullBtn: document.getElementById("sharePullBtn"),
  chasePanel: document.getElementById("chasePanel"),
  oddsPanel: document.getElementById("oddsPanel"),
  playPanel: document.querySelector(".play-panel"),
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
  achievementPanel: document.getElementById("achievementPanel"),
  binderGrid: document.getElementById("binderGrid"),
  inspectModal: document.getElementById("inspectModal"),
  inspectCloseBtn: document.getElementById("inspectCloseBtn"),
  inspectCardTilt: document.getElementById("inspectCardTilt"),
  inspectCardImage: document.getElementById("inspectCardImage"),
  inspectCardName: document.getElementById("inspectCardName"),
  inspectCardRarity: document.getElementById("inspectCardRarity"),
  inspectCardSlot: document.getElementById("inspectCardSlot"),
  inspectCardOdds: document.getElementById("inspectCardOdds"),
  inspectCardValue: document.getElementById("inspectCardValue"),
  cardTemplate: document.getElementById("cardTemplate"),
};

init().catch((error) => {
  console.error(error);
  setStatus("Unable to load cards from PokemonTCG API.", "error");
});

async function init() {
  wireControls();
  seedFallbackData();
  const cachedSets = hydrateLiveSetCache();
  setStatus(cachedSets ? `Ready from cache (${cachedSets} sets).` : "Ready in fallback mode. Loading live card data...");
  renderPackSelector();
  renderChasePanel();
  renderOddsPanel();
  renderPackHeader();
  renderCards();
  renderSessionStats();
  renderAchievements();
  renderBinder();
  updateButtons();
  if (state.liveLoadedPackKeys.has(state.selectedPackKey)) {
    setStatus("Ready to rip packs.", "ready");
  } else {
    loadPackLiveData(state.selectedPackKey);
  }
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
      xpEarned: 0,
      unlockedAchievements: [],
      pity: {
        ultraPlus: 0,
        sirPlus: 0,
      },
      chaseStats: {},
    };
    closeInspectModal();
    renderChasePanel();
    renderSessionStats();
    renderAchievements();
    renderCards();
    updateButtons();
  });

  dom.resetBinderBtn.addEventListener("click", () => {
    const okay = window.confirm("Reset binder collection data? This cannot be undone.");
    if (!okay) return;
    state.binder = createEmptyBinder();
    persistBinder();
    renderPackHeader();
    renderSessionStats();
    renderAchievements();
    renderBinder();
  });

  dom.openPackBtn.addEventListener("click", () => {
    openPack();
  });

  if (dom.sharePullBtn) {
    dom.sharePullBtn.addEventListener("click", () => {
      shareTopPull().catch((error) => {
        console.error(error);
        setStatus("Unable to share that pull right now.", "error");
      });
    });
  }

  if (dom.inspectCloseBtn) {
    dom.inspectCloseBtn.addEventListener("click", () => {
      closeInspectModal();
    });
  }

  if (dom.inspectModal) {
    dom.inspectModal.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      if (target.dataset.closeInspect === "") {
        closeInspectModal();
      }
    });

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !dom.inspectModal.hidden) {
        closeInspectModal();
      }
    });
  }

  if (dom.inspectCardTilt) {
    dom.inspectCardTilt.addEventListener("pointermove", handleInspectPointerMove);
    dom.inspectCardTilt.addEventListener("pointerleave", resetInspectTilt);
    dom.inspectCardTilt.addEventListener("pointerup", resetInspectTilt);
    dom.inspectCardTilt.addEventListener("pointercancel", resetInspectTilt);
  }
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
    let setMeta = state.setData[packKey]?.setMeta ?? null;
    try {
      setMeta = await fetchSetMetaById(packDef.setId);
    } catch (metaError) {
      console.warn(`Set meta lookup failed for ${packDef.displayName}:`, metaError);
    }

    const rawCards = await fetchSetCards(packDef.setId);
    if (!rawCards.length) {
      throw new Error(`No cards returned for ${packDef.displayName}`);
    }
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
    persistLiveSetCache(packKey, setMeta, cards);

    setStatus("Ready to rip packs.", "ready");
  } catch (error) {
    state.loadErrors.push(`${packDef.displayName}: ${error.message}`);
    setStatus(`Using fallback data for ${packDef.displayName}.`, "error");
  } finally {
    state.loadingPackKeys.delete(packKey);
    renderPackSelector();
    renderChasePanel();
    renderPackHeader();
    renderOddsPanel();
    renderCards();
    renderSessionStats();
    renderAchievements();
    renderBinder();
    updateButtons();
  }
}

async function fetchSetMetaById(setId) {
  const payload = await fetchJsonWithTimeout(`${API_BASE}/sets/${setId}`, REQUEST_TIMEOUT_MS, `Set lookup (${setId})`);
  return payload.data ?? null;
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
    closeInspectModal();
    renderPackSelector();
    renderChasePanel();
    renderPackHeader();
    renderOddsPanel();
    renderCards();
    renderSessionStats();
    renderAchievements();
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
    getSetSymbolUrl(packDef.setId),
    getSetLogoUrl(packDef.setId),
    setData?.setMeta?.images?.symbol,
    setData?.setMeta?.images?.logo,
    createPackPlaceholderDataUri(packDef),
  ]);

  applyImageWithFallback(dom.packLogo, [
    setData?.setMeta?.images?.logo,
    getSetLogoUrl(packDef.setId),
    createPackLogoPlaceholderDataUri(packDef),
  ]);

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

function renderChasePanel() {
  if (!dom.chasePanel) return;
  const packDef = getCurrentPackDef();
  const setData = state.setData[packDef.key];
  const targets = getChaseTargetsForSet(packDef.key);
  const candidates = getChaseCandidates(setData);

  const selectMarkup = [];
  for (let i = 0; i < CHASE_SLOT_COUNT; i += 1) {
    const selectedId = targets[i] || "";
    const optionMarkup = [
      `<option value="">No chase selected</option>`,
      ...candidates.map((card) => {
        const selected = card.id === selectedId ? " selected" : "";
        return `<option value="${card.id}"${selected}>${escapeHtml(card.name)} (${formatUsd(card.marketValue || 0)})</option>`;
      }),
    ].join("");
    selectMarkup.push(`
      <div class="control-group">
        <label for="chaseSelect${i}">Chase Slot ${i + 1}</label>
        <select id="chaseSelect${i}" data-chase-slot="${i}">
          ${optionMarkup}
        </select>
      </div>
    `);
  }

  const pityUltra = state.session.pity.ultraPlus;
  const pitySir = state.session.pity.sirPlus;
  const selectedCards = targets
    .map((id) => setData?.cards?.find((card) => card.id === id))
    .filter(Boolean);

  const trackerRows = selectedCards.length
    ? selectedCards
        .map((card) => {
          const stat = state.session.chaseStats[getChaseStatKey(packDef.key, card.id)] || { hits: 0, lastHitPack: 0 };
          const since = stat.lastHitPack > 0 ? state.session.packsOpened - stat.lastHitPack : state.session.packsOpened;
          const approxOdds = setData?.approxCardOdds?.get(card.id) || 0;
          return `
            <li>
              <span>${escapeHtml(card.name)}</span>
              <strong>${stat.hits} hits</strong>
              <em>${stat.lastHitPack ? `${since} packs since` : "Not hit yet"}</em>
              <em>${approxOdds > 0 ? `~1 in ${Math.max(1, Math.round(1 / approxOdds)).toLocaleString()}` : "Odds n/a"}</em>
            </li>
          `;
        })
        .join("")
    : `<li><span>Select chase cards to track exact pull streaks.</span></li>`;

  dom.chasePanel.innerHTML = `
    <div class="odds-title">Chase Tracker + Pity</div>
    <div class="chase-controls">
      ${selectMarkup.join("")}
    </div>
    <div class="pity-grid">
      ${buildPityMeter("Ultra+ pity", pityUltra, 6)}
      ${buildPityMeter("SIR+ pity", pitySir, 18)}
    </div>
    <ul class="chase-tracker-list">${trackerRows}</ul>
  `;

  dom.chasePanel.querySelectorAll("select[data-chase-slot]").forEach((selectEl) => {
    selectEl.addEventListener("change", () => {
      const slot = Number(selectEl.getAttribute("data-chase-slot"));
      upsertChaseTarget(packDef.key, slot, selectEl.value || "");
      renderChasePanel();
    });
  });
}

function buildPityMeter(label, count, target) {
  const pct = Math.min(100, Math.round((count / target) * 100));
  const tone = count >= target ? "hot" : count >= Math.round(target * 0.6) ? "warm" : "cool";
  return `
    <div class="pity-meter ${tone}">
      <div class="pity-row">
        <span>${label}</span>
        <strong>${count} packs</strong>
      </div>
      <div class="pity-bar"><span style="width:${pct}%"></span></div>
    </div>
  `;
}

function getChaseCandidates(setData) {
  if (!setData?.cards?.length) return [];
  return [...setData.cards]
    .sort((a, b) => (b.marketValue || 0) - (a.marketValue || 0))
    .slice(0, CHASE_CANDIDATE_LIMIT);
}

function getChaseTargetsForSet(setKey) {
  const existing = state.chaseTargetsBySet[setKey];
  if (Array.isArray(existing)) {
    const trimmed = existing.slice(0, CHASE_SLOT_COUNT).map((id) => String(id || ""));
    while (trimmed.length < CHASE_SLOT_COUNT) trimmed.push("");
    return trimmed;
  }
  return new Array(CHASE_SLOT_COUNT).fill("");
}

function upsertChaseTarget(setKey, slot, cardId) {
  const targets = getChaseTargetsForSet(setKey);
  targets[slot] = cardId;
  state.chaseTargetsBySet[setKey] = targets;
  persistChaseTargets();
}

function getChaseStatKey(setKey, cardId) {
  return `${setKey}::${cardId}`;
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
  closeInspectModal();

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
    triggerRevealCinematic(topCard);
  }

  renderPackHeader();
  renderChasePanel();
  renderOddsPanel();
  renderCards();
  renderSessionStats();
  renderAchievements();
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

  const hasUltraPlus = cards.some((card) => isUltraPlusTier(card.pulledTier));
  const hasSirPlus = cards.some((card) => isSirPlusTier(card.pulledTier));
  state.session.pity.ultraPlus = hasUltraPlus ? 0 : state.session.pity.ultraPlus + 1;
  state.session.pity.sirPlus = hasSirPlus ? 0 : state.session.pity.sirPlus + 1;

  const packDef = getCurrentPackDef();
  const chaseTargets = getChaseTargetsForSet(packDef.key).filter(Boolean);
  for (const cardId of chaseTargets) {
    const key = getChaseStatKey(packDef.key, cardId);
    if (!state.session.chaseStats[key]) {
      state.session.chaseStats[key] = { hits: 0, lastHitPack: 0 };
    }
    if (cards.some((card) => card.id === cardId)) {
      state.session.chaseStats[key].hits += 1;
      state.session.chaseStats[key].lastHitPack = state.session.packsOpened;
    }
  }

  ingestCardsIntoBinder(cards);
  evaluateAchievements(cards, packValue);
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
  const level = getLevelFromXp(state.profile.xp);

  const cards = [
    { label: "Packs Opened", value: state.session.packsOpened.toLocaleString() },
    { label: "Cards Pulled", value: state.session.totalCards.toLocaleString() },
    { label: "Session Value", value: formatUsd(state.session.totalValue) },
    { label: "Avg / Pack", value: formatUsd(averagePackValue) },
    { label: "Trainer Level", value: `Lv ${level.level}` },
    { label: "Set Completion", value: `${completion.percent}%` },
    { label: "Biggest Hit", value: biggest ? `${biggest.name} (${formatUsd(biggest.value)})` : "None yet" },
  ];

  dom.sessionStats.innerHTML = cards
    .map((item) => `<div class="session-stat-card"><strong>${item.value}</strong><span>${item.label}</span></div>`)
    .join("");
}

function renderAchievements() {
  if (!dom.achievementPanel) return;
  const unlockedIds = new Set(Object.keys(state.profile.achievements || {}));
  const levelInfo = getLevelFromXp(state.profile.xp);
  const xpForNext = levelInfo.nextLevelXp - state.profile.xp;
  const progress = levelInfo.nextLevelXp > levelInfo.levelStartXp
    ? Math.round(((state.profile.xp - levelInfo.levelStartXp) / (levelInfo.nextLevelXp - levelInfo.levelStartXp)) * 100)
    : 100;

  const recentUnlocks = state.session.unlockedAchievements.slice(0, 3);

  dom.achievementPanel.innerHTML = `
    <div class="achievement-head">
      <div>
        <strong>Achievements</strong>
        <span>${unlockedIds.size}/${ACHIEVEMENTS.length} unlocked</span>
      </div>
      <div>
        <strong>XP ${state.profile.xp.toLocaleString()}</strong>
        <span>${xpForNext > 0 ? `${xpForNext} XP to next level` : "Max vibe achieved"}</span>
      </div>
    </div>
    <div class="xp-bar"><span style="width:${Math.max(0, Math.min(100, progress))}%"></span></div>
    <div class="achievement-list">
      ${ACHIEVEMENTS.map((achievement) => {
        const unlocked = unlockedIds.has(achievement.id);
        return `
          <article class="achievement-item ${unlocked ? "unlocked" : "locked"}">
            <strong>${achievement.title}</strong>
            <span>${achievement.description}</span>
            <em>${unlocked ? `+${achievement.xp} XP` : "Locked"}</em>
          </article>
        `;
      }).join("")}
    </div>
    ${
      recentUnlocks.length
        ? `<p class="recent-achievement">Recent: ${recentUnlocks.map((item) => `${item.title} (+${item.xp} XP)`).join(" | ")}</p>`
        : ""
    }
  `;
}

function evaluateAchievements(cards, packValue) {
  const binderUnique = Object.keys(state.binder.cards || {}).length;
  const unlockedNow = [];

  for (const achievement of ACHIEVEMENTS) {
    if (state.profile.achievements[achievement.id]) {
      continue;
    }

    const earned = achievement.condition({
      cards,
      packValue,
      session: state.session,
      binderUnique,
      profile: state.profile,
    });

    if (!earned) continue;

    state.profile.achievements[achievement.id] = Date.now();
    state.profile.xp += achievement.xp;
    state.session.xpEarned += achievement.xp;
    unlockedNow.push(achievement);
  }

  if (unlockedNow.length) {
    state.session.unlockedAchievements.unshift(...unlockedNow);
    state.session.unlockedAchievements = state.session.unlockedAchievements.slice(0, 6);
    persistProfile();
    playAchievementSound(unlockedNow.length);
    const names = unlockedNow.map((item) => item.title).join(", ");
    setStatus(`Achievement unlocked: ${names}`, "ready");
  }
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
      article.classList.add(`impact-${getRevealImpact(card)}`);
      article.classList.add("inspectable");
      article.addEventListener("click", () => {
        openInspectModal(card);
      });
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
  const canShare = Boolean(getTopRevealedCard());
  dom.openPackBtn.disabled = !canOpen;
  if (dom.sharePullBtn) {
    dom.sharePullBtn.disabled = !canShare;
  }
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
  triggerRevealCinematic(card);
  renderCards();
  updateButtons();
}

function triggerPackAnimation() {
  dom.packArt.classList.remove("opening");
  dom.fxLayer.classList.remove("burst");
  dom.playPanel.classList.remove("screen-shake");

  void dom.packArt.offsetWidth;

  dom.packArt.classList.add("opening");
  dom.fxLayer.classList.add("burst");

  window.setTimeout(() => {
    dom.packArt.classList.remove("opening");
    dom.fxLayer.classList.remove("burst");
    dom.playPanel.classList.remove("screen-shake");
  }, 700);
}

function triggerRevealCinematic(card) {
  const impact = getRevealImpact(card);
  dom.fxLayer.classList.remove("burst-cool", "burst-warm", "burst-hot", "burst-epic");
  dom.playPanel.classList.remove("screen-shake");

  const burstClassByImpact = {
    cool: "burst-cool",
    warm: "burst-warm",
    hot: "burst-hot",
    epic: "burst-epic",
  };
  dom.fxLayer.classList.add("burst", burstClassByImpact[impact] || "burst-cool");

  if (impact === "hot" || impact === "epic") {
    dom.playPanel.classList.add("screen-shake");
  }

  window.setTimeout(() => {
    dom.fxLayer.classList.remove("burst", "burst-cool", "burst-warm", "burst-hot", "burst-epic");
    dom.playPanel.classList.remove("screen-shake");
  }, impact === "epic" ? 1050 : 780);
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
  const impact = getRevealImpact(card);

  if (impact === "epic") {
    playTone(ctx, now, 420, 0.12, 0.11, "square", 620);
    playTone(ctx, now + 0.12, 620, 0.13, 0.1, "triangle", 910);
    playTone(ctx, now + 0.27, 910, 0.16, 0.09, "sawtooth", 1100);
    return;
  }

  if (impact === "hot") {
    playTone(ctx, now, 360, 0.08, 0.09, "square", 500);
    playTone(ctx, now + 0.1, 500, 0.1, 0.08, "triangle", 700);
    return;
  }

  if (impact === "warm") {
    playTone(ctx, now, 290, 0.07, 0.06, "triangle", 390);
    playTone(ctx, now + 0.08, 390, 0.06, 0.05, "triangle", 460);
    return;
  }

  playTone(ctx, now, 250, 0.05, 0.045, "sine", 290);
}

function playAchievementSound(unlockCount = 1) {
  if (!state.soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  const step = Math.min(Math.max(unlockCount, 1), 3);
  playTone(ctx, now, 340, 0.08, 0.06, "triangle", 420 + step * 30);
  playTone(ctx, now + 0.09, 430, 0.1, 0.07, "triangle", 560 + step * 40);
  playTone(ctx, now + 0.21, 560, 0.13, 0.08, "square", 780 + step * 45);
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

function createEmptyProfile() {
  return {
    xp: 0,
    achievements: {},
  };
}

function loadProfileFromStorage() {
  try {
    const raw = window.localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return createEmptyProfile();
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return createEmptyProfile();
    const xp = Number(parsed.xp || 0);
    const achievements = parsed.achievements && typeof parsed.achievements === "object" ? parsed.achievements : {};
    return {
      xp: Number.isFinite(xp) ? Math.max(0, Math.round(xp)) : 0,
      achievements,
    };
  } catch {
    return createEmptyProfile();
  }
}

function persistProfile() {
  try {
    window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(state.profile));
  } catch {
    // Ignore storage failures in private windows.
  }
}

function loadChaseTargetsFromStorage() {
  try {
    const raw = window.localStorage.getItem(CHASE_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    const result = {};
    for (const [setKey, targets] of Object.entries(parsed)) {
      if (!Array.isArray(targets)) continue;
      result[setKey] = targets.slice(0, CHASE_SLOT_COUNT).map((item) => String(item || ""));
      while (result[setKey].length < CHASE_SLOT_COUNT) result[setKey].push("");
    }
    return result;
  } catch {
    return {};
  }
}

function persistChaseTargets() {
  try {
    window.localStorage.setItem(CHASE_STORAGE_KEY, JSON.stringify(state.chaseTargetsBySet));
  } catch {
    // Ignore storage failures in private windows.
  }
}

function getLevelFromXp(totalXp) {
  const safeXp = Math.max(0, Math.floor(Number(totalXp) || 0));
  const xpPerLevel = 120;
  const level = Math.floor(safeXp / xpPerLevel) + 1;
  const levelStartXp = (level - 1) * xpPerLevel;
  const nextLevelXp = level * xpPerLevel;
  return { level, levelStartXp, nextLevelXp };
}

function isUltraPlusTier(tier) {
  return ["ultraRare", "illustrationRare", "specialIllustrationRare", "hyperRare", "shinyUltraRare"].includes(tier);
}

function isSirPlusTier(tier) {
  return ["specialIllustrationRare", "hyperRare", "shinyUltraRare"].includes(tier);
}

function getRevealImpact(card) {
  const tier = card?.pulledTier || card?.tier || "";
  if (isSirPlusTier(tier) || (card?.value || 0) >= 40) return "epic";
  if (isUltraPlusTier(tier) || (card?.value || 0) >= 14) return "hot";
  if (["doubleRare", "aceSpec", "shinyRare", "rareHolo", "illustrationRare"].includes(tier) || (card?.value || 0) >= 5) return "warm";
  return "cool";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function hydrateLiveSetCache() {
  let loaded = 0;
  for (const packDef of PACK_CONFIG) {
    const cached = loadLiveSetCache(packDef.key);
    if (!cached?.cards?.length) continue;

    const cards = cached.cards.map(normalizeCachedCard).filter((card) => card.id && card.image);
    if (!cards.length) continue;

    const pools = buildPools(cards);
    const weightedPools = buildWeightedPools(packDef, pools);
    const approxCardOdds = buildApproxPackOdds(packDef, weightedPools);

    state.setData[packDef.key] = {
      setMeta: cached.setMeta || state.setData[packDef.key]?.setMeta || null,
      cards,
      pools,
      weightedPools,
      approxCardOdds,
    };
    state.liveLoadedPackKeys.add(packDef.key);
    loaded += 1;
  }
  return loaded;
}

function getLiveSetCacheKey(packKey) {
  return `${LIVE_SET_CACHE_PREFIX}${packKey}`;
}

function loadLiveSetCache(packKey) {
  try {
    const raw = window.localStorage.getItem(getLiveSetCacheKey(packKey));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    if (!Array.isArray(parsed.cards) || !parsed.savedAt) return null;
    if (Date.now() - parsed.savedAt > LIVE_SET_CACHE_TTL_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

function persistLiveSetCache(packKey, setMeta, cards) {
  try {
    const payload = {
      savedAt: Date.now(),
      setMeta: setMeta
        ? {
            id: setMeta.id || "",
            name: setMeta.name || "",
            images: {
              symbol: setMeta.images?.symbol || "",
              logo: setMeta.images?.logo || "",
            },
          }
        : null,
      cards: cards.map((card) => ({
        id: card.id || "",
        name: card.name || "",
        image: card.image || "",
        number: card.number || "",
        rarity: card.rarity || "",
        tier: card.tier || "",
        marketValue: Number(card.marketValue || 0),
        supertype: card.supertype || "",
        subtypes: Array.isArray(card.subtypes) ? card.subtypes : [],
        setCode: card.setCode || "",
      })),
    };
    window.localStorage.setItem(getLiveSetCacheKey(packKey), JSON.stringify(payload));
  } catch {
    // Ignore cache write failures when storage is unavailable or full.
  }
}

function normalizeCachedCard(rawCard) {
  return {
    id: rawCard.id,
    name: rawCard.name ?? "Unknown Card",
    image: rawCard.image || "",
    number: String(rawCard.number ?? ""),
    rarity: rawCard.rarity ?? "",
    tier: rawCard.tier || rarityToTier(rawCard.rarity),
    marketValue: Number(rawCard.marketValue || 0),
    supertype: rawCard.supertype ?? "",
    subtypes: Array.isArray(rawCard.subtypes) ? rawCard.subtypes : [],
    setCode: rawCard.setCode || "",
  };
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

function getSetSymbolUrl(setId) {
  return setId ? `https://images.pokemontcg.io/${setId}/symbol.png` : "";
}

function getSetLogoUrl(setId) {
  return setId ? `https://images.pokemontcg.io/${setId}/logo.png` : "";
}

function applyImageWithFallback(imgEl, candidates) {
  const chain = candidates.filter(Boolean);
  const requestToken = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  imgEl.dataset.fallbackRequest = requestToken;

  if (!chain.length) {
    imgEl.removeAttribute("src");
    return;
  }

  const tryLoadAt = (index) => {
    if (imgEl.dataset.fallbackRequest !== requestToken) {
      return;
    }

    if (index >= chain.length) {
      imgEl.removeAttribute("src");
      imgEl.onerror = null;
      imgEl.onload = null;
      return;
    }

    let settled = false;
    const timer = window.setTimeout(() => {
      if (settled) return;
      settled = true;
      tryLoadAt(index + 1);
    }, IMAGE_FALLBACK_TIMEOUT_MS);

    imgEl.onload = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      imgEl.onerror = null;
      imgEl.onload = null;
    };

    imgEl.onerror = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      tryLoadAt(index + 1);
    };

    imgEl.src = chain[index];
  };

  tryLoadAt(0);
}

function openInspectModal(card) {
  if (!card || !dom.inspectModal || !dom.inspectCardImage) return;
  state.inspectCard = card;
  dom.inspectCardImage.src = card.image || "";
  dom.inspectCardImage.alt = card.name || "Pokemon card";
  dom.inspectCardName.textContent = card.name || "Unknown Card";
  dom.inspectCardRarity.textContent = card.variant ? `${card.variant} (${card.rarity})` : card.rarity || "Unknown rarity";
  dom.inspectCardSlot.textContent = card.slotLabel || "Pack card";
  dom.inspectCardOdds.textContent = card.packPullOdds > 0
    ? `Approx odds: 1 in ${Math.max(1, Math.round(1 / card.packPullOdds)).toLocaleString()}`
    : "Approx odds: n/a";
  dom.inspectCardValue.textContent = card.value > 0 ? `Market value: ${formatUsd(card.value)}` : "No market data";
  dom.inspectModal.hidden = false;
  dom.inspectModal.classList.add("open");
}

function closeInspectModal() {
  if (!dom.inspectModal) return;
  if (dom.inspectModal.hidden) return;
  state.inspectCard = null;
  dom.inspectModal.classList.remove("open");
  dom.inspectModal.hidden = true;
  resetInspectTilt();
}

function handleInspectPointerMove(event) {
  if (!dom.inspectCardTilt) return;
  const rect = dom.inspectCardTilt.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  const x = (event.clientX - rect.left) / rect.width;
  const y = (event.clientY - rect.top) / rect.height;
  const rotY = ((x - 0.5) * 14).toFixed(2);
  const rotX = ((0.5 - y) * 14).toFixed(2);
  dom.inspectCardTilt.style.setProperty("--rx", `${rotX}deg`);
  dom.inspectCardTilt.style.setProperty("--ry", `${rotY}deg`);
  dom.inspectCardTilt.style.setProperty("--mx", `${Math.round(x * 100)}%`);
  dom.inspectCardTilt.style.setProperty("--my", `${Math.round(y * 100)}%`);
}

function resetInspectTilt() {
  if (!dom.inspectCardTilt) return;
  dom.inspectCardTilt.style.setProperty("--rx", "0deg");
  dom.inspectCardTilt.style.setProperty("--ry", "0deg");
  dom.inspectCardTilt.style.setProperty("--mx", "50%");
  dom.inspectCardTilt.style.setProperty("--my", "50%");
}

function getTopRevealedCard() {
  if (!state.currentPack?.length) return null;
  const revealAll = state.revealMode === "all";
  const revealed = state.currentPack.filter((card) => revealAll || state.revealedInstanceIds.has(card.instanceId));
  if (!revealed.length) return null;
  return revealed.reduce((best, card) => ((card.value || 0) > (best?.value || 0) ? card : best), null);
}

async function shareTopPull() {
  const topCard = getTopRevealedCard();
  if (!topCard) {
    setStatus("Reveal at least one card before sharing.", "error");
    return;
  }

  const blob = await buildShareImageBlob(topCard);
  const fileName = `poke-pull-${(topCard.name || "hit").replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.png`;
  const file = typeof File !== "undefined" ? new File([blob], fileName, { type: "image/png" }) : null;
  const shareText = `I pulled ${topCard.name} worth ${formatUsd(topCard.value || 0)} in Pokemon Pack Simulator!`;

  if (file && navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
    await navigator.share({
      title: "Pokemon Pack Simulator Pull",
      text: shareText,
      files: [file],
    });
    setStatus("Shared your top pull.", "ready");
    return;
  }

  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = fileName;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  setStatus("Saved pull card image for sharing.", "ready");
}

async function buildShareImageBlob(card) {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 630;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas unavailable");
  }

  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#0e2644");
  gradient.addColorStop(0.58, "#102a49");
  gradient.addColorStop(1, "#2e224a");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(255,255,255,0.06)";
  for (let i = 0; i < 16; i += 1) {
    ctx.fillRect(i * 80, 0, 1, canvas.height);
    ctx.fillRect(0, i * 80, canvas.width, 1);
  }

  const image = await loadImageForShare(card.image || "", SHARE_RENDER_TIMEOUT_MS);
  if (image) {
    const cardWidth = 360;
    const cardHeight = 500;
    const x = 80;
    const y = 65;
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.45)";
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 8;
    ctx.drawImage(image, x, y, cardWidth, cardHeight);
    ctx.restore();
  }

  ctx.fillStyle = "#f0f7ff";
  ctx.font = "700 52px Orbitron, Rajdhani, sans-serif";
  ctx.fillText("Top Pull", 500, 120);

  ctx.font = "700 44px Rajdhani, sans-serif";
  ctx.fillStyle = "#ffd45c";
  ctx.fillText(`${card.name || "Mystery Hit"}`, 500, 195);

  ctx.font = "600 34px Rajdhani, sans-serif";
  ctx.fillStyle = "#d0e8ff";
  ctx.fillText(card.variant ? `${card.variant} (${card.rarity || ""})` : card.rarity || "Pokemon Card", 500, 250);
  ctx.fillText(`Value: ${formatUsd(card.value || 0)}`, 500, 305);
  if (card.packPullOdds > 0) {
    ctx.fillText(`Approx odds: 1 in ${Math.max(1, Math.round(1 / card.packPullOdds)).toLocaleString()}`, 500, 360);
  }
  ctx.fillStyle = "#8eb7d9";
  ctx.font = "600 30px Rajdhani, sans-serif";
  ctx.fillText(`Set: ${getCurrentPackDef().displayName}`, 500, 430);

  ctx.fillStyle = "#c7def7";
  ctx.font = "600 26px Rajdhani, sans-serif";
  ctx.fillText("Pokemon Pack Simulator", 500, 520);

  return await new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Unable to render share image"));
        return;
      }
      resolve(blob);
    }, "image/png");
  });
}

function loadImageForShare(src, timeoutMs) {
  return new Promise((resolve) => {
    if (!src) {
      resolve(null);
      return;
    }
    const image = new Image();
    let settled = false;
    const timer = window.setTimeout(() => {
      if (settled) return;
      settled = true;
      resolve(null);
    }, timeoutMs);

    image.crossOrigin = "anonymous";
    image.onload = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      resolve(image);
    };
    image.onerror = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      resolve(null);
    };
    image.src = src;
  });
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
