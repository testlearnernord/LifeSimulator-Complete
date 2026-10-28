# Profisport (Lebenslinien 0.13.0)

**Primärreferenz für Feature-Existenz:** [BitLife Help Center](https://bitlifeapp.com/help/). Dort ist »Pro Athlete« ausdrücklich als Job Pack genannt. Konkrete Sportarten, Mannschaften, Vertragszahlen, Gehälter und Berechnungen des Originals werden dort nicht offengelegt und wurden **nicht übernommen**.

## Spielerische Umsetzung

- Im Beruf- oder Aktivitätenmenü: **Fußball, Basketball oder Handball** ab acht Jahren trainieren. Die erste gewählte Sportart wird zur Spezialisierung.
- Bis zu drei Trainingseinheiten jährlich. Erwachsene zahlen 120 € je Einheit, Minderjährige trainieren kostenlos. Sporttalent gibt zusätzliche Fortschritte.
- Ab 18 Jahren **Probetraining** in einer fiktiven Regional- oder Nationalliga. Dafür sind mindestens 35 bzw. 70 % Sportfähigkeit und 35 % Fitness erforderlich. Probetrainings können scheitern; maximal zwei Versuche pro Jahr.
- Erfolgreiche Bewerbungen führen zu zweijährigen regionalen bzw. dreijährigen nationalen Verträgen mit fiktiven Vereinen. Bestehende reguläre Arbeit endet; parallele aktive Musik-, Sport- und Schauspielverträge sind nicht möglich.
- Jährliche **Saisonabrechnung** beim Altern: Leistung und Siege werden ausgewürfelt, mit einer Chance auf Meistertitel. Nettoeinnahmen nach modellierten Abzügen, Reputation und Ruhm werden gespeichert.
- Sponsoren sind ab 30 % Bekanntheit und 30 % Sportreputation möglich. Gehaltsverhandlungen einmal im Jahr. Verletzungen und 300-€-Rehabilitation wirken auf Fitness, Einkünfte und kommende Spielzeiten.
- Verträge laufen aus, enden bei Auswanderung oder Haft oder durch freiwilligen Rücktritt; spätestens mit 46 Jahren endet die aktive Laufbahn.
- Saisondaten bleiben nach Vertragsende erhalten (begrenzt auf 35 Datensätze).

## Technik und Grenzen

- `src/engine/sport.ts`: isolierte Sportlogik mit gespeicherten Verträgen, Jahresentwicklung, Prüfungen, begrenzten Aktionen und fiktiven Ergebnissen.
- `src/engine/types.ts`: optionale `sportCareer`-Erweiterung, vorhandenes `schema: 1` unverändert.
- `src/engine/simulation.ts`: neue `SPORT`-Aktion, Jahresabrechnung, Berufsexklusivität, Auswanderung, Haft und Save-Validierung. Zeitreise verwendet vorhandene Jahre-Snapshots.
- `src/main.ts`: Berufs- und Aktivitätenansichten, deutschsprachige Texte, mobile Navigation.
- `tests/sport.test.mjs`: Training, Altersgrenzen, Spezialisierung, Probetrainings, Vertrag, Einkommen, Verletzung, Reha, Sponsoring, Exklusivität, Ruhestand, Auswanderung, Gefängnis, Legacy-Saves, manipulierte Saves und Rewind.
- `tests/browser_e2e.py`: Sporttraining, Persistenz nach Reload und altersgesperrte Bewerbung im mobilen Chromium.

**Offen:** Schulmannschaften, Vereinswechselangebote ohne erneutes Probetraining, Weltmeisterschaften, nationale Teams, ausgearbeitete Spieltagsereignisse, weitere Sportarten, individuelle Trainer, Dopingkontrollen, komplexe Sportverletzungen und Lizenz-/Werberechte. Kein 1:1-Anspruch; keine Originalgrafiken, Clubmarken oder proprietären Formeln.
