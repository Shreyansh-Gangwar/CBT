'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { questions } from '../data/questions'

const TOTAL_TIME = 60 * 60 // 1 hour in seconds
const MARKS_CORRECT = 4
const MARKS_WRONG = -1
const LETTERS = ['A', 'B', 'C', 'D']

// Question status types
const STATUS = {
  NOT_VISITED: 'not-visited',
  NOT_ANSWERED: 'not-answered',
  ANSWERED: 'answered',
  MARKED: 'marked',
  MARKED_ANSWERED: 'marked-answered',
}

function formatTime(secs) {
  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = secs % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function JEETest() {
  const [phase, setPhase] = useState('instructions') // instructions | test | result
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState(Array(20).fill(null))
  const [statuses, setStatuses] = useState(Array(20).fill(STATUS.NOT_VISITED))
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME)
  const [showConfirm, setShowConfirm] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const timerRef = useRef(null)

  // Start timer when test begins
  useEffect(() => {
    if (phase !== 'test') return
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          handleAutoSubmit()
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [phase])

  const handleAutoSubmit = useCallback(() => {
    clearInterval(timerRef.current)
    setSubmitted(true)
    setPhase('result')
  }, [])

  const startTest = () => {
    // Mark first question as not-answered (visited)
    const newStatuses = Array(20).fill(STATUS.NOT_VISITED)
    newStatuses[0] = STATUS.NOT_ANSWERED
    setStatuses(newStatuses)
    setPhase('test')
  }

  const goToQuestion = (idx) => {
    // Update status of current question before leaving
    setStatuses(prev => {
      const next = [...prev]
      if (next[current] === STATUS.NOT_VISITED || next[current] === STATUS.NOT_ANSWERED) {
        next[current] = answers[current] !== null ? STATUS.ANSWERED : STATUS.NOT_ANSWERED
      }
      // Mark destination as visited if not yet
      if (next[idx] === STATUS.NOT_VISITED) {
        next[idx] = STATUS.NOT_ANSWERED
      }
      return next
    })
    setCurrent(idx)
    setShowSolution(false)
  }

  const selectOption = (optIdx) => {
    if (submitted) return
    setAnswers(prev => {
      const next = [...prev]
      next[current] = optIdx
      return next
    })
    setStatuses(prev => {
      const next = [...prev]
      if (next[current] === STATUS.MARKED) {
        next[current] = STATUS.MARKED_ANSWERED
      } else {
        next[current] = STATUS.ANSWERED
      }
      return next
    })
  }

  const clearResponse = () => {
    if (submitted) return
    setAnswers(prev => { const n = [...prev]; n[current] = null; return n })
    setStatuses(prev => {
      const n = [...prev]
      if (n[current] === STATUS.MARKED_ANSWERED) n[current] = STATUS.MARKED
      else n[current] = STATUS.NOT_ANSWERED
      return n
    })
  }

  const markForReview = () => {
    if (submitted) return
    setStatuses(prev => {
      const n = [...prev]
      if (answers[current] !== null) n[current] = STATUS.MARKED_ANSWERED
      else n[current] = STATUS.MARKED
      return n
    })
    if (current < 19) goToQuestion(current + 1)
  }

  const submitTest = () => {
    clearInterval(timerRef.current)
    setSubmitted(true)
    setShowConfirm(false)
    setPhase('result')
  }

  // Compute results
  const computeResults = () => {
    let correct = 0, wrong = 0, skipped = 0
    const details = questions.map((q, i) => {
      const userAns = answers[i]
      if (userAns === null) { skipped++; return { ...q, userAns, status: 'skipped', score: 0 } }
      if (userAns === q.answer) { correct++; return { ...q, userAns, status: 'correct', score: MARKS_CORRECT } }
      wrong++; return { ...q, userAns, status: 'wrong', score: MARKS_WRONG }
    })
    const totalScore = correct * MARKS_CORRECT + wrong * MARKS_WRONG
    const maxScore = questions.length * MARKS_CORRECT
    return { correct, wrong, skipped, totalScore, maxScore, details }
  }

  // Stats for confirm modal
  const answered = answers.filter(a => a !== null).length
  const markedCount = statuses.filter(s => s === STATUS.MARKED || s === STATUS.MARKED_ANSWERED).length
  const notAnswered = 20 - answered

  // ── INSTRUCTIONS SCREEN ──
  if (phase === 'instructions') {
    return (
      <div className="instructions-overlay">
        <div className="instructions-card">
          <div className="instructions-header">
            <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 6 }}>Quizrr Chapter-Wise Test</div>
            <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Determinants — JEE Main 2025</div>
            <div style={{ fontSize: 13, opacity: 0.75 }}>20 Questions &nbsp;|&nbsp; 1 Hour &nbsp;|&nbsp; 80 Marks Maximum</div>
          </div>
          <div className="instructions-body">
            <div className="inst-section">
              <h3>📋 Marking Scheme</h3>
              <table className="marking-table">
                <thead>
                  <tr><th>Answer Type</th><th>Marks</th></tr>
                </thead>
                <tbody>
                  <tr><td>✅ Correct Answer</td><td style={{color:'#27ae60',fontWeight:700}}>+4</td></tr>
                  <tr><td>❌ Wrong Answer</td><td style={{color:'#c0392b',fontWeight:700}}>−1</td></tr>
                  <tr><td>⬜ Unattempted</td><td>0</td></tr>
                </tbody>
              </table>
            </div>

            <div className="inst-section">
              <h3>🎨 Question Status Legend</h3>
              {[
                { color: '#dde3ec', label: 'Not Visited — You have not visited this question yet' },
                { color: '#e74c3c', label: 'Not Answered — You visited but did not select any option' },
                { color: '#27ae60', label: 'Answered — You have selected an answer' },
                { color: '#8e44ad', label: 'Marked for Review — Marked but not answered' },
                { color: '#8e44ad', label: 'Marked for Review + Answered — Will be evaluated' },
              ].map((item, i) => (
                <div className="inst-row" key={i}>
                  <div className="inst-dot" style={{ background: item.color, border: i === 4 ? '3px solid #27ae60' : 'none' }} />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>

            <div className="inst-section">
              <h3>📌 General Instructions</h3>
              {[
                'This test contains 20 Multiple Choice Questions (MCQs).',
                'Each question has exactly one correct answer.',
                'Timer will count down from 1:00:00. Test auto-submits when time runs out.',
                'You can navigate between questions using the palette on the right or Prev/Next buttons.',
                '"Mark for Review" flags a question — marked+answered questions ARE evaluated.',
                'You can change your answer any number of times before final submission.',
                'Clicking "Clear Response" removes your selected answer for the current question.',
              ].map((t, i) => (
                <div className="inst-row" key={i}>
                  <span style={{color:'#1a3c6e',fontWeight:700,minWidth:20}}>{i+1}.</span>
                  <span>{t}</span>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: 8 }}>
              <button className="btn btn-primary" style={{ fontSize: 15, padding: '12px 48px', borderRadius: 8 }} onClick={startTest}>
                🚀 Start Test
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── RESULT SCREEN ──
  if (phase === 'result') {
    const { correct, wrong, skipped, totalScore, maxScore, details } = computeResults()
    const pct = Math.round((totalScore / maxScore) * 100)
    const timeTaken = TOTAL_TIME - timeLeft
    const minsUsed = Math.floor(timeTaken / 60)
    const secsUsed = timeTaken % 60

    return (
      <div className="result-overlay">
        <div className="result-card">
          <div className="result-header">
            <div className="result-title">🎯 Test Completed!</div>
            <div className="result-subtitle">Determinants — JEE Main 2025 | Chapter-wise Test</div>
            <div className="result-score-big" style={{ color: totalScore < 0 ? '#ff6b6b' : totalScore < 40 ? '#ffd980' : '#7effc4' }}>
              {totalScore < 0 ? totalScore : `+${totalScore}`}
            </div>
            <div className="result-score-max">out of {maxScore} marks</div>
            <div style={{ marginTop: 8, fontSize: 13, opacity: 0.8 }}>
              Accuracy: {answers.filter(Boolean).length === 0 ? 0 : Math.round((correct / answers.filter(a => a !== null).length) * 100)}% &nbsp;|&nbsp; Time Used: {minsUsed}m {secsUsed}s
            </div>
          </div>

          <div className="result-body">
            <div className="result-stats-grid">
              <div className="stat-card green">
                <div className="stat-card-val">{correct}</div>
                <div className="stat-card-label">Correct</div>
              </div>
              <div className="stat-card red">
                <div className="stat-card-val">{wrong}</div>
                <div className="stat-card-label">Wrong</div>
              </div>
              <div className="stat-card orange">
                <div className="stat-card-val">{skipped}</div>
                <div className="stat-card-label">Skipped</div>
              </div>
              <div className="stat-card blue">
                <div className="stat-card-val">{pct < 0 ? 0 : pct}%</div>
                <div className="stat-card-label">Score %</div>
              </div>
            </div>

            {/* Score bar */}
            <div style={{ background: '#eee', borderRadius: 8, height: 12, marginBottom: 24, overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${Math.max(0, (totalScore / maxScore) * 100)}%`,
                background: totalScore < 0 ? '#e74c3c' : totalScore < 40 ? '#e8a020' : '#27ae60',
                borderRadius: 8,
                transition: 'width 1s ease'
              }} />
            </div>

            <hr className="result-divider" />
            <div className="result-section-title">📝 Detailed Answer Review</div>

            <div className="answer-review-list">
              {details.map((q, i) => (
                <div key={i} className={`answer-review-item ${q.status === 'correct' ? 'correct-item' : q.status === 'wrong' ? 'wrong-item' : 'skip-item'}`}>
                  <div className="review-qnum">{i + 1}</div>
                  <div className="review-info">
                    <div style={{ fontWeight: 600, marginBottom: 2 }}>
                      {q.status === 'correct' ? '✅ Correct' : q.status === 'wrong' ? '❌ Wrong' : '⬜ Not Attempted'}
                    </div>
                    <div className="review-answers">
                      <span className="review-correct-ans">Correct: {LETTERS[q.answer]}</span>
                      {q.userAns !== null && q.status !== 'correct' && (
                        <span className="review-user-ans">Your Answer: {LETTERS[q.userAns]}</span>
                      )}
                    </div>
                    <div style={{ fontSize: 11, color: '#555', marginTop: 4, lineHeight: 1.5 }}>{q.explanation}</div>
                  </div>
                  <div className="review-score">{q.score > 0 ? `+${q.score}` : q.score}</div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: 28 }}>
              <button className="btn btn-primary" style={{ fontSize: 14, padding: '11px 36px' }}
                onClick={() => {
                  setPhase('instructions')
                  setCurrent(0)
                  setAnswers(Array(20).fill(null))
                  setStatuses(Array(20).fill(STATUS.NOT_VISITED))
                  setTimeLeft(TOTAL_TIME)
                  setSubmitted(false)
                  setShowSolution(false)
                }}>
                🔄 Retake Test
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── TEST SCREEN ──
  const q = questions[current]
  const userAns = answers[current]
  const isCorrect = submitted && userAns === q.answer
  const isWrong = submitted && userAns !== null && userAns !== q.answer
  const isTimeLow = timeLeft < 300 // last 5 mins

  const paletteColors = statuses.map((s, i) => {
    const cls = `palette-btn status-${s}${i === current ? ' active' : ''}`
    return cls
  })

  return (
    <>
      {/* ── HEADER ── */}
      <header className="header">
        <div>
          <div className="header-title">Determinants — JEE Main 2025</div>
          <div className="header-subtitle">Chapter-wise Test &nbsp;|&nbsp; 20 Questions &nbsp;|&nbsp; Marking: +4 / −1</div>
        </div>
        <div className="header-right">
          {submitted && (
            <div className="score-badge">
              Score: {computeResults().totalScore} / {questions.length * MARKS_CORRECT}
            </div>
          )}
          <div className="timer-box">
            <div className="timer-label">Time Left</div>
            <div className={`timer-value${isTimeLow ? ' timer-warning' : ''}`}>
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>
      </header>

      {/* ── MAIN LAYOUT ── */}
      <div className="main-layout">

        {/* ── QUESTION PANEL ── */}
        <div className="question-panel">

          {/* Question Header */}
          <div className="question-header">
            <div className="question-label">Question {current + 1} of {questions.length}</div>
            <div className="question-meta">
              {submitted && (
                <span className={`meta-tag ${isCorrect ? 'correct' : isWrong ? 'wrong' : ''}`}>
                  {isCorrect ? '✅ Correct (+4)' : isWrong ? '❌ Wrong (−1)' : '⬜ Not Attempted (0)'}
                </span>
              )}
              <span className="meta-tag">+{MARKS_CORRECT} correct</span>
              <span className="meta-tag" style={{color:'#c0392b'}}>−{Math.abs(MARKS_WRONG)} wrong</span>
            </div>
          </div>

          {/* Question Image */}
          <div className="question-content">
            <div style={{ width: '100%', maxWidth: 780 }}>
              <div className="question-img-wrap">
                <img
                  src={`/q/q${q.id}.jpg`}
                  alt={`Question ${q.id}`}
                  draggable={false}
                />
              </div>

              {/* Options */}
              <div className="options-area" style={{ maxWidth: '100%' }}>
                <div className="options-label">Select your answer</div>
                <div className="options-grid">
                  {q.options.map((opt, idx) => {
                    let cls = 'option-btn'
                    if (submitted) {
                      if (idx === q.answer) cls += ' correct-ans'
                      else if (idx === userAns && userAns !== q.answer) cls += ' wrong-ans'
                    } else {
                      if (idx === userAns) cls += ' selected'
                    }
                    return (
                      <button
                        key={idx}
                        className={cls}
                        onClick={() => selectOption(idx)}
                        disabled={submitted}
                      >
                        <span className="option-letter">{LETTERS[idx]}</span>
                        <span>{opt.replace(/^\([A-D]\)\s*/, '')}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Solution (shown after submit or when toggled) */}
              {(submitted && showSolution) && (
                <div className="solution-panel" style={{ maxWidth: '100%', marginTop: 12 }}>
                  <div className="solution-title">💡 Solution — Q{q.id}</div>
                  <div className="solution-text">{q.explanation}</div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Nav */}
          <div className="bottom-bar">
            <button className="btn btn-secondary" onClick={() => goToQuestion(current - 1)} disabled={current === 0}>
              ← Prev
            </button>
            <button className="btn btn-secondary" onClick={() => goToQuestion(current + 1)} disabled={current === 19}>
              Next →
            </button>
            {!submitted && (
              <>
                <button className="btn btn-review" onClick={markForReview}>
                  🔖 Mark for Review & Next
                </button>
                <button className="btn btn-clear" onClick={clearResponse} disabled={userAns === null}>
                  Clear Response
                </button>
              </>
            )}
            {submitted && (
              <button className="btn btn-secondary" onClick={() => setShowSolution(s => !s)}>
                {showSolution ? '🙈 Hide Solution' : '💡 View Solution'}
              </button>
            )}
            {!submitted && (
              <button className="btn btn-submit" onClick={() => setShowConfirm(true)} style={{ marginLeft: 'auto' }}>
                Submit Test ✓
              </button>
            )}
            {submitted && (
              <button className="btn btn-primary" onClick={() => setPhase('result')} style={{ marginLeft: 'auto' }}>
                📊 View Results
              </button>
            )}
          </div>
        </div>

        {/* ── PALETTE PANEL ── */}
        <div className="palette-panel">
          <div className="palette-header">Question Palette</div>

          {/* Legend */}
          <div className="palette-legend">
            {[
              { color: '#dde3ec', label: 'Not Visited' },
              { color: '#e74c3c', label: 'Not Answered' },
              { color: '#27ae60', label: 'Answered' },
              { color: '#8e44ad', label: 'Marked' },
            ].map((l, i) => (
              <div className="legend-item" key={i}>
                <div className="legend-dot" style={{ background: l.color, borderRadius: 4 }} />
                <span>{l.label}</span>
              </div>
            ))}
          </div>

          {/* Marking info */}
          <div className="marking-info">
            <strong>Marking Scheme:</strong><br />
            Correct: <strong style={{color:'#27ae60'}}>+4</strong> &nbsp;|&nbsp; Wrong: <strong style={{color:'#c0392b'}}>−1</strong> &nbsp;|&nbsp; Skipped: <strong>0</strong>
          </div>

          {/* Grid */}
          <div className="palette-grid">
            {questions.map((_, i) => (
              <button
                key={i}
                className={paletteColors[i]}
                onClick={() => goToQuestion(i)}
                title={`Question ${i + 1}`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="palette-stats">
            {[
              { label: 'Answered', val: answers.filter(a => a !== null).length, color: '#27ae60' },
              { label: 'Not Answered', val: statuses.filter(s => s === STATUS.NOT_ANSWERED).length, color: '#e74c3c' },
              { label: 'Marked', val: markedCount, color: '#8e44ad' },
              { label: 'Not Visited', val: statuses.filter(s => s === STATUS.NOT_VISITED).length, color: '#999' },
            ].map((s, i) => (
              <div className="stat-row" key={i}>
                <span>{s.label}</span>
                <span className="stat-val" style={{ color: s.color }}>{s.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CONFIRM SUBMIT MODAL ── */}
      {showConfirm && (
        <div className="modal-overlay" onClick={() => setShowConfirm(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-icon">⚠️</div>
            <div className="modal-title">Submit Test?</div>
            <div className="modal-text">Once submitted, you cannot change your answers. Please review your progress below.</div>
            <div className="modal-stats">
              {[
                { label: '✅ Answered', val: answered },
                { label: '❌ Not Answered', val: notAnswered },
                { label: '🔖 Marked for Review', val: markedCount },
                { label: '⏱️ Time Remaining', val: formatTime(timeLeft) },
              ].map((r, i) => (
                <div className="modal-stat-row" key={i}>
                  <span>{r.label}</span>
                  <strong>{r.val}</strong>
                </div>
              ))}
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowConfirm(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={submitTest}>Submit Now</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
