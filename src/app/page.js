'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { SECTIONS, MCQ_QS, INT_QS, ANSWERS, TOTAL_TIME, MARKS_CORRECT, MARKS_WRONG } from '../data/questions'

const LETTERS = ['A','B','C','D']
const STATUS = { NV:'s-nv', NA:'s-na', ANS:'s-ans', MRK:'s-mrk', MRA:'s-mra' }

function fmt(s) {
  const h = Math.floor(s/3600), m = Math.floor((s%3600)/60), sec = s%60
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
}

function getSectionOf(q) {
  if (q <= 25) return 0
  if (q <= 50) return 1
  return 2
}

export default function App() {
  const [phase, setPhase]     = useState('instr') // instr | test | result
  const [cur,   setCur]       = useState(1)
  const [answers, setAnswers] = useState({})       // qNum -> value (0-3 for MCQ, string for INT)
  const [statuses, setStatuses] = useState(() => {
    const s = {}; for (let i=1;i<=75;i++) s[i]=STATUS.NV; return s
  })
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME)
  const [activeSec, setActiveSec] = useState(0)
  const [showConfirm, setShowConfirm] = useState(false)
  const [showSol, setShowSol]     = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const timerRef = useRef(null)
  const intRef   = useRef(null)

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

  // sync active section tab when current question changes
  useEffect(() => { setActiveSec(getSectionOf(cur)) }, [cur])

  const startTest = () => {
    setStatuses(prev => ({ ...prev, 1: STATUS.NA }))
    setPhase('test')
  }

  const doSubmit = useCallback(() => {
    clearInterval(timerRef.current)
    setSubmitted(true)
    setPhase('result')
  }, [])

  const goTo = useCallback((q) => {
    setStatuses(prev => {
      const n = { ...prev }
      // mark current before leaving
      const curAns = answers[cur]
      if (n[cur] === STATUS.NV || n[cur] === STATUS.NA) {
        n[cur] = (curAns !== undefined && curAns !== '') ? STATUS.ANS : STATUS.NA
      }
      // mark destination as visited
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
    let correct=0, wrong=0, skipped=0, score=0
    const details = []
    for (let q=1; q<=75; q++) {
      const userAns = answers[q]
      const correct_ans = ANSWERS[q]
      const isInt = INT_QS.has(q)
      let status, qscore

      if (isInt) {
        const userNum = userAns !== undefined && userAns !== '' ? Number(userAns) : undefined
        if (userNum === undefined || isNaN(userNum)) {
          status='skipped'; qscore=0; skipped++
        } else if (userNum === correct_ans) {
          status='correct'; qscore=MARKS_CORRECT; correct++; score+=qscore
        } else {
          status='wrong'; qscore=MARKS_WRONG; wrong++; score+=qscore
        }
        details.push({ q, isInt, userAns: userNum, correct_ans, status, score: qscore })
      } else {
        if (userAns === undefined) {
          status='skipped'; qscore=0; skipped++
        } else if (userAns === correct_ans) {
          status='correct'; qscore=MARKS_CORRECT; correct++; score+=qscore
        } else {
          status='wrong'; qscore=MARKS_WRONG; wrong++; score+=qscore
        }
        details.push({ q, isInt, userAns, correct_ans, status, score: qscore })
      }
    }
    return { correct, wrong, skipped, score, maxScore: 75*MARKS_CORRECT, details }
  }

  const answered = Object.keys(answers).filter(q => answers[q] !== '' && answers[q] !== undefined).length
  const markedCt = Object.values(statuses).filter(s => s===STATUS.MRK||s===STATUS.MRA).length

  // ── INSTRUCTIONS ──
  if (phase === 'instr') return (
    <div className="instr-bg">
      <div className="instr-card">
        <div className="instr-hdr">
          <div style={{fontSize:12,opacity:.7}}>Physics Wallah — Lakshya JEE 2026</div>
          <h1>Practice Test — 01</h1>
          <p>Physics · Chemistry · Mathematics &nbsp;|&nbsp; 75 Questions &nbsp;|&nbsp; 300 Marks &nbsp;|&nbsp; 180 Minutes</p>
        </div>
        <div className="instr-body">
          <div className="instr-section">
            <h3>📚 Sections</h3>
            <div className="sec-chips">
              {[['#1a6bbf','#e8f2fc','Physics','Q1–25 (20 MCQ + 5 Integer)'],
                ['#1a8c4e','#e8f8ee','Chemistry','Q26–50 (20 MCQ + 5 Integer)'],
                ['#7b2d8b','#f8e8f8','Mathematics','Q51–75 (20 MCQ + 5 Integer)']].map(([c,bg,name,info])=>(
                <div key={name} className="sec-chip" style={{background:bg,color:c,border:`1px solid ${c}30`}}>
                  <strong>{name}</strong><br/><span style={{fontSize:10,fontWeight:400}}>{info}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="instr-section">
            <h3>📊 Marking Scheme</h3>
            <table className="marks-tbl">
              <thead><tr><th>Question Type</th><th>Correct</th><th>Wrong</th><th>Unattempted</th></tr></thead>
              <tbody>
                <tr><td>MCQ (Single Correct)</td><td style={{color:'#27ae60',fontWeight:700}}>+4</td><td style={{color:'#c0392b',fontWeight:700}}>−1</td><td>0</td></tr>
                <tr><td>Integer Type</td><td style={{color:'#27ae60',fontWeight:700}}>+4</td><td style={{color:'#c0392b',fontWeight:700}}>−1</td><td>0</td></tr>
              </tbody>
            </table>
          </div>

          <div className="instr-section">
            <h3>🎨 Question Status Legend</h3>
            {[
              ['#d0d8e8','Not Visited — You have not opened this question yet'],
              ['#e74c3c','Not Answered — Visited but no answer selected'],
              ['#27ae60','Answered — Answer selected/entered'],
              ['#7b2d8b','Marked for Review — Flagged, no answer'],
              ['#7b2d8b','Marked for Review + Answered — Will be evaluated (green outline)'],
            ].map(([c,t],i)=>(
              <div className="instr-row" key={i}>
                <div className="instr-dot" style={{background:c, outline: i===4?'2px solid #27ae60':''}} />
                <span>{t}</span>
              </div>
            ))}
          </div>

          <div className="instr-section">
            <h3>📌 Instructions</h3>
            {[
              'Each section has 20 Single Correct MCQ questions and 5 Integer Type questions.',
              'For Integer Type: type your numerical answer in the input box (0–999).',
              'Timer counts down from 3:00:00 and the test auto-submits when it reaches zero.',
              '"Mark for Review & Next" flags the question and moves to the next one.',
              'Marked + Answered questions ARE evaluated — the mark is only a reminder.',
              'You can change or clear your answer any number of times before submission.',
              'Navigate between questions using the palette on the right or Prev/Next buttons.',
            ].map((t,i)=>(
              <div className="instr-row" key={i}>
                <span style={{color:SECTIONS[0].color,fontWeight:700,minWidth:18}}>{i+1}.</span>
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
    const pct = Math.max(0, Math.round((score/maxScore)*100))
    const barColor = score < 0 ? '#e74c3c' : score < 120 ? '#e8a020' : '#27ae60'
    const timeTaken = TOTAL_TIME - timeLeft
    const mm = Math.floor(timeTaken/60), ss = timeTaken%60

    return (
      <div className="result-bg">
        <div className="result-card">
          <div className="result-hdr">
            <h2>🎯 Test Completed — Practice Test 01</h2>
            <div style={{fontSize:12,opacity:.75}}>Lakshya JEE 2026 · Physics + Chemistry + Mathematics</div>
            <div className="result-score" style={{color: score<0?'#ff7070':score<120?'#ffe082':'#7effc4'}}>
              {score >= 0 ? `+${score}` : score}
            </div>
            <div style={{fontSize:18,opacity:.7}}>out of {maxScore} marks</div>
            <div style={{fontSize:12,opacity:.75,marginTop:6}}>
              Accuracy: {answered===0?0:Math.round((correct/answered)*100)}% &nbsp;|&nbsp; Time: {mm}m {ss}s
            </div>
          </div>
          <div className="result-body">
            <div className="stats-grid">
              <div className="stat-c g"><div className="val">{correct}</div><div className="lbl">Correct</div></div>
              <div className="stat-c r"><div className="val">{wrong}</div><div className="lbl">Wrong</div></div>
              <div className="stat-c o"><div className="val">{skipped}</div><div className="lbl">Skipped</div></div>
              <div className="stat-c b"><div className="val">{pct}%</div><div className="lbl">Score %</div></div>
            </div>
            <div className="score-bar-wrap">
              <div className="score-bar" style={{width:`${pct}%`,background:barColor}} />
            </div>

            <hr className="result-divider"/>
            <div className="result-sec-title">📝 Section-wise Breakdown</div>

            {SECTIONS.map((sec, si) => {
              const secDetails = details.filter(d => getSectionOf(d.q) === si)
              const secCorrect = secDetails.filter(d=>d.status==='correct').length
              const secWrong   = secDetails.filter(d=>d.status==='wrong').length
              const secScore   = secDetails.reduce((a,d)=>a+d.score,0)
              return (
                <div className="section-result-group" key={sec.id}>
                  <div className="srg-hdr" style={{background:sec.light,color:sec.color}}>
                    <span>{sec.label}</span>
                    <span>{secCorrect} correct · {secWrong} wrong · Score: {secScore>=0?'+'+secScore:secScore}/{25*MARKS_CORRECT}</span>
                  </div>
                  <div className="review-list">
                    {secDetails.map(d => {
                      const cls = d.status==='correct'?'cr':d.status==='wrong'?'wr':d.isInt?'it':'sk'
                      return (
                        <div key={d.q} className={`review-item ${cls}`}>
                          <div className="review-qn">{d.q}</div>
                          <div className="review-info">
                            <div style={{fontWeight:700}}>
                              {d.status==='correct'?'✅ Correct':d.status==='wrong'?'❌ Wrong':d.isInt?'⬜ Integer (Unattempted)':'⬜ Not Attempted'}
                              {d.isInt && <span style={{fontSize:10,marginLeft:6,opacity:.6}}>[Integer]</span>}
                            </div>
                            <div className="review-ans-row">
                              <span className="ra-correct">
                                Correct: {d.isInt ? d.correct_ans : `Option ${LETTERS[d.correct_ans]}`}
                              </span>
                              {d.userAns !== undefined && d.status !== 'correct' && (
                                <span className="ra-user">
                                  Your answer: {d.isInt ? d.userAns : `Option ${LETTERS[d.userAns]}`}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="review-score-val">{d.score>0?`+${d.score}`:d.score}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}

            <div className="result-actions">
              <button className="btn-retake" onClick={()=>{
                setPhase('instr'); setCur(1); setAnswers({})
                setStatuses(()=>{ const s={}; for(let i=1;i<=75;i++) s[i]=STATUS.NV; return s })
                setTimeLeft(TOTAL_TIME); setSubmitted(false); setShowSol(false)
              }}>🔄 Retake Test</button>
            </div>
          </div>
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
      if (idx === correctAns)  c += ' right'
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

  // Section color for active
  const secColor = SECTIONS[activeSec].color

  return (
    <>
      {/* ── HEADER ── */}
      <header className="hdr">
        <div className="hdr-left">
          <div className="hdr-title">Lakshya JEE 2026 — Practice Test 01</div>
          <div className="hdr-sub">Physics · Chemistry · Mathematics &nbsp;|&nbsp; 75 Qs · 300 Marks · +4/−1</div>
        </div>
        <div className="hdr-right">
          {submitted && (() => { const {score,maxScore}=computeResults(); return <div className="hdr-score">Score: {score}/{maxScore}</div> })()}
          <div className="timer">
            <div className="timer-lbl">Time Left</div>
            <div className={`timer-val${isTimeLow?' timer-warn':''}`}>{fmt(timeLeft)}</div>
          </div>
        </div>
      </header>

      {/* ── SECTION TABS ── */}
      <div className="sec-tabs">
        {SECTIONS.map((s,i)=>{
          const answered_in_sec = s.qs.filter(q=>answers[q]!==undefined&&answers[q]!=='').length
          const activeClass = i===activeSec ? `sec-tab active-${s.id==='physics'?'phys':s.id==='chemistry'?'chem':'math'}` : 'sec-tab'
          return (
            <button key={s.id} className={activeClass}
              onClick={()=>{ setActiveSec(i); goTo(s.qs[0]) }}
              style={i===activeSec?{borderColor:s.color,color:s.color}:{}}>
              <span className="sec-tab-label">{s.label}</span>
              <span className="sec-tab-count">{answered_in_sec}/{s.qs.length} done</span>
            </button>
          )
        })}
      </div>

      {/* ── MAIN LAYOUT ── */}
      <div className="layout">

        {/* ── QUESTION PANEL ── */}
        <div className="qpanel" style={{marginRight:'260px'}}>

          {/* Q header */}
          <div className="qhdr">
            <div className="qhdr-left">
              <span className="qnum-badge" style={{color:secColor}}>Q{cur}</span>
              <span className={`qtype-badge ${isMCQ?'qtype-mcq':'qtype-int'}`}>
                {isMCQ ? 'Single Correct' : 'Integer Type'}
              </span>
              {submitted && (() => {
                const isCorrect = isMCQ
                  ? userAns === correctAns
                  : (userAns!==undefined&&userAns!==''&&Number(userAns)===correctAns)
                const isWrong = isMCQ
                  ? userAns !== undefined && userAns !== correctAns
                  : (userAns!==undefined&&userAns!==''&&Number(userAns)!==correctAns)
                return <span className={`qtype-badge ${isCorrect?'qtype-mcq':isWrong?'qtype-int':''}`}
                  style={isCorrect?{background:'#e8f8f0',color:'#27ae60'}:isWrong?{background:'#fdecea',color:'#c0392b'}:{background:'#f4f4f4',color:'#888'}}>
                  {isCorrect?'✅ +4':isWrong?'❌ −1':'⬜ 0'}
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
            <div style={{width:'100%',maxWidth:780}}>
              <div className="qimg-wrap">
                <img src={`/q/q${cur}.jpg`} alt={`Question ${cur}`} draggable={false}/>
              </div>

              {/* MCQ options */}
              {isMCQ && (
                <div className="options-area">
                  <div className="options-lbl">Select your answer</div>
                  <div className="options-grid">
                    {LETTERS.map((l,idx)=>(
                      <button key={idx} className={optClass(idx)}
                        onClick={()=>pickMCQ(idx)} disabled={submitted}>
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
                          <span style={{color:'#c0392b',fontWeight:700}}>❌ Your answer: {userNum}</span>
                          <span style={{color:'#27ae60',fontWeight:700}}>✅ Correct: {correctAns}</span>
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
                      ? `Correct Answer: Option ${LETTERS[correctAns]} (${correctAns+1})`
                      : `Correct Answer: ${correctAns}`
                    }
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom bar */}
          <div className="bbar">
            <button className="btn btn-prev" onClick={()=>goTo(cur-1)} disabled={cur===1}>← Prev</button>
            <button className="btn btn-next" onClick={()=>goTo(cur+1)} disabled={cur===75}>Next →</button>
            {!submitted && <>
              <button className="btn btn-rev" onClick={markReview}>🔖 Mark for Review & Next</button>
              <button className="btn btn-clr" onClick={clearResponse}
                disabled={userAns===undefined||userAns===''}>Clear Response</button>
            </>}
            {submitted && <button className="btn btn-sol" onClick={()=>setShowSol(s=>!s)}>
              {showSol?'🙈 Hide Answer':'💡 Show Answer'}
            </button>}
            {!submitted && <button className="btn btn-sub" onClick={()=>setShowConfirm(true)}>Submit Test ✓</button>}
            {submitted  && <button className="btn btn-res" onClick={()=>setPhase('result')}>📊 View Results</button>}
          </div>
        </div>

        {/* ── PALETTE ── */}
        <div className="palette">
          <div className="pal-hdr">Question Palette</div>
          <div className="pal-legend">
            {[['#d0d8e8','Not Visited'],['#e74c3c','Not Answered'],
              ['#27ae60','Answered'],['#7b2d8b','Marked']].map(([c,l])=>(
              <div className="leg" key={l}><div className="leg-dot" style={{background:c}}/><span>{l}</span></div>
            ))}
          </div>
          <div className="pal-marking">
            <strong>Marking:</strong> MCQ & Integer &nbsp;|&nbsp;
            <span style={{color:'#27ae60',fontWeight:700}}>+4</span> correct &nbsp;
            <span style={{color:'#c0392b',fontWeight:700}}>−1</span> wrong &nbsp; 0 skip
          </div>

          <div className="pal-grid">
            {SECTIONS.map((s,si) => (
              <>
                <div key={`hdr${si}`} style={{
                  gridColumn:'1/-1', fontSize:10, fontWeight:800, color:s.color,
                  background:s.light, padding:'3px 6px', borderRadius:4, marginTop: si>0?4:0
                }}>{s.label}</div>
                {s.qs.map(q => (
                  <button key={q}
                    className={`pb ${statuses[q]}${q===cur?' active':''}`}
                    onClick={()=>goTo(q)}
                    title={`Q${q}${INT_QS.has(q)?' [Int]':''}`}
                    style={INT_QS.has(q)?{borderRadius:'50%'}:{}}
                  >{q}</button>
                ))}
              </>
            ))}
          </div>

          <div className="pal-stats">
            {[
              ['Answered',   Object.values(statuses).filter(s=>s===STATUS.ANS||s===STATUS.MRA).length, '#27ae60'],
              ['Not Answered',Object.values(statuses).filter(s=>s===STATUS.NA).length, '#e74c3c'],
              ['Marked',     markedCt, '#7b2d8b'],
              ['Not Visited',Object.values(statuses).filter(s=>s===STATUS.NV).length, '#999'],
            ].map(([l,v,c])=>(
              <div className="pstat" key={l}><span>{l}</span><span style={{color:c}}>{v}</span></div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CONFIRM MODAL ── */}
      {showConfirm && (
        <div className="modal-bg" onClick={()=>setShowConfirm(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-icon">⚠️</div>
            <div className="modal-title">Submit Test?</div>
            <div className="modal-text">Once submitted, you cannot change your answers.</div>
            <div className="modal-stats">
              {[
                ['✅ Answered', answered],
                ['❌ Not Answered', 75-answered],
                ['🔖 Marked for Review', markedCt],
                ['⏱️ Time Remaining', fmt(timeLeft)],
              ].map(([l,v])=>(
                <div className="msr" key={l}><span>{l}</span><strong>{v}</strong></div>
              ))}
            </div>
            <div className="modal-btns">
              <button className="btn btn-cancel" onClick={()=>setShowConfirm(false)}>Cancel</button>
              <button className="btn btn-confirm" onClick={doSubmit}>Submit Now</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
