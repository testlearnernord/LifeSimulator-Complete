# Erbstücke: eigenständiges Sammelsystem (v0.18.0)

**Referenz:** Das [offizielle BitLife-Help-Center](https://bitlifeapp.com/help/) bestätigt für Heirlooms eine tägliche Fundgelegenheit auf dem Dachboden, unterschiedliche Seltenheit, Verkauf und Vererbung. Es bestätigt **keine** der hier gewählten Gegenstände, Preise, Wahrscheinlichkeiten, Restaurierungs- oder Präsentationsaktionen. Alles Folgende ist ein eigenständiges Modell.

## Gameplay

- **Dachboden durchsuchen:** ab 8 Jahren, maximal einmal pro lokalem Kalendertag und Leben. Der letzte Suchtageswert bleibt über Neustarts und Generationswechsel erhalten. Offline ohne Cloud oder Nutzerkonto.
- **Funde:** sieben originelle Sammlerstücke, gewichtet mit 28/23/20/12/9/6/2 Anteilen. Zustand 55–95 %, Wert innerhalb des jeweiligen Fundprofils. Der Wert ist bis zur Schätzung verborgen.
- **Schätzung:** 100 € pro Stück, danach wird der zustandsabhängige Verkaufserlös angezeigt.
- **Restaurierung:** ab 16 Jahren, 400 €, bis zu 15 Zustandspunkte, maximal einmal pro Erbstück und Spieljahr.
- **Präsentation:** einmal pro Spieljahr, steigert Glück, bei legendären Stücken zusätzlich leicht den Ruhm.
- **Verkauf:** ab 18 Jahren und nach Schätzung; Erlös = abgerundeter Grundwert × Zustand / 100 × 0,9. Verkauf entfernt das Objekt unwiderruflich.
- **Vermögen:** Sammlungswert fließt in den angezeigten Nettowert ein; beim Generationenwechsel wird das Objekt selbst weitergegeben, nicht nochmals als Bargeld gutgeschrieben.
- **Zeitreise:** die Sammlung ist Teil der Person-Snapshots und wird beim Rücksprung auf den damaligen Zustand zurückgesetzt.

## Technische Grenzen

Die Felder `person.heirlooms` und `person.heirloomSearchDate` sind optional und mit bisherigen `schema: 1`-Saves kompatibel. Der Validator prüft IDs, Typen, Dubletten, Wertebereiche, Zustandswerte, Fundalter und Funddatum. Die Sammlung ist auf 100 Objekte begrenzt. Ein absichtlich manipuliertes Geräte-Datum kann die tägliche Sperre beeinflussen; ohne Server gibt es keine manipulationssichere Uhr.

## Tests

`tests/heirlooms.test.mjs` prüft Alters- und Haftgrenzen, täglichen Fund, Schätzung, Restaurierung, Verkauf, Vermögenswirkung, Vererbung, Zeitreise und korrupte Save-Felder. `tests/browser_e2e.py` prüft auf mobiler Chromium-Ansicht die Sammlung, einen Fund und Persistenz nach Reload. **Kein iPhone-Safari-Hardwaretest.**

## Weiterhin offen

Originalkatalog, Originalwahrscheinlichkeiten, originale Wertentwicklung, tägliche Erinnerungen, Museum/Auktionen, Erfolge und Lebensbänder. Diese Version reproduziert weder die BitLife-Oberfläche noch die geschützten Originalassets.
