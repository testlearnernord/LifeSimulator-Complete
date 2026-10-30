import test from 'node:test';
import assert from 'node:assert/strict';
import {createLife,applyAction,isSaveGame,netWorth} from '../dist/app/engine/simulation.js';
import {HEIRLOOM_CATALOG,heirloomWorth,todayHeirloomKey} from '../dist/app/engine/heirlooms.js';

const born=()=>createLife({name:'Sammlerin',gender:'divers',country:'Deutschland',seed:20261030});
function advance(s,years){
 for(let i=0;i<years;i++){
  if(s.person.pending)s=applyAction(s,{type:'EVENT',kind:s.person.pending.options[0].kind});
  s=applyAction(s,{type:'AGE'});
 }
 if(s.person.pending)s=applyAction(s,{type:'EVENT',kind:s.person.pending.options[0].kind});
 return s;
}
const act=(s,key,id)=>applyAction(s,{type:'HEIRLOOM',key,id});

test('officially documented daily find loop is playable and limited to one local calendar day',()=>{
 let s=born();
 assert.throws(()=>act(s,'search'),/8 Jahren/);
 s=advance(s,8);
 const old=s;
 s=act(s,'search');
 assert.equal(s.person.heirlooms.length,1);
 assert.equal(s.person.heirloomSearchDate,todayHeirloomKey());
 assert.equal(old.person.heirlooms,undefined);
 assert.equal(isSaveGame(s),true);
 assert.throws(()=>act(s,'search'),/Heute/);
 s=advance(s,1);
 assert.throws(()=>act(s,'search'),/Heute/);
});

test('appraisal, restoration, exhibition and sale affect finances and happiness',()=>{
 let s=advance(born(),20);s.person.cash=10000;
 s=act(s,'search');const id=s.person.heirlooms[0].id;
 const first=s.person.heirlooms[0];
 assert.equal(first.appraised,false);
 assert.throws(()=>act(s,'sell',id),/schätzen/);
 s=act(s,'appraise',id);
 assert.equal(s.person.cash,9900);
 assert.equal(s.person.heirlooms[0].appraised,true);
 assert.throws(()=>act(s,'appraise',id),/bereits/);
 const oldCondition=s.person.heirlooms[0].condition;
 s=act(s,'restore',id);
 assert.equal(s.person.cash,9500);
 assert.equal(s.person.heirlooms[0].condition,Math.min(100,oldCondition+15));
 assert.throws(()=>act(s,'restore',id),/dieses Jahr|bereits/);
 const happiness=s.person.stats.happiness;
 s=act(s,'exhibit',id);
 assert.ok(s.person.stats.happiness>=happiness);
 assert.throws(()=>act(s,'exhibit',id),/dieses Jahr/);
 const price=heirloomWorth(s.person);
 assert.equal(netWorth(s.person),s.person.cash+price);
 s=act(s,'sell',id);
 assert.equal(s.person.heirlooms.length,0);
 assert.equal(s.person.cash,9500+price);
 assert.equal(isSaveGame(s),true);
});

test('heirloom stays in the year snapshot and survives the next generation',()=>{
 let s=advance(born(),22);s=act(s,'search');
 const item=structuredClone(s.person.heirlooms[0]);
 const searched=s.person.heirloomSearchDate;
 s=advance(s,1);
 assert.equal(s.person.heirlooms.length,1);
 s=applyAction(s,{type:'REWIND',years:1});
 assert.equal(s.person.age,22);
 assert.deepEqual(s.person.heirlooms,[item]);
 assert.equal(s.person.heirloomSearchDate,searched);
 s.person.relationships.push({id:'child-test',name:'Kind Test',kind:'Kind',gender:'weiblich',age:10,bond:80,alive:true});
 s.person.age=115;s.person.stats.health=0;
 s=applyAction(s,{type:'AGE'});
 assert.equal(s.person.alive,false);
 s=applyAction(s,{type:'NEW_GENERATION',id:'child-test'});
 assert.equal(s.person.generation,2);
 assert.deepEqual(s.person.heirlooms,[item]);
 assert.equal(s.person.heirloomSearchDate,searched);
 assert.equal(isSaveGame(s),true);
});

test('invalid collection data is rejected, while legacy saves remain valid',()=>{
 const s=advance(born(),18);
 assert.equal(isSaveGame(s),true);
 let t=act(s,'search');
 const item=t.person.heirlooms[0];
 for(const edit of [
  p=>{p.heirloomSearchDate='bad';},
  p=>{p.heirlooms[0].value=-1;},
  p=>{p.heirlooms[0].kind='<script>';},
  p=>{p.heirlooms[0].condition=Infinity;},
  p=>{p.heirlooms.push(structuredClone(item));}
 ]){
  const x=structuredClone(t);edit(x.person);assert.equal(isSaveGame(x),false);
 }
 assert.equal(isSaveGame(t),true);
 assert.ok(HEIRLOOM_CATALOG.length>=7);
});

test('prison blocks attic and collection actions; minors cannot sell',()=>{
 let s=advance(born(),8);
 s=act(s,'search');const id=s.person.heirlooms[0].id;
 s.person.cash=1000;
 s=act(s,'appraise',id);
 assert.throws(()=>act(s,'sell',id),/18 Jahren/);
 s.person.prisonYears=2;
 assert.throws(()=>act(s,'restore',id),/Haft/);
 assert.throws(()=>act(s,'search'),/Haft/);
 assert.equal(isSaveGame(s),true);
});

test('daily date is local ISO format and duplicate item identifiers cannot enter saves',()=>{
 assert.match(todayHeirloomKey(),/^\\d{4}-\\d{2}-\\d{2}$/);
 let s=advance(born(),18);
 s=act(s,'search');
 const cloned=structuredClone(s);
 cloned.person.heirlooms[0].id='bad-id';
 assert.equal(isSaveGame(cloned),false);
 assert.equal(isSaveGame(s),true);
});
