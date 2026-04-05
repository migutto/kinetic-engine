// ═══════════════════════════════════════════════════════════════
// THE KINETIC ENGINE — dashboard.js
// Dashboard: statystyki, baner sylwetki, wykres objętości,
// wykres kroków, harmonogram tygodnia, mini postęp
// ═══════════════════════════════════════════════════════════════

function renderDashboard() {
  const data       = getData();
  const today      = fmtDate(new Date());
  const thisMonday = getMondayOfWeek(new Date());
  const settings   = getSettings();
  const activePlan = getActiveTrainingPlan();
  const weekSchedule = getWeekSchedule(thisMonday, activePlan);
  const wDates     = getWeekDates(thisMonday, activePlan);
  const weekCardio = data.cardio.filter(c => c.date >= thisMonday && c.date <= addDays(thisMonday, 6));
  const weekDone   = weekSchedule.filter(day => data.workouts[day.date]?.completed).length;
  const weekTarget = weekSchedule.length;
  const weekDist   = globalThis.KECore?.sumCardioDistance
    ? globalThis.KECore.sumCardioDistance(weekCardio)
    : weekCardio.reduce((s, c) => s + (c.distKm || (c.steps || 0) * 0.73 / 1000), 0);
  const todaySteps = data.cardio.filter(c => c.date === today).reduce((s, c) => s + (c.steps || 0), 0);
  const todayGoal  = settings.stepGoal || 8000;
  const todayPct   = Math.min(999, Math.round((todaySteps / todayGoal) * 100));
  const todayStepsLabel = todaySteps > 1000 ? (todaySteps / 1000).toFixed(1) + 'k' : todaySteps;
  const latestMeasurement = data.measurements?.length ? data.measurements[data.measurements.length - 1] : null;
  const latestWeight = latestMeasurement ? Number(latestMeasurement.weight || 0).toFixed(1) : '—';
  const latestBodyMeta = latestMeasurement
    ? `${formatDatePL(latestMeasurement.date)}${latestMeasurement.fatPct ? ` · Tłuszcz ${latestMeasurement.fatPct}%` : ''}`
    : 'Dodaj pierwszy pomiar sylwetki.';

  renderBodyBanner();

  // ── 4 stat-karty ──
  document.getElementById('dash-stats').innerHTML = `
    <div class="stat-card is-clickable fade-up" onclick="switchTab('training')">
      <div class="stat-icon" style="background:rgba(137,172,255,.12)"><span class="material-symbols-outlined" style="color:var(--p)">fitness_center</span></div>
      <div class="stat-card-body">
        <div class="stat-label">Tydzień treningowy</div>
        <div class="stat-val">${weekDone}<span style="font-size:15px;"> / ${weekTarget || 0}</span></div>
        <div class="stat-meta">${weekTarget === 0 ? 'Dodaj dni do aktywnego planu treningowego.' : (weekDone === weekTarget ? `${activePlan.name} jest domkniety w tym tygodniu.` : `${weekTarget - weekDone} dni do zamkniecia planu ${activePlan.name}.`)}</div>
      </div>
    </div>
    <div class="stat-card is-clickable fade-up" style="animation-delay:.06s" onclick="switchTab('cardio')">
      <div class="stat-icon" style="background:rgba(166,140,255,.12)"><span class="material-symbols-outlined" style="color:var(--s)">directions_walk</span></div>
      <div class="stat-card-body">
        <div class="stat-label">Cardio w tygodniu</div>
        <div class="stat-val">${weekDist.toFixed(1)}<span style="font-size:15px;"> km</span></div>
        <div class="stat-meta">${weekCardio.length} sesji · średnio ${weekCardio.length ? (weekDist / weekCardio.length).toFixed(1) : '0.0'} km</div>
      </div>
    </div>
    <div class="stat-card is-clickable fade-up" style="animation-delay:.12s" onclick="switchTab('cardio')">
      <div class="stat-icon" style="background:rgba(243,255,202,.1)"><span class="material-symbols-outlined" style="color:var(--t)">footprint</span></div>
      <div class="stat-card-body">
        <div class="stat-label">Kroki dzisiaj</div>
        <div class="stat-val">${todayStepsLabel}</div>
        <div class="stat-meta">${todayPct}% celu dziennego · ${todayGoal.toLocaleString()} kroków</div>
      </div>
    </div>
    <div class="stat-card is-clickable fade-up" style="animation-delay:.18s" onclick="switchTab('sylwetka')">
      <div class="stat-icon" style="background:rgba(255,113,108,.1)"><span class="material-symbols-outlined" style="color:var(--er)">monitor_weight</span></div>
      <div class="stat-card-body">
        <div class="stat-label">Ostatni pomiar</div>
        <div class="stat-val">${latestWeight}${latestMeasurement ? '<span style="font-size:15px;"> kg</span>' : ''}</div>
        <div class="stat-meta">${latestBodyMeta}</div>
      </div>
    </div>`;

  // ── Karta "Dzisiaj" ──
  const todayEntry = weekSchedule.find(day => day.date === today) || null;
  const todayEl = document.getElementById('dash-today-content');

  if (todayEntry) {
    const plan = todayEntry;
    const wd   = data.workouts[today];
    todayEl.innerHTML = `
      <div class="lex" style="font-size:28px;font-weight:900;margin-bottom:4px;">${plan.name}</div>
      <div style="font-size:12px;color:var(--osd);margin-bottom:14px;">${plan.subtitle}</div>
      <div style="font-size:11px;color:var(--osd);margin-bottom:12px;">${plan.exercises.length} ćwiczeń · ${plan.exercises.reduce((s, e) => s + e.sets, 0)} serii</div>
      ${wd?.completed ? '<span class="badge bdg-t" style="margin-bottom:12px;gap:5px;"><span class="material-symbols-outlined" style="font-size:12px;">check_circle</span> Ukończony</span><br>' : ''}
      <button class="btn-p" style="width:100%;margin-top:8px;padding:14px;"
        onclick="switchTab('training');setTimeout(()=>selectDay('${todayEntry.id}'),80)">
        ${wd?.completed ? '📋 Podgląd treningu' : '🔥 Rozpocznij Trening'}
      </button>`;
  } else {
    const nextEntry = weekSchedule.find(day => day.date > today);
    todayEl.innerHTML = nextEntry
      ? `<div style="color:var(--osd);font-size:13px;margin-bottom:14px;">💤 Dzień odpoczynku — regenerujesz się!</div>
         <div style="font-size:10px;color:var(--osd);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Następny trening</div>
         <div class="lex" style="font-size:20px;font-weight:800;">${nextEntry.name}</div>
         <div style="font-size:11px;color:var(--osd);margin-top:4px;">${formatDatePL(nextEntry.date)}</div>`
      : `<div style="font-size:16px;margin-bottom:8px;">🎉 Tydzień ukończony!</div>
         <div style="font-size:13px;color:var(--osd);">Świetna robota. Odpoczywaj i wróć w przyszłym tygodniu.</div>`;
  }

  // ── Harmonogram tygodnia ──
  const mon    = getMondayOfWeek(new Date());
  const schedule = getWeekSchedule(mon, activePlan);
  document.getElementById('dash-week-label').textContent = getWeekLabel(mon);
  document.getElementById('dash-schedule').innerHTML = schedule.map(day => {
    const d    = day.date;
    const wd   = data.workouts[d];
    const done = wd?.completed;
    const isTd = d === today;
    const accent = day.color || 'var(--p)';
    return `<div onclick="switchTab('training');setTimeout(()=>selectDay('${day.id}'),80)"
      style="display:flex;align-items:center;gap:12px;padding:11px 14px;border-radius:12px;margin-bottom:7px;cursor:pointer;
      background:${isTd ? 'rgba(137,172,255,.07)' : 'rgba(255,255,255,.025)'};
      border:1px solid ${isTd ? 'rgba(137,172,255,.2)' : 'rgba(255,255,255,.04)'};transition:all .2s;"
      onmouseover="this.style.background='rgba(137,172,255,.07)'"
      onmouseout="this.style.background='${isTd ? 'rgba(137,172,255,.07)' : 'rgba(255,255,255,.025)'}'">
      <div style="text-align:center;min-width:38px;">
        <div class="lex" style="font-size:18px;font-weight:900;color:${isTd ? accent : 'var(--os)'};">${new Date(d + 'T00:00:00').getDate()}</div>
        <div style="font-size:8px;text-transform:uppercase;letter-spacing:1px;color:var(--osd);">${['Nd','Pn','Wt','Śr','Cz','Pt','Sb'][new Date(d + 'T00:00:00').getDay()]}</div>
      </div>
      <div style="flex:1;">
        <div style="font-weight:700;font-size:13px;">${day.name}</div>
        <div style="font-size:10px;color:var(--osd);">${day.subtitle}</div>
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
  document.getElementById('dash-week-mini').innerHTML = schedule.map(day => {
    const d     = day.date;
    const wd    = data.workouts[d];
    const done  = wd?.completed;
    const doneEx = wd?.sets ? Object.values(wd.sets).filter(sets => sets.some(s => s.done)).length : 0;
    const totalEx = day.exercises.length;
    const pct   = done ? 100 : (totalEx > 0 ? Math.round(doneEx / totalEx * 100) : 0);
    const accent = day.color || 'var(--p)';
    return `<div style="margin-bottom:12px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px;">
        <span style="font-size:12px;font-weight:700;">${day.name}</span>
        <span style="font-size:10px;color:${pct === 100 ? 'var(--t)' : 'var(--osd)'};">${pct}%${pct === 100 ? ' ✓' : ''}</span>
      </div>
      <div class="prog-bar"><div class="prog-fill" style="width:${pct}%;background:${accent};"></div></div>
    </div>`;
  }).join('');

  renderDashboardSummaries(data, today, thisMonday);
}

// ── BANER SYLWETKI (Dashboard) ──────────────────────────────────
function renderDashboardSummaries(data, today, weekStart) {
  const weekEnd = addDays(weekStart, 6);
  const prevWeekStart = addDays(weekStart, -7);
  const prevWeekEnd = addDays(weekEnd, -7);
  const monthRange = getMonthRange(today);
  const prevMonthRange = getShiftedMonthRange(today, -1);

  const weekSummary = buildPeriodSummary(data, weekStart, weekEnd);
  const prevWeekSummary = buildPeriodSummary(data, prevWeekStart, prevWeekEnd);
  const monthSummary = buildPeriodSummary(data, monthRange.start, monthRange.end);
  const prevMonthSummary = buildPeriodSummary(data, prevMonthRange.start, prevMonthRange.end);

  const weekEl = document.getElementById('dash-week-summary');
  const monthEl = document.getElementById('dash-month-summary');
  if (weekEl) {
    weekEl.innerHTML = buildSummaryCardMarkup({
      title: 'Podsumowanie tygodnia',
      rangeLabel: formatSummaryRange(weekStart, weekEnd),
      status: weekEnd > today ? 'W toku' : 'Domknięte',
      summary: weekSummary,
      previousSummary: prevWeekSummary,
      compareLabel: 'tygodnia'
    });
  }
  if (monthEl) {
    monthEl.innerHTML = buildSummaryCardMarkup({
      title: 'Podsumowanie miesiąca',
      rangeLabel: getMonthLabelPL(today),
      status: monthRange.end > today ? 'W toku' : 'Domknięte',
      summary: monthSummary,
      previousSummary: prevMonthSummary,
      compareLabel: 'miesiąca'
    });
  }
}

function buildPeriodSummary(data, startDate, endDate) {
  if (globalThis.KECore?.buildPeriodSummary) {
    return globalThis.KECore.buildPeriodSummary(data, startDate, endDate);
  }

  const completedWorkouts = Object.entries(data.workouts)
    .filter(([date, workout]) => date >= startDate && date <= endDate && workout.completed);
  const cardioEntries = data.cardio.filter(entry => entry.date >= startDate && entry.date <= endDate);
  const measurements = [...(data.measurements || [])].sort((a, b) => a.date.localeCompare(b.date));
  const periodMeasurements = measurements.filter(entry => entry.date >= startDate && entry.date <= endDate);
  const baselineMeasurement = measurements.filter(entry => entry.date < startDate).slice(-1)[0] || null;
  const startMeasurement = periodMeasurements[0] || baselineMeasurement || null;
  const endMeasurement = periodMeasurements.length
    ? periodMeasurements[periodMeasurements.length - 1]
    : (measurements.filter(entry => entry.date <= endDate).slice(-1)[0] || null);

  let weightDelta = null;
  let fatDelta = null;
  if (startMeasurement && endMeasurement && startMeasurement.id !== endMeasurement.id) {
    weightDelta = +((endMeasurement.weight || 0) - (startMeasurement.weight || 0)).toFixed(1);
    if (startMeasurement.fatPct != null && endMeasurement.fatPct != null) {
      fatDelta = +((endMeasurement.fatPct || 0) - (startMeasurement.fatPct || 0)).toFixed(1);
    }
  }

  return {
    workoutCount: completedWorkouts.length,
    doneSets: completedWorkouts.reduce((sum, [, workout]) => sum + countDoneSets(workout), 0),
    cardioSessions: cardioEntries.length,
    cardioDistance: cardioEntries.reduce((sum, entry) => sum + (entry.distKm || (entry.steps || 0) * 0.73 / 1000), 0),
    steps: cardioEntries.reduce((sum, entry) => sum + (entry.steps || 0), 0),
    calories: cardioEntries.reduce((sum, entry) => sum + (entry.calories || 0), 0),
    measurementCount: periodMeasurements.length,
    latestMeasurement: periodMeasurements.length ? periodMeasurements[periodMeasurements.length - 1] : null,
    weightDelta,
    fatDelta
  };
}

function buildSummaryCardMarkup({ title, rangeLabel, status, summary, previousSummary, compareLabel }) {
  return `
    <div class="summary-card-head">
      <div>
        <div class="lex" style="font-weight:800;font-size:14px;">${title}</div>
        <div class="summary-card-range">${rangeLabel}</div>
      </div>
      <span class="badge ${status === 'W toku' ? 'bdg-p' : 'bdg-t'}">${status}</span>
    </div>
    <div class="summary-list">
      ${buildSummaryMetricRow('Trening', `${summary.workoutCount}`, `${summary.doneSets} zal. serii`)}
      ${buildSummaryMetricRow('Cardio', `${summary.cardioDistance.toFixed(1)} km`, `${summary.cardioSessions} sesji`)}
      ${buildSummaryMetricRow('Kroki / kcal', formatCompactSteps(summary.steps), `${summary.calories} kcal`)}
      ${buildSummaryMetricRow('Sylwetka', formatBodyDelta(summary), formatBodyMeta(summary))}
    </div>
    <div class="summary-footer">${buildSummaryComparison(summary, previousSummary, compareLabel, status)}</div>`;
}

function buildSummaryMetricRow(label, value, meta) {
  return `<div class="summary-row">
    <div style="min-width:0;">
      <div class="summary-row-label">${label}</div>
      <div class="summary-row-meta">${meta}</div>
    </div>
    <div class="summary-row-value">${value}</div>
  </div>`;
}

function buildSummaryComparison(current, previous, compareLabel, status) {
  if (!current.workoutCount && !current.cardioSessions && !current.measurementCount) {
    return 'Brak nowych wpisów w tym okresie. Karta będzie aktualizować się lokalnie po każdym logu.';
  }

  const diffs = [];
  const workoutDiff = current.workoutCount - previous.workoutCount;
  const cardioDiff = +(current.cardioDistance - previous.cardioDistance).toFixed(1);
  const stepDiff = current.steps - previous.steps;

  if (workoutDiff) diffs.push(`treningi ${formatSignedNumber(workoutDiff)}`);
  if (Math.abs(cardioDiff) >= 0.1) diffs.push(`cardio ${formatSignedNumber(cardioDiff, 1)} km`);
  if (Math.abs(stepDiff) >= 100) diffs.push(`kroki ${formatSignedCompactNumber(stepDiff)}`);

  if (!diffs.length) {
    return status === 'W toku'
      ? `Na ten moment tempo jest bardzo podobne do poprzedniego ${compareLabel}.`
      : `Finalnie okres wypadł bardzo podobnie do poprzedniego ${compareLabel}.`;
  }

  return status === 'W toku'
    ? `Na ten moment vs poprzedni ${compareLabel}: ${diffs.join(' · ')}.`
    : `Vs poprzedni ${compareLabel}: ${diffs.join(' · ')}.`;
}

function formatBodyDelta(summary) {
  if (!summary.measurementCount) return '—';
  if (summary.weightDelta === null) {
    return summary.latestMeasurement ? `${Number(summary.latestMeasurement.weight || 0).toFixed(1)} kg` : '—';
  }
  return `${summary.weightDelta > 0 ? '+' : ''}${summary.weightDelta} kg`;
}

function formatBodyMeta(summary) {
  if (!summary.measurementCount) return 'Brak nowych pomiarów';
  const suffix = summary.measurementCount === 1 ? '' : summary.measurementCount < 5 ? 'y' : 'ów';
  if (summary.fatDelta === null) return `${summary.measurementCount} pomiar${suffix}`;
  return `${summary.measurementCount} pomiar${suffix} · ${summary.fatDelta > 0 ? '+' : ''}${summary.fatDelta}% tł.`;
}

function countDoneSets(workout) {
  if (globalThis.KECore?.countDoneSets) {
    return globalThis.KECore.countDoneSets(workout);
  }

  if (!workout?.sets) return 0;
  return Object.values(workout.sets).reduce((sum, sets) => sum + sets.filter(set => set.done).length, 0);
}

function formatCompactSteps(value) {
  if (!value) return '0';
  return value >= 1000 ? (value / 1000).toFixed(1) + 'k' : String(value);
}

function formatSignedCompactNumber(value) {
  const abs = Math.abs(value);
  const sign = value > 0 ? '+' : '-';
  if (abs >= 1000) return sign + (abs / 1000).toFixed(1) + 'k';
  return sign + abs;
}

function formatSignedNumber(value, digits = 0) {
  const rounded = digits ? value.toFixed(digits) : String(value);
  return `${value > 0 ? '+' : ''}${rounded}`;
}

function getMonthRange(dateStr) {
  if (globalThis.KECore?.getMonthRange) {
    return globalThis.KECore.getMonthRange(dateStr);
  }

  const d = new Date(dateStr + 'T00:00:00');
  return {
    start: fmtDate(new Date(d.getFullYear(), d.getMonth(), 1)),
    end: fmtDate(new Date(d.getFullYear(), d.getMonth() + 1, 0))
  };
}

function getShiftedMonthRange(dateStr, offset) {
  if (globalThis.KECore?.getShiftedMonthRange) {
    return globalThis.KECore.getShiftedMonthRange(dateStr, offset);
  }

  const d = new Date(dateStr + 'T00:00:00');
  return {
    start: fmtDate(new Date(d.getFullYear(), d.getMonth() + offset, 1)),
    end: fmtDate(new Date(d.getFullYear(), d.getMonth() + offset + 1, 0))
  };
}

function getMonthLabelPL(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const months = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];
  return `${months[d.getMonth()]} ${d.getFullYear()}`;
}

function formatSummaryRange(startDate, endDate) {
  const start = new Date(startDate + 'T00:00:00');
  const end = new Date(endDate + 'T00:00:00');
  const months = ['Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze', 'Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru'];
  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    return `${start.getDate()}-${end.getDate()} ${months[end.getMonth()]} ${end.getFullYear()}`;
  }
  return `${start.getDate()} ${months[start.getMonth()]} - ${end.getDate()} ${months[end.getMonth()]} ${end.getFullYear()}`;
}

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
