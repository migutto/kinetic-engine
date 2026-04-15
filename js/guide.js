// ═══════════════════════════════════════════════════════════════
// THE KINETIC ENGINE — guide.js
// Poradnik ćwiczeń: lista, filtry, szczegóły ćwiczenia
// ═══════════════════════════════════════════════════════════════

function renderGuide() {
  const categories = getGuideCategories();
  const guideData = getGuideData();
  if (!categories.some(category => category.id === state.guideFilter)) state.guideFilter = 'all';
  if (state.guideSelected && !guideData.some(exercise => exercise.id === state.guideSelected)) {
    state.guideSelected = guideData[0]?.id || null;
  }

  // Kategorie (chipy)
  document.getElementById('guide-cats').innerHTML = categories.map(c =>
    `<button class="chip ${state.guideFilter === c.id ? 'active' : ''}" onclick="setGuideCat('${c.id}')">${c.label}</button>`
  ).join('');

  renderGuideList();
  if (state.guideSelected) renderGuideDetail(state.guideSelected);
}

function setGuideCat(cat) {
  state.guideFilter = cat;
  renderGuide();
}

/** Wywoływana z oninput pola wyszukiwania w topbarze */
function filterGuide(q) {
  renderGuideList(normalizeGuidePlanText(q));
}

function getGuideLevelLabel(level) {
  const labels = {
    podstawowy: 'Podstawowy',
    sredni: 'Średni',
    zaawansowany: 'Zaawansowany'
  };
  return labels[level] || level;
}

function getGuideListMeta(exercise) {
  const category = typeof getGuideCategoryLabel === 'function' ? getGuideCategoryLabel(exercise.cat) : exercise.cat;
  const equipment = Array.isArray(exercise.equipment) && exercise.equipment[0] ? exercise.equipment[0] : '';
  return [category, equipment].filter(Boolean).join(' · ');
}

function getGuideSearchText(exercise) {
  return [
    exercise.name,
    exercise.cat,
    typeof getGuideCategoryLabel === 'function' ? getGuideCategoryLabel(exercise.cat) : '',
    exercise.level,
    ...(Array.isArray(exercise.aliases) ? exercise.aliases : []),
    ...(Array.isArray(exercise.primaryMuscles) ? exercise.primaryMuscles : []),
    ...(Array.isArray(exercise.secondaryMuscles) ? exercise.secondaryMuscles : []),
    ...(Array.isArray(exercise.equipment) ? exercise.equipment : [])
  ].join(' ');
}

function getGuideDetailTags(exercise) {
  const tags = [
    ...(Array.isArray(exercise.primaryMuscles) ? exercise.primaryMuscles.slice(0, 2) : []),
    ...(Array.isArray(exercise.equipment) ? exercise.equipment.slice(0, 2) : [])
  ];

  return tags.map(tag => `<span class="badge bdg-s" style="font-size:8px;opacity:.85;">${tag}</span>`).join('');
}

function normalizeGuidePlanText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9ąćęłńóśźż]+/gi, ' ')
    .trim();
}

function getGuideMatchTokens(value) {
  return normalizeGuidePlanText(value)
    .split(/\s+/)
    .filter(token => token.length > 2 && !['nad', 'pod', 'przy', 'oraz', 'albo', 'lub', 'the'].includes(token));
}

function guideExerciseMatchesPlan(exercise, planExerciseName) {
  const planTokens = new Set(getGuideMatchTokens(planExerciseName));
  const candidates = [exercise.name, ...(Array.isArray(exercise.aliases) ? exercise.aliases : [])];

  return candidates.some(candidate => {
    const tokens = getGuideMatchTokens(candidate);
    if (!tokens.length) return false;
    return tokens.slice(0, Math.min(3, tokens.length)).every(token => planTokens.has(token));
  });
}

function renderGuideList(q = '') {
  const filtered = getGuideData().filter(e =>
    (state.guideFilter === 'all' || e.cat === state.guideFilter) &&
    (!q || normalizeGuidePlanText(getGuideSearchText(e)).includes(q))
  );

  document.getElementById('guide-list').innerHTML = filtered.length
    ? filtered.map(ex => `
      <div class="guide-ex ${state.guideSelected === ex.id ? 'active' : ''}" onclick="selectGuideEx('${ex.id}')">
        <div class="guide-img">${ex.icon}</div>
        <div style="flex:1;min-width:0;">
          <div style="font-weight:700;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${ex.name}</div>
          <div style="display:flex;gap:6px;margin-top:5px;">
            <span class="badge bdg-s" style="font-size:8px;">${getGuideListMeta(ex)}</span>
            <span style="font-size:10px;color:var(--osd);">${getGuideLevelLabel(ex.level)}</span>
          </div>
        </div>
        <span class="material-symbols-outlined" style="color:var(--osd);font-size:16px;flex-shrink:0;">chevron_right</span>
      </div>`).join('')
    : '<div style="color:var(--osd);padding:24px;font-size:13px;text-align:center;opacity:.6;">Brak wyników</div>';
}

function selectGuideEx(id) {
  state.guideSelected = id;
  renderGuideList();
  renderGuideDetail(id);
}

function renderGuideDetail(id) {
  const ex = getGuideData().find(e => e.id === id);
  if (!ex) return;

  // Kropki trudności
  const diffDots = [1, 2, 3].map(i =>
    `<div style="width:28px;height:4px;border-radius:999px;
      background:${i <= ex.diff ? 'var(--p)' : 'rgba(255,255,255,.07)'};
      box-shadow:${i <= ex.diff ? '0 0 8px rgba(137,172,255,.4)' : 'none'};"></div>`
  ).join('');

  // Kroki
  const stepsHTML = ex.steps.map((step, i) => `
    <div style="display:flex;gap:16px;">
      <div style="display:flex;flex-direction:column;align-items:center;">
        <div class="step-circle">${String(i + 1).padStart(2, '0')}</div>
        ${i < ex.steps.length - 1 ? '<div style="width:2px;flex:1;background:rgba(255,255,255,.04);margin-top:8px;min-height:20px;"></div>' : ''}
      </div>
      <div style="flex:1;padding-top:7px;">
        <div style="font-weight:700;font-size:14px;margin-bottom:7px;">${step.t}</div>
        <p style="color:var(--osd);font-size:13px;line-height:1.7;margin-bottom:${step.tip ? '10px' : '0'};">${step.d}</p>
        ${step.tip ? `
          <div style="display:inline-flex;align-items:center;gap:7px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;
            color:${step.tip.type === 'warn' ? 'rgba(243,255,202,.8)' : 'rgba(137,172,255,.8)'};
            background:${step.tip.type === 'warn' ? 'rgba(243,255,202,.05)' : 'rgba(137,172,255,.05)'};
            padding:6px 10px;border-radius:8px;">
            <span class="material-symbols-outlined" style="font-size:14px;">${step.tip.type === 'warn' ? 'warning' : 'info'}</span>
            <span>${step.tip.text}</span>
          </div>` : ''}
      </div>
    </div>`).join('');

  // Korzyści
  const benefitsHTML = ex.benefits.map((b, i) => `
    <div style="display:flex;align-items:flex-start;gap:11px;${i < ex.benefits.length - 1 ? 'margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid rgba(255,255,255,.04);' : ''}">
      <div style="width:34px;height:34px;border-radius:9px;background:rgba(137,172,255,.07);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
        <span class="material-symbols-outlined" style="color:${b.color};font-size:18px;">${b.icon}</span>
      </div>
      <div>
        <div style="font-weight:700;font-size:13px;margin-bottom:3px;">${b.t}</div>
        <div style="font-size:11px;color:var(--osd);line-height:1.5;">${b.d}</div>
      </div>
    </div>`).join('');

  // W planie
  const inPlanHTML = getOrderedPlanDays()
    .filter(day => day.exercises.some(planExercise => guideExerciseMatchesPlan(ex, planExercise.n)))
    .map(day => `
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
        <span class="badge bdg-p" style="font-size:8px;">${day.name}</span>
        <span style="font-size:10px;color:var(--osd);">${day.subtitle}</span>
    </div>`).join('') || '<div style="font-size:11px;color:var(--osd);">To ćwiczenie nie jest jeszcze przypięte do aktywnego planu.</div>';

  document.getElementById('guide-detail').innerHTML = `
    <div class="guide-detail-shell fade-up">
      <div class="guide-hero">
        <div class="guide-hero-icon">${ex.icon}</div>
        <div class="guide-hero-copy">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:10px;">
            <span class="badge bdg-s" style="font-size:9px;padding:5px 12px;">${typeof getGuideCategoryLabel === 'function' ? getGuideCategoryLabel(ex.cat) : ex.cat}</span>
            <span style="font-size:10px;color:var(--osd);">${getGuideLevelLabel(ex.level)}</span>
          </div>
          <div class="lex" style="font-size:32px;font-weight:900;line-height:1.1;margin-bottom:10px;background:var(--g1);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">${ex.name}</div>
          <p style="color:var(--osd);font-size:13px;line-height:1.75;">${ex.desc}</p>
          <div style="display:flex;gap:7px;flex-wrap:wrap;margin-top:12px;">${getGuideDetailTags(ex)}</div>
        </div>
        <div class="guide-hero-score">
          <div style="font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:var(--osd);margin-bottom:8px;">Trudność</div>
          <div style="display:flex;gap:5px;">${diffDots}</div>
        </div>
      </div>

      <div class="guide-detail-grid">
        <div>
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:18px;">
            <div style="width:3px;height:22px;background:var(--g1);border-radius:2px;box-shadow:0 0 10px rgba(137,172,255,.4);"></div>
            <div class="lex" style="font-weight:800;font-size:17px;">Jak wykonać</div>
          </div>
          <div style="display:flex;flex-direction:column;gap:18px;">
            ${stepsHTML}
          </div>
        </div>

        <div class="guide-side-stack">
          <div class="guide-info-card">
            <div class="lex" style="font-weight:800;font-size:16px;margin-bottom:14px;">W skrócie</div>
            ${benefitsHTML}
          </div>
          <div class="guide-info-card guide-info-card-secondary">
            <div style="font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:var(--osd);margin-bottom:8px;">W planie treningowym</div>
            ${inPlanHTML}
          </div>
        </div>
      </div>
    </div>`;
}
