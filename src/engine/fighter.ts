import type {FighterBout,FighterCareer,FighterStyle,Person,SaveGame} from './types.js';
import type {ExpansionHooks} from './expansions.js';
// Original rules, fictional opponents, no licensed brands.
export const FIGHT_STYLES:readonly FighterStyle[]=['Boxen','Kickboxen','Ringen'];
export const FIGHT_OPPONENTS:readonly string[]=['Mika Sturm','Robin Falk','Samir Winter','Jona Brandt','Lea König','Alex Sommer','Kim Weber','Noah Berg'];
export type FighterAction='train'|'coach'|'spar'|'street'|'join'|'league'|'challenge'|'defend'|'taunt'|'recover'|'retire';
const cap=(v:number)=>Math.max(0,Math.min(100,Math.round(v)));
const whole=(v:unknown,min:number,max:number)=>typeof v==='number'&&Number.isInteger(v)&&v>=min&&v<=max;
const fresh=(style:FighterStyle):FighterCareer=>({style,skill:0,stamina:60,reputation:10,injuryYears:0,coach:false,league:false,retired:false,champion:false,titles:0,leagueWins:0,wins:0,losses:0,rival:null,bouts:[]});
export const fighterActive=(p:Person)=>!!p.fighterCareer?.league;
const opponent=(h:ExpansionHooks)=>FIGHT_OPPONENTS[Math.floor(h.random()*FIGHT_OPPONENTS.length)]!;
function bout(s:SaveGame,kind:FighterBout['kind'],difficulty:number,prize:number,h:ExpansionHooks){
 const p=s.person,c=p.fighterCareer!;
 const name=kind==='Straße'||kind==='Sparring'?opponent(h):(c.rival||opponent(h));
 const score=c.skill*.58+c.stamina*.28+c.reputation*.14+(c.coach?4:0)+(h.random()-.5)*34;
 const won=score>=difficulty;
 const payout=kind==='Sparring'?0:won?prize:kind==='Straße'?0:Math.round(prize*.15);
 p.cash+=payout;
 if(kind!=='Sparring'){if(won)c.wins++;else c.losses++;}
 if(won){c.reputation=cap(c.reputation+(kind==='Titelkampf'?15:kind==='Liga'?7:2));if(kind==='Liga'||kind==='Titelkampf')c.leagueWins++;h.stat('happiness',kind==='Titelkampf'?10:4);}
 else{c.reputation=cap(c.reputation-3);h.stat('happiness',-5);h.stat('health',-3);}
 c.stamina=cap(c.stamina-(kind==='Titelkampf'?13:8));
 if(h.random()<(kind==='Straße'?(won?.08:.19):(won?.05:.13))){c.injuryYears=1;c.stamina=cap(c.stamina-15);h.stat('health',-12);h.log('Du hast dich beim Kampf verletzt. Ein Jahr Pause ist nötig.','bad');}
 const record:FighterBout={age:p.age,kind,opponent:name,won,payout};
 c.bouts.push(record);if(c.bouts.length>50)c.bouts.shift();
 h.log((won?'Sieg':'Niederlage')+' gegen '+name+' ('+kind+'). '+payout.toLocaleString('de-DE')+' € Preisgeld.',won?'good':'bad');
 if(kind==='Straße'&&h.random()<.06){p.record=true;p.prisonYears=1;c.league=false;c.champion=false;h.log('Nach der Straßenschlägerei wirst du verurteilt und musst ein Jahr in Haft.','bad');}
 return won;
}
export function fighterAction(s:SaveGame,key:FighterAction,style:FighterStyle|undefined,h:ExpansionHooks){
 const p=s.person;
 if(p.prisonYears>0)throw Error('Kampfsport ist während der Haft nicht möglich.');
 if(key==='train'){
  if(p.age<14)throw Error('Kampftraining ist erst ab 14 Jahren möglich.');
  if(!style||!FIGHT_STYLES.includes(style))throw Error('Unbekannter Kampfstil.');
  if(p.fighterCareer&&p.fighterCareer.style!==style)throw Error('Du hast bereits einen Kampfstil gewählt.');
  if(p.fighterCareer?.retired)throw Error('Deine Kampfsportkarriere ist beendet.');
  if((p.fighterCareer?.injuryYears||0)>0)throw Error('Bei einer Verletzung ist Training nicht möglich.');
  const cost=p.age<18?0:180;if(p.cash<cost)throw Error('Für das Training fehlen 180 €.');
  h.annual('fighter:train',3);p.cash-=cost;p.fighterCareer??=fresh(style);
  const c=p.fighterCareer;c.skill=cap(c.skill+6+Math.floor(h.random()*6)+(c.coach?4:0));c.stamina=cap(c.stamina+6);
  h.stat('health',2);h.log('Training in '+style+': Technik '+c.skill+' %, Kondition '+c.stamina+' %.','good');return;
 }
 const c=p.fighterCareer;if(!c)throw Error('Wähle zuerst einen Kampfstil und trainiere.');
 if(key==='recover'){
  if(c.injuryYears===0)throw Error('Du bist nicht verletzt.');
  if(p.cash<350)throw Error('Für die Rehabilitation fehlen 350 €.');
  h.annual('fighter:recover',2);p.cash-=350;c.stamina=cap(c.stamina+10);h.stat('health',6);
  if(h.random()<.65){c.injuryYears=0;h.log('Die Rehabilitation ist gelungen. Du darfst wieder kämpfen.','good');}
  else h.log('Die Behandlung hilft, aber du brauchst noch Ruhe.');
  return;
 }
 if(key==='retire'){
  if(c.retired)throw Error('Du bist bereits zurückgetreten.');
  if(p.age<18)throw Error('Der Rücktritt aus dem Profisport ist erst ab 18 möglich.');
  c.retired=true;c.league=false;c.champion=false;h.log('Du beendest deine Kampfsportlaufbahn. Die Kampfhistorie bleibt erhalten.');return;
 }
 if(c.retired)throw Error('Deine Kampfsportkarriere ist beendet.');
 if(key==='coach'){
  if(p.age<18)throw Error('Ein professioneller Trainer ist erst ab 18 verfügbar.');
  if(c.coach)throw Error('Du hast bereits einen Trainer.');
  if(p.cash<1800)throw Error('Für den Trainer fehlen 1.800 €.');
  h.annual('fighter:coach');p.cash-=1800;c.coach=true;c.skill=cap(c.skill+8);
  h.log('Du engagierst einen professionellen Coach und verbesserst deine Technik.','good');return;
 }
 if(key==='taunt'){
  if(!c.league)throw Error('Du musst zuerst in die Kampfliga aufgenommen werden.');
  h.annual('fighter:taunt',2);c.reputation=cap(c.reputation+2);c.stamina=cap(c.stamina-2);
  h.log('Du provozierst deinen Rivalen '+(c.rival||'aus der Liga')+'. Das Publikum redet über dich.');return;
 }
 if(key==='join'){
  if(c.league)throw Error('Du bist bereits in einer Kampfliga.');
  if(p.age<18||p.age>45)throw Error('Der Ligaeinstieg ist zwischen 18 und 45 möglich.');
  if(c.skill<60||c.stamina<50||c.wins<3)throw Error('Für die Liga brauchst du 60 % Technik, 50 % Kondition und drei Siege.');
  if(c.injuryYears>0)throw Error('Mit einer Verletzung ist kein Probetraining möglich.');
  if(p.cash<500)throw Error('Die Ligabewerbung kostet 500 €.');
  if(!!p.sportCareer?.contract||!!p.actorCareer?.current||!!p.musicCareer?.contractYears||!!p.politicalCareer?.office||!!p.politicalCareer?.campaign)throw Error('Beende zuerst deine andere Spezialkarriere.');
  h.annual('fighter:join');p.cash-=500;
  const score=c.skill*.7+c.stamina*.2+c.reputation*.1+(h.random()-.5)*20;
  if(score<65){h.log('Beim Ligaprobetraining wurdest du abgelehnt.','bad');return;}
  c.league=true;c.rival=opponent(h);p.jobId=null;p.workplace=null;p.jobYears=0;p.salaryBonus=0;
  h.log('Du erhältst einen Vertrag in der fiktiven Kampfliga. Dein erster Rivale ist '+c.rival+'.','good');return;
 }
 if(key==='spar'||key==='street'){
  if(p.age<16)throw Error('Kämpfe sind erst ab 16 Jahren möglich.');
  if(c.injuryYears>0)throw Error('Mit einer Verletzung darfst du nicht kämpfen.');
  if(c.stamina<15)throw Error('Deine Kondition reicht nicht für einen Kampf.');
  if(key==='spar'&&p.cash<220)throw Error('Für das Sparring fehlen 220 €.');
  h.annual('fighter:'+key,key==='spar'?3:2);if(key==='spar')p.cash-=220;
  bout(s,key==='spar'?'Sparring':'Straße',key==='spar'?43:48,key==='spar'?0:250+Math.floor(h.random()*450),h);return;
 }
 if(!c.league)throw Error('Du benötigst zuerst einen Ligavertrag.');
 if(c.injuryYears>0)throw Error('Mit einer Verletzung darfst du nicht kämpfen.');
 if(c.stamina<20)throw Error('Du musst zuerst deine Kondition verbessern.');
 if(key==='league'){h.annual('fighter:league',2);bout(s,'Liga',63,3000+Math.floor(h.random()*5000),h);return;}
 if(key==='challenge'){
  if(c.champion)throw Error('Du trägst den Titel bereits.');
  if(c.skill<80||c.leagueWins<3||c.reputation<55)throw Error('Für den Titelkampf brauchst du 80 % Technik, drei Ligasiege und 55 % Ruf.');
  h.annual('fighter:title');
  if(bout(s,'Titelkampf',80,22000,h)){c.champion=true;c.titles++;p.fame=cap((p.fame||0)+20);h.log('Du bist Champion der fiktiven Kampfliga!','good');}
  return;
 }
 if(key==='defend'){
  if(!c.champion)throw Error('Du hast keinen Titel zu verteidigen.');
  h.annual('fighter:title');
  if(bout(s,'Titelkampf',83,18000,h)){c.titles++;p.fame=cap((p.fame||0)+8);h.log('Du verteidigst deinen Titel!','good');}
  else{c.champion=false;h.log('Du verlierst den Meistertitel.','bad');}
  return;
 }
 throw Error('Unbekannte Kampfaktion.');
}
export function advanceFighter(s:SaveGame,h:ExpansionHooks,jailedAtStart=false){
 const p=s.person,c=p.fighterCareer;if(!c)return;
 if(c.injuryYears>0){c.injuryYears--;c.stamina=cap(c.stamina+8);if(c.injuryYears===0)h.log('Deine Kampfverletzung ist ausgeheilt.','good');}
 if(c.league&&(jailedAtStart||p.age>45)){c.league=false;c.champion=false;if(p.age>45)c.retired=true;h.log(jailedAtStart?'Dein Ligavertrag endet durch die Haft.':'Deine Kampfliga-Karriere endet altersbedingt.','bad');}
 if(c.league){p.cash+=12000;h.log('Die Kampfliga zahlt dir 12.000 € Jahresvergütung.','good');}
 c.stamina=cap(c.stamina-(c.league?4:2));
}
export function validFighter(p:Person):boolean{
 const c=p.fighterCareer;if(c===undefined||c===null)return true;
 if(typeof c!=='object'||Array.isArray(c)||!FIGHT_STYLES.includes(c.style)||p.age<14||
  !whole(c.skill,0,100)||!whole(c.stamina,0,100)||!whole(c.reputation,0,100)||
  !whole(c.injuryYears,0,1)||typeof c.coach!=='boolean'||typeof c.league!=='boolean'||
  typeof c.retired!=='boolean'||typeof c.champion!=='boolean'||!whole(c.titles,0,1000)||
  !whole(c.leagueWins,0,1000)||!whole(c.wins,0,1000)||!whole(c.losses,0,1000)||
  c.rival!==null&&(typeof c.rival!=='string'||!FIGHT_OPPONENTS.includes(c.rival))||
  !Array.isArray(c.bouts)||c.bouts.length>50)return false;
 if(c.league&&(p.age<18||p.age>45||c.retired||p.jobId!==null||!!p.sportCareer?.contract||!!p.politicalCareer?.office))return false;
 if(c.champion&&!c.league||c.retired&&c.league||c.titles<(c.champion?1:0))return false;
 return c.bouts.every(b=>b&&whole(b.age,16,p.age)&&['Straße','Sparring','Liga','Titelkampf'].includes(b.kind)&&
  typeof b.opponent==='string'&&FIGHT_OPPONENTS.includes(b.opponent)&&typeof b.won==='boolean'&&whole(b.payout,0,1000000));
}
