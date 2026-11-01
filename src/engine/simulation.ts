import {CAREERS,COUNTRIES,ITEMS,LAST_NAMES,NAMES} from './catalog.js';
import type {Action,Entry,NewLife,Pending,Person,Relationship,SaveGame,Stat} from './types.js';
import {advanceExpansions,businessAction,rentalAction,socialAction,validExtensions} from './expansions.js';
import {advanceInvestments,investAction,portfolioValue,validInvestments} from './investments.js';
import {advanceLifestyle,lifestyleAction,validLifestyle} from './lifestyle.js';
import {educationAction,educationYear,medicalAction,healthYear,validSchoolHealth} from './schoolHealth.js';
import {familyAction,familyYear,relationshipTrust,validFamily} from './family.js';
import {advanceMusic,musicAction,validMusic} from './music.js';
import {actorAction,advanceActing,actingActive,validActing} from './acting.js';
import {advanceCrime,crimeAction,crimeReleased,validCrime} from './crime.js';
import {advanceDirector,directorAction,validDirector} from './director.js';
import {advanceSport,sportAction,sportActive,validSport} from './sport.js';
import {advanceFighter,fighterAction,validFighter} from './fighter.js';
import {advanceSpace,spaceAction,spaceActive,validSpace} from './space.js';
import {advanceHeirlooms,heirloomAction,heirloomWorth,validHeirlooms} from './heirlooms.js';
import {awardAchievements,recordRibbon,validMilestones} from './milestones.js';
import {applyForWork,workAction,startWork,workYear,promoteWork,validWork} from './work.js';
import {advancePolitics,politicalAction,politicsActive,validPolitics} from './politics.js';
import {advanceConnections,connectionEvent,resolveConnectionEvent} from './lifeConnections.js';
import type {ExpansionHooks} from './expansions.js';
const clamp=(x:number)=>Math.max(0,Math.min(100,Math.round(x)));
export const money=(x:number)=>new Intl.NumberFormat('de-DE',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(x);
const rng=(s:SaveGame)=>{s.seed^=s.seed<<13;s.seed^=s.seed>>>17;s.seed^=s.seed<<5;s.seed>>>=0;return s.seed/4294967296;};
const chance=(s:SaveGame,p:number)=>rng(s)<p;
const pick=<T>(s:SaveGame,items:T[]):T=>items[Math.min(items.length-1,Math.floor(rng(s)*items.length))]!;
const uid=(s:SaveGame)=>`${s.person.age}-${Math.floor(rng(s)*1e9).toString(36)}`;
const log=(s:SaveGame,text:string,tone:Entry['tone']='normal')=>{const p=s.person;p.history.unshift({id:uid(s),age:p.age,text,tone});p.history=p.history.slice(0,240);};
const stat=(p:Person,key:Stat,value:number)=>{p.stats[key]=clamp(p.stats[key]+value);};
const useAnnual=(p:Person,key:string,limit=1)=>{p.yearlyActions??={};const count=p.yearlyActions[key]||0;if(count>=limit)throw Error('Diese Aktivität kannst du dieses Jahr nicht öfter ausführen.');p.yearlyActions[key]=count+1;};
const expansionHooks=(s:SaveGame):ExpansionHooks=>({
 random:()=>rng(s),log:(message,tone)=>log(s,message,tone),
 stat:(key,change)=>stat(s.person,key,change),
 annual:(key,limit)=>useAnnual(s.person,key,limit)
});
const lockedUp=(p:Person)=>p.prisonYears>0;
const requireFree=(p:Person)=>{if(lockedUp(p))throw Error('Während der Haft ist diese Aktivität nicht möglich. Öffne die Gefängnisaktivitäten.');};
const CITIES:Record<string,string[]>={Deutschland:['Hamburg','Berlin','Köln','Kiel'],USA:['New York','Miami','Chicago'],Großbritannien:['London','Manchester'],Brasilien:['São Paulo','Rio de Janeiro'],Portugal:['Lissabon','Porto'],Frankreich:['Paris','Lyon'],Japan:['Tokio','Osaka'],Kanada:['Toronto','Vancouver'],Australien:['Sydney','Melbourne'],Indien:['Mumbai','Delhi']};
const MONTHS=['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];
const ZODIAC=['Steinbock','Wassermann','Fische','Widder','Stier','Zwillinge','Krebs','Löwe','Jungfrau','Waage','Skorpion','Schütze'];
const OCCUPATIONS=['Verwaltungsangestellte/r','Elektriker/in','Pflegekraft','Lehrer/in','Büroangestellte/r','Koch/Köchin','Techniker/in'];
const relation=(s:SaveGame,kind:Relationship['kind'],age:number):Relationship=>({id:uid(s),name:`${pick(s,NAMES)} ${pick(s,LAST_NAMES)}`,kind,gender:kind==='Mutter'?'weiblich':kind==='Vater'?'männlich':chance(s,.5)?'weiblich':'männlich',age,bond:clamp(35+rng(s)*50),alive:true,lastContactAge:s.person.age});
const event=(s:SaveGame,heading:string,detail:string,options:Pending['options'])=>{s.person.pending={id:uid(s),heading,detail,options};};
function schoolFor(age:number,uniYears:number,degree:boolean):Person['school']{if(age<6)return 'Kindergarten';if(age<11)return 'Grundschule';if(age<18)return 'Weiterführende Schule';if(uniYears>0)return 'Universität';return 'Abgeschlossen';}
export function createLife(input:NewLife):SaveGame{
 const name=input.name.trim().slice(0,50)||'Alex Meyer';
 const seed=(input.seed===undefined?Math.floor(Math.random()*0xffffffff):input.seed)>>>0||1;
 const p:Person={id:`person-${seed.toString(16)}`,name,gender:input.gender,country:COUNTRIES.includes(input.country)?input.country:COUNTRIES[0]!,age:0,alive:true,stats:{health:85,happiness:80,smarts:50,looks:50},cash:Math.max(0,input.inheritance||0),school:'Kindergarten',degree:false,universityYears:0,jobId:null,jobYears:0,prisonYears:0,record:false,relationships:[],assets:[],history:[],pending:null,causeOfDeath:null,generation:input.generation||1};
 const s:SaveGame={schema:1,id:`life-${seed.toString(16)}-${Date.now()}`,title:name,updated:Date.now(),seed,person:p,ancestry:[],adminFullAccess:true};
 p.stats.smarts=clamp(30+rng(s)*60);p.stats.looks=clamp(30+rng(s)*60);
 if(input.stats){for(const key of ['health','happiness','smarts','looks'] as Stat[]){const value=input.stats[key];if(value===undefined)continue;if(!Number.isFinite(value)||!Number.isInteger(value)||value<0||value>100)throw Error('Ungültiger Charakterwert.');p.stats[key]=value;}}
 const month=Math.floor(rng(s)*12),day=1+Math.floor(rng(s)*28);
 const starMonth=month+1; const z=starMonth===12&&day>=22?0:starMonth===1&&day>=20?1:starMonth===2&&day>=19?2:starMonth===3&&day>=21?3:starMonth===4&&day>=20?4:starMonth===5&&day>=21?5:starMonth===6&&day>=21?6:starMonth===7&&day>=23?7:starMonth===8&&day>=23?8:starMonth===9&&day>=23?9:starMonth===10&&day>=23?10:starMonth===11&&day>=22?11:Math.max(0,month===0?0:month);
 p.birthday=`${day}. ${MONTHS[month]}`;p.zodiac=ZODIAC[z];p.birthCity=pick(s,CITIES[p.country]||['Eine Stadt']);
 const mother=relation(s,'Mutter',22+Math.floor(rng(s)*19));mother.occupation=pick(s,OCCUPATIONS);p.relationships.push(mother);
 const bothParents=chance(s,.72);
 if(bothParents){const father=relation(s,'Vater',23+Math.floor(rng(s)*20));father.occupation=pick(s,OCCUPATIONS);p.relationships.push(father);}
 const origin=bothParents?'Du wächst bei deinen Eltern auf.':'Deine Mutter zieht dich allein groß.';
 p.birthStory=`Du wurdest in ${p.birthCity}, ${p.country} geboren. ${origin} Dein Geburtstag ist der ${p.birthday} und dein Sternzeichen ist ${p.zodiac}.`;
 log(s,p.birthStory);
 log(s,`Du heißt ${p.name}.`);
 log(s,`Deine Mutter heißt ${mother.name} und arbeitet als ${mother.occupation} (${mother.age} Jahre).`);
 const father=p.relationships.find(r=>r.kind==='Vater');
 if(father)log(s,`Dein Vater heißt ${father.name} und arbeitet als ${father.occupation} (${father.age} Jahre).`);
 return s;
}
function yearlyEvent(s:SaveGame){const p=s.person;
 if(p.prisonYears>0){if(chance(s,.27))event(s,'Ein Tag hinter Gittern','Ein Mitgefangener fragt, ob du ihm beim Sortieren der Bibliotheksbücher helfen willst.',[{label:'Helfen',kind:'prisonHelp'},{label:'Ablehnen',kind:'ignore'}]);return;}
 const roll=rng(s);
 if(p.age>=6&&p.age<18&&roll<.14){
   event(s,'Ein Konflikt in der Schule','Ein Mitschüler verhält sich dir gegenüber unfair. Wie möchtest du reagieren?',[
    {label:'Lehrkraft um Hilfe bitten',kind:'schoolHelp'},
    {label:'Ruhig bleiben',kind:'schoolCalm'},
    {label:'Zurückschimpfen',kind:'schoolFight'}
   ]);return;
 }
 if(roll<.13&&p.age>6){event(s,'Ein neuer Freund?',`Jemand aus deinem Umfeld möchte mehr Zeit mit dir verbringen.`,[{label:'Freundschaft schließen',kind:'friend'},{label:'Lieber nicht',kind:'ignore'}]);}
 else if(roll<.25&&p.age>=12){event(s,'Eine schwierige Entscheidung',`Ein Bekannter schlägt dir eine riskante Mutprobe vor.`,[{label:'Ablehnen',kind:'decline'},{label:'Mitmachen',kind:'risk'}]);}
 else if(roll<.38){event(s,'Ein anstrengendes Jahr',`Eine Menge Stress hat sich angestaut. Wie reagierst du?`,[{label:'Erholung suchen',kind:'rest'},{label:'Weiter durchziehen',kind:'work'}]);}
 else if(roll<.47&&p.age>=18){event(s,'Eine Gelegenheit',`Ein Nebenverdienst bietet sich an.`,[{label:'Auftrag annehmen',kind:'sidejob'},{label:'Auslassen',kind:'ignore'}]);}
 else if(roll<.55&&p.age>=18){event(s,'Ein unerwarteter Fund',`Du findest eine fremde Geldbörse auf dem Weg nach Hause.`,[{label:'Zurückgeben',kind:'walletReturn'},{label:'Geld behalten',kind:'walletKeep'}]);}
}
function die(s:SaveGame,cause:string){const p=s.person;p.alive=false;p.pending=null;p.causeOfDeath=cause;recordRibbon(s);p.jobId=null;p.workplace=null;if(p.sportCareer)p.sportCareer.contract=null;if(p.fighterCareer){p.fighterCareer.league=false;p.fighterCareer.champion=false;}if(p.spaceCareer)p.spaceCareer.employed=false;if(p.politicalCareer){p.politicalCareer.office=null;p.politicalCareer.campaign=null;}log(s,`Du bist im Alter von ${p.age} Jahren gestorben. Ursache: ${cause}.`,'bad');}
function age(s:SaveGame){const p=s.person;const jailedAtStart=p.prisonYears>0;p.age++;const releasedThisYear=p.prisonYears===1;p.yearlyActions={};p.school=schoolFor(p.age,p.universityYears,p.degree);
 for(const r of p.relationships){r.age++;if(r.alive&&chance(s,Math.max(.001,(r.age-68)*.006))) {r.alive=false;log(s,`${r.name} ist verstorben.`,'bad');}}
 if(p.prisonYears>0){p.prisonYears--;if(p.prisonYears===0)log(s,'Du wurdest aus dem Gefängnis entlassen.','good');}
 else if(p.jobId){const job=CAREERS.find(j=>j.id===p.jobId);if(job){const pay=Math.round(job.salary*(1+Math.min(.60,p.jobYears*.025))*.76);p.cash+=pay+Math.round((p.salaryBonus||0)*.76);p.jobYears++;if(p.jobYears%3===0&&(p.careerPerformance||50)>=65){p.salaryBonus=(p.salaryBonus||0)+Math.round(job.salary*.05);promoteWork(p);log(s,`Du wurdest aufgrund deiner guten Arbeit befördert. Dein Jahresgehalt steigt.`,'good');}p.careerPerformance=clamp((p.careerPerformance??50)-4);log(s,`Du hast ${money(pay+Math.round((p.salaryBonus||0)*.76))} Nettolohn als ${job.title} verdient.`,'good');}}
 workYear(s,expansionHooks(s));
 const expense=p.age>=18?(jailedAtStart?600:Math.round(6500+(p.age>25?3000:0))):0;
 const assetExpense=p.assets.reduce((a,b)=>a+b.annualCost,0);
 p.cash-=expense+assetExpense;
 advanceExpansions(s,expansionHooks(s));
 advanceInvestments(s,expansionHooks(s));
 advanceHeirlooms(s,expansionHooks(s));
  advanceCrime(s,expansionHooks(s));
  if(releasedThisYear)crimeReleased(p);
 advanceMusic(s,expansionHooks(s));
 advanceActing(s,expansionHooks(s));
 advanceDirector(s,expansionHooks(s));
  advanceSport(s,expansionHooks(s),jailedAtStart);
  advanceFighter(s,expansionHooks(s),jailedAtStart);
  advancePolitics(s,expansionHooks(s),jailedAtStart);
  advanceSpace(s,expansionHooks(s),jailedAtStart);
 advanceLifestyle(s,expansionHooks(s));
  familyYear(s,expansionHooks(s));
 if(expense+assetExpense>0)log(s,`Lebenshaltung und Besitz: ${money(expense+assetExpense)}.`);
 if(p.universityYears>0){p.universityYears--;p.cash-=2800;stat(p,'smarts',4);if(p.universityYears===0){p.degree=true;p.school='Abgeschlossen';log(s,'Du hast dein Studium abgeschlossen.','good');}}
 educationYear(s,expansionHooks(s));
  healthYear(s,expansionHooks(s));
  advanceConnections(s,expansionHooks(s));
  if(p.age===6)log(s,'Du kommst in die Grundschule.');if(p.age===11)log(s,'Du wechselst auf eine weiterführende Schule.');if(p.age===18)log(s,'Du beendest die Schule und wirst erwachsen.','good');
 stat(p,'health',p.age>60? -2:chance(s,.2)?-1:0);
 if(p.age>30&&chance(s,.11))stat(p,'looks',-1);
 if(chance(s,.16))stat(p,'happiness',-4);
 for(const r of p.relationships.filter(r=>r.alive)){if(chance(s,.14))r.bond=clamp(r.bond-3);}
 if(p.cash < -25000)stat(p,'happiness',-5);
 const deathRisk=p.age<40?.00015:p.age<65?.001:p.age<80?.009:Math.min(.9,.015+(p.age-80)*.032);
 if(p.stats.health<=0||chance(s,deathRisk)){die(s,p.stats.health<=0?'Schwere gesundheitliche Probleme':'Natürliche Ursachen');return;}
 if(p.age>=3&&!connectionEvent(s,expansionHooks(s),releasedThisYear))yearlyEvent(s);
 log(s,`Du bist jetzt ${p.age} Jahre alt.`);
}
function activity(s:SaveGame,key:string){const p=s.person;
 if(lockedUp(p)&&!key.startsWith('prison:'))requireFree(p);
 if(!lockedUp(p)&&key.startsWith('prison:'))throw Error('Diese Aktivität ist nur in Haft verfügbar.');
 switch(key){
 case 'read':stat(p,'smarts',2+Math.floor(rng(s)*4));log(s,'Du hast ein Buch gelesen. Dein Wissen wächst.','good');break;
 case 'gym':useAnnual(p,'gym');if(p.age<12)throw Error('Fitnessstudio erst ab 12 Jahren.');if(p.cash<50)throw Error('Für das Fitnessstudio fehlen 50 €.');p.cash-=50;stat(p,'health',5);stat(p,'looks',2);log(s,'Du warst im Fitnessstudio.','good');break;
 case 'doctor':if(p.illness){medicalAction(s,p.illness.diagnosed?'treat':'checkup',expansionHooks(s));break;}useAnnual(p,'doctor',2);if(p.cash<150)throw Error('Für den Arztbesuch fehlen 150 €.');p.cash-=150;stat(p,'health',12+Math.floor(rng(s)*12));log(s,'Du bist beim Arzt gewesen.','good');break;
 case 'meditate':useAnnual(p,'meditate',2);stat(p,'happiness',7);stat(p,'health',2);log(s,'Du hast meditiert und dich erholt.','good');break;
 case 'study':if(p.age>=6&&p.age<18){educationAction(s,'study',undefined,expansionHooks(s));break;}useAnnual(p,'study');if(p.age<6||p.age>24||p.school==='Abgeschlossen')throw Error('Du bist derzeit nicht in der Schule.');stat(p,'smarts',5);stat(p,'happiness',-1);log(s,'Du hast fleißig gelernt.','good');break;
 case 'date':useAnnual(p,'date');if(p.age<16)throw Error('Dating ist erst ab 16 möglich.');if(p.relationships.some(r=>r.kind==='Partner'&&r.alive))throw Error('Du bist bereits in einer Beziehung.');{const r=relation(s,'Partner',Math.max(16,p.age+Math.floor(rng(s)*7)-3));p.relationships.push(r);log(s,`Du bist jetzt mit ${r.name} zusammen.`,'good');}break;
 case 'crime':
  case 'crime:pickpocket':
  case 'crime:shoplift':
  case 'crime:burglary':crimeAction(s,key==='crime'?'pickpocket':key.slice(6) as 'pickpocket'|'shoplift'|'burglary',undefined,undefined,expansionHooks(s));break;
  case 'library':useAnnual(p,'library',2);stat(p,'smarts',6);log(s,'Du hast die öffentliche Bibliothek besucht und dazugelernt.','good');break;
 case 'walk':useAnnual(p,'walk',2);stat(p,'health',3);stat(p,'happiness',4);log(s,'Ein langer Spaziergang hat dir gutgetan.','good');break;
 case 'volunteer':if(p.age<14)throw Error('Freiwilligenarbeit ist ab 14 möglich.');useAnnual(p,'volunteer');stat(p,'happiness',7);p.reputation=clamp((p.reputation??50)+8);log(s,'Du hast ehrenamtlich geholfen und neue Kontakte geknüpft.','good');break;
 case 'vacation':if(p.age<18)throw Error('Allein verreisen ist erst ab 18 möglich.');if(p.cash<2000)throw Error('Die Reise kostet 2.000 €.');useAnnual(p,'vacation');p.cash-=2000;stat(p,'happiness',20);stat(p,'health',4);log(s,'Du hast einen Urlaub gemacht.','good');break;
 case 'lottery':if(p.age<18)throw Error('Lotterie erst ab 18 Jahren.');if(p.cash<20)throw Error('Das Los kostet 20 €.');useAnnual(p,'lottery',5);p.cash-=20;if(chance(s,.002)){p.cash+=100000;log(s,'Du hast 100.000 € in der Lotterie gewonnen!','good');}else log(s,'Dein Lotterielos war leider keine Gewinnzahl.');break;
 case 'workhard':if(!p.jobId)throw Error('Du hast keinen Arbeitsplatz.');useAnnual(p,'workhard');p.careerPerformance=clamp((p.careerPerformance??50)+19);stat(p,'happiness',-3);log(s,'Du hast dich bei der Arbeit besonders angestrengt.','good');break;
 case 'raise':if(!p.jobId||p.jobYears<2)throw Error('Eine Gehaltsverhandlung ist erst nach zwei Berufsjahren möglich.');useAnnual(p,'raise');if(chance(s,Math.min(.85,(p.careerPerformance??50)/120))){p.salaryBonus=(p.salaryBonus||0)+2000;log(s,'Du hast eine Gehaltserhöhung von 2.000 € brutto pro Jahr ausgehandelt.','good');}else{stat(p,'happiness',-3);log(s,'Dein Wunsch nach einer Gehaltserhöhung wurde abgelehnt.','bad');}break;
 case 'prison:library':useAnnual(p,'prisonLibrary',2);stat(p,'smarts',3);log(s,'Du hast in der Gefängnisbibliothek gelesen.','good');break;
 case 'prison:yard':useAnnual(p,'prisonYard',2);stat(p,'health',4);stat(p,'happiness',3);log(s,'Du hast dich im Gefängnishof bewegt.','good');break;
 case 'prison:meditate':useAnnual(p,'prisonMeditate',2);stat(p,'happiness',5);log(s,'Du hast in deiner Zelle meditiert.','good');break;
 case 'prison:job':useAnnual(p,'prisonJob');p.cash+=80;stat(p,'happiness',2);log(s,'Du hast in der Haft gearbeitet und 80 € verdient.','good');break;
 case 'resign':if(!p.jobId)throw Error('Du hast keinen Job.');p.jobId=null;p.workplace=null;p.jobYears=0;p.salaryBonus=0;p.careerPerformance=50;log(s,'Du hast deinen Job gekündigt.');break;
 case 'child':{if(p.age<18||p.age>55)throw Error('Kinder sind in dieser Lebensphase nicht verfügbar.');const partner=p.relationships.find(r=>r.kind==='Partner'&&r.alive);if(!partner)throw Error('Du brauchst eine Partnerschaft.');if(chance(s,.28)){log(s,'Dieses Mal hat es mit dem Nachwuchs nicht geklappt.');break;}const r=relation(s,'Kind',0);r.bond=80;p.relationships.push(r);stat(p,'happiness',12);log(s,`${r.name} wurde geboren. Du bist Elternteil geworden!`,'good');}break;
 default:throw Error('Unbekannte Aktivität.');
 }
}
function interact(s:SaveGame,id:string,key:string){const p=s.person;const r=p.relationships.find(r=>r.id===id);if(!r||!r.alive)throw Error('Diese Person ist nicht verfügbar.');
 if(r.estranged)throw Error('Zwischen euch besteht kein Kontakt. Versuche eine Versöhnung.');
  if(lockedUp(p)&&!['talk','letter'].includes(key))requireFree(p);
 if(key==='talk'){useAnnual(p,'talk:'+id,3);r.bond=clamp(r.bond+8);r.trust=clamp(relationshipTrust(r)+3);r.lastContactAge=p.age;stat(p,'happiness',3);log(s,`Du hast mit ${r.name} gesprochen.`,'good');}
 else if(key==='compliment'){useAnnual(p,'compliment:'+id,2);r.bond=clamp(r.bond+11);r.trust=clamp(relationshipTrust(r)+3);r.lastContactAge=p.age;log(s,`Du hast ${r.name} ein Kompliment gemacht.`,'good');}
 else if(key==='argue'){r.bond=clamp(r.bond-20);r.trust=clamp(relationshipTrust(r)-12);r.lastContactAge=p.age;stat(p,'happiness',-4);log(s,`Du hattest Streit mit ${r.name}.`,'bad');}
 else if(key==='marry'){if(p.marriedPartnerId===r.id)throw Error('Ihr seid bereits verheiratet.');if(r.kind!=='Partner'||p.age<18||r.bond<65)throw Error('Eine Hochzeit ist noch nicht möglich.');if(p.cash<2500)throw Error('Die Hochzeit kostet 2.500 €.');p.cash-=2500;r.bond=clamp(r.bond+10);p.marriedPartnerId=r.id;r.trust=clamp(relationshipTrust(r)+8);r.lastContactAge=p.age;log(s,`Du hast ${r.name} geheiratet!`,'good');}
 else if(key==='breakup'){if(r.kind!=='Partner')throw Error('Nur Partner können sich trennen.');if(p.marriedPartnerId===r.id)throw Error('Verheiratete Paare müssen sich scheiden lassen.');r.kind='Ex-Partner';r.estranged=true;r.trust=clamp(relationshipTrust(r)-24);r.bond=clamp(r.bond-22);r.lastContactAge=p.age;stat(p,'happiness',-16);log(s,`Du hast dich von ${r.name} getrennt.`,'bad');}
 else if(key==='letter'){if(!lockedUp(p))throw Error('Briefe sind hier nur im Gefängnis-Menü verfügbar.');useAnnual(p,'letter:'+id,2);r.bond=clamp(r.bond+5);r.lastContactAge=p.age;log(s,`Du hast ${r.name} einen Brief geschrieben.`,'good');}
 else if(key==='gift'){if(p.cash<100)throw Error('Ein Geschenk kostet 100 €.');useAnnual(p,'gift:'+id);p.cash-=100;r.bond=clamp(r.bond+16);r.trust=clamp(relationshipTrust(r)+6);r.lastContactAge=p.age;stat(p,'happiness',4);log(s,`Du hast ${r.name} beschenkt.`,'good');}
 else if(key==='time'){useAnnual(p,'time:'+id,2);r.bond=clamp(r.bond+12);r.trust=clamp(relationshipTrust(r)+5);r.lastContactAge=p.age;stat(p,'happiness',5);log(s,`Du hast Zeit mit ${r.name} verbracht.`,'good');}
 else throw Error('Unbekannte Interaktion.');
}
function resolve(s:SaveGame,kind:string){const p=s.person;const pending=p.pending;if(!pending||!pending.options.some(o=>o.kind===kind))throw Error('Keine passende Entscheidung vorhanden.');p.pending=null;
 if(kind.startsWith('cross:')){resolveConnectionEvent(s,kind,expansionHooks(s));return;}
 switch(kind){
  case 'schoolHelp':p.schoolRecord&&(p.schoolRecord.discipline=clamp(p.schoolRecord.discipline+6));stat(p,'happiness',3);log(s,'Deine Lehrkraft hat dir geholfen, den Konflikt zu lösen.','good');break;
  case 'schoolCalm':stat(p,'happiness',2);log(s,'Du hast dich nicht provozieren lassen.');break;
  case 'schoolFight':p.schoolRecord&&(p.schoolRecord.discipline=clamp(p.schoolRecord.discipline-18));stat(p,'happiness',-7);log(s,'Du hast dich auf den Streit eingelassen und eine schulische Verwarnung erhalten.','bad');break;
  case 'prisonHelp':stat(p,'happiness',5);stat(p,'smarts',2);log(s,'Du hast einem Mitgefangenen geholfen.','good');break;
 case 'friend':{const r=relation(s,'Freund',p.age);p.relationships.push(r);log(s,`Du hast dich mit ${r.name} angefreundet.`,'good');break;}
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
 const inheritance=Math.max(0,Math.floor((p.cash+p.assets.reduce((a,b)=>a+b.value,0)+portfolioValue(p)-(p.loanBalance||0))*.8));
 const copy=createLife({name:child.name,gender:child.gender,country:p.country,seed:(s.seed^0x9e3779b9)>>>0,generation:p.generation+1,inheritance});
 copy.id=s.id;copy.ancestry=[...s.ancestry,previous];copy.achievements=structuredClone(s.achievements||[]);copy.ribbons=structuredClone(s.ribbons||[]);
 copy.person.heirlooms=structuredClone(p.heirlooms||[]);
 copy.person.heirloomSearchDate=p.heirloomSearchDate;copy.person.age=child.age;copy.person.school=schoolFor(child.age,0,false);copy.person.talent=child.talent;
  if(child.development!==undefined)copy.person.stats.smarts=Math.max(copy.person.stats.smarts,Math.round(25+child.development*.7));
  if(child.talent==='intelligenz')copy.person.stats.smarts=Math.max(80,copy.person.stats.smarts);
  if(child.talent==='sport')copy.person.stats.health=Math.max(85,copy.person.stats.health);
  if(child.talent==='schauspiel')copy.person.stats.looks=Math.max(80,copy.person.stats.looks);
 const partner=p.relationships.find(r=>r.kind==='Partner'&&r.alive);
 copy.person.relationships=partner?[{...partner,lastContactAge:child.age,kind:partner.gender==='weiblich'?'Mutter':partner.gender==='männlich'?'Vater':'Elternteil'}]:[];
 log(copy,`Du führst die Familie in Generation ${copy.person.generation} weiter. Erbe: ${money(inheritance)}.`,'good');return copy;
}
export function applyAction(input:SaveGame,action:Action):SaveGame{
 if(!isSaveGame(input))throw Error('Ungültiger Spielstand.');
 const s:SaveGame=structuredClone(input);const p=s.person;
 if(action.type==='NEW_GENERATION'){if(!p.alive){awardAchievements(s);recordRibbon(s);}const next=nextGeneration(s,action.id);awardAchievements(next);return next;}
 if(action.type==='REWIND'){
  if(!Number.isInteger(action.years)||action.years<1||action.years>5)throw Error('Ungültige Zeitreise.');
  const target=p.age-action.years;
  let index=-1;for(let i=0;i<(s.checkpoints||[]).length;i++){if(s.checkpoints![i]!.age===target)index=i;}
  if(index<0)throw Error('Für dieses Lebensjahr ist kein Zeitreise-Speicherpunkt vorhanden.');
  const snapshot=s.checkpoints![index]!;
  s.person=structuredClone(snapshot.person);s.seed=snapshot.seed;
   if(s.person.alive)s.ribbons=(s.ribbons||[]).filter(r=>r.generation!==s.person.generation);
  s.checkpoints=s.checkpoints!.slice(0,index);
  s.updated=Date.now();return s;
 }
 if(!p.alive)throw Error('Dieses Leben ist bereits beendet.');
 if(p.pending&&action.type!=='EVENT')throw Error('Bitte zuerst die offene Entscheidung treffen.');
 if(p.fighterCareer?.league&&(action.type==='JOB'||(action.type==='WORK'&&action.key==='apply')||(action.type==='SPORT'&&action.key==='tryout')||(action.type==='ACTOR'&&action.key==='audition')||(action.type==='MUSIC'&&action.key==='audition')||(action.type==='POLITICS'&&action.key==='launch')||(action.type==='DIRECTOR'&&action.key==='start')))throw Error('Beende zuerst deinen Vertrag in der Kampfliga.');
 if(spaceActive(p)&&(action.type==='JOB'||action.type==='STUDY'||(action.type==='WORK'&&action.key==='apply')||(action.type==='SPORT'&&action.key==='tryout')||(action.type==='FIGHTER'&&action.key==='join')||(action.type==='ACTOR'&&action.key==='audition')||(action.type==='MUSIC'&&action.key==='audition')||(action.type==='POLITICS'&&action.key==='launch')||(action.type==='DIRECTOR'&&action.key==='start')))throw Error('Beende zuerst deinen Raumfahrtvertrag.');
 switch(action.type){
 case 'BIRTH':{
   if(p.age<18||p.prisonYears>0)throw Error('Ein geplanter Nachwuchs ist jetzt nicht möglich.');
   if(!p.relationships.some(r=>r.kind==='Partner'&&r.alive))throw Error('Du brauchst eine Partnerschaft.');
   if(![1,2,3].includes(action.count)||!['weiblich','männlich','divers'].includes(action.gender)||!['musik','sport','schauspiel','intelligenz','keines'].includes(action.talent))throw Error('Ungültige Geburtsplanung.');
   useAnnual(p,'premium:birth');
   for(let i=0;i<action.count;i++){const child=relation(s,'Kind',0);child.gender=action.gender;child.talent=action.talent;child.bond=80;p.relationships.push(child);}
   stat(p,'happiness',8*action.count);
   log(s,action.count===1?'Ein Kind wurde geboren. Du hast dessen besondere Eigenschaften geplant.':`Deine Familie wächst um ${action.count} Kinder. Du hast Geschlecht und Talente festgelegt.`,'good');
   break;
 }
 case 'PREMIUM':{
   if(action.key==='jail-card'){
    if(p.prisonYears<=0)throw Error('Du befindest dich nicht im Gefängnis.');
    p.prisonYears=0;p.record=false;
    stat(p,'happiness',15);
    log(s,'Du wurdest freigelassen und deine Vorstrafe wurde gestrichen.','good');
   }else if(action.key==='golden-diploma'){
    if(p.age<18||p.universityYears>0)throw Error('Erst nach der Schulzeit und außerhalb eines laufenden Studiums möglich.');
    const degree=action.subject||'Geisteswissenschaften';
    if(!['Ingenieurwesen','Medizin','Rechtswissenschaften','Geisteswissenschaften'].includes(degree))throw Error('Ungültiger Studiengang.');
    p.degrees??=[];if(p.degrees.includes(degree)||p.degrees.length>=2)throw Error('Du kannst maximal zwei verschiedene Abschlüsse auswählen.');
    p.degrees.push(degree);p.degree=true;p.school='Abgeschlossen';
    log(s,`Du hast sofort deinen Abschluss in ${degree} erhalten.`,'good');
   }else if(action.key==='hollywood-star'){
    const famousJobs=['writer','chef','reporter','app-developer','dj','magician','model','actor','singer','musician','politician','athlete'];
    if(!famousJobs.includes(p.jobId||'')&&!p.business&&!actingActive(p)&&!p.musicCareer?.contractYears&&!sportActive(p)&&!(['Landesregierung','Staatsoberhaupt'].includes(p.politicalCareer?.office?.role||'')))throw Error('Du benötigst einen Beruf mit Bekanntheitspotenzial oder ein Unternehmen.');
    p.fame=Math.max(p.fame||0,80);
    stat(p,'happiness',5);
    log(s,'Du bist schlagartig bekannt geworden.','good');
   }else throw Error('Unbekannter Gegenstand.');
   break;
 }
 case 'CUSTOMIZE':{
  if(s.adminFullAccess!==true)throw Error('Diese Funktion ist nicht freigeschaltet.');
  for(const key of ['health','happiness','smarts','looks'] as Stat[]){const value=action.stats[key];if(!Number.isInteger(value)||value<0||value>100)throw Error('Ungültiger Charakterwert.');}
  p.stats={...action.stats};log(s,'Du hast deine persönlichen Werte angepasst.');break;
 }
 case 'HEIRLOOM':heirloomAction(s,action.key,action.id,expansionHooks(s));break;
 case 'FIGHTER':fighterAction(s,action.key,action.style,expansionHooks(s));break;
 case 'SPACE':spaceAction(s,action.key,action.mission,expansionHooks(s));break;
 case 'POLITICS':politicalAction(s,action.key,action.office,action.party,action.policy,action.budget,expansionHooks(s));break;
  case 'SPORT':sportAction(s,action.key,action.sport,action.league,expansionHooks(s));break;
  case 'DIRECTOR':directorAction(s,action.key,action.genre,action.budget,action.choice,expansionHooks(s));break;
 case 'ACTOR':if(action.key==='audition'&&(politicsActive(p)||p.politicalCareer?.campaign))throw Error('Beende zuerst deine politische Laufbahn.');if(action.key==='audition'&&sportActive(p))throw Error('Beende zuerst deinen Sportvertrag.');actorAction(s,action.key,action.offerId,expansionHooks(s));break;
 case 'MUSIC':if(action.key==='audition'&&(politicsActive(p)||p.politicalCareer?.campaign))throw Error('Beende zuerst deine politische Laufbahn.');if(action.key==='audition'&&actingActive(p))throw Error('Beende zuerst deine Schauspielrolle.');if(action.key==='audition'&&sportActive(p))throw Error('Beende zuerst deinen Sportvertrag.');musicAction(s,action.key,action.role,action.mode,expansionHooks(s));break;
 case 'FAMILY':familyAction(s,action.key,action.id,expansionHooks(s),()=>relation(s,'Freund',p.age));break;
  case 'EDUCATION':educationAction(s,action.key,action.club,expansionHooks(s));break;
  case 'MEDICAL':medicalAction(s,action.key,expansionHooks(s));break;
  case 'WORK':if(action.key==='apply'){if(!action.id)throw Error('Stelle fehlt.');applyForWork(s,action.id,expansionHooks(s));}
   else workAction(s,action.key,action.id,expansionHooks(s));break;
  case 'LIFESTYLE':lifestyleAction(s,action.key,action.value,expansionHooks(s),()=>{
    const child=relation(s,'Kind',0);child.bond=82;s.person.relationships.push(child);
   });break;
 case 'INVEST':investAction(s,action.key,action.assetId,action.quantity,expansionHooks(s));break;
 case 'SOCIAL':socialAction(s,action.key,action.platform,expansionHooks(s));break;
  case 'CRIME':crimeAction(s,action.key,action.contactId,action.skill,expansionHooks(s));break;
  case 'BUSINESS':businessAction(s,action.key,action.sector,expansionHooks(s));break;
  case 'RENTAL':rentalAction(s,action.key,action.id,expansionHooks(s));break;
  case 'AGE':{s.checkpoints??=[];s.checkpoints.push({age:p.age,person:structuredClone(p),seed:s.seed});if(s.checkpoints.length>15)s.checkpoints.splice(0,s.checkpoints.length-15);age(s);break;}
 case 'ACTIVITY':activity(s,action.key);break;
 case 'RELATION':interact(s,action.id,action.key);break;
 case 'EVENT':resolve(s,action.kind);break;
 case 'STUDY':if(politicsActive(p))throw Error('Während deiner Amtszeit ist ein Vollzeitstudium nicht möglich.');if(p.age<18||p.age>40||p.universityYears>0||p.degree||p.prisonYears>0)throw Error('Ein Studienbeginn ist gerade nicht möglich.');if(p.stats.smarts<55)throw Error('Für die Universität brauchst du mehr Intelligenz (mindestens 55).');p.universityYears=4;p.school='Universität';p.jobId=null;p.workplace=null;
   if((p.grades??0)>=85){p.cash+=3000;log(s,'Wegen deiner hervorragenden Schulnoten hast du ein Stipendium von 3.000 € erhalten.','good');}
   log(s,'Du hast ein vierjähriges Universitätsstudium begonnen.','good');break;
 case 'JOB':{requireFree(p);if(politicsActive(p))throw Error('Beende zuerst dein politisches Amt.');if(p.musicCareer&&p.musicCareer.contractYears>0)throw Error('Beende zuerst deinen Musikvertrag.');if(actingActive(p))throw Error('Beende zuerst deine Schauspielrolle.');if(sportActive(p))throw Error('Beende zuerst deinen Sportvertrag.');const job=CAREERS.find(j=>j.id===action.id);if(!job)throw Error('Unbekannte Stelle.');if(p.age<job.minAge||p.stats.smarts<job.minSmarts||(job.requiresDegree&&!p.degree)||p.prisonYears>0)throw Error('Du erfüllst die Voraussetzungen noch nicht.');p.jobId=job.id;p.jobYears=0;p.salaryBonus=0;p.careerPerformance=50;startWork(s,expansionHooks(s));log(s,`Du arbeitest jetzt als ${job.title}.`,'good');break;}
 case 'BUY':{requireFree(p);const item=ITEMS.find(i=>i.id===action.id);if(!item)throw Error('Unbekannter Gegenstand.');if(p.age<18||p.cash<item.price)throw Error('Kauf derzeit nicht möglich.');p.cash-=item.price;p.assets.push({id:uid(s),name:item.name,kind:item.kind,value:item.price,annualCost:item.annualCost});log(s,`Du hast ${item.name} für ${money(item.price)} gekauft.`,'good');break;}
 case 'SELL':{requireFree(p);const item=p.assets.find(i=>i.id===action.id);if(!item)throw Error('Gegenstand nicht vorhanden.');const sale=Math.floor(item.value*.85);p.cash+=sale;p.assets=p.assets.filter(i=>i.id!==item.id);log(s,`Du hast ${item.name} für ${money(sale)} verkauft.`,'good');break;}
 case 'EMIGRATE':if(p.age<18||p.prisonYears>0||!COUNTRIES.includes(action.country)||p.country===action.country)throw Error('Auswanderung nicht verfügbar.');if(p.cash<3500)throw Error('Die Auswanderung kostet 3.500 €.');p.cash-=3500;p.country=action.country;if(p.politicalCareer?.office||p.politicalCareer?.campaign){p.politicalCareer.office=null;p.politicalCareer.campaign=null;log(s,'Deine politische Laufbahn in diesem Land endet durch die Auswanderung.');}p.jobId=null;p.workplace=null;p.jobYears=0;if(p.sportCareer?.contract){p.sportCareer.contract=null;log(s,'Dein bisheriger Sportvertrag endet mit der Auswanderung.');}if(p.fighterCareer?.league){p.fighterCareer.league=false;p.fighterCareer.champion=false;log(s,'Dein Kampfliga-Vertrag endet durch die Auswanderung.');}if(p.spaceCareer?.employed){p.spaceCareer.employed=false;log(s,'Dein Raumfahrtvertrag endet durch die Auswanderung.');}log(s,`Du bist nach ${action.country} ausgewandert.`,'good');break;
 }
 awardAchievements(s);s.updated=Date.now();return s;
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
 if(!Array.isArray(p.relationships)||p.relationships.length>1000||!p.relationships.every(r=>str(r.id,100)&&str(r.name,150)&&['Mutter','Vater','Elternteil','Partner','Ex-Partner','Kind','Freund'].includes(r.kind)&&['weiblich','männlich','divers'].includes(r.gender)&&int(r.age,0,200)&&num(r.bond,0,100)&&typeof r.alive==='boolean'&&(r.talent===undefined||['musik','sport','schauspiel','intelligenz','keines'].includes(r.talent))))return false;
 if(p.talent!==undefined&&!['musik','sport','schauspiel','intelligenz','keines'].includes(p.talent))return false;
 if(p.degrees!==undefined&&(!Array.isArray(p.degrees)||p.degrees.length>2||!p.degrees.every(x=>['Ingenieurwesen','Medizin','Rechtswissenschaften','Geisteswissenschaften'].includes(x))||new Set(p.degrees).size!==p.degrees.length))return false;
 if(!Array.isArray(p.assets)||p.assets.length>1000||!p.assets.every(a=>str(a.id,100)&&str(a.name)&&['Haus','Auto'].includes(a.kind)&&num(a.value,0)&&num(a.annualCost,0)))return false;
 if(!validExtensions(p)||!validInvestments(p)||!validLifestyle(p)||!validSchoolHealth(p)||!validFamily(p)||!validMusic(p)||!validActing(p)||!validCrime(p)||!validDirector(p)||!validSport(p)||!validFighter(p)||!validSpace(p)||!validHeirlooms(p)||!validWork(p)||!validPolitics(p)||!validMilestones(x as SaveGame))return false;
  if(!Array.isArray(p.history)||p.history.length>250||!p.history.every(h=>str(h.id,100)&&int(h.age,0,200)&&str(h.text,1000)&&['normal','good','bad'].includes(h.tone)))return false;
 if(p.yearlyActions!==undefined&&(typeof p.yearlyActions!=='object'||p.yearlyActions===null||Object.keys(p.yearlyActions).length>250||!Object.entries(p.yearlyActions).every(([k,v])=>str(k,100)&&int(v,0,100))))return false;
 if(p.careerPerformance!==undefined&&!num(p.careerPerformance,0,100))return false;
 if(p.salaryBonus!==undefined&&!num(p.salaryBonus,0,1e9))return false;
 if(p.reputation!==undefined&&!num(p.reputation,0,100))return false;
 if(p.marriedPartnerId!==undefined&&p.marriedPartnerId!==null&&!str(p.marriedPartnerId,100))return false;
 if(p.grades!==undefined&&!num(p.grades,0,100))return false;
 if(x.checkpoints!==undefined){
  if(!Array.isArray(x.checkpoints)||x.checkpoints.length>15)return false;
  for(const cp of x.checkpoints){
   if(!cp||!int(cp.age,0,200)||!int(cp.seed,0,0xffffffff)||!cp.person||cp.person.age!==cp.age)return false;
   if(!isSaveGame({...x,checkpoints:undefined,person:cp.person}))return false;
  }
 }
 if(p.pending!==null){const ev=p.pending;if(!ev||!str(ev.id,100)||!str(ev.heading,200)||!str(ev.detail,1000)||!Array.isArray(ev.options)||ev.options.length<1||ev.options.length>12||!ev.options.every(o=>str(o.label,250)&&str(o.kind,100)))return false;}
 return true;
}
export function careerName(p:Person){return CAREERS.find(c=>c.id===p.jobId)?.title||'Keine Anstellung';}
export function netWorth(p:Person){return p.cash+p.assets.reduce((sum,item)=>sum+item.value,0)+portfolioValue(p)+heirloomWorth(p)-(p.loanBalance||0);}
