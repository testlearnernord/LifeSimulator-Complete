/** Display-only workplace history translations; existing savegame strings remain unchanged. */
export const WORK_TRANSLATIONS:readonly (readonly [string,string,string])[]=[
 ['Du hast keinen regulären Arbeitsplatz.','You do not have a regular job.','Não tens um emprego regular.'],
 ['Unbekannte Stelle.','Unknown vacancy.','Oferta de emprego desconhecida.'],
 ['Während der Haft sind Bewerbungen nicht möglich.','You cannot apply for jobs while in prison.','Não podes candidatar-te a empregos enquanto estás na prisão.'],
 ['Beende zuerst deine aktive Spezialkarriere.','End your active specialist career first.','Termina primeiro a tua carreira especializada ativa.'],
 ['Du erfüllst die Voraussetzungen noch nicht.','You do not yet meet the requirements.','Ainda não cumpres os requisitos.'],
 ['Du arbeitest bereits in diesem Beruf.','You already work in this profession.','Já trabalhas nesta profissão.'],
 ['Während der Haft kannst du nicht zur Arbeit gehen.','You cannot go to work while in prison.','Não podes ir trabalhar enquanto estás na prisão.'],
 ['Du lernst deine Führungskraft und zwei Kolleginnen oder Kollegen kennen.','You meet your manager and two colleagues.','Conheces a tua chefia e dois colegas.'],
 ['Für eine Beförderung brauchst du mindestens zwei Berufsjahre.','You need at least two years in the job to be promoted.','Precisas de pelo menos dois anos de trabalho para seres promovido.'],
 ['Du hast die höchste Stufe deiner Laufbahn erreicht.','You have reached the highest career level.','Atingiste o nível mais alto da tua carreira.'],
 ['Deine Führungskraft lehnt die Beförderung ab.','Your manager turns down your promotion.','A tua chefia recusa a promoção.'],
 ['Dieser Arbeitskontakt ist nicht mehr verfügbar.','This work contact is no longer available.','Este contacto profissional já não está disponível.'],
 ['Unbekannte Arbeitsaktion.','Unknown work action.','Ação profissional desconhecida.'],
 ['Deine Führungskraft mahnt deine schwache Arbeitsleistung an.','Your manager warns you about your poor performance.','A tua chefia adverte-te pelo teu fraco desempenho.'],
 ['Nach mehreren Abmahnungen verlierst du deinen Arbeitsplatz.','You lose your job after several warnings.','Perdes o emprego após várias advertências.']
];
export function translateWorkDynamic(source:string,lang:'en'|'pt'):string|null{
 const tr=(en:string,pt:string)=>lang==='en'?en:pt;
 let m:RegExpMatchArray|null;
 if((m=source.match(/^Das Vorstellungsgespräch für (.+) lief nicht überzeugend\. Du erhältst eine Absage\.$/)))
  return tr('Your interview for '+m[1]+' did not go well. Your application was rejected.','A entrevista para '+m[1]+' não correu bem. A tua candidatura foi rejeitada.');
 if((m=source.match(/^Du überzeugst im Bewerbungsgespräch und beginnst als (.+)\.$/)))
  return tr('You impress at the interview and start work as '+m[1]+'.','Causas boa impressão na entrevista e começas a trabalhar como '+m[1]+'.');
 if((m=source.match(/^Du wirst in Karrierestufe (\d+) befördert und erhältst einen Gehaltsaufschlag\.$/)))
  return tr('You are promoted to career level '+m[1]+' and receive a pay rise.','És promovido ao nível '+m[1]+' da carreira e recebes um aumento salarial.');
 if((m=source.match(/^Du führst ein gutes Gespräch mit (.+)\.$/)))
  return tr('You have a good conversation with '+m[1]+'.','Tens uma boa conversa com '+m[1]+'.');
 if((m=source.match(/^Du erledigst mit (.+) eine anspruchsvolle Aufgabe\.$/)))
  return tr('You complete a challenging task with '+m[1]+'.','Concluis uma tarefa exigente com '+m[1]+'.');
 if((m=source.match(/^Du gerätst am Arbeitsplatz mit (.+) aneinander\.$/)))
  return tr('You clash with '+m[1]+' at work.','Entras em conflito com '+m[1]+' no trabalho.');
 if((m=source.match(/^Ein Missverständnis im Team mit (.+) belastet die Zusammenarbeit\.$/)))
  return tr('A misunderstanding with '+m[1]+' strains teamwork.','Um mal-entendido com '+m[1]+' prejudica o trabalho em equipa.');
 return null;
}
