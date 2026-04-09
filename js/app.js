// =================================================================
// THE KINETIC ENGINE - app.js
// =================================================================

document.addEventListener('DOMContentLoaded', () => {

  state.currentWeekMonday = getMondayOfWeek(new Date());

  const p = getProfile();
  if (typeof updateSidebarProfileSummary === 'function') {
    updateSidebarProfileSummary(p);
  } else {
    document.getElementById('sidebar-name').textContent = p.name || 'Moj Profil';
    document.getElementById('sidebar-avatar').textContent = p.avatar || '\uD83D\uDCAA';
  }

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

  if (typeof initPWA === 'function') {
    initPWA();
  } else if ('serviceWorker' in navigator) {
    console.warn('[KE] PWA module missing; service worker registration skipped.');
  }
});
