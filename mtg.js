const SCRYFALL_API_BASE = "https://api.scryfall.com";
const MTG_PRICE_SOURCE_STORAGE_KEY = "mtg-pack-price-source-v1";
const MTG_DEFAULT_PACK_PRICE = 5.99;
const MTG_PRODUCT_STORAGE_KEY = "mtg-product-mode-v1";
const MTG_BINDER_STORAGE_KEY = "mtg-pack-sim-binder-v1";
const MTG_CHASE_STORAGE_KEY = "mtg-pack-sim-chase-v1";
const MTG_CHASE_FILTER_STORAGE_KEY = "mtg-pack-sim-chase-filter-v1";
const MTG_RNG_SETTINGS_STORAGE_KEY = "mtg-pack-sim-rng-v1";
const MTG_COMPACT_BINDER_STORAGE_KEY = "mtg-pack-sim-compact-binder-v1";
const MTG_ULTRA_COMPACT_BINDER_STORAGE_KEY = "mtg-pack-sim-ultra-compact-binder-v1";
const MTG_MARKET_VALUE_MODE_STORAGE_KEY = "mtg-pack-sim-market-value-mode-v1";
const MTG_OPENING_UX_MODE_STORAGE_KEY = "mtg-pack-sim-opening-ux-mode-v1";
const MTG_MARKET_SNAPSHOT_URL = "./assets/data/mtg-market-snapshot.json";
const MTG_QA_WINDOW_SIZE = 50;
const MTG_EXACT_TEMPLATE_VERSION = "exact-template-v1";
const MTG_AUDIT_TRAIL_LIMIT = 150;

const MTG_PRODUCTS = {
  play: {
    label: "Play Booster",
    slots: [
      { label: "Common 1", sheet: [{ pool: "common", weight: 1 }] },
      { label: "Common 2", sheet: [{ pool: "common", weight: 1 }] },
      { label: "Common 3", sheet: [{ pool: "common", weight: 1 }] },
      { label: "Common 4", sheet: [{ pool: "common", weight: 1 }] },
      { label: "Common 5", sheet: [{ pool: "common", weight: 1 }] },
      { label: "Uncommon 1", sheet: [{ pool: "uncommon", weight: 1 }] },
      { label: "Uncommon 2", sheet: [{ pool: "uncommon", weight: 1 }] },
      { label: "Uncommon 3", sheet: [{ pool: "uncommon", weight: 1 }] },
      {
        label: "Rare/Mythic",
        sheet: [
          { pool: "mythic", weight: 1 },
          { pool: "rare", weight: 7 },
        ],
      },
      {
        label: "Wildcard",
        sheet: [
          { pool: "common", weight: 70 },
          { pool: "uncommon", weight: 17 },
          { pool: "rare", weight: 10 },
          { pool: "mythic", weight: 3 },
        ],
      },
      {
        label: "Land",
        sheet: [
          { pool: "basicLand", weight: 85 },
          { pool: "land", weight: 15 },
        ],
      },
      {
        label: "Foil",
        sheet: [
          { pool: "common", weight: 60, foil: true },
          { pool: "uncommon", weight: 25, foil: true },
          { pool: "rare", weight: 12, foil: true },
          { pool: "mythic", weight: 3, foil: true },
        ],
      },
      {
        label: "Special Guest / Bonus",
        optional: true,
        chance: 0.16,
        sheet: [
          { pool: "specialGuest", weight: 1 },
          { pool: "rare", weight: 4 },
          { pool: "mythic", weight: 1 },
        ],
      },
    ],
  },
  collector: {
    label: "Collector Booster",
    slots: [
      {
        label: "Foil Common/Uncommon 1",
        sheet: [
          { pool: "common", weight: 75, foil: true },
          { pool: "uncommon", weight: 25, foil: true },
        ],
      },
      {
        label: "Foil Common/Uncommon 2",
        sheet: [
          { pool: "common", weight: 75, foil: true },
          { pool: "uncommon", weight: 25, foil: true },
        ],
      },
      {
        label: "Foil Common/Uncommon 3",
        sheet: [
          { pool: "common", weight: 75, foil: true },
          { pool: "uncommon", weight: 25, foil: true },
        ],
      },
      { label: "Foil Land", sheet: [{ pool: "land", weight: 1, foil: true }] },
      { label: "Nonfoil Rare+", sheet: [{ pool: "rare", weight: 7 }, { pool: "mythic", weight: 1 }] },
      { label: "Foil Rare+", sheet: [{ pool: "rare", weight: 7, foil: true }, { pool: "mythic", weight: 1, foil: true }] },
      { label: "Showcase/Borderless Rare+", sheet: [{ pool: "showcaseRare", weight: 7 }, { pool: "showcaseMythic", weight: 1 }] },
    ],
  },
};

const MTG_SEALED_PRODUCTS = {
  "play-pack": { key: "play-pack", label: "Play Booster Pack", boosterMode: "play", packCount: 1, productType: "pack" },
  "play-bundle": { key: "play-bundle", label: "Bundle (9 Play Packs)", boosterMode: "play", packCount: 9, productType: "bundle" },
  "play-box": { key: "play-box", label: "Play Booster Box (36 Packs)", boosterMode: "play", packCount: 36, productType: "box" },
  "collector-pack": { key: "collector-pack", label: "Collector Booster Pack", boosterMode: "collector", packCount: 1, productType: "pack" },
  "collector-box": { key: "collector-box", label: "Collector Display (12 Packs)", boosterMode: "collector", packCount: 12, productType: "box" },
};

const MTG_FIDELITY_SOURCES = {
  default: [
    { label: "Wizards Collecting Articles", url: "https://magic.wizards.com/en/news/feature" },
    { label: "Scryfall API", url: "https://scryfall.com/docs/api" },
  ],
};

function buildPlayOverride(note, options = {}) {
  const commonCount = options.commonCount ?? 6;
  const uncommonCount = options.uncommonCount ?? 3;
  const rareWeight = options.rareWeight ?? 7;
  const mythicWeight = options.mythicWeight ?? 1;
  const wildcardWeights = options.wildcardWeights || { common: 66, uncommon: 19, rare: 11, mythic: 4 };
  const landWeights = options.landWeights || { basicLand: 78, land: 22 };
  const foilWeights = options.foilWeights || { common: 56, uncommon: 28, rare: 13, mythic: 3 };
  const specialGuestChance = options.specialGuestChance ?? 0.15625;
  const includeSpecialGuestSlot = options.includeSpecialGuestSlot ?? true;

  const playSlots = [];
  for (let i = 1; i <= commonCount; i += 1) {
    playSlots.push({ label: `Common ${i}`, sheet: [{ pool: "common", weight: 1 }] });
  }
  for (let i = 1; i <= uncommonCount; i += 1) {
    playSlots.push({ label: `Uncommon ${i}`, sheet: [{ pool: "uncommon", weight: 1 }] });
  }
  playSlots.push({
    label: "Rare/Mythic",
    sheet: [
      { pool: "rare", weight: rareWeight },
      { pool: "mythic", weight: mythicWeight },
    ],
  });
  playSlots.push({
    label: "Wildcard",
    sheet: [
      { pool: "common", weight: wildcardWeights.common ?? 66 },
      { pool: "uncommon", weight: wildcardWeights.uncommon ?? 19 },
      { pool: "rare", weight: wildcardWeights.rare ?? 11 },
      { pool: "mythic", weight: wildcardWeights.mythic ?? 4 },
    ],
  });
  playSlots.push({
    label: "Land",
    sheet: [
      { pool: "basicLand", weight: landWeights.basicLand ?? 78 },
      { pool: "land", weight: landWeights.land ?? 22 },
    ],
  });
  playSlots.push({
    label: "Foil",
    sheet: [
      { pool: "common", weight: foilWeights.common ?? 56, foil: true },
      { pool: "uncommon", weight: foilWeights.uncommon ?? 28, foil: true },
      { pool: "rare", weight: foilWeights.rare ?? 13, foil: true },
      { pool: "mythic", weight: foilWeights.mythic ?? 3, foil: true },
    ],
  });
  if (includeSpecialGuestSlot) {
    playSlots.push({
      label: "Special Guest / Bonus",
      optional: true,
      chance: specialGuestChance,
      sheet: [
        { pool: "specialGuest", weight: 1 },
        { pool: "rare", weight: 4 },
        { pool: "mythic", weight: 1 },
      ],
    });
  }

  return {
    fidelity: options.fidelity || "exact",
    templateVersion: MTG_EXACT_TEMPLATE_VERSION,
    notes: note,
    play: { slots: playSlots },
    collector: {
      slots: [
        { label: "Foil Common 1", sheet: [{ pool: "common", weight: 1, foil: true }] },
        { label: "Foil Common 2", sheet: [{ pool: "common", weight: 1, foil: true }] },
        { label: "Foil Common 3", sheet: [{ pool: "common", weight: 1, foil: true }] },
        { label: "Foil Common 4", sheet: [{ pool: "common", weight: 1, foil: true }] },
        { label: "Foil Common 5", sheet: [{ pool: "common", weight: 1, foil: true }] },
        { label: "Foil Uncommon 1", sheet: [{ pool: "uncommon", weight: 1, foil: true }] },
        { label: "Foil Uncommon 2", sheet: [{ pool: "uncommon", weight: 1, foil: true }] },
        { label: "Foil Uncommon 3", sheet: [{ pool: "uncommon", weight: 1, foil: true }] },
        { label: "Foil Uncommon 4", sheet: [{ pool: "uncommon", weight: 1, foil: true }] },
        { label: "Foil Land", sheet: [{ pool: "land", weight: 1, foil: true }] },
        { label: "Foil Rare/Mythic", sheet: [{ pool: "rare", weight: 7, foil: true }, { pool: "mythic", weight: 1, foil: true }] },
        { label: "Booster Fun Rare/Mythic", sheet: [{ pool: "showcaseRare", weight: 7 }, { pool: "showcaseMythic", weight: 1 }] },
        { label: "Foil Booster Fun Rare/Mythic", sheet: [{ pool: "showcaseRare", weight: 7, foil: true }, { pool: "showcaseMythic", weight: 1, foil: true }] },
      ],
    },
  };
}

function buildSetBoosterOverride(note, options = {}) {
  return buildPlayOverride(note, {
    commonCount: options.commonCount ?? 7,
    uncommonCount: options.uncommonCount ?? 3,
    wildcardWeights: options.wildcardWeights || { common: 58, uncommon: 24, rare: 14, mythic: 4 },
    landWeights: options.landWeights || { basicLand: 70, land: 30 },
    foilWeights: options.foilWeights || { common: 50, uncommon: 30, rare: 16, mythic: 4 },
    specialGuestChance: options.specialGuestChance ?? 0.0,
    includeSpecialGuestSlot: options.includeSpecialGuestSlot ?? false,
    fidelity: options.fidelity || "exact",
  });
}

const MTG_SET_COLLATION_OVERRIDES = {
  blb: {
    fidelity: "exact",
    templateVersion: MTG_EXACT_TEMPLATE_VERSION,
    notes: "Exact template baseline (Bloomburrow): strict slot/sheet simulation using official collecting breakdowns and strict pool gating.",
    play: {
      slots: [
        { label: "Common 1", sheet: [{ pool: "common", weight: 1 }] },
        { label: "Common 2", sheet: [{ pool: "common", weight: 1 }] },
        { label: "Common 3", sheet: [{ pool: "common", weight: 1 }] },
        { label: "Common 4", sheet: [{ pool: "common", weight: 1 }] },
        { label: "Common 5", sheet: [{ pool: "common", weight: 1 }] },
        { label: "Common 6 / Special Guest", sheet: [{ pool: "common", weight: 98.4375 }, { pool: "specialGuest", weight: 1.5625 }] },
        { label: "Uncommon 1", sheet: [{ pool: "uncommon", weight: 1 }] },
        { label: "Uncommon 2", sheet: [{ pool: "uncommon", weight: 1 }] },
        { label: "Uncommon 3", sheet: [{ pool: "uncommon", weight: 1 }] },
        { label: "Rare/Mythic", sheet: [{ pool: "rare", weight: 7 }, { pool: "mythic", weight: 1 }] },
        { label: "Wildcard", sheet: [{ pool: "common", weight: 66 }, { pool: "uncommon", weight: 19 }, { pool: "rare", weight: 11 }, { pool: "mythic", weight: 4 }] },
        { label: "Land", sheet: [{ pool: "basicLand", weight: 78 }, { pool: "land", weight: 22 }] },
        { label: "Foil", sheet: [{ pool: "common", weight: 56, foil: true }, { pool: "uncommon", weight: 28, foil: true }, { pool: "rare", weight: 13, foil: true }, { pool: "mythic", weight: 3, foil: true }] },
      ],
    },
    collector: {
      slots: [
        { label: "Foil Common 1", sheet: [{ pool: "common", weight: 1, foil: true }] },
        { label: "Foil Common 2", sheet: [{ pool: "common", weight: 1, foil: true }] },
        { label: "Foil Common 3", sheet: [{ pool: "common", weight: 1, foil: true }] },
        { label: "Foil Common 4", sheet: [{ pool: "common", weight: 1, foil: true }] },
        { label: "Foil Common 5", sheet: [{ pool: "common", weight: 1, foil: true }] },
        { label: "Foil Uncommon 1", sheet: [{ pool: "uncommon", weight: 1, foil: true }] },
        { label: "Foil Uncommon 2", sheet: [{ pool: "uncommon", weight: 1, foil: true }] },
        { label: "Foil Uncommon 3", sheet: [{ pool: "uncommon", weight: 1, foil: true }] },
        { label: "Foil Uncommon 4", sheet: [{ pool: "uncommon", weight: 1, foil: true }] },
        { label: "Foil Land", sheet: [{ pool: "land", weight: 1, foil: true }] },
        { label: "Foil Rare/Mythic", sheet: [{ pool: "rare", weight: 7, foil: true }, { pool: "mythic", weight: 1, foil: true }] },
        { label: "Booster Fun Rare/Mythic", sheet: [{ pool: "showcaseRare", weight: 7 }, { pool: "showcaseMythic", weight: 1 }] },
        { label: "Foil Booster Fun Rare/Mythic", sheet: [{ pool: "showcaseRare", weight: 7, foil: true }, { pool: "showcaseMythic", weight: 1, foil: true }] },
      ],
    },
  },
  dsk: {
    fidelity: "exact",
    notes: "Official Collecting Duskmourn: House of Horror breakdown (Play/Collector composition).",
    play: {
      slots: [
        { label: "Common 1", sheet: [{ pool: "common", weight: 1 }] },
        { label: "Common 2", sheet: [{ pool: "common", weight: 1 }] },
        { label: "Common 3", sheet: [{ pool: "common", weight: 1 }] },
        { label: "Common 4", sheet: [{ pool: "common", weight: 1 }] },
        { label: "Common 5", sheet: [{ pool: "common", weight: 1 }] },
        { label: "Common 6 / Special Guest", sheet: [{ pool: "common", weight: 98.4375 }, { pool: "specialGuest", weight: 1.5625 }] },
        { label: "Uncommon 1", sheet: [{ pool: "uncommon", weight: 1 }] },
        { label: "Uncommon 2", sheet: [{ pool: "uncommon", weight: 1 }] },
        { label: "Uncommon 3", sheet: [{ pool: "uncommon", weight: 1 }] },
        { label: "Rare/Mythic", sheet: [{ pool: "rare", weight: 7 }, { pool: "mythic", weight: 1 }] },
        { label: "Wildcard", sheet: [{ pool: "common", weight: 64 }, { pool: "uncommon", weight: 20 }, { pool: "rare", weight: 12 }, { pool: "mythic", weight: 4 }] },
        { label: "Land", sheet: [{ pool: "basicLand", weight: 74 }, { pool: "land", weight: 26 }] },
        { label: "Foil", sheet: [{ pool: "common", weight: 55, foil: true }, { pool: "uncommon", weight: 29, foil: true }, { pool: "rare", weight: 13, foil: true }, { pool: "mythic", weight: 3, foil: true }] },
      ],
    },
    collector: {
      slots: [
        { label: "Foil Common 1", sheet: [{ pool: "common", weight: 1, foil: true }] },
        { label: "Foil Common 2", sheet: [{ pool: "common", weight: 1, foil: true }] },
        { label: "Foil Common 3", sheet: [{ pool: "common", weight: 1, foil: true }] },
        { label: "Foil Common 4", sheet: [{ pool: "common", weight: 1, foil: true }] },
        { label: "Foil Common 5", sheet: [{ pool: "common", weight: 1, foil: true }] },
        { label: "Foil Uncommon 1", sheet: [{ pool: "uncommon", weight: 1, foil: true }] },
        { label: "Foil Uncommon 2", sheet: [{ pool: "uncommon", weight: 1, foil: true }] },
        { label: "Foil Uncommon 3", sheet: [{ pool: "uncommon", weight: 1, foil: true }] },
        { label: "Foil Uncommon 4", sheet: [{ pool: "uncommon", weight: 1, foil: true }] },
        { label: "Foil Land", sheet: [{ pool: "land", weight: 1, foil: true }] },
        { label: "Foil Rare/Mythic", sheet: [{ pool: "rare", weight: 7, foil: true }, { pool: "mythic", weight: 1, foil: true }] },
        { label: "Booster Fun Rare/Mythic", sheet: [{ pool: "showcaseRare", weight: 7 }, { pool: "showcaseMythic", weight: 1 }] },
        { label: "Foil Booster Fun Rare/Mythic", sheet: [{ pool: "showcaseRare", weight: 7, foil: true }, { pool: "showcaseMythic", weight: 1, foil: true }] },
      ],
    },
  },
  fdn: {
    fidelity: "exact",
    notes: "Official Collecting Foundations breakdown (Play/Collector composition).",
    play: {
      slots: [
        { label: "Common 1", sheet: [{ pool: "common", weight: 1 }] },
        { label: "Common 2", sheet: [{ pool: "common", weight: 1 }] },
        { label: "Common 3", sheet: [{ pool: "common", weight: 1 }] },
        { label: "Common 4", sheet: [{ pool: "common", weight: 1 }] },
        { label: "Common 5", sheet: [{ pool: "common", weight: 1 }] },
        { label: "Common 6 / Special Guest", sheet: [{ pool: "common", weight: 98.4375 }, { pool: "specialGuest", weight: 1.5625 }] },
        { label: "Uncommon 1", sheet: [{ pool: "uncommon", weight: 1 }] },
        { label: "Uncommon 2", sheet: [{ pool: "uncommon", weight: 1 }] },
        { label: "Uncommon 3", sheet: [{ pool: "uncommon", weight: 1 }] },
        { label: "Rare/Mythic", sheet: [{ pool: "rare", weight: 78 }, { pool: "mythic", weight: 12.8 }, { pool: "showcaseRare", weight: 7.7 }, { pool: "showcaseMythic", weight: 1.5 }] },
        { label: "Wildcard", sheet: [{ pool: "common", weight: 68 }, { pool: "uncommon", weight: 18 }, { pool: "rare", weight: 11 }, { pool: "mythic", weight: 3 }] },
        { label: "Land", sheet: [{ pool: "basicLand", weight: 82 }, { pool: "land", weight: 18 }] },
        { label: "Foil", sheet: [{ pool: "common", weight: 58, foil: true }, { pool: "uncommon", weight: 27, foil: true }, { pool: "rare", weight: 12, foil: true }, { pool: "mythic", weight: 3, foil: true }] },
      ],
    },
    collector: {
      slots: [
        { label: "Foil Common 1", sheet: [{ pool: "common", weight: 1, foil: true }] },
        { label: "Foil Common 2", sheet: [{ pool: "common", weight: 1, foil: true }] },
        { label: "Foil Common 3", sheet: [{ pool: "common", weight: 1, foil: true }] },
        { label: "Foil Common 4", sheet: [{ pool: "common", weight: 1, foil: true }] },
        { label: "Foil Common 5", sheet: [{ pool: "common", weight: 1, foil: true }] },
        { label: "Foil Uncommon 1", sheet: [{ pool: "uncommon", weight: 1, foil: true }] },
        { label: "Foil Uncommon 2", sheet: [{ pool: "uncommon", weight: 1, foil: true }] },
        { label: "Foil Uncommon 3", sheet: [{ pool: "uncommon", weight: 1, foil: true }] },
        { label: "Foil Uncommon 4", sheet: [{ pool: "uncommon", weight: 1, foil: true }] },
        { label: "Foil Land", sheet: [{ pool: "land", weight: 1, foil: true }] },
        { label: "Foil Rare/Mythic", sheet: [{ pool: "rare", weight: 7, foil: true }, { pool: "mythic", weight: 1, foil: true }] },
        { label: "Booster Fun Rare/Mythic", sheet: [{ pool: "showcaseRare", weight: 7 }, { pool: "showcaseMythic", weight: 1 }] },
        { label: "Foil Booster Fun Rare/Mythic", sheet: [{ pool: "showcaseRare", weight: 7, foil: true }, { pool: "showcaseMythic", weight: 1, foil: true }] },
      ],
    },
  },
  mkm: buildPlayOverride("Official Collecting Murders at Karlov Manor breakdown (Play/Collector composition).", {
    commonCount: 6,
    wildcardWeights: { common: 64, uncommon: 21, rare: 11, mythic: 4 },
    landWeights: { basicLand: 76, land: 24 },
    foilWeights: { common: 55, uncommon: 29, rare: 13, mythic: 3 },
    includeSpecialGuestSlot: false,
  }),
  otj: buildPlayOverride("Official Collecting Outlaws of Thunder Junction breakdown (Play/Collector composition).", {
    commonCount: 6,
    wildcardWeights: { common: 63, uncommon: 21, rare: 12, mythic: 4 },
    landWeights: { basicLand: 74, land: 26 },
    foilWeights: { common: 54, uncommon: 30, rare: 13, mythic: 3 },
    includeSpecialGuestSlot: true,
    specialGuestChance: 0.15625,
  }),
  lci: buildPlayOverride("Official Collecting The Lost Caverns of Ixalan breakdown (Play/Collector composition).", {
    commonCount: 6,
    wildcardWeights: { common: 64, uncommon: 20, rare: 12, mythic: 4 },
    landWeights: { basicLand: 77, land: 23 },
    foilWeights: { common: 55, uncommon: 29, rare: 13, mythic: 3 },
    includeSpecialGuestSlot: false,
  }),
  woe: buildSetBoosterOverride("Official Collecting Wilds of Eldraine breakdown (Set/Collector composition).", {
    commonCount: 7,
    wildcardWeights: { common: 56, uncommon: 25, rare: 14, mythic: 5 },
    landWeights: { basicLand: 69, land: 31 },
  }),
  mat: buildSetBoosterOverride("Official Collecting March of the Machine: The Aftermath breakdown (Set/Collector composition).", {
    commonCount: 5,
    uncommonCount: 3,
    wildcardWeights: { common: 44, uncommon: 34, rare: 17, mythic: 5 },
    landWeights: { basicLand: 62, land: 38 },
  }),
  mom: buildSetBoosterOverride("Official Collecting March of the Machine breakdown (Set/Collector composition).", {
    commonCount: 7,
    wildcardWeights: { common: 55, uncommon: 25, rare: 15, mythic: 5 },
    landWeights: { basicLand: 68, land: 32 },
  }),
  one: buildSetBoosterOverride("Official Collecting Phyrexia: All Will Be One breakdown (Set/Collector composition).", {
    commonCount: 7,
    wildcardWeights: { common: 57, uncommon: 24, rare: 14, mythic: 5 },
    landWeights: { basicLand: 68, land: 32 },
  }),
  bro: buildSetBoosterOverride("Official Collecting The Brothers' War breakdown (Set/Collector composition).", {
    commonCount: 7,
    wildcardWeights: { common: 56, uncommon: 25, rare: 14, mythic: 5 },
    landWeights: { basicLand: 67, land: 33 },
  }),
  dmu: buildSetBoosterOverride("Official Collecting Dominaria United breakdown (Set/Collector composition).", {
    commonCount: 7,
    wildcardWeights: { common: 58, uncommon: 23, rare: 14, mythic: 5 },
    landWeights: { basicLand: 70, land: 30 },
  }),
  snc: buildSetBoosterOverride("Official Collecting Streets of New Capenna breakdown (Set/Collector composition).", {
    commonCount: 7,
    wildcardWeights: { common: 58, uncommon: 23, rare: 14, mythic: 5 },
    landWeights: { basicLand: 70, land: 30 },
  }),
  neo: buildSetBoosterOverride("Official Collecting Kamigawa: Neon Dynasty breakdown (Set/Collector composition).", {
    commonCount: 7,
    wildcardWeights: { common: 57, uncommon: 24, rare: 14, mythic: 5 },
    landWeights: { basicLand: 69, land: 31 },
  }),
  vow: buildSetBoosterOverride("Official Collecting Innistrad: Crimson Vow breakdown (Set/Collector composition).", {
    commonCount: 7,
    wildcardWeights: { common: 58, uncommon: 23, rare: 14, mythic: 5 },
    landWeights: { basicLand: 70, land: 30 },
  }),
  dft: buildPlayOverride("Official Collecting Aetherdrift breakdown (Play/Collector composition).", {
    commonCount: 6,
    wildcardWeights: { common: 64, uncommon: 20, rare: 12, mythic: 4 },
    landWeights: { basicLand: 75, land: 25 },
    includeSpecialGuestSlot: false,
  }),
  tdm: buildPlayOverride("Official Collecting Tarkir: Dragonstorm breakdown (Play/Collector composition).", {
    commonCount: 6,
    wildcardWeights: { common: 63, uncommon: 21, rare: 12, mythic: 4 },
    landWeights: { basicLand: 75, land: 25 },
    includeSpecialGuestSlot: false,
  }),
  fin: buildPlayOverride("Official Collecting Final Fantasy breakdown (Play/Collector composition).", {
    commonCount: 6,
    wildcardWeights: { common: 62, uncommon: 22, rare: 12, mythic: 4 },
    landWeights: { basicLand: 73, land: 27 },
    includeSpecialGuestSlot: false,
    fidelity: "exact",
  }),
  eoe: buildPlayOverride("Official Collecting Edge of Eternities breakdown (Play/Collector composition).", {
    commonCount: 6,
    wildcardWeights: { common: 63, uncommon: 21, rare: 12, mythic: 4 },
    landWeights: { basicLand: 74, land: 26 },
    includeSpecialGuestSlot: false,
  }),
  spm: buildPlayOverride("Official Collecting Marvel's Spider-Man breakdown (Play/Collector composition).", {
    commonCount: 6,
    wildcardWeights: { common: 61, uncommon: 23, rare: 12, mythic: 4 },
    landWeights: { basicLand: 73, land: 27 },
    includeSpecialGuestSlot: false,
    fidelity: "exact",
  }),
  tla: buildPlayOverride("Official Collecting Avatar: The Last Airbender breakdown (Play/Collector composition).", {
    commonCount: 6,
    wildcardWeights: { common: 61, uncommon: 23, rare: 12, mythic: 4 },
    landWeights: { basicLand: 73, land: 27 },
    includeSpecialGuestSlot: false,
    fidelity: "exact",
  }),
  ecl: buildPlayOverride("Official Collecting Lorwyn Eclipsed breakdown (Play/Collector composition).", {
    commonCount: 6,
    wildcardWeights: { common: 62, uncommon: 22, rare: 12, mythic: 4 },
    landWeights: { basicLand: 74, land: 26 },
    includeSpecialGuestSlot: false,
  }),
  tmt: buildPlayOverride("Official Collecting Teenage Mutant Ninja Turtles breakdown (Play/Collector composition).", {
    commonCount: 6,
    wildcardWeights: { common: 60, uncommon: 24, rare: 12, mythic: 4 },
    landWeights: { basicLand: 72, land: 28 },
    includeSpecialGuestSlot: false,
  }),
};

const MTG_PACK_PRICE_PRESETS = {
  "teenage-mutant-ninja-turtles": { play: 7.49, collector: 32.99 },
  "lorwyn-eclipsed": { play: 7.19, collector: 29.99 },
  "avatar-last-airbender": { play: 7.39, collector: 34.99 },
  "marvel-spider-man": { play: 7.89, collector: 36.99 },
  "edge-of-eternities": { play: 6.89, collector: 31.99 },
  "final-fantasy": { play: 8.19, collector: 39.99 },
  "tarkir-dragonstorm": { play: 6.59, collector: 29.99 },
  "aetherdrift": { play: 6.29, collector: 28.99 },
  bloomburrow: { play: 5.79, collector: 26.99 },
  duskmourn: { play: 6.29, collector: 31.99 },
  foundations: { play: 6.09, collector: 29.99 },
  "outlaws-of-thunder-junction": { play: 5.99, collector: 28.99 },
  "murders-at-karlov-manor": { play: 5.79, collector: 27.99 },
  "the-lost-caverns-of-ixalan": { play: 5.69, collector: 25.99 },
  "wilds-of-eldraine": { play: 5.49, collector: 24.99 },
  "march-of-the-machine-aftermath": { play: 4.89, collector: 19.99 },
  "march-of-the-machine": { play: 5.39, collector: 24.99 },
  "phyrexia-all-will-be-one": { play: 5.29, collector: 24.99 },
  "the-brothers-war": { play: 5.19, collector: 23.99 },
  "dominaria-united": { play: 5.09, collector: 22.99 },
  "streets-of-new-capenna": { play: 4.99, collector: 21.99 },
  "kamigawa-neon-dynasty": { play: 5.29, collector: 24.99 },
  "innistrad-crimson-vow": { play: 4.79, collector: 19.99 },
};

const MTG_SETS = [
  {
    key: "teenage-mutant-ninja-turtles",
    scryfallCode: "tmt",
    displayName: "Teenage Mutant Ninja Turtles",
    releaseLabel: "Recent Release",
    releaseDate: "2026-03-06",
    fallbackPackPrice: 7.49,
    packImage: "https://svgs.scryfall.io/sets/tmt.svg",
    priceSources: {
      scryfall: { label: "Scryfall + public market blend", url: "https://scryfall.com/sets/tmt" },
      tcgplayerSealed: { label: "TCGplayer sealed search", url: "https://www.tcgplayer.com/search/magic/product?productLineName=magic&q=Teenage+Mutant+Ninja+Turtles+play+booster" },
    },
  },
  {
    key: "lorwyn-eclipsed",
    scryfallCode: "ecl",
    displayName: "Lorwyn Eclipsed",
    releaseLabel: "Recent Release",
    releaseDate: "2026-01-23",
    fallbackPackPrice: 7.19,
    packImage: "https://svgs.scryfall.io/sets/ecl.svg",
    priceSources: {
      scryfall: { label: "Scryfall + public market blend", url: "https://scryfall.com/sets/ecl" },
      tcgplayerSealed: { label: "TCGplayer sealed search", url: "https://www.tcgplayer.com/search/magic/product?productLineName=magic&q=Lorwyn+Eclipsed+play+booster" },
    },
  },
  {
    key: "avatar-last-airbender",
    scryfallCode: "tla",
    displayName: "Avatar: The Last Airbender",
    releaseLabel: "Recent Release",
    releaseDate: "2025-11-21",
    fallbackPackPrice: 7.39,
    packImage: "https://svgs.scryfall.io/sets/tla.svg",
    priceSources: {
      scryfall: { label: "Scryfall + public market blend", url: "https://scryfall.com/sets/tla" },
      tcgplayerSealed: { label: "TCGplayer sealed search", url: "https://www.tcgplayer.com/search/magic/product?productLineName=magic&q=Avatar+The+Last+Airbender+play+booster" },
    },
  },
  {
    key: "marvel-spider-man",
    scryfallCode: "spm",
    displayName: "Marvel's Spider-Man",
    releaseLabel: "Recent Release",
    releaseDate: "2025-09-26",
    fallbackPackPrice: 7.89,
    packImage: "https://svgs.scryfall.io/sets/spm.svg",
    priceSources: {
      scryfall: { label: "Scryfall + public market blend", url: "https://scryfall.com/sets/spm" },
      tcgplayerSealed: { label: "TCGplayer sealed search", url: "https://www.tcgplayer.com/search/magic/product?productLineName=magic&q=Marvel+Spider-Man+play+booster" },
    },
  },
  {
    key: "edge-of-eternities",
    scryfallCode: "eoe",
    displayName: "Edge of Eternities",
    releaseLabel: "Recent Release",
    releaseDate: "2025-08-01",
    fallbackPackPrice: 6.89,
    packImage: "https://svgs.scryfall.io/sets/eoe.svg",
    priceSources: {
      scryfall: { label: "Scryfall + public market blend", url: "https://scryfall.com/sets/eoe" },
      tcgplayerSealed: { label: "TCGplayer sealed search", url: "https://www.tcgplayer.com/search/magic/product?productLineName=magic&q=Edge+of+Eternities+play+booster" },
    },
  },
  {
    key: "final-fantasy",
    scryfallCode: "fin",
    displayName: "Final Fantasy",
    releaseLabel: "Recent Release",
    releaseDate: "2025-06-13",
    fallbackPackPrice: 8.19,
    packImage: "https://svgs.scryfall.io/sets/fin.svg",
    priceSources: {
      scryfall: { label: "Scryfall + public market blend", url: "https://scryfall.com/sets/fin" },
      tcgplayerSealed: { label: "TCGplayer sealed search", url: "https://www.tcgplayer.com/search/magic/product?productLineName=magic&q=Final+Fantasy+play+booster" },
    },
  },
  {
    key: "tarkir-dragonstorm",
    scryfallCode: "tdm",
    displayName: "Tarkir: Dragonstorm",
    releaseLabel: "Recent Release",
    releaseDate: "2025-04-11",
    fallbackPackPrice: 6.59,
    packImage: "https://svgs.scryfall.io/sets/tdm.svg",
    priceSources: {
      scryfall: { label: "Scryfall + public market blend", url: "https://scryfall.com/sets/tdm" },
      tcgplayerSealed: { label: "TCGplayer sealed search", url: "https://www.tcgplayer.com/search/magic/product?productLineName=magic&q=Tarkir+Dragonstorm+play+booster" },
    },
  },
  {
    key: "aetherdrift",
    scryfallCode: "dft",
    displayName: "Aetherdrift",
    releaseLabel: "Recent Release",
    releaseDate: "2025-02-14",
    fallbackPackPrice: 6.29,
    packImage: "https://svgs.scryfall.io/sets/dft.svg",
    priceSources: {
      scryfall: { label: "Scryfall + public market blend", url: "https://scryfall.com/sets/dft" },
      tcgplayerSealed: { label: "TCGplayer sealed search", url: "https://www.tcgplayer.com/search/magic/product?productLineName=magic&q=Aetherdrift+play+booster" },
    },
  },
  {
    key: "bloomburrow",
    scryfallCode: "blb",
    displayName: "Bloomburrow",
    releaseLabel: "Play Booster Era",
    releaseDate: "2024-08-02",
    fallbackPackPrice: 5.79,
    packImage: "https://svgs.scryfall.io/sets/blb.svg",
    priceSources: {
      scryfall: { label: "Scryfall + public market blend", url: "https://scryfall.com/sets/blb" },
      tcgplayerSealed: { label: "TCGplayer sealed search", url: "https://www.tcgplayer.com/search/magic/product?productLineName=magic&q=Bloomburrow+play+booster" },
    },
  },
  {
    key: "duskmourn",
    scryfallCode: "dsk",
    displayName: "Duskmourn: House of Horror",
    releaseLabel: "Play Booster Era",
    releaseDate: "2024-09-27",
    fallbackPackPrice: 6.29,
    packImage: "https://svgs.scryfall.io/sets/dsk.svg",
    priceSources: {
      scryfall: { label: "Scryfall + public market blend", url: "https://scryfall.com/sets/dsk" },
      tcgplayerSealed: { label: "TCGplayer sealed search", url: "https://www.tcgplayer.com/search/magic/product?productLineName=magic&q=Duskmourn+play+booster" },
    },
  },
  {
    key: "foundations",
    scryfallCode: "fdn",
    displayName: "Foundations",
    releaseLabel: "Play Booster Era",
    releaseDate: "2024-11-15",
    fallbackPackPrice: 6.09,
    packImage: "https://svgs.scryfall.io/sets/fdn.svg",
    priceSources: {
      scryfall: { label: "Scryfall + public market blend", url: "https://scryfall.com/sets/fdn" },
      tcgplayerSealed: { label: "TCGplayer sealed search", url: "https://www.tcgplayer.com/search/magic/product?productLineName=magic&q=Foundations+play+booster" },
    },
  },
  {
    key: "outlaws-of-thunder-junction",
    scryfallCode: "otj",
    displayName: "Outlaws of Thunder Junction",
    releaseLabel: "Recent Release",
    releaseDate: "2024-04-19",
    fallbackPackPrice: 5.99,
    packImage: "https://svgs.scryfall.io/sets/otj.svg",
    priceSources: {
      scryfall: { label: "Scryfall + public market blend", url: "https://scryfall.com/sets/otj" },
      tcgplayerSealed: { label: "TCGplayer sealed search", url: "https://www.tcgplayer.com/search/magic/product?productLineName=magic&q=Outlaws+of+Thunder+Junction+play+booster" },
    },
  },
  {
    key: "murders-at-karlov-manor",
    scryfallCode: "mkm",
    displayName: "Murders at Karlov Manor",
    releaseLabel: "Recent Release",
    releaseDate: "2024-02-09",
    fallbackPackPrice: 5.79,
    packImage: "https://svgs.scryfall.io/sets/mkm.svg",
    priceSources: {
      scryfall: { label: "Scryfall + public market blend", url: "https://scryfall.com/sets/mkm" },
      tcgplayerSealed: { label: "TCGplayer sealed search", url: "https://www.tcgplayer.com/search/magic/product?productLineName=magic&q=Murders+at+Karlov+Manor+play+booster" },
    },
  },
  {
    key: "the-lost-caverns-of-ixalan",
    scryfallCode: "lci",
    displayName: "The Lost Caverns of Ixalan",
    releaseLabel: "Recent Release",
    releaseDate: "2023-11-17",
    fallbackPackPrice: 5.69,
    packImage: "https://svgs.scryfall.io/sets/lci.svg",
    priceSources: {
      scryfall: { label: "Scryfall + public market blend", url: "https://scryfall.com/sets/lci" },
      tcgplayerSealed: { label: "TCGplayer sealed search", url: "https://www.tcgplayer.com/search/magic/product?productLineName=magic&q=The+Lost+Caverns+of+Ixalan+play+booster" },
    },
  },
  {
    key: "wilds-of-eldraine",
    scryfallCode: "woe",
    displayName: "Wilds of Eldraine",
    releaseLabel: "Recent Release",
    releaseDate: "2023-09-08",
    fallbackPackPrice: 5.49,
    packImage: "https://svgs.scryfall.io/sets/woe.svg",
    priceSources: {
      scryfall: { label: "Scryfall + public market blend", url: "https://scryfall.com/sets/woe" },
      tcgplayerSealed: { label: "TCGplayer sealed search", url: "https://www.tcgplayer.com/search/magic/product?productLineName=magic&q=Wilds+of+Eldraine+set+booster" },
    },
  },
  {
    key: "march-of-the-machine-aftermath",
    scryfallCode: "mat",
    displayName: "March of the Machine: The Aftermath",
    releaseLabel: "Recent Release",
    releaseDate: "2023-05-12",
    fallbackPackPrice: 4.89,
    packImage: "https://svgs.scryfall.io/sets/mat.svg",
    priceSources: {
      scryfall: { label: "Scryfall + public market blend", url: "https://scryfall.com/sets/mat" },
      tcgplayerSealed: { label: "TCGplayer sealed search", url: "https://www.tcgplayer.com/search/magic/product?productLineName=magic&q=March+of+the+Machine+Aftermath+booster" },
    },
  },
  {
    key: "march-of-the-machine",
    scryfallCode: "mom",
    displayName: "March of the Machine",
    releaseLabel: "Recent Release",
    releaseDate: "2023-04-21",
    fallbackPackPrice: 5.39,
    packImage: "https://svgs.scryfall.io/sets/mom.svg",
    priceSources: {
      scryfall: { label: "Scryfall + public market blend", url: "https://scryfall.com/sets/mom" },
      tcgplayerSealed: { label: "TCGplayer sealed search", url: "https://www.tcgplayer.com/search/magic/product?productLineName=magic&q=March+of+the+Machine+set+booster" },
    },
  },
  {
    key: "phyrexia-all-will-be-one",
    scryfallCode: "one",
    displayName: "Phyrexia: All Will Be One",
    releaseLabel: "Recent Release",
    releaseDate: "2023-02-10",
    fallbackPackPrice: 5.29,
    packImage: "https://svgs.scryfall.io/sets/one.svg",
    priceSources: {
      scryfall: { label: "Scryfall + public market blend", url: "https://scryfall.com/sets/one" },
      tcgplayerSealed: { label: "TCGplayer sealed search", url: "https://www.tcgplayer.com/search/magic/product?productLineName=magic&q=Phyrexia+All+Will+Be+One+set+booster" },
    },
  },
  {
    key: "the-brothers-war",
    scryfallCode: "bro",
    displayName: "The Brothers' War",
    releaseLabel: "Recent Release",
    releaseDate: "2022-11-18",
    fallbackPackPrice: 5.19,
    packImage: "https://svgs.scryfall.io/sets/bro.svg",
    priceSources: {
      scryfall: { label: "Scryfall + public market blend", url: "https://scryfall.com/sets/bro" },
      tcgplayerSealed: { label: "TCGplayer sealed search", url: "https://www.tcgplayer.com/search/magic/product?productLineName=magic&q=Brothers+War+set+booster" },
    },
  },
  {
    key: "dominaria-united",
    scryfallCode: "dmu",
    displayName: "Dominaria United",
    releaseLabel: "Recent Release",
    releaseDate: "2022-09-09",
    fallbackPackPrice: 5.09,
    packImage: "https://svgs.scryfall.io/sets/dmu.svg",
    priceSources: {
      scryfall: { label: "Scryfall + public market blend", url: "https://scryfall.com/sets/dmu" },
      tcgplayerSealed: { label: "TCGplayer sealed search", url: "https://www.tcgplayer.com/search/magic/product?productLineName=magic&q=Dominaria+United+set+booster" },
    },
  },
  {
    key: "streets-of-new-capenna",
    scryfallCode: "snc",
    displayName: "Streets of New Capenna",
    releaseLabel: "Recent Release",
    releaseDate: "2022-04-29",
    fallbackPackPrice: 4.99,
    packImage: "https://svgs.scryfall.io/sets/snc.svg",
    priceSources: {
      scryfall: { label: "Scryfall + public market blend", url: "https://scryfall.com/sets/snc" },
      tcgplayerSealed: { label: "TCGplayer sealed search", url: "https://www.tcgplayer.com/search/magic/product?productLineName=magic&q=Streets+of+New+Capenna+set+booster" },
    },
  },
  {
    key: "kamigawa-neon-dynasty",
    scryfallCode: "neo",
    displayName: "Kamigawa: Neon Dynasty",
    releaseLabel: "Recent Release",
    releaseDate: "2022-02-18",
    fallbackPackPrice: 5.29,
    packImage: "https://svgs.scryfall.io/sets/neo.svg",
    priceSources: {
      scryfall: { label: "Scryfall + public market blend", url: "https://scryfall.com/sets/neo" },
      tcgplayerSealed: { label: "TCGplayer sealed search", url: "https://www.tcgplayer.com/search/magic/product?productLineName=magic&q=Kamigawa+Neon+Dynasty+set+booster" },
    },
  },
  {
    key: "innistrad-crimson-vow",
    scryfallCode: "vow",
    displayName: "Innistrad: Crimson Vow",
    releaseLabel: "Recent Release",
    releaseDate: "2021-11-19",
    fallbackPackPrice: 4.79,
    packImage: "https://svgs.scryfall.io/sets/vow.svg",
    priceSources: {
      scryfall: { label: "Scryfall + public market blend", url: "https://scryfall.com/sets/vow" },
      tcgplayerSealed: { label: "TCGplayer sealed search", url: "https://www.tcgplayer.com/search/magic/product?productLineName=magic&q=Innistrad+Crimson+Vow+set+booster" },
    },
  },
];

const state = {
  selectedSetKey: MTG_SETS[0].key,
  revealMode: "all",
  displayOrder: "standard",
  setSortMode: "release",
  sealedProductKey: loadProductMode(),
  productMode: "play",
  priceSourceMode: loadPriceSourceMode(),
  marketValueMode: loadMtgMarketValueMode(),
  openingUxMode: loadMtgOpeningUxMode(),
  compactBinder: loadMtgCompactBinderMode(),
  ultraCompactBinder: loadMtgUltraCompactBinderMode(),
  setData: {},
  marketSnapshot: {
    loaded: false,
    source: null,
    packPrices: {},
    cardOverrides: {},
    updatedAt: new Date().toISOString().slice(0, 10),
  },
  loadingSetKeys: new Set(),
  backgroundPreloadStarted: false,
  backgroundSync: {
    running: false,
    done: 0,
    total: MTG_SETS.length,
  },
  currentPack: null,
  revealedIds: new Set(),
  session: {
    packsOpened: 0,
    totalValue: 0,
    totalSpent: 0,
    biggestHit: null,
    profitablePacks: 0,
    packValueHistory: [],
    setEconomy: {},
    pity: {
      mythicPlus: 0,
      valueHit: 0,
    },
    chaseStats: {},
    qaHistory: {},
    auditTrail: [],
  },
  chaseTargetsBySet: loadChaseTargets(),
  chaseFilterMode: loadChaseFilterMode(),
  binder: loadBinder(),
  qaTest: {
    running: false,
    resultBySetProduct: {},
  },
  qaLockfile: null,
  rng: initializeRngState(),
  lab: {
    running: false,
    lastResultBySetProduct: {},
  },
};

const dom = {
  loadStatus: document.getElementById("mtgLoadStatus"),
  setSelect: document.getElementById("mtgSetSelect"),
  productSelect: document.getElementById("mtgProductSelect"),
  setSort: document.getElementById("mtgSetSort"),
  revealMode: document.getElementById("mtgRevealMode"),
  displayOrder: document.getElementById("mtgDisplayOrder"),
  priceSourceMode: document.getElementById("mtgPriceSourceMode"),
  marketValueMode: document.getElementById("mtgMarketValueMode"),
  openingUxMode: document.getElementById("mtgOpeningUxMode"),
  compactBinderToggle: document.getElementById("mtgCompactBinderToggle"),
  ultraCompactBinderToggle: document.getElementById("mtgUltraCompactBinderToggle"),
  openPackBtn: document.getElementById("mtgOpenPackBtn"),
  resetSessionBtn: document.getElementById("mtgResetSessionBtn"),
  resetBinderBtn: document.getElementById("mtgResetBinderBtn"),
  chasePanel: document.getElementById("mtgChasePanel"),
  packArt: document.getElementById("mtgPackArt"),
  playPanel: document.querySelector(".play-panel"),
  packImage: document.getElementById("mtgPackImage"),
  packLogo: document.getElementById("mtgPackLogo"),
  selectedPackName: document.getElementById("mtgSelectedPackName"),
  selectedPackSub: document.getElementById("mtgSelectedPackSub"),
  packStats: document.getElementById("mtgPackStats"),
  collationMeta: document.getElementById("mtgCollationMeta"),
  packPriceSource: document.getElementById("mtgPackPriceSource"),
  openedPackSummary: document.getElementById("mtgOpenedPackSummary"),
  cardsGrid: document.getElementById("mtgCardsGrid"),
  binderGrid: document.getElementById("mtgBinderGrid"),
  sessionStats: document.getElementById("mtgSessionStats"),
  economyPanel: document.getElementById("mtgEconomyPanel"),
  oddsQaPanel: document.getElementById("mtgOddsQaPanel"),
  rngPanel: document.getElementById("mtgRngPanel"),
  labPanel: document.getElementById("mtgLabPanel"),
  fidelityRegistryPanel: document.getElementById("mtgFidelityRegistryPanel"),
  profileDataPanel: document.getElementById("mtgProfileDataPanel"),
  cardTemplate: document.getElementById("mtgCardTemplate"),
};

init().catch((error) => {
  console.error(error);
  setStatus("Failed to initialize MTG data.", "error");
});

async function init() {
  syncProductModeFromSealedSelection();
  await loadMtgQaLockfile();
  await loadMtgMarketSnapshot();
  wireControls();
  renderSetSelect();
  renderHeader();
  renderSessionStats();
  renderEconomyPanel();
  renderOddsQaPanel();
  renderRngPanel();
  renderLabPanel();
  renderFidelityRegistryPanel();
  renderMtgProfileDataPanel();
  renderChasePanel();
  renderBinder();
  renderCards();
  await loadSetData(state.selectedSetKey);
  startBackgroundPreload();
}

function wireControls() {
  dom.setSort?.addEventListener("change", () => {
    state.setSortMode = dom.setSort.value;
    renderSetSelect();
    renderFidelityRegistryPanel();
  });

  dom.setSelect?.addEventListener("change", () => {
    const next = MTG_SETS.find((set) => set.key === dom.setSelect.value);
    if (!next) return;
    state.selectedSetKey = next.key;
    state.currentPack = null;
    state.revealedIds = new Set();
    sanitizeCurrentSetChaseTargets();
    renderSetSelect();
    renderHeader();
    renderOddsQaPanel();
    renderLabPanel();
    renderFidelityRegistryPanel();
    renderChasePanel();
    renderCards();
    loadSetData(next.key);
  });

  dom.productSelect?.addEventListener("change", () => {
    if (!MTG_SEALED_PRODUCTS[dom.productSelect.value]) return;
    state.sealedProductKey = dom.productSelect.value;
    syncProductModeFromSealedSelection();
    saveProductMode(state.sealedProductKey);
    state.currentPack = null;
    state.revealedIds = new Set();
    sanitizeCurrentSetChaseTargets();
    renderHeader();
    renderSetSelect();
    renderSessionStats();
    renderEconomyPanel();
    renderOddsQaPanel();
    renderRngPanel();
    renderLabPanel();
    renderFidelityRegistryPanel();
    renderChasePanel();
    renderCards();
  });

  dom.revealMode?.addEventListener("change", () => {
    state.revealMode = dom.revealMode.value;
    if (state.revealMode === "all" && state.currentPack) {
      state.revealedIds = new Set(state.currentPack.map((card) => card.instanceId));
    }
    renderCards();
  });

  dom.displayOrder?.addEventListener("change", () => {
    state.displayOrder = dom.displayOrder.value;
    renderCards();
  });

  dom.priceSourceMode?.addEventListener("change", () => {
    state.priceSourceMode = dom.priceSourceMode.value;
    savePriceSourceMode(state.priceSourceMode);
    renderHeader();
    renderSetSelect();
    renderSessionStats();
    renderEconomyPanel();
    renderLabPanel();
    renderFidelityRegistryPanel();
    renderMtgProfileDataPanel();
    renderChasePanel();
  });

  dom.marketValueMode?.addEventListener("change", () => {
    state.marketValueMode = dom.marketValueMode.value;
    saveMtgMarketValueMode(state.marketValueMode);
    if (state.currentPack?.length) {
      state.currentPack = state.currentPack.map((card) => {
        const valuation = resolveMtgCardValue(card);
        return { ...card, value: valuation.value, valuationBasis: valuation.basis };
      });
    }
    renderCards();
    renderSessionStats();
    renderEconomyPanel();
  });

  dom.openingUxMode?.addEventListener("change", () => {
    state.openingUxMode = dom.openingUxMode.value;
    saveMtgOpeningUxMode(state.openingUxMode);
  });

  dom.compactBinderToggle?.addEventListener("change", () => {
    state.compactBinder = Boolean(dom.compactBinderToggle.checked);
    if (!state.compactBinder && state.ultraCompactBinder) {
      state.ultraCompactBinder = false;
      if (dom.ultraCompactBinderToggle) dom.ultraCompactBinderToggle.checked = false;
      saveMtgUltraCompactBinderMode(state.ultraCompactBinder);
    }
    saveMtgCompactBinderMode(state.compactBinder);
    renderBinder();
  });

  dom.ultraCompactBinderToggle?.addEventListener("change", () => {
    state.ultraCompactBinder = Boolean(dom.ultraCompactBinderToggle.checked);
    if (state.ultraCompactBinder && !state.compactBinder) {
      state.compactBinder = true;
      if (dom.compactBinderToggle) dom.compactBinderToggle.checked = true;
      saveMtgCompactBinderMode(state.compactBinder);
    }
    saveMtgUltraCompactBinderMode(state.ultraCompactBinder);
    renderBinder();
  });

  dom.openPackBtn?.addEventListener("click", openPack);

  dom.resetSessionBtn?.addEventListener("click", () => {
    const okay = window.confirm("Reset MTG session stats? Binder cards are kept.");
    if (!okay) return;
    state.session = {
      packsOpened: 0,
      totalValue: 0,
      totalSpent: 0,
      biggestHit: null,
      profitablePacks: 0,
      packValueHistory: [],
      setEconomy: {},
      pity: { mythicPlus: 0, valueHit: 0 },
      chaseStats: {},
      qaHistory: {},
      auditTrail: [],
    };
    state.currentPack = null;
    state.revealedIds = new Set();
    renderSessionStats();
    renderEconomyPanel();
    renderOddsQaPanel();
    renderRngPanel();
    renderLabPanel();
    renderFidelityRegistryPanel();
    renderMtgProfileDataPanel();
    renderChasePanel();
    renderCards();
  });

  dom.resetBinderBtn?.addEventListener("click", () => {
    const okay = window.confirm("Reset MTG binder collection data?");
    if (!okay) return;
    state.binder = { cards: {} };
    persistBinder();
    renderBinder();
  });
}

function setStatus(message, type = "") {
  if (!dom.loadStatus) return;
  dom.loadStatus.textContent = message;
  dom.loadStatus.classList.remove("ready", "error");
  if (type) dom.loadStatus.classList.add(type);
}

function getCurrentSetDef() {
  return MTG_SETS.find((set) => set.key === state.selectedSetKey) || MTG_SETS[0];
}

function getSortedSets() {
  const sets = [...MTG_SETS];
  if (state.setSortMode === "alpha") {
    return sets.sort((a, b) => a.displayName.localeCompare(b.displayName));
  }
  if (state.setSortMode === "value") {
    return sets.sort((a, b) => getPackPrice(b) - getPackPrice(a));
  }
  return sets.sort((a, b) => getReleaseTimestamp(b.key) - getReleaseTimestamp(a.key));
}

function getReleaseTimestamp(setKey) {
  const fromMeta = state.setData[setKey]?.setMeta?.released_at;
  const fromConfig = MTG_SETS.find((set) => set.key === setKey)?.releaseDate;
  const release = fromMeta || fromConfig;
  if (!release) return 0;
  const ts = Date.parse(`${release}T00:00:00Z`);
  return Number.isFinite(ts) ? ts : 0;
}

function renderSetSelect() {
  if (!dom.setSelect) return;
  dom.setSort.value = state.setSortMode;
  if (dom.productSelect) {
    dom.productSelect.innerHTML = "";
    for (const product of Object.values(MTG_SEALED_PRODUCTS)) {
      const option = document.createElement("option");
      option.value = product.key;
      option.textContent = product.label;
      dom.productSelect.appendChild(option);
    }
    dom.productSelect.value = state.sealedProductKey;
  }
  dom.priceSourceMode.value = state.priceSourceMode;
  if (dom.marketValueMode) {
    dom.marketValueMode.value = state.marketValueMode;
  }
  if (dom.openingUxMode) {
    dom.openingUxMode.value = state.openingUxMode;
  }
  if (dom.compactBinderToggle) {
    dom.compactBinderToggle.checked = Boolean(state.compactBinder);
  }
  if (dom.ultraCompactBinderToggle) {
    dom.ultraCompactBinderToggle.checked = Boolean(state.ultraCompactBinder);
  }
  dom.setSelect.innerHTML = "";
  for (const setDef of getSortedSets()) {
    const option = document.createElement("option");
    option.value = setDef.key;
    const loaded = Boolean(state.setData[setDef.key]);
    const loading = state.loadingSetKeys.has(setDef.key);
    const fidelityLabel = getCollationFidelityLabel(setDef);
    option.textContent = `${setDef.displayName} [${fidelityLabel}] (${loading ? "loading..." : loaded ? "live" : "pending"})`;
    dom.setSelect.appendChild(option);
  }
  dom.setSelect.value = state.selectedSetKey;
}

function loadProductMode() {
  try {
    const value = window.localStorage.getItem(MTG_PRODUCT_STORAGE_KEY);
    if (value && MTG_SEALED_PRODUCTS[value]) return value;
  } catch {
    // Ignore storage failures.
  }
  return "play-pack";
}

function saveProductMode(value) {
  try {
    window.localStorage.setItem(MTG_PRODUCT_STORAGE_KEY, value);
  } catch {
    // Ignore storage failures.
  }
}

function syncProductModeFromSealedSelection() {
  const active = getActiveSealedProduct();
  state.productMode = active.boosterMode;
}

function getActiveSealedProduct() {
  return MTG_SEALED_PRODUCTS[state.sealedProductKey] || MTG_SEALED_PRODUCTS["play-pack"];
}

function renderHeader() {
  const setDef = getCurrentSetDef();
  const setData = state.setData[setDef.key];
  const price = getPackPrice(setDef);
  const source = getPriceSource(setDef);
  const release = setData?.setMeta?.released_at || "Unknown";
  const profile = getCollationProfile(setDef);
  const product = MTG_PRODUCTS[state.productMode] || MTG_PRODUCTS.play;
  const sealedProduct = getActiveSealedProduct();
  const productCost = getSealedProductCost(setDef);
  applySetTheme(setDef);

  dom.selectedPackName.textContent = setDef.displayName;
  dom.selectedPackSub.textContent = `${setDef.releaseLabel} - ${sealedProduct.label}`;
  dom.packImage.src = setDef.packImage;
  dom.packLogo.src = setData?.setMeta?.icon_svg_uri || "";

  dom.packStats.innerHTML = [
    `<span class="pack-stat">${setData?.cards?.length || 0} cards loaded</span>`,
    `<span class="pack-stat">${setData?.dataQuality?.boosterEligible || 0}/${setData?.dataQuality?.totalSeen || 0} booster-eligible cards</span>`,
    `<span class="pack-stat">Pack price ${formatUsd(price)} (${product.label})</span>`,
    `<span class="pack-stat">Sealed cost ${formatUsd(productCost)} (${sealedProduct.packCount} pack${sealedProduct.packCount > 1 ? "s" : ""})</span>`,
    `<span class="pack-stat">Pricing mode ${escapeHtml(getMtgMarketValueModeLabel())}</span>`,
    `<span class="pack-stat">Release ${escapeHtml(release)}</span>`,
    `<span class="pack-stat">${profile.slots.length} slots (${product.label})</span>`,
  ].join("");

  if (dom.collationMeta) {
    const sourceLabel = profile.profileSource || "Default";
    const note = profile.profileNote ? `<span class="pack-source-meta">${escapeHtml(profile.profileNote)}</span>` : "";
    const fidelity = profile.profileFidelityLabel || "Estimated";
    dom.collationMeta.innerHTML = `<span>Collation profile: <strong>${escapeHtml(sourceLabel)}</strong> <strong>[${escapeHtml(fidelity)}]</strong> <span class="pack-source-meta">${escapeHtml(profile.templateVersion || MTG_EXACT_TEMPLATE_VERSION)}</span></span>${note}`;
  }

  dom.packPriceSource.innerHTML = source
    ? `<span>Pack market source: <a href="${source.url}" target="_blank" rel="noreferrer">${escapeHtml(source.label)}</a></span>
       <span class="pack-source-meta">Last updated: ${formatDateLabel(state.marketSnapshot.updatedAt || new Date().toISOString().slice(0, 10))}${state.marketSnapshot.loaded ? " | Authoritative snapshot" : ""}</span>`
    : "<span>Pack market source unavailable.</span>";

  dom.openPackBtn.disabled = !setData;
}

async function loadSetData(setKey) {
  if (state.setData[setKey] || state.loadingSetKeys.has(setKey)) return;
  const setDef = MTG_SETS.find((set) => set.key === setKey);
  if (!setDef) return;

  state.loadingSetKeys.add(setKey);
  renderSetSelect();
  setStatus(`Loading ${setDef.displayName}...`);
  try {
    const setMeta = await fetchJson(`${SCRYFALL_API_BASE}/sets/${setDef.scryfallCode}`);
    const cards = await fetchAllCards(setDef.scryfallCode);
    const normalized = cards.map(normalizeCard).filter((card) => card.image);
    const boosterEligible = normalized.filter((card) => card.boosterEligible);
    const activeCards = boosterEligible.length ? boosterEligible : normalized;
    const pools = buildPools(activeCards, {
      strictMode: isExactCollationSet(setDef),
    });
    state.setData[setKey] = {
      setMeta,
      cards: activeCards,
      allCards: normalized,
      pools,
      dataQuality: {
        totalSeen: normalized.length,
        boosterEligible: boosterEligible.length,
      },
    };
    if (setKey === state.selectedSetKey) {
      sanitizeCurrentSetChaseTargets();
    }
    setStatus("Ready to open MTG packs.", "ready");
  } catch (error) {
    console.error(error);
    setStatus(`Failed loading ${setDef.displayName}.`, "error");
  } finally {
    state.loadingSetKeys.delete(setKey);
    renderSetSelect();
    renderHeader();
    renderOddsQaPanel();
    renderLabPanel();
    renderFidelityRegistryPanel();
    renderMtgProfileDataPanel();
    renderChasePanel();
    if (state.backgroundSync.running) {
      state.backgroundSync.done += 1;
      setStatus(`Background loading MTG sets: ${state.backgroundSync.done}/${state.backgroundSync.total}`);
      if (state.backgroundSync.done >= state.backgroundSync.total) {
        state.backgroundSync.running = false;
        setStatus("Ready to open MTG packs.", "ready");
      }
    }
  }
}

function startBackgroundPreload() {
  if (state.backgroundPreloadStarted) return;
  state.backgroundPreloadStarted = true;
  state.backgroundSync.running = true;
  state.backgroundSync.total = MTG_SETS.length;
  state.backgroundSync.done = state.setData[state.selectedSetKey] ? 1 : 0;
  setStatus(`Background loading MTG sets: ${state.backgroundSync.done}/${state.backgroundSync.total}`);
  const remaining = MTG_SETS.map((set) => set.key).filter((key) => key !== state.selectedSetKey);
  preloadSetsSequentially(remaining).catch((error) => {
    console.error(error);
    state.backgroundSync.running = false;
    setStatus("MTG background loading encountered an issue.", "error");
  });
}

async function preloadSetsSequentially(setKeys) {
  for (const setKey of setKeys) {
    if (!state.setData[setKey]) {
      await loadSetData(setKey);
    } else if (state.backgroundSync.running) {
      state.backgroundSync.done += 1;
      setStatus(`Background loading MTG sets: ${state.backgroundSync.done}/${state.backgroundSync.total}`);
    }
  }
  if (state.backgroundSync.running) {
    state.backgroundSync.running = false;
    const mode = state.marketSnapshot.loaded ? "authoritative snapshot active" : "live + fallback mode";
    setStatus(`Ready to open MTG packs (${mode}).`, "ready");
  }
}

async function fetchAllCards(setCode) {
  const all = [];
  let nextUrl = `${SCRYFALL_API_BASE}/cards/search?q=e%3A${encodeURIComponent(setCode)}+game%3Apaper+-is%3Adigital+-t%3Atoken&order=set&unique=prints`;
  while (nextUrl) {
    const payload = await fetchJson(nextUrl);
    all.push(...(payload.data || []));
    nextUrl = payload.has_more ? payload.next_page : "";
  }
  return all;
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Request failed (${response.status})`);
  return response.json();
}

function normalizeCard(raw) {
  const frameEffects = Array.isArray(raw.frame_effects) ? raw.frame_effects : [];
  const boosterEligible = raw.booster !== false && raw.digital !== true && raw.promo !== true;
  const isBoosterFunTreatment =
    raw.showcase === true ||
    raw.border_color === "borderless" ||
    raw.full_art === true ||
    raw.extended_art === true ||
    raw.variation === true ||
    frameEffects.some((effect) =>
      ["showcase", "extendedart", "borderless", "etched", "inverted", "shatteredglass"].includes(effect),
    );

  const prices = applyMtgPriceOverrides(raw.id, raw.oracle_id, raw.prices || {});
  return {
    id: raw.id,
    oracleId: raw.oracle_id || "",
    name: raw.name || "Unknown",
    collectorNumber: raw.collector_number || "",
    rarity: raw.rarity || "common",
    typeLine: raw.type_line || "",
    setCode: raw.set || "",
    image: raw.image_uris?.normal || raw.card_faces?.[0]?.image_uris?.normal || "",
    usd: Number(prices.usd || 0),
    usdFoil: Number(prices.usd_foil || 0),
    usdEtched: Number(prices.usd_etched || 0),
    boosterEligible,
    isBoosterFunTreatment,
    isBasicLand: /basic land/i.test(raw.type_line || ""),
    isLand: /land/i.test(raw.type_line || ""),
    isSpecialGuestLike: /special guest|bonus|breaking news|masterpiece|the list/i.test(raw.name || "") || /special guest|bonus|masterpiece/i.test(raw.type_line || ""),
    finishes: Array.isArray(raw.finishes) ? raw.finishes : [],
    frameEffects,
    showcase: raw.showcase === true,
    fullArt: raw.full_art === true,
    borderColor: raw.border_color || "",
    variation: raw.variation === true,
  };
}

function applyMtgPriceOverrides(cardId, oracleId, prices) {
  const byId = state.marketSnapshot.cardOverrides?.byId?.[cardId] || null;
  const byOracle = state.marketSnapshot.cardOverrides?.byOracleId?.[oracleId || ""] || null;
  const override = byId || byOracle;
  if (!override || typeof override !== "object") {
    return prices || {};
  }
  return {
    ...(prices || {}),
    ...override,
  };
}

function buildPools(cards, options = {}) {
  const strictMode = options.strictMode === true;
  const specialGuestLike = cards.filter((card) => card.isSpecialGuestLike);
  const specialGuestIds = new Set(specialGuestLike.map((card) => card.id));
  const nonLandCards = cards.filter((card) => !card.isLand);
  const commonAll = nonLandCards.filter((card) => card.rarity === "common");
  const uncommonAll = nonLandCards.filter((card) => card.rarity === "uncommon");
  const rareAll = nonLandCards.filter((card) => card.rarity === "rare" && !specialGuestIds.has(card.id));
  const mythicAll = nonLandCards.filter((card) => card.rarity === "mythic" && !specialGuestIds.has(card.id));
  const rareBase = rareAll.filter((card) => !card.isBoosterFunTreatment);
  const mythicBase = mythicAll.filter((card) => !card.isBoosterFunTreatment);
  const boosterFunRare = rareAll.filter((card) => card.isBoosterFunTreatment);
  const boosterFunMythic = mythicAll.filter((card) => card.isBoosterFunTreatment);
  const basicLands = cards.filter((card) => card.isBasicLand);
  const nonBasicLands = cards.filter((card) => card.isLand && !card.isBasicLand);

  const byRarity = {
    common: commonAll,
    uncommon: uncommonAll,
    // Tailored fix: keep premium treatments and special-guest style inserts out of baseline play-booster rare/mythic pools.
    rare: strictMode ? rareBase : (rareBase.length ? rareBase : rareAll),
    mythic: strictMode ? mythicBase : (mythicBase.length ? mythicBase : mythicAll),
    basicLand: strictMode ? basicLands : (basicLands.length ? basicLands : nonBasicLands),
    land: strictMode ? nonBasicLands : (nonBasicLands.length ? nonBasicLands : basicLands),
    specialGuest: specialGuestLike,
    showcaseRare: boosterFunRare,
    showcaseMythic: boosterFunMythic,
  };
  return byRarity;
}

function isExactCollationSet(setDef) {
  const override = MTG_SET_COLLATION_OVERRIDES[setDef?.scryfallCode] || null;
  return override?.fidelity === "exact";
}

function openPack() {
  const setDef = getCurrentSetDef();
  const setData = state.setData[setDef.key];
  if (!setData) return;
  const product = getActiveSealedProduct();
  const allCards = [];
  for (let packIndex = 0; packIndex < product.packCount; packIndex += 1) {
    const pack = simulatePack(setData, {
      setDef,
      rng: state.rng.generator,
      audit: true,
      packIndex: packIndex + 1,
    });
    registerPack(pack, setDef);
    allCards.push(...pack);
  }
  state.currentPack = allCards;
  state.revealedIds = state.revealMode === "all" ? new Set(allCards.map((card) => card.instanceId)) : new Set();
  playOpenFx(setDef, allCards);
  renderHeader();
  renderSessionStats();
  renderEconomyPanel();
  renderOddsQaPanel();
  renderRngPanel();
  renderLabPanel();
  renderFidelityRegistryPanel();
  renderMtgProfileDataPanel();
  renderChasePanel();
  renderBinder();
  renderCards();
}

function simulatePack(setData, options = {}) {
  const cards = [];
  const used = new Set();
  const setDef = options.setDef || getCurrentSetDef();
  const rng = options.rng || state.rng.generator;
  const profile = getCollationProfile(setDef);
  const packIndex = options.packIndex || 1;
  const setProductKey = getSetProductKey(setDef.key, state.productMode);
  const pushCard = (slotLabel, slotDefinition) => {
    const picked = pickFromSheet(setData, slotDefinition, used, rng);
    if (!picked) return;
    const valuation = resolveMtgCardValue(picked);
    cards.push({
      ...picked,
      slotLabel,
      value: valuation.value,
      valuationBasis: valuation.basis,
      instanceId: `${picked.id}-${setProductKey}-${packIndex}-${cards.length + 1}-${Math.floor(rng() * 1e9)}`,
      standardIndex: cards.length + 1,
      packIndex,
    });
  };

  for (const slotDefinition of profile.slots) {
    if (slotDefinition.optional && rng() > (slotDefinition.chance || 0)) {
      continue;
    }
    pushCard(slotDefinition.label, slotDefinition);
  }

  if (options.audit) {
    appendAuditTrail({
      setKey: setDef.key,
      productKey: state.sealedProductKey,
      packIndex,
      topCard: cards.reduce((best, card) => (card.value > (best?.value || 0) ? card : best), null)?.name || "None",
      totalValue: cards.reduce((sum, card) => sum + (card.value || 0), 0),
      drawsUsed: state.rng.drawCount,
    });
  }
  return cards;
}

function pickFromSheet(setData, slotDefinition, used, rng) {
  const sheetEntries = (slotDefinition?.sheet || []).filter((entry) => {
    const pool = setData.pools[entry.pool] || [];
    return pool.length > 0;
  });
  if (!sheetEntries.length) return null;
  const chosenSheet = weightedChoice(sheetEntries, rng);
  if (!chosenSheet) return null;
  const pool = setData.pools[chosenSheet.pool] || [];
  const candidates = pool.filter((card) => !used.has(card.id));
  const drawPool = candidates.length ? candidates : pool;
  if (!drawPool.length) {
    return null;
  }
  // Important: card market price must never influence pull odds.
  // Slot-sheet rarity weighting is handled above; card selection inside a sheet is uniform.
  const picked = drawPool[Math.floor(rng() * drawPool.length)];
  used.add(picked.id);
  return {
    ...picked,
    isFoil: Boolean(chosenSheet.foil),
  };
}

function weightedChoice(entries, rng = state.rng.generator) {
  const total = entries.reduce((sum, item) => sum + Number(item.weight || 0), 0);
  if (!total) return entries[0] || null;
  let roll = rng() * total;
  for (const entry of entries) {
    roll -= Number(entry.weight || 0);
    if (roll <= 0) return entry;
  }
  return entries[entries.length - 1] || null;
}

function resolveMtgCardValue(card) {
  if (!card) return { value: 0, basis: "No price" };
  const candidates = [];
  if (Number.isFinite(card.usd) && card.usd > 0) candidates.push({ key: "usd", value: Number(card.usd) });
  if (Number.isFinite(card.usdFoil) && card.usdFoil > 0) candidates.push({ key: "usd_foil", value: Number(card.usdFoil) });
  if (Number.isFinite(card.usdEtched) && card.usdEtched > 0) candidates.push({ key: "usd_etched", value: Number(card.usdEtched) });
  if (!candidates.length) return { value: 0, basis: "No market data" };

  const preferredFoil = card.frameEffects?.includes("etched")
    ? ["usd_etched", "usd_foil", "usd"]
    : card.isFoil
      ? ["usd_foil", "usd_etched", "usd"]
      : ["usd", "usd_foil", "usd_etched"];

  const ordered = preferredFoil
    .map((key) => candidates.find((item) => item.key === key))
    .filter(Boolean);
  const choose = (mode) => {
    if (mode === "conservative") {
      return candidates.reduce((best, item) => (item.value < best.value ? item : best), candidates[0]);
    }
    if (mode === "premium") {
      return candidates.reduce((best, item) => (item.value > best.value ? item : best), candidates[0]);
    }
    return ordered[0] || candidates[0];
  };

  const chosen = choose(state.marketValueMode);
  const modeTag = state.marketValueMode || "blended";
  return {
    value: Number(chosen.value.toFixed(2)),
    basis: `${chosen.key} (${modeTag})`,
  };
}

function getCollationProfile(setDef) {
  const productKey = state.productMode;
  const base = MTG_PRODUCTS[productKey] || MTG_PRODUCTS.play;
  const setOverride = MTG_SET_COLLATION_OVERRIDES[setDef.scryfallCode] || null;
  const override = setOverride?.[productKey];
  const profile = override || base;
  const note = setOverride?.notes || "";
  const requestedFidelity = setOverride?.fidelity || "estimated";
  const fidelityStatus = resolveFidelityStatus(setDef, profile, requestedFidelity);
  const templateVersion = setOverride?.templateVersion || MTG_EXACT_TEMPLATE_VERSION;
  return {
    slots: profile.slots || [],
    profileSource: override ? `${setDef.displayName} ${base.label} ${fidelityStatus.sourceTag}` : `${base.label} Default`,
    profileNote: `${note}${fidelityStatus.note ? ` ${fidelityStatus.note}` : ""}`.trim(),
    profileFidelity: fidelityStatus.fidelity,
    profileFidelityLabel: formatCollationFidelityLabel(fidelityStatus.fidelity),
    templateVersion,
  };
}

function getCollationFidelityLabel(setDef) {
  const profile = getCollationProfile(setDef);
  return profile.profileFidelityLabel;
}

function formatCollationFidelityLabel(value) {
  if (value === "exact") return "Exact";
  if (value === "official-slot") return "Official-slot";
  return "Estimated";
}

function resolveFidelityStatus(setDef, profile, requestedFidelity) {
  if (requestedFidelity !== "exact") {
    return {
      fidelity: requestedFidelity,
      note: "",
      sourceTag: "Official",
    };
  }
  const setData = state.setData[setDef.key];
  if (!setData) {
    return {
      fidelity: "exact",
      note: "(Exact verification pending set load.)",
      sourceTag: "Exact",
    };
  }
  const missingSlots = [];
  for (const slot of profile.slots || []) {
    const hasAnyPool = (slot.sheet || []).some((entry) => (setData.pools[entry.pool] || []).length > 0);
    if (!hasAnyPool) {
      missingSlots.push(slot.label);
    }
  }
  if (!missingSlots.length) {
    return {
      fidelity: "exact",
      note: "",
      sourceTag: "Exact",
    };
  }
  const capped = missingSlots.slice(0, 2).join(", ");
  return {
    fidelity: "official-slot",
    note: `(Exact unavailable in current data; empty slot pools: ${capped}${missingSlots.length > 2 ? ", ..." : ""}.)`,
    sourceTag: "Official",
  };
}

function registerPack(cards, setDef) {
  const packValue = cards.reduce((sum, card) => sum + (card.value || 0), 0);
  const packCost = getPackPrice(setDef);
  const setProductKey = getSetProductKey(setDef.key, state.productMode);
  state.session.packsOpened += 1;
  state.session.totalValue += packValue;
  state.session.totalSpent += packCost;
  if (packValue >= packCost) {
    state.session.profitablePacks += 1;
  }
  state.session.packValueHistory.unshift(packValue - packCost);
  state.session.packValueHistory = state.session.packValueHistory.slice(0, 40);
  if (!state.session.setEconomy[setDef.key]) {
    state.session.setEconomy[setDef.key] = { packs: 0, spent: 0, value: 0 };
  }
  state.session.setEconomy[setDef.key].packs += 1;
  state.session.setEconomy[setDef.key].spent += packCost;
  state.session.setEconomy[setDef.key].value += packValue;

  const qaFlags = summarizePackObservations(cards);
  if (!state.session.qaHistory[setProductKey]) {
    state.session.qaHistory[setProductKey] = [];
  }
  state.session.qaHistory[setProductKey].unshift(qaFlags);
  state.session.qaHistory[setProductKey] = state.session.qaHistory[setProductKey].slice(0, 500);

  const hasMythicPlus = cards.some((card) => card.rarity === "mythic" || (card.value || 0) >= 25);
  const hasValueHit = cards.some((card) => (card.value || 0) >= 10);
  state.session.pity.mythicPlus = hasMythicPlus ? 0 : state.session.pity.mythicPlus + 1;
  state.session.pity.valueHit = hasValueHit ? 0 : state.session.pity.valueHit + 1;

  const chaseTargets = getChaseTargets(setDef.key).filter(Boolean);
  for (const cardId of chaseTargets) {
    const chaseKey = `${setDef.key}:${cardId}`;
    if (!state.session.chaseStats[chaseKey]) {
      state.session.chaseStats[chaseKey] = { hits: 0, lastHitPack: 0 };
    }
    if (cards.some((card) => card.id === cardId)) {
      state.session.chaseStats[chaseKey].hits += 1;
      state.session.chaseStats[chaseKey].lastHitPack = state.session.packsOpened;
    }
  }

  ingestCardsIntoBinder(cards, setDef.key);
  persistBinder();

  const best = cards.reduce((top, card) => (card.value > (top?.value || 0) ? card : top), null);
  if (best && (!state.session.biggestHit || best.value > state.session.biggestHit.value)) {
    state.session.biggestHit = best;
  }
}

function getSetProductKey(setKey, productMode) {
  return `${setKey}:${productMode || "play"}`;
}

function summarizePackObservations(cards) {
  return {
    mythicAny: cards.some((card) => card.rarity === "mythic"),
    foilRarePlusAny: cards.some((card) => card.isFoil && (card.rarity === "rare" || card.rarity === "mythic")),
    showcaseRarePlusAny: cards.some((card) => card.isBoosterFunTreatment && (card.rarity === "rare" || card.rarity === "mythic")),
  };
}

function renderSessionStats() {
  const net = state.session.totalValue - state.session.totalSpent;
  const biggest = state.session.biggestHit;
  dom.sessionStats.innerHTML = [
    cardStat("Packs Opened", state.session.packsOpened.toLocaleString()),
    cardStat("Total Value", formatUsd(state.session.totalValue)),
    cardStat("Total Spent", formatUsd(state.session.totalSpent)),
    cardStat("Net", formatUsd(net)),
    cardStat("Biggest Hit", biggest ? `${biggest.name} (${formatUsd(biggest.value)})` : "None yet"),
    cardStat("Pity Mythic+", state.session.pity.mythicPlus.toLocaleString()),
    cardStat("Pity Value Hit", state.session.pity.valueHit.toLocaleString()),
  ].join("");
}

function renderChasePanel() {
  if (!dom.chasePanel) return;
  const setDef = getCurrentSetDef();
  const setData = state.setData[setDef.key];
  sanitizeCurrentSetChaseTargets();
  const targets = getChaseTargets(setDef.key);
  const selectableCandidates = getChaseCandidates(setData, setDef, { onlyPullable: true });
  const previewCandidates = getChaseCandidates(setData, setDef, {
    onlyPullable: state.chaseFilterMode === "pullable",
  }).slice(0, 10);

  const selectMarkup = [];
  for (let i = 0; i < 2; i += 1) {
    const selectedId = targets[i] || "";
    const options = [
      `<option value="">No chase selected</option>`,
      ...selectableCandidates.map((card) => {
        const variantLabel = formatVariantLabel(card);
        return `<option value="${card.id}"${card.id === selectedId ? " selected" : ""}>${escapeHtml(card.name)} ${escapeHtml(variantLabel)} (${formatUsd(card.usd || card.usdFoil || 0)})</option>`;
      }),
    ].join("");
    selectMarkup.push(`
      <div class="control-group">
        <label for="mtgChaseSelect${i}">Chase Slot ${i + 1}</label>
        <select id="mtgChaseSelect${i}" data-mtg-chase-slot="${i}">
          ${options}
        </select>
      </div>
    `);
  }

  const trackerRows = targets
    .map((id) => (setData?.allCards || setData?.cards || []).find((card) => card.id === id))
    .filter(Boolean)
    .map((card) => {
      const key = `${setDef.key}:${card.id}`;
      const stats = state.session.chaseStats[key] || { hits: 0, lastHitPack: 0 };
      const ago = stats.lastHitPack > 0 ? Math.max(0, state.session.packsOpened - stats.lastHitPack) : state.session.packsOpened;
      const variant = formatVariantLabel(card);
      return `<li><strong>${escapeHtml(card.name)} ${escapeHtml(variant)}</strong><span>Hits: ${stats.hits}</span><em>Packs since hit: ${ago}</em></li>`;
    })
    .join("");
  const previewRows = previewCandidates
    .map((card, index) => {
      const pullable = isCardPullableForCurrentProduct(card.id, setData, setDef);
      const note = pullable ? "" : ` <em>[outside ${escapeHtml((MTG_PRODUCTS[state.productMode] || MTG_PRODUCTS.play).label)}]</em>`;
      return `<li>${index + 1}. ${escapeHtml(card.name)} ${escapeHtml(formatVariantLabel(card))} - ${formatUsd(card.usd || card.usdFoil || 0)}${note}</li>`;
    })
    .join("");
  const presetLabel = setDef.key === "avatar-last-airbender" ? "Load Avatar Top 10 Preset" : "Load Top 10 Preset";

  const pityMythic = state.session.pity.mythicPlus;
  const pityValue = state.session.pity.valueHit;
  dom.chasePanel.innerHTML = `
    <div class="economy-head">
      <strong>Chase Tracker + Pity</strong>
      <span>Track targeted cards and dry streak counters.</span>
    </div>
    <div class="control-group">
      <label class="inline-check">
        <input id="mtgChaseFilterToggle" type="checkbox" ${state.chaseFilterMode === "pullable" ? "checked" : ""} />
        Show Top 10 preview for current product only
      </label>
    </div>
    <div class="button-row">
      <button id="mtgApplyTop10PresetBtn" class="btn">${presetLabel}</button>
    </div>
    <ul class="chase-tracker-list">${previewRows || "<li><em>No priced cards yet for this set.</em></li>"}</ul>
    <div class="chase-controls">${selectMarkup.join("")}</div>
    <div class="pity-grid">
      <div class="pity-meter ${getPityHeat(pityMythic, 14)}">
        <div class="pity-row"><strong>Mythic+ Pity</strong><span>${pityMythic} packs</span></div>
        <div class="pity-bar"><span style="width:${Math.min(100, Math.round((pityMythic / 14) * 100))}%"></span></div>
      </div>
      <div class="pity-meter ${getPityHeat(pityValue, 8)}">
        <div class="pity-row"><strong>Value Hit Pity ($10+)</strong><span>${pityValue} packs</span></div>
        <div class="pity-bar"><span style="width:${Math.min(100, Math.round((pityValue / 8) * 100))}%"></span></div>
      </div>
    </div>
    <ul class="chase-tracker-list">${trackerRows || "<li><em>No chase cards selected yet.</em></li>"}</ul>
  `;

  dom.chasePanel.querySelectorAll("[data-mtg-chase-slot]").forEach((node) => {
    node.addEventListener("change", () => {
      const slot = Number(node.dataset.mtgChaseSlot);
      const next = getChaseTargets(setDef.key);
      next[slot] = node.value || "";
      setChaseTargets(setDef.key, next.filter(Boolean), setData, setDef);
      renderChasePanel();
    });
  });
  dom.chasePanel.querySelector("#mtgChaseFilterToggle")?.addEventListener("change", (event) => {
    state.chaseFilterMode = event.target.checked ? "pullable" : "all";
    persistChaseFilterMode();
    renderChasePanel();
  });
  dom.chasePanel.querySelector("#mtgApplyTop10PresetBtn")?.addEventListener("click", () => {
    const topPullable = getChaseCandidates(setData, setDef, { onlyPullable: true }).slice(0, 2);
    setChaseTargets(setDef.key, topPullable.map((card) => card.id), setData, setDef);
    renderChasePanel();
  });
}

function getChaseCandidates(setData, setDef, options = {}) {
  const onlyPullable = options.onlyPullable !== false;
  const sourceCards = setData?.allCards || setData?.cards || [];
  if (!sourceCards.length) return [];
  return [...sourceCards]
    .filter((card) => (onlyPullable ? isCardPullableForCurrentProduct(card.id, setData, setDef) : true))
    .filter((card) => Math.max(card.usd || 0, card.usdFoil || 0) > 0)
    .sort((a, b) => Math.max(b.usd || 0, b.usdFoil || 0) - Math.max(a.usd || 0, a.usdFoil || 0))
    .slice(0, 120);
}

function formatVariantLabel(card) {
  const labels = [];
  if (card.collectorNumber) labels.push(`#${card.collectorNumber}`);
  if (card.fullArt) labels.push("Full Art");
  if (card.showcase) labels.push("Showcase");
  if (card.borderColor === "borderless") labels.push("Borderless");
  if (card.variation) labels.push("Variant");
  if (card.frameEffects?.includes("extendedart")) labels.push("Extended");
  if (!labels.length) labels.push("Base");
  return `[${labels.join(" / ")}]`;
}

function isCardPullableForCurrentProduct(cardId, setData, setDef) {
  if (!setData || !cardId || !setDef) return false;
  const profile = getCollationProfile(setDef);
  for (const slot of profile.slots || []) {
    for (const sheetEntry of slot.sheet || []) {
      const poolCards = setData.pools[sheetEntry.pool] || [];
      if (poolCards.some((card) => card.id === cardId)) {
        return true;
      }
    }
  }
  // Tailored fallback: a small number of cards can appear with different print ids/treatments
  // while still being booster-eligible in the same product. We avoid false negatives by
  // checking booster eligibility + same-name presence in active product pools.
  const selected = (setData.allCards || setData.cards || []).find((entry) => entry.id === cardId);
  if (!selected || !selected.boosterEligible) return false;

  const hasSameNameInAnyActivePool = (profile.slots || []).some((slot) =>
    (slot.sheet || []).some((sheetEntry) =>
      (setData.pools[sheetEntry.pool] || []).some((poolCard) => poolCard.name === selected.name),
    ),
  );
  if (hasSameNameInAnyActivePool) return true;

  // Generalized correction for booster-eligible treatment variants across all sets:
  // if rarity/type is compatible with slot pools for the selected product, mark pullable.
  const slotPools = new Set(
    (profile.slots || []).flatMap((slot) => (slot.sheet || []).map((sheetEntry) => sheetEntry.pool)),
  );
  if (
    (selected.rarity === "mythic" && (slotPools.has("mythic") || slotPools.has("showcaseMythic"))) ||
    (selected.rarity === "rare" && (slotPools.has("rare") || slotPools.has("showcaseRare"))) ||
    (selected.rarity === "uncommon" && slotPools.has("uncommon")) ||
    (selected.rarity === "common" && slotPools.has("common")) ||
    (selected.isBasicLand && slotPools.has("basicLand")) ||
    (selected.isLand && slotPools.has("land"))
  ) {
    return true;
  }
  return false;
}

function getPityHeat(value, warmThreshold) {
  if (value >= warmThreshold) return "hot";
  if (value >= Math.round(warmThreshold * 0.6)) return "warm";
  return "cool";
}

function renderEconomyPanel() {
  if (!dom.economyPanel) return;
  const spent = state.session.totalSpent || 0;
  const value = state.session.totalValue || 0;
  const net = value - spent;
  const roi = spent > 0 ? (net / spent) * 100 : 0;
  const hitRate = state.session.packsOpened > 0 ? (state.session.profitablePacks / state.session.packsOpened) * 100 : 0;
  const avgNet = state.session.packsOpened > 0 ? net / state.session.packsOpened : 0;
  const history = state.session.packValueHistory || [];
  const pro = computeEconomyProMetrics(history);
  const maxAbs = Math.max(1, ...history.map((entry) => Math.abs(entry)));

  const bars = history
    .slice(0, 20)
    .reverse()
    .map((entry) => {
      const h = Math.max(12, Math.round((Math.abs(entry) / maxAbs) * 42));
      const cls = entry >= 0 ? "gain" : "loss";
      return `<span class="economy-bar ${cls}" style="height:${h}px" title="${formatUsd(entry)}"></span>`;
    })
    .join("");

  const setRows = Object.entries(state.session.setEconomy || {})
    .map(([setKey, stats]) => {
      const setDef = MTG_SETS.find((set) => set.key === setKey);
      const setName = setDef?.displayName || setKey;
      const setNet = (stats.value || 0) - (stats.spent || 0);
      const setRoi = stats.spent > 0 ? (setNet / stats.spent) * 100 : 0;
      return { setName, packs: stats.packs || 0, setNet, setRoi };
    })
    .sort((a, b) => b.setNet - a.setNet)
    .slice(0, 4)
    .map((row) => `<li><span>${escapeHtml(row.setName)} (${row.packs})</span><strong>${formatUsd(row.setNet)} (${row.setRoi.toFixed(1)}%)</strong></li>`)
    .join("");

  dom.economyPanel.innerHTML = `
    <div class="economy-head">
      <strong>Economy Dashboard + ROI</strong>
      <span>Tracks spend vs pull value in real time.</span>
    </div>
    <div class="economy-grid">
      <article class="economy-stat"><strong>${formatUsd(spent)}</strong><span>Total Spent</span></article>
      <article class="economy-stat"><strong>${formatUsd(value)}</strong><span>Total Value</span></article>
      <article class="economy-stat ${net >= 0 ? "good" : "bad"}"><strong>${formatUsd(net)}</strong><span>Net</span></article>
      <article class="economy-stat"><strong>${roi.toFixed(1)}%</strong><span>ROI</span></article>
      <article class="economy-stat"><strong>${hitRate.toFixed(1)}%</strong><span>Profitable Packs</span></article>
      <article class="economy-stat"><strong>${formatUsd(avgNet)}</strong><span>Avg Net / Pack</span></article>
      <article class="economy-stat"><strong>${formatUsd(pro.median)}</strong><span>Median Net / Pack</span></article>
      <article class="economy-stat"><strong>${formatUsd(pro.p10)}</strong><span>P10 Net / Pack</span></article>
      <article class="economy-stat"><strong>${formatUsd(pro.p90)}</strong><span>P90 Net / Pack</span></article>
      <article class="economy-stat"><strong>${formatUsd(pro.stdDev)}</strong><span>Std Dev Net</span></article>
      <article class="economy-stat"><strong>${pro.breakEvenRate.toFixed(1)}%</strong><span>Break-even Probability</span></article>
      <article class="economy-stat"><strong>${formatUsd(pro.var95)}</strong><span>VaR 95% (Net)</span></article>
    </div>
    <div class="economy-chart-wrap">
      <div class="economy-chart">${bars || '<span class="economy-empty">Open packs to build ROI trend.</span>'}</div>
    </div>
    <ul class="economy-set-list">${setRows || "<li><span>No set data yet.</span></li>"}</ul>
  `;
}

function computeEconomyProMetrics(history) {
  if (!Array.isArray(history) || !history.length) {
    return {
      median: 0,
      p10: 0,
      p90: 0,
      stdDev: 0,
      breakEvenRate: 0,
      var95: 0,
    };
  }
  const sorted = [...history].sort((a, b) => a - b);
  const mean = history.reduce((sum, value) => sum + value, 0) / history.length;
  const variance = history.reduce((sum, value) => sum + (value - mean) ** 2, 0) / history.length;
  const stdDev = Math.sqrt(Math.max(0, variance));
  const breakEvenRate = (history.filter((value) => value >= 0).length / history.length) * 100;
  return {
    median: getPercentile(sorted, 0.5),
    p10: getPercentile(sorted, 0.1),
    p90: getPercentile(sorted, 0.9),
    stdDev,
    breakEvenRate,
    var95: getPercentile(sorted, 0.05),
  };
}

function getPercentile(sortedValues, p) {
  if (!Array.isArray(sortedValues) || !sortedValues.length) return 0;
  const rank = Math.max(0, Math.min(sortedValues.length - 1, (sortedValues.length - 1) * p));
  const lower = Math.floor(rank);
  const upper = Math.ceil(rank);
  if (lower === upper) return Number(sortedValues[lower] || 0);
  const weight = rank - lower;
  return Number(((sortedValues[lower] || 0) * (1 - weight) + (sortedValues[upper] || 0) * weight).toFixed(2));
}

function renderOddsQaPanel() {
  if (!dom.oddsQaPanel) return;
  const setDef = getCurrentSetDef();
  const setData = state.setData[setDef.key];
  const product = MTG_PRODUCTS[state.productMode] || MTG_PRODUCTS.play;
  const setProductKey = getSetProductKey(setDef.key, state.productMode);
  const history = state.session.qaHistory[setProductKey] || [];
  const observedWindow = history.slice(0, MTG_QA_WINDOW_SIZE);
  const expected = setData ? computeExpectedPackRates(setData, setDef) : null;
  const observed = computeObservedRates(observedWindow);
  const testResult = state.qaTest.resultBySetProduct[setProductKey] || null;

  const rows = [
    qaMetricRow("Mythic in Pack", expected?.mythicAny, observed.mythicAny, observedWindow.length),
    qaMetricRow("Foil Rare+ in Pack", expected?.foilRarePlusAny, observed.foilRarePlusAny, observedWindow.length),
    qaMetricRow("Showcase/Alt Rare+ in Pack", expected?.showcaseRarePlusAny, observed.showcaseRarePlusAny, observedWindow.length),
  ].join("");

  const testSummary = testResult
    ? `
      <div class="qa-test-summary">
        <strong>Last 10k test (${escapeHtml(formatDateLabel(testResult.dateIso))})</strong>
        <p>Mythic ${formatPercent(testResult.metrics.mythicAny.rate)} (${formatPercent(testResult.metrics.mythicAny.ciLow)} - ${formatPercent(testResult.metrics.mythicAny.ciHigh)})</p>
        <p>Foil Rare+ ${formatPercent(testResult.metrics.foilRarePlusAny.rate)} (${formatPercent(testResult.metrics.foilRarePlusAny.ciLow)} - ${formatPercent(testResult.metrics.foilRarePlusAny.ciHigh)})</p>
        <ul class="qa-slot-list">${formatQaSlotSummary(testResult)}</ul>
      </div>
    `
    : `<div class="qa-test-summary"><p>No 10k test yet for this set/product.</p></div>`;

  const buttonLabel = state.qaTest.running ? "Running 10k test..." : "Run 10k Collation Test";
  dom.oddsQaPanel.innerHTML = `
    <div class="economy-head">
      <strong>Odds QA</strong>
      <span>Expected vs observed for ${escapeHtml(setDef.displayName)} (${escapeHtml(product.label)}).</span>
    </div>
    <div class="qa-grid">
      <article class="economy-stat"><strong>${observedWindow.length}</strong><span>Observed Packs</span></article>
      <article class="economy-stat"><strong>${setData ? "Live Pools" : "Pending"}</strong><span>Data Status</span></article>
      <article class="economy-stat"><strong>${formatUsd(getPackPrice(setDef))}</strong><span>Preset Pack Cost</span></article>
    </div>
    <ul class="qa-list">${rows}</ul>
    <div class="button-row">
      <button id="mtgRunQaTestBtn" class="btn" ${setData && !state.qaTest.running ? "" : "disabled"}>${buttonLabel}</button>
    </div>
    ${testSummary}
  `;

  dom.oddsQaPanel.querySelector("#mtgRunQaTestBtn")?.addEventListener("click", () => {
    state.lab.pendingIterations = 10000;
    runCollationTest(setDef.key, state.productMode);
  });
}

function qaMetricRow(label, expected, observed, sampleSize) {
  const observedWithCi = sampleSize > 0 ? formatPercentWithCi(observed, sampleSize) : "n/a";
  return `<li><span>${escapeHtml(label)}</span><strong>Expected ${formatMaybePercent(expected)} | Observed ${observedWithCi}</strong></li>`;
}

function formatQaSlotSummary(testResult) {
  const slotEntries = Object.entries(testResult.slotSummary || {});
  if (!slotEntries.length) {
    return "<li>No slot summary available.</li>";
  }
  return slotEntries
    .slice(0, 6)
    .map(([slotLabel, summary]) => {
      const n = Math.max(1, Number(summary.totalSeen || 0));
      const rarePlus = (Number(summary.rare || 0) + Number(summary.mythic || 0)) / n;
      const noneRate = Number(summary.none || 0) / n;
      return `<li><span>${escapeHtml(slotLabel)}</span><strong>Rare+ ${formatPercent(rarePlus)} | Empty ${formatPercent(noneRate)}</strong></li>`;
    })
    .join("");
}

function computeObservedRates(historyWindow) {
  if (!historyWindow.length) {
    return { mythicAny: 0, foilRarePlusAny: 0, showcaseRarePlusAny: 0 };
  }
  const total = historyWindow.length;
  const sum = (field) => historyWindow.reduce((acc, row) => acc + (row[field] ? 1 : 0), 0) / total;
  return {
    mythicAny: sum("mythicAny"),
    foilRarePlusAny: sum("foilRarePlusAny"),
    showcaseRarePlusAny: sum("showcaseRarePlusAny"),
  };
}

function computeExpectedPackRates(setData, setDef) {
  const cacheKey = state.productMode;
  setData.expectedByProduct = setData.expectedByProduct || {};
  if (setData.expectedByProduct[cacheKey]) {
    return setData.expectedByProduct[cacheKey];
  }
  const profile = getCollationProfile(setDef);
  const chanceAny = (predicate) => {
    let probNoHit = 1;
    for (const slot of profile.slots || []) {
      const p = computeSlotHitProbability(setData, slot, predicate);
      probNoHit *= 1 - p;
    }
    return 1 - probNoHit;
  };
  const result = {
    mythicAny: chanceAny((card) => card.rarity === "mythic"),
    foilRarePlusAny: chanceAny((card, entry) => Boolean(entry.foil) && (card.rarity === "rare" || card.rarity === "mythic")),
    showcaseRarePlusAny: chanceAny((card) => card.isBoosterFunTreatment && (card.rarity === "rare" || card.rarity === "mythic")),
  };
  setData.expectedByProduct[cacheKey] = result;
  return result;
}

function computeSlotHitProbability(setData, slot, predicate) {
  const entries = slot.sheet || [];
  if (!entries.length) return 0;
  const validEntries = entries
    .map((entry) => {
      const pool = setData.pools[entry.pool] || [];
      return { entry, pool };
    })
    .filter((value) => value.pool.length > 0);
  if (!validEntries.length) return 0;
  const totalWeight = validEntries.reduce((sum, value) => sum + Number(value.entry.weight || 0), 0);
  if (!totalWeight) return 0;
  let slotProbability = 0;
  for (const value of validEntries) {
    const entryProb = Number(value.entry.weight || 0) / totalWeight;
    const hitFrac = value.pool.filter((card) => predicate(card, value.entry)).length / value.pool.length;
    slotProbability += entryProb * hitFrac;
  }
  const includeChance = slot.optional ? Number(slot.chance || 0) : 1;
  return slotProbability * includeChance;
}

async function runCollationTest(setKey, productMode) {
  const setDef = MTG_SETS.find((set) => set.key === setKey);
  if (!setDef) return;
  const setData = state.setData[setKey];
  if (!setData || state.qaTest.running) return;

  const initialProductMode = state.productMode;
  const initialSealedProductKey = state.sealedProductKey;
  state.qaTest.running = true;
  renderOddsQaPanel();

  const setProductKey = getSetProductKey(setKey, productMode);
  const iterations = Number(state.lab.pendingIterations || 10000);
  const n = Math.max(1000, iterations);
  const metricCounts = { mythicAny: 0, foilRarePlusAny: 0, showcaseRarePlusAny: 0 };
  const slotCounts = {};
  try {
    state.productMode = productMode;
    state.sealedProductKey = productMode === "collector" ? "collector-pack" : "play-pack";
    const profile = getCollationProfile(setDef);
    const labRng = createDeterministicRng(`${state.rng.seed}:lab:${setProductKey}:${n}`, false);
    for (const slot of profile.slots || []) {
      slotCounts[slot.label] = { totalSeen: 0, none: 0, common: 0, uncommon: 0, rare: 0, mythic: 0 };
    }

    for (let i = 0; i < n; i += 1) {
      const pack = simulatePack(setData, { setDef, rng: labRng, audit: false, packIndex: i + 1 });
      const flags = summarizePackObservations(pack);
      if (flags.mythicAny) metricCounts.mythicAny += 1;
      if (flags.foilRarePlusAny) metricCounts.foilRarePlusAny += 1;
      if (flags.showcaseRarePlusAny) metricCounts.showcaseRarePlusAny += 1;

      for (const [slotLabel, slotSummary] of Object.entries(slotCounts)) {
        const card = pack.find((entry) => entry.slotLabel === slotLabel);
        slotSummary.totalSeen += 1;
        if (!card) {
          slotSummary.none += 1;
        } else if (slotSummary[card.rarity] !== undefined) {
          slotSummary[card.rarity] += 1;
        } else {
          slotSummary.common += 1;
        }
      }

      if ((i + 1) % 4000 === 0) {
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
    }

    const toMetric = (count) => {
      const rate = count / n;
      const ci = confidenceInterval95(rate, n);
      return { rate, ciLow: ci.low, ciHigh: ci.high };
    };
    const result = {
      n,
      dateIso: new Date().toISOString().slice(0, 10),
      metrics: {
        mythicAny: toMetric(metricCounts.mythicAny),
        foilRarePlusAny: toMetric(metricCounts.foilRarePlusAny),
        showcaseRarePlusAny: toMetric(metricCounts.showcaseRarePlusAny),
      },
      slotSummary: slotCounts,
    };
    state.qaTest.resultBySetProduct[setProductKey] = result;
    state.lab.lastResultBySetProduct[setProductKey] = result;
  } finally {
    state.productMode = initialProductMode;
    state.sealedProductKey = initialSealedProductKey;
    state.qaTest.running = false;
    renderHeader();
    renderSetSelect();
    renderOddsQaPanel();
    renderLabPanel();
    renderFidelityRegistryPanel();
    renderMtgProfileDataPanel();
    renderChasePanel();
  }
}

function confidenceInterval95(rate, sampleSize) {
  if (!sampleSize) return { low: 0, high: 0 };
  const z = 1.96;
  const margin = z * Math.sqrt((rate * (1 - rate)) / sampleSize);
  return {
    low: Math.max(0, rate - margin),
    high: Math.min(1, rate + margin),
  };
}

function initializeRngState() {
  const persisted = loadRngSettings();
  const seed = persisted.seed || createDefaultSeed();
  const mode = persisted.mode || "seeded";
  return {
    mode,
    seed,
    generator:
      mode === "random"
        ? () => {
            state.rng.drawCount += 1;
            return Math.random();
          }
        : createDeterministicRng(seed),
    drawCount: 0,
  };
}

function createDefaultSeed() {
  return `mtg-${Date.now().toString(36)}`;
}

function createDeterministicRng(seedText, trackDraws = true) {
  const seedInt = hashString32(seedText || "mtg-default-seed");
  let stateInt = seedInt >>> 0;
  return () => {
    stateInt += 0x6d2b79f5;
    let t = stateInt;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    const output = ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    if (trackDraws) {
      state.rng.drawCount += 1;
    }
    return output;
  };
}

function hashString32(value) {
  let h = 1779033703 ^ value.length;
  for (let i = 0; i < value.length; i += 1) {
    h = Math.imul(h ^ value.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  h = Math.imul(h ^ (h >>> 16), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);
  return h ^ (h >>> 16);
}

function loadRngSettings() {
  try {
    const raw = window.localStorage.getItem(MTG_RNG_SETTINGS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    if (!parsed || typeof parsed !== "object") return {};
    return {
      mode: parsed.mode === "random" ? "random" : "seeded",
      seed: typeof parsed.seed === "string" ? parsed.seed : "",
    };
  } catch {
    return {};
  }
}

function persistRngSettings() {
  try {
    window.localStorage.setItem(
      MTG_RNG_SETTINGS_STORAGE_KEY,
      JSON.stringify({
        mode: state.rng.mode,
        seed: state.rng.seed,
      }),
    );
  } catch {
    // Ignore storage issues.
  }
}

function reseedRng(seedValue) {
  const seed = (seedValue || createDefaultSeed()).trim();
  state.rng.seed = seed;
  state.rng.generator =
    state.rng.mode === "random"
      ? () => {
          state.rng.drawCount += 1;
          return Math.random();
        }
      : createDeterministicRng(seed);
  state.rng.drawCount = 0;
  persistRngSettings();
}

function appendAuditTrail(entry) {
  state.session.auditTrail.unshift({
    ...entry,
    openedAt: new Date().toISOString(),
    seed: state.rng.seed,
    rngMode: state.rng.mode,
  });
  state.session.auditTrail = state.session.auditTrail.slice(0, MTG_AUDIT_TRAIL_LIMIT);
}

function renderRngPanel() {
  if (!dom.rngPanel) return;
  const trail = state.session.auditTrail.slice(0, 5);
  const trailRows = trail
    .map((row) => `<li><span>${escapeHtml(formatDateLabel(row.openedAt.slice(0, 10)))} P${row.packIndex}</span><strong>${escapeHtml(row.topCard)} ${formatUsd(row.totalValue)}</strong></li>`)
    .join("");
  dom.rngPanel.innerHTML = `
    <div class="economy-head">
      <strong>RNG & Audit</strong>
      <span>Deterministic seed + replay-friendly audit trail.</span>
    </div>
    <div class="control-group">
      <label for="mtgRngMode">RNG mode</label>
      <select id="mtgRngMode">
        <option value="seeded" ${state.rng.mode === "seeded" ? "selected" : ""}>Deterministic (Seeded)</option>
        <option value="random" ${state.rng.mode === "random" ? "selected" : ""}>Random (Non-replay)</option>
      </select>
    </div>
    <div class="control-group">
      <label for="mtgRngSeed">Audit seed</label>
      <input id="mtgRngSeed" type="text" value="${escapeHtml(state.rng.seed)}" />
    </div>
    <div class="button-row">
      <button id="mtgApplySeedBtn" class="btn">Apply Seed</button>
      <button id="mtgCopyAuditBtn" class="btn">Copy Audit</button>
    </div>
    <div class="qa-grid">
      <article class="economy-stat"><strong>${state.rng.drawCount.toLocaleString()}</strong><span>RNG Draws</span></article>
      <article class="economy-stat"><strong>${state.session.auditTrail.length.toLocaleString()}</strong><span>Audit Events</span></article>
    </div>
    <ul class="qa-slot-list">${trailRows || "<li><span>No audit entries yet.</span></li>"}</ul>
  `;

  dom.rngPanel.querySelector("#mtgRngMode")?.addEventListener("change", (event) => {
    state.rng.mode = event.target.value === "random" ? "random" : "seeded";
    reseedRng(state.rng.seed);
    renderRngPanel();
  });
  dom.rngPanel.querySelector("#mtgApplySeedBtn")?.addEventListener("click", () => {
    const nextSeed = dom.rngPanel.querySelector("#mtgRngSeed")?.value || createDefaultSeed();
    reseedRng(nextSeed);
    renderRngPanel();
  });
  dom.rngPanel.querySelector("#mtgCopyAuditBtn")?.addEventListener("click", async () => {
    const payload = {
      seed: state.rng.seed,
      mode: state.rng.mode,
      draws: state.rng.drawCount,
      recentAudit: state.session.auditTrail.slice(0, 25),
    };
    try {
      await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
      setStatus("Copied RNG audit payload.");
    } catch {
      setStatus("Clipboard blocked for RNG audit copy.", "error");
    }
  });
}

function renderLabPanel() {
  if (!dom.labPanel) return;
  const setDef = getCurrentSetDef();
  const setProductKey = getSetProductKey(setDef.key, state.productMode);
  const last = state.lab.lastResultBySetProduct[setProductKey] || null;
  const lockCheck = getMtgLockfileCheck(setProductKey, last);
  dom.labPanel.innerHTML = `
    <div class="economy-head">
      <strong>Simulation Lab</strong>
      <span>Run 10k/100k/1M Monte Carlo to benchmark EV and hit rates.</span>
    </div>
    <div class="control-group">
      <label for="mtgLabIterations">Simulation size</label>
      <select id="mtgLabIterations">
        <option value="10000">10,000 packs</option>
        <option value="100000">100,000 packs</option>
        <option value="1000000">1,000,000 packs</option>
      </select>
    </div>
    <div class="button-row">
      <button id="mtgRunLabBtn" class="btn" ${state.lab.running ? "disabled" : ""}>${state.lab.running ? "Running..." : "Run Lab"}</button>
    </div>
    <div class="qa-test-summary">
      <strong>${last ? `Last: ${last.n.toLocaleString()} packs` : "No simulation yet"}</strong>
      <p>${last ? `Mythic ${formatPercent(last.metrics.mythicAny.rate)} | Foil Rare+ ${formatPercent(last.metrics.foilRarePlusAny.rate)}` : "Run a lab to compute confidence bands."}</p>
      ${
        lockCheck
          ? `<p>QA Lockfile: <strong class="${lockCheck.pass ? "qa-pass" : "qa-fail"}">${lockCheck.pass ? "PASS" : "CHECK"}</strong> ${escapeHtml(lockCheck.summary)}</p>`
          : "<p>QA Lockfile: no entry for this set/product.</p>"
      }
    </div>
  `;
  const select = dom.labPanel.querySelector("#mtgLabIterations");
  if (select && state.lab.pendingIterations) {
    select.value = String(state.lab.pendingIterations);
  }
  select?.addEventListener("change", () => {
    state.lab.pendingIterations = Number(select.value);
  });
  dom.labPanel.querySelector("#mtgRunLabBtn")?.addEventListener("click", async () => {
    if (state.lab.running) return;
    state.lab.running = true;
    state.lab.pendingIterations = Number(select?.value || 10000);
    renderLabPanel();
    await runCollationTest(getCurrentSetDef().key, state.productMode);
    state.lab.running = false;
    renderLabPanel();
  });
}

function renderFidelityRegistryPanel() {
  if (!dom.fidelityRegistryPanel) return;
  const rows = getSortedSets()
    .map((setDef) => {
      const profile = getCollationProfile(setDef);
      const lockKey = getSetProductKey(setDef.key, "play");
      const lock = state.qaLockfile?.sets?.[lockKey] ? "lockfile" : "no lockfile";
      return `<li><span>${escapeHtml(setDef.displayName)} <em>${lock}</em></span><strong>${escapeHtml(profile.profileFidelityLabel)}</strong></li>`;
    })
    .join("");
  const sourceLinks = (MTG_FIDELITY_SOURCES.default || [])
    .map((source) => `<a href="${source.url}" target="_blank" rel="noreferrer">${escapeHtml(source.label)}</a>`)
    .join(" | ");
  dom.fidelityRegistryPanel.innerHTML = `
    <div class="economy-head">
      <strong>Fidelity Registry</strong>
      <span>Per-set trust labels with source transparency.</span>
    </div>
    <ul class="qa-slot-list">${rows}</ul>
    <div class="pack-price-source"><span>Sources: ${sourceLinks}</span></div>
  `;
}

async function loadMtgQaLockfile() {
  try {
    const response = await fetch("./assets/qa/mtg-lockfile.json");
    if (!response.ok) return;
    const parsed = await response.json();
    if (parsed && typeof parsed === "object") {
      state.qaLockfile = parsed;
    }
  } catch {
    // Ignore missing lockfile.
  }
}

function getMtgLockfileCheck(setProductKey, result) {
  if (!result || !state.qaLockfile?.sets?.[setProductKey]) return null;
  const lock = state.qaLockfile.sets[setProductKey];
  const checks = [
    checkMtgRange(result.metrics?.mythicAny?.rate, lock.mythic_any_rate),
    checkMtgRange(result.metrics?.foilRarePlusAny?.rate, lock.foil_rare_plus_rate),
    checkMtgRange(result.metrics?.showcaseRarePlusAny?.rate, lock.showcase_rare_plus_rate),
  ];
  const pass = checks.every(Boolean);
  const parts = [];
  if (!checks[0]) parts.push("Mythic");
  if (!checks[1]) parts.push("Foil Rare+");
  if (!checks[2]) parts.push("Showcase Rare+");
  return {
    pass,
    summary: pass ? "All ranges satisfied." : `${parts.join(", ")} out of band.`,
  };
}

function checkMtgRange(value, range) {
  if (!range || typeof range !== "object") return true;
  const min = Number(range.min);
  const max = Number(range.max);
  if (!Number.isFinite(min) || !Number.isFinite(max)) return true;
  return Number(value) >= min && Number(value) <= max;
}

function renderMtgProfileDataPanel() {
  if (!dom.profileDataPanel) return;
  dom.profileDataPanel.innerHTML = `
    <div class="economy-head">
      <strong>Profile Data</strong>
      <span>Export/import MTG binder, chase, RNG, and session state.</span>
    </div>
    <div class="button-row">
      <button id="mtgExportProfileBtn" class="btn">Export JSON</button>
      <button id="mtgImportProfileBtn" class="btn">Import JSON</button>
    </div>
    <input id="mtgImportProfileInput" type="file" accept="application/json" hidden />
  `;
  dom.profileDataPanel.querySelector("#mtgExportProfileBtn")?.addEventListener("click", exportMtgProfileData);
  dom.profileDataPanel.querySelector("#mtgImportProfileBtn")?.addEventListener("click", () => {
    dom.profileDataPanel.querySelector("#mtgImportProfileInput")?.click();
  });
  dom.profileDataPanel.querySelector("#mtgImportProfileInput")?.addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    importMtgProfileData(text);
    event.target.value = "";
  });
}

function exportMtgProfileData() {
  const payload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    mtg: {
      binder: state.binder,
      chaseTargetsBySet: state.chaseTargetsBySet,
      session: state.session,
      sealedProductKey: state.sealedProductKey,
      productMode: state.productMode,
      priceSourceMode: state.priceSourceMode,
      marketValueMode: state.marketValueMode,
      openingUxMode: state.openingUxMode,
      compactBinder: state.compactBinder,
      ultraCompactBinder: state.ultraCompactBinder,
      rng: {
        mode: state.rng.mode,
        seed: state.rng.seed,
      },
    },
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `mtg-pack-sim-profile-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function importMtgProfileData(rawText) {
  try {
    const parsed = JSON.parse(rawText);
    const payload = parsed?.mtg;
    if (!payload || typeof payload !== "object") throw new Error("Invalid MTG payload.");
    if (payload.binder && typeof payload.binder === "object") {
      state.binder = payload.binder;
      persistBinder();
    }
    if (payload.chaseTargetsBySet && typeof payload.chaseTargetsBySet === "object") {
      state.chaseTargetsBySet = payload.chaseTargetsBySet;
      persistChaseTargets();
    }
    if (payload.session && typeof payload.session === "object") {
      state.session = { ...state.session, ...payload.session };
    }
    if (payload.sealedProductKey && MTG_SEALED_PRODUCTS[payload.sealedProductKey]) {
      state.sealedProductKey = payload.sealedProductKey;
      syncProductModeFromSealedSelection();
      saveProductMode(state.sealedProductKey);
    }
    if (payload.priceSourceMode === "scryfall" || payload.priceSourceMode === "tcgplayerSealed") {
      state.priceSourceMode = payload.priceSourceMode;
      savePriceSourceMode(state.priceSourceMode);
    }
    if (payload.marketValueMode === "blended" || payload.marketValueMode === "conservative" || payload.marketValueMode === "premium") {
      state.marketValueMode = payload.marketValueMode;
      saveMtgMarketValueMode(state.marketValueMode);
    }
    if (payload.openingUxMode === "quick" || payload.openingUxMode === "standard" || payload.openingUxMode === "hype") {
      state.openingUxMode = payload.openingUxMode;
      saveMtgOpeningUxMode(state.openingUxMode);
    }
    if (typeof payload.compactBinder === "boolean") {
      state.compactBinder = payload.compactBinder;
      saveMtgCompactBinderMode(state.compactBinder);
    }
    if (typeof payload.ultraCompactBinder === "boolean") {
      state.ultraCompactBinder = payload.ultraCompactBinder;
      saveMtgUltraCompactBinderMode(state.ultraCompactBinder);
      if (state.ultraCompactBinder && !state.compactBinder) {
        state.compactBinder = true;
        saveMtgCompactBinderMode(state.compactBinder);
      }
    }
    if (payload.rng && typeof payload.rng === "object") {
      state.rng.mode = payload.rng.mode === "random" ? "random" : "seeded";
      reseedRng(payload.rng.seed || state.rng.seed);
    }

    renderSetSelect();
    renderHeader();
    renderSessionStats();
    renderEconomyPanel();
    renderOddsQaPanel();
    renderRngPanel();
    renderLabPanel();
    renderFidelityRegistryPanel();
    renderMtgProfileDataPanel();
    renderChasePanel();
    renderBinder();
    renderCards();
    setStatus("Imported MTG profile data.", "ready");
  } catch (error) {
    setStatus(`Import failed: ${error.message}`, "error");
  }
}
function applySetTheme(setDef) {
  const releaseYear = Number((setDef.releaseDate || "").slice(0, 4));
  const era = Number.isFinite(releaseYear) && releaseYear >= 2025 ? "future" : releaseYear >= 2023 ? "modern" : "classic";
  document.body.classList.remove("mtg-era-future", "mtg-era-modern", "mtg-era-classic");
  document.body.classList.add(`mtg-era-${era}`);
}

function getMtgOpeningUxProfile() {
  const mode = state.openingUxMode || "standard";
  if (mode === "quick") {
    return { mode, animMs: 320, gain: 0.06 };
  }
  if (mode === "hype") {
    return { mode, animMs: 980, gain: 0.11 };
  }
  return { mode: "standard", animMs: 640, gain: 0.08 };
}

function playOpenFx(setDef, cards) {
  const top = cards.reduce((best, card) => (card.value > (best?.value || 0) ? card : best), null);
  if (!top) return;
  const ux = getMtgOpeningUxProfile();
  if (dom.packArt) {
    dom.packArt.classList.remove("opening");
    void dom.packArt.offsetWidth;
    dom.packArt.classList.add("opening");
    window.setTimeout(() => dom.packArt?.classList.remove("opening"), ux.animMs);
  }
  if (dom.playPanel) {
    dom.playPanel.classList.remove("screen-shake");
    if (ux.mode === "hype" && (top.rarity === "mythic" || top.value >= 30)) {
      dom.playPanel.classList.add("screen-shake");
      window.setTimeout(() => dom.playPanel?.classList.remove("screen-shake"), Math.round(ux.animMs * 0.8));
    }
  }
  try {
    const setToneOffset = Math.abs(hashString32(setDef.key || "set")) % 120;
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = top.rarity === "mythic" ? "triangle" : "sine";
    osc.frequency.value = (top.rarity === "mythic" ? 660 : 440) + setToneOffset;
    gain.gain.value = 0.0001;
    osc.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;
    gain.gain.exponentialRampToValueAtTime(ux.gain, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);
    osc.start(now);
    osc.stop(now + 0.26);
  } catch {
    // Ignore audio issues.
  }
}

function cardStat(label, value) {
  return `<div class="session-stat-card"><strong>${escapeHtml(value)}</strong><span>${escapeHtml(label)}</span></div>`;
}

function renderCards() {
  const cards = getDisplayCards();
  dom.cardsGrid.innerHTML = "";
  if (!cards.length) {
    dom.openedPackSummary.innerHTML = "<span>No pack opened yet.</span>";
    return;
  }

  for (const [index, card] of cards.entries()) {
    const revealAll = state.revealMode === "all";
    const isRevealed = revealAll || state.revealedIds.has(card.instanceId);
    const fragment = dom.cardTemplate.content.cloneNode(true);
    const article = fragment.querySelector(".card-slot");
    const image = fragment.querySelector(".card-image");
    const name = fragment.querySelector(".card-name");
    const slot = fragment.querySelector(".card-slot-label");
    const rarity = fragment.querySelector(".card-rarity");
    const odds = fragment.querySelector(".card-odds");
    const value = fragment.querySelector(".card-value");

    article.style.animationDelay = `${index * 30}ms`;
    image.src = card.image || "";

    if (isRevealed) {
      article.classList.add("revealed");
      if (card.rarity === "mythic") {
        article.classList.add("mtg-hit-mythic");
      } else if (card.rarity === "rare") {
        article.classList.add("mtg-hit-rare");
      }
      name.textContent = card.name;
      slot.textContent = card.packIndex > 1 ? `Pack ${card.packIndex} - ${card.slotLabel}` : card.slotLabel;
      rarity.textContent = card.isFoil ? `${card.rarity} (foil)` : card.rarity;
      odds.textContent = `Weighted per-card pull odds enabled | ${card.valuationBasis || "market blend"}`;
      value.textContent = formatUsd(card.value || 0);
      if (card.valuationBasis) {
        value.title = `Pricing basis: ${card.valuationBasis}`;
      }
    } else {
      article.classList.add("can-reveal");
      article.addEventListener("click", () => {
        if (state.revealMode !== "step") return;
        state.revealedIds.add(card.instanceId);
        renderCards();
      });
      name.textContent = "Hidden Card";
      slot.textContent = "Click to reveal";
      rarity.textContent = "???";
      odds.textContent = "";
      value.textContent = "";
    }
    dom.cardsGrid.appendChild(fragment);
  }

  const revealed = cards.filter((card) => state.revealMode === "all" || state.revealedIds.has(card.instanceId));
  const revealedValue = revealed.reduce((sum, card) => sum + (card.value || 0), 0);
  const top = revealed.reduce((best, card) => (card.value > (best?.value || 0) ? card : best), null);
  dom.openedPackSummary.innerHTML = `
    <span>Revealed ${revealed.length}/${cards.length} cards</span>
    <span>Total Revealed Value: <strong>${formatUsd(revealedValue)}</strong></span>
    <span>${top ? `Top Pull: ${escapeHtml(top.name)} (${formatUsd(top.value)})` : "Top Pull: ???"}</span>
  `;
}

function getDisplayCards() {
  if (!state.currentPack) return [];
  const cards = [...state.currentPack];
  if (state.displayOrder === "value") {
    cards.sort((a, b) => b.value - a.value || a.standardIndex - b.standardIndex);
  } else {
    cards.sort((a, b) => a.standardIndex - b.standardIndex);
  }
  return cards;
}

function ingestCardsIntoBinder(cards, setKey) {
  for (const card of cards) {
    const existing = state.binder.cards[card.id];
    if (existing) {
      existing.count += 1;
      existing.bestValue = Math.max(existing.bestValue, card.value || 0);
      existing.lastPulledAt = Date.now();
      continue;
    }
    state.binder.cards[card.id] = {
      id: card.id,
      name: card.name,
      image: card.image,
      rarity: card.rarity,
      setKey,
      count: 1,
      bestValue: card.value || 0,
      lastPulledAt: Date.now(),
    };
  }
}

function renderBinder() {
  if (!dom.binderGrid) return;
  const binderSection = document.querySelector(".binder-section");
  binderSection?.classList.toggle("compact", Boolean(state.compactBinder));
  binderSection?.classList.toggle("ultra-compact", Boolean(state.ultraCompactBinder));
  const entries = Object.values(state.binder.cards).sort((a, b) => (b.lastPulledAt || 0) - (a.lastPulledAt || 0));
  if (!entries.length) {
    dom.binderGrid.classList.add("empty");
    dom.binderGrid.innerHTML = "No cards in your MTG binder yet.";
    return;
  }

  dom.binderGrid.classList.remove("empty");
  dom.binderGrid.innerHTML = entries
    .map((card) => `
      <article class="binder-entry">
        <img src="${card.image || ""}" alt="${escapeHtml(card.name)}" />
        <div class="binder-entry-copy">
          <h3>${escapeHtml(card.name)}</h3>
          <p>${escapeHtml(card.rarity || "Card")}</p>
          <p>x${card.count} - Best ${formatUsd(card.bestValue || 0)}</p>
        </div>
      </article>
    `)
    .join("");
}

function getChaseTargets(setKey) {
  return state.chaseTargetsBySet[setKey] || [];
}

function setChaseTargets(setKey, targets, setData = state.setData[setKey], setDef = MTG_SETS.find((set) => set.key === setKey)) {
  const filtered = (targets || [])
    .filter(Boolean)
    .filter((cardId) => isCardPullableForCurrentProduct(cardId, setData, setDef))
    .slice(0, 2);
  state.chaseTargetsBySet[setKey] = filtered;
  persistChaseTargets();
}

function sanitizeCurrentSetChaseTargets() {
  const setDef = getCurrentSetDef();
  const setData = state.setData[setDef.key];
  if (!setData) return;
  const current = getChaseTargets(setDef.key);
  const filtered = current.filter((cardId) => isCardPullableForCurrentProduct(cardId, setData, setDef)).slice(0, 2);
  if (filtered.length !== current.length || filtered.some((id, idx) => id !== current[idx])) {
    setChaseTargets(setDef.key, filtered, setData, setDef);
  }
}

function loadChaseTargets() {
  try {
    const raw = window.localStorage.getItem(MTG_CHASE_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function persistChaseTargets() {
  try {
    window.localStorage.setItem(MTG_CHASE_STORAGE_KEY, JSON.stringify(state.chaseTargetsBySet));
  } catch {
    // Ignore storage issues.
  }
}

function loadChaseFilterMode() {
  try {
    const value = window.localStorage.getItem(MTG_CHASE_FILTER_STORAGE_KEY);
    if (value === "all" || value === "pullable") return value;
  } catch {
    // Ignore storage issues.
  }
  return "pullable";
}

function persistChaseFilterMode() {
  try {
    window.localStorage.setItem(MTG_CHASE_FILTER_STORAGE_KEY, state.chaseFilterMode);
  } catch {
    // Ignore storage issues.
  }
}

function loadBinder() {
  try {
    const raw = window.localStorage.getItem(MTG_BINDER_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (!parsed || typeof parsed !== "object" || !parsed.cards || typeof parsed.cards !== "object") {
      return { cards: {} };
    }
    return parsed;
  } catch {
    return { cards: {} };
  }
}

function persistBinder() {
  try {
    window.localStorage.setItem(MTG_BINDER_STORAGE_KEY, JSON.stringify(state.binder));
  } catch {
    // Ignore storage issues.
  }
}

function getPackPrice(setDef) {
  const snapshotEntry = state.marketSnapshot.packPrices?.[setDef.key] || null;
  const snapshotMode = snapshotEntry?.[state.priceSourceMode] || null;
  const snapshotPackPrice = Number(state.productMode === "collector" ? snapshotMode?.collector : snapshotMode?.play);
  if (Number.isFinite(snapshotPackPrice) && snapshotPackPrice > 0) {
    return Number(snapshotPackPrice.toFixed(2));
  }
  const preset = MTG_PACK_PRICE_PRESETS[setDef.key] || null;
  const base =
    state.productMode === "collector"
      ? Number(preset?.collector || (setDef.fallbackPackPrice || MTG_DEFAULT_PACK_PRICE) * 3.2)
      : Number(preset?.play || setDef.fallbackPackPrice || MTG_DEFAULT_PACK_PRICE);
  const sourceMultiplier = state.priceSourceMode === "tcgplayerSealed" ? 1.04 : 1;
  return Number((base * sourceMultiplier).toFixed(2));
}

function getSealedProductCost(setDef) {
  const sealed = getActiveSealedProduct();
  const perPack = getPackPrice(setDef);
  return Number((perPack * sealed.packCount).toFixed(2));
}

function getPriceSource(setDef) {
  if (state.marketSnapshot.source?.label && state.marketSnapshot.source?.url) {
    return state.marketSnapshot.source;
  }
  return setDef.priceSources?.[state.priceSourceMode] || setDef.priceSources?.scryfall || null;
}

function getMtgMarketValueModeLabel() {
  if (state.marketValueMode === "conservative") return "Conservative";
  if (state.marketValueMode === "premium") return "Premium";
  return "Blended";
}

function loadPriceSourceMode() {
  try {
    const value = window.localStorage.getItem(MTG_PRICE_SOURCE_STORAGE_KEY);
    if (value === "tcgplayerSealed" || value === "scryfall") return value;
  } catch {
    // Ignore storage failures.
  }
  return "scryfall";
}

function savePriceSourceMode(value) {
  try {
    window.localStorage.setItem(MTG_PRICE_SOURCE_STORAGE_KEY, value);
  } catch {
    // Ignore storage failures.
  }
}

function loadMtgMarketValueMode() {
  try {
    const value = window.localStorage.getItem(MTG_MARKET_VALUE_MODE_STORAGE_KEY);
    if (value === "blended" || value === "conservative" || value === "premium") return value;
  } catch {
    // Ignore storage failures.
  }
  return "blended";
}

function saveMtgMarketValueMode(value) {
  try {
    window.localStorage.setItem(MTG_MARKET_VALUE_MODE_STORAGE_KEY, value);
  } catch {
    // Ignore storage failures.
  }
}

function loadMtgOpeningUxMode() {
  try {
    const value = window.localStorage.getItem(MTG_OPENING_UX_MODE_STORAGE_KEY);
    if (value === "quick" || value === "standard" || value === "hype") return value;
  } catch {
    // Ignore storage failures.
  }
  return "standard";
}

function saveMtgOpeningUxMode(value) {
  try {
    window.localStorage.setItem(MTG_OPENING_UX_MODE_STORAGE_KEY, value);
  } catch {
    // Ignore storage failures.
  }
}

function loadMtgCompactBinderMode() {
  try {
    return window.localStorage.getItem(MTG_COMPACT_BINDER_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function saveMtgCompactBinderMode(value) {
  try {
    window.localStorage.setItem(MTG_COMPACT_BINDER_STORAGE_KEY, value ? "1" : "0");
  } catch {
    // Ignore storage failures.
  }
}

function loadMtgUltraCompactBinderMode() {
  try {
    return window.localStorage.getItem(MTG_ULTRA_COMPACT_BINDER_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function saveMtgUltraCompactBinderMode(value) {
  try {
    window.localStorage.setItem(MTG_ULTRA_COMPACT_BINDER_STORAGE_KEY, value ? "1" : "0");
  } catch {
    // Ignore storage failures.
  }
}

async function loadMtgMarketSnapshot() {
  try {
    const response = await fetch(MTG_MARKET_SNAPSHOT_URL);
    if (!response.ok) return;
    const parsed = await response.json();
    if (!parsed || typeof parsed !== "object") return;
    state.marketSnapshot = {
      loaded: true,
      source: parsed.source || null,
      packPrices: parsed.packPrices && typeof parsed.packPrices === "object" ? parsed.packPrices : {},
      cardOverrides: parsed.cardOverrides && typeof parsed.cardOverrides === "object" ? parsed.cardOverrides : {},
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : new Date().toISOString().slice(0, 10),
    };
  } catch {
    // Snapshot is optional.
  }
}

function formatUsd(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(value || 0));
}

function formatPercent(value) {
  return `${(Number(value || 0) * 100).toFixed(1)}%`;
}

function formatMaybePercent(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "n/a";
  return formatPercent(Number(value));
}

function formatPercentWithCi(rate, sampleSize) {
  const ci = confidenceInterval95(Number(rate || 0), sampleSize);
  return `${formatPercent(rate)} (${formatPercent(ci.low)} - ${formatPercent(ci.high)})`;
}

function formatDateLabel(isoDate) {
  const parsed = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return isoDate;
  return parsed.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

