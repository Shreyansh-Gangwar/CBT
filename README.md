# JEE CBT Portal

A full JEE Mains/Advanced-style Computer Based Test portal. Deploy on Vercel in minutes.

---

## 📁 Project Structure

```
jee-cbt/
├── index.html
├── app.js                  ← Main app logic (router, CBT, result)
├── styles/
│   └── main.css            ← Full theme system (dark/light)
├── vercel.json             ← Vercel deployment config
└── tests/
    ├── index.js            ← TEST REGISTRY — register all tests here
    └── sample-test-1/
        ├── meta.json       ← Test structure, questions, answers
        ├── physics/
        │   ├── q1.png      ← Question images
        │   ├── q2.png
        │   └── sol1.png    ← Solution images (optional)
        ├── chemistry/
        └── maths/
```

---

## 🚀 Deploy to Vercel

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "initial JEE CBT portal"
git remote add origin https://github.com/YOUR_USERNAME/jee-cbt.git
git push -u origin main

# 2. Go to vercel.com → New Project → Import your repo
# 3. Framework: Other (static)  |  Root: ./
# Done! Live in 30 seconds.
```

---

## ➕ Adding a New Test

### Step 1 — Create the folder structure

```
tests/
└── my-new-test/
    ├── meta.json
    ├── physics/
    │   ├── q1.png
    │   ├── q2.png
    │   └── ...
    ├── chemistry/
    └── maths/
```

### Step 2 — Register in `tests/index.js`

```js
{
  id: "my-new-test",
  title: "JEE Mains 2023 April — Paper 2",
  type: "FULL_PAPER",         // FULL_PAPER | CHAPTERWISE | PYQ | SECTIONAL
  subjects: ["Physics", "Chemistry", "Mathematics"],
  totalQuestions: 90,
  totalMarks: 300,
  recommendedTime: 180,
  difficulty: "Medium",
  year: 2023,
  tags: ["PYQ", "April Session"],
  path: "./tests/my-new-test/meta.json",
},
```

### Step 3 — Fill meta.json (see sample-test-1/meta.json for full schema)

---

## 📄 Question Types Supported

| Type | Description | Marking |
|------|-------------|---------|
| `MCQ` | Single correct, 4 options | +4 / −1 |
| `NUMERICAL` | Integer/decimal answer | +4 / 0 |
| `MSQ` | Multiple correct (JEE Advanced) | +4 full / partial / −2 wrong |
| `MCQ_MULTI` | Alias for MSQ | same |

---

## 🤖 PROMPT — Convert PDF to Test Files

Use this prompt with Claude or GPT-4o Vision to extract questions from a JEE PDF:

---

```
You are a JEE exam digitization assistant. I will provide you pages from a JEE Mains/Advanced paper PDF.

Your job:
1. Extract EVERY question exactly as printed. Do NOT skip any question.
2. For each page I send, extract each question as a SEPARATE image crop.
   - Crop must include: question text, diagrams, graphs, sub-parts, ALL options (A/B/C/D).
   - Crop must NOT include: page header, page number, adjacent questions.
   - If a question spans two pages, combine both crops.
3. Name images: q1.png, q2.png ... for questions; sol1.png, sol2.png ... for solutions.
4. For the answer key page, extract each answer and map it to the correct question number.
5. Output a valid meta.json following this EXACT schema:

{
  "id": "REPLACE_WITH_TEST_ID",
  "title": "REPLACE_WITH_TEST_TITLE",
  "type": "FULL_PAPER",
  "instructions": ["..."],
  "sections": [
    {
      "id": "physics",
      "label": "Physics",
      "color": "#3b82f6",
      "questions": [
        {
          "id": "phy_1",
          "number": 1,
          "type": "MCQ",
          "image": "./tests/TEST_ID/physics/q1.png",
          "options": ["A", "B", "C", "D"],
          "correct": "B",
          "marks": 4,
          "negativeMark": -1,
          "solution": "./tests/TEST_ID/physics/sol1.png",
          "solutionText": "Brief solution explanation here."
        }
      ]
    }
  ]
}

Rules:
- type is "MCQ" for single correct, "NUMERICAL" for integer answer, "MSQ" for multiple correct.
- For NUMERICAL: "correct" is a string like "24" or "3.14", "options" is null.
- For MSQ: "correct" is an array like ["A", "C"], "negativeMark" is -2.
- Every question MUST have an entry. Never guess or skip.
- Do not use LaTeX. All math must be in the image crop.
- Double-check each answer against the answer key before writing it.
- After building the full JSON, re-read it and verify: (a) question count matches PDF, (b) all image paths are correct, (c) all answers are mapped.

Send me the PDF pages now.
```

---

## 🎨 Theme Customization

Edit CSS variables at the top of `styles/main.css`:
- Subject colors: `--color-physics`, `--color-chemistry`, `--color-maths`
- Status colors: `--color-answered`, `--color-not-answered`, etc.

---

## 📐 meta.json Full Schema Reference

```json
{
  "id": "unique-test-id",
  "title": "Test display name",
  "type": "FULL_PAPER",
  "instructions": ["Instruction line 1", "..."],
  "sections": [
    {
      "id": "physics",
      "label": "Physics",
      "color": "#3b82f6",
      "questions": [
        {
          "id": "phy_1",           // Unique ID across entire test
          "number": 1,             // Display number within section
          "type": "MCQ",           // MCQ | NUMERICAL | MSQ | MCQ_MULTI
          "image": "./tests/.../q1.png",
          "options": ["A","B","C","D"],   // null for NUMERICAL
          "correct": "B",          // "A"/"B"/"C"/"D" | "42" | ["A","C"]
          "marks": 4,
          "negativeMark": -1,      // 0 for NUMERICAL, -2 for MSQ wrong
          "solution": "./tests/.../sol1.png",  // null if no image
          "solutionText": "Text explanation...",

          // Optional: per-option images (if options have diagrams)
          "optionAImage": "./tests/.../opt_a.png",
          "optionBImage": "./tests/.../opt_b.png",
          "optionCImage": "./tests/.../opt_c.png",
          "optionDImage": "./tests/.../opt_d.png",

          // Optional: per-option text (if options are text-only)
          "optionAText": "v = u + at",
          "optionBText": "s = ut + ½at²",
          "optionCText": "v² = u² + 2as",
          "optionDText": "All of the above"
        }
      ]
    }
  ]
}
```
