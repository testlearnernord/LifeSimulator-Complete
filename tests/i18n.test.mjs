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

test('director financial timeline entries localize without mutating legacy German text',()=>{
 const cases=[
  ['Du finanzierst Zwischen den Zeilen (1) mit 8.000 € Eigenkapital.','You finance Zwischen den Zeilen (1) with €8.000 of your own capital.','Financias Zwischen den Zeilen (1) com 8.000 € de capital próprio.'],
  ['Du hast die Produktion abgebrochen. Restbudget: 4.500 €.','You cancelled the production. Remaining budget: €4.500.','Cancelaste a produção. Orçamento restante: 4.500 €.'],
  ['Die verzögerte Filmproduktion kostet weitere 320 €.','The delayed film production costs another €320.','O atraso na produção do filme custa mais 320 €.'],
  ['Das Filmprojekt wurde nach drei Jahren eingestellt. Restbudget: 7.000 €.','The film project was cancelled after three years. Remaining budget: €7.000.','O projeto cinematográfico foi cancelado após três anos. Orçamento restante: 7.000 €.']
 ];
 for(const [de,en,pt] of cases){assert.equal(translateText(de,'en'),en);assert.equal(translateText(de,'pt'),pt);assert.equal(translateText(de,'de'),de);}
});
