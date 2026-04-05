// ═══════════════════════════════════════════════════════════════
// THE KINETIC ENGINE — ui.js
// ═══════════════════════════════════════════════════════════════

// ── REST TIMER ──────────────────────────────────────────────────
let timerState = { running: false, total: 90, remaining: 90, interval: null };

function startRestTimer(secs, exName, setNum) {
  clearInterval(timerState.interval);
  timerState.total = secs; timerState.remaining = secs; timerState.running = true;
  const info = document.getElementById('timer-set-info');
  if (info) info.textContent = exName.split(' ')[0] + '\nSeria ' + setNum;
  showTimer();
  timerState.interval = setInterval(() => {
    timerState.remaining--;
    updateTimerDisplay();
    if (timerState.remaining <= 0) {
      clearInterval(timerState.interval); timerState.running = false; hideTimer();
      try {
        const ac = new (window.AudioContext || window.webkitAudioContext)();
        const o = ac.createOscillator(); const g = ac.createGain();
        o.connect(g); g.connect(ac.destination);
        o.frequency.value = 880;
        g.gain.setValueAtTime(.3, ac.currentTime);
        g.gain.exponentialRampToValueAtTime(.001, ac.currentTime + .5);
        o.start(); o.stop(ac.currentTime + .5);
      } catch (e) {}
      showToast('Odpoczynek skończony! 💪', 'fitness_center', 'var(--p)');
    }
  }, 1000);
}

function updateTimerDisplay() {
  const el = document.getElementById('timer-display');
  const bar = document.getElementById('timer-prog');
  if (!el) return;
  const m = Math.floor(timerState.remaining / 60);
  const s = timerState.remaining % 60;
  el.textContent = m + ':' + String(s).padStart(2, '0');
  if (bar) bar.style.width = (timerState.remaining / timerState.total * 100) + '%';
  el.style.color = timerState.remaining <= 10 ? 'var(--er)' : timerState.remaining <= 30 ? 'var(--t)' : 'var(--p)';
}

function showTimer() { const el = document.getElementById('rest-timer'); if (el) el.style.transform = 'translateX(-50%) translateY(0)'; updateTimerDisplay(); }
function hideTimer() { const el = document.getElementById('rest-timer'); if (el) el.style.transform = 'translateX(-50%) translateY(120px)'; }
function skipTimer() { clearInterval(timerState.interval); timerState.running = false; hideTimer(); }
function addTimerTime(s) { timerState.remaining += s; timerState.total = Math.max(timerState.total, timerState.remaining); updateTimerDisplay(); }

// ── POWIADOMIENIA ───────────────────────────────────────────────
function addNotification(title, body, icon = 'notifications', dataRef = null) {
  const data = dataRef || getData();
  data.notifications.unshift({ id: Date.now().toString(), title, body, icon, date: new Date().toISOString(), read: false });
  if (data.notifications.length > 20) data.notifications = data.notifications.slice(0, 20);
  if (!dataRef) saveData(data);
  updateNotifBadge(data);
  return data;
}

function updateNotifBadge(data = getData()) {
  const unread = data.notifications.filter(n => !n.read).length;
  const dot = document.getElementById('notif-dot');
  if (dot) dot.style.display = unread > 0 ? 'block' : 'none';
}

function openNotifications() {
  const data = getData();
  const unread = data.notifications.filter(n => !n.read).length;
  document.getElementById('notif-unread-label').textContent = unread > 0 ? `${unread} nieprzeczytanych` : 'Wszystko przeczytane';
  const colors = { emoji_events: 'var(--t)', directions_walk: 'var(--p)', fitness_center: 'var(--s)', notifications: 'var(--osd)' };
  const bgs    = { emoji_events: 'rgba(243,255,202,.08)', directions_walk: 'rgba(137,172,255,.08)', fitness_center: 'rgba(166,140,255,.08)' };
  document.getElementById('notif-list').innerHTML = data.notifications.length === 0
    ? '<div style="text-align:center;padding:40px;color:var(--osd);font-size:13px;opacity:.6;">Brak powiadomień</div>'
    : data.notifications.map(n => `
      <div class="notif-item ${!n.read ? 'unread' : ''}">
        <div class="notif-icon" style="background:${bgs[n.icon] || 'rgba(255,255,255,.05)'};">
          <span class="material-symbols-outlined" style="color:${colors[n.icon] || 'var(--osd)'};">${n.icon}</span>
        </div>
        <div style="flex:1;">
          <div style="font-weight:700;font-size:13px;margin-bottom:3px;">${n.title}</div>
          <div style="font-size:11px;color:var(--osd);line-height:1.4;">${n.body}</div>
          <div style="font-size:9.5px;color:var(--osd);opacity:.6;margin-top:5px;">${new Date(n.date).toLocaleString('pl-PL', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</div>
        </div>
      </div>`).join('');
  data.notifications.forEach(n => n.read = true);
  saveData(data); updateNotifBadge();
  openDrawer('notif');
}

// ── USTAWIENIA ──────────────────────────────────────────────────
function openSettings() {
  const s = getSettings();
  const sg = document.getElementById('set-step-goal');
  const cg = document.getElementById('set-cal-goal');
  const rd = document.getElementById('set-rest-dur');
  if (sg) sg.value = s.stepGoal     || 8000;
  if (cg) cg.value = s.calGoal      || 2500;
  if (rd) rd.value = s.restDuration || 90;
  const nt = document.getElementById('set-notif-training');
  const ns = document.getElementById('set-notif-steps');
  if (nt) nt.checked = s.notifTraining !== false;
  if (ns) ns.checked = s.notifSteps    !== false;
  // Wyczyść pole potwierdzenia
  const ci = document.getElementById('clear-confirm-inp');
  if (ci) ci.value = '';
  refreshGuideImportStatus();
  openDrawer('settings');
}

function clearAllData() {
  const ci = document.getElementById('clear-confirm-inp');
  if (!ci || ci.value.trim().toUpperCase() !== 'TAK') {
    showToast('Wpisz TAK aby potwierdzić usunięcie', 'warning', 'var(--er)');
    if (ci) { ci.focus(); ci.style.borderColor = 'var(--er)'; setTimeout(() => ci.style.borderColor = '', 1500); }
    return;
  }
  localStorage.removeItem('ke_data');
  showToast('Wszystkie dane usunięte', 'delete', 'var(--er)');
  closeDrawer('settings');
  location.reload();
}

// ── PROFIL ──────────────────────────────────────────────────────
const WGER_IMPORT_SNAPSHOT_PATH = 'data/wger-pl-snapshot.json';
let wgerImportInFlight = false;

function buildGuideImportStatusText() {
  const meta = typeof getGuideImportMeta === 'function' ? getGuideImportMeta() : null;
  const totalExercises = typeof getGuideData === 'function' ? getGuideData().length : 0;
  if (!meta) return `Biblioteka lokalna: ${totalExercises} cwiczen. Import z wger jeszcze nie byl wykonany.`;

  const importDate = meta.importedAt ? new Date(meta.importedAt).toLocaleString('pl-PL', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  }) : 'brak daty';

  const sourceLabel = meta.source === 'wger-snapshot' ? 'snapshotu PL wger' : 'wger';
  return `Biblioteka: ${meta.totalCount || totalExercises} cwiczen. Z ${sourceLabel} dodano ${meta.importedCount || 0} rekordow (${importDate}).`;
}

function refreshGuideImportStatus() {
  const statusEl = document.getElementById('guide-import-status');
  const resetBtn = document.getElementById('guide-import-reset-btn');
  const meta = typeof getGuideImportMeta === 'function' ? getGuideImportMeta() : null;

  if (statusEl) statusEl.textContent = buildGuideImportStatusText();
  if (resetBtn) resetBtn.disabled = !meta;
}

async function importGuideFromWger() {
  if (wgerImportInFlight) return;

  wgerImportInFlight = true;
  const importBtn = document.getElementById('guide-import-wger-btn');
  const originalLabel = importBtn ? importBtn.innerHTML : '';

  try {
    if (importBtn) {
      importBtn.disabled = true;
      importBtn.innerHTML = '<span style="display:flex;align-items:center;justify-content:center;gap:6px;"><span class="material-symbols-outlined" style="font-size:15px;">sync</span>Pobieranie...</span>';
    }

    showToast('Laduje polski snapshot cwiczen...', 'sync', 'var(--p)');

    const response = await fetch(WGER_IMPORT_SNAPSHOT_PATH, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const payload = await response.json();
    const imported = Array.isArray(payload?.exercises) ? payload.exercises : [];
    if (!imported.length) throw new Error('EMPTY_IMPORT');

    saveGuideImports(imported, {
      source: 'wger-snapshot',
      importedAt: payload?.generatedAt || new Date().toISOString()
    });

    refreshGuideImportStatus();
    if (state.currentTab === 'guide') renderGuide();
    showToast(`Zaimportowano ${imported.length} cwiczen PL`, 'check_circle', 'var(--s)');
  } catch (error) {
    console.error('wger snapshot import failed', error);
    showToast('Import snapshotu PL nie udal sie.', 'error', 'var(--er)');
  } finally {
    if (importBtn) {
      importBtn.disabled = false;
      importBtn.innerHTML = originalLabel;
    }
    wgerImportInFlight = false;
  }
}

function resetGuideImport() {
  if (!getGuideImportMeta()) {
    showToast('Nie ma aktywnego importu do wyczyszczenia.', 'info', 'var(--osd)');
    return;
  }

  if (!confirm('Usunac wszystkie cwiczenia zaimportowane z wger i wrocic do lokalnej biblioteki?')) return;

  clearGuideImports();
  refreshGuideImportStatus();
  if (state.currentTab === 'guide') renderGuide();
  showToast('Przywrocono lokalna biblioteke cwiczen.', 'delete', 'var(--er)');
}

function openProfile() {
  const data = getData(); const p = data.profile;
  const ni = document.getElementById('profile-name-inp');
  if (ni) ni.value = p.name || '';
  document.getElementById('profile-display-name').textContent             = p.name || 'Mój Profil';
  document.getElementById('profile-avatar-display').firstChild.textContent = p.avatar || '💪';
  document.getElementById('avatar-picker').innerHTML = AVATARS.map(a =>
    `<div class="av-opt ${p.avatar === a ? 'selected' : ''}" onclick="selectAvatar('${a}')">${a}</div>`
  ).join('');
  const totalWorkouts = Object.values(data.workouts).filter(w => w.completed).length;
  const totalCardio   = data.cardio.length;
  const totalDist     = data.cardio.reduce((s, c) => s + (c.distKm || (c.steps || 0) * 0.73 / 1000), 0);
  document.getElementById('profile-stats-grid').innerHTML = `
    <div class="profile-stat"><div class="profile-stat-val" style="color:var(--p);">${totalWorkouts}</div><div class="profile-stat-lbl">Treningi</div></div>
    <div class="profile-stat"><div class="profile-stat-val" style="color:var(--s);">${totalCardio}</div><div class="profile-stat-lbl">Cardio</div></div>
    <div class="profile-stat"><div class="profile-stat-val" style="color:var(--t);">${totalDist.toFixed(1)}</div><div class="profile-stat-lbl">km łącznie</div></div>`;
  openModal('profile');
}

function selectAvatar(a) {
  document.querySelectorAll('.av-opt').forEach(el => el.classList.remove('selected'));
  event.target.classList.add('selected');
  document.getElementById('profile-avatar-display').firstChild.textContent = a;
}
function previewName(val) { document.getElementById('profile-display-name').textContent = val || 'Mój Profil'; }

function saveProfile() {
  const data = getData();
  const name = document.getElementById('profile-name-inp').value || 'Mój Profil';
  const selectedAv = document.querySelector('.av-opt.selected');
  const avatar = selectedAv ? selectedAv.textContent : '💪';
  data.profile = { name, avatar };
  saveData(data);
  document.getElementById('sidebar-name').textContent   = name;
  document.getElementById('sidebar-avatar').textContent = avatar;
  showToast('Profil zapisany!', 'person', 'var(--p)');
  closeModal('profile');
}

// ── CHECK-IN ────────────────────────────────────────────────────
const PROFILE_GOAL_LABELS_V1 = {
  recomp: 'Recomp',
  'fat-loss': 'Redukcja',
  muscle: 'Masa',
  strength: 'Sila',
  conditioning: 'Kondycja'
};

function getProfileGoalLabel(goal) {
  return PROFILE_GOAL_LABELS_V1[goal] || PROFILE_GOAL_LABELS_V1.recomp;
}

function updateSidebarProfileSummary(profile = getProfile()) {
  const nameEl = document.getElementById('sidebar-name');
  const avatarEl = document.getElementById('sidebar-avatar');
  const metaEl = document.getElementById('sidebar-profile-meta');

  if (nameEl) nameEl.textContent = profile.name || 'Moj Profil';
  if (avatarEl) avatarEl.textContent = profile.avatar || '💪';
  if (metaEl) metaEl.textContent = getProfileGoalLabel(profile.primaryGoal);
}

function refreshProfilePreview() {
  const name = document.getElementById('profile-name-inp')?.value.trim() || 'Moj Profil';
  const goal = document.getElementById('profile-goal-inp')?.value || 'recomp';
  const focus = document.getElementById('profile-focus-inp')?.value.trim() || '';
  const activePlan = getActiveTrainingPlan();

  const displayName = document.getElementById('profile-display-name');
  const heroSub = document.getElementById('profile-hero-sub');
  const goalChip = document.getElementById('profile-goal-chip');
  const planChip = document.getElementById('profile-plan-chip');

  if (displayName) displayName.textContent = name;
  if (heroSub) heroSub.textContent = focus || `Budujesz system pod ${getProfileGoalLabel(goal).toLowerCase()} z planem ${activePlan.name}.`;
  if (goalChip) goalChip.textContent = getProfileGoalLabel(goal);
  if (planChip) planChip.textContent = activePlan.name;
}

function openProfile() {
  const data = getData();
  const p = data.profile;
  const settings = getSettings();
  const today = fmtDate(new Date());
  const monday = getMondayOfWeek(today);
  const activePlan = getActiveTrainingPlan();
  const orderedDays = getOrderedPlanDays(activePlan);
  const weekSchedule = getWeekSchedule(monday, activePlan);
  const weekDone = weekSchedule.filter(day => data.workouts[day.date]?.completed).length;
  const weekCardio = data.cardio.filter(entry => entry.date >= monday && entry.date <= addDays(monday, 6));
  const weekDist = globalThis.KECore?.sumCardioDistance
    ? globalThis.KECore.sumCardioDistance(weekCardio)
    : weekCardio.reduce((sum, entry) => sum + (entry.distKm || (entry.steps || 0) * 0.73 / 1000), 0);
  const todaySteps = data.cardio.filter(entry => entry.date === today).reduce((sum, entry) => sum + (entry.steps || 0), 0);
  const totalWorkouts = Object.values(data.workouts).filter(w => w.completed).length;
  const totalCardio = data.cardio.length;
  const totalDist = data.cardio.reduce((sum, entry) => sum + (entry.distKm || (entry.steps || 0) * 0.73 / 1000), 0);
  const latestMeasurement = data.measurements?.length ? data.measurements[data.measurements.length - 1] : null;
  const nextPlannedDay = weekSchedule.find(day => day.date >= today && !data.workouts[day.date]?.completed)
    || weekSchedule.find(day => day.date >= today)
    || null;

  const ni = document.getElementById('profile-name-inp');
  const goalInp = document.getElementById('profile-goal-inp');
  const focusInp = document.getElementById('profile-focus-inp');
  const workoutGoalInp = document.getElementById('profile-workout-goal-inp');
  const cardioGoalInp = document.getElementById('profile-cardio-goal-inp');
  const stepGoalInp = document.getElementById('profile-step-goal-inp');

  if (ni) ni.value = p.name || '';
  if (goalInp) goalInp.value = p.primaryGoal || 'recomp';
  if (focusInp) focusInp.value = p.focusNote || '';
  if (workoutGoalInp) workoutGoalInp.value = p.weeklyWorkoutGoal ?? 3;
  if (cardioGoalInp) cardioGoalInp.value = p.weeklyCardioGoalKm ?? 10;
  if (stepGoalInp) stepGoalInp.value = settings.stepGoal || 8000;

  document.getElementById('profile-avatar-display').firstChild.textContent = p.avatar || '💪';
  document.getElementById('avatar-picker').innerHTML = AVATARS.map(a =>
    `<div class="av-opt ${p.avatar === a ? 'selected' : ''}" onclick="selectAvatar('${a}')">${a}</div>`
  ).join('');

  refreshProfilePreview();

  document.getElementById('profile-stats-grid').innerHTML = `
    <div class="profile-stat">
      <div class="profile-stat-val" style="color:var(--p);">${weekDone}<span style="font-size:14px;"> / ${p.weeklyWorkoutGoal ?? 3}</span></div>
      <div class="profile-stat-lbl">Tydzien treningowy</div>
      <div class="profile-stat-meta">${orderedDays.length} dni w aktywnym planie</div>
    </div>
    <div class="profile-stat">
      <div class="profile-stat-val" style="color:var(--s);">${weekDist.toFixed(1)}</div>
      <div class="profile-stat-lbl">Cardio km</div>
      <div class="profile-stat-meta">Cel: ${(p.weeklyCardioGoalKm ?? 10).toFixed(1)} km / tydzien</div>
    </div>
    <div class="profile-stat">
      <div class="profile-stat-val" style="color:var(--t);">${todaySteps > 1000 ? `${(todaySteps / 1000).toFixed(1)}k` : todaySteps}</div>
      <div class="profile-stat-lbl">Kroki dzisiaj</div>
      <div class="profile-stat-meta">Cel: ${(settings.stepGoal || 8000).toLocaleString()} krokow</div>
    </div>
    <div class="profile-stat">
      <div class="profile-stat-val" style="color:var(--er);">${latestMeasurement ? Number(latestMeasurement.weight || 0).toFixed(1) : '—'}</div>
      <div class="profile-stat-lbl">Ostatni pomiar</div>
      <div class="profile-stat-meta">${latestMeasurement ? formatDatePL(latestMeasurement.date) : 'Dodaj pierwszy pomiar'}</div>
    </div>`;

  const totalsGrid = document.getElementById('profile-totals-grid');
  if (totalsGrid) {
    totalsGrid.innerHTML = `
      <div class="profile-stat"><div class="profile-stat-val" style="color:var(--p);">${totalWorkouts}</div><div class="profile-stat-lbl">Treningi</div></div>
      <div class="profile-stat"><div class="profile-stat-val" style="color:var(--s);">${totalCardio}</div><div class="profile-stat-lbl">Cardio</div></div>
      <div class="profile-stat"><div class="profile-stat-val" style="color:var(--t);">${totalDist.toFixed(1)}</div><div class="profile-stat-lbl">Km lacznie</div></div>`;
  }

  const planStatic = document.getElementById('profile-plan-static');
  if (planStatic) planStatic.textContent = activePlan.name;

  const planSummary = document.getElementById('profile-plan-summary');
  if (planSummary) {
    planSummary.innerHTML = `
      <div class="profile-plan-card">
        <div class="profile-plan-kicker">Aktywny plan</div>
        <div class="profile-plan-name">${activePlan.name}</div>
        <div class="profile-plan-meta">
          ${orderedDays.length} dni treningowych · cel ${p.weeklyWorkoutGoal ?? 3} treningow tygodniowo
          <br>
          ${nextPlannedDay ? `Nastepny dzien: ${nextPlannedDay.name} · ${formatDatePL(nextPlannedDay.date)}` : 'Brak zaplanowanego dnia w tym tygodniu.'}
        </div>
        <button class="btn-g" style="width:100%;" onclick="closeModal('profile');switchTab('training')">Przejdz do treningu</button>
      </div>`;
  }

  openModal('profile');
}

function selectAvatar(a) {
  document.querySelectorAll('.av-opt').forEach(el => el.classList.remove('selected'));
  event.target.classList.add('selected');
  document.getElementById('profile-avatar-display').firstChild.textContent = a;
  refreshProfilePreview();
}

function previewName(val) {
  document.getElementById('profile-display-name').textContent = val || 'Moj Profil';
  refreshProfilePreview();
}

function saveProfile() {
  const data = getData();
  const settings = getSettings();
  const name = document.getElementById('profile-name-inp').value.trim() || 'Moj Profil';
  const selectedAv = document.querySelector('.av-opt.selected');
  const avatar = selectedAv ? selectedAv.textContent : '💪';
  const primaryGoal = document.getElementById('profile-goal-inp').value || 'recomp';
  const focusNote = document.getElementById('profile-focus-inp').value.trim();
  const weeklyWorkoutGoal = Math.max(1, parseInt(document.getElementById('profile-workout-goal-inp').value, 10) || 3);
  const weeklyCardioGoalKm = Math.max(0, parseFloat(document.getElementById('profile-cardio-goal-inp').value) || 0);
  const stepGoal = Math.max(1000, parseInt(document.getElementById('profile-step-goal-inp').value, 10) || 8000);

  data.profile = { name, avatar, primaryGoal, focusNote, weeklyWorkoutGoal, weeklyCardioGoalKm };
  data.settings = { ...settings, stepGoal };
  saveData(data);
  updateSidebarProfileSummary(data.profile);
  showToast('Profil zapisany!', 'person', 'var(--p)');
  closeModal('profile');
}

const PROFILE_GOAL_LABELS_V2 = {
  recomp: 'Recomp',
  'fat-loss': 'Redukcja',
  muscle: 'Masa',
  strength: 'Sila',
  conditioning: 'Kondycja'
};

function getProfileGoalLabelV2(goal) {
  return PROFILE_GOAL_LABELS_V2[goal] || PROFILE_GOAL_LABELS_V2.recomp;
}

function getProfileAvatarFallbackV2() {
  return '\uD83D\uDCAA';
}

function getProfileProgressPctV2(value, goal) {
  const normalizedGoal = Number(goal || 0);
  if (normalizedGoal <= 0) return 0;
  return Math.max(0, Math.min(100, (Number(value || 0) / normalizedGoal) * 100));
}

function formatProfileStepsLabelV2(value) {
  const normalizedValue = Number(value || 0);
  return normalizedValue >= 1000 ? `${(normalizedValue / 1000).toFixed(1)}k` : String(normalizedValue);
}

function buildProfileSnapshotCardV2({ icon, tint, textColor, value, label, target, meta, progressPct = null, progressColor = textColor }) {
  const progressMarkup = Number.isFinite(progressPct)
    ? `<div class="profile-progress"><div class="profile-progress-fill" style="width:${Math.max(0, Math.min(100, progressPct)).toFixed(0)}%;background:${progressColor};color:${progressColor};"></div></div>`
    : '';

  return `
    <div class="profile-stat">
      <div class="profile-stat-top">
        <div class="profile-stat-icon" style="background:${tint};color:${textColor};">
          <span class="material-symbols-outlined">${icon}</span>
        </div>
        <div class="profile-stat-head">
          <div class="profile-stat-val" style="color:${textColor};">${value}</div>
          <div class="profile-stat-lbl">${label}</div>
          ${target ? `<div class="profile-stat-target">${target}</div>` : ''}
        </div>
      </div>
      <div class="profile-stat-meta">${meta}</div>
      ${progressMarkup}
    </div>`;
}

function updateSidebarProfileSummary(profile = getProfile()) {
  const nameEl = document.getElementById('sidebar-name');
  const avatarEl = document.getElementById('sidebar-avatar');
  const metaEl = document.getElementById('sidebar-profile-meta');

  if (nameEl) nameEl.textContent = profile.name || 'Moj Profil';
  if (avatarEl) avatarEl.textContent = profile.avatar || getProfileAvatarFallbackV2();
  if (metaEl) metaEl.textContent = getProfileGoalLabelV2(profile.primaryGoal);
}

function refreshProfilePreview() {
  const name = document.getElementById('profile-name-inp')?.value.trim() || 'Moj Profil';
  const goal = document.getElementById('profile-goal-inp')?.value || 'recomp';
  const focus = document.getElementById('profile-focus-inp')?.value.trim() || '';
  const activePlan = getActiveTrainingPlan();
  const today = fmtDate(new Date());
  const monday = getMondayOfWeek(today);
  const nextPlannedDay = getWeekSchedule(monday, activePlan).find(day => day.date >= today) || null;
  const fallbackCopy = focus || `Cel: ${getProfileGoalLabelV2(goal)}. Plan: ${activePlan.name}.${nextPlannedDay ? ` Nastepny dzien: ${nextPlannedDay.name} - ${formatDatePL(nextPlannedDay.date)}.` : ''}`;

  const displayName = document.getElementById('profile-display-name');
  const heroSub = document.getElementById('profile-hero-sub');
  const goalChip = document.getElementById('profile-goal-chip');
  const planChip = document.getElementById('profile-plan-chip');

  if (displayName) displayName.textContent = name;
  if (heroSub) heroSub.textContent = fallbackCopy;
  if (goalChip) goalChip.textContent = getProfileGoalLabelV2(goal);
  if (planChip) planChip.textContent = activePlan.name;
}

function openProfile() {
  const data = getData();
  const p = data.profile;
  const settings = getSettings();
  const today = fmtDate(new Date());
  const monday = getMondayOfWeek(today);
  const activePlan = getActiveTrainingPlan();
  const orderedDays = getOrderedPlanDays(activePlan);
  const weekSchedule = getWeekSchedule(monday, activePlan);
  const weekDone = weekSchedule.filter(day => data.workouts[day.date]?.completed).length;
  const weekCardio = data.cardio.filter(entry => entry.date >= monday && entry.date <= addDays(monday, 6));
  const weekDist = globalThis.KECore?.sumCardioDistance
    ? globalThis.KECore.sumCardioDistance(weekCardio)
    : weekCardio.reduce((sum, entry) => sum + (entry.distKm || (entry.steps || 0) * 0.73 / 1000), 0);
  const todaySteps = data.cardio.filter(entry => entry.date === today).reduce((sum, entry) => sum + (entry.steps || 0), 0);
  const totalWorkouts = Object.values(data.workouts).filter(w => w.completed).length;
  const totalCardio = data.cardio.length;
  const totalDist = data.cardio.reduce((sum, entry) => sum + (entry.distKm || (entry.steps || 0) * 0.73 / 1000), 0);
  const latestMeasurement = data.measurements?.length ? data.measurements[data.measurements.length - 1] : null;
  const nextPlannedDay = weekSchedule.find(day => day.date >= today && !data.workouts[day.date]?.completed)
    || weekSchedule.find(day => day.date >= today)
    || null;
  const workoutGoal = Math.max(1, parseInt(String(p.weeklyWorkoutGoal ?? orderedDays.length ?? 3), 10) || 3);
  const cardioGoal = Math.max(0, parseFloat(p.weeklyCardioGoalKm ?? 10) || 0);
  const stepGoal = Math.max(1000, parseInt(settings.stepGoal || 8000, 10) || 8000);
  const workoutPct = getProfileProgressPctV2(weekDone, workoutGoal);
  const cardioPct = cardioGoal > 0 ? getProfileProgressPctV2(weekDist, cardioGoal) : null;
  const stepPct = getProfileProgressPctV2(todaySteps, stepGoal);
  const latestMeasurementValue = latestMeasurement ? `${Number(latestMeasurement.weight || 0).toFixed(1)}<span style="font-size:14px;"> kg</span>` : '&mdash;';
  const latestMeasurementMeta = latestMeasurement
    ? `${formatDatePL(latestMeasurement.date)}${latestMeasurement.fatPct != null ? ` - tluszcz ${latestMeasurement.fatPct}%` : ''}`
    : 'Dodaj pierwszy pomiar';
  const planDayChips = orderedDays.length
    ? `<div class="profile-plan-days">${orderedDays.map(day => `
        <div class="profile-plan-day-chip">
          <span class="badge bdg-p">${getTrainingWeekdayLabel(day.weekday, true)}</span>
          <span>${day.name}</span>
        </div>`).join('')}</div>`
    : '<div class="profile-plan-empty">Brak dni w aktywnym planie.</div>';

  const ni = document.getElementById('profile-name-inp');
  const goalInp = document.getElementById('profile-goal-inp');
  const focusInp = document.getElementById('profile-focus-inp');
  const workoutGoalInp = document.getElementById('profile-workout-goal-inp');
  const cardioGoalInp = document.getElementById('profile-cardio-goal-inp');
  const stepGoalInp = document.getElementById('profile-step-goal-inp');

  if (ni) ni.value = p.name || '';
  if (goalInp) goalInp.value = p.primaryGoal || 'recomp';
  if (focusInp) focusInp.value = p.focusNote || '';
  if (workoutGoalInp) workoutGoalInp.value = workoutGoal;
  if (cardioGoalInp) cardioGoalInp.value = cardioGoal || 0;
  if (stepGoalInp) stepGoalInp.value = stepGoal;

  document.getElementById('profile-avatar-display').firstChild.textContent = p.avatar || getProfileAvatarFallbackV2();
  document.getElementById('avatar-picker').innerHTML = AVATARS.map(a =>
    `<div class="av-opt ${p.avatar === a ? 'selected' : ''}" onclick="selectAvatar('${a}')">${a}</div>`
  ).join('');

  refreshProfilePreview();

  const statsGrid = document.getElementById('profile-stats-grid');
  if (statsGrid) {
    statsGrid.innerHTML = [
      buildProfileSnapshotCardV2({
        icon: 'fitness_center',
        tint: 'rgba(137,172,255,.10)',
        textColor: 'var(--p)',
        value: `${weekDone}<span style="font-size:14px;"> / ${workoutGoal}</span>`,
        label: 'Tydzien treningowy',
        target: `${workoutGoal} treningi / tydzien`,
        meta: `${orderedDays.length} dni w aktywnym planie`,
        progressPct: workoutPct
      }),
      buildProfileSnapshotCardV2({
        icon: 'directions_walk',
        tint: 'rgba(166,140,255,.14)',
        textColor: 'var(--s)',
        value: `${weekDist.toFixed(1)}<span style="font-size:14px;"> km</span>`,
        label: 'Cardio',
        target: cardioGoal > 0 ? `${cardioGoal.toFixed(1)} km / tydzien` : 'Ustaw tygodniowy cel cardio',
        meta: `${weekCardio.length} sesji w tym tygodniu`,
        progressPct: cardioPct,
        progressColor: 'var(--s)'
      }),
      buildProfileSnapshotCardV2({
        icon: 'footprint',
        tint: 'rgba(243,255,202,.10)',
        textColor: 'var(--t)',
        value: formatProfileStepsLabelV2(todaySteps),
        label: 'Kroki dzisiaj',
        target: `${stepGoal.toLocaleString()} krokow`,
        meta: todaySteps >= stepGoal ? 'Cel dzienny zrobiony.' : `${Math.max(stepGoal - todaySteps, 0).toLocaleString()} krokow do celu`,
        progressPct: stepPct,
        progressColor: 'var(--t)'
      }),
      buildProfileSnapshotCardV2({
        icon: 'monitor_weight',
        tint: 'rgba(255,113,108,.10)',
        textColor: 'var(--er)',
        value: latestMeasurementValue,
        label: 'Ostatni pomiar',
        target: latestMeasurement ? 'Masa ciala' : 'Dodaj pierwszy wpis',
        meta: latestMeasurementMeta
      })
    ].join('');
  }

  const totalsGrid = document.getElementById('profile-totals-grid');
  if (totalsGrid) {
    totalsGrid.innerHTML = `
      <div class="profile-stat">
        <div class="profile-stat-lbl">Treningi lacznie</div>
        <div class="profile-stat-val" style="color:var(--p);">${totalWorkouts}</div>
        <div class="profile-stat-meta">Ukonczone wpisy silowe</div>
      </div>
      <div class="profile-stat">
        <div class="profile-stat-lbl">Cardio lacznie</div>
        <div class="profile-stat-val" style="color:var(--s);">${totalCardio}</div>
        <div class="profile-stat-meta">Wszystkie zapisane sesje</div>
      </div>
      <div class="profile-stat">
        <div class="profile-stat-lbl">Dystans lacznie</div>
        <div class="profile-stat-val" style="color:var(--t);">${totalDist.toFixed(1)}</div>
        <div class="profile-stat-meta">Kilometry zapisane w cardio</div>
      </div>`;
  }

  const planStatic = document.getElementById('profile-plan-static');
  if (planStatic) planStatic.textContent = activePlan.name;

  const planSummary = document.getElementById('profile-plan-summary');
  if (planSummary) {
    planSummary.innerHTML = `
      <div class="profile-plan-card">
        <div class="profile-plan-kicker">Aktywny plan</div>
        <div class="profile-plan-name">${activePlan.name}</div>
        <div class="profile-plan-meta">
          ${orderedDays.length} dni treningowych - cel ${workoutGoal} treningow tygodniowo
          <br>
          ${nextPlannedDay ? `Nastepny dzien: ${nextPlannedDay.name} - ${formatDatePL(nextPlannedDay.date)}` : 'Brak zaplanowanego dnia w tym tygodniu.'}
        </div>
        ${planDayChips}
        <button class="btn-g" style="width:100%;" onclick="closeModal('profile');switchTab('training')">Przejdz do treningu</button>
      </div>`;
  }

  openModal('profile');
}

function selectAvatar(a) {
  document.querySelectorAll('.av-opt').forEach(el => el.classList.remove('selected'));
  event.target.classList.add('selected');
  document.getElementById('profile-avatar-display').firstChild.textContent = a;
  refreshProfilePreview();
}

function previewName(val) {
  document.getElementById('profile-display-name').textContent = val || 'Moj Profil';
  refreshProfilePreview();
}

function saveProfile() {
  const data = getData();
  const settings = getSettings();
  const name = document.getElementById('profile-name-inp').value.trim() || 'Moj Profil';
  const selectedAv = document.querySelector('.av-opt.selected');
  const avatar = selectedAv ? selectedAv.textContent : getProfileAvatarFallbackV2();
  const primaryGoal = document.getElementById('profile-goal-inp').value || 'recomp';
  const focusNote = document.getElementById('profile-focus-inp').value.trim();
  const weeklyWorkoutGoal = Math.max(1, parseInt(document.getElementById('profile-workout-goal-inp').value, 10) || 3);
  const weeklyCardioGoalKm = Math.max(0, parseFloat(document.getElementById('profile-cardio-goal-inp').value) || 0);
  const stepGoal = Math.max(1000, parseInt(document.getElementById('profile-step-goal-inp').value, 10) || 8000);

  data.profile = { name, avatar, primaryGoal, focusNote, weeklyWorkoutGoal, weeklyCardioGoalKm };
  data.settings = { ...settings, stepGoal };
  saveData(data);
  updateSidebarProfileSummary(data.profile);
  showToast('Profil zapisany!', 'person', 'var(--p)');
  closeModal('profile');
}

function openCheckin() {
  const data = getData(); const today = fmtDate(new Date());
  const weekSchedule = getWeekSchedule(getMondayOfWeek(new Date()));
  document.getElementById('checkin-days').innerHTML = weekSchedule.map(day => {
    const date = day.date; const plan = day;
    const wd = data.workouts[date]; const done = wd?.completed; const isTodayDay = date === today;
    return `<div class="checkin-day ${done ? 'done-day' : ''}" onclick="checkinDay('${day.id}','${date}')">
      <div style="width:44px;height:44px;border-radius:12px;background:${done ? 'rgba(243,255,202,.1)' : 'rgba(255,255,255,.04)'};display:flex;align-items:center;justify-content:center;border:1px solid ${done ? 'rgba(243,255,202,.2)' : 'rgba(255,255,255,.06)'};">
        <span style="font-size:22px;">${done ? '✅' : '🏋️'}</span>
      </div>
      <div style="flex:1;">
        <div style="font-weight:700;font-size:14px;">${plan.name}</div>
        <div style="font-size:11px;color:var(--osd);margin-top:2px;">${formatDatePL(date)}${isTodayDay ? ' · <span style="color:var(--p);">Dzisiaj</span>' : ''}</div>
        <div style="font-size:10px;color:var(--osd);margin-top:2px;">${plan.subtitle}</div>
      </div>
      ${done ? '<span class="badge bdg-t">Ukończony</span>' : isTodayDay ? `<button class="btn-p" style="padding:8px 14px;font-size:9px;" onclick="event.stopPropagation();quickCheckin('${day.id}','${date}')">✓ Check-in</button>` : ''}
    </div>`;
  }).join('');
  openModal('checkin');
}

function quickCheckin(type, date) { completeDay(type, date); closeModal('checkin'); }
function checkinDay(type, date) {
  const data = getData();
  if (data.workouts[date]?.completed) { uncompleteDay(date); showToast('Check-in cofnięty', 'undo', 'var(--osd)'); closeModal('checkin'); return; }
  switchTab('training'); setTimeout(() => selectDay(type), 80); closeModal('checkin');
}

// ── SZYBKI POMIAR SYLWETKI (modal z dashboardu) ─────────────────
function saveQuickBody() {
  const dateVal = document.getElementById('qb-date')?.value;
  const weight  = parseFloat(document.getElementById('qb-weight').value);
  const fatPct  = parseFloat(document.getElementById('qb-fat').value);

  if (!dateVal || !weight || !fatPct) { showToast('Wypełnij wszystkie pola', 'error', 'var(--er)'); return; }

  const data  = getData();
  const entry = { id: Date.now().toString(), date: dateVal, weight, fatPct, muscleKg: null, visceral: null };
  const idx   = data.measurements.findIndex(m => m.date === dateVal);
  if (idx >= 0) data.measurements[idx] = entry; else data.measurements.push(entry);
  data.measurements.sort((a, b) => a.date.localeCompare(b.date));
  saveData(data);

  ['qb-weight', 'qb-fat'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  closeModal('quick-body');
  showToast('Pomiar zapisany!', 'check_circle', 'var(--s)');
  if (state.currentTab === 'dashboard') renderDashboard();
  if (state.currentTab === 'sylwetka')  renderSylwetka();
}

// Inicjalizacja daty w quick-body modal przy otwarciu
const _origOpenModal = window.openModal;
// Patch openModal (nie nadpisujemy, bo openModal jest w utils.js - robimy to w DOMContentLoaded)

// ── PEŁNY BACKUP ────────────────────────────────────────────────
function exportFullBackup() {
  const data   = getData();
  const backup = { version: '3.2', exportDate: new Date().toISOString(), ...data };
  const blob   = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = 'kinetic_backup_' + fmtDate(new Date()) + '.json'; a.click();
  showToast('Backup wyeksportowany!', 'cloud_download', 'var(--p)');
}

function importFullBackup(input) {
  const file = input.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const json = JSON.parse(e.target.result);
      if (!json.workouts && !json.measurements && !json.cardio) { showToast('Nieprawidłowy plik backup', 'error', 'var(--er)'); return; }
      const current = getData();
      if (json.workouts) Object.assign(current.workouts, json.workouts);
      if (json.cardio) { const ids = new Set(current.cardio.map(c => c.id)); json.cardio.forEach(c => { if (!ids.has(c.id)) current.cardio.push(c); }); }
      if (json.measurements) { const map = {}; current.measurements.forEach(m => map[m.date] = m); json.measurements.forEach(m => map[m.date] = m); current.measurements = Object.values(map).sort((a, b) => a.date.localeCompare(b.date)); }
      if (Array.isArray(json.trainingPlans)) current.trainingPlans = json.trainingPlans;
      if (json.activeTrainingPlanId) current.activeTrainingPlanId = json.activeTrainingPlanId;
      if (Array.isArray(json.guideImports)) current.guideImports = json.guideImports;
      if (json.guideImportMeta) current.guideImportMeta = json.guideImportMeta;
      if (json.profile)    current.profile    = json.profile;
      if (json.settings)   Object.assign(current.settings, json.settings);
      if (json.bodyHeight) current.bodyHeight = json.bodyHeight;
      saveData(current); input.value = '';
      if (typeof updateSidebarProfileSummary === 'function') updateSidebarProfileSummary(current.profile);
      if (typeof refreshGuideImportStatus === 'function') refreshGuideImportStatus();
      showToast('Backup zaimportowany!', 'cloud_upload', 'var(--t)');
      switchTab(state.currentTab);
    } catch { showToast('Błąd importu — sprawdź plik', 'error', 'var(--er)'); }
  };
  reader.readAsText(file);
}
