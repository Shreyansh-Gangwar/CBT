// Answer key extracted from the PDF answer key page (image 9)
// MCQ answers: 1=A, 2=B, 3=C, 4=D (stored as 0-indexed: A=0,B=1,C=2,D=3)
// Integer answers: stored as the actual number value

export const SECTIONS = [
  { id: 'physics',   label: 'Physics',     color: '#1a6bbf', light: '#e8f2fc', qs: Array.from({length:25}, (_,i)=>i+1) },
  { id: 'chemistry', label: 'Chemistry',   color: '#1a8c4e', light: '#e8f8ee', qs: Array.from({length:25}, (_,i)=>i+26) },
  { id: 'maths',     label: 'Mathematics', color: '#8b1a8c', light: '#f8e8f8', qs: Array.from({length:25}, (_,i)=>i+51) },
]

// MCQ question numbers (options 1-4 → A-D)
export const MCQ_QS = new Set([
  ...Array.from({length:20},(_,i)=>i+1),    // Physics 1-20
  ...Array.from({length:20},(_,i)=>i+26),   // Chemistry 26-45
  ...Array.from({length:20},(_,i)=>i+51),   // Maths 51-70
])

// Integer type question numbers
export const INT_QS = new Set([21,22,23,24,25, 46,47,48,49,50, 71,72,73,74,75])

// Answer key — from answer key sheet (image 9 in uploads)
// MCQ: answer stored as 0-indexed (1→0, 2→1, 3→2, 4→3)
// Integer: stored as the integer value itself
export const ANSWERS = {
  // PHYSICS MCQ (1-20)
  1:  1,  // (2)
  2:  3,  // (4)
  3:  1,  // (2)
  4:  0,  // (1)
  5:  2,  // (3)
  6:  1,  // (2)
  7:  1,  // (2)
  8:  0,  // (1)
  9:  2,  // (3)
  10: 2,  // (3)
  11: 0,  // (1)
  12: 3,  // (4)
  13: 3,  // (4)
  14: 1,  // (2)
  15: 1,  // (2)
  16: 3,  // (4)
  17: 1,  // (2)
  18: 2,  // (3)
  19: 1,  // (2)
  20: 0,  // (1)
  // PHYSICS INTEGER (21-25)
  21: 180,
  22: 150,
  23: 40,
  24: 1,
  25: 17,
  // CHEMISTRY MCQ (26-45)
  26: 0,  // (1)
  27: 0,  // (1)
  28: 2,  // (3)
  29: 3,  // (4)
  30: 1,  // (2)
  31: 1,  // (2)
  32: 2,  // (3)
  33: 0,  // (1)
  34: 0,  // (1)
  35: 1,  // (2)
  36: 2,  // (3)
  37: 0,  // (1)
  38: 3,  // (4)
  39: 1,  // (2)
  40: 2,  // (3)
  41: 3,  // (4)
  42: 1,  // (2)
  43: 2,  // (3)
  44: 1,  // (2)
  45: 2,  // (3)
  // CHEMISTRY INTEGER (46-50)
  46: 3,
  47: 253,
  48: 73,
  49: 13,
  50: 4,
  // MATHS MCQ (51-70)
  51: 1,  // (2)
  52: 0,  // (1)
  53: 2,  // (3)
  54: 2,  // (3)
  55: 0,  // (1)
  56: 2,  // (3)
  57: 3,  // (4)
  58: 0,  // (1) → 65
  59: 2,  // (3)
  60: 1,  // (2)
  61: 0,  // (1)
  62: 2,  // (3)
  63: 3,  // (4)
  64: 0,  // (1)
  65: 0,  // (1)
  66: 0,  // (1)
  67: 3,  // (4)
  68: 1,  // (2)
  69: 1,  // (2)
  70: 2,  // (3)
  // MATHS INTEGER (71-75)
  71: 0,
  72: 7,
  73: 1,
  74: 0,
  75: 1,
}

export const TOTAL_QUESTIONS = 75
export const MARKS_CORRECT = 4
export const MARKS_WRONG = -1
export const TOTAL_TIME = 180 * 60 // 180 minutes in seconds
