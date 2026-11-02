import test from 'node:test';
import assert from 'node:assert/strict';
import {createLife} from '../dist/app/engine/simulation.js';
import {translateText} from '../dist/app/i18n.js';

const occupations=['Verwaltungsangestellte/r','Elektriker/in','Pflegekraft','Lehrer/in','Büroangestellte/r','Koch/Köchin','Techniker/in'];

test('all parent occupations are translated without changing stable saved values',()=>{
 for(const occupation of occupations){
  for(const language of ['en','pt']){
   assert.notEqual(translateText(occupation,language),occupation);
   const text='Deine Mutter heißt Maria Costa und arbeitet als '+occupation+' (33 Jahre).';
   const translated=translateText(text,language);
   assert.ok(!translated.includes(occupation),language+': '+translated);
   assert.ok(!translated.includes('arbeitet als'),language+': '+translated);
  }
 }
 assert.equal(translateText('Deine Mutter heißt Eva Costa und arbeitet als Elektriker/in (34 Jahre).','en'),
  'Your mother is Eva Costa, works as an electrician and is 34 years old.');
 assert.equal(translateText('Dein Vater heißt Paulo Costa und arbeitet als Pflegekraft (35 Jahre).','pt'),
  'O teu pai chama-se Paulo Costa, trabalha como profissional de enfermagem e tem 35 anos.');
 assert.equal(translateText('Deine Mutter heißt Maria Costa und arbeitet als Pflegekraft (33 Jahre).','en'),
  'Your mother is Maria Costa, works as a nurse and is 33 years old.');
});

test('birth city, country, birthday and zodiac are localized inside legacy story templates',()=>{
 const story='Du wurdest in Lissabon, Portugal geboren. Du wächst bei deinen Eltern auf. Dein Geburtstag ist der 14. Januar und dein Sternzeichen ist Steinbock.';
 assert.equal(translateText(story,'en'),
  'You were born in Lisbon, Portugal. You grow up with your parents. Your birthday is 14 January, and your zodiac sign is Capricorn.');
 assert.equal(translateText(story,'pt'),
  'Nasceste em Lisboa, Portugal. Cresces com os teus pais. Fazes anos a 14 de janeiro e o teu signo é Capricórnio.');
 assert.equal(translateText('14. Januar','en'),'14 January');
 assert.equal(translateText('14. Januar','pt'),'14 de janeiro');
 assert.equal(translateText('Du wurdest in Köln, Deutschland geboren. Deine Mutter zieht dich allein groß. Dein Geburtstag ist der 2. März und dein Sternzeichen ist Fische.','pt'),
  'Nasceste em Colónia, Alemanha. A tua mãe cria-te sozinha. Fazes anos a 2 de março e o teu signo é Peixes.');
});

test('death history translates the cause, not just its sentence frame',()=>{
 const german='Du bist im Alter von 84 Jahren gestorben. Ursache: Natürliche Ursachen.';
 assert.equal(translateText(german,'en'),'You died at age 84. Cause: Natural causes.');
 assert.equal(translateText(german,'pt'),'Morreste aos 84 anos. Causa: Causas naturais.');
 assert.equal(translateText('Du bist im Alter von 46 Jahren gestorben. Ursache: Schwere gesundheitliche Probleme.','en'),
  'You died at age 46. Cause: Serious health problems.');
});

test('actual generated save histories translate without modifying old saves or random state',()=>{
 const save=createLife({name:'Locale Tester',gender:'weiblich',country:'Portugal',seed:1337});
 const original=JSON.stringify(save);
 for(const lang of ['en','pt']){
  const translated=save.person.history.map(entry=>translateText(entry.text,lang));
  assert.ok(translated.some(text=>lang==='en'?text.startsWith('You were born'):text.startsWith('Nasceste em')));
  assert.ok(translated.some(text=>lang==='en'?text.includes('works as'):text.includes('trabalha como')));
  assert.ok(translated.every(text=>!/\b(?:geboren|arbeitet als|Jahre|Sternzeichen|heißt)\b/.test(text)),translated.join(' | '));
 }
 assert.equal(JSON.stringify(save),original,'render-time localization must not rewrite save data');
});
