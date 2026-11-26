// P77 — Performance Optimized Service Worker
// Cache-first for installed PWA, stale-while-revalidate for navigation pages
const CACHE_NAME = "calc-hub-cache-v5";

const PRECACHE_URLS = [
  "/",
  "/salary-tax-calculator",
  "/zakat-calculator",
  "/property-tax-calculator",
  "/gst-calculator",
  "/fitrana-calculator",
  "/ushr-calculator",
  "/about",
  "/methodology",
  "/privacy-policy",
  "/disclaimer",
  "/contact",
  "/offline",
  "/manifest.json",
  "/icon.svg",
  "/icon-192x192.png",
  "/icon-512x512.png",
  "/icon-512x512-maskable.png",
  "/apple-touch-icon.png",
  "/images/CalculationHub_Logo_Full.webp",
  "/images/CalculationHub_App_Icon.webp",
  "/images/og-share-1200x630.png",
  "/data/rates.json",
];

// Install Event: Precache core app shell & pages
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return Promise.allSettled(
          PRECACHE_URLS.map((url) =>
            fetch(url)
              .then((res) => {
                if (res.ok) return cache.put(url, res);
              })
              .catch(() => {})
          )
        );
      })
      .then(() => self.skipWaiting())
  );
});

// Activate Event: Cleanup stale caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => {
        return Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        );
      })
      .then(() => self.clients.claim())
  );
});

// Helper: check if request is from installed standalone PWA
function isStandaloneMode() {
  return self.clients
    .matchAll({ type: "window" })
    .then((clients) => clients.some((c) => c.url && c.frameType === "top-level"));
}

// Fetch Event: Optimized Cache Routing
self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // 1. NON-GET requests: bypass service worker
  if (req.method !== "GET") return;

  // 2. CRITICAL RULE: NEVER CACHE /admin or /api/* (always network-only)
  if (url.pathname.startsWith("/admin") || url.pathname.startsWith("/api/")) {
    return;
  }

  // 3. Third-party ad/analytics scripts: network-only, never cache
  if (
    url.hostname.includes("bauval.org") ||
    url.hostname.includes("cloudvideosa.com") ||
    url.hostname.includes("googlesyndication.com") ||
    url.hostname.includes("doubleclick.net") ||
    url.hostname.includes("facebook.net") ||
    url.hostname.includes("facebook.com") ||
    url.hostname.includes("gold-api.com") ||
    url.hostname.includes("er-api.com")
  ) {
    return; // Let browser handle natively — ads must never block
  }

  // 4. rates.json: Stale-while-revalidate — serve cache instantly, update in background
  if (url.pathname.includes("rates.json")) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(req);
        const networkFetch = fetch(req)
          .then((networkRes) => {
            if (networkRes.ok) {
              cache.put(req, networkRes.clone());
            }
            return networkRes;
          })
          .catch(() => null);

        // Return cached immediately if available, otherwise wait for network
        if (cached) {
          event.waitUntil(networkFetch);
          return cached;
        }
        return networkFetch || cached || new Response("{}", { headers: { "Content-Type": "application/json" } });
      })
    );
    return;
  }

  // 5. HTML Page Navigations:
  //    - If a cached version exists: return it instantly (cache-first) + revalidate in background
  //    - If no cache: network-first with offline fallback
  //    This makes installed PWA open INSTANTLY from cache while staying fresh
  if (req.mode === "navigate") {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(req);

        // Stale-while-revalidate for cached pages
        if (cached) {
          // Background revalidate so next visit gets fresh HTML
          event.waitUntil(
            fetch(req)
              .then((networkRes) => {
                if (networkRes.ok) {
                  cache.put(req, networkRes.clone());
                }
              })
              .catch(() => {})
          );
          return cached; // Return instantly from cache
        }

        // No cache: try network, fallback to offline page
        return fetch(req)
          .then((networkRes) => {
            if (networkRes.ok) {
              cache.put(req, networkRes.clone());
            }
            return networkRes;
          })
          .catch(async () => {
            const offlineFallback = await caches.match("/offline");
            if (offlineFallback) return offlineFallback;
            return new Response("Offline. Please connect to the internet.", {
              headers: { "Content-Type": "text/plain" },
            });
          });
      })
    );
    return;
  }

  // 6. Static Assets (JS, CSS, images, icons, fonts): Cache-first with network fallback
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/images/") ||
    url.pathname.endsWith(".webp") ||
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".svg") ||
    url.pathname.endsWith(".ico") ||
    url.pathname.endsWith(".woff2") ||
    url.pathname.endsWith(".woff")
  ) {
    event.respondWith(
      caches.match(req).then((cachedRes) => {
        if (cachedRes) return cachedRes;

        return fetch(req)
          .then((networkRes) => {
            if (networkRes.ok) {
              const copy = networkRes.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
            }
            return networkRes;
          })
          .catch(() => cachedRes);
      })
    );
    return;
  }

  // 7. Default: stale-while-revalidate
  event.respondWith(
    caches.match(req).then((cached) => {
      return cached || fetch(req);
    })
  );
});
