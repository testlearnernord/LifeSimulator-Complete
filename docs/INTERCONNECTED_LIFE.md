# Verzahnte Lebensentscheidungen – Lebenslinien 0.17.0

**Stand: 30.10.2026.** Eigenständige Lebenssimulation, keine Übernahme proprietärer BitLife-Algorithmen, Texte oder Grafiken.

## Warum diese Version?

Vor 0.17.0 waren die umfangreicheren Systeme für Familie, Ausbildung, Arbeitsleben, Gesundheit und Kriminalität meist unabhängig voneinander. Ein hoher Fahndungsdruck beeinflusste die Risikofunktion für Straftaten, aber kaum den normalen Arbeitsplatz. Gute Familienbeziehungen waren als einzelne Aktionen nützlich, konnten in einem schwierigen Jahr aber nicht automatisch unterstützen. Außerdem sah man dem Lebenslauf wichtige Risiken nicht unmittelbar an.

0.17.0 fügt **situative Lebensereignisse und kleine jährliche Wechselwirkungen** hinzu. Keine neuen Pflichtfelder im Savegame, alle Entscheidungen basieren auf den vorhandenen persistenten Werten.

## Neue Entscheidungen

| Auslöser | Wahlmöglichkeiten | Folgen |
|---|---|---|
| Entlassung nach einer Haftstrafe | Unterstützung suchen, selbstständiger Neustart, bei vorhandenen Kontakten Rückkehr in die alte Szene | Stimmung, Reputation, Fahndungsdruck, Respekt und Unterstützung durch Beziehungen ändern sich |
| Schulnoten unter 38 % zwischen 12 und 17 Jahren | Lernplan, Eltern um Unterstützung bitten, ignorieren | Schulnoten, Disziplin, Glück und Familienbindung ändern sich |
| Problematische Arbeitsleistung oder Chefbeziehung | Ehrliches Gespräch, Mehrarbeit oder eskalieren | Führungskraft, Karriereleistung, Gesundheit und Glück ändern sich |
| Partnerschaft mit Bindung unter 40 % | Gemeinsamer Tag, offenes Gespräch, Distanz | Bindung, Vertrauen und Glück ändern sich |
| Berufstätigkeit und aktiver Unterweltkontakt | Kontakt auf Abstand halten oder unterstützen | Fahndungsdruck, Respekt und berufliche Leistung ändern sich |
| Briefe während der Haft, sofern erreichbare Familie vorhanden ist | Antworten oder unbeantwortet lassen | Familienbindung, Vertrauen, Stimmung ändern sich |

Ereignisse verwenden denselben gespeicherten Zufallsgenerator wie das restliche Spiel. Ein neues Ereignis erscheint **anstelle eines anderen jährlichen Ereignisses**, nicht zusätzlich. Mehrjährige Entscheidungen bleiben über die existierenden Zustandsfelder nachvollziehbar.

## Jährliche gegenseitige Folgen

- Menschen mit **wenig Glück** und engen, vertrauenswürdigen Beziehungen erhalten in manchen schwierigen Lebensabschnitten etwas emotionale Unterstützung.
- **Starke familiäre Unterstützung** kann schulische Leistungen gelegentlich leicht verbessern. Dabei bleiben `schoolRecord.performance` und `grades` konsistent.
- **Hoher Fahndungsdruck** kann das Verhältnis zu einer regulären Führungskraft sowie die Arbeitsleistung beeinträchtigen.
- **Schlechte Stimmung zusammen mit beruflichen Problemen** kann zu einer anhaltenden Erschöpfung als behandelbare Krankheit führen.

Die Veränderungen sind bewusst moderat. Nicht jede kriminelle Vergangenheit muss zu Arbeitsplatzproblemen führen und eine belastete Partnerschaft kann sich verbessern oder verschlechtern.

## Neue, einklappbare Lebenslage-Übersicht

Im Lebenslauf gibt es eine kompakte **Lebenslage**. Aufgeklappt beschreibt sie bis zu drei direkt aus dem aktuellen Spielstand berechnete Signale, beispielsweise Gesundheitsprobleme, Schulden, schwache Schulnoten, Bewährung, Probleme am Arbeitsplatz, Fahndungsdruck oder verlässliche Angehörige.

- Die Übersicht liest ausschließlich die Spielwerte: kein zusätzlicher Speicherstand und keine externen Abfragen.
- Die Lebenschronik bleibt der Hauptbereich; die Übersicht ist standardmäßig zugeklappt.
- Relevante Anzeigen werden aus dem aktuellen Zustand berechnet und ändern sich nach Altersfortschritt, Ereignissen oder Rückspulen.

## Weiterhin offen

- Dynamische NPC-Biografien, beziehungsübergreifende individuelle Dialogketten und ein langfristiges soziales Netz mit Erinnerungen;
- realistische Familienbudgets, regionale Arbeitsmarkt- und Gesundheitsmodelle;
- echte iOS-Safari-Hardwaretests, verbesserte Originalgrafiken und Animationen;
- ein vollständig simuliertes Wirtschaftssystem und die fehlenden Spezialkarrieren.

## Technik und Tests

- `src/engine/lifeConnections.ts` enthält reine Lebenslage-Signale, Jahresfolgen, situative Entscheidungserstellung und Ereignisauflösung.
- `src/engine/simulation.ts` integriert die Funktionen, ohne die bestehenden `schema:1`-Spielstände zu migrieren.
- `src/main.ts` und `src/styles.css` zeigen die mobile einklappbare Übersicht.
- `src/engine/premium-catalog.ts` korrigiert fünf veraltete „offen“-Einträge auf „teilweise“: Time Machine, Golden Pacifier, Get Out of Jail Free Card, Hollywood Star und Golden Diploma.
- `tests/lifeConnections.test.mjs` prüft Ereignisfolgen, Zeitreise, alte Spielstände und Beziehungen. Die mobile E2E-Suite überprüft die neue ausklappbare Anzeige.
