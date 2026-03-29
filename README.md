# Lakshya JEE 2026 — Practice Test 01

Computer-based test with **75 questions** across Physics, Chemistry, and Mathematics.

## Features
- ✅ 75 questions as crisp images (no LaTeX — renders perfectly)
- 🔘 MCQ (Q1–20, 26–45, 51–70) with A/B/C/D buttons
- 🔢 Integer Type (Q21–25, 46–50, 71–75) with number input box
- ⏱️ 3-hour countdown timer with auto-submit
- 🎨 JEE Main style palette — 5 colour states (round = integer, square = MCQ)
- 🔖 Mark for Review & Next
- ➕4 / ➖1 negative marking for both MCQ and Integer types
- 📊 Section-wise results with per-question breakdown

---

## Run Locally

```bash
unzip jee-practice-test-01.zip
cd jee-full
npm install
npm run dev
```
Open **http://localhost:3000** in your browser.

---

## Push to GitHub

```bash
# Inside the jee-full folder:
git init
git add .
git commit -m "Lakshya JEE Practice Test 01"

# Go to github.com → click "+" → "New repository"
# Name it: jee-practice-test-01
# Keep it public, do NOT add README
# Copy the repo URL, then run:

git remote add origin https://github.com/YOUR_USERNAME/jee-practice-test-01.git
git branch -M main
git push -u origin main
```

---

## Deploy on Vercel

```
1. Go to https://vercel.com and sign in with GitHub

2. Click "Add New Project"

3. Find and click "Import" next to your jee-practice-test-01 repository

4. Framework will be auto-detected as Next.js
   — do NOT change any build settings

5. Click "Deploy"

6. Wait ~60 seconds
   Your live URL will appear, e.g.:
   https://jee-practice-test-01.vercel.app

7. Share the URL with students!
```

---

## Update Questions / Answers Later

```bash
# After editing any file:
git add .
git commit -m "Update answers"
git push

# Vercel auto-redeploys within 30 seconds
```

---

## Folder Structure

```
jee-full/
├── public/
│   └── q/
│       ├── q1.jpg          ← Physics Q1
│       ├── q2.jpg
│       │   ...
│       └── q75.jpg         ← Maths Q75
├── src/
│   ├── app/
│   │   ├── layout.js
│   │   ├── page.js         ← Full test UI
│   │   └── globals.css
│   └── data/
│       └── questions.js    ← All 75 answers
├── next.config.js
└── package.json
```

## Answer Key Reference (from PDF)

| Section | Q Range | MCQ | Integer |
|---------|---------|-----|---------|
| Physics | 1–25 | 1–20 | 21–25 |
| Chemistry | 26–50 | 26–45 | 46–50 |
| Mathematics | 51–75 | 51–70 | 71–75 |

> Integer answers in palette shown with **round** buttons to distinguish from MCQ (square).
