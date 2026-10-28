import {CAREERS} from './catalog.js';
import type {Person,SaveGame,WorkContact,Workplace} from './types.js';
import type {ExpansionHooks} from './expansions.js';

// Eigenständige Arbeitswelt: fiktive Personen, keine BitLife-Formeln.
const clamp=(n:number)=>Math.max(0,Math.min(100,Math.round(n)));
const first=['Mira','Robin','Lina','Emil','Sam','Lea','Jana','Noah','Kim','Felix'];
const last=['Lenz','Becker','Wagner','Costa','Meyer','Silva','Fischer','Nguyen'];
const name=(h:ExpansionHooks)=>first[Math.floor(h.random()*first.length)]+' '+last[Math.floor(h.random()*last.length)];
const contact=(h:ExpansionHooks,role:WorkContact['role'],age:number):WorkContact=>({
 id:'office-'+age+'-'+Math.floor(h.random()*1e9).toString(36),name:name(h),role,
 bond:clamp(35+h.random()*40),competence:clamp(30+h.random()*60)
});
export function startWork(s:SaveGame,h:ExpansionHooks){
 const p=s.person;
 if(!p.jobId){p.workplace=null;return;}
 p.workplace={jobId:p.jobId,boss:contact(h,'Chef',p.age),
  coworkers:[contact(h,'Kollege',p.age),contact(h,'Kollege',p.age)],
  rank:0,warnings:0,reviews:0};
}
function ensureWork(s:SaveGame,h:ExpansionHooks):Workplace{
 if(!s.person.jobId)throw Error('Du hast keinen regulären Arbeitsplatz.');
 if(!s.person.workplace||s.person.workplace.jobId!==s.person.jobId)startWork(s,h);
 return s.person.workplace!;
}
export function applyForWork(s:SaveGame,id:string,h:ExpansionHooks){
 const p=s.person,job=CAREERS.find(c=>c.id===id);
 if(!job)throw Error('Unbekannte Stelle.');
 if(p.prisonYears>0)throw Error('Während der Haft sind Bewerbungen nicht möglich.');
 if(p.musicCareer?.contractYears||p.actorCareer?.current||p.sportCareer?.contract)throw Error('Beende zuerst deine aktive Spezialkarriere.');
 if(p.age<job.minAge||p.stats.smarts<job.minSmarts||(job.requiresDegree&&!p.degree))throw Error('Du erfüllst die Voraussetzungen noch nicht.');
 if(p.jobId===id)throw Error('Du arbeitest bereits in diesem Beruf.');
 h.annual('work:interview',3);
 const score=p.stats.smarts*.32+p.stats.looks*.2+(p.careerPerformance??50)*.2+h.random()*28-(p.record?15:0);
 const threshold=35+job.minSmarts*.28;
 if(score<threshold){
  h.stat('happiness',-2);
  h.log('Das Vorstellungsgespräch für '+job.title+' lief nicht überzeugend. Du erhältst eine Absage.','bad');
  return;
 }
 p.jobId=id;p.jobYears=0;p.careerPerformance=50;p.salaryBonus=0;
 startWork(s,h);
 h.log('Du überzeugst im Bewerbungsgespräch und beginnst als '+job.title+'.','good');
}
export function workAction(s:SaveGame,key:'introduce'|'talk'|'teamwork'|'conflict'|'promotion',id:string|undefined,h:ExpansionHooks){
 const p=s.person;
 if(p.prisonYears>0)throw Error('Während der Haft kannst du nicht zur Arbeit gehen.');
 const office=ensureWork(s,h);
 if(key==='introduce'){h.log('Du lernst deine Führungskraft und zwei Kolleginnen oder Kollegen kennen.');return;}
 if(key==='promotion'){
  if(p.jobYears<2)throw Error('Für eine Beförderung brauchst du mindestens zwei Berufsjahre.');
  if(office.rank>=3)throw Error('Du hast die höchste Stufe deiner Laufbahn erreicht.');
  h.annual('work:promotion');
  const good=(p.careerPerformance??50)>=70&&office.boss.bond>=60;
  if(good&&h.random()<Math.min(1,.55+((p.careerPerformance??50)-70)/100+(office.boss.bond-60)/100)){
   office.rank++;
   const base=CAREERS.find(c=>c.id===p.jobId)?.salary||30000;
   p.salaryBonus=(p.salaryBonus||0)+Math.round(base*.08);
   p.careerPerformance=clamp((p.careerPerformance??50)-8);
   office.boss.bond=clamp(office.boss.bond+5);
   h.log('Du wirst in Karrierestufe '+(office.rank+1)+' befördert und erhältst einen Gehaltsaufschlag.','good');
  }else{
   office.boss.bond=clamp(office.boss.bond-7);
   h.stat('happiness',-3);
   h.log('Deine Führungskraft lehnt die Beförderung ab.','bad');
  }
  return;
 }
 const colleague=[office.boss,...office.coworkers].find(c=>c.id===id);
 if(!colleague)throw Error('Dieser Arbeitskontakt ist nicht mehr verfügbar.');
 if(key==='talk'){
  h.annual('work:talk:'+colleague.id,2);
  colleague.bond=clamp(colleague.bond+8);
  if(colleague.role==='Chef')p.careerPerformance=clamp((p.careerPerformance??50)+2);
  h.stat('happiness',2);
  h.log('Du führst ein gutes Gespräch mit '+colleague.name+'.','good');
 }else if(key==='teamwork'){
  h.annual('work:teamwork:'+colleague.id);
  colleague.bond=clamp(colleague.bond+10);
  p.careerPerformance=clamp((p.careerPerformance??50)+10+Math.floor(colleague.competence/20));
  h.stat('happiness',2);
  h.log('Du erledigst mit '+colleague.name+' eine anspruchsvolle Aufgabe.','good');
 }else if(key==='conflict'){
  h.annual('work:conflict:'+colleague.id);
  colleague.bond=clamp(colleague.bond-25);
  office.boss.bond=clamp(office.boss.bond-(colleague.role==='Chef'?12:5));
  p.careerPerformance=clamp((p.careerPerformance??50)-13);
  if(colleague.role==='Chef')office.warnings=Math.min(2,office.warnings+1);
  h.stat('happiness',-6);
  h.log('Du gerätst am Arbeitsplatz mit '+colleague.name+' aneinander.','bad');
 }else throw Error('Unbekannte Arbeitsaktion.');
}
export function promoteWork(p:Person){
 if(p.workplace&&p.workplace.jobId===p.jobId)p.workplace.rank=Math.min(3,p.workplace.rank+1);
}
export function workYear(s:SaveGame,h:ExpansionHooks){
 const p=s.person;
 if(!p.jobId||p.prisonYears>0){p.workplace=null;return;}
 const office=ensureWork(s,h);
 office.reviews=Math.min(200,office.reviews+1);
 const team=Math.round(office.coworkers.reduce((sum,c)=>sum+c.bond,0)/office.coworkers.length);
 p.careerPerformance=clamp((p.careerPerformance??50)+(office.boss.bond>=65?2:-2)+(team>=65?2:team<30?-3:0));
 if((p.careerPerformance??50)<22&&office.boss.bond<50){
  office.warnings++;
  h.log('Deine Führungskraft mahnt deine schwache Arbeitsleistung an.','bad');
 }else if((p.careerPerformance??50)>65&&office.warnings>0)office.warnings--;
 if(office.warnings>=3){
  h.log('Nach mehreren Abmahnungen verlierst du deinen Arbeitsplatz.','bad');
  p.jobId=null;p.jobYears=0;p.salaryBonus=0;p.careerPerformance=50;p.workplace=null;
  h.stat('happiness',-15);
  return;
 }
 for(const c of [office.boss,...office.coworkers]){
  c.bond=clamp(c.bond+(h.random()<.3?-3:1));
 }
 if(h.random()<.12){
  const c=office.coworkers[Math.floor(h.random()*office.coworkers.length)]!;
  c.bond=clamp(c.bond-8);
  h.log('Ein Missverständnis im Team mit '+c.name+' belastet die Zusammenarbeit.');
 }
}
export function validWork(p:Person):boolean{
 const w=p.workplace;
 if(w===undefined||w===null)return true; // Savegames vor dieser Erweiterung
 const integer=(v:unknown,low:number,high:number)=>typeof v==='number'&&Number.isInteger(v)&&v>=low&&v<=high;
 const validContact=(c:WorkContact,role:WorkContact['role'])=>c&&typeof c==='object'&&
  typeof c.id==='string'&&c.id.length>0&&c.id.length<=100&&typeof c.name==='string'&&c.name.length>0&&c.name.length<=100&&
  c.role===role&&integer(c.bond,0,100)&&integer(c.competence,0,100);
 if(typeof w!=='object'||Array.isArray(w)||!CAREERS.some(c=>c.id===w.jobId)||
    !integer(w.rank,0,3)||!integer(w.warnings,0,2)||!integer(w.reviews,0,200)||
    !validContact(w.boss,'Chef')||!Array.isArray(w.coworkers)||w.coworkers.length!==2||
    !w.coworkers.every(c=>validContact(c,'Kollege')))return false;
 return new Set([w.boss.id,...w.coworkers.map(c=>c.id)]).size===3;
}
