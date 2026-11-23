const CACHE = "oq-v14";
const CORE = ["./", "index.html", "play.html", "css/style.css", "css/landing.css", "js/app.js", "js/sound.js", "js/daily.js", "courses/courses.js", "manifest.webmanifest", "icon.svg"];
self.addEventListener("install", e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting())));
self.addEventListener("activate", e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
// 네트워크 우선(그림/코드 업데이트 반영), 실패 시 캐시 → 오프라인에서도 동작
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); return r; })
    .catch(() => caches.match(e.request)));
});
