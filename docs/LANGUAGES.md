# Mehrsprachigkeit – Lebenslinien v0.22.0

**Stand: 02.11.2026.** Offline-Übersetzungen für **Deutsch**, **Englisch** und **europäisches Portugiesisch (pt-PT)**.

## Benutzung

1. Das Spiel öffnen und oben links das Hauptmenü aufrufen.
2. Unter **Sprachauswahl / Language / Idioma** Deutsch, English oder Português (Portugal) auswählen.
3. Die Oberfläche wechselt **sofort ohne Neuladen**. Navigation, zentrale Menüs, Profil, viele Aktionen und häufige Lebensereignisse werden angepasst.

Die Sprache ist eine **geräteweite Browserpräferenz** im Schlüssel `lebenslinien-language-v1` (LocalStorage). Sie wird nach einem Neuladen wiederhergestellt. Wenn der Browser keinen Zugriff auf LocalStorage erlaubt, funktioniert das Umschalten für die aktuelle Sitzung weiter, beim nächsten Start wird Englisch verwendet.

## Speicherstände und Spielregeln

- **Keine Änderung am Savegame-Schema.** Bestehende IndexedDB-Spiele und exportierte JSON-Dateien bleiben kompatibel.
- Die Simulation speichert weiterhin stabile interne IDs und deutsche Ausgangstexte. Die Übersetzung passiert ausschließlich beim Anzeigen der Oberfläche.
- Namen, Alter, Spielwerte, Zufallsentscheidungen und gespeicherte Spielstände werden beim Wechsel **nicht verändert**. Das schützt auch Time-Machine-Snapshots.
- `document.documentElement.lang` ist `de`, `en` oder `pt-PT`. Der Browsertitel wird ebenfalls lokalisiert.
- Die UI benötigt weder Netzwerkzugriff noch Online-Übersetzungsdienste.

## Technischer Aufbau

`src/i18n.ts` enthält ein explizites, dreisprachiges Übersetzungsverzeichnis. `translateText()` lokalisiert feste Begriffe und ausgewählte dynamische Meldungen mit Zahlen und Charakterdaten. `translateDOM()` übersetzt nach jedem Renderdurchlauf sichtbare Texte und relevante Zugänglichkeitsattribute, ohne die ID- und Wertfelder der Spielsteuerung zu verändern. Im Hauptmenü stellt ein natives `select` die Sprache um.

Die automatisierten Tests liegen in `tests/i18n.test.mjs`, `tests/i18n-history.test.mjs` und weiteren i18n-Tests. Die mobile Chromium-Testfolge prüft den Wechsel Deutsch → Portugiesisch → Englisch → Deutsch, den Seiteneustart, `html.lang`, frische englische und portugiesische Leben samt Geburtshistorie sowie die weiterhin funktionsfähigen alten Menüs.

## Ehrliche Abdeckung

**Die Mehrsprachigkeit ist eine erste funktionierende Übersetzungsstufe und keine vollständige Lokalisierung.** Navigation, grundlegende Charakterinformationen, wesentliche Menüs, viele Aktionsbezeichnungen, häufige Jahresereignisse und ausgewählte Lebensverlaufstexte sind erfasst. Die große Menge spezialisierter Dialoge, zufällig zusammengesetzter Beschreibungen, DLC-Sonderkarrieren und älterer generierter Geschichten ist **noch nicht vollständig übersetzt**. Nicht gefundene Texte bleiben auf Deutsch, statt falsch automatisiert in den Speicherstand geschrieben zu werden.

Weitere Schritte: vollständige Übersetzungsabdeckung mit klaren Übersetzungs-IDs statt textbasierter Erkennung, Qualitätsprüfung durch Muttersprachler für pt-PT sowie automatisierte Tests auf fehlende Zeichenfolgen und UI-Textüberläufe.

## Korrektur 02.11.2026: verschachtelte historische Werte

- Bereits gespeicherte Geburtstexte zeigen jetzt lokalisierte Ortsnamen (wo bekannt), Länder, Geburtstag und Sternzeichen; die deutschen Originalwerte bleiben im Save unverändert.
- Die sieben bislang unübersetzten Berufe der Eltern werden auch innerhalb ganzer Geburtseinträge auf Englisch und pt-PT lokalisiert. Die englischen Berufsartikel werden grammatisch angepasst.
- Die Todeschronik übersetzt jetzt auch die Todesursache statt nur den Satzrahmen. Regressionstests decken beide Sprachen und die Unveränderlichkeit älterer Spielstände ab.
- **Weiterhin offen:** vollständige systematische Prüfung sämtlicher zusammengesetzter Ereignisse und Dialoge, langfristige Balancing-Messungen, physischer Safari-Test und native pt-PT-Sprachkorrektur. Es wird keine vollständige Lokalisierung behauptet.
