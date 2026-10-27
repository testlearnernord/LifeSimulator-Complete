# Kriminalität, Gefängnis und Unterweltkontakte – Lebenslinien v0.11.0

Stand: 27. Oktober 2026. **Eigenes fiktives Spielsystem, keine BitLife-Originalberechnungen und keine realen Handlungsanleitungen.**

## Bisheriges Problem (bis 0.10.0)

Die drei Delikte beruhten auf einem einzigen Zufallswurf; Intelligenz, Erfolge und Erfahrung hatten keinen Einfluss. Eine Vorstrafe erhöhte das Festnahmerisiko pauschal. Pro Haftjahr fielen weiterhin die üblichen Lebenshaltungskosten von 6.500/9.500 € an. Wiederholte kleinere Delikte führten deshalb oft zur Schulden- und Haftspirale, ohne dass ein spielerischer Fortschritt möglich war.

## Neue Gameplay-Systeme

| Mechanik | Wirkung |
|---|---|
| Drei getrennte Kriminalitätsfertigkeiten | Ladendiebstahl, Taschendiebstahl und Einbruch haben eigene Werte 0–100. Erfolgreiche Handlungen geben 5–10 Punkte, gescheiterte 2–4 Punkte Erfahrung |
| Dynamischer Entdeckungswurf | Delikttyp, Fähigkeit, Intelligenz, Fahndungsdruck, Vorstrafe, Bewährung und Vertrauen in vorhandene Kontakte wirken auf das Risiko. Es bleibt mindestens 6,5 % Entdeckungsrisiko |
| Fahndungsdruck | Aktionen erhöhen den Wert. In ruhigen Jahren baut er sich ab. Ein Neustart senkt ihn zusätzlich |
| Gefängniskontakte | Inhaftierte können Mitgefangene kennenlernen. Diese bleiben nach der Entlassung gespeichert. Es gibt maximal zehn aktive Kontakte |
| Erfahrung durch Mitgefangene | Mit Haftkontakten kann während der Haft zweimal jährlich der Fortschritt in einer ausgewählten Deliktsparte verbessert werden. Mentoring steigert gleichzeitig Vertrauen |
| Kontakte außerhalb der Haft | Ab 16 Jahren sind neue Kontakte auch außerhalb des Gefängnisses möglich; Vertrauen lässt sich pflegen, kann aber sinken und Kontakte können verloren gehen |
| Kriminelles Netzwerk | Ab 18 mit ausreichend Respekt und einem Kontakt mit mindestens 35 Vertrauen möglich; drei Rangstufen über dem Außenseiter |
| Abstrakte Netzwerkaufträge | Zwei Versuche jährlich bei aktiver Netzwerkzugehörigkeit. Gewinne, Festnahmerisiko, Kontaktvertrauen und Rang wirken auf Ergebnisse. Keine operativen Tatbeschreibungen |
| Aufstieg | Neulinge können bei 38 Respekt und zwei erfolgreichen Aktionen aufsteigen, später bei 68 Respekt und fünf Erfolgen |
| Rehabilitation | Wer Abstand gewinnen möchte, kann Fahndungsdruck und Bewährungszeit zusätzlich reduzieren und das Netzwerk verlassen |
| Verrat und Kontaktverlust | Ungünstige Auftragsausgänge können Vertrauen schädigen. Lange Funkstille kann Kontakte schwächen oder beenden |
| Bewährungsphase | Nach einer Haftentlassung gelten zwei Jahre Bewährung. Das erhöht bei weiteren Delikten vorübergehend das Entdeckungsrisiko |
| Haftkosten | Während eines Haftjahres belasten nur noch 600 € Modell-Lebenshaltungskosten den Kontostand statt der regulären 6.500/9.500 € |

## Voraussetzungen und Grenzen

- Ladendiebstahl, Taschendiebstahl und Einbruch ab zwölf Jahren, **maximal zwei Deliktversuche pro Jahr insgesamt**.
- Neue Kontakte ab 16, Netzwerk und fiktive Gruppenaufträge ab 18 Jahren.
- Im Gefängnis sind ausschließlich Kontakt- und Lernaktionen sowie die vorhandenen Haftaktivitäten verfügbar. Neue Straftaten bleiben gesperrt.
- Vorstrafen bleiben grundsätzlich bestehen, bis eine Sonderfunktion oder ein späteres erweitertes Rehabilitationssystem sie löscht.
- Das neue Kriminalitätssystem ist **kein vollständiges Mafia-Job-Pack**. Es fehlen Bandenbeziehungen mit individuellen Rollen, tiefe Karrierestories, Ermittlungen, Gerichtsverhandlungen, Bewährungsauflagen, Anwaltsentscheidungen und vieles mehr.
- **Bereits vorhandene negative Guthaben werden nicht rückwirkend verändert**. Die geringeren Haftkosten wirken auf nachfolgende Spieljahre.

## Implementierung und Tests

- `src/engine/crime.ts`: alle Risikofunktionen, Kontakt- und Rangregeln, Verfolgungsdruck, Jahresentwicklung und strikte Eingabeprüfung.
- `src/engine/simulation.ts`: alte Deliktaktionen rufen nun denselben neuen Spielkern auf; normale Jahreskosten während eines Haftjahres gesenkt und Bewährung aktiviert.
- `src/main.ts`: Fortschrittsbalken, Rang, Fahndungsdruck, Kontakte, Mentoring, Netzwerkaufträge und ungefähre Entdeckungsrisiken im Aktivitätenmenü und der Gefängnisansicht.
- `src/engine/types.ts`: optionale CrimeCareer-Erweiterung für alte Save-Schema-1-Spielstände. Time Machine kann Zustände zurückspulen.
- `tests/engine.test.mjs` und `tests/browser_e2e.py`: Risiko-/Erfahrungswerte, Haftkontakt, Mentoring, Entlassung, Bewährung, Gruppenränge, Validierung, Lebenshaltungskosten und mobile Navigation.

Wichtig: Es handelt sich um bewusst abstrahierte Gameplay-Wahrscheinlichkeiten. Die Rollenspielbezeichnungen sind keine Empfehlungen oder Erklärungen, wie Straftaten im wirklichen Leben begangen werden.
