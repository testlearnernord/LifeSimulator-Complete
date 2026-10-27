# Changelog

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
