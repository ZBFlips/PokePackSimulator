const SCRYFALL_API_BASE = "https://api.scryfall.com";
const MTG_PRICE_SOURCE_STORAGE_KEY = "mtg-pack-price-source-v1";
const MTG_DEFAULT_PACK_PRICE = 5.99;

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
  },
};

const dom = {
  loadStatus: document.getElementById("mtgLoadStatus"),
  setSelect: document.getElementById("mtgSetSelect"),
  setSort: document.getElementById("mtgSetSort"),
  revealMode: document.getElementById("mtgRevealMode"),
  displayOrder: document.getElementById("mtgDisplayOrder"),
  priceSourceMode: document.getElementById("mtgPriceSourceMode"),
  openPackBtn: document.getElementById("mtgOpenPackBtn"),
  packImage: document.getElementById("mtgPackImage"),
  packLogo: document.getElementById("mtgPackLogo"),
  selectedPackName: document.getElementById("mtgSelectedPackName"),
  selectedPackSub: document.getElementById("mtgSelectedPackSub"),
  packStats: document.getElementById("mtgPackStats"),
  packPriceSource: document.getElementById("mtgPackPriceSource"),
  openedPackSummary: document.getElementById("mtgOpenedPackSummary"),
  cardsGrid: document.getElementById("mtgCardsGrid"),
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
    renderCards();
    loadSetData(next.key);
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
  });

  dom.openPackBtn?.addEventListener("click", openPack);
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

function renderHeader() {
  const setDef = getCurrentSetDef();
  const setData = state.setData[setDef.key];
  const price = getPackPrice(setDef);
  const source = getPriceSource(setDef);
  const release = setData?.setMeta?.released_at || "Unknown";

  dom.selectedPackName.textContent = setDef.displayName;
  dom.selectedPackSub.textContent = setDef.releaseLabel;
  dom.packImage.src = setDef.packImage;
  dom.packLogo.src = setData?.setMeta?.icon_svg_uri || "";

  dom.packStats.innerHTML = [
    `<span class="pack-stat">${setData?.cards?.length || 0} cards loaded</span>`,
    `<span class="pack-stat">Pack price ${formatUsd(price)}</span>`,
    `<span class="pack-stat">Release ${escapeHtml(release)}</span>`,
  ].join("");

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
    land: cards.filter((card) => /basic land/i.test(card.typeLine)),
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
  renderCards();
}

function simulatePack(setData) {
  const cards = [];
  const used = new Set();
  const pushCard = (slotLabel, rarity) => {
    const picked = pickFromRarity(setData, rarity, used);
    cards.push({
      ...picked,
      slotLabel,
      value: picked.usd > 0 ? picked.usd : picked.usdFoil,
      instanceId: `${picked.id}-${Math.random().toString(16).slice(2)}`,
      standardIndex: cards.length + 1,
    });
  };

  for (let i = 0; i < 6; i += 1) pushCard(`Common ${i + 1}`, "common");
  for (let i = 0; i < 3; i += 1) pushCard(`Uncommon ${i + 1}`, "uncommon");
  pushCard("Rare/Mythic", Math.random() < 0.125 ? "mythic" : "rare");

  const wildcardRoll = Math.random();
  if (wildcardRoll < 0.7) pushCard("Wildcard", "common");
  else if (wildcardRoll < 0.87) pushCard("Wildcard", "uncommon");
  else if (wildcardRoll < 0.97) pushCard("Wildcard", "rare");
  else pushCard("Wildcard", "mythic");

  pushCard("Land", setData.pools.land.length ? "land" : "common");

  const foilRoll = Math.random();
  if (foilRoll < 0.6) pushCard("Foil Slot", "common");
  else if (foilRoll < 0.85) pushCard("Foil Slot", "uncommon");
  else if (foilRoll < 0.97) pushCard("Foil Slot", "rare");
  else pushCard("Foil Slot", "mythic");

  return cards;
}

function pickFromRarity(setData, rarity, used) {
  const pool = setData.pools[rarity] || [];
  const candidates = pool.filter((card) => !used.has(card.id));
  const drawPool = candidates.length ? candidates : pool;
  if (!drawPool.length) {
    return { id: "fallback", name: "Unknown Card", rarity: "common", image: "", usd: 0, usdFoil: 0 };
  }

  const weights = drawPool.map((card) => {
    const base = Math.max(card.usd, card.usdFoil, 0.05);
    const exp = rarity === "mythic" ? 0.34 : rarity === "rare" ? 0.28 : 0.14;
    return Math.pow(base, exp);
  });
  const total = weights.reduce((sum, value) => sum + value, 0);
  let roll = Math.random() * total;
  for (let i = 0; i < drawPool.length; i += 1) {
    roll -= weights[i];
    if (roll <= 0) {
      used.add(drawPool[i].id);
      return drawPool[i];
    }
  }
  used.add(drawPool[drawPool.length - 1].id);
  return drawPool[drawPool.length - 1];
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
  ].join("");
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
      rarity.textContent = card.rarity;
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

function getPackPrice(setDef) {
  if (state.priceSourceMode === "tcgplayerSealed") {
    return setDef.fallbackPackPrice;
  }
  return setDef.fallbackPackPrice;
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
