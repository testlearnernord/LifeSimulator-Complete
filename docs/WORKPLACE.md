# Arbeitswelt (v0.14.0)

## Referenz und Eigenständigkeit

Der [offizielle BitLife-App-Store](https://apps.apple.com/de/app/bitlife-life-simulator/id1374403536) nennt Arbeit, Karriere, Ausbildung und Entscheidungen mit Konsequenzen als Kernsystem. Die dort öffentlich beschriebenen Informationen verifizieren **nicht** die konkreten Wahrscheinlichkeiten, Mitarbeiterzahlen, Gehälter oder Beförderungsregeln. Diese Implementierung ist eine eigene, vereinfachte Arbeitsweltsimulation und übernimmt weder Originaltexte noch Assets.

## Spielablauf

- Im Berufsmenü können Erwachsene sich für eine der regulären Stellen bewerben, sofern Alter, Intelligenz und gegebenenfalls Abschluss ausreichen. Bis zu drei Interviews jährlich; der Erfolg hängt von Intelligenz, Aussehen, bisheriger Leistung, Vorstrafen und Zufall ab. Eine Absage lässt einen bisherigen Job bestehen.
- Bei Anstellung entstehen eine Führungskraft und zwei fiktive Kollegen mit Bindung und Kompetenz. Gespräche verbessern Beziehungen, Teamarbeit die Leistung, Streit verschlechtert beides und kann Abmahnungen auslösen.
- Nach zwei Berufsjahren kann eine Beförderung beantragt werden. Hohe Leistung und gutes Verhältnis zur Führungskraft erhöhen die Chance. Vier Karrierestufen sind möglich, mit eigenem Gehaltsbonus.
- Beim Jahreswechsel ändern sich Beziehungen und Leistung; anhaltend schlechte Leistung mit schwacher Chefbeziehung führt über drei Abmahnungen zur Entlassung. Kündigung, Studium, Auswanderung und Tod beenden das Arbeitsnetz.

## Persistenz und Qualität

Das bestehende `schema: 1` bleibt absichtlich erhalten. `person.workplace` ist optional, alte Speicherstände bleiben gültig und erhalten beim nächsten Berufsjahr oder der Aktion »Team kennenlernen« ein Arbeitsnetz. Der vollständige Zustand wird mit Jahres-Snapshots zurückgespult. `validWork` prüft Rollen, Wertebereiche, IDs und die Zahl der Kontakte.

Automatisierte Tests in `tests/work.test.mjs` decken Bewerbungserfolg und -absage, Limits, Teamarbeit, Beförderung, Abmahnungen, Alt-Saves, Rückspulen und korrupte Zustände ab. Browser-E2E in Chromium ist keine Prüfung auf echter iPhone-Hardware.

## Weiter offen

Verschiedene Laufbahnränge pro Beruf, Bewerbungsgespräch als mehrstufige Entscheidung, Teilzeit, Arbeitszeiten, Kündigungsschutz, branchenspezifische Kollegenevents und originale Karriereformeln. Keine Funktionsgleichheit mit dem Original beansprucht.
