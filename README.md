# The Kinetic Engine

**The Kinetic Engine** is a modular training journal built as a lightweight front-end web app. It combines workout tracking, cardio logging, body composition monitoring, dashboards, notifications, local backup/import tools, and Progressive Web App foundations in a single static project.

## Overview

The app is designed to work without a backend. It focuses on fast interaction, a polished desktop-style UI, and local persistence so it can be deployed easily as a static site, including through GitHub Pages.

## Features

### Training
- Weekly training flow with dedicated workout days and schedule tiles
- Check-in flow for marking workout days as active or completed
- Rest timer widget for managing breaks between sets
- 1RM calculator integrated into the training flow
- Workout export/import support

### Cardio
- Manual cardio logging with duration, calories, steps, heart rate, and optional distance
- Automatic pace and speed calculation based on duration and distance
- Quick cardio entry directly from the dashboard
- Weekly cardio stats and recent activity history
- Cardio export/import in JSON format

### Body tracking
- Body measurement logging for weight, body fat, muscle mass, and visceral fat
- Dedicated body composition dashboard and charts
- Quick body-entry modal from the dashboard
- JSON and CSV export support for body data

### UX and app systems
- Notifications drawer with unread badge handling
- Profile modal with custom avatar and display name
- Global settings drawer for goals, rest timer duration, and notification preferences
- Full backup export/import flow
- Protected “clear all data” action with explicit text confirmation

### PWA and deployment foundations
- `manifest.json` support
- App icon support via `apple-touch-icon`
- Service worker registration from `app.js`
- Static-file structure suitable for GitHub Pages deployment

## Tech stack

- HTML5
- CSS3
- Vanilla JavaScript
- Chart.js
- Google Fonts / Material Symbols
- Local browser storage

## Project structure

```text
kinetic-engine/
├── index.html
├── manifest.json
├── style.css
├── icon-192.png
├── icon-512.png
├── sw.js
└── js/
    ├── data.js
    ├── utils.js
    ├── guide.js
    ├── training.js
    ├── cardio.js
    ├── body.js
    ├── dashboard.js
    ├── ui.js
    └── app.js
```

## Getting started

### Run locally

Because this is a static app, the simplest way to run it locally is to open `index.html` in a browser. For better PWA and service worker behavior, use a local static server.

Examples:

```bash
# Python 3
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

### Deploy with GitHub Pages

1. Push the project to a GitHub repository.
2. Open the repository settings.
3. Go to **Pages**.
4. Set **Source** to **Deploy from a branch**.
5. Select the `main` branch and the `/(root)` folder.
6. Save and wait for deployment.

For a repository named `kinetic-engine` under the `migutto` account, the site URL is expected to be:

```text
https://migutto.github.io/kinetic-engine/
```

## Data model and persistence

The application stores user data locally in the browser. That includes workouts, cardio entries, body measurements, profile data, notifications, and settings. Since storage is local-first, backup/export features are important for portability and recovery.

## Notes

- This project is front-end only.
- Some PWA behavior depends on correct `manifest.json` and `sw.js` configuration.
- If you are publishing to GitHub Pages, prefer relative file paths in the app shell.
- The UI currently presents itself as `v3.0`, while some export payloads already use `3.1`; aligning those version markers would improve consistency.

## Suggested screenshots

You can later add screenshots like this:

```md
## Screenshots

![Dashboard](./docs/screenshots/dashboard.png)
![Training](./docs/screenshots/training.png)
![Cardio](./docs/screenshots/cardio.png)
![Body](./docs/screenshots/body.png)
```

## Roadmap ideas

- Refine service worker caching and offline validation
- Unify visible app version with export schema version
- Add stronger form validation and edge-case handling
- Improve mobile responsiveness
- Add optional cloud sync or authenticated backup layer

## License

Add your preferred license here.
