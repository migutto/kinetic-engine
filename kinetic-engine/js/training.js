// ═══════════════════════════════════════════════════════════════
// THE KINETIC ENGINE — training.js
// Plan treningowy: kafelki, szczegóły treningu, serie,
// własne treningi, historia ćwiczeń, eksport/import
// ═══════════════════════════════════════════════════════════════

// ── NAWIGACJA TYGODNIOWA ────────────────────────────────────────
function changeWeek(dir) {
  state.currentWeekMonday = addDays(state.currentWeekMonday, dir * 7);
  state.activeDayType = null;
  renderTraining();
}

function goToCurrentWeek() {
  state.currentWeekMonday = getMondayOfWeek(new Date());
  renderTraining();
}

// ── RENDER KAFELKÓW ─────────────────────────────────────────────
function renderTraining() {
  const data    = getData();
  const wDates  = getWeekDates(state.currentWeekMonday);
  const monday  = state.currentWeekMonday;
  const mon     = new Date(monday + 'T00:00:00');
  const weekNum = getISOWeekNumber(mon);

  document.getElementById('week-label').textContent      = 'Tydzień ' + weekNum;
  document.getElementById('week-dates-label').textContent = getWeekLabel(monday);

  // Postęp tygodnia (A/B/C + własne)
  const customDates = getCustomDatesInWeek(monday);
  const allDates    = [...Object.values(wDates), ...customDates];
  const completed   = allDates.filter(d => data.workouts[d]?.completed).length;
  const total       = 3 + customDates.length;
  document.getElementById('week-prog-fill').style.width = Math.round(completed / total * 100) + '%';
  document.getElementById('week-prog-txt').textContent   = completed + '/' + total + ' dni';

  // Kafelki A/B/C
  const tilesEl = document.getElementById('day-tiles');
  const stripes  = { A: 'stripe-A', B: 'stripe-B', C: 'stripe-C' };
  const colors   = { A: 'var(--p)', B: 'var(--s)', C: 'var(--td)' };

  tilesEl.innerHTML = ['A', 'B', 'C'].map(type => {
    const date   = wDates[type];
    const wd     = data.workouts[date];
    const done   = wd?.completed;
    const today  = date === fmtDate(new Date());
    const plan   = PLAN[type];
    const doneSets  = wd?.sets ? Object.values(wd.sets).reduce((s, sets) => s + sets.filter(x => x.done).length, 0) : 0;
    const totalSets = plan.exercises.reduce((s, e) => s + e.sets, 0);
    const pct       = done ? 100 : Math.round(doneSets / totalSets * 100);
    const isActive  = state.activeDayType === type;

    return `<div class="day-tile ${isActive ? 'active-tile' : ''} ${done ? 'completed-tile' : ''}" onclick="selectDay('${type}')">
      <div class="tile-stripe ${stripes[type]}"></div>
      <div style="padding:16px 18px 14px;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;">
          <div>
            ${today ? `<div style="font-size:8px;letter-spacing:2px;text-transform:uppercase;color:var(--p);font-weight:800;margin-bottom:4px;display:flex;align-items:center;gap:4px;">
              <span style="width:5px;height:5px;border-radius:50%;background:var(--p);box-shadow:0 0 8px var(--p);display:inline-block;"></span>DZISIAJ</div>` : ''}
            <div class="lex" style="font-size:18px;font-weight:900;">${plan.name}</div>
            <div style="font-size:10px;color:var(--osd);margin-top:2px;">${plan.subtitle}</div>
            <div style="font-size:10px;color:var(--osd);margin-top:3px;">${formatDatePL(date)}</div>
          </div>
          ${done ? '<span class="material-symbols-outlined" style="color:var(--t);font-size:22px;">check_circle</span>' : ''}
        </div>
        <div style="display:flex;justify-content:space-between;font-size:9px;color:var(--osd);margin-bottom:4px;">
          <span>${plan.exercises.length} ćwiczeń · ${totalSets} serii</span>
          <span style="color:${pct === 100 ? 'var(--t)' : 'var(--osd)'};">${pct}%</span>
        </div>
        <div class="prog-bar"><div class="prog-fill" style="width:${pct}%;background:${colors[type]};"></div></div>
      </div>
    </div>`;
  }).join('');

  // Kafelek "+ Własny trening"
  tilesEl.innerHTML += `<div class="day-tile" onclick="openCustomBuilder()"
    style="border:2px dashed rgba(137,172,255,.18);background:rgba(137,172,255,.02);
    display:flex;align-items:center;justify-content:center;flex-direction:column;gap:8px;min-height:140px;cursor:pointer;"
    onmouseover="this.style.borderColor='rgba(137,172,255,.45)';this.style.background='rgba(137,172,255,.06)'"
    onmouseout="this.style.borderColor='rgba(137,172,255,.18)';this.style.background='rgba(137,172,255,.02)'">
    <span class="material-symbols-outlined" style="font-size:28px;color:var(--s);opacity:.7;">add_circle</span>
    <div class="lex" style="font-size:11px;font-weight:700;color:var(--osd);text-align:center;">Własny<br>Trening</div>
  </div>`;

  // Własne kafelki
  document.getElementById('custom-tiles').innerHTML = customDates.map(date => {
    const wd   = data.workouts[date];
    if (!wd || wd.type !== 'custom') return '';
    const done = wd.completed;
    const today = date === fmtDate(new Date());
    const exs  = wd.customExercises || [];
    const doneSets  = wd.sets ? Object.values(wd.sets).reduce((s, sets) => s + sets.filter(x => x.done).length, 0) : 0;
    const totalSets = exs.reduce((s, e) => s + (e.sets || 3), 0);
    const pct  = done ? 100 : (totalSets > 0 ? Math.round(doneSets / totalSets * 100) : 0);
    const isActive = state.activeDayType === 'custom' && state.activeDayDate === date;

    return `<div class="day-tile ${isActive ? 'active-tile' : ''} ${done ? 'completed-tile' : ''}"
      onclick="selectCustomDay('${date}')" style="width:calc(33% - 6px);min-width:220px;flex:1;">
      <div class="tile-stripe stripe-custom"></div>
      <div style="padding:14px 16px 12px;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;">
          <div>
            ${today ? '<div style="font-size:8px;letter-spacing:2px;text-transform:uppercase;color:var(--s);font-weight:800;margin-bottom:3px;">DZISIAJ</div>' : ''}
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:2px;">
              <span class="material-symbols-outlined" style="font-size:14px;color:var(--s);">stars</span>
              <div class="lex" style="font-size:15px;font-weight:800;">${wd.name || 'Własny Trening'}</div>
            </div>
            <div style="font-size:10px;color:var(--osd);">${formatDatePL(date)}</div>
          </div>
          <div style="display:flex;gap:5px;align-items:center;">
            ${done ? '<span class="material-symbols-outlined" style="color:var(--t);font-size:20px;">check_circle</span>' : ''}
            <button onclick="event.stopPropagation();deleteCustomDay('${date}')"
              style="background:transparent;border:none;color:rgba(255,113,108,.4);cursor:pointer;padding:2px;"
              onmouseover="this.style.color='var(--er)'" onmouseout="this.style.color='rgba(255,113,108,.4)'"  title="Usuń">
              <span class="material-symbols-outlined" style="font-size:16px;">delete</span>
            </button>
          </div>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:9px;color:var(--osd);margin-bottom:4px;">
          <span>${exs.length} ćwiczeń · ${totalSets} serii</span>
          <span style="color:${pct === 100 ? 'var(--t)' : 'var(--osd)'};">${pct}%</span>
        </div>
        <div class="prog-bar"><div class="prog-fill" style="width:${pct}%;background:var(--s);"></div></div>
        <div style="display:flex;flex-wrap:wrap;gap:3px;margin-top:6px;">
          ${exs.slice(0, 3).map(e => `<span style="font-size:9px;background:rgba(255,255,255,.04);border-radius:4px;padding:1px 6px;color:var(--osd);">${e.n.split(' ')[0]}</span>`).join('')}
          ${exs.length > 3 ? `<span style="font-size:9px;color:var(--osd);">+${exs.length - 3}</span>` : ''}
        </div>
      </div>
    </div>`;
  }).join('');

  renderWorkoutDetail();
}

// ── SELECTION ───────────────────────────────────────────────────
function selectDay(type) {
  state.activeDayType = type;
  state.activeDayDate = getWeekDates(state.currentWeekMonday)[type];
  renderTraining();
}

function selectCustomDay(date) {
  state.activeDayType = 'custom';
  state.activeDayDate = date;
  renderTraining();
}

function deleteCustomDay(date) {
  if (!confirm('Usunąć ten trening?')) return;
  const data = getData();
  delete data.workouts[date];
  saveData(data);
  if (state.activeDayDate === date) { state.activeDayType = null; state.activeDayDate = null; }
  renderTraining();
  showToast('Trening usunięty', 'delete', 'var(--er)');
}

function getPlanExercises(type, date) {
  if (type === 'custom') {
    const wd = getData().workouts[date];
    return wd?.customExercises || [];
  }
  return PLAN[type]?.exercises || [];
}

// ── RENDER SZCZEGÓŁÓW TRENINGU ──────────────────────────────────
function renderWorkoutDetail() {
  const wrap       = document.getElementById('workout-detail');
  const placeholder = document.getElementById('training-placeholder');

  if (!state.activeDayType) {
    wrap.style.display = 'none'; placeholder.style.display = 'flex'; return;
  }

  const date = state.activeDayDate
    || (state.activeDayType !== 'custom' ? getWeekDates(state.currentWeekMonday)[state.activeDayType] : '');

  if (!date) { wrap.style.display = 'none'; placeholder.style.display = 'flex'; return; }

  wrap.style.display = 'block'; placeholder.style.display = 'none';

  const data      = getData();
  const isCustom  = state.activeDayType === 'custom';
  const wd        = data.workouts[date] || { type: state.activeDayType, sets: {}, completed: false };
  if (!wd.sets) wd.sets = {};
  const exercises   = getPlanExercises(state.activeDayType, date);
  const accentColor = isCustom ? 'var(--s)' : 'var(--p)';
  const titleName   = isCustom ? (wd.name || 'Własny Trening') : (PLAN[state.activeDayType]?.name || '');
  const subtitle    = isCustom
    ? `${exercises.length} ćwiczeń niestandardowych`
    : (PLAN[state.activeDayType]?.subtitle || '');

  let html = `<div class="fade-up">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;padding-top:4px;">
      <div>
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:3px;">
          ${isCustom ? '<span class="material-symbols-outlined" style="font-size:18px;color:var(--s);">stars</span>' : ''}
          <div class="lex" style="font-size:20px;font-weight:900;">${titleName}
            <span style="color:var(--osd);font-weight:400;font-size:14px;">· ${subtitle}</span>
          </div>
        </div>
        <div style="font-size:11px;color:var(--osd);">${formatDatePL(date)}</div>
      </div>
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;justify-content:flex-end;">
        ${wd.completed ? '<span class="badge bdg-t"><span class="material-symbols-outlined" style="font-size:12px;">check_circle</span> Ukończony</span>' : ''}
        ${isCustom ? `<button class="btn-s" style="padding:8px 14px;font-size:9px;" onclick="openCustomBuilder('${date}')">
          <span style="display:flex;align-items:center;gap:5px;"><span class="material-symbols-outlined" style="font-size:13px;">edit</span>Edytuj</span></button>` : ''}
        <button class="btn-p" onclick="completeDayGeneric('${date}')" ${wd.completed ? 'disabled style="opacity:.4;cursor:default;"' : ''}>
          <span style="display:flex;align-items:center;gap:6px;"><span class="material-symbols-outlined" style="font-size:15px;">task_alt</span>Zakończ Trening</span>
        </button>
        ${wd.completed ? `<button class="btn-g" onclick="uncompleteDay('${date}')">Cofnij</button>` : ''}
      </div>
    </div>`;

  // Rozgrzewka (tylko dla A/B/C)
  if (!isCustom) {
    html += `<div style="background:linear-gradient(135deg,rgba(137,172,255,.06),rgba(137,172,255,.02));border:1px solid rgba(137,172,255,.1);border-radius:14px;padding:14px 18px;margin-bottom:18px;display:flex;align-items:center;gap:14px;">
      <span class="material-symbols-outlined" style="color:var(--p);font-size:22px;">self_improvement</span>
      <div>
        <div style="font-weight:700;font-size:13px;margin-bottom:2px;">Rozgrzewka 6–8 min przed treningiem</div>
        <div style="font-size:11px;color:var(--osd);">Marsz 3-5min · Oddechy 360° · Glute bridge ×10 · Bird-dog ×4/str · 1 lekka seria pompek i wiosła</div>
      </div>
    </div>`;
  }

  // Brak ćwiczeń
  if (!exercises.length) {
    html += `<div style="text-align:center;padding:40px;color:var(--osd);">
      <span class="material-symbols-outlined" style="font-size:40px;opacity:.3;display:block;margin-bottom:10px;">fitness_center</span>
      Brak ćwiczeń —
      <button class="btn-s" style="padding:6px 12px;font-size:10px;margin-left:4px;" onclick="openCustomBuilder('${date}')">Dodaj ćwiczenia</button>
    </div>`;
  } else {
    exercises.forEach((ex, idx) => {
      const key       = ex.n;
      const savedSets = wd.sets[key] || [];
      const numSets   = ex.sets || 3;
      const setsArr   = [];
      for (let i = 0; i < numSets; i++) setsArr.push(savedSets[i] || { reps: '', weight: '', done: false });

      const allDone     = setsArr.every(s => s.done);
      const exHistory   = getExHistory(key, date);
      const lastWeight  = exHistory.length > 0 ? exHistory[exHistory.length - 1].maxW : null;
      const todayMaxW   = setsArr.filter(s => s.done && s.weight).reduce((m, s) => Math.max(m, parseFloat(s.weight) || 0), 0);
      const progressHint = exHistory.length >= 2 && allDone && todayMaxW > 0 ? getProgressHint(exHistory, todayMaxW) : '';

      html += `<div class="ex-item" style="${allDone ? 'border-color:rgba(243,255,202,.2);background:rgba(243,255,202,.02);' : ''}">
        <div class="ex-header" onclick="toggleEx('ex-${idx}')">
          <span style="font-size:20px;">${ex.icon || '💪'}</span>
          <div style="flex:1;min-width:0;">
            <div style="font-weight:700;font-size:14px;">${ex.n}</div>
            <div style="font-size:10px;color:var(--osd);margin-top:2px;display:flex;align-items:center;gap:8px;">
              <span>${numSets} serie · ${ex.reps || '8–12'} ${ex.weight ? '· z ciężarem' : ''}</span>
              ${lastWeight ? `<span style="color:${accentColor};font-weight:600;">Ostatnio: ${lastWeight} kg</span>` : ''}
            </div>
          </div>
          ${progressHint ? `<span style="font-size:9px;font-weight:700;padding:3px 8px;border-radius:999px;background:rgba(243,255,202,.12);color:var(--t);white-space:nowrap;">${progressHint}</span>` : ''}
          ${allDone ? '<span class="material-symbols-outlined" style="color:var(--t);font-size:19px;">check_circle</span>' : ''}
          ${exHistory.length > 1 ? `<div style="width:48px;height:22px;flex-shrink:0;" id="ex-hist-${idx}"></div>` : ''}
          <span class="material-symbols-outlined" style="color:var(--osd);font-size:17px;transition:transform .2s;" id="ex-arrow-${idx}">expand_more</span>
        </div>
        <div class="ex-body open" id="ex-${idx}">
          <div style="padding-bottom:10px;">
            <div class="set-row" style="border-top:none;">
              <div class="set-num" style="font-size:8.5px;">SER</div>
              <div style="font-size:9px;color:var(--osd);text-align:center;text-transform:uppercase;letter-spacing:1px;">${ex.isTime ? 'Czas (s)' : 'Powtórzenia'}</div>
              <div style="font-size:9px;color:var(--osd);text-align:center;text-transform:uppercase;letter-spacing:1px;">${ex.weight ? 'Ciężar (kg)' : 'BW'}</div>
              <div></div>
            </div>
            ${setsArr.map((s, si) => `
            <div class="set-row ${s.done ? 'set-done-row' : ''}" id="set-row-${idx}-${si}">
              <div class="set-num">${si + 1}</div>
              <input class="inp-small" type="number" placeholder="${(ex.reps || '8').split('–')[0] || '0'}" value="${s.reps || ''}"
                onchange="updateSetGeneric('${date}','${key}',${si},'reps',this.value)" ${s.done ? 'disabled' : ''}>
              <input class="inp-small" type="number" placeholder="${ex.weight ? '0' : 'BW'}" value="${s.weight || ''}"
                onchange="updateSetGeneric('${date}','${key}',${si},'weight',this.value)"
                ${!ex.weight || s.done ? 'disabled' : ''} style="${!ex.weight ? 'opacity:.3;' : ''}">
              <button class="check-btn ${s.done ? 'done' : ''}" onclick="toggleSetGeneric('${date}','${key}',${si},${idx},${si})">
                <span class="mi material-symbols-outlined">check</span>
              </button>
            </div>`).join('')}
          </div>
        </div>
      </div>`;
    });
  }

  html += '</div>';
  document.getElementById('workout-detail-inner').innerHTML = html;

  // Mini sparklines historii ciężarów
  exercises.forEach((ex, idx) => {
    const el = document.getElementById('ex-hist-' + idx);
    if (!el) return;
    const hist = getExHistory(ex.n, date);
    if (hist.length < 2) return;
    dC('ex-hist-' + idx);
    const ctx  = Object.assign(document.createElement('canvas'), {});
    el.appendChild(ctx);
    const vals = hist.map(h => h.maxW);
    state.charts['ex-hist-' + idx] = new Chart(ctx, {
      type: 'line',
      data: { labels: hist.map(h => h.date.slice(5)), datasets: [{ data: vals, borderColor: isCustom ? '#a68cff' : '#89acff', backgroundColor: 'transparent', tension: .4, pointRadius: 0, borderWidth: 1.5 }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { enabled: false } }, scales: { x: { display: false }, y: { display: false, min: Math.min(...vals) * .97, max: Math.max(...vals) * 1.03 } }, animation: { duration: 0 } }
    });
  });
}

// ── ACCORDION ───────────────────────────────────────────────────
function toggleEx(id) {
  const body  = document.getElementById(id);
  const idx   = id.split('-')[1];
  const arrow = document.getElementById('ex-arrow-' + idx);
  if (body.classList.contains('open')) {
    body.classList.remove('open');
    if (arrow) arrow.style.transform = 'rotate(-90deg)';
  } else {
    body.classList.add('open');
    if (arrow) arrow.style.transform = 'rotate(0deg)';
  }
}

// ── SERIE ───────────────────────────────────────────────────────
function _ensureSets(data, date, exName) {
  if (!data.workouts[date]) data.workouts[date] = { type: state.activeDayType, sets: {}, completed: false };
  const wd = data.workouts[date];
  if (!wd.sets) wd.sets = {};
  if (!wd.sets[exName]) {
    const exs = getPlanExercises(state.activeDayType, date);
    const ex  = exs.find(e => e.n === exName);
    wd.sets[exName] = Array(ex ? ex.sets || 3 : 3).fill(null).map(() => ({ reps: '', weight: '', done: false }));
  }
  if (!wd.sets[exName][0]) wd.sets[exName][0] = { reps: '', weight: '', done: false };
  return wd;
}

function updateSetGeneric(date, exName, setIdx, field, value) {
  const data = getData();
  const wd   = _ensureSets(data, date, exName);
  if (!wd.sets[exName][setIdx]) wd.sets[exName][setIdx] = { reps: '', weight: '', done: false };
  wd.sets[exName][setIdx][field] = value;
  saveData(data);
}
function updateSet(date, exName, setIdx, field, value) { updateSetGeneric(date, exName, setIdx, field, value); }

function toggleSetGeneric(date, exName, setIdx, exIdx, si) {
  const data   = getData();
  const wd     = _ensureSets(data, date, exName);
  if (!wd.sets[exName][setIdx]) wd.sets[exName][setIdx] = { reps: '', weight: '', done: false };

  // Zbierz wartości z DOM przed zapisem
  const rIn = document.querySelector(`#set-row-${exIdx}-${si} input:first-of-type`);
  const wIn = document.querySelector(`#set-row-${exIdx}-${si} input:last-of-type`);
  if (rIn?.value) wd.sets[exName][setIdx].reps   = rIn.value;
  if (wIn?.value) wd.sets[exName][setIdx].weight  = wIn.value;

  const wasDone = wd.sets[exName][setIdx].done;
  wd.sets[exName][setIdx].done = !wasDone;

  if (!wasDone) {
    const dur = getSettings().restDuration || 90;
    startRestTimer(dur, exName, setIdx + 1);
    showToast('Seria zaliczona! ⏱', 'timer', 'var(--t)');
  }
  saveData(data);
  renderWorkoutDetail();
}
function toggleSet(date, exName, setIdx, exIdx, si) { toggleSetGeneric(date, exName, setIdx, exIdx, si); }

// ── UKOŃCZENIE TRENINGU ──────────────────────────────────────────
function completeDayGeneric(date) {
  const data = getData();
  if (!data.workouts[date]) return;
  data.workouts[date].completed = true;
  const name = data.workouts[date].name || PLAN[state.activeDayType]?.name || 'Trening';
  addNotification('🏆 Trening ukończony!', `${name} — ${formatDatePL(date)}`, 'emoji_events');
  showToast('Trening ukończony! 🏆', 'task_alt', 'var(--t)');
  saveData(data);
  renderTraining();
}
function completeDay(type, date) { completeDayGeneric(date); }

function uncompleteDay(date) {
  const data = getData();
  if (data.workouts[date]) data.workouts[date].completed = false;
  saveData(data);
  renderTraining();
}

// ── HISTORIA ĆWICZEŃ ────────────────────────────────────────────
function getExHistory(exName, currentDate) {
  const data    = getData();
  const results = [];
  Object.entries(data.workouts)
    .filter(([d, w]) => d !== currentDate && w.completed && w.sets?.[exName])
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-8)
    .forEach(([d, w]) => {
      const sets   = w.sets[exName];
      const maxW   = sets.reduce((m, s) => s.done && s.weight ? Math.max(m, parseFloat(s.weight) || 0) : m, 0);
      const total  = sets.reduce((s, x) => s + (x.done ? parseFloat(x.reps) || 0 : 0), 0);
      if (maxW > 0 || total > 0) results.push({ date: d, maxW, totalReps: total });
    });
  return results;
}

function getProgressHint(history, todayMaxW) {
  if (!history.length) return '';
  const lastW = history[history.length - 1].maxW;
  if (!lastW) return '';
  if (todayMaxW > lastW) return `🔥 PB! +${(todayMaxW - lastW).toFixed(1)} kg`;
  const allAbove = history.slice(-3).every(h => h.maxW > 0 && todayMaxW >= h.maxW);
  if (allAbove && history.length >= 3) return '💡 Spróbuj +2.5 kg';
  return '';
}

// ── WŁASNY TRENING — BUILDER ────────────────────────────────────
let cbExercises = [];

function getCustomDatesInWeek(monday) {
  const data = getData();
  const fri  = addDays(monday, 6);
  return Object.entries(data.workouts)
    .filter(([d, w]) => d >= monday && d <= fri && w.type === 'custom')
    .map(([d]) => d)
    .sort();
}

function openCustomBuilder(editDate) {
  cbExercises = [];
  const cbDate = document.getElementById('cb-date');
  const cbName = document.getElementById('cb-name');

  if (editDate) {
    const wd = getData().workouts[editDate];
    cbDate.value = editDate;
    cbName.value = wd?.name || '';
    cbExercises  = wd?.customExercises ? JSON.parse(JSON.stringify(wd.customExercises)) : [];
  } else {
    cbDate.value = fmtDate(new Date());
    cbName.value = '';
  }

  renderCBExercises();
  document.getElementById('cb-quick-list').innerHTML = GUIDE_DATA.map(g =>
    `<span class="cb-quick-chip" onclick="addCBExerciseFromGuide('${g.id}')">${g.icon} ${g.name.split(' ').slice(0, 2).join(' ')}</span>`
  ).join('');
  openModal('custom-builder');
}

function renderCBExercises() {
  const el = document.getElementById('cb-exercises');
  if (!cbExercises.length) {
    el.innerHTML = `<div style="text-align:center;padding:24px;color:var(--osd);font-size:12px;border:1px dashed rgba(255,255,255,.08);border-radius:10px;">
      Brak ćwiczeń — dodaj poniżej lub wybierz z poradnika
    </div>`;
    return;
  }
  el.innerHTML = cbExercises.map((ex, i) => `
    <div class="cb-ex-row">
      <input class="cb-ex-inp" type="text" placeholder="Nazwa ćwiczenia" value="${ex.n || ''}"
        oninput="cbExercises[${i}].n=this.value">
      <input class="cb-ex-inp" type="number" placeholder="Serie" value="${ex.sets || 3}" min="1" max="10"
        oninput="cbExercises[${i}].sets=parseInt(this.value)||3" style="text-align:center;">
      <input class="cb-ex-inp" type="text" placeholder="Powt." value="${ex.reps || '8–12'}"
        oninput="cbExercises[${i}].reps=this.value">
      <div style="display:flex;align-items:center;gap:5px;justify-content:center;">
        <label style="display:flex;align-items:center;gap:4px;cursor:pointer;font-size:10px;color:var(--osd);">
          <input type="checkbox" ${ex.weight ? 'checked' : ''} onchange="cbExercises[${i}].weight=this.checked"
            style="width:14px;height:14px;accent-color:var(--p);"> kg
        </label>
      </div>
      <button onclick="removeCBExercise(${i})"
        style="background:transparent;border:none;color:rgba(255,113,108,.5);cursor:pointer;padding:3px;"
        onmouseover="this.style.color='var(--er)'" onmouseout="this.style.color='rgba(255,113,108,.5)'">
        <span class="material-symbols-outlined" style="font-size:18px;">delete</span>
      </button>
    </div>`).join('');
}

function addCBExercise() {
  cbExercises.push({ n: '', sets: 3, reps: '8–12', weight: true, icon: '💪' });
  renderCBExercises();
  setTimeout(() => {
    const el = document.getElementById('cb-exercises');
    el.scrollTop = el.scrollHeight;
    const inputs = el.querySelectorAll('.cb-ex-inp');
    if (inputs.length) inputs[inputs.length - 4].focus();
  }, 50);
}

function addCBExerciseFromGuide(guideId) {
  const g = GUIDE_DATA.find(x => x.id === guideId);
  if (!g) return;
  cbExercises.push({ n: g.name, sets: 3, reps: '8–12', weight: g.cat !== 'brzuch', icon: g.icon });
  renderCBExercises();
  showToast(g.name + ' dodane', 'check_circle', 'var(--s)');
}

function removeCBExercise(i) {
  cbExercises.splice(i, 1);
  renderCBExercises();
}

function saveCustomWorkout() {
  const date = document.getElementById('cb-date').value;
  const name = document.getElementById('cb-name').value.trim() || 'Własny Trening';
  if (!date) { showToast('Wybierz datę treningu', 'error', 'var(--er)'); return; }

  // Zbierz aktualne wartości z DOM
  document.querySelectorAll('.cb-ex-row').forEach((row, i) => {
    if (!cbExercises[i]) return;
    const inputs = row.querySelectorAll('.cb-ex-inp');
    if (inputs[0]) cbExercises[i].n    = inputs[0].value.trim();
    if (inputs[1]) cbExercises[i].sets = parseInt(inputs[1].value) || 3;
    if (inputs[2]) cbExercises[i].reps = inputs[2].value || '8–12';
    const cb = row.querySelector('input[type=checkbox]');
    if (cb) cbExercises[i].weight = cb.checked;
  });

  const validEx = cbExercises.filter(e => e.n);
  if (!validEx.length) { showToast('Dodaj przynajmniej jedno ćwiczenie', 'error', 'var(--er)'); return; }

  const data     = getData();
  const existing = data.workouts[date];
  data.workouts[date] = {
    type:             'custom',
    name,
    customExercises:  validEx,
    sets:             existing?.type === 'custom' ? existing.sets : {},
    completed:        existing ? existing.completed : false
  };
  saveData(data);
  closeModal('custom-builder');
  showToast(`"${name}" zapisany!`, 'check_circle', 'var(--s)');
  state.activeDayType = 'custom';
  state.activeDayDate = date;
  renderTraining();
}

// ── KALKULATOR 1RM ──────────────────────────────────────────────
function calcORM() {
  const w   = parseFloat(document.getElementById('orm-weight').value) || 0;
  const r   = parseFloat(document.getElementById('orm-reps').value)   || 0;
  const res = document.getElementById('orm-result');
  if (!w || !r || r < 1) { res.style.display = 'none'; return; }

  const orm = r === 1 ? w : Math.round(w * (1 + r / 30) * 10) / 10;
  document.getElementById('orm-1rm').textContent = orm;
  res.style.display = 'block';

  const pcts = [
    { p: 100, l: '1RM' }, { p: 95, l: '2' }, { p: 90, l: '3-4' }, { p: 85, l: '5' },
    { p: 80, l: '6-8' },  { p: 75, l: '8-10' }, { p: 70, l: '10-12' }, { p: 65, l: '12-15' }
  ];
  document.getElementById('orm-table').innerHTML = pcts.map(({ p, l }) => `
    <div style="background:rgba(255,255,255,.04);border-radius:8px;padding:7px;text-align:center;border:1px solid rgba(255,255,255,.05);">
      <div class="lex" style="font-weight:800;font-size:13px;color:var(--p);">${Math.round(orm * p / 100 * 10) / 10}</div>
      <div style="font-size:8.5px;color:var(--osd);margin-top:2px;">${p}% · ${l} powt.</div>
    </div>`).join('');
}

// ── EKSPORT / IMPORT TRENINGÓW ──────────────────────────────────
function exportWorkouts() {
  const data  = getData();
  const count = Object.keys(data.workouts).length;
  if (!count) { showToast('Brak treningów do eksportu', 'info', 'var(--osd)'); return; }
  const blob = new Blob(
    [JSON.stringify({ type: 'kinetic_workouts', version: '3.0', exportDate: new Date().toISOString(), workouts: data.workouts }, null, 2)],
    { type: 'application/json' }
  );
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'treningi_' + fmtDate(new Date()) + '.json';
  a.click();
  showToast(`Wyeksportowano ${count} treningów`, 'download', 'var(--p)');
}

function importWorkouts(input) {
  const file = input.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const json = JSON.parse(e.target.result);
      const src  = json.workouts || json;
      if (typeof src !== 'object' || Array.isArray(src)) { showToast('Nieprawidłowy format pliku', 'error', 'var(--er)'); return; }
      const data = getData();
      let added = 0, updated = 0;
      Object.entries(src).forEach(([date, workout]) => {
        data.workouts[date] ? updated++ : added++;
        data.workouts[date] = workout;
      });
      saveData(data); input.value = '';
      showToast(`Dodano: ${added}, zaktualizowano: ${updated} treningów`, 'upload', 'var(--t)');
      if (state.currentTab === 'training')  renderTraining();
      if (state.currentTab === 'dashboard') renderDashboard();
    } catch { showToast('Błąd importu treningów', 'error', 'var(--er)'); }
  };
  reader.readAsText(file);
}
