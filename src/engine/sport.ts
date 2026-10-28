import type {Person,SaveGame,SportCareer,SportKind,SportLeague,SportSeason} from './types.js';
import type {ExpansionHooks} from './expansions.js';

// Fictional clubs, leagues and balance. No original BitLife rules or licensed sports brands.
export const SPORTS:readonly SportKind[]=['Fußball','Basketball','Handball'];
export const SPORT_LEAGUES:readonly SportLeague[]=['Regional','National'];
const CLUBS:Record<SportKind,readonly string[]>={
 'Fußball':['Hafenstadt 04','Rotweiß Birkenfeld','Sportfreunde Süd'],
 'Basketball':['Nordlichter BC','Stadtfalken','Kometen 08'],
 'Handball':['HC Küstenwind','VfL Sonnental','Waldstadt Handball']
};
const cap=(v:number)=>Math.max(0,Math.min(100,Math.round(v)));
const whole=(v:unknown,lo:number,hi:number)=>typeof v==='number'&&Number.isInteger(v)&&v>=lo&&v<=hi;
const fresh=(sport:SportKind):SportCareer=>({sport,skill:0,fitness:55,reputation:10,injuryYears:0,retired:false,seasons:[],titles:0,contract:null});
export const sportActive=(p:Person)=>!!p.sportCareer?.contract;
const fee=(age:number)=>age<18?0:120;
const available=(p:Person)=>p.prisonYears===0;
export function sportAction(s:SaveGame,key:'train'|'tryout'|'recover'|'negotiate'|'sponsor'|'retire',sport:SportKind|undefined,league:SportLeague|undefined,h:ExpansionHooks){
 const p=s.person;
 if(!available(p))throw Error('Sportkarriere und Training sind während der Haft nicht möglich.');
 if(key==='train'){
  if(p.age<8)throw Error('Sporttraining ist erst ab acht Jahren möglich.');
  if(!sport||!SPORTS.includes(sport))throw Error('Unbekannte Sportart.');
  if(p.sportCareer&&p.sportCareer.sport!==sport)throw Error('Du hast dich bereits auf eine andere Sportart spezialisiert.');
  if(p.sportCareer?.retired)throw Error('Deine Profisportkarriere ist beendet.');
  if((p.sportCareer?.injuryYears||0)>0)throw Error('Bei einer Verletzung musst du dich zunächst erholen.');
  if(p.cash<fee(p.age))throw Error('Für das Sporttraining fehlen 120 €.');
  h.annual('sport:train',3);
  p.sportCareer??=fresh(sport);
  const c=p.sportCareer;
  p.cash-=fee(p.age);
  c.skill=cap(c.skill+5+Math.floor(h.random()*6)+(p.talent==='sport'?5:0));
  c.fitness=cap(c.fitness+4);
  h.stat('health',2);h.stat('happiness',1);
  h.log('Du trainierst '+sport+'. Spielstärke: '+c.skill+' %, Fitness: '+c.fitness+' %.','good');
  return;
 }
 if(key==='recover'){
  const c=p.sportCareer;
  if(!c||c.injuryYears===0)throw Error('Du hast keine Sportverletzung.');
  if(p.cash<300)throw Error('Für die Rehabilitation fehlen 300 €.');
  h.annual('sport:recover',2);p.cash-=300;
  c.fitness=cap(c.fitness+8);h.stat('health',5);
  if(h.random()<.55){c.injuryYears=0;h.log('Die Rehabilitation war erfolgreich. Du bist wieder fit.','good');}
  else {h.log('Du machst Fortschritte in der Reha, brauchst aber weiter Ruhe.');}
  return;
 }
 const c=p.sportCareer;
 if(!c)throw Error('Trainiere zuerst eine Sportart.');
 if(key==='tryout'){
  if(!league||!SPORT_LEAGUES.includes(league))throw Error('Unbekannte Liga.');
  if(p.age<18||p.age>40)throw Error('Profiverträge sind zwischen 18 und 40 Jahren möglich.');
  if(c.retired)throw Error('Du hast deine Sportkarriere bereits beendet.');
  if(c.injuryYears>0)throw Error('Mit einer Verletzung ist kein Probetraining möglich.');
  if(c.contract)throw Error('Du stehst bereits unter Vertrag.');
  if(!!p.musicCareer?.contractYears||!!p.actorCareer?.current)throw Error('Beende zuerst die andere Spezialkarriere.');
  const minSkill=league==='Regional'?35:70;
  if(c.skill<minSkill||c.fitness<35)throw Error('Deine Fähigkeiten reichen für dieses Probetraining noch nicht.');
  h.annual('sport:tryout',2);
  const score=c.skill*.70+c.fitness*.25+c.reputation*.05+(h.random()-.5)*20;
  if(score<(league==='Regional'?38:77)){
   c.reputation=cap(c.reputation-1);h.log('Beim Probetraining konntest du den Verein noch nicht überzeugen.','bad');return;
  }
  const clubs=CLUBS[c.sport],club=clubs[Math.floor(h.random()*clubs.length)]!;
  const salary=Math.round((league==='National'?90000:24000)*(1+c.skill/125));
  c.contract={club,league,yearsLeft:league==='National'?3:2,salary};
  p.jobId=null;p.jobYears=0;p.salaryBonus=0;p.careerPerformance=50;
  c.reputation=cap(c.reputation+7);
  h.log('Du unterschreibst bei '+club+' ('+league+'liga). Jahresgehalt brutto: '+salary.toLocaleString('de-DE')+' €.','good');
  return;
 }
 if(key==='retire'){
  if(c.retired)throw Error('Du bist bereits im Ruhestand.');
  if(p.age<18)throw Error('Der Profirücktritt ist erst für Erwachsene möglich.');
  c.contract=null;c.retired=true;
  h.log('Du beendest deine Profisportkarriere nach '+c.seasons.length+' Spielzeiten.');
  return;
 }
 if(!c.contract)throw Error('Du benötigst einen aktiven Sportvertrag.');
 if(key==='negotiate'){
  h.annual('sport:negotiate');
  if(c.skill+c.reputation+(h.random()-.5)*30>=115){
   const raise=Math.round(c.contract.salary*.12);
   c.contract.salary+=raise;c.reputation=cap(c.reputation+3);
   h.log('Der Verein stimmt einer Gehaltserhöhung um '+raise.toLocaleString('de-DE')+' € pro Jahr zu.','good');
  }else{c.reputation=cap(c.reputation-2);h.log('Dein Verein lehnt die Gehaltsforderung ab.','bad');}
  return;
 }
 if(key==='sponsor'){
  if((p.fame||0)<30||c.reputation<30)throw Error('Für Sponsoren brauchst du mindestens 30 % Ruhm und Branchenruf.');
  h.annual('sport:sponsor');
  const earned=Math.round(1500+(p.fame||0)*170+c.reputation*65);
  p.cash+=earned;h.log('Ein fiktiver Ausrüster zahlt dir '+earned.toLocaleString('de-DE')+' € für eine Kampagne.','good');
  return;
 }
 throw Error('Unbekannte Sportaktion.');
}
export function advanceSport(s:SaveGame,h:ExpansionHooks,jailedAtStart=false){
 const p=s.person,c=p.sportCareer;
 if(!c)return;
 const injuredAtStart=c.injuryYears>0;
 if(c.injuryYears>0){c.injuryYears--;c.fitness=cap(c.fitness+8);if(c.injuryYears===0)h.log('Deine Sportverletzung ist ausgeheilt.','good');}
 if(!c.contract){c.fitness=cap(c.fitness-2);return;}
 if(jailedAtStart||p.age>=46){
  c.contract=null;
  if(p.age>=46)c.retired=true;
  h.log(jailedAtStart?'Dein Sportvertrag wurde wegen der Haft aufgelöst.':'Du beendest deine aktive Profikarriere mit 46 Jahren.','bad');
  return;
 }
 const contract=c.contract;
 const injured=injuredAtStart;
 const performance=cap(c.skill*.59+c.fitness*.31+c.reputation*.10+(h.random()-.5)*40-(injured?30:0));
 const victories=Math.min(30,Math.floor(performance/5+h.random()*6));
 const title=!injured&&performance>=69&&h.random()<(contract.league==='National'?.19:.27);
 const net=Math.round(contract.salary*(injured?.38:.76));
 p.cash+=net;
 const season:SportSeason={age:p.age,club:contract.club,league:contract.league,victories,performance,earnings:net,title};
 c.seasons.push(season);if(c.seasons.length>35)c.seasons.shift();
 if(title){c.titles++;c.reputation=cap(c.reputation+14);p.fame=cap((p.fame||0)+18);h.stat('happiness',10);}
 else{c.reputation=cap(c.reputation+(performance>=60?5:performance<35?-6:0));p.fame=cap((p.fame||0)+(performance>=68?6:0));}
 h.log('Saison bei '+contract.club+': '+victories+' Siege, Leistung '+performance+' %, '+net.toLocaleString('de-DE')+' € Nettoverdienst.'+(title?' Meistertitel!':''),title?'good':'normal');
 if(!injured&&h.random()<(p.stats.health<45?.20:.09)){
  c.injuryYears=h.random()<.28?2:1;c.fitness=cap(c.fitness-20);h.stat('health',-13);
  h.log('Eine Sportverletzung zwingt dich zur Pause.','bad');
 }
 c.fitness=cap(c.fitness-5);
 contract.yearsLeft--;
 if(contract.yearsLeft===0){c.contract=null;h.log('Dein Vertrag bei '+contract.club+' ist ausgelaufen. Du kannst erneut zum Probetraining antreten.');}
}
export function validSport(p:Person):boolean{
 const c=p.sportCareer;
 if(c===undefined||c===null)return true;
 if(typeof c!=='object'||Array.isArray(c)||!SPORTS.includes(c.sport)||!whole(c.skill,0,100)||!whole(c.fitness,0,100)||!whole(c.reputation,0,100)||!whole(c.injuryYears,0,2)||typeof c.retired!=='boolean'||!whole(c.titles,0,100)||!Array.isArray(c.seasons)||c.seasons.length>35)return false;
 if(!c.seasons.every(a=>a&&whole(a.age,18,p.age)&&typeof a.club==='string'&&a.club.length>0&&a.club.length<=80&&SPORT_LEAGUES.includes(a.league)&&whole(a.victories,0,30)&&whole(a.performance,0,100)&&whole(a.earnings,0,100_000_000)&&typeof a.title==='boolean'))return false;
 if(c.titles<c.seasons.filter(a=>a.title).length)return false;
 if(c.contract!==null){
  const a=c.contract;
  if(!a||typeof a!=='object'||!CLUBS[c.sport].includes(a.club)||!SPORT_LEAGUES.includes(a.league)||!whole(a.salary,1,100_000_000)||!whole(a.yearsLeft,1,4)||c.retired||p.age<18||p.jobId!==null||!!p.musicCareer?.contractYears||!!p.actorCareer?.current)return false;
 }
 return true;
}
