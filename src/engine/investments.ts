import type {Person,SaveGame} from './types.js';
import type {ExpansionHooks} from './expansions.js';

// Fictional tickers and original deterministic volatility models, not BitLife's formulas.
export const FINANCIAL_ASSETS=[
 {id:'equity',name:'NordIndustrie Aktie',kind:'Aktie',initial:100,volatility:.20,dividend:.012},
 {id:'bond',name:'Staatsanleihe',kind:'Anleihe',initial:100,volatility:.035,dividend:.026},
 {id:'fund',name:'Globaler Aktienfonds',kind:'Fonds',initial:75,volatility:.11,dividend:.008},
 {id:'penny',name:'Start-up Penny Stock',kind:'Penny Stock',initial:4,volatility:.45,dividend:0},
 {id:'crypto',name:'NordCoin',kind:'Kryptowährung',initial:240,volatility:.62,dividend:0}
] as const;
const finite=(n:unknown,min:number,max:number)=>typeof n==='number'&&Number.isFinite(n)&&n>=min&&n<=max;
const cost=(v:number)=>Math.round(v*100)/100;
export function getMarketPrice(p:Person,id:string):number{
 const item=FINANCIAL_ASSETS.find(x=>x.id===id);
 if(!item)throw Error('Unbekanntes Wertpapier.');
 return p.marketPrices?.[id]??item.initial;
}
export function portfolioValue(p:Person):number{
 return Math.round((p.investments||[]).reduce((sum,x)=>sum+x.quantity*getMarketPrice(p,x.assetId),0));
}
export function investAction(s:SaveGame,key:'buy'|'sell'|'advisor-hire'|'advisor-fire',id:string|undefined,qty:number|undefined,h:ExpansionHooks){
 const p=s.person;
 if(p.age<18||p.prisonYears>0)throw Error('Investitionen sind erst ab 18 und außerhalb der Haft verfügbar.');
 if(key==='advisor-hire'){
  if(p.financialAdvisor)throw Error('Du hast bereits einen Finanzberater.');
  if(p.cash<1000)throw Error('Der Berater benötigt 1.000 € Startgebühr.');
  p.cash-=1000;p.financialAdvisor=true;h.log('Du hast einen Finanzberater engagiert. Er überprüft dein Depot jährlich.','good');return;
 }
 if(key==='advisor-fire'){
  if(!p.financialAdvisor)throw Error('Du beschäftigst keinen Finanzberater.');
  p.financialAdvisor=false;h.log('Du hast deinen Finanzberater entlassen.');return;
 }
 const item=FINANCIAL_ASSETS.find(x=>x.id===id);
 if(!item)throw Error('Unbekanntes Wertpapier.');
 if(!Number.isInteger(qty)||!qty||qty<1||qty>1000)throw Error('Bitte zwischen 1 und 1.000 Anteilen handeln.');
 const quantity=qty;
 p.marketPrices??={};p.investments??=[];
 const price=getMarketPrice(p,item.id);
 const holding=p.investments.find(x=>x.assetId===item.id);
 if(key==='buy'){
  const total=cost(price*quantity*1.005);
  if(p.cash<total)throw Error('Unzureichendes Guthaben für Kauf und Handelsgebühren.');
  p.cash-=total;
  if(holding){holding.quantity+=quantity;holding.costBasis=cost(holding.costBasis+total);}
  else p.investments.push({assetId:item.id,quantity,costBasis:total});
  h.log('Du hast '+quantity+' Anteile '+item.name+' für '+total.toLocaleString('de-DE')+' € gekauft.','good');
 }else if(key==='sell'){
  if(!holding||holding.quantity<quantity)throw Error('Du besitzt nicht genug Anteile.');
  const proceeds=cost(price*quantity*.995);
  const basis=holding.costBasis*(quantity/holding.quantity);
  p.cash+=proceeds;holding.costBasis=cost(Math.max(0,holding.costBasis-basis));holding.quantity-=quantity;
  if(holding.quantity===0)p.investments=p.investments.filter(x=>x.assetId!==item.id);
  h.log('Du hast '+quantity+' Anteile '+item.name+' verkauft. Erlös '+proceeds.toLocaleString('de-DE')+' €, Ergebnis vor Steuern '+Math.round(proceeds-basis).toLocaleString('de-DE')+' €.',proceeds>=basis?'good':'bad');
 }
}
export function advanceInvestments(s:SaveGame,h:ExpansionHooks){
 const p=s.person;
 if(!p.marketPrices&&!p.investments?.length&&!p.financialAdvisor)return;
 p.marketPrices??={};
 for(const item of FINANCIAL_ASSETS){
  const old=getMarketPrice(p,item.id);
  const swing=(h.random()+h.random()+h.random()-1.5)*item.volatility;
  p.marketPrices[item.id]=cost(Math.max(.01,Math.min(1_000_000,old*(1+swing+.015))));
 }
 let dividends=0;
 for(const holding of p.investments||[]){
  const item=FINANCIAL_ASSETS.find(x=>x.id===holding.assetId);
  if(!item)continue;
  dividends+=getMarketPrice(p,item.id)*holding.quantity*item.dividend;
 }
 if(dividends>0){p.cash+=cost(dividends);h.log('Erträge aus Dividenden und Zinsen: '+Math.round(dividends).toLocaleString('de-DE')+' €.','good');}
 if(p.financialAdvisor){
  p.cash-=900;
  if(p.cash>=3000){
   const item=FINANCIAL_ASSETS.find(x=>x.id==='fund')!;
   const price=getMarketPrice(p,item.id);
   const quantity=Math.max(0,Math.floor(Math.min(2000,p.cash*.1)/price));
   if(quantity>0){
    const total=cost(quantity*price*1.005);p.cash-=total;
    const old=p.investments?.find(x=>x.assetId==='fund');
    if(old){old.quantity+=quantity;old.costBasis=cost(old.costBasis+total);}
    else (p.investments??=[]).push({assetId:'fund',quantity,costBasis:total});
    h.log('Dein Finanzberater investierte '+Math.round(total).toLocaleString('de-DE')+' € in den Aktienfonds.','good');
   }
  }
 }
 if(p.age%5===0&&p.investments?.length)h.log('Dein Depot ist derzeit rund '+portfolioValue(p).toLocaleString('de-DE')+' € wert.');
}
export function validInvestments(p:Person):boolean{
 if(p.financialAdvisor!==undefined&&typeof p.financialAdvisor!=='boolean')return false;
 if(p.marketPrices!==undefined){
  if(!p.marketPrices||typeof p.marketPrices!=='object'||Array.isArray(p.marketPrices))return false;
  if(Object.keys(p.marketPrices).some(id=>!FINANCIAL_ASSETS.some(a=>a.id===id)))return false;
  if(Object.values(p.marketPrices).some(v=>!finite(v,.01,1_000_000)))return false;
 }
 if(p.investments!==undefined){
  if(!Array.isArray(p.investments)||p.investments.length>5)return false;
  const ids=new Set<string>();
  for(const position of p.investments){
   if(!position||typeof position.assetId!=='string'||!FINANCIAL_ASSETS.some(a=>a.id===position.assetId)||ids.has(position.assetId))return false;
   ids.add(position.assetId);
   if(!Number.isInteger(position.quantity)||position.quantity<1||position.quantity>1_000_000_000||!finite(position.costBasis,0,1e12))return false;
  }
 }
 return true;
}
