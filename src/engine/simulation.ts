import {CAREERS,COUNTRIES,ITEMS,LAST_NAMES,NAMES} from './catalog.js';
import type {Action,Entry,NewLife,Pending,Person,Relationship,SaveGame,Stat} from './types.js';
const clamp=(x:number)=>Math.max(0,Math.min(100,Math.round(x)));
export const money=(x:number)=>new Intl.NumberFormat('de-DE',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(x);
const rng=(s:SaveGame)=>{s.seed^=s.seed<<13;s.seed^=s.seed>>>17;s.seed^=s.seed<<5;s.seed>>>=0;return s.seed/4294967296;};
const chance=(s:SaveGame,p:number)=>rng(s)<p;
const pick=<T>(s:SaveGame,items:T[]):T=>items[Math.min(items.length-1,Math.floor(rng(s)*items.length))]!;
const uid=(s:SaveGame)=>`${s.person.age}-${Math.floor(rng(s)*1e9).toString(36)}`;
const log=(s:SaveGame,text:string,tone:Entry['tone']='normal')=>{const p=s.person;p.history.unshift({id:uid(s),age:p.age,text,tone});p.history=p.history.slice(0,240);};
const stat=(p:Person,key:Stat,value:number)=>{p.stats[key]=clamp(p.stats[key]+value);};
const relation=(s:SaveGame,kind:Relationship['kind'],age:number):Relationship=>({id:uid(s),name:`${pick(s,NAMES)} ${pick(s,LAST_NAMES)}`,kind,gender:kind==='Mutter'?'weiblich':kind==='Vater'?'männlich':chance(s,.5)?'weiblich':'männlich',age,bond:clamp(35+rng(s)*50),alive:true});
const event=(s:SaveGame,heading:string,detail:string,options:Pending['options'])=>{s.person.pending={id:uid(s),heading,detail,options};};
function schoolFor(age:number,uniYears:number,degree:boolean):Person['school']{if(age<6)return 'Kindergarten';if(age<11)return 'Grundschule';if(age<18)return 'Weiterführende Schule';if(uniYears>0)return 'Universität';return 'Abgeschlossen';}
export function createLife(input:NewLife):SaveGame{
 const name=input.name.trim().slice(0,50)||'Alex Meyer';
 const seed=(input.seed===undefined?Math.floor(Math.random()*0xffffffff):input.seed)>>>0||1;
 const p:Person={id:`person-${seed.toString(16)}`,name,gender:input.gender,country:COUNTRIES.includes(input.country)?input.country:COUNTRIES[0]!,age:0,alive:true,stats:{health:85,happiness:80,smarts:50,looks:50},cash:Math.max(0,input.inheritance||0),school:'Kindergarten',degree:false,universityYears:0,jobId:null,jobYears:0,prisonYears:0,record:false,relationships:[],assets:[],history:[],pending:null,causeOfDeath:null,generation:input.generation||1};
 const s:SaveGame={schema:1,id:`life-${seed.toString(16)}-${Date.now()}`,title:name,updated:Date.now(),seed,person:p,ancestry:[],adminFullAccess:true};
 p.stats.smarts=clamp(30+rng(s)*60);p.stats.looks=clamp(30+rng(s)*60);
 p.relationships.push(relation(s,'Mutter',22+Math.floor(rng(s)*18)),relation(s,'Vater',22+Math.floor(rng(s)*18)));
 log(s,`Du wurdest in ${p.country} geboren. Deine Geschichte beginnt.`,'good');
 return s;
}
function yearlyEvent(s:SaveGame){const p=s.person;
 const roll=rng(s);
 if(roll<.13&&p.age>6){event(s,'Ein neuer Freund?',`Jemand aus deinem Umfeld möchte mehr Zeit mit dir verbringen.`,[{label:'Freundschaft schließen',kind:'friend'},{label:'Lieber nicht',kind:'ignore'}]);}
 else if(roll<.25&&p.age>=12){event(s,'Eine schwierige Entscheidung',`Ein Bekannter schlägt dir eine riskante Mutprobe vor.`,[{label:'Ablehnen',kind:'decline'},{label:'Mitmachen',kind:'risk'}]);}
 else if(roll<.38){event(s,'Ein anstrengendes Jahr',`Eine Menge Stress hat sich angestaut. Wie reagierst du?`,[{label:'Erholung suchen',kind:'rest'},{label:'Weiter durchziehen',kind:'work'}]);}
 else if(roll<.47&&p.age>=18){event(s,'Eine Gelegenheit',`Ein Nebenverdienst bietet sich an.`,[{label:'Auftrag annehmen',kind:'sidejob'},{label:'Auslassen',kind:'ignore'}]);}
 else if(roll<.55&&p.age>=18){event(s,'Ein unerwarteter Fund',`Du findest eine fremde Geldbörse auf dem Weg nach Hause.`,[{label:'Zurückgeben',kind:'walletReturn'},{label:'Geld behalten',kind:'walletKeep'}]);}
}
function die(s:SaveGame,cause:string){const p=s.person;p.alive=false;p.pending=null;p.causeOfDeath=cause;p.jobId=null;log(s,`Du bist im Alter von ${p.age} Jahren gestorben. Ursache: ${cause}.`,'bad');}
function age(s:SaveGame){const p=s.person;p.age++;p.school=schoolFor(p.age,p.universityYears,p.degree);
 for(const r of p.relationships){r.age++;if(r.alive&&chance(s,Math.max(.001,(r.age-68)*.006))) {r.alive=false;log(s,`${r.name} ist verstorben.`,'bad');}}
 if(p.prisonYears>0){p.prisonYears--;if(p.prisonYears===0)log(s,'Du wurdest aus dem Gefängnis entlassen.','good');}
 else if(p.jobId){const job=CAREERS.find(j=>j.id===p.jobId);if(job){const pay=Math.round(job.salary*(1+Math.min(.60,p.jobYears*.025))*.76);p.cash+=pay;p.jobYears++;log(s,`Du hast ${money(pay)} Nettolohn als ${job.title} verdient.`,'good');}}
 const expense=p.age>=18? Math.round(6500+(p.age>25?3000:0)) : 0;
 const assetExpense=p.assets.reduce((a,b)=>a+b.annualCost,0);
 p.cash-=expense+assetExpense;
 if(expense+assetExpense>0)log(s,`Lebenshaltung und Besitz: ${money(expense+assetExpense)}.`);
 if(p.universityYears>0){p.universityYears--;p.cash-=2800;stat(p,'smarts',4);if(p.universityYears===0){p.degree=true;p.school='Abgeschlossen';log(s,'Du hast dein Studium abgeschlossen.','good');}}
 if(p.age===6)log(s,'Du kommst in die Grundschule.');if(p.age===11)log(s,'Du wechselst auf eine weiterführende Schule.');if(p.age===18)log(s,'Du beendest die Schule und wirst erwachsen.','good');
 stat(p,'health',p.age>60? -2:chance(s,.2)?-1:0);
 if(p.age>30&&chance(s,.11))stat(p,'looks',-1);
 if(chance(s,.16))stat(p,'happiness',-4);
 for(const r of p.relationships.filter(r=>r.alive)){if(chance(s,.14))r.bond=clamp(r.bond-3);}
 if(p.cash < -25000)stat(p,'happiness',-5);
 const deathRisk=p.age<40?.00015:p.age<65?.001:p.age<80?.009:Math.min(.9,.015+(p.age-80)*.032);
 if(p.stats.health<=0||chance(s,deathRisk)){die(s,p.stats.health<=0?'Schwere gesundheitliche Probleme':'Natürliche Ursachen');return;}
 if(p.age>=3)yearlyEvent(s);
 log(s,`Du bist jetzt ${p.age} Jahre alt.`);
}
function activity(s:SaveGame,key:string){const p=s.person;
 switch(key){
 case 'read':stat(p,'smarts',2+Math.floor(rng(s)*4));log(s,'Du hast ein Buch gelesen. Dein Wissen wächst.','good');break;
 case 'gym':if(p.age<12)throw Error('Fitnessstudio erst ab 12 Jahren.');if(p.cash<50)throw Error('Für das Fitnessstudio fehlen 50 €.');p.cash-=50;stat(p,'health',5);stat(p,'looks',2);log(s,'Du warst im Fitnessstudio.','good');break;
 case 'doctor':if(p.cash<150)throw Error('Für den Arztbesuch fehlen 150 €.');p.cash-=150;stat(p,'health',12+Math.floor(rng(s)*12));log(s,'Du bist beim Arzt gewesen.','good');break;
 case 'meditate':stat(p,'happiness',7);stat(p,'health',2);log(s,'Du hast meditiert und dich erholt.','good');break;
 case 'study':if(p.age<6||p.age>24||p.school==='Abgeschlossen')throw Error('Du bist derzeit nicht in der Schule.');stat(p,'smarts',5);stat(p,'happiness',-1);log(s,'Du hast fleißig gelernt.','good');break;
 case 'date':if(p.age<16)throw Error('Dating ist erst ab 16 möglich.');if(p.relationships.some(r=>r.kind==='Partner'&&r.alive))throw Error('Du bist bereits in einer Beziehung.');{const r=relation(s,'Partner',Math.max(16,p.age+Math.floor(rng(s)*7)-3));p.relationships.push(r);log(s,`Du bist jetzt mit ${r.name} zusammen.`,'good');}break;
 case 'crime':if(p.age<12)throw Error('Diese Handlung ist für Kinder nicht verfügbar.');{const reward=300+Math.floor(rng(s)*3000);if(chance(s,.42)){p.record=true;p.prisonYears=1+Math.floor(rng(s)*4);p.jobId=null;p.cash=Math.max(-20000,p.cash-500);stat(p,'happiness',-22);log(s,`Du wurdest bei einem Diebstahl erwischt und musst ${p.prisonYears} Jahre ins Gefängnis.`,'bad');}else{p.cash+=reward;stat(p,'happiness',3);log(s,`Der Diebstahl brachte ${money(reward)} ein.`,'good');}}break;
 case 'resign':if(!p.jobId)throw Error('Du hast keinen Job.');p.jobId=null;p.jobYears=0;log(s,'Du hast deinen Job gekündigt.');break;
 case 'child':{if(p.age<18||p.age>55)throw Error('Kinder sind in dieser Lebensphase nicht verfügbar.');const partner=p.relationships.find(r=>r.kind==='Partner'&&r.alive);if(!partner)throw Error('Du brauchst eine Partnerschaft.');if(chance(s,.28)){log(s,'Dieses Mal hat es mit dem Nachwuchs nicht geklappt.');break;}const r=relation(s,'Kind',0);r.bond=80;p.relationships.push(r);stat(p,'happiness',12);log(s,`${r.name} wurde geboren. Du bist Elternteil geworden!`,'good');}break;
 default:throw Error('Unbekannte Aktivität.');
 }
}
function interact(s:SaveGame,id:string,key:string){const p=s.person;const r=p.relationships.find(r=>r.id===id);if(!r||!r.alive)throw Error('Diese Person ist nicht verfügbar.');
 if(key==='talk'){r.bond=clamp(r.bond+8);stat(p,'happiness',3);log(s,`Du hast mit ${r.name} gesprochen.`,'good');}
 else if(key==='compliment'){r.bond=clamp(r.bond+11);log(s,`Du hast ${r.name} ein Kompliment gemacht.`,'good');}
 else if(key==='argue'){r.bond=clamp(r.bond-20);stat(p,'happiness',-4);log(s,`Du hattest Streit mit ${r.name}.`,'bad');}
 else if(key==='marry'){if(r.kind!=='Partner'||p.age<18||r.bond<65)throw Error('Eine Hochzeit ist noch nicht möglich.');if(p.cash<2500)throw Error('Die Hochzeit kostet 2.500 €.');p.cash-=2500;r.bond=clamp(r.bond+10);log(s,`Du hast ${r.name} geheiratet!`,'good');}
 else if(key==='breakup'){if(r.kind!=='Partner')throw Error('Nur Partner können sich trennen.');r.alive=false;stat(p,'happiness',-16);log(s,`Du hast dich von ${r.name} getrennt.`,'bad');}
 else throw Error('Unbekannte Interaktion.');
}
function resolve(s:SaveGame,kind:string){const p=s.person;const pending=p.pending;if(!pending||!pending.options.some(o=>o.kind===kind))throw Error('Keine passende Entscheidung vorhanden.');p.pending=null;
 switch(kind){case 'friend':{const r=relation(s,'Freund',p.age);p.relationships.push(r);log(s,`Du hast dich mit ${r.name} angefreundet.`,'good');break;}
 case 'risk':if(chance(s,.45)){stat(p,'health',-17);log(s,'Die Mutprobe ging schief. Du hast dich verletzt.','bad');}else {stat(p,'happiness',8);log(s,'Du hattest Spaß bei der Mutprobe.','good');}break;
 case 'decline':stat(p,'smarts',2);log(s,'Du bist kein unnötiges Risiko eingegangen.');break;
 case 'rest':stat(p,'happiness',10);stat(p,'health',3);log(s,'Du hast dir eine Auszeit genommen.','good');break;
 case 'work':stat(p,'happiness',-6);stat(p,'smarts',2);log(s,'Du hast dich trotz Stress weiter angestrengt.');break;
 case 'sidejob':{const amt=500+Math.floor(rng(s)*1200);p.cash+=amt;log(s,`Dein Nebenverdienst brachte ${money(amt)}.`,'good');break;}
 case 'walletReturn':stat(p,'happiness',7);log(s,'Du hast die Geldbörse zurückgegeben.','good');break;
 case 'walletKeep':{const amt=80+Math.floor(rng(s)*400);p.cash+=amt;stat(p,'happiness',-3);log(s,`Du hast ${money(amt)} aus der Geldbörse genommen.`);break;}
 case 'ignore':log(s,'Du hast das Angebot ausgeschlagen.');break;
 default:throw Error('Unbekannte Entscheidung.');
 }
}
function nextGeneration(s:SaveGame,childId:string):SaveGame{
 const p=s.person;const child=p.relationships.find(r=>r.id===childId&&r.kind==='Kind'&&r.alive);
 if(p.alive||!child)throw Error('Generationswechsel erst nach dem Tod zu einem lebenden Kind möglich.');
 const previous={name:p.name,age:p.age,cause:p.causeOfDeath||'Unbekannt'};
 const inheritance=Math.max(0,Math.floor((p.cash+p.assets.reduce((a,b)=>a+b.value,0))*.8));
 const copy=createLife({name:child.name,gender:child.gender,country:p.country,seed:(s.seed^0x9e3779b9)>>>0,generation:p.generation+1,inheritance});
 copy.id=s.id;copy.ancestry=[...s.ancestry,previous];copy.person.age=child.age;copy.person.school=schoolFor(child.age,0,false);
 const partner=p.relationships.find(r=>r.kind==='Partner'&&r.alive);
 copy.person.relationships=partner?[{...partner,kind:partner.gender==='weiblich'?'Mutter':partner.gender==='männlich'?'Vater':'Elternteil'}]:[];
 log(copy,`Du führst die Familie in Generation ${copy.person.generation} weiter. Erbe: ${money(inheritance)}.`,'good');return copy;
}
export function applyAction(input:SaveGame,action:Action):SaveGame{
 if(!isSaveGame(input))throw Error('Ungültiger Spielstand.');
 const s:SaveGame=structuredClone(input);const p=s.person;
 if(action.type==='NEW_GENERATION')return nextGeneration(s,action.id);
 if(!p.alive)throw Error('Dieses Leben ist bereits beendet.');
 if(p.pending&&action.type!=='EVENT')throw Error('Bitte zuerst die offene Entscheidung treffen.');
 switch(action.type){
 case 'AGE':age(s);break;
 case 'ACTIVITY':activity(s,action.key);break;
 case 'RELATION':interact(s,action.id,action.key);break;
 case 'EVENT':resolve(s,action.kind);break;
 case 'STUDY':if(p.age<18||p.age>40||p.universityYears>0||p.degree||p.prisonYears>0)throw Error('Ein Studienbeginn ist gerade nicht möglich.');if(p.stats.smarts<55)throw Error('Für die Universität brauchst du mehr Intelligenz (mindestens 55).');p.universityYears=4;p.school='Universität';p.jobId=null;log(s,'Du hast ein vierjähriges Universitätsstudium begonnen.','good');break;
 case 'JOB':{const job=CAREERS.find(j=>j.id===action.id);if(!job)throw Error('Unbekannte Stelle.');if(p.age<job.minAge||p.stats.smarts<job.minSmarts||(job.requiresDegree&&!p.degree)||p.prisonYears>0)throw Error('Du erfüllst die Voraussetzungen noch nicht.');p.jobId=job.id;p.jobYears=0;log(s,`Du arbeitest jetzt als ${job.title}.`,'good');break;}
 case 'BUY':{const item=ITEMS.find(i=>i.id===action.id);if(!item)throw Error('Unbekannter Gegenstand.');if(p.age<18||p.cash<item.price)throw Error('Kauf derzeit nicht möglich.');p.cash-=item.price;p.assets.push({id:uid(s),name:item.name,kind:item.kind,value:item.price,annualCost:item.annualCost});log(s,`Du hast ${item.name} für ${money(item.price)} gekauft.`,'good');break;}
 case 'SELL':{const item=p.assets.find(i=>i.id===action.id);if(!item)throw Error('Gegenstand nicht vorhanden.');const sale=Math.floor(item.value*.85);p.cash+=sale;p.assets=p.assets.filter(i=>i.id!==item.id);log(s,`Du hast ${item.name} für ${money(sale)} verkauft.`,'good');break;}
 case 'EMIGRATE':if(p.age<18||p.prisonYears>0||!COUNTRIES.includes(action.country)||p.country===action.country)throw Error('Auswanderung nicht verfügbar.');if(p.cash<3500)throw Error('Die Auswanderung kostet 3.500 €.');p.cash-=3500;p.country=action.country;p.jobId=null;p.jobYears=0;log(s,`Du bist nach ${action.country} ausgewandert.`,'good');break;
 }
 s.updated=Date.now();return s;
}
export function isSaveGame(value:unknown):value is SaveGame{
 if(typeof value!=='object'||value===null)return false;
 const x=value as Partial<SaveGame>;
 const str=(v:unknown,max=160)=>typeof v==='string'&&v.length<=max;
 const int=(v:unknown,low=0,high=1_000_000)=>typeof v==='number'&&Number.isInteger(v)&&v>=low&&v<=high;
 const num=(v:unknown,low=-1e15,high=1e15)=>typeof v==='number'&&Number.isFinite(v)&&v>=low&&v<=high;
 if(x.schema!==1||!str(x.id,150)||!int(x.seed,0,0xffffffff)||!x.person||typeof x.person!=='object'||x.adminFullAccess!==true||!Array.isArray(x.ancestry)||x.ancestry.length>1000||!x.ancestry.every(a=>str(a.name)&&int(a.age,0,200)&&str(a.cause,200)))return false;
 const p=x.person as Person;
 if(!str(p.id,150)||!str(p.name,100)||!str(p.country,50)||!['weiblich','männlich','divers'].includes(p.gender)||!int(p.age,0,200)||!num(p.cash)||typeof p.alive!=='boolean'||!str(p.school,40)||typeof p.degree!=='boolean'||!int(p.universityYears,0,4)||!int(p.jobYears,0,200)||!int(p.prisonYears,0,200)||typeof p.record!=='boolean'||!int(p.generation,1,1000)||!str(p.causeOfDeath,500)&&p.causeOfDeath!==null||p.jobId!==null&&!str(p.jobId,100))return false;
 if(!p.stats||!(['health','happiness','smarts','looks'] as Stat[]).every(k=>num(p.stats[k],0,100)))return false;
 if(!Array.isArray(p.relationships)||p.relationships.length>1000||!p.relationships.every(r=>str(r.id,100)&&str(r.name,150)&&['Mutter','Vater','Elternteil','Partner','Kind','Freund'].includes(r.kind)&&['weiblich','männlich','divers'].includes(r.gender)&&int(r.age,0,200)&&num(r.bond,0,100)&&typeof r.alive==='boolean'))return false;
 if(!Array.isArray(p.assets)||p.assets.length>1000||!p.assets.every(a=>str(a.id,100)&&str(a.name)&&['Haus','Auto'].includes(a.kind)&&num(a.value,0)&&num(a.annualCost,0)))return false;
 if(!Array.isArray(p.history)||p.history.length>250||!p.history.every(h=>str(h.id,100)&&int(h.age,0,200)&&str(h.text,1000)&&['normal','good','bad'].includes(h.tone)))return false;
 if(p.pending!==null){const ev=p.pending;if(!ev||!str(ev.id,100)||!str(ev.heading,200)||!str(ev.detail,1000)||!Array.isArray(ev.options)||ev.options.length<1||ev.options.length>12||!ev.options.every(o=>str(o.label,250)&&str(o.kind,100)))return false;}
 return true;
}
export function careerName(p:Person){return CAREERS.find(c=>c.id===p.jobId)?.title||'Keine Anstellung';}
export function netWorth(p:Person){return p.cash+p.assets.reduce((sum,item)=>sum+item.value,0);}
