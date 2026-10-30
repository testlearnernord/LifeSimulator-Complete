import test from 'node:test';
import assert from 'node:assert/strict';
import {createLife,applyAction,isSaveGame} from '../dist/app/engine/simulation.js';
import {lifeSignals,advanceConnections,connectionEvent} from '../dist/app/engine/lifeConnections.js';

const born=()=>createLife({name:'Testfigur',country:'Deutschland',gender:'divers',seed:887766});
const advance=(state,years)=>{let s=state;for(let i=0;i<years&&s.person.alive;i++){if(s.person.pending)s=applyAction(s,{type:'EVENT',kind:s.person.pending.options[0].kind});s=applyAction(s,{type:'AGE'});}if(s.person.pending)s=applyAction(s,{type:'EVENT',kind:s.person.pending.options[0].kind});return s;};
const hooks={random:()=>0,log:()=>{},stat:()=>{},annual:()=>{}};

test('life situation signals explain finances, wellbeing and relationships without changing the save',()=>{
 const s=advance(born(),20);
 const first=structuredClone(s);
 s.person.cash=-12000;
 s.person.stats.health=22;
 s.person.relationships[0].bond=95;s.person.relationships[0].trust=90;
 const signals=lifeSignals(s.person);
 assert.ok(signals.some(x=>x.title==='Finanzielle Belastung'));
 assert.ok(signals.some(x=>x.title==='Gesundheit kritisch'));
 assert.ok(signals.length<=3);
 assert.ok(signals.every(x=>typeof x.detail==='string'&&x.detail.length>10));
 assert.equal(first.person.age,s.person.age);
 assert.ok(isSaveGame(s));
});

test('prison release prompts a real choice and preserves networks, with time rewind',()=>{
 let s=advance(born(),23);
 s.person.cash=1000;s.person.prisonYears=1;
 s.person.crimeCareer={skills:{shoplift:12},heat:28,respect:11,network:[{id:'old-contact',name:'Mika Test',origin:'Haft',trust:57,influence:36,lastMetAge:s.person.age,active:true}],rank:0,successes:2,failures:1,probationYears:0};
 const original=structuredClone(s);
 s=applyAction(s,{type:'AGE'});
 assert.equal(s.person.prisonYears,0);
 assert.equal(s.person.pending?.heading,'Freiheit und Neuanfang');
 assert.ok(s.person.pending.options.some(x=>x.kind==='cross:release-network'));
 assert.throws(()=>applyAction(s,{type:'AGE'}),/offene Entscheidung/);
 const oldHeat=s.person.crimeCareer.heat;
 s=applyAction(s,{type:'EVENT',kind:'cross:release-network'});
 assert.ok(s.person.crimeCareer.heat>oldHeat);
 assert.ok(s.person.crimeCareer.network.some(x=>x.id==='old-contact'));
 assert.equal(s.person.pending,null);
 assert.ok(isSaveGame(s));
 const rewind=applyAction(s,{type:'REWIND',years:1});
 assert.equal(rewind.person.age,original.person.age);
 assert.equal(rewind.person.prisonYears,1);
 assert.ok(isSaveGame(rewind));
});

test('released prisoners without connections see a valid supported reintegration option',()=>{
 let s=advance(born(),22);s.person.prisonYears=1;
 s=applyAction(s,{type:'AGE'});
 assert.equal(s.person.pending?.heading,'Freiheit und Neuanfang');
 assert.ok(!s.person.pending.options.some(x=>x.kind==='cross:release-network'));
 const before=s.person.stats.happiness;
 s=applyAction(s,{type:'EVENT',kind:'cross:release-support'});
 assert.ok(s.person.stats.happiness>=before);
 assert.ok(isSaveGame(s));
});

test('academic crisis offers a choice affecting grades and savegame consistency',()=>{
 let s=advance(born(),15);
 s.person.schoolRecord.performance=25;s.person.grades=25;
 assert.equal(connectionEvent(s,hooks),true);
 assert.equal(s.person.pending.heading,'Schulische Entscheidung');
 s=applyAction(s,{type:'EVENT',kind:'cross:school-plan'});
 assert.equal(s.person.grades,34);
 assert.equal(s.person.schoolRecord.performance,34);
 assert.ok(isSaveGame(s));
});

test('an office conflict has distinct consequences for boss relationship and health',()=>{
 let s=advance(born(),25);s=applyAction(s,{type:'JOB',id:'retail'});
 s.person.workplace.boss.bond=20;s.person.careerPerformance=25;
 assert.equal(connectionEvent(s,hooks),true);
 assert.equal(s.person.pending.heading,'Schwieriges Gespräch im Büro');
 const health=s.person.stats.health;
 s=applyAction(s,{type:'EVENT',kind:'cross:work-overtime'});
 assert.ok(s.person.careerPerformance>25);
 assert.ok(s.person.stats.health<health);
 assert.ok(isSaveGame(s));
});

test('relationship crisis can improve trust rather than awarding unrelated money',()=>{
 let s=advance(born(),26);
 s=applyAction(s,{type:'ACTIVITY',key:'date'});
 const partner=s.person.relationships.find(r=>r.kind==='Partner');
 partner.bond=18;partner.trust=22;
 assert.equal(connectionEvent(s,hooks),true);
 assert.equal(s.person.pending.heading,'Beziehung an einem Wendepunkt');
 const cash=s.person.cash;
 s=applyAction(s,{type:'EVENT',kind:'cross:partner-talk'});
 assert.ok(s.person.relationships.find(r=>r.id===partner.id).trust>22);
 assert.equal(s.person.cash,cash);
 assert.ok(isSaveGame(s));
});

test('old underworld ties present meaningful tradeoffs with a legitimate job',()=>{
 let s=advance(born(),27);s=applyAction(s,{type:'JOB',id:'retail'});
 s.person.careerPerformance=60;s.person.workplace.boss.bond=70;
 s.person.crimeCareer={skills:{},heat:28,respect:30,network:[{id:'old-ally',name:'Sam Test',origin:'Haft',trust:60,influence:40,lastMetAge:27,active:true}],rank:1,successes:3,failures:1,probationYears:0};
 assert.equal(connectionEvent(s,hooks),true);
 assert.equal(s.person.pending.heading,'Zwei Welten');
 const before=s.person.crimeCareer.heat;
 s=applyAction(s,{type:'EVENT',kind:'cross:crime-distance'});
 assert.ok(s.person.crimeCareer.heat<before);
 assert.ok(s.person.careerPerformance>60);
 assert.ok(isSaveGame(s));
});

test('social support and parent help link wellbeing and school achievement over years',()=>{
 const s=advance(born(),13);
 const parent=s.person.relationships.find(r=>r.kind==='Mutter');
 parent.bond=95;parent.trust=90;
 s.person.stats.happiness=20;
 s.person.schoolRecord.performance=51;s.person.grades=51;
 advanceConnections(s,{random:()=>0,stat:(key,n)=>s.person.stats[key]=Math.min(100,s.person.stats[key]+n),log:()=>{},annual:()=>{}});
 assert.equal(s.person.stats.happiness,24);
 assert.equal(s.person.schoolRecord.performance,53);
 assert.equal(s.person.grades,53);
 assert.ok(isSaveGame(s));
});

test('no spurious situation is created for a well-adjusted infant',()=>{
 const s=born();
 assert.equal(connectionEvent(s,hooks),false);
 assert.equal(s.person.pending,null);
 assert.ok(lifeSignals(s.person).length>=1);
});
