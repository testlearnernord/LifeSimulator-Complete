# Lebenslinien: LifeSimulator-Complete

**v0.18.0 – Spielbarer, unabhängiger Offline-PWA-Start, keine 1:1-BitLife-Kopie.**

Eine deutschsprachige Lebenssimulation für Browser und iPhone. Neue Leben beginnen bei der Geburt und können über Schule, Studium, Arbeit, Beziehungen, Geld, Krankheit, Ereignisse, Besitz, Gefängnis und Generationenwechsel verlaufen. Alles, was im UI anklickbar ist, hat eine echte Zustandsänderung. Die Mechanik ist bisher eine **eigene Annäherung** an einzelne nachgewiesene Kategorien des Referenzspiels, keine exakte Reproduktion.

## Mobile-Oberfläche ab v0.2.0

Die Benutzeroberfläche orientiert sich am traditionellen Layout eines mobilen Lebenssimulators, mit **chronologischem Lebenslauf**, **Charakterprofil mit Kontostand**, **dauerhaften Statusbalken** und **zentralem Alters-Button**. Beruf, Besitz, Beziehungen und Aktivitäten liegen unmittelbar in der unteren Navigation. Hauptmenü und Rückkehr zum Lebenslauf erreichst du über die Kopfzeile.

Das Interface ist eigenständig gestaltet und verwendet keine BitLife-Originalassets. Es ist eine visuelle Annäherung, **keine 1:1-Reproduktion**. Die Simulation ist weiterhin eine frühe Version und noch weit vom vollständigen Referenzumfang entfernt.

**Live:** https://testlearnernord.github.io/LifeSimulator-Complete/

## Was jetzt spielbar ist

- Geburt, Eltern, Alterung, Schule, Gesundheit, Glück, Aussehen, Intelligenz, Lebenschronik und Tod
- Studium, reguläre Berufe mit Bewerbungen, Vorstellungsgesprächen, Chef- und Kollegenkontakten, Teamarbeit, Abmahnungen, Beförderungen, Lohn und Kosten
- Freundschaften, Dating, Heirat, Trennung, Kinder, Familienfortsetzung
- Ärzte, Fitnessstudio, Lesen, Meditation, Diebstahl, Gefängnis
- Kaufen/Verkaufen von Häusern und Autos, Auswanderung
- Filmregie mit Budget, Casting, Dreh, Kinopremiere, Filmografie und Auszeichnungen
- Kampfsportmodus mit drei Stilen, Coach, Straßenkämpfen, Ligavertrag, Rivalen, Preisgeld und Titelverteidigung
- Profisport mit drei Sportarten, Trainingsentwicklung, Probetrainings, fiktiven Vereinen, Verträgen, Saisons, Verletzungen und Sponsoren
- Politikerkarriere mit Ehrenamt, Wahlkampfbudgets, vier Amtsebenen, Debatten, Wahlen, Zustimmungswerten und Amtsgehältern
- Erbstücke: tägliche Dachboden-Fundchance, sieben eigene Fundstücke, Seltenheit, Schätzung, Restaurierung, Verkauf und Vererbung\n- Lokal gespeicherte mehrere Leben, automatisches Speichern und JSON-Backup

**Teilweise spielbar:** Politik, Musik, Schauspiel, Profisport, Kriminalitätsnetzwerke, Unternehmen, Vermietung, Investments und Filmregie mit eigenen Regeln. **Weiterhin offen:** unter anderem Zoos, vollständiger Fighter Mode, Filmfestivals und die vollständigen DLC-Systeme; Originalformeln und Originalassets werden nicht übernommen. Siehe [Feature-Matrix](docs/FEATURE_MATRIX.md).

## Lokal installieren und starten

Voraussetzung: Node.js 20+. Zunächst `npm install`, um den fest gepinnten TypeScript-Compiler zu beziehen. Keine Runtime-Bibliotheken oder Cloud-Dienste nötig.

```bash
npm install
npm run check
npm test
npm run build
npm run serve
```

Browser: `http://localhost:4173`. `dist/` enthält die fertig gebaute Web-App. Du kannst `dist/` auf jeden statischen HTTPS-Host legen. Der Service Worker sorgt nach dem ersten vollständigen Laden für Offline-Caching.

## Auf dem iPhone

1. Repo in GitHub anlegen; Dateien hochladen, inklusive `.github/workflows` und `public`.
2. Repo **Settings → Pages → Build and deployment → Source: GitHub Actions** auswählen.
3. Nach erfolgreichem Pages-Workflow die veröffentlichte `https://...github.io/LifeSimulator-Complete/`-Adresse in iPhone-Safari öffnen.
4. Über **Teilen → Zum Home-Bildschirm** installieren.
5. Die App einmal vollständig bei bestehender Internetverbindung starten; dann kann sie ohne Netzwerk benutzt werden.

`http://` über dein lokales WLAN ist für die iPhone-PWA **nicht** ausreichend, da Service Worker eine sichere Origin voraussetzen. Keine Sideloading-Software, kein Jailbreak, kein Apple-Developer-Konto. Bei Apple-Geräten die App nicht im privaten Modus installieren und Backups exportieren, bevor Browserdaten entfernt werden.

## GitHub

Repository: https://github.com/testlearnernord/LifeSimulator-Complete

Der vollständige Quellcode ist eingecheckt. `.github/workflows/ci.yml` führt TypeScript-Prüfung, Simulationstests und einen Browser-Smoke-Test aus. `.github/workflows/deploy.yml` veröffentlicht die PWA, sobald unter **Settings → Pages → Build and deployment → Source: GitHub Actions** ausgewählt wurde. Diese einmalige Pages-Freischaltung erfordert einen manuellen Schritt im GitHub-Repository.

## Admin und Kosten

`ADMIN_FULL_ACCESS = true` in `src/engine/types.ts` steht für den vollständig kostenfreien Zugriff auf **unsere implementierten Inhalte**. Es gibt weder Konto-Login noch Käufe, Lizenzserver, Werbung oder Tracking. Dies hat nichts mit den BitLife-Kaufrechten zu tun.

## Qualität

`npm test` führt deterministische Unit-/Integrations-Zustandstests und 80 Langzeit-Lebenssimulationen durch. Die Tests laufen in Node ohne Framework. GitHub Actions wiederholt diese Tests bei Pushes und Pull Requests. Ein Playwright-Mobile-Chromium-Test ist in der CI vorbereitet, konnte in dieser Sandbox mangels erlaubter Browsernavigation nicht ausgeführt werden; iOS-Safari auf echter Hardware ist nicht getestet. Auf GitHub Actions läuft ein mobiler Chromium-E2E-Test.

Die Simulation ist urheberrechtlich und organisatorisch unabhängig von BitLife und Candywriter; Originalspiel-Inhalte werden nicht kopiert. **Versionsstand / Quellen:** siehe Feature-Matrix, recherchiert am 25.10.2026.


## Neu in 0.4.0: Drei miteinander verknüpfte Erweiterungen

- **Social Media:** Profile bei YouTube, TikTok, Instagram, Twitter und Facebook, Followerentwicklung, virale Beiträge, Bekanntheit und Sponsoren. Unter Aktivitäten → Social Media.
- **Unternehmen:** Café, Modegeschäft oder Technologieunternehmen mit getrennter Firmenkasse, Mitarbeitern, Marketing, Produktqualität, Jahresbilanz, Insolvenz und Verkauf. Unter Beruf → Eigenes Unternehmen.
- **Immobilienvermietung:** Eigene Häuser inserieren, Mieter finden, Jahresmieten erhalten, renovieren, Mietverhältnis beenden. Unter Besitz.

Die Systeme sind vollständig offline spielbare, eigene Modelle; *sie reproduzieren weder die originalen Zufallswahrscheinlichkeiten noch den kompletten Umfang der entsprechenden BitLife-Erweiterungen*. Vorhandene Spielstände bleiben nutzbar: neue Felder sind optional.

Build und Tests: `npm run check && npm test`. Der aktuelle GitHub Pages Build wird unter https://testlearnernord.github.io/LifeSimulator-Complete/ veröffentlicht. iPhone-Safari auf echter Hardware muss separat getestet werden.

## Version 0.5.0: Kaufbare Zusatzinhalte erfassen und eigenständig umsetzen

Unter **Hauptmenü → Premium-Inhalte** befindet sich ein recherchiertes Inventar von 40 bekannten Zusatzinhalten mit Status, Quellen und Hinweisen zur Originalverfügbarkeit. Fünf neue Sonderfunktionen sind tatsächlich spielbar: Time Machine, Golden Pacifier, Golden Diploma, Hollywood Star und Get Out of Jail Free Card. Die bisherigen Systeme von v0.4 (Unternehmen und Vermietung) bleiben erhalten.

**Sämtliche selbst entwickelte Inhalte sind kostenlos.** Das Projekt greift nicht auf fremde Käufe oder Lizenzen zu. Offene Shop-Angebote sind ausdrücklich keine freigeschalteten Original-DLCs.

Technische Details und Quellen: [Premium-Inventar](docs/PREMIUM_INVENTORY.md). Zeitreise speichert höchstens 15 vergangene Jahresstände; bestehende Speicherstände bleiben gültig. Weil Snapshots zusätzlich Platz benötigen, regelmäßig JSON-Backups exportieren.


### Anleger-Erweiterung (0.5.0)

Das Investor-System ist nun teilweise spielbar. Unter **Besitz → Investments** stehen fünf fiktive Anlageklassen (Aktien, Anleihen, Fonds, Penny Stocks und Kryptowährungen) mit Kauf/Verkauf, Depotwert, Jahreskursen, Dividenden/Zinsen und Finanzberater zur Verfügung. Keine echten Kurse oder exakten BitLife-Formeln. Das Depot ist in die Vermögensanzeige, Speicherstände und die Zeitreise integriert.

## Version 0.6.0: Screenshotgestützter Interface- und Gameplay-Abgleich (27.10.2026)

Auf Grundlage der echten BitLife-3.26.0i-iPhone-Screenshots wurden die **Lebenschronik, ein eigener Steckbrief, die Vollbildmenüs für Besitz, Beziehungen und Aktivitäten**, blaue Titelbalken, graue Bereichsüberschriften und altersspezifische Menüfreigaben überarbeitet. Das UI ist inspiriert, aber verwendet eigene Gestaltung, Namen und Assets.

Neu spielbare Aktivitäten mit realen Zustandsänderungen: **Adoption, Fruchtbarkeitsklinik, Führerscheinprüfung, Kredite mit 6,5 % Modellzins und jährlicher Tilgung, Identitätsangabe ändern, fünf Accessoires und einfaches Casinospiel**. Ein Neugeborener bekommt Geburtsstadt, zufälligen Geburtstag, Sternzeichen, Elternberufe und eine individuelle Geburtsgeschichte. Alte Spielstände behalten ihre Daten.

Die ausführliche Prioritäten- und Lückenübersicht steht in [SCREENSHOT_GAP_ANALYSIS.md](docs/SCREENSHOT_GAP_ANALYSIS.md). Als »offen« markierte DLCs wie Casino-Besitz, Museum, Racing und Zoo sind weiterhin keine spielbaren Features. **Keine BitLife-Originalgrafiken, Originalsounds oder Anzeigen eingebaut.**


## Lebenslinien 0.7.0 – Schul- und Gesundheitssystem (27.10.2026)

Schüler von 6 bis 17 Jahren haben jetzt ein gespeichertes Zeugnis mit **Leistungen, Anwesenheit und Disziplin**. Noten verändern sich jährlich und durch Lernen, Nachhilfe, Schwänzen oder Gespräche mit Lehrkräften. Vier Arbeitsgemeinschaften haben jeweils eigene Wirkungen. Es gibt Schulkonflikte mit Entscheidungen, eine Abschlussbewertung und ein mögliches Stipendium beim Studienbeginn.

**Gesundheit:** Erkältung, Grippe und Erschöpfung entstehen gelegentlich als Spielfolgen. Über `Aktivitäten → Arzt & Gesundheit` kannst du eine Untersuchung, Behandlung, Gesprächstherapie oder Ruhe wählen. Krankheit und Schweregrad werden gespeichert und ändern sich mit dem Lebensalter. Das System ist eine spielerische Vereinfachung, keine medizinische Auskunft.

Alle neuen Eigenschaften bleiben mit alten Speicherständen und der Time Machine kompatibel. Menüs: **Beruf → Schulalltag** oder **Aktivitäten → Schule** und **Aktivitäten → Arzt & Gesundheit**.

[Technische Umsetzung und offene Punkte](docs/SCHOOL_HEALTH_DESIGN.md)


## Version 0.8.0: Familie und Beziehungen

Unter **Beziehungen** kannst du jetzt aktiv Freundschaften schließen, gemeinsame Familientage verbringen, dich entschuldigen, bei nahestehenden Personen um finanzielle Unterstützung bitten, den Kontakt abbrechen oder eine Versöhnung versuchen. Für Kinder existieren jetzt ein gespeicherter Entwicklungswert und kostenpflichtige Förderung. Verheiratete Paare können sich scheiden lassen; eine Trennung erzeugt einen lebenden **Ex-Partner**, statt die Person aus dem Leben zu löschen. Vertrauen und längere Kontaktpausen haben dauerhafte Folgen.

Die Lebenssimulation berücksichtigt nun den Unterhalt minderjähriger Kinder. Beim Generationswechsel können Förderung, Wertpapiere und Schulden den Nachfolger beeinflussen. Sämtliche Mechaniken sind **eigenständige Näherungen**, nicht BitLife-Originalcode. Alte Spielstände bleiben kompatibel.

[Details, Grenzen und Umsetzungsnotizen](docs/FAMILY_RELATIONSHIPS.md).

## Version 0.9.0: Musiker-Job-Pack teilweise spielbar

Unter **Beruf → Musikerkarriere** oder **Aktivitäten → Musik** kannst du ab acht Jahren Gesang oder Instrumente üben und ab 18 eine professionelle Solo- oder Bandkarriere beginnen. Vorspiele führen mit ausreichender Fertigkeit und etwas Glück zu einem Vertrag. Plattenfirmen, Genres, Tantiemensätze und Vertragslaufzeiten beeinflussen die Karriere. Veröffentlichungen, Konzerte, Tourneen und Werbung verändern Ruhm, Finanzen und Popularität. Eine eigene Diskografie sowie jährliche Einnahmen älterer Aufnahmen bleiben auch nach Vertragsende erhalten.

Das System ist **für alle kostenlos** und funktioniert ohne Konto, Internet oder Lizenzkauf. Die Berechnungen, Plattenfirmen, Texte und Titel sind eigenständig entworfen. Es handelt sich ausdrücklich **noch nicht um das vollständige originale Musician Job Pack**.

[Quellen, Mechaniken und offene Funktionen](docs/MUSICIAN_CAREER.md).

## Lebenslinien 0.10.0 – Schauspielkarriere

Die kostenlose, eigenständige **Schauspielkarriere** ist in **Beruf → Schauspielkarriere** und **Aktivitäten → Schauspiel** verfügbar: Schauspielunterricht ab acht Jahren, Komparsenjobs, Talentagenten, Film- und Serien-Castings mit Rollen- und Altersanforderungen, mehrjährige Serienverträge, Produktionsgagen, Kritikerwertungen, Auszeichnungen und eine bleibende Filmografie. Ruhm und Branchenruf verändern sich mit den Aufträgen; eine feste Rolle verträgt sich nicht mit anderen Vollzeitkarrieren.

**Nicht vollständig:** Eigene Drehbuch-/Regieentscheidungen, dynamische Produktionen, Vertragsverhandlungen, Filmteams und komplexe Awards fehlen weiterhin. Alle Titel, Zahlen, Grafiken und Spielregeln sind unabhängig gestaltet, ohne BitLife-Dateien oder fremde Kauf-Lizenzen.

[Recherche und technische Dokumentation](docs/ACTOR_CAREER.md).

## Lebenslinien 0.11.0: Kriminalität mit Fortschritt und Kontakten

Die bisher starre Wahrscheinlichkeit wurde durch ein eigenes **Kriminalitäts-, Kontakt- und Unterweltkarrieresystem** ersetzt. Jetzt bestimmen Deliktart, Erfahrung, Intelligenz, Vorstrafen, Fahndungsdruck, Kontakte und eine mögliche Bewährungszeit deine Erfolgschancen. Die drei Verbrechensarten haben getrennte Fähigkeiten, die durch Versuche und Erfahrungen steigen.

Besonderer Schwerpunkt: **Mitgefangene kennenlernen, Vertrauen aufbauen, von ihren Erfahrungen lernen und die Kontakte nach der Freilassung behalten.** Mit Respekt und Kontakten werden Unterweltaufträge und Karrierestufen möglich, inklusive Verrat und Kontaktverlust. Wer aussteigen möchte, kann das Netzwerk verlassen und einen Neustart versuchen.

Während eines Haftjahres entstehen nur noch **600 € Lebenshaltungskosten** statt 6.500/9.500 €. Alte Schulden werden nicht rückwirkend verändert.

Alle neuen Aktionen sind eigene, fiktive Gameplaymechaniken unter **Aktivitäten → Kriminalität** und in den **Gefängnisaktivitäten**. Das komplette Mafia Job Pack ist noch **nicht** implementiert. [Regeln und technische Details](docs/CRIME_CAREER.md).

## Lebenslinien 0.13.0: Profisport

Unter **Beruf → Profisport** und **Aktivitäten → Profisport** kann die Spielfigur ab acht Jahren Fußball, Basketball oder Handball trainieren. Ab 18 sind Probetrainings für fiktive Regional- und Nationalligen möglich. Die Spielstärke, Fitness und Reputation beeinflussen Verträge, Gehaltsverhandlungen, Sponsoren, Saisons, Titel und Verletzungen. Sportkarrieren schließen zeitgleiche reguläre Vollzeitstellen und andere aktive Spezialverträge aus. Eine Verletzung kann die Jahressaison und die Einnahmen beeinträchtigen; Rehabilitation kostet 300 €. Verträge laufen automatisch aus, und bei Haft, Auswanderung oder Rücktritt endet die Beschäftigung.

Die Spielregeln, Sportvereine und Gehälter sind eigenständig entworfen. Die [offizielle Referenz](https://bitlifeapp.com/help/) bestätigt die Existenz des Pro Athlete Job Packs, aber nicht die hier verwendeten Formeln oder einen vollständigen Funktionsabgleich. Der neue Speicherzweig ist optional (Schema 1), und Zeitreisen sichern seine Eigenschaften.

[Details und Grenzen](docs/PRO_ATHLETE.md).

## Lebenslinien 0.15.0 – Politik

Unter **Beruf → Politikerkarriere** beziehungsweise **Aktivitäten → Politik** kannst du ab 14 politische Erfahrung sammeln und später mit eigenem Budget eine Kandidatur für vier fiktive Amtsebenen finanzieren. Haustürgespräche, Debatten und Öffentlichkeitsarbeit verändern die Chancen; die Wahl endet mit einem protokollierten Ergebnis. Nach einem Sieg führen Bürgerversammlungen und eigene politische Vorhaben zu Zustimmungsänderungen. Amtsgehälter werden jährlich bezahlt, reguläre Arbeitsverträge enden beim Wahlsieg. Nach vier Jahren steht eine erneute Kandidatur offen. Alter, Erfahrung, frühere Siege, Vorstrafen und aktive Spezialverträge beeinflussen die Zulässigkeit.

Die Mechaniken und Wahrscheinlichkeiten stammen aus eigener Entwicklung. Offiziell verifiziert ist nur die Existenz der Politiker-Spezialkarriere im [BitLife Help Center](https://bitlifeapp.com/help/), nicht die genaue Originalbalance oder Vollständigkeit. Bestehende Saves bleiben über ein optionales Feld kompatibel, Zeitreise-Snapshots speichern die neuen Zustände. [Technische Dokumentation](docs/POLITICS.md).

## Lebenslinien 0.16.0: Eigenständiger Kampfsportmodus

Unter **Aktivitäten → Kampfsport** bzw. **Beruf → Kampfsportmodus** kannst du ab 14 einen Stil trainieren, ab 16 sparren oder riskante Straßenkämpfe austragen und ab 18 über ein Ligaprobetraining zur Meisterschaft aufsteigen. Trainer, Verletzungen, Rehabilitation, Rivalen, Preisgeld, Jahresvergütung, Kampfchronik, Titelverteidigung und Ruhestand beeinflussen den Spielstand. Bestehende Saves behalten Schema 1; die Kampfkarriere ist optional und wird in Zeitreise-Snapshots erfasst. **Nicht implementiert:** interaktives MMA-Minispiel, 200+ Moves und die vollständige Originalkarriere. Quelle: [offizielle Ankündigung vom 11.06.2026](https://bitlifeapp.com/whats-new/ultimate-fighter-mode). [Technische Grenzen](docs/FIGHTER_MODE.md).

## Lebenslinien 0.17.0: Lebenswege greifen ineinander

Die wichtigsten Systeme beeinflussen sich nun stärker gegenseitig. Nach der Gefängnisentlassung entscheidest du, ob du Unterstützung für einen Neustart suchst, selbstständig bleibst oder zu alten Kontakten zurückkehrst. Schulprobleme, Konflikte am Arbeitsplatz, Beziehungskrisen und Unterweltkontakte können situative Entscheidungen auslösen, die echte Auswirkungen auf Gesundheit, Arbeit, Beziehungen und Reputation haben.

Verlässliche Familienbeziehungen können bei schlechter Stimmung helfen und schulische Leistungen unterstützen. Hoher Fahndungsdruck kann gelegentlich das Arbeitsverhältnis belasten. Anhaltender beruflicher und privater Stress kann Erschöpfung auslösen.

Die neue, standardmäßig eingeklappte **Lebenslage-Übersicht** zeigt aktuelle Risiken und Chancen anhand gespeicherter Spielwerte an. Der DLC-Katalog wurde korrigiert: **18 teilweise umgesetzt, 22 offen**, ohne 1:1-Anspruch.

[Mechaniken und offene Punkte](docs/INTERCONNECTED_LIFE.md).

## Version 0.18.0: Erbstücke und Sammlungen

Unter **Besitz → Erbstücke** sowie im **Hauptmenü → Sammlungen** findest du eine neue tägliche Suchaktion auf dem Dachboden. Sieben selbst entworfene Gegenstände haben unterschiedliche Seltenheit, Zustand und Wert. Du kannst Fundstücke schätzen, restaurieren, Freunden zeigen oder verkaufen. Sammlungen werden an die nächste Generation vererbt. Das Funddatum wird lokal gespeichert; nach einem Fund ist erst am nächsten Kalendertag eine neue Suche möglich.

Alte Spielstände bleiben unter `schema: 1` kompatibel. Zeitreise speichert die Sammlung mit. Die Zahlen und Gegenstände sind eigene Entwürfe; als offizielle Referenz ist lediglich das allgemeine Heirloom-System im [BitLife Help Center](https://bitlifeapp.com/help/) bestätigt. Details: [Erbstück-Design](docs/HEIRLOOMS.md).
