import type {Person,SaveGame} from './types.js';
import type {ExpansionHooks} from './expansions.js';

// Cross-system decisions: original fictional life events with lasting, visible effects.
// All behavior is derived from the current life. No new mandatory save fields.
const clamp=(n:number)=>Math.max(0,Math.min(100,Math.round(n)));
export type LifeSignal={icon:string;title:string;detail:string;tone:'warning'|'positive'|'neutral'};
const closeRelative=(p:Person)=>p.relationships
 .filter(r=>r.alive&&!r.estranged&&r.bond>=65&&(r.trust??r.bond)>=55)
 .sort((a,b)=>b.bond-a.bond)[0];
export function lifeSignals(p:Person):LifeSignal[]{
 const signals:LifeSignal[]=[];
 if(!p.alive)return [{icon:'🕊️',title:'Lebensgeschichte abgeschlossen',detail:'Deine Entscheidungen bleiben in der Familienchronik.',tone:'neutral'}];
 if(p.prisonYears>0)signals.push({icon:'🔒',title:'Haftzeit',detail:p.prisonYears+' Jahre Resthaft · Kontakte und Weiterbildung sind weiterhin möglich.',tone:'warning'});
 else if((p.crimeCareer?.probationYears??0)>0)signals.push({icon:'🌱',title:'Neustart nach der Haft',detail:p.crimeCareer!.probationYears+' Jahre Bewährung · ein stabiles Umfeld kann helfen.',tone:'neutral'});
 if(p.illness)signals.push({icon:'🩺',title:'Gesundheit braucht Aufmerksamkeit',detail:(p.illness.diagnosed?p.illness.kind:'Nicht untersuchte Beschwerden')+' · Stärke '+p.illness.severity+' %.',tone:'warning'});
 else if(p.stats.health<=30)signals.push({icon:'❤️',title:'Gesundheit kritisch',detail:'Erholung und medizinische Betreuung können helfen.',tone:'warning'});
 if(p.cash < -8000)signals.push({icon:'💸',title:'Finanzielle Belastung',detail:'Deine Schulden können Stimmung und Lebensentscheidungen beeinflussen.',tone:'warning'});
 if(p.age>=6&&p.age<18&&(p.schoolRecord?.performance??p.grades??50)<40)signals.push({icon:'📚',title:'Abschluss in Gefahr',detail:'Die Schulnoten sind niedrig. Unterstützung und Lernzeit können etwas verändern.',tone:'warning'});
 if(p.jobId&&p.workplace&&(p.careerPerformance??50)<35)signals.push({icon:'💼',title:'Probleme am Arbeitsplatz',detail:'Schwache Leistungen können zu Abmahnungen und Jobverlust führen.',tone:'warning'});
 if((p.crimeCareer?.heat??0)>=55)signals.push({icon:'👁️',title:'Erhöhte Aufmerksamkeit',detail:'Deine kriminelle Vorgeschichte wirkt sich auf dein Umfeld aus.',tone:'warning'});
 const support=closeRelative(p);
 if(support)signals.push({icon:'🤝',title:'Verlässlicher Rückhalt',detail:support.name+' steht dir nah. Die Beziehung kann dir in Krisen helfen.',tone:'positive'});
 if(p.jobId&&p.workplace&&(p.careerPerformance??50)>=70)signals.push({icon:'🏅',title:'Berufliche Perspektive',detail:'Deine Leistung ist gut. Beförderung und Anerkennung sind möglich.',tone:'positive'});
 return signals.slice(0,3).length?signals.slice(0,3):[{icon:'🌤️',title:'Stabiler Lebensabschnitt',detail:'Derzeit gibt es keine akute Krise. Deine nächsten Entscheidungen prägen den weiteren Weg.',tone:'neutral'}];
}
export function advanceConnections(s:SaveGame,h:ExpansionHooks){
 const p=s.person;
 // Trusted friends and family buffer difficult years, but never erase the hardship.
 if(p.age>=8&&p.stats.happiness<40&&p.prisonYears===0){
  const supporter=closeRelative(p);
  if(supporter){
   h.stat('happiness',4);
   h.log(supporter.name+' hat dich in einer schwierigen Phase unterstützt.','good');
  }
 }
 // Parents investing time has a small, measurable influence on school.
 if(p.age>=6&&p.age<18&&p.schoolRecord){
  const supportive=p.relationships.some(r=>r.alive&&!r.estranged&&['Mutter','Vater','Elternteil'].includes(r.kind)&&r.bond>=75&&(r.trust??r.bond)>=60);
  if(supportive&&h.random()<.32){
   p.schoolRecord.performance=clamp(p.schoolRecord.performance+2);
   p.grades=p.schoolRecord.performance;
   h.log('Die Unterstützung zu Hause hat dir beim Lernen geholfen.','good');
  }
 }
 // A highly visible criminal history can interfere with a legitimate job.
 if(p.prisonYears===0&&p.jobId&&p.workplace&&(p.crimeCareer?.heat??0)>=65&&h.random()<.18){
  p.workplace.boss.bond=clamp(p.workplace.boss.bond-9);
  p.careerPerformance=clamp((p.careerPerformance??50)-7);
  h.log('Gerüchte über deine kriminellen Kontakte belasten das Verhältnis zur Führungskraft.','bad');
 }
 // Sustained work and emotional stress can have a later medical consequence.
 if(p.prisonYears===0&&p.jobId&&p.stats.happiness<28&&(p.careerPerformance??50)<35&&!p.illness&&h.random()<.2){
  p.illness={kind:'Erschöpfung',severity:30,years:0,diagnosed:false};
  h.stat('health',-4);
  h.log('Die Belastung aus Beruf und Privatleben führt zu Erschöpfung.','bad');
 }
}
const setEvent=(p:Person,h:ExpansionHooks,heading:string,detail:string,options:{label:string;kind:string}[])=>{
 p.pending={id:'cross-'+p.age+'-'+Math.floor(h.random()*1e9).toString(36),heading,detail,options};
};
export function connectionEvent(s:SaveGame,h:ExpansionHooks,releasedThisYear=false):boolean{
 const p=s.person;
 if(releasedThisYear){
  const options=[{label:'Beim Neustart Unterstützung suchen',kind:'cross:release-support'},{label:'Eigenständig neu anfangen',kind:'cross:release-independence'}];
  if(p.crimeCareer?.network.some(r=>r.active))options.push({label:'Alte Kontakte wiedersehen',kind:'cross:release-network'});
  setEvent(p,h,'Freiheit und Neuanfang','Du bist aus der Haft entlassen. Welche Richtung möchtest du deinem Leben jetzt geben?',options);
  return true;
 }
 if(p.prisonYears>0){
  const supporter=p.relationships.some(r=>r.alive&&!r.estranged&&r.bond>=35);
  if(supporter&&h.random()<.2){
   setEvent(p,h,'Nachricht von draußen','Jemand aus deiner Familie hat dir geschrieben und fragt, wie es dir geht.',[
    {label:'Ehrlich antworten',kind:'cross:prison-answer'},
    {label:'Brief unbeantwortet lassen',kind:'cross:prison-ignore'}
   ]);
   return true;
  }
  return false;
 }
 if(p.age>=12&&p.age<18&&p.schoolRecord&&p.schoolRecord.performance<38&&h.random()<.34){
  setEvent(p,h,'Schulische Entscheidung','Deine Leistungen sind schlechter geworden. Eine Lehrkraft schlägt vor, dass du gezielt daran arbeitest.',[
   {label:'Lernplan vereinbaren',kind:'cross:school-plan'},
   {label:'Eltern um Hilfe bitten',kind:'cross:school-family'},
   {label:'Das Problem ignorieren',kind:'cross:school-ignore'}
  ]);
  return true;
 }
 if(p.age>=18&&p.jobId&&p.workplace&&((p.careerPerformance??50)<38||p.workplace.boss.bond<38)&&h.random()<.35){
  setEvent(p,h,'Schwieriges Gespräch im Büro','Deine Führungskraft ist mit deiner Arbeit oder der Zusammenarbeit unzufrieden.',[
   {label:'Offen über Verbesserungen sprechen',kind:'cross:work-honest'},
   {label:'Mehr Arbeit übernehmen',kind:'cross:work-overtime'},
   {label:'Den Konflikt eskalieren lassen',kind:'cross:work-conflict'}
  ]);
  return true;
 }
 const partner=p.relationships.find(r=>r.kind==='Partner'&&r.alive&&!r.estranged&&r.bond<40);
 if(partner&&h.random()<.35){
  setEvent(p,h,'Beziehung an einem Wendepunkt',partner.name+' fühlt sich in letzter Zeit vernachlässigt. Wie gehst du damit um?',[
   {label:'Einen gemeinsamen Tag organisieren',kind:'cross:partner-time'},
   {label:'Ein ehrliches Gespräch führen',kind:'cross:partner-talk'},
   {label:'Abstand halten',kind:'cross:partner-ignore'}
  ]);
  return true;
 }
 if(p.age>=18&&p.crimeCareer&&p.crimeCareer.rank>0&&p.jobId&&p.crimeCareer.network.some(r=>r.active)&&h.random()<.22){
  setEvent(p,h,'Zwei Welten','Ein Kontakt aus der Unterwelt verlangt deine Aufmerksamkeit. Gleichzeitig musst du bei der Arbeit zuverlässig sein.',[
   {label:'Den Kontakt höflich auf Abstand halten',kind:'cross:crime-distance'},
   {label:'Den Bekannten unterstützen',kind:'cross:crime-favor'}
  ]);
  return true;
 }
 return false;
}
export function resolveConnectionEvent(s:SaveGame,kind:string,h:ExpansionHooks){
 const p=s.person;
 const support=closeRelative(p);
 const partner=p.relationships.find(r=>r.kind==='Partner'&&r.alive&&!r.estranged);
 switch(kind){
  case 'cross:release-support':
   h.stat('happiness',9);p.reputation=clamp((p.reputation??50)+6);
   if(support){support.bond=clamp(support.bond+7);support.trust=clamp((support.trust??support.bond)+4);support.lastContactAge=p.age;}
   h.log('Du hast dir Hilfe für einen geordneten Neuanfang gesucht. Dein Umfeld fasst langsam wieder Vertrauen.','good');break;
  case 'cross:release-independence':
   h.stat('smarts',3);h.stat('happiness',2);
   if(p.crimeCareer)p.crimeCareer.heat=clamp(p.crimeCareer.heat-8);
   h.log('Du organisierst dein Leben eigenständig und vermeidest vorerst riskante Bekanntschaften.','good');break;
  case 'cross:release-network':
   if(!p.crimeCareer?.network.some(r=>r.active))throw Error('Keine alten Kontakte verfügbar.');
   p.crimeCareer.heat=clamp(p.crimeCareer.heat+13);
   p.crimeCareer.respect=clamp(p.crimeCareer.respect+7);
   h.stat('happiness',3);
   h.log('Du triffst alte Bekannte wieder. Sie bieten Chancen, aber auch erneute Risiken.');break;
  case 'cross:prison-answer':{
   const r=p.relationships.filter(r=>r.alive&&!r.estranged).sort((a,b)=>b.bond-a.bond)[0];
   if(r){r.bond=clamp(r.bond+10);r.trust=clamp((r.trust??r.bond)+5);r.lastContactAge=p.age;}
   h.stat('happiness',5);h.log('Du hast den Kontakt zu deiner Familie trotz der Haft aufrechterhalten.','good');break;
  }
  case 'cross:prison-ignore':h.stat('happiness',-3);h.log('Du hast den Brief unbeantwortet gelassen.','bad');break;
  case 'cross:school-plan':
   if(!p.schoolRecord)throw Error('Keine Schulakte vorhanden.');
   p.schoolRecord.performance=clamp(p.schoolRecord.performance+9);p.schoolRecord.discipline=clamp(p.schoolRecord.discipline+6);p.grades=p.schoolRecord.performance;
   h.stat('happiness',-2);h.log('Der Lernplan kostet Mühe, verbessert aber deine schulischen Leistungen.','good');break;
  case 'cross:school-family':
   if(!p.schoolRecord)throw Error('Keine Schulakte vorhanden.');
   p.schoolRecord.performance=clamp(p.schoolRecord.performance+5);p.grades=p.schoolRecord.performance;
   h.stat('happiness',5);
   for(const r of p.relationships.filter(r=>r.alive&&['Mutter','Vater','Elternteil'].includes(r.kind))){r.bond=clamp(r.bond+3);r.lastContactAge=p.age;}
   h.log('Du hast dir Hilfe beim Lernen organisiert und fühlst dich weniger allein.','good');break;
  case 'cross:school-ignore':
   if(!p.schoolRecord)throw Error('Keine Schulakte vorhanden.');
   p.schoolRecord.performance=clamp(p.schoolRecord.performance-6);p.grades=p.schoolRecord.performance;
   h.stat('happiness',2);h.log('Du hast das Schulproblem aufgeschoben. Deine Noten leiden darunter.','bad');break;
  case 'cross:work-honest':
   if(!p.workplace)throw Error('Kein Arbeitsplatz vorhanden.');
   p.workplace.boss.bond=clamp(p.workplace.boss.bond+11);
   p.careerPerformance=clamp((p.careerPerformance??50)+9);
   h.stat('happiness',3);h.log('Das ehrliche Gespräch verbessert das Arbeitsklima und deine Leistung.','good');break;
  case 'cross:work-overtime':
   p.careerPerformance=clamp((p.careerPerformance??50)+15);
   h.stat('health',-6);h.stat('happiness',-5);
   h.log('Die Mehrarbeit verbessert deine Ergebnisse, kostet aber Gesundheit und Erholung.');break;
  case 'cross:work-conflict':
   if(!p.workplace)throw Error('Kein Arbeitsplatz vorhanden.');
   p.workplace.boss.bond=clamp(p.workplace.boss.bond-20);
   p.careerPerformance=clamp((p.careerPerformance??50)-8);
   h.stat('happiness',-8);h.log('Der Streit eskaliert und beschädigt deine beruflichen Perspektiven.','bad');break;
  case 'cross:partner-time':
   if(!partner)throw Error('Kein Partner verfügbar.');
   partner.bond=clamp(partner.bond+14);partner.trust=clamp((partner.trust??partner.bond)+6);partner.lastContactAge=p.age;
   h.stat('happiness',7);h.log('Ihr verbringt wertvolle Zeit miteinander und findet ein Stück Nähe zurück.','good');break;
  case 'cross:partner-talk':
   if(!partner)throw Error('Kein Partner verfügbar.');
   partner.bond=clamp(partner.bond+9);partner.trust=clamp((partner.trust??partner.bond)+11);partner.lastContactAge=p.age;
   h.stat('happiness',4);h.log('Euer offenes Gespräch schafft neues Vertrauen.','good');break;
  case 'cross:partner-ignore':
   if(!partner)throw Error('Kein Partner verfügbar.');
   partner.bond=clamp(partner.bond-11);partner.trust=clamp((partner.trust??partner.bond)-7);
   h.stat('happiness',-5);h.log('Das ungelöste Problem vergrößert die Distanz zwischen euch.','bad');break;
  case 'cross:crime-distance':
   if(!p.crimeCareer)throw Error('Keine kriminelle Vergangenheit vorhanden.');
   p.crimeCareer.heat=clamp(p.crimeCareer.heat-12);
   p.crimeCareer.respect=clamp(p.crimeCareer.respect-4);
   p.careerPerformance=clamp((p.careerPerformance??50)+5);
   h.log('Du ziehst eine Grenze und konzentrierst dich auf die Arbeit.','good');break;
  case 'cross:crime-favor':
   if(!p.crimeCareer)throw Error('Keine kriminelle Vergangenheit vorhanden.');
   p.crimeCareer.respect=clamp(p.crimeCareer.respect+8);p.crimeCareer.heat=clamp(p.crimeCareer.heat+14);
   p.careerPerformance=clamp((p.careerPerformance??50)-10);
   h.log('Du hilfst deiner alten Bekanntschaft, gefährdest aber deinen beruflichen Neuanfang.','bad');break;
  default:throw Error('Unbekannte Lebensentscheidung.');
 }
}
