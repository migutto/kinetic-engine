// ═══════════════════════════════════════════════════════════════
// THE KINETIC ENGINE — guide.js
// Poradnik ćwiczeń: lista, filtry, szczegóły ćwiczenia
// ═══════════════════════════════════════════════════════════════

function renderGuide() {
  // Kategorie (chipy)
  document.getElementById('guide-cats').innerHTML = GUIDE_CATS.map(c =>
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
  renderGuideList(q.toLowerCase());
}

function renderGuideList(q = '') {
  const filtered = GUIDE_DATA.filter(e =>
    (state.guideFilter === 'all' || e.cat === state.guideFilter) &&
    (!q || e.name.toLowerCase().includes(q) || e.cat.includes(q))
  );

  document.getElementById('guide-list').innerHTML = filtered.length
    ? filtered.map(ex => `
      <div class="guide-ex ${state.guideSelected === ex.id ? 'active' : ''}" onclick="selectGuideEx('${ex.id}')">
        <div class="guide-img">${ex.icon}</div>
        <div style="flex:1;min-width:0;">
          <div style="font-weight:700;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${ex.name}</div>
          <div style="display:flex;gap:6px;margin-top:5px;">
            <span class="badge bdg-s" style="font-size:8px;">${ex.cat}</span>
            <span style="font-size:10px;color:var(--osd);text-transform:capitalize;">${ex.level.replace('sredni', 'Średni')}</span>
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
  const ex = GUIDE_DATA.find(e => e.id === id);
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
  const inPlanHTML = ['A', 'B', 'C']
    .filter(t => PLAN[t].exercises.some(e => e.n.toLowerCase().includes(ex.name.split(' ')[0].toLowerCase())))
    .map(t => `
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
        <span class="badge bdg-p" style="font-size:8px;">${PLAN[t].name}</span>
        <span style="font-size:10px;color:var(--osd);">${PLAN[t].subtitle}</span>
      </div>`).join('') || '<div style="font-size:11px;color:var(--osd);">Wariant stosowany w planie.</div>';

  document.getElementById('guide-detail').innerHTML = `
    <div class="fade-up" style="padding:28px;max-width:800px;">

      <!-- Hero -->
      <div style="background:linear-gradient(135deg,#0d1d3a,#091c3a);border:1px solid rgba(137,172,255,.1);border-radius:18px;padding:28px;margin-bottom:22px;display:flex;gap:20px;align-items:center;">
        <div style="font-size:60px;line-height:1;filter:drop-shadow(0 0 20px rgba(137,172,255,.3));">${ex.icon}</div>
        <div style="flex:1;">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
            <span class="material-symbols-outlined" style="color:var(--t);font-size:16px;">bolt</span>
            <span style="font-family:'Lexend';font-size:9px;font-weight:800;letter-spacing:2.5px;text-transform:uppercase;color:var(--t);">Technika Mistrzowska</span>
          </div>
          <div class="lex" style="font-size:30px;font-weight:900;line-height:1.15;margin-bottom:8px;
            background:var(--g1);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">${ex.name}</div>
          <p style="color:var(--osd);font-size:13px;line-height:1.65;">${ex.desc}</p>
        </div>
        <div style="text-align:center;flex-shrink:0;">
          <span class="badge bdg-s" style="font-size:10px;padding:5px 12px;">${ex.cat}</span>
          <div style="margin-top:14px;">
            <div style="font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:var(--osd);margin-bottom:7px;">Trudność</div>
            <div style="display:flex;gap:5px;">${diffDots}</div>
          </div>
        </div>
      </div>

      <!-- Treść: kroki + korzyści -->
      <div style="display:grid;grid-template-columns:1fr 250px;gap:20px;">

        <!-- Kroki -->
        <div>
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:18px;">
            <div style="width:3px;height:22px;background:var(--g1);border-radius:2px;box-shadow:0 0 10px rgba(137,172,255,.4);"></div>
            <div class="lex" style="font-weight:800;font-size:17px;">Jak Wykonać</div>
          </div>
          <div style="display:flex;flex-direction:column;gap:18px;">
            ${stepsHTML}
          </div>
        </div>

        <!-- Korzyści + W planie -->
        <div>
          <div class="lex" style="font-weight:800;font-size:16px;margin-bottom:14px;">Korzyści</div>
          <div style="background:linear-gradient(180deg,rgba(9,19,40,.9),rgba(6,14,32,.9));border:1px solid rgba(255,255,255,.05);border-radius:14px;padding:18px;margin-bottom:12px;">
            ${benefitsHTML}
          </div>
          <div style="background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.05);border-radius:14px;padding:14px;">
            <div style="font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:var(--osd);margin-bottom:8px;">W Planie Treningowym</div>
            ${inPlanHTML}
          </div>
        </div>

      </div>
    </div>`;
}
