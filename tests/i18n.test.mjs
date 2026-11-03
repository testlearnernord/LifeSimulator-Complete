import test from 'node:test';
import assert from 'node:assert/strict';
import {initialLanguage,isLanguage,translateText,LANGUAGE_STORAGE_KEY,LANGUAGE_OPTIONS} from '../dist/app/i18n.js';
test('three supported languages are stable, persisted independently from savegame schema',()=>{
 assert.deepEqual(LANGUAGE_OPTIONS.map(x=>x.code),['de','en','pt']);
 assert.ok(isLanguage('de'));assert.ok(isLanguage('en'));assert.ok(isLanguage('pt'));
 assert.equal(isLanguage('fr'),false);
 assert.equal(initialLanguage({getItem:k=>k===LANGUAGE_STORAGE_KEY?'pt':null}),'pt');
 assert.equal(initialLanguage({getItem:k=>k===LANGUAGE_STORAGE_KEY?'de':null}),'de');
 assert.equal(initialLanguage({getItem:()=>null}),'en');
 assert.equal(initialLanguage({getItem:()=> 'not-a-locale'}),'en');
 assert.equal(initialLanguage({getItem:()=>{throw Error('Storage blocked');}}),'en');
});
test('German, English and pt-PT labels cover navigation, families, crime and events',()=>{
 assert.equal(translateText('Beziehungen','en'),'Relationships');
 assert.equal(translateText('Beziehungen','pt'),'Relações');
 assert.equal(translateText('Beruf','pt'),'Carreira');
 assert.equal(translateText('Sprachauswahl','en'),'Language');
 assert.equal(translateText('Freiheit und Neuanfang','pt'),'Liberdade e recomeço');
 assert.equal(translateText('Unterwelt und Erfahrung','en'),'Criminal underworld and experience');
 assert.equal(translateText('Gesundheit','de'),'Gesundheit');
 assert.equal(translateText('Überraschender neuer Text','en'),'Überraschender neuer Text');
});
test('dynamic years, character timeline and source preservation',()=>{
 assert.equal(translateText('Alter: 13 Jahre','en'),'Age: 13 years');
 assert.equal(translateText('Alter: 13 Jahre','pt'),'Idade: 13 anos');
 assert.equal(translateText('Du bist jetzt 35 Jahre alt.','en'),'You are now 35 years old.');
 assert.equal(translateText('Du bist jetzt 35 Jahre alt.','pt'),'Tens agora 35 anos.');
 assert.equal(translateText('23. Generation','pt'),'23.ª geração');
 assert.equal(translateText('5 Leben auf diesem Gerät gespeichert.','en'),'5 lives saved on this device.');
 assert.equal(translateText(' ▾ Ältere Lebensjahre anzeigen (20) ','en'),' ▾ Show earlier years (20) ');
});

test('director history and old save strings localize in all three languages',()=>{
 const pt=n=>new Intl.NumberFormat('pt-PT').format(n)+' €';
 const cases=[
  ['Du finanzierst Zwischen den Zeilen (1) mit 8.000 € Eigenkapital.','You finance Between the Lines (1) with €8,000 of your own money.','Financias Entrelinhas (1) com '+pt(8000)+' de capital próprio.'],
  ['Du hast die Produktion abgebrochen. Restbudget: 4.500 €.','You cancelled the production. Remaining budget: €4,500.','Cancelaste a produção. Orçamento restante: '+pt(4500)+'.'],
  ['Die verzögerte Filmproduktion kostet weitere 320 €.','The delayed film production costs another €320.','O atraso na produção do filme custa mais '+pt(320)+'.'],
  ['Das Filmprojekt wurde nach drei Jahren eingestellt. Restbudget: 7.000 €.','The film project was cancelled after three years. Remaining budget: €7,000.','O projeto cinematográfico foi cancelado após três anos. Orçamento restante: '+pt(7000)+'.'],
  ['Du hast Regie, Schnitt und Dramaturgie geübt. Regiefähigkeit: 43 %.','You practised directing, editing and storytelling. Directing skill: 43%.','Praticaste realização, montagem e dramaturgia. Competência de realização: 43%.'],
  ['Premiere von Der letzte Sommer (2): Kritik 79 %, Kinokasse 12.000 €, Rückfluss 7.440 €. Ein Filmpreis!','Premiere of The Last Summer (2): rating 79%, box office €12,000, proceeds €7,440. A film award!','Estreia de O Último Verão (2): avaliação 79%, bilheteira '+pt(12000)+', receitas '+pt(7440)+'. Um prémio de cinema!'],
  ['Premiere von Chaos im Viertel (3): Kritik 12 %, Kinokasse 5.000 €, Rückfluss 3.100 €.','Premiere of Neighbourhood Chaos (3): rating 12%, box office €5,000, proceeds €3,100.','Estreia de Caos no Bairro (3): avaliação 12%, bilheteira '+pt(5000)+', receitas '+pt(3100)+'.'],
  ['Du hast bekannte Darsteller verpflichtet.','You hired established actors.','Contrataste atores conhecidos.'],
  ['Du hast ein Nachwuchsensemble engagiert.','You hired a cast of newcomers.','Contrataste um elenco de novos talentos.'],
  ['Du hast jede Szene sorgfältig gedreht.','You filmed every scene carefully.','Filmaste cada cena com cuidado.'],
  ['Du hast den Drehplan gestrafft und Kosten gespart.','You streamlined filming and saved money.','Simplificaste as filmagens e reduziste os custos.'],
  ['Die unbekannte Stimme (9)','The Unknown Voice (9)','A Voz Desconhecida (9)']
 ];
 for(const [de,en,ptText] of cases){
  assert.equal(translateText(de,'en'),en,de+' EN');
  assert.equal(translateText(de,'pt'),ptText,de+' PT');
  assert.equal(translateText(de,'de'),de,de+' source preservation');
 }
 assert.equal(translateText('Premiere von Unbekannter Film (1): Kritik 50 %, Kinokasse 400 €, Rückfluss 200 €.','en'),
  'Premiere of Unbekannter Film (1): rating 50%, box office €400, proceeds €200.');
});

test('sports career static timeline messages display in English and European Portuguese',()=>{
 const samples=[
  ['Die Rehabilitation war erfolgreich. Du bist wieder fit.',"Rehabilitation succeeded. You are fit again.",'A reabilitação foi bem-sucedida. Já estás em forma.'],
  ['Beim Probetraining konntest du den Verein noch nicht überzeugen.',"You failed to impress the club at the tryout.",'Não conseguiste impressionar o clube no teste.'],
  ['Deine Sportverletzung ist ausgeheilt.','Your sports injury has healed.','A tua lesão desportiva está curada.'],
  ['Eine Sportverletzung zwingt dich zur Pause.','A sports injury forces you to rest.','Uma lesão desportiva obriga-te a fazer uma pausa.'],
  ['Dein Sportvertrag wurde wegen der Haft aufgelöst.','Your sports contract was terminated because you were imprisoned.','O teu contrato desportivo foi rescindido devido à prisão.'],
  ['Du beendest deine aktive Profikarriere mit 46 Jahren.','You retire from professional sport at age 46.','Terminas a carreira desportiva profissional aos 46 anos.']
 ];
 for(const [de,en,pt] of samples){
  assert.equal(translateText(de,'en'),en,de+' EN');
  assert.equal(translateText(de,'pt'),pt,de+' PT');
  assert.equal(translateText(de,'de'),de,de+' original');
 }
});
