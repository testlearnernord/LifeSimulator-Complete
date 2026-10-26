# Entwicklungs-Backlog

Open tasks for the future GitHub Issues board. These are **not** claimed to be existing GitHub Issues.

## P0 / Grundfunktion

- [ ] **GH-001** Repository `LifeSimulator-Complete` erstellen, Source pushen, Pages aktivieren. Akzeptanz: CI baut erfolgreich, öffentliche HTTPS-Seite öffnet auf einem iPhone.
- [ ] **QA-001** Browser-E2E auf echtem CI-Runner und anschließend physischem iOS Safari durchführen. Akzeptanz: Installation, Offline-Neustart, Export/Import, Deep-Link, Hoch-/Querformat.
- [ ] **SAVE-001** Versionierung um `schema:2` ergänzen, mit Migration und Test alter Saves. Akzeptanz: alte Spielstände laufen ohne Datenverlust.
- [ ] **QA-002** Alle Asset-/Ereignis- und Todeszustände über Millionen Simulationsschritte stressen. Akzeptanz: keine unmöglichen Zustände, kein Datenverlust.
- [ ] **UI-001** Zugänglichkeit und mobile Touch-Targets sowie sichere PWA-Update-Meldung prüfen.

## P1 / Originalreferenz

- [ ] **RESEARCH-001** Originalspiel-Referenzstand, alle Katalogeinträge, Menüs, Länder und DLC-Unterfunktionen als echte vollständige Matrix erfassen.
- [ ] **RESEARCH-002** Verifizierbare Abhängigkeiten und Formeln unabhängig nachstellen, nicht erschließen oder behaupten.
- [ ] **CORE-001** Berufsbewerbungen, Interviews, Promotions, Bildungsarten und Schul-/Berufskontakte vervollständigen.
- [ ] **CORE-002** Länder-/Steuer-/Gesundheits-/Krankheits-/Beziehungsregeln, Erbschaftslogik und Vermögensbewertung ausarbeiten.
- [ ] **CORE-003** Erweiterte Verbrechen, Gefängnis, Militär, soziale Medien, Fame und Meta-Fortschrittssysteme.
- [ ] **JOBS-001** Nachgewiesene Special Careers modular einzeln implementieren und testen.
- [ ] **EXP-001** Bestätigte Expansion Packs modular einzeln implementieren und testen.
- [ ] **EXP-002** Movie Director, Ultimate Fighter und Music Producer nach vollständiger Recherche implementieren.
- [ ] **ITEMS-001** Verifizierte besondere Items, God Mode und Time Machine funktionsfähig ergänzen.

## P2 / Langfristig

- [ ] **META-001** Achievements, Ribbons, Heirlooms und Sonderereignisse verifizieren und ergänzen.
- [ ] **I18N-001** Sprachumschaltung vorbereiten, ohne geschützte Originaltexte zu übernehmen.
- [ ] **OPS-001** CI-E2E, statische Sicherheitsprüfungen, Release-Notes und Regressionen als feste Quality Gates.
