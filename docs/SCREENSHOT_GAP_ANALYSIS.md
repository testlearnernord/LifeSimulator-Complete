# Screenshot-Abgleich: BitLife iOS 3.26.0i vs. Lebenslinien

Stand: 27. Oktober 2026. Grundlage: vom Benutzer im Projekt geteilte Original-Screenshots. Dies ist ein **manueller Funktions- und Gestaltungsvergleich**, kein Pixelvergleich und keine Behauptung von Originalgleichheit.

## Design-/Navigationsvergleich

| Sichtbare Komponente in der BitLife-Referenz | Vorher | Lebenslinien 0.6 | Weiter offen |
|---|---|---|---|
| Schwarze Kopfzeile mit Spielmarke, Menü, Stern, Bitizen-Angebot | Rote Kopfzeile | Schwarzer Kopfbereich mit **eigener** orangefarbener Wortmarke und Menü-Icon | Keine Originalmarke, Original-Assets oder Werbung übernehmen |
| Baby-/Altersprofil, Name, Land, Berufsstufe, Guthaben | Einfacher Emoji und Profilleiste | Hellblau-graues Profil mit anklickbarem Steckbrief | Eigene Avatarillustrationen, Länderflaggen, Lebensphasen und Animationen |
| Alterschronik mit Geburtsgeschichte, Geburtstag, Sternzeichen, Elternberufen | Ein generischer Geburtssatz | Dynamische Geburtsstadt, Geburtstag, Sternzeichen, Mutterberuf, gelegentlich Vater, mehrere Zeilen | Komplexe Familienmodelle, Geburtsvarianten und Herkunftssystematik |
| Personendialog mit Name, Profilinfos und Attributbalken | Kein vollständiger Steckbrief | Eigener modaler Steckbrief mit Statistikbalken | Zusätzliche Charaktereigenschaften, Talente, Fähigkeiten und Biografie |
| Blaue untere Navigation und großer grüner Alter-Knopf | Ständig sichtbarer kleiner Knopf | Größerer Alter-Knopf, nur im Lebenslauf; eigene Menüseiten schließen zum Leben | Weitere Anpassung von Animationen, Gesten und Icons |
| Vollbild-Untermenü mit blauem Titel, weißem X und grauen Gruppentiteln | Kleine Karten mit Aktionsbuttons | Separater blauer Untermenü-Kopf und Listen mit grauen Gruppentiteln | Feinschliff, tatsächliche Porträts statt Emoji |
| Assets: Finanzen, Investments, Luxusleben, Auktionshaus, Casino, Museum, Rennwagen-Garage, Zoo, Besitz und Social Media | Fahrzeuge/Häuser und Investments in einer überladenen Seite | Gruppierte Hauptübersicht; Investitionen und Eigentum öffnen Unterseiten, nicht spielbare Bereiche sind gesperrt | Luxusleben, Auktionen, Museum, Rennstall, Zoo, Casinobetrieb |
| Relationships: Spezial, Eltern und einzelne Elternzeilen mit Bindungsbalken | Alle Beziehungen in einer gemeinsamen Liste | Getrennte Bereiche für Eltern, Partner, Kinder und Freunde, Beziehungsbalken und Personenseiten | Aura Ring, Commune, komplexe Eltern-/Trennungs-/Familienereignisse |
| Activities: Premiumbereiche und lange Liste der Alltagsaktivitäten | Nur fünf Kategorien | Nach Altersfreigaben sortierte Aktivitätsliste mit Untermenüs | Zahlreiche Aktionen und Premiumsysteme noch offen |
| Werbebanner zwischen Einträgen und am unteren Bildschirmrand | Keine | Keine Anzeigen (absichtlich) | Keine Nachbildung von Werbung oder Tracking |

## Abgeglichenes sichtbares Gameplay

| Funktion im Screenshot | Status 0.6 | Umsetzung bzw. Grenze |
|---|---|---|
| Neuer Charakter bei Alter 0 | Spielbar | Biografie und Bezugspersonen erscheinen im Lebenslauf |
| Profil anzeigen | Spielbar | Steckbrief mit Alter, Geschlecht, Herkunft, Geburtstag, Statuswerten |
| Finanzen | Teilweise | Kontostand, Kredite, Depotwert; kein kompletter Steuer-/Finanzbildschirm |
| Investments | Teilweise | Fünf fiktive Anlageklassen, Jahreskurse, Brokerkosten, Finanzberater |
| Immobilien/Fahrzeuge | Teilweise | Kauf, Verkauf, Instandhaltung, einfache Vermietung |
| Social Media | Teilweise | Plattformen, Follower, Werbung; kein volles Originalsystem |
| Adoption | Spielbar als eigene Näherung | Genehmigungsrisiko, Altersvoraussetzung, Kosten und jährliche Grenze |
| Arzt | Teilweise | Gesundheitswiederherstellung; keine Krankheiten, Ärzte, Diagnosen |
| Auswandern | Teilweise | Land wechseln gegen Kosten; keine umfassende Immigration |
| Fruchtbarkeitsklinik | Spielbar als eigene Näherung | Kosten, Erfolgschance, vereinzelt Mehrlinge |
| Glücksspiel | Teilweise | Casino mit Gewinn-/Verlustchance; kein Spieltisch mit echter Strategie |
| Identität | Teilweise | Geschlechtsangabe ändern; komplexere Identitätsoptionen fehlen |
| Führerschein | Spielbar als eigene Näherung | Altersgrenze, Prüfgebühr und Erfolgschance |
| Kredite | Spielbar als eigene Näherung | Bankprüfung, Tilgung, jährliche Zinsen, Schulden |
| Lotterie | Teilweise | Ziehungschance pro Los |
| Rechtsstreit | Offen | Nur sichtbar gesperrt, keine Aktion |
| Illegaler Handel, Cult/Commune, Secret Agent, Zoo, Casino-Besitz, Filmregie | Offen | Nur als geplante Premiumsysteme geführt, ausdrücklich gesperrt |
| Accessoires | Teilweise | Fünf frei gewählte Gegenstände, kleine Stat-/Geldeffekte |
| Race Car Garage und Racing | Offen | Keine echte Motorsportkarriere |
| Animals/Pets, Museums, Auction Houses, Belongings | Offen oder nur einfache Besitzliste | Sammler- und Tiermechaniken fehlen |
| Vampire Mode, Outdoor Lifestyle, Luxury Lifestyle | Offen | Keine heimlich als „fertig“ deklarierten DLCs |

## Technische und rechtliche Grenzen

- Eigenständig implementierte TypeScript-Logik, eigene Texte, Emoji-Platzhalter und originales CSS; **keine Pixel-, Sound-, Logo- oder Werbekopie**.
- Vorhandene Spielstände bleiben über optionale Eigenschaften im Schema 1 lesbar. Alte Charaktere erhalten nicht rückwirkend eine erfundene Geburtsstadt.
- Die automatisierten GitHub-Checks decken Spielkern, Chrome-Mobile-Smoke-Tests, Speichern, Offline-PWA und Navigation ab. Sie ersetzen keinen Hardwaretest auf iPhone Safari.
- Vergleichs-Screenshots aus dem Benutzer-Chat sind hier als visuelle Referenz verwendet, **nicht** ins Repository kopiert oder verteilt.
