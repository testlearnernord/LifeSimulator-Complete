import type {Heirloom,HeirloomKind,Person,SaveGame} from './types.js';
import type {ExpansionHooks} from './expansions.js';

// Eigene Objekte und Preise; keine Originalnamen, -wahrscheinlichkeiten oder -grafiken.
export const HEIRLOOM_CATALOG=[
 {kind:'kompass',name:'Messingkompass',icon:'🧭',rarity:'Häufig',weight:28,min:80,max:600},
 {kind:'kamera',name:'Analoge Reisekamera',icon:'📷',rarity:'Häufig',weight:23,min:120,max:950},
 {kind:'buch',name:'Handgebundenes Reisebuch',icon:'📕',rarity:'Häufig',weight:20,min:70,max:450},
 {kind:'uhr',name:'Mechanische Taschenuhr',icon:'💠',rarity:'Selten',weight:12,min:900,max:6500},
 {kind:'fernrohr',name:'Historisches Fernrohr',icon:'🔭',rarity:'Selten',weight:9,min:1200,max:8500},
 {kind:'skizze',name:'Originale Stadtzeichnung',icon:'🖼️',rarity:'Selten',weight:6,min:2000,max:14000},
 {kind:'globus',name:'Handbemalter Himmelsglobus',icon:'🌐',rarity:'Legendär',weight:2,min:25000,max:120000}
] as const;
export type HeirloomAction='search'|'appraise'|'restore'|'sell'|'exhibit';
const catalog=(kind:HeirloomKind)=>HEIRLOOM_CATALOG.find(x=>x.kind===kind);
const whole=(v:unknown,lo:number,hi:number)=>typeof v==='number'&&Number.isInteger(v)&&v>=lo&&v<=hi;
const dayKey=(date:Date)=>[date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-');
export const todayHeirloomKey=()=>dayKey(new Date());
export const heirloomWorth=(p:Person)=>Math.round((p.heirlooms||[]).reduce((sum,item)=>sum+Math.floor(item.value*item.condition/100*.9),0));
export function heirloomAction(s:SaveGame,key:HeirloomAction,id:string|undefined,h:ExpansionHooks){
 const p=s.person;
 if(p.prisonYears>0)throw Error('In Haft kannst du keine Erbstücke verwalten.');
 if(key==='search'){
  if(p.age<8)throw Error('Auf dem Dachboden suchen kannst du ab 8 Jahren.');
  const today=todayHeirloomKey();
  if(p.heirloomSearchDate&&p.heirloomSearchDate>=today)throw Error('Heute wurde bereits nach einem Erbstück gesucht.');
  if((p.heirlooms?.length||0)>=100)throw Error('Deine Sammlung ist voll.');
  p.heirloomSearchDate=today;
  const total=HEIRLOOM_CATALOG.reduce((sum,item)=>sum+item.weight,0);
  let roll=h.random()*total;
  const found=HEIRLOOM_CATALOG.find(item=>(roll-=item.weight)<0)||HEIRLOOM_CATALOG[HEIRLOOM_CATALOG.length-1]!;
  const item:Heirloom={id:'fund-'+p.age+'-'+Math.floor(h.random()*1e9).toString(36),kind:found.kind,foundAge:p.age,value:found.min+Math.floor(h.random()*(found.max-found.min+1)),condition:55+Math.floor(h.random()*41),appraised:false};
  p.heirlooms??=[];
  // Keine Kollisionen bei wiederholten Suchen über mehrere Spieljahre.
  while(p.heirlooms.some(x=>x.id===item.id))item.id+='x';
  p.heirlooms.push(item);
  h.stat('happiness',3);
  h.log('Auf dem Dachboden findest du: '+found.name+'. Der Wert ist noch unbekannt.','good');
  return;
 }
 const item=p.heirlooms?.find(x=>x.id===id);
 if(!item)throw Error('Dieses Erbstück ist nicht in deiner Sammlung.');
 const name=catalog(item.kind)!.name;
 if(key==='appraise'){
  if(item.appraised)throw Error('Das Erbstück wurde bereits geschätzt.');
  if(p.cash<100)throw Error('Die Schätzung kostet 100 €.');
  p.cash-=100;item.appraised=true;
  h.log('Ein Sachverständiger schätzt '+name+' auf '+item.value.toLocaleString('de-DE')+' € vor Zustandsabschlag.','good');
 }else if(key==='restore'){
  if(p.age<16)throw Error('Eine Restaurierung ist ab 16 Jahren möglich.');
  if(item.condition>=100)throw Error('Dieses Erbstück ist bereits vollständig restauriert.');
  if(p.cash<400)throw Error('Die Restaurierung kostet 400 €.');
  h.annual('heirloom:restore:'+item.id);
  p.cash-=400;item.condition=Math.min(100,item.condition+15);
  h.log(name+' wurde restauriert. Zustand: '+item.condition+' %.','good');
 }else if(key==='sell'){
  if(p.age<18)throw Error('Verkaufen ist erst ab 18 Jahren möglich.');
  if(!item.appraised)throw Error('Lass das Erbstück vor dem Verkauf schätzen.');
  const price=Math.floor(item.value*item.condition/100*.9);
  p.cash+=price;p.heirlooms=p.heirlooms!.filter(x=>x.id!==item.id);
  h.log('Du verkaufst '+name+' für '+price.toLocaleString('de-DE')+' €.','good');
 }else if(key==='exhibit'){
  h.annual('heirloom:exhibit');
  h.stat('happiness',5);
  if(catalog(item.kind)!.rarity==='Legendär')p.fame=Math.min(100,(p.fame||0)+2);
  h.log('Du präsentierst '+name+' deinen Freunden.','good');
 }else throw Error('Unbekannte Erbstück-Aktion.');
}
export function advanceHeirlooms(s:SaveGame,h:ExpansionHooks){
 for(const item of s.person.heirlooms||[]){
  if(item.condition>20&&h.random()<.12)item.condition--;
 }
}
export function validHeirlooms(p:Person):boolean{
 if(p.heirloomSearchDate!==undefined&&(typeof p.heirloomSearchDate!=='string'||!/^(19|20|21)\d\d-(0[1-9]|1[0-2])-([0-2]\d|3[01])$/.test(p.heirloomSearchDate)||!Number.isFinite(Date.parse(p.heirloomSearchDate))))return false;
 if(p.heirlooms===undefined)return true;
 if(!Array.isArray(p.heirlooms)||p.heirlooms.length>100)return false;
 const ids=new Set<string>();
 return p.heirlooms.every(item=>{
  if(!item||typeof item!=='object'||typeof item.id!=='string'||item.id.length>100||!/^fund-\d+-[a-z0-9]+$/.test(item.id)||ids.has(item.id))return false;
  ids.add(item.id);
  const kind=catalog(item.kind);
  return !!kind&&whole(item.foundAge,0,200)&&whole(item.value,kind.min,kind.max)&&whole(item.condition,20,100)&&typeof item.appraised==='boolean';
 });
}
