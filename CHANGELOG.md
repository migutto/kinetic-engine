# Changelog

All notable user-facing changes to **The Kinetic Engine** are documented here.

---

## [2026-04-04]

### Added

- Date backfill for training entries.
- Weekly and monthly dashboard summary cards generated locally.
- Dashboard quick actions for cardio and body entry.
- Body data import/export from Settings.
- A stronger PWA layer built around:
  - `manifest.webmanifest`
  - `sw-pwa.js`
  - `js/pwa.js`
  - `offline.html`
- Install/update surfaces in the UI:
  - topbar action button
  - install banner
  - update-ready banner
  - iOS install guidance fallback

### Changed

- Cardio distance is now treated as the primary metric for pace and speed.
- Dashboard top cards were refreshed to show more useful current-state metrics.
- The old guide section is now presented as an exercise encyclopedia.
- Encyclopedia categories now wrap instead of forcing sideways scrolling.
- Exercise detail cards use space more efficiently.
- Destructive clear-all copy now clearly matches the current data scope and still requires `TAK` confirmation.
- Active PWA registration now flows through the dedicated PWA module rather than the old direct `sw.js` path.

### Fixed

- State overwrite bug where a fresh notification could be lost behind an older localStorage snapshot.
- Dashboard and Cardio overflow issues on smaller layouts.
- Fragile icon and path assumptions in the PWA setup.
- Broken or incomplete install/update behavior for the app shell.

### Known Follow-Ups

- `sw.js` is still present as a legacy file and should be removed after broader smoke testing.
- Cloud sync still does not exist.
- The UI-visible app version and export payload version should be aligned.

---

## [2026-04-03 and earlier]

### Added Over Time

- Core dashboard, training, cardio, and body-composition modules.
- Rest timer and 1RM calculator.
- Profile and notifications.
- Backup/import flows.
- Local-first persistence.

### Direction

The app has moved from a simple static workout logger toward a more complete local-first training cockpit with installable PWA behavior.
