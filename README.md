# Lebenslinien: LifeSimulator-Complete

**v0.9.0 – Spielbarer, unabhängiger Offline-PWA-Start, keine 1:1-BitLife-Kopie.**

Eine deutschsprachige Lebenssimulation für Browser und iPhone. Neue Leben beginnen bei der Geburt und können über Schule, Studium, Arbeit, Beziehungen, Geld, Krankheit, Ereignisse, Besitz, Gefängnis und Generationenwechsel verlaufen. Alles, was im UI anklickbar ist, hat eine echte Zustandsänderung. Die Mechanik ist bisher eine **eigene Annäherung** an einzelne nachgewiesene Kategorien des Referenzspiels, keine exakte Reproduktion.

## Mobile-Oberfläche ab v0.2.0

Die Benutzeroberfläche orientiert sich am traditionellen Layout eines mobilen Lebenssimulators, mit **chronologischem Lebenslauf**, **Charakterprofil mit Kontostand**, **dauerhaften Statusbalken** und **zentralem Alters-Button**. Beruf, Besitz, Beziehungen und Aktivitäten liegen unmittelbar in der unteren Navigation. Hauptmenü und Rückkehr zum Lebenslauf erreichst du über die Kopfzeile.

Das Interface ist eigenständig gestaltet und verwendet keine BitLife-Originalassets. Es ist eine visuelle Annäherung, **keine 1:1-Reproduktion**. Die Simulation ist weiterhin eine frühe Version und noch weit vom vollständigen Referenzumfang entfernt.

**Live:** https://testlearnernord.github.io/LifeSimulator-Complete/

## Was jetzt spielbar ist

- Geburt, Eltern, Alterung, Schule, Gesundheit, Glück, Aussehen, Intelligenz, Lebenschronik und Tod
- Studium, acht Berufe mit Zugangsbedingungen, Lohn, Nebeneinkünften und Kosten
- Freundschaften, Dating, Heirat, Trennung, Kinder, Familienfortsetzung
- Ärzte, Fitnessstudio, Lesen, Meditation, Diebstahl, Gefängnis
- Kaufen/Verkaufen von Häusern und Autos, Auswanderung
- Lokal gespeicherte mehrere Leben, automatisches Speichern und JSON-Backup

**Nicht spielbar:** die meisten DLCs, Spezialkarrieren, Schauspielerei, Musik, Mafia, Unternehmen, Zoos, Investor, Regie und Fighter Mode, außerdem originalgetreue Formeln, grafische Assets und Sounds des Originals. Siehe [Feature-Matrix](docs/FEATURE_MATRIX.md).

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
