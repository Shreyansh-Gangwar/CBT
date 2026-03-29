'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { tests, getTestsBySubject } from '../data/questions';

// ── Palette state constants ───────────────────────────────────
const S = { NOT_VISITED: 0, NOT_ANSWERED: 1, ANSWERED: 2, MARKED: 3, MARKED_ANSWERED: 4 };

// ── Math renderer (KaTeX-like inline renderer using CSS) ──────
function QText({ text }) {
  if (!text) return null;
  // Simple: render as pre-formatted text preserving math symbols
  return (
    <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, fontSize: '1rem' }}>
      {text.split('\n').map((line, i) => <p key={i} style={{ margin: '4px 0' }}>{line}</p>)}
    </div>
  );
}

// ── Storage helpers ───────────────────────────────────────────
function saveResult(testId, result) {
  try { localStorage.setItem(`jee_result_${testId}`, JSON.stringify(result)); } catch {}
}
function loadResult(testId) {
  try { const r = localStorage.getItem(`jee_result_${testId}`); return r ? JSON.parse(r) : null; } catch { return null; }
}

// ── Global CSS ────────────────────────────────────────────────
const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0f1117; --bg2: #161b27; --bg3: #1e2535; --bg4: #252d40;
    --border: #2a3350; --border2: #3a4560;
    --text: #e2e8f0; --text2: #94a3b8; --text3: #64748b;
    --accent: #3b82f6; --accent2: #60a5fa;
    --green: #22c55e; --red: #ef4444; --purple: #a855f7; --orange: #f59e0b;
    --grey: #475569;
    --phys: #06b6d4; --chem: #10b981; --math: #f59e0b;
    --radius: 10px; --radius2: 6px;
    --shadow: 0 4px 24px rgba(0,0,0,0.4);
  }
  .light {
    --bg: #f8fafc; --bg2: #f1f5f9; --bg3: #e2e8f0; --bg4: #cbd5e1;
    --border: #e2e8f0; --border2: #cbd5e1;
    --text: #0f172a; --text2: #475569; --text3: #94a3b8;
    --shadow: 0 4px 24px rgba(0,0,0,0.1);
  }
  body { font-family: 'Space Grotesk', sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; }
  button { font-family: inherit; cursor: pointer; border: none; outline: none; transition: all 0.15s; }
  button:active { transform: scale(0.97); }
  input { font-family: 'JetBrains Mono', monospace; }
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg2); }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 3px; }
  .pulse-red { animation: pulseRed 1.2s ease-in-out infinite; }
  @keyframes pulseRed { 0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,0.4)} 50%{box-shadow:0 0 0 8px rgba(239,68,68,0)} }
  .fade-in { animation: fadeIn 0.3s ease; }
  @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  .slide-up { animation: slideUp 0.4s cubic-bezier(0.16,1,0.3,1); }
  @keyframes slideUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
`;

// ── Palette bubble colors ─────────────────────────────────────
function bubbleStyle(state, selected) {
  const base = {
    width: 34, height: 34, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', border: '2px solid transparent',
    transition: 'all 0.15s', position: 'relative', flexShrink: 0
  };
  if (selected) base.outline = '3px solid var(--accent2)';
  switch (state) {
    case S.NOT_VISITED: return { ...base, background: 'var(--grey)', color: '#fff' };
    case S.NOT_ANSWERED: return { ...base, background: 'var(--red)', color: '#fff' };
    case S.ANSWERED: return { ...base, background: 'var(--green)', color: '#fff' };
    case S.MARKED: return { ...base, background: 'var(--purple)', color: '#fff' };
    case S.MARKED_ANSWERED: return { ...base, background: 'var(--purple)', color: '#fff', border: '2px solid var(--green)' };
    default: return base;
  }
}

// ── Format time ───────────────────────────────────────────────
function fmtTime(s) {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

// ═══════════════════════════════════════════════════════════════
//  SCREEN: HOME / TEST SELECTION
// ═══════════════════════════════════════════════════════════════
function HomeScreen({ dark, setDark, onSelect }) {
  const grouped = getTestsBySubject();
  const subjectColors = { Physics: '--phys', Chemistry: '--chem', Mathematics: '--math' };
  const subjectIcons = { Physics: '⚡', Chemistry: '⚗️', Mathematics: '∑' };

  return (
    <div style={{ minHeight: '100vh', padding: '0 0 60px' }}>
      {/* Header */}
      <div style={{
        background: 'var(--bg2)', borderBottom: '1px solid var(--border)',
        padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 64, position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(12px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, var(--accent), var(--purple))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.1rem', fontWeight: 800
          }}>J</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.02em' }}>JEE CBT Platform</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text3)', marginTop: 1 }}>Lakshya JEE 2026</div>
          </div>
        </div>
        <button onClick={() => setDark(!dark)} style={{
          background: 'var(--bg3)', border: '1px solid var(--border)',
          borderRadius: 8, padding: '8px 14px', color: 'var(--text2)', fontSize: '0.85rem'
        }}>{dark ? '☀️ Light' : '🌙 Dark'}</button>
      </div>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, var(--bg2) 0%, var(--bg3) 100%)',
        borderBottom: '1px solid var(--border)', padding: '48px 32px 40px', textAlign: 'center'
      }}>
        <div style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1 }}>
          Select Your Test
        </div>
        <div style={{ color: 'var(--text2)', marginTop: 12, fontSize: '1rem' }}>
          JEE Main Practice Tests — Full Computer Based Test Experience
        </div>
        <div style={{
          display: 'flex', gap: 24, justifyContent: 'center', marginTop: 24,
          flexWrap: 'wrap'
        }}>
          {[
            { label: `${tests.length} Test${tests.length !== 1 ? 's' : ''}`, icon: '📋' },
            { label: '75 Questions each', icon: '❓' },
            { label: '+4 / −1 Marking', icon: '📊' },
            { label: '180 Min Duration', icon: '⏱️' },
          ].map(item => (
            <div key={item.label} style={{
              background: 'var(--bg)', border: '1px solid var(--border)',
              borderRadius: 8, padding: '8px 16px', fontSize: '0.85rem',
              color: 'var(--text2)', display: 'flex', gap: 6, alignItems: 'center'
            }}>
              <span>{item.icon}</span> {item.label}
            </div>
          ))}
        </div>
      </div>

      {/* Test cards grouped by subject */}
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 24px' }}>
        {Object.entries(grouped).map(([subject, subjectTests]) => (
          <div key={subject} style={{ marginBottom: 48 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: `var(${subjectColors[subject] || '--accent'})22`,
                border: `1px solid var(${subjectColors[subject] || '--accent'})44`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.2rem'
              }}>{subjectIcons[subject] || '📚'}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{subject}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>
                  {subjectTests.length} test{subjectTests.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {subjectTests.map(test => {
                const result = loadResult(test.id);
                return (
                  <TestCard key={test.id} test={test} result={result}
                    color={subjectColors[subject] || '--accent'} onSelect={onSelect} />
                );
              })}
            </div>
          </div>
        ))}

        {/* Add more tests info */}
        <div style={{
          border: '2px dashed var(--border2)', borderRadius: 12, padding: 24,
          textAlign: 'center', color: 'var(--text3)'
        }}>
          <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>➕</div>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Add More Tests</div>
          <div style={{ fontSize: '0.85rem', lineHeight: 1.6 }}>
            Share new PDFs and receive an updated <code style={{ background: 'var(--bg3)', padding: '2px 6px', borderRadius: 4, fontSize: '0.8rem' }}>src/data/questions.js</code> file to drop into this project.
          </div>
        </div>
      </div>
    </div>
  );
}

function TestCard({ test, result, color, onSelect }) {
  const sections = ['Physics', 'Chemistry', 'Mathematics'];
  return (
    <div className="fade-in" style={{
      background: 'var(--bg2)', border: '1px solid var(--border)',
      borderRadius: 14, padding: 20, cursor: 'pointer',
      transition: 'all 0.2s', position: 'relative', overflow: 'hidden'
    }}
      onClick={() => onSelect(test)}
      onMouseEnter={e => { e.currentTarget.style.borderColor = `var(${color})`; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      {/* Color accent */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `var(${color})`, borderRadius: '14px 14px 0 0' }} />

      <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 6 }}>{test.name}</div>
      <div style={{ fontSize: '0.78rem', color: 'var(--text3)', marginBottom: 12, lineHeight: 1.5 }}>
        {test.chapter}
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
        {sections.map(s => (
          <span key={s} style={{
            fontSize: '0.68rem', padding: '2px 8px', borderRadius: 20,
            background: s === 'Physics' ? '#06b6d422' : s === 'Chemistry' ? '#10b98122' : '#f59e0b22',
            color: s === 'Physics' ? 'var(--phys)' : s === 'Chemistry' ? 'var(--chem)' : 'var(--math)',
            border: `1px solid ${s === 'Physics' ? '#06b6d444' : s === 'Chemistry' ? '#10b98144' : '#f59e0b44'}`
          }}>{s}</span>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>
          {test.totalQuestions}Q · {Math.round(test.duration / 60)} min · {test.maxMarks} marks
        </div>
        {result ? (
          <div style={{
            fontSize: '0.75rem', fontWeight: 700,
            color: result.score >= 0 ? 'var(--green)' : 'var(--red)',
            background: result.score >= 0 ? '#22c55e22' : '#ef444422',
            padding: '3px 8px', borderRadius: 6
          }}>
            {result.score}/{test.maxMarks}
          </div>
        ) : (
          <div style={{
            fontSize: '0.75rem', color: 'var(--text3)',
            background: 'var(--bg3)', padding: '3px 8px', borderRadius: 6
          }}>Not attempted</div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  SCREEN: INSTRUCTIONS
// ═══════════════════════════════════════════════════════════════
function InstructionsScreen({ test, dark, setDark, onStart, onBack }) {
  const [duration, setDuration] = useState(Math.round(test.duration / 60));

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{
        background: 'var(--bg2)', borderBottom: '1px solid var(--border)',
        padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 60, flexShrink: 0
      }}>
        <button onClick={onBack} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, padding: '7px 14px', color: 'var(--text2)', fontSize: '0.85rem' }}>
          ← Back
        </button>
        <div style={{ fontWeight: 700 }}>{test.name}</div>
        <button onClick={() => setDark(!dark)} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, padding: '7px 14px', color: 'var(--text2)', fontSize: '0.85rem' }}>
          {dark ? '☀️' : '🌙'}
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '32px 24px', maxWidth: 800, margin: '0 auto', width: '100%' }}>
        <div className="slide-up">
          <h1 style={{ fontWeight: 800, fontSize: '1.8rem', letterSpacing: '-0.03em', marginBottom: 6 }}>
            General Instructions
          </h1>
          <div style={{ color: 'var(--text3)', marginBottom: 32 }}>Please read carefully before starting the test</div>

          {/* Timer setting */}
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--accent)44', borderRadius: 12, padding: 20, marginBottom: 24 }}>
            <div style={{ fontWeight: 600, marginBottom: 12, color: 'var(--accent2)' }}>⏱️ Set Test Duration</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <input
                type="number" value={duration} min={10} max={300}
                onChange={e => setDuration(Number(e.target.value))}
                style={{
                  background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 8,
                  padding: '10px 16px', color: 'var(--text)', fontSize: '1.2rem',
                  width: 100, textAlign: 'center'
                }}
              />
              <span style={{ color: 'var(--text2)' }}>minutes</span>
              <span style={{ color: 'var(--text3)', fontSize: '0.85rem' }}>
                (Default: {Math.round(test.duration / 60)} min)
              </span>
            </div>
          </div>

          {/* Marking scheme */}
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, marginBottom: 24 }}>
            <div style={{ fontWeight: 600, marginBottom: 16 }}>📊 Marking Scheme</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              {[
                { label: 'Correct', value: '+4', bg: '#22c55e22', color: 'var(--green)' },
                { label: 'Wrong', value: '−1', bg: '#ef444422', color: 'var(--red)' },
                { label: 'Skipped', value: '0', bg: '#64748b22', color: 'var(--text3)' },
              ].map(item => (
                <div key={item.label} style={{
                  background: item.bg, borderRadius: 8, padding: '12px 16px', textAlign: 'center'
                }}>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: item.color, fontFamily: 'JetBrains Mono' }}>{item.value}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text2)', marginTop: 4 }}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Palette legend */}
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, marginBottom: 24 }}>
            <div style={{ fontWeight: 600, marginBottom: 16 }}>🎨 Question Palette Legend</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { state: S.NOT_VISITED, label: 'Not Visited', desc: 'You have not visited this question yet.' },
                { state: S.NOT_ANSWERED, label: 'Not Answered', desc: 'You visited but did not answer.' },
                { state: S.ANSWERED, label: 'Answered', desc: 'You have given an answer.' },
                { state: S.MARKED, label: 'Marked for Review', desc: 'Marked for review without answer.' },
                { state: S.MARKED_ANSWERED, label: 'Marked + Answered', desc: 'Answered and marked for review.' },
              ].map(item => (
                <div key={item.state} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={bubbleStyle(item.state, false)}>9</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.label}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* General rules */}
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, marginBottom: 32 }}>
            <div style={{ fontWeight: 600, marginBottom: 16 }}>📋 General Rules</div>
            {[
              `This test has ${test.totalQuestions} questions across Physics, Chemistry, and Mathematics.`,
              'Each section has 20 MCQ questions (4 options, 1 correct) and 5 Integer type questions.',
              'Integer type questions: answer is a number (0–999), no negative marking.',
              'Use "Mark for Review & Next" to flag questions you want to revisit.',
              'Use "Clear Response" to remove your selected answer.',
              'The test auto-submits when the timer reaches zero.',
              'You will receive a warning (red pulsing timer) in the last 5 minutes.',
            ].map((rule, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%', background: 'var(--accent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.7rem', fontWeight: 700, flexShrink: 0, marginTop: 2
                }}>{i + 1}</div>
                <div style={{ fontSize: '0.88rem', color: 'var(--text2)', lineHeight: 1.5 }}>{rule}</div>
              </div>
            ))}
          </div>

          <button onClick={() => onStart(duration * 60)} style={{
            width: '100%', padding: '16px', borderRadius: 12,
            background: 'linear-gradient(135deg, var(--accent), var(--purple))',
            color: '#fff', fontWeight: 700, fontSize: '1.1rem', letterSpacing: '0.01em'
          }}>
            Start Test →
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  SCREEN: CBT TEST
// ═══════════════════════════════════════════════════════════════
function TestScreen({ test, duration: initDuration, dark, setDark, onSubmit }) {
  const qs = test.questions;
  const sections = ['Physics', 'Chemistry', 'Mathematics'];

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState(() => new Array(qs.length).fill(null));
  const [states, setStates] = useState(() => new Array(qs.length).fill(S.NOT_VISITED));
  const [intInputs, setIntInputs] = useState(() => new Array(qs.length).fill(''));
  const [timeLeft, setTimeLeft] = useState(initDuration);
  const [showConfirm, setShowConfirm] = useState(false);
  const [activeSection, setActiveSection] = useState('Physics');
  const timerRef = useRef(null);

  const currentQ = qs[currentIdx];

  // Start timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); handleFinalSubmit(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  // Mark as not-answered when visiting
  useEffect(() => {
    setStates(prev => {
      if (prev[currentIdx] === S.NOT_VISITED) {
        const next = [...prev];
        next[currentIdx] = S.NOT_ANSWERED;
        return next;
      }
      return prev;
    });
  }, [currentIdx]);

  const handleAnswer = (optIdx) => {
    if (currentQ.type === 'integer') return;
    setAnswers(prev => { const a = [...prev]; a[currentIdx] = optIdx; return a; });
    setStates(prev => {
      const s = [...prev];
      s[currentIdx] = prev[currentIdx] === S.MARKED || prev[currentIdx] === S.MARKED_ANSWERED
        ? S.MARKED_ANSWERED : S.ANSWERED;
      return s;
    });
  };

  const handleIntInput = (val) => {
    setIntInputs(prev => { const a = [...prev]; a[currentIdx] = val; return a; });
    const num = Number(val);
    if (val !== '' && !isNaN(num)) {
      setAnswers(prev => { const a = [...prev]; a[currentIdx] = num; return a; });
      setStates(prev => {
        const s = [...prev];
        s[currentIdx] = prev[currentIdx] === S.MARKED || prev[currentIdx] === S.MARKED_ANSWERED
          ? S.MARKED_ANSWERED : S.ANSWERED;
        return s;
      });
    } else {
      setAnswers(prev => { const a = [...prev]; a[currentIdx] = null; return a; });
      if (states[currentIdx] !== S.MARKED && states[currentIdx] !== S.MARKED_ANSWERED) {
        setStates(prev => { const s = [...prev]; s[currentIdx] = S.NOT_ANSWERED; return s; });
      }
    }
  };

  const handleClear = () => {
    setAnswers(prev => { const a = [...prev]; a[currentIdx] = null; return a; });
    setIntInputs(prev => { const a = [...prev]; a[currentIdx] = ''; return a; });
    setStates(prev => {
      const s = [...prev];
      s[currentIdx] = prev[currentIdx] === S.MARKED_ANSWERED ? S.MARKED : S.NOT_ANSWERED;
      return s;
    });
  };

  const handleMarkReview = () => {
    setStates(prev => {
      const s = [...prev];
      const hasAns = answers[currentIdx] !== null;
      s[currentIdx] = hasAns ? S.MARKED_ANSWERED : S.MARKED;
      return s;
    });
    goNext();
  };

  const goNext = () => { if (currentIdx < qs.length - 1) setCurrentIdx(i => i + 1); };
  const goPrev = () => { if (currentIdx > 0) setCurrentIdx(i => i - 1); };

  const handleFinalSubmit = useCallback(() => {
    clearInterval(timerRef.current);
    // Calculate results
    let score = 0, correct = 0, wrong = 0, skipped = 0;
    const details = qs.map((q, i) => {
      const ans = answers[i];
      if (ans === null) { skipped++; return { qid: q.id, ans: null, correct: q.correctAnswer, result: 'skipped' }; }
      if (q.type === 'integer') {
        if (ans === q.correctAnswer) { score += 4; correct++; return { qid: q.id, ans, correct: q.correctAnswer, result: 'correct' }; }
        else { skipped++; return { qid: q.id, ans, correct: q.correctAnswer, result: 'wrong_int' }; }
      } else {
        if (ans === q.correctAnswer) { score += 4; correct++; return { qid: q.id, ans, correct: q.correctAnswer, result: 'correct' }; }
        else { score -= 1; wrong++; return { qid: q.id, ans, correct: q.correctAnswer, result: 'wrong' }; }
      }
    });
    const result = { score, correct, wrong, skipped, details, answers: [...answers], date: new Date().toISOString() };
    saveResult(test.id, result);
    onSubmit(result);
  }, [answers, qs, test.id, onSubmit]);

  const sectionQs = (sec) => qs.filter(q => q.section === sec);
  const sectionStart = (sec) => qs.findIndex(q => q.section === sec);

  const answered = answers.filter(a => a !== null).length;
  const marked = states.filter(s => s === S.MARKED || s === S.MARKED_ANSWERED).length;
  const notAnswered = states.filter(s => s === S.NOT_ANSWERED).length;
  const notVisited = states.filter(s => s === S.NOT_VISITED).length;

  const isLastFive = timeLeft <= 300;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* Top bar */}
      <div style={{
        background: 'var(--bg2)', borderBottom: '1px solid var(--border)',
        padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 56, flexShrink: 0
      }}>
        <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{test.name}</div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: isLastFive ? '#ef444422' : 'var(--bg3)',
          border: `1px solid ${isLastFive ? 'var(--red)' : 'var(--border)'}`,
          borderRadius: 8, padding: '8px 16px',
          ...(isLastFive ? { className: 'pulse-red' } : {})
        }} className={isLastFive ? 'pulse-red' : ''}>
          <span style={{ fontSize: '1rem' }}>⏱️</span>
          <span style={{
            fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '1.1rem',
            color: isLastFive ? 'var(--red)' : 'var(--text)'
          }}>{fmtTime(timeLeft)}</span>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setDark(!dark)} style={{
            background: 'var(--bg3)', border: '1px solid var(--border)',
            borderRadius: 8, padding: '7px 12px', color: 'var(--text2)', fontSize: '0.8rem'
          }}>{dark ? '☀️' : '🌙'}</button>
          <button onClick={() => setShowConfirm(true)} style={{
            background: 'var(--red)', borderRadius: 8, padding: '7px 16px',
            color: '#fff', fontWeight: 700, fontSize: '0.85rem'
          }}>Submit Test</button>
        </div>
      </div>

      {/* Section tabs */}
      <div style={{
        background: 'var(--bg2)', borderBottom: '1px solid var(--border)',
        display: 'flex', flexShrink: 0
      }}>
        {sections.map(sec => {
          const secQs = sectionQs(sec);
          const secAnswered = secQs.filter((q, i) => answers[sectionStart(sec) + i] !== null).length;
          const isActive = sec === activeSection;
          const col = sec === 'Physics' ? 'var(--phys)' : sec === 'Chemistry' ? 'var(--chem)' : 'var(--math)';
          return (
            <button key={sec} onClick={() => {
              setActiveSection(sec);
              setCurrentIdx(sectionStart(sec));
            }} style={{
              flex: 1, padding: '10px 8px', borderRadius: 0,
              background: isActive ? 'var(--bg)' : 'transparent',
              color: isActive ? col : 'var(--text3)',
              borderBottom: isActive ? `2px solid ${col}` : '2px solid transparent',
              fontWeight: isActive ? 700 : 500, fontSize: '0.85rem',
              transition: 'all 0.15s'
            }}>
              {sec} <span style={{ fontSize: '0.72rem', opacity: 0.8 }}>({secAnswered}/{secQs.length})</span>
            </button>
          );
        })}
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Question area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          <div key={currentIdx} className="fade-in">
            {/* Q header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{
                background: currentQ.section === 'Physics' ? '#06b6d422' : currentQ.section === 'Chemistry' ? '#10b98122' : '#f59e0b22',
                border: `1px solid ${currentQ.section === 'Physics' ? '#06b6d444' : currentQ.section === 'Chemistry' ? '#10b98144' : '#f59e0b44'}`,
                borderRadius: 6, padding: '3px 10px', fontSize: '0.72rem', fontWeight: 600,
                color: currentQ.section === 'Physics' ? 'var(--phys)' : currentQ.section === 'Chemistry' ? 'var(--chem)' : 'var(--math)'
              }}>{currentQ.section}</div>
              <div style={{
                fontSize: '0.72rem', color: 'var(--text3)',
                background: 'var(--bg3)', borderRadius: 6, padding: '3px 8px'
              }}>{currentQ.type === 'integer' ? 'Integer Type' : 'Single Correct'}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text2)', marginLeft: 'auto' }}>
                Question <span style={{ fontWeight: 700 }}>{currentIdx + 1}</span> / {qs.length}
              </div>
            </div>

            {/* Question text */}
            <div style={{
              background: 'var(--bg2)', border: '1px solid var(--border)',
              borderRadius: 12, padding: '20px 24px', marginBottom: 20
            }}>
              <div style={{ color: 'var(--text3)', fontSize: '0.75rem', marginBottom: 8, fontWeight: 600 }}>
                Q{currentQ.id}.
              </div>
              <QText text={currentQ.questionText} />
            </div>

            {/* Options or Integer input */}
            {currentQ.type === 'mcq' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {currentQ.options.map((opt, oi) => {
                  const optNum = oi + 1;
                  const isSelected = answers[currentIdx] === optNum;
                  return (
                    <button key={oi} onClick={() => handleAnswer(optNum)} style={{
                      background: isSelected ? '#3b82f622' : 'var(--bg2)',
                      border: `1px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`,
                      borderRadius: 10, padding: '14px 18px', textAlign: 'left',
                      color: 'var(--text)', display: 'flex', alignItems: 'flex-start', gap: 12,
                      transition: 'all 0.15s',
                    }}
                      onMouseEnter={e => { if (!isSelected) { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.background = 'var(--bg3)'; } }}
                      onMouseLeave={e => { if (!isSelected) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg2)'; } }}
                    >
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                        background: isSelected ? 'var(--accent)' : 'var(--bg3)',
                        border: `1px solid ${isSelected ? 'var(--accent)' : 'var(--border2)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.75rem', fontWeight: 700,
                        color: isSelected ? '#fff' : 'var(--text2)'
                      }}>{['A', 'B', 'C', 'D'][oi]}</div>
                      <div style={{ flex: 1, lineHeight: 1.6, fontSize: '0.95rem', paddingTop: 2 }}>{opt}</div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
                <div style={{ color: 'var(--text2)', fontSize: '0.88rem', marginBottom: 12 }}>
                  Enter your answer (integer, 0–999):
                </div>
                <input
                  type="number" min={0} max={999}
                  value={intInputs[currentIdx]}
                  onChange={e => handleIntInput(e.target.value)}
                  placeholder="Type answer..."
                  style={{
                    background: 'var(--bg3)', border: '1px solid var(--border2)',
                    borderRadius: 8, padding: '12px 20px', color: 'var(--text)',
                    fontSize: '1.4rem', width: 180, textAlign: 'center'
                  }}
                />
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 10, marginTop: 24, flexWrap: 'wrap' }}>
              <button onClick={handleMarkReview} style={{
                background: 'var(--purple)', borderRadius: 8, padding: '10px 18px',
                color: '#fff', fontWeight: 600, fontSize: '0.85rem'
              }}>Mark for Review & Next</button>
              <button onClick={handleClear} style={{
                background: 'var(--bg3)', border: '1px solid var(--border2)',
                borderRadius: 8, padding: '10px 18px', color: 'var(--text2)', fontWeight: 600, fontSize: '0.85rem'
              }}>Clear Response</button>
              <div style={{ flex: 1 }} />
              <button onClick={goPrev} disabled={currentIdx === 0} style={{
                background: 'var(--bg3)', border: '1px solid var(--border2)',
                borderRadius: 8, padding: '10px 18px', color: currentIdx === 0 ? 'var(--text3)' : 'var(--text2)',
                fontWeight: 600, fontSize: '0.85rem',
                opacity: currentIdx === 0 ? 0.5 : 1
              }}>← Previous</button>
              <button onClick={goNext} disabled={currentIdx === qs.length - 1} style={{
                background: 'var(--accent)', borderRadius: 8, padding: '10px 22px',
                color: '#fff', fontWeight: 700, fontSize: '0.85rem',
                opacity: currentIdx === qs.length - 1 ? 0.5 : 1
              }}>Save & Next →</button>
            </div>
          </div>
        </div>

        {/* Right palette */}
        <div style={{
          width: 240, borderLeft: '1px solid var(--border)',
          background: 'var(--bg2)', overflowY: 'auto', flexShrink: 0
        }}>
          <div style={{ padding: '16px 14px' }}>
            {/* Stats */}
            <div style={{
              background: 'var(--bg3)', borderRadius: 10, padding: 12, marginBottom: 16,
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8
            }}>
              {[
                { label: 'Answered', val: answered, color: 'var(--green)' },
                { label: 'Marked', val: marked, color: 'var(--purple)' },
                { label: 'Not Ans.', val: notAnswered, color: 'var(--red)' },
                { label: 'Not Visit.', val: notVisited, color: 'var(--grey)' },
              ].map(item => (
                <div key={item.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 800, fontSize: '1.2rem', color: item.color }}>{item.val}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text3)' }}>{item.label}</div>
                </div>
              ))}
            </div>

            {/* Section question grids */}
            {sections.map(sec => {
              const start = sectionStart(sec);
              const secQsList = sectionQs(sec);
              const col = sec === 'Physics' ? 'var(--phys)' : sec === 'Chemistry' ? 'var(--chem)' : 'var(--math)';
              return (
                <div key={sec} style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: col, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {sec}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {secQsList.map((q, i) => {
                      const globalIdx = start + i;
                      return (
                        <div key={globalIdx}
                          style={bubbleStyle(states[globalIdx], globalIdx === currentIdx)}
                          onClick={() => { setCurrentIdx(globalIdx); setActiveSection(sec); }}
                        >{globalIdx + 1}</div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Confirm dialog */}
      {showConfirm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }} onClick={() => setShowConfirm(false)}>
          <div className="slide-up" style={{
            background: 'var(--bg2)', border: '1px solid var(--border)',
            borderRadius: 16, padding: 32, maxWidth: 440, width: '90%'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ fontWeight: 800, fontSize: '1.3rem', marginBottom: 8 }}>Submit Test?</div>
            <div style={{ color: 'var(--text3)', marginBottom: 24, fontSize: '0.9rem' }}>
              Time remaining: <strong style={{ color: 'var(--orange)' }}>{fmtTime(timeLeft)}</strong>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
              {[
                { label: 'Answered', val: answered, color: 'var(--green)', bg: '#22c55e22' },
                { label: 'Not Answered', val: notAnswered, color: 'var(--red)', bg: '#ef444422' },
                { label: 'Marked', val: marked, color: 'var(--purple)', bg: '#a855f722' },
                { label: 'Not Visited', val: notVisited, color: 'var(--grey)', bg: '#47556922' },
              ].map(item => (
                <div key={item.label} style={{
                  background: item.bg, borderRadius: 10, padding: '12px', textAlign: 'center'
                }}>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: item.color }}>{item.val}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text2)', marginTop: 2 }}>{item.label}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowConfirm(false)} style={{
                flex: 1, padding: '12px', borderRadius: 10, fontWeight: 600,
                background: 'var(--bg3)', border: '1px solid var(--border2)', color: 'var(--text2)'
              }}>Continue Test</button>
              <button onClick={handleFinalSubmit} style={{
                flex: 1, padding: '12px', borderRadius: 10, fontWeight: 700,
                background: 'var(--red)', color: '#fff'
              }}>Submit Now</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  SCREEN: RESULTS
// ═══════════════════════════════════════════════════════════════
function ResultsScreen({ test, result, dark, setDark, onHome, onRetry }) {
  const qs = test.questions;
  const [showSolution, setShowSolution] = useState({});
  const [filterSection, setFilterSection] = useState('All');
  const sections = ['All', 'Physics', 'Chemistry', 'Mathematics'];
  const pct = Math.round((result.score / test.maxMarks) * 100);

  const filteredQs = filterSection === 'All' ? qs : qs.filter(q => q.section === filterSection);

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        background: 'var(--bg2)', borderBottom: '1px solid var(--border)',
        padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 60, position: 'sticky', top: 0, zIndex: 50
      }}>
        <button onClick={onHome} style={{
          background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8,
          padding: '7px 14px', color: 'var(--text2)', fontSize: '0.85rem'
        }}>← Home</button>
        <div style={{ fontWeight: 700 }}>Results — {test.name}</div>
        <button onClick={() => setDark(!dark)} style={{
          background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8,
          padding: '7px 12px', color: 'var(--text2)', fontSize: '0.85rem'
        }}>{dark ? '☀️' : '🌙'}</button>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 20px' }}>
        {/* Score card */}
        <div className="slide-up" style={{
          background: 'linear-gradient(135deg, var(--bg2), var(--bg3))',
          border: '1px solid var(--border)', borderRadius: 20, padding: 32,
          marginBottom: 32, textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text3)', marginBottom: 8 }}>Your Score</div>
          <div style={{
            fontSize: '4rem', fontWeight: 900, letterSpacing: '-0.04em',
            color: pct >= 60 ? 'var(--green)' : pct >= 35 ? 'var(--orange)' : 'var(--red)',
            lineHeight: 1
          }}>{result.score}</div>
          <div style={{ fontSize: '1.2rem', color: 'var(--text2)', marginBottom: 24 }}>
            out of {test.maxMarks}  ({pct}%)
          </div>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { label: 'Correct', val: result.correct, color: 'var(--green)', bg: '#22c55e22' },
              { label: 'Wrong', val: result.wrong, color: 'var(--red)', bg: '#ef444422' },
              { label: 'Skipped', val: result.skipped, color: 'var(--text3)', bg: '#64748b22' },
            ].map(item => (
              <div key={item.label} style={{
                background: item.bg, borderRadius: 12, padding: '16px 28px', minWidth: 100
              }}>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: item.color }}>{item.val}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text2)', marginTop: 4 }}>{item.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'center' }}>
            <button onClick={onRetry} style={{
              padding: '10px 24px', borderRadius: 10, fontWeight: 600,
              background: 'var(--accent)', color: '#fff', fontSize: '0.9rem'
            }}>Retry Test</button>
            <button onClick={onHome} style={{
              padding: '10px 24px', borderRadius: 10, fontWeight: 600,
              background: 'var(--bg4)', border: '1px solid var(--border2)', color: 'var(--text2)', fontSize: '0.9rem'
            }}>Back to Home</button>
          </div>
        </div>

        {/* Section-wise breakdown */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 32 }}>
          {['Physics', 'Chemistry', 'Mathematics'].map(sec => {
            const secQs = qs.filter(q => q.section === sec);
            const secDetails = result.details.filter((d, i) => qs[i].section === sec);
            const secCorrect = secDetails.filter(d => d.result === 'correct').length;
            const secScore = secCorrect * 4 - secDetails.filter(d => d.result === 'wrong').length;
            const col = sec === 'Physics' ? 'var(--phys)' : sec === 'Chemistry' ? 'var(--chem)' : 'var(--math)';
            return (
              <div key={sec} style={{
                background: 'var(--bg2)', border: '1px solid var(--border)',
                borderRadius: 12, padding: 16, textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: col, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{sec}</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{secScore}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>{secCorrect}/{secQs.length} correct</div>
              </div>
            );
          })}
        </div>

        {/* Per-question breakdown */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Question-by-Question Analysis</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {sections.map(s => (
                <button key={s} onClick={() => setFilterSection(s)} style={{
                  padding: '6px 12px', borderRadius: 6, fontSize: '0.78rem', fontWeight: 600,
                  background: filterSection === s ? 'var(--accent)' : 'var(--bg3)',
                  color: filterSection === s ? '#fff' : 'var(--text2)',
                  border: '1px solid var(--border)'
                }}>{s}</button>
              ))}
            </div>
          </div>

          {filteredQs.map((q, fi) => {
            const globalIdx = qs.indexOf(q);
            const det = result.details[globalIdx];
            const isCorrect = det.result === 'correct';
            const isWrong = det.result === 'wrong';
            const isSkipped = det.result === 'skipped' || det.result === 'wrong_int';
            const showSol = showSolution[q.id];

            return (
              <div key={q.id} className="fade-in" style={{
                background: 'var(--bg2)', border: `1px solid ${isCorrect ? 'var(--green)' : isWrong ? 'var(--red)' : 'var(--border)'}`,
                borderRadius: 12, marginBottom: 12, overflow: 'hidden'
              }}>
                <div style={{ padding: '14px 18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: isCorrect ? 'var(--green)' : isWrong ? 'var(--red)' : 'var(--grey)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.8rem', fontWeight: 700, color: '#fff', flexShrink: 0
                    }}>{isCorrect ? '✓' : isWrong ? '✗' : '−'}</div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Q{q.id}.</div>
                    <div style={{
                      fontSize: '0.68rem', padding: '2px 8px', borderRadius: 12,
                      background: isCorrect ? '#22c55e22' : isWrong ? '#ef444422' : '#64748b22',
                      color: isCorrect ? 'var(--green)' : isWrong ? 'var(--red)' : 'var(--text3)'
                    }}>{isCorrect ? '+4' : isWrong ? '−1' : '0'}</div>
                    <div style={{ marginLeft: 'auto', fontSize: '0.72rem', color: 'var(--text3)' }}>
                      {q.type === 'integer' ? 'Integer' : 'MCQ'} · {q.section}
                    </div>
                  </div>

                  <div style={{ fontSize: '0.88rem', color: 'var(--text2)', marginBottom: 12, lineHeight: 1.5 }}>
                    {q.questionText.length > 120 ? q.questionText.slice(0, 120) + '…' : q.questionText}
                  </div>

                  {/* Answer display */}
                  {q.type === 'mcq' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {q.options.map((opt, oi) => {
                        const optNum = oi + 1;
                        const isUserAns = det.ans === optNum;
                        const isCorrectAns = q.correctAnswer === optNum;
                        let bg = 'var(--bg3)', border = 'var(--border)', color = 'var(--text2)';
                        if (isCorrectAns) { bg = '#22c55e22'; border = 'var(--green)'; color = 'var(--green)'; }
                        else if (isUserAns && !isCorrectAns) { bg = '#ef444422'; border = 'var(--red)'; color = 'var(--red)'; }
                        return (
                          <div key={oi} style={{
                            background: bg, border: `1px solid ${border}`, borderRadius: 8,
                            padding: '8px 14px', fontSize: '0.83rem', color, display: 'flex', gap: 8
                          }}>
                            <span style={{ fontWeight: 700 }}>{['A', 'B', 'C', 'D'][oi]}.</span>
                            <span>{opt}</span>
                            {isCorrectAns && <span style={{ marginLeft: 'auto' }}>✓ Correct</span>}
                            {isUserAns && !isCorrectAns && <span style={{ marginLeft: 'auto' }}>✗ Your answer</span>}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: 12, fontSize: '0.85rem' }}>
                      <div style={{
                        background: '#22c55e22', border: '1px solid var(--green)', borderRadius: 8,
                        padding: '6px 14px', color: 'var(--green)'
                      }}>Correct: <strong>{q.correctAnswer}</strong></div>
                      {det.ans !== null && (
                        <div style={{
                          background: isCorrect ? '#22c55e22' : '#ef444422',
                          border: `1px solid ${isCorrect ? 'var(--green)' : 'var(--red)'}`,
                          borderRadius: 8, padding: '6px 14px',
                          color: isCorrect ? 'var(--green)' : 'var(--red)'
                        }}>Your answer: <strong>{det.ans}</strong></div>
                      )}
                    </div>
                  )}

                  {/* Solution toggle */}
                  <button onClick={() => setShowSolution(prev => ({ ...prev, [q.id]: !prev[q.id] }))} style={{
                    marginTop: 12, background: 'var(--bg3)', border: '1px solid var(--border2)',
                    borderRadius: 8, padding: '6px 14px', color: 'var(--text2)', fontSize: '0.8rem', fontWeight: 600
                  }}>
                    {showSol ? '▲ Hide Solution' : '▼ View Solution'}
                  </button>
                </div>

                {showSol && (
                  <div style={{
                    background: 'var(--bg3)', borderTop: '1px solid var(--border)',
                    padding: '16px 18px'
                  }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent2)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Solution
                    </div>
                    <QText text={q.solution} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  APP ROOT
// ═══════════════════════════════════════════════════════════════
function getTestsBySubject2() {
  const grouped = {};
  tests.forEach(test => {
    const key = test.subject;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(test);
  });
  return grouped;
}

export default function App() {
  const [dark, setDark] = useState(true);
  const [screen, setScreen] = useState('home'); // home | instructions | test | results
  const [selectedTest, setSelectedTest] = useState(null);
  const [testDuration, setTestDuration] = useState(null);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.remove('light');
    else root.classList.add('light');
  }, [dark]);

  return (
    <>
      <style>{globalCSS}</style>
      {screen === 'home' && (
        <HomeScreen
          dark={dark} setDark={setDark}
          onSelect={test => { setSelectedTest(test); setScreen('instructions'); }}
        />
      )}
      {screen === 'instructions' && selectedTest && (
        <InstructionsScreen
          test={selectedTest} dark={dark} setDark={setDark}
          onBack={() => setScreen('home')}
          onStart={dur => { setTestDuration(dur); setScreen('test'); }}
        />
      )}
      {screen === 'test' && selectedTest && (
        <TestScreen
          key={selectedTest.id + Date.now()}
          test={selectedTest} duration={testDuration}
          dark={dark} setDark={setDark}
          onSubmit={result => { setTestResult(result); setScreen('results'); }}
        />
      )}
      {screen === 'results' && selectedTest && testResult && (
        <ResultsScreen
          test={selectedTest} result={testResult}
          dark={dark} setDark={setDark}
          onHome={() => { setScreen('home'); setTestResult(null); setSelectedTest(null); }}
          onRetry={() => { setScreen('instructions'); setTestResult(null); }}
        />
      )}
    </>
  );
}
