const APP_PREFIX = "Budget Tracker-";
const VERSION = "version_01";
const CACHE_NAME = APP_PREFIX + VERSION;
const FILES_TO_CACHE = [
    "/",
    "./index.html",
    "./css/styles.css",
    "./js/index.js",
    "./js/idb.js",
    "./manifest.json"
];

self.addEventListener("fetch", function(e) {
    e.respondWith(
        caches.match(e.request).then(function(request) {
            if(request) { 
                return request;
            } else {
                return fetch(e.request);
            }
        })
    );
});

self.addEventListener("install", function(e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(FILES_TO_CACHE);
        })
    )
});

self.addEventListener("activate", function(e) {
    e.waitUntil(
        caches.keys().then(function(keyList) {
            let cacheKeeplist = keyList.filter(function(key) {
                return key.indexOf(APP_PREFIX);
            });
            cacheKeeplist.push(CACHE_NAME);

            return Promise.all(
                keyList.map(function(key, i) {
                    if(cacheKeeplist.indexOf(key) === -1) {
                        return caches.delete(keyList[i]);
                    }
                })
            );
        })
    );
});