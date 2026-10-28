# Changelog

## 0.14.0 – 2026-10-28 (Arbeitswelt)

- Vorstellungsgespräche für reguläre Jobs, maximal drei Bewerbungen pro Jahr; Absagen erhalten bestehende Anstellungen.
- Persistente Chef- und Kollegenkontakte, Gespräch, Teamarbeit, Streit, Leistungsbeurteilungen und vier Karrierestufen.
- Gehaltsaufschläge, Abmahnungen und mögliche Entlassung; fiktive Namen und eigene Wahrscheinlichkeiten.
- Optionaler `workplace`-Spielstandzustand mit Validierung, Legacy-Kompatibilität und Time-Machine-Snapshots.
- Mobile Berufsoberfläche und automatisierte Tests für Bewerbungen, Kontakte, Beförderungen, Kündigung und Saves.


## 0.13.0 – 2026-10-28 (Eigenständige Profisport-Karriere)

- Drei Sportarten, Jugendtraining und Profi-Probetrainings in zwei fiktiven Ligen.
- Vereine, Verträge, Jahresgehälter, Saisons, Titel, Sponsoren, Gehaltsverhandlungen, Verletzungen und Rehabilitation.
- Gleichzeitige Vollzeit-/Spezialverträge unterbunden; Haft, Auswanderung und Rücktritt beenden Verträge.
- Mobile Berufs- und Aktivitätenmenüs, optionaler Spielstandzustand und Zeitreise-Unterstützung.
- Engine- und Browser-Regressionstests hinzugefügt; keine originale Spielbalance oder Lizenzinhalte.


## 0.12.0 – 2026-10-28 (Eigenständige Filmregie)

- Filmkurse ab 14, eigene Filmprojekte ab 18 in drei Genres und drei Budgetgrößen.
- Casting mit Nachwuchs- oder Starbesetzung, zwei Drehstrategien, Premieren, Kinoumsätzen, Verleiheranteil, Ruf und Bekanntheit.
- Laufende Produktionen verursachen Verzögerungskosten und werden nach drei Jahren eingestellt; nicht ausgegebene Budgets fließen zurück.
- Filmografie und Auszeichnungen, vollständige mobile Aktionsmenüs, Schema-1-Save-Validierung und Rückspul-Snapshots.
- Vier neue Engine-Tests und mobile Browser-Navigation; keine Behauptung vollständiger Originaltreue.
- Grenzen und offizielle Quellen: docs/DIRECTOR_CAREER.md.


## 0.11.0 – 2026-10-27 (Progressive crime and prison contacts)

- Three separately trainable crime skills, with experience from success or failure.
- Detection risk now incorporates skill, intelligence, police attention, convictions, probation and trust in contacts.
- Prison contacts: discover fellow inmates, build trust, receive mentoring, keep contacts after release.
- Age-restricted underground groups with three promotion levels, abstract jobs and unreliable allies.
- Police attention cooldown, limited probation, rehabilitation and leaving the network.
- Prison-year adult living costs reduced to 600 € without retroactive debt adjustment.
- New crime and prison menus, save validation, time rewind, engine and browser tests.
- Fictional gameplay, not a complete Mafia Job Pack.



## 0.10.0 – 2026-10-27 (Actor special career)

- Optional acting skill and acting career persistence, backwards compatible with schema-1 saves and Time Machine.
- Acting lessons from eight years old, faster progression for the acting special talent.
- Adult extra work, talent agent hiring, agent casting recommendations, audition limits and role-based skill/age requirements.
- Fictional castings for seven film and TV offers with varied salaries, scripts, lead/supporting roles and production lengths.
- Production-year net pay and 12% talent agent commission; critic reviews, reputation, fame and occasional awards.
- Multi-year TV series contracts and one-year film production, rehearsals, quitting with reputational damage, persistent filmography.
- Exclusive occupation checks across acting, music and standard employment. Hollywood Star recognizes active actor careers.
- Responsive client UI, engine safety checks, automated tests and accurate feature status in the free premium inventory.
- Remaining differences documented in docs/ACTOR_CAREER.md. No original commercial game assets or licenses used.



## 0.9.0 – 2026-10-27 (Musician Special Career)

- Musician job pack partially implemented: four learnable music skills from childhood, three lessons per role/year, and meaningful music talent acceleration.
- Solo and band auditions with age, skill, annual attempt limits and multiple fictional labels, genre, contract term and royalties.
- Release singles and albums with production costs, sales, royalties, popularity, fame and catalog history.
- Concerts, multi-city tours, promotion campaigns and recording-contract exit with annual costs, risks and limits.
- Old recordings continue earning discounted annual royalties, while fame and contract lengths change with elapsed years.
- Music careers block incompatible normal full-time jobs; optional save fields preserve old saves and Time Machine checkpoints.
- Dedicated career and activities interface, mobile touch layout, engine + E2E regression checks.
- **Not equivalent to BitLife's complete Musician DLC:** missing role variety, contracts negotiations, bands with individual members, charts, certifications, awards and music-producer integrations.



## 0.8.0 – 2026-10-27 (Familie, Freundschaften, Versöhnung, Konsequenzen)

- Freundschaften aktiv suchen und Beziehungen mit eigenem Vertrauenswert und Kontakthistorie führen.
- Familientage, Entschuldigungen, finanzielle Unterstützung durch Eltern/Freunde, Kontaktabbrüche und Versöhnungsversuche.
- Neue Kinderförderung mit gespeichertem Entwicklungswert, laufendem Unterhalt und Einfluss auf den nächsten Charakter nach Generationswechsel.
- Scheidungen mit modellierter Vermögensaufteilung. Trennungen erzeugen lebende ehemalige Partner statt Personen irrtümlich als verstorben zu markieren.
- Finanzielle Bewertung und Erbschaft berücksichtigen jetzt Wertpapiere und vorhandene Kreditschulden.
- Mobile Beziehungseinträge und zusätzliche Interaktionen samt Vertrauen, ehemaliger Partnerschaft und Entwicklungsstand.
- Automatisierte Regressionstests sowie dokumentierte Unterschiede zum Original in docs/FAMILY_RELATIONSHIPS.md.



## 0.7.0 – 2026-10-27 (Schule, Zeugnisse, Erkrankungen)

- School report card from age 6 to 17: graded performance, attendance, discipline and activities.
- Meaningful study actions, tutoring, classroom discussions, truancy and four extracurricular clubs.
- Yearly grade dynamics, school conflicts with three decisions, graduation evaluation, small academic scholarship for excellent grades.
- Optional persistent short-term illness state; new doctor appointment, treatment, therapy and rest interactions.
- Visual school report card, activity submenus and accessible health interaction screen.
- Optional fields preserve schema-1 compatibility with prior saves, with strict validation and time-rewind support.
- Additional engine and mobile browser regression tests; documented mechanics in docs/SCHOOL_HEALTH_DESIGN.md.
- Original gameplay tuning, schools, healthcare and graphics remain proprietary; these mechanics are an independent design.



## 0.6.0 – 2026-10-27 (Screenshot-Vergleich: Profile, Menüs und echtes Alltags-Gameplay)

- Character creation now generates a country-appropriate birthplace, birthday, zodiac sign, parent household and parental occupation.
- Own BitLife-inspired menu architecture: full-screen blue activity/asset/relationship screens with grey section bars, close-to-life interaction and age restrictions.
- Personal profile popup with current stats, identity, birthplace and birthday.
- Actual adoption and fertility-clinic actions, driving licence test, personal credits with amortization and annual interest, basic casino visit, identity update and accessories.
- Relationship index grouped by parents, partners, children and friends.
- Original avatar icons, text and CSS; no protected original art, logos, audio, texts or ad assets reproduced.
- Extended save validator and deterministic engine tests with mobile Chromium smoke checks.
- Screen-by-screen remaining gap analysis: docs/SCREENSHOT_GAP_ANALYSIS.md.



## 0.5.0 – 2026-10-26 (Premium-Inventar und spielbare Sonderfunktionen)

- Investor subset: five fictional asset classes, annual prices, share purchases and sales, portfolio valuation, dividends, advisor decisions, insolvency risk through broader game economics.

- 40 nachgewiesene bzw. community-recherchierte Add-on-Angebote als strukturierter Katalog mit Herkunft und ehrlichem Status (nicht unbedingt vollständig).
- Neues Premium-Inventar mit bedienbaren Extras und kostenloser Admin-Freischaltung für alle tatsächlich programmierten Mechaniken.
- Time Machine: bounded snapshots (max. 15 Alterungsschritte), 1–5 Jahre zurück, auch nach dem Tod; Zukunftsstände verfallen.
- Golden Pacifier: Familienplanung mit bis zu drei Kindern, frei gewähltem Geschlecht und vererbtem Spezialtalent; jährlich begrenzt.
- Golden Diploma: Auswahl von bis zu zwei individuellen Sofortabschlüssen.
- Get Out of Jail Free Card: vorzeitige Freilassung und Löschung des vereinfachten Vorstrafenstatus.
- Hollywood Star: Instant-Bekanntheit in ausgewählten normalen Berufen und als Unternehmer/in.
- Zusätzlich vier gewöhnliche, bekanntheitsfähige Berufe; bestehende Spielstände mit Schema 1 bleiben nutzbar.
- Neue Engine- und mobile UI-Regressionstests sowie recherchierte Quellen in docs/PREMIUM_INVENTORY.md.
- **Nicht enthalten:** vollständige Original-Spiel-DLCs, audiovisuelle Originaldateien, Originaltexte oder exakte proprietäre Berechnungsregeln.



## 0.4.0 – 2026-10-26 (Social Media, Unternehmertum, Vermietung)

- New optional save-state fields for social platform accounts, fame, business ownership and per-property rentals.
- Five playable social platforms: posting, follower growth and churn, viral chances, annual post quotas and sponsorship payments.
- Three startup business types with separated company accounts, product research, marketing, staff, annual revenue/cost accounting, bankruptcy and sale.
- House rentals with tenant matching, vacancy, rent, repairs, condition and eviction.
- New activity, career and property menus using existing touch UI.
- Automated regression tests cover expansion entry conditions, state validation, financing, bankruptcy and save compatibility.
- **Scope warning:** These are independent simulations of documented feature categories, not 1:1 implementations of their original interfaces, tuning or DLC content.


## 0.3.0 – 2026-10-26 (menus, prison, careers, life feed)

- Drill-down activity categories and relationship detail screens inspired by familiar life-sim navigation; all artwork and texts are original.
- Condensed chronology: the latest five age groups are shown by default, with expandable previous years and long-action histories.
- Distinct theft risks and two attempts per year, with meaningful prison restrictions (fixes repeated crime while incarcerated).
- Prison-yard exercises, cell meditation, prison library and low-paid work; prison-specific annual event.
- Career performance, annual hard-work choice, raise negotiations and advancement-based salary bonuses.
- Additional options: library, walks, volunteering, holidays, lottery, gifts and spending time together.
- Version-1 save files remain readable; all new state fields are optional and individually validated.
- Free admin attribute editor on life creation and during an active life (four live-updating controls, backed by the reducer and tests).
- Automated regression tests added for prison restrictions, crime quotas, career progression, and legacy save compatibility.

**Limitations:** The original game's exact formulas, menus, media and DLC gameplay are not fully reproduced. iPhone Safari hardware validation remains outstanding.


## v0.2.0 – Klassische mobile Life-Sim-Oberfläche

- Rot gehaltene Kopfzeile, Charakterprofil mit Avatar, Land, Lebensphase und Kontostand
- Chronologisch gruppierter, scrollbarerer Lebenslauf mit Altersüberschriften
- Große, immer erreichbare grüne Alters-Schaltfläche in blauer Navigation
- Vier permanente farbige Statusbalken für Glück, Gesundheit, Intelligenz und Aussehen
- Smartphone-taugliches Hochformat, Safe-Area-Abstände und eigenständige Icons
- Navigation direkt zu Beruf, Besitz, Beziehungen und Aktivitäten
- Aktualisierte Playwright-Mobiltests mit Offline-/Speicherstandprüfung und Screenshot-Artefakt
- Unverändertes Savegame-Schema 1: bestehende Speicherstände werden weiterverwendet

**Offen:** Die meisten Erweiterungen und Spezialkarrieren des Referenzspiels fehlen; keine nachgewiesene 1:1-Funktionsgleichheit. Safari auf einem echten iPhone muss noch separat geprüft werden.

# Changelog

## 0.1.0 – 2026-10-25 (initial playable milestone)

- Standalone German text-based life simulation with a new name, layout, writing, and custom app icon.
- Deterministic central TypeScript life simulation and action reducer.
- Birth, aging, education, eight careers, salaries and expenses, health, relationships, children, generational succession, assets, emigration, and simplified crime/jail.
- IndexedDB automatic saves; multiple lives; JSON export/import with validation; all own implemented content free.
- Independent mobile-first DOM UI and locally synthesized audio feedback.
- Offline-ready PWA, hashed cache revisions, iPhone icons and relative-path hosting support.
- 15 passing Node state/unit/static tests, with 80 long-running bot lives; GitHub Actions CI, Pages deploy workflow, and prepared Playwright smoke test.
- Research-based, explicitly **non-exhaustive** reference feature matrix and architecture documentation.

### Known limitations

- Large majority of the reference game's optional content and DLCs are not implemented.
- Probability calculations, events, wages, balance, cultures, country rules, and UI do not reproduce the original game's exact behavior.
- Physical iPhone/Safari testing and CI E2E execution have not been performed in this execution environment.
- GitHub repository could not be created automatically (GitHub tool does not expose repository creation).
- Public HTTPS deployment is not active until the repository is created and Pages enabled.
