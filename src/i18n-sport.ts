/** Display-only localization of dynamic sports-career history, including legacy saves. */
export function translateSportDynamic(value:string,lang:'en'|'pt'):string|null{
 const tr=(en:string,pt:string)=>lang==='en'?en:pt;
 const euro=(raw:string)=>{
  const amount=Number(raw.replace(/\./g,'').replace(',','.'));
  if(!Number.isFinite(amount))return raw+' €';
  const formatted=new Intl.NumberFormat(lang==='en'?'en-GB':'pt-PT').format(amount);
  return lang==='en'?'€'+formatted:formatted+' €';
 };
 let m:RegExpMatchArray|null;
 if((m=value.match(/^Du trainierst (Fußball|Basketball|Handball)\. Spielstärke: (\d+) %, Fitness: (\d+) %\.$/))){
  const sport=m[1]==='Fußball'?(lang==='en'?'football':'futebol'):m[1]==='Basketball'?(lang==='en'?'basketball':'basquetebol'):'andebol';
  return tr('You train in '+sport+'. Skill: '+m[2]+'%, fitness: '+m[3]+'%.','Treinas '+sport+'. Habilidade: '+m[2]+'%, condição física: '+m[3]+'%.');
 }
 if((m=value.match(/^Du unterschreibst bei (.+) \((Regional|National)liga\)\. Jahresgehalt brutto: ([\d.,]+) €\.$/)))
  return tr('You sign with '+m[1]+' ('+m[2]+' league). Gross annual salary: '+euro(m[3]!) +'.','Assinas pelo '+m[1]+' (liga '+(m[2]==='Regional'?'regional':'nacional')+'). Salário anual bruto: '+euro(m[3]!)+'.');
 if((m=value.match(/^Der Verein stimmt einer Gehaltserhöhung um ([\d.,]+) € pro Jahr zu\.$/)))
  return tr('The club agrees to an annual pay rise of '+euro(m[1]!)+'.','O clube aceita um aumento salarial anual de '+euro(m[1]!)+'.');
 if((m=value.match(/^Ein fiktiver Ausrüster zahlt dir ([\d.,]+) € für eine Kampagne\.$/)))
  return tr('A fictional sportswear sponsor pays you '+euro(m[1]!)+' for a campaign.','Uma marca fictícia de equipamento desportivo paga-te '+euro(m[1]!)+' por uma campanha.');
 if((m=value.match(/^Du beendest deine Profisportkarriere nach (\d+) Spielzeiten\.$/)))
  return tr('You retire from professional sport after '+m[1]+' seasons.','Terminas a carreira desportiva profissional após '+m[1]+' épocas.');
 if((m=value.match(/^Saison bei (.+): (\d+) Siege, Leistung (\d+) %, ([\d.,]+) € Nettoverdienst\.( Meistertitel!)?$/)))
  return tr('Season at '+m[1]+': '+m[2]+' wins, performance '+m[3]+'%, net earnings '+euro(m[4]!)+'.'+(m[5]?' Champions!':''),
   'Época no '+m[1]+': '+m[2]+' vitórias, desempenho '+m[3]+'%, rendimento líquido '+euro(m[4]!)+'.'+(m[5]?' Campeões!':''));
 if((m=value.match(/^Dein Vertrag bei (.+) ist ausgelaufen\. Du kannst erneut zum Probetraining antreten\.$/)))
  return tr('Your contract with '+m[1]+' has expired. You can attend another tryout.','O teu contrato com '+m[1]+' terminou. Podes voltar a fazer provas de seleção.');
 return null;
}
