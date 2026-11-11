// BaouGo – cache hors ligne. Changer VERSION à chaque mise à jour des contenus.
const VERSION = "baougo-v4";
const FICHIERS = [
  "./", "index.html", "manifest.webmanifest",
  "img/logo.png", "img/filigrane.jpg", "img/sommet.jpg",
  "icons/icon-192.png", "icons/icon-512.png", "icons/apple-touch-icon.png", "icons/favicon-32.png",
  "fonts/fraunces-latin-600-normal.woff2", "fonts/fraunces-latin-700-normal.woff2",
  "fonts/inter-latin-400-normal.woff2", "fonts/inter-latin-500-normal.woff2",
  "fonts/inter-latin-600-normal.woff2", "fonts/inter-latin-700-normal.woff2",
  "fonts/outfit-latin-300-normal.woff2", "fonts/outfit-latin-600-normal.woff2", "fonts/outfit-latin-800-normal.woff2"
];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FICHIERS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// Réseau d'abord (contenus à jour), cache si pas de réseau
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    fetch(e.request).then(r => { const copie = r.clone(); caches.open(VERSION).then(c => c.put(e.request, copie)); return r; })
      .catch(() => caches.match(e.request).then(r => r || caches.match("index.html")))
  );
});
