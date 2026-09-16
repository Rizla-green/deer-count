const CACHE_NAME = 'deer-count-v2';
const APP_SHELL = [
  './',
  './index.html',
  './app.js',
  './manifest.json',
  './logo.png',
  './icon-192.png',
  './icon-512.png',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet-draw@1.0.4/dist/leaflet.draw.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://unpkg.com/leaflet-draw@1.0.4/dist/leaflet.draw.js',
  'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).catch(()=>{})
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

// Network-first for Firebase/API calls (always want freshest data when online),
// cache-first for the app shell (works offline).
self.addEventListener('fetch', event => {
  const url = event.request.url;
  const isApi = url.includes('firestore.googleapis.com') || url.includes('googleapis.com') ||
                url.includes('api.postcodes.io') || url.includes('api.open-meteo.com') ||
                url.includes('dropboxapi.com');
  if(isApi){
    return; // let these go straight to network; Firestore SDK handles its own offline queue
  }
  event.respondWith(
    caches.match(event.request).then(cached => {
      if(cached) return cached;
      return fetch(event.request).then(resp => {
        if(resp && resp.status === 200 && event.request.method === 'GET'){
          const clone = resp.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return resp;
      }).catch(()=> cached);
    })
  );
});
