// =================================================================
// THE KINETIC ENGINE - app.js
// =================================================================

document.addEventListener('DOMContentLoaded', () => {

  state.currentWeekMonday = getMondayOfWeek(new Date());

  const p = getProfile();
  document.getElementById('sidebar-name').textContent = p.name || 'M\u00F3j Profil';
  document.getElementById('sidebar-avatar').textContent = p.avatar || '\uD83D\uDCAA';

  updateNotifBadge();

  // Auto-fill dates in quick modals when they open.
  document.getElementById('quick-cardio-overlay')?.addEventListener('click', e => {
    if (e.target.id === 'quick-cardio-overlay') return;
  });

  const fillModalDates = () => {
    const qcDate = document.getElementById('qc-date');
    const qbDate = document.getElementById('qb-date');
    if (qcDate && !qcDate.value) qcDate.value = fmtDate(new Date());
    if (qbDate && !qbDate.value) qbDate.value = fmtDate(new Date());
  };

  const baseOpenModal = openModal;
  window.openModal = function(id) {
    baseOpenModal(id);
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
    console.warn('[KE] PWA module missing; service worker registration skipped.');
  }
});

function _seedDemoData(data) {
  const mon = getMondayOfWeek(new Date());
  const prevMon = addDays(mon, -7);
  const prevSchedule = getWeekSchedule(prevMon, getActiveTrainingPlan());

  prevSchedule.forEach(day => {
    const date = day.date;
    const sets = {};

    day.exercises.forEach(ex => {
      const repTarget = String(ex.reps).split(/\u2013|-/)[1] || 8;
      sets[ex.n] = Array(ex.sets).fill(null).map(() => ({
        reps: String(parseInt(repTarget) - Math.floor(Math.random() * 2)),
        weight: ex.weight ? String(10 + Math.floor(Math.random() * 20)) : '',
        done: true,
      }));
    });

    data.workouts[date] = { type: day.id, sets, completed: true };
  });

  for (let i = 0; i < 6; i++) {
    const d = addDays(fmtDate(new Date()), -i);
    const steps = 4000 + Math.floor(Math.random() * 6000);
    data.cardio.push({
      id: Date.now().toString() + i,
      date: d,
      duration: 30 + Math.floor(Math.random() * 30),
      calories: 200 + Math.floor(Math.random() * 200),
      steps,
      heartRate: 100 + Math.floor(Math.random() * 30),
      distKm: +(steps * 0.73 / 1000).toFixed(2),
    });
  }

  data.notifications = [
    {
      id: '1',
      icon: 'notifications',
      read: false,
      date: new Date().toISOString(),
      title: '\uD83D\uDC4B Witaj w Kinetic Engine!',
      body: 'Tw\u00F3j dziennik treningowy jest gotowy. Zacznij rejestrowa\u0107 treningi.',
    },
    {
      id: '2',
      icon: 'fitness_center',
      read: false,
      date: new Date().toISOString(),
      title: '\uD83D\uDCA1 Wskaz\u00F3wka',
      body: 'Kliknij kafelek dnia w zak\u0142adce Trening, aby zobaczy\u0107 plan \u0107wicze\u0144.',
    },
  ];

  saveData(data);
  updateNotifBadge();
  renderDashboard();
}
