import type {BusinessSector,Entry,Person,SaveGame,SocialPlatform,Stat} from './types.js';

// Independent life-sim approximations; these are NOT the proprietary BitLife formulas.
export const SOCIAL_PLATFORMS:SocialPlatform[]=['YouTube','TikTok','Instagram','Twitter','Facebook'];
export const BUSINESS_SECTORS:{id:BusinessSector;name:string;start:number}[]=[
 {id:'cafe',name:'Café & Gastronomie',start:20000},
 {id:'fashion',name:'Bekleidung & Mode',start:45000},
 {id:'technology',name:'Technologie & Apps',start:90000}
];
export type ExpansionHooks={
 random:()=>number;
 log:(message:string,tone?:Entry['tone'])=>void;
 stat:(key:Stat,change:number)=>void;
 annual:(key:string,limit?:number)=>void;
};
const cap=(n:number)=>Math.max(0,Math.min(100,Math.round(n)));
const finite=(n:unknown,min:number,max:number)=>typeof n==='number'&&Number.isFinite(n)&&n>=min&&n<=max;
const whole=(n:unknown,min:number,max:number)=>finite(n,min,max)&&Number.isInteger(n);
const euros=(n:number)=>Math.round(n).toLocaleString('de-DE')+' €';
const eligible=(p:Person,age:number)=>{if(p.age<age)throw Error('Diese Funktion ist erst ab '+age+' Jahren verfügbar.');if(p.prisonYears>0)throw Error('Während der Haft ist diese Aktion nicht möglich.');};

export function socialAction(s:SaveGame,key:'join'|'post'|'sponsor'|'delete',platform:SocialPlatform,h:ExpansionHooks){
 const p=s.person;eligible(p,13);
 if(!SOCIAL_PLATFORMS.includes(platform))throw Error('Unbekannte Plattform.');
 p.social??={};
 let profile=p.social[platform];
 if(key==='join'){
  if(profile)throw Error('Auf dieser Plattform hast du bereits ein Konto.');
  p.social[platform]={followers:0,posts:0,warnings:0};
  h.log('Du hast ein Profil auf '+platform+' eröffnet.','good');return;
 }
 if(!profile)throw Error('Zuerst musst du auf '+platform+' ein Profil anlegen.');
 if(key==='delete'){
  delete p.social[platform];
  h.log('Du hast dein '+platform+'-Profil gelöscht.');return;
 }
 if(key==='post'){
  h.annual('post:'+platform,3);
  profile.posts++;
  const potential=Math.max(1,Math.round(10+(p.stats.looks+p.stats.smarts)*.35+Math.sqrt(profile.followers)*5));
  const viral=h.random()<.045;
  const delta=Math.round(potential*(.5+h.random()*1.6)*(viral?25:1));
  profile.followers=Math.min(50000000,profile.followers+delta);
  p.fame=cap((p.fame??0)+(viral?10:profile.followers>=10000?2:0));
  h.stat('happiness',viral?9:2);
  h.log('Dein Beitrag auf '+platform+' gewann '+delta.toLocaleString('de-DE')+' neue Follower'+(viral?' und ging viral!':'.'),viral?'good':'normal');
  return;
 }
 if(profile.followers<10000)throw Error('Für Sponsoring benötigst du mindestens 10.000 Follower.');
 h.annual('sponsor:'+platform,1);
 const payment=Math.round(200+profile.followers*.035);
 p.cash+=payment;
 if(h.random()<.16){profile.followers=Math.round(profile.followers*.96);h.stat('happiness',-3);h.log('Deine Anzeige kam nicht gut an. Du hast '+euros(payment)+' verdient, aber einige Follower verloren.','bad');}
 else h.log('Ein Werbepartner zahlte '+euros(payment)+' für deinen Beitrag.','good');
}

export function businessAction(s:SaveGame,key:'open'|'develop'|'market'|'hire'|'fire'|'sell'|'invest'|'withdraw',sector:BusinessSector|undefined,h:ExpansionHooks){
 const p=s.person;eligible(p,18);
 if(key==='open'){
  if(p.business)throw Error('Du betreibst bereits ein Unternehmen.');
  const selected=BUSINESS_SECTORS.find(x=>x.id===sector);
  if(!selected)throw Error('Ungültige Branche.');
  if(p.cash<selected.start)throw Error('Für die Unternehmensgründung fehlen '+euros(selected.start)+'.');
  p.cash-=selected.start;
  p.business={sector:selected.id,name:selected.name,cash:selected.start,staff:1,quality:45,brand:15,age:0};
  h.log('Du hast ein Unternehmen in der Branche '+selected.name+' gegründet.','good');return;
 }
 const b=p.business;
 if(!b)throw Error('Du besitzt kein Unternehmen.');
 if(key==='sell'){
  h.annual('business:sell');
  const value=Math.max(0,Math.round(b.cash+b.staff*1500+b.brand*500+b.quality*250));
  p.cash+=value;p.business=null;
  h.log('Du hast dein Unternehmen für '+euros(value)+' verkauft.','good');return;
 }
 if(key==='develop'){
  if(b.cash<4500)throw Error('Dein Unternehmen braucht 4.500 € für die Produktentwicklung.');
  h.annual('business:develop',2);
  b.cash-=4500;b.quality=cap(b.quality+5+Math.floor(h.random()*9));
  h.log('Deine Produktentwicklung hat die Qualität auf '+b.quality+' % erhöht.','good');
 }else if(key==='market'){
  if(b.cash<3000)throw Error('Für die Marketingkampagne fehlen 3.000 € Firmenkapital.');
  h.annual('business:market',2);
  b.cash-=3000;b.brand=cap(b.brand+6+Math.floor(h.random()*10));
  h.log('Deine Werbekampagne hat die Markenbekanntheit auf '+b.brand+' % gesteigert.','good');
 }else if(key==='hire'){
  if(b.cash<1500||b.staff>=500)throw Error('Du kannst derzeit keine Mitarbeiter einstellen.');
  h.annual('business:hire',3);b.cash-=1500;b.staff++;
  h.log('Du hast eine Person eingestellt. Beschäftigte: '+b.staff+'.','good');
 }else if(key==='fire'){
  if(b.staff<=1)throw Error('Du brauchst mindestens eine Person im Unternehmen.');
  h.annual('business:fire',3);b.staff--;b.brand=cap(b.brand-2);
  h.log('Eine Stelle wurde gestrichen. Beschäftigte: '+b.staff+'.');
 }else if(key==='invest'){
  if(p.cash<10000)throw Error('Du benötigst 10.000 € Privatvermögen zum Investieren.');
  h.annual('business:invest',4);p.cash-=10000;b.cash+=10000;
  h.log('Du hast 10.000 € aus deinem Privatvermögen in das Unternehmen investiert.');
 }else if(key==='withdraw'){
  if(b.cash<10000)throw Error('Die Firmenkasse enthält weniger als 10.000 €.');
  h.annual('business:withdraw',4);b.cash-=10000;p.cash+=7500;
  h.log('Du hast 10.000 € Firmenmittel entnommen, netto 7.500 € nach pauschaler Steuer.','good');
 }
}

export function rentalAction(s:SaveGame,key:'advertise'|'repair'|'vacate',id:string,h:ExpansionHooks){
 const p=s.person;eligible(p,18);
 const asset=p.assets.find(a=>a.id===id&&a.kind==='Haus');
 if(!asset)throw Error('Diese Immobilie gehört dir nicht.');
 asset.rental??={occupied:false,annualRent:Math.round(asset.value*.06),condition:90};
 const r=asset.rental;
 if(key==='advertise'){
  if(r.occupied)throw Error('Diese Immobilie ist bereits vermietet.');
  h.annual('rent:advertise:'+id,2);
  if(h.random()<(r.condition/120+.1)){r.occupied=true;h.log('Du hast für '+asset.name+' einen Mieter gefunden. Jahresmiete: '+euros(r.annualRent)+'.','good');}
  else h.log('Dein Inserat blieb ohne passenden Mieter.');
 }else if(key==='repair'){
  const cost=Math.round(asset.value*.025);
  if(p.cash<cost)throw Error('Für die Renovierung fehlen '+euros(cost)+'.');
  h.annual('rent:repair:'+id);p.cash-=cost;
  r.condition=cap(r.condition+30);
  h.log('Du hast '+euros(cost)+' für die Renovierung von '+asset.name+' ausgegeben.','good');
 }else if(key==='vacate'){
  if(!r.occupied)throw Error('Die Immobilie ist nicht vermietet.');
  h.annual('rent:vacate:'+id);r.occupied=false;
  h.log('Das Mietverhältnis für '+asset.name+' wurde beendet.');
 }
}

export function advanceExpansions(s:SaveGame,h:ExpansionHooks){
 const p=s.person;
 if(p.social){
  let total=0;
  for(const platform of SOCIAL_PLATFORMS){
   const profile=p.social[platform];if(!profile)continue;
   const churn=Math.round(profile.followers*(.01+h.random()*.04));
   profile.followers=Math.max(0,profile.followers-churn);
   total+=profile.followers;
  }
  const target=cap(total>=1000000?90:total>=100000?65:total>=10000?28:0);
  p.fame=cap(Math.max(0,(p.fame??0)-4,target));
  if(total>100000&&p.age%5===0)h.log('Deine Social-Media-Kanäle haben insgesamt '+total.toLocaleString('de-DE')+' Follower.','good');
 }
 const b=p.business;
 if(b){
  b.age++;
  const multipliers:{[k in BusinessSector]:number}={cafe:1,fashion:1.35,technology:2.4};
  const revenue=Math.round((b.staff*11500+b.quality*160+b.brand*115)*multipliers[b.sector]*(0.65+h.random()*.7));
  const costs=b.staff*14000+Math.round(6200*multipliers[b.sector]);
  const profit=revenue-costs;
  b.cash+=profit;b.brand=cap(b.brand-1);
  h.log('Dein Unternehmen: Umsatz '+euros(revenue)+', Kosten '+euros(costs)+', Ergebnis '+euros(profit)+'.',profit>=0?'good':'bad');
  if(b.cash< -10000){h.log('Dein Unternehmen ist wegen Zahlungsunfähigkeit geschlossen worden.','bad');p.business=null;h.stat('happiness',-18);}
  else if(profit>0)h.stat('happiness',2);
 }
 for(const asset of p.assets){
  if(asset.kind!=='Haus'||!asset.rental)continue;
  const rental=asset.rental;
  rental.condition=cap(rental.condition-2-Math.floor(h.random()*4));
  if(!rental.occupied)continue;
  if(h.random()<.07+(100-rental.condition)*.002){
   rental.occupied=false;
   h.log('Der Mieter deiner Immobilie '+asset.name+' ist ausgezogen.','bad');
  }else{
   const collected=Math.round(rental.annualRent*(rental.condition<40?.8:1));
   p.cash+=collected;
   h.log('Mieteinnahmen aus '+asset.name+': '+euros(collected)+'.','good');
  }
 }
}

export function validExtensions(p:Person):boolean{
 if(p.fame!==undefined&&!finite(p.fame,0,100))return false;
 if(p.social!==undefined){
  if(!p.social||typeof p.social!=='object'||Array.isArray(p.social))return false;
  const keys=Object.keys(p.social);
  if(keys.length>5||keys.some(k=>!SOCIAL_PLATFORMS.includes(k as SocialPlatform)))return false;
  for(const profile of Object.values(p.social)){
   if(!profile||!whole(profile.followers,0,50000000)||!whole(profile.posts,0,1000000)||!whole(profile.warnings,0,100))return false;
  }
 }
 if(p.business!==undefined&&p.business!==null){
  const b=p.business;
  if(!BUSINESS_SECTORS.some(x=>x.id===b.sector)||typeof b.name!=='string'||b.name.length>100||
  !finite(b.cash,-1e10,1e10)||!whole(b.staff,1,500)||!whole(b.brand,0,100)||!whole(b.quality,0,100)||!whole(b.age,0,200))return false;
 }
 for(const asset of p.assets||[]){
  if(asset.rental===undefined)continue;
  const r=asset.rental;
  if(asset.kind!=='Haus'||!r||typeof r.occupied!=='boolean'||!finite(r.annualRent,0,1e10)||!finite(r.condition,0,100))return false;
 }
 return true;
}
