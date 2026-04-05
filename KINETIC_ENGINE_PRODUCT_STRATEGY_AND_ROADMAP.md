# Kinetic Engine - Product Strategy and Roadmap

## 1. Executive Summary

The Kinetic Engine has clearly moved beyond the stage of being "just a workout logger". It is now a local-first training cockpit with:

- strength tracking
- cardio logging
- body-composition tracking
- quick dashboard actions
- weekly/monthly summaries
- installable PWA behavior
- backup and import/export flows

The strategic question is no longer "what should this app become?". The better question is now: **which remaining upgrades turn this into a truly mature product?**

---

## 2. Current State of the Original Idea Set

### Already Implemented

The following ideas are no longer open roadmap items because they are now present in the product:

- training date backfill
- body import/export in Settings
- destructive clear-all confirmation with `TAK`
- Dashboard and Cardio responsive pass
- encyclopedia rename and major layout cleanup
- category wrapping instead of forced horizontal scrolling
- removal of the low-value "Technika Mistrzowska" block
- improved dashboard top cards
- quick dashboard buttons for cardio and body entry
- local weekly and monthly summary cards
- stronger PWA foundation with install/update/offline flows
- distance-first cardio logic for pace and speed

### Partially Implemented

These directions are underway, but not fully complete:

- **PWA maturity**
  The technical foundation and legacy cleanup are now in place, but real browser/device smoke testing and clear platform notes are still pending.

- **Summary system**
  Weekly/monthly summary cards exist, but automatic end-of-period summary events and notifications do not.

### Still Open

These are still major roadmap items:

- custom training plans with default-plan selection
- cloud save and sync
- English / i18n support
- WGER research/integration decision
- scheduled weekly/month-end summary flow

---

## 3. Product Positioning

The strongest current identity for the app is:

> A polished, local-first, installable training journal for people who want one place for strength, cardio, body data, and personal progress.

That positioning matters because it keeps the product focused. The app does not need to become "everything fitness" at once. It should first become extremely solid at the job it already does.

---

## 4. Recommended Roadmap

## Phase 1 - Product Foundation Upgrade
Focus: remove the biggest remaining product limitation.

### Main goal
Build a real custom training plan system.

### Why first
The current plan model is still the clearest ceiling on the app. It limits how reusable the product can become.

### Scope
- create, edit, duplicate, and delete plans
- store plans persistently
- choose a default plan
- make Dashboard, Training, and schedule flows use the selected plan

---

## Phase 2 - Product Reliability and Retention
Focus: make existing data feel more alive and more durable.

### Main goals
- PWA smoke testing and platform notes
- scheduled weekly/month-end summary flow
- version consistency

### Why now
The app already tracks a lot of useful data. The next value jump comes from making the experience more trustworthy and more habit-forming.

---

## Phase 3 - Platform Maturity
Focus: move beyond one-browser persistence.

### Main goal
Cloud save and sync.

### Why later
This is strategically important but larger than the remaining local-first improvements. It should be built after the product shape is more stable.

---

## Phase 4 - Reach and Expansion
Focus: broaden usefulness once the core is stable.

### Main goals
- English / i18n support
- exportable progress reports
- WGER research and integration decision
- adaptive insights and retention loops

---

## 5. Recommended Priority Order in Plain Language

1. Finish the custom plan system.
2. Validate the new PWA flow on real devices and document platform limits.
3. Finish the summary flow beyond static cards.
4. Add cloud save/sync.
5. Add English/i18n.
6. Explore WGER and smarter insight features.

---

## 6. Final Assessment

The product direction is strong because recent work solved many of the "rough edge" problems that often block trust:

- weak cardio metric logic
- awkward terminology
- missing backfill in training
- poor responsiveness in important screens
- incomplete PWA behavior
- weak period-level summaries

That changes the roadmap. The app is no longer in the phase where basic polish dominates every decision. It is now ready for deeper product work, especially custom plans and long-term data durability.
