import test from 'node:test';
import assert from 'node:assert/strict';
import {createLife,applyAction,isSaveGame,netWorth} from '../dist/app/engine/simulation.js';
const born=()=>createLife({name:'Testfigur',gender:'divers',country:'Deutschland',seed:123456});
function advance(s,n){for(let i=0;i<n;i++){if(!s.person.alive)break;if(s.person.pending)s=applyAction(s,{type:'EVENT',kind:s.person.pending.options[0].kind});s=applyAction(s,{type:'AGE'});}if(s.person.pending)s=applyAction(s,{type:'EVENT',kind:s.person.pending.options[0].kind});return s;}
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
 if(s.person.pending)s=applyAction(s,{type:'EVENT',kind:s.person.pending.options[0].kind});
 s.person.prisonYears=3;
 s=applyAction(s,{type:'ACTIVITY',key:'prison:library'});
 s=applyAction(s,{type:'ACTIVITY',key:'prison:library'});
 assert.throws(()=>applyAction(s,{type:'ACTIVITY',key:'prison:library'}),/dieses Jahr/);
 s=applyAction(s,{type:'AGE'});
 if(s.person.pending)s=applyAction(s,{type:'EVENT',kind:s.person.pending.options[0].kind});
 assert.equal(s.person.prisonYears,2);
 const beforeWork=s.person.cash;
 s=applyAction(s,{type:'ACTIVITY',key:'prison:job'});
 assert.equal(s.person.cash,beforeWork+80);
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
 if(s.person.pending)s=applyAction(s,{type:'EVENT',kind:s.person.pending.options[0].kind});
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


test('free admin character designer overrides initial random attributes',()=>{
 const s=createLife({name:'Custom',gender:'weiblich',country:'Deutschland',seed:55,stats:{health:99,happiness:31,smarts:77,looks:4}});
 assert.deepEqual(s.person.stats,{health:99,happiness:31,smarts:77,looks:4});
 assert.equal(isSaveGame(s),true);
});
test('editing life attributes is persistent and rejects invalid values',()=>{
 const s=born();
 const changed=applyAction(s,{type:'CUSTOMIZE',stats:{health:100,happiness:90,smarts:80,looks:70}});
 assert.deepEqual(changed.person.stats,{health:100,happiness:90,smarts:80,looks:70});
 assert.notDeepEqual(s.person.stats,changed.person.stats);
 assert.throws(()=>applyAction(s,{type:'CUSTOMIZE',stats:{health:101,happiness:50,smarts:50,looks:50}}),/Ungültig/);
 assert.throws(()=>createLife({name:'Broken',gender:'divers',country:'Deutschland',seed:42,stats:{health:NaN}}),/Ungültig/);
 assert.equal(isSaveGame(changed),true);
});


const resolved=s=>s.person.pending?applyAction(s,{type:'EVENT',kind:s.person.pending.options[0].kind}):s;
test('social platforms enforce age, joining and realistic annual posting limits',()=>{
 let s=born();
 assert.throws(()=>applyAction(s,{type:'SOCIAL',key:'join',platform:'YouTube'}),/13/);
 s=resolved(advance(s,13));
 s=applyAction(s,{type:'SOCIAL',key:'join',platform:'YouTube'});
 assert.equal(s.person.social.YouTube.followers,0);
 for(let i=0;i<3;i++)s=applyAction(s,{type:'SOCIAL',key:'post',platform:'YouTube'});
 assert.equal(s.person.social.YouTube.posts,3);
 assert.ok(s.person.social.YouTube.followers>0);
 assert.throws(()=>applyAction(s,{type:'SOCIAL',key:'post',platform:'YouTube'}),/dieses Jahr/);
 assert.throws(()=>applyAction(s,{type:'SOCIAL',key:'sponsor',platform:'YouTube'}),/10.000/);
 assert.ok(isSaveGame(s));
});
test('social sponsorship pays from followers with one sponsor per year',()=>{
 let s=resolved(advance(born(),18));
 s=applyAction(s,{type:'SOCIAL',key:'join',platform:'Instagram'});
 s.person.social.Instagram.followers=45000;
 const original=s.person.cash;
 s=applyAction(s,{type:'SOCIAL',key:'sponsor',platform:'Instagram'});
 assert.ok(s.person.cash>original);
 assert.throws(()=>applyAction(s,{type:'SOCIAL',key:'sponsor',platform:'Instagram'}),/dieses Jahr/);
 s=resolved(applyAction(s,{type:'AGE'}));
 assert.ok(s.person.social.Instagram.followers<=45000);
 assert.ok(isSaveGame(s));
});
test('business requires capital and contains separate company books',()=>{
 let s=resolved(advance(born(),22));
 s.person.cash=100000;
 s=applyAction(s,{type:'BUSINESS',key:'open',sector:'technology'});
 assert.equal(s.person.cash,10000);
 assert.equal(s.person.business.cash,90000);
 assert.throws(()=>applyAction(s,{type:'BUSINESS',key:'open',sector:'cafe'}),/bereits/);
 s=applyAction(s,{type:'BUSINESS',key:'develop'});
 s=applyAction(s,{type:'BUSINESS',key:'market'});
 s=applyAction(s,{type:'BUSINESS',key:'hire'});
 assert.equal(s.person.business.staff,2);
 assert.ok(s.person.business.quality>45);
 assert.ok(s.person.business.brand>15);
 assert.ok(isSaveGame(s));
});
test('business can go bankrupt, and ownership can be sold for cash',()=>{
 let s=resolved(advance(born(),25));
 s.person.cash=50000;
 s=applyAction(s,{type:'BUSINESS',key:'open',sector:'cafe'});
 s.person.business.cash=-1000000;
 s=resolved(applyAction(s,{type:'AGE'}));
 assert.equal(s.person.business,null);
 let t=resolved(advance(born(),18));
 t.person.cash=50000;
 t=applyAction(t,{type:'BUSINESS',key:'open',sector:'cafe'});
 const cash=t.person.cash;
 t=applyAction(t,{type:'BUSINESS',key:'sell'});
 assert.equal(t.person.business,null);
 assert.ok(t.person.cash>cash);
 assert.ok(isSaveGame(t));
});
test('landlord property ownership supports tenants, repairs and rental income',()=>{
 let s=resolved(advance(born(),21));
 s.person.cash=300000;
 s=applyAction(s,{type:'BUY',id:'house-small'});
 const id=s.person.assets[0].id;
 s=applyAction(s,{type:'RENTAL',key:'advertise',id});
 assert.ok(s.person.assets[0].rental);
 s.person.assets[0].rental.occupied=true;
 const before=s.person.cash;
 s=resolved(applyAction(s,{type:'AGE'}));
 assert.ok(s.person.assets[0].rental.condition<90);
 assert.ok(s.person.cash>=before-50000);
 assert.ok(isSaveGame(s));
});
test('prison excludes business and social actions and new save fields are validated',()=>{
 let s=resolved(advance(born(),21));
 s.person.prisonYears=2;
 assert.throws(()=>applyAction(s,{type:'BUSINESS',key:'open',sector:'cafe'}),/Haft/);
 assert.throws(()=>applyAction(s,{type:'SOCIAL',key:'join',platform:'TikTok'}),/Haft/);
 s.person.prisonYears=0;
 s=applyAction(s,{type:'SOCIAL',key:'join',platform:'TikTok'});
 assert.equal(isSaveGame(s),true);
 assert.equal(isSaveGame({...s,person:{...s.person,fame:Infinity}}),false);
 assert.equal(isSaveGame({...s,person:{...s.person,social:{TikTok:{followers:-2,posts:1,warnings:0}}}}),false);
 assert.equal(isSaveGame({...s,person:{...s.person,business:{sector:'technology',name:'Test',cash:0,staff:-1,quality:5,brand:5,age:0}}}),false);
});


test('time machine rewinds complete character state and truncates future history',()=>{
 let s=advance(born(),6);
 if(s.person.pending)s=applyAction(s,{type:'EVENT',kind:s.person.pending.options[0].kind});
 const before=s.person.age;
 const originalCash=s.person.cash;
 s.person.cash=9999;
 s=applyAction(s,{type:'AGE'});
 assert.equal(s.person.age,before+1);
 assert.ok(s.checkpoints?.length);
 s=applyAction(s,{type:'REWIND',years:1});
 assert.equal(s.person.age,before);
 assert.equal(s.person.cash,9999);
 assert.ok(isSaveGame(s));
 assert.throws(()=>applyAction(s,{type:'REWIND',years:7}),/Ungültige/);
 const old=born();assert.throws(()=>applyAction(old,{type:'REWIND',years:1}),/Speicherpunkt/);
 assert.ok(originalCash!==9999);
});
test('time machine can restore an alive state after death',()=>{
 let s=born();
 s.person.age=116;s.person.stats.health=0;
 s=applyAction(s,{type:'AGE'});
 assert.equal(s.person.alive,false);
 s=applyAction(s,{type:'REWIND',years:1});
 assert.equal(s.person.age,116);
 assert.equal(s.person.alive,true);
 assert.ok(isSaveGame(s));
});
test('golden pacifier creates selected triplets with persistent talents',()=>{
 let s=advance(born(),20);
 if(s.person.pending)s=applyAction(s,{type:'EVENT',kind:s.person.pending.options[0].kind});
 if(!s.person.relationships.some(r=>r.kind==='Partner'&&r.alive))s=applyAction(s,{type:'ACTIVITY',key:'date'});
 const start=s.person.relationships.filter(r=>r.kind==='Kind').length;
 s=applyAction(s,{type:'BIRTH',count:3,gender:'weiblich',talent:'sport'});
 const children=s.person.relationships.filter(r=>r.kind==='Kind');
 assert.equal(children.length,start+3);
 assert.ok(children.slice(-3).every(r=>r.gender==='weiblich'&&r.talent==='sport'));
 assert.throws(()=>applyAction(s,{type:'BIRTH',count:3,gender:'weiblich',talent:'sport'}),/dieses Jahr/);
 assert.ok(isSaveGame(s));
});
test('release card ends imprisonment and clears record',()=>{
 const s=born();s.person.prisonYears=4;s.person.record=true;
 const released=applyAction(s,{type:'PREMIUM',key:'jail-card'});
 assert.equal(released.person.prisonYears,0);
 assert.equal(released.person.record,false);
 assert.equal(s.person.prisonYears,4);
 assert.throws(()=>applyAction(released,{type:'PREMIUM',key:'jail-card'}),/nicht im Gefängnis/);
});
test('golden diploma is immediate, capped and career-compatible',()=>{
 let s=advance(born(),18);
 if(s.person.pending)s=applyAction(s,{type:'EVENT',kind:s.person.pending.options[0].kind});
 s=applyAction(s,{type:'PREMIUM',key:'golden-diploma',subject:'Medizin'});
 s=applyAction(s,{type:'PREMIUM',key:'golden-diploma',subject:'Ingenieurwesen'});
 assert.equal(s.person.degree,true);
 assert.deepEqual(s.person.degrees,['Medizin','Ingenieurwesen']);
 assert.equal(s.person.universityYears,0);
 assert.throws(()=>applyAction(s,{type:'PREMIUM',key:'golden-diploma',subject:'Rechtswissenschaften'}),/maximal zwei/);
 assert.ok(isSaveGame(s));
});
test('Hollywood Star requires an eligible occupation and grants instant fame',()=>{
 let s=advance(born(),18);
 if(s.person.pending)s=applyAction(s,{type:'EVENT',kind:s.person.pending.options[0].kind});
 assert.throws(()=>applyAction(s,{type:'PREMIUM',key:'hollywood-star'}),/Beruf/);
 s.person.stats.smarts=90;
 s=applyAction(s,{type:'JOB',id:'writer'});
 s=applyAction(s,{type:'PREMIUM',key:'hollywood-star'});
 assert.ok(s.person.fame>=80);
 assert.ok(isSaveGame(s));
});
test('premium checkpoints and child talent validation reject corruption',()=>{
 const s=born();
 assert.ok(isSaveGame(s));
 assert.equal(isSaveGame({...s,checkpoints:[{age:500,person:s.person,seed:s.seed}]}),false);
 assert.equal(isSaveGame({...s,person:{...s.person,degrees:['Medizin','Medizin']}}),false);
 const bad=structuredClone(s);bad.person.relationships[0].talent='invalid';
 assert.equal(isSaveGame(bad),false);
});


test('investor supports paid trades with bounded quantities, positions and fair sale proceeds',()=>{
 let s=advance(born(),20);
 if(s.person.pending)s=applyAction(s,{type:'EVENT',kind:s.person.pending.options[0].kind});
 s.person.cash=100000;
 const start=s.person.cash;
 s=applyAction(s,{type:'INVEST',key:'buy',assetId:'equity',quantity:5});
 assert.equal(s.person.investments[0].quantity,5);
 assert.ok(s.person.cash<start);
 assert.ok(netWorth(s.person)<start);
 assert.throws(()=>applyAction(s,{type:'INVEST',key:'buy',assetId:'equity',quantity:0}),/zwischen/);
 assert.throws(()=>applyAction(s,{type:'INVEST',key:'sell',assetId:'equity',quantity:6}),/nicht genug/);
 s=applyAction(s,{type:'INVEST',key:'sell',assetId:'equity',quantity:5});
 assert.equal(s.person.investments.length,0);
 assert.ok(s.person.cash<start);
 assert.ok(isSaveGame(s));
});
test('investment markets change on aging and bond or equity holdings earn income',()=>{
 let s=advance(born(),20);
 if(s.person.pending)s=applyAction(s,{type:'EVENT',kind:s.person.pending.options[0].kind});
 s.person.cash=100000;
 s=applyAction(s,{type:'INVEST',key:'buy',assetId:'bond',quantity:100});
 const price=s.person.marketPrices?.bond||100;
 s=applyAction(s,{type:'AGE'});
 assert.ok(Number.isFinite(s.person.marketPrices?.bond));
 assert.notEqual(s.person.marketPrices?.bond,price);
 assert.ok(isSaveGame(s));
});
test('investment advisor has yearly costs and buys diversified fund when affordable',()=>{
 let s=advance(born(),20);
 if(s.person.pending)s=applyAction(s,{type:'EVENT',kind:s.person.pending.options[0].kind});
 s.person.cash=150000;
 s=applyAction(s,{type:'INVEST',key:'advisor-hire'});
 assert.equal(s.person.financialAdvisor,true);
 assert.throws(()=>applyAction(s,{type:'INVEST',key:'advisor-hire'}),/bereits/);
 s=applyAction(s,{type:'AGE'});
 assert.ok((s.person.investments||[]).some(p=>p.assetId==='fund'));
 assert.ok(isSaveGame(s));
 if(s.person.pending)s=applyAction(s,{type:'EVENT',kind:s.person.pending.options[0].kind});
 s=applyAction(s,{type:'INVEST',key:'advisor-fire'});
 assert.equal(s.person.financialAdvisor,false);
});
test('investment portfolio and price corruption cannot pass save validation',()=>{
 const s=born();
 assert.equal(isSaveGame({...s,person:{...s.person,marketPrices:{crypto:NaN}}}),false);
 assert.equal(isSaveGame({...s,person:{...s.person,investments:[{assetId:'fake',quantity:1,costBasis:100}]}}),false);
 assert.equal(isSaveGame({...s,person:{...s.person,investments:[{assetId:'equity',quantity:0,costBasis:100}]}}),false);
 assert.equal(isSaveGame({...s,person:{...s.person,financialAdvisor:'yes'}}),false);
});


test('birth biography contains a city, date, sign, parent occupation and consistent family relations',()=>{
 const a=born(),b=born();
 assert.equal(a.person.birthCity,b.person.birthCity);
 assert.match(a.person.birthStory,/Geburtstag/);
 assert.ok(a.person.birthday&&a.person.zodiac);
 assert.equal(a.person.relationships[0].kind,'Mutter');
 assert.ok(a.person.relationships[0].occupation);
 assert.ok(a.person.history.some(x=>x.text.includes(a.person.name)));
 assert.ok(isSaveGame(a));
});
test('driver license is age gated, charges a fee and never duplicates on success',()=>{
 let s=born();
 assert.throws(()=>applyAction(s,{type:'LIFESTYLE',key:'license'}),/16/);
 s=advance(s,18);if(s.person.pending)s=applyAction(s,{type:'EVENT',kind:s.person.pending.options[0].kind});
 s.person.cash=1500;
 const before=s.person.cash;
 s=applyAction(s,{type:'LIFESTYLE',key:'license'});
 assert.equal(s.person.cash,before-220);
 assert.ok(typeof s.person.license==='boolean'||s.person.license===undefined);
 assert.throws(()=>applyAction(s,{type:'LIFESTYLE',key:'license'}));
 assert.ok(isSaveGame(s));
});
test('loans need a job and repayments plus annual interest are accounted for',()=>{
 let s=advance(born(),21);
 if(s.person.pending)s=applyAction(s,{type:'EVENT',kind:s.person.pending.options[0].kind});
 assert.throws(()=>applyAction(s,{type:'LIFESTYLE',key:'loan',value:'10000'}),/Einkommen/);
 s=applyAction(s,{type:'JOB',id:'retail'});
 const cash=s.person.cash;
 s=applyAction(s,{type:'LIFESTYLE',key:'loan',value:'10000'});
 assert.equal(s.person.loanBalance,10000);
 assert.equal(s.person.cash,cash+10000);
 const before=s.person.loanBalance;
 s=advance(s,1);
 assert.ok(s.person.loanBalance<before);
 if(s.person.pending)s=applyAction(s,{type:'EVENT',kind:s.person.pending.options[0].kind});
 s.person.cash=9000;
 s=applyAction(s,{type:'LIFESTYLE',key:'repay',value:'5000'});
 assert.ok(s.person.loanBalance<5000);
 assert.ok(isSaveGame(s));
});
test('adoption and fertility have costs, outcomes and yearly quotas',()=>{
 let s=advance(born(),22);
 if(s.person.pending)s=applyAction(s,{type:'EVENT',kind:s.person.pending.options[0].kind});
 s.person.cash=30000;
 const original=s.person.cash;
 s=applyAction(s,{type:'LIFESTYLE',key:'adopt'});
 assert.equal(s.person.cash,original-3000);
 assert.throws(()=>applyAction(s,{type:'LIFESTYLE',key:'adopt'}),/dieses Jahr/);
 s=applyAction(s,{type:'LIFESTYLE',key:'fertility'});
 assert.equal(s.person.cash,original-4500);
 assert.throws(()=>applyAction(s,{type:'LIFESTYLE',key:'fertility'}),/dieses Jahr/);
 assert.ok(isSaveGame(s));
});
test('identity updates the person and accessory gives lasting presentation improvements',()=>{
 let s=advance(born(),18);
 if(s.person.pending)s=applyAction(s,{type:'EVENT',kind:s.person.pending.options[0].kind});
 s.person.cash=500;
 s=applyAction(s,{type:'LIFESTYLE',key:'identity',value:'weiblich'});
 assert.equal(s.person.gender,'weiblich');
 assert.throws(()=>applyAction(s,{type:'LIFESTYLE',key:'identity',value:'männlich'}),/dieses Jahr/);
 s=applyAction(s,{type:'LIFESTYLE',key:'accessory',value:'Sonnenbrille'});
 assert.equal(s.person.accessory,'Sonnenbrille');
 assert.ok(isSaveGame(s));
});
test('corrupt extended biographies, debts and relationships are rejected; legacy data remains valid',()=>{
 const s=born();
 assert.equal(isSaveGame(s),true);
 assert.equal(isSaveGame({...s,person:{...s.person,loanBalance:NaN}}),false);
 assert.equal(isSaveGame({...s,person:{...s.person,birthStory:'x'.repeat(1000)}}),false);
 assert.equal(isSaveGame({...s,person:{...s.person,license:'yes'}}),false);
 const copy=structuredClone(s);
 delete copy.person.birthCity;delete copy.person.birthday;delete copy.person.zodiac;delete copy.person.birthStory;
 assert.equal(isSaveGame(copy),true);
});


test('school report appears at six and changes through study and attendance',()=>{
 let s=advance(born(),6);
 if(s.person.pending)s=applyAction(s,{type:'EVENT',kind:s.person.pending.options[0].kind});
 assert.ok(s.person.schoolRecord);
 const first=s.person.grades;
 s=applyAction(s,{type:'EDUCATION',key:'study'});
 assert.ok(s.person.grades>first);
 assert.equal(s.person.grades,s.person.schoolRecord.performance);
 s=applyAction(s,{type:'EDUCATION',key:'study'});
 assert.throws(()=>applyAction(s,{type:'EDUCATION',key:'study'}),/dieses Jahr/);
 assert.ok(isSaveGame(s));
});
test('school life actions have consequences, annual limits, and age restrictions',()=>{
 let s=advance(born(),12);
 if(s.person.pending)s=applyAction(s,{type:'EVENT',kind:s.person.pending.options[0].kind});
 s.person.cash=500;
 s=applyAction(s,{type:'EDUCATION',key:'club',club:'technik'});
 assert.equal(s.person.schoolRecord.club,'technik');
 assert.throws(()=>applyAction(s,{type:'EDUCATION',key:'club',club:'musik'}),/dieses Jahr/);
 const initial=s.person.schoolRecord.attendance;
 s=applyAction(s,{type:'EDUCATION',key:'skip'});
 assert.ok(s.person.schoolRecord.attendance<initial);
 s=applyAction(s,{type:'EDUCATION',key:'tutor'});
 assert.equal(s.person.cash,350);
 assert.ok(isSaveGame(s));
 assert.throws(()=>applyAction(born(),{type:'EDUCATION',key:'study'}),/Schulzeit/);
});
test('school conflicts can be resolved and affect discipline',()=>{
 let s=advance(born(),12);
 if(s.person.pending)s=applyAction(s,{type:'EVENT',kind:s.person.pending.options[0].kind});
 s.person.pending={id:'school-issue',heading:'Schulkonflikt',detail:'Streit',options:[{label:'Lehrer',kind:'schoolHelp'},{label:'Streit',kind:'schoolFight'}]};
 const before=s.person.schoolRecord.discipline;
 s=applyAction(s,{type:'EVENT',kind:'schoolFight'});
 assert.ok(s.person.schoolRecord.discipline<before);
 assert.equal(s.person.pending,null);
 assert.ok(isSaveGame(s));
});
test('annual school attendance recovers, grades remain bounded, graduation persists',()=>{
 let s=advance(born(),12);
 if(s.person.pending)s=applyAction(s,{type:'EVENT',kind:s.person.pending.options[0].kind});
 s.person.schoolRecord.attendance=25;
 s.person.schoolRecord.performance=32;s.person.grades=32;
 s=advance(s,6);
 assert.equal(s.person.age,18);
 assert.ok(s.person.grades>=0&&s.person.grades<=100);
 assert.ok(s.person.history.some(x=>x.text.includes('Schulzeit')));
 assert.ok(isSaveGame(s));
});
test('illness checkups, therapies and treatment have medical and financial consequences',()=>{
 let s=advance(born(),18);
 if(s.person.pending)s=applyAction(s,{type:'EVENT',kind:s.person.pending.options[0].kind});
 s.person.illness={kind:'Grippe',severity:80,years:0,diagnosed:false};
 s.person.cash=3000;
 assert.throws(()=>applyAction(s,{type:'MEDICAL',key:'treat'}),/untersuchen/);
 s=applyAction(s,{type:'MEDICAL',key:'checkup'});
 assert.equal(s.person.illness.diagnosed,true);
 s=applyAction(s,{type:'MEDICAL',key:'treat'});
 assert.ok(s.person.illness===null||s.person.illness.severity<80);
 assert.equal(s.person.cash,2550);
 s=applyAction(s,{type:'MEDICAL',key:'therapy'});
 assert.equal(s.person.cash,2330);
 assert.ok(isSaveGame(s));
});
test('school and health save fields reject malformed payloads but preserve legacy saves',()=>{
 const original=born();
 const legacy=structuredClone(original);
 delete legacy.person.grades;
 delete legacy.person.schoolRecord;
 delete legacy.person.illness;
 assert.ok(isSaveGame(legacy));
 assert.equal(isSaveGame({...original,person:{...original.person,schoolRecord:{performance:120,attendance:95,discipline:60,club:'sport'}}}),false);
 assert.equal(isSaveGame({...original,person:{...original.person,illness:{kind:'Grippe',severity:-1,years:0,diagnosed:true}}}),false);
 assert.equal(isSaveGame({...original,person:{...original.person,illness:{kind:'Wrong',severity:30,years:0,diagnosed:true}}}),false);
});


test('breakup preserves the person as a living ex-partner instead of killing them',()=>{
 let s=advance(born(),22);
 s=applyAction(s,{type:'ACTIVITY',key:'date'});
 const partner=s.person.relationships.find(r=>r.kind==='Partner');
 assert.ok(partner);
 s=applyAction(s,{type:'RELATION',id:partner.id,key:'breakup'});
 const ex=s.person.relationships.find(r=>r.id===partner.id);
 assert.equal(ex.kind,'Ex-Partner');
 assert.equal(ex.alive,true);
 assert.equal(ex.estranged,true);
 assert.throws(()=>applyAction(s,{type:'RELATION',id:ex.id,key:'talk'}),/Kontakt/);
 s=advance(s,1);
 s=applyAction(s,{type:'ACTIVITY',key:'date'});
 assert.equal(s.person.relationships.filter(r=>r.kind==='Partner'&&r.alive).length,1);
 assert.ok(isSaveGame(s));
});
test('family day bonds with family, costs adults money and enforces annual limits',()=>{
 let s=advance(born(),21);
 const initial=s.person.relationships.filter(r=>r.alive&&['Mutter','Vater'].includes(r.kind)).map(r=>({id:r.id,bond:r.bond}));
 s.person.cash=5000;
 s=applyAction(s,{type:'FAMILY',key:'family-day'});
 assert.equal(s.person.cash,4850);
 for(const entry of initial)assert.ok(s.person.relationships.find(r=>r.id===entry.id).bond>=entry.bond);
 assert.throws(()=>applyAction(s,{type:'FAMILY',key:'family-day'}),/dieses Jahr/);
 assert.ok(isSaveGame(s));
});
test('making new friends is available from age five and limited per year',()=>{
 assert.throws(()=>applyAction(born(),{type:'FAMILY',key:'meet'}),/ab 5/);
 let s=advance(born(),9);
 s=applyAction(s,{type:'FAMILY',key:'meet'});
 s=applyAction(s,{type:'FAMILY',key:'meet'});
 assert.throws(()=>applyAction(s,{type:'FAMILY',key:'meet'}),/dieses Jahr/);
 const contacts=s.person.relationships.filter(r=>r.kind==='Freund');
 assert.ok(contacts.length<=2);
 assert.ok(contacts.every(r=>r.alive&&r.lastContactAge===s.person.age&&r.trust===54));
 assert.ok(isSaveGame(s));
});
test('child development responds to targeted care and annual upkeep',()=>{
 let s=advance(born(),28);
 s.person.cash=12000;
 s=applyAction(s,{type:'ACTIVITY',key:'date'});
 s=applyAction(s,{type:'BIRTH',count:1,gender:'weiblich',talent:'musik'});
 const child=s.person.relationships.find(r=>r.kind==='Kind');
 assert.ok(child);
 child.age=8;
 const value=child.development??50;
 s=applyAction(s,{type:'FAMILY',key:'teach-child',id:child.id});
 const pupil=s.person.relationships.find(r=>r.id===child.id);
 assert.ok(pupil.development>value);
 assert.equal(s.person.cash,11800);
 s=advance(s,1);
 assert.ok(s.person.cash<=10600);
 assert.ok(isSaveGame(s));
});
test('divorce preserves ex and charges settlement, allowing future partners',()=>{
 let s=advance(born(),25);
 s.person.cash=20000;
 s=applyAction(s,{type:'ACTIVITY',key:'date'});
 const partner=s.person.relationships.find(r=>r.kind==='Partner');
 partner.bond=80;
 s=applyAction(s,{type:'RELATION',id:partner.id,key:'marry'});
 assert.equal(s.person.marriedPartnerId,partner.id);
 const cash=s.person.cash;
 assert.throws(()=>applyAction(s,{type:'RELATION',id:partner.id,key:'breakup'}),/scheiden/);
 s=applyAction(s,{type:'FAMILY',key:'divorce',id:partner.id});
 assert.equal(s.person.cash,cash-Math.round(cash*.25));
 assert.equal(s.person.marriedPartnerId,null);
 const ex=s.person.relationships.find(r=>r.id===partner.id);
 assert.equal(ex.kind,'Ex-Partner');
 assert.equal(ex.alive,true);
 s=advance(s,1);
 s=applyAction(s,{type:'ACTIVITY',key:'date'});
 assert.equal(s.person.relationships.filter(r=>r.kind==='Partner').length,1);
 assert.ok(isSaveGame(s));
});
test('estrangement can be managed and relationships decay after years without contact',()=>{
 let s=advance(born(),22);
 const parent=s.person.relationships.find(r=>r.kind==='Mutter');
 assert.ok(parent);
 s=applyAction(s,{type:'FAMILY',key:'distance',id:parent.id});
 assert.equal(s.person.relationships.find(r=>r.id===parent.id).estranged,true);
 assert.throws(()=>applyAction(s,{type:'RELATION',id:parent.id,key:'gift'}),/Kontakt/);
 s=applyAction(s,{type:'FAMILY',key:'reconcile',id:parent.id});
 assert.ok(isSaveGame(s));
 let t=advance(born(),7);
 const mom=t.person.relationships.find(r=>r.kind==='Mutter');
 const original=mom.bond;
 t=advance(t,4);
 const afterwards=t.person.relationships.find(r=>r.id===mom.id);
 assert.ok(!afterwards.alive||afterwards.bond<=original);
});
test('invalid new relationship fields are rejected while legacy records still load',()=>{
 const s=born();
 assert.equal(isSaveGame({...s,person:{...s.person,relationships:s.person.relationships.map((r,i)=>i? r:{...r,trust:Infinity})}}),false);
 assert.equal(isSaveGame({...s,person:{...s.person,relationships:s.person.relationships.map((r,i)=>i? r:{...r,development:50})}}),false);
 assert.equal(isSaveGame({...s,person:{...s.person,relationships:s.person.relationships.map((r,i)=>i? r:{...r,estranged:'yes'})}}),false);
 const legacy=structuredClone(s);
 for(const r of legacy.person.relationships){delete r.lastContactAge;delete r.trust;delete r.estranged;}
 assert.ok(isSaveGame(legacy));
});


test('family inheritance includes investments, deducts debt, and upbringing affects successor',()=>{
 let s=advance(born(),27);s.person.cash=150000;
 s=applyAction(s,{type:'INVEST',key:'buy',assetId:'bond',quantity:100});
 s=applyAction(s,{type:'ACTIVITY',key:'date'});
 s=applyAction(s,{type:'BIRTH',count:1,gender:'männlich',talent:'keines'});
 const child=s.person.relationships.find(r=>r.kind==='Kind');
 child.development=100;child.age=9;
 s.person.loanBalance=8000;
 const estate=netWorth(s.person);
 assert.ok(estate>100000);
 s.person.age=116;s.person.stats.health=0;
 s=applyAction(s,{type:'AGE'});
 assert.equal(s.person.alive,false);
 const next=applyAction(s,{type:'NEW_GENERATION',id:child.id});
 assert.ok(next.person.cash>=Math.floor(estate*.8)-10000);
 assert.ok(next.person.stats.smarts>=95);
 assert.ok(isSaveGame(next));
});


test('music lessons have an age gate, childhood is free, and adult lessons cost money',()=>{
 let s=born();
 assert.throws(()=>applyAction(s,{type:'MUSIC',key:'practice',role:'Gesang'}),/ab acht/);
 s=advance(s,8);
 s=applyAction(s,{type:'MUSIC',key:'practice',role:'Gesang'});
 const one=s.person.musicSkills.Gesang;
 assert.ok(one>=5);
 s=applyAction(s,{type:'MUSIC',key:'practice',role:'Gesang'});
 s=applyAction(s,{type:'MUSIC',key:'practice',role:'Gesang'});
 assert.throws(()=>applyAction(s,{type:'MUSIC',key:'practice',role:'Gesang'}),/dieses Jahr/);
 s=advance(s,10);s.person.cash=1000;
 s=applyAction(s,{type:'MUSIC',key:'practice',role:'Gitarre'});
 assert.equal(s.person.cash,880);
 assert.ok(isSaveGame(s));
});
test('music talent boosts lesson learning using the same deterministic starting state',()=>{
 let a=advance(born(),9);let b=structuredClone(a);
 a.person.talent='musik';b.person.talent='keines';
 a=applyAction(a,{type:'MUSIC',key:'practice',role:'Klavier'});
 b=applyAction(b,{type:'MUSIC',key:'practice',role:'Klavier'});
 assert.equal(a.person.musicSkills.Klavier-b.person.musicSkills.Klavier,7);
});
test('musician auditions create solo/band label contracts and prevent parallel full-time jobs',()=>{
 let s=advance(born(),21);
 assert.throws(()=>applyAction(s,{type:'MUSIC',key:'audition',role:'Gesang',mode:'Solo'}),/45/);
 s.person.musicSkills={Gesang:100};s.person.cash=10000;
 let joined=false;
 for(let attempt=0;attempt<3;attempt++){
  s=applyAction(s,{type:'MUSIC',key:'audition',role:'Gesang',mode:'Solo'});
  if(s.person.musicCareer?.contractYears>0){joined=true;break;}
 }
 assert.ok(joined);
 assert.equal(s.person.musicCareer.mode,'Solo');
 assert.ok(s.person.musicCareer.royalty>0);
 assert.throws(()=>applyAction(s,{type:'JOB',id:'retail'}),/Musikvertrag/);
 assert.throws(()=>applyAction(s,{type:'MUSIC',key:'audition',role:'Gesang',mode:'Band'}),/Musikvertrag/);
 assert.ok(isSaveGame(s));
});
test('music releases cost production money, produce songs and receive later royalties',()=>{
 let s=advance(born(),22);
 s.person.cash=60000;
 s.person.musicSkills={Gesang:92};
 s.person.musicCareer={mode:'Solo',role:'Gesang',genre:'Pop',label:'Nordlicht Records',royalty:22,contractYears:5,popularity:65,releases:[]};
 s=applyAction(s,{type:'MUSIC',key:'single'});
 const c=s.person.musicCareer;
 assert.equal(c.releases.length,1);
 assert.equal(c.releases[0].kind,'Single');
 assert.ok(c.releases[0].units>0);
 assert.throws(()=>applyAction(s,{type:'MUSIC',key:'album'}),/dieses Jahr/);
 s=advance(s,1);
 assert.ok(s.person.history.some(x=>x.text.includes('jährlichen Tantiemen')));
 s.person.cash=60000;
 s=applyAction(s,{type:'MUSIC',key:'album'});
 assert.equal(s.person.musicCareer.releases.length,2);
 assert.equal(s.person.musicCareer.releases[1].kind,'Album');
 assert.ok(isSaveGame(s));
});
test('concert and tour affect fame, health, popularities and annual limits',()=>{
 let s=advance(born(),24);
 s.person.cash=50000;
 s.person.musicSkills={Gesang:85};
 s.person.musicCareer={mode:'Band',role:'Gesang',genre:'Rock',label:'Atlas Klangwerke',royalty:12,contractYears:4,popularity:45,releases:[]};
 const health=s.person.stats.health;
 s=applyAction(s,{type:'MUSIC',key:'tour'});
 assert.ok(s.person.musicCareer.popularity>45);
 assert.ok(s.person.stats.health<health);
 assert.throws(()=>applyAction(s,{type:'MUSIC',key:'tour'}),/dieses Jahr/);
 s=applyAction(s,{type:'MUSIC',key:'concert'});
 assert.ok((s.person.fame??0)>0);
 s=applyAction(s,{type:'MUSIC',key:'quit'});
 assert.equal(s.person.musicCareer.contractYears,0);
 assert.throws(()=>applyAction(s,{type:'MUSIC',key:'album'}),/aktiven Musikvertrag/);
 assert.ok(isSaveGame(s));
});
test('musician career expiry preserves discography and an expired contract can be renewed',()=>{
 let s=advance(born(),24);
 s.person.cash=25000;
 s.person.musicSkills={Gesang:100};
 s.person.musicCareer={mode:'Solo',role:'Gesang',genre:'Rock',label:'Nordlicht Records',royalty:20,contractYears:1,popularity:55,releases:[{title:'Nordwind',kind:'Single',year:22,units:50000,quality:75}]};
 s=advance(s,1);
 assert.equal(s.person.musicCareer.contractYears,0);
 assert.ok(s.person.musicCareer.releases.length===1);
 s=applyAction(s,{type:'MUSIC',key:'audition',role:'Gesang',mode:'Band'});
 assert.equal(s.person.musicCareer?.releases.length,1);
 assert.ok(isSaveGame(s));
});
test('music save validation rejects hostile and impossible values, old saves remain valid',()=>{
 const s=born();
 assert.ok(isSaveGame(s));
 assert.equal(isSaveGame({...s,person:{...s.person,musicSkills:{Gesang:101}}}),false);
 assert.equal(isSaveGame({...s,person:{...s.person,musicSkills:{Unknown:20}}}),false);
 const sample={mode:'Solo',role:'Gesang',genre:'Pop',label:'Nordlicht Records',royalty:10,contractYears:3,popularity:50,releases:[]};
 assert.equal(isSaveGame({...s,person:{...s.person,musicCareer:{...sample,royalty:999}}}),false);
 assert.equal(isSaveGame({...s,person:{...s.person,musicCareer:{...sample,releases:[{title:'abc',kind:'Single',year:200,units:1000,quality:30}]}}}),false);
 const legacy=structuredClone(s);delete legacy.person.musicSkills;delete legacy.person.musicCareer;
 assert.ok(isSaveGame(legacy));
});
