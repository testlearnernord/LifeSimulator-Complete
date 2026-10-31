# Mehrsprachigkeit – Lebenslinien v0.19.0

**Stand: 31.10.2026.** Offline-Übersetzungen für **Deutsch**, **Englisch** und **europäisches Portugiesisch (pt-PT)**.

## Benutzung

1. Das Spiel öffnen und oben links das Hauptmenü aufrufen.
2. Unter **Sprachauswahl / Language / Idioma** Deutsch, English oder Português (Portugal) auswählen.
3. Die Oberfläche wechselt **sofort ohne Neuladen**. Navigation, zentrale Menüs, Profil, viele Aktionen und häufige Lebensereignisse werden angepasst.

Die Sprache ist eine **geräteweite Browserpräferenz** im Schlüssel `lebenslinien-language-v1` (LocalStorage). Sie wird nach einem Neuladen wiederhergestellt. Wenn der Browser keinen Zugriff auf LocalStorage erlaubt, funktioniert das Umschalten für die aktuelle Sitzung weiter, beim nächsten Start wird Deutsch verwendet.

## Speicherstände und Spielregeln

- **Keine Änderung am Savegame-Schema.** Bestehende IndexedDB-Spiele und exportierte JSON-Dateien bleiben kompatibel.
- Die Simulation speichert weiterhin stabile interne IDs und deutsche Ausgangstexte. Die Übersetzung passiert ausschließlich beim Anzeigen der Oberfläche.
- Namen, Alter, Spielwerte, Zufallsentscheidungen und gespeicherte Spielstände werden beim Wechsel **nicht verändert**. Das schützt auch Time-Machine-Snapshots.
- `document.documentElement.lang` ist `de`, `en` oder `pt-PT`. Der Browsertitel wird ebenfalls lokalisiert.
- Die UI benötigt weder Netzwerkzugriff noch Online-Übersetzungsdienste.

## Technischer Aufbau

`src/i18n.ts` enthält ein explizites, dreisprachiges Übersetzungsverzeichnis. `translateText()` lokalisiert feste Begriffe und ausgewählte dynamische Meldungen mit Zahlen und Charakterdaten. `translateDOM()` übersetzt nach jedem Renderdurchlauf sichtbare Texte und relevante Zugänglichkeitsattribute, ohne die ID- und Wertfelder der Spielsteuerung zu verändern. Im Hauptmenü stellt ein natives `select` die Sprache um.

Die automatisierten Tests liegen in `tests/i18n.test.mjs`. Die mobile Chromium-Testfolge prüft den Wechsel Deutsch → Portugiesisch → Englisch → Deutsch, den Seiteneustart, `html.lang` und die weiterhin funktionsfähigen alten Menüs.

## Ehrliche Abdeckung

**Die Mehrsprachigkeit ist eine erste funktionierende Übersetzungsstufe und keine vollständige Lokalisierung.** Navigation, grundlegende Charakterinformationen, wesentliche Menüs, viele Aktionsbezeichnungen, häufige Jahresereignisse und ausgewählte Lebensverlaufstexte sind erfasst. Die große Menge spezialisierter Dialoge, zufällig zusammengesetzter Beschreibungen, DLC-Sonderkarrieren und älterer generierter Geschichten ist **noch nicht vollständig übersetzt**. Nicht gefundene Texte bleiben auf Deutsch, statt falsch automatisiert in den Speicherstand geschrieben zu werden.

Weitere Schritte: vollständige Übersetzungsabdeckung mit klaren Übersetzungs-IDs statt textbasierter Erkennung, Qualitätsprüfung durch Muttersprachler für pt-PT sowie automatisierte Tests auf fehlende Zeichenfolgen und UI-Textüberläufe.
