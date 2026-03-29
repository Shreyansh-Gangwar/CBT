// ============================================================
// JEE CBT PORTAL — Main App
// ============================================================

import { TEST_REGISTRY } from './tests/index.js';

// ── STATE ────────────────────────────────────────────────────
const state = {
  theme: localStorage.getItem('theme') || 'dark',
  currentPage: 'home',
  activeTest: null,
  testMeta: null,
  answers: {},        // { questionId: 'A' | '3.5' | ['A','C'] }
  flagged: new Set(), // question ids marked for review
  visited: new Set(), // question ids visited
  currentSection: 0,
  currentQIndex: 0,
  timerSeconds: 0,
  timerInterval: null,
  testStarted: false,
  testSubmitted: false,
  filterType: 'ALL',
};

// ── INIT ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  applyTheme();
  renderApp();
  showHome();
});

// ── THEME ────────────────────────────────────────────────────
function applyTheme() {
  document.body.className = state.theme;
}
function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('theme', state.theme);
  applyTheme();
  updateThemeToggle();
}
function updateThemeToggle() {
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.innerHTML = state.theme === 'dark'
    ? `<span>☀️</span> Light Mode`
    : `<span>🌙</span> Dark Mode`;
}

// ── APP SHELL ────────────────────────────────────────────────
function renderApp() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <!-- HEADER -->
    <header class="app-header" id="app-header">
      <div class="header-logo">JEE CBT</div>
      <div class="header-title" id="header-title">NTA Mock Test Portal</div>
      <div class="header-spacer"></div>
      <button class="theme-toggle" id="theme-toggle" onclick="window._app.toggleTheme()">
        ${state.theme === 'dark' ? '<span>☀️</span> Light Mode' : '<span>🌙</span> Dark Mode'}
      </button>
    </header>

    <!-- HOME PAGE -->
    <div id="page-home">
      <div class="home-hero">
        <div class="hero-badge">🎯 NTA JEE Mock Portal</div>
        <h1 class="hero-title">Practice Like It's <span>Real</span></h1>
        <p class="hero-sub">Full JEE CBT experience — question palette, timer, detailed result analysis, and solutions.</p>
      </div>
      <div class="home-filters">
        <span class="filter-label">Filter:</span>
        <button class="filter-chip active" data-filter="ALL" onclick="window._app.setFilter('ALL')">All Tests</button>
        <button class="filter-chip" data-filter="FULL_PAPER" onclick="window._app.setFilter('FULL_PAPER')">Full Paper</button>
        <button class="filter-chip" data-filter="CHAPTERWISE" onclick="window._app.setFilter('CHAPTERWISE')">Chapterwise</button>
        <button class="filter-chip" data-filter="PYQ" onclick="window._app.setFilter('PYQ')">PYQ Sheets</button>
        <button class="filter-chip" data-filter="SECTIONAL" onclick="window._app.setFilter('SECTIONAL')">Sectional</button>
      </div>
      <div class="test-grid" id="test-grid"></div>
    </div>

    <!-- CBT PAGE -->
    <div id="page-cbt">
      <header class="cbt-header">
        <button class="btn btn-secondary btn-sm palette-toggle-btn" id="palette-toggle" onclick="window._app.togglePalette()">📋</button>
        <div class="cbt-test-title" id="cbt-test-title">—</div>
        <div class="cbt-timer" id="cbt-timer">00:00:00</div>
        <button class="btn btn-secondary btn-sm" onclick="window._app.toggleTheme()">
          ${state.theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </header>
      <div class="cbt-body">
        <div class="question-area">
          <div class="section-tabs" id="section-tabs"></div>
          <div class="question-scroll" id="question-scroll">
            <div id="question-content"></div>
          </div>
          <div style="padding:14px 24px; border-top:1px solid var(--border-primary); background:var(--bg-secondary); display:flex; gap:10px; flex-wrap:wrap; flex-shrink:0;">
            <button class="btn btn-secondary btn-sm" onclick="window._app.markForReview()">🔖 Mark for Review</button>
            <button class="btn btn-secondary btn-sm" onclick="window._app.clearResponse()">✕ Clear Response</button>
            <div style="flex:1"></div>
            <button class="btn btn-secondary btn-sm" onclick="window._app.prevQuestion()">← Prev</button>
            <button class="btn btn-primary btn-sm" onclick="window._app.saveAndNext()">Save & Next →</button>
          </div>
        </div>
        <div class="cbt-sidebar" id="cbt-sidebar">
          <div class="sidebar-candidate">
            <div class="candidate-avatar" id="sidebar-avatar">A</div>
            <div>
              <div class="candidate-name" id="sidebar-name">Candidate</div>
              <div class="candidate-sub" id="sidebar-roll">Roll No: —</div>
            </div>
          </div>
          <div class="sidebar-legend">
            <div class="legend-item"><div class="legend-dot ld-answered">✓</div> Answered</div>
            <div class="legend-item"><div class="legend-dot ld-not-answered">✗</div> Not Answered</div>
            <div class="legend-item"><div class="legend-dot ld-marked">?</div> Marked Review</div>
            <div class="legend-item"><div class="legend-dot ld-answered-marked">✓</div> Ans+Marked</div>
            <div class="legend-item"><div class="legend-dot ld-not-visited"> </div> Not Visited</div>
          </div>
          <div class="sidebar-palette" id="sidebar-palette"></div>
          <div class="sidebar-summary">
            <div class="summary-stat"><div class="summary-stat-val val-answered" id="sum-answered">0</div><div class="summary-stat-label">Answered</div></div>
            <div class="summary-stat"><div class="summary-stat-val val-not-answered" id="sum-not-answered">0</div><div class="summary-stat-label">Not Answered</div></div>
            <div class="summary-stat"><div class="summary-stat-val val-marked" id="sum-marked">0</div><div class="summary-stat-label">Marked</div></div>
          </div>
          <div class="sidebar-submit-area">
            <button class="btn btn-danger" style="width:100%;justify-content:center;" onclick="window._app.confirmSubmit()">Submit Test</button>
          </div>
        </div>
      </div>
    </div>

    <!-- RESULT PAGE -->
    <div id="page-result">
      <div class="result-container" id="result-container"></div>
    </div>

    <!-- SETUP MODAL -->
    <div id="setup-modal" class="modal-overlay hidden" onclick="window._app.closeSetupOnOverlay(event)">
      <div class="modal">
        <h2 class="modal-title">⚙️ Test Setup</h2>
        <p class="modal-sub" id="modal-test-name">Configure your test session</p>
        <div class="form-group">
          <label class="form-label">Your Name</label>
          <input class="form-input" id="setup-name" type="text" placeholder="Enter your name" value="Candidate" />
        </div>
        <div class="form-group">
          <label class="form-label">Timer Duration (minutes)</label>
          <input class="form-input" id="setup-timer" type="number" min="5" max="300" value="180" />
          <div class="timer-presets">
            <button class="preset-btn" onclick="window._app.setTimerPreset(60)">60 min</button>
            <button class="preset-btn" onclick="window._app.setTimerPreset(90)">90 min</button>
            <button class="preset-btn active" onclick="window._app.setTimerPreset(180)">3 hrs</button>
            <button class="preset-btn" onclick="window._app.setTimerPreset(0)">No Timer</button>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn btn-secondary" onclick="window._app.closeSetup()">Cancel</button>
          <button class="btn btn-primary btn-lg" onclick="window._app.startTest()">Start Test →</button>
        </div>
      </div>
    </div>

    <!-- SUBMIT CONFIRM MODAL -->
    <div id="submit-modal" class="modal-overlay hidden" onclick="window._app.closeSubmitOnOverlay(event)">
      <div class="modal">
        <h2 class="modal-title">⚠️ Submit Test?</h2>
        <p class="modal-sub">This action cannot be undone. Check your answers before submitting.</p>
        <div class="submit-summary-grid" id="submit-summary"></div>
        <p style="font-size:13px;color:var(--text-muted);margin-bottom:8px;">Are you sure you want to submit?</p>
        <div class="modal-actions">
          <button class="btn btn-secondary" onclick="window._app.closeSubmit()">Go Back</button>
          <button class="btn btn-danger" onclick="window._app.submitTest()">Yes, Submit</button>
        </div>
      </div>
    </div>
  `;

  renderTestGrid();
}

// ── HOME ─────────────────────────────────────────────────────
function showHome() {
  state.currentPage = 'home';
  document.getElementById('page-home').style.display = 'block';
  document.getElementById('page-cbt').classList.remove('active');
  document.getElementById('page-result').classList.remove('active');
  document.getElementById('app-header').style.display = 'flex';
  document.getElementById('header-title').textContent = 'NTA Mock Test Portal';
  renderTestGrid();
}

function setFilter(type) {
  state.filterType = type;
  document.querySelectorAll('.filter-chip').forEach(b => {
    b.classList.toggle('active', b.dataset.filter === type);
  });
  renderTestGrid();
}

function renderTestGrid() {
  const grid = document.getElementById('test-grid');
  if (!grid) return;
  const tests = TEST_REGISTRY.filter(t =>
    state.filterType === 'ALL' ||
    t.type === state.filterType ||
    (state.filterType === 'PYQ' && t.tags?.includes('PYQ'))
  );
  if (tests.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--text-muted)">
      <div style="font-size:40px;margin-bottom:12px">📭</div>
      <div style="font-size:16px;font-weight:600;margin-bottom:6px">No tests found</div>
      <div style="font-size:14px">Add test files to the tests/ folder and register them in tests/index.js</div>
    </div>`;
    return;
  }
  grid.innerHTML = tests.map((t, i) => `
    <div class="test-card fade-in" style="animation-delay:${i * 0.06}s" onclick="window._app.openSetup('${t.id}')">
      <div class="card-type-badge badge-${t.type.toLowerCase().replace('_', '-').replace('full-paper','full').replace('chapterwise','chapter')}">${t.type.replace('_', ' ')}</div>
      <div class="card-title">${t.title}</div>
      <div class="card-subjects">
        ${(t.subjects || []).map(s => `<span class="subject-pill" style="background:rgba(${subjectRGB(s)},0.15);color:${subjectColor(s)}">${s}</span>`).join('')}
      </div>
      <div class="card-tags">
        ${(t.tags || []).map(tag => `<span class="card-tag">${tag}</span>`).join('')}
        <span class="card-tag">${t.year || ''}</span>
        <span class="card-tag">${t.difficulty || ''}</span>
      </div>
      <div class="card-meta">
        <div class="meta-item"><span class="meta-label">Questions</span><span class="meta-value">${t.totalQuestions}</span></div>
        <div class="meta-item"><span class="meta-label">Total Marks</span><span class="meta-value">${t.totalMarks}</span></div>
        <div class="meta-item"><span class="meta-label">Duration</span><span class="meta-value">${t.recommendedTime} min</span></div>
        <div class="meta-item"><span class="meta-label">Subjects</span><span class="meta-value">${(t.subjects || []).length}</span></div>
      </div>
      <div class="card-footer"><button class="btn btn-primary" style="width:100%;justify-content:center;margin-top:14px">Start Test →</button></div>
    </div>
  `).join('');
}

function subjectColor(s) {
  return s === 'Physics' ? '#60a5fa' : s === 'Chemistry' ? '#34d399' : s === 'Mathematics' ? '#fbbf24' : '#a78bfa';
}
function subjectRGB(s) {
  return s === 'Physics' ? '59,130,246' : s === 'Chemistry' ? '16,185,129' : s === 'Mathematics' ? '245,158,11' : '139,92,246';
}

// ── SETUP MODAL ───────────────────────────────────────────────
async function openSetup(testId) {
  const testInfo = TEST_REGISTRY.find(t => t.id === testId);
  if (!testInfo) return;
  state.activeTest = testInfo;
  document.getElementById('modal-test-name').textContent = testInfo.title;
  document.getElementById('setup-timer').value = testInfo.recommendedTime || 180;
  document.getElementById('setup-modal').classList.remove('hidden');
}
function closeSetup() { document.getElementById('setup-modal').classList.add('hidden'); }
function closeSetupOnOverlay(e) { if (e.target === document.getElementById('setup-modal')) closeSetup(); }

function setTimerPreset(mins) {
  document.getElementById('setup-timer').value = mins;
  document.querySelectorAll('.preset-btn').forEach(b => {
    b.classList.toggle('active', parseInt(b.textContent) === mins || (mins === 0 && b.textContent.includes('No')));
  });
}

async function startTest() {
  const name = document.getElementById('setup-name').value.trim() || 'Candidate';
  const timerMins = parseInt(document.getElementById('setup-timer').value) || 0;
  closeSetup();

  // Load meta.json
  let meta;
  try {
    const res = await fetch(state.activeTest.path);
    meta = await res.json();
  } catch (e) {
    alert('Could not load test file. Check that meta.json exists at: ' + state.activeTest.path);
    return;
  }

  // Reset state
  state.testMeta = meta;
  state.answers = {};
  state.flagged = new Set();
  state.visited = new Set();
  state.currentSection = 0;
  state.currentQIndex = 0;
  state.timerSeconds = timerMins * 60;
  state.testSubmitted = false;
  state.candidateName = name;

  // Update sidebar candidate
  document.getElementById('sidebar-name').textContent = name;
  document.getElementById('sidebar-avatar').textContent = name.charAt(0).toUpperCase();
  document.getElementById('sidebar-roll').textContent = `Roll No: ${Math.floor(Math.random() * 90000000 + 10000000)}`;
  document.getElementById('cbt-test-title').textContent = meta.title;

  showCBT();
  buildSectionTabs();
  buildPalette();
  renderQuestion();
  if (timerMins > 0) startTimer();
}

// ── CBT PAGE ──────────────────────────────────────────────────
function showCBT() {
  document.getElementById('page-home').style.display = 'none';
  document.getElementById('page-cbt').classList.add('active');
  document.getElementById('page-result').classList.remove('active');
  document.getElementById('app-header').style.display = 'none';
}

function buildSectionTabs() {
  const tabs = document.getElementById('section-tabs');
  tabs.innerHTML = state.testMeta.sections.map((sec, i) => `
    <div class="section-tab ${i === 0 ? 'active' : ''}" id="tab-${i}"
         onclick="window._app.switchSection(${i})"
         style="${i === state.currentSection ? `border-bottom-color:${sec.color}` : ''}">
      <span style="width:8px;height:8px;border-radius:50%;background:${sec.color};display:inline-block"></span>
      ${sec.label}
    </div>
  `).join('');
}

function switchSection(idx) {
  state.currentSection = idx;
  state.currentQIndex = 0;
  document.querySelectorAll('.section-tab').forEach((t, i) => {
    t.classList.toggle('active', i === idx);
    t.style.borderBottomColor = i === idx ? state.testMeta.sections[i].color : 'transparent';
  });
  buildPalette();
  renderQuestion();
}

function getCurrentQuestion() {
  const sec = state.testMeta.sections[state.currentSection];
  return sec?.questions?.[state.currentQIndex] || null;
}

function renderQuestion() {
  const q = getCurrentQuestion();
  if (!q) return;
  state.visited.add(q.id);

  const content = document.getElementById('question-content');
  const secColor = state.testMeta.sections[state.currentSection].color;
  const totalInSection = state.testMeta.sections[state.currentSection].questions.length;
  const globalNum = getGlobalQuestionNumber();

  content.innerHTML = `
    <div style="margin-bottom:16px;display:flex;align-items:center;justify-content:space-between">
      <div style="display:flex;align-items:center;gap:12px">
        <span style="font-family:var(--font-display);font-size:22px;font-weight:700;color:${secColor}">Q.${q.number ?? (state.currentQIndex + 1)}</span>
        <span class="q-type-badge badge-${q.type.toLowerCase()}">${q.type}</span>
        <span style="font-size:12px;color:var(--text-muted)">+${q.marks} / ${q.negativeMark}</span>
      </div>
      <span style="font-size:13px;color:var(--text-muted)">${state.currentQIndex + 1} / ${totalInSection}</span>
    </div>

    ${q.image
      ? `<div class="question-image-container">
          <img src="${q.image}" alt="Question ${q.number}" class="question-image"
               onerror="this.parentElement.innerHTML='<div class=\\'question-image-placeholder\\'>⚠️ Image not found<br><small>${q.image}</small></div>'" />
        </div>`
      : `<div class="question-image-container"><div class="question-image-placeholder">📝 No image for this question</div></div>`
    }

    ${q.type === 'MCQ' ? renderMCQOptions(q) : ''}
    ${q.type === 'MSQ' || q.type === 'MCQ_MULTI' ? renderMSQOptions(q) : ''}
    ${q.type === 'NUMERICAL' ? renderNumericalInput(q) : ''}

    ${q.type === 'MSQ' || q.type === 'MCQ_MULTI'
      ? `<p style="font-size:12px;color:var(--color-marked-review);margin-top:8px">⚡ One or more options may be correct. Partial marking applies.</p>`
      : ''}
  `;

  updatePaletteHighlight();
  updateSummaryBar();
}

function renderMCQOptions(q) {
  const selected = state.answers[q.id];
  return `<div class="options-grid">
    ${(q.options || ['A','B','C','D']).map(opt => `
      <div class="option-row ${selected === opt ? 'selected' : ''}"
           onclick="window._app.selectMCQ('${q.id}', '${opt}')">
        <div class="option-key">${opt}</div>
        ${q[`option${opt}Image`]
          ? `<img src="${q['option'+opt+'Image']}" class="option-image" onerror="this.style.display='none'" />`
          : `<span class="option-text">${q[`option${opt}Text`] || `Option ${opt}`}</span>`
        }
      </div>
    `).join('')}
  </div>`;
}

function renderMSQOptions(q) {
  const selected = state.answers[q.id] || [];
  return `<div class="options-grid">
    ${(q.options || ['A','B','C','D']).map(opt => `
      <div class="option-row ${selected.includes(opt) ? 'selected' : ''}"
           onclick="window._app.selectMSQ('${q.id}', '${opt}')">
        <div class="option-key">${opt}</div>
        ${q[`option${opt}Image`]
          ? `<img src="${q['option'+opt+'Image']}" class="option-image" onerror="this.style.display='none'" />`
          : `<span class="option-text">${q[`option${opt}Text`] || `Option ${opt}`}</span>`
        }
      </div>
    `).join('')}
  </div>`;
}

function renderNumericalInput(q) {
  const val = state.answers[q.id] ?? '';
  return `
    <div class="numerical-input-group">
      <div class="numerical-input-label">Enter your answer (integer or decimal):</div>
      <input type="number" class="numerical-input" id="numerical-input"
             value="${val}" placeholder="e.g. 42"
             oninput="window._app.inputNumerical('${q.id}', this.value)"
             step="any" />
    </div>
  `;
}

function selectMCQ(qId, opt) {
  state.answers[qId] = opt;
  renderQuestion();
  updatePalette();
}

function selectMSQ(qId, opt) {
  const current = state.answers[qId] || [];
  if (current.includes(opt)) {
    state.answers[qId] = current.filter(o => o !== opt);
    if (state.answers[qId].length === 0) delete state.answers[qId];
  } else {
    state.answers[qId] = [...current, opt];
  }
  renderQuestion();
  updatePalette();
}

function inputNumerical(qId, val) {
  if (val === '' || val === null) delete state.answers[qId];
  else state.answers[qId] = val;
  updatePalette();
}

function saveAndNext() {
  const q = getCurrentQuestion();
  if (q?.type === 'NUMERICAL') {
    const inp = document.getElementById('numerical-input');
    if (inp && inp.value !== '') state.answers[q.id] = inp.value;
  }
  const section = state.testMeta.sections[state.currentSection];
  if (state.currentQIndex < section.questions.length - 1) {
    state.currentQIndex++;
  } else if (state.currentSection < state.testMeta.sections.length - 1) {
    switchSection(state.currentSection + 1);
    return;
  }
  renderQuestion();
  updatePalette();
}

function prevQuestion() {
  if (state.currentQIndex > 0) {
    state.currentQIndex--;
  } else if (state.currentSection > 0) {
    const prevSec = state.testMeta.sections[state.currentSection - 1];
    state.currentSection--;
    state.currentQIndex = prevSec.questions.length - 1;
    buildSectionTabs();
    buildPalette();
  }
  renderQuestion();
}

function markForReview() {
  const q = getCurrentQuestion();
  if (!q) return;
  if (state.flagged.has(q.id)) state.flagged.delete(q.id);
  else state.flagged.add(q.id);
  updatePalette();
  updateSummaryBar();
}

function clearResponse() {
  const q = getCurrentQuestion();
  if (!q) return;
  delete state.answers[q.id];
  renderQuestion();
  updatePalette();
}

function getGlobalQuestionNumber() {
  let count = 0;
  for (let s = 0; s < state.currentSection; s++) count += state.testMeta.sections[s].questions.length;
  return count + state.currentQIndex + 1;
}

// ── PALETTE ───────────────────────────────────────────────────
function buildPalette() {
  const palette = document.getElementById('sidebar-palette');
  palette.innerHTML = state.testMeta.sections.map((sec, si) => `
    <div class="palette-section-label" style="color:${sec.color}">${sec.label}</div>
    <div class="palette-grid">
      ${sec.questions.map((q, qi) => `
        <button class="palette-btn ${getPaletteClass(q, si, qi)}" id="pb-${q.id}"
                onclick="window._app.jumpTo(${si}, ${qi})">
          ${q.number ?? (qi + 1)}
        </button>
      `).join('')}
    </div>
  `).join('');
}

function getPaletteClass(q, si, qi) {
  const answered = state.answers[q.id] !== undefined &&
    (Array.isArray(state.answers[q.id]) ? state.answers[q.id].length > 0 : state.answers[q.id] !== '');
  const flagged = state.flagged.has(q.id);
  const visited = state.visited.has(q.id);
  const isCurrent = si === state.currentSection && qi === state.currentQIndex;

  let cls = '';
  if (answered && flagged) cls = 'answered-marked';
  else if (answered) cls = 'answered';
  else if (flagged) cls = 'marked';
  else if (visited) cls = 'not-answered';
  if (isCurrent) cls += ' current';
  return cls;
}

function updatePalette() {
  state.testMeta.sections.forEach((sec, si) => {
    sec.questions.forEach((q, qi) => {
      const btn = document.getElementById(`pb-${q.id}`);
      if (btn) btn.className = `palette-btn ${getPaletteClass(q, si, qi)}`;
    });
  });
  updateSummaryBar();
}

function updatePaletteHighlight() {
  updatePalette();
}

function jumpTo(si, qi) {
  state.currentSection = si;
  state.currentQIndex = qi;
  document.querySelectorAll('.section-tab').forEach((t, i) => {
    t.classList.toggle('active', i === si);
    t.style.borderBottomColor = i === si ? state.testMeta.sections[i].color : 'transparent';
  });
  renderQuestion();
}

function updateSummaryBar() {
  let answered = 0, marked = 0, notAnswered = 0;
  state.testMeta.sections.forEach(sec => {
    sec.questions.forEach(q => {
      const a = state.answers[q.id];
      const ans = a !== undefined && (Array.isArray(a) ? a.length > 0 : a !== '');
      if (ans) answered++;
      if (state.flagged.has(q.id)) marked++;
    });
  });
  const total = state.testMeta.sections.reduce((s, sec) => s + sec.questions.length, 0);
  notAnswered = total - answered;
  document.getElementById('sum-answered').textContent = answered;
  document.getElementById('sum-not-answered').textContent = notAnswered;
  document.getElementById('sum-marked').textContent = marked;
}

function togglePalette() {
  document.getElementById('cbt-sidebar').classList.toggle('open');
}

// ── TIMER ─────────────────────────────────────────────────────
function startTimer() {
  if (state.timerInterval) clearInterval(state.timerInterval);
  state.timerInterval = setInterval(() => {
    if (state.timerSeconds <= 0) { clearInterval(state.timerInterval); autoSubmit(); return; }
    state.timerSeconds--;
    updateTimerDisplay();
  }, 1000);
  updateTimerDisplay();
}

function updateTimerDisplay() {
  const el = document.getElementById('cbt-timer');
  if (!el) return;
  const h = Math.floor(state.timerSeconds / 3600);
  const m = Math.floor((state.timerSeconds % 3600) / 60);
  const s = state.timerSeconds % 60;
  el.textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;
  el.className = 'cbt-timer' + (state.timerSeconds < 300 ? ' danger' : state.timerSeconds < 600 ? ' warning' : '');
}

function pad(n) { return String(n).padStart(2, '0'); }
function autoSubmit() { submitTest(); }

// ── SUBMIT ────────────────────────────────────────────────────
function confirmSubmit() {
  let answered = 0, notAnswered = 0, marked = 0;
  const total = state.testMeta.sections.reduce((s, sec) => s + sec.questions.length, 0);
  state.testMeta.sections.forEach(sec => {
    sec.questions.forEach(q => {
      const a = state.answers[q.id];
      if (a !== undefined && (Array.isArray(a) ? a.length > 0 : a !== '')) answered++;
      if (state.flagged.has(q.id)) marked++;
    });
  });
  notAnswered = total - answered;
  document.getElementById('submit-summary').innerHTML = `
    <div class="submit-stat"><div class="submit-stat-val val-answered">${answered}</div><div class="submit-stat-label">Answered</div></div>
    <div class="submit-stat"><div class="submit-stat-val val-not-answered">${notAnswered}</div><div class="submit-stat-label">Not Answered</div></div>
    <div class="submit-stat"><div class="submit-stat-val val-marked">${marked}</div><div class="submit-stat-label">Marked</div></div>
  `;
  document.getElementById('submit-modal').classList.remove('hidden');
}
function closeSubmit() { document.getElementById('submit-modal').classList.add('hidden'); }
function closeSubmitOnOverlay(e) { if (e.target === document.getElementById('submit-modal')) closeSubmit(); }

function submitTest() {
  clearInterval(state.timerInterval);
  closeSubmit();
  state.testSubmitted = true;
  showResult();
}

// ── RESULT ────────────────────────────────────────────────────
function showResult() {
  document.getElementById('page-cbt').classList.remove('active');
  document.getElementById('page-result').classList.add('active');
  document.getElementById('app-header').style.display = 'flex';
  document.getElementById('header-title').textContent = 'Test Result';

  const { totalMarks, correctCount, wrongCount, skippedCount, scored, sectionResults } = calculateResult();
  const pct = Math.round((scored / state.activeTest.totalMarks) * 100);
  const accuracy = correctCount + wrongCount > 0 ? Math.round((correctCount / (correctCount + wrongCount)) * 100) : 0;

  const container = document.getElementById('result-container');
  container.innerHTML = `
    <!-- Hero -->
    <div class="result-hero fade-in">
      <div class="result-score-ring" style="--score-pct:${pct * 3.6}deg">
        <div class="result-score-inner">
          <div class="result-score-val">${scored}</div>
          <div class="result-score-total">/ ${state.activeTest.totalMarks}</div>
        </div>
      </div>
      <h2 class="result-title">${getResultTitle(pct)}</h2>
      <p class="result-percentile">Score: <strong>${scored}</strong> | Accuracy: <strong>${accuracy}%</strong> | ${pct}% of total marks</p>
      <div class="result-stats-grid">
        <div class="result-stat-card">
          <div class="result-stat-val" style="color:var(--color-correct)">${correctCount}</div>
          <div class="result-stat-label">Correct</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-val" style="color:var(--color-wrong)">${wrongCount}</div>
          <div class="result-stat-label">Wrong</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-val" style="color:var(--text-muted)">${skippedCount}</div>
          <div class="result-stat-label">Skipped</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-val" style="color:var(--color-wrong)">${Math.abs(scored - correctCount * 4)}</div>
          <div class="result-stat-label">Marks Lost</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-val">${accuracy}%</div>
          <div class="result-stat-label">Accuracy</div>
        </div>
        <div class="result-stat-card">
          <div class="result-stat-val">${pct}%</div>
          <div class="result-stat-label">Score %</div>
        </div>
      </div>
    </div>

    <!-- Subject Breakdown -->
    <div class="result-section fade-in fade-in-1">
      <h3 class="result-section-title">📊 Subject-wise Analysis</h3>
      <div class="subject-breakdown">
        ${sectionResults.map(sr => `
          <div class="subject-card">
            <div class="subject-card-title" style="color:${sr.color}">${sr.label}</div>
            <div class="subject-bar"><div class="subject-bar-fill" style="width:${sr.pct}%;background:${sr.color}"></div></div>
            <div class="subject-stats">
              <div class="subj-stat">Score: <span style="color:${sr.color}">${sr.scored}</span>/${sr.maxMarks}</div>
              <div class="subj-stat">Accuracy: <span>${sr.accuracy}%</span></div>
              <div class="subj-stat" style="color:var(--color-correct)">✓ Correct: <span>${sr.correct}</span></div>
              <div class="subj-stat" style="color:var(--color-wrong)">✗ Wrong: <span>${sr.wrong}</span></div>
              <div class="subj-stat" style="color:var(--text-muted)">– Skipped: <span>${sr.skipped}</span></div>
              <div class="subj-stat" style="color:var(--text-muted)">Total: <span>${sr.total}</span></div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Solutions -->
    <div class="result-section fade-in fade-in-2">
      <h3 class="result-section-title">📝 Question-wise Solutions</h3>
      <div style="margin-bottom:16px;display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn btn-secondary btn-sm" onclick="window._app.expandAllSolutions()">Expand All</button>
        <button class="btn btn-secondary btn-sm" onclick="window._app.collapseAllSolutions()">Collapse All</button>
      </div>
      <div class="solutions-list">
        ${buildSolutionsList()}
      </div>
    </div>

    <!-- Actions -->
    <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:8px">
      <button class="btn btn-primary btn-lg" onclick="window._app.showHome()">← Back to Tests</button>
      <button class="btn btn-secondary btn-lg" onclick="window.print()">🖨️ Print Result</button>
    </div>
  `;

  // Animate bars
  setTimeout(() => {
    document.querySelectorAll('.subject-bar-fill').forEach(b => b.style.width = b.style.width);
  }, 100);
}

function calculateResult() {
  let correctCount = 0, wrongCount = 0, skippedCount = 0, scored = 0;
  const sectionResults = state.testMeta.sections.map(sec => {
    let sc = 0, wc = 0, sk = 0, secScored = 0, maxMarks = 0;
    sec.questions.forEach(q => {
      maxMarks += q.marks;
      const ua = state.answers[q.id];
      const answered = ua !== undefined && (Array.isArray(ua) ? ua.length > 0 : ua !== '');
      if (!answered) { sk++; skippedCount++; return; }

      if (q.type === 'MCQ') {
        if (ua === q.correct) { sc++; correctCount++; secScored += q.marks; scored += q.marks; }
        else { wc++; wrongCount++; secScored += q.negativeMark; scored += q.negativeMark; }
      } else if (q.type === 'NUMERICAL') {
        const correct = parseFloat(q.correct);
        const given = parseFloat(ua);
        if (!isNaN(correct) && !isNaN(given) && Math.abs(given - correct) < 0.01) {
          sc++; correctCount++; secScored += q.marks; scored += q.marks;
        } else { wc++; wrongCount++; secScored += q.negativeMark; scored += q.negativeMark; }
      } else if (q.type === 'MSQ' || q.type === 'MCQ_MULTI') {
        const correctSet = new Set(Array.isArray(q.correct) ? q.correct : [q.correct]);
        const givenSet = new Set(ua || []);
        const isFullCorrect = [...correctSet].every(c => givenSet.has(c)) && givenSet.size === correctSet.size;
        const hasPartial = [...givenSet].some(c => correctSet.has(c));
        const hasWrong = [...givenSet].some(c => !correctSet.has(c));
        if (isFullCorrect) { sc++; correctCount++; secScored += q.marks; scored += q.marks; }
        else if (hasPartial && !hasWrong) {
          const partial = Math.round((givenSet.size / correctSet.size) * q.marks * 10) / 10;
          secScored += partial; scored += partial; sc++;
        } else { wc++; wrongCount++; }
      }
    });
    const accuracy = sc + wc > 0 ? Math.round((sc / (sc + wc)) * 100) : 0;
    const pct = maxMarks > 0 ? Math.round((secScored / maxMarks) * 100) : 0;
    return { label: sec.label, color: sec.color, correct: sc, wrong: wc, skipped: sk, scored: Math.max(0, secScored), maxMarks, accuracy, pct, total: sec.questions.length };
  });
  return { totalMarks: state.activeTest.totalMarks, correctCount, wrongCount, skippedCount, scored: Math.max(0, scored), sectionResults };
}

function getResultTitle(pct) {
  if (pct >= 90) return '🏆 Outstanding Performance!';
  if (pct >= 75) return '🎯 Excellent Work!';
  if (pct >= 60) return '👍 Good Performance';
  if (pct >= 45) return '📚 Keep Practicing';
  return '💪 Room for Improvement';
}

function buildSolutionsList() {
  return state.testMeta.sections.map(sec =>
    sec.questions.map(q => {
      const ua = state.answers[q.id];
      const answered = ua !== undefined && (Array.isArray(ua) ? ua.length > 0 : ua !== '');
      let status = 'skipped', marksGained = 0;
      if (answered) {
        let isCorrect = false;
        if (q.type === 'MCQ') isCorrect = ua === q.correct;
        else if (q.type === 'NUMERICAL') isCorrect = Math.abs(parseFloat(ua) - parseFloat(q.correct)) < 0.01;
        else if (q.type === 'MSQ' || q.type === 'MCQ_MULTI') {
          const cs = new Set(Array.isArray(q.correct) ? q.correct : [q.correct]);
          const gs = new Set(ua);
          isCorrect = [...cs].every(c => gs.has(c)) && gs.size === cs.size;
        }
        if (isCorrect) { status = 'correct'; marksGained = q.marks; }
        else { status = 'wrong'; marksGained = q.negativeMark; }
      }
      return `
        <div class="solution-item">
          <div class="solution-header" onclick="window._app.toggleSolution('sol-${q.id}')">
            <span class="sol-q-num">${sec.label} Q.${q.number ?? (sec.questions.indexOf(q)+1)}</span>
            <span class="sol-status-badge sol-${status}">${status.toUpperCase()}</span>
            <span class="sol-marks ${marksGained > 0 ? 'positive' : marksGained < 0 ? 'negative' : 'zero'}" style="margin-left:auto">
              ${marksGained > 0 ? '+' : ''}${marksGained}
            </span>
            <span class="sol-expand">▼</span>
          </div>
          <div class="solution-body" id="sol-${q.id}">
            ${q.image ? `<img src="${q.image}" class="sol-image" onerror="this.style.display='none'" style="margin-bottom:12px" />` : ''}
            <div class="sol-your-answer">Your Answer: <span class="sol-answer-val">${answered ? (Array.isArray(ua) ? ua.join(', ') : ua) : '—'}</span></div>
            <div class="sol-correct-answer">Correct Answer: <span class="sol-answer-val" style="color:var(--color-correct)">${Array.isArray(q.correct) ? q.correct.join(', ') : q.correct}</span></div>
            ${q.solutionText ? `<div class="sol-text">${q.solutionText}</div>` : ''}
            ${q.solution ? `<img src="${q.solution}" class="sol-image" onerror="this.style.display='none'" />` : ''}
          </div>
        </div>
      `;
    }).join('')
  ).join('');
}

function toggleSolution(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.toggle('open');
  const header = el.previousElementSibling;
  const arrow = header?.querySelector('.sol-expand');
  if (arrow) arrow.textContent = el.classList.contains('open') ? '▲' : '▼';
}

function expandAllSolutions() {
  document.querySelectorAll('.solution-body').forEach(el => {
    el.classList.add('open');
    const arrow = el.previousElementSibling?.querySelector('.sol-expand');
    if (arrow) arrow.textContent = '▲';
  });
}
function collapseAllSolutions() {
  document.querySelectorAll('.solution-body').forEach(el => {
    el.classList.remove('open');
    const arrow = el.previousElementSibling?.querySelector('.sol-expand');
    if (arrow) arrow.textContent = '▼';
  });
}

// ── EXPOSE API ────────────────────────────────────────────────
window._app = {
  toggleTheme, setFilter, openSetup, closeSetup, closeSetupOnOverlay,
  setTimerPreset, startTest, switchSection, saveAndNext, prevQuestion,
  selectMCQ, selectMSQ, inputNumerical, markForReview, clearResponse,
  jumpTo, togglePalette, confirmSubmit, closeSubmit, closeSubmitOnOverlay,
  submitTest, showHome, toggleSolution, expandAllSolutions, collapseAllSolutions,
};
