import test from 'node:test';
import assert from 'node:assert/strict';
import {createLife,applyAction,isSaveGame} from '../dist/app/engine/simulation.js';
const born=()=>createLife({name:'Kampf Test',gender:'divers',country:'Deutschland',seed:78943,stats:{health:100,happiness:100,smarts:100,looks:100}});
function advance(s,n){for(let i=0;i<n;i++){if(s.person.pending)s=applyAction(s,{type:'EVENT',kind:s.person.pending.options[0].kind});s=applyAction(s,{type:'AGE'});}if(s.person.pending)s=applyAction(s,{type:'EVENT',kind:s.person.pending.options[0].kind});return s;}
function prepared(){let s=advance(born(),20);s.person.cash=200000;s=applyAction(s,{type:'FIGHTER',key:'train',style:'Boxen'});s.person.fighterCareer.skill=100;s.person.fighterCareer.stamina=100;s.person.fighterCareer.reputation=100;s.person.fighterCareer.wins=5;return s;}
test('fighter style, age limits, annual training and schema-1 legacy saves',()=>{
 let s=born();assert.throws(()=>applyAction(s,{type:'FIGHTER',key:'train',style:'Boxen'}),/14/);
 s=advance(s,14);s=applyAction(s,{type:'FIGHTER',key:'train',style:'Ringen'});
 assert.equal(s.person.fighterCareer.style,'Ringen');
 assert.throws(()=>applyAction(s,{type:'FIGHTER',key:'train',style:'Boxen'}),/Kampfstil/);
 s=applyAction(s,{type:'FIGHTER',key:'train',style:'Ringen'});
 s=applyAction(s,{type:'FIGHTER',key:'train',style:'Ringen'});
 assert.throws(()=>applyAction(s,{type:'FIGHTER',key:'train',style:'Ringen'}),/dieses Jahr/);
 const legacy=structuredClone(s);delete legacy.person.fighterCareer;
 assert.equal(isSaveGame(legacy),true);assert.equal(isSaveGame(s),true);
});
test('league qualification, rivalry, prize money, title fight and defense',()=>{
 let s=prepared();assert.throws(()=>applyAction(s,{type:'FIGHTER',key:'challenge'}),/Ligavertrag/);
 s=applyAction(s,{type:'FIGHTER',key:'join'});
 assert.equal(s.person.fighterCareer.league,true);assert.ok(s.person.fighterCareer.rival);
 const before=s.person.cash;s=applyAction(s,{type:'FIGHTER',key:'league'});
 assert.equal(s.person.fighterCareer.leagueWins,1);assert.ok(s.person.cash>before);
 s=applyAction(s,{type:'FIGHTER',key:'league'});
 s.person.fighterCareer.injuryYears=0;s.person.fighterCareer.stamina=100;
 assert.throws(()=>applyAction(s,{type:'FIGHTER',key:'league'}),/dieses Jahr/);
 s=advance(s,1);s.person.fighterCareer.stamina=100;
 s=applyAction(s,{type:'FIGHTER',key:'league'});assert.equal(s.person.fighterCareer.leagueWins,3);s.person.fighterCareer.injuryYears=0;
 s.person.fighterCareer.stamina=100;s=applyAction(s,{type:'FIGHTER',key:'challenge'});
 assert.equal(s.person.fighterCareer.champion,true);assert.equal(s.person.fighterCareer.titles,1);assert.equal(isSaveGame(s),true);
 s=advance(s,1);s.person.fighterCareer.stamina=100;s=applyAction(s,{type:'FIGHTER',key:'defend'});
 assert.equal(s.person.fighterCareer.titles,2);assert.equal(isSaveGame(s),true);
});
test('coaching, sparring and annual league stipend change persistent state',()=>{
 let s=prepared();s=applyAction(s,{type:'FIGHTER',key:'coach'});
 assert.equal(s.person.fighterCareer.coach,true);
 assert.throws(()=>applyAction(s,{type:'FIGHTER',key:'coach'}),/bereits/);
 s=applyAction(s,{type:'FIGHTER',key:'spar'});s.person.fighterCareer.injuryYears=0;
 assert.equal(s.person.fighterCareer.bouts.length,1);assert.equal(s.person.fighterCareer.wins,5);
 s=applyAction(s,{type:'FIGHTER',key:'join'});const balance=s.person.cash;
 s=advance(s,1);assert.ok(s.person.cash>balance-9500);assert.equal(s.person.fighterCareer.league,true);
});
test('injury, prison, retirement and rewind keep fighter data consistent',()=>{
 let s=prepared();s=applyAction(s,{type:'FIGHTER',key:'join'});
 s.person.fighterCareer.injuryYears=1;
 assert.throws(()=>applyAction(s,{type:'FIGHTER',key:'league'}),/Verletzung/);
 const before=s.person.cash;s=advance(s,1);
 assert.equal(s.person.fighterCareer.injuryYears,0);
 s=applyAction(s,{type:'REWIND',years:1});
 assert.equal(s.person.fighterCareer.injuryYears,1);assert.equal(s.person.cash,before);
 s.person.prisonYears=2;s=advance(s,1);
 assert.equal(s.person.fighterCareer.league,false);assert.equal(isSaveGame(s),true);
 let t=prepared();t=applyAction(t,{type:'FIGHTER',key:'join'});
 t=applyAction(t,{type:'FIGHTER',key:'retire'});
 assert.equal(t.person.fighterCareer.retired,true);
 assert.throws(()=>applyAction(t,{type:'FIGHTER',key:'join'}),/beendet/);
});
test('league blocks conflicting jobs and professional contracts',()=>{
 let s=prepared();s=applyAction(s,{type:'FIGHTER',key:'join'});
 assert.throws(()=>applyAction(s,{type:'JOB',id:'retail'}),/Kampfliga/);
 assert.throws(()=>applyAction(s,{type:'WORK',key:'apply',id:'retail'}),/Kampfliga/);
 assert.throws(()=>applyAction(s,{type:'SPORT',key:'tryout',league:'Regional'}),/Kampfliga/);
});
test('save validation rejects forged opponents and invalid numbers',()=>{
 const s=prepared();
 for(const mutate of [c=>{c.skill=Infinity;},c=>{c.stamina=-1;},c=>{c.rival='<script>';},
  c=>{c.bouts=[{age:300,kind:'Liga',opponent:'Fake',won:true,payout:-10}];},c=>{c.champion=true;}])
 {const copy=structuredClone(s);mutate(copy.person.fighterCareer);assert.equal(isSaveGame(copy),false);}
 assert.equal(isSaveGame(s),true);
});
