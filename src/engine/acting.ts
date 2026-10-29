import type {ActingContract,ActingCredit,ActorCareer,ActingKind,ActingRoleType,Person,SaveGame} from './types.js';
import type {ExpansionHooks} from './expansions.js';

// Fictional productions, fees, ratings and probabilities. No original BitLife code/assets.
export type ActingOffer={id:string;title:string;kind:ActingKind;role:ActingRoleType;ageMin:number;ageMax:number;skill:number;quality:number;fee:number;episodes:number;seasons:number};
export const ACTING_OFFERS:readonly ActingOffer[]=[
 {id:'campus-series',title:'Campusleben',kind:'Serie',role:'Nebenrolle',ageMin:18,ageMax:32,skill:30,quality:52,fee:1800,episodes:12,seasons:2},
 {id:'urban-series',title:'Stadtlichter',kind:'Serie',role:'Hauptrolle',ageMin:20,ageMax:60,skill:65,quality:80,fee:6800,episodes:10,seasons:3},
 {id:'family-series',title:'Familienbande',kind:'Serie',role:'Nebenrolle',ageMin:30,ageMax:85,skill:42,quality:67,fee:3500,episodes:9,seasons:2},
 {id:'indie-film',title:'Hinter dem Horizont',kind:'Film',role:'Nebenrolle',ageMin:18,ageMax:75,skill:35,quality:62,fee:15000,episodes:1,seasons:1},
 {id:'thriller-film',title:'Der letzte Zeuge',kind:'Film',role:'Hauptrolle',ageMin:23,ageMax:67,skill:72,quality:85,fee:95000,episodes:1,seasons:1},
 {id:'drama-film',title:'Ein zweiter Frühling',kind:'Film',role:'Hauptrolle',ageMin:40,ageMax:90,skill:58,quality:75,fee:54000,episodes:1,seasons:1},
 {id:'comedy-film',title:'Chaotische Nachbarn',kind:'Film',role:'Nebenrolle',ageMin:18,ageMax:80,skill:33,quality:48,fee:19000,episodes:1,seasons:1},
] as const;
const cap=(n:number)=>Math.max(0,Math.min(100,Math.round(n)));
const euros=(n:number)=>Math.round(n).toLocaleString('de-DE')+' €';
const integer=(v:unknown,min:number,max:number)=>typeof v==='number'&&Number.isInteger(v)&&v>=min&&v<=max;
const baseActor=():ActorCareer=>({agent:false,reputation:10,extraCount:0,awards:0,credits:[],current:null,agentLeadId:null});
export const actingActive=(p:Person)=>!!p.actorCareer?.current;
export const actingOffersFor=(p:Person)=>ACTING_OFFERS.filter(o=>p.age>=o.ageMin&&p.age<=o.ageMax);
export function actorAction(s:SaveGame,key:'lesson'|'extra'|'hire-agent'|'fire-agent'|'agent-search'|'audition'|'rehearse'|'quit',offerId:string|undefined,h:ExpansionHooks){
 const p=s.person;
 if(p.prisonYears>0)throw Error('Schauspielaktivitäten sind in Haft nicht verfügbar.');
 if(key==='lesson'){
  if(p.age<8)throw Error('Schauspielunterricht ist ab acht Jahren verfügbar.');
  const price=p.age<18?0:175;
  if(p.cash<price)throw Error('Der Unterricht kostet 175 €.');
  h.annual('actor:lesson',3);
  p.cash-=price;
  const progress=5+Math.floor(h.random()*7)+(p.talent==='schauspiel'?6:0);
  p.actingSkill=cap((p.actingSkill??0)+progress);
  h.stat('happiness',2);
  h.log('Du hast Schauspielunterricht genommen. Fähigkeit: '+p.actingSkill+' %.','good');
  return;
 }
 if(p.age<18)throw Error('Professionelle Schauspielaufträge sind erst ab 18 Jahren verfügbar.');
 p.actorCareer??=baseActor();
 const c=p.actorCareer;
 if(key==='hire-agent'){
  if(c.agent)throw Error('Du hast bereits eine Künstleragentur.');
  if(p.cash<1500)throw Error('Ein Talentagent kostet 1.500 € Vermittlungsgebühr.');
  h.annual('actor:hire-agent');p.cash-=1500;c.agent=true;
  h.log('Eine Künstleragentur vertritt dich jetzt. Für künftige Rollen fallen 12 % Provision an.','good');
  return;
 }
 if(key==='fire-agent'){
  if(!c.agent)throw Error('Du hast keinen Agenten.');
  c.agent=false;c.agentLeadId=null;h.log('Du hast deine Künstleragentur verlassen.');
  return;
 }
 if(key==='agent-search'){
  if(!c.agent)throw Error('Du benötigst einen Talentagenten.');
  if(c.current)throw Error('Du bist bereits für eine Produktion engagiert.');
  h.annual('actor:agent-search');
  const offers=actingOffersFor(p);
  if(offers.length===0)throw Error('Es gibt keine geeigneten Castingangebote.');
  const recommended=offers.filter(o=>o.skill<=Math.max(30,(p.actingSkill??0)+15));
  const list=recommended.length?recommended:offers;
  c.agentLeadId=list[Math.min(list.length-1,Math.floor(h.random()*list.length))]!.id;
  const selected=ACTING_OFFERS.find(o=>o.id===c.agentLeadId)!;
  h.log('Deine Agentur empfiehlt dir das Casting für „'+selected.title+'“. Bei diesem Vorspiel steigen deine Chancen.','good');
  return;
 }
 if(key==='extra'){
  if(c.current)throw Error('Du hast bereits eine Schauspielrolle.');
  h.annual('actor:extra',3);
  const income=75+Math.floor(h.random()*230);
  p.cash+=income;c.extraCount++;c.reputation=cap(c.reputation+2);
  if(h.random()<.25)p.actingSkill=cap((p.actingSkill??0)+1);
  h.log('Du hast als Komparse/Komparsin '+euros(income)+' verdient und Erfahrung gesammelt.','good');
  return;
 }
 if(key==='audition'){
  if(c.current)throw Error('Du hast bereits eine Schauspielrolle.');
  if(p.musicCareer&&p.musicCareer.contractYears>0)throw Error('Beende zuerst deinen Musikvertrag.');
  const offer=ACTING_OFFERS.find(o=>o.id===offerId);
  if(!offer)throw Error('Unbekannte Castingrolle.');
  if(p.age<offer.ageMin||p.age>offer.ageMax)throw Error('Du passt nicht zur Altersgruppe dieser Rolle.');
  if((p.actingSkill??0)<offer.skill)throw Error('Für dieses Casting brauchst du mehr Schauspielerfahrung.');
  h.annual('actor:audition',3);
  const recommended=c.agent&&c.agentLeadId===offer.id;
  const chance=Math.min(.93,.16+(p.actingSkill??0)*.005+c.reputation*.002+p.stats.looks*.001+(recommended?0.17:0)-(offer.role==='Hauptrolle'?.14:0));
  if(h.random()>=chance){
   h.stat('happiness',-3);
   h.log('Beim Vorsprechen für „'+offer.title+'“ hast du keine Zusage bekommen.','bad');
   return;
  }
  c.current={offerId:offer.id,title:offer.title,kind:offer.kind,role:offer.role,quality:offer.quality,payPerUnit:offer.fee,episodes:offer.episodes,yearsLeft:offer.seasons};
  c.agentLeadId=null;
  p.jobId=null;p.jobYears=0;p.salaryBonus=0;
  c.reputation=cap(c.reputation+3);
  h.stat('happiness',9);
  h.log('Du hast eine '+offer.role+' in '+(offer.kind==='Serie'?'der Serie':'dem Film')+' „'+offer.title+'“ bekommen!','good');
  return;
 }
 if(!c.current)throw Error('Du hast aktuell keine feste Schauspielrolle.');
 if(key==='rehearse'){
  h.annual('actor:rehearse',2);
  p.actingSkill=cap((p.actingSkill??0)+3+Math.round(h.random()*5));
  c.reputation=cap(c.reputation+3);
  h.stat('happiness',-2);
  h.log('Du hast intensiv für deine Rolle geprobt und deine Darstellung verbessert.','good');
  return;
 }
 if(key==='quit'){
  h.annual('actor:quit');
  const role=c.current;
  c.current=null;c.reputation=cap(c.reputation-16);h.stat('happiness',-6);
  h.log('Du hast deine Rolle in „'+role.title+'“ aufgegeben. Dein Ruf in der Branche hat gelitten.','bad');
  return;
 }
 throw Error('Unbekannte Schauspielaktion.');
}
export function advanceActing(s:SaveGame,h:ExpansionHooks){
 const p=s.person,c=p.actorCareer;
 if(!c)return;
 const role=c.current;
 if(!role){
  c.reputation=cap(c.reputation-2);
  if((p.fame??0)>0)p.fame=cap((p.fame??0)-2);
  return;
 }
 const gross=role.payPerUnit*role.episodes;
 const commission=c.agent?Math.round(gross*.12):0;
 const net=Math.round(gross*.75)-commission;
 p.cash+=net;
 const rating=cap(Math.round(role.quality*.55+(p.actingSkill??0)*.35+h.random()*25-9));
 c.reputation=cap(c.reputation+(rating>=75?12:rating>=50?5:-7));
 p.fame=cap((p.fame??0)+(rating>=65?(role.role==='Hauptrolle'?11:6):2));
 h.stat('happiness',rating>=55?7:-4);
 h.log('Für „'+role.title+'“ erhieltst du '+euros(net)+' nach Steuern und Agenturprovision. Kritikerwertung: '+rating+' %.',rating>=55?'good':'bad');
 if(c.credits.length>=30)c.credits.shift();
 const credit:ActingCredit={title:role.title,kind:role.kind,role:role.role,age:p.age,earnings:net,rating};
 c.credits.push(credit);
 if(rating>=88&&role.role==='Hauptrolle'&&h.random()<.45){
  c.awards++;p.fame=cap((p.fame??0)+12);h.log('Deine herausragende Leistung wurde bei einer fiktiven Filmpreisverleihung ausgezeichnet!','good');
 }
 role.yearsLeft--;
 if(role.yearsLeft<=0){
  c.current=null;
  h.log(role.kind==='Film'?'Die Dreharbeiten zu „'+role.title+'“ sind abgeschlossen.':'Deine Serienrolle in „'+role.title+'“ ist zu Ende. Neue Castings sind möglich.');
 }
}
export function validActing(p:Person):boolean{
 if(p.actingSkill!==undefined&&!integer(p.actingSkill,0,100))return false;
 if(p.actorCareer===undefined||p.actorCareer===null)return true;
 const c=p.actorCareer;
 if(typeof c!=='object'||typeof c.agent!=='boolean'||!integer(c.reputation,0,100)||!integer(c.extraCount,0,100000)||!integer(c.awards,0,10000))return false;
 if(c.agentLeadId!==undefined&&c.agentLeadId!==null&&!ACTING_OFFERS.some(o=>o.id===c.agentLeadId))return false;
 if(!Array.isArray(c.credits)||c.credits.length>30)return false;
 for(const credit of c.credits){
  if(!credit||typeof credit.title!=='string'||credit.title.length>90||!['Film','Serie'].includes(credit.kind)||!['Nebenrolle','Hauptrolle'].includes(credit.role)||!integer(credit.age,0,p.age)||!integer(credit.earnings,-1_000_000,20_000_000)||!integer(credit.rating,0,100))return false;
 }
 if(c.current!==null){
  if(!c.current||typeof c.current!=='object')return false;
  const role=c.current;
  const offer=ACTING_OFFERS.find(o=>o.id===role.offerId);
  if(!offer||!role||role.title!==offer.title||role.kind!==offer.kind||role.role!==offer.role||role.quality!==offer.quality||role.payPerUnit!==offer.fee||role.episodes!==offer.episodes||!integer(role.yearsLeft,1,offer.seasons))return false;
  if(p.jobId!==null||!!(p.musicCareer&&p.musicCareer.contractYears>0)||!!p.politicalCareer?.office||p.age<18)return false;
 }
 return true;
}
