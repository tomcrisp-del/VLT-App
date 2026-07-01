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
const SW_VERSION  = 'v2';
const SHELL_CACHE = 'vlt-shell-' + SW_VERSION;
// Bump the tile-cache version to purge tiles poisoned by the pre-v2 cacher
// (which stored opaque error/rate-limit responses as if they were real tiles).
// The activate handler deletes any older vlt-tiles-* cache automatically.
const TILE_CACHE  = 'vlt-tiles-v2';
// Per-trail content (descriptions, card thumbnails, boundary/parking/trail KML)
// so every trail page is fully usable offline, not just the map tiles.
// v2 purges v1's full-res photos, replaced by small card thumbnails (~80 MB → ~1 MB).
const CONTENT_CACHE = 'vlt-content-v2';

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
            keys.filter((k) =>
                    (k.startsWith('vlt-shell-') && k !== SHELL_CACHE) ||
                    (k.startsWith('vlt-tiles-') && k !== TILE_CACHE) ||
                    (k.startsWith('vlt-content-') && k !== CONTENT_CACHE))
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

// ── Asset pre-caching driven by the page ─────────────────────
// The page hands us a list of URLs (map tiles, or per-trail content) plus which
// cache to store them in; we fetch + cache them with retries and report accurate
// success/failure counts so the page only marks the download "complete" when
// nothing failed. Also answers TILE_STATUS (how many entries are cached) and
// CLEAR_TILES (wipe a cache). data.cacheName selects the target cache and
// defaults to the tile cache for backward compatibility.
self.addEventListener('message', (event) => {
    const data = event.data || {};
    const jobId = data.jobId;
    const cacheName = data.cacheName || TILE_CACHE;
    const reply = (msg) => { try { event.source && event.source.postMessage(Object.assign({ jobId }, msg)); } catch (_) {} };

    // How many entries are currently cached (drives the "X saved" labels).
    if (data.type === 'TILE_STATUS') {
        event.waitUntil((async () => {
            let count = 0;
            try { const c = await caches.open(cacheName); count = (await c.keys()).length; } catch (_) {}
            reply({ type: 'TILE_STATUS_RESULT', count });
        })());
        return;
    }

    // Wipe every entry in the selected cache.
    if (data.type === 'CLEAR_TILES') {
        event.waitUntil((async () => {
            try { await caches.delete(cacheName); } catch (_) {}
            reply({ type: 'CLEAR_TILES_DONE' });
        })());
        return;
    }

    if (data.type === 'CACHE_TILES' && Array.isArray(data.urls)) {
        // force → re-fetch and overwrite even already-cached entries (heals an
        // entry that a previous run stored as an opaque error response).
        const force = !!data.force;
        event.waitUntil((async () => {
            const cache = await caches.open(cacheName);
            const urls = data.urls;
            const total = urls.length;
            let done = 0;
            let quotaError = false;

            // Returns true if the entry ended up cached, false on a real failure.
            async function fetchOne(u) {
                if (!force) {
                    const hit = await cache.match(u);
                    if (hit) return true;
                }
                // Cross-origin tile servers (Google, USGS) don't send CORS
                // headers, so their response is opaque and the HTTP status is
                // hidden — we accept opaque as success. Same-origin content
                // returns a normal (basic) response, so resp.ok genuinely
                // validates it (a 404 won't be cached). A network drop/timeout
                // REJECTS the fetch — that's the failure we catch and retry.
                // no-store bypasses the HTTP cache so a forced re-download
                // actually re-fetches fresh bytes.
                const resp = await fetch(u, { mode: 'no-cors', cache: 'no-store' });
                if (resp && (resp.ok || resp.type === 'opaque')) {
                    await cache.put(u, resp.clone());
                    return true;
                }
                return false;
            }

            // Run a list through a small worker pool. countProgress=true reports
            // the top bar's progress (only the first, full pass does this).
            async function runPass(list, countProgress) {
                const queue = list.slice();
                const fails = [];
                async function worker() {
                    while (queue.length && !quotaError) {
                        const u = queue.shift();
                        let ok = false;
                        try { ok = await fetchOne(u); }
                        catch (e) { if (e && e.name === 'QuotaExceededError') quotaError = true; }
                        if (!ok && !quotaError) fails.push(u);
                        if (countProgress) {
                            done++;
                            if (done % 4 === 0 || done === total)
                                reply({ type: 'CACHE_TILES_PROGRESS', done, total });
                        }
                    }
                }
                // Modest concurrency so we don't trip tile-server rate limits.
                await Promise.all([worker(), worker(), worker(), worker()]);
                return fails;
            }

            let fails = await runPass(urls, true);
            // Retry transient failures a couple of times with a short backoff —
            // this is what rescues a download on a flaky connection.
            for (let i = 0; i < 2 && fails.length && !quotaError; i++) {
                await new Promise((r) => setTimeout(r, 800 * (i + 1)));
                fails = await runPass(fails, false);
            }

            const failed = quotaError ? (total - done) : fails.length;
            reply({ type: 'CACHE_TILES_DONE', done: total, total, ok: total - failed, failed, quotaError });
        })());
        return;
    }
});
