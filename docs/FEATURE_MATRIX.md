> Die vollständige vorläufige Übersicht kaufbarer Zusatzinhalte (40 Einträge) befindet sich in [PREMIUM_INVENTORY.md](PREMIUM_INVENTORY.md) und dem Quellkatalog `src/engine/premium-catalog.ts`. Quelle, Status und Vollständigkeitsgrenzen sind dort erläutert.

# Feature-Matrix – BitLife-Referenzinventar

**Referenzdatum:** 2026-10-26. **Letzter klar erkennbarer App-Store-Versionsstand:** 3.26 (die genaue Versionskennung und der Rollout können je nach Store abweichen). **Projektstand:** Lebenslinien v0.15.0 (2026-10-29).

**Status:** `S` = als eigener Mechanismus spielbar, jedoch **nicht** auf mathematische Originaltreue geprüft; `P` = teilweise umgesetzt; `O` = offen; `?` = Existenz, genaue Regeln oder Verfügbarkeit nicht abschließend verifiziert. Kein `S` beansprucht eine 1:1-Reproduktion von BitLife. **Quellen:** `A` offizieller App Store, `H` offizielles Help Center, `W` Community-Wiki (Sekundärquelle), `N` offizielle What's-New-Seite, `C` Community-Karriereliste. Durch ältere Quellen ist eine Versionszuordnung zu einzelnen Features oft nicht belegbar; das ist ausdrücklich keine vollständige Bestandsaufnahme.

| Kategorie | Referenzfeature (bestätigter Umfang, wo bekannt) | Beleg | Status | Projektstand / Grenze |
|---|---|---|---|---|
| Lebenszyklus | Geburt / Neugeborener | A | S | Neue Figur mit Eltern |
| Lebenszyklus | Jährliches Altern / Ereignisse | A | S | Altersknopf und eigene Ereignisgewichte |
| Lebenszyklus | Kindheit und Jugend | A | P | Schulübergänge, begrenzte Aktionen |
| Lebenszyklus | Erwachsenenalter / Beruf | A | P | Ab 18, kein kompletter Aktivitätskatalog |
| Lebenszyklus | Alter und Tod | A | S | Modellierte Sterblichkeitskurve |
| Lebenszyklus | Mehrere Generationen | H | S | Kinder als Nachfolger bei Tod; vereinfachte Vererbung |
| Lebenszyklus | Unbegrenzte Generationen (Bitizenship) | H | P | Im Projekt nicht monetarisiert, solange Kinder vorhanden |
| Attribute | Gesundheit | A | S | Fortschreibung durch Alter und Aktivitäten; im eigenen Editor frei einstellbar |
| Attribute | Glück | A | S | Aktivitäten / Ereignisse |
| Attribute | Intelligenz | A | S | Lernen / Bücher |
| Attribute | Aussehen | H | S | Angezeigter und veränderbarer Wert |
| Attribute | Karma, Disziplin, Willenskraft und verborgene Werte | W | ? | Weder Inventar noch Regeln bestätigt |
| Ereignisse | Entscheidungsketten | A | P | Fünf Kategorien mit 2 Optionen |
| Ereignisse | Vollständiger Ereigniskatalog | A | O | Exakte Originaltexte werden nicht übernommen |
| Ereignisse | Individuelle Glücks-/Katastrophenereignisse | A | P | Eigene Formulierungen und Wahrscheinlichkeiten |
| Familie | Eltern | A | S | Anfängliche Mutter/Vater, Beziehungen |
| Familie | Partner finden | A | S | Neue Partnerschaft |
| Familie | Heirat | A | S | Beziehungsschwelle und Kosten; vereinfachtes Modell |
| Familie | Trennung / Konflikt | A | S | Veränderte Beziehungen |
| Familie | Kinder | A | S | Baby bei bestehender Partnerschaft |
| Familie | Fruchtbarkeit / medizinische Betreuung | H | O | Keine differenzierten Systeme |
| Familie | Golden Pacifier (Kinderzahl, Geschlecht, Talente) | H | O | Kaufitem nur als Referenz |
| Beziehungen | Interaktion / Kompliment / Streit | A,H | S | Beziehungspunkte, Geschenke, gemeinsame Zeit, detaillierte Personenmenüs |
| Beziehungen | Beziehungen zu Boss/Lehrern | H | P | Eigenes Arbeitsnetz mit Chef und Kollegen; Lehrerbeziehungen weiterhin nur teilweise |
| Beziehungen | Freundschaft | A | P | Ereignisbasiert und Interaktionen |
| Schule | Schule / Schulpflicht | A | P | Altersstufen und Lernaktion |
| Schule | Universität | H,C | S | Vierjährige Ausbildung, Abschluss-Flag |
| Schule | Weitere Studienrichtungen / akademische Titel | H,C | O | Noch keine vollständigen Ausbildungspfade |
| Karriere | Klassischer Vollzeitberuf | H,C | S | Zwölf eigene Karriereprofile |
| Karriere | Bewerbung / Gehalt / Beschäftigung | H,C | P | Vorstellungsgespräch mit Absagechance, Voraussetzungen und Jahresverdienst; eigene Regeln |
| Karriere | Beförderung und Karriereleiter | H,C | P | Leistung, vier interne Stufen, Chefbeziehung, Bonus, Abmahnungen und Kündigung; keine Originalränge |
| Karriere | Teilzeitjobs | W | O | Noch nicht integriert |
| Karriere | Militär | W | O | Keine Einsätze, Laufbahnen oder Minenfelder |
| Karriere | Fame / Berühmtheit | H | O | Kein Fame-System |
| Karriere | Social Media / SoundCloud | A | P | Fünf Plattformen, Reichweite, Beiträge, Sponsoring, Bekanntheit; kein SoundCloud-Katalog, Formeln eigener Entwurf |
| Karriere | Mafia Job Pack | H,W | O | Nicht implementiert |
| Karriere | Pro Athlete Job Pack | H,W | P | Eigene Sportlaufbahn mit drei Sportarten, Training, Probetraining, fiktiven Clubs, Verträgen, Saisons, Meisterschaften und Verletzungen; keine echten Sportligen oder Originalregeln |
| Karriere | Musician Job Pack | H,W | O | Nicht implementiert |
| Karriere | Actor Job Pack | H,W | O | Nicht implementiert |
| Karriere | Politician Job Pack | H,W | P | Eigene Politikerkarriere mit fiktiven Parteien, vier Amtsebenen, Wahlkampagnen, Wahlen, Amtszeiten, Reden, politischen Vorhaben und Jahresgehältern; keine Originalformeln |
| Karriere | Business Job Pack | W | O | Nicht implementiert |
| Karriere | Street Hustler Job Pack | W | O | Nicht implementiert |
| Karriere | Astronaut Job Pack | W | O | Nicht implementiert |
| Karriere | Model Job Pack | W | O | Nicht implementiert |
| Karriere | Dealer Job Pack | W | O | Nicht implementiert |
| Karriere | Music Producer Job Pack (2026) | A | O | Offiziell im Januar 2026 erwähnt |
| Spezialmodus | Ultimate Fighter Mode (2026) | A,N | O | Kampfstil, Fighting League, 200+ Moves laut offizieller Ankündigung vom 11.06.2026 |
| Finanzen | Einkommen und Ausgaben | A | S | Jährliche Gehälter und Unterhalt, modellierte Werte |
| Finanzen | Schulden / negative Liquidität | A | P | Negativsaldo möglich, keine Kreditverträge |
| Finanzen | Loans / Kredite (2026) | A | O | Offiziell April 2026 erwähnt |
| Vermögen | Immobilien kaufen / verkaufen | A | P | 2 Immobilienprofile und Unterhalt |
| Vermögen | Fahrzeuge kaufen / verkaufen | A | P | 2 Fahrzeugprofile und Unterhalt |
| Finanzen | Investor Expansion Pack | W,A | O | Aktien, Anleihen, Krypto nicht integriert |
| Finanzen | Landlord Expansion Pack | W,A | O | Mieter/Miete/Objektmanagement nicht integriert |
| Finanzen | Black Market Expansion Pack | W | O | Schwarzmarkt-/Auktionsfunktionen fehlen |
| Finanzen | Cult Expansion Pack | W,A | O | Kult-/Gemeinschaftsmanagement fehlt |
| Finanzen | Secret Agent Expansion Pack | W | O | Agentur und Missionen fehlen |
| Finanzen | Zoo Expansion Pack | W | O | Zoo-Geschäft fehlt |
| Finanzen | Casino Expansion Pack | C | ? | Weitere Primärquellen/Plattformabgleich nötig |
| Finanzen | Outdoor Pack Collection | W | ? | Pack-Bezeichnung in Wiki, Inhalt unvollständig |
| Film | Movie Director Expansion Pack (2026) | A,N | P | Eigenes Regiestudio: Filmkurse, Genres, Budget, Casting, Dreh, Premiere, Einspielergebnis, Filmografie und Preise; keine Originalformeln oder Filmfestivals |
| Gesundheit | Arztbesuche | A | P | Gesundheit erhöht, Krankheiten fehlen |
| Gesundheit | Fitnessstudio | A | S | Gesundheits-/Aussehenswirkung |
| Gesundheit | Krankheiten / Therapien | A | O | Kein spezifischer Krankheitskatalog |
| Gesundheit | Promiscuity Potion | H | O | Offizielles Item, STD-Schutz |
| Delikte | Diebstahl / Risiko | A | S | Zufall: Geld oder Haft, vereinfachtes Modell |
| Delikte | Polizeikontakt / Gefängnis | A,W | P | Haftjahre, Akteneintrag, gesondertes Haftmenü, kein Straftat-Spam in Haft |
| Delikte | Bankraub / Schmuggel | A | O | Offiziell im Store aufgeführt |
| Delikte | Haftentlassung / Get Out Of Jail Free Card | H | P | Reguläre Entlassung ja, Sonderitem nein |
| Reisen | Auswanderung | H | S | Länderwahl, Kosten, Job endet |
| Reisen | Urlaub | W | P | Einfache Reiseaktion mit Kosten und Glückseffekt; kein Reisekatalog |
| Gefängnis | Haftalltag / Bibliothek / Hof / Job | W | P | Haftbereich mit eigenen Aktivitäten und jährlichen Grenzen, kein Fluchtsystem |
| Aktivitäten | Körper und Geist / Freizeit | W | P | Fitness, Bücher, Bibliothek, Meditation, Arzt, Spaziergang, Ehrenamt, Lotterie |
| Delikte | Taschendiebstahl / Ladendiebstahl / Einbruch | W | P | Drei eigene Risiko-Modelle; keine exakt verifizierten Originalformeln |

| Reisen | Golden Passport | H | O | Offizielles Premium-Item |
| Sonderfunktionen | God Mode | H | P | Vier sichtbare Charakterwerte frei anpassbar, andere Aspekte noch offen |
| Sonderfunktionen | Bitizenship | H | P | Spielfunktionen nicht monetarisiert |
| Sonderfunktionen | Boss Mode | H | O | Kein künstliches Paywall-System, Job-Packs fehlen |
| Sonderfunktionen | Hollywood Star | H | O | Item und sofortige Berühmtheit fehlen |
| Sonderfunktionen | Assassin's Blade | H | O | Sonderitem fehlt |
| Sonderfunktionen | Aura Ring (2026) | A | O | Beziehungs-Item offiziell im März 2026 erwähnt |
| Sonderfunktionen | Time Machine | H,A | O | In-Game-Rücksprung fehlt |
| Meta | Season / BitPass (historisch) | N | O | Offiziell am 14.08.2026 eingestellt; keine Priorität für eine neue Live-Season-Infrastruktur |
| Meta | Achievements, Heirlooms, Ribbons | H | O | Kein Meta-Fortschritt |
| Meta | Mehrere gespeicherte Leben | H | S | Pro Leben ein lokaler IndexedDB-Datensatz |
| Meta | Speicherung / Wiederaufnahme | H | S | Auto-Save nach jeder Aktion |
| Meta | Sprache/Internationalisierung | H,A | P | UI derzeit deutsch, keine Lokalisierung |
| Meta | Monetarisierung / Ad Removal | H | S | Keine Werbung, keine In-App-Käufe |

## Aktualisierung 28.10.2026

- **Season/BitPass:** Die offizielle Meldung [End of Seasons](https://bitlifeapp.com/whats-new/end-of-seasons) vom 14.08.2026 bestätigt das Ende der Seasons. Dieser historische Funktionsumfang bleibt als Referenz dokumentiert, ist aber keine aktive Entwicklungspriorität.
- **Profisport und Meta:** Das [offizielle Help Center](https://bitlifeapp.com/help/) bestätigt Pro Athlete als Job Pack sowie Achievements, Heirlooms und Ribbons. Diese bleiben offen, bis eigene spielbare Systeme samt UI, Save-Kompatibilität und Tests vorliegen.

### 0.13.0: Profisport als eigenständiges Teilmodell

- Fußball, Basketball und Handball ab 8 Jahren trainieren; ab 18 sind Probetrainings in zwei fiktiven Ligen möglich. Gehaltsverhandlungen, Sponsoring, Saisonresultate, Meisterschaften, Verletzungen, Rehabilitation und Rücktritt haben Spielstandswirkungen.
- Vertragsgehälter werden beim Jahreswechsel netto gezahlt, ältere Spielstände ohne `sportCareer` bleiben gültig. Zeitreise erfasst den neuen Zustand.
- Referenz für die Existenz der **Pro Athlete**-Karriere: [offizielles BitLife-Help-Center](https://bitlifeapp.com/help/). Ligen, Vereine, Zahlen und Wahrscheinlichkeiten sind **eigene Entwürfe**. Kein Anspruch auf Vollständigkeit, kein echtes Lizenzpaket.

### 0.14.0: Arbeitswelt mit Vorstellungsgesprächen und Teambeziehungen

- Bewerbungen für zwölf reguläre Berufsprofile mit maximal drei Gesprächen jährlich, Zusagen und Absagen. Das vorherige Arbeitsverhältnis bleibt bei einer Absage bestehen.
- Chef und zwei Kollegen mit Bindung und Fachkompetenz; Gespräche, Teamarbeit, Konflikte, vier Karrierestufen, Gehaltsaufschläge, jährliche Leistungsbeurteilung, Abmahnungen und Kündigung.
- Bestehende Saves mit `schema: 1` bleiben gültig, da `workplace` optional ist. Neue Zustände werden geprüft und beim Rückspulen als Snapshot gespeichert.
- **Referenzgrenze:** Der [offizielle App Store](https://apps.apple.com/de/app/bitlife-life-simulator/id1374403536) bestätigt Karriere und Entscheidungen als Spielbestandteil, aber nicht die konkreten Interview-/Teamformeln. Sämtliche Zahlen und Charaktere sind eigene Entwürfe. Technische Details: [WORKPLACE.md](WORKPLACE.md).
- Die [offizielle UFM-Ankündigung vom 11.06.2026](https://bitlifeapp.com/whats-new/ultimate-fighter-mode) nennt inzwischen **200+ Moves**, nicht 100+. Das UFM-System bleibt offen.

### Neu in 0.15.0: Politikerlaufbahn (eigenständig, teilweise umgesetzt)

- Aus dem offiziell bestätigten Politiker-Job-Pack wurde ein eigener, offline spielbarer Wahlkampf- und Amtsablauf entwickelt. Das [BitLife Help Center](https://bitlifeapp.com/help/) bestätigt Politiker als Spezialkarriere, liefert aber keine belegbaren Wahlformeln oder vollständigen Amtsregeln.
- Politisches Ehrenamt ab 14; vier fiktive Amtsstufen ab 18/21/30/40, politische Gruppierungen, Kampagnenbudget, Haustürgespräche, Debatten, Wahlentscheidungen, vierjährige Amtszeiten, Jahresgehälter und gespeicherte Wahlchronik.
- Wahrung der Savegame-Kompatibilität mittels optionalem `politicalCareer`-Feld (Schema 1) und bestehenden Zeitreise-Snapshots; getrennte Engine-/UI-Tests.
- **Lücken:** Original-Wahlkampfmechaniken, Regierungen je Zielland, komplexe Parteienlandschaft, Koalitionen, politische Gesetzgebung, Kampagnenspenden und Skandalketten sind nicht verifiziert bzw. noch nicht implementiert.

## Offene Fragen zur Originaltreue

- **Vollständigkeit:** Es existiert keine belastbare, umfassende, offizielle maschinenlesbare Liste sämtlicher Entscheidungen, Menüs, Gegenstände und DLC-Unteraktionen. Für eine wirklich vollständige Matrix wären systematische In-Game-Beobachtungen nötig.
- **Simulation:** Die tatsächlichen Formeln für Wahrscheinlichkeiten, Löhne, Steuern, Gesundheit, NPC-Verhalten und Ereignisgewichte sind durch diese Recherche nicht verifiziert. Die eigenen Modelle dürfen deshalb nicht als originallogisch bezeichnet werden.
- **Plattform-/Versionsunterschiede:** Die separate App „BitLife DE“ unterscheidet sich von der globalen BitLife-App und wird laut Help Center 2026 auslaufen. Primärreferenz ist die globale offizielle BitLife-App, nicht die ältere deutsche Standalone-App.
- **Recht:** Sämtliche im Projekt geschriebenen Texte, Grafiken und Audioeffekte sind eigenständig. Das Original-Branding/Original-Assets werden nicht übernommen.

## Quellenliste (URL und Referenzstand)

- **A** Candywriter, BitLife – Life Simulator, Apple App Store, Versionshistorie, abgerufen 2026-10-25: https://apps.apple.com/de/app/bitlife-life-simulator/id1374403536
- **H** BitLife Help Center, offiziellen FAQ, abgerufen 2026-10-25: https://bitlifeapp.com/help/
- **N** BitLife What's New / Movie Director, Meldung vom 2026-08-15 und aktuelle Startseitenankündigung: https://bitlifeapp.com/whats-new/movie-director-expansion-pack-is-coming-to-bitlife/ und https://bitlifeapp.com/
- **W** Community, BitLife Wiki: https://bitlife-life-simulator.fandom.com/wiki/Careers/Occupation sowie https://bitlife-life-simulator.fandom.com/wiki/Category:Expansion_Packs
- **C** Community-Karrierelexikon: https://bitlifecareers.github.io/

Die offizielle Hilfe und der App Store haben höhere Aussagekraft als Community-Seiten. Wo nur `W` oder `C` belegt ist, wurde der Nachweisgrad entsprechend herabgestuft.

### Implementiert seit 0.4.0 (eigene, nicht identische Modelle)

- **Social Media:** Profile auf fünf Plattformen, drei Posts/Jahr/Plattform, virale Ereignisse, Followerabgänge, Sponsoring ab 10.000 Followern, Bekanntheit. Referenz für die EXISTENZ solcher Systeme: [Social Media Update v1.37](https://progameguides.com/bitlife/bitlife-social-media-update-patch-notes-v1-37/). Formeln und Häufigkeiten sind eigene Implementierung.
- **Unternehmen:** Drei Branchen, private und geschäftliche Konten, Personal, Produktentwicklung, Marketing, Entnahmen, Verkauf und Insolvenz. Existenz und Kernaktivitäten: [Offizielles Help Center](https://bitlifeapp.com/help/). Branchenauswahl und Berechnung nicht exakt.
- **Vermietung:** Eigene Häuser können Inserate schalten, Mieter beherbergen, Mieteinnahmen erzielen, renoviert und geräumt werden. Referenz: [App-Store-Landlord-Erweiterung](https://apps.apple.com/de/app/bitlife-life-simulator/id1374403536). Mieten/Leerstandsdaten sind eigene Modelle.

### Implementiert seit 0.3.0, aber nicht originalgetreu

- Eigener kostenloser Admin-Editor für die vier sichtbaren Charakterwerte bei der Geburt und während eines Lebens. Er beansprucht **keine** Funktionsgleichheit mit dem vollständigen God Mode des Originals (z. B. Aussehen, Talente, Verwandten-Editor oder Adelsstatus).
- Offene DLC- und Spezialkarriereeinträge bleiben unverändert offen, bis tatsächlich spielbare Simulation, Tests und UI vorhanden sind.

### Neuer Stand 0.5.0

| Kaufoption | Status im eigenen Spiel | Tatsächlich implementiert |
|---|---|---|
| Time Machine | **S** | 15 lokale Jahres-Snapshots, Rücksprung 1–5 Jahre, auch nach Tod |
| Golden Pacifier | **P** | Bis zu Drillinge mit wählbarem Geschlecht und Talent |
| Get Out of Jail Free Card | **P** | Haftentlassung und Löschen des einfachen Strafregisters |
| Golden Diploma | **P** | Zwei Sofortabschlüsse aus vier Studienrichtungen |
| Hollywood Star | **P** | Bekanntheit in einigen Jobs und als Unternehmer |
| God Mode, Bitizenship, Boss Mode | **P** | Nur vereinzelte Teilfunktionen, nicht komplette Originalpakete |
| Investor Expansion Pack | **P** | Fiktives Depot mit fünf Klassen, Kauf/Verkauf, Marktänderungen, Dividenden und Finanzberater |
| Cult, Black Market, Zoo, Casino, Secret Agent, Ultimate Fighter | **O** | Kein vollständiges spielbares Pack |
| Movie Director | **P** | Eigenständige Filmproduktion mit Budget, Casting, Dreh, Kinoerlösen und Auszeichnungen; keine Originaltreue |

**Kein 1:1-Anspruch:** Alle fünf Mechaniken sind eigene Umsetzung bekannter Grundfunktionen. Proprietäre Parameter und viele zugehörige Inhalte fehlen. Die übrigen Kaufangebote sind nicht „kostenlos freigeschaltet“, sondern noch nicht programmiert.

## Screenshot-Abgleich 3.26.0i (27. Oktober 2026)

Details in [SCREENSHOT_GAP_ANALYSIS.md](SCREENSHOT_GAP_ANALYSIS.md).

Neu: Geburtsstadt, Sternzeichen, Elternberuf, persönliche Profilkarte, blaue Vollbild-Untermenüs, gruppierte Beziehungen, screenshotbasierte Besitz-/Activity-Listen. Neu spielbar: Adoption, Fruchtbarkeitsbehandlung, Führerschein, Kredite mit Zins und Tilgung, Identität, Accessoires und vereinfachtes Casino. Weiter offen: Museum, Auktionen, Casino-Besitz, Zoo, Racing, Vampire, Outdoor und viele Activity-Einträge.

**Wichtig:** Die Original-BitLife-Mechaniken für diese Aktivitäten sind nicht öffentlich vollständig dokumentiert. Implementierte Wahrscheinlichkeiten, Gebühren und Einschränkungen sind ein eigenes, getestetes Modell.

## Entwicklungsstand 0.7.0

| Bereich | Status | Tatsächlich spielbar |
|---|---|---|
| Schule und Zeugnis | Teilweise | Leistung, Anwesenheit, Disziplin, Lehrer, Schülerkontakte, Nachhilfe, Schwänzen und vier AGs |
| Schulabschluss | Teilweise | Abschluss mit Leistungsbewertung, modelliertes Stipendium bei Studium mit sehr guten Noten |
| Konflikte mit Mitschülern | Teilweise | Entscheidung Lehrkraft, Deeskalation oder Gegenangriff mit Folgen |
| Krankheiten | Teilweise | Erkältung, Grippe, Erschöpfung mit begrenzten jährlichen Wirkungen und Genesung |
| Arzt, Behandlung und Therapie | Teilweise | Diagnose, Behandlung, Gespräch und Erholung; noch keine komplexen Diagnosen, OPs oder Versicherungen |

Details und verbleibende Lücken: [SCHOOL_HEALTH_DESIGN.md](SCHOOL_HEALTH_DESIGN.md).

## Beziehungen und Familie: Version 0.8.0

| System | Stand | Spielbare Wirkung |
|---|---|---|
| Freundschaften | Teilweise | Neue Freunde finden, Kontakt pflegen, Vertrauen und Bindung |
| Eltern und Familie | Teilweise | Familientag, Entschuldigen, Finanzhilfe, Kontaktabbruch und Versöhnung |
| Kinder | Teilweise | Entwicklungswert, gezielte Förderung, jährlicher Unterhalt und Einfluss auf den Generationswechsel |
| Partnerschaft | Teilweise | Trennung als lebender Ex-Partner, Versöhnung, Hochzeit und modellierte Scheidung |
| Langfristige Konsequenzen | Teilweise | Kontaktpausen, schwindende Bindung, Unterhaltskosten, Familie bei der Erbschaft |

[Ausführliche technische Dokumentation](FAMILY_RELATIONSHIPS.md). Es handelt sich um eine eigenständige Simulation mit eigenen Wahrscheinlichkeiten und vereinfachten Regeln, nicht um eine vollständige Nachbildung aller BitLife-Partnerschaftsfunktionen.

## Zusatzinhalte – neuer Stand 0.9.0

| Kaufbares Original-Feature | Status in Lebenslinien | Umgesetzte Funktionen |
|---|---|---|
| Musician Job Pack | **P – teilweise spielbar** | Gesang, Instrumente, Solo/Band-Vorspiele, Verträge, Pop/Rock/Hip-Hop/Country/Electronic, Singles/Alben, Diskografie, Konzerte, Tourneen, Tantiemen und eigene Popularität |
| Music Producer Job Pack | **O – offen** | Keine Produzentenkarriere, Künstlerverträge, Kollaborationen oder eigene Musiklabels |
| Actor, Astronaut, Mafia, Model, Politician, Pro Athlete, Street Hustler | **O – offen** | Karriere-Packs sind noch nicht im erforderlichen Umfang implementiert |

Vollständige Einordnung und Quellen: [MUSICIAN_CAREER.md](MUSICIAN_CAREER.md). Mechaniken und Erfolgswahrscheinlichkeiten sind eigene Modelle.

## Schauspielkarriere (Version 0.10.0)

| Kaufbare Original-Funktion | Status in Lebenslinien | Eigene Umsetzung |
|---|---|---|
| Actor Job Pack | **P – teilweise spielbar** | Schauspielunterricht, Komparsenarbeit, Agent, Casting, Film- und Fernsehrollen, Gagen, Auszeichnungen und Filmografie |
| Hollywood Star | **P – eigene Sonderfunktion** | Bei aktiver Schauspielrolle sofortige Bekanntheit |
| Movie Director | **P – teilweise spielbar** | Filmkurse, eigene Genres und Budgets, Besetzung, Drehentscheidungen, Premieren, Einspielergebnisse, Auszeichnungen, Filmografie; Festivals und Branchenbeziehungen fehlen |

Schauspielerkarriere enthält mehrere Staffeljahre, agentenvermittelte Castingvorschläge und konkrete Konsequenzen für Geld, Ruf und Bekanntheit. Es fehlen generierte Filmproduktionen, Agentenbeziehungen, Vertragsverhandlungen, dramatische Drehsituationen, vollständige Preise und Interaktionen. [Details und Quellen](ACTOR_CAREER.md).

## Kriminelle Laufbahn (Version 0.11.0)

| Bereich | Status | Spielmechaniken |
|---|---|---|
| Gewöhnliche Delikte | Teilweise | Drei XP-Skills, dynamisches Risiko, Fahndungsdruck und Vorstrafen |
| Haftkontakte | Teilweise | Mitgefangene, Mentoring, Vertrauen und Kontakte nach Freilassung |
| Kriminelles Netzwerk | Teilweise | Aufnahme über Kontakte, Rangstufen, abstrakte Aufträge und Verrat |
| Neustart | Teilweise | Bewährung, Ausstieg und reduzierte Haftkosten |
| Mafia Job Pack | Offen | Keine vollumfängliche Bandenkarriere, Hierarchien und Erzählketten |

[Genauer Umfang und Grenzen](CRIME_CAREER.md). Alle Regeln sind eigene Modelle.
