import test from 'node:test';
import assert from 'node:assert/strict';
import {createLife,applyAction,isSaveGame} from '../dist/app/engine/simulation.js';

const born=()=>createLife({name:'Sporttest',gender:'divers',country:'Deutschland',seed:38192});
function advance(s,n){for(let i=0;i<n;i++){if(s.person.pending)s=applyAction(s,{type:'EVENT',kind:s.person.pending.options[0].kind});s=applyAction(s,{type:'AGE'});}return s;}
function pro(){let s=advance(born(),18);s.person.cash=500000;s=applyAction(s,{type:'SPORT',key:'train',sport:'Fußball'});s.person.sportCareer.skill=100;s.person.sportCareer.fitness=100;s.person.sportCareer.reputation=80;return applyAction(s,{type:'SPORT',key:'tryout',league:'National'});}

test('sports are age-gated, specialize at first lesson, and preserve old schema-1 saves',()=>{
 let s=born();
 assert.equal(isSaveGame(s),true);
 assert.throws(()=>applyAction(s,{type:'SPORT',key:'train',sport:'Fußball'}),/acht/);
 s=advance(s,8);
 s=applyAction(s,{type:'SPORT',key:'train',sport:'Basketball'});
 assert.equal(s.person.sportCareer.sport,'Basketball');
 assert.ok(s.person.sportCareer.skill>0);
 assert.throws(()=>applyAction(s,{type:'SPORT',key:'train',sport:'Fußball'}),/spezialisiert/);
 s=applyAction(s,{type:'SPORT',key:'train',sport:'Basketball'});
 s=applyAction(s,{type:'SPORT',key:'train',sport:'Basketball'});
 assert.throws(()=>applyAction(s,{type:'SPORT',key:'train',sport:'Basketball'}),/dieses Jahr/);
 assert.throws(()=>applyAction(s,{type:'SPORT',key:'tryout',league:'Regional'}),/18/);
 assert.equal(isSaveGame(s),true);
 const legacy=structuredClone(s);delete legacy.person.sportCareer;
 assert.equal(isSaveGame(legacy),true);
});

test('professional trials sign fictional clubs, seasons pay wages and record results',()=>{
 let s=pro();
 const c=s.person.sportCareer;
 assert.equal(c.contract.league,'National');
 assert.equal(s.person.jobId,null);
 assert.ok(c.contract.salary>=90000);
 const before=s.person.cash;
 s=advance(s,1);
 assert.equal(s.person.age,19);
 assert.equal(s.person.sportCareer.seasons.length,1);
 assert.ok(s.person.sportCareer.seasons[0].earnings>0);
 assert.ok(s.person.cash>before);
 assert.equal(s.person.sportCareer.contract.yearsLeft,2);
 assert.equal(isSaveGame(s),true);
 s=advance(s,2);
 assert.equal(s.person.sportCareer.contract,null);
 assert.equal(s.person.sportCareer.seasons.length,3);
});

test('sports contract excludes full-time careers, acting and recording contracts',()=>{
 const s=pro();
 assert.throws(()=>applyAction(s,{type:'JOB',id:'retail'}),/Sportvertrag/);
 assert.throws(()=>applyAction(s,{type:'MUSIC',key:'audition',mode:'Solo',role:'Gesang'}),/Spezialvertrag/);
 assert.throws(()=>applyAction(s,{type:'ACTOR',key:'audition',offerId:'indie-film'}),/Sportvertrag/);
});

test('rehab, annual injury effects and time rewind keep consistent sports data',()=>{
 let s=pro();
 s.person.sportCareer.injuryYears=2;
 s.person.sportCareer.fitness=65;
 assert.throws(()=>applyAction(s,{type:'SPORT',key:'train',sport:'Fußball'}),/Verletzung/);
 assert.throws(()=>applyAction(s,{type:'SPORT',key:'tryout',league:'Regional'}),/Verletzung|Vertrag/);
 const before=s.person.cash;
 s=advance(s,1);
 assert.equal(s.person.sportCareer.injuryYears,1);
 assert.ok(s.person.sportCareer.seasons[0].earnings<Math.round(s.person.sportCareer.contract.salary*.76));
 s=applyAction(s,{type:'REWIND',years:1});
 assert.equal(s.person.age,18);
 assert.equal(s.person.sportCareer.injuryYears,2);
 assert.equal(s.person.sportCareer.seasons.length,0);
 assert.equal(s.person.cash,before);
 s=applyAction(s,{type:'SPORT',key:'recover'});
 assert.ok(s.person.cash<before);
 assert.equal(isSaveGame(s),true);
});

test('sponsors and salary negotiations have yearly quotas, retirement is permanent',()=>{
 let s=pro();
 s.person.fame=70;
 s=applyAction(s,{type:'SPORT',key:'sponsor'});
 assert.ok(s.person.cash>500000-120);
 assert.throws(()=>applyAction(s,{type:'SPORT',key:'sponsor'}),/dieses Jahr/);
 s=applyAction(s,{type:'SPORT',key:'negotiate'});
 assert.throws(()=>applyAction(s,{type:'SPORT',key:'negotiate'}),/dieses Jahr/);
 s=applyAction(s,{type:'SPORT',key:'retire'});
 assert.equal(s.person.sportCareer.retired,true);
 assert.equal(s.person.sportCareer.contract,null);
 assert.throws(()=>applyAction(s,{type:'SPORT',key:'tryout',league:'Regional'}),/beendet/);
});

test('sports saves reject manipulated results, clubs, money and invalid age',()=>{
 const s=pro();
 assert.equal(isSaveGame(s),true);
 const mutated=structuredClone(s);
 mutated.person.sportCareer.contract.salary=Infinity;
 assert.equal(isSaveGame(mutated),false);
 const forged=structuredClone(s);
 forged.person.sportCareer.contract.club='<script>';
 assert.equal(isSaveGame(forged),false);
 const damaged=structuredClone(s);
 damaged.person.sportCareer.injuryYears=-1;
 assert.equal(isSaveGame(damaged),false);
 const seasons=structuredClone(s);
 seasons.person.sportCareer.seasons=[{age:100,club:'foo',league:'National',victories:99,performance:101,earnings:-1,title:true}];
 assert.equal(isSaveGame(seasons),false);
});

test('emigration ends contracts, prison removes active players and new lives remain independent',()=>{
 let s=pro();
 s.person.cash+=10000;
 s=applyAction(s,{type:'EMIGRATE',country:'Portugal'});
 assert.equal(s.person.sportCareer.contract,null);
 let t=pro();t.person.prisonYears=2;
 t=advance(t,1);
 assert.equal(t.person.sportCareer.contract,null);
 assert.equal(isSaveGame(t),true);
 const another=born();
 assert.equal(another.person.sportCareer,undefined);
});
