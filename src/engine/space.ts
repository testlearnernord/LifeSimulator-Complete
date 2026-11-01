import type {Person,SaveGame,SpaceCareer,SpaceMission,SpaceMissionType} from './types.js';
import type {ExpansionHooks} from './expansions.js';

// Independent fictional space programme. No licensed agency, missions or proprietary game rules.
export const SPACE_MISSIONS:readonly SpaceMissionType[]=['Satellitenwartung','Orbitalforschung','Mondsonde'];
export const SPACE_RANKS:readonly string[]=['Anwärter/in','Missionsspezialist/in','Einsatzleiter/in','Forschungsdirektor/in'];
export type SpaceAction='study'|'fitness'|'flight'|'academy'|'apply'|'research'|'mission'|'recover'|'resign'|'retire';
const cap=(n:number)=>Math.max(0,Math.min(100,Math.round(n)));
const whole=(v:unknown,min:number,max:number)=>typeof v==='number'&&Number.isInteger(v)&&v>=min&&v<=max;
const fresh=(p:Person):SpaceCareer=>({
 knowledge:0,fitness:Math.min(70,p.stats.health),piloting:0,reputation:10,
 academyYears:0,certified:false,employed:false,retired:false,rank:0,
 serviceYears:0,injuryYears:0,research:0,discoveries:0,missions:[]
});
export const spaceActive=(p:Person)=>!!p.spaceCareer?.employed;
const employedElsewhere=(p:Person)=>!!(p.sportCareer?.contract||p.fighterCareer?.league||
 p.politicalCareer?.office||p.politicalCareer?.campaign||p.actorCareer?.current||
 p.musicCareer?.contractYears||p.directorCareer?.current);
const successful=(c:SpaceCareer)=>c.missions.filter(m=>m.success).length;
const missionSettings:Record<SpaceMissionType,{rank:number;knowledge:number;piloting:number;fitness:number;reward:number;penalty:number}>={
 Satellitenwartung:{rank:0,knowledge:55,piloting:50,fitness:40,reward:4000,penalty:.08},
 Orbitalforschung:{rank:1,knowledge:65,piloting:65,fitness:60,reward:12000,penalty:.20},
 Mondsonde:{rank:2,knowledge:80,piloting:80,fitness:75,reward:28000,penalty:.32}
};
export function spaceAction(s:SaveGame,key:SpaceAction,kind:SpaceMissionType|undefined,h:ExpansionHooks):void{
 const p=s.person;
 if(p.prisonYears>0)throw Error('Raumfahrt ist während der Haft nicht möglich.');
 if(key==='study'||key==='fitness'||key==='flight'){
  if(p.age<(key==='flight'?16:14))throw Error('Raumfahrttraining ist erst ab 14 Jahren, Flugtraining ab 16 möglich.');
  if(p.spaceCareer?.retired)throw Error('Deine Raumfahrtlaufbahn ist beendet.');
  if((p.spaceCareer?.injuryYears||0)>0)throw Error('Nach einer Verletzung ist zunächst Erholung nötig.');
  const cost=key==='study'?(p.age<18?0:180):key==='flight'?300:80;
  if(p.cash<cost)throw Error('Für das Training fehlt Geld.');
  h.annual('space:'+key,3);
  p.spaceCareer??=fresh(p);
  const c=p.spaceCareer;
  p.cash-=cost;
  if(key==='study'){c.knowledge=cap(c.knowledge+9+Math.floor(h.random()*4));h.stat('smarts',1);h.log('Du vertiefst dein Wissen über Raumfahrttechnik.','good');}
  if(key==='fitness'){c.fitness=cap(c.fitness+10);h.stat('health',2);h.log('Dein Konditionstraining stärkt dich für schwierige Einsätze.','good');}
  if(key==='flight'){c.piloting=cap(c.piloting+9+Math.floor(h.random()*4));c.knowledge=cap(c.knowledge+2);h.log('Du übst komplexe Flugmanöver im Simulator.','good');}
  return;
 }
 const c=p.spaceCareer;
 if(!c)throw Error('Beginne zuerst mit dem Raumfahrttraining.');
 if(key==='recover'){
  if(c.injuryYears===0)throw Error('Es liegt keine Raumfahrtverletzung vor.');
  if(p.cash<450)throw Error('Die Rehabilitation kostet 450 €.');
  h.annual('space:recover');p.cash-=450;c.injuryYears--;c.fitness=cap(c.fitness+6);h.stat('health',6);
  h.log('Die Rehabilitation verbessert deine Einsatzfähigkeit.','good');return;
 }
 if(c.retired)throw Error('Deine Raumfahrtlaufbahn ist beendet.');
 if(key==='academy'){
  if(p.age<20||p.age>55||!p.degree||p.stats.smarts<65)throw Error('Für die Akademie brauchst du einen Hochschulabschluss, Intelligenz und das passende Alter.');
  if(c.academyYears>0||c.certified)throw Error('Die Raumfahrtakademie wurde bereits begonnen oder abgeschlossen.');
  if(c.knowledge<35||c.piloting<35||c.fitness<45||p.stats.health<55)throw Error('Deine wissenschaftlichen, fliegerischen oder körperlichen Grundlagen reichen noch nicht.');
  if(p.cash<8000)throw Error('Die Raumfahrtakademie kostet 8.000 €.');
  h.annual('space:academy');p.cash-=8000;c.academyYears=2;
  h.log('Du beginnst die zweijährige Raumfahrtakademie.','good');return;
 }
 if(key==='apply'){
  if(!c.certified||c.academyYears>0||p.age<22||p.age>60||p.record||p.stats.health<55)throw Error('Für die Raumfahrtagentur fehlen Abschluss, Gesundheit oder weitere Voraussetzungen.');
  if(c.employed)throw Error('Du bist bereits bei der Raumfahrtagentur angestellt.');
  if(employedElsewhere(p))throw Error('Beende zuerst deine andere Spezialkarriere.');
  h.annual('space:apply');
  if(c.knowledge*.5+c.piloting*.3+c.fitness*.2+(h.random()-.5)*15<61){
   c.reputation=cap(c.reputation-1);h.log('Die Raumfahrtagentur lehnt deine Bewerbung vorerst ab.','bad');return;
  }
  p.jobId=null;p.jobYears=0;p.workplace=null;p.salaryBonus=0;p.careerPerformance=50;
  c.employed=true;c.reputation=cap(c.reputation+6);
  h.log('Du wirst bei einem fiktiven Raumfahrtforschungszentrum eingestellt.','good');return;
 }
 if(key==='resign'||key==='retire'){
  if(!c.employed)throw Error('Du hast keinen aktiven Raumfahrtvertrag.');
  c.employed=false;
  if(key==='retire'){c.retired=true;h.log('Du gehst aus dem Raumfahrtdienst in den Ruhestand.');}
  else h.log('Du verlässt die Raumfahrtagentur und behältst deine Qualifikation.');
  return;
 }
 if(!c.employed)throw Error('Du brauchst einen Vertrag mit der Raumfahrtagentur.');
 if(key==='research'){
  if(c.knowledge<50)throw Error('Für eigene Forschung benötigst du mehr Fachwissen.');
  h.annual('space:research',2);
  const before=Math.floor(c.research/25);
  c.research=cap(c.research+9+Math.floor(h.random()*7));
  c.reputation=cap(c.reputation+3);
  if(Math.floor(c.research/25)>before){
   c.discoveries++;c.reputation=cap(c.reputation+7);p.fame=cap((p.fame||0)+4);
   h.log('Dein Forschungsbericht führt zu einer neuen wissenschaftlichen Entdeckung.','good');
  }else h.log('Du wertest Messdaten aus und verbesserst dein Forschungsprofil.','good');
  return;
 }
 if(key==='mission'){
  if(!kind||!SPACE_MISSIONS.includes(kind))throw Error('Unbekannter Raumfahrtauftrag.');
  if(c.injuryYears>0)throw Error('Während der Rehabilitation darfst du keine Mission starten.');
  const m=missionSettings[kind];
  if(c.rank<m.rank||c.knowledge<m.knowledge||c.piloting<m.piloting||c.fitness<m.fitness)throw Error('Für diesen Einsatz fehlen Dienstgrad oder Fähigkeiten.');
  h.annual('space:mission',2);
  const probability=Math.max(.15,Math.min(.94,.55+c.knowledge*.0016+c.piloting*.0013+c.fitness*.0006-m.penalty));
  const success=h.random()<probability;
  const reward=success?m.reward:0;
  let discovery=false;
  if(success){
   p.cash+=reward;c.reputation=cap(c.reputation+8);c.research=cap(c.research+6);h.stat('happiness',5);
   if(kind!=='Satellitenwartung'&&h.random()<.40){discovery=true;c.discoveries++;p.fame=cap((p.fame||0)+5);}
   h.log('Die Mission gelingt und du erhältst eine Forschungsprämie.','good');
  }else{
   c.reputation=cap(c.reputation-5);c.injuryYears=h.random()<.25?2:1;
   c.fitness=cap(c.fitness-12);h.stat('health',c.injuryYears===2?-20:-9);
   h.log('Die Mission scheitert. Du wirst verletzt und musst pausieren.','bad');
  }
  const record:SpaceMission={age:p.age,kind,success,reward,discovery};
  c.missions.push(record);if(c.missions.length>60)c.missions.shift();
  const wins=successful(c);
  const old=c.rank;
  if(wins>=9&&c.research>=70)c.rank=3;
  else if(wins>=5&&c.research>=45)c.rank=Math.max(c.rank,2) as SpaceCareer['rank'];
  else if(wins>=2&&c.research>=20)c.rank=Math.max(c.rank,1) as SpaceCareer['rank'];
  if(c.rank>old){c.reputation=cap(c.reputation+10);h.log('Du wirst in der Raumfahrtagentur befördert.','good');}
  return;
 }
 throw Error('Unbekannte Raumfahrtaktion.');
}
export function advanceSpace(s:SaveGame,h:ExpansionHooks,jailedAtStart=false):void{
 const p=s.person,c=p.spaceCareer;
 if(!c)return;
 if(c.injuryYears>0){c.injuryYears--;c.fitness=cap(c.fitness+5);if(c.injuryYears===0)h.log('Deine Raumfahrtverletzung ist ausgeheilt.','good');}
 if(jailedAtStart&&c.academyYears>0){c.academyYears=0;h.log('Die Raumfahrtakademie beendet deine Teilnahme wegen der Haft.','bad');}
 if(c.academyYears>0){
  c.academyYears--;
  if(c.academyYears===0){
   if(c.knowledge>=60&&c.piloting>=55&&c.fitness>=55){
    c.certified=true;h.log('Du schließt die Raumfahrtakademie erfolgreich ab.','good');
   }else{c.academyYears=1;h.log('Du musst ein weiteres Akademiejahr absolvieren und deine Fähigkeiten verbessern.','bad');}
  }
 }
 if(c.employed&&(jailedAtStart||p.age>=65)){
  c.employed=false;if(p.age>=65)c.retired=true;
  h.log(jailedAtStart?'Die Raumfahrtagentur beendet deinen Vertrag wegen der Haft.':'Deine aktive Raumfahrtlaufbahn endet mit 65 Jahren.','bad');
 }
 if(c.employed){
  const annual=[48000,72000,95000,135000][c.rank]!;
  const pay=Math.round(annual*(c.injuryYears>0?.45:.76));
  p.cash+=pay;c.serviceYears++;c.reputation=cap(c.reputation+1);
  h.log('Du erhältst dein Jahresgehalt von der Raumfahrtagentur.','good');
 }
 c.fitness=cap(c.fitness-(c.employed?2:1));
}
export function validSpace(p:Person):boolean{
 const c=p.spaceCareer;
 if(c===undefined||c===null)return true;
 if(typeof c!=='object'||Array.isArray(c)||p.age<14||
  !whole(c.knowledge,0,100)||!whole(c.fitness,0,100)||!whole(c.piloting,0,100)||
  !whole(c.reputation,0,100)||!whole(c.research,0,100)||!whole(c.discoveries,0,200)||
  !whole(c.academyYears,0,2)||!whole(c.rank,0,3)||!whole(c.serviceYears,0,200)||
  !whole(c.injuryYears,0,2)||typeof c.certified!=='boolean'||typeof c.employed!=='boolean'||
  typeof c.retired!=='boolean'||!Array.isArray(c.missions)||c.missions.length>60)return false;
 if(c.certified&&c.academyYears>0||c.employed&&(!c.certified||c.retired||p.age<22||p.age>=65||p.jobId!==null||employedElsewhere(p))||
  c.retired&&c.academyYears>0)return false;
 return c.missions.every(m=>m&&typeof m==='object'&&whole(m.age,20,p.age)&&
  SPACE_MISSIONS.includes(m.kind)&&typeof m.success==='boolean'&&
  whole(m.reward,0,28000)&&m.reward===(m.success?missionSettings[m.kind].reward:0)&&
  typeof m.discovery==='boolean'&&(!m.discovery||m.success));
}
