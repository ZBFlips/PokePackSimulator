const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./mtg.html",
  "./methodology.html",
  "./common.js?v=20260319-1",
  "./methodology.js?v=20260319-1",
  "./styles.css",
  "./styles.css?v=20260319-39",
  "./app.js",
  "./app.js?v=20260319-40",
  "./mtg.js",
  "./mtg.js?v=20260319-40",
  "./assets/qa/pokemon-lockfile.json",
  "./assets/qa/mtg-lockfile.json",
  "./assets/data/pokemon-market-snapshot.json",
  "./assets/data/mtg-market-snapshot.json",
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
  "./assets/packs/lost-origin.jpg",
  "./assets/packs/astral-radiance.png",
  "./assets/packs/silver-tempest.png",
  "./assets/packs/crown-zenith.png",
  "./assets/packs/ascended-heroes.png",
  "./assets/packs/base-set-1999.png",
  "./assets/packs/jungle-1999.png",
  "./assets/packs/fossil-1999.png"
];

const MANIFEST_HASH = computeManifestHash(STATIC_ASSETS);
const STATIC_CACHE = `pack-sim-static-${MANIFEST_HASH}`;
const RUNTIME_CACHE = `pack-sim-runtime-${MANIFEST_HASH}`;
const API_CACHE = `pack-sim-api-${MANIFEST_HASH}`;

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
    event.respondWith(staleWhileRevalidate(request, STATIC_CACHE, RUNTIME_CACHE));
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

async function staleWhileRevalidate(request, preferredCache, fallbackCache) {
  const cached = await caches.match(request);
  const fetchPromise = fetch(request)
    .then(async (response) => {
      if (response && response.ok) {
        const cache = await caches.open(preferredCache || fallbackCache);
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => null);

  if (cached) {
    return cached;
  }
  const networkResponse = await fetchPromise;
  if (networkResponse) return networkResponse;
  const fallback = await caches.open(fallbackCache).then((cache) => cache.match(request));
  if (fallback) return fallback;
  throw new Error("Request unavailable");
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

function computeManifestHash(items) {
  let hash = 2166136261;
  for (const item of items) {
    for (let i = 0; i < item.length; i += 1) {
      hash ^= item.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
  }
  return (hash >>> 0).toString(16);
}
