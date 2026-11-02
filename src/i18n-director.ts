/** Display-only translations for existing director careers and German legacy saves. */
export type DirectorLanguage='en'|'pt';
const filmTitles:readonly (readonly [string,string,string])[]=[
 ['Zwischen den Zeilen','Between the Lines','Entrelinhas'],
 ['Der letzte Sommer','The Last Summer','O Último Verão'],
 ['Ein stilles Versprechen','A Quiet Promise','Uma Promessa Silenciosa'],
 ['Chaos im Viertel','Neighbourhood Chaos','Caos no Bairro'],
 ['Drei sind einer zu viel',"Three's a Crowd",'Três É Demais'],
 ['Das verrückte Wochenende','The Wild Weekend','O Fim de Semana Louco'],
 ['Die Spur im Nebel','Trail in the Fog','Rasto no Nevoeiro'],
 ['Letzte Ausfahrt','Last Exit','Última Saída'],
 ['Die unbekannte Stimme','The Unknown Voice','A Voz Desconhecida']
];
export const DIRECTOR_TRANSLATIONS:readonly (readonly [string,string,string])[]=[
 ...filmTitles,
 ['Du hast bekannte Darsteller verpflichtet.','You hired established actors.','Contrataste atores conhecidos.'],
 ['Du hast ein Nachwuchsensemble engagiert.','You hired a cast of newcomers.','Contrataste um elenco de novos talentos.'],
 ['Du hast jede Szene sorgfältig gedreht.','You filmed every scene carefully.','Filmaste cada cena com cuidado.'],
 ['Du hast den Drehplan gestrafft und Kosten gespart.','You streamlined filming and saved money.','Simplificaste as filmagens e reduziste os custos.']
];
const titleMap=new Map(filmTitles.map(([de,en,pt])=>[de,{en,pt}]));
function localTitle(raw:string,lang:DirectorLanguage):string{
 const match=raw.match(/^(.*?)( \(\d+\))?$/);
 if(!match)return raw;
 const translated=titleMap.get(match[1]??'')?.[lang];
 return translated===undefined?raw:translated+(match[2]??'');
}
function euro(raw:string,lang:DirectorLanguage):string{
 const number=Number(raw.replace(/\./g,'').replace(',','.'));
 if(!Number.isFinite(number))return raw+' €';
 const formatted=new Intl.NumberFormat(lang==='en'?'en-GB':'pt-PT').format(number);
 return lang==='en'?'€'+formatted:formatted+' €';
}
export function translateDirectorDynamic(value:string,lang:DirectorLanguage):string|null{
 const tr=(en:string,pt:string)=>lang==='en'?en:pt;
 const title=localTitle(value,lang);
 if(title!==value)return title;
 let m:RegExpMatchArray|null;
 if((m=value.match(/^Du hast Regie, Schnitt und Dramaturgie geübt\. Regiefähigkeit: (\d+) %\.$/)))
  return tr('You practised directing, editing and storytelling. Directing skill: '+m[1]+'%.','Praticaste realização, montagem e dramaturgia. Competência de realização: '+m[1]+'%.');
 if((m=value.match(/^Du finanzierst (.+) mit ([\d.,]+) € Eigenkapital\.$/)))
  return tr('You finance '+localTitle(m[1]!,lang)+' with '+euro(m[2]!,lang)+' of your own money.','Financias '+localTitle(m[1]!,lang)+' com '+euro(m[2]!,lang)+' de capital próprio.');
 if((m=value.match(/^Du hast die Produktion abgebrochen\. Restbudget: ([\d.,]+) €\.$/)))
  return tr('You cancelled the production. Remaining budget: '+euro(m[1]!,lang)+'.','Cancelaste a produção. Orçamento restante: '+euro(m[1]!,lang)+'.');
 if((m=value.match(/^Die verzögerte Filmproduktion kostet weitere ([\d.,]+) €\.$/)))
  return tr('The delayed film production costs another '+euro(m[1]!,lang)+'.','O atraso na produção do filme custa mais '+euro(m[1]!,lang)+'.');
 if((m=value.match(/^Das Filmprojekt wurde nach drei Jahren eingestellt\. Restbudget: ([\d.,]+) €\.$/)))
  return tr('The film project was cancelled after three years. Remaining budget: '+euro(m[1]!,lang)+'.','O projeto cinematográfico foi cancelado após três anos. Orçamento restante: '+euro(m[1]!,lang)+'.');
 if((m=value.match(/^Premiere von (.+): Kritik (\d+) %, Kinokasse ([\d.,]+) €, Rückfluss ([\d.,]+) €\.( Ein Filmpreis!)?$/)))
  return tr('Premiere of '+localTitle(m[1]!,lang)+': rating '+m[2]+'%, box office '+euro(m[3]!,lang)+', proceeds '+euro(m[4]!,lang)+'.'+(m[5]?' A film award!':''),
   'Estreia de '+localTitle(m[1]!,lang)+': avaliação '+m[2]+'%, bilheteira '+euro(m[3]!,lang)+', receitas '+euro(m[4]!,lang)+'.'+(m[5]?' Um prémio de cinema!':''));
 return null;
}
