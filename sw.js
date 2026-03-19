const CACHE_VERSION = "v20260319-4";
const STATIC_CACHE = `pack-sim-static-${CACHE_VERSION}`;
const RUNTIME_CACHE = `pack-sim-runtime-${CACHE_VERSION}`;
const API_CACHE = `pack-sim-api-${CACHE_VERSION}`;

const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./mtg.html",
  "./methodology.html",
  "./styles.css",
  "./app.js",
  "./mtg.js",
  "./assets/qa/pokemon-lockfile.json",
  "./assets/qa/mtg-lockfile.json",
  "./manifest.webmanifest",
  "./assets/icons/icon-192.svg",
  "./assets/icons/icon-512.svg",
  "./assets/packs/paldean-fates.png",
  "./assets/packs/prismatic-evolutions.png",
  "./assets/packs/surging-sparks.png",
  "./assets/packs/obsidian-flames.png",
  "./assets/packs/temporal-forces.png",
  "./assets/packs/twilight-masquerade.png",
  "./assets/packs/evolving-skies.jpg",
  "./assets/packs/brilliant-stars.jpg",
  "./assets/packs/lost-origin.jpg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_ASSETS)).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => ![STATIC_CACHE, RUNTIME_CACHE, API_CACHE].includes(key))
          .map((key) => caches.delete(key)),
      ),
    ).then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  const isPokemonApi = url.hostname === "api.pokemontcg.io";
  const isNavigation = request.mode === "navigate";
  const isSameOrigin = url.origin === self.location.origin;

  if (isPokemonApi) {
    event.respondWith(networkFirst(request, API_CACHE));
    return;
  }

  if (isNavigation) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          return caches.match("./index.html");
        }),
    );
    return;
  }

  if (isSameOrigin) {
    event.respondWith(cacheFirst(request, STATIC_CACHE, RUNTIME_CACHE));
    return;
  }

  event.respondWith(networkFirst(request, RUNTIME_CACHE));
});

async function cacheFirst(request, preferredCache, fallbackCache) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      const cache = await caches.open(preferredCache || fallbackCache);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const fallback = await caches.open(fallbackCache).then((cache) => cache.match(request));
    if (fallback) return fallback;
    throw error;
  }
}

async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.open(cacheName).then((cache) => cache.match(request));
    if (cached) return cached;
    return caches.match(request);
  }
}
