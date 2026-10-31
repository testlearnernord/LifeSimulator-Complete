import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {translateText,initialLanguage} from '../dist/app/i18n.js';

// Guard fixed visible labels. Dynamic composed event text is covered separately.
const source=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
const raw=[...source.matchAll(/(?:>|'|")([^<>"'\n$}{]{3,160})(?:<|'|")/g)].map(m=>m[1].trim());
const possible=[...new Set(raw)].filter(x=>/[a-zäöüß]{3,}/i.test(x)&&/[äöüß]|\b(?:der|die|das|du|dein|eine|und|mit|für|bei|wird|hat|im|auf|ist|nicht|kann|werden|wurden|Jahr|Leben|Spielen|Löschen|Abbrechen|Öffnen)\b/i.test(x));
test('all fixed German UI labels in main.ts have English and Portuguese translations',()=>{
 const missing=possible.filter(str=>translateText(str,'en')===str||translateText(str,'pt')===str);
 assert.deepEqual(missing,[],'Fixed UI labels without EN/pt-PT translation: '+missing.join('; '));
});
test('fresh-browser defaults to English but explicit German and Portuguese remain',()=>{
 assert.equal(initialLanguage({getItem:()=>null}),'en');
 assert.equal(initialLanguage({getItem:()=> 'de'}),'de');
 assert.equal(initialLanguage({getItem:()=> 'pt'}),'pt');
});
test('new-life gender values are stable and independent of translated labels',()=>{
 assert.match(source,/<select name="gender"><option value="männlich">männlich<\/option><option value="weiblich">weiblich<\/option><option value="divers">divers<\/option><\/select>/);
 assert.equal(translateText('weiblich','en'),'female');
 assert.equal(translateText('weiblich','pt'),'feminino');
});
