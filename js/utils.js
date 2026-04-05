// ═══════════════════════════════════════════════════════════════
// THE KINETIC ENGINE — utils.js
// Pomocnicze funkcje: daty, toast, wykresy
// ═══════════════════════════════════════════════════════════════

// ── DATY ────────────────────────────────────────────────────────

/** Zwraca datę poniedziałku tygodnia zawierającego podaną datę (YYYY-MM-DD) */
function getMondayOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return fmtDate(d);
}

/** Formatuje Date do stringa YYYY-MM-DD */
function fmtDate(d) {
  const dt = new Date(d);
  return dt.getFullYear() + '-'
    + String(dt.getMonth() + 1).padStart(2, '0') + '-'
    + String(dt.getDate()).padStart(2, '0');
}

/** Dodaje n dni do daty w formacie YYYY-MM-DD */
function addDays(dateStr, n) {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + n);
  return fmtDate(d);
}

const TRAINING_WEEKDAY_SHORT_LABELS = ['Pn', 'Wt', 'Sr', 'Cz', 'Pt', 'Sb', 'Nd'];
const TRAINING_WEEKDAY_LABELS = ['Poniedzialek', 'Wtorek', 'Sroda', 'Czwartek', 'Piatek', 'Sobota', 'Niedziela'];

function getTrainingWeekdayLabel(weekday, short = false) {
  const normalizedWeekday = Number(weekday);
  const labels = short ? TRAINING_WEEKDAY_SHORT_LABELS : TRAINING_WEEKDAY_LABELS;
  return labels[normalizedWeekday] || labels[0];
}

function getWeekSchedule(monday, plan = getActiveTrainingPlan()) {
  return getOrderedPlanDays(plan).map(day => ({
    ...day,
    date: addDays(monday, day.weekday)
  }));
}

/** Zwraca daty dni aktywnego planu dla danego poniedziałku */
function getWeekDates(monday, plan = getActiveTrainingPlan()) {
  return getWeekSchedule(monday, plan).reduce((acc, day) => {
    acc[day.id] = day.date;
    return acc;
  }, {});
}

/** Formatuje datę po polsku: "Pn, 26 Maj" */
function formatDatePL(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const days   = ['Nd','Pn','Wt','Śr','Cz','Pt','Sb'];
  const months = ['Sty','Lut','Mar','Kwi','Maj','Cze','Lip','Sie','Wrz','Paź','Lis','Gru'];
  return days[d.getDay()] + ', ' + d.getDate() + ' ' + months[d.getMonth()];
}

/** Zwraca label tygodnia: "26 Maj – 30 Maj 2025" */
function getWeekLabel(monday) {
  const fri = addDays(monday, 6);
  const m0  = new Date(monday + 'T00:00:00');
  const m1  = new Date(fri    + 'T00:00:00');
  const months = ['Sty','Lut','Mar','Kwi','Maj','Cze','Lip','Sie','Wrz','Paź','Lis','Gru'];
  return m0.getDate() + ' ' + months[m0.getMonth()]
    + ' – ' + m1.getDate() + ' ' + months[m1.getMonth()]
    + ' ' + m1.getFullYear();
}

/** Sprawdza czy dateStr to dzisiaj */
function isToday(dateStr) {
  return fmtDate(new Date()) === dateStr;
}

/** Numer tygodnia ISO */
function getISOWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

/** Klucz tygodniowy dla groupByWeek */
function getWeekKey(dateStr) {
  const d   = new Date(dateStr + 'T00:00:00');
  const mon = getMondayOfWeek(d);
  const m   = new Date(mon + 'T00:00:00');
  const wn  = getISOWeekNumber(m);
  return { key: `Tydzień ${wn} (${m.getFullYear()})`, date: mon };
}

/** Grupuje tablicę wpisów { date, ... } według tygodnia ISO */
function groupByWeek(entries) {
  const map = {};
  entries.forEach(e => {
    const { key, date } = getWeekKey(e.date);
    if (!map[key]) map[key] = { key, date, items: [] };
    map[key].items.push(e);
  });
  return Object.values(map).sort((a, b) => b.date.localeCompare(a.date));
}

// ── TOAST ────────────────────────────────────────────────────────
let _toastTimer;

function showToast(msg, icon = 'check_circle', color = 'var(--t)') {
  const el  = document.getElementById('toast');
  const ic  = document.getElementById('toast-icon');
  document.getElementById('toast-msg').textContent = msg;
  ic.textContent = icon;
  ic.style.color = color;
  el.style.transform = 'translateY(0)';
  el.style.opacity   = '1';
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => {
    el.style.transform = 'translateY(80px)';
    el.style.opacity   = '0';
  }, 3000);
}

// ── CHART HELPERS ────────────────────────────────────────────────

/** Niszczy wykres Chart.js po nazwie (state.charts[name]) */
function destroyChart(name) {
  if (state.charts[name]) {
    state.charts[name].destroy();
    delete state.charts[name];
  }
}

/** Skrót: destroyChart alias używany w body.js */
function dC(id) {
  destroyChart(id);
}

/** Tworzy gradient pionowy na canvasie */
function mkGrad(ctx, h, c1, c2) {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, c1);
  g.addColorStop(1, c2);
  return g;
}

/** Domyślne opcje Chart.js (ciemny motyw) */
const CHART_DEFAULTS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      labels: { color: '#a3aac4', font: { size: 10 }, boxWidth: 14, padding: 12 }
    },
    tooltip: {
      backgroundColor: 'rgba(10,20,50,.95)',
      borderColor:     'rgba(137,172,255,.2)',
      borderWidth: 1,
      titleColor:  '#89acff',
      bodyColor:   '#dee5ff',
      padding: 10
    }
  },
  scales: {
    x: {
      grid:  { color: 'rgba(255,255,255,.03)' },
      ticks: { color: '#a3aac4', font: { size: 9 }, maxRotation: 45, maxTicksLimit: 12 }
    },
    y: {
      grid:  { color: 'rgba(255,255,255,.04)' },
      ticks: { color: '#a3aac4', font: { size: 9 } }
    }
  }
};

/** Klonuje CHART_DEFAULTS z opcjonalnym nadpisaniem */
function cOpts(extra = {}) {
  return JSON.parse(JSON.stringify({ ...CHART_DEFAULTS, ...extra }));
}

// ── STATYSTYKI ───────────────────────────────────────────────────

/** Rolling average tablicy liczb, okno k */
function rollingAvg(arr, k) {
  return arr.map((_, i) => {
    const slice = arr.slice(Math.max(0, i - k + 1), i + 1);
    return slice.reduce((s, v) => s + v, 0) / slice.length;
  });
}

/** Wygładza tablicę danych: 'raw' | '7d' | '30d' */
function smoothData(dates, vals, mode) {
  if (mode === 'raw') return vals;
  const k = mode === '7d' ? 7 : 30;
  return rollingAvg(vals, k);
}

/** Regresja liniowa pts=[{x,y}] → {slope, intercept} lub null */
function linReg(pts) {
  const n = pts.length;
  if (n < 2) return null;
  let sx = 0, sy = 0, sxy = 0, sxx = 0;
  pts.forEach(p => { sx += p.x; sy += p.y; sxy += p.x * p.y; sxx += p.x * p.x; });
  const slope     = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  const intercept = (sy - slope * sx) / n;
  return { slope, intercept };
}

// ── MODAL / DRAWER HELPERS ───────────────────────────────────────
function openModal(id)  { document.getElementById(id + '-overlay').classList.add('open'); }
function closeModal(id) { document.getElementById(id + '-overlay').classList.remove('open'); }

function openDrawer(id) {
  document.getElementById(id + '-overlay').classList.add('open');
  document.getElementById(id + '-drawer').classList.add('open');
}
function closeDrawer(id) {
  document.getElementById(id + '-overlay').classList.remove('open');
  document.getElementById(id + '-drawer').classList.remove('open');
}
