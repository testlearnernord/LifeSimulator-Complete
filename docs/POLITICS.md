# Politik (Lebenslinien 0.15.0)

**Quelle für die Existenz des Referenz-Job-Packs:** [BitLife Help Center](https://bitlifeapp.com/help/) bestätigt „Politician“ als Spezialkarriere; der dokumentierte Hollywood-Star-Bonus nennt politische Ämter ab Governor. Es ist keine offizielle Offenlegung vollständiger Originalmenüs, Parteien oder Wahrscheinlichkeitsformeln vorhanden. Das System hier ist eigenständig und beansprucht keine exakte Reproduktion.

## Spielregeln

- Ab 14 kannst du freiwillig in einer kommunalen Initiative helfen (maximal zweimal jährlich); dein Wissen, Ansehen und politische Erfahrung wachsen.
- Erwachsene starten gegen selbst finanziertes Budget eine Kandidatur. Du wählst eine von vier vollständig fiktiven politischen Gruppierungen, ein Thema (Bildung, Infrastruktur oder Gesundheit) und eine Budgetstufe.
- Vier Ämter bilden eine vereinfachte Karriereleiter: Gemeinderat ab 18, Bürgermeister ab 21 und einem Sieg, Landesregierung ab 30 und zwei Siegen, Staatsoberhaupt ab 40 und drei Siegen. Mittlere und hohe Ebenen erfordern politische Erfahrung. Dies sind **eigene vereinfachte Voraussetzungen**, nicht nachgebildete nationale Wahlgesetze.
- Ein Wahlkampf enthält Gespräche mit Wählern, eine Debatte, Werbung gegen Geld und die abschließende Wahl. Das eigene Modell berücksichtigt Kenntnisse, Aussehen, Erfahrung, Ansehen, Integrität, Reichweite, Debattenleistung und Bekanntheit. Die genaue Formel ist nicht BitLife entnommen.
- Jeder Wahlkampf hat ein Ergebnis und echte finanzielle Kosten. Resultate werden dauerhaft gespeichert, begrenzt auf vierzig letzte Wahlen.
- Sieger erhalten ein vierjähriges Amt mit jährlichem Nettogehalt, öffentlichen Zustimmungswerten, Bürgerversammlungen und eigenen Vorhaben. Ein Vorhaben kann Erfolg oder Ablehnung verursachen. Sinkt die Zustimmung, kann die Amtszeit vorzeitig enden.
- Amtsinhaber können keine neue Vollzeitstelle oder Schauspiel-, Musik- oder Sportkarriere antreten. Bei Haft, Auswanderung und Tod enden politische Amtsverhältnisse.

## Technik

- `src/engine/politics.ts`: reine Logik, deterministische Zufallsquelle und Validierung.
- `src/engine/types.ts`: optionales `politicalCareer`-Feld für bestehende `schema:1`-Spielstände. Das Datenmodell wird nicht obligatorisch nachträglich eingefügt.
- `src/engine/simulation.ts`: `POLITICS`-Aktionen, Jahreswechsel, Amtsausstiege, Berufsverträglichkeit, Savegame-Validierung und Rückspul-Snapshots.
- `src/main.ts`: deutschsprachige Auswahl und Aktionen für mobile Browser, erreichbar über Beruf und Aktivitäten.
- `tests/politics.test.mjs`: Altersgrenzen, Wahlkosten, Siege/Niederlagen, Amtsgehälter, Berufswechsel, Rücktritt, Zeitreise, manipulationssichere Validierung und Legacy-Spielstände.
- `tests/browser_e2e.py`: mobile Navigation, Wahlentscheidung, lokale Persistenz und Offline-Neuladen im Chromium.

## Grenzen

Kein Landeswahlrecht, keine exakten Kandidaten-, Parteispenden-, Spenden-Skandal- oder Wahlbezirksformeln, keine Koalitionen, Gesetzgebung mit NPC-Parlament, Amtsenthebungsverfahren oder ausgearbeitete weltweite Parteiensysteme. Kampagnen sind eine vereinfachte lokale Simulation. Reale politische Parteien, BitLife-Markenassets, Texte und geschützte Designs wurden nicht kopiert. Ein Hardwaretest auf iPhone-Safari steht weiterhin aus.
