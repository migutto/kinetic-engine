// ═══════════════════════════════════════════════════════════════
// THE KINETIC ENGINE — app.js
// Inicjalizacja aplikacji, dane demo, rejestracja Service Workera
// Musi być ładowany OSTATNI (po wszystkich pozostałych js/)
// ═══════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {

  // ── Stan startowy ──────────────────────────────────────────
  state.currentWeekMonday = getMondayOfWeek(new Date());

  // ── Profil w sidebarze ─────────────────────────────────────
  const p = getProfile();
  document.getElementById('sidebar-name').textContent   = p.name   || 'Mój Profil';
  document.getElementById('sidebar-avatar').textContent = p.avatar || '💪';

  // ── Odczytaj ustawienia ────────────────────────────────────
  updateNotifBadge();

  // ── Obsługa URL param ?tab=... ─────────────────────────────
  const urlTab = new URLSearchParams(location.search).get('tab');
  switchTab(urlTab || 'dashboard');

  // ── Seed demo danych (tylko gdy baza jest pusta) ───────────
  const data = getData();
  if (data.cardio.length === 0 && Object.keys(data.workouts).length === 0) {
    _seedDemoData(data);
  }

  // ── Rejestracja Service Workera ────────────────────────────
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/kinetic-engine/sw.js')
      .then(reg => console.log('[KE] SW zarejestrowany:', reg.scope))
      .catch(err => console.warn('[KE] SW błąd:', err));
  }
});

// ── DANE DEMO ───────────────────────────────────────────────────
function _seedDemoData(data) {
  // Poprzedni tydzień — ukończone treningi A/B/C
  const mon      = getMondayOfWeek(new Date());
  const prevMon  = addDays(mon, -7);
  const prevDates = getWeekDates(prevMon);

  ['A', 'B', 'C'].forEach(t => {
    const date = prevDates[t];
    const sets = {};
    PLAN[t].exercises.forEach(ex => {
      sets[ex.n] = Array(ex.sets).fill(null).map(() => ({
        reps:   String(parseInt(ex.reps.split('–')[1] || 8) - Math.floor(Math.random() * 2)),
        weight: ex.weight ? String(10 + Math.floor(Math.random() * 20)) : '',
        done:   true
      }));
    });
    data.workouts[date] = { type: t, sets, completed: true };
  });

  // Ostatnie 6 dni — aktywności cardio
  for (let i = 0; i < 6; i++) {
    const d = addDays(fmtDate(new Date()), -i);
    data.cardio.push({
      id:        Date.now().toString() + i,
      date:      d,
      duration:  30  + Math.floor(Math.random() * 30),
      calories:  200 + Math.floor(Math.random() * 200),
      steps:     4000 + Math.floor(Math.random() * 6000),
      heartRate: 100  + Math.floor(Math.random() * 30)
    });
  }

  // Powitalne powiadomienia
  data.notifications = [
    {
      id: '1', icon: 'notifications', read: false,
      date:  new Date().toISOString(),
      title: '👋 Witaj w Kinetic Engine!',
      body:  'Twój dziennik treningowy jest gotowy. Zacznij rejestrować treningi.'
    },
    {
      id: '2', icon: 'fitness_center', read: false,
      date:  new Date().toISOString(),
      title: '💡 Wskazówka',
      body:  'Kliknij kafelek dnia w zakładce Trening aby zobaczyć plan ćwiczeń.'
    },
  ];

  saveData(data);
  updateNotifBadge();
  renderDashboard();
}
