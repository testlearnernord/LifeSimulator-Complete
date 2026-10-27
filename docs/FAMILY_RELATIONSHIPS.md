# Familienleben und Beziehungen – v0.8.0

27. Oktober 2026. Eigenständige Umsetzung zentraler Lebenssimulationsmechaniken, **keine kopierten BitLife-Dialoge oder Berechnungsregeln**.

## Was wirklich spielbar ist

- **Neue Freundschaften:** Ab fünf Jahren können Charaktere pro Jahr zweimal versuchen, jemanden kennenzulernen. Ein erfolgreicher Kontakt erzeugt eine neue, individuelle Beziehung mit Bindung und Vertrauen; die aktive Freundesliste ist auf 20 begrenzt.
- **Bindung und Vertrauen:** Die Beziehung besitzt einen zusätzlichen optionalen Vertrauenswert (0–100). Gespräche, Geschenke, gemeinsame Zeit, Streite und Entschuldigungen beeinflussen die beiden Werte unterschiedlich.
- **Familientag:** Gemeinsame Zeit mit vorhandenen Familienmitgliedern verbessert die Bindung, für erwachsene Figuren fallen 150 € Kosten an. Ein Familientag ist einmal pro Jahr möglich.
- **Kinder:** Ein Elternteil ab 18 kann minderjährige Kinder ab fünf Jahren zweimal jährlich mit Material im Wert von 200 € fördern. Ein gespeicherter Entwicklungswert kann dadurch steigen und wird später jährlich fortgeschrieben. Minderjährige Kinder verursachen bei erwachsenen Figuren 1.200 € modellierten Jahresunterhalt pro Kind.
- **Kontaktabbrüche:** Bei Freunden und erwachsenen Verwandten kann der Kontakt beendet werden. Gespräche, Geschenke und andere gewöhnliche Interaktionen sind dann gesperrt; eine Versöhnung kann versucht werden.
- **Trennung und Scheidung:** Eine Trennung tötet einen Partner nicht mehr fälschlicherweise im Spielstand, sondern erzeugt einen **lebenden Ex-Partner**. Verheiratete Charaktere durchlaufen eine eigene Scheidung mit pauschaler Vermögensaufteilung von 25 % des verfügbaren Bargelds. Ein Ex-Partner kann unter bestimmten Bedingungen wieder zur Partnerschaft werden.
- **Finanzielle Hilfe:** Bei hinreichender Bindung und Vertrauen können Eltern und Freunde um kleinere finanzielle Unterstützung gebeten werden. Eine Zusage ist nicht garantiert.
- **Langzeitwirkung:** Der Kontakt wird mit dem Lebensalter dokumentiert. Lange Funkstille führt zu nachlassender Bindung; besonders angespannte Partnerschaften können die Stimmung beeinträchtigen.

## Menüführung

Unter **Beziehungen** erscheinen Eltern, Partner, Kinder, Freunde und frühere Partnerschaften als eigene Gruppen. Der Personensteckbrief zeigt Beziehung, Vertrauen, einen eventuellen Kontaktabbruch und bei Kindern zusätzlich ihren Entwicklungsstand. Alle neuen Aktionen werden im Untermenü der jeweiligen Person oder auf der Beziehungsübersicht angeboten.

## Technische Umsetzung

- Neue typisierte `FAMILY`-Aktionen in `src/engine/types.ts`, zentrale Regeln in `src/engine/family.ts`.
- `trust`, `estranged`, `lastContactAge` und `development` bleiben optionale Felder: ältere Spielstände laden weiterhin. Ex-Partner sind ein eigener Beziehungsstatus und bleiben lebende Personen.
- Der gesamte jährliche Zustandsübergang benutzt den vorhandenen deterministischen Spiel-Zufallszahlengenerator. Speicherstände und Zeitreise erfassen die Werte ohne externen Dienst.
- Getestet werden Trennungen, Wiederpartnerschaft im Folgejahr, Familienkosten, neue Kontakte und Jahressperren, Kinderförderung, Scheidung, Kontaktabbruch, Zustandsvalidierung und Legacy-Kompatibilität.

## Noch nicht vollständig

Komplexe Familienbäume, Kontakt zwischen Ex-Partnern nach einer Scheidung, gerichtlich ausgehandelte Unterhaltszahlungen, Sorgerecht, detaillierte Partnerschaftsereignisse, gemeinsame Immobilien, Eheverträge, Familienvermögen, Lebzeiten-Generationswechsel und mehrstufige Erbschaften fehlen weiterhin. Geld-/Scheidungsbeträge sind **eigene Näherungswerte**, keine Behauptung über reale Gesetze.
