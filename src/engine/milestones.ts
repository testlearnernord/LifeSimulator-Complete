import type {Person,SaveGame,AchievementId,RibbonId} from './types.js';

// Independent milestone rules and wording. Only the existence of achievements and
// end-of-life ribbons is documented by the reference game's official help centre.
export type MilestoneLanguage='de'|'en'|'pt';
type Localized=Record<MilestoneLanguage,string>;
const l=(de:string,en:string,pt:string):Localized=>({de,en,pt});
const pct=(value:number,goal:number)=>Math.max(0,Math.min(100,Math.round(value/goal*100)));
type Achievement={id:AchievementId;icon:string;title:Localized;description:Localized;progress:(p:Person)=>number};
export const ACHIEVEMENTS:readonly Achievement[]=[
 {id:'adult',icon:'🌱',title:l('Erwachsen geworden','Coming of age','Maioridade'),description:l('Erreiche das 18. Lebensjahr.','Reach age 18.','Chega aos 18 anos.'),progress:p=>pct(p.age,18)},
 {id:'senior',icon:'🌳',title:l('Ein langes Kapitel','A long chapter','Um longo capítulo'),description:l('Erreiche das 65. Lebensjahr.','Reach age 65.','Chega aos 65 anos.'),progress:p=>pct(p.age,65)},
 {id:'eighty',icon:'🎂',title:l('Acht Jahrzehnte','Eight decades','Oito décadas'),description:l('Erreiche das 80. Lebensjahr.','Reach age 80.','Chega aos 80 anos.'),progress:p=>pct(p.age,80)},
 {id:'century',icon:'🏛️',title:l('Jahrhundertleben','Century life','Vida centenária'),description:l('Erreiche das 100. Lebensjahr.','Reach age 100.','Chega aos 100 anos.'),progress:p=>pct(p.age,100)},
 {id:'graduate',icon:'🎓',title:l('Abschluss geschafft','Graduate','Diplomado'),description:l('Schließe ein Studium ab.','Complete a university degree.','Conclui um curso superior.'),progress:p=>p.degree||(p.degrees?.length||0)>0?100:0},
 {id:'parent',icon:'🍼',title:l('Familienzuwachs','Growing family','Família a crescer'),description:l('Bekomme oder adoptiere ein Kind.','Have or adopt a child.','Tem ou adota uma criança.'),progress:p=>p.relationships.some(r=>r.kind==='Kind')?100:0},
 {id:'married',icon:'💍',title:l('Gemeinsamer Weg','A shared path','Um caminho a dois'),description:l('Heirate deinen Partner.','Marry your partner.','Casa com o teu parceiro.'),progress:p=>p.marriedPartnerId?100:0},
 {id:'home',icon:'🏡',title:l('Eigene vier Wände','A place of your own','Casa própria'),description:l('Kaufe eine Immobilie.','Buy a property.','Compra um imóvel.'),progress:p=>p.assets.some(a=>a.kind==='Haus')?100:0},
 {id:'comfortable',icon:'💶',title:l('Solides Polster','Comfortable savings','Poupanças sólidas'),description:l('Besitze 100.000 € Bargeld.','Hold €100,000 in cash.','Tem 100.000 € em dinheiro.'),progress:p=>pct(Math.max(0,p.cash),100000)},
 {id:'millionaire',icon:'💎',title:l('Million auf dem Konto','Seven figures','Sete dígitos'),description:l('Besitze 1.000.000 € Bargeld.','Hold €1,000,000 in cash.','Tem 1.000.000 € em dinheiro.'),progress:p=>pct(Math.max(0,p.cash),1000000)},
 {id:'collector',icon:'🔦',title:l('Sammlerseele','Collector spirit','Espírito colecionador'),description:l('Sammle drei Erbstücke.','Collect three heirlooms.','Coleciona três relíquias.'),progress:p=>pct(p.heirlooms?.length||0,3)},
 {id:'creator',icon:'🎬',title:l('Werk veröffentlicht','Work released','Obra publicada'),description:l('Veröffentliche einen Film oder eine Musikaufnahme.','Release a film or a music recording.','Publica um filme ou uma gravação musical.'),progress:p=>(p.directorCareer?.films.length||0)+(p.musicCareer?.releases.length||0)>0?100:0},
 {id:'champion',icon:'🥇',title:l('Auf dem Siegerpodest','On the podium','No pódio'),description:l('Gewinne einen Profi- oder Kampfsporttitel.','Win a professional sports or fighting title.','Ganha um título desportivo ou de combate.'),progress:p=>(p.sportCareer?.titles||0)+(p.fighterCareer?.titles||0)>0?100:0},
 {id:'elected',icon:'🗳️',title:l('Wahl gewonnen','Elected','Eleito'),description:l('Gewinne eine politische Wahl.','Win a political election.','Ganha uma eleição política.'),progress:p=>(p.politicalCareer?.wins||0)>0?100:0},
 {id:'second-life',icon:'🌿',title:l('Familiengeschichte','Family legacy','Legado familiar'),description:l('Spiele die zweite Generation.','Play a second generation.','Joga uma segunda geração.'),progress:p=>pct(p.generation,2)},
 {id:'screen',icon:'🎭',title:l('Auf der Leinwand','On the screen','No ecrã'),description:l('Übernimm eine Film- oder Serienrolle.','Get a film or TV credit.','Participa num filme ou numa série.'),progress:p=>(p.actorCareer?.credits.length||0)>0?100:0}
];
export const RIBBONS:readonly {id:RibbonId;icon:string;title:Localized;description:Localized}[]=[
 {id:'champion',icon:'🏆',title:l('Unbesiegbar','Champion','Campeão'),description:l('Ein Leben im Zeichen sportlicher Siege.','A life shaped by sporting victories.','Uma vida marcada por vitórias desportivas.')},
 {id:'leader',icon:'🏛️',title:l('Gestalter','Leader','Líder'),description:l('Mit Wahlen Einfluss genommen.','Made an impact through elections.','Deixou a sua marca através de eleições.')},
 {id:'artist',icon:'🎨',title:l('Kreativer Kopf','Creative mind','Mente criativa'),description:l('Kunst oder Unterhaltung geprägt.','Made a mark in art or entertainment.','Marcou a arte ou o entretenimento.')},
 {id:'magnate',icon:'💰',title:l('Vermögend','Wealthy','Abastado'),description:l('Ein beachtliches Vermögen aufgebaut.','Built considerable wealth.','Construiu uma fortuna considerável.')},
 {id:'outlaw',icon:'🕶️',title:l('Grenzgänger','Outlaw','Fora da lei'),description:l('Das Gesetz nicht immer ernst genommen.','Did not always follow the law.','Nem sempre respeitou a lei.')},
 {id:'scholar',icon:'📚',title:l('Wissensdurst','Scholar','Estudioso'),description:l('Bildung zum Lebensweg gemacht.','Made education a life pursuit.','Fez da educação um projeto de vida.')},
 {id:'family',icon:'💕',title:l('Familienmensch','Family soul','Pessoa de família'),description:l('Eine Familie hinterlassen.','Left a family behind.','Deixou uma família.')},
 {id:'longlife',icon:'🌲',title:l('Ausdauer','Endurance','Longevidade'),description:l('Ein außergewöhnlich langes Leben.','Lived an exceptionally long life.','Viveu uma vida excecionalmente longa.')},
 {id:'ordinary',icon:'🪁',title:l('Eigenes Tempo','Own pace','Ao seu ritmo'),description:l('Ein ganz persönlicher Lebensweg.','A life lived in your own way.','Uma vida vivida à sua maneira.')}
];
export function achievementProgress(p:Person,id:AchievementId):number{
 return ACHIEVEMENTS.find(a=>a.id===id)?.progress(p)??0;
}
export function awardAchievements(s:SaveGame):void{
 const earned=new Set(s.achievements||[]);
 for(const a of ACHIEVEMENTS)if(a.progress(s.person)>=100)earned.add(a.id);
 s.achievements=ACHIEVEMENTS.filter(a=>earned.has(a.id)).map(a=>a.id);
}
export function chooseRibbon(p:Person):RibbonId{
 if((p.fighterCareer?.titles||0)+(p.sportCareer?.titles||0)>0)return 'champion';
 if((p.politicalCareer?.wins||0)>0)return 'leader';
 if((p.directorCareer?.films.length||0)+(p.actorCareer?.credits.length||0)+(p.musicCareer?.releases.length||0)>0)return 'artist';
 if(p.cash>=1000000)return 'magnate';
 if(p.record||(p.crimeCareer?.successes||0)>=5)return 'outlaw';
 if(p.degree||(p.degrees?.length||0)>0)return 'scholar';
 if(p.relationships.some(r=>r.kind==='Kind'))return 'family';
 if(p.age>=90)return 'longlife';
 return 'ordinary';
}
export function recordRibbon(s:SaveGame):void{
 const p=s.person;
 if(p.alive||(s.ribbons||[]).some(r=>r.generation===p.generation))return;
 s.ribbons??=[];
 s.ribbons.push({kind:chooseRibbon(p),generation:p.generation,name:p.name,age:p.age});
 if(s.ribbons.length>1000)s.ribbons.shift();
}
export function validMilestones(s:SaveGame):boolean{
 const ids=new Set(ACHIEVEMENTS.map(a=>a.id));
 const kinds=new Set(RIBBONS.map(r=>r.id));
 if(s.achievements!==undefined){
  if(!Array.isArray(s.achievements)||s.achievements.length>ACHIEVEMENTS.length||new Set(s.achievements).size!==s.achievements.length||!s.achievements.every(id=>typeof id==='string'&&ids.has(id)))return false;
 }
 if(s.ribbons!==undefined){
  if(!Array.isArray(s.ribbons)||s.ribbons.length>1000)return false;
  const generations=new Set<number>();
  for(const ribbon of s.ribbons){
   if(!ribbon||typeof ribbon!=='object'||!kinds.has(ribbon.kind)||typeof ribbon.name!=='string'||ribbon.name.length>100||!Number.isInteger(ribbon.age)||ribbon.age<0||ribbon.age>200||!Number.isInteger(ribbon.generation)||ribbon.generation<1||ribbon.generation>1000||generations.has(ribbon.generation))return false;
   generations.add(ribbon.generation);
  }
 }
 return true;
}
