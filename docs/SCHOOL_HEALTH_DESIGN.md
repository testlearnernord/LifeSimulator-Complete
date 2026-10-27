# Schule und Gesundheit: v0.7.0

Stand: 27.10.2026. Eigenständig entwickelte Spielregeln, **kein** Anspruch auf identische BitLife-Wahrscheinlichkeiten oder Originaldaten.

## Schulzeit

- Beginn mit 6, Grundschule und anschließend weiterführende Schule bis 18. Alte Spielstände aus v0.1 bis v0.6 behalten ihre bisherigen Attribute und werden beim ersten Schuljahr nach dem Update mit einem plausiblen, aus `smarts` abgeleiteten Zeugniswert versehen.
- Gespeicherter `schoolRecord` umfasst **Leistung, Anwesenheit, Disziplin und eine Arbeitsgemeinschaft**. Der Notenwert wird auch über das bisherige optionale `grades`-Feld gespiegelt.
- Lernen (zweimal/Jahr) und Nachhilfe (150 €, zweimal/Jahr) steigern die Leistung. Lehrer-Feedback verbessert Disziplin; Schwänzen verschlechtert Anwesenheit, Noten und Disziplin. Soziale Kontakte verbessern die Stimmung.
- Die AG-Auswahl Sport, Musik, Technik oder Kunst bringt unterschiedliche jährliche Effekte. Schulkonflikte können durch Hilfeholen, Deeskalation oder Streiten entschieden werden; die Folgen wirken auf Stimmung/Disziplin.
- Mit 18 wird der Schulabschluss mitsamt Leistung im Lebenslauf dokumentiert. Ab 85 % Zeugniswert können Studenten beim Studienbeginn ein einmaliges, modelliertes Stipendium von 3.000 € erhalten.
- Unter `Beruf/Ausbildung` sowie `Aktivitäten → Schule` befinden sich die Menüs. Jährliche Aktionen haben unabhängige Kontingente.

## Krankheiten und medizinische Entscheidungen

- Einjährige Erkrankungen können ab dem Kindesalter zufällig auftreten und haben ein begrenztes, gespeichertes Zustandsmodell (Erkältung, Grippe, Erschöpfung, Schweregrad, Jahre, Diagnose).
- Erkrankungen haben mögliche Auswirkungen auf Gesundheit und Glück. Ein Teil klingt ohne Behandlung ab; andere brauchen mehrere Spieljahre.
- **Untersuchung**: 100 €, kann eine vorliegende Erkrankung erkennen; **Behandlung**: 350 €, nur nach Diagnose und bei Krankheit; **Gesprächstherapie**: 220 €, ab 12 Jahren; **Ruhe**: kostenlos. Alle Aktionen sind jährlich limitiert.
- `Aktivitäten → Arzt & Gesundheit` ermöglicht die Entscheidungen. Die bisherige Arztaktion bleibt verfügbar; bei Erkrankung leitet sie zur Untersuchung beziehungsweise Behandlung über.
- Medizinische Texte und Wirkungen sind reine Simulation und keine Behandlungsempfehlung.

## Speicherstände, Tests, offene Lücken

- `schoolRecord` und `illness` sind **optionale Felder** im bestehenden Savegame-Schema 1; keine erzwungene Datenmigration. Gefälschte Werte, fehlerhafte Clubnamen, nicht vorhandene Krankheiten und unmögliche Zustandswerte werden beim Laden zurückgewiesen.
- Zeitreise-Snapshots behalten sowohl Schul- als auch Krankheitszustand.
- Automatisierte Engine-Tests prüfen Schulbeginn, Leistungsfortschritt, AG-Wirkung, Fehlzeiten, Schulkonflikte, Abschluss, Therapie, Diagnose, Behandlungsentscheidung und Savegame-Kompatibilität. Der mobile Chromium-E2E-Test navigiert Schul- und Gesundheitsmenüs auf 390px Breite.
- Noch offen: Schulformen und Fachnoten, Sportteams, Lehrer-/Klassenkameraden-Beziehungen als eigene Charaktere, individuelle Zeugnisse pro Jahr, Schulverweise, umfassende Universitäten, Krankheiten mit echten Diagnosen, Ärzte, Krankenversicherungen, Operationen, Suchtbehandlungen, Schwangerschaftsversorgung und langfristige Folgeerkrankungen.
