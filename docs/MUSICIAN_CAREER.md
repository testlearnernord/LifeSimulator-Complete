# Musikerkarriere – v0.9.0

**Stand:** 27.10.2026. Dokumentation des eigenständig entwickelten Musiksystems in Lebenslinien. **Keine 1:1-Nachbildung** der proprietären BitLife-Wahrscheinlichkeiten, Lizenzsysteme, Audioinhalte oder Originaloberfläche.

## Was BitLife nachweislich anbietet

Der Musiker ist ein kostenpflichtiges *Job Pack*, das im offiziellen Hilfezentrum als Bestandteil von Boss Mode geführt wird. Bekannte Spielmechaniken sind instrumentale und gesangliche Fähigkeiten, Vorspiele als Solokünstler/in oder Bandmitglied, Verträge von Plattenfirmen, Veröffentlichungen, Konzertauftritte und Tourneen. Die Spielanleitungen bestätigen außerdem genrespezifische Laufbahnen und Discografien.

Quellen:
- https://bitlifeapp.com/help/ – Boss Mode und Musiker-Job-Pack
- https://www.destructoid.com/how-to-become-a-musician-in-bitlife/ – Band/Solo, Vorspiele, Plattenvertrag, Album, Konzerte, Tournee
- https://www.destructoid.com/how-to-become-a-musician-in-bitlife/ – Instrumente/Gesang, Fähigkeiten vor Vorspielen
- https://gamerjournalist.com/how-to-become-a-famous-singer-in-bitlife/ – verschiedene Karriereaktivitäten und Diskografie

## In Lebenslinien 0.9.0 spielbar

1. **Unterricht:** Ab acht Jahren Gesang, Gitarre, Klavier oder Schlagzeug üben. Bis einschließlich 17 kostenlos, ab 18 kostet eine Unterrichtseinheit 120 €. Höchstens drei Versuche pro Fähigkeit und Spieljahr. Das bestehende Spezialtalent „Musik“ beschleunigt den Fortschritt.
2. **Vorspielen:** Ab 18 mit mindestens 45 % Fertigkeit kannst du dich als Solokünstler/in oder Bandmitglied bewerben. Pro Jahr drei Vorspiele, von Fertigkeit und gewähltem Pfad abhängige Erfolgschance. Ein erfolgreicher Versuch erzeugt Plattenfirma, Musikgenre, Tantiemenanteil und Vertragslaufzeit (3–6 Jahre).
3. **Karriere:** Aktiver Plattenvertrag schließt eine normale Vollzeitstelle aus. Musikunterricht ist weiterhin möglich. Eine freiwillige Vertragskündigung ist möglich; der Musikkatalog bleibt bestehen.
4. **Singles und Alben:** Eine Veröffentlichung pro Spieljahr, Produktionskosten 600 € oder 2.500 €. Zufall, Fähigkeit und Popularität bestimmen Verkäufe, Einnahmen und die Entwicklung der Bekanntheit. Bis zu 30 Einträge in der Diskografie.
5. **Konzerte und Tourneen:** Konzerte liefern Auftrittserlöse. Tourneen benötigen 35 % Popularität und 8.000 € Organisation, erzielen potenziell höhere Einnahmen, kosten aber Gesundheit.
6. **Vermarktung:** Für 1.200 € kannst du bis zu zweimal pro Jahr die Popularität erhöhen.
7. **Jahresabrechnung:** Aus vergangenen Aufnahmen entstehen Tantiemen, die über die Jahre abnehmen. Verträge verlieren jedes Jahr Laufzeit und können nach Ablauf durch erneutes Vorspielen ersetzt werden. Die Bekanntheit kann ohne Aktivität sinken.

## Bedienung und Persistenz

Unter **Beruf → Musikerkarriere** sowie **Aktivitäten → Musik** findest du einen gemeinsamen Statusbildschirm mit Fähigkeiten, Vorspielen, Liveauftritten, Verträgen und eigener Diskografie. Sämtliche neuen Funktionen sind im Projekt kostenlos freigeschaltet; es gibt keine Shop-Anmeldung und keine Umgehung von Originalkäufen.

`musicSkills` und `musicCareer` sind optionale Felder des bisherigen Save-Schemas 1. Bestehende Spielstände bleiben ohne Migration spielbar. Time Machine erfasst den gesamten Musikzustand, da die neuen Daten Teil des Personenobjekts sind. Die Simulation verwendet denselben gespeicherten Pseudozufallszahlengenerator wie das Hauptspiel. Albumtitel, Plattenfirmen und sonstige Texte wurden eigenständig erfunden.

## Noch offen

- Künstlernamen, eigene Bands und Bandmitglieder mit persönlichen Beziehungen
- Auswahl konkreter Genres und Plattenfirmen, Vertragsverhandlungen, Bonuszahlungen und Agenten
- Musikerpositionen über die vier angebotenen Rollen hinaus
- Musikwettbewerbe, Awards, Chartplatzierungen, Verkaufszertifikate, Medienauftritte
- Zusammenarbeit mit Social Media bzw. dem gesonderten Music-Producer-Job-Pack
- Realistischere Lizenz- und Rechteabrechnungen sowie Nachfrage- und Trendmodelle

**Status:** Musiker-Job-Pack **teilweise spielbar**. Das Gesamtpaket besitzt nicht die vollständige Tiefe des Originalspiels.
