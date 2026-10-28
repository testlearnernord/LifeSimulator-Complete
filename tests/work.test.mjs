import test from 'node:test';
import assert from 'node:assert/strict';
import {createLife,applyAction,isSaveGame} from '../dist/app/engine/simulation.js';

function adult(seed=231){
 let s=createLife({name:'Arbeitswelt Test',gender:'divers',country:'Deutschland',seed});
 while(s.person.age<22){
  if(s.person.pending)s=applyAction(s,{type:'EVENT',kind:s.person.pending.options[0].kind});
  s=applyAction(s,{type:'AGE'});
 }
 if(s.person.pending)s=applyAction(s,{type:'EVENT',kind:s.person.pending.options[0].kind});
 return s;
}
function nextYear(s){
 if(s.person.pending)s=applyAction(s,{type:'EVENT',kind:s.person.pending.options[0].kind});
 return applyAction(s,{type:'AGE'});
}
test('successful interview creates independent boss and colleagues',()=>{
 let s=adult();
 s.person.stats.smarts=100;s.person.stats.looks=100;
 s=applyAction(s,{type:'WORK',key:'apply',id:'technician'});
 assert.equal(s.person.jobId,'technician');
 assert.equal(s.person.workplace.jobId,'technician');
 assert.equal(s.person.workplace.coworkers.length,2);
 assert.equal(new Set([s.person.workplace.boss.id,...s.person.workplace.coworkers.map(c=>c.id)]).size,3);
 assert.ok(isSaveGame(s));
});
test('rejections do not delete current job, and interviews have annual limit',()=>{
 let s=adult(222);
 s=applyAction(s,{type:'JOB',id:'retail'});
 s.person.stats.smarts=0;s.person.stats.looks=0;s.person.careerPerformance=0;
 for(let i=0;i<3;i++)s=applyAction(s,{type:'WORK',key:'apply',id:'driver'});
 assert.equal(s.person.jobId,'retail');
 assert.equal(s.person.workplace.jobId,'retail');
 assert.equal(s.person.yearlyActions['work:interview'],3);
 assert.throws(()=>applyAction(s,{type:'WORK',key:'apply',id:'driver'}),/dieses Jahr/);
 assert.ok(isSaveGame(s));
});
test('workplace conversations, teamwork and disputes affect performance and relationships',()=>{
 let s=applyAction(adult(119),{type:'JOB',id:'retail'});
 const id=s.person.workplace.coworkers[0].id;
 const before=s.person.careerPerformance;
 s=applyAction(s,{type:'WORK',key:'teamwork',id});
 assert.ok(s.person.careerPerformance>before);
 assert.throws(()=>applyAction(s,{type:'WORK',key:'teamwork',id}),/dieses Jahr/);
 s=applyAction(s,{type:'WORK',key:'talk',id});
 s=applyAction(s,{type:'WORK',key:'talk',id});
 assert.throws(()=>applyAction(s,{type:'WORK',key:'talk',id}),/dieses Jahr/);
 const bond=s.person.workplace.coworkers[0].bond;
 s=applyAction(s,{type:'WORK',key:'conflict',id});
 assert.ok(s.person.workplace.coworkers[0].bond<bond);
 assert.ok(isSaveGame(s));
});
test('excellent performance and boss trust enable a paid promotion',()=>{
 let s=applyAction(adult(12),{type:'JOB',id:'retail'});
 s.person.jobYears=3;s.person.careerPerformance=100;s.person.workplace.boss.bond=100;
 s=applyAction(s,{type:'WORK',key:'promotion'});
 assert.equal(s.person.workplace.rank,1);
 assert.ok(s.person.salaryBonus>0);
 assert.throws(()=>applyAction(s,{type:'WORK',key:'promotion'}),/dieses Jahr/);
 assert.ok(isSaveGame(s));
});
test('persistent poor performance triggers warnings and dismissal over years',()=>{
 let s=applyAction(adult(44),{type:'JOB',id:'retail'});
 s.person.careerPerformance=0;s.person.workplace.boss.bond=0;
 for(let i=0;i<3;i++)s=nextYear(s);
 assert.equal(s.person.jobId,null);
 assert.equal(s.person.workplace,null);
 assert.ok(isSaveGame(s));
});
test('legacy saves and rewind remain compatible with optional workplace state',()=>{
 let s=applyAction(adult(67),{type:'JOB',id:'retail'});
 delete s.person.workplace;
 assert.ok(isSaveGame(s));
 s=nextYear(s);
 assert.ok(s.person.workplace);
 assert.ok(isSaveGame(s));
 s=applyAction(s,{type:'REWIND',years:1});
 assert.equal(s.person.workplace,undefined);
 assert.ok(isSaveGame(s));
 s=applyAction(s,{type:'WORK',key:'introduce'});
 assert.ok(s.person.workplace);
 assert.ok(isSaveGame(s));
});
test('malformed workplace contacts and values are rejected',()=>{
 const s=applyAction(adult(17),{type:'JOB',id:'retail'});
 assert.ok(isSaveGame(s));
 const broken=structuredClone(s);
 broken.person.workplace.boss.bond=Infinity;
 assert.equal(isSaveGame(broken),false);
 broken.person.workplace.boss.bond=70;
 broken.person.workplace.coworkers[0].id=broken.person.workplace.boss.id;
 assert.equal(isSaveGame(broken),false);
});
