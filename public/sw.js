const CACHE='lebenslinien-v__APP_VERSION__';
const ASSETS=__PRECACHE_ASSETS__.map(p=>new URL(p,self.registration.scope).href);
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==self.location.origin)return;e.respondWith(fetch(e.request).then(response=>{if(response.ok){const clone=response.clone();caches.open(CACHE).then(cache=>cache.put(e.request,clone));}return response;}).catch(()=>caches.match(e.request).then(result=>result||caches.match(new URL('./index.html',self.registration.scope).href))));});
self.addEventListener('message',e=>{if(e.data==='SKIP_WAITING')self.skipWaiting()});
