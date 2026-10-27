import type {Person,Relationship,SaveGame} from './types.js';
import type {ExpansionHooks} from './expansions.js';

// Original family simulation with persistent, optional extensions for old saves.
const cap=(n:number)=>Math.max(0,Math.min(100,Math.round(n)));
const money=(n:number)=>Math.round(n).toLocaleString('de-DE')+' €';
export const relationshipTrust=(r:Relationship)=>r.trust??Math.max(20,Math.min(90,r.bond));
export type FamilyKey='meet'|'family-day'|'apologize'|'assist'|'teach-child'|'reconcile'|'divorce'|'distance';
const relatives=(r:Relationship)=>['Mutter','Vater','Elternteil','Kind','Partner'].includes(r.kind);
const valid=(r:Relationship)=>r.alive&&!r.estranged;
const contact=(p:Person,r:Relationship)=>{r.lastContactAge=p.age;};
const trust=(r:Relationship,delta:number)=>{r.trust=cap(relationshipTrust(r)+delta);};
const bond=(r:Relationship,delta:number)=>{r.bond=cap(r.bond+delta);};
const free=(p:Person)=>{if(p.prisonYears>0)throw Error('Während der Haft sind diese Familienaktivitäten nicht verfügbar.');};
export function familyAction(s:SaveGame,key:FamilyKey,id:string|undefined,h:ExpansionHooks,newFriend:()=>Relationship){
 const p=s.person;
 if(!p.alive)throw Error('Dieses Leben ist beendet.');
 if(key==='meet'){
  free(p);
  if(p.age<5)throw Error('Neue Freundschaften sind ab 5 Jahren verfügbar.');
  if(p.relationships.filter(r=>r.kind==='Freund'&&r.alive&&!r.estranged).length>=20)throw Error('Du hast bereits viele Freunde.');
  h.annual('family:meet',2);
  if(h.random()<.82){
   const person=newFriend();person.bond=47+Math.floor(h.random()*30);person.trust=54;person.lastContactAge=p.age;
   p.relationships.push(person);h.stat('happiness',5);
   h.log('Du hast '+person.name+' kennengelernt. Eine neue Freundschaft beginnt.','good');
  }else{
   h.log('Du hast neue Leute getroffen, aber es hat sich noch keine Freundschaft entwickelt.');
  }
  return;
 }
 if(key==='family-day'){
  free(p);
  const family=p.relationships.filter(r=>valid(r)&&relatives(r));
  if(!family.length)throw Error('Aktuell hast du keine erreichbaren Familienmitglieder.');
  const price=p.age>=18?150:0;
  if(p.cash<price)throw Error('Für den Familienausflug fehlen '+money(price)+'.');
  h.annual('family:day');
  p.cash-=price;for(const r of family){bond(r,5);trust(r,3);contact(p,r);}
  h.stat('happiness',8);h.log('Ihr habt gemeinsam Zeit als Familie verbracht. '+family.length+' Beziehungen wurden gestärkt.','good');
  return;
 }
 const r=p.relationships.find(person=>person.id===id);
 if(!r||!r.alive)throw Error('Diese Person ist nicht erreichbar.');
 if(key!=='reconcile'&&key!=='distance'&&r.estranged)throw Error('Der Kontakt ist abgebrochen. Versuche zuerst eine Versöhnung.');
 free(p);
 switch(key){
  case 'apologize':{
   if(r.kind==='Ex-Partner')throw Error('Für frühere Partnerschaften gibt es die Versöhnungsaktion.');
   h.annual('family:apologize:'+r.id);
   const success=h.random()<Math.min(.93,.45+relationshipTrust(r)/175);
   if(success){bond(r,15);trust(r,13);r.estranged=false;h.stat('happiness',5);h.log('Du hast dich bei '+r.name+' entschuldigt. Ihr habt euch wieder angenähert.','good');}
   else{bond(r,-4);h.log(r.name+' möchte derzeit keine Entschuldigung annehmen.','bad');}
   contact(p,r);break;
  }
  case 'assist':{
   if(!['Mutter','Vater','Elternteil','Freund'].includes(r.kind))throw Error('Um finanzielle Hilfe kannst du nur Eltern oder Freunde bitten.');
   if(relationshipTrust(r)<50||r.bond<45)throw Error('Eure Beziehung ist nicht vertrauensvoll genug für finanzielle Hilfe.');
   h.annual('family:assist:'+r.id);
   if(h.random()<.65){
    const cash=250+Math.round(h.random()*750);p.cash+=cash;bond(r,-3);trust(r,-4);
    h.log(r.name+' hat dir mit '+money(cash)+' finanziell geholfen.','good');
   }else{bond(r,-4);h.log(r.name+' konnte dir kein Geld geben.');}
   contact(p,r);break;
  }
  case 'teach-child':{
   if(r.kind!=='Kind'||r.age<5||r.age>=18||p.age<18)throw Error('Diese Förderung ist für minderjährige Kinder ab fünf Jahren vorgesehen.');
   if(p.cash<200)throw Error('Für Lernmaterialien und Förderung fehlen 200 €.');
   h.annual('family:teach:'+r.id,2);
   p.cash-=200;r.development=cap((r.development??50)+7+Math.round(h.random()*8));
   bond(r,8);trust(r,4);contact(p,r);
   h.log('Du hast '+r.name+' beim Lernen unterstützt. Entwicklungsstand: '+r.development+' %.','good');break;
  }
  case 'reconcile':{
   if(!r.estranged&&r.kind!=='Ex-Partner')throw Error('Zwischen euch besteht kein Kontaktabbruch.');
   h.annual('family:reconcile:'+r.id);
   if(r.kind==='Ex-Partner'&&p.relationships.some(x=>x.kind==='Partner'&&x.alive))throw Error('Du bist bereits in einer Partnerschaft.');
   const chance=Math.max(.2,Math.min(.85,.32+relationshipTrust(r)/180));
   if(h.random()<chance){
    r.estranged=false;bond(r,18);trust(r,12);
    if(r.kind==='Ex-Partner'){r.kind='Partner';p.marriedPartnerId=null;}
    h.stat('happiness',8);h.log('Du und '+r.name+' habt euch wieder versöhnt.','good');
   }else{h.log(r.name+' ist noch nicht bereit, den Kontakt wiederaufzunehmen.','bad');}
   contact(p,r);break;
  }
  case 'divorce':{
   if(r.kind!=='Partner'||p.marriedPartnerId!==r.id)throw Error('Du bist mit dieser Person nicht verheiratet.');
   h.annual('family:divorce');
   const settlement=Math.round(Math.max(0,p.cash)*.25);
   p.cash-=settlement;p.marriedPartnerId=null;r.kind='Ex-Partner';r.estranged=true;
   bond(r,-35);trust(r,-35);h.stat('happiness',-20);
   h.log('Die Scheidung von '+r.name+' ist abgeschlossen. Die Vermögensaufteilung kostete dich '+money(settlement)+'.','bad');
   contact(p,r);break;
  }
  case 'distance':{
   if(r.kind==='Kind'&&r.age<18)throw Error('Von deinem minderjährigen Kind kannst du den Kontakt nicht einfach abbrechen.');
   if(r.kind==='Partner')throw Error('Beende zunächst die Partnerschaft.');
   if(r.estranged)throw Error('Ihr habt bereits keinen Kontakt.');
   h.annual('family:distance:'+r.id);
   r.estranged=true;bond(r,-24);trust(r,-20);h.stat('happiness',-4);
   h.log('Du hast den Kontakt zu '+r.name+' abgebrochen.','bad');
   contact(p,r);break;
  }
 }
}
export function familyYear(s:SaveGame,h:ExpansionHooks){
 const p=s.person;
 const minorChildren=p.relationships.filter(r=>r.kind==='Kind'&&r.alive&&r.age<18);
 if(p.age>=18&&minorChildren.length){
  const upkeep=minorChildren.length*1200;p.cash-=upkeep;
  h.log('Familienunterhalt für '+minorChildren.length+' minderjährige Kinder: '+money(upkeep)+'.');
 }
 for(const r of p.relationships){
  if(!r.alive)continue;
  if(r.lastContactAge===undefined){r.lastContactAge=p.age;continue;}
  const gap=p.age-r.lastContactAge;
  if(gap>=2&&!r.estranged){
   const decay=Math.min(8,1+Math.floor(gap/2));
   bond(r,-decay);trust(r,-Math.max(1,Math.floor(decay/2)));
  }
  if(r.kind==='Kind'&&r.age>=5&&r.age<18){
   r.development=cap((r.development??50)+Math.round((h.random()-.5)*7)+(r.bond>=65?2:-2));
  }
  if(r.kind==='Partner'&&r.bond<15&&relationshipTrust(r)<20){
   h.stat('happiness',-3);
   if(p.age%4===0)h.log('Die Beziehung zu '+r.name+' ist sehr angespannt.','bad');
  }
 }
}
export function validFamily(p:Person):boolean{
 for(const r of p.relationships||[]){
  if(r.trust!==undefined&&(!Number.isInteger(r.trust)||r.trust<0||r.trust>100))return false;
  if(r.development!==undefined&&(!Number.isInteger(r.development)||r.development<0||r.development>100||r.kind!=='Kind'))return false;
  if(r.lastContactAge!==undefined&&(!Number.isInteger(r.lastContactAge)||r.lastContactAge<0||r.lastContactAge>200))return false;
  if(r.estranged!==undefined&&typeof r.estranged!=='boolean')return false;
 }
 return true;
}
