/**
 * Service Worker для PWA
 */
const CACHE_NAME = 'tower-defense-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/manifest.json',
    '/js/main.js',
    '/js/screen-manager.js',
    '/js/game-loader.js',
    '/js/screens/loading-screen.js',
    '/js/screens/main-menu.js',
    '/js/screens/map-screen.js',
    '/js/screens/level-screen.js',
    '/js/screens/settings-screen.js'
];

// Установка Service Worker
self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Caching app shell');
                return cache.addAll(urlsToCache);
            })
    );
});

// Активация Service Worker
self.addEventListener('activate', (event) => {
    console.log('Service Worker activating...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Обработка запросов
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Возвращаем кэшированную версию или загружаем из сети
                return response || fetch(event.request);
            })
    );
});