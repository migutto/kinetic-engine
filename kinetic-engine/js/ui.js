// ═══════════════════════════════════════════════════════════════
// THE KINETIC ENGINE — ui.js
// Timer odpoczynku, powiadomienia, ustawienia, profil,
// check-in, pełny backup
// ═══════════════════════════════════════════════════════════════

// ── REST TIMER ──────────────────────────────────────────────────
let timerState = { running: false, total: 90, remaining: 90, interval: null };

function startRestTimer(secs, exName, setNum) {
  clearInterval(timerState.interval);
  timerState.total     = secs;
  timerState.remaining = secs;
  timerState.running   = true;

  const info = document.getElementById('timer-set-info');
  if (info) info.textContent = exName.split(' ')[0] + '\nSeria ' + setNum;

  showTimer();

  timerState.interval = setInterval(() => {
    timerState.remaining--;
    updateTimerDisplay();
    if (timerState.remaining <= 0) {
      clearInterval(timerState.interval);
      timerState.running = false;
      hideTimer();
      // Dźwięk końca przez AudioContext
      try {
        const ac = new (window.AudioContext || window.webkitAudioContext)();
        const o  = ac.createOscillator();
        const g  = ac.createGain();
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
  const el  = document.getElementById('timer-display');
  const bar = document.getElementById('timer-prog');
  if (!el) return;
  const m = Math.floor(timerState.remaining / 60);
  const s = timerState.remaining % 60;
  el.textContent = m + ':' + String(s).padStart(2, '0');
  const pct = (timerState.remaining / timerState.total) * 100;
  if (bar) bar.style.width = pct + '%';
  el.style.color = timerState.remaining <= 10
    ? 'var(--er)'
    : timerState.remaining <= 30
      ? 'var(--t)'
      : 'var(--p)';
}

function showTimer() {
  const el = document.getElementById('rest-timer');
  if (el) el.style.transform = 'translateX(-50%) translateY(0)';
  updateTimerDisplay();
}

function hideTimer() {
  const el = document.getElementById('rest-timer');
  if (el) el.style.transform = 'translateX(-50%) translateY(120px)';
}

function skipTimer() {
  clearInterval(timerState.interval);
  timerState.running = false;
  hideTimer();
}

function addTimerTime(s) {
  timerState.remaining += s;
  timerState.total = Math.max(timerState.total, timerState.remaining);
  updateTimerDisplay();
}

// ── POWIADOMIENIA ───────────────────────────────────────────────
function addNotification(title, body, icon = 'notifications') {
  const data = getData();
  data.notifications.unshift({
    id: Date.now().toString(), title, body, icon,
    date: new Date().toISOString(), read: false
  });
  if (data.notifications.length > 20) data.notifications = data.notifications.slice(0, 20);
  saveData(data);
  updateNotifBadge();
}

function updateNotifBadge() {
  const data   = getData();
  const unread = data.notifications.filter(n => !n.read).length;
  const dot    = document.getElementById('notif-dot');
  if (dot) dot.style.display = unread > 0 ? 'block' : 'none';
}

function openNotifications() {
  const data   = getData();
  const unread = data.notifications.filter(n => !n.read).length;
  document.getElementById('notif-unread-label').textContent =
    unread > 0 ? `${unread} nieprzeczytanych` : 'Wszystko przeczytane';

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
          <div style="font-size:9.5px;color:var(--osd);opacity:.6;margin-top:5px;">
            ${new Date(n.date).toLocaleString('pl-PL', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>`).join('');

  data.notifications.forEach(n => n.read = true);
  saveData(data);
  updateNotifBadge();
  openDrawer('notif');
}

// ── USTAWIENIA ──────────────────────────────────────────────────
function openSettings() {
  const s = getSettings();
  const sg = document.getElementById('set-step-goal');
  const cg = document.getElementById('set-cal-goal');
  const rd = document.getElementById('set-rest-dur');
  if (sg) sg.value = s.stepGoal    || 8000;
  if (cg) cg.value = s.calGoal     || 2500;
  if (rd) rd.value = s.restDuration || 90;
  const nt = document.getElementById('set-notif-training');
  const ns = document.getElementById('set-notif-steps');
  if (nt) nt.checked = s.notifTraining !== false;
  if (ns) ns.checked = s.notifSteps    !== false;
  openDrawer('settings');
}

function clearAllData() {
  if (confirm('Czy na pewno chcesz usunąć wszystkie dane? Tej operacji nie można cofnąć.')) {
    localStorage.removeItem('ke_data');
    showToast('Dane usunięte', 'delete', 'var(--er)');
    closeDrawer('settings');
    location.reload();
  }
}

// ── PROFIL ──────────────────────────────────────────────────────
function openProfile() {
  const data = getData();
  const p    = data.profile;

  const ni = document.getElementById('profile-name-inp');
  if (ni) ni.value = p.name || '';
  document.getElementById('profile-display-name').textContent            = p.name || 'Mój Profil';
  document.getElementById('profile-avatar-display').firstChild.textContent = p.avatar || '💪';
  document.getElementById('avatar-picker').innerHTML = AVATARS.map(a =>
    `<div class="av-opt ${p.avatar === a ? 'selected' : ''}" onclick="selectAvatar('${a}')">${a}</div>`
  ).join('');

  const totalWorkouts = Object.values(data.workouts).filter(w => w.completed).length;
  const totalCardio   = data.cardio.length;
  const totalDist     = data.cardio.reduce((s, c) => s + (c.steps || 0) * 0.73 / 1000, 0);
  document.getElementById('profile-stats-grid').innerHTML = `
    <div class="profile-stat"><div class="profile-stat-val" style="color:var(--p);">${totalWorkouts}</div><div class="profile-stat-lbl">Treningi</div></div>
    <div class="profile-stat"><div class="profile-stat-val" style="color:var(--s);">${totalCardio}</div><div class="profile-stat-lbl">Spacery</div></div>
    <div class="profile-stat"><div class="profile-stat-val" style="color:var(--t);">${totalDist.toFixed(1)}</div><div class="profile-stat-lbl">km łącznie</div></div>`;

  openModal('profile');
}

function selectAvatar(a) {
  document.querySelectorAll('.av-opt').forEach(el => el.classList.remove('selected'));
  event.target.classList.add('selected');
  document.getElementById('profile-avatar-display').firstChild.textContent = a;
}

function previewName(val) {
  document.getElementById('profile-display-name').textContent = val || 'Mój Profil';
}

function saveProfile() {
  const data       = getData();
  const name       = document.getElementById('profile-name-inp').value || 'Mój Profil';
  const selectedAv = document.querySelector('.av-opt.selected');
  const avatar     = selectedAv ? selectedAv.textContent : '💪';
  data.profile = { name, avatar };
  saveData(data);
  document.getElementById('sidebar-name').textContent   = name;
  document.getElementById('sidebar-avatar').textContent = avatar;
  showToast('Profil zapisany!', 'person', 'var(--p)');
  closeModal('profile');
}

// ── CHECK-IN ────────────────────────────────────────────────────
function openCheckin() {
  const data   = getData();
  const today  = fmtDate(new Date());
  const wDates = getWeekDates(getMondayOfWeek(new Date()));

  document.getElementById('checkin-days').innerHTML = ['A', 'B', 'C'].map(type => {
    const date    = wDates[type];
    const plan    = PLAN[type];
    const wd      = data.workouts[date];
    const done    = wd?.completed;
    const isTodayDay = date === today;
    return `<div class="checkin-day ${done ? 'done-day' : ''}" onclick="checkinDay('${type}','${date}')">
      <div style="width:44px;height:44px;border-radius:12px;
        background:${done ? 'rgba(243,255,202,.1)' : 'rgba(255,255,255,.04)'};
        display:flex;align-items:center;justify-content:center;
        border:1px solid ${done ? 'rgba(243,255,202,.2)' : 'rgba(255,255,255,.06)'};">
        <span style="font-size:22px;">${done ? '✅' : '🏋️'}</span>
      </div>
      <div style="flex:1;">
        <div style="font-weight:700;font-size:14px;">${plan.name}</div>
        <div style="font-size:11px;color:var(--osd);margin-top:2px;">
          ${formatDatePL(date)}${isTodayDay ? ' · <span style="color:var(--p);">Dzisiaj</span>' : ''}
        </div>
        <div style="font-size:10px;color:var(--osd);margin-top:2px;">${plan.subtitle}</div>
      </div>
      ${done
        ? '<span class="badge bdg-t">Ukończony</span>'
        : isTodayDay
          ? `<button class="btn-p" style="padding:8px 14px;font-size:9px;"
               onclick="event.stopPropagation();quickCheckin('${type}','${date}')">✓ Check-in</button>`
          : ''}
    </div>`;
  }).join('');

  openModal('checkin');
}

function quickCheckin(type, date) {
  completeDay(type, date);
  closeModal('checkin');
}

function checkinDay(type, date) {
  const data = getData();
  if (data.workouts[date]?.completed) {
    uncompleteDay(date);
    showToast('Check-in cofnięty', 'undo', 'var(--osd)');
    closeModal('checkin');
    return;
  }
  switchTab('training');
  setTimeout(() => selectDay(type), 80);
  closeModal('checkin');
}

// ── PEŁNY BACKUP ────────────────────────────────────────────────
function exportFullBackup() {
  const data   = getData();
  const backup = { version: '3.0', exportDate: new Date().toISOString(), ...data };
  const blob   = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href     = URL.createObjectURL(blob);
  a.download = 'kinetic_backup_' + fmtDate(new Date()) + '.json';
  a.click();
  showToast('Backup wyeksportowany!', 'cloud_download', 'var(--p)');
}

function importFullBackup(input) {
  const file = input.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const json = JSON.parse(e.target.result);
      if (!json.workouts && !json.measurements && !json.cardio) {
        showToast('Nieprawidłowy plik backup', 'error', 'var(--er)'); return;
      }
      const current = getData();
      if (json.workouts)     Object.assign(current.workouts, json.workouts);
      if (json.cardio) {
        const ids = new Set(current.cardio.map(c => c.id));
        json.cardio.forEach(c => { if (!ids.has(c.id)) current.cardio.push(c); });
      }
      if (json.measurements) {
        const map = {};
        current.measurements.forEach(m => map[m.date] = m);
        json.measurements.forEach(m => map[m.date] = m);
        current.measurements = Object.values(map).sort((a, b) => a.date.localeCompare(b.date));
      }
      if (json.profile)    current.profile    = json.profile;
      if (json.settings)   Object.assign(current.settings, json.settings);
      if (json.bodyHeight) current.bodyHeight = json.bodyHeight;
      saveData(current); input.value = '';
      showToast('Backup zaimportowany!', 'cloud_upload', 'var(--t)');
      switchTab(state.currentTab);
    } catch { showToast('Błąd importu — sprawdź plik', 'error', 'var(--er)'); }
  };
  reader.readAsText(file);
}
