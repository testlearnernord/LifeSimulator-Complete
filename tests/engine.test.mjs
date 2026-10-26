import test from 'node:test';
import assert from 'node:assert/strict';
import {createLife,applyAction,isSaveGame,netWorth} from '../dist/app/engine/simulation.js';
const born=()=>createLife({name:'Testfigur',gender:'divers',country:'Deutschland',seed:123456});
function advance(s,n){for(let i=0;i<n;i++){if(!s.person.alive)break;if(s.person.pending)s=applyAction(s,{type:'EVENT',kind:s.person.pending.options[0].kind});s=applyAction(s,{type:'AGE'});}return s;}
test('deterministic initial stats and independent snapshots',()=>{const a=born(),b=born();assert.deepEqual(a.person.stats,b.person.stats);const c=applyAction(a,{type:'ACTIVITY',key:'read'});assert.notEqual(c.person.stats.smarts,a.person.stats.smarts);assert.equal(a.person.age,0);});
test('a newborn cannot take adult-only actions',()=>{const s=born();assert.throws(()=>applyAction(s,{type:'JOB',id:'engineer'}));assert.throws(()=>applyAction(s,{type:'ACTIVITY',key:'crime'}));});
test('age progression, education, and annual finances',()=>{let s=advance(born(),18);assert.equal(s.person.age,18);assert.equal(s.person.school,'Abgeschlossen');s=applyAction(s,{type:'JOB',id:'retail'});s=advance(s,1);assert.ok(s.person.cash>0);assert.equal(s.person.jobYears,1);});
test('relationships and generation survival data',()=>{let s=advance(born(),18);s=applyAction(s,{type:'ACTIVITY',key:'date'});const partner=s.person.relationships.find(x=>x.kind==='Partner');assert.ok(partner);s=applyAction(s,{type:'RELATION',id:partner.id,key:'talk'});assert.ok(s.person.relationships.find(x=>x.id===partner.id).bond>partner.bond);});
test('job prerequisites are enforced',()=>{let s=advance(born(),18);assert.throws(()=>applyAction(s,{type:'JOB',id:'doctor'}));s=applyAction(s,{type:'JOB',id:'retail'});assert.equal(s.person.jobId,'retail');});
test('buy and sell adjust money and inventory',()=>{let s=advance(born(),18);s.person.cash=100000;s=applyAction(s,{type:'BUY',id:'car-small'});assert.equal(s.person.assets.length,1);assert.equal(netWorth(s.person),100000);s=applyAction(s,{type:'SELL',id:s.person.assets[0].id});assert.equal(s.person.assets.length,0);assert.equal(s.person.cash,98875);});
test('save schema validation catches corruption',()=>{const s=born();assert.equal(isSaveGame(s),true);assert.equal(isSaveGame({...s,schema:99}),false);assert.equal(isSaveGame({...s,person:{...s.person,stats:{...s.person.stats,health:NaN}}}),false);});
test('long simulation remains bounded and valid',()=>{for(let seed=1;seed<=80;seed++){let s=createLife({name:'Bot',gender:'divers',country:'Deutschland',seed});for(let i=0;i<130&&s.person.alive;i++){if(s.person.pending)s=applyAction(s,{type:'EVENT',kind:s.person.pending.options[0].kind});s=applyAction(s,{type:'AGE'});assert.ok(isSaveGame(s));}assert.ok(s.person.age<=130);assert.ok(!s.person.alive);}});
test('country changes preserve independent game snapshots',()=>{let s=advance(born(),18);s.person.cash=8000;const next=applyAction(s,{type:'EMIGRATE',country:'Portugal'});assert.equal(next.person.country,'Portugal');assert.equal(s.person.country,'Deutschland');assert.equal(next.person.cash,4500);});
test('closed event must be resolved before next year',()=>{let s=advance(born(),3);let found=false;for(let i=0;i<45;i++){if(s.person.pending){found=true;assert.throws(()=>applyAction(s,{type:'AGE'}));s=applyAction(s,{type:'EVENT',kind:s.person.pending.options[0].kind});break;}s=applyAction(s,{type:'AGE'});}assert.ok(found);assert.equal(s.person.pending,null);});
test('family successor keeps family fortune in a new character',()=>{let s=advance(born(),18);s=applyAction(s,{type:'ACTIVITY',key:'date'});for(let i=0;i<10&&!s.person.relationships.some(r=>r.kind==='Kind');i++)s=applyAction(s,{type:'ACTIVITY',key:'child'});const child=s.person.relationships.find(r=>r.kind==='Kind');assert.ok(child);s.person.cash=100000;s.person.age=115;s.person.stats.health=1;s=applyAction(s,{type:'AGE'});assert.equal(s.person.alive,false);const next=applyAction(s,{type:'NEW_GENERATION',id:child.id});assert.equal(next.person.name,child.name);assert.equal(next.person.gender,child.gender);assert.equal(next.person.generation,2);assert.equal(next.ancestry.length,1);assert.ok(next.person.cash>50000);});
test('deep save validator rejects fabricated relationship bond',()=>{let s=born();s.person.relationships[0].bond='80%" onfocus="alert(1)';assert.equal(isSaveGame(s),false);});


test('prison blocks all outside crime actions, jobs and purchases',()=>{
 let s=advance(born(),18);
 s.person.prisonYears=3;
 assert.throws(()=>applyAction(s,{type:'ACTIVITY',key:'crime:burglary'}),/Haft/);
 assert.throws(()=>applyAction(s,{type:'ACTIVITY',key:'date'}),/Haft/);
 assert.throws(()=>applyAction(s,{type:'JOB',id:'retail'}),/Haft/);
 s.person.cash=999999;
 assert.throws(()=>applyAction(s,{type:'BUY',id:'car-small'}),/Haft/);
});
test('inmates have playable options and actions reset annually',()=>{
 let s=advance(born(),20);
 s.person.prisonYears=3;
 s=applyAction(s,{type:'ACTIVITY',key:'prison:library'});
 s=applyAction(s,{type:'ACTIVITY',key:'prison:library'});
 assert.throws(()=>applyAction(s,{type:'ACTIVITY',key:'prison:library'}),/dieses Jahr/);
 s=applyAction(s,{type:'AGE'});
 if(s.person.pending)s=applyAction(s,{type:'EVENT',kind:s.person.pending.options[0].kind});
 assert.equal(s.person.prisonYears,2);
 s=applyAction(s,{type:'ACTIVITY',key:'prison:job'});
 assert.ok(s.person.cash>-20000);
 assert.ok(isSaveGame(s));
});
test('crime attempt limit applies across crime types and old saves remain valid',()=>{
 let s=advance(born(),18);
 assert.equal(isSaveGame(s),true);
 for(const key of ['crime:shoplift','crime:pickpocket']){
   s=applyAction(s,{type:'ACTIVITY',key});
   s.person.prisonYears=0; // force freedom only to isolate annual quota
 }
 assert.throws(()=>applyAction(s,{type:'ACTIVITY',key:'crime:burglary'}),/dieses Jahr/);
 assert.equal(s.person.yearlyActions.crime,2);
});
test('hard work affects performance, is limited per year and leads to bonuses',()=>{
 let s=advance(born(),18);
 s=applyAction(s,{type:'JOB',id:'retail'});
 const original=s.person.careerPerformance;
 s=applyAction(s,{type:'ACTIVITY',key:'workhard'});
 assert.ok(s.person.careerPerformance>original);
 assert.throws(()=>applyAction(s,{type:'ACTIVITY',key:'workhard'}),/dieses Jahr/);
 s=advance(s,1);
 assert.doesNotThrow(()=>applyAction(s,{type:'ACTIVITY',key:'workhard'}));
 for(let i=0;i<2;i++){s.person.careerPerformance=98;s=advance(s,1);}
 assert.ok(s.person.salaryBonus>=0);
 assert.ok(isSaveGame(s));
});
test('gifts and shared time affect social bond and money',()=>{
 let s=advance(born(),20);
 const r=s.person.relationships[0];
 s.person.cash=1000;
 const balance=s.person.cash;
 s=applyAction(s,{type:'RELATION',id:r.id,key:'gift'});
 assert.equal(s.person.cash,balance-100);
 assert.ok(s.person.relationships[0].bond>=r.bond);
 assert.throws(()=>applyAction(s,{type:'RELATION',id:r.id,key:'gift'}),/dieses Jahr/);
 s=applyAction(s,{type:'RELATION',id:r.id,key:'time'});
 assert.ok(isSaveGame(s));
});
test('optional new progress fields are validated and legacy saves work',()=>{
 const s=born();
 assert.ok(isSaveGame(s));
 assert.equal(isSaveGame({...s,person:{...s.person,yearlyActions:{gym:'NAN'}}}),false);
 assert.equal(isSaveGame({...s,person:{...s.person,careerPerformance:-5}}),false);
 assert.equal(isSaveGame({...s,person:{...s.person,salaryBonus:Infinity}}),false);
});
