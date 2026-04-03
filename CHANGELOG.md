# Changelog

All notable changes to **The Kinetic Engine** will be documented in this file.

The format loosely follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and is adapted for a solo GitHub-hosted project.

---

## [Unreleased]

### Added

- Dashboard quick actions for **Quick Cardio** and **Quick Body Measurement**.
- Quick cardio modal with support for:
  - date
  - duration
  - steps
  - calories
  - optional manual distance
- Quick body modal with fast weight and body-fat logging.
- Cardio pace and speed calculation based on duration and distance.
- Cardio JSON export and import flow.
- Full backup export/import from Settings.
- Confirmation gate requiring `TAK` before wiping all application data.
- Weekly cardio summary cards and richer cardio activity history rendering.

### Changed

- Switched frontend asset references in `index.html` to deployment-friendly relative paths.
- Updated service worker registration in `app.js` to use `sw.js` directly.
- Extended cardio logging logic to derive missing distance from steps and missing steps from distance.
- Improved dashboard-to-data-entry flow by allowing logging without leaving the home screen.
- Reset cardio form metrics after save for cleaner repeated entry flow.
- Refreshed settings drawer behavior to clear destructive confirmation input on open.

### Improved

- Better daily-use ergonomics for the most common actions.
- Safer local data handling through backup and wipe confirmation.
- More complete cardio analytics in the UI.
- Better readiness for GitHub Pages deployment.

### Fixed

- Broken or outdated path assumptions around CSS/icon/manifest usage for static hosting.
- Incorrect service worker registration path for the current deployment structure.
- Missing dashboard shortcuts for common logging actions.
- Missing import/export affordances for cardio and full backup workflows.

### Known Issues

- Export payload versions already reference `3.1`, while the settings UI still displays `v3.0`.
- Quick modal date prefill only fills empty inputs, so previously retained dates can persist between openings.
- There is minor transitional/dead code around modal patching that should be cleaned up later.

---

## [Earlier Development]

### Added

- Core application shell with sidebar, topbar, panels, modals, drawers, and toast system.
- Training module with weekly navigation, day selection, check-ins, and session tracking.
- Rest timer widget and 1RM calculator.
- Cardio module for walking/activity logging.
- Body composition module with charts, history, smoothing options, and exports.
- Profile view and notification drawer.
- PWA-oriented document head configuration.

### Improved

- Modular file structure for a cleaner front-end codebase.
- Product identity and UI consistency across tabs.
- Dashboard visibility for key fitness signals.

---

## Version Notes

Current UI-visible app version: `v3.0`  
Current export payload version markers seen in code: `3.1`
