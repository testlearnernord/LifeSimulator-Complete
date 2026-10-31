import test from 'node:test';
import assert from 'node:assert/strict';
import {createLife,applyAction,isSaveGame} from '../dist/app/engine/simulation.js';
import {ACHIEVEMENTS,RIBBONS,achievementProgress,chooseRibbon} from '../dist/app/engine/milestones.js';

const born=()=>createLife({name:'Meilenstein Test',gender:'divers',country:'Deutschland',seed:789123});
const act=s=>applyAction(s,{type:'CUSTOMIZE',stats:s.person.stats});

test('achievements unlock through gameplay, are unique and persist as metaprogress',()=>{
 let s=born();
 assert.equal(s.achievements,undefined);
 assert.equal(isSaveGame(s),true);
 s.person.age=18;s=act(s);
 assert.ok(s.achievements.includes('adult'));
 s=act(s);assert.equal(s.achievements.filter(x=>x==='adult').length,1);
 s.person.age=80;s=act(s);
 assert.ok(s.achievements.includes('senior')&&s.achievements.includes('eighty'));
 s.person.degree=true;s=act(s);
 assert.ok(s.achievements.includes('graduate'));
 s.person.cash=100000;s=act(s);
 assert.ok(s.achievements.includes('comfortable'));
 s.person.relationships.push({id:'baby',name:'Kind',kind:'Kind',gender:'divers',age:0,bond:80,alive:true});
 s=act(s);assert.ok(s.achievements.includes('parent'));
 assert.equal(isSaveGame(s),true);
});

test('career, family and collection achievements have deterministic progress',()=>{
 const s=born();
 assert.equal(achievementProgress(s.person,'collector'),0);
 s.person.heirlooms=[{id:'fund-20-test',kind:'uhr',foundAge:20,value:900,condition:80,appraised:false}];
 assert.equal(achievementProgress(s.person,'collector'),33);
 s.person.fighterCareer={style:'Boxen',skill:60,stamina:60,reputation:50,injuryYears:0,coach:false,league:false,retired:false,champion:true,titles:1,leagueWins:3,wins:3,losses:0,rival:null,bouts:[]};
 assert.equal(achievementProgress(s.person,'champion'),100);
 assert.equal(chooseRibbon(s.person),'champion');
 for(const a of ACHIEVEMENTS)for(const lang of ['de','en','pt']){assert.ok(a.title[lang]&&a.description[lang]);}
 for(const r of RIBBONS)for(const lang of ['de','en','pt']){assert.ok(r.title[lang]&&r.description[lang]);}
 assert.equal(new Set(ACHIEVEMENTS.map(a=>a.id)).size,ACHIEVEMENTS.length);
 assert.equal(new Set(RIBBONS.map(a=>a.id)).size,RIBBONS.length);
});

test('death grants one ribbon; rewind removes undone ribbon but keeps achievements',()=>{
 let s=born();s.person.age=115;s.person.stats.health=0;
 s=applyAction(s,{type:'AGE'});
 assert.equal(s.person.alive,false);
 assert.equal(s.ribbons.length,1);
 assert.equal(s.ribbons[0].generation,1);
 assert.equal(s.ribbons[0].age,116);
 assert.ok(s.achievements.includes('century'));
 assert.equal(isSaveGame(s),true);
 s=applyAction(s,{type:'REWIND',years:1});
 assert.equal(s.person.alive,true);
 assert.equal(s.ribbons.length,0);
 assert.ok(s.achievements.includes('century'));
 s=applyAction(s,{type:'AGE'});
 assert.equal(s.ribbons.length,1);
});

test('generation changes preserve ribbons and achievements without duplicates',()=>{
 let s=born();s.person.relationships.push({id:'successor',name:'Erbin',kind:'Kind',gender:'weiblich',age:15,bond:80,alive:true});
 s.person.age=115;s.person.stats.health=0;
 s=applyAction(s,{type:'AGE'});
 assert.equal(s.ribbons[0].kind,'family');
 s=applyAction(s,{type:'NEW_GENERATION',id:'successor'});
 assert.equal(s.person.generation,2);
 assert.equal(s.ribbons.length,1);
 assert.ok(s.achievements.includes('second-life'));
 assert.equal(isSaveGame(s),true);
});

test('optional legacy fields work; malformed milestone saves are rejected',()=>{
 const original=born();
 assert.equal(isSaveGame(original),true);
 const good=act(original);
 for(const mutation of [
  s=>{s.achievements=['adult','adult'];},
  s=>{s.achievements=['fabricated'];},
  s=>{s.achievements='adult';},
  s=>{s.ribbons=[{kind:'fake',generation:1,name:'A',age:20}];},
  s=>{s.ribbons=[{kind:'family',generation:1,name:'A',age:-2}];},
  s=>{s.ribbons=[{kind:'family',generation:1,name:'A',age:30},{kind:'ordinary',generation:1,name:'B',age:40}];}
 ]){
  const bad=structuredClone(good);mutation(bad);assert.equal(isSaveGame(bad),false);
 }
 assert.equal(isSaveGame(good),true);
});
