# The Kinetic Engine

**The Kinetic Engine** is a local-first training journal built as a static front-end app. It combines workout logging, cardio tracking, body-composition monitoring, dashboards, notifications, backup tools, and a stronger installable PWA layer in one project.

## Overview

The app is intentionally backend-free today. It is designed to feel fast, personal, and portable: open it in a browser, install it like an app where supported, keep data locally, and export what matters when needed.

## Current Product Snapshot

### Training
- Weekly workout flow with schedule tiles and check-in actions
- Date backfill for logging an earlier training session
- Rest timer widget
- 1RM calculator
- Workout import/export support

### Cardio
- Manual cardio logging with date, duration, distance, calories, steps, and heart rate
- Distance is now the primary metric for pace and speed calculations
- Quick cardio entry directly from the dashboard
- Weekly cardio stats and recent activity history
- JSON export/import for cardio data

### Body Tracking
- Body measurement logging for weight, body fat, muscle mass, and visceral fat
- Dedicated body-composition dashboard and charts
- Quick body entry from the dashboard
- JSON and CSV export support
- Body data import/export from Settings

### Dashboard and UX
- Refreshed top dashboard cards with more useful "right now" metrics
- Quick actions for cardio and body entry
- Weekly and monthly summary cards generated locally
- Notifications drawer with unread badge handling
- Profile modal with custom avatar and display name
- Settings drawer with goals, rest timer, notification preferences, import/export, and destructive-action confirmation
- "Clear all data" requires typing `TAK`

### Exercise Encyclopedia
- The old guide section is now presented as an exercise encyclopedia
- Wrapped category chips instead of awkward sideways scrolling
- Denser detail layout with less wasted space
- Decorative low-value "Technika Mistrzowska" block removed

### PWA
- Installable manifest via `manifest.webmanifest`
- Dedicated service worker in `sw-pwa.js`
- Offline fallback page
- Install banner and topbar install/update action
- Waiting-update banner for new versions
- iOS install guidance fallback
- Storage-persistence request to reduce accidental browser eviction

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Chart.js
- Google Fonts / Material Symbols
- Local browser storage

## Project Structure

```text
kinetic-engine/
|-- index.html
|-- manifest.webmanifest
|-- manifest.json
|-- offline.html
|-- style.css
|-- icon-192.png
|-- icon-512.png
|-- sw-pwa.js
|-- sw.js
`-- js/
    |-- data.js
    |-- utils.js
    |-- guide.js
    |-- training.js
    |-- cardio.js
    |-- body.js
    |-- dashboard.js
    |-- ui.js
    |-- pwa.js
    `-- app.js
```

### Notes on PWA Files

- `manifest.webmanifest` is the active manifest linked from `index.html`
- `sw-pwa.js` is the active service worker registered by the app
- `manifest.json` remains in the repo as a compatibility copy and should stay aligned
- `sw.js` is now legacy and should be removed once the new PWA flow is fully smoke-tested

## Getting Started

### Run Locally

Because this is a static app, you can open `index.html` directly, but PWA behavior is best tested through a local static server.

Example:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

### Deploy with GitHub Pages

1. Push the project to a GitHub repository.
2. Open repository settings.
3. Go to **Pages**.
4. Set **Source** to **Deploy from a branch**.
5. Select the `main` branch and the `/(root)` folder.
6. Save and wait for deployment.

Relative paths are already in place, which makes the current app shell safer for GitHub Pages and similar static hosting setups.

## Data and Persistence

The app stores data locally in the browser:

- workouts
- cardio entries
- body measurements
- profile data
- notifications
- settings

Because the product is local-first, import/export and backup flows are part of the core experience rather than optional extras.

## Known Gaps

- Custom training plans are not implemented yet; the current model is still built around the existing weekly plan structure.
- Cloud sync and account-based storage do not exist yet.
- Full English/i18n support is still pending.
- The legacy `sw.js` file is still in the repo and should be removed after broader browser testing.
- The UI-visible app version and export schema version should be aligned.

## Near-Term Roadmap

- Build a real custom plan system with default-plan selection
- Add cloud save/sync architecture
- Add scheduled weekly/month-end summary flows and notifications
- Finish PWA smoke-testing on desktop Chrome, Android, and iOS Safari
- Prepare the app for English/i18n

## License

Add your preferred license here.
