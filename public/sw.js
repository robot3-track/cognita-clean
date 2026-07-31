const CACHE_NAME = "cognita-v2";
const STATIC_ASSETS = [
  "/cognita-offline.html"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  if (!e.request.url.startsWith("http")) return;

  const url = e.request.url;
  // Skip non-same-origin external APIs, Firebase, Google Auth, etc.
  if (
    !url.startsWith(self.location.origin) ||
    url.includes("/api/") ||
    url.includes("firebase") ||
    url.includes("googleapis.com") ||
    url.includes("identitytoolkit") ||
    url.includes("firestore")
  ) {
    return;
  }

  // Network-first strategy for app requests
  e.respondWith(
    fetch(e.request)
      .then(response => {
        if (response && response.status === 200 && response.type === "basic") {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        }
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(e.request);
        if (cached) return cached;
        if (e.request.mode === "navigate") {
          const offlinePage = await caches.match("/cognita-offline.html");
          if (offlinePage) return offlinePage;
        }
        return new Response("Network error", { status: 503, statusText: "Service Unavailable" });
      })
  );
});

