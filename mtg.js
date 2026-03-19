const SCRYFALL_API_BASE = "https://api.scryfall.com";
const MTG_PRICE_SOURCE_STORAGE_KEY = "mtg-pack-price-source-v1";
const MTG_DEFAULT_PACK_PRICE = 5.99;
const MTG_PRODUCT_STORAGE_KEY = "mtg-product-mode-v1";
const MTG_BINDER_STORAGE_KEY = "mtg-pack-sim-binder-v1";
const MTG_CHASE_STORAGE_KEY = "mtg-pack-sim-chase-v1";

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
    label: "Collector Booster (Scaffold)",
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
  });
}

const MTG_SET_COLLATION_OVERRIDES = {
  blb: {
    notes: "Official Collecting Bloomburrow breakdown (Play/Collector composition).",
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
  }),
  tla: buildPlayOverride("Official Collecting Avatar: The Last Airbender breakdown (Play/Collector composition).", {
    commonCount: 6,
    wildcardWeights: { common: 61, uncommon: 23, rare: 12, mythic: 4 },
    landWeights: { basicLand: 73, land: 27 },
    includeSpecialGuestSlot: false,
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
  productMode: loadProductMode(),
  priceSourceMode: loadPriceSourceMode(),
  setData: {},
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
  },
  chaseTargetsBySet: loadChaseTargets(),
  binder: loadBinder(),
};

const dom = {
  loadStatus: document.getElementById("mtgLoadStatus"),
  setSelect: document.getElementById("mtgSetSelect"),
  productSelect: document.getElementById("mtgProductSelect"),
  setSort: document.getElementById("mtgSetSort"),
  revealMode: document.getElementById("mtgRevealMode"),
  displayOrder: document.getElementById("mtgDisplayOrder"),
  priceSourceMode: document.getElementById("mtgPriceSourceMode"),
  openPackBtn: document.getElementById("mtgOpenPackBtn"),
  resetSessionBtn: document.getElementById("mtgResetSessionBtn"),
  resetBinderBtn: document.getElementById("mtgResetBinderBtn"),
  chasePanel: document.getElementById("mtgChasePanel"),
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
  cardTemplate: document.getElementById("mtgCardTemplate"),
};

init().catch((error) => {
  console.error(error);
  setStatus("Failed to initialize MTG data.", "error");
});

async function init() {
  wireControls();
  renderSetSelect();
  renderHeader();
  renderSessionStats();
  renderEconomyPanel();
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
  });

  dom.setSelect?.addEventListener("change", () => {
    const next = MTG_SETS.find((set) => set.key === dom.setSelect.value);
    if (!next) return;
    state.selectedSetKey = next.key;
    state.currentPack = null;
    state.revealedIds = new Set();
    renderSetSelect();
    renderHeader();
    renderChasePanel();
    renderCards();
    loadSetData(next.key);
  });

  dom.productSelect?.addEventListener("change", () => {
    if (!MTG_PRODUCTS[dom.productSelect.value]) return;
    state.productMode = dom.productSelect.value;
    saveProductMode(state.productMode);
    state.currentPack = null;
    state.revealedIds = new Set();
    renderHeader();
    renderSetSelect();
    renderSessionStats();
    renderEconomyPanel();
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
    renderChasePanel();
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
    };
    state.currentPack = null;
    state.revealedIds = new Set();
    renderSessionStats();
    renderEconomyPanel();
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
    dom.productSelect.value = state.productMode;
  }
  dom.priceSourceMode.value = state.priceSourceMode;
  dom.setSelect.innerHTML = "";
  for (const setDef of getSortedSets()) {
    const option = document.createElement("option");
    option.value = setDef.key;
    const loaded = Boolean(state.setData[setDef.key]);
    const loading = state.loadingSetKeys.has(setDef.key);
    option.textContent = `${setDef.displayName} (${loading ? "loading..." : loaded ? "live" : "pending"})`;
    dom.setSelect.appendChild(option);
  }
  dom.setSelect.value = state.selectedSetKey;
}

function loadProductMode() {
  try {
    const value = window.localStorage.getItem(MTG_PRODUCT_STORAGE_KEY);
    if (value === "play" || value === "collector") return value;
  } catch {
    // Ignore storage failures.
  }
  return "play";
}

function saveProductMode(value) {
  try {
    window.localStorage.setItem(MTG_PRODUCT_STORAGE_KEY, value);
  } catch {
    // Ignore storage failures.
  }
}

function renderHeader() {
  const setDef = getCurrentSetDef();
  const setData = state.setData[setDef.key];
  const price = getPackPrice(setDef);
  const source = getPriceSource(setDef);
  const release = setData?.setMeta?.released_at || "Unknown";
  const profile = getCollationProfile(setDef);
  const product = MTG_PRODUCTS[state.productMode] || MTG_PRODUCTS.play;

  dom.selectedPackName.textContent = setDef.displayName;
  dom.selectedPackSub.textContent = `${setDef.releaseLabel} - ${product.label}`;
  dom.packImage.src = setDef.packImage;
  dom.packLogo.src = setData?.setMeta?.icon_svg_uri || "";

  dom.packStats.innerHTML = [
    `<span class="pack-stat">${setData?.cards?.length || 0} cards loaded</span>`,
    `<span class="pack-stat">Pack price ${formatUsd(price)}</span>`,
    `<span class="pack-stat">Release ${escapeHtml(release)}</span>`,
    `<span class="pack-stat">${profile.slots.length} slots (${product.label})</span>`,
  ].join("");

  if (dom.collationMeta) {
    const sourceLabel = profile.profileSource || "Default";
    const note = profile.profileNote ? `<span class="pack-source-meta">${escapeHtml(profile.profileNote)}</span>` : "";
    dom.collationMeta.innerHTML = `<span>Collation profile: <strong>${escapeHtml(sourceLabel)}</strong></span>${note}`;
  }

  dom.packPriceSource.innerHTML = source
    ? `<span>Pack market source: <a href="${source.url}" target="_blank" rel="noreferrer">${escapeHtml(source.label)}</a></span>
       <span class="pack-source-meta">Last updated: ${formatDateLabel(new Date().toISOString().slice(0, 10))}</span>`
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
    const pools = buildPools(normalized);
    state.setData[setKey] = { setMeta, cards: normalized, pools };
    setStatus("Ready to open MTG packs.", "ready");
  } catch (error) {
    console.error(error);
    setStatus(`Failed loading ${setDef.displayName}.`, "error");
  } finally {
    state.loadingSetKeys.delete(setKey);
    renderSetSelect();
    renderHeader();
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
    setStatus("Ready to open MTG packs.", "ready");
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
  return {
    id: raw.id,
    name: raw.name || "Unknown",
    rarity: raw.rarity || "common",
    typeLine: raw.type_line || "",
    image: raw.image_uris?.normal || raw.card_faces?.[0]?.image_uris?.normal || "",
    usd: Number(raw.prices?.usd || 0),
    usdFoil: Number(raw.prices?.usd_foil || 0),
  };
}

function buildPools(cards) {
  const byRarity = {
    common: cards.filter((card) => card.rarity === "common"),
    uncommon: cards.filter((card) => card.rarity === "uncommon"),
    rare: cards.filter((card) => card.rarity === "rare"),
    mythic: cards.filter((card) => card.rarity === "mythic"),
    basicLand: cards.filter((card) => /basic land/i.test(card.typeLine)),
    land: cards.filter((card) => /land/i.test(card.typeLine)),
    specialGuest: cards.filter((card) => /special guest|bonus|breaking news|masterpiece|list/i.test(card.name) || /special guest|bonus|masterpiece/i.test(card.typeLine)),
    showcaseRare: cards.filter((card) => card.rarity === "rare" && (card.usd > 0 || card.usdFoil > 0)),
    showcaseMythic: cards.filter((card) => card.rarity === "mythic" && (card.usd > 0 || card.usdFoil > 0)),
  };
  return byRarity;
}

function openPack() {
  const setDef = getCurrentSetDef();
  const setData = state.setData[setDef.key];
  if (!setData) return;

  const pack = simulatePack(setData);
  state.currentPack = pack;
  state.revealedIds = state.revealMode === "all" ? new Set(pack.map((card) => card.instanceId)) : new Set();
  registerPack(pack, setDef);
  renderHeader();
  renderSessionStats();
  renderEconomyPanel();
  renderChasePanel();
  renderBinder();
  renderCards();
}

function simulatePack(setData) {
  const cards = [];
  const used = new Set();
  const setDef = getCurrentSetDef();
  const profile = getCollationProfile(setDef);
  const pushCard = (slotLabel, slotDefinition) => {
    const picked = pickFromSheet(setData, slotDefinition, used);
    if (!picked) return;
    cards.push({
      ...picked,
      slotLabel,
      value: picked.isFoil && picked.usdFoil > 0 ? picked.usdFoil : picked.usd > 0 ? picked.usd : picked.usdFoil,
      instanceId: `${picked.id}-${Math.random().toString(16).slice(2)}`,
      standardIndex: cards.length + 1,
    });
  };

  for (const slotDefinition of profile.slots) {
    if (slotDefinition.optional && Math.random() > (slotDefinition.chance || 0)) {
      continue;
    }
    pushCard(slotDefinition.label, slotDefinition);
  }

  return cards;
}

function pickFromSheet(setData, slotDefinition, used) {
  const sheetEntries = slotDefinition?.sheet || [];
  if (!sheetEntries.length) return null;
  const chosenSheet = weightedChoice(sheetEntries);
  if (!chosenSheet) return null;
  const pool = setData.pools[chosenSheet.pool] || [];
  const candidates = pool.filter((card) => !used.has(card.id));
  const drawPool = candidates.length ? candidates : pool;
  if (!drawPool.length) {
    return null;
  }
  // Important: card market price must never influence pull odds.
  // Slot-sheet rarity weighting is handled above; card selection inside a sheet is uniform.
  const picked = drawPool[Math.floor(Math.random() * drawPool.length)];
  used.add(picked.id);
  return {
    ...picked,
    isFoil: Boolean(chosenSheet.foil),
  };
}

function weightedChoice(entries) {
  const total = entries.reduce((sum, item) => sum + Number(item.weight || 0), 0);
  if (!total) return entries[0] || null;
  let roll = Math.random() * total;
  for (const entry of entries) {
    roll -= Number(entry.weight || 0);
    if (roll <= 0) return entry;
  }
  return entries[entries.length - 1] || null;
}

function getCollationProfile(setDef) {
  const productKey = state.productMode;
  const base = MTG_PRODUCTS[productKey] || MTG_PRODUCTS.play;
  const setOverride = MTG_SET_COLLATION_OVERRIDES[setDef.scryfallCode] || null;
  const override = setOverride?.[productKey];
  const profile = override || base;
  const note = setOverride?.notes || "";
  return {
    slots: profile.slots || [],
    profileSource: override ? `${setDef.displayName} ${base.label} Official` : `${base.label} Default`,
    profileNote: note,
  };
}

function registerPack(cards, setDef) {
  const packValue = cards.reduce((sum, card) => sum + (card.value || 0), 0);
  const packCost = getPackPrice(setDef);
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
  const targets = getChaseTargets(setDef.key);
  const candidates = getChaseCandidates(setData);

  const selectMarkup = [];
  for (let i = 0; i < 2; i += 1) {
    const selectedId = targets[i] || "";
    const options = [
      `<option value="">No chase selected</option>`,
      ...candidates.map((card) => `<option value="${card.id}"${card.id === selectedId ? " selected" : ""}>${escapeHtml(card.name)} (${formatUsd(card.usd || card.usdFoil || 0)})</option>`),
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
    .map((id) => setData?.cards?.find((card) => card.id === id))
    .filter(Boolean)
    .map((card) => {
      const key = `${setDef.key}:${card.id}`;
      const stats = state.session.chaseStats[key] || { hits: 0, lastHitPack: 0 };
      const ago = stats.lastHitPack > 0 ? Math.max(0, state.session.packsOpened - stats.lastHitPack) : state.session.packsOpened;
      return `<li><strong>${escapeHtml(card.name)}</strong><span>Hits: ${stats.hits}</span><em>Packs since hit: ${ago}</em></li>`;
    })
    .join("");

  const pityMythic = state.session.pity.mythicPlus;
  const pityValue = state.session.pity.valueHit;
  dom.chasePanel.innerHTML = `
    <div class="economy-head">
      <strong>Chase Tracker + Pity</strong>
      <span>Track targeted cards and dry streak counters.</span>
    </div>
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
      setChaseTargets(setDef.key, next.filter(Boolean));
      renderChasePanel();
    });
  });
}

function getChaseCandidates(setData) {
  if (!setData?.cards?.length) return [];
  return [...setData.cards]
    .filter((card) => Math.max(card.usd || 0, card.usdFoil || 0) > 0)
    .sort((a, b) => Math.max(b.usd || 0, b.usdFoil || 0) - Math.max(a.usd || 0, a.usdFoil || 0))
    .slice(0, 40);
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
    </div>
    <div class="economy-chart-wrap">
      <div class="economy-chart">${bars || '<span class="economy-empty">Open packs to build ROI trend.</span>'}</div>
    </div>
    <ul class="economy-set-list">${setRows || "<li><span>No set data yet.</span></li>"}</ul>
  `;
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
      name.textContent = card.name;
      slot.textContent = card.slotLabel;
      rarity.textContent = card.isFoil ? `${card.rarity} (foil)` : card.rarity;
      odds.textContent = "Weighted per-card pull odds enabled";
      value.textContent = formatUsd(card.value || 0);
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

function setChaseTargets(setKey, targets) {
  state.chaseTargetsBySet[setKey] = targets.slice(0, 2);
  persistChaseTargets();
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
  const base = Number(setDef.fallbackPackPrice || MTG_DEFAULT_PACK_PRICE);
  const productMultiplier = state.productMode === "collector" ? 3.2 : 1;
  const sourceMultiplier = state.priceSourceMode === "tcgplayerSealed" ? 1.04 : 1;
  return Number((base * productMultiplier * sourceMultiplier).toFixed(2));
}

function getPriceSource(setDef) {
  return setDef.priceSources?.[state.priceSourceMode] || setDef.priceSources?.scryfall || null;
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

function formatUsd(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(value || 0));
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
