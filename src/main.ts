import {applyAction,careerName,createLife,money,netWorth} from './engine/simulation.js';
import {isMuted,playSound,toggleSound} from './audio.js';
import {CAREERS,COUNTRIES,ITEMS} from './engine/catalog.js';
import {BUSINESS_SECTORS,SOCIAL_PLATFORMS} from './engine/expansions.js';
import {PREMIUM_CATALOG,PREMIUM_GROUPS} from './engine/premium-catalog.js';
import {FINANCIAL_ASSETS,getMarketPrice,portfolioValue} from './engine/investments.js';
import {MUSIC_ROLES,musicSkill,musicActive} from './engine/music.js';
import {ACTING_OFFERS,actingActive,actingOffersFor} from './engine/acting.js';
import {CRIME_TYPES,CRIME_LABELS,CRIME_RANKS,crimeRisk,criminal} from './engine/crime.js';
import {DIRECTOR_GENRES,DIRECTOR_BUDGETS} from './engine/director.js';
import {SPORTS,SPORT_LEAGUES,sportActive} from './engine/sport.js';
import {FIGHT_STYLES,fighterActive} from './engine/fighter.js';
import {HEIRLOOM_CATALOG,heirloomWorth,todayHeirloomKey} from './engine/heirlooms.js';
import {POLITICAL_PARTIES,POLITICAL_POLICIES,POLITICAL_BUDGETS,POLITICAL_OFFICES,POLITICAL_REQUIREMENTS,politicsActive} from './engine/politics.js';
import {lifeSignals} from './engine/lifeConnections.js';
import type {Action,Gender,Person,SaveGame} from './engine/types.js';
import {deleteGame,exportGame,importGame,listGames,putGame} from './storage/database.js';
import {initialLanguage,isLanguage,LANGUAGE_OPTIONS,LANGUAGE_STORAGE_KEY,translateDOM} from './i18n.js';

type Tab='life'|'career'|'people'|'assets'|'activities'|'menu';
const root=document.querySelector<HTMLDivElement>('#app')!;
let language=initialLanguage();
let current:SaveGame|null=null;let games:SaveGame[]=[];let tab:Tab='life';let modal:'new'|'edit'|'saves'|'delete'|'baby'|'diploma'|'profile'|null=null;let deleteTarget:string|null=null;let toastMessage='';let toastPositive=false;let updateReady=false;let activitySection:string|null=null;let assetsSection:string|null=null;let relationFocus:string|null=null;let historyExpanded=false;let premiumOpen=false;
const html=(str:unknown):string=>String(str).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]!));
const opt=(items:string[],selected:string)=>items.map(i=>`<option value="${html(i)}" ${i===selected?'selected':''}>${html(i)}</option>`).join('');
const button=(text:string,action:string,id='',extra='secondary',disabled=false)=>`<button class="button ${extra}" data-action="${html(action)}" data-id="${html(id)}" ${disabled?'disabled':''}>${text}</button>`;
const card=(icon:string,title:string,subtitle:string,action?:string,id?:string,label='Öffnen',disabled=false)=>`<article class="tile"><div class="emoji">${icon}</div><div class="tile-main"><div class="tile-title">${title}</div><div class="tile-desc">${subtitle}</div></div>${action?button(label,action,id,'smallbtn',disabled):''}</article>`;
const menuRow=(symbol:string,title:string,description:string,action:string,id='',disabled=false)=>`<button class="list-entry menu-entry" data-action="${html(action)}" data-id="${html(id)}" ${disabled?'disabled':''}><span class="list-emoji">${symbol}</span><span class="list-text"><b>${html(title)}</b><small>${html(description)}</small></span><span class="chevron">${disabled?'':'›'}</span></button>`;
const heading=(text:string,right='')=>`<div class="section-head"><span>${text}</span><span class="small">${right}</span></div>`;
const formatAge=(age:number)=>`${age} ${age===1?'Jahr':'Jahre'}`;
const badges=(p:Person)=>`<div class="row"><span class="pill">Generation ${p.generation}</span><span class="pill">${html(p.country)}</span>${p.prisonYears>0?'<span class="pill">In Haft</span>':''}${!p.alive?'<span class="pill">Verstorben</span>':''}</div>`;
function lifeStage(p:Person){if(!p.alive)return 'Verstorben';if(p.prisonYears>0)return 'In Haft';if(p.age<3)return 'Kleinkind';if(p.age<13)return 'Kind';if(p.age<18)return 'Jugendliche/r';if(fighterActive(p))return 'Kampfsportprofi';if(actingActive(p))return 'Schauspieler/in';if(musicActive(p))return 'Musiker/in';if(p.jobId)return careerName(p);if(p.universityYears>0)return 'Student/in';if(p.age>=65)return 'Senior/in';return 'Erwachsen';}
function avatar(p:Person){if(!p.alive)return '🕊️';if(p.age<4)return '👶';if(p.age<13)return p.gender==='weiblich'?'👧':'👦';if(p.age>=65)return p.gender==='weiblich'?'👵':'👴';return p.gender==='weiblich'?'👩':p.gender==='männlich'?'👨':'🧑';}
function renderProfile(p:Person){return `<section class="profilebar"><button class="profile-person" data-action="open" data-id="profile" aria-label="Charakterprofil öffnen"><span class="avatar">${avatar(p)}</span><span class="profile-name-wrap"><span class="profile-name">${html(p.name)} <span class="profile-info">i</span></span><span class="profile-detail">🌐 ${html(p.birthCity||p.country)} · ${html(lifeStage(p))}</span></span></button><div class="profile-balance"><strong>${money(p.cash)}</strong><span>Kontostand</span></div></section>`;}
function renderStats(p:Person){const names:{key:keyof Person['stats'];label:string;icon:string}[]=[{key:'happiness',label:'Glück',icon:'😊'},{key:'health',label:'Gesundheit',icon:'❤️'},{key:'smarts',label:'Intelligenz',icon:'💡'},{key:'looks',label:'Aussehen',icon:'✨'}];return `<section class="metrics" aria-label="Charakterwerte">${names.map(n=>`<div class="metric stat-${n.key}"><span class="stat-icon" aria-hidden="true">${n.icon}</span><span class="stat-label">${n.label}</span><div class="meter" role="progressbar" aria-label="${n.label}" aria-valuenow="${p.stats[n.key]}" aria-valuemin="0" aria-valuemax="100"><div style="width:${p.stats[n.key]}%"></div></div><span class="stat-value">${p.stats[n.key]}%</span></div>`).join('')}</section>`;}
function renderTimeline(p:Person){
 const chronological=p.history.slice().reverse();
 const groups:{age:number;lines:typeof chronological}[]=[];
 for(const entry of chronological){let group=groups.at(-1);if(!group||group.age!==entry.age){group={age:entry.age,lines:[]};groups.push(group);}group.lines.push(entry);}
 const visible=historyExpanded?groups:groups.slice(-5);
 const hidden=groups.length-visible.length;
 return `<div class='history' aria-label='Lebenschronik'>
 ${hidden>0?`<button class='timeline-toggle' data-action='history'>▾ Ältere Lebensjahre anzeigen (${hidden})</button>`:''}
 ${visible.map(g=>{const shown=historyExpanded?g.lines:g.lines.slice(-12);return `<section class='year-group'><h2>Alter: ${g.age} ${g.age===1?'Jahr':'Jahre'}</h2>${g.lines.length>shown.length?`<details class='past-events'><summary>${g.lines.length-shown.length} weitere Ereignisse</summary>${g.lines.slice(0,-12).map(e=>`<p class='timeline-line ${e.tone}'>${html(e.text)}</p>`).join('')}</details>`:''}${shown.map(e=>`<p class='timeline-line ${e.tone}'>${html(e.text)}</p>`).join('')}</section>`;}).join('')}
 ${historyExpanded&&groups.length>5?`<button class='timeline-toggle' data-action='history'>▴ Ältere Lebensjahre ausblenden</button>`:''}</div>`;
}
function renderLife(s:SaveGame){const p=s.person;const signals=lifeSignals(p);const warnings=signals.filter(x=>x.tone==='warning').length;return `<section class="life-feed"><div class="feed-label"><span>📖 Dein Lebenslauf</span><span>${p.generation}. Generation</span></div><details class="life-overview" aria-label="Aktuelle Lebenslage"><summary><span>🧭 Lebenslage</span><span class="life-overview-count">${warnings?`${warnings} Hinweis${warnings===1?'':'e'}`:'Aktuelles ansehen'} ▾</span></summary><div class="life-overview-items">${signals.map(x=>`<div class="life-overview-item signal-${x.tone}"><span aria-hidden="true">${x.icon}</span><div><b>${html(x.title)}</b><small>${html(x.detail)}</small></div></div>`).join('')}</div></details>${renderTimeline(p)}
 ${!p.alive?`<div class="end-of-life"><span class="end-symbol">🕊️</span><h2>Ein Leben geht zu Ende</h2><p>${html(p.causeOfDeath||'Deine Geschichte ist abgeschlossen.')}</p>${p.relationships.some(r=>r.kind==='Kind'&&r.alive)?'<p>Wähle ein Kind und führe die Familiengeschichte fort.</p>':'<p>Beginne eine neue Geschichte über das Menü.</p>'}</div>`:''}
 ${!p.alive&&p.relationships.some(r=>r.kind==='Kind'&&r.alive)?`${heading('Nächste Generation')}<div class="stack">${p.relationships.filter(r=>r.kind==='Kind'&&r.alive).map(r=>card('👶',html(r.name),`${r.age} Jahre alt`,'generation',r.id,'Spielen')).join('')}</div>`:''}</section>`;}
function renderBusiness(p:Person){
 const b=p.business;
 if(!b)return `${heading('Eigenes Unternehmen')}<div class='well'>Gründe ein Unternehmen, entwickle Produkte, betreibe Marketing und beschäftige Mitarbeiter. Das Unternehmenskapital wird separat geführt.</div><div class='stack'>${BUSINESS_SECTORS.map(s=>card('🏢',s.name,money(s.start)+' Gründungskapital','business','open|'+s.id,'Gründen',p.age<18||p.cash<s.start||p.prisonYears>0)).join('')}</div>`;
 return `${heading('Dein Unternehmen')}<div class='info-card'><h2>🏢 ${html(b.name)}</h2><p>Firmenkasse: <b>${money(b.cash)}</b></p><p class='small'>${b.staff} Beschäftigte · Produktqualität ${b.quality}% · Bekanntheit ${b.brand}% · ${b.age} Geschäftsjahre</p><div class='performance-meter'><div style='width:${b.quality}%'></div></div></div>
 <div class='stack'>
 ${card('🔬','Produkte verbessern','4.500 € Firmenkapital','business','develop','Entwickeln',b.cash<4500||p.prisonYears>0)}
 ${card('📣','Marketing','3.000 € Firmenkapital','business','market','Werben',b.cash<3000||p.prisonYears>0)}
 ${card('👩‍💼','Mitarbeiter einstellen','1.500 € Rekrutierungskosten','business','hire','Einstellen',b.cash<1500||p.prisonYears>0)}
 ${card('📉','Stellen abbauen','Eine Stelle streichen','business','fire','Abbauen',b.staff<=1||p.prisonYears>0)}
 ${card('💵','Kapital nachschießen','10.000 € Privatgeld in die Firmenkasse','business','invest','Investieren',p.cash<10000||p.prisonYears>0)}
 ${card('💰','Gewinn entnehmen','10.000 € aus der Firmenkasse, netto 7.500 €','business','withdraw','Entnehmen',b.cash<10000||p.prisonYears>0)}
 ${card('🏦','Unternehmen verkaufen','Verkauf zum Schätzwert','business','sell','Verkaufen',p.prisonYears>0)}
 </div>`;
}
function renderSchoolPanel(p:Person){
 if(p.age<6||p.age>=18)return '';
 const r=p.schoolRecord;
 const active=p.prisonYears===0;
 return `${heading('Schulalltag')}
 <div class='academic-card'>
 <div class='school-score'><span>📘</span><div><b>Dein Zeugnis</b><small>${html(p.school)} · ${p.age} Jahre</small></div><strong>${r?.performance??p.grades??50}%</strong></div>
 <div class='school-metrics'>
 ${[['Leistungen',r?.performance??p.grades??50],['Anwesenheit',r?.attendance??90],['Disziplin',r?.discipline??85]].map(([title,value])=>`<div><span>${title}</span><meter min='0' max='100' value='${value}'></meter><b>${value}%</b></div>`).join('')}
 </div><p class='small'>AG: ${r?.club&&r.club!=='kein'?html(r.club):'Keine'} · Schulische Leistungen beeinflussen deinen Abschluss und mögliche Stipendien.</p>
 <div class='row school-actions'>
 ${button('Lernen','education','study','smallbtn',!active)}
 ${button('Nachhilfe (150 €)','education','tutor','smallbtn',!active||p.cash<150)}
 ${button('Lehrergespräch','education','teacher','smallbtn',!active)}
 </div></div>
 ${heading('Schulaktivitäten')}<div class='stack'>
 ${menuRow('🤝','Mit Mitschülern treffen','Soziale Kontakte und Glück verbessern','education','socialize',!active)}
 ${menuRow('🎨','Arbeitsgemeinschaft beitreten','Sport, Musik, Technik und Kunst','category','school-clubs',!active)}
 ${menuRow('🎒','Unterricht schwänzen','Mehr Freizeit, aber schlechtere Noten und Disziplin','education','skip',!active)}
 </div>`;
}
function renderMusic(p:Person){
 const c=p.musicCareer,jailed=p.prisonYears>0,active=musicActive(p);
 const skills=MUSIC_ROLES.map(role=>`<div class="music-skill"><div><b>${html(role)}</b><strong>${musicSkill(p,role)}%</strong></div><div class="meter"><div style="width:${musicSkill(p,role)}%"></div></div>${button('Üben','music','practice|'+role,'smallbtn',jailed||p.age<8||(p.age>=18&&p.cash<120))}</div>`).join('');
 const audition=MUSIC_ROLES.map(role=>`<div class="music-audition"><b>${html(role)} · ${musicSkill(p,role)}%</b><div class="row">${button('Solo-Vorspiel','music','audition|Solo|'+role,'smallbtn',jailed||p.age<18||musicSkill(p,role)<45)}${button('Band-Vorspiel','music','audition|Band|'+role,'smallbtn',jailed||p.age<18||musicSkill(p,role)<45)}</div></div>`).join('');
 const releases=(c?.releases||[]).slice().reverse().map(r=>`<div class="music-release"><b>${html(r.title)}</b><small>${r.kind} · Alter ${r.year} · ${r.units.toLocaleString('de-DE')} Verkäufe · Qualität ${r.quality}%</small></div>`).join('');
 return `${heading('Musikerkarriere',c?c.mode+' · '+c.popularity+'% Popularität':'Üben und Vorspielen')}
 <div class="info-card"><b>🎤 Musikfähigkeiten</b><p class="small">Unterricht ab 8 Jahren, für Minderjährige kostenlos und danach 120 €. Musiktalent steigert den Lernfortschritt.</p>${skills}</div>
 ${c?`<div class="info-card"><b>${html(c.mode)} · ${html(c.genre)}</b><p>Plattenfirma: ${html(c.label)} · Tantiemen: ${c.royalty}% · Laufzeit: ${c.contractYears} Jahre</p><p>Popularität ${c.popularity}%</p><div class="meter"><div style="width:${c.popularity}%"></div></div></div>`:''}
 ${active?`${heading('Musik veröffentlichen und auftreten')}<div class="stack">
 ${menuRow('🎵','Single veröffentlichen','600 € · einmal jährlich','music','single',jailed||p.cash<600)}
 ${menuRow('💿','Album aufnehmen','2.500 € · einmal jährlich','music','album',jailed||p.cash<2500)}
 ${menuRow('🎙️','Konzert geben','Einzelauftritt mit Honorar','music','concert',jailed||p.cash<350)}
 ${menuRow('🌍','Tournee spielen','8.000 € · ab 35% Popularität','music','tour',jailed||p.cash<8000||(c?.popularity??0)<35)}
 ${menuRow('📣','Werbung schalten','1.200 € · Hörer gewinnen','music','promote',jailed||p.cash<1200)}
 ${menuRow('✍️','Vertrag kündigen','Diskografie und Tantiemen bleiben','music','quit',jailed)}
 </div>`:`${heading('Vorspiele bei Plattenfirmen')}<div class="well">Ab 18 Jahren, mindestens 45% Können. Bis zu drei Versuche jährlich.</div><div class="stack">${audition}</div>`}
 ${releases?`${heading('Diskografie')}<div class="stack">${releases}</div>`:''}`;
}
function renderActor(p:Person){
 const c=p.actorCareer,role=c?.current,restricted=p.prisonYears>0;
 const skill=p.actingSkill??0;
 const active=actingActive(p);
 const offers=actingOffersFor(p);
 return `${heading('Schauspielkarriere',active?'Dreharbeiten laufen':'Casting & Unterricht')}
 <div class="info-card acting-summary"><h3>🎭 Schauspielkunst</h3>
 <p>Fähigkeit: <b>${skill}%</b> · Bekanntheit: ${p.fame??0}% · Branchenruf: ${c?.reputation??10}%</p>
 <div class="meter"><div style="width:${skill}%"></div></div>
 <p class="small">Unterricht ab 8 Jahren, ab 18 für 175 € pro Einheit. Das Spezialtalent Schauspiel beschleunigt das Training.</p>
 ${button('Schauspielunterricht','actor','lesson','button-wide',restricted||p.age<8||(p.age>=18&&p.cash<175))}
 </div>
 ${p.age>=18?`${heading('Talentagentur')}<div class="info-card">
 <p><b>${c?.agent?'Agentur engagiert':'Keine Künstleragentur'}</b> · ${c?.agent?'12% Vermittlungsprovision':'1.500 € Einstiegsgebühr'}</p>
 <div class="row">${c?.agent?`${button('Castingvorschlag','actor','agent-search','smallbtn',restricted||active)}${button('Agent entlassen','actor','fire-agent','smallbtn')}`:`${button('Agent einstellen','actor','hire-agent','smallbtn',restricted||p.cash<1500)}`}</div>
 ${c?.agentLeadId?`<p class="small">Empfohlenes Casting: ${html(ACTING_OFFERS.find(o=>o.id===c.agentLeadId)?.title||'Unbekannt')}</p>`:''}
 </div>`:''}
 ${role?`${heading('Aktuelle Produktion')}<div class="info-card">
 <h3>🎬 ${html(role.title)}</h3><p>${html(role.kind)} · ${html(role.role)} · ${role.yearsLeft} Produktionsjahre übrig</p>
 <p class="small">Honorar: ${money(role.payPerUnit)} ${role.kind==='Serie'?'pro Folge':'einmalig'} · ${role.kind==='Serie'?role.episodes+' Folgen/Jahr':'ein Film'} · Drehbuchqualität ${role.quality}%</p>
 <div class="row">${button('Rolle proben','actor','rehearse','smallbtn',restricted)}${button('Vertrag beenden','actor','quit','smallbtn danger',restricted)}</div></div>`:
 `${heading('Filme und Serien')}<div class="well">Komparsenrollen sammeln Erfahrung. Für richtige Film- und Serienrollen brauchst du Schauspielkönnen und musst zur gesuchten Altersgruppe passen. Maximal drei Castings pro Lebensjahr.</div>
 <div class="stack">
 ${menuRow('🎞️','Komparsenjob','Kurzer Dreh für 75 bis 304 € · bis zu drei jährlich','actor','extra',restricted||p.age<18)}
 ${offers.map(o=>menuRow(o.kind==='Film'?'🎬':'📺',o.title,`${o.kind} · ${o.role} · Drehbuch ${o.quality}% · Fähigkeit ${o.skill}% · ${money(o.fee)} ${o.kind==='Serie'?'pro Folge':'Honorar'}`,'actor','audition|'+o.id,restricted||p.age<18||skill<o.skill||!!p.musicCareer?.contractYears)).join('')}
 </div>`}
 ${c&&c.credits.length?`${heading('Filmografie & Auszeichnungen')}<div class="info-card"><b>${c.credits.length} Engagements · ${c.awards} Preise</b></div><div class="stack">
 ${c.credits.slice().reverse().map(r=>`<div class="acting-credit"><b>${html(r.title)}</b><small>${r.kind} · ${r.role} · Alter ${r.age} · Kritikerwertung ${r.rating}% · ${money(r.earnings)}</small></div>`).join('')}</div>`:''}`;
}
function renderDirector(p:Person){
 const c=p.directorCareer,q=c?.current,blocked=p.prisonYears>0;
 const info=heading('Filmregie',q?'Projekt in Arbeit':'Eigene Filmproduktion')+
  '<div class="info-card"><h3>🎬 Regiestudio</h3><p>Regiefähigkeit: <b>'+(c?.skill??0)+'%</b> · Branchenruf: '+(c?.reputation??10)+'% · Bekanntheit: '+(p.fame??0)+'%</p>'+
  '<div class="meter"><div style="width:'+(c?.skill??0)+'%"></div></div><p class="small">Filmkurse ab 14 Jahren, Erwachsene zahlen 250 € pro Kurs. Bis zu drei Kurse jährlich.</p>'+
  button('Regie üben','director','study','button-wide',blocked||p.age<14||(p.age>=18&&p.cash<250))+'</div>';
 let actions='';
 if(!q){
  actions=heading('Neues Filmprojekt')+'<div class="well">Wähle Genre und Produktionsbudget. Du finanzierst den Film vorab; nach der Premiere fließen Restbudget und Erlöse zurück. Pro Jahr kann ein Projekt gestartet werden.</div><div class="stack">'+
  DIRECTOR_GENRES.flatMap(genre=>Object.entries(DIRECTOR_BUDGETS).map(([size,budget])=>
   menuRow('🎥',genre+' · '+(size==='kurz'?'Kurzfilm':size==='mittel'?'Independent':'Großproduktion'),
    'Budget '+money(budget)+' · Besetzung, Dreh und Premiere','director','start|'+genre+'|'+size,blocked||p.age<18||p.cash<budget))).join('')+'</div>';
 }else{
  actions=heading('Laufende Produktion')+'<div class="info-card"><h3>'+html(q.title)+'</h3><p>'+html(q.genre)+' · '+(q.phase==='casting'?'Casting':q.phase==='shooting'?'Dreharbeiten':'Premiere bereit')+'</p>'+
   '<p class="small">Budget '+money(q.budget)+' · ausgegeben '+money(q.spent)+' · Drehbuch '+q.script+'% · Ensemble '+q.cast+'% · Aufnahmen '+q.footage+'%</p>'+
   (q.phase==='casting'?'<div class="stack">'+menuRow('🧑‍🎤','Nachwuchsensemble','23 % des Budgets · günstiger, weniger erfahren','director','cast|newcomers',blocked)+menuRow('🌟','Bekannte Darsteller','48 % des Budgets · ab 40.000 € Budget','director','cast|stars',blocked||q.budget<40000)+'</div>':
    q.phase==='shooting'?'<div class="stack">'+menuRow('🎞️','Sorgfältiger Dreh','40 % des Budgets · bessere Filmqualität','director','shoot|careful',blocked)+menuRow('⚡','Schneller Dreh','25 % des Budgets · weniger Aufwand','director','shoot|quick',blocked)+'</div>':
    button('Film veröffentlichen','director','release','button-wide',blocked))+
   button('Produktion abbrechen','director','cancel','ghost smallbtn',blocked)+'</div>';
 }
 const filmography=c?.films.length?heading('Filmografie & Preise')+'<div class="info-card">'+c.films.length+' Filme · '+c.awards+' Auszeichnungen</div><div class="stack">'+
  c.films.map(f=>'<div class="acting-credit"><b>'+html(f.title)+'</b><small>'+html(f.genre)+' · Alter '+f.age+' · Kritiker '+f.rating+'% · Kinokasse '+money(f.boxOffice)+(f.award?' · 🏆 Preis':'')+'</small></div>').join('')+'</div>':'';
 return info+actions+filmography;
}
function renderSport(p:Person){
 const c=p.sportCareer,contract=c?.contract,blocked=p.prisonYears>0;
 const intro=heading('Profisport')+'<div class="info-card"><h3>🏅 Sportlaufbahn</h3><p>'+html(c?.sport||'Sportart wählen')+' · Können: <b>'+(c?.skill??0)+' %</b> · Fitness: '+(c?.fitness??55)+' % · Ruf: '+(c?.reputation??10)+' %</p><p class="small">Sporttraining ab 8, Profiverträge ab 18. Fiktive Vereine und eigene Regeln.</p>'+(c?.injuryYears?'<p class="prison-warning">Verletzt: '+c.injuryYears+' Jahr(e)</p>':'')+'</div>';
 const practice=heading('Training')+'<div class="stack">'+(c?[c.sport]:SPORTS).map(kind=>menuRow('🏋️',kind+' trainieren',p.age<18?'Kostenfrei, max. 3 jährlich':'120 €, max. 3 jährlich','sport','train|'+kind,blocked||p.age<8||!!c?.retired||!!c?.injuryYears||(p.age>=18&&p.cash<120))).join('')+'</div>';
 const recovery=c?.injuryYears?heading('Rehabilitation')+menuRow('🩹','Verletzung behandeln','300 € · Heilung beschleunigen','sport','recover',blocked||p.cash<300):'';
 let career='';
 if(c?.retired)career=heading('Ruhestand')+'<div class="info-card">Deine Karriere ist beendet. Alle Saisons bleiben erhalten.</div>';
 else if(contract)career=heading('Dein Verein')+'<div class="info-card"><h3>'+html(contract.club)+'</h3><p>'+html(contract.league)+'liga · '+contract.yearsLeft+' Vertragsjahr(e) · '+money(contract.salary)+' brutto/Jahr</p></div><div class="stack">'+menuRow('💶','Gehalt verhandeln','Einmal pro Jahr möglich','sport','negotiate',blocked)+menuRow('📣','Sponsoring','30 % Ruhm und Ruf erforderlich','sport','sponsor',blocked||(p.fame??0)<30||c!.reputation<30)+menuRow('🏁','Karriere beenden','Unwiderruflich zurücktreten','sport','retire',blocked)+'</div>';
 else career=heading('Profiverträge')+'<div class="stack">'+SPORT_LEAGUES.map(league=>menuRow('✍️','Probetraining '+league+'liga',league==='Regional'?'Mindestens 35 % Können':'Mindestens 70 % Können','sport','tryout|'+league,blocked||p.age<18||p.age>40||!c||!!c.injuryYears||c.fitness<35||c.skill<(league==='Regional'?35:70)||!!p.actorCareer?.current||!!p.musicCareer?.contractYears)).join('')+(c&&!c.retired?menuRow('🏁','Karriere beenden','Beendet die Profi-Laufbahn','sport','retire',blocked||p.age<18):'')+'</div>';
 const archive=c?.seasons.length?heading('Saisonchronik')+'<div class="info-card">'+c.seasons.length+' Spielzeiten · '+c.titles+' Meistertitel</div>'+c.seasons.slice(-15).reverse().map(y=>'<div class="acting-credit"><b>Alter '+y.age+' · '+html(y.club)+(y.title?' 🏆':'')+'</b><small>'+html(y.league)+'liga · '+y.victories+' Siege · '+y.performance+' % Leistung · '+money(y.earnings)+' netto</small></div>').join(''):'';
 return intro+practice+recovery+career+archive;
}
function renderFighter(p:Person){
 const c=p.fighterCareer,blocked=p.prisonYears>0||!p.alive,injured=!!c?.injuryYears;
 const summary=heading('Kampfsportlaufbahn')+'<div class="info-card"><h3>🥊 Kampfsport</h3><p>'+html(c?.style||'Stil auswählen')+' · Technik '+(c?.skill??0)+' % · Kondition '+(c?.stamina??60)+' % · Ruf '+(c?.reputation??10)+' %</p><p>'+(c?.wins??0)+' Siege · '+(c?.losses??0)+' Niederlagen · '+(c?.leagueWins??0)+' Ligasiege · '+(c?.titles??0)+' Titelgewinne</p><p class="small">Fiktive Liga, eigene Regeln. Keine interaktiven Originalkämpfe oder Originalmoves.</p>'+(c?.champion?'<b>🏆 Aktueller Champion</b>':'')+(injured?'<p class="prison-warning">Verletzt: Pause bis zum nächsten Jahr oder Reha.</p>':'')+'</div>';
 const training=heading('Training')+'<div class="stack">'+(c?[c.style]:FIGHT_STYLES).map(style=>menuRow('🥋',style+' trainieren',p.age<18?'Kostenfrei · max. 3 jährlich':'180 € · max. 3 jährlich','fighter','train|'+style,blocked||p.age<14||!!c?.retired||injured||(p.age>=18&&p.cash<180))).join('')+'</div>';
 const coach=c&&!c.coach?menuRow('🎽','Coach engagieren','1.800 € · Technikbonus','fighter','coach',blocked||p.age<18||p.cash<1800||c.retired):'';
 const recovery=injured?menuRow('🩹','Rehabilitation','350 € · Heilungschance','fighter','recover',blocked||p.cash<350):'';
 const fights=c&&!c.retired?heading('Kämpfe')+'<div class="stack">'+
  menuRow('🥊','Sparring','220 € · ohne offiziellen Rekord','fighter','spar',blocked||p.age<16||injured||c.stamina<15||p.cash<220)+
  menuRow('🧱','Straßenkampf','Preisgeld, Verletzungs- und Haftgefahr','fighter','street',blocked||p.age<16||injured||c.stamina<15)+
  (c.league?menuRow('🏟️','Ligakampf','Zwei Kämpfe jährlich · Preisgeld','fighter','league',blocked||injured||c.stamina<20)+
  menuRow('⚔️','Rivalen provozieren',html(c.rival||'Rivale')+' · zweimal jährlich','fighter','taunt',blocked)+
  (c.champion?menuRow('🏆','Titel verteidigen','Gegen den Herausforderer antreten','fighter','defend',blocked||injured||c.stamina<20):menuRow('🏆','Titel herausfordern','80 % Technik, 3 Ligasiege, 55 % Ruf','fighter','challenge',blocked||injured||c.stamina<20||c.skill<80||c.leagueWins<3||c.reputation<55)):'')+
  (!c.league?menuRow('✍️','Liga-Probetraining','500 € · ab 18, 60 % Technik, 50 % Kondition, 3 Siege','fighter','join',blocked||p.age<18||p.age>45||c.skill<60||c.stamina<50||c.wins<3||injured||p.cash<500||!!p.sportCareer?.contract||!!p.politicalCareer?.office):'')+
  menuRow('🏁','Karriere beenden','Rücktritt ist unwiderruflich','fighter','retire',blocked||p.age<18)+'</div>':'';
 const history=c?.bouts.length?heading('Kampfchronik')+'<div class="stack">'+c.bouts.slice(-15).reverse().map(b=>'<div class="acting-credit"><b>Alter '+b.age+' · '+html(b.kind)+' · '+(b.won?'Sieg':'Niederlage')+'</b><small>'+html(b.opponent)+' · '+money(b.payout)+' Preisgeld</small></div>').join('')+'</div>':'';
 return summary+training+coach+recovery+(c?.retired?heading('Ruhestand')+'<div class="info-card">Deine Kampfsportlaufbahn ist beendet.</div>':fights)+history;
}
function renderWorkplace(p:Person){
 if(!p.jobId)return '';
 const w=p.workplace;
 if(!w||w.jobId!==p.jobId)return heading('Arbeitsumfeld')+
  '<div class="info-card"><p>Dein früherer Spielstand hat noch kein Arbeitsteam.</p>'+
  button('Team kennenlernen','work','introduce','button-wide',p.prisonYears>0)+'</div>';
 const people=[w.boss,...w.coworkers];
 return heading('Arbeitsumfeld','Karrierestufe '+(w.rank+1)+' von 4')+
  '<div class="info-card"><b>Jahresbeurteilungen: '+w.reviews+'</b><p class="small">Abmahnungen: '+w.warnings+' von 3 · Beförderung nach zwei Berufsjahren möglich. Gute Beziehungen und Leistung helfen.</p>'+
  button('Beförderung anfragen','work','promotion','button-wide',p.prisonYears>0||p.jobYears<2||w.rank>=3)+'</div>'+
  '<div class="stack">'+people.map(c=>'<article class="social-card"><h3>🤝 '+html(c.name)+'</h3><p>'+html(c.role)+' · Beziehung '+c.bond+'% · Fachkenntnis '+c.competence+'%</p>'+
   '<div class="relationship-meter"><span style="width:'+c.bond+'%"></span></div>'+
   '<div class="row">'+button('Reden','work','talk|'+c.id,'smallbtn',p.prisonYears>0)+
    button('Zusammenarbeiten','work','teamwork|'+c.id,'smallbtn',p.prisonYears>0)+
    button('Streiten','work','conflict|'+c.id,'smallbtn danger',p.prisonYears>0)+'</div></article>').join('')+'</div>';
}
function renderPolitics(p:Person){
 const c=p.politicalCareer,a=c?.office,q=c?.campaign,jailed=p.prisonYears>0;
 const stats=heading('Politische Laufbahn')+'<div class="info-card"><h3>🏛️ Politik</h3><p>Erfahrung: '+(c?.experience??0)+' % · Ansehen: '+(c?.reputation??20)+' % · Integrität: '+(c?.integrity??65)+' %</p><p class="small">'+(c?.wins??0)+' Wahlsiege · fiktive Parteien und eigene Wahlmodelle</p></div>';
 const volunteer=menuRow('🤝','Ehrenamtlich engagieren','Ab 14 · Erfahrung sammeln, zwei Aktionen jährlich','politics','volunteer',jailed||p.age<14);
 let content='';
 if(q){
  const cost=Math.round(POLITICAL_REQUIREMENTS[q.office].baseCost*.75);
  content=heading('Laufender Wahlkampf')+'<div class="info-card"><b>'+html(q.office)+'</b><p>'+html(q.party)+' · '+html(q.policy)+'</p><p>Reichweite '+q.reach+' % · Debatte '+q.debate+' % · Ausgaben '+money(q.spent)+'</p><p class="small">Wahl vor dem nächsten Jahreswechsel durchführen!</p></div><div class="stack">'+menuRow('🚪','Haustürgespräche','Wähler überzeugen','politics','canvass',jailed)+menuRow('🎤','Wahldebatte','Öffentlich diskutieren','politics','debate',jailed)+menuRow('📣','Wahlwerbung',money(cost)+' zusätzlich ausgeben','politics','advertise',jailed||p.cash<cost)+menuRow('🗳️','Zur Wahl antreten','Ergebnis ermitteln','politics','election',jailed)+'</div>';
 }else if(a){
  content=heading('Dein Amt')+'<div class="info-card"><h3>'+html(a.role)+'</h3><p>'+html(a.party)+' · '+a.yearsLeft+' Jahre verbleibend · '+money(a.salary)+' brutto/Jahr</p><b>Zustimmung: '+a.approval+' %</b><div class="meter"><div style="width:'+a.approval+'%"></div></div><p>Schwerpunkt: '+html(a.policy)+'</p></div><div class="stack">'+menuRow('🎙️','Bürgerversammlung','Zustimmung gewinnen','politics','speech',jailed)+POLITICAL_POLICIES.map(x=>menuRow('📜','Vorhaben: '+x,'Politische Maßnahme vorschlagen','politics','policy|'+x,jailed)).join('')+menuRow('🚪','Rücktritt','Amt niederlegen','politics','resign',jailed)+'</div>';
 }else{
  const eligible=POLITICAL_OFFICES.filter(k=>{const x=POLITICAL_REQUIREMENTS[k];return p.age>=x.age&&(c?.experience??0)>=x.experience&&(c?.wins??0)>=x.wins;});
  const options=(v:readonly string[])=>v.map(x=>'<option value="'+html(x)+'">'+html(x)+'</option>').join('');
  content=heading('Kandidatur')+'<div class="info-card"><label class="field">Amt<select id="politics-office">'+options(eligible)+'</select></label><label class="field">Gruppierung<select id="politics-party">'+options(POLITICAL_PARTIES)+'</select></label><label class="field">Programm<select id="politics-policy">'+options(POLITICAL_POLICIES)+'</select></label><label class="field">Wahlkampfbudget<select id="politics-budget">'+options(POLITICAL_BUDGETS)+'</select></label>'+button('Wahlkampf starten','politics','launch','button-wide',jailed||!eligible.length||p.cash<1200||p.record||!!p.musicCareer?.contractYears||!!p.actorCareer?.current||!!p.sportCareer?.contract)+'</div>'+heading('Voraussetzungen')+'<div class="stack">'+POLITICAL_OFFICES.map(role=>{const x=POLITICAL_REQUIREMENTS[role];return '<div class="acting-credit"><b>'+html(role)+'</b><small>Alter '+x.age+' · Erfahrung '+x.experience+' % · '+x.wins+' Siege · ab '+money(x.baseCost)+'</small></div>';}).join('')+'</div>';
 }
 const archive=c?.elections.length?heading('Wahlchronik')+'<div class="stack">'+c.elections.slice(-12).reverse().map(e=>'<div class="acting-credit"><b>'+html(e.office)+' · Alter '+e.age+' · '+(e.won?'🏆 Wahlsieg':'Wahlniederlage')+'</b><small>'+e.votes+' % Stimmen · '+money(e.spent)+' Ausgaben</small></div>').join('')+'</div>':'';
 return stats+heading('Mitmachen')+volunteer+content+archive;
}
function renderCareer(p:Person){
 if(!p.alive)return '<div class="empty">Diese Laufbahn ist beendet.</div>';
 const canStudy=p.age>=18&&p.age<=40&&!p.degree&&p.universityYears===0&&p.prisonYears===0;
 const jailed=p.prisonYears>0;
 return `<div class='panel-intro'><span class='panel-emoji'>🎓</span><div><h2>Ausbildung und Karriere</h2><span>${html(p.school)}</span></div></div>
 ${jailed?`<div class='prison-warning'>🔒 Noch ${p.prisonYears} ${p.prisonYears===1?'Jahr':'Jahre'} Haft. Freie Arbeit und Studium sind derzeit gesperrt.</div>`:''}
 ${heading('Ausbildung')}<div class='info-card'><b>${html(p.school)}</b><p class='small'>${p.degree?'Universitätsabschluss':p.universityYears>0?`Noch ${p.universityYears} Studienjahre`:p.age<18?'Schulpflicht':'Kein Hochschulabschluss'}</p><div class='row'>${button('Lernen','activity','study','smallbtn',p.age<6||p.age>24||p.school==='Abgeschlossen'||jailed)}${button('Universität beginnen','study','','smallbtn',!canStudy)}</div></div>
 ${renderSchoolPanel(p)}
 ${renderMusic(p)}
 ${renderActor(p)}
 ${renderSport(p)}
 ${heading('Kampfsport')}${menuRow('🥊','Kampfsportmodus','Training, Straßenkämpfe, Liga und Titel','category','fighter')}
  ${heading('Politik')}${menuRow('🏛️','Politikerkarriere','Wahlkämpfe, Ämter und Zustimmung','category','politics')}
 ${heading('Filmregie')}${menuRow('🎬','Regiestudio','Drehbuch, Casting, Produktion und Filmografie','category','director')}
 ${heading('Beruf',p.jobId||actingActive(p)||musicActive(p)||sportActive(p)||fighterActive(p)||politicsActive(p)?'Aktive Karriere':'Arbeitssuchend')}
 <div class='info-card'><b>${html(actingActive(p)?'Schauspieler/in · '+p.actorCareer!.current!.title:musicActive(p)?'Musiker/in · '+p.musicCareer!.mode:sportActive(p)?'Sportprofi · '+p.sportCareer!.contract!.club:fighterActive(p)?'Kampfsportprofi · fiktive Liga':politicsActive(p)?'Politisches Amt · '+p.politicalCareer!.office!.role:careerName(p))}</b><p class='small'>${p.jobId?`${p.jobYears} Berufsjahre · Leistungsbewertung ${p.careerPerformance??50}% · Gehaltsbonus ${money(p.salaryBonus||0)}/Jahr` :actingActive(p)?'Aktive Film- oder Serienrolle · Details unter Schauspielkarriere':musicActive(p)?'Aktiver Plattenvertrag · Einnahmen über Auftritte und Veröffentlichungen':sportActive(p)?'Sportvertrag · Saisonabrechnung beim Altern':fighterActive(p)?'Ligavertrag · Kämpfe und Jahresvergütung':politicsActive(p)?'Wahlamt · Jahresgehalt':'Ohne regelmäßiges Einkommen'}</p>
 ${p.jobId?`<div class='performance-meter'><div style='width:${p.careerPerformance??50}%'></div></div><div class='row'>${button('Härter arbeiten','activity','workhard','smallbtn',jailed)}${button('Gehalt verhandeln','activity','raise','smallbtn',jailed||p.jobYears<2)}${button('Kündigen','activity','resign','smallbtn danger',jailed)}</div>`:''}</div>
 ${renderWorkplace(p)}
  ${heading('Stellenangebote')}<div class='stack'>${CAREERS.map(c=>{const qualified=p.age>=c.minAge&&p.stats.smarts>=c.minSmarts&&(!c.requiresDegree||p.degree)&&!jailed&&!musicActive(p)&&!actingActive(p)&&!sportActive(p)&&!fighterActive(p)&&!politicsActive(p);return card('💼',html(c.title),`${money(c.salary)} brutto · Mindestalter ${c.minAge} · Intelligenz ${c.minSmarts}${c.requiresDegree?' · Abschluss':''}`,'job',c.id,p.jobId===c.id?'Aktuell':'Bewerben',!qualified||p.jobId===c.id);}).join('')}</div>${renderBusiness(p)}`;
}
function renderPeople(p:Person){
 const living=p.relationships.filter(r=>r.alive);
 const r=living.find(person=>person.id===relationFocus);
 if(r){return `<button class='screen-back' data-action='relview' data-id=''>‹ Beziehungen</button><div class='person-detail'><span class='person-portrait'>${r.kind==='Kind'?'🧒':r.kind==='Partner'?'❤️':r.kind==='Freund'?'🫂':'👨‍👩‍👧'}</span><h2>${html(r.name)}</h2><p>${html(r.kind)} · ${formatAge(r.age)} ${p.marriedPartnerId===r.id?'· Verheiratet':''}</p><span>Beziehung: ${r.bond}%</span><div class='relationship-meter'><div style='width:${r.bond}%'></div></div><div class='family-trust'>Vertrauen: ${r.trust??Math.max(20,Math.min(90,r.bond))}% <span class='relationship-meter'><span style='width:${r.trust??Math.max(20,Math.min(90,r.bond))}%'></span></span></div>${r.kind==='Kind'?`<div class='family-trust'>Entwicklung: ${r.development??50}%</div>`:''}${r.estranged?`<div class='prison-warning'>Kontakt abgebrochen. Eine Versöhnung ist möglich.</div>`:''}</div>
 ${heading('Gemeinsame Aktivitäten')}<div class='stack'>
 ${p.prisonYears>0&&!r.estranged?card('✉️','Brief schreiben','Kontakt aus dem Gefängnis halten','relation',`${r.id}|letter`,'Schreiben'):card('💬','Gespräch führen','Ein wenig miteinander reden','relation',`${r.id}|talk`,'Reden')}
 ${p.prisonYears===0?`${card('🎁','Geschenk machen','100 € ausgeben und Freude machen','relation',`${r.id}|gift`,'Schenken',p.cash<100||!!r.estranged)}${card('☀️','Zeit verbringen','Gemeinsam einen Tag verbringen','relation',`${r.id}|time`,'Unternehmen',!!r.estranged)}${card('😊','Kompliment machen','Zuneigung ausdrücken','relation',`${r.id}|compliment`,'Sagen',!!r.estranged)}${card('⚡','Streit anfangen','Kann eure Beziehung beschädigen','relation',`${r.id}|argue`,'Streiten',!!r.estranged)}`:''}
 ${r.kind==='Partner'&&p.prisonYears===0?`${card('💍','Heiraten',p.marriedPartnerId===r.id?'Bereits verheiratet':'Ab 18 Jahren, gute Beziehung, 2.500 €','relation',`${r.id}|marry`,'Heiraten',p.marriedPartnerId===r.id||p.age<18||r.bond<65||p.cash<2500||!!r.estranged)}${p.marriedPartnerId===r.id?card('⚖️','Scheidung','Vermögensaufteilung und Trennung','family',`divorce|${r.id}`,'Scheiden'):card('💔','Trennung','Die Beziehung beenden','relation',`${r.id}|breakup`,'Trennen')}`:''}${p.prisonYears===0?`${!r.estranged&&r.kind!=='Ex-Partner'?card('🕊️','Entschuldigen','Einen Streit bereinigen','family',`apologize|${r.id}`,'Entschuldigen'):''}${['Mutter','Vater','Elternteil','Freund'].includes(r.kind)&&!r.estranged?card('💶','Um finanzielle Hilfe bitten','Ab 45% Beziehung und 50% Vertrauen','family',`assist|${r.id}`,'Bitten',r.bond<45||(r.trust??r.bond)<50):''}${r.kind==='Kind'&&r.age>=5&&r.age<18?card('📚','Kind fördern','200 € für Lernmaterial und Betreuung','family',`teach-child|${r.id}`,'Fördern',p.age<18||p.cash<200):''}${r.estranged||r.kind==='Ex-Partner'?card('🤝','Versöhnung','Eine Beziehung oder Freundschaft wiederherstellen','family',`reconcile|${r.id}`,'Versuchen'):''}${!r.estranged&&r.kind!=='Partner'&&r.kind!=='Kind'?card('🚪','Kontakt abbrechen','Distanz schaffen','family',`distance|${r.id}`,'Abbrechen'):''}`:''}</div>`;}
 const family=living.filter(r=>['Mutter','Vater','Elternteil'].includes(r.kind));
 const romantic=living.filter(r=>r.kind==='Partner');
 const children=living.filter(r=>r.kind==='Kind');
 const friends=living.filter(r=>r.kind==='Freund');
 const exes=living.filter(r=>r.kind==='Ex-Partner');
 const item=(r:Person['relationships'][number])=>`<button class='list-entry family-entry' data-action='relview' data-id='${html(r.id)}'><span class='list-emoji'>${r.kind==='Mutter'?'👩':r.kind==='Vater'?'👨':r.kind==='Kind'?'🧒':r.kind==='Partner'?'❤️':'🫂'}</span><span class='list-text'><b>${html(r.name)} <span class='family-role'>${html(r.kind)}</span></b><small>${r.age} Jahre ${r.occupation?'· '+html(r.occupation):''}</small><span class='relationship-meter'><span style='width:${r.bond}%'></span></span></span><span class='chevron'>›</span></button>`;
 const group=(title:string,rels:typeof living)=>rels.length?`${heading(title)}<div class='stack'>${rels.map(item).join('')}</div>`:'';
 return `${heading('Besonderes')}<div class='stack'>${menuRow('🕯️','Gemeinschaft','Eigene Glaubensgemeinschaft gründen · noch offen','relview','',true)}</div>
 ${heading('Kontakte pflegen')}<div class='stack'>${menuRow('🤝','Neue Freunde finden','Zweimal pro Jahr ab 5 Jahren','family','meet',p.age<5||p.prisonYears>0)}${menuRow('👨‍👩‍👧','Familientag','Gemeinsame Zeit · für Erwachsene 150 €','family','family-day',p.prisonYears>0||p.cash<(p.age>=18?150:0)||![...family,...romantic,...children].some(r=>!r.estranged))}</div>${group('Eltern',family)}${group('Partner',romantic)}${group('Kinder',children)}${group('Freunde',friends)}${group('Frühere Partnerschaften',exes)}
 ${heading('Familienplanung')}<div class='stack'>${menuRow('💘','Partnersuche','Ab 16 Jahren','activity','date',p.age<16||p.prisonYears>0||romantic.length>0)}${menuRow('👶','Nachwuchs','Ein Kind bekommen','activity','child',p.age<18||p.age>55||p.prisonYears>0||romantic.length===0)}</div>`;
}
function rentalPanel(p:Person,a:Person['assets'][number]){
 if(a.kind!=='Haus')return '';
 const r=a.rental;
 const disabled=p.prisonYears>0||!p.alive;
 return `<div class='rental-panel'><b>🏠 Vermietung</b><p class='small'>${r?(r.occupied?'Vermietet':'Leerstand')+' · Jahresmiete '+money(r.annualRent)+' · Zustand '+r.condition+'%':'Noch nicht zur Vermietung angeboten'}</p><div class='row'>
 ${button('Mieter finden','rental',a.id+'|advertise','smallbtn',disabled||!!r?.occupied)}
 ${button('Renovieren','rental',a.id+'|repair','smallbtn',disabled||p.cash<Math.round(a.value*.025))}
 ${r?.occupied?button('Mietvertrag beenden','rental',a.id+'|vacate','smallbtn',disabled):''}
 </div></div>`;
}
function renderInvestments(p:Person){
 return `${heading('Investments',money(portfolioValue(p)))}<div class='well'>Eigenständiges Marktmodell: Aktien, Anleihen, Fonds, Penny Stocks und Kryptowährungen. Kursänderungen erfolgen bei jedem Lebensjahr, nicht in Echtzeit. Handel ab 18.</div>
 <div class='info-card'><b>Finanzberater: ${p.financialAdvisor?'Eingestellt':'Nicht eingestellt'}</b><p class='small'>Einmalig 1.000 € bei Einstellung, danach 900 € jährlich. Bei genügend Geld legt er automatisch im Fonds an.</p><div class='row'>${p.financialAdvisor?button('Berater entlassen','investment','advisor-fire','smallbtn'):button('Berater einstellen','investment','advisor-hire','smallbtn',p.age<18||p.prisonYears>0||p.cash<1000)}</div></div>
 <div class='stack'>${FINANCIAL_ASSETS.map(a=>{
  const price=getMarketPrice(p,a.id);
  const shares=p.investments?.find(h=>h.assetId===a.id)?.quantity||0;
  return `<article class='social-card investment-card'><h3>📈 ${a.name}</h3><p>${a.kind} · Kurs ${money(price)} · Bestand ${shares} · Wert ${money(shares*price)}</p>
  <div class='row'><label class='trade-label'>Anteile <select id='investment-qty-${a.id}'>${[1,5,20,100].map(q=>`<option value='${q}'>${q}</option>`).join('')}</select></label>
  ${button('Kaufen','investment','buy|'+a.id,'smallbtn',p.age<18||p.prisonYears>0||p.cash<price*1.005)}
  ${button('Verkaufen','investment','sell|'+a.id,'smallbtn',p.age<18||p.prisonYears>0||shares===0)}
  </div></article>`;}).join('')}</div>`;
}
function renderHeirlooms(p:Person){
 const items=p.heirlooms||[];
 const free=p.alive&&p.prisonYears===0;
 const searched=!!p.heirloomSearchDate&&p.heirloomSearchDate>=todayHeirloomKey();
 const rows=items.map(item=>{
  const found=HEIRLOOM_CATALOG.find(x=>x.kind===item.kind)!;
  const estimate=Math.floor(item.value*item.condition/100*.9);
  return `<article class="info-card"><h3>${found.icon} ${html(found.name)}</h3><p class="small">${html(found.rarity)} · Zustand ${item.condition}% · Gefunden mit ${item.foundAge} Jahren</p><p>${item.appraised?'Geschätzter Verkaufserlös: <b>'+money(estimate)+'</b>':'Wert unbekannt · Schätzung für 100 € möglich'}</p><div class="row">
  ${button('Schätzen','heirloom','appraise|'+item.id,'smallbtn',!free||item.appraised||p.cash<100)}
  ${button('Restaurieren','heirloom','restore|'+item.id,'smallbtn',!free||p.age<16||item.condition===100||p.cash<400)}
  ${button('Zeigen','heirloom','exhibit|'+item.id,'smallbtn',!free)}
  ${button('Verkaufen','heirloom','sell|'+item.id,'danger smallbtn',!free||p.age<18||!item.appraised)}
  </div></article>`;
 }).join('');
 return `${heading('Erbstücke und Fundstücke')}<div class="well">Ein Fund pro echtem Kalendertag, lokal auf diesem Gerät. Fundstücke können geschätzt, restauriert, verkauft oder an die nächste Generation weitergegeben werden. Alle Gegenstände sind frei erfunden.</div>
 <div class="info-card"><b>${items.length} Fundstücke</b> · Geschätzter Sammlungswert ${money(heirloomWorth(p))}</div>
 <div class="stack">${menuRow('🔦','Dachboden durchsuchen',searched?'Heute bereits gesucht':'Neue Fundchance · ab 8 Jahren','heirloom','search',!free||p.age<8||searched||items.length>=100)}</div>
 ${heading('Deine Sammlung')}${items.length?'<div class="stack">'+rows+'</div>':'<div class="empty">Noch keine Fundstücke entdeckt.</div>'}`;
}
function renderAssetsDetail(p:Person){return `<div class="banner"><h1>${money(netWorth(p))}</h1><p>Aktuelles Vermögen inklusive Sachwerten</p></div>${heading('Eigentum')}${p.assets.length?`<div class="stack">${p.assets.map(a=>card(a.kind==='Haus'?'⌂':'🚙',html(a.name),`Wert ${money(a.value)} · Unterhalt ${money(a.annualCost)} / Jahr`,'sell',a.id,'Verkaufen',!p.alive )+rentalPanel(p,a)).join('')}</div>`:'<div class="empty">Noch kein eigener Besitz.</div>'}${heading('Immobilien und Fahrzeuge')}<div class="stack">${ITEMS.map(i=>card(i.kind==='Haus'?'⌂':'🚙',html(i.name),`${money(i.price)} Kaufpreis · ${money(i.annualCost)}/Jahr`,'buy',i.id,'Kaufen',p.age<18||p.cash<i.price||!p.alive)).join('')}</div>`;}
function renderAssets(p:Person){
 if(assetsSection==='heirlooms')return `<button class='screen-back' data-action='assetback'>‹ Besitz</button>${renderHeirlooms(p)}`;
 if(assetsSection==='invest')return `<button class='screen-back' data-action='assetback'>‹ Besitz</button>${renderInvestments(p)}`;
 if(assetsSection==='estate')return `<button class='screen-back' data-action='assetback'>‹ Besitz</button>${renderAssetsDetail(p)}`;
 return `${heading('Finanzen')}<div class='stack'>
 ${menuRow('💰','Finanzen',`Kontostand ${money(p.cash)} · Restschuld ${money(p.loanBalance||0)}`,'assetview','invest')}
 ${menuRow('📈','Investments',`Depots und Wertpapiere · ${money(portfolioValue(p))}`,'assetview','invest',p.age<18)}
 ${menuRow('💎','Luxusleben','Premium-Luxusgüter · aktuell noch offen','assetview','',true)}
 </div>${heading('Premium-Besitz')}<div class='stack'>
 ${menuRow('⚒️','Auktionshäuser','Sammlerstücke ersteigern · noch offen','assetview','',true)}
 ${menuRow('🎲','Casino','Eigenes Casino betreiben · noch offen','assetview','',true)}
 ${menuRow('🏛️','Museum','Sammlerstücke ausstellen · noch offen','assetview','',true)}
 ${menuRow('🏎️','Rennwagen-Garage','Rennwagen sammeln · noch offen','assetview','',true)}
 ${menuRow('🦁','Zoo','Eigenen Tierpark führen · noch offen','assetview','',true)}
 </div>${heading('Eigentum')}<div class='stack'>
 ${menuRow('🔦','Erbstücke',`${(p.heirlooms||[]).length} Fundstücke · Suchen, schätzen und vererben`,'assetview','heirlooms')}
 ${menuRow('🏡','Immobilien und Fahrzeuge',`${p.assets.length} Gegenstände · Kaufen, verkaufen, vermieten`,'assetview','estate')}
 ${menuRow('📱','Social Media','Online-Profile und Reichweite','tab','activities')}
 </div>`;
}

function renderCrime(p:Person,jailed=false){
 const c=criminal(p);
 const contacts=c.network.filter(x=>x.active);
 const history=CRIME_TYPES.map(type=>`<div class="crime-skill"><div><b>${html(CRIME_LABELS[type])}</b><span>${c.skills[type]||0}%</span></div><div class="meter"><div style="width:${c.skills[type]||0}%"></div></div></div>`).join('');
 const contactRows=contacts.map(x=>`<div class="crime-contact"><div class="crime-contact-head"><b>🕶️ ${html(x.name)}</b><span>${html(x.origin)} · Vertrauen ${x.trust}%</span></div><p class="small">Einfluss ${x.influence}% · Zuletzt gesehen mit ${x.lastMetAge} Jahren</p>
 <div class="row">${button('Vertrauen aufbauen','crime','build-trust|'+x.id,'smallbtn')}
 ${jailed&&x.origin==='Haft'?button('Von Erfahrung lernen','crime','mentor|'+x.id+'|pickpocket','smallbtn'):''}</div>
 ${jailed&&x.origin==='Haft'?button('Einbruch-Erfahrungen','crime','mentor|'+x.id+'|burglary','ghost smallbtn'):''}
 </div>`).join('');
 return `${heading('Unterwelt und Erfahrung')}<div class="crime-dashboard">
 <div class="crime-summary"><div><small>Rang</small><b>${CRIME_RANKS[c.rank]}</b></div><div><small>Respekt</small><b>${c.respect}%</b></div><div><small>Fahndungsdruck</small><b>${c.heat}%</b></div></div>
 <p class="small">${c.successes} erfolgreiche Aktionen · ${c.failures} Festnahmen · ${c.probationYears} Jahre Bewährung · ${contacts.length} Kontakte</p>
 <p class="small">Fertigkeiten wachsen mit Erfahrung. Kontakte können fördern, enttäuschen oder abreißen.</p>
 ${history}</div>
 ${heading(jailed?'Bekanntschaften in der Haft':'Kontakte aufbauen')}
 <div class="stack">
 ${menuRow('🤝',jailed?'Mitgefangenen kennenlernen':'Neue Szene-Bekanntschaft','Ein neuer Kontakt kann spätere Wege eröffnen','crime','meet',p.age<16)}
 ${contacts.length?contactRows:'<div class="info-card">Du hast noch keine Kontakte.</div>'}</div>
 ${jailed?`${heading('Gefängnisalltag')}<div class="well">Mitgefangene können deine Spielfertigkeiten beeinflussen. Sie bieten keine Garantie für eine erfolgreiche kriminelle Laufbahn.</div>`:
 `${heading('Straftaten')}<div class="well">Zwei Versuche pro Jahr. Alter, Erfahrung, Vorstrafen, Fahndungsdruck, Intelligenz und Kontakte verändern die Entdeckungswahrscheinlichkeit.</div><div class="stack">
 ${CRIME_TYPES.map((type,i)=>menuRow(['🛍️','👜','🏠'][i]!,CRIME_LABELS[type],'Entdeckungsrisiko derzeit: '+Math.round(crimeRisk(p,type)*100)+'%','crime',type,p.age<12)).join('')}</div>
 ${heading('Kriminelles Netzwerk')}<div class="stack">
 ${menuRow('🕸️','Ins Netzwerk aufgenommen werden','Erfordert 15 Respekt und einen vertrauenswürdigen Kontakt','crime','join',p.age<18||c.rank>0||c.respect<15||!contacts.some(x=>x.trust>=35))}
 ${menuRow('📦','Gemeinsamer Auftrag','Ein abstrakter Auftrag mit Gewinn- und Haftchancen','crime','crew-job',p.age<18||c.rank===0||!contacts.some(x=>x.trust>=35))}
 ${menuRow('🏅','Aufsteigen','Neue Verantwortung durch Respekt und Erfahrung','crime','promote',p.age<18||c.rank===0||c.rank>=3||c.respect<(c.rank===1?38:68)||c.successes<(c.rank===1?2:5))}
 ${menuRow('🚪','Netzwerk verlassen','Mit der bisherigen Laufbahn brechen','crime','leave',c.rank===0)}
 ${menuRow('🌱','Neustart','Bewährung und Fahndungsdruck verbessern','crime','rehabilitate',p.age<18)}</div>`}
 `;
}
function renderActivities(p:Person){
 const jailed=p.prisonYears>0;
 if(jailed){return `<div class='panel-intro'><span class='panel-emoji'>🔒</span><div><h2>Gefängnis</h2><span>Reststrafe: ${p.prisonYears} ${p.prisonYears===1?'Jahr':'Jahre'}</span></div></div><div class='prison-warning'>Arbeiten, Reisen, Einkaufen und weitere Straftaten sind während der Haft gesperrt.</div>${renderCrime(p,true)}${heading('Haftalltag')}<div class='stack'>${card('📚','Gefängnisbibliothek','Wissen aufbauen','activity','prison:library','Lesen')}${card('🏃','Hofgang','Fitness und Stimmung verbessern','activity','prison:yard','Trainieren')}${card('🧘','Meditation in der Zelle','Stress abbauen','activity','prison:meditate','Meditieren')}${card('🧹','Gefängnisarbeit','80 € für erledigte Aufgaben','activity','prison:job','Arbeiten')}</div>`;}
 const option=(emoji:string,title:string,description:string,id:string)=>`<button class='list-entry category-row' data-action='category' data-id='${id}'><span class='list-emoji'>${emoji}</span><span class='list-text'><b>${title}</b><small>${description}</small></span><span class='chevron'>›</span></button>`;
 if(!activitySection){return `<div class='screen-welcome'>Wähle eine Aktivität. Mit jedem Lebensjahr ändern sich die verfügbaren Möglichkeiten.</div>
 ${heading('Besondere Aktivitäten')}<div class='stack'>
 ${menuRow('🎬','Filmregie','Filme produzieren, besetzen und veröffentlichen','category','director')}
  ${menuRow('🏛️','Politik','Wahlkampf und öffentliche Ämter','category','politics')}
  ${menuRow('🏅','Profisport','Sporttraining, Verträge und Meisterschaften','category','sport')}
  ${menuRow('🥊','Kampfsport','Training, Rivalen und Titelkämpfe','category','fighter')}
 ${menuRow('🧛','Vampir-Modus','Spezialmodus · noch nicht verfügbar','premiumopen','',true)}
 ${menuRow('🌲','Outdoor-Leben','Zusätzliche Outdoor-Erlebnisse · geplant','premiumopen','',true)}
 </div>${heading('Alle Aktivitäten')}<div class='stack'>
 ${menuRow('🎩','Accessoires','Kleidung und persönliche Gegenstände','category','accessories',p.age<8)}
 ${menuRow('🧸','Adoption','Ein Kind aufnehmen · ab 21 Jahren','lifestyle','adopt',p.age<21||p.prisonYears>0||p.cash<3000)}
 ${menuRow('🦊','Kriminalität','Taschendiebstahl, Ladendiebstahl und Einbruch','category','crime',p.age<12)}
 ${menuRow('🩺','Arzt & Gesundheit','Untersuchungen, Krankheiten und Behandlung','category','health',p.prisonYears>0)}
 ${menuRow('🌐','Auswandern','In ein anderes Land ziehen','category','travel',p.age<18||p.prisonYears>0)}
 ${menuRow('🧬','Fruchtbarkeitsklinik','Medizinische Behandlung für 1.500 €','lifestyle','fertility',p.age<18||p.age>55||p.prisonYears>0||p.cash<1500)}
 ${menuRow('🎲','Glücksspiel','Im Casino spielen','lifestyle','gamble',p.age<18||p.prisonYears>0||p.cash<100)}
 ${menuRow('🪪','Identität','Deine persönliche Identität festlegen','category','identity',p.age<16)}
 ${menuRow('⚖️','Rechtsstreit','Rechtsstreitigkeiten · weiterer Ausbau offen','category','legal',true)}
 ${menuRow('🚗','Führerschein','Theorie- und Fahrprüfung','lifestyle','license',p.age<16||p.license||p.prisonYears>0||p.cash<220)}
 ${menuRow('🏦','Kredit','Bankdarlehen beantragen oder tilgen','category','loans',p.age<18||p.prisonYears>0)}
 ${menuRow('💸','Lotterie','Ein Los für 20 € kaufen','activity','lottery',p.age<18||p.cash<20)}
 ${menuRow('🧠','Körper & Geist','Fitnessstudio, Bibliothek und Meditation','category','mind',p.prisonYears>0)}
 ${menuRow('🎶','Musik','Unterricht, Vorspiele, Singles und Tourneen','category','music',p.age<8||p.prisonYears>0)}
 ${menuRow('🎭','Schauspiel','Unterricht, Komparserie, Castings und Filmrollen','category','acting',p.age<8||p.prisonYears>0)}
 ${menuRow('🎓','Schule','Lernen, Nachhilfe und Arbeitsgemeinschaften','category','school',p.age<6||p.age>=18||p.prisonYears>0)}
 ${menuRow('❤️','Liebe und Familie','Partnerschaft, Nachwuchs und Kontakte','category','love',p.age<16)}
 ${menuRow('📱','Social Media','Reichweite und Werbepartner','category','social',p.age<13)}
 ${menuRow('✈️','Reisen','Urlaub und weitere Länder','category','travel',p.age<18)}
 ${menuRow('🎟️','Freizeit','Spaziergänge, Ehrenamt, Lotterie','category','leisure')}
 </div>`;}
 const back=`<button class='screen-back' data-action='category' data-id=''>‹ Alle Aktivitäten</button>`;
 if(activitySection==='accessories')return `${back}${heading('Accessoires')}<div class='stack'>${['Sonnenbrille','Mütze','Armbanduhr','Hut','Schal'].map((name,i)=>menuRow(['🕶️','🧢','⌚','🎩','🧣'][i]!,name,'75 € · Aussehen und Glück verbessern','lifestyle','accessory|'+name,p.cash<75)).join('')}</div><div class='info-card'>Aktuell: ${html(p.accessory||'Kein Accessoire')}</div>`;
 if(activitySection==='identity')return `${back}${heading('Identität')}<div class='info-card'>Aktuelle Angabe: <b>${html(p.gender)}</b><p class='small'>Ab 16 Jahren kannst du die Angabe ändern.</p><div class='stack'>${['weiblich','männlich','divers'].map(g=>menuRow('🪪',g,'Persönliche Angabe aktualisieren','lifestyle','identity|'+g,g===p.gender)).join('')}</div></div>`;
 if(activitySection==='loans')return `${back}${heading('Finanzen & Kredite')}<div class='info-card'>Offene Restschuld: <b>${money(p.loanBalance||0)}</b></div><div class='stack'>${[10000,25000,50000].map(q=>menuRow('💶','Kredit '+money(q),'6,5 % Zinsen jährlich · laufende Tilgung','lifestyle','loan|'+q,!!p.loanBalance||(!p.jobId&&!p.business)||p.record)).join('')}${[1000,5000,10000].map(q=>menuRow('📤','Tilgen: '+money(q),'Sondertilgung aus deinem Kontostand','lifestyle','repay|'+q,!p.loanBalance||p.cash<Math.min(p.loanBalance||0,q))).join('')}</div>`;
 if(activitySection==='school')return `${back}${renderSchoolPanel(p)}`;
 if(activitySection==='school-clubs')return `${back}${heading('Schul-AG auswählen')}<div class='stack'>${([['⚽','sport','Sport-AG','Fitness und Teamgeist'],['🎹','musik','Musik-AG','Freude und musikalische Interessen'],['🛠️','technik','Technik-AG','Technisches Denken und Intelligenz'],['🎨','kunst','Kunst-AG','Kreativität und Freizeit']] as const).map(([emoji,code,name,description])=>menuRow(emoji,name,description,'education','club|'+code,p.schoolRecord?.club===code)).join('')}</div>`;
 if(activitySection==='health')return `${back}${heading('Gesundheit')}${p.illness?`<div class='prison-warning'>🤒 ${html(p.illness.diagnosed?p.illness.kind:'Nicht diagnostizierte Beschwerden')} · Intensität ${p.illness.severity}%</div>`:`<div class='info-card'>Derzeit ist keine akute Erkrankung bekannt.</div>`}
 <div class='stack'>
 ${menuRow('🩺','Gesundheitscheck','100 € · Beschwerden diagnostizieren','medical','checkup',p.cash<100)}
 ${menuRow('💊','Behandlung','350 € · Erkrankung behandeln','medical','treat',!p.illness||!p.illness.diagnosed||p.cash<350)}
 ${menuRow('🧑‍⚕️','Gesprächstherapie','220 € · Glück und Belastung verbessern','medical','therapy',p.age<12||p.cash<220)}
 ${menuRow('🛌','Ausruhen','Ruhe und Erholung ohne Kosten','medical','rest')}
 ${menuRow('💉','Allgemeiner Arztbesuch','150 € · Gesundheit stärken','activity','doctor',p.cash<150)}
 </div>`;
 if(activitySection==='director')return `${back}${renderDirector(p)}`;
  if(activitySection==='sport')return `${back}${renderSport(p)}`;
 if(activitySection==='politics')return `${back}${renderPolitics(p)}`;
  if(activitySection==='fighter')return `${back}${renderFighter(p)}`;
 if(activitySection==='acting')return `${back}${renderActor(p)}`;
 if(activitySection==='music')return `${back}${renderMusic(p)}`;
 if(activitySection==='mind')return `${back}${heading('Körper und Geist')}<div class='stack'>${card('📖','Buch lesen','Intelligenz trainieren','activity','read','Lesen')}${card('📚','Bibliothek','Wissen und Lernfortschritt','activity','library','Besuchen')}${card('🧘','Meditieren','Glück und Gesundheit','activity','meditate','Meditieren')}${card('🩺','Arzt','Gesundheitscheck für 150 €','activity','doctor','Besuchen',p.cash<150)}${card('🏋️','Fitnessstudio','Training für 50 €, ab 12 Jahren','activity','gym','Trainieren',p.age<12||p.cash<50)}</div>`;
 if(activitySection==='love')return `${back}${heading('Liebe und Familie')}<div class='stack'>${card('💕','Partnersuche','Neue Beziehung beginnen','activity','date','Suchen',p.age<16||p.relationships.some(r=>r.kind==='Partner'&&r.alive))}${card('👶','Nachwuchs','Versucht, Eltern zu werden','activity','child','Versuchen',p.age<18||p.age>55||!p.relationships.some(r=>r.kind==='Partner'&&r.alive))}</div>`;
 if(activitySection==='crime')return `${back}${renderCrime(p)}`;
 if(activitySection==='social')return `${back}<div class='panel-intro'><span class='panel-emoji'>📱</span><div><h2>Social Media</h2><span>Berühmt werden und Werbepartner finden</span></div></div><div class='info-card'>Bekanntheit: <b>${p.fame??0}%</b> · Reichweite: <b>${Object.values(p.social||{}).reduce((sum,profile)=>sum+(profile?.followers||0),0).toLocaleString('de-DE')} Follower</b><p class='small'>Beiträge sind auf drei pro Plattform und Jahr begrenzt. Ab 10.000 Followern sind Werbedeals möglich.</p></div><div class='stack'>${SOCIAL_PLATFORMS.map(platform=>{const profile=p.social?.[platform];return `<article class='social-card'><h3>📣 ${html(platform)}</h3><p>${profile?profile.followers.toLocaleString('de-DE')+' Follower · '+profile.posts+' Beiträge':'Du hast noch kein Profil.'}</p><div class='row'>${!profile?button('Profil anlegen','social',platform+'|join','smallbtn',p.age<13):button('Beitrag veröffentlichen','social',platform+'|post','smallbtn')}${profile?button('Werbedeal','social',platform+'|sponsor','smallbtn',profile.followers<10000):''}${profile?button('Konto löschen','social',platform+'|delete','ghost smallbtn'):''}</div></article>`;}).join('')}</div>`;
 if(activitySection==='travel')return `${back}${heading('Reisen und Wohnen')}<div class='stack'>${card('🌴','Urlaub machen','2.000 € · Glück verbessern','activity','vacation','Buchen',p.age<18||p.cash<2000)}</div>${heading('Auswandern')}<div class='info-card'><label class='field'>Zielland<select id='country-select'>${opt(COUNTRIES.filter(x=>x!==p.country),COUNTRIES.find(x=>x!==p.country)||'')}</select></label><p class='small'>3.500 € für den Umzug. Bestehende Anstellung endet.</p>${button('Auswandern','emigrate','','button-wide',p.age<18||p.cash<3500)}</div>`;
 if(activitySection==='leisure')return `${back}${heading('Freizeit')}<div class='stack'>${card('🚶','Spazieren gehen','Mehr Gesundheit und Zufriedenheit','activity','walk','Gehen')}${card('🤝','Freiwilligenarbeit','Ruf und Wohlbefinden verbessern, ab 14','activity','volunteer','Helfen',p.age<14)}${card('🎟️','Lotterielos','20 € je Los · seltene hohe Gewinne','activity','lottery','Spielen',p.age<18||p.cash<20)}</div>`;
 return back;
}
function renderPremium(){
 const p=current?.person;
 const playable=['time-machine','jail-card','golden-pacifier','golden-diploma','hollywood-star'];
 const availableYears=[1,2,3,4,5].filter(y=>(current?.checkpoints||[]).some(c=>c.age===(p?.age||0)-y));
 return `<button class='screen-back' data-action='premiumback'>‹ Hauptmenü</button><div class='panel-intro'><span class='panel-emoji'>🎁</span><div><h2>Zusatzinhalte</h2><span>Alle implementierten Inhalte sind kostenlos</span></div></div>
 <div class='well'>Dieser Katalog dokumentiert nachgewiesene BitLife-Kaufangebote, mit ihrem tatsächlichen Entwicklungsstand in Lebenslinien. Offene Pakete sind ausdrücklich nicht spielbar.</div>
 ${heading('Nutzbare Sonderfunktionen')}
 <div class='stack'>
 ${card('⏳','Time Machine','Zurück zu einem früheren Lebensjahr, auch nach dem Tod','premiumrewind','1','Zurückspulen',!availableYears.length)}
 ${availableYears.length?`<div class='info-card'><label class='field'>Zeitreise<select id='rewind-years'>${availableYears.map(y=>`<option value='${y}'>${y} ${y===1?'Jahr':'Jahre'}</option>`).join('')}</select></label>${button('Jahre zurückspulen','premiumrewind','selected','button-wide')}</div>`:''}
 ${card('👶','Golden Pacifier','Bis zu drei Kinder mit selbst gewähltem Geschlecht und Talent','open','baby','Planen',!p||!p.alive||p.age<18||p.prisonYears>0||!p.relationships.some(r=>r.kind==='Partner'&&r.alive))}
 ${card('🎓','Golden Diploma',`Sofortabschlüsse: ${p?.degrees?.length||0}/2`,'open','diploma','Abschluss',!p||!p.alive||p.age<18||p.prisonYears>0||p.universityYears>0||(p.degrees?.length||0)>=2)}
 ${card('🚔','Get Out of Jail Free Card','Haftentlassung mit Löschung der Vorstrafe','premiumitem','jail-card','Nutzen',!p||!p.alive||p.prisonYears===0)}
 ${card('🌟','Hollywood Star','Sofortige Bekanntheit in bestimmten Berufen','premiumitem','hollywood-star','Aktivieren',!p||!p.alive||p.prisonYears>0||!(['writer','chef','reporter','app-developer'].includes(p.jobId||'')||p.business||actingActive(p)||musicActive(p)))}
 </div>
 ${PREMIUM_GROUPS.map(group=>`${heading(group)}<div class='premium-list'>${PREMIUM_CATALOG.filter(item=>item.group===group).map(item=>{const status=playable.includes(item.id)?'spielbar':item.status;return `<div class='premium-line'><span><b>${html(item.name)}</b><small>${html(item.description)}</small></span><span class='premium-status ${status}'>${status==='spielbar'?'Spielbar':status==='teilweise'?'Teilweise':'Offen'}</span></div>`;}).join('')}</div>`).join('')}
 <p class='small' style='padding:12px'>Quellen und Einschränkungen: docs/PREMIUM_INVENTORY.md. Alle Originalmarken dienen nur als Referenz.</p>`;
}
const localePicker=()=>`${localePicker()}`;
function renderMenu(){if(premiumOpen)return renderPremium();return `${heading('Dein Projekt')}<div class="well">Eigenständige Lebenssimulation, Version 0.19.0. Alle hier implementierten Systeme sind freigeschaltet, vollständig lokal und ohne Käufe nutzbar. Die nicht implementierten BitLife-Erweiterungen werden nicht als spielbar ausgegeben.</div>
 ${heading('Sprachauswahl')}<div class="info-card locale-settings"><label for="app-language">Sprache auswählen</label><select id="app-language" name="language" aria-label="Sprache auswählen">${LANGUAGE_OPTIONS.map(option=>`<option value="${option.code}" ${language===option.code?'selected':''}>${option.label}</option>`).join('')}</select></div>
 ${heading('Sammlungen')}<div class='stack'>${card('🔦','Erbstücke','Tägliche Fundchance, Sammlung und Vererbung','heirloomopen','','Öffnen')}</div>
 ${heading('Zusatzinhalte')}<div class='stack'>${card('🎁','Premium-Inhalte','Kaufangebote, Status und kostenlose Sonderfunktionen','premiumopen','','Öffnen')}</div>
 ${heading('Admin / Charaktergestaltung')}<div class='stack'>${card('⚡','Charakter bearbeiten','Alle Charakterwerte kostenlos anpassen.','open','edit','Bearbeiten',!current||!current.person.alive)}</div>
 ${heading('Speicherstände')}<div class="stack">${card('⌑','Spielstände verwalten',`${games.length} Leben auf diesem Gerät gespeichert.`,'open','saves','Öffnen')}${card('＋','Neues Leben','Beginne eine unabhängige Geschichte.','open','new','Erstellen')}${card('⇩','Spielstand exportieren','JSON-Sicherung zum Archivieren oder auf ein anderes Gerät übertragen.','export','','Exportieren',!current)}<article class="tile"><div class="emoji">⇧</div><div class="tile-main"><div class="tile-title">Speicherstand importieren</div><div class="tile-desc">JSON-Datei mit gültigem Schema 1 wählen</div><input id="import-file" type="file" accept=".json,application/json" aria-label="Spielstand importieren"></div></article></div>
 ${heading('Audio')}<div class="info-card"><div class="row"><span class="subtle">Synthetische, lokal erzeugte UI-Töne.</span>${button(isMuted()?'Ton einschalten':'Ton ausschalten','sound','','smallbtn')}</div></div>${heading('Installation und Datenschutz')}<div class="info-card">Im iPhone-Safari auf <b>Teilen → Zum Home-Bildschirm</b> tippen. Beim ersten Aufruf müssen die Dateien online verfügbar sein. Danach funktioniert die installierte App offline. Spielstände verbleiben im Browser (IndexedDB) und werden nicht an Server übertragen.<hr class="divider">Automatische Speicherung nach jeder Aktion. <b>Wichtig:</b> Browserdaten löschen kann Spielstände entfernen. Regelmäßig exportieren.${updateReady?`<div style="margin-top:14px">${button('Update installieren','update','','button-wide')}</div>`:''}</div>
 ${heading('Referenz und Lizenz')}<div class="small">Dieses Projekt ist eine unabhängige technische Neuimplementierung mit eigener Oberfläche und eigenem Text. Es gehört nicht zu Candywriter/BitLife. Details und recherchierte Abdeckung: docs/FEATURE_MATRIX.md im Projektarchiv.</div>`;}

const editFields=(stats:Person['stats'])=>`<div class='stat-edit'>
${([{key:'happiness',label:'Glück',emoji:'😊'},{key:'health',label:'Gesundheit',emoji:'❤️'},{key:'smarts',label:'Intelligenz',emoji:'🧠'},{key:'looks',label:'Aussehen',emoji:'✨'}] as const).map(v=>`<label class='field range-field'><span>${v.emoji} ${v.label} <output class='range-value'>${stats[v.key]}%</output></span><input type='range' min='0' max='100' step='1' name='${v.key}' value='${stats[v.key]}' aria-label='${v.label}'></label>`).join('')}</div>`;
const formStats=(fields:FormData)=>({happiness:Number(fields.get('happiness')),health:Number(fields.get('health')),smarts:Number(fields.get('smarts')),looks:Number(fields.get('looks'))});

function drawDialog(){if(current?.person.pending&&current.person.alive){const ev=current.person.pending;return `<div class="overlay" role="dialog" aria-modal="true"><div class="dialog event-dialog"><div class="dialog-art" aria-hidden="true">🎲</div><div class="dialog-kicker">EREIGNIS · ${current.person.age} JAHRE</div><h2>${html(ev.heading)}</h2><p>${html(ev.detail)}</p><div class="dialog-actions">${ev.options.map(o=>button(html(o.label),'event',o.kind,'button-wide')).join('')}</div></div></div>`;}
 if(modal==='profile'&&current){const p=current.person;return `<div class='overlay profile-overlay' role='dialog' aria-modal='true' aria-label='Charaktersteckbrief'><div class='dialog profile-dialog'>
 <button class='profile-close' data-action='close' aria-label='Steckbrief schließen'>×</button>
 <div class='profile-ribbon'><span class='portrait'>${avatar(p)}</span><strong>${html(p.name)}</strong><i>Du</i></div>
 <h2>🔎 Steckbrief</h2>
 <div class='profile-facts'><p><b>Geschlecht:</b> ${html(p.gender)}</p><p><b>Alter:</b> ${p.age} Jahre</p><p><b>Herkunft:</b> ${html(p.birthCity||p.country)}, ${html(p.country)}</p><p><b>Geburtstag:</b> ${html(p.birthday||'Unbekannt')}</p><p><b>Sternzeichen:</b> ${html(p.zodiac||'Unbekannt')}</p><p><b>Beruf:</b> ${html(lifeStage(p))}</p></div>
 <div class='profile-stat-list'>${(['happiness','health','smarts','looks'] as const).map((k,i)=>`<div class='profile-stat'><b>${['Glück','Gesundheit','Intelligenz','Aussehen'][i]}</b><div class='meter'><div style='width:${p.stats[k]}%'></div></div><span>${p.stats[k]}%</span></div>`).join('')}</div>
 ${button('Schließen','close','','button-wide')}</div></div>`;}
 if(modal==='edit'&&current)return `<div class='overlay' role='dialog' aria-modal='true' aria-labelledby='edit-title'><div class='dialog'><div class='dialog-art'>⚡</div><div class='dialog-kicker'>ADMIN · EIGENE SPIELFUNKTION</div><h2 id='edit-title'>Charakter bearbeiten</h2><p>Alle vier Werte frei bestimmen. Keine In-App-Käufe oder Serververbindung.</p><form id='edit-form'>${editFields(current.person.stats)}<div class='dialog-actions'><button type='submit' class='button button-wide'>Werte übernehmen</button>${button('Abbrechen','close','','ghost button-wide')}</div></form></div></div>`;
 if(modal==='baby')return `<div class='overlay' role='dialog' aria-modal='true'><div class='dialog'><div class='dialog-art'>👶</div><h2>Familienplanung</h2><p>Anzahl, Geschlecht und Talent der Kinder bestimmen.</p><form id='baby-form'><label class='field'>Kinderzahl<select name='count'><option value='1'>Ein Kind</option><option value='2'>Zwillinge</option><option value='3'>Drillinge</option></select></label><label class='field'>Geschlecht<select name='gender'><option value='weiblich'>Weiblich</option><option value='männlich'>Männlich</option><option value='divers'>Divers</option></select></label><label class='field'>Spezialtalent<select name='talent'><option value='keines'>Keines</option><option value='musik'>Musik</option><option value='sport'>Sport</option><option value='schauspiel'>Schauspiel</option><option value='intelligenz'>Intelligenz</option></select></label><div class='dialog-actions'><button class='button button-wide' type='submit'>Familie vergrößern</button>${button('Abbrechen','close','','ghost button-wide')}</div></form></div></div>`;
 if(modal==='diploma')return `<div class='overlay' role='dialog' aria-modal='true'><div class='dialog'><div class='dialog-art'>🎓</div><h2>Golden Diploma</h2><p>Bis zu zwei verschiedene Sofortabschlüsse ohne Studienjahre.</p><form id='diploma-form'><label class='field'>Studiengang<select name='subject'>${['Ingenieurwesen','Medizin','Rechtswissenschaften','Geisteswissenschaften'].filter(d=>!current?.person.degrees?.includes(d)).map(d=>`<option value='${d}'>${d}</option>`).join('')}</select></label><div class='dialog-actions'><button class='button button-wide' type='submit'>Abschluss erhalten</button>${button('Abbrechen','close','','ghost button-wide')}</div></form></div></div>`;
 if(modal==='new')return `<div class="overlay" role="dialog" aria-modal="true"><div class="dialog"><div class="dialog-art" aria-hidden="true">👶</div><div class="dialog-kicker">NEUE GESCHICHTE</div><h2>Wer wirst du sein?</h2><p>Erstelle einen Charakter und beginne mit der Geburt.</p><form id="new-form"><label class="field">Name<input name="name" maxlength="50" placeholder="Vorname Nachname" required value="Alex Meyer"></label><label class="field">Geschlecht<select name="gender"><option value="männlich">männlich</option><option value="weiblich">weiblich</option><option value="divers">divers</option></select></label><label class="field">Geburtsland<select name="country">${opt(COUNTRIES,'Deutschland')}</select></label><details class="creator-options"><summary>⚡ Charakterwerte anpassen (kostenlos)</summary>${editFields({health:85,happiness:80,smarts:50,looks:50})}</details><div class="dialog-actions"><button type="submit" class="button button-wide">Leben beginnen</button>${current?button('Abbrechen','close','','ghost button-wide'):''}</div></form></div></div>`;
 if(modal==='saves')return `<div class="overlay" role="dialog" aria-modal="true"><div class="dialog"><div class="toolbar"><h2>Gespeicherte Leben</h2>${button('Schließen','close','','ghost smallbtn')}</div><div class="stack">${games.length?games.map(s=>`<article class="tile"><div class="tile-main"><div class="tile-title">${html(s.person.name)}</div><div class="tile-desc">${s.person.age} Jahre · Gen. ${s.person.generation}${s.person.alive?'':' · Verstorben'}</div></div>${button('Spielen','load',s.id,'smallbtn')}${button('Löschen','deleteprompt',s.id,'danger smallbtn')}</article>`).join(''):'<div class="empty">Noch keine Spielstände.</div>'}</div></div></div>`;
 if(modal==='delete')return `<div class="overlay" role="dialog" aria-modal="true"><div class="dialog"><h2>Spielstand löschen?</h2><p>Der Spielstand wird dauerhaft von diesem Gerät gelöscht. Exportiere ihn vorher, falls du ihn behalten möchtest.</p><div class="dialog-actions">${button('Ja, löschen','deleteconfirm',deleteTarget||'','danger button-wide')}${button('Abbrechen','open','saves','ghost button-wide')}</div></div></div>`;
 return '';}
function render(){const nav:[Tab,string,string][]=[['career',current&&current.person.age<18?'🧒':'💼',current&&current.person.age<18?lifeStage(current.person):'Beruf'],['assets','💰','Besitz'],['people','💕','Beziehungen'],['activities','✨','Aktivitäten']];
 const names:Record<Tab,string>={life:'Leben',career:current&&current.person.age<18?'AUSBILDUNG':'BERUF',assets:'BESITZ',people:'BEZIEHUNGEN',activities:'AKTIVITÄTEN',menu:'MENÜ'};
 root.innerHTML=`<div class="shell">${tab==='life'||!current?`<header class="topbar"><button class="header-icon" data-action="tab" data-id="menu" aria-label="Hauptmenü öffnen">☰</button><div class="brand"><span class="brand-symbol">✳</span><span>LEBENSLINIEN</span></div><span class="brand-mark">✺</span></header>`:''}
 ${current?renderProfile(current.person):''}
 ${tab!=='life'?`<header class='subscreen-header'><button class='subscreen-close' data-action='tab' data-id='life' aria-label='Schließen und zum Lebenslauf'>×</button><h1>${names[tab]}</h1></header>`:''}
 <main class="content ${tab==='life'?'content-life':'content-panel'}" id="main-content">${current?tab==='life'?renderLife(current):tab==='career'?renderCareer(current.person):tab==='people'?renderPeople(current.person):tab==='assets'?renderAssets(current.person):tab==='activities'?renderActivities(current.person):renderMenu():tab==='menu'?renderMenu():`<div class="nothing"><div class="logo-large">🌱</div><h1>Dein Leben. Deine Geschichte.</h1><p>Ein Neuanfang, unzählige Möglichkeiten: Familie, Schule, Karriere, Liebe, Geld und Entscheidungen mit Konsequenzen.</p>${localePicker()}${button('Neues Leben beginnen','open','new','button-wide')}${games.length?`<div style="margin-top:12px">${button('Gespeichertes Leben öffnen','open','saves','ghost button-wide')}</div>`:''}</div>`}</main>
 ${current&&tab==='life'?`<div class="gamefooter"><nav class="bottomnav" aria-label="Navigation">${nav.slice(0,2).map(([key,icon,label])=>`<button class="nav ${key===tab?'active':''}" data-action="tab" data-id="${key}"><i>${icon}</i><span>${label}</span></button>`).join('')}<button class="age-button" data-action="age" aria-label="Ein Jahr älter werden" ${!current.person.alive?'disabled':''}><span class="age-plus">＋</span><span>Alter</span></button>${nav.slice(2).map(([key,icon,label])=>`<button class="nav ${key===tab?'active':''}" data-action="tab" data-id="${key}"><i>${icon}</i><span>${label}</span></button>`).join('')}</nav>${renderStats(current.person)}</div>`:''}</div>${drawDialog()}${toastMessage?`<div class="notification ${toastPositive?'good':''}" role="status">${html(toastMessage)}</div>`:''}`;
 document.documentElement.lang=language==='pt'?'pt-PT':language;
 document.title=language==='en'?'Life Lines | Life Simulator':language==='pt'?'Linhas da Vida | Simulador de Vida':'Lebenslinien | Life Simulator';
 translateDOM(root,language);
}
async function action(data:Action){if(!current)return;try{const next=applyAction(current,data);await putGame(next);current=next;games=await listGames();toastMessage='';tab=data.type==='AGE'?'life':tab;render();if(data.type==='WORK'&&data.key==='apply')notify(next.person.jobId===data.id?'Vorstellungsgespräch erfolgreich. Du wurdest eingestellt.':'Absage nach dem Vorstellungsgespräch.',next.person.jobId===data.id);if(data.type==='AGE'){requestAnimationFrame(()=>{const main=document.querySelector<HTMLElement>('#main-content');if(main)main.scrollTop=main.scrollHeight;});}}catch(error){notify(error instanceof Error?error.message:'Unbekannter Fehler.');}}
function notify(text:string,positive=false){toastMessage=text;toastPositive=positive;render();setTimeout(()=>{if(toastMessage===text){toastMessage='';render();}},3500);}
root.addEventListener('submit',async e=>{const target=e.target;if(!(target instanceof HTMLFormElement)||!['new-form','edit-form','baby-form','diploma-form'].includes(target.id))return;e.preventDefault();const fields=new FormData(target);
 if(target.id==='baby-form'){await action({type:'BIRTH',count:Number(fields.get('count')) as 1|2|3,gender:String(fields.get('gender')) as Gender,talent:String(fields.get('talent')) as 'keines'|'musik'|'sport'|'schauspiel'|'intelligenz'});modal=null;render();return;}
 if(target.id==='diploma-form'){await action({type:'PREMIUM',key:'golden-diploma',subject:String(fields.get('subject')) as 'Ingenieurwesen'|'Medizin'|'Rechtswissenschaften'|'Geisteswissenschaften'});modal=null;render();return;}
 if(target.id==='edit-form'){if(!current)return;await action({type:'CUSTOMIZE',stats:formStats(fields)});modal=null;render();return;}try{const created=createLife({name:String(fields.get('name')||''),country:String(fields.get('country')||'Deutschland'),gender:String(fields.get('gender')||'divers') as Gender,stats:(target.querySelector('details.creator-options') as HTMLDetailsElement|null)?.open?formStats(fields):undefined});await putGame(created);current=created;games=await listGames();modal=null;tab='life';render();}catch(error){notify(String(error));}});
root.addEventListener('input',e=>{const t=e.target;if(!(t instanceof HTMLInputElement)||t.type!=='range')return;const output=t.closest('.range-field')?.querySelector('output');if(output)output.textContent=t.value+'%';});
root.addEventListener('change',async e=>{const target=e.target;if(target instanceof HTMLSelectElement&&target.id==='app-language'){if(!isLanguage(target.value))return;language=target.value;try{localStorage.setItem(LANGUAGE_STORAGE_KEY,language);}catch{console.warn('Language preference could not be stored.');}render();return;}if(!(target instanceof HTMLInputElement)||target.id!=='import-file'||!target.files?.[0])return;try{const imported=await importGame(target.files[0]);current=imported;games=await listGames();tab='life';modal=null;notify('Spielstand erfolgreich importiert.',true);}catch(error){notify(error instanceof Error?error.message:'Import fehlgeschlagen.');}});
root.addEventListener('click',async e=>{const target=e.target;if(!(target instanceof Element))return;const control=target.closest<HTMLElement>('[data-action]');if(!control||control instanceof HTMLButtonElement&&control.disabled)return;const kind=control.dataset.action||'';const id=control.dataset.id||'';
 if(kind==='heirloomopen'){tab='assets';assetsSection='heirlooms';render();return;}if(kind==='tab'){tab=id as Tab;premiumOpen=false;activitySection=null;assetsSection=null;relationFocus=null;playSound('tap');render();return;}if(kind==='premiumopen'){premiumOpen=true;tab='menu';render();return;}if(kind==='premiumback'){premiumOpen=false;render();return;}if(kind==='assetview'){assetsSection=id||null;render();return;}if(kind==='assetback'){assetsSection=null;render();return;}if(kind==='category'){activitySection=id||null;if((id==='school-clubs'||id==='director'||id==='politics')&&tab==='career')tab='activities';render();return;}if(kind==='relview'){relationFocus=id||null;render();return;}if(kind==='history'){historyExpanded=!historyExpanded;render();return;}if(kind==='sound'){toggleSound();render();return;}if(kind==='open'){modal=id as typeof modal;render();return;}if(kind==='close'){modal=null;render();return;}
 if(kind==='load'){try{current=await (await import('./storage/database.js')).getGame(id);tab='life';modal=null;render();}catch{notify('Spielstand konnte nicht geladen werden.');}return;}
 if(kind==='deleteprompt'){deleteTarget=id;modal='delete';render();return;}
 if(kind==='deleteconfirm'){await deleteGame(id);games=await listGames();if(current?.id===id)current=games[0]||null;modal='saves';render();return;}
 if(kind==='export'){if(current)exportGame(current);return;}
 if(kind==='update'){const reg=await navigator.serviceWorker.getRegistration();reg?.waiting?.postMessage('SKIP_WAITING');location.reload();return;}
 if(kind==='age'){playSound('year');await action({type:'AGE'});}
 else if(kind==='heirloom'){const [key,itemId]=id.split('|');await action({type:'HEIRLOOM',key:key as 'search'|'appraise'|'restore'|'sell'|'exhibit',id:itemId});}
 else if(kind==='crime'){const [key,contactId,skill]=id.split('|');await action({type:'CRIME',key:key as 'shoplift'|'pickpocket'|'burglary'|'meet'|'mentor'|'build-trust'|'crew-job'|'join'|'promote'|'leave'|'rehabilitate',contactId:contactId||undefined,skill:skill as import('./engine/types.js').CrimeType|undefined});}
 else if(kind==='work'){const [key,contactId]=id.split('|');await action({type:'WORK',key:key as 'introduce'|'talk'|'teamwork'|'conflict'|'promotion',id:contactId});}
  else if(kind==='politics'){const [key,value]=id.split('|');const get=(name:string)=>document.querySelector<HTMLSelectElement>('#politics-'+name)?.value;await action({type:'POLITICS',key:key as 'volunteer'|'launch'|'canvass'|'debate'|'advertise'|'election'|'speech'|'policy'|'resign',office:key==='launch'?get('office') as import('./engine/types.js').PoliticalOffice:undefined,party:key==='launch'?get('party') as import('./engine/types.js').PoliticalParty:undefined,policy:key==='launch'?get('policy') as import('./engine/types.js').PoliticalPolicy:key==='policy'?value as import('./engine/types.js').PoliticalPolicy:undefined,budget:key==='launch'?get('budget') as import('./engine/types.js').PoliticalBudget:undefined});}
  else if(kind==='fighter'){const [key,style]=id.split('|');await action({type:'FIGHTER',key:key as import('./engine/fighter.js').FighterAction,style:style as import('./engine/types.js').FighterStyle|undefined});}
   else if(kind==='sport'){const [key,value]=id.split('|');await action({type:'SPORT',key:key as 'train'|'tryout'|'recover'|'negotiate'|'sponsor'|'retire',sport:key==='train'?value as import('./engine/types.js').SportKind:undefined,league:key==='tryout'?value as import('./engine/types.js').SportLeague:undefined});}
  else if(kind==='director'){const [key,choice,budget]=id.split('|');await action({type:'DIRECTOR',key:key as 'study'|'start'|'cast'|'shoot'|'release'|'cancel',genre:key==='start'?choice as import('./engine/types.js').DirectorGenre:undefined,budget:key==='start'?budget as 'kurz'|'mittel'|'gross':undefined,choice:key==='cast'||key==='shoot'?choice as 'newcomers'|'stars'|'careful'|'quick':undefined});}
 else if(kind==='actor'){const sep=id.indexOf('|');await action({type:'ACTOR',key:(sep>=0?id.slice(0,sep):id) as 'lesson'|'extra'|'hire-agent'|'fire-agent'|'agent-search'|'audition'|'rehearse'|'quit',offerId:sep>=0?id.slice(sep+1):undefined});}
 else if(kind==='music'){const args=id.split('|');await action({type:'MUSIC',key:args[0] as 'practice'|'audition'|'single'|'album'|'concert'|'tour'|'promote'|'quit',mode:args[0]==='audition'?args[1] as 'Solo'|'Band':undefined,role:(args[0]==='practice'?args[1]:args[0]==='audition'?args[2]:undefined) as import('./engine/types.js').MusicRole|undefined});}
   else if(kind==='family'){const sep=id.indexOf('|');await action({type:'FAMILY',key:(sep>=0?id.slice(0,sep):id) as 'meet'|'family-day'|'apologize'|'assist'|'teach-child'|'reconcile'|'divorce'|'distance',id:sep>=0?id.slice(sep+1):undefined});}
   else if(kind==='education'){const [key,club]=id.split('|');await action({type:'EDUCATION',key:key as 'study'|'tutor'|'socialize'|'club'|'skip'|'teacher',club:club as import('./engine/types.js').SchoolRecord['club']|undefined});}
  else if(kind==='medical'){await action({type:'MEDICAL',key:id as 'checkup'|'treat'|'therapy'|'rest'});}
  else if(kind==='lifestyle'){const separator=id.indexOf('|');await action({type:'LIFESTYLE',key:(separator>=0?id.slice(0,separator):id) as 'adopt'|'fertility'|'license'|'loan'|'repay'|'accessory'|'gamble'|'identity',value:separator>=0?id.slice(separator+1):undefined});}
  else if(kind==='activity'){playSound('tap');await action({type:'ACTIVITY',key:id});}
 else if(kind==='social'){const sep=id.lastIndexOf('|');await action({type:'SOCIAL',platform:id.slice(0,sep) as import('./engine/types.js').SocialPlatform,key:id.slice(sep+1) as 'join'|'post'|'sponsor'|'delete'});}
  else if(kind==='business'){const sep=id.indexOf('|');await action({type:'BUSINESS',key:(sep<0?id:id.slice(0,sep)) as 'open'|'develop'|'market'|'hire'|'fire'|'sell'|'invest'|'withdraw',sector:sep<0?undefined:id.slice(sep+1) as import('./engine/types.js').BusinessSector});}
  else if(kind==='rental'){const sep=id.lastIndexOf('|');await action({type:'RENTAL',id:id.slice(0,sep),key:id.slice(sep+1) as 'advertise'|'repair'|'vacate'});}
  else if(kind==='investment'){
   if(id==='advisor-hire'||id==='advisor-fire')await action({type:'INVEST',key:id});
   else{const [key,assetId]=id.split('|');const quantity=Number(document.querySelector<HTMLSelectElement>('#investment-qty-'+assetId)?.value||1);await action({type:'INVEST',key:key as 'buy'|'sell',assetId,quantity});}
  }
  else if(kind==='premiumitem'){await action({type:'PREMIUM',key:id as 'jail-card'|'golden-diploma'|'hollywood-star'});}
  else if(kind==='premiumrewind'){const y=id==='selected'?Number(document.querySelector<HTMLSelectElement>('#rewind-years')?.value||1):Number(id);await action({type:'REWIND',years:y as 1|2|3|4|5});}
  else if(kind==='study')await action({type:'STUDY'});
 else if(kind==='job')await action({type:'WORK',key:'apply',id});
 else if(kind==='buy')await action({type:'BUY',id});
 else if(kind==='sell')await action({type:'SELL',id});
 else if(kind==='relation'){const delim=id.lastIndexOf('|');await action({type:'RELATION',id:id.slice(0,delim),key:id.slice(delim+1)});}
 else if(kind==='emigrate'){const sel=document.querySelector<HTMLSelectElement>('#country-select');if(sel)await action({type:'EMIGRATE',country:sel.value});}
 else if(kind==='event'){playSound('tap');await action({type:'EVENT',kind:id});}
 else if(kind==='generation')await action({type:'NEW_GENERATION',id});
});
async function init(){try{games=await listGames();current=games[0]||null;render();}catch(error){root.innerHTML=`<div class="content"><h2>Speicherung nicht verfügbar</h2><p>IndexedDB konnte nicht geöffnet werden. Bitte öffne die App über HTTPS oder localhost und erlaube dem Browser, Daten zu speichern.</p><pre>${html(String(error))}</pre></div>`;return;}if('serviceWorker'in navigator){try{const reg=await navigator.serviceWorker.register('./sw.js');if(reg.waiting){updateReady=true;render();}reg.addEventListener('updatefound',()=>{const worker=reg.installing;worker?.addEventListener('statechange',()=>{if(worker.state==='installed'&&navigator.serviceWorker.controller){updateReady=true;if(tab==='menu')render();}});});}catch(error){console.warn('Offline-Installation nicht verfügbar:',error);}}}
void init();
