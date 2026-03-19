import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const today = new Date().toISOString().slice(0, 10);

const targets = [
  {
    label: "Pokemon",
    envKey: "POKEMON_SNAPSHOT_SOURCE_URL",
    outputPath: resolve(root, "assets/data/pokemon-market-snapshot.json"),
  },
  {
    label: "MTG",
    envKey: "MTG_SNAPSHOT_SOURCE_URL",
    outputPath: resolve(root, "assets/data/mtg-market-snapshot.json"),
  },
];

function assertSnapshotShape(label, payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error(`${label} snapshot must be a JSON object.`);
  }
  if (!payload.packPrices || typeof payload.packPrices !== "object" || Array.isArray(payload.packPrices)) {
    throw new Error(`${label} snapshot must include a packPrices object.`);
  }
}

async function fetchSnapshot(url, label) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30_000);
  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new Error(`Request failed (${response.status}) for ${url}`);
    }
    const payload = await response.json();
    assertSnapshotShape(label, payload);
    if (typeof payload.updatedAt !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(payload.updatedAt)) {
      payload.updatedAt = today;
    }
    return payload;
  } finally {
    clearTimeout(timer);
  }
}

async function writeIfChanged(outputPath, nextPayload) {
  const nextText = `${JSON.stringify(nextPayload, null, 2)}\n`;
  let previousText = "";
  try {
    previousText = await readFile(outputPath, "utf8");
  } catch {
    previousText = "";
  }

  if (previousText === nextText) {
    return false;
  }

  await writeFile(outputPath, nextText, "utf8");
  return true;
}

let ran = false;
let changedCount = 0;

for (const target of targets) {
  const sourceUrl = process.env[target.envKey];
  if (!sourceUrl) {
    console.log(`Skipping ${target.label}: ${target.envKey} is not configured.`);
    continue;
  }

  ran = true;
  console.log(`Refreshing ${target.label} snapshot from ${sourceUrl}`);
  const payload = await fetchSnapshot(sourceUrl, target.label);
  const changed = await writeIfChanged(target.outputPath, payload);
  if (changed) {
    changedCount += 1;
    console.log(`Updated ${target.label} snapshot at ${target.outputPath}`);
  } else {
    console.log(`${target.label} snapshot already up to date.`);
  }
}

if (!ran) {
  console.log("No snapshot source URLs configured. Nothing to refresh.");
} else {
  console.log(`Snapshot refresh complete. Changed file count: ${changedCount}`);
}
