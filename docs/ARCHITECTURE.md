# Architektur und Qualität

## Schichten

1. `src/engine/catalog.ts` enthält originär erstellte Welt-/Job-/Asset-Kataloge.
2. `src/engine/types.ts` definiert die versionierte Struktur `SaveGame` (`schema:1`) und ausführbare Aktionen.
3. `src/engine/simulation.ts` ist eine vom DOM getrennte, deterministisch zufallsgesteuerte Zustandsmaschine (`createLife`, `applyAction`). Sie gibt immer eine neue Kopie des Spielstands zurück oder wirft einen erklärten Fehler.
4. `src/storage/database.ts` kapselt IndexedDB. Schreiben erfolgt nach jeder validen Aktion, Lesen/Import validiert Schema 1.
5. `src/main.ts` rendert semantische HTML-Ansichten als DOM mit eigenem CSS. Alle Texte, die vom Nutzer oder vom Speicherstand kommen, werden vor HTML-Einfügung escaped.
6. `public/sw.js` hält PWA-Ressourcen offline vor und verwendet Cache-Versionsnamen. `public/manifest.webmanifest` definiert die Homescreen-App.

**Architekturentscheidung:** Native DOM + TypeScript statt React/Vite. Dadurch gibt es weder Laufzeitpakete noch Abhängigkeiten von öffentlichen Registern, keine Cloud-API, und selbst Builds können mit einem einzigen installierten TypeScript-Compiler erzeugt werden. Der Nutzer bevorzugte React/Vite, aber dies ist eine bewusst reduzierte Lösung für die erste lauffähige Version. Eine spätere Umstellung bleibt möglich. Es ist **kein** React-/Vite-Projekt.

## Zustandsübergänge

- `applyAction(save, action)` prüft Schema und Zustandsvoraussetzungen.
- Eine Aktion mutiert nur die geklonte Struktur; Originalzustand bleibt unverändert.
- RNG-State liegt im Savegame und erlaubt reproduzierbare zukünftige Entwicklungen unter gleichem Stand und gleicher Folge von Aktionen.
- Eine offene Ereignisentscheidung blockiert sämtliche anderen Aktionen bis zur Auflösung.
- Geschäftsvorfälle, Attribute, Beziehungen, Jahre, Todesfälle und Ereignistexte werden gemeinsam im Savegame verwaltet.

## Stabilität und Grenzen

- `isSaveGame` validiert wichtige Eigenschaften (Schema, numerische Stats, Datensätze); vollständige relationale Tiefenvalidierung ist eine spätere Aufgabe.
- Version `schema:1` ist eindeutig erkennbar; es existiert **noch keine** nötige Alt-Schema-Migration, und keine ausgearbeitete Migration zu hypothetischem Schema 2. Vor künftigen Schemaänderungen müssen Transaktions-/Migrationstests eingeführt werden.
- Die Build-Pipeline erzeugt einen Cache-Identifier aus Paketversion und SHA-256 der Ausgabe, sodass geänderte Dateien beim nächsten Release automatisch einen neuen Cache erhalten.
- IndexedDB kann vom Browser bei Speicherdruck oder Löschen der Website-Daten entfernt werden; regelmäßige JSON-Exporte sind empfohlen.
- Offline-Spielbarkeit funktioniert nach erfolgreichem erstem Ladevorgang auf einer sicheren HTTPS-Origin. `http://localhost` ist für Entwicklung zugelassen.
- `ADMIN_FULL_ACCESS = true` hat keine fremde Lizenzumgehung. Alle **implementierten** Spieloptionen sind ohne Bezahlsystem zugänglich. Für ein privates Offline-Spiel ist kein echter authentifizierter Admin-Account eingerichtet.
- Sound ist lokal mit Web Audio synthetisiert; unbenutzte DLC-Funktionen sind keine Fake-Buttons.
- Mitgelieferte Tests umfassen Node-Unit-/Zustandstests sowie 80 Langzeitläufe. Die Browser-E2E-Tests sind im Repo vorbereitet, konnten hier wegen einer Browser-Navigationssperre nicht ausgeführt werden; iPhone-Safari bleibt **ungeprüft**.

## CI und Hosting

`npm run check` validiert Typen; `npm test` führt Build und `node:test` aus; `.github/workflows/ci.yml` führt die Prüfung auf GitHub aus und archiviert `dist/`. Mit `.github/workflows/deploy.yml` kann der statische Output auf GitHub Pages ausgerollt werden, sobald das Repository erstellt wurde und Pages auf **GitHub Actions** eingestellt ist.

### Kritische Folgearbeiten

1. Vollständige Feature- und DLC-Inventarisierung aus realem Spiel.
2. Verifizierung aller Mechaniken, Events, Menüs und Formeln, die zugänglich sind.
3. Integration aller gesicherten Job- und Expansion-Packs als spielbare Simulation.
4. Tiefere Savegame-Validierung, unabhängige Backups, Schema-Migrationspfad und Import-Duplikat-Tests.
5. Browser-E2E- und echte iOS-Safari-Tests, Touch-/Viewport-/A11y-Checks, Audio-/SVG-Kompatibilitätsprüfung.
6. CI-Publishing und automatische Update-Prüfung auf eigener HTTPS-Origin.
