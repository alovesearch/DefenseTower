const CACHE_NAME = "tower-defense-cache-v1";
const ASSETS = [
  "/",
  "/index.html",
  "/js/main.js",
  "/js/screenManager.js",
  "/js/screens/LoadingScreen.js",
  "/js/screens/MainMenuScreen.js",
  "/js/screens/MapScreen.js",
  "/js/screens/SettingsScreen.js",
  "/js/utils/loader.js",
  "/img/main.png",
  "/img/loading-bg.png",
  "/img/rotate.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});
