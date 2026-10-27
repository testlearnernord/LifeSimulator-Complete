import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
const read=p=>readFileSync(`dist/${p}`,'utf8');
test('manifest and Apple icon are packaged',()=>{
 const manifest=JSON.parse(read('manifest.webmanifest'));
 assert.equal(manifest.display,'standalone');assert.equal(manifest.start_url,'./');
 for(const asset of manifest.icons) assert.ok(existsSync('dist/'+asset.src.replace('./','')));
 assert.ok(existsSync('dist/apple-icon.png'));
});
test('relative URL layout works beneath GitHub Pages subpath',()=>{
 const page=read('index.html');assert.match(page,/src="\.\/app\/main\.js"/);assert.match(page,/href="\.\/manifest\.webmanifest"/);assert.match(page,/href="\.\/styles\.css"/);
});
test('service worker cache identifier updates on content changes',()=>{
 const sw=read('sw.js');assert.match(sw,/lebenslinien-v0\.6\.0-[a-f0-9]{12}/);assert.ok(!sw.includes('__APP_VERSION__'));
 const assets=['app/main.js','app/audio.js','app/engine/simulation.js','app/engine/catalog.js','app/storage/database.js'];for(const asset of assets)assert.ok(existsSync('dist/'+asset));
});
