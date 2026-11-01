import test from 'node:test';
import assert from 'node:assert/strict';
import {createLife,applyAction,isSaveGame} from '../dist/app/engine/simulation.js';
import {spaceAction,SPACE_MISSIONS} from '../dist/app/engine/space.js';
import {translateText} from '../dist/app/i18n.js';

const born=()=>createLife({name:'Raumfahrttest',gender:'divers',country:'Deutschland',seed:88221,
 stats:{health:100,happiness:100,smarts:100,looks:100}});
function advance(s,years){
 for(let i=0;i<years;i++){
  if(s.person.pending)s=applyAction(s,{type:'EVENT',kind:s.person.pending.options[0].kind});
  s=applyAction(s,{type:'AGE'});
 }
 if(s.person.pending)s=applyAction(s,{type:'EVENT',kind:s.person.pending.options[0].kind});
 return s;
}
function academy(){
 let s=advance(born(),24);s.person.cash=250000;s.person.degree=true;
 for(let i=0;i<3;i++)s=applyAction(s,{type:'SPACE',key:'study'});
 for(let i=0;i<3;i++)s=applyAction(s,{type:'SPACE',key:'flight'});
 s=advance(s,1);
 for(let i=0;i<3;i++)s=applyAction(s,{type:'SPACE',key:'study'});
 for(let i=0;i<3;i++)s=applyAction(s,{type:'SPACE',key:'flight'});
 assert.ok(s.person.spaceCareer.knowledge>=60);
 assert.ok(s.person.spaceCareer.piloting>=55);
 s=applyAction(s,{type:'SPACE',key:'academy'});
 return s;
}
function employed(){
 let s=advance(academy(),2);
 assert.equal(s.person.spaceCareer.certified,true);
 s.person.spaceCareer.knowledge=100;
 s.person.spaceCareer.piloting=100;
 s.person.spaceCareer.fitness=100;
 s=applyAction(s,{type:'SPACE',key:'apply'});
 assert.equal(s.person.spaceCareer.employed,true);
 return s;
}
function hooks(s,random=()=>0){
 const p=s.person;
 return {
  random,
  log:()=>{},
  stat:(key,change)=>{p.stats[key]=Math.max(0,Math.min(100,p.stats[key]+change));},
  annual:(key,limit=1)=>{
   p.yearlyActions??={};
   const count=p.yearlyActions[key]||0;
   if(count>=limit)throw Error('Diese Aktivität kannst du dieses Jahr nicht öfter ausführen.');
   p.yearlyActions[key]=count+1;
  }
 };
}
test('optional schema-1 space career, age gates and yearly training quotas',()=>{
 let s=born();
 assert.equal(isSaveGame(s),true);
 assert.throws(()=>applyAction(s,{type:'SPACE',key:'study'}),/14/);
 s=advance(s,14);
 s=applyAction(s,{type:'SPACE',key:'study'});
 assert.ok(s.person.spaceCareer.knowledge>0);
 assert.throws(()=>applyAction(s,{type:'SPACE',key:'flight'}),/16/);
 s=applyAction(s,{type:'SPACE',key:'study'});
 s=applyAction(s,{type:'SPACE',key:'study'});
 assert.throws(()=>applyAction(s,{type:'SPACE',key:'study'}),/dieses Jahr/);
 assert.equal(isSaveGame(s),true);
 const legacy=structuredClone(s);delete legacy.person.spaceCareer;
 assert.equal(isSaveGame(legacy),true);
 assert.deepEqual(SPACE_MISSIONS,['Satellitenwartung','Orbitalforschung','Mondsonde']);
});
test('academy requires a degree and money, completes after two years, preserves rewind',()=>{
 let s=academy();
 assert.equal(s.person.spaceCareer.academyYears,2);
 assert.equal(s.person.spaceCareer.certified,false);
 const before=s.person.cash;
 s=advance(s,1);
 assert.equal(s.person.spaceCareer.academyYears,1);
 s=advance(s,1);
 assert.equal(s.person.spaceCareer.certified,true);
 assert.equal(s.person.spaceCareer.academyYears,0);
 assert.equal(isSaveGame(s),true);
 s=applyAction(s,{type:'REWIND',years:1});
 assert.equal(s.person.spaceCareer.academyYears,1);
 assert.equal(s.person.spaceCareer.certified,false);
 assert.ok(s.person.cash<=before);
 assert.equal(isSaveGame(s),true);
});
test('agency contract pays salary and excludes incompatible full-time careers',()=>{
 let s=employed();
 assert.equal(s.person.jobId,null);
 assert.throws(()=>applyAction(s,{type:'WORK',key:'apply',id:'retail'}),/Raumfahrtvertrag/);
 assert.throws(()=>applyAction(s,{type:'SPORT',key:'tryout',league:'Regional'}),/Raumfahrtvertrag/);
 assert.throws(()=>applyAction(s,{type:'STUDY'}),/Raumfahrtvertrag/);
 assert.throws(()=>applyAction(s,{type:'POLITICS',key:'launch'}),/Raumfahrtvertrag/);
 const before=s.person.cash;
 s=advance(s,1);
 assert.equal(s.person.spaceCareer.serviceYears,1);
 assert.ok(s.person.cash>before);
 assert.equal(isSaveGame(s),true);
});
test('research and deterministic missions promote through ranks and pay bonuses',()=>{
 const s=employed(),h=hooks(s);
 spaceAction(s,'research',undefined,h);
 spaceAction(s,'research',undefined,h);
 assert.throws(()=>spaceAction(s,'research',undefined,h),/dieses Jahr/);
 const before=s.person.cash;
 spaceAction(s,'mission','Satellitenwartung',h);
 spaceAction(s,'mission','Satellitenwartung',h);
 assert.equal(s.person.spaceCareer.missions.length,2);
 assert.equal(s.person.spaceCareer.missions[0].reward,4000);
 assert.equal(s.person.spaceCareer.rank,1);
 assert.equal(s.person.cash,before+8000);
 assert.throws(()=>spaceAction(s,'mission','Orbitalforschung',h),/dieses Jahr/);
 assert.equal(isSaveGame(s),true);
});
test('failed missions cause injuries; rehabilitation costs money and heals',()=>{
 let s=employed();
 const h=hooks(s,()=>.99);
 spaceAction(s,'mission','Satellitenwartung',h);
 assert.equal(s.person.spaceCareer.missions.at(-1).success,false);
 assert.equal(s.person.spaceCareer.missions.at(-1).reward,0);
 assert.equal(s.person.spaceCareer.injuryYears,1);
 assert.throws(()=>spaceAction(s,'mission','Satellitenwartung',h),/Rehabilitation/);
 const before=s.person.cash;
 s=applyAction(s,{type:'SPACE',key:'recover'});
 assert.equal(s.person.spaceCareer.injuryYears,0);
 assert.equal(s.person.cash,before-450);
 assert.equal(isSaveGame(s),true);
});
test('emigration and imprisonment end service, retirement blocks new applications',()=>{
 let s=employed();
 s=applyAction(s,{type:'EMIGRATE',country:'Portugal'});
 assert.equal(s.person.spaceCareer.employed,false);
 assert.equal(s.person.spaceCareer.certified,true);
 assert.equal(isSaveGame(s),true);
 s=advance(s,1);
 s=applyAction(s,{type:'SPACE',key:'apply'});
 s=applyAction(s,{type:'SPACE',key:'retire'});
 assert.equal(s.person.spaceCareer.retired,true);
 assert.throws(()=>applyAction(s,{type:'SPACE',key:'apply'}),/beendet/);
 let t=employed();t.person.prisonYears=2;
 t=advance(t,1);
 assert.equal(t.person.spaceCareer.employed,false);
 assert.equal(isSaveGame(t),true);
});
test('corrupted or forged space saves are rejected without changing legacy saves',()=>{
 const s=employed();
 for(const modify of [
  x=>x.person.spaceCareer.knowledge=Infinity,
  x=>x.person.spaceCareer.rank=9,
  x=>x.person.spaceCareer.academyYears=-1,
  x=>x.person.spaceCareer.missions=[{age:999,kind:'Mondsonde',success:true,reward:28000,discovery:false}],
  x=>x.person.spaceCareer.missions=[{age:27,kind:'<script>',success:true,reward:28000,discovery:false}],
  x=>x.person.spaceCareer.missions=[{age:27,kind:'Satellitenwartung',success:false,reward:4000,discovery:false}],
  x=>x.person.spaceCareer.retired=true
 ]){
  const bad=structuredClone(s);modify(bad);assert.equal(isSaveGame(bad),false);
 }
 const legacy=structuredClone(s);delete legacy.person.spaceCareer;
 assert.equal(isSaveGame(legacy),true);
});
test('space UI and validation messages translate to English and pt-PT without fallback',()=>{
 for(const source of [
  'Raumfahrtlaufbahn','Satellitenwartung','Missionschronik','Raumfahrt ist während der Haft nicht möglich.',
  'Die Mission scheitert. Du wirst verletzt und musst pausieren.','Einsatz mit Risiko · Prämie 4.000 €',
  'Verletzt: 1 Jahr(e) Rehabilitation','Raumfahrtprofi · Forschungszentrum'
 ]){
  assert.notEqual(translateText(source,'en'),source,source+' EN');
  assert.notEqual(translateText(source,'pt'),source,source+' pt');
 }
});
