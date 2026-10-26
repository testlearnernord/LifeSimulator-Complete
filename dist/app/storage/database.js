import { isSaveGame } from '../engine/simulation.js';
const DB_NAME = 'lebenslinien-saves';
const STORE = 'lives';
const DB_VERSION = 1;
const open = () => new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => { const db = request.result; if (!db.objectStoreNames.contains(STORE))
        db.createObjectStore(STORE, { keyPath: 'id' }); };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || Error('IndexedDB konnte nicht geöffnet werden.'));
});
async function transact(mode, fn) {
    const db = await open();
    return new Promise((resolve, reject) => { const tx = db.transaction(STORE, mode); const req = fn(tx.objectStore(STORE)); req.onsuccess = () => resolve(req.result); req.onerror = () => reject(req.error); tx.oncomplete = () => db.close(); tx.onerror = () => { db.close(); reject(tx.error); }; });
}
export async function listGames() { const list = await transact('readonly', store => store.getAll()); return list.filter(isSaveGame).sort((a, b) => b.updated - a.updated); }
export async function getGame(id) { const raw = await transact('readonly', store => store.get(id)); return isSaveGame(raw) ? raw : null; }
export async function putGame(game) { if (!isSaveGame(game))
    throw Error('Speicherstand hat ein ungültiges Format.'); await transact('readwrite', store => store.put(game)); }
export async function deleteGame(id) { await transact('readwrite', store => store.delete(id)); }
export function exportGame(game) { const bytes = new Blob([JSON.stringify(game, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(bytes); const a = document.createElement('a'); a.href = url; a.download = `lebenslinien-save-${game.id.replace(/[^a-z0-9-]/gi, '_')}.json`; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1500); }
export async function importGame(file) { if (file.size > 3_000_000)
    throw Error('Datei zu groß.'); let data; try {
    data = JSON.parse(await file.text());
}
catch {
    throw Error('Kein gültiges JSON.');
} if (!isSaveGame(data))
    throw Error('Unbekanntes oder beschädigtes Savegame.'); const copy = structuredClone(data); copy.id = `${copy.id}-import-${Date.now().toString(36)}`; copy.updated = Date.now(); await putGame(copy); return copy; }
