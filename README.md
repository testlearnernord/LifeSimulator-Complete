# Lebenslinien: LifeSimulator-Complete

**v0.3.0 – Spielbarer, unabhängiger Offline-PWA-Start, keine 1:1-BitLife-Kopie.**

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

`npm test` führt deterministische Unit-/Integrations-Zustandstests und 80 Langzeit-Lebenssimulationen durch. Die Tests laufen in Node ohne Framework. GitHub Actions wiederholt diese Tests bei Pushes und Pull Requests. Ein Playwright-Mobile-Chromium-Test ist in der CI vorbereitet, konnte in dieser Sandbox mangels erlaubter Browsernavigation nicht ausgeführt werden; iOS-Safari ist nicht getestet.

Die Simulation ist urheberrechtlich und organisatorisch unabhängig von BitLife und Candywriter; Originalspiel-Inhalte werden nicht kopiert. **Versionsstand / Quellen:** siehe Feature-Matrix, recherchiert am 25.10.2026.
