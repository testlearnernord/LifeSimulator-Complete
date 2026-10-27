import type {Gender,Person,SaveGame} from './types.js';
import type {ExpansionHooks} from './expansions.js';

/** Everyday life actions. All rules and prices are original approximations. */
export type LifestyleKey='adopt'|'fertility'|'license'|'loan'|'repay'|'accessory'|'gamble'|'identity';
export const ACCESSORIES=['Sonnenbrille','Mütze','Armbanduhr','Hut','Schal'] as const;
const finite=(value:unknown,a:number,b:number)=>typeof value==='number'&&Number.isFinite(value)&&value>=a&&value<=b;
const requireFree=(p:Person,age:number)=>{if(p.age<age)throw Error('Verfügbar ab '+age+' Jahren.');if(p.prisonYears>0)throw Error('Während der Haft nicht verfügbar.');};
export function lifestyleAction(s:SaveGame,key:LifestyleKey,value:string|undefined,h:ExpansionHooks,makeChild:()=>void){
 const p=s.person;
 switch(key){
 case 'adopt':{
  requireFree(p,21);
  if(p.cash<3000)throw Error('Für das Adoptionsverfahren fehlen 3.000 €.');
  h.annual('adopt');
  p.cash-=3000;
  const eligible=!p.record&&p.stats.health>=25&&(p.jobId!==null||p.cash>=15000);
  if(eligible&&h.random()<.8){
   makeChild();
   h.stat('happiness',13);
   h.log('Deine Adoption wurde bewilligt. Du hast ein Kind in deine Familie aufgenommen.','good');
  }else{
   h.stat('happiness',-6);
   h.log('Das Adoptionsverfahren endete diesmal ohne Bewilligung.','bad');
  }
  break;
 }
 case 'fertility':{
  requireFree(p,18);
  if(p.age>55)throw Error('Diese Behandlung ist in dieser Altersphase nicht verfügbar.');
  if(p.cash<1500)throw Error('Die Fruchtbarkeitsbehandlung kostet 1.500 €.');
  h.annual('fertility');
  p.cash-=1500;
  if(h.random()<.55){
   makeChild();
   if(h.random()<.10)makeChild();
   h.stat('happiness',12);
   h.log('Die Behandlung in der Fruchtbarkeitsklinik war erfolgreich. Deine Familie wächst!','good');
  }else{h.stat('happiness',-5);h.log('Die Fruchtbarkeitsbehandlung war leider erfolglos.','bad');}
  break;
 }
 case 'license':{
  requireFree(p,16);
  if(p.license)throw Error('Du besitzt bereits einen Führerschein.');
  if(p.cash<220)throw Error('Die Fahrprüfung kostet 220 €.');
  h.annual('license');
  p.cash-=220;
  if(h.random()<.55+p.stats.smarts/300){p.license=true;h.stat('happiness',8);h.log('Du hast die Fahrprüfung bestanden und einen Führerschein erhalten.','good');}
  else{h.stat('happiness',-3);h.log('Du bist leider durch die Fahrprüfung gefallen.','bad');}
  break;
 }
 case 'loan':{
  requireFree(p,18);
  const amount=Number(value||10000);
  if(![10000,25000,50000].includes(amount))throw Error('Ungültiger Kreditbetrag.');
  if((p.loanBalance||0)>0)throw Error('Du hast bereits einen offenen Kredit.');
  if(p.record||(!p.jobId&&!p.business))throw Error('Die Bank verlangt ein regelmäßiges Einkommen und ein sauberes Führungszeugnis.');
  h.annual('loan');
  p.loanBalance=amount;p.cash+=amount;
  h.log('Die Bank hat dir '+amount.toLocaleString('de-DE')+' € geliehen. Zinsen und Rückzahlungen fallen jährlich an.','good');
  break;
 }
 case 'repay':{
  requireFree(p,18);
  if(!p.loanBalance||p.loanBalance<=0)throw Error('Du hast keinen offenen Kredit.');
  const payment=Math.min(p.loanBalance,Number(value||5000));
  if(!Number.isInteger(payment)||payment<1||payment>100000)throw Error('Ungültiger Rückzahlungsbetrag.');
  if(p.cash<payment)throw Error('Du hast nicht genug Bargeld für die Rückzahlung.');
  p.cash-=payment;p.loanBalance=Math.max(0,Math.round(p.loanBalance-payment));
  h.log('Du hast '+payment.toLocaleString('de-DE')+' € deines Kredits zurückgezahlt.','good');
  break;
 }
 case 'accessory':{
  requireFree(p,8);
  if(!ACCESSORIES.includes(value as typeof ACCESSORIES[number]))throw Error('Dieses Accessoire ist nicht verfügbar.');
  if(p.cash<75)throw Error('Das Accessoire kostet 75 €.');
  h.annual('accessory',2);
  p.cash-=75;p.accessory=value;
  h.stat('looks',2);h.stat('happiness',3);
  h.log('Du trägst jetzt: '+value+'.','good');
  break;
 }
 case 'gamble':{
  requireFree(p,18);
  if(p.cash<100)throw Error('Für diesen Casinobesuch brauchst du 100 €.');
  h.annual('gamble',3);
  p.cash-=100;
  const win=h.random()<.36;
  if(win){const prize=140+Math.floor(h.random()*170);p.cash+=prize;h.stat('happiness',4);h.log('Du hast im Casino '+prize+' € gewonnen.','good');}
  else{h.stat('happiness',-3);h.log('Du hast im Casino 100 € verloren.','bad');}
  break;
 }
 case 'identity':{
  requireFree(p,16);
  if(!['weiblich','männlich','divers'].includes(value||''))throw Error('Ungültige Geschlechtsangabe.');
  if(p.gender===value)throw Error('Diese Angabe ist bereits hinterlegt.');
  h.annual('identity');
  p.gender=value as Gender;
  h.stat('happiness',7);
  h.log('Du hast deine Geschlechtsidentität im Profil geändert.','good');
  break;
 }
 default:throw Error('Unbekannte Lebensaktivität.');
 }
}
export function advanceLifestyle(s:SaveGame,h:ExpansionHooks){
 const p=s.person;
 if(!p.loanBalance||p.loanBalance<=0)return;
 const interest=Math.ceil(p.loanBalance*.065);
 const principal=Math.max(0,Math.min(p.loanBalance,Math.ceil(p.loanBalance*.11)));
 p.loanBalance+=interest;
 const due=interest+principal;
 p.cash-=due;p.loanBalance=Math.max(0,p.loanBalance-due);
 h.log('Kreditrate '+due.toLocaleString('de-DE')+' €, davon Zinsen '+interest.toLocaleString('de-DE')+' €. Restschuld '+p.loanBalance.toLocaleString('de-DE')+' €.',p.cash<0?'bad':'normal');
 if(p.cash< -20000)h.stat('happiness',-7);
}
export function validLifestyle(p:Person):boolean{
 if(p.birthCity!==undefined&&(typeof p.birthCity!=='string'||p.birthCity.length>70))return false;
 if(p.birthday!==undefined&&(typeof p.birthday!=='string'||p.birthday.length>40))return false;
 if(p.zodiac!==undefined&&(typeof p.zodiac!=='string'||p.zodiac.length>40))return false;
 if(p.birthStory!==undefined&&(typeof p.birthStory!=='string'||p.birthStory.length>800))return false;
 if(p.license!==undefined&&typeof p.license!=='boolean')return false;
 if(p.loanBalance!==undefined&&!finite(p.loanBalance,0,1e10))return false;
 if(p.accessory!==undefined&&!ACCESSORIES.includes(p.accessory as typeof ACCESSORIES[number]))return false;
 if(p.relationships.some(x=>x.occupation!==undefined&&(typeof x.occupation!=='string'||x.occupation.length>80)))return false;
 return true;
}