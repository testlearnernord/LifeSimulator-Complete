# Schauspielkarriere – Lebenslinien v0.10.0

Stand: 27. Oktober 2026. Vergleich mit dem **Actor Job Pack** von BitLife und einer eigenständigen, lokal spielbaren Lebenssimulation.

## Verifizierbare Funktionsreferenzen (Originalspiel)

Der offizielle BitLife-Support nennt „Actor“ als Special Career innerhalb der Job Packs. Externe ältere Spielanleitungen beschreiben Schauspielunterricht, Komparsenrollen, Talentagenten, Film- und TV-Castings sowie Rollenprofile mit Altersanforderungen; TV-Serien bezahlen häufig je Folge. **Diese Quellen belegen nicht die aktuellen proprietären Berechnungen** des Spiels, daher werden Erfolgswahrscheinlichkeiten, Angebote und Gehälter nicht als originalgetreu bezeichnet.

- Offiziell: https://bitlife.zendesk.com/hc/en-us/articles/5165168014228-What-are-Job-Packs
- Offiziell (Hollywood Star): https://bitlife.zendesk.com/hc/en-us/articles/16952736188052-What-is-the-Hollywood-Star
- Anleitungen zu Casting, Rollen und Extras: https://progameguides.com/bitlife/how-to-become-an-actor-movie-star-in-bitlife/
- Filmdrehs vs. TV-Folgen: https://progameguides.com/bitlife/how-to-become-a-television-star-in-bitlife/

## Aktuell tatsächlich in Lebenslinien spielbar

1. **Ausbildung:** Schauspielunterricht ab acht Jahren; unter 18 kostenlos, danach 175 €. Drei Lerneinheiten pro Lebensjahr; das bisherige Spezialtalent „Schauspiel“ bringt einen Trainingsbonus.
2. **Komparsenjobs:** Ab 18 drei kurze Nebenjobs pro Jahr mit echtem Einkommen und zunehmender Branchenerfahrung.
3. **Talentagentur:** Eine Agentur kann gegen 1.500 € Gebühr eingestellt oder entlassen werden. Agenten geben einmal jährlich einen Castingvorschlag und verbessern die Chancen für das empfohlene Vorspiel; ein Castingvertrag löst 12 % Agenturprovision aus.
4. **Castings:** Sieben fiktive Film- und Serienproduktionen mit eigener Altersgruppe, Mindestfertigkeit, Drehbuchqualität, Honorar, Episodenzahl und Laufzeit. Maximal drei Vorspiele jährlich; Erfolg hängt von Können, Aussehen, Branche, Castingschwierigkeit, Zufall und möglichem Agentenhinweis ab. Film und Serie besitzen getrennte Laufzeiten.
5. **Rollenarbeit:** Während eines Engagements kann an der Rolle geprobt werden; das verbessert Fertigkeit und Branchenruf. Ein Vertrag kann abgebrochen werden, mit Rufverlust.
6. **Jahresgagen:** Filmgagen werden für das Drehjahr ausgezahlt, Seriengagen je Folge mal Anzahl Folgen. Das System berücksichtigt vereinfachte Steuern und gegebenenfalls die Agenturprovision.
7. **Filmografie und Ruf:** Abgeschlossene Jahre erzeugen Kritikerwertungen und Einträge in der Filmografie. Gute Rollen verbessern Branchenruf und Bekanntheit. Hervorragende Hauptrollen können fiktive Auszeichnungen gewinnen. Filmografie auf maximal 30 Einträge begrenzt, auch nach Rollenende verfügbar.
8. **Spielstand und Berufskonflikte:** Schauspiel- und Musikerengagements sind nicht mit gewöhnlichen Vollzeitjobs parallel kombinierbar. Die Hollywood-Star-Funktion erkennt aktive Schauspielrollen. Alle neuen Eigenschaften sind optionale Felder in Save-Schema 1 und werden von der Time Machine zurückgespult.

### Bedienung

**Beruf → Schauspielkarriere** oder **Aktivitäten → Schauspiel**. Beide öffnen dieselben echten Aktionen. Abhängig von Alter, Können, Kontostand, Rolle und Haftstatus werden nicht mögliche Aktionen deaktiviert.

## Grenzen und weitere Entwicklung

**Das Actor Job Pack ist nur teilweise nachgebildet.** Es fehlen dynamisch generierte Castingangebote, Produktionen mit einzigartigen Mitarbeitern, Vertrags-/Gagenverhandlungen, komplexere Rollenanpassung, Agentenbeziehungen, Dreharbeiten als Entscheidungsketten, Drehbücher, Serienverlängerungen, externe Preisverleihungen, Genreauswahl, Script Rating über mehrere Produzenten, globale Produktionsmärkte, Medienreaktionen und eine tief integrierte Fame-Karriere. Film-/Serientitel, Zahlen, Dialoge, Symbole und Mechaniken sind selbst entwickelt. Weder BitLife-Logos noch Original-Texte, Audio, Code oder Abbildungen sind enthalten.

**Frei und unabhängig:** Alle bereits implementierten Funktionen sind vollständig kostenlos nutzbar. Keine Freischaltung der Original-DLCs, kein Zugriff auf Candywriter-Lizenzen, keine Werbebanner.

## Technische Absicherung

- Engine: `src/engine/acting.ts`, Typen in `src/engine/types.ts`, jährliche Berechnungen in `src/engine/simulation.ts`.
- Client: `src/main.ts`, `src/styles.css`; ohne Bibliotheks- oder CDN-Pflicht.
- Tests: Altersgrenzen, Schauspiel-Spezialtalent, Trainingskontingente, Komparsenjobs, Agentur und Gebühr, unzulässige Castings, parallele Berufe, TV- und Filmabrechnung, Hollywood Star, Filmografie, Rollenabbruch, manipulierte Speicherstände, Legacy-Saves und iPhone-Menüs.
