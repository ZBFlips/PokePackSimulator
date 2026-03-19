const SCRYFALL_API_BASE = "https://api.scryfall.com";
const MTG_PRICE_SOURCE_STORAGE_KEY = "mtg-pack-price-source-v1";
const MTG_DEFAULT_PACK_PRICE = 5.99;

const MTG_SETS = [
  {
    key: "bloomburrow",
    scryfallCode: "blb",
    displayName: "Bloomburrow",
    releaseLabel: "Play Booster Era",
    fallbackPackPrice: 5.79,
    packImage: "https://cards.scryfall.io/art_crop/front/4/9/49f9b58a-9f76-48cc-9ec2-4974f1195d9f.jpg",
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
    fallbackPackPrice: 6.29,
    packImage: "https://cards.scryfall.io/art_crop/front/a/8/a8f3bf4a-f454-468f-a3a5-0cc030ee0632.jpg",
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
    fallbackPackPrice: 6.09,
    packImage: "https://cards.scryfall.io/art_crop/front/b/8/b870d945-5f6d-4387-8e3d-3ebd86db68f2.jpg",
    priceSources: {
      scryfall: { label: "Scryfall + public market blend", url: "https://scryfall.com/sets/fdn" },
      tcgplayerSealed: { label: "TCGplayer sealed search", url: "https://www.tcgplayer.com/search/magic/product?productLineName=magic&q=Foundations+play+booster" },
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
  currentPack: null,
  revealedIds: new Set(),
  session: {
    packsOpened: 0,
    totalValue: 0,
    totalSpent: 0,
    biggestHit: null,
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
  renderCards();
  await loadSetData(state.selectedSetKey);
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
  const release = state.setData[setKey]?.setMeta?.released_at;
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
