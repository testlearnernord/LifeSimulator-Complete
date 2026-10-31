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
