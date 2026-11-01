# Raumfahrtlaufbahn (v0.22.0)

Eigenständiges, vollständig offline berechnetes Teilmodell einer Weltraumkarriere. Es gibt keine Übernahme von Marken, Figuren, Missionsdialogen oder Formeln aus BitLife.

## Referenz und Grenze

Die historische offizielle [BitLife-DE-App-Store-Seite](https://apps.apple.com/hu/app/bitlife-de-lebenssimulation/id1570661587) nennt den Astronauten-Job als In-App-Kauf. Das [offizielle BitLife-Help-Center](https://bitlifeapp.com/help/) bestätigt die allgemeine Existenz spezieller Job-Packs, bietet aber **keine** vollständig verifizierten Astronauten-Spielregeln. Die [Community-Wiki](https://bitlife-life-simulator.fandom.com/wiki/Astronaut) beschreibt Akademie, Missionen und Rangsystem als sekundäre Referenz. Die separate deutsche App ist nicht der aktuelle globale Client. Unsere konkreten Voraussetzungen und Zahlen sind eigene Entwürfe.

## Spielablauf

1. Ab 14 Jahren kann die Figur Raumfahrttechnik und Kondition trainieren; ab 16 Jahren den Flugsimulator. Jede Trainingsart hat drei Einheiten pro Spieljahr. Wissen, Flugpraxis und Fitness bleiben gespeichert.
2. Ab 20 Jahren ermöglicht ein Hochschulabschluss mit ausreichenden Werten die zweijährige Raumfahrtakademie (8.000 €). Beim Jahreswechsel wird der Fortschritt bewertet; bei ungenügender Vorbereitung ist ein weiteres Akademiejahr nötig. Ein erfolgreicher Abschluss bleibt auch bei einem späteren Jobwechsel erhalten.
3. Zertifizierte Figuren können sich zwischen 22 und 60 Jahren bei einem **fiktiven** Raumfahrtforschungszentrum bewerben. Bei Annahme endet die reguläre Anstellung. Parallel laufende inkompatible Spezialkarrieren sind gesperrt.
4. Als Beschäftigte erhalten sie jährlich ein Nettogehalt aus vier fiktiven Dienstgraden (48.000 bis 135.000 € brutto als Modellbasis). Messdatenforschung steigert das Forschungsprofil und kann Entdeckungen freischalten.
5. Zwei Missionen pro Spieljahr sind möglich: Satellitenwartung, Orbitalforschung und Mondsonde. Je nach Dienstgrad, Fachwissen, Flugpraxis und Fitness gelten unterschiedliche Einstiegsschwellen. Erfolge zahlen Prämien, Misserfolge führen zu Gesundheitsverlust und Verletzungspausen. Erfolgreiche Einsätze und Forschung führen zu Beförderungen. Jede Mission wird in einer Chronik gespeichert.
6. Reha, Kündigung, endgültiger Ruhestand, Auswanderung, Haft und altersbedingtes Ausscheiden beeinflussen den Vertrag. Es gibt **keine** reale Raumfahrtagentur, echte NASA/ESA-Lizenz oder behauptete Originalwahrscheinlichkeiten.

## Speicherstände, Sicherheit, Tests

- Das optionale Feld person.spaceCareer bleibt mit bestehenden schema:1-Spielständen kompatibel. Es ist keine Datenmigration alter Leben erforderlich. Neue und alte Checkpoints verwenden dieselbe Validierung.
- Die Funktion validSpace() verwirft ungültige Typen, unmögliche Werte, gefälschte Missionstypen, unplausible Altersangaben, manipulierte Prämien und widersprüchliche aktive Verträge. Missionen werden auf 60 Einträge begrenzt.
- tests/space.test.mjs deckt Altersgrenzen, Jahreslimits, Akademie, Bewerbungen, Vergütung, Missionen, Beförderung, Verletzungen, Reha, Auswanderung, Haft, Ruhestand, manipulierte Saves, Zeitreise und Übersetzungen ab.
- tests/browser_e2e.py prüft im mobilen Chromium die echte Menüinteraktion, Mission, IndexedDB-Wiederaufnahme und Offline-Neustart. **Ein echter Safari-Test auf iPhone-Hardware bleibt offen.**
- Alle neuen sichtbaren festen Texte und Meldungen sind explizit für Deutsch, Englisch und pt-PT übersetzt. Ältere Module besitzen weiterhin mögliche Lokalisierungslücken.

## Bewusst noch offen

Keine interaktiven Flug-Minispiele, Weltraumspaziergänge, Mond-/Marslandungen, Alien-Funksprüche, vollständigen Forschungskataloge, Planetenbenennung, realen Raumfahrtagenturen oder Original-Interviewfragen. Die Karriere ist ein eigenständiges spielbares Teilmodell, **keine 1:1-Nachbildung**.
