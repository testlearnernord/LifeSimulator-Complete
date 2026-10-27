import type {DirectorCareer,DirectorGenre,DirectorProject,Person,SaveGame} from './types.js';
import type {ExpansionHooks} from './expansions.js';

// Eigenständige Filmwirtschaft, keine Originalformeln, -titel oder -assets.
export const DIRECTOR_GENRES:readonly DirectorGenre[]=['Drama','Komödie','Thriller'];
export const DIRECTOR_BUDGETS={kurz:8000,mittel:40000,gross:150000} as const;
export type DirectorBudget=keyof typeof DIRECTOR_BUDGETS;
export type DirectorChoice='newcomers'|'stars'|'careful'|'quick';
const cap=(v:number)=>Math.max(0,Math.min(100,Math.round(v)));
const whole=(v:unknown,lo:number,hi:number)=>typeof v==='number'&&Number.isInteger(v)&&v>=lo&&v<=hi;
const initial=():DirectorCareer=>({skill:0,reputation:10,awards:0,films:[],current:null});
const names:Record<DirectorGenre,string[]>={
 Drama:['Zwischen den Zeilen','Der letzte Sommer','Ein stilles Versprechen'],
 Komödie:['Chaos im Viertel','Drei sind einer zu viel','Das verrückte Wochenende'],
 Thriller:['Die Spur im Nebel','Letzte Ausfahrt','Die unbekannte Stimme']
};
export function directorAction(s:SaveGame,key:'study'|'start'|'cast'|'shoot'|'release'|'cancel',genre:DirectorGenre|undefined,budget:DirectorBudget|undefined,choice:DirectorChoice|undefined,h:ExpansionHooks){
 const p=s.person;
 if(p.prisonYears>0)throw Error('Filmregie ist während der Haft nicht verfügbar.');
 if(key==='study'){
  if(p.age<14)throw Error('Filmkurse sind erst ab 14 Jahren möglich.');
  const fee=p.age<18?0:250;
  if(p.cash<fee)throw Error('Für den Filmkurs fehlen 250 €.');
  h.annual('director:study',3);p.directorCareer??=initial();p.cash-=fee;
  p.directorCareer.skill=cap(p.directorCareer.skill+5+Math.floor(h.random()*8)+(p.talent==='schauspiel'?3:0));
  h.stat('smarts',2);h.log('Du hast Regie, Schnitt und Dramaturgie geübt. Regiefähigkeit: '+p.directorCareer.skill+' %.','good');return;
 }
 if(p.age<18)throw Error('Eigene Filmproduktionen sind erst ab 18 Jahren möglich.');
 const project=p.directorCareer?.current;
 if(key==='start'){
  if(project)throw Error('Schließe zuerst die laufende Produktion ab.');
  if(!genre||!DIRECTOR_GENRES.includes(genre)||!budget||!(budget in DIRECTOR_BUDGETS))throw Error('Ungültiges Filmprojekt.');
  const funds=DIRECTOR_BUDGETS[budget];
  if(p.cash<funds)throw Error('Für diese Produktion fehlt das Startkapital.');
  h.annual('director:start');p.directorCareer??=initial();
  const c=p.directorCareer,titles=names[genre],title=titles[c.films.length%titles.length]+' ('+(c.films.length+1)+')';
  const fresh:DirectorProject={title,genre,budget:funds,spent:0,script:cap(32+h.random()*36+c.skill*.2),cast:0,footage:0,phase:'casting',startAge:p.age};
  p.cash-=funds;c.current=fresh;h.log('Du finanzierst '+title+' mit '+funds.toLocaleString('de-DE')+' € Eigenkapital.');return;
 }
 if(!project)throw Error('Du hast gerade keine laufende Filmproduktion.');
 const c=p.directorCareer!;
 if(key==='cast'){
  if(project.phase!=='casting')throw Error('Das Casting ist bereits abgeschlossen.');
  if(choice!=='newcomers'&&choice!=='stars')throw Error('Ungültige Besetzungswahl.');
  if(choice==='stars'&&project.budget<40000)throw Error('Für bekannte Darsteller ist das Budget zu klein.');
  const cost=Math.round(project.budget*(choice==='stars'?.48:.23));
  if(project.spent+cost>project.budget)throw Error('Das Produktionsbudget reicht nicht.');
  project.spent+=cost;project.cast=cap((choice==='stars'?56:28)+h.random()*27+c.reputation*.12);
  project.phase='shooting';h.log(choice==='stars'?'Du hast bekannte Darsteller verpflichtet.':'Du hast ein Nachwuchsensemble engagiert.');return;
 }
 if(key==='shoot'){
  if(project.phase!=='shooting')throw Error('Vor dem Dreh musst du das Ensemble besetzen.');
  if(choice!=='careful'&&choice!=='quick')throw Error('Ungültiger Drehplan.');
  const cost=Math.round(project.budget*(choice==='careful'?.4:.25));
  if(project.spent+cost>project.budget)throw Error('Das Produktionsbudget reicht nicht.');
  project.spent+=cost;project.footage=cap(20+h.random()*34+c.skill*.4+(choice==='careful'?22:5));
  project.phase='release';h.log(choice==='careful'?'Du hast jede Szene sorgfältig gedreht.':'Du hast den Drehplan gestrafft und Kosten gespart.');return;
 }
 if(key==='cancel'){
  const refund=project.budget-project.spent;p.cash+=refund;c.reputation=cap(c.reputation-3);c.current=null;
  h.log('Du hast die Produktion abgebrochen. Restbudget: '+refund.toLocaleString('de-DE')+' €.','bad');return;
 }
 if(key==='release'){
  if(project.phase!=='release')throw Error('Vor der Premiere fehlen noch Dreharbeiten.');
  const rating=cap(project.script*.3+project.cast*.32+project.footage*.38+(h.random()-.5)*20);
  const boxOffice=Math.round(project.budget*(.12+rating/65+h.random()*1.55)*(.7+c.reputation/150));
  const distribution=Math.round(boxOffice*.62),refund=project.budget-project.spent;
  const prize=rating>=78&&h.random()<Math.min(.65,(rating-70)/65);
  p.cash+=refund+distribution;c.reputation=cap(c.reputation+(rating>=60?7:rating>=40?1:-7));
  c.skill=cap(c.skill+3);c.awards+=Number(prize);
  p.fame=cap((p.fame??0)+Math.max(1,Math.round(rating/12))+(prize?8:0));
  c.films.unshift({title:project.title,genre:project.genre,age:p.age,budget:project.budget,boxOffice,rating,award:prize});
  c.films=c.films.slice(0,40);c.current=null;
  h.log('Premiere von '+project.title+': Kritik '+rating+' %, Kinokasse '+boxOffice.toLocaleString('de-DE')+' €, Rückfluss '+distribution.toLocaleString('de-DE')+' €.'+(prize?' Ein Filmpreis!':''),rating>=55?'good':'bad');return;
 }
 throw Error('Unbekannte Regieaktion.');
}
export function advanceDirector(s:SaveGame,h:ExpansionHooks){
 const p=s.person,c=p.directorCareer,q=c?.current;
 if(!c||!q||p.age<=q.startAge)return;
 if(p.age-q.startAge>=3){
  const refund=q.budget-q.spent;p.cash+=refund;c.current=null;c.reputation=cap(c.reputation-6);
  h.log('Das Filmprojekt wurde nach drei Jahren eingestellt. Restbudget: '+refund.toLocaleString('de-DE')+' €.','bad');return;
 }
 const delay=Math.min(q.budget-q.spent,Math.round(q.budget*.04));
 q.spent+=delay;q.script=cap(q.script-4);
 h.log('Die verzögerte Filmproduktion kostet weitere '+delay.toLocaleString('de-DE')+' €.','bad');
}
export function validDirector(p:Person):boolean{
 const c=p.directorCareer;
 if(c===undefined||c===null)return true;
 if(typeof c!=='object'||Array.isArray(c)||!whole(c.skill,0,100)||!whole(c.reputation,0,100)||!whole(c.awards,0,1000)||!Array.isArray(c.films)||c.films.length>40)return false;
 const genre=(g:unknown)=>typeof g==='string'&&DIRECTOR_GENRES.includes(g as DirectorGenre);
 const title=(t:unknown)=>typeof t==='string'&&t.length>0&&t.length<=120;
 if(!c.films.every(f=>f&&title(f.title)&&genre(f.genre)&&whole(f.age,18,200)&&whole(f.budget,0,1e9)&&whole(f.boxOffice,0,1e12)&&whole(f.rating,0,100)&&typeof f.award==='boolean'))return false;
 const q=c.current;
 if(q===null)return true;
 return !!q&&title(q.title)&&genre(q.genre)&&whole(q.budget,1,1e9)&&whole(q.spent,0,q.budget)&&whole(q.script,0,100)&&whole(q.cast,0,100)&&whole(q.footage,0,100)&&['casting','shooting','release'].includes(q.phase)&&whole(q.startAge,18,p.age);
}
