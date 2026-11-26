const CACHE_NAME = "calc-hub-cache-v4";

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

// Fetch Event: Cache Routing & Offline Strategies
self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // 1. NON-GET requests: bypass service worker
  if (req.method !== "GET") return;

  // 2. CRITICAL RULE: NEVER CACHE /admin or /api/* (always network-only)
  if (url.pathname.startsWith("/admin") || url.pathname.startsWith("/api/")) {
    return;
  }

  // 3. rates.json: Network-first with cache fallback
  if (url.pathname.includes("rates.json")) {
    event.respondWith(
      fetch(req)
        .then((networkRes) => {
          if (networkRes.ok) {
            const copy = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          }
          return networkRes;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  // 4. HTML Page Navigations: Network-first with cache fallback to page or /offline
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((networkRes) => {
          if (networkRes.ok) {
            const copy = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          }
          return networkRes;
        })
        .catch(async () => {
          const cachedPage = await caches.match(req);
          if (cachedPage) return cachedPage;

          // If page not cached, show branded offline page
          const offlineFallback = await caches.match("/offline");
          if (offlineFallback) return offlineFallback;

          return new Response("Offline mode active. Please connect to the internet to load new pages.", {
            headers: { "Content-Type": "text/plain" },
          });
        })
    );
    return;
  }

  // 5. Static Assets (JS, CSS, images, icons, fonts): Cache-first with network fallback
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/images/") ||
    url.pathname.endsWith(".webp") ||
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".svg") ||
    url.pathname.endsWith(".ico")
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

  // 6. Default Fallback
  event.respondWith(
    caches.match(req).then((cached) => {
      return cached || fetch(req);
    })
  );
});
