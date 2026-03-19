import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const read = (path) => readFileSync(resolve(root, path), "utf8");

const appJs = read("app.js");
const swJs = read("sw.js");
const indexHtml = read("index.html");
const mtgHtml = read("mtg.html");
const methodologyHtml = read("methodology.html");
const pokemonSnapshot = JSON.parse(read("assets/data/pokemon-market-snapshot.json"));
const mtgSnapshot = JSON.parse(read("assets/data/mtg-market-snapshot.json"));

const appPackImages = [...appJs.matchAll(/localPackImage:\s*"([^"]+)"/g)].map((m) => m[1]);
const swPackImages = [...swJs.matchAll(/"\.\/(assets\/packs\/[^"]+)"/g)].map((m) => m[1]);

const missingInSw = [...new Set(appPackImages)].filter((image) => !swPackImages.includes(image));
assert.equal(missingInSw.length, 0, `Missing SW precache images: ${missingInSw.join(", ")}`);

const swDuplicates = swPackImages.filter((path, index, all) => all.indexOf(path) !== index);
assert.equal(swDuplicates.length, 0, `Duplicate SW pack entries: ${[...new Set(swDuplicates)].join(", ")}`);

for (const [name, html] of [
  ["index.html", indexHtml],
  ["mtg.html", mtgHtml],
  ["methodology.html", methodologyHtml],
]) {
  assert.match(html, /Content-Security-Policy/i, `${name} missing CSP meta`);
}

for (const [name, snapshot] of [
  ["pokemon-market-snapshot.json", pokemonSnapshot],
  ["mtg-market-snapshot.json", mtgSnapshot],
]) {
  assert.equal(typeof snapshot.updatedAt, "string", `${name} missing updatedAt`);
  assert.match(snapshot.updatedAt, /^\d{4}-\d{2}-\d{2}$/, `${name} updatedAt must be YYYY-MM-DD`);
}

console.log("consistency.test.mjs: PASS");

