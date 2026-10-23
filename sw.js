const CACHE_NAME = "tosan-techno-final";
const ASSETS = ["./", "./index.html", "./app.js", "./manifest.json", "./icon-192.svg", "./icon-512.svg", "./apple-touch-icon.svg"];
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});
self.addEventListener("fetch", (e) => {
  e.respondWith(
    fetch(e.request)
      .then((r) => {
        if (r && r.status === 200 && e.request.method === "GET") {
          const c = r.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, c));
        }
        return r;
      })
      .catch(() => caches.match(e.request).then((c) => c || caches.match("./index.html")))
  );
});
