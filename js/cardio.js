// ═══════════════════════════════════════════════════════════════
// THE KINETIC ENGINE — cardio.js
// ═══════════════════════════════════════════════════════════════

const STEP_LENGTH_M = 0.73;

function initCardioDate() {
  const el = document.getElementById('c-date');
  if (el && !el.value) el.value = fmtDate(new Date());
}

// ── OBLICZENIA ──────────────────────────────────────────────────
function calcCardio() {
  const duration = parseFloat(document.getElementById('c-duration').value) || 0;
  const steps    = parseFloat(document.getElementById('c-steps').value)    || 0;
  const distInp  = parseFloat(document.getElementById('c-dist')?.value)    || 0;
  const distKm   = distInp > 0 ? distInp : steps * STEP_LENGTH_M / 1000;

  let paceStr = '–', speedStr = '–';
  if (distKm > 0 && duration > 0) {
    const p = duration / distKm;
    paceStr  = Math.floor(p) + ':' + String(Math.round((p - Math.floor(p)) * 60)).padStart(2, '0');
    speedStr = (distKm / (duration / 60)).toFixed(2);
  }
  document.getElementById('c-pace').textContent  = paceStr;
  document.getElementById('c-speed').textContent = speedStr === '–' ? '–' : speedStr;
}

// ── ZAPIS SPACERU ───────────────────────────────────────────────
function saveCardio() {
  const dateVal  = document.getElementById('c-date')?.value || fmtDate(new Date());
  const duration = parseFloat(document.getElementById('c-duration').value) || 0;
  const calories = parseFloat(document.getElementById('c-cal').value)      || 0;
  const steps    = parseFloat(document.getElementById('c-steps').value)    || 0;
  const hr       = parseFloat(document.getElementById('c-hr').value)       || 0;
  const distInp  = parseFloat(document.getElementById('c-dist')?.value)    || 0;

  if (!duration) { showToast('Podaj czas trwania!', 'error', 'var(--er)'); return; }

  const finalSteps = steps || (distInp > 0 ? Math.round(distInp * 1000 / STEP_LENGTH_M) : 0);
  const distKm     = distInp > 0 ? distInp : finalSteps * STEP_LENGTH_M / 1000;

  const data = getData();
  data.cardio.push({ id: Date.now().toString(), date: dateVal, duration, calories, steps: finalSteps, heartRate: hr, distKm: +distKm.toFixed(2) });
  addNotification('🚶 Aktywność zapisana', `${duration} min · ${distKm.toFixed(1)} km · ${calories} kcal`, 'directions_walk');
  saveData(data);

  ['c-duration', 'c-cal', 'c-steps', 'c-hr', 'c-dist'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  const cDate = document.getElementById('c-date');
  if (cDate) cDate.value = fmtDate(new Date());
  document.getElementById('c-pace').textContent  = '–';
  document.getElementById('c-speed').textContent = '–';

  showToast('Aktywność zapisana!', 'check_circle', 'var(--p)');
  renderCardio();
}

// ── USUWANIE ────────────────────────────────────────────────────
function deleteCardio(id) {
  const data = getData();
  data.cardio = data.cardio.filter(c => c.id !== id);
  saveData(data);
  renderCardio();
  showToast('Aktywność usunięta', 'delete', 'var(--er)');
}

// ── RENDER ──────────────────────────────────────────────────────
function renderCardio() {
  initCardioDate();

  const data        = getData();
  const today       = fmtDate(new Date());
  const thisWeekMon = getMondayOfWeek(new Date());
  const weekFri     = addDays(thisWeekMon, 6);
  const weekEntries = data.cardio.filter(c => c.date >= thisWeekMon && c.date <= weekFri);
  const totalDist   = data.cardio.reduce((s, c) => s + (c.distKm || (c.steps || 0) * STEP_LENGTH_M / 1000), 0);
  const weekSteps   = weekEntries.reduce((s, c) => s + (c.steps || 0), 0);
  const weekCal     = weekEntries.reduce((s, c) => s + (c.calories || 0), 0);

  document.getElementById('cardio-stats-row').innerHTML = `
    <div class="stat-card">
      <div class="stat-icon" style="background:rgba(137,172,255,.12)"><span class="material-symbols-outlined" style="color:var(--p)">near_me</span></div>
      <div><div class="stat-label">Łączny Dystans</div><div class="stat-val">${totalDist.toFixed(1)}<span style="font-size:14px;"> km</span></div></div>
    </div>
    <div class="stat-card">
      <div class="stat-icon" style="background:rgba(166,140,255,.12)"><span class="material-symbols-outlined" style="color:var(--s)">footprint</span></div>
      <div><div class="stat-label">Kroki w tym tygodniu</div><div class="stat-val">${weekSteps > 1000 ? (weekSteps / 1000).toFixed(1) + 'k' : weekSteps}</div></div>
    </div>
    <div class="stat-card">
      <div class="stat-icon" style="background:rgba(255,113,108,.1)"><span class="material-symbols-outlined" style="color:var(--er)">local_fire_department</span></div>
      <div><div class="stat-label">Kalorie w tygodniu</div><div class="stat-val">${weekCal}<span style="font-size:14px;"> kcal</span></div></div>
    </div>`;

  const step7 = [];
  for (let i = 6; i >= 0; i--) {
    const d = addDays(today, -i);
    const s = data.cardio.filter(c => c.date === d).reduce((s, c) => s + (c.steps || 0), 0);
    step7.push({ d, s });
  }

  const settings   = getSettings();
  const weekTarget = (settings.stepGoal || 8000) * 7;
  const pctGoal    = Math.min(100, Math.round(weekSteps / weekTarget * 100));
  document.getElementById('steps-goal-badge').textContent = pctGoal + '% celu tygodniowego';

  const days7 = ['Nd', 'Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'Sb'];
  destroyChart('cardio-steps');
  const ctx = document.getElementById('chart-cardio-steps').getContext('2d');
  state.charts['cardio-steps'] = new Chart(ctx, {
    type: 'bar',
    data: { labels: step7.map(s => days7[new Date(s.d + 'T00:00:00').getDay()]), datasets: [{ data: step7.map(s => s.s), backgroundColor: step7.map(s => s.d === today ? 'rgba(243,255,202,.8)' : 'rgba(137,172,255,.45)'), borderRadius: 7, borderSkipped: false }] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, ticks: { color: '#a3aac4', font: { size: 10 } } }, y: { grid: { color: 'rgba(255,255,255,.03)' }, ticks: { color: '#a3aac4', font: { size: 10 } } } } }
  });

  document.getElementById('cardio-count-label').textContent = data.cardio.length + ' aktywności';
  const histEl = document.getElementById('cardio-history');
  if (!data.cardio.length) { histEl.innerHTML = '<div style="color:var(--osd);font-size:13px;text-align:center;padding:24px;">Brak aktywności. Zaloguj pierwszy spacer!</div>'; return; }

  const sorted = [...data.cardio].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 20);
  histEl.innerHTML = sorted.map(c => {
    const dist = c.distKm || (c.steps || 0) * STEP_LENGTH_M / 1000;
    let paceStr = '';
    if (dist > 0 && c.duration) {
      const p = c.duration / dist;
      paceStr = Math.floor(p) + ':' + String(Math.round((p - Math.floor(p)) * 60)).padStart(2, '0') + ' min/km';
    }
    return `<div class="cardio-act fade-up">
      <div style="width:38px;height:38px;border-radius:10px;background:linear-gradient(135deg,rgba(137,172,255,.15),rgba(137,172,255,.05));display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;">🚶</div>
      <div style="flex:1;min-width:0;">
        <div style="font-weight:700;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${formatDatePL(c.date)}${c.date === today ? ' <span style="color:var(--p);font-size:10px;">· Dzisiaj</span>' : ''}</div>
        <div style="font-size:10px;color:var(--osd);margin-top:2px;">${c.duration}min · ${(c.steps || 0).toLocaleString()} kroków${c.heartRate ? ' · ' + c.heartRate + ' BPM' : ''}${paceStr ? ' · ' + paceStr : ''}</div>
      </div>
      <div style="text-align:right;flex-shrink:0;margin-right:6px;">
        <div class="lex" style="font-weight:800;font-size:14px;color:var(--p);">${dist.toFixed(1)} km</div>
        <div style="font-size:10px;color:var(--er);">${c.calories || 0} kcal</div>
      </div>
      <button class="del-btn" onclick="deleteCardio('${c.id}')"><span class="mi material-symbols-outlined">delete</span></button>
    </div>`;
  }).join('');
}

// ── SZYBKIE DODANIE (modal z dashboardu) ────────────────────────
function saveQuickCardio() {
  const dateVal  = document.getElementById('qc-date')?.value || fmtDate(new Date());
  const duration = parseFloat(document.getElementById('qc-duration').value) || 0;
  const steps    = parseFloat(document.getElementById('qc-steps').value)    || 0;
  const calories = parseFloat(document.getElementById('qc-cal').value)      || 0;
  const distInp  = parseFloat(document.getElementById('qc-dist')?.value)    || 0;

  if (!duration) { showToast('Podaj czas trwania!', 'error', 'var(--er)'); return; }

  const finalSteps = steps || (distInp > 0 ? Math.round(distInp * 1000 / STEP_LENGTH_M) : 0);
  const distKm     = distInp > 0 ? distInp : finalSteps * STEP_LENGTH_M / 1000;

  const data = getData();
  data.cardio.push({ id: Date.now().toString(), date: dateVal, duration, calories, steps: finalSteps, heartRate: 0, distKm: +distKm.toFixed(2) });
  addNotification('🚶 Aktywność zapisana', `${duration} min · ${distKm.toFixed(1)} km`, 'directions_walk');
  saveData(data);

  ['qc-duration', 'qc-steps', 'qc-cal', 'qc-dist'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  closeModal('quick-cardio');
  showToast('Aktywność zapisana!', 'check_circle', 'var(--p)');
  if (state.currentTab === 'dashboard') renderDashboard();
  if (state.currentTab === 'cardio')    renderCardio();
}

// ── EKSPORT / IMPORT ────────────────────────────────────────────
function exportCardio() {
  const data = getData();
  if (!data.cardio.length) { showToast('Brak aktywności do eksportu', 'info', 'var(--osd)'); return; }
  const blob = new Blob([JSON.stringify({ type: 'kinetic_cardio', version: '3.1', exportDate: new Date().toISOString(), cardio: data.cardio }, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = 'cardio_' + fmtDate(new Date()) + '.json'; a.click();
  showToast(`Wyeksportowano ${data.cardio.length} aktywności`, 'download', 'var(--p)');
}

function importCardio(input) {
  const file = input.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const json = JSON.parse(e.target.result);
      const src  = Array.isArray(json) ? json : (json.cardio || []);
      if (!Array.isArray(src) || !src.length) { showToast('Brak danych cardio w pliku', 'error', 'var(--er)'); return; }
      const data = getData(); const ids = new Set(data.cardio.map(c => c.id));
      let added = 0, skipped = 0;
      src.forEach(entry => {
        if (!entry.date || !entry.duration) { skipped++; return; }
        if (!entry.id) entry.id = Date.now().toString() + Math.random();
        if (ids.has(entry.id)) { skipped++; } else { data.cardio.push(entry); ids.add(entry.id); added++; }
      });
      data.cardio.sort((a, b) => a.date.localeCompare(b.date));
      saveData(data); input.value = '';
      showToast(`Dodano: ${added}, pominięto: ${skipped} aktywności`, 'upload', 'var(--t)');
      if (state.currentTab === 'cardio')    renderCardio();
      if (state.currentTab === 'dashboard') renderDashboard();
    } catch { showToast('Błąd importu cardio', 'error', 'var(--er)'); }
  };
  reader.readAsText(file);
}
