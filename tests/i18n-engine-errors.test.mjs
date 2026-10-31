import test from 'node:test';
import assert from 'node:assert/strict';
import {readdirSync,readFileSync} from 'node:fs';
import {translateText} from '../dist/app/i18n.js';
const engineRoot=new URL('../src/engine/',import.meta.url);
const files=readdirSync(engineRoot).filter(name=>name.endsWith('.ts'));
test('fixed gameplay validation errors across every engine have EN and pt-PT translations',()=>{
 const missing=[];
 for(const filename of files){
  const code=readFileSync(new URL(filename,engineRoot),'utf8');
  const staticErrors=[...code.matchAll(/(?:throw Error|throw new Error)\(\s*'([^']{8,180})'/g)].map(m=>m[1]);
  for(const message of staticErrors){
   if(!/[.!?]$/.test(message)||!/[äöüß]|\b(?:Du|du|die|der|das|Deine|dein|nicht|ist|Für|für|ein|Eine|Diese|während|erst|Jahr|kann|Kredit)\b/.test(message))continue;
   if(translateText(message,'en')===message||translateText(message,'pt')===message)missing.push(filename+': '+message);
  }
 }
 assert.deepEqual(missing,[],'Missing fixed gameplay error translations: '+missing.join('; '));
});
