// ============================================================
// TEST REGISTRY
// Add new tests here. Each test folder should contain:
//   - meta.json        (test info, structure, answers)
//   - /physics/        (question images q1.png, q2.png ...)
//   - /chemistry/
//   - /maths/
// Or for single-subject tests, just that subject folder.
// ============================================================

export const TEST_REGISTRY = [
  {
    id: "sample-test-1",
    title: "JEE Mains 2024 — Jan Session Paper 1",
    type: "FULL_PAPER",       // FULL_PAPER | CHAPTERWISE | PYQ | SECTIONAL
    subjects: ["Physics", "Chemistry", "Mathematics"],
    totalQuestions: 90,
    totalMarks: 300,
    recommendedTime: 180,     // minutes
    difficulty: "Medium",
    year: 2024,
    tags: ["PYQ", "Jan Session"],
    path: "./tests/sample-test-1/meta.json",
  },

  // ── TEMPLATE: Copy-paste this block and fill in your details ──
  // {
  //   id: "my-new-test",
  //   title: "JEE Advanced 2023 Paper 1",
  //   type: "FULL_PAPER",
  //   subjects: ["Physics", "Chemistry", "Mathematics"],
  //   totalQuestions: 54,
  //   totalMarks: 180,
  //   recommendedTime: 180,
  //   difficulty: "Hard",
  //   year: 2023,
  //   tags: ["JEE Advanced", "PYQ"],
  //   path: "./tests/my-new-test/meta.json",
  // },
];
