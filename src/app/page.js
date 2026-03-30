'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { SECTIONS, MCQ_QS, INT_QS, ANSWERS, TOTAL_TIME, MARKS_CORRECT, MARKS_WRONG } from '../data/questions'

const LETTERS = ['A', 'B', 'C', 'D']
const STATUS = { NV: 's-nv', NA: 's-na', ANS: 's-ans', MRK: 's-mrk', MRA: 's-mra' }

function fmt(s) {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

function getSectionOf(q) {
  if (q <= 25) return 0
  if (q <= 50) return 1
  return 2
}

export default function App() {
  const [phase, setPhase] = useState('instr') // instr | test | result
  const [cur, setCur] = useState(1)
  const [answers, setAnswers] = useState({})       // qNum -> value (0-3 for MCQ, string for INT)
  const [statuses, setStatuses] = useState(() => {
    const s = {}; for (let i = 1; i <= 75; i++) s[i] = STATUS.NV; return s
  })
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME)
  const [activeSec, setActiveSec] = useState(0)
  const [showConfirm, setShowConfirm] = useState(false)
  const [showSol, setShowSol] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [fsWarnings, setFsWarnings] = useState(0)
  const [showFsWarning, setShowFsWarning] = useState(false)
  const [testCancelled, setTestCancelled] = useState(false)
  const timerRef = useRef(null)
  const intRef = useRef(null)

  // ── TIMER ──
  useEffect(() => {
    if (phase !== 'test') return
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); doSubmit(); return 0 }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [phase])

  // ── FULLSCREEN HELPERS ──
  const enterFullscreen = useCallback(() => {
    const el = document.documentElement
    if (el.requestFullscreen) el.requestFullscreen()
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen()
    else if (el.mozRequestFullScreen) el.mozRequestFullScreen()
  }, [])

  const exitFullscreen = useCallback(() => {
    if (document.exitFullscreen) document.exitFullscreen()
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen()
    else if (document.mozCancelFullScreen) document.mozCancelFullScreen()
  }, [])

  // ── FULLSCREEN CHANGE LISTENER ──
  useEffect(() => {
    if (phase !== 'test' || submitted || testCancelled) return

    const handleFsChange = () => {
      const isFs = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement)
      if (!isFs) {
        setFsWarnings(prev => {
          const next = prev + 1
          if (next >= 3) {
            setTestCancelled(true)
            setShowFsWarning(false)
            clearInterval(timerRef.current)
            return next
          }
          setShowFsWarning(true)
          return next
        })
      }
    }

    document.addEventListener('fullscreenchange', handleFsChange)
    document.addEventListener('webkitfullscreenchange', handleFsChange)
    document.addEventListener('mozfullscreenchange', handleFsChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange)
      document.removeEventListener('webkitfullscreenchange', handleFsChange)
      document.removeEventListener('mozfullscreenchange', handleFsChange)
    }
  }, [phase, submitted, testCancelled])

  useEffect(() => { setActiveSec(getSectionOf(cur)) }, [cur])

  const startTest = () => {
    setStatuses(prev => ({ ...prev, 1: STATUS.NA }))
    setPhase('test')
    enterFullscreen()
  }

  const doSubmit = useCallback(() => {
    clearInterval(timerRef.current)
    setSubmitted(true)
    setPhase('result')
    exitFullscreen()
  }, [exitFullscreen])

  const goTo = useCallback((q) => {
    setStatuses(prev => {
      const n = { ...prev }
      const curAns = answers[cur]
      if (n[cur] === STATUS.NV || n[cur] === STATUS.NA) {
        n[cur] = (curAns !== undefined && curAns !== '') ? STATUS.ANS : STATUS.NA
      }
      if (n[q] === STATUS.NV) n[q] = STATUS.NA
      return n
    })
    setCur(q)
    setShowSol(false)
  }, [cur, answers])

  const pickMCQ = (idx) => {
    if (submitted) return
    setAnswers(prev => ({ ...prev, [cur]: idx }))
    setStatuses(prev => {
      const n = { ...prev }
      n[cur] = (n[cur] === STATUS.MRK || n[cur] === STATUS.MRA) ? STATUS.MRA : STATUS.ANS
      return n
    })
  }

  const typeInt = (val) => {
    if (submitted) return
    setAnswers(prev => ({ ...prev, [cur]: val }))
    setStatuses(prev => {
      const n = { ...prev }
      if (val !== '') {
        n[cur] = (n[cur] === STATUS.MRK || n[cur] === STATUS.MRA) ? STATUS.MRA : STATUS.ANS
      } else {
        n[cur] = (n[cur] === STATUS.MRK || n[cur] === STATUS.MRA) ? STATUS.MRK : STATUS.NA
      }
      return n
    })
  }

  const clearResponse = () => {
    if (submitted) return
    setAnswers(prev => { const n = { ...prev }; delete n[cur]; return n })
    setStatuses(prev => {
      const n = { ...prev }
      n[cur] = (n[cur] === STATUS.MRA) ? STATUS.MRK : STATUS.NA
      return n
    })
    if (intRef.current) intRef.current.value = ''
  }

  const markReview = () => {
    if (submitted) return
    const hasAns = answers[cur] !== undefined && answers[cur] !== ''
    setStatuses(prev => ({ ...prev, [cur]: hasAns ? STATUS.MRA : STATUS.MRK }))
    if (cur < 75) goTo(cur + 1)
  }

  // ── COMPUTE RESULTS ──
  const computeResults = () => {
    let correct = 0, wrong = 0, skipped = 0, score = 0
    const details = []
    for (let q = 1; q <= 75; q++) {
      const userAns = answers[q]
      const correct_ans = ANSWERS[q]
      const isInt = INT_QS.has(q)
      let status, qscore

      if (isInt) {
        const userNum = userAns !== undefined && userAns !== '' ? Number(userAns) : undefined
        if (userNum === undefined || isNaN(userNum)) {
          status = 'skipped'; qscore = 0; skipped++
        } else if (userNum === correct_ans) {
          status = 'correct'; qscore = MARKS_CORRECT; correct++; score += qscore
        } else {
          status = 'wrong'; qscore = MARKS_WRONG; wrong++; score += qscore
        }
        details.push({ q, isInt, userAns: userNum, correct_ans, status, score: qscore })
      } else {
        if (userAns === undefined) {
          status = 'skipped'; qscore = 0; skipped++
        } else if (userAns === correct_ans) {
          status = 'correct'; qscore = MARKS_CORRECT; correct++; score += qscore
        } else {
          status = 'wrong'; qscore = MARKS_WRONG; wrong++; score += qscore
        }
        details.push({ q, isInt, userAns, correct_ans, status, score: qscore })
      }
    }
    return { correct, wrong, skipped, score, maxScore: 75 * MARKS_CORRECT, details }
  }

  const answered = Object.keys(answers).filter(q => answers[q] !== '' && answers[q] !== undefined).length
  const markedCt = Object.values(statuses).filter(s => s === STATUS.MRK || s === STATUS.MRA).length

  // ── INSTRUCTIONS ──
  if (phase === 'instr') return (
    <div className="instr-bg">
      <div className="instr-card">
        <div className="instr-hdr">
          <div style={{ fontSize: 12, opacity: .7 }}>Physics Wallah — Lakshya JEE 2026</div>
          <h1>Practice Test — 01</h1>
          <p>Physics · Chemistry · Mathematics &nbsp;|&nbsp; 75 Questions &nbsp;|&nbsp; 300 Marks &nbsp;|&nbsp; 180 Minutes</p>
        </div>
        <div className="instr-body">
          <div className="instr-section">
            <h3>📚 Sections</h3>
            <div className="sec-chips">
              {[['#1a6bbf', '#e8f2fc', 'Physics', 'Q1–25 (20 MCQ + 5 Integer)'],
              ['#1a8c4e', '#e8f8ee', 'Chemistry', 'Q26–50 (20 MCQ + 5 Integer)'],
              ['#7b2d8b', '#f8e8f8', 'Mathematics', 'Q51–75 (20 MCQ + 5 Integer)']].map(([c, bg, name, info]) => (
                <div key={name} className="sec-chip" style={{ background: bg, color: c, border: `1px solid ${c}30` }}>
                  <strong>{name}</strong><br /><span style={{ fontSize: 10, fontWeight: 400 }}>{info}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="instr-section">
            <h3>📊 Marking Scheme</h3>
            <table className="marks-tbl">
              <thead><tr><th>Question Type</th><th>Correct</th><th>Wrong</th><th>Unattempted</th></tr></thead>
              <tbody>
                <tr><td>MCQ (Single Correct)</td><td style={{ color: '#27ae60', fontWeight: 700 }}>+4</td><td style={{ color: '#c0392b', fontWeight: 700 }}>−1</td><td>0</td></tr>
                <tr><td>Integer Type</td><td style={{ color: '#27ae60', fontWeight: 700 }}>+4</td><td style={{ color: '#c0392b', fontWeight: 700 }}>−1</td><td>0</td></tr>
              </tbody>
            </table>
          </div>

          <div className="instr-section">
            <h3>🎨 Question Status Legend</h3>
            {[
              ['#b0bec5', 'Not Visited — You have not opened this question yet'],
              ['#ff5252', 'Not Answered — Visited but no answer selected'],
              ['#00c853', 'Answered — Answer selected/entered'],
              ['#aa00ff', 'Marked for Review — Flagged, no answer'],
              ['#aa00ff', 'Marked for Review + Answered — Will be evaluated (green outline)'],
            ].map(([c, t], i) => (
              <div className="instr-row" key={i}>
                <div className="instr-dot" style={{
                  background: c,
                  outline: i === 4 ? '2px solid #00c853' : '',
                  borderRadius: i === 4 ? '50%' : '3px'
                }} />
                <span>{t}</span>
              </div>
            ))}
          </div>

          <div className="instr-section">
            <h3>📌 Instructions</h3>
            {[
              'The test will launch in fullscreen mode. Exiting fullscreen will show a warning — 3 exits will cancel the test.',
              'Each section has 20 Single Correct MCQ questions and 5 Integer Type questions.',
              'For Integer Type: type your numerical answer in the input box (0–999).',
              'Timer counts down from 3:00:00 and the test auto-submits when it reaches zero.',
              '"Mark for Review & Next" flags the question and moves to the next one.',
              'Marked + Answered questions ARE evaluated — the mark is only a reminder.',
              'You can change or clear your answer any number of times before submission.',
              'Navigate between questions using the palette on the right or Prev/Next buttons.',
            ].map((t, i) => (
              <div className="instr-row" key={i}>
                <span style={{ color: SECTIONS[0].color, fontWeight: 700, minWidth: 18 }}>{i + 1}.</span>
                <span>{t}</span>
              </div>
            ))}
          </div>

          <div className="instr-start">
            <button className="btn-start" onClick={startTest}>🚀 Start Test</button>
          </div>
        </div>
      </div>
    </div>
  )

  // ── RESULTS ──
  if (phase === 'result') {
    const { correct, wrong, skipped, score, maxScore, details } = computeResults()
    const timeTaken = TOTAL_TIME - timeLeft
    const mm = Math.floor(timeTaken / 60), ss = timeTaken % 60
    const accuracy = answered === 0 ? 0 : Math.round((correct / answered) * 100)
    const positiveScore = correct * MARKS_CORRECT
    const marksLost = wrong * Math.abs(MARKS_WRONG)
    const qsAttempted = correct + wrong

    // Simulated percentile based on score
    const rawPct = Math.min(99.99, Math.max(1, (score / maxScore) * 100))
    const percentile = score <= 0 ? (5 + Math.random() * 10).toFixed(2)
      : score < 80 ? (30 + rawPct * 0.4).toFixed(2)
        : score < 150 ? (60 + rawPct * 0.35).toFixed(2)
          : (85 + rawPct * 0.14).toFixed(2)

    // Section stats
    const secStats = SECTIONS.map((sec, si) => {
      const sd = details.filter(d => getSectionOf(d.q) === si)
      return {
        ...sec,
        correct: sd.filter(d => d.status === 'correct').length,
        wrong: sd.filter(d => d.status === 'wrong').length,
        skipped: sd.filter(d => d.status === 'skipped').length,
        score: sd.reduce((a, d) => a + d.score, 0),
        details: sd,
      }
    })

    const secPctLabel = (sc) => {
      const p = Math.min(99, Math.max(1, 40 + (sc / 100) * 55))
      return `${p.toFixed(2)}%ile`
    }

    const resetTest = () => {
      setPhase('instr'); setCur(1); setAnswers({})
      setStatuses(() => { const s = {}; for (let i = 1; i <= 75; i++) s[i] = STATUS.NV; return s })
      setTimeLeft(TOTAL_TIME); setSubmitted(false); setShowSol(false)
    }

    return (
      <div style={{
        minHeight: '100vh', background: '#f0f2f7', fontFamily: "'Segoe UI', sans-serif",
        display: 'flex', flexDirection: 'column'
      }}>
        {/* Top bar */}
        <div style={{
          background: '#fff', borderBottom: '1px solid #e0e4ef', padding: '0 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: 56, position: 'sticky', top: 0, zIndex: 100,
          boxShadow: '0 1px 6px rgba(0,0,0,0.06)'
        }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18, color: '#1a1a2e' }}>Test Analysis</div>
            <div style={{ fontSize: 11, color: '#888' }}>Practice Test 01 — 75 Questions · 300 Marks</div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setPhase('test')} style={{
              padding: '8px 18px', borderRadius: 8, border: '1.5px solid #4f46e5',
              background: '#fff', color: '#4f46e5', fontWeight: 600, fontSize: 13, cursor: 'pointer'
            }}>📋 View Solutions</button>
            <button onClick={resetTest} style={{
              padding: '8px 18px', borderRadius: 8, border: 'none',
              background: '#4f46e5', color: '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer'
            }}>🔄 Retake Test</button>
          </div>
        </div>

        <div style={{ padding: '20px 24px', maxWidth: 1100, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
          {/* Overview label */}
          <div style={{ fontWeight: 700, fontSize: 20, color: '#1a1a2e', marginBottom: 16 }}>Overview</div>

          {/* Top row — Overall Score + Percentile */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            {/* Overall Score card */}
            <div style={{
              background: '#fff', borderRadius: 16, padding: '24px 28px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #e8eaf6'
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#888', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Overall Score</div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6 }}>
                <span style={{
                  fontSize: 64, fontWeight: 800, lineHeight: 1,
                  color: score < 0 ? '#e74c3c' : score < 100 ? '#e8a020' : '#4f46e5'
                }}>{score}</span>
                <span style={{ fontSize: 22, color: '#aaa', fontWeight: 500, paddingBottom: 6 }}>/300</span>
              </div>
              <div style={{ display: 'flex', gap: 28, marginTop: 20 }}>
                {secStats.map(s => (
                  <div key={s.id}>
                    <div style={{ fontSize: 11, color: '#999', marginBottom: 2 }}>{s.label.split(' ')[0]} Score</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                      <span style={{ fontSize: 20, fontWeight: 700, color: s.color }}>{s.score}</span>
                      <span style={{ fontSize: 11, color: '#bbb' }}>/100</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Predicted Percentile card */}
            <div style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)',
              borderRadius: 16, padding: '24px 28px', position: 'relative', overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(79,70,229,0.25)'
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#a0aec0', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>
                Predicted Percentile
              </div>
              <div style={{
                fontSize: 64, fontWeight: 800, lineHeight: 1,
                background: 'linear-gradient(90deg, #a78bfa, #60a5fa)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
              }}>{percentile}</div>
              <div style={{ display: 'flex', gap: 28, marginTop: 20 }}>
                {secStats.map(s => (
                  <div key={s.id}>
                    <div style={{ fontSize: 11, color: '#718096', marginBottom: 2 }}>{s.label.split(' ')[0]}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#a0aec0' }}>{secPctLabel(s.score)}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 11, color: '#4a5568', marginTop: 10 }}>
                Estimated based on this test attempt data.
              </div>
              {/* Decorative circles */}
              <div style={{
                position: 'absolute', right: -20, top: -20, width: 120, height: 120,
                borderRadius: '50%', background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.15)'
              }} />
              <div style={{
                position: 'absolute', right: 20, top: 20, width: 60, height: 60,
                borderRadius: '50%', background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.15)'
              }} />
            </div>
          </div>

          {/* Stat tiles — row 1 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 14 }}>
            {[
              { icon: '🏆', label: 'ACCURACY', value: `${accuracy}%`, sub: `${qsAttempted} attempted` },
              { icon: '✅', label: 'CORRECT', value: correct, sub: `+${positiveScore} marks earned` },
              { icon: '❌', label: 'WRONG', value: wrong, sub: `−${marksLost} marks lost` },
            ].map(({ icon, label, value, sub }) => (
              <div key={label} style={{
                background: '#fff', borderRadius: 14, padding: '18px 20px',
                boxShadow: '0 1px 8px rgba(0,0,0,0.05)', border: '1px solid #e8eaf6'
              }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#aaa', letterSpacing: 1 }}>{icon} {label}</div>
                <div style={{ fontSize: 36, fontWeight: 800, color: '#1a1a2e', marginTop: 6, lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: 11, color: '#aaa', marginTop: 4 }}>{sub}</div>
              </div>
            ))}
          </div>

          {/* Stat tiles — row 2 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
            {[
              { icon: '⬜', label: 'SKIPPED', value: skipped, sub: '0 marks' },
              { icon: '⭐', label: 'POSITIVE SCORE', value: `${positiveScore}`, sub: `out of ${maxScore}` },
              { icon: '⏱️', label: 'TIME TAKEN', value: `${mm}m`, sub: `${ss}s · ~${Math.round(timeTaken / 75)}s per question` },
            ].map(({ icon, label, value, sub }) => (
              <div key={label} style={{
                background: '#fff', borderRadius: 14, padding: '18px 20px',
                boxShadow: '0 1px 8px rgba(0,0,0,0.05)', border: '1px solid #e8eaf6'
              }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#aaa', letterSpacing: 1 }}>{icon} {label}</div>
                <div style={{ fontSize: 36, fontWeight: 800, color: '#1a1a2e', marginTop: 6, lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: 11, color: '#aaa', marginTop: 4 }}>{sub}</div>
              </div>
            ))}
          </div>

          {/* Section-wise breakdown */}
          <div style={{ fontWeight: 700, fontSize: 16, color: '#1a1a2e', marginBottom: 12 }}>Section-wise Breakdown</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
            {secStats.map(s => (
              <div key={s.id} style={{
                background: '#fff', borderRadius: 14, padding: '18px 20px',
                boxShadow: '0 1px 8px rgba(0,0,0,0.05)', border: `1.5px solid ${s.color}22`
              }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: s.color, marginBottom: 12 }}>{s.label}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {[
                    ['Score', `${s.score >= 0 ? '+' : ''}${s.score} / 100`, s.score >= 0 ? '#27ae60' : '#e74c3c'],
                    ['Correct', s.correct, '#27ae60'],
                    ['Wrong', s.wrong, '#e74c3c'],
                    ['Skipped', s.skipped, '#888'],
                  ].map(([l, v, c]) => (
                    <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                      <span style={{ color: '#888' }}>{l}</span>
                      <span style={{ fontWeight: 700, color: c }}>{v}</span>
                    </div>
                  ))}
                </div>
                {/* Mini progress bar */}
                <div style={{ marginTop: 12, height: 6, background: '#f0f2f7', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{
                    width: `${Math.max(0, (s.score / 100) * 100)}%`,
                    height: '100%', background: s.color, borderRadius: 99,
                    transition: 'width 1s ease'
                  }} />
                </div>
              </div>
            ))}
          </div>

          {/* Question Review */}
          <div style={{ fontWeight: 700, fontSize: 16, color: '#1a1a2e', marginBottom: 12 }}>Question Review</div>
          {secStats.map((sec) => (
            <div key={sec.id} style={{ marginBottom: 20 }}>
              <div style={{
                background: sec.color, color: '#fff', borderRadius: '10px 10px 0 0',
                padding: '10px 16px', fontWeight: 700, fontSize: 13,
                display: 'flex', justifyContent: 'space-between'
              }}>
                <span>{sec.label}</span>
                <span style={{ opacity: .85 }}>{sec.correct}✅ · {sec.wrong}❌ · {sec.skipped}⬜</span>
              </div>
              <div style={{ background: '#fff', borderRadius: '0 0 10px 10px', border: `1px solid ${sec.color}33`, overflow: 'hidden' }}>
                {sec.details.map((d, i) => (
                  <div key={d.q} style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px',
                    borderBottom: i < sec.details.length - 1 ? '1px solid #f0f2f7' : 'none',
                    background: d.status === 'correct' ? '#f0fdf4' : d.status === 'wrong' ? '#fef2f2' : '#fafafa'
                  }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontWeight: 800, fontSize: 13, flexShrink: 0,
                      background: d.status === 'correct' ? '#dcfce7' : d.status === 'wrong' ? '#fee2e2' : '#f0f2f7',
                      color: d.status === 'correct' ? '#16a34a' : d.status === 'wrong' ? '#dc2626' : '#aaa',
                    }}>Q{d.q}</div>
                    <div style={{ flex: 1, fontSize: 13 }}>
                      <span style={{ fontWeight: 600, color: d.status === 'correct' ? '#16a34a' : d.status === 'wrong' ? '#dc2626' : '#888' }}>
                        {d.status === 'correct' ? '✅ Correct' : d.status === 'wrong' ? '❌ Wrong' : '⬜ Not Attempted'}
                      </span>
                      {d.isInt && <span style={{ fontSize: 10, color: '#aaa', marginLeft: 6 }}>[Integer]</span>}
                    </div>
                    <div style={{ fontSize: 12, color: '#888' }}>
                      Correct: <strong style={{ color: '#1a1a2e' }}>{d.isInt ? d.correct_ans : `Option ${LETTERS[d.correct_ans]}`}</strong>
                      {d.userAns !== undefined && d.status !== 'correct' && (
                        <span style={{ marginLeft: 10, color: '#dc2626' }}>
                          Yours: {d.isInt ? d.userAns : `Option ${LETTERS[d.userAns]}`}
                        </span>
                      )}
                    </div>
                    <div style={{
                      width: 42, textAlign: 'right', fontWeight: 800, fontSize: 14,
                      color: d.score > 0 ? '#16a34a' : d.score < 0 ? '#dc2626' : '#aaa'
                    }}>{d.score > 0 ? `+${d.score}` : d.score || '0'}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ── TEST SCREEN ──
  const sec = SECTIONS[activeSec]
  const isMCQ = MCQ_QS.has(cur)
  const isInt = INT_QS.has(cur)
  const userAns = answers[cur]
  const correctAns = ANSWERS[cur]
  const isTimeLow = timeLeft < 300

  // MCQ option class
  const optClass = (idx) => {
    let c = 'opt-btn'
    if (submitted) {
      if (idx === correctAns) c += ' right'
      else if (idx === userAns && userAns !== correctAns) c += ' wrong'
    } else {
      if (idx === userAns) c += ' sel'
    }
    return c
  }

  // Int input class
  const intClass = () => {
    if (!submitted) return 'int-input'
    const userNum = userAns !== undefined && userAns !== '' ? Number(userAns) : undefined
    if (userNum === undefined || isNaN(userNum)) return 'int-input'
    if (userNum === correctAns) return 'int-input correct-ans'
    return 'int-input wrong-ans'
  }

  const secColor = SECTIONS[activeSec].color

  return (
    <>
      {/* ── HEADER ── */}
      <header className="hdr" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100 }}>
        <div className="hdr-left">
          <div className="hdr-title">Lakshya JEE 2026 — Practice Test 01</div>
          <div className="hdr-sub">Physics · Chemistry · Mathematics &nbsp;|&nbsp; 75 Qs · 300 Marks · +4/−1</div>
        </div>
        <div className="hdr-right">
          {submitted && (() => { const { score, maxScore } = computeResults(); return <div className="hdr-score">Score: {score}/{maxScore}</div> })()}
          <div className="timer">
            <div className="timer-lbl">Time Left</div>
            <div className={`timer-val${isTimeLow ? ' timer-warn' : ''}`}>{fmt(timeLeft)}</div>
          </div>
        </div>
      </header>

      {/* ── SECTION TABS ── */}
      <div className="sec-tabs" style={{ position: "fixed", top: "48px", left: 0, right: 0, zIndex: 99 }}>
        {SECTIONS.map((s, i) => {
          const answered_in_sec = s.qs.filter(q => answers[q] !== undefined && answers[q] !== '').length
          const activeClass = i === activeSec ? `sec-tab active-${s.id === 'physics' ? 'phys' : s.id === 'chemistry' ? 'chem' : 'math'}` : 'sec-tab'
          return (
            <button key={s.id} className={activeClass}
              onClick={() => { setActiveSec(i); goTo(s.qs[0]) }}
              style={i === activeSec ? { borderColor: s.color, color: s.color } : {}}>
              <span className="sec-tab-label">{s.label}</span>
              <span className="sec-tab-count">{answered_in_sec}/{s.qs.length} done</span>
            </button>
          )
        })}
      </div>

      {/* ── MAIN LAYOUT ── */}
      <div className="layout" style={{
        display: 'flex', position: 'fixed', top: 'calc(48px + 42px)', left: 0, right: 0, bottom: 0,
        overflow: 'hidden'
      }}>

        {/* ── QUESTION PANEL ── */}
        <div className="qpanel" style={{ marginRight: '260px', flex: 1, overflowY: 'auto', height: '100%' }}>

          {/* Q header */}
          <div className="qhdr">
            <div className="qhdr-left">
              <span className="qnum-badge" style={{ color: secColor }}>Q{cur}</span>
              <span className={`qtype-badge ${isMCQ ? 'qtype-mcq' : 'qtype-int'}`}>
                {isMCQ ? 'Single Correct' : 'Integer Type'}
              </span>
              {submitted && (() => {
                const isCorrect = isMCQ
                  ? userAns === correctAns
                  : (userAns !== undefined && userAns !== '' && Number(userAns) === correctAns)
                const isWrong = isMCQ
                  ? userAns !== undefined && userAns !== correctAns
                  : (userAns !== undefined && userAns !== '' && Number(userAns) !== correctAns)
                return <span className={`qtype-badge ${isCorrect ? 'qtype-mcq' : isWrong ? 'qtype-int' : ''}`}
                  style={isCorrect ? { background: '#e8f8f0', color: '#27ae60' } : isWrong ? { background: '#fdecea', color: '#c0392b' } : { background: '#f4f4f4', color: '#888' }}>
                  {isCorrect ? '✅ +4' : isWrong ? '❌ −1' : '⬜ 0'}
                </span>
              })()}
            </div>
            <div className="qhdr-marks">
              <span className="mark-tag c">+{MARKS_CORRECT} correct</span>
              <span className="mark-tag w">{MARKS_WRONG} wrong</span>
            </div>
          </div>

          {/* Question Image */}
          <div className="qcontent">
            <div style={{ width: '100%', maxWidth: 780 }}>
              <div className="qimg-wrap">
                <img src={`/q/q${cur}.jpg`} alt={`Question ${cur}`} draggable={false} />
              </div>

              {/* MCQ options */}
              {isMCQ && (
                <div className="options-area">
                  <div className="options-lbl">Select your answer</div>
                  <div className="options-grid" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {LETTERS.map((l, idx) => (
                      <button key={idx} className={optClass(idx)}
                        onClick={() => pickMCQ(idx)} disabled={submitted}>
                        <span className="opt-letter">{l}</span>
                        <span>Option {l}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Integer input */}
              {isInt && (
                <div className="int-area">
                  <div className="int-lbl">Enter your integer answer (0 – 999)</div>
                  <div className="int-input-row">
                    <input
                      ref={intRef}
                      type="number" min="0" max="9999"
                      className={intClass()}
                      defaultValue={userAns !== undefined ? userAns : ''}
                      placeholder="___"
                      disabled={submitted}
                      onChange={e => typeInt(e.target.value)}
                    />
                    {submitted && (() => {
                      const userNum = userAns !== undefined && userAns !== '' ? Number(userAns) : undefined
                      if (userNum === undefined || isNaN(userNum)) {
                        return <span className="int-hint">Not attempted · Correct: <strong>{correctAns}</strong></span>
                      }
                      if (userNum === correctAns) {
                        return <span className="int-correct-show">✅ Correct! Answer = {correctAns}</span>
                      }
                      return (
                        <div className="int-wrong-show">
                          <span style={{ color: '#c0392b', fontWeight: 700 }}>❌ Your answer: {userNum}</span>
                          <span style={{ color: '#27ae60', fontWeight: 700 }}>✅ Correct: {correctAns}</span>
                        </div>
                      )
                    })()}
                  </div>
                </div>
              )}

              {/* Solution */}
              {submitted && showSol && (
                <div className="solution-box">
                  <div className="sol-title">💡 Answer — Q{cur}</div>
                  <div className="sol-body">
                    {isMCQ
                      ? `Correct Answer: Option ${LETTERS[correctAns]} (${correctAns + 1})`
                      : `Correct Answer: ${correctAns}`
                    }
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom bar */}
          <div className="bbar">
            <button className="btn btn-prev" onClick={() => goTo(cur - 1)} disabled={cur === 1}>← Prev</button>
            <button className="btn btn-next" onClick={() => goTo(cur + 1)} disabled={cur === 75}>Next →</button>
            {!submitted && <>
              <button className="btn btn-rev" onClick={markReview}>🔖 Mark for Review & Next</button>
              <button className="btn btn-clr" onClick={clearResponse}
                disabled={userAns === undefined || userAns === ''}>Clear Response</button>
            </>}
            {submitted && <button className="btn btn-sol" onClick={() => setShowSol(s => !s)}>
              {showSol ? '🙈 Hide Answer' : '💡 Show Answer'}
            </button>}
            {!submitted && <button className="btn btn-sub" onClick={() => setShowConfirm(true)}>Submit Test ✓</button>}
            {submitted && <button className="btn btn-res" onClick={() => setPhase('result')}>📊 View Results</button>}
          </div>
        </div>

        {/* ── PALETTE ── */}
        <div className="palette" style={{
          position: 'fixed', top: 'calc(48px + 42px)', right: 0, bottom: 0,
          width: '260px', overflowY: 'auto', borderLeft: '1px solid #e0e4ef',
          background: '#fff', zIndex: 10
        }}>
          <div className="pal-hdr">Question Palette</div>
          <div className="pal-legend">
            {[
              ['#b0bec5', '#546e7a', 'Not Visited'],
              ['#ff5252', '#b71c1c', 'Not Answered'],
              ['#00c853', '#1b5e20', 'Answered'],
              ['#aa00ff', '#6200ea', 'Marked (No Ans)'],
              ['#aa00ff', '#6200ea', 'Marked + Answered'],
            ].map(([bg, txt, l], i) => (
              <div className="leg" key={l} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, marginBottom: 2 }}>
                <div className="leg-dot" style={{
                  background: bg, border: i === 4 ? '2px solid #00c853' : 'none',
                  borderRadius: i === 4 ? '50%' : '3px',
                  width: 16, height: 16, flexShrink: 0
                }} />
                <span style={{ color: '#333' }}>{l}</span>
              </div>
            ))}
          </div>
          <div className="pal-marking">
            <strong>Marking:</strong> MCQ & Integer &nbsp;|&nbsp;
            <span style={{ color: '#27ae60', fontWeight: 700 }}>+4</span> correct &nbsp;
            <span style={{ color: '#c0392b', fontWeight: 700 }}>−1</span> wrong &nbsp; 0 skip
          </div>

          <div className="pal-grid" style={{
            '--c-nv': '#b0bec5', '--c-na': '#ff5252', '--c-ans': '#00c853',
            '--c-mrk': '#aa00ff', '--c-mra': '#aa00ff'
          }}>
            {SECTIONS.map((s, si) => (
              <>
                <div key={`hdr${si}`} style={{
                  gridColumn: '1/-1', fontSize: 10, fontWeight: 800, color: s.color,
                  background: s.light, padding: '3px 6px', borderRadius: 4, marginTop: si > 0 ? 4 : 0
                }}>{s.label}</div>
                {s.qs.map(q => (
                  <button key={q}
                    className={`pb ${statuses[q]}${q === cur ? ' active' : ''}`}
                    onClick={() => goTo(q)}
                    title={`Q${q}${INT_QS.has(q) ? ' [Int]' : ''}`}
                    style={INT_QS.has(q) ? { borderRadius: '50%' } : {}}
                  >{q}</button>
                ))}
              </>
            ))}
          </div>

          <div className="pal-stats">
            {[
              ['Answered', Object.values(statuses).filter(s => s === STATUS.ANS || s === STATUS.MRA).length, '#00c853'],
              ['Not Answered', Object.values(statuses).filter(s => s === STATUS.NA).length, '#ff5252'],
              ['Marked', markedCt, '#aa00ff'],
              ['Not Visited', Object.values(statuses).filter(s => s === STATUS.NV).length, '#78909c'],
            ].map(([l, v, c]) => (
              <div className="pstat" key={l}><span>{l}</span><span style={{ color: c, fontWeight: 700 }}>{v}</span></div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CONFIRM MODAL ── */}
      {showConfirm && (
        <div className="modal-bg" onClick={() => setShowConfirm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-icon">⚠️</div>
            <div className="modal-title">Submit Test?</div>
            <div className="modal-text">Once submitted, you cannot change your answers.</div>
            <div className="modal-stats">
              {[
                ['✅ Answered', answered],
                ['❌ Not Answered', 75 - answered],
                ['🔖 Marked for Review', markedCt],
                ['⏱️ Time Remaining', fmt(timeLeft)],
              ].map(([l, v]) => (
                <div className="msr" key={l}><span>{l}</span><strong>{v}</strong></div>
              ))}
            </div>
            <div className="modal-btns">
              <button className="btn btn-cancel" onClick={() => setShowConfirm(false)}>Cancel</button>
              <button className="btn btn-confirm" onClick={doSubmit}>Submit Now</button>
            </div>
          </div>
        </div>
      )}

      {/* ── FULLSCREEN WARNING MODAL ── */}
      {showFsWarning && !testCancelled && (
        <div className="modal-bg">
          <div className="modal" style={{ borderTop: '4px solid #e67e22' }}>
            <div className="modal-icon">🖥️</div>
            <div className="modal-title" style={{ color: '#e67e22' }}>Fullscreen Required!</div>
            <div className="modal-text">
              The test must be taken in fullscreen mode.<br />
              Exiting fullscreen may result in test cancellation.
            </div>
            <div className="modal-stats" style={{ background: '#fff8f0', border: '1px solid #e67e2230' }}>
              <div className="msr">
                <span>⚠️ Warnings Used</span>
                <strong style={{ color: '#e67e22' }}>{fsWarnings} / 3</strong>
              </div>
              <div className="msr">
                <span>🚫 Remaining Chances</span>
                <strong style={{ color: 3 - fsWarnings === 1 ? '#e74c3c' : '#e67e22' }}>{3 - fsWarnings}</strong>
              </div>
            </div>
            <div style={{ fontSize: 12, color: '#c0392b', textAlign: 'center', marginTop: 4, fontWeight: 600 }}>
              {3 - fsWarnings === 1
                ? '⛔ One more exit will CANCEL your test!'
                : `${3 - fsWarnings} more exits will cancel your test.`}
            </div>
            <div className="modal-btns">
              <button className="btn btn-confirm" style={{ background: '#e67e22' }}
                onClick={() => { setShowFsWarning(false); enterFullscreen() }}>
                🔲 Return to Fullscreen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── TEST CANCELLED SCREEN ── */}
      {testCancelled && (
        <div className="modal-bg" style={{ background: 'rgba(0,0,0,0.92)' }}>
          <div className="modal" style={{ borderTop: '4px solid #e74c3c', maxWidth: 440 }}>
            <div className="modal-icon" style={{ fontSize: 48 }}>🚫</div>
            <div className="modal-title" style={{ color: '#e74c3c', fontSize: 22 }}>Test Cancelled</div>
            <div className="modal-text" style={{ fontSize: 14 }}>
              You exited fullscreen <strong>3 times</strong>.<br />
              Your test has been automatically cancelled as per the exam rules.
            </div>
            <div className="modal-stats" style={{ background: '#fff0f0', border: '1px solid #e74c3c30' }}>
              {[
                ['📝 Questions Answered', answered],
                ['⏱️ Time Used', fmt(TOTAL_TIME - timeLeft)],
                ['⚠️ Fullscreen Violations', 3],
              ].map(([l, v]) => (
                <div className="msr" key={l}><span>{l}</span><strong>{v}</strong></div>
              ))}
            </div>
            <div className="modal-btns">
              <button className="btn btn-confirm" style={{ background: '#e74c3c' }}
                onClick={() => {
                  setPhase('instr'); setCur(1); setAnswers({})
                  setStatuses(() => { const s = {}; for (let i = 1; i <= 75; i++) s[i] = STATUS.NV; return s })
                  setTimeLeft(TOTAL_TIME); setSubmitted(false); setShowSol(false)
                  setFsWarnings(0); setShowFsWarning(false); setTestCancelled(false)
                }}>
                🔄 Start Over
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}