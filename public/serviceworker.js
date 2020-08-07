import { cachedDataVersionTag } from "v8";

const CAHCHE_NAME = "version-1";
const urlsToCache = ["index.html", "offline.html"];

const self = this;

//install service worker
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CAHCHE_NAME).then(cahce => {
      console.log("open cache");
      return cahce.addAll(urlsToCache);
    })
  );
});

//listen for requests
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(() => {
      return fetch(event.request).catch(() => caches.match("offline.html"));
    })
  );
});

//activate service worker
self.addEventListener("activate", event => {
  const cahceWhitelist = [];
  cahceWhitelist.push(CAHCHE_NAME);

  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.map(cahceName => {
          if (!cahceWhitelist.includes(cahceName)) {
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});
