import { test, expect } from "@playwright/test";

function buildSvgMarkup(label, fill = "#173454") {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="320" height="448" viewBox="0 0 320 448">
      <rect width="320" height="448" rx="24" fill="${fill}" />
      <text x="160" y="224" fill="#ffffff" font-size="28" text-anchor="middle" dominant-baseline="middle">${label}</text>
    </svg>
  `;
}

function buildSvgDataUrl(label, fill = "#173454") {
  return `data:image/svg+xml;utf8,${encodeURIComponent(buildSvgMarkup(label, fill))}`;
}

function buildSetMeta(code) {
  return {
    object: "set",
    id: `${code}-set`,
    code,
    name: `${code.toUpperCase()} Test Set`,
    released_at: "2026-03-19",
    icon_svg_uri: buildSvgDataUrl(`${code.toUpperCase()} Set`, "#214b66"),
  };
}

function buildCard(setCode, suffix, overrides = {}) {
  return {
    object: "card",
    id: `${setCode}-${suffix}`,
    oracle_id: `${setCode}-oracle-${suffix}`,
    name: overrides.name || `${setCode.toUpperCase()} ${suffix}`,
    collector_number: overrides.collector_number || suffix.replace(/[^\d]/g, "") || "1",
    rarity: overrides.rarity || "common",
    type_line: overrides.type_line || "Creature - Test",
    set: setCode,
    image_uris: {
      normal: buildSvgDataUrl(`${setCode.toUpperCase()} ${suffix}`, overrides.fill || "#2e5d7a"),
    },
    prices: overrides.prices || {
      usd: "1.25",
      usd_foil: "1.75",
      usd_etched: null,
    },
    booster: overrides.booster ?? true,
    digital: false,
    promo: false,
    finishes: overrides.finishes || ["nonfoil", "foil"],
    showcase: overrides.showcase || false,
    full_art: overrides.full_art || false,
    border_color: overrides.border_color || "black",
    variation: overrides.variation || false,
    frame_effects: overrides.frame_effects || [],
  };
}

function buildMtgCards(setCode) {
  return [
    buildCard(setCode, "c1", { rarity: "common" }),
    buildCard(setCode, "c2", { rarity: "common" }),
    buildCard(setCode, "c3", { rarity: "common" }),
    buildCard(setCode, "c4", { rarity: "common" }),
    buildCard(setCode, "c5", { rarity: "common" }),
    buildCard(setCode, "c6", { rarity: "common" }),
    buildCard(setCode, "c7", { rarity: "common" }),
    buildCard(setCode, "u1", { rarity: "uncommon", prices: { usd: "1.80", usd_foil: "2.40", usd_etched: null } }),
    buildCard(setCode, "u2", { rarity: "uncommon", prices: { usd: "2.10", usd_foil: "2.90", usd_etched: null } }),
    buildCard(setCode, "u3", { rarity: "uncommon", prices: { usd: "2.35", usd_foil: "3.10", usd_etched: null } }),
    buildCard(setCode, "u4", { rarity: "uncommon", prices: { usd: "2.55", usd_foil: "3.30", usd_etched: null } }),
    buildCard(setCode, "r1", { rarity: "rare", prices: { usd: "4.80", usd_foil: "6.25", usd_etched: null } }),
    buildCard(setCode, "r2", {
      rarity: "rare",
      showcase: true,
      full_art: true,
      border_color: "borderless",
      prices: { usd: "6.20", usd_foil: "7.90", usd_etched: null },
    }),
    buildCard(setCode, "m1", { rarity: "mythic", prices: { usd: "9.40", usd_foil: "12.60", usd_etched: "13.20" } }),
    buildCard(setCode, "m2", {
      rarity: "mythic",
      showcase: true,
      full_art: true,
      border_color: "borderless",
      prices: { usd: "11.50", usd_foil: "14.80", usd_etched: "15.90" },
    }),
    buildCard(setCode, "sg1", {
      name: `${setCode.toUpperCase()} Special Guest Relic`,
      rarity: "mythic",
      type_line: "Artifact",
      prices: { usd: "18.25", usd_foil: "20.10", usd_etched: null },
    }),
    buildCard(setCode, "l1", {
      name: `${setCode.toUpperCase()} Plains`,
      rarity: "common",
      type_line: "Basic Land - Plains",
      prices: { usd: "0.15", usd_foil: "0.45", usd_etched: null },
    }),
    buildCard(setCode, "l2", {
      name: `${setCode.toUpperCase()} Temple`,
      rarity: "rare",
      type_line: "Land",
      prices: { usd: "1.10", usd_foil: "1.95", usd_etched: null },
    }),
  ];
}

async function stubMtgApi(page) {
  await page.route("https://api.scryfall.com/sets/*", async (route) => {
    const url = new URL(route.request().url());
    const code = url.pathname.split("/").filter(Boolean).pop() || "tst";
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(buildSetMeta(code)),
    });
  });

  await page.route("https://api.scryfall.com/cards/search*", async (route) => {
    const url = new URL(route.request().url());
    const query = url.searchParams.get("q") || "";
    const match = query.match(/e:([a-z0-9]+)/i);
    const code = match?.[1] || "tst";
    const payload = {
      object: "list",
      has_more: false,
      data: buildMtgCards(code),
    };
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(payload),
    });
  });

  await page.route("https://svgs.scryfall.io/**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "image/svg+xml",
      body: buildSvgMarkup("Set", "#214b66"),
    });
  });
}

test("Pokemon fallback flow opens packs and renders analytics/economy charts", async ({ page }) => {
  await page.route("https://api.pokemontcg.io/**", async (route) => {
    await route.abort();
  });

  await page.goto("/index.html");

  await expect(page.locator("#openPackBtn")).toBeEnabled();

  await page.click("#openPackBtn");
  await page.click("#openPackBtn");

  await expect(page.locator("#cardsGrid .card-slot").first()).toBeVisible();
  await expect(page.locator("#economyPanel .sparkline-svg")).toBeVisible();
  await expect(page.locator("#economyPanel .economy-outcome-bar")).toBeVisible();

  await page.click("#analyticsToggleBtn");
  await expect(page.locator("#analyticsOverlay")).toBeVisible();
  await expect(page.locator(".analytics-row").first()).toBeVisible();
});

test("MTG smoke flow loads fixture data, opens packs, and renders ROI charts", async ({ page }) => {
  await stubMtgApi(page);

  await page.goto("/mtg.html");

  await expect(page.locator("#mtgOpenPackBtn")).toBeEnabled();

  await page.click("#mtgOpenPackBtn");
  await page.click("#mtgOpenPackBtn");

  await expect(page.locator("#mtgCardsGrid .card-slot").first()).toBeVisible();
  await expect(page.locator("#mtgEconomyPanel .sparkline-svg")).toBeVisible();
  await expect(page.locator("#mtgEconomyPanel .economy-outcome-bar")).toBeVisible();
});
