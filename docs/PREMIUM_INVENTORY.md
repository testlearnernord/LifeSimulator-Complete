# Recherche: käufliche Zusatzinhalte von BitLife

**Stand:** 26.10.2026. **Referenz:** internationale BitLife-App von Candywriter für iOS. **Projekt:** Lebenslinien 0.17.0, unabhängige PWA.

## Wichtige Einschränkungen

Der App Store listet nur einen Teil der In-App-Käufe (die angezeigten Angebote unterscheiden sich je nach Markt/Plattform). Es gibt kein öffentliches, vollständiges Live-API für das gesamte rotierende Ingame-Angebot. Deshalb sind **40 bekannte bzw. recherchierte Einträge** katalogisiert. **Dies ist keine garantiert vollständige Shop-Liste.** Preise werden absichtlich nicht fest in die Software geschrieben. „Offen“ heißt: **keine funktionierende Nachbildung**, kein vermeintlich freigeschaltetes Kaufpaket. `src/engine/premium-catalog.ts` ist die maschinenlesbare Inventarliste mit Kategorie, Herkunft und Implementierungsstatus.

- **Offiziell:** direkt im App Store, Candywriter-Hilfezentrum oder auf der offiziellen Entwicklerwebsite dokumentiert.
- **Community:** in externen Listen und Guides beschrieben; Kaufbarkeit und Versionsstand sind möglicherweise nicht vollständig überprüft.
- **Spielbar:** im eigenen Code als echte Mechanik implementiert und testbar, ohne identische Original-Regeln zu behaupten.
- **Teilweise:** nur einzelne nachweisbare Systemaspekte umgesetzt.
- **Offen:** kein funktionierendes Gameplay.
- Alle vorhandenen selbst entwickelten Inhalte sind für den Benutzer kostenlos und ohne Konto oder In-App-Käufe verfügbar. Keine Prüfung oder Umgehung fremder Lizenzen.

## Erwerbs-/Freischaltungsgruppen

| Gruppe | Erwähnte Angebote | Typ | Umsetzungsstand |
|---|---|---|---|
| Basispremium | Bitizenship, God Mode, Bitizenship+God Mode, Boss Mode | dauerhaft | **Teilweise**: Eigene lokale Spielstände, Charakterattribute, keine Werbung, einige berufliche Systeme |
| Job-Packs | Mafia, Profisport, Musiker, Schauspieler, Politiker, Astronaut, Model, Street Hustler, Dealer, Business, Music Producer | spezialisierte Karrieren | **Offen**, Business und Astronaut **teilweise** |
| Expansion Packs | Landlord, Investor, C.U.L.T., Black Market, Movie Director, Secret Agent, Zoo, Casino, Grand Prix/Racing, Outdoor Lifestyle | Spielsysteme | Landlord, Investor und Movie Director **teilweise**, Rest **offen** |
| Items | Golden Pacifier, Get Out of Jail Free Card, Hollywood Star, Assassin's Blade, Golden Passport, Promiscuity Potion, Golden Diploma, Golden Piggy Bank, Golden Resume, Friendship Bracelet | permanente/spezielle Gegenstände | **Eigene spielbare Funktionen:** Pacifier, Jail Card, Hollywood Star, Diploma. Rest **offen** |
| Verschiedenes | Time Machine, Ultimate Fighter Mode, Challenge Vault, Luxury Lifestyle, BitPass/Seasons (historisch) | Modi und Sammlungen | Time Machine **spielbar**; Fighter Mode **teilweise**; weitere offen; Seasons offiziell eingestellt |

## In dieser Version funktionsfähig

1. **Time Machine:** Mindestens ein Alterungsschritt erforderlich; bis zu 15 Jahres-Snapshots werden gespeichert. Rewind um 1–5 Jahre, auch nach Tod. Charakter, Finanzen, Beziehungen und Zufalls-Seed werden wiederhergestellt. **Einschränkung:** nur lokal gespeicherte jährliche Checkpoints, keine identische Ereignis-Historie des Originals.
2. **Golden Pacifier:** Volljährige Charaktere mit lebendem Partner können einmal pro Lebensjahr 1 bis 3 Kinder mit ausgewähltem Geschlecht und Talent bekommen. Vererbung ausgewählter Talente beim Generationswechsel wird als eigene Mechanik modelliert. **Einschränkung:** nicht die genaue Original-Fertilitäts- oder Vererbungslogik.
3. **Get Out of Jail Free Card:** Bei Haft sofortige Entlassung und Löschung des vereinfachten Strafregisters. **Einschränkung:** keine differenzierten Vorstrafen-/Justizsysteme.
4. **Golden Diploma:** Sofortabschluss in einer von vier Richtungen, insgesamt bis zu zwei unterschiedliche Abschlüsse. Die vorhandenen akademischen Berufe erkennen den `degree`-Wert. **Einschränkung:** viele originale Studiengänge und Spezialanforderungen fehlen.
5. **Hollywood Star:** In mehreren Berufszweigen bzw. bei eigenem Unternehmen sofortige Bekanntheit. **Einschränkung:** nur ein reduziertes Rufsystem, keine komplette Prominentenkarriere.
6. **Investor (Teilumfang):** fünf fiktive Anlageklassen (Aktien, Anleihen, Fonds, Penny Stocks, Krypto), selbst generierte Jahreskurse, Handelsgebühren, Kauf/Verkauf, Dividenden/Zinsen, Finanzberater und Depotbewertung. **Einschränkung:** keine echten Livekurse, keine Insidertrading-, Nachrichten- oder vollständigen Beratermechaniken.
7. **God Mode / Bitizenship / Boss Mode:** Einzelne freie Funktionen (Charakterwerte, Generationen, einige Karrierebereiche), aber **nicht als vollständige Pakete implementiert**.
8. **Landlord & Business:** Echte eigene Miet- und Unternehmensmechaniken aus Version 0.4, aber nicht vollständiger Originalumfang.

## Offizielle Referenzquellen

- Deutscher App Store (Top-In-App-Käufe, Version 3.26, nur Auswahl): https://apps.apple.com/de/app/bitlife-life-simulator/id1374403536
- Offizielles Hilfezentrum: https://bitlifeapp.com/help/
- Golden Pacifier: https://bitlife.zendesk.com/hc/en-us/articles/26207332604180-What-is-the-Golden-Pacifier
- Hollywood Star: https://bitlife.zendesk.com/hc/en-us/articles/16952736188052-What-is-the-Hollywood-Star
- Movie Director (Premiere 10.09.2026): https://bitlifeapp.com/moviedirector
- Movie Director / Ultimate Fighter (aktuell live): https://bitlifeapp.com/
- Ankündigung zur Einstellung der Seasons/BitPass: https://bitlifeapp.com/whats-new/end-of-seasons

## Sekundärquellen (Existenzhinweise, nicht zur Preisverifikation)

- Expansion-Pack-Kategorie: https://bitlife-life-simulator.fandom.com/wiki/Category:Expansion_Packs
- Karrieren: https://bitlife-life-simulator.fandom.com/wiki/Careers/Occupation
- Golden Diploma: https://www.destructoid.com/how-to-get-and-use-the-golden-diploma-in-bitlife/
- Challenge Vault / Pack-Übersicht: https://www.escapistmagazine.com/best-bitlife-packs-amp-add-ons-to-buy/

Die vorläufige Inventarliste muss periodisch mit dem **tatsächlichen Ingame-Shop auf aktuellem iOS** abgeglichen werden, weil bestimmte Angebote nicht vollständig öffentlich nachprüfbar sind. Unbelegte Details dürfen nicht als Originalmechanik bezeichnet werden.

## Pro Athlete ab Lebenslinien 0.13.0

Im eigenen Spiel **teilweise umgesetzt**: Fußball, Basketball, Handball, Training, fiktive Vereine, Verträge, Saisons, Verletzungen und Sponsoren. Dies bildet kein vollständiges Originalpaket ab. Verweis: [PRO_ATHLETE.md](PRO_ATHLETE.md).

## Politician ab Lebenslinien 0.15.0

Das **offizielle Job Pack Politician** ist als Referenz nachgewiesen (BitLife Help Center). Im eigenen Projekt **teilweise umgesetzt**: fiktive Wahlkampagnen, Ämter, Gruppierungen, vierjährige Amtszeiten und jährliche Gehälter. Keine Originalparteien, Assets oder Formeln. Siehe [POLITICS.md](POLITICS.md).

## Kampfsportmodus ab 0.16.0

Die [offizielle Beschreibung vom 11.06.2026](https://bitlifeapp.com/whats-new/ultimate-fighter-mode) bestätigt Coach, Straßenkämpfe, Liga, Titel, Rivalen, über 200 Moves und MMA-Minispiel. Die eigene Version bietet nur Training, Sparring, Straßen- und Ligakämpfe, Rivalen, Preisgeld, Titel und Verletzungen. **Teilweise**, kein vollständiges Originalpaket. Siehe [FIGHTER_MODE.md](FIGHTER_MODE.md).

## Katalogabgleich, 30. Oktober 2026

Die 40 recherchierten Angebote umfassen jetzt **18 teilweise umgesetzte und 22 offene** Einträge. Time Machine (maximal fünf Jahre), Golden Pacifier (Familienplanung), Get Out of Jail Free Card (Haftentlassung), Hollywood Star (Ruhmschub) und Golden Diploma (ausgewählte Abschlüsse) wurden als **teilweise** markiert, weil bereits entsprechende eigene Funktionen existieren. Das bedeutet weder vollständige Feature-Gleichheit noch eine Freischaltung im Originalspiel.
