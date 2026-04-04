// ═══════════════════════════════════════════════════════════════
// THE KINETIC ENGINE — app.js
// ═══════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {

  state.currentWeekMonday = getMondayOfWeek(new Date());

  const p = getProfile();
  document.getElementById('sidebar-name').textContent   = p.name   || 'Mój Profil';
  document.getElementById('sidebar-avatar').textContent = p.avatar || '💪';

  updateNotifBadge();

  // Auto-wypełnij datę w quick modalach przy każdym otwarciu
  document.getElementById('quick-cardio-overlay')?.addEventListener('click', e => {
    if (e.target.id === 'quick-cardio-overlay') return;
  });
  // Observer: wypełnij datę gdy modal staje się widoczny
  const fillModalDates = () => {
    const qcDate = document.getElementById('qc-date');
    const qbDate = document.getElementById('qb-date');
    if (qcDate && !qcDate.value) qcDate.value = fmtDate(new Date());
    if (qbDate && !qbDate.value) qbDate.value = fmtDate(new Date());
  };

  // Patch openModal żeby zawsze uzupełniał daty
  const _baseOpenModal = openModal;
  window.openModal = function(id) {
    _baseOpenModal(id);
    if (id === 'quick-cardio' || id === 'quick-body') fillModalDates();
  };

  const urlTab = new URLSearchParams(location.search).get('tab');
  switchTab(urlTab || 'dashboard');

  const data = getData();
  if (data.cardio.length === 0 && Object.keys(data.workouts).length === 0) {
    _seedDemoData(data);
  }

  if (typeof initPWA === 'function') {
    initPWA();
  } else if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
      .then(reg => console.log('[KE] SW:', reg.scope))
      .catch(err => console.warn('[KE] SW błąd:', err));
  }
});

function _seedDemoData(data) {
  const mon       = getMondayOfWeek(new Date());
  const prevMon   = addDays(mon, -7);
  const prevDates = getWeekDates(prevMon);

  ['A', 'B', 'C'].forEach(t => {
    const date = prevDates[t]; const sets = {};
    PLAN[t].exercises.forEach(ex => {
      sets[ex.n] = Array(ex.sets).fill(null).map(() => ({
        reps:   String(parseInt(ex.reps.split('–')[1] || 8) - Math.floor(Math.random() * 2)),
        weight: ex.weight ? String(10 + Math.floor(Math.random() * 20)) : '',
        done:   true
      }));
    });
    data.workouts[date] = { type: t, sets, completed: true };
  });

  for (let i = 0; i < 6; i++) {
    const d = addDays(fmtDate(new Date()), -i);
    const steps = 4000 + Math.floor(Math.random() * 6000);
    data.cardio.push({
      id: Date.now().toString() + i, date: d,
      duration: 30 + Math.floor(Math.random() * 30),
      calories: 200 + Math.floor(Math.random() * 200),
      steps, heartRate: 100 + Math.floor(Math.random() * 30),
      distKm: +(steps * 0.73 / 1000).toFixed(2)
    });
  }

  data.notifications = [
    { id: '1', icon: 'notifications', read: false, date: new Date().toISOString(), title: '👋 Witaj w Kinetic Engine!', body: 'Twój dziennik treningowy jest gotowy. Zacznij rejestrować treningi.' },
    { id: '2', icon: 'fitness_center', read: false, date: new Date().toISOString(), title: '💡 Wskazówka', body: 'Kliknij kafelek dnia w zakładce Trening aby zobaczyć plan ćwiczeń.' },
  ];

  saveData(data);
  updateNotifBadge();
  renderDashboard();
}
