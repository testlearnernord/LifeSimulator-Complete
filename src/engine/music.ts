import type {MusicCareer,MusicGenre,MusicRelease,MusicRole,Person,SaveGame} from './types.js';
import type {ExpansionHooks} from './expansions.js';

// Original fictional music-industry model. Not BitLife's copyrighted code, songs or tuning.
export const MUSIC_ROLES:MusicRole[]=['Gesang','Gitarre','Klavier','Schlagzeug'];
export const MUSIC_GENRES:MusicGenre[]=['Pop','Rock','Hip-Hop','Country','Electronic'];
const LABELS=['Nordlicht Records','Wellenklang Studio','Atlas Klangwerke','Sternspur Records'];
const TITLES=['Neue Horizonte','Echos der Stadt','Sternenstaub','Zwischen den Zeilen','Nordwind','Nachts unterwegs','Farben aus Licht','Zeitlos','Herzschlag','Morgenrot','Neonregen','Fernweh'];
const cap=(n:number)=>Math.max(0,Math.min(100,Math.round(n)));
const eur=(n:number)=>Math.round(n).toLocaleString('de-DE')+' €';
const pick=<T>(h:ExpansionHooks,items:readonly T[]):T=>items[Math.min(items.length-1,Math.floor(h.random()*items.length))]!;
const validMoney=(n:unknown,max:number)=>typeof n==='number'&&Number.isFinite(n)&&n>=0&&n<=max;
export const musicSkill=(p:Person,role:MusicRole)=>p.musicSkills?.[role]??0;
export const musicActive=(p:Person)=>!!p.musicCareer&&p.musicCareer.contractYears>0;
export function musicAction(s:SaveGame,key:'practice'|'audition'|'single'|'album'|'concert'|'tour'|'promote'|'quit',role:MusicRole|undefined,mode:'Solo'|'Band'|undefined,h:ExpansionHooks){
 const p=s.person;
 if(p.prisonYears>0)throw Error('Musikkarrieren können während der Haft nicht ausgeübt werden.');
 if(key==='practice'){
  if(!role||!MUSIC_ROLES.includes(role))throw Error('Unbekannte musikalische Fähigkeit.');
  if(p.age<8)throw Error('Musikunterricht gibt es ab acht Jahren.');
  const price=p.age>=18?120:0;
  if(p.cash<price)throw Error('Der Unterricht kostet 120 €.');
  h.annual('music:practice:'+role,3);p.cash-=price;
  p.musicSkills??={};
  const bonus=p.talent==='musik'?7:0;
  const improvement=5+Math.floor(h.random()*7)+bonus;
  p.musicSkills[role]=cap(musicSkill(p,role)+improvement);
  h.stat('happiness',2);
  h.log('Du hast '+role+' geübt. Deine Fertigkeit liegt bei '+p.musicSkills[role]+' %.','good');
  return;
 }
 const career=p.musicCareer;
 if(key==='audition'){
  if(p.age<18)throw Error('Professionelle Vorspiele sind ab 18 Jahren möglich.');
  if(!role||!MUSIC_ROLES.includes(role)||!mode||!['Solo','Band'].includes(mode))throw Error('Wähle eine gültige Karriere und Fähigkeit.');
  if(career&&career.contractYears>0)throw Error('Du stehst bereits unter Musikvertrag.');
  if(musicSkill(p,role)<45)throw Error('Für das Vorspielen brauchst du mindestens 45 % musikalische Fertigkeit.');
  h.annual('music:audition',3);
  const probability=Math.min(.95,(mode==='Band'?.22:.12)+musicSkill(p,role)/125);
  if(h.random()>=probability){
   h.stat('happiness',-3);
   h.log('Dein Vorspielen bei einer Plattenfirma war diesmal nicht erfolgreich.','bad');
   return;
  }
  const genre=pick(h,MUSIC_GENRES);
  const label=pick(h,LABELS);
  const royalty=mode==='Solo'?12+Math.floor(h.random()*14):6+Math.floor(h.random()*9);
  const years=3+Math.floor(h.random()*4);
  p.musicCareer={mode,role,genre,label,royalty,contractYears:years,popularity:12+Math.floor(h.random()*18),releases:career?.releases??[]};
  p.jobId=null;p.jobYears=0;p.salaryBonus=0;
  h.stat('happiness',15);
  h.log('Du hast einen '+years+'-Jahres-Vertrag als '+mode+'-Künstler/in bei '+label+' erhalten ('+genre+', '+royalty+' % Tantiemen).','good');
  return;
 }
 if(!career||career.contractYears<=0)throw Error('Du benötigst einen aktiven Musikvertrag.');
 if(key==='quit'){
  h.annual('music:quit');
  career.contractYears=0;career.popularity=cap(career.popularity-14);
  h.stat('happiness',-4);
  h.log('Du hast deinen Plattenvertrag beendet. Deine bisherigen Veröffentlichungen bleiben erhalten.','bad');
  return;
 }
 const skill=musicSkill(p,career.role);
 if(key==='single'||key==='album'){
  const isAlbum=key==='album';
  const fee=isAlbum?2500:600;
  if(p.cash<fee)throw Error('Die Produktion kostet '+eur(fee)+'.');
  if(career.releases.length>=30)throw Error('Deine Diskografie ist voll. Es sind maximal 30 Veröffentlichungen gespeichert.');
  h.annual('music:release');
  p.cash-=fee;
  const quality=cap(Math.round(skill*.65+career.popularity*.2+h.random()*45));
  const units=Math.round((isAlbum?1000:450)*(1+career.popularity/12)*(quality/40+.25)*(0.65+h.random()));
  const name=pick(h,TITLES)+(isAlbum?' (Album)':' (Single)');
  const release:MusicRelease={title:name,kind:isAlbum?'Album':'Single',year:p.age,units,quality};
  career.releases.push(release);
  const cash=Math.round(units*(isAlbum?4.5:1.1)*career.royalty/100);
  p.cash+=cash;
  const buzz=quality>=65?10:quality<30?-4:5;
  career.popularity=cap(career.popularity+buzz);
  p.fame=cap((p.fame??0)+Math.max(0,Math.round(buzz*.75)));
  h.log('Deine '+release.kind+' „'+name+'“ wurde '+units.toLocaleString('de-DE')+'-mal verkauft. Deine Tantiemen: '+eur(cash)+'.',buzz>=5?'good':'normal');
  return;
 }
 if(key==='concert'||key==='tour'){
  const tour=key==='tour';
  if(tour&&career.popularity<35)throw Error('Eine Tournee erfordert mindestens 35 % Bekanntheit in der Musikszene.');
  h.annual('music:live',tour?1:3);
  const earnings=Math.round((tour?25000:2800)*(career.popularity/35+.15)*(skill/75+.25)*(0.7+h.random()*.6));
  const costs=tour?8000:350;
  if(p.cash<costs)throw Error('Für Organisation und Proben fehlen '+eur(costs)+'.');
  p.cash+=earnings-costs;
  h.stat('health',tour?-7:-2);h.stat('happiness',tour?10:5);
  career.popularity=cap(career.popularity+(tour?9:3));
  p.fame=cap((p.fame??0)+(tour?5:2));
  h.log(tour?'Deine Tournee war ein Erfolg. Reingewinn: '+eur(earnings-costs)+'.':'Du hast ein Konzert gespielt. Reingewinn: '+eur(earnings-costs)+'.','good');
  return;
 }
 if(key==='promote'){
  if(p.cash<1200)throw Error('Für Marketing brauchst du 1.200 €.');
  h.annual('music:promote',2);p.cash-=1200;
  const gain=2+Math.round(h.random()*7);
  career.popularity=cap(career.popularity+gain);
  p.fame=cap((p.fame??0)+2);
  h.log('Deine Werbekampagne macht dich bekannter. Popularität +'+gain+' %.','good');
  return;
 }
 throw Error('Unbekannte Musikaktion.');
}
export function advanceMusic(s:SaveGame,h:ExpansionHooks){
 const p=s.person,c=p.musicCareer;
 if(!c)return;
 let royalties=0;
 for(const release of c.releases){
  const years=Math.max(0,p.age-release.year);
  const decay=Math.pow(.73,years);
  royalties+=Math.round(release.units*decay*(release.kind==='Album'?3:0.85)*(c.royalty/100));
 }
 if(royalties>0){
  p.cash+=royalties;
  h.log('Dein Musikkatalog brachte '+eur(royalties)+' an jährlichen Tantiemen ein.','good');
 }
 c.popularity=cap(c.popularity-(c.contractYears>0?3:7));
 if(c.contractYears>0){
  c.contractYears--;
  if(c.contractYears===0)h.log('Dein Plattenvertrag ist ausgelaufen. Du kannst dich erneut bewerben.');
 }
 if((p.fame??0)>0&&c.contractYears===0)p.fame=cap((p.fame??0)-2);
}
export function validMusic(p:Person):boolean{
 if(p.musicSkills!==undefined){
  if(!p.musicSkills||typeof p.musicSkills!=='object'||Array.isArray(p.musicSkills))return false;
  if(Object.keys(p.musicSkills).some(k=>!MUSIC_ROLES.includes(k as MusicRole)))return false;
  if(Object.values(p.musicSkills).some(v=>!Number.isInteger(v)||v<0||v>100))return false;
 }
 if(p.musicCareer!==undefined&&p.musicCareer!==null){
  const c=p.musicCareer;
  if(!c||!['Solo','Band'].includes(c.mode)||!MUSIC_ROLES.includes(c.role)||!MUSIC_GENRES.includes(c.genre))return false;
  if(typeof c.label!=='string'||c.label.length>80||!LABELS.includes(c.label))return false;
  if(!Number.isInteger(c.royalty)||c.royalty<0||c.royalty>40||!Number.isInteger(c.contractYears)||c.contractYears<0||c.contractYears>10)return false;
  if(!Number.isInteger(c.popularity)||c.popularity<0||c.popularity>100)return false;
  if(!Array.isArray(c.releases)||c.releases.length>30)return false;
  for(const r of c.releases){
   if(!r||typeof r.title!=='string'||r.title.length>90||!['Single','Album'].includes(r.kind)||!Number.isInteger(r.year)||r.year<0||r.year>p.age)return false;
   if(!Number.isInteger(r.units)||!validMoney(r.units,1e9)||!Number.isInteger(r.quality)||r.quality<0||r.quality>100)return false;
  }
  if(c.contractYears>0&&p.jobId!==null)return false;
 }
 return true;
}
