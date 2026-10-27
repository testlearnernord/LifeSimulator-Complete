import type {CrimeCareer,CrimeType,CriminalContact,Person,SaveGame} from './types.js';
import type {ExpansionHooks} from './expansions.js';

// Fictional progression only: deliberately contains no real-world crime techniques.
export const CRIME_TYPES:CrimeType[]=['shoplift','pickpocket','burglary'];
export const CRIME_LABELS:Record<CrimeType,string>={shoplift:'Ladendiebstahl',pickpocket:'Taschendiebstahl',burglary:'Einbruch'};
export const CRIME_RANKS=['Außenseiter','Neuling','Eingeweihter','Vertrauensperson'] as const;
const limit=(n:number)=>Math.max(0,Math.min(100,Math.round(n)));
const fmt=(n:number)=>Math.round(n).toLocaleString('de-DE')+' €';
const initial=():CrimeCareer=>({skills:{},heat:0,respect:0,network:[],rank:0,successes:0,failures:0,probationYears:0});
export const criminal=(p:Person):CrimeCareer=>p.crimeCareer??initial();
const state=(p:Person)=>p.crimeCareer??=(initial());
const inPrison=(p:Person)=>p.prisonYears>0;
const maxContact=10;
const newContact=(s:SaveGame,h:ExpansionHooks,origin:'Haft'|'Straße'):CriminalContact=>{
 const p=s.person,c=state(p);
 if(c.network.filter(x=>x.active).length>=maxContact)throw Error('Dein Kontaktbuch ist bereits voll.');
 const names=['Robin','Mika','Deniz','Sascha','Kim','Toni','Samira','Juri','Noah','Maren','Robinette','Bela'];
 const surnames=['Keller','Winter','Seidel','Brandt','Kaya','Richter','Schulz','Berg','Weber','Voss'];
 const name=names[Math.floor(h.random()*names.length)]+' '+surnames[Math.floor(h.random()*surnames.length)];
 const id='contact-'+p.age+'-'+Math.floor(h.random()*1e9).toString(36);
 const contact:CriminalContact={id,name,origin,trust:25+Math.floor(h.random()*23),influence:15+Math.floor(h.random()*60),lastMetAge:p.age,active:true};
 c.network.push(contact);return contact;
};
const contactFor=(p:Person,id:string|undefined):CriminalContact=>{
 const r=state(p).network.find(r=>r.id===id&&r.active);
 if(!r)throw Error('Dieser Kontakt ist nicht mehr verfügbar.');
 return r;
};
const skill=(c:CrimeCareer,type:CrimeType)=>c.skills[type]??0;
const increaseSkill=(c:CrimeCareer,type:CrimeType,amount:number)=>{c.skills[type]=limit(skill(c,type)+amount);};
export function crimeRisk(p:Person,type:CrimeType):number{
 const c=criminal(p);
 const base={shoplift:.27,pickpocket:.35,burglary:.44}[type];
 const trusted=Math.max(0,...c.network.filter(r=>r.active).map(r=>r.trust));
 return Math.max(.065,Math.min(.83,base+(.0013*c.heat)+(p.record?.05:0)+(c.probationYears>0?.07:0)-.002*skill(c,type)-.0006*(p.stats.smarts-50)-.00045*trusted));
}
const captured=(s:SaveGame,h:ExpansionHooks,years:number,description:string)=>{
 const p=s.person,c=state(p);
 c.failures++;p.record=true;p.prisonYears=years;p.jobId=null;p.salaryBonus=0;
 if(p.musicCareer)p.musicCareer.contractYears=0;
 if(p.actorCareer)p.actorCareer.current=null;
 const confiscated=Math.min(Math.max(0,p.cash),400+years*200);
 p.cash-=confiscated;
 c.heat=limit(c.heat+19);c.respect=limit(c.respect-4);
 h.stat('happiness',-18);
 h.log(description+' Du wurdest zu '+years+' Jahren Haft verurteilt. Beschlagnahmt: '+fmt(confiscated)+'.','bad');
};
export function crimeAction(s:SaveGame,key:'shoplift'|'pickpocket'|'burglary'|'meet'|'mentor'|'build-trust'|'crew-job'|'join'|'promote'|'leave'|'rehabilitate',contactId:string|undefined,skillType:CrimeType|undefined,h:ExpansionHooks){
 const p=s.person,c=state(p);
 if(CRIME_TYPES.includes(key as CrimeType)){
  const type=key as CrimeType;
  if(inPrison(p))throw Error('Während der Haft sind keine Straftaten möglich.');
  if(p.age<12)throw Error('Kriminalität ist erst ab 12 Jahren möglich.');
  h.annual('crime',2);
  const risk=crimeRisk(p,type);
  const detected=h.random()<risk;
  c.heat=limit(c.heat+({shoplift:5,pickpocket:8,burglary:13}[type]));
  if(detected){
   increaseSkill(c,type,2+Math.floor(h.random()*3));
   captured(s,h,1+Math.floor(h.random()*({shoplift:2,pickpocket:3,burglary:4}[type])),CRIME_LABELS[type]+': Dein Versuch wurde entdeckt.');
  }else{
   const tier={shoplift:1,pickpocket:2,burglary:3}[type];
   const reward=Math.round((120+Math.floor(h.random()*450)) * tier *(1+skill(c,type)/180));
   p.cash+=reward;c.successes++;c.respect=limit(c.respect+2+tier);
   const experience=5+Math.floor(h.random()*6);increaseSkill(c,type,experience);
   h.stat('happiness',2);h.log('Der '+CRIME_LABELS[type]+' brachte '+fmt(reward)+' ein. Erfahrung +'+experience+'.','good');
  }
  p.reputation=limit((p.reputation??50)-({shoplift:4,pickpocket:6,burglary:9}[type]));
  return;
 }
 if(key==='meet'){
  if(p.age<16)throw Error('Szene-Kontakte sind erst ab 16 Jahren möglich.');
  h.annual(inPrison(p)?'crime:prison:meet':'crime:street:meet');
  if(h.random()<.8){
   const r=newContact(s,h,inPrison(p)?'Haft':'Straße');
   h.log('Du hast '+r.name+' '+(inPrison(p)?'im Gefängnis':'über Bekannte')+' kennengelernt. Ob du der Person vertrauen kannst, bleibt offen.','good');
  }else h.log('Heute ist keine neue Bekanntschaft entstanden.');
  return;
 }
 if(key==='mentor'){
  if(!inPrison(p))throw Error('Mentoring durch Mitgefangene gibt es nur während der Haft.');
  const r=contactFor(p,contactId);
  if(r.origin!=='Haft')throw Error('Nur ein ehemaliger oder aktueller Haftkontakt kann dir hier helfen.');
  if(!skillType||!CRIME_TYPES.includes(skillType))throw Error('Bitte eine Fertigkeit auswählen.');
  h.annual('crime:prison:mentor',2);
  const gain=4+Math.floor(h.random()*8)+Math.floor(r.influence/30);
  increaseSkill(c,skillType,gain);r.trust=limit(r.trust+6);r.lastMetAge=p.age;c.respect=limit(c.respect+2);
  h.log('Du hast mit '+r.name+' über dessen Erfahrungen gesprochen. Dein '+CRIME_LABELS[skillType]+'-Wert steigt um '+gain+' Punkte.','good');
  return;
 }
 if(key==='build-trust'){
  const r=contactFor(p,contactId);
  h.annual('crime:contact:'+r.id,2);
  if(h.random()<.14){
   r.trust=limit(r.trust-12);h.log('Ein Gespräch mit '+r.name+' lief schlecht. Euer Vertrauen sinkt.','bad');
  }else{
   r.trust=limit(r.trust+8+Math.floor(h.random()*8));c.respect=limit(c.respect+1);
   h.log('Du hast deine Bekanntschaft mit '+r.name+' vertieft.','good');
  }
  r.lastMetAge=p.age;return;
 }
 if(inPrison(p))throw Error('Diese Aktion ist während der Haft gesperrt.');
 if(p.age<18)throw Error('Professionelle Unterweltkontakte sind ab 18 Jahren verfügbar.');
 if(key==='join'){
  if(c.rank!==0)throw Error('Du bist bereits in einem kriminellen Netzwerk aktiv.');
  if(c.respect<15||!c.network.some(r=>r.active&&r.trust>=35))throw Error('Du brauchst mindestens 15 Respekt und einen Kontakt mit 35 Vertrauen.');
  h.annual('crime:join');
  c.rank=1;h.log('Über einen Kontakt wurdest du in einen kleinen kriminellen Kreis aufgenommen.','good');return;
 }
 if(key==='leave'){
  if(c.rank===0)throw Error('Du gehörst momentan keinem kriminellen Netzwerk an.');
  c.rank=0;c.heat=limit(c.heat-10);h.stat('happiness',3);
  h.log('Du hast dich aus deinem kriminellen Umfeld zurückgezogen.');return;
 }
 if(key==='promote'){
  if(c.rank<1||c.rank>=3)throw Error('Für einen weiteren Aufstieg ist derzeit keine Position verfügbar.');
  const needed=c.rank===1?38:68,successes=c.rank===1?2:5;
  if(c.respect<needed||c.successes<successes)throw Error('Für den Aufstieg brauchst du mehr Respekt und erfolgreiche Aufträge.');
  h.annual('crime:promote');c.rank=(c.rank+1) as CrimeCareer['rank'];
  h.log('Du bist innerhalb des kriminellen Netzwerks aufgestiegen: '+CRIME_RANKS[c.rank]+'.','good');return;
 }
 if(key==='crew-job'){
  if(c.rank===0)throw Error('Du musst erst über Kontakte in das Netzwerk aufgenommen werden.');
  const ally=c.network.filter(r=>r.active&&r.trust>=35).sort((a,b)=>b.trust-a.trust)[0];
  if(!ally)throw Error('Dir fehlt ein verlässlicher Kontakt.');
  h.annual('crime:crew',2);
  const caughtRisk=Math.max(.10,Math.min(.68,.33+c.heat*.002-c.rank*.055-ally.trust*.0011-(p.stats.smarts-50)*.0004));
  if(h.random()<caughtRisk){
   const betrayed=h.random()<Math.max(.07,(75-ally.trust)/200);
   if(betrayed){ally.trust=limit(ally.trust-24);h.log(ally.name+' hat dich bei der gemeinsamen Aktion im Stich gelassen.','bad');}
   captured(s,h,1+Math.floor(h.random()*4),'Ein Auftrag aus dem kriminellen Netzwerk ist gescheitert.');
  }else{
   const reward=Math.round((450+Math.floor(h.random()*1600))*(1+c.rank*.65));
   p.cash+=reward;c.successes++;c.respect=limit(c.respect+8+c.rank*2);c.heat=limit(c.heat+12);
   ally.trust=limit(ally.trust+4);
   h.log('Ein fiktiver Auftrag für '+ally.name+' war erfolgreich. Gewinn: '+fmt(reward)+'.','good');
  }
  return;
 }
 if(key==='rehabilitate'){
  h.annual('crime:rehabilitate');
  c.heat=limit(c.heat-18);
  c.probationYears=Math.max(0,c.probationYears-1);
  h.stat('happiness',6);
  h.log('Du hast aktiv an deinem Neustart gearbeitet. Die polizeiliche Aufmerksamkeit sinkt.','good');
  return;
 }
 throw Error('Unbekannte kriminelle Aktivität.');
}
export function advanceCrime(s:SaveGame,h:ExpansionHooks){
 const p=s.person,c=p.crimeCareer;if(!c)return;
 c.heat=limit(c.heat-(inPrison(p)?6:12));
 if(c.probationYears>0)c.probationYears--;
 for(const r of c.network){
  if(!r.active)continue;
  if(p.age-r.lastMetAge>=3)r.trust=limit(r.trust-3);
  if(r.trust<8){r.active=false;h.log('Der Kontakt zu '+r.name+' ist eingeschlafen.');}
 }
}
export function crimeReleased(p:Person){if(!p.crimeCareer)return;p.crimeCareer.probationYears=Math.max(p.crimeCareer.probationYears,2);}
export function validCrime(p:Person):boolean{
 const c=p.crimeCareer;if(c===undefined)return true;
 const int=(n:unknown,max=100)=>typeof n==='number'&&Number.isInteger(n)&&n>=0&&n<=max;
 if(!c||!int(c.heat)||!int(c.respect)||!int(c.rank,3)||!int(c.successes,100000)||!int(c.failures,100000)||!int(c.probationYears,200))return false;
 if(!c.skills||typeof c.skills!=='object'||Array.isArray(c.skills))return false;
 if(Object.keys(c.skills).some(k=>!CRIME_TYPES.includes(k as CrimeType))||Object.values(c.skills).some(v=>!int(v)))return false;
 if(!Array.isArray(c.network)||c.network.length>maxContact)return false;
 const ids=new Set<string>();
 for(const r of c.network){
  if(!r||typeof r.id!=='string'||r.id.length>100||!r.id||ids.has(r.id)||typeof r.name!=='string'||r.name.length>80||!r.name||
     !['Haft','Straße'].includes(r.origin)||!int(r.trust)||!int(r.influence)||!int(r.lastMetAge,200)||r.lastMetAge>p.age||typeof r.active!=='boolean')return false;
  ids.add(r.id);
 }
 return true;
}
