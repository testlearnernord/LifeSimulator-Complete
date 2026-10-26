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
