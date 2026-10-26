// Sources and status as of 2026-10-26. Not an exhaustive claim about BitLife's rotating store.
// "teilweise" means our OWN game has some comparable mechanics, never an exact copy.
export type PremiumStatus='spielbar'|'teilweise'|'offen';
export type PremiumGroup='Freischaltungen'|'Job-Packs'|'Expansion-Packs'|'Gegenstände'|'Weitere Käufe';
export type PremiumItem={id:string;name:string;group:PremiumGroup;status:PremiumStatus;description:string;source:'official'|'community'};
export const PREMIUM_CATALOG:PremiumItem[]=[
 {id:'bitizenship',name:'Bitizenship',group:'Freischaltungen',status:'teilweise',description:'Werbefreiheit, Generationen, Haustiere, zusätzliche Kontakte und weitere Vorteile',source:'official'},
 {id:'god-mode',name:'God Mode',group:'Freischaltungen',status:'teilweise',description:'Charakterattribute und andere Charaktere bearbeiten, Talente steuern',source:'official'},
 {id:'boss-mode',name:'Boss Mode',group:'Freischaltungen',status:'teilweise',description:'Sammlung der verfügbaren und zukünftigen Job-Packs',source:'official'},
 {id:'god-bundle',name:'Bitizenship + God Mode',group:'Freischaltungen',status:'teilweise',description:'Kombinierter Kauf zweier Freischaltungen',source:'official'},
 {id:'mafia',name:'Mafia',group:'Job-Packs',status:'offen',description:'Organisierte Kriminalität als Spezialkarriere',source:'official'},
 {id:'pro-athlete',name:'Pro Athlete',group:'Job-Packs',status:'offen',description:'Professionelle Sportkarriere',source:'official'},
 {id:'musician',name:'Musician',group:'Job-Packs',status:'offen',description:'Musikindustrie und Künstlerkarriere',source:'official'},
 {id:'actor',name:'Actor',group:'Job-Packs',status:'offen',description:'Film- und Fernsehkarriere',source:'official'},
 {id:'politician',name:'Politician',group:'Job-Packs',status:'offen',description:'Politische Laufbahn und Wahlen',source:'official'},
 {id:'astronaut',name:'Astronaut',group:'Job-Packs',status:'offen',description:'Weltraumkarriere',source:'community'},
 {id:'model',name:'Model',group:'Job-Packs',status:'offen',description:'Modelagentur und Laufsteg',source:'community'},
 {id:'street-hustler',name:'Street Hustler',group:'Job-Packs',status:'offen',description:'Straßenauftritte und Hustles',source:'community'},
 {id:'dealer',name:'Dealer',group:'Job-Packs',status:'offen',description:'Krimineller Dealer-Karrierepfad',source:'community'},
 {id:'business',name:'Business',group:'Job-Packs',status:'teilweise',description:'Unternehmensführung mit Produkt- und Personalentscheidungen',source:'official'},
 {id:'music-producer',name:'Music Producer',group:'Job-Packs',status:'offen',description:'Tracks produzieren und Künstler betreuen',source:'official'},
 {id:'landlord',name:'Landlord',group:'Expansion-Packs',status:'teilweise',description:'Immobilien vermieten und Mieter verwalten',source:'official'},
 {id:'investor',name:'Investor',group:'Expansion-Packs',status:'teilweise',description:'Aktien, Fonds, Anleihen, Penny Stocks, Krypto und Finanzberater im eigenen Marktsystem',source:'official'},
 {id:'cult',name:'C.U.L.T.',group:'Expansion-Packs',status:'offen',description:'Kult mit eigenen Anhängern führen',source:'official'},
 {id:'black-market',name:'Black Market',group:'Expansion-Packs',status:'offen',description:'Spezielle Handels- und Auktionsmechaniken',source:'official'},
 {id:'movie-director',name:'Movie Director',group:'Expansion-Packs',status:'offen',description:'Filme drehen, Besetzung und Produktionsentscheidungen',source:'official'},
 {id:'secret-agent',name:'Secret Agent',group:'Expansion-Packs',status:'offen',description:'Agentur mit Spionageeinsätzen',source:'community'},
 {id:'zoo',name:'Zoo',group:'Expansion-Packs',status:'offen',description:'Tierpark verwalten',source:'community'},
 {id:'casino',name:'Casino',group:'Expansion-Packs',status:'offen',description:'Casino-Management',source:'community'},
 {id:'grand-prix',name:'Grand Prix / Racing',group:'Expansion-Packs',status:'offen',description:'Rennsport-Erweiterung, Shop-Status nicht abschließend verifiziert',source:'community'},
 {id:'outdoor',name:'Outdoor Lifestyle',group:'Expansion-Packs',status:'offen',description:'Outdooraktivitäten, Shop-Status nicht abschließend verifiziert',source:'community'},
 {id:'ultimate-fighter',name:'Ultimate Fighter Mode',group:'Weitere Käufe',status:'offen',description:'Kampfsportmodus, offiziell live, Kaufzuordnung noch zu verifizieren',source:'official'},
 {id:'time-machine',name:'Time Machine',group:'Weitere Käufe',status:'offen',description:'Vergangene Lebensjahre zurückspulen',source:'official'},
 {id:'challenge-vault',name:'Challenge Vault',group:'Weitere Käufe',status:'offen',description:'Frühere Herausforderungen spielen',source:'community'},
 {id:'bitpass',name:'BitPass / Seasons (historisch)',group:'Weitere Käufe',status:'offen',description:'Seasons wurde laut Entwickler am 14. August 2026 eingestellt',source:'official'},
 {id:'golden-pacifier',name:'Golden Pacifier',group:'Gegenstände',status:'offen',description:'Geburt von bis zu Drillingen, Geschlecht und Talente wählen',source:'official'},
 {id:'jail-card',name:'Get Out of Jail Free Card',group:'Gegenstände',status:'offen',description:'Sofortige Haftentlassung und Löschung des Vorstrafenregisters',source:'official'},
 {id:'hollywood-star',name:'Hollywood Star',group:'Gegenstände',status:'offen',description:'Sofortige Bekanntheit in geeigneten Berufen',source:'official'},
 {id:'assassins-blade',name:"Assassin's Blade",group:'Gegenstände',status:'offen',description:'Nicht erwischt werden beim Mord; kein garantierter Erfolg',source:'official'},
 {id:'golden-passport',name:'Golden Passport',group:'Gegenstände',status:'offen',description:'Wahl sämtlicher unterstützter Auswanderungsländer',source:'official'},
 {id:'promiscuity-potion',name:'Promiscuity Potion',group:'Gegenstände',status:'offen',description:'Schutz vor sexuell übertragbaren Erkrankungen',source:'official'},
 {id:'golden-diploma',name:'Golden Diploma',group:'Gegenstände',status:'offen',description:'Sofortige Studienabschlüsse ohne Wartezeit',source:'community'},
 {id:'golden-piggy-bank',name:'Golden Piggy Bank',group:'Gegenstände',status:'offen',description:'Verfügbarer käuflicher Gegenstand, Wirkung nicht verifiziert',source:'official'},
 {id:'luxury-lifestyle',name:'Luxury Lifestyle',group:'Weitere Käufe',status:'offen',description:'Zusatzpaket im App Store, Details noch nicht verifiziert',source:'official'},
 {id:'golden-resume',name:'Golden Resume',group:'Gegenstände',status:'offen',description:'Kaufitem laut Community, Verfügbarkeit im aktuellen Shop nicht gesichert',source:'community'},
 {id:'friendship-bracelet',name:'Friendship Bracelet',group:'Gegenstände',status:'offen',description:'Kaufitem laut Community, Wirkung nicht hinreichend verifiziert',source:'community'}
];
export const PREMIUM_GROUPS:PremiumGroup[]=['Freischaltungen','Job-Packs','Expansion-Packs','Gegenstände','Weitere Käufe'];
