# JEE Main — Determinants Chapter-wise Test

A fully offline, self-hosted JEE Main style mock test for **Determinants** (20 questions).

## Features
- ✅ 20 MCQ questions displayed as **crisp images** (no LaTeX rendering issues)
- ⏱️ 1-hour countdown timer — auto-submits on expiry
- 🔖 Mark for Review functionality (JEE Main style)
- ➕4 / ➖1 Negative marking scheme
- 🎨 Full question palette with colour-coded status
- 📊 Detailed score summary with answer review & solutions
- 📱 Responsive design

## Project Structure
```
jee-determinants-test/
├── public/
│   └── q/           ← 20 question images (q1.jpg … q20.jpg)
├── src/
│   ├── app/
│   │   ├── layout.js
│   │   ├── page.js      ← Main test UI
│   │   └── globals.css
│   └── data/
│       └── questions.js ← Answers + explanations
├── next.config.js
└── package.json
```

## Deploy to Vercel (Free)

### Step 1 — Push to GitHub
```bash
# In the project folder
git init
git add .
git commit -m "JEE Determinants Test"

# Create a new repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/jee-determinants-test.git
git branch -M main
git push -u origin main
```

### Step 2 — Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) → **Sign in with GitHub**
2. Click **"Add New Project"**
3. Import your `jee-determinants-test` repo
4. Settings will auto-detect Next.js — click **Deploy**
5. Done! Your test is live at `https://jee-determinants-test.vercel.app`

### Step 3 — Run Locally (Optional)
```bash
npm install
npm run dev
# Open http://localhost:3000
```

## Marking Scheme
| Answer | Marks |
|--------|-------|
| Correct | +4 |
| Wrong | −1 |
| Skipped | 0 |

## Question Status Legend
| Colour | Meaning |
|--------|---------|
| 🔘 Grey | Not visited |
| 🔴 Red | Visited, not answered |
| 🟢 Green | Answered |
| 🟣 Purple | Marked for review |
| 🟣+outline | Marked for review + Answered (will be evaluated) |
