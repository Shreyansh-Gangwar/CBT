# JEE CBT Platform — Lakshya JEE 2026

A complete Computer Based Test (CBT) web app built with Next.js 14.

## Features
- Multi-test home screen, grouped by subject (Physics / Chemistry / Maths)
- Last attempt score shown on each test card
- Configurable countdown timer with red pulsing warning in last 5 minutes
- JEE Main style question palette (5 colour states)
- Mark for Review & Next, Clear Response
- +4 / −1 / 0 marking scheme
- Confirm dialog before submission
- Post-submission: highlighted correct/wrong answers + solution per question
- Full results screen with section-wise breakdown
- Dark / Light mode toggle
- Works as a static export (Vercel deployment ready)

## Setup

```bash
npm install
npm run dev       # development
npm run build     # production build (static export in /out)
```

## Deployment (Vercel)
Push to GitHub and connect to Vercel. The `output: 'export'` config handles static deployment automatically.

## Adding More Tests

1. Open `src/data/questions.js`
2. Add a new object to the `tests` array:

```js
{
  id: "pt02",                          // unique string id
  name: "Practice Test 02",
  subject: "Physics",                  // for menu grouping
  subjects: ["Physics", "Chemistry", "Mathematics"],
  chapter: "Chapter Name",
  duration: 10800,                     // seconds (180 min)
  date: "DD/MM/YYYY",
  maxMarks: 300,
  totalQuestions: 75,
  questions: [
    {
      id: 1,
      section: "Physics",              // "Physics" | "Chemistry" | "Mathematics"
      type: "mcq",                     // "mcq" | "integer"
      questionText: "Question text here...",
      options: ["Option A", "Option B", "Option C", "Option D"], // MCQ only
      correctAnswer: 2,                // option number (1-4) for MCQ; integer value for integer type
      solution: "Step-by-step solution...",
    },
    // ... 74 more questions
  ]
}
```

3. Save the file — the new test appears automatically in the menu under the correct subject.

## Project Structure
```
src/
  app/
    page.js        ← entire CBT app (single file, client component)
    layout.js
    globals.css
  data/
    questions.js   ← all test data (add new tests here)
```
