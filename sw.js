// ============================================================
// Vinalhaven Trail Guide — Service Worker
// ------------------------------------------------------------
// Goals:
//   • Let the app open & run offline (cache the shell + CDN libs).
//   • Make trail map tiles available offline (cache-first, immutable).
//   • NEVER serve stale app code online — same-origin uses network-first,
//     so the existing ?v= update flow keeps working untouched.
//
// Bump SW_VERSION to invalidate the shell cache on a future change.
// ============================================================
const SW_VERSION  = 'v1';
const SHELL_CACHE = 'vlt-shell-' + SW_VERSION;
const TILE_CACHE  = 'vlt-tiles-v1';   // tiles are immutable; survive shell bumps

// Cross-origin libraries the app needs to boot offline (stable, versioned URLs).
const LIB_HOSTS = new Set([
    'unpkg.com',
    'cdnjs.cloudflare.com',
    'www.gstatic.com',
    'fonts.googleapis.com',
    'fonts.gstatic.com',
]);

const PRECACHE_LIBS = [
    '/',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
    'https://unpkg.com/@mapbox/togeojson@0.16.2/togeojson.js',
    'https://unpkg.com/@turf/turf@7/turf.min.js',
    'https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js',
    'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js',
    'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js',
];

function isTileUrl(url) {
    return /(^|\.)google\.com$/.test(url.hostname) && url.pathname.startsWith('/vt')
        || url.hostname === 'basemap.nationalmap.gov';
}

self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(SHELL_CACHE).then((cache) =>
            Promise.all(PRECACHE_LIBS.map((u) =>
                cache.add(u).catch(() => { /* one bad asset shouldn't fail install */ })
            ))
        )
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil((async () => {
        const keys = await caches.keys();
        await Promise.all(
            keys.filter((k) => k.startsWith('vlt-shell-') && k !== SHELL_CACHE)
                .map((k) => caches.delete(k))
        );
        await self.clients.claim();
    })());
});

self.addEventListener('fetch', (event) => {
    const req = event.request;
    if (req.method !== 'GET') return;
    let url;
    try { url = new URL(req.url); } catch { return; }

    // 1) Map tiles → cache-first (this is what makes maps work offline).
    if (isTileUrl(url)) {
        event.respondWith((async () => {
            const cache = await caches.open(TILE_CACHE);
            const hit = await cache.match(req);
            if (hit) return hit;
            try {
                const resp = await fetch(req);
                if (resp && (resp.ok || resp.type === 'opaque')) cache.put(req, resp.clone());
                return resp;
            } catch {
                return hit || Response.error();
            }
        })());
        return;
    }

    // 2) Same-origin app → network-first (keeps ?v= updates flowing); cache as
    //    a fallback for offline.
    if (url.origin === self.location.origin) {
        event.respondWith((async () => {
            try {
                const resp = await fetch(req);
                if (resp && resp.ok) {
                    const cache = await caches.open(SHELL_CACHE);
                    cache.put(req, resp.clone());
                }
                return resp;
            } catch {
                const cached = await caches.match(req);
                if (cached) return cached;
                if (req.mode === 'navigate') return caches.match('/') || caches.match('/index.html');
                return Response.error();
            }
        })());
        return;
    }

    // 3) Static CDN libraries → cache-first so the app boots offline.
    if (LIB_HOSTS.has(url.hostname)) {
        event.respondWith((async () => {
            const cache = await caches.open(SHELL_CACHE);
            const hit = await cache.match(req);
            if (hit) return hit;
            try {
                const resp = await fetch(req);
                if (resp && (resp.ok || resp.type === 'opaque')) cache.put(req, resp.clone());
                return resp;
            } catch {
                return hit || Response.error();
            }
        })());
        return;
    }

    // 4) Everything else (Firestore API, Cloudinary, the identify function) →
    //    straight to the network. Offline failures are handled in the app.
});

// ── Tile pre-caching driven by the page (with progress reporting) ──
self.addEventListener('message', (event) => {
    const data = event.data || {};
    if (data.type === 'CACHE_TILES' && Array.isArray(data.urls)) {
        event.waitUntil((async () => {
            const cache = await caches.open(TILE_CACHE);
            const urls = data.urls;
            const total = urls.length;
            let done = 0;
            const post = (type) => { try { event.source && event.source.postMessage({ type, done, total }); } catch (_) {} };
            // Modest concurrency so we don't hammer the tile servers.
            const QUEUE = urls.slice();
            async function worker() {
                while (QUEUE.length) {
                    const u = QUEUE.shift();
                    try {
                        const hit = await cache.match(u);
                        if (!hit) {
                            const resp = await fetch(u, { mode: 'no-cors' });
                            if (resp) await cache.put(u, resp.clone());
                        }
                    } catch (_) { /* skip a failed tile */ }
                    done++;
                    if (done % 4 === 0 || done === total) post('CACHE_TILES_PROGRESS');
                }
            }
            await Promise.all([worker(), worker(), worker(), worker()]);
            post('CACHE_TILES_DONE');
        })());
    }
});
