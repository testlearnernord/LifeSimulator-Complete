import type {Person, PoliticalCareer, PoliticalOffice, PoliticalParty, PoliticalPolicy, PoliticalBudget, PoliticalElection, SaveGame} from './types.js';
import type {ExpansionHooks} from './expansions.js';

// Politische Laufbahn mit fiktiven Parteien und eigenen Regeln; keine Original-BitLife-Daten.
export const POLITICAL_PARTIES:readonly PoliticalParty[]=['Unabhängig','Gemeinschaft','Zukunft','Tradition'];
export const POLITICAL_POLICIES:readonly PoliticalPolicy[]=['Bildung','Infrastruktur','Gesundheit'];
export const POLITICAL_BUDGETS:readonly PoliticalBudget[]=['klein','mittel','gross'];
export const POLITICAL_OFFICES:readonly PoliticalOffice[]=['Gemeinderat','Bürgermeister','Landesregierung','Staatsoberhaupt'];
export const POLITICAL_REQUIREMENTS:Record<PoliticalOffice,{age:number;experience:number;wins:number;baseCost:number;salary:number;threshold:number}>={
 Gemeinderat:{age:18,experience:0,wins:0,baseCost:1200,salary:25000,threshold:35},
 Bürgermeister:{age:21,experience:20,wins:1,baseCost:7500,salary:60000,threshold:45},
 Landesregierung:{age:30,experience:40,wins:2,baseCost:26000,salary:115000,threshold:57},
 Staatsoberhaupt:{age:40,experience:65,wins:3,baseCost:90000,salary:200000,threshold:68}
};
const cap=(x:number)=>Math.max(0,Math.min(100,Math.round(x)));
const integer=(x:unknown,min:number,max:number)=>typeof x==='number'&&Number.isInteger(x)&&x>=min&&x<=max;
export const politicalCampaignCost=(role:PoliticalOffice,budget:PoliticalBudget)=>{
 const tier=POLITICAL_REQUIREMENTS[role];
 const mult={klein:1,mittel:2,gross:4} as const;
 return tier.baseCost*mult[budget];
};
const fresh=():PoliticalCareer=>({experience:0,reputation:20,integrity:65,wins:0,elections:[],office:null,campaign:null});
export const politicsActive=(p:Person)=>!!p.politicalCareer?.office;
export function politicalAction(
 s:SaveGame,
 key:'volunteer'|'launch'|'canvass'|'debate'|'advertise'|'election'|'speech'|'policy'|'resign',
 office:PoliticalOffice|undefined,
 party:PoliticalParty|undefined,
 policy:PoliticalPolicy|undefined,
 budget:PoliticalBudget|undefined,
 h:ExpansionHooks
){
 const p=s.person;
 if(p.prisonYears>0)throw Error('Politische Aktivitäten sind während der Haft nicht möglich.');
 if(key==='volunteer'){
  if(p.age<14)throw Error('Politische Freiwilligenarbeit ist ab 14 Jahren möglich.');
  h.annual('politics:volunteer',2);
  p.politicalCareer??=fresh();
  const c=p.politicalCareer;
  c.experience=cap(c.experience+7+Math.floor(h.random()*6));
  c.reputation=cap(c.reputation+2+Math.floor(h.random()*3));
  h.stat('happiness',2);h.stat('smarts',1);
  h.log('Du hilfst in einer parteiunabhängigen Jugendinitiative. Politische Erfahrung: '+c.experience+' %.','good');
  return;
 }
 const c=p.politicalCareer;
 if(!c)throw Error('Sammle zunächst politische Erfahrung.');
 if(key==='launch'){
  if(!office||!POLITICAL_OFFICES.includes(office)||!party||!POLITICAL_PARTIES.includes(party)||!policy||!POLITICAL_POLICIES.includes(policy)||!budget||!POLITICAL_BUDGETS.includes(budget))throw Error('Ungültige Kandidatur.');
  if(c.campaign)throw Error('Du führst bereits einen Wahlkampf.');
  if(c.office)throw Error('Beende zuerst deine aktuelle Amtszeit.');
  if(p.musicCareer?.contractYears||p.actorCareer?.current||p.sportCareer?.contract)throw Error('Beende zuerst deinen aktiven Spezialvertrag.');
  const req=POLITICAL_REQUIREMENTS[office];
  if(p.age<req.age||c.experience<req.experience||c.wins<req.wins)throw Error('Du erfüllst die Voraussetzungen für dieses Amt noch nicht.');
  if(p.record)throw Error('Mit einer Vorstrafe ist diese Kandidatur nicht möglich.');
  const cost=politicalCampaignCost(office,budget);
  if(p.cash<cost)throw Error('Für die Kandidatur fehlen '+cost.toLocaleString('de-DE')+' €.');
  h.annual('politics:launch');
  p.cash-=cost;
  c.campaign={office,party,policy,budget,spent:cost,reach:budget==='gross'?35:budget==='mittel'?21:9,debate:0,startedAge:p.age};
  h.log('Du finanzierst deine Kandidatur für '+office+' mit '+cost.toLocaleString('de-DE')+' €. Thema: '+policy+'.');
  return;
 }
 const campaign=c.campaign;
 if(key==='canvass'||key==='debate'||key==='advertise'||key==='election'){
  if(!campaign)throw Error('Du hast keinen laufenden Wahlkampf.');
  if(key==='canvass'){
   h.annual('politics:canvass',2);
   campaign.reach=cap(campaign.reach+9+Math.floor(h.random()*8));
   c.experience=cap(c.experience+3);
   h.stat('happiness',-2);
   h.log('Du besuchst Nachbarschaften und beantwortest Fragen. Reichweite: '+campaign.reach+' %.','good');
   return;
  }
  if(key==='debate'){
   h.annual('politics:debate');
   const performance=cap(p.stats.smarts*.65+c.experience*.25+h.random()*25-10);
   campaign.debate=performance;
   c.reputation=cap(c.reputation+(performance>=60?6:-4));
   h.log('In einer öffentlichen Debatte erzielst du '+performance+' % Überzeugungskraft.',performance>=60?'good':'bad');
   return;
  }
  if(key==='advertise'){
   const cost=Math.round(POLITICAL_REQUIREMENTS[campaign.office].baseCost*.75);
   if(p.cash<cost)throw Error('Für die Wahlkampagne fehlen '+cost.toLocaleString('de-DE')+' €.');
   h.annual('politics:advertise',2);
   p.cash-=cost;campaign.spent+=cost;
   campaign.reach=cap(campaign.reach+14);
   h.log('Eine lokale Informationskampagne kostet '+cost.toLocaleString('de-DE')+' €. Reichweite: '+campaign.reach+' %.');
   return;
  }
  h.annual('politics:election');
  const threshold=POLITICAL_REQUIREMENTS[campaign.office].threshold;
  const score=p.stats.smarts*.23+p.stats.looks*.09+c.experience*.17+c.reputation*.17+
   c.integrity*.05+campaign.reach*.20+campaign.debate*.09+(p.fame??0)*.04;
  const votes=cap(50+(score-threshold)*.72+(h.random()-.5)*22);
  const won=votes>=50;
  const result:PoliticalElection={office:campaign.office,party:campaign.party,age:p.age,votes,won,spent:campaign.spent};
  c.elections.push(result);if(c.elections.length>40)c.elections.shift();
  if(won){
   const req=POLITICAL_REQUIREMENTS[campaign.office];
   c.wins=Math.min(100,c.wins+1);
   c.reputation=cap(c.reputation+12);
   c.experience=cap(c.experience+12);
   c.office={role:campaign.office,party:campaign.party,policy:campaign.policy,approval:cap(52+(votes-50)*.7),yearsLeft:4,salary:req.salary};
   p.jobId=null;p.workplace=null;p.jobYears=0;p.salaryBonus=0;p.careerPerformance=50;
   p.fame=cap((p.fame??0)+(campaign.office==='Landesregierung'?15:campaign.office==='Staatsoberhaupt'?30:5));
   h.stat('happiness',12);
   h.log('Wahlsieg! '+votes+' % der Stimmen. Du übernimmst das Amt '+campaign.office+'.','good');
  }else{
   c.reputation=cap(c.reputation-3);
   c.experience=cap(c.experience+4);
   h.stat('happiness',-8);
   h.log('Die Wahl geht verloren: '+votes+' % der Stimmen. Du kannst später erneut antreten.','bad');
  }
  c.campaign=null;
  return;
 }
 if(!c.office)throw Error('Du bekleidest derzeit kein politisches Amt.');
 if(key==='speech'){
  h.annual('politics:speech',2);
  const bonus=4+Math.floor(h.random()*7)+(p.stats.smarts>70?2:0);
  c.office.approval=cap(c.office.approval+bonus);
  c.reputation=cap(c.reputation+2);
  h.stat('happiness',-2);
  h.log('Bei einer Bürgerversammlung beantwortest du Fragen. Zustimmung: '+c.office.approval+' %.','good');
  return;
 }
 if(key==='policy'){
  if(!policy||!POLITICAL_POLICIES.includes(policy))throw Error('Ungültiges politisches Vorhaben.');
  h.annual('politics:policy');
  const success=h.random()<Math.min(.9,.38+p.stats.smarts*.003+c.experience*.002);
  c.office.policy=policy;
  if(success){c.office.approval=cap(c.office.approval+9);c.integrity=cap(c.integrity+2);h.log('Dein Vorhaben zu '+policy+' wird beschlossen. Die Zustimmung wächst.','good');}
  else {c.office.approval=cap(c.office.approval-11);c.reputation=cap(c.reputation-3);h.log('Dein Vorhaben zu '+policy+' scheitert im Gremium.','bad');}
  return;
 }
 if(key==='resign'){
  c.office=null;c.reputation=cap(c.reputation-5);
  h.log('Du trittst von deinem politischen Amt zurück.');
  return;
 }
 throw Error('Unbekannte politische Aktivität.');
}
export function advancePolitics(s:SaveGame,h:ExpansionHooks,jailedAtStart:boolean){
 const p=s.person,c=p.politicalCareer;
 if(!c)return;
 if(c.campaign&&p.age>c.campaign.startedAge){
  c.campaign=null;c.reputation=cap(c.reputation-4);
  h.log('Dein nicht abgeschlossener Wahlkampf ist nach dem Jahreswechsel beendet.','bad');
 }
 const a=c.office;
 if(!a)return;
 if(jailedAtStart||p.record){
  c.office=null;c.reputation=cap(c.reputation-12);
  h.log('Dein politisches Amt ist wegen der Strafsache beendet.','bad');
  return;
 }
 const net=Math.round(a.salary*.76);
 p.cash+=net;
 const shift=Math.floor(h.random()*13)-6+(c.integrity>70?2:0);
 a.approval=cap(a.approval+shift);
 c.experience=cap(c.experience+3);
 if(a.approval<25&&h.random()<.25){
  c.office=null;c.reputation=cap(c.reputation-12);
  h.log('Nach schweren Vertrauensverlusten endet deine Amtszeit vorzeitig.','bad');
  return;
 }
 a.yearsLeft--;
 h.log('Du erhältst '+net.toLocaleString('de-DE')+' € Nettogehalt in deinem Amt '+a.role+'. Zustimmung: '+a.approval+' %.');
 if(a.yearsLeft===0){
  h.log('Deine vierjährige Amtszeit als '+a.role+' endet. Du kannst dich erneut zur Wahl stellen.');
  c.office=null;
 }
}
export function validPolitics(p:Person):boolean{
 const c=p.politicalCareer;
 if(c===undefined||c===null)return true;
 if(typeof c!=='object'||Array.isArray(c)||!integer(c.experience,0,100)||!integer(c.reputation,0,100)||!integer(c.integrity,0,100)||!integer(c.wins,0,100)||!Array.isArray(c.elections)||c.elections.length>40)return false;
 const election=(e:PoliticalElection)=>!!e&&POLITICAL_OFFICES.includes(e.office)&&POLITICAL_PARTIES.includes(e.party)&&integer(e.age,18,p.age)&&integer(e.votes,0,100)&&typeof e.won==='boolean'&&e.won===(e.votes>=50)&&integer(e.spent,0,1_000_000_000);
 if(!c.elections.every(election)||c.wins<c.elections.filter(e=>e.won).length)return false;
 if(c.campaign!==null){
  const a=c.campaign;
  if(!a||!POLITICAL_OFFICES.includes(a.office)||!POLITICAL_PARTIES.includes(a.party)||!POLITICAL_POLICIES.includes(a.policy)||!POLITICAL_BUDGETS.includes(a.budget)||!integer(a.spent,0,1_000_000_000)||!integer(a.reach,0,100)||!integer(a.debate,0,100)||!integer(a.startedAge,18,p.age)||a.startedAge!==p.age||a.spent<politicalCampaignCost(a.office,a.budget)||c.office!==null)return false;
 }
 if(c.office!==null){
  const a=c.office;
  if(!a||!POLITICAL_OFFICES.includes(a.role)||!POLITICAL_PARTIES.includes(a.party)||!POLITICAL_POLICIES.includes(a.policy)||!integer(a.approval,0,100)||!integer(a.yearsLeft,1,4)||a.salary!==POLITICAL_REQUIREMENTS[a.role].salary||p.jobId!==null||!!p.musicCareer?.contractYears||!!p.actorCareer?.current||!!p.sportCareer?.contract)return false;
 }
 return true;
}
