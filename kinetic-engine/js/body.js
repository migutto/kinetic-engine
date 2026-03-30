// ═══════════════════════════════════════════════════════════════
// THE KINETIC ENGINE — body.js
// Sylwetka: pomiary, kompozycja ciała, 8 wykresów, tabele,
// eksport/import JSON+CSV
// ═══════════════════════════════════════════════════════════════

let bState = { smoothing: 'raw' };

// ── KALKULACJE ──────────────────────────────────────────────────
function calcEntry(m, hCm) {
  const h     = hCm / 100;
  const fatKg = m.weight * (m.fatPct / 100);
  const lbm   = m.weight - fatKg;
  const ffmi  = h > 0 ? lbm / (h * h) : 0;
  const ratio = fatKg > 0 ? lbm / fatKg : 0;
  return { ...m, fatKg, lbm, ffmi, ratio };
}

// ── WZROST ──────────────────────────────────────────────────────
function saveBodyHeight(val) {
  const data = getData();
  data.bodyHeight = parseFloat(val) || 178;
  saveData(data);
}

// ── DODAWANIE POMIARU ───────────────────────────────────────────
function addMeasurement() {
  const weight   = parseFloat(document.getElementById('b-weight').value);
  const fatPct   = parseFloat(document.getElementById('b-fat').value);
  const muscleKg = parseFloat(document.getElementById('b-muscle').value)   || null;
  const visceral = parseFloat(document.getElementById('b-visceral').value) || null;
  const dateVal  = document.getElementById('b-date').value;
  const hVal     = document.getElementById('b-height').value;

  if (!weight || !fatPct || !dateVal) {
    showToast('Wypełnij wagę, tłuszcz% i datę', 'error', 'var(--er)');
    return;
  }
  if (hVal) saveBodyHeight(hVal);

  const data  = getData();
  const entry = { id: Date.now().toString(), date: dateVal, weight, fatPct, muscleKg, visceral };
  const idx   = data.measurements.findIndex(m => m.date === dateVal);
  if (idx >= 0) data.measurements[idx] = entry;
  else          data.measurements.push(entry);
  data.measurements.sort((a, b) => a.date.localeCompare(b.date));

  saveData(data);
  ['b-weight', 'b-fat', 'b-muscle', 'b-visceral'].forEach(id => document.getElementById(id).value = '');
  showToast('Pomiar dodany!', 'check_circle', 'var(--t)');
  renderSylwetka();
}

function deleteMeasurement(id) {
  const data = getData();
  data.measurements = data.measurements.filter(m => m.id !== id);
  saveData(data);
  renderSylwetka();
  showToast('Pomiar usunięty', 'delete', 'var(--er)');
}

// ── WYGŁADZANIE ─────────────────────────────────────────────────
function setSmoothBody(mode) {
  bState.smoothing = mode;
  document.querySelectorAll('.smooth-btn').forEach(b => {
    b.classList.toggle('active',
      (mode === 'raw' && b.textContent === 'Surowe') ||
      (mode === '7d'  && b.textContent.includes('7')) ||
      (mode === '30d' && b.textContent.includes('30'))
    );
  });
  renderBodyCharts();
}

// ── GŁÓWNY RENDER ───────────────────────────────────────────────
function renderSylwetka() {
  const data = getData();
  const hCm  = data.bodyHeight || 178;
  const di = document.getElementById('b-date');
  const hi = document.getElementById('b-height');
  if (di && !di.value) di.value = fmtDate(new Date());
  if (hi && !hi.value) hi.value = hCm;
  const ms = data.measurements.map(m => calcEntry(m, hCm));
  document.getElementById('body-count-label').textContent = ms.length + ' pomiarów';
  document.getElementById('hist-count').textContent       = ms.length + ' wpisów';
  renderBodyStats(ms);
  renderBodyCharts(ms);
  renderHistTable(ms);
  renderWeekTable(ms);
}

// ── BIEŻĄCE STATYSTYKI ──────────────────────────────────────────
function renderBodyStats(ms) {
  const el = document.getElementById('body-current-stats');
  if (!ms.length) {
    el.innerHTML = '<div style="color:var(--osd);font-size:12px;text-align:center;padding:12px;">Brak danych</div>';
    return;
  }
  const last = ms[ms.length - 1];
  const prev = ms.length > 1 ? ms[ms.length - 2] : null;
  const dW   = prev ? +(last.weight - prev.weight).toFixed(2) : null;
  const dF   = prev ? +(last.fatPct - prev.fatPct).toFixed(1) : null;
  const delta = v => {
    if (v === null) return '';
    const color = v === 0 ? 'var(--osd)' : v < 0 ? '#4ade80' : 'var(--er)';
    return `<div class="body-stat-delta" style="color:${color};">${v > 0 ? '+' : ''}${v}</div>`;
  };
  el.innerHTML = `
    <div style="font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:var(--osd);font-weight:700;margin-bottom:10px;">${formatDatePL(last.date)} · Ostatni pomiar</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px;">
      <div class="body-stat-pill"><span style="font-size:20px;">⚖️</span>
        <div><div class="body-stat-val" style="color:var(--p);">${last.weight}</div><div class="body-stat-lbl">kg</div>${delta(dW)}</div></div>
      <div class="body-stat-pill"><span style="font-size:20px;">🔥</span>
        <div><div class="body-stat-val" style="color:var(--er);">${last.fatPct}%</div><div class="body-stat-lbl">tłuszcz</div>${delta(dF)}</div></div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px;">
      <div class="body-stat-pill"><span style="font-size:20px;">💪</span>
        <div><div class="body-stat-val" style="color:#4ade80;">${last.lbm.toFixed(1)}</div><div class="body-stat-lbl">LBM kg</div></div></div>
      <div class="body-stat-pill"><span style="font-size:20px;">📊</span>
        <div><div class="body-stat-val" style="color:var(--s);">${last.ffmi.toFixed(1)}</div><div class="body-stat-lbl">FFMI</div></div></div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px;">
      <div class="body-stat-pill"><span style="font-size:20px;">📐</span>
        <div><div class="body-stat-val" style="color:var(--t);">${last.ratio.toFixed(2)}</div><div class="body-stat-lbl">Ratio</div></div></div>
      <div class="body-stat-pill"><span style="font-size:20px;">🧱</span>
        <div><div class="body-stat-val" style="color:var(--er);">${last.fatKg.toFixed(1)}</div><div class="body-stat-lbl">Tłuszcz kg</div></div></div>
    </div>`;
}

// ── 8 WYKRESÓW ──────────────────────────────────────────────────
function renderBodyCharts(ms) {
  const data = getData();
  if (!ms) ms = data.measurements.map(m => calcEntry(m, data.bodyHeight || 178));
  if (!ms.length) return;
  const labels = ms.map(m => m.date.slice(5));
  const smooth = bState.smoothing;

  // 1. Waga + projekcja
  const wVals      = smoothData(labels, ms.map(m => m.weight), smooth);
  const reg        = linReg(ms.map((m, i) => ({ x: i, y: m.weight })));
  const projLabels = [...labels];
  const projVals   = new Array(ms.length).fill(null);
  if (reg) {
    for (let i = 1; i <= 10; i++) {
      projLabels.push(addDays(ms[ms.length - 1].date, i * 3).slice(5));
      projVals.push(+(reg.slope * (ms.length - 1 + i) + reg.intercept).toFixed(2));
    }
  }
  dC('bc-weight');
  const ctx1 = document.getElementById('bc-weight').getContext('2d');
  const g1   = mkGrad(ctx1, 200, 'rgba(137,172,255,.25)', 'rgba(137,172,255,0)');
  state.charts['bc-weight'] = new Chart(ctx1, { type: 'line', data: { labels: projLabels, datasets: [
    { label: 'Waga (kg)',        data: [...wVals, ...new Array(projLabels.length - labels.length).fill(null)], borderColor: '#89acff', backgroundColor: g1, fill: true, tension: .35, pointRadius: 2, pointHoverRadius: 6, borderWidth: 2 },
    { label: 'Prognoza (Trend)', data: projVals, borderColor: '#beee00', borderDash: [6, 4], backgroundColor: 'transparent', fill: false, tension: .2, pointRadius: 0, borderWidth: 1.5 }
  ]}, options: { ...cOpts(), plugins: { ...cOpts().plugins, legend: { display: true, labels: { color: '#a3aac4', font: { size: 10 }, boxWidth: 14 } } } } });

  // 2. Skład %
  const fVals   = smoothData(labels, ms.map(m => m.fatPct), smooth);
  const musVals = smoothData(labels, ms.map(m => m.muscleKg || m.lbm), smooth);
  dC('bc-comp');
  const ctx2 = document.getElementById('bc-comp').getContext('2d');
  state.charts['bc-comp'] = new Chart(ctx2, { type: 'line', data: { labels, datasets: [
    { label: 'Fat %',     data: fVals,   borderColor: '#ff716c', backgroundColor: 'rgba(255,113,108,.08)', fill: true, tension: .35, pointRadius: 1.5, yAxisID: 'y',  borderWidth: 2 },
    { label: 'Muscle kg', data: musVals, borderColor: '#4ade80', backgroundColor: 'transparent', borderDash: [5,3], tension: .35, pointRadius: 1.5, yAxisID: 'y2', borderWidth: 1.5 }
  ]}, options: { ...cOpts(), scales: {
    x:  { grid: { color: 'rgba(255,255,255,.03)' }, ticks: { color: '#a3aac4', font: { size: 9 }, maxTicksLimit: 12, maxRotation: 45 } },
    y:  { grid: { color: 'rgba(255,255,255,.04)' }, ticks: { color: '#ff716c', font: { size: 9 } }, title: { display: true, text: 'Fat %',     color: '#ff716c', font: { size: 9 } } },
    y2: { position: 'right', grid: { display: false }, ticks: { color: '#4ade80', font: { size: 9 } }, title: { display: true, text: 'Muscle kg', color: '#4ade80', font: { size: 9 } } }
  }} });

  // 3. Ratio
  const ratioVals = smoothData(labels, ms.map(m => +m.ratio.toFixed(3)), smooth);
  dC('bc-ratio');
  const ctx3 = document.getElementById('bc-ratio').getContext('2d');
  const g3   = mkGrad(ctx3, 180, 'rgba(79,210,138,.25)', 'rgba(79,210,138,0)');
  state.charts['bc-ratio'] = new Chart(ctx3, { type: 'line', data: { labels, datasets: [{ label: 'Ratio', data: ratioVals, borderColor: '#4fd28a', backgroundColor: g3, fill: true, tension: .4, pointRadius: 1.5, borderWidth: 2 }] }, options: cOpts() });

  // 4. FFMI
  const ffmiVals = smoothData(labels, ms.map(m => +m.ffmi.toFixed(2)), smooth);
  dC('bc-ffmi');
  const ctx4 = document.getElementById('bc-ffmi').getContext('2d');
  const g4   = mkGrad(ctx4, 180, 'rgba(166,140,255,.3)', 'rgba(166,140,255,0)');
  state.charts['bc-ffmi'] = new Chart(ctx4, { type: 'line', data: { labels, datasets: [{ label: 'FFMI', data: ffmiVals, borderColor: '#a68cff', backgroundColor: g4, fill: true, tension: .4, pointRadius: 1.5, borderWidth: 2 }] }, options: cOpts() });

  // 5. Masa: tłuszcz kg + LBM kg
  const fatKgVals = smoothData(labels, ms.map(m => +m.fatKg.toFixed(2)), smooth);
  const lbmVals   = smoothData(labels, ms.map(m => +m.lbm.toFixed(2)),   smooth);
  dC('bc-mass');
  const ctx5 = document.getElementById('bc-mass').getContext('2d');
  state.charts['bc-mass'] = new Chart(ctx5, { type: 'line', data: { labels, datasets: [
    { label: 'Tłuszcz (kg)', data: fatKgVals, borderColor: '#ff716c', backgroundColor: 'transparent', tension: .35, pointRadius: 1.5, yAxisID: 'y',  borderWidth: 2 },
    { label: 'LBM (kg)',      data: lbmVals,   borderColor: '#89acff', backgroundColor: 'rgba(137,172,255,.05)', fill: true, tension: .35, pointRadius: 1.5, yAxisID: 'y2', borderWidth: 2 }
  ]}, options: { ...cOpts(), scales: {
    x:  { grid: { color: 'rgba(255,255,255,.03)' }, ticks: { color: '#a3aac4', font: { size: 9 }, maxTicksLimit: 12, maxRotation: 45 } },
    y:  { grid: { color: 'rgba(255,255,255,.04)' }, ticks: { color: '#ff716c', font: { size: 9 } } },
    y2: { position: 'right', grid: { display: false }, ticks: { color: '#89acff', font: { size: 9 } } }
  }} });

  // 6. Tygodniowe tempo zmian
  const weeks = groupByWeek(ms);
  const wkLabels = [], wkDeltas = [], wkColors = [];
  weeks.slice().reverse().forEach((w, i, arr) => {
    const avgW = w.items.reduce((s, e) => s + e.weight, 0) / w.items.length;
    wkLabels.push(w.key.replace('Tydzień ', 'Tydz.'));
    if (i === 0) { wkDeltas.push(null); wkColors.push('rgba(137,172,255,.4)'); }
    else {
      const prevAvg = arr[i - 1].items.reduce((s, e) => s + e.weight, 0) / arr[i - 1].items.length;
      const d = +(avgW - prevAvg).toFixed(2);
      wkDeltas.push(d);
      wkColors.push(d < 0 ? 'rgba(79,210,138,.7)' : d > 0 ? 'rgba(255,113,108,.7)' : 'rgba(137,172,255,.4)');
    }
  });
  dC('bc-delta');
  const ctx6 = document.getElementById('bc-delta').getContext('2d');
  state.charts['bc-delta'] = new Chart(ctx6, { type: 'bar', data: { labels: wkLabels, datasets: [{ label: 'Delta Wagi (kg)', data: wkDeltas, backgroundColor: wkColors, borderRadius: 5, borderSkipped: false }] }, options: { ...cOpts(), plugins: { ...cOpts().plugins, legend: { display: false } } } });

  // 7. Efektywność
  const wkFatD = [], wkLbmD = [], wkL2 = [];
  weeks.slice().reverse().forEach((w, i, arr) => {
    wkL2.push(w.key.replace('Tydzień ', 'Tydz.'));
    if (i === 0) { wkFatD.push(null); wkLbmD.push(null); }
    else {
      const avgF  = w.items.reduce((s, e) => s + e.fatKg, 0) / w.items.length;
      const prevF = arr[i-1].items.reduce((s, e) => s + e.fatKg, 0) / arr[i-1].items.length;
      const avgL  = w.items.reduce((s, e) => s + e.lbm,   0) / w.items.length;
      const prevL = arr[i-1].items.reduce((s, e) => s + e.lbm,   0) / arr[i-1].items.length;
      wkFatD.push(+(avgF - prevF).toFixed(2));
      wkLbmD.push(+(avgL - prevL).toFixed(2));
    }
  });
  dC('bc-eff');
  const ctx7 = document.getElementById('bc-eff').getContext('2d');
  state.charts['bc-eff'] = new Chart(ctx7, { type: 'bar', data: { labels: wkL2, datasets: [
    { label: 'Delta Tłuszczu', data: wkFatD, backgroundColor: 'rgba(255,113,108,.7)', borderRadius: 4, borderSkipped: false },
    { label: 'Delta LBM',      data: wkLbmD, backgroundColor: 'rgba(79,210,138,.7)',  borderRadius: 4, borderSkipped: false }
  ]}, options: cOpts() });

  // 8. Scatter: Waga vs Fat%
  dC('bc-scatter');
  const ctx8 = document.getElementById('bc-scatter').getContext('2d');
  state.charts['bc-scatter'] = new Chart(ctx8, { type: 'scatter', data: { datasets: [{ label: 'Waga vs Fat%', data: ms.map(m => ({ x: m.weight, y: m.fatPct })), backgroundColor: 'rgba(137,172,255,.55)', pointRadius: 4, pointHoverRadius: 7 }] }, options: { ...cOpts(), plugins: { ...cOpts().plugins, legend: { display: false } }, scales: {
    x: { grid: { color: 'rgba(255,255,255,.03)' }, ticks: { color: '#a3aac4', font: { size: 9 } }, title: { display: true, text: 'Waga (kg)', color: '#a3aac4', font: { size: 9 } } },
    y: { grid: { color: 'rgba(255,255,255,.04)' }, ticks: { color: '#a3aac4', font: { size: 9 } }, title: { display: true, text: 'Fat %',     color: '#a3aac4', font: { size: 9 } } }
  }} });
}

// ── TABELA HISTORII ─────────────────────────────────────────────
function renderHistTable(ms) {
  const sorted = [...ms].reverse().slice(0, 100);
  document.getElementById('hist-count').textContent = ms.length + ' wpisów';
  const tb = document.querySelector('#body-hist-table tbody');
  if (!sorted.length) { tb.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--osd);padding:20px;">Brak danych</td></tr>'; return; }
  tb.innerHTML = `<tr style="font-size:8.5px;color:var(--osd);text-transform:uppercase;letter-spacing:1px;"><td>Data</td><td>Waga</td><td>Fat%</td><td>Mięśnie</td><td>Trzewny</td><td></td></tr>` +
    sorted.map((m, i) => {
      const prev = i < sorted.length - 1 ? sorted[i + 1] : null;
      const dW   = prev ? +(m.weight - prev.weight).toFixed(2) : null;
      const cls  = v => v === null ? '' : (v < 0 ? 'val-up' : v > 0 ? 'val-dn' : 'val-eq');
      const arr  = v => v === null ? '•' : v < 0 ? '↓' : v > 0 ? '↑' : '•';
      return `<tr>
        <td style="font-weight:600;color:var(--osd);font-size:12px;">${m.date.slice(5)}</td>
        <td style="font-family:'Lexend',sans-serif;font-weight:800;font-size:13px;" class="${cls(dW)}">${arr(dW)} ${m.weight}</td>
        <td>${m.fatPct}%</td>
        <td style="color:#4ade80;">${m.muscleKg || m.lbm.toFixed(1)}</td>
        <td style="color:var(--osd);">${m.visceral || '–'}</td>
        <td><button class="del-btn" onclick="deleteMeasurement('${m.id}')"><span class="mi material-symbols-outlined">delete</span></button></td>
      </tr>`;
    }).join('');
}

// ── TABELA TYGODNIOWA ───────────────────────────────────────────
function renderWeekTable(ms) {
  const weeks = groupByWeek(ms);
  const tb    = document.querySelector('#body-week-table tbody');
  if (!weeks.length) { tb.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--osd);padding:16px;">Brak danych</td></tr>'; return; }
  tb.innerHTML = weeks.map((w, i) => {
    const avgW  = (w.items.reduce((s, e) => s + e.weight, 0) / w.items.length).toFixed(2);
    const avgF  = (w.items.reduce((s, e) => s + e.fatPct, 0) / w.items.length).toFixed(2);
    const nextW = weeks[i + 1];
    const dW    = nextW ? +(avgW - (nextW.items.reduce((s, e) => s + e.weight, 0) / nextW.items.length)).toFixed(2) : null;
    const dF    = nextW ? +(avgF - (nextW.items.reduce((s, e) => s + e.fatPct, 0) / nextW.items.length)).toFixed(2) : null;
    const fmt   = v => v === null ? '<span style="color:var(--osd);">–</span>' : `<span style="color:${v < 0 ? '#4ade80' : 'var(--er)'};font-weight:700;">${v > 0 ? '+' : ''}${v} ${v < 0 ? '▾' : '▴'}</span>`;
    return `<tr>
      <td style="font-weight:600;font-size:11px;">${w.key}</td>
      <td style="font-family:'Lexend';font-weight:800;">${avgW} kg</td>
      <td>${fmt(dW)} kg</td><td>${avgF} %</td><td>${fmt(dF)} %</td>
    </tr>`;
  }).join('');
}

// ── EKSPORT / IMPORT ────────────────────────────────────────────
function importBodyJSON(input) {
  const file = input.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const json = JSON.parse(e.target.result);
      const data = getData();
      const arr  = Array.isArray(json) ? json : (json.measurements || []);
      if (!arr.length) { showToast('Plik nie zawiera pomiarów', 'error', 'var(--er)'); return; }
      const normalized = arr.map(m => ({
        id:       m.id || Date.now().toString() + Math.random(),
        date:     m.date,
        weight:   parseFloat(m.weight   || m.waga)   || 0,
        fatPct:   parseFloat(m.fatPct   || m.fat_pct || m.fat || m.tluszcz) || 0,
        muscleKg: parseFloat(m.muscleKg || m.muscle  || m.miesnie) || null,
        visceral: parseFloat(m.visceral || m.trzewna) || null,
      })).filter(m => m.date && m.weight > 0);
      const map = {};
      data.measurements.forEach(m => map[m.date] = m);
      normalized.forEach(m => map[m.date] = m);
      data.measurements = Object.values(map).sort((a, b) => a.date.localeCompare(b.date));
      saveData(data); input.value = '';
      showToast(`Zaimportowano ${normalized.length} pomiarów`, 'upload_file', 'var(--p)');
      renderSylwetka();
    } catch { showToast('Błąd parsowania JSON', 'error', 'var(--er)'); }
  };
  reader.readAsText(file);
}

function exportBodyJSON() {
  const data = getData();
  const blob = new Blob([JSON.stringify({ measurements: data.measurements, bodyHeight: data.bodyHeight, exportDate: new Date().toISOString() }, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'sylwetka_' + fmtDate(new Date()) + '.json';
  a.click();
  showToast('JSON pobrano!', 'download', 'var(--p)');
}

function exportBodyCSV() {
  const data = getData();
  const ms   = data.measurements.map(m => calcEntry(m, data.bodyHeight || 178));
  const hdr  = 'Data,Waga (kg),Tłuszcz (%),Tłuszcz (kg),Mięśnie (kg),LBM (kg),FFMI,Ratio,Trzewiowy\n';
  const rows = ms.map(m => [m.date, m.weight, m.fatPct, m.fatKg.toFixed(2), m.muscleKg || '', m.lbm.toFixed(2), m.ffmi.toFixed(2), m.ratio.toFixed(3), m.visceral || ''].join(',')).join('\n');
  const blob = new Blob([hdr + rows], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'sylwetka_' + fmtDate(new Date()) + '.csv';
  a.click();
  showToast('CSV pobrano!', 'table_chart', 'var(--t)');
}
