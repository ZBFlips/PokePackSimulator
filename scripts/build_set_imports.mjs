import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const inputPath = resolve(root, "assets/data/imports/set-imports.json");
const outputPath = resolve(root, "assets/data/set-imports.generated.js");

const raw = await readFile(inputPath, "utf8");
const payload = JSON.parse(raw);

if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
  throw new Error("Set import payload must be a JSON object.");
}

const pokemon = Array.isArray(payload.pokemon) ? payload.pokemon : [];
const mtg = Array.isArray(payload.mtg) ? payload.mtg : [];

const output = `window.PackSimImportData = Object.freeze(${JSON.stringify({ pokemon, mtg }, null, 2)});\n`;
await writeFile(outputPath, output, "utf8");
console.log(`Wrote ${outputPath}`);
