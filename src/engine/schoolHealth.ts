import type {Person,SaveGame,SchoolRecord,Illness} from './types.js';
import type {ExpansionHooks} from './expansions.js';

// Original, deliberately simplified life-sim mechanics, not BitLife's internal formulas.
// Save additions are optional so v0.1–0.6 lives still load without migration.
const clamp=(value:number)=>Math.max(0,Math.min(100,Math.round(value)));
export const SCHOOL_CLUBS:SchoolRecord['club'][]=['kein','sport','musik','technik','kunst'];
export const schoolAge=(p:Person)=>p.age>=6&&p.age<18&&p.prisonYears===0;
const useSchool=(p:Person)=>{if(!schoolAge(p))throw Error('Diese Aktion ist nur während deiner Schulzeit außerhalb der Haft möglich.');};
const record=(p:Person):SchoolRecord=>{
 if(!p.schoolRecord)p.schoolRecord={
  performance:clamp(p.grades??Math.round((p.stats.smarts+50)/2)),
  attendance:90,discipline:85,club:'kein'
 };
 p.grades=p.schoolRecord.performance;
 return p.schoolRecord;
};
const grade=(p:Person,delta:number)=>{
 const r=record(p);r.performance=clamp(r.performance+delta);p.grades=r.performance;
};
export function educationAction(s:SaveGame,key:'study'|'tutor'|'socialize'|'club'|'skip'|'teacher',club:SchoolRecord['club']|undefined,h:ExpansionHooks){
 const p=s.person;useSchool(p);const r=record(p);
 switch(key){
  case 'study':
   h.annual('school:study',2);grade(p,7+Math.round(h.random()*5));h.stat('smarts',3);h.stat('happiness',-2);
   h.log('Du hast dich intensiv auf die Schule vorbereitet. Deine Leistungen wurden besser.','good');break;
  case 'tutor':
   if(p.cash<150)throw Error('Die Nachhilfe kostet 150 €.');
   h.annual('school:tutor',2);p.cash-=150;grade(p,10+Math.round(h.random()*7));h.stat('smarts',2);
   h.log('Du hast Nachhilfe genommen. Deine Schulnoten wurden besser.','good');break;
  case 'socialize':
   h.annual('school:friends',2);r.attendance=clamp(r.attendance+2);
   h.stat('happiness',6);h.log('Du hast Zeit mit Klassenkameraden verbracht und dich in der Schule wohler gefühlt.','good');break;
  case 'teacher':
   h.annual('school:teacher');r.discipline=clamp(r.discipline+8);grade(p,3);
   h.log('Du hattest ein konstruktives Gespräch mit deiner Lehrkraft.','good');break;
  case 'skip':
   h.annual('school:skip',2);r.attendance=clamp(r.attendance-15);r.discipline=clamp(r.discipline-11);grade(p,-6);
   h.stat('happiness',4);
   h.log('Du hast den Unterricht geschwänzt. Deine Leistungen und Disziplin leiden.','bad');break;
  case 'club':
   if(!club||!SCHOOL_CLUBS.includes(club)||club==='kein')throw Error('Unbekannte Arbeitsgemeinschaft.');
   h.annual('school:club');r.club=club;h.stat('happiness',5);
   if(club==='technik')h.stat('smarts',4);
   if(club==='sport')h.stat('health',3);
   if(club==='kunst'||club==='musik')h.stat('looks',1);
   h.log('Du hast dich der '+({sport:'Sport-AG',musik:'Musik-AG',technik:'Technik-AG',kunst:'Kunst-AG'} as Record<string,string>)[club]+' angeschlossen.','good');break;
 }
}
export function educationYear(s:SaveGame,h:ExpansionHooks){
 const p=s.person;
 if(p.age===6){record(p);h.log('Dein erster Schultag! Du lernst neue Fächer und deine Klasse kennen.');}
 if(p.age>=6&&p.age<18&&p.prisonYears===0){
  const r=record(p);
  const attendanceEffect=r.attendance<55?-6:r.attendance>=90?2:0;
  const disciplineEffect=r.discipline<45?-5:0;
  const smartEffect=p.stats.smarts>=75?3:p.stats.smarts<30?-3:0;
  grade(p,Math.round((h.random()-.5)*10)+attendanceEffect+disciplineEffect+smartEffect);
  if(r.club!=='kein'){
   if(r.club==='sport')h.stat('health',2);
   if(r.club==='technik')h.stat('smarts',2);
   if(r.club==='musik'||r.club==='kunst')h.stat('happiness',2);
  }
  r.attendance=clamp(r.attendance+3);
  r.discipline=clamp(r.discipline+2);
  if(p.age===11)h.log('Deine Schullaufbahn geht an einer weiterführenden Schule weiter. Leistungsstand: '+r.performance+' %.');
  if(r.performance<30){h.stat('happiness',-5);h.log('Deine Noten sind bedenklich schlecht. Ohne zusätzlichen Einsatz droht ein schwieriger Abschluss.','bad');}
  if(p.age===17)h.log('Dein letztes Schuljahr steht an. Deine aktuellen Leistungen liegen bei '+r.performance+' %.');
 }
 if(p.age===18&&p.schoolRecord){
  const result=p.schoolRecord.performance;
  const level=result>=85?'mit Auszeichnung':result>=60?'mit guten Leistungen':result>=40?'erfolgreich':'mit schwachen Leistungen';
  h.log('Du hast die Schulzeit '+level+' abgeschlossen. Abschlussleistung: '+result+' %.',result>=60?'good':result<40?'bad':'normal');
 }
}
export function medicalAction(s:SaveGame,key:'checkup'|'treat'|'therapy'|'rest',h:ExpansionHooks){
 const p=s.person;if(p.prisonYears>0)throw Error('Während der Haft bekommst du medizinische Hilfe über den Gefängnisdienst.');
 const illness=p.illness;
 switch(key){
  case 'checkup':
   if(p.cash<100)throw Error('Eine Untersuchung kostet 100 €.');
   h.annual('medical:checkup',2);p.cash-=100;
   if(illness){illness.diagnosed=true;h.log('Die Untersuchung ergab: '+illness.kind+'. Die Beschwerden sind '+(illness.severity>=60?'stark.':'leicht bis mäßig.')+' Eine Behandlung ist möglich.','bad');}
   else{h.stat('health',2);h.log('Die allgemeine Untersuchung ergab keine akute Erkrankung.','good');}
   break;
  case 'treat':
   if(!illness)throw Error('Du hast aktuell keine behandlungsbedürftige Erkrankung.');
   if(!illness.diagnosed)throw Error('Lass deine Beschwerden zunächst untersuchen.');
   if(p.cash<350)throw Error('Die Behandlung kostet 350 €.');
   h.annual('medical:treat',2);p.cash-=350;
   illness.severity=clamp(illness.severity-45-Math.round(h.random()*20));
   h.stat('health',12);
   if(illness.severity<=10){p.illness=null;h.log('Die Behandlung war erfolgreich. Du bist wieder gesund.','good');}
   else h.log('Die Behandlung hat deine Beschwerden deutlich gelindert.','good');
   break;
  case 'therapy':
   if(p.age<12)throw Error('Eine eigenständige Therapiesitzung ist ab 12 Jahren verfügbar.');
   if(p.cash<220)throw Error('Die Therapiesitzung kostet 220 €.');
   h.annual('medical:therapy',2);p.cash-=220;h.stat('happiness',12);
   if(p.illness?.kind==='Erschöpfung'){p.illness.severity=clamp(p.illness.severity-25);if(p.illness.severity===0)p.illness=null;}
   h.log('Du hast über deine Sorgen gesprochen und fühlst dich emotional entlastet.','good');break;
  case 'rest':
   h.annual('medical:rest',2);h.stat('happiness',5);h.stat('health',3);
   if(illness){illness.severity=clamp(illness.severity-10);if(illness.severity===0)p.illness=null;}
   h.log('Du hast dir bewusst einen ruhigen Tag gegönnt.','good');break;
 }
}
export function healthYear(s:SaveGame,h:ExpansionHooks){
 const p=s.person;
 if(p.illness){
  const illness=p.illness;
  illness.years++;
  const recovery=9+Math.round(h.random()*14);
  const worsen=h.random()<.22?Math.round(h.random()*15):0;
  illness.severity=clamp(illness.severity-recovery+worsen);
  if(illness.severity===0){p.illness=null;h.log('Deine Erkrankung ist abgeklungen.','good');}
  else{
   h.stat('health',-Math.ceil(illness.severity/16));
   h.stat('happiness',-Math.ceil(illness.severity/25));
   if(illness.years>=2)h.log('Die Beschwerden durch '+illness.kind+' halten weiter an.','bad');
  }
 }else if(p.age>=3&&h.random()<.08){
  const kind:Illness['kind']=p.stats.happiness<30?'Erschöpfung':h.random()<.64?'Erkältung':'Grippe';
  p.illness={kind,severity:25+Math.round(h.random()*40),years:0,diagnosed:false};
  h.stat('health',-4);
  h.log('Du fühlst dich krank und hast gesundheitliche Beschwerden. Eine Untersuchung könnte helfen.','bad');
 }
}
export function validSchoolHealth(p:Person):boolean{
 const bounded=(n:unknown)=>typeof n==='number'&&Number.isInteger(n)&&n>=0&&n<=100;
 if(p.schoolRecord!==undefined){
  const r=p.schoolRecord;
  if(!r||!bounded(r.performance)||!bounded(r.attendance)||!bounded(r.discipline)||!SCHOOL_CLUBS.includes(r.club))return false;
  if(p.grades!==undefined&&p.grades!==r.performance)return false;
 }
 if(p.illness!==undefined&&p.illness!==null){
  const ill=p.illness;
  if(!ill||!['Erkältung','Grippe','Erschöpfung'].includes(ill.kind)||!bounded(ill.severity)||
    !Number.isInteger(ill.years)||ill.years<0||ill.years>200||typeof ill.diagnosed!=='boolean')return false;
 }
 return true;
}
