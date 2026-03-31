// ═══════════════════════════════════════════════════════════════
// THE KINETIC ENGINE — dashboard.js
// Dashboard: statystyki, baner sylwetki, wykres objętości,
// wykres kroków, harmonogram tygodnia, mini postęp
// ═══════════════════════════════════════════════════════════════

function renderDashboard() {
  const data  = getData();
  const today = fmtDate(new Date());
  const wDates = getWeekDates(getMondayOfWeek(new Date()));

  const totalWorkouts = Object.values(data.workouts).filter(w => w.completed).length;
  const totalCardio   = data.cardio.length;
  const totalSteps    = data.cardio.reduce((s, c) => s + (c.steps || 0), 0);
  const avgCal        = totalCardio > 0
    ? Math.round(data.cardio.reduce((s, c) => s + (c.calories || 0), 0) / totalCardio)
    : 0;

  renderBodyBanner();

  // ── 4 stat-karty ──
  document.getElementById('dash-stats').innerHTML = `
    <div class="stat-card fade-up">
      <div class="stat-icon" style="background:rgba(137,172,255,.12)"><span class="material-symbols-outlined" style="color:var(--p)">fitness_center</span></div>
      <div><div class="stat-label">Łącznie Treningi</div><div class="stat-val">${totalWorkouts}</div></div>
    </div>
    <div class="stat-card fade-up" style="animation-delay:.06s">
      <div class="stat-icon" style="background:rgba(166,140,255,.12)"><span class="material-symbols-outlined" style="color:var(--s)">directions_walk</span></div>
      <div><div class="stat-label">Sesje Cardio</div><div class="stat-val">${totalCardio}</div></div>
    </div>
    <div class="stat-card fade-up" style="animation-delay:.12s">
      <div class="stat-icon" style="background:rgba(243,255,202,.1)"><span class="material-symbols-outlined" style="color:var(--t)">footprint</span></div>
      <div><div class="stat-label">Łączne Kroki</div><div class="stat-val">${totalSteps > 1000 ? (totalSteps / 1000).toFixed(1) + 'k' : totalSteps}</div></div>
    </div>
    <div class="stat-card fade-up" style="animation-delay:.18s">
      <div class="stat-icon" style="background:rgba(255,113,108,.1)"><span class="material-symbols-outlined" style="color:var(--er)">local_fire_department</span></div>
      <div><div class="stat-label">Śr. Kcal / Spacer</div><div class="stat-val">${avgCal}</div></div>
    </div>`;

  // ── Karta "Dzisiaj" ──
  let todayType = null;
  for (const [t, d] of Object.entries(wDates)) { if (d === today) todayType = t; }
  const todayEl = document.getElementById('dash-today-content');

  if (todayType) {
    const plan = PLAN[todayType];
    const wd   = data.workouts[today];
    todayEl.innerHTML = `
      <div class="lex" style="font-size:28px;font-weight:900;margin-bottom:4px;">${plan.name}</div>
      <div style="font-size:12px;color:var(--osd);margin-bottom:14px;">${plan.subtitle}</div>
      <div style="font-size:11px;color:var(--osd);margin-bottom:12px;">${plan.exercises.length} ćwiczeń · ${plan.exercises.reduce((s, e) => s + e.sets, 0)} serii</div>
      ${wd?.completed ? '<span class="badge bdg-t" style="margin-bottom:12px;gap:5px;"><span class="material-symbols-outlined" style="font-size:12px;">check_circle</span> Ukończony</span><br>' : ''}
      <button class="btn-p" style="width:100%;margin-top:8px;padding:14px;"
        onclick="switchTab('training');setTimeout(()=>selectDay('${todayType}'),80)">
        ${wd?.completed ? '📋 Podgląd treningu' : '🔥 Rozpocznij Trening'}
      </button>`;
  } else {
    const nextType = ['A', 'B', 'C'].find(t => wDates[t] > today);
    todayEl.innerHTML = nextType
      ? `<div style="color:var(--osd);font-size:13px;margin-bottom:14px;">💤 Dzień odpoczynku — regenerujesz się!</div>
         <div style="font-size:10px;color:var(--osd);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Następny trening</div>
         <div class="lex" style="font-size:20px;font-weight:800;">${PLAN[nextType].name}</div>
         <div style="font-size:11px;color:var(--osd);margin-top:4px;">${formatDatePL(wDates[nextType])}</div>`
      : `<div style="font-size:16px;margin-bottom:8px;">🎉 Tydzień ukończony!</div>
         <div style="font-size:13px;color:var(--osd);">Świetna robota. Odpoczywaj i wróć w przyszłym tygodniu.</div>`;
  }

  // ── Harmonogram tygodnia ──
  const mon    = getMondayOfWeek(new Date());
  const wdates = getWeekDates(mon);
  document.getElementById('dash-week-label').textContent = getWeekLabel(mon);
  const schColors = { A: 'var(--p)', B: 'var(--s)', C: 'var(--td)' };
  document.getElementById('dash-schedule').innerHTML = ['A', 'B', 'C'].map(t => {
    const d    = wdates[t];
    const wd   = data.workouts[d];
    const done = wd?.completed;
    const isTd = d === today;
    return `<div onclick="switchTab('training');setTimeout(()=>selectDay('${t}'),80)"
      style="display:flex;align-items:center;gap:12px;padding:11px 14px;border-radius:12px;margin-bottom:7px;cursor:pointer;
      background:${isTd ? 'rgba(137,172,255,.07)' : 'rgba(255,255,255,.025)'};
      border:1px solid ${isTd ? 'rgba(137,172,255,.2)' : 'rgba(255,255,255,.04)'};transition:all .2s;"
      onmouseover="this.style.background='rgba(137,172,255,.07)'"
      onmouseout="this.style.background='${isTd ? 'rgba(137,172,255,.07)' : 'rgba(255,255,255,.025)'}'">
      <div style="text-align:center;min-width:38px;">
        <div class="lex" style="font-size:18px;font-weight:900;color:${isTd ? schColors[t] : 'var(--os)'};">${new Date(d + 'T00:00:00').getDate()}</div>
        <div style="font-size:8px;text-transform:uppercase;letter-spacing:1px;color:var(--osd);">${['Nd','Pn','Wt','Śr','Cz','Pt','Sb'][new Date(d + 'T00:00:00').getDay()]}</div>
      </div>
      <div style="flex:1;">
        <div style="font-weight:700;font-size:13px;">${PLAN[t].name}</div>
        <div style="font-size:10px;color:var(--osd);">${PLAN[t].subtitle}</div>
      </div>
      ${done
        ? '<span class="material-symbols-outlined" style="color:var(--t);font-size:20px;">check_circle</span>'
        : isTd
          ? '<span class="badge bdg-p" style="font-size:8px;">Dziś</span>'
          : '<span class="material-symbols-outlined" style="color:var(--out);font-size:20px;">radio_button_unchecked</span>'
      }
    </div>`;
  }).join('');

  // ── Wykres objętości treningowej ──
  const sortedW  = Object.entries(data.workouts)
    .filter(([, w]) => w.completed)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-8);
  const volLabels = sortedW.map(([d]) => formatDatePL(d));
  const volData   = sortedW.map(([, w]) => {
    let vol = 0;
    if (w.sets) for (const sets of Object.values(w.sets))
      for (const s of sets)
        if (s.done && s.weight) vol += (parseFloat(s.reps) || 0) * (parseFloat(s.weight) || 0);
    return Math.round(vol);
  });
  const delta = volData.length >= 2
    ? (volData[volData.length - 1] > volData[volData.length - 2] ? '↑ Wzrost' : '↓ Spadek')
    : '';
  document.getElementById('volume-delta').textContent = delta;

  destroyChart('volume');
  const ctx1  = document.getElementById('chart-volume').getContext('2d');
  const gradV = ctx1.createLinearGradient(0, 0, 0, 180);
  gradV.addColorStop(0, 'rgba(137,172,255,.2)');
  gradV.addColorStop(1, 'rgba(137,172,255,0)');
  state.charts.volume = new Chart(ctx1, {
    type: 'line',
    data: {
      labels:   volLabels.length ? volLabels : ['–'],
      datasets: [{ data: volData.length ? volData : [0], borderColor: '#89acff', backgroundColor: gradV, fill: true, tension: .45, pointBackgroundColor: '#89acff', pointRadius: 4, pointHoverRadius: 7 }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { backgroundColor: 'rgba(15,25,48,.9)', borderColor: 'rgba(137,172,255,.2)', borderWidth: 1, titleColor: '#89acff', bodyColor: '#dee5ff' } },
      scales: { x: { grid: { color: 'rgba(255,255,255,.03)' }, ticks: { color: '#a3aac4', font: { size: 10 } } }, y: { grid: { color: 'rgba(255,255,255,.03)' }, ticks: { color: '#a3aac4', font: { size: 10 } } } }
    }
  });

  // ── Wykres kroków (7 dni) ──
  const step7 = [];
  for (let i = 6; i >= 0; i--) {
    const d = addDays(today, -i);
    const s = data.cardio.filter(c => c.date === d).reduce((s, c) => s + (c.steps || 0), 0);
    step7.push({ d, s });
  }
  destroyChart('steps');
  const ctx2 = document.getElementById('chart-steps').getContext('2d');
  const days7 = ['Nd', 'Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'Sb'];
  state.charts.steps = new Chart(ctx2, {
    type: 'bar',
    data: {
      labels:   step7.map(s => days7[new Date(s.d + 'T00:00:00').getDay()]),
      datasets: [{ data: step7.map(s => s.s), backgroundColor: step7.map(s => s.d === today ? 'rgba(243,255,202,.75)' : 'rgba(137,172,255,.4)'), borderRadius: 6, borderSkipped: false }]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, ticks: { color: '#a3aac4', font: { size: 10 } } }, y: { grid: { color: 'rgba(255,255,255,.03)' }, ticks: { color: '#a3aac4', font: { size: 10 } } } } }
  });

  // ── Mini postęp tygodniowy ──
  const miniColors = { A: 'var(--p)', B: 'var(--s)', C: 'var(--td)' };
  document.getElementById('dash-week-mini').innerHTML = ['A', 'B', 'C'].map(t => {
    const d     = wdates[t];
    const wd    = data.workouts[d];
    const done  = wd?.completed;
    const doneEx = wd?.sets ? Object.values(wd.sets).filter(sets => sets.some(s => s.done)).length : 0;
    const totalEx = PLAN[t].exercises.length;
    const pct   = done ? 100 : Math.round(doneEx / totalEx * 100);
    return `<div style="margin-bottom:12px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px;">
        <span style="font-size:12px;font-weight:700;">${PLAN[t].name}</span>
        <span style="font-size:10px;color:${pct === 100 ? 'var(--t)' : 'var(--osd)'};">${pct}%${pct === 100 ? ' ✓' : ''}</span>
      </div>
      <div class="prog-bar"><div class="prog-fill" style="width:${pct}%;background:${miniColors[t]};box-shadow:0 0 8px ${miniColors[t]}40;"></div></div>
    </div>`;
  }).join('');
}

// ── BANER SYLWETKI (Dashboard) ──────────────────────────────────
function renderBodyBanner() {
  const el = document.getElementById('dash-body-banner');
  if (!el) return;

  const data = getData();
  const hCm  = data.bodyHeight || 178;
  const ms   = (data.measurements || []).map(m => {
    const h     = hCm / 100;
    const fatKg = m.weight * (m.fatPct / 100);
    const lbm   = m.weight - fatKg;
    const ffmi  = h > 0 ? lbm / (h * h) : 0;
    return { ...m, fatKg, lbm, ffmi };
  });

  // Brak danych
  if (!ms.length) {
    el.innerHTML = `<div class="body-banner" style="display:flex;align-items:center;gap:16px;cursor:pointer;" onclick="switchTab('sylwetka')">
      <span class="material-symbols-outlined" style="font-size:32px;color:var(--p);opacity:.6;">monitor_weight</span>
      <div>
        <div class="lex" style="font-weight:800;font-size:14px;margin-bottom:4px;">Brak danych sylwetki</div>
        <div style="font-size:12px;color:var(--osd);">Dodaj pierwszy pomiar w zakładce <strong style="color:var(--p);">Sylwetka</strong> aby śledzić postępy kompozycji ciała.</div>
      </div>
      <span class="material-symbols-outlined" style="font-size:20px;color:var(--osd);margin-left:auto;">arrow_forward</span>
    </div>`;
    return;
  }

  const first      = ms[0];
  const last       = ms[ms.length - 1];
  const daysSince  = Math.round((new Date(last.date) - new Date(first.date)) / (1000 * 60 * 60 * 24));
  const dWeight    = +(last.weight  - first.weight).toFixed(1);
  const dFat       = +(last.fatPct  - first.fatPct).toFixed(1);
  const dLBM       = +(last.lbm     - first.lbm).toFixed(1);
  const dFatKg     = +(last.fatKg   - first.fatKg).toFixed(1);
  const dFFMI      = +(last.ffmi    - first.ffmi).toFixed(2);
  const weeklyRate = daysSince > 0 ? (dWeight / (daysSince / 7)).toFixed(2) : 0;

  const metric = (val, lbl, good, unit = '') => {
    const isGood = good === null ? null : (good ? val <= 0 : val >= 0);
    const color  = val === 0 || good === null ? 'var(--osd)' : isGood ? '#4ade80' : 'var(--er)';
    const sign   = val > 0 ? '+' : '';
    return `<div class="journey-metric" onclick="switchTab('sylwetka')">
      <div class="journey-val" style="color:${color};">${sign}${val}${unit}</div>
      <div class="journey-lbl">${lbl}</div>
    </div>`;
  };

  const recent   = ms.slice(-8);
  const sparkW   = recent.map(m => m.weight);
  const sparkMin = Math.min(...sparkW) - 0.5;
  const sparkMax = Math.max(...sparkW) + 0.5;

  el.innerHTML = `<div class="body-banner fade-up">
    <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:16px;position:relative;z-index:1;">
      <div>
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
          <span style="width:7px;height:7px;border-radius:50%;background:var(--p);box-shadow:0 0 8px var(--p);"></span>
          <span style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--osd);font-weight:700;">Twoja Podróż Sylwetkowa</span>
        </div>
        <div class="lex" style="font-size:17px;font-weight:900;">
          Od ${formatDatePL(first.date)}
          <span style="color:var(--osd);font-weight:400;font-size:13px;">· ${first.weight} kg → </span>
          <span style="color:${dWeight < 0 ? '#4ade80' : 'var(--er)'};">${last.weight} kg</span>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:10px;">
        <div style="text-align:center;padding:10px 16px;border-radius:12px;background:rgba(0,0,0,.25);border:1px solid rgba(255,255,255,.06);">
          <div class="lex" style="font-weight:900;font-size:22px;color:var(--p);">${daysSince}</div>
          <div style="font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:var(--osd);font-weight:600;">dni</div>
        </div>
        <div style="text-align:center;padding:10px 16px;border-radius:12px;background:rgba(0,0,0,.25);border:1px solid rgba(255,255,255,.06);">
          <div class="lex" style="font-weight:900;font-size:22px;color:${parseFloat(weeklyRate) < 0 ? '#4ade80' : 'var(--osd)'};">${weeklyRate > 0 ? '+' : ''}${weeklyRate}</div>
          <div style="font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:var(--osd);font-weight:600;">kg/tydz</div>
        </div>
        <button class="btn-s" style="font-size:9px;padding:8px 14px;white-space:nowrap;" onclick="switchTab('sylwetka')">
          <span style="display:flex;align-items:center;gap:5px;"><span class="material-symbols-outlined" style="font-size:14px;">monitoring</span>Szczegóły</span>
        </button>
      </div>
    </div>
    <div style="display:flex;gap:10px;position:relative;z-index:1;align-items:stretch;">
      ${metric(dWeight, 'Zmiana wagi',  true,  'kg')}
      ${metric(dFat,    'Zmiana Fat%',  true,  '%')}
      ${metric(dFatKg,  'Tłuszcz kg',  true,  'kg')}
      ${metric(dLBM,    'Zmiana LBM',  false, 'kg')}
      ${metric(dFFMI,   'Zmiana FFMI', false, '')}
      <div class="journey-metric" onclick="switchTab('sylwetka')" style="flex:1.6;min-width:0;">
        <div style="font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:var(--osd);font-weight:600;margin-bottom:6px;">Trend wagi (ostatnie ${recent.length} pomiarów)</div>
        <div style="height:44px;position:relative;"><canvas id="dash-spark"></canvas></div>
      </div>
    </div>
  </div>`;

  // Sparkline
  setTimeout(() => {
    const sc = document.getElementById('dash-spark');
    if (!sc) return;
    destroyChart('dash-spark');
    const ctx = sc.getContext('2d');
    const g   = ctx.createLinearGradient(0, 0, 0, 44);
    g.addColorStop(0, 'rgba(137,172,255,.35)');
    g.addColorStop(1, 'rgba(137,172,255,0)');
    state.charts['dash-spark'] = new Chart(ctx, {
      type: 'line',
      data: { labels: recent.map(m => m.date.slice(5)), datasets: [{ data: sparkW, borderColor: '#89acff', backgroundColor: g, fill: true, tension: .4, pointRadius: 0, borderWidth: 2 }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { enabled: false } }, scales: { x: { display: false }, y: { display: false, min: sparkMin, max: sparkMax } }, animation: { duration: 600 } }
    });
  }, 50);
}
