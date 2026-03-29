// ─────────────────────────────────────────────────────────────
//  JEE CBT — Question Bank
//  HOW TO ADD A NEW TEST:
//  1. Create a new entry in the `tests` array below.
//  2. Fill in id, name, subject, chapter, duration (seconds),
//     date, and a `questions` array.
//  3. Each question object:
//     {
//       id: number,
//       section: "Physics" | "Chemistry" | "Mathematics",
//       type: "mcq" | "integer",          // integer = last 5 of each section
//       questionText: "LaTeX/plain text",
//       options: ["A", "B", "C", "D"],    // omit for integer type
//       correctAnswer: 1|2|3|4,           // option number; for integer: the numeric answer as number
//       solution: "Step-by-step solution text",
//     }
//  4. That's it! The app auto-discovers all tests and builds the menu.
// ─────────────────────────────────────────────────────────────

export const tests = [
  {
    id: "pt01",
    name: "Practice Test 01",
    subject: "Physics",           // primary subject label for menu grouping
    subjects: ["Physics", "Chemistry", "Mathematics"],
    chapter: "Electric Charges & Fields | Solutions | Determinants",
    duration: 10800,              // 180 minutes in seconds
    date: "11/05/2025",
    maxMarks: 300,
    totalQuestions: 75,
    questions: [
      // ── SECTION I: PHYSICS (Q1–Q25) ──────────────────────────
      {
        id: 1, section: "Physics", type: "mcq",
        questionText: "A charge q is placed at the mid point of the line joining two equal charges Q. The system of the three charges will be in equilibrium if q is equal to:",
        options: ["−Q/2", "−Q/4", "+Q/4", "+Q/2"],
        correctAnswer: 2,
        solution: "For equilibrium, the force on Q from q must balance the force from the other Q.\n\nFor charge Q at position A (left), force from other Q (at B, right) = kQ²/(2x)² (repulsive, pointing left).\nForce from q (at midpoint C) = kQq/x² (must be attractive, so q is negative).\n\nBalancing: kQ²/4x² = kQq/x²  →  q = −Q/4."
      },
      {
        id: 2, section: "Physics", type: "mcq",
        questionText: "ABC is an equilateral triangle. Three charges +q each are placed at each corner as shown. The electric field intensity at centre O will be:",
        options: ["(1/4πε₀)(√3q/r²)", "(1/4πε₀)(q/r²)", "(1/4πε₀)(3q/r²)", "Zero"],
        correctAnswer: 4,
        solution: "By symmetry, the electric field due to each charge at the centroid O is equal in magnitude (= kq/r²) but the three vectors are directed at 120° to each other.\n\nVector sum: E₁ + E₂ + E₃ = 0 (three equal vectors at 120° cancel).\n\nSo net E = 0."
      },
      {
        id: 3, section: "Physics", type: "mcq",
        questionText: "A charge particle q₁ is at position (2, −1, 3). The electrostatic force on another charged particle q₂ at (0,0,0) is:",
        options: [
          "q₁q₂/(56πε₀) · (2î − ĵ + 3k̂)",
          "(1/4πε₀) · q₁q₂/(√14)³ · (−2î + ĵ − 3k̂)",
          "q₁q₂/(56πε₀) · (ĵ − 2î − 3k̂)",
          "q₁q₂/(56√14πε₀) · (2î − ĵ + 3k̂)"
        ],
        correctAnswer: 2,
        solution: "r⃗_A = 2î − ĵ + 3k̂, r⃗_B = 0\n\nF⃗_BA = (kq₁q₂/|r⃗_B − r⃗_A|³)(r⃗_B − r⃗_A)\n\n|r⃗_A| = √(4+1+9) = √14\n\nF⃗_BA = (1/4πε₀) · q₁q₂/(√14)³ · (−2î + ĵ − 3k̂)"
      },
      {
        id: 4, section: "Physics", type: "mcq",
        questionText: "Two identical simple pendulums A and B are suspended from the same point. The bobs are given positive charges, with A having more charge than B. They diverge and reach equilibrium with A and B making angles θ₁ and θ₂ with the vertical. Which of the following is correct?",
        options: ["θ₁ = θ₂", "θ₁ < θ₂", "θ₁ > θ₂", "The tension in A is greater than tension in B"],
        correctAnswer: 1,
        solution: "By Newton's 3rd Law, the electrostatic force on A due to B is equal and opposite to the force on B due to A.\n\nFor each pendulum: tan θ = F_e/(mg)\n\nSince m and g are identical for both, and F_e (Coulomb force) is the same for both, tan θ₁ = tan θ₂ → θ₁ = θ₂."
      },
      {
        id: 5, section: "Physics", type: "mcq",
        questionText: "An electron falls through a small distance in a uniform electric field of magnitude 2×10⁴ NC⁻¹. The direction of the field is reversed keeping the magnitude unchanged and a proton falls through the same distance. The time of fall will be:",
        options: ["Same in both cases", "More in the case of an electron", "More in the case of proton", "Independent of charge"],
        correctAnswer: 3,
        solution: "For electron (field reversed for proton case): a = qE/m + g\n\nFor electron: a_e = (eE/mₑ + g) — both electric and gravity accelerate it.\nFor proton: a_p = (eE/mₚ + g)\n\nSince mₚ ≫ mₑ, a_p ≪ a_e.\n\nS = ½at² → t = √(2S/a). Smaller acceleration means MORE time.\n\nSo time is more for the proton."
      },
      {
        id: 6, section: "Physics", type: "mcq",
        questionText: "In a region of space the electric field is given by E⃗ = 8î + 4ĵ + 3k̂. The electric flux through a surface of area 100 units in the x-y plane is:",
        options: ["800 units", "300 units", "400 units", "1500 units"],
        correctAnswer: 2,
        solution: "Surface in x-y plane → area vector A⃗ = 100k̂\n\nFlux φ = E⃗ · A⃗ = (8î + 4ĵ + 3k̂) · (100k̂) = 3 × 100 = 300 units.\n\nThe î and ĵ components contribute zero flux through an x-y plane surface."
      },
      {
        id: 7, section: "Physics", type: "mcq",
        questionText: "The figure shows the electric lines of force emerging from a charged body. If the electric fields at A and B are E_A and E_B respectively and if the distance between A and B is r, then:",
        options: ["E_A < E_B", "E_A > E_B", "E_A = E_B/r", "E_A = E_B/r²"],
        correctAnswer: 2,
        solution: "The density of electric field lines represents the magnitude of the electric field.\n\nAt point A, the field lines are denser (closer together) than at point B.\n\nDenser field lines → stronger field. Therefore E_A > E_B."
      },
      {
        id: 8, section: "Physics", type: "mcq",
        questionText: "The charge per unit length of the four quadrants of the ring is 2λ, −2λ, λ and −λ respectively. What is the electric field at the centre?",
        options: ["−λ/(2πε₀R) î", "λ/(2πε₀R) ĵ", "√2λ/(4πε₀R) î", "None of these"],
        correctAnswer: 1,
        solution: "Contributions from symmetrically placed quadrants with +2λ and −2λ give a net field along the negative x-axis.\n\nThe contributions from the +λ and −λ quadrants also combine.\n\nNet electric field: E⃗_net = −λ/(2πε₀R) î (along negative x-axis)."
      },
      {
        id: 9, section: "Physics", type: "mcq",
        questionText: "Which one of the following patterns of electric lines of force CANNOT be possible for the field produced by a static charge?",
        options: ["Pattern 1 (parallel straight lines)", "Pattern 2 (converging at a point)", "Pattern 3 (closed loops)", "Pattern 4 (diverging from a point)"],
        correctAnswer: 3,
        solution: "Electric field lines of a static charge must originate from positive charges and terminate on negative charges.\n\nThey CANNOT form closed loops — the electric field is a conservative field (∮E⃗·dl⃗ = 0).\n\nClosed loops would imply a non-zero curl, which contradicts electrostatics. So pattern 3 (closed loops) is impossible."
      },
      {
        id: 10, section: "Physics", type: "mcq",
        questionText: "Statement-I: A positive point charge initially at rest in a uniform electric field starts moving along electric lines of forces.\nStatement-II: A point charge released from rest in an electric field always moves along the lines of force.",
        options: [
          "Statement-I is True, Statement-II is True; Statement-II is correct explanation for Statement-I.",
          "Statement-I is True, Statement-II is True; Statement-II is NOT a correct explanation for Statement-I.",
          "Statement-I is True, Statement-II is False.",
          "Statement-I is False, Statement-II is True."
        ],
        correctAnswer: 3,
        solution: "Statement-I is TRUE: A positive charge at rest in a uniform electric field experiences force along the field direction (which is the direction of field lines). Since the field is uniform, the lines are straight and the charge moves along them.\n\nStatement-II is FALSE: If the field lines are curved (non-uniform field), a charge released from rest will NOT follow the curved field lines exactly — it follows the path determined by Newton's laws, which is not necessarily along the curved field line."
      },
      {
        id: 11, section: "Physics", type: "mcq",
        questionText: "Two charges q and −3q are placed fixed on x-axis separated by a distance 'd'. Where should a third charge 2q be placed such that it will not experience any force?",
        options: [
          "d/2 · (1+√3) to the left of q",
          "d/2 · (1+√3) to the right of q",
          "d/2 · (1+√5) to the left of q",
          "d/2 · (1+√5) to the right of q"
        ],
        correctAnswer: 1,
        solution: "Let the third charge be at distance x to the left of q.\n\nFor equilibrium: force from q = force from −3q\nkq·2q/x² = k·3q·2q/(x+d)²\n1/x² = 3/(x+d)²\n(x+d)/x = √3\nd/x = √3 − 1\nx = d/(√3−1) = d(√3+1)/2\n\nSo the charge must be placed d/2·(1+√3) to the LEFT of q."
      },
      {
        id: 12, section: "Physics", type: "mcq",
        questionText: "Two particles of equal mass m and charge q are placed at a distance of 16 cm. They do not experience any force. The value of q/m is:",
        options: ["1", "√(πε₀/G)", "√(G/4πε₀)", "√(4πε₀G)"],
        correctAnswer: 4,
        solution: "For no net force, the electrostatic repulsion equals gravitational attraction:\n\nkq²/d² = Gm²/d²\nkq² = Gm²\nq²/m² = G/k = 4πε₀G\nq/m = √(4πε₀G)"
      },
      {
        id: 13, section: "Physics", type: "mcq",
        questionText: "Six charges are kept at the vertices of a regular hexagon as shown. The magnitude of force applied by +Q charge on +q charge is F. If the net electric force on +Q charge is nF then find the value of n.",
        options: ["4", "5", "7", "9"],
        correctAnswer: 4,
        solution: "The charges at vertices are +q, +q, −2q, −3q, +3q, +4q (going around).\n\nUsing superposition, the net force on +Q at the center from all six charges:\n\nThe forces from diametrically opposite pairs combine. After vector addition:\nF_net = √(4F² + 25F² + 25F² + 50F²·cos120°) ... = 9F\n\nSo n = 9."
      },
      {
        id: 14, section: "Physics", type: "mcq",
        questionText: "The intensity of the electric field required to keep a water drop of radius 10⁻⁵ cm just suspended in air when charged with one electron is approximately (g = 10 N/kg, e = 1.6×10⁻¹⁹ C):",
        options: ["260 V/cm", "260 N/C", "130 V/cm", "130 N/C"],
        correctAnswer: 2,
        solution: "For levitation: eE = mg\nm = ρ·(4/3)πr³ = 1000 × (4/3) × (22/7) × (10⁻⁷)³\n= 4.19 × 10⁻¹⁸ kg\n\nE = mg/e = (4.19×10⁻¹⁸ × 10)/(1.6×10⁻¹⁹)\n≈ 260 N/C"
      },
      {
        id: 15, section: "Physics", type: "mcq",
        questionText: "An infinite number of charges, each of charge 1 μC, are placed on the x-axis with coordinates x = 1, 2, 4, 8, … where x is in metres. If a charge of 1 C is kept at the origin, then what is the net force acting on 1 C charge?",
        options: ["9000 N", "12000 N", "24000 N", "36000 N"],
        correctAnswer: 2,
        solution: "F = k × (1 C) × (1 μC) × [1/1² + 1/2² + 1/4² + 1/8² + ...]\n= 9×10⁹ × 10⁻⁶ × Σ(1/4ⁿ) for n=0 to ∞\n= 9×10³ × [1/(1−1/4)]\n= 9×10³ × 4/3\n= 12,000 N"
      },
      {
        id: 16, section: "Physics", type: "mcq",
        questionText: "Two spherical conductors B and C have equal radii and carry equal charges, repelling with force F. A third uncharged sphere (same radius as B) is touched to B, then to C, then removed. The new force of repulsion between B and C is:",
        options: ["F/4", "3F/4", "F/8", "3F/8"],
        correctAnswer: 4,
        solution: "Initial: q_B = q_C = q, F = kq²/r²\n\nStep 1: Uncharged sphere touched to B → charge splits equally: q_B = q/2.\nStep 2: Sphere (with q/2) touched to C → charge splits: q_C = (q + q/2)/2 = 3q/4.\nStep 3: Sphere removed.\n\nNew force: F' = k(q/2)(3q/4)/r² = (3/8)kq²/r² = 3F/8."
      },
      {
        id: 17, section: "Physics", type: "mcq",
        questionText: "Four charges are placed at the circumference of a dial clock as shown. If the clock has only hour hand and a charge q₀ is placed at the centre, then the hour hand points in the direction which shows the time as:",
        options: ["1:30 PM", "7:30 PM", "4:30 PM", "10:30 PM"],
        correctAnswer: 2,
        solution: "Charges: +q at 12, +q at 3, −q at 6, −q at 9 o'clock positions.\n\nNet force on q₀:\n- Forces from +q at 12 and −q at 6 are collinear (12→6 direction), net downward.\n- Forces from +q at 3 and −q at 9 are collinear (3→9 direction), net leftward.\n\nResultant F_net points toward 7:30 direction (down-left at 45° from 6 o'clock).\n\nThe hour hand points to 7:30 PM."
      },
      {
        id: 18, section: "Physics", type: "mcq",
        questionText: "A particle of mass m and charge −q moves diametrically through a uniformly charged sphere of radius R with total charge Q. The angular frequency of the particle's simple harmonic motion, if its amplitude < R, is:",
        options: ["√(qQ/4πε₀mR)", "√(qQ/4πε₀mR²)", "√(qQ/4πε₀mR³)", "√(4πε₀m/qQ)"],
        correctAnswer: 3,
        solution: "Inside a uniformly charged sphere, the electric field at distance r from centre is E = Qr/(4πε₀R³).\n\nForce on charge −q: F = −qQr/(4πε₀R³) = −mω²r\n\nComparing: ω² = qQ/(4πε₀mR³)\n\nω = √(qQ/(4πε₀mR³))"
      },
      {
        id: 19, section: "Physics", type: "mcq",
        questionText: "Three charges, each equal to q, are placed at the three corners of a square of side a. Find the electric field at the fourth corner.",
        options: [
          "(√2+1)q/(8πε₀a²)",
          "(2√2+1)q/(8πε₀a²)",
          "(2√2+1)q/(4πε₀a²)",
          "0"
        ],
        correctAnswer: 2,
        solution: "Let D be the empty corner. Charges at A, B, C.\n- E_A (from adjacent corner A, distance a): kq/a² along DA direction.\n- E_C (from adjacent corner C, distance a): kq/a² along DC direction.\n- E_B (from diagonal corner B, distance a√2): kq/2a² along DB direction.\n\nE_A and E_C are perpendicular, resultant = kq√2/a².\nThis resultant is along the diagonal (same direction as E_B).\n\nTotal: E_D = kq√2/a² + kq/2a² = kq(2√2+1)/2a² = (2√2+1)q/(8πε₀a²)"
      },
      {
        id: 20, section: "Physics", type: "mcq",
        questionText: "Two free point charges +q and +4q are placed at distance x apart. A third charge is so placed that all three charges are in equilibrium. Then:",
        options: [
          "Unknown charge is −4q/9, placed at x/3 from smaller charge",
          "Unknown charge is −9q/4",
          "It should be at x/6 from smaller charge between them",
          "It should be placed at 2x/3 from smaller charge between them"
        ],
        correctAnswer: 1,
        solution: "Let third charge Q be at distance d from +q and (x−d) from +4q.\n\nFor equilibrium of Q: kqQ/d² = k·4qQ/(x−d)² → (x−d)/d = 2 → d = x/3.\n\nFor equilibrium of +q: kq·Q/d² + k·q·4q/x² = 0\nQ = −4q·d²/x² = −4q(x/3)²/x² = −4q/9.\n\nUnknown charge = −4q/9, at x/3 from smaller charge."
      },
      // Integer type questions — Physics
      {
        id: 21, section: "Physics", type: "integer",
        questionText: "Electric field is given in a region E⃗ = (6î + 5ĵ + 3k̂) N/C. Find flux linkage (in SI units) through a surface area 30 m² that is in YZ plane.",
        correctAnswer: 180,
        solution: "Surface in YZ plane → area vector A⃗ = 30î\n\nFlux φ = E⃗ · A⃗ = (6î + 5ĵ + 3k̂) · (30î) = 6 × 30 = 180 Nm²/C"
      },
      {
        id: 22, section: "Physics", type: "integer",
        questionText: "A force of 2.25 N acts on a charge of 15 × 10⁻³ C. Calculate the intensity of electric field at that point (in N/C).",
        correctAnswer: 150,
        solution: "E = F/q = 2.25 / (15×10⁻³) = 2.25/0.015 = 150 N/C"
      },
      {
        id: 23, section: "Physics", type: "integer",
        questionText: "In a certain region of space, there exists a uniform electric field of 2×10³ k̂ Vm⁻¹. A rectangular coil of dimension 10 cm × 20 cm is placed in x–y plane. The electric flux through the coil in Vm is:",
        correctAnswer: 40,
        solution: "E⃗ = 2000 k̂ V/m\nA⃗ = (0.10)(0.20) k̂ = 0.02 k̂ m²\n\nFlux = E⃗ · A⃗ = 2000 × 0.02 = 40 Vm"
      },
      {
        id: 24, section: "Physics", type: "integer",
        questionText: "A particle having a charge of q = 8.85 μC is placed on the axis of a circular ring of radius R = 30 cm. Distance of the particle from centre of the ring is a = 40 cm. Calculate the electric flux passing through the ring [in 10⁵ N/C].",
        correctAnswer: 1,
        solution: "Using flux integral:\nφ = (qa)/(2ε₀) × [1/a − 1/√(a²+R²)]\n= (8.85×10⁻⁶ × 0.4)/(2 × 8.85×10⁻¹²) × [1/0.4 − 1/0.5]\n= 0.4×10⁶ × [2.5 − 2] × 0.5\n= 1×10⁵ N·m²/C"
      },
      {
        id: 25, section: "Physics", type: "integer",
        questionText: "Three point charges of magnitude 5 μC, 0.16 μC, and 0.3 μC are located at vertices A, B, C of a right angled triangle whose sides are AB = 3 cm, BC = 3√2 cm and CA = 3 cm, and point A is the right angle corner. Charge at point A experiences ________ N of electrostatic force due to the other two charges.",
        correctAnswer: 17,
        solution: "F₁ (force from B on A) = kq_A·q_B/AB² = 9×10⁹ × 5×10⁻⁶ × 0.16×10⁻⁶ / (0.03)² = 8 N (along AB)\n\nF₂ (force from C on A) = kq_A·q_C/CA² = 9×10⁹ × 5×10⁻⁶ × 0.3×10⁻⁶ / (0.03)² = 15 N (along AC)\n\nSince angle A = 90°, F₁ ⊥ F₂:\nF_net = √(15² + 8²) = √(225+64) = √289 = 17 N"
      },

      // ── SECTION II: CHEMISTRY (Q26–Q50) ──────────────────────
      {
        id: 26, section: "Chemistry", type: "mcq",
        questionText: "Which of the following is NOT a colligative property?",
        options: ["Vapour pressure", "Depression in freezing point", "Elevation in boiling point", "Osmotic pressure"],
        correctAnswer: 1,
        solution: "Colligative properties depend ONLY on the number of solute particles, not on their nature.\n\nVapour pressure itself is NOT colligative — it depends on the nature of the liquid and temperature. However, the LOWERING of vapour pressure (relative lowering) IS colligative.\n\nDepression in freezing point, elevation in boiling point, and osmotic pressure are all colligative."
      },
      {
        id: 27, section: "Chemistry", type: "mcq",
        questionText: "A solution of acetone in ethanol:",
        options: [
          "Shows a positive deviation from Raoult's law",
          "Behaves like a near ideal solution",
          "Obeys Raoult's law",
          "Shows a negative deviation from Raoult's law"
        ],
        correctAnswer: 1,
        solution: "Acetone-ethanol solution shows POSITIVE deviation from Raoult's law.\n\nReason: In pure ethanol, hydrogen bonds exist between ethanol molecules. In the mixture, acetone (a ketone) disrupts these H-bonds but doesn't form equally strong bonds with ethanol. The A–B interactions are weaker than A–A and B–B interactions, so molecules escape more easily → higher vapor pressure than ideal → positive deviation."
      },
      {
        id: 28, section: "Chemistry", type: "mcq",
        questionText: "What will be the molality of a solution having 18 g of glucose (mol. mass = 180) dissolved in 500 g of water?",
        options: ["1 m", "0.5 m", "0.2 m", "2 m"],
        correctAnswer: 3,
        solution: "Moles of glucose = 18/180 = 0.1 mol\nMass of solvent = 500 g = 0.5 kg\n\nMolality = moles of solute / kg of solvent = 0.1/0.5 = 0.2 m"
      },
      {
        id: 29, section: "Chemistry", type: "mcq",
        questionText: "At 100°C the vapour pressure of a solution of 6.5 g of a solute in 100 g water is 732 mm of Hg. If Kᵦ = 0.52 K/m, the boiling point of this solution will be:",
        options: ["100°C", "102°C", "103°C", "101°C"],
        correctAnswer: 4,
        solution: "Using Raoult's law: (P°−P)/P° = n_B/(n_A+n_B)\n(760−732)/760 = (6.5/M_B)/(100/18 + 6.5/M_B)\nSolving: M_B ≈ 30.58 g/mol\n\nMolality = (6.5/30.58) / (100/1000) = 2.125 mol/kg\nΔT_b = K_b × m = 0.52 × 2.125 ≈ 1.10°C\n\nBoiling point = 100 + 1.10 ≈ 101°C"
      },
      {
        id: 30, section: "Chemistry", type: "mcq",
        questionText: "Calculate the molar mass of a substance whose 7.0% by mass solution in water freezes at −0.93°C. The cryoscopic constant of water is 1.86°C kg mol⁻¹.",
        options: ["140 g mol⁻¹", "150.5 g mol⁻¹", "160 g mol⁻¹", "155 g mol⁻¹"],
        correctAnswer: 2,
        solution: "7% by mass means 7 g solute in 100 g solution → 7 g solute in 93 g solvent.\n\nΔT_f = K_f × m\n0.93 = 1.86 × (7/M) / (93/1000)\n0.93 = 1.86 × 7000 / (93M)\nM = 1.86 × 7000 / (93 × 0.93) = 150.5 g/mol"
      },
      {
        id: 31, section: "Chemistry", type: "mcq",
        questionText: "Which one of the following statements is false?",
        options: [
          "Raoult's law states that the vapour pressure of a component over a solution is proportional to its mole fraction.",
          "Two sucrose solutions of the same molality prepared in different solvents will have the same freezing point depression.",
          "The correct order of osmotic pressure for 0.01 M aqueous solutions is BaCl₂ > KCl > CH₃COOH > Sucrose.",
          "The osmotic pressure π = MRT, where M is the molarity of the solution."
        ],
        correctAnswer: 2,
        solution: "Statement 2 is FALSE.\n\nThe freezing point depression ΔT_f = K_f × m, where K_f depends on the solvent. Different solvents have different K_f values, so even at the same molality, the freezing point depression will be different in different solvents."
      },
      {
        id: 32, section: "Chemistry", type: "mcq",
        questionText: "The unit of cryoscopic constant is:",
        options: ["K·g/mol", "Kg/mol·K", "K·Kg/mol", "mol/Kg·K"],
        correctAnswer: 3,
        solution: "K_f = ΔT_f / m\nUnit of ΔT_f = K (Kelvin)\nUnit of molality m = mol/kg\n\nUnit of K_f = K / (mol/kg) = K·kg/mol"
      },
      {
        id: 33, section: "Chemistry", type: "mcq",
        questionText: "Assertion A: Boiling point of 1 m Al₂(SO₄)₃ is greater than that of 1 m NaCl.\nReason R: Van't Hoff factor of Al₂(SO₄)₃ is lower than that of NaCl.",
        options: [
          "A is true but R is false.",
          "A is false but R is true.",
          "Both A and R are true and R is the correct explanation of A.",
          "Both A and R are true but R is NOT the correct explanation of A."
        ],
        correctAnswer: 1,
        solution: "Assertion A is TRUE: Al₂(SO₄)₃ → 2Al³⁺ + 3SO₄²⁻, so i = 5. NaCl → Na⁺ + Cl⁻, so i = 2. Since i_Al₂(SO₄)₃ > i_NaCl, the elevation in boiling point is greater for Al₂(SO₄)₃.\n\nReason R is FALSE: Van't Hoff factor of Al₂(SO₄)₃ (i=5) is actually GREATER than that of NaCl (i=2), not lower.\n\nSo A is true, R is false."
      },
      {
        id: 34, section: "Chemistry", type: "mcq",
        questionText: "Match the laws given in Column-I with expressions in Column-II:\n(A) Raoult's law  (B) Henry's law  (C) Elevation in boiling point  (D) Depression in freezing point  (E) Osmotic pressure\n(P) ΔT_f = K_f·m  (Q) π = CRT  (R) p = χ₁p₁° + χ₂p₂°  (S) ΔT_b = K_b·m  (T) P = K_H·χ",
        options: [
          "A→R; B→T; C→S; D→P; E→Q",
          "A→P; B→B; C→R; D→T; E→S",
          "A→Q; B→R; C→T; D→S; E→P",
          "A→T; B→S; C→P; D→Q; E→R"
        ],
        correctAnswer: 1,
        solution: "Raoult's law: p = χ₁p₁° + χ₂p₂° → (R)\nHenry's law: P = K_H·χ → (T)\nElevation in boiling point: ΔT_b = K_b·m → (S)\nDepression in freezing point: ΔT_f = K_f·m → (P)\nOsmotic pressure: π = CRT → (Q)\n\nCorrect match: A→R, B→T, C→S, D→P, E→Q"
      },
      {
        id: 35, section: "Chemistry", type: "mcq",
        questionText: "The van't Hoff factor for 0.1 M Ba(NO₃)₂ solution is 2.74. The degree of dissociation is:",
        options: ["91.3%", "87%", "100%", "74%"],
        correctAnswer: 2,
        solution: "Ba(NO₃)₂ → Ba²⁺ + 2NO₃⁻ (n = 3 particles)\n\ni = 1 + α(n−1) = 1 + 2α\n2.74 = 1 + 2α\nα = 0.87 = 87%"
      },
      {
        id: 36, section: "Chemistry", type: "mcq",
        questionText: "A membrane which allows the movement of only solvent particles through it is called:",
        options: ["Animal membrane", "Plant membrane", "Semipermeable membrane", "Permeable membrane"],
        correctAnswer: 3,
        solution: "A semipermeable membrane selectively allows only solvent molecules (e.g., water) to pass through while preventing solute particles.\n\nThis property is used in osmosis. Examples: cellophane, parchment paper, animal bladder."
      },
      {
        id: 37, section: "Chemistry", type: "mcq",
        questionText: "The value of Henry's law constant:",
        options: [
          "Increases with increase in temperature.",
          "Decreases with increase in temperature",
          "Increases with decrease in temperature.",
          "Independent of temperature and depends only on pressure."
        ],
        correctAnswer: 1,
        solution: "Henry's law: P = K_H × χ (mole fraction)\n\nK_H increases with increasing temperature. This means gases become less soluble at higher temperatures (more gas escapes), which is consistent with the fact that K_H (the proportionality constant) increases — you need more pressure to dissolve the same amount at higher temperature."
      },
      {
        id: 38, section: "Chemistry", type: "mcq",
        questionText: "A solution is prepared by adding 4 moles of substance A to 300 g of water. Calculate molality of the solution.",
        options: ["0.1333 m", "1.333 m", "0.0133 m", "13.33 m"],
        correctAnswer: 4,
        solution: "Molality = moles of solute / kg of solvent\n= 4 / (300/1000)\n= 4 / 0.3\n= 13.33 m"
      },
      {
        id: 39, section: "Chemistry", type: "mcq",
        questionText: "At 298 K, the vapour pressure of pure liquid A (MW = 40) is 100 torr, and pure liquid B (MW = 80) is 40 torr. The vapour pressure at 298 K of a solution containing 20 g of each A and B is:",
        options: ["59.8 torr", "80 torr", "48 torr", "68 torr"],
        correctAnswer: 2,
        solution: "Moles of A = 20/40 = 0.5 mol; Moles of B = 20/80 = 0.25 mol\nTotal = 0.75 mol\nχ_A = 0.5/0.75 = 2/3; χ_B = 0.25/0.75 = 1/3\n\nP = χ_A·P°_A + χ_B·P°_B = (2/3)(100) + (1/3)(40) = 66.67 + 13.33 = 80 torr"
      },
      {
        id: 40, section: "Chemistry", type: "mcq",
        questionText: "Colligative properties have many practical uses. Actual practical uses include:\nI: Melting of snow by salt\nII: Desalination of sea water\nIII: Determination of molar mass\nIV: Determination of melting point and boiling point of solvent",
        options: ["I, II", "III, IV", "I, II, III", "II, III, IV"],
        correctAnswer: 3,
        solution: "I. Melting snow by salt: uses freezing point depression (colligative). ✓\nII. Desalination: uses osmosis/reverse osmosis (colligative concept). ✓\nIII. Molar mass determination: via osmotic pressure, boiling point elevation, etc. ✓\nIV. Determining melting/boiling point of SOLVENT is not a practical application of colligative properties.\n\nCorrect: I, II, III"
      },
      {
        id: 41, section: "Chemistry", type: "mcq",
        questionText: "A solution containing 1.8 g of a compound (empirical formula CH₂O) in 40 g of water freezes at −0.465°C. The molecular formula of the compound is (K_f of water = 1.86 kg K mol⁻¹):",
        options: ["C₂H₄O₂", "C₃H₆O₃", "C₄H₈O₄", "C₆H₁₂O₆"],
        correctAnswer: 4,
        solution: "ΔT_f = K_f × m\n0.465 = 1.86 × (1.8/M) / (40/1000)\n0.465 = 1.86 × 1800 / (40M)\nM = 1.86 × 1800 / (40 × 0.465) = 180 g/mol\n\nEmpirical formula mass of CH₂O = 12+2+16 = 30\nn = 180/30 = 6\nMolecular formula = (CH₂O)₆ = C₆H₁₂O₆"
      },
      {
        id: 42, section: "Chemistry", type: "mcq",
        questionText: "Soft drinks and soda water bottles are sealed under high pressure:",
        options: [
          "To increase their taste",
          "To increase the solubility of CO₂",
          "To decrease temperature of the gas dissolved",
          "All of the above"
        ],
        correctAnswer: 2,
        solution: "According to Henry's law: P = K_H × χ (mole fraction of gas)\n\nHigher pressure increases the solubility of CO₂ in water. Bottles are sealed under high pressure to keep more CO₂ dissolved, maintaining carbonation."
      },
      {
        id: 43, section: "Chemistry", type: "mcq",
        questionText: "Of the following measurements, the one most suitable for the determination of the molecular mass of oxyhaemoglobin (molecular mass of many thousands) is:",
        options: [
          "The elevation of the boiling point",
          "The depression of the freezing point",
          "The osmotic pressure",
          "Any of the previous three, as they are all equally good"
        ],
        correctAnswer: 3,
        solution: "For very large molecules (like oxyhaemoglobin, MW ~ 68,000), the changes in boiling/freezing points are extremely small and difficult to measure accurately.\n\nOsmotic pressure gives a much larger, measurable value even for dilute solutions of large molecules. It is the most sensitive method for high molecular weight substances."
      },
      {
        id: 44, section: "Chemistry", type: "mcq",
        questionText: "Elevation in boiling point was 0.52°C when 6 g of a compound X was dissolved in 100 g of water. Molar mass of X is (K_b = 0.52 K kg mol⁻¹):",
        options: ["120", "60", "600", "180"],
        correctAnswer: 2,
        solution: "ΔT_b = K_b × (w/M) / (W/1000)\n0.52 = 0.52 × (6/M) / (100/1000)\n0.52 = 0.52 × 6000/(100M)\n1 = 60/M\nM = 60 g/mol"
      },
      {
        id: 45, section: "Chemistry", type: "mcq",
        questionText: "The relationship between osmotic pressures π₁, π₂ and π₃ at a definite temperature when 1g glucose, 1g urea and 1g sucrose are dissolved in 1 litre of water (assume i=1 for all):",
        options: ["π₁ > π₂ > π₃", "π₃ > π₁ > π₂", "π₂ > π₁ > π₃", "π₂ > π₃ > π₁"],
        correctAnswer: 3,
        solution: "π = CRT = (n/V)RT, so π ∝ moles ∝ 1/M\n\nMolar masses: Glucose = 180, Urea = 60, Sucrose = 342\nMoles from 1g: Glucose = 1/180, Urea = 1/60, Sucrose = 1/342\n\nOrder of moles: Urea (1/60) > Glucose (1/180) > Sucrose (1/342)\n\nSo π₂(urea) > π₁(glucose) > π₃(sucrose)"
      },
      // Integer type — Chemistry
      {
        id: 46, section: "Chemistry", type: "integer",
        questionText: "How many of the following molecules or ionic compounds have van't Hoff factor greater than 2 (if α = 100%)?\nGlucose, Urea, C₂H₅OH, Phenol, CaCl₂, K₄[Fe(CN)₆], HCl and Na₃PO₄",
        correctAnswer: 3,
        solution: "i values (at α=100%):\n- Glucose: i=1 (non-electrolyte)\n- Urea: i=1\n- C₂H₅OH: i=1\n- Phenol: i=1\n- CaCl₂ → Ca²⁺ + 2Cl⁻: i=3 ✓ (>2)\n- K₄[Fe(CN)₆] → 4K⁺ + [Fe(CN)₆]⁴⁻: i=5 ✓ (>2)\n- HCl → H⁺ + Cl⁻: i=2 (not >2)\n- Na₃PO₄ → 3Na⁺ + PO₄³⁻: i=4 ✓ (>2)\n\nCount with i > 2: CaCl₂, K₄[Fe(CN)₆], Na₃PO₄ = 3"
      },
      {
        id: 47, section: "Chemistry", type: "integer",
        questionText: "10 g of a non-volatile solute when dissolved in 100 g benzene raises its boiling point by 1°C. Molar mass of the solute is (K_b for benzene = 2.53 K kg/mol):",
        correctAnswer: 253,
        solution: "ΔT_b = i × K_b × m\n1 = 1 × 2.53 × (10/M) / (100/1000)\n1 = 2.53 × 10/(0.1M)\n1 = 253/M\nM = 253 g/mol"
      },
      {
        id: 48, section: "Chemistry", type: "integer",
        questionText: "The osmotic pressure of a dilute solution is 7 × 10⁵ Pa at 273 K. Osmotic pressure of the same solution at 283 K is ______ × 10⁴ Nm⁻² (Nearest integer).",
        correctAnswer: 73,
        solution: "π = CRT, so π ∝ T (concentration same)\nπ₂/π₁ = T₂/T₁\nπ₂ = 7×10⁵ × (283/273)\n= 7×10⁵ × 1.0366\n= 7.256×10⁵ Pa\n= 72.56 × 10⁴ ≈ 73 × 10⁴ Nm⁻²"
      },
      {
        id: 49, section: "Chemistry", type: "integer",
        questionText: "Calculate the mass percent of a solution obtained by mixing 100 g of 10% urea solution with 150 g of 15% urea solution.",
        correctAnswer: 13,
        solution: "Mass of urea in 100g of 10% solution = 10 g\nMass of urea in 150g of 15% solution = 22.5 g\nTotal urea = 32.5 g\nTotal solution = 250 g\n\nMass percent = (32.5/250) × 100 = 13%"
      },
      {
        id: 50, section: "Chemistry", type: "integer",
        questionText: "If the concentration of glucose (C₆H₁₂O₆) in blood is 0.72 gL⁻¹, the molarity of glucose in blood is ______ × 10⁻³ M (Nearest Integer). (Atomic mass: C=12, H=1, O=16)",
        correctAnswer: 4,
        solution: "MW of glucose = 6(12) + 12(1) + 6(16) = 72+12+96 = 180 g/mol\nMolarity = (0.72 g/L) / (180 g/mol) = 0.004 mol/L = 4 × 10⁻³ M"
      },

      // ── SECTION III: MATHEMATICS (Q51–Q75) ───────────────────
      {
        id: 51, section: "Mathematics", type: "mcq",
        questionText: "If |x  2; 18  x| = |6  2; 18  6|, then x is equal to:",
        options: ["6 only", "±6", "−6 only", "0"],
        correctAnswer: 2,
        solution: "|x  2; 18  x| = x² − 36\n|6  2; 18  6| = 36 − 36 = 0\n\nx² − 36 = 0\nx² = 36\nx = ±6"
      },
      {
        id: 52, section: "Mathematics", type: "mcq",
        questionText: "The value of cofactor of a₂₃ of matrix A = [1 −6 1; 5 2 5; 7 3 0] is equal to:",
        options: ["−45", "45", "47", "−47"],
        correctAnswer: 1,
        solution: "Cofactor of a₂₃ = (−1)^(2+3) × M₂₃\nM₂₃ = minor = |1  −6; 7  3| = 1×3 − (−6)×7 = 3 + 42 = 45\n\nA₂₃ = (−1)^5 × 45 = −45"
      },
      {
        id: 53, section: "Mathematics", type: "mcq",
        questionText: "The value of |0  a−b  a−c; b−a  0  b−c; c−a  c−b  0| is:",
        options: ["a", "b", "0", "None of these"],
        correctAnswer: 3,
        solution: "Apply R₁ → R₁ − R₂ and R₂ → R₂ − R₃:\n\nThe resulting matrix has two identical rows (after operations), leading to a zero determinant.\n\nAlternatively, this is a skew-symmetric matrix of odd order 3, so det = 0."
      },
      {
        id: 54, section: "Mathematics", type: "mcq",
        questionText: "If |2 3 2; x x x; 4 9 1| + 3 = 0, then the value of x is:",
        options: ["3", "0", "−1", "1"],
        correctAnswer: 3,
        solution: "Expanding the determinant:\n2(x−9x) − 3(x−4x) + 2(9x−4x) + 3 = 0\n2(−8x) − 3(−3x) + 2(5x) + 3 = 0\n−16x + 9x + 10x + 3 = 0\n3x + 3 = 0\nx = −1"
      },
      {
        id: 55, section: "Mathematics", type: "mcq",
        questionText: "If x₁, x₂ and y₁, y₂ are roots of 3x²−18x+9=0 and y²−4y+2=0, the value of the determinant |x₁x₂  y₁y₂  1; x₁+x₂  y₁+y₂  2; sin(πx₁x₂)  cos(πy₁y₂/2)  1| is:",
        options: ["0", "1", "2", "None of these"],
        correctAnswer: 1,
        solution: "From 3x²−18x+9=0: x₁+x₂=6, x₁x₂=3\nFrom y²−4y+2=0: y₁+y₂=4, y₁y₂=2\n\nThe determinant becomes:\n|3  2  1|\n|6  4  2|\n|sin3π  cos(π)  1|\n= |3  2  1; 6  4  2; 0  −1  1|\n\nApply R₂ → R₂ − 2R₁:\n|3  2  1; 0  0  0; 0  −1  1| = 0 (row of zeros)"
      },
      {
        id: 56, section: "Mathematics", type: "mcq",
        questionText: "The value of the determinant |bc  ac  ab; a  b  c; a³  b³  c³| is:",
        options: ["(a+b+c)", "a+b+c−ab", "(a²−b²)(b²−c²)(c²−a²)", "a²+b²+c²"],
        correctAnswer: 3,
        solution: "Apply C₁→aC₁, C₂→bC₂, C₃→cC₃, divide by abc:\n\nΔ = (1/abc) |abc  abc  abc; a²  b²  c²; a⁴  b⁴  c⁴|\n= |1  1  1; a²  b²  c²; a⁴  b⁴  c⁴|\n\nThis is a Vandermonde-type determinant = (b²−a²)(c²−a²)(c²−b²)\n= (a²−b²)(b²−c²)(c²−a²)"
      },
      {
        id: 57, section: "Mathematics", type: "mcq",
        questionText: "If |4  −4  0; a  b+4  c; a  b  c+4| = 0, then a+b+c is equal to:",
        options: ["41", "116", "628", "−4"],
        correctAnswer: 4,
        solution: "Apply C₁ → C₁ + C₂ + C₃:\n\n|0  −4  0|\n|a+b+c+4  b+4  c|\n|a+b+c+4  b  c+4|\n\nThis equals 0 when the first column makes the determinant zero:\n(a+b+c+4) = 0\na+b+c = −4"
      },
      {
        id: 58, section: "Mathematics", type: "mcq",
        questionText: "If a²+b²+c²+ab+bc+ca ≤ 0 for all a,b,c ∈ R, then value of the determinant |(a+b+2)²  a²+b²  1; 1  (b+c+2)²  b²+c²; c²+a²  1  (c+a+2)²| is equal to:",
        options: ["65", "a²+b²+c²+31", "4(a²+b²+c²)", "0"],
        correctAnswer: 1,
        solution: "Given a²+b²+c²+ab+bc+ca ≤ 0\n⇒ ½[(a+b)²+(b+c)²+(c+a)²] ≤ 0\nSince each square ≥ 0, we must have a+b=0, b+c=0, c+a=0 ⇒ a=b=c=0\n\nSubstituting a=b=c=0:\n|(2)²  0  1; 1  (2)²  0; 0  1  (2)²|\n= |4  0  1; 1  4  0; 0  1  4|\n= 4(16−0) − 0 + 1(1−0) = 64+1 = 65"
      },
      {
        id: 59, section: "Mathematics", type: "mcq",
        questionText: "The system of linear equations x+y+z=6, x+2y+3z=10 and x+2y+λz=μ has infinite solutions for:",
        options: ["λ=4, μ=10", "λ=5, μ=5", "λ=3, μ=10", "λ=10, μ=3"],
        correctAnswer: 3,
        solution: "D = |1 1 1; 1 2 3; 1 2 λ| = (λ−3)\n\nFor infinite solutions: D=0 → λ=3\n\nWith λ=3: D₁=D₂=D₃=0 needed.\nD₃ = |1 1 6; 1 2 10; 1 2 μ| = μ−10 = 0 → μ=10\n\nAnswer: λ=3, μ=10"
      },
      {
        id: 60, section: "Mathematics", type: "mcq",
        questionText: "The maximum value of the function f(θ) = |1  4cosθ  1; sinθ  1  4cosθ; 1  sinθ  1|:",
        options: ["14", "17", "√17", "√14"],
        correctAnswer: 2,
        solution: "Expanding the determinant and simplifying:\nf(θ) = (sinθ − 4cosθ)²\n\nUsing R₃→R₃−R₁:\nf(θ) = (sinθ−4cosθ)²\n\nMaximum of (sinθ−4cosθ)² = (√(1²+4²))² = 17\n\nMaximum value = 17"
      },
      {
        id: 61, section: "Mathematics", type: "mcq",
        questionText: "The existence of unique solution of the system x+y+z=β, 5x−y+αz=10, 2x+3y−z=6 depends on:",
        options: ["α only", "β only", "α and β both", "Neither α nor β"],
        correctAnswer: 1,
        solution: "D = |1 1 1; 5 −1 α; 2 3 −1|\n= 1(1−3α) − 1(−5−2α) + 1(15+2)\n= 1−3α+5+2α+17\n= 23−α\n\nFor unique solution: D ≠ 0 → α ≠ 23.\nThe condition depends ONLY on α, not on β."
      },
      {
        id: 62, section: "Mathematics", type: "mcq",
        questionText: "Area of the triangle whose vertices are (a, b+c), (b, c+a) and (c, a+b) is:",
        options: ["2 sq units", "3 sq units", "0 sq unit", "None of these"],
        correctAnswer: 3,
        solution: "Area = ½|a  b+c  1; b  c+a  1; c  a+b  1|\n\nNote that x+y = a+(b+c) = b+(c+a) = c+(a+b) = a+b+c for all three vertices.\n\nSince x+y is the same for all three points, all three points lie on the line x+y = a+b+c, making them collinear.\n\nArea = 0 sq units."
      },
      {
        id: 63, section: "Mathematics", type: "mcq",
        questionText: "If a, b, c are real then the value of determinant |a²+1  ab  ac; ab  b²+1  bc; ac  bc  c²+1| = 1 if:",
        options: ["a+b+c=0", "a+b+c=1", "a+b+c=−1", "a=b=c=0"],
        correctAnswer: 4,
        solution: "Multiply R₁ by a, R₂ by b, R₃ by c, then divide by abc:\nThen take a,b,c common from C₁,C₂,C₃.\n\nAfter operations: (1+a²+b²+c²)|...|= 1\n\nThis gives 1+a²+b²+c²=1, so a²+b²+c²=0.\nSince a,b,c are real: a=b=c=0."
      },
      {
        id: 64, section: "Mathematics", type: "mcq",
        questionText: "If A = [5 3 8; 2 0 1; 1 2 3], then find the value of 5A₃₁ + 3A₃₂ + 8A₃₃ (where A_ij is the cofactor of element a_ij of A):",
        options: ["0", "1", "2", "3"],
        correctAnswer: 1,
        solution: "The expression 5A₃₁ + 3A₃₂ + 8A₃₃ represents expansion of det(A) along the third row BUT with elements of the FIRST row (5,3,8) and cofactors of third row.\n\nThis is a property: sum of products of elements of one row with cofactors of a DIFFERENT row = 0.\n\nSo 5A₃₁ + 3A₃₂ + 8A₃₃ = 0."
      },
      {
        id: 65, section: "Mathematics", type: "mcq",
        questionText: "If |1+x  x  x²; x  1+x  x²; x²  x  1+x| = −(x−α₁)(x−α₂)(x−α₃)(x−α₄) is an identity in x, the value of α₁×α₂×α₃×α₄ is:",
        options: ["−1", "2", "4", "6"],
        correctAnswer: 1,
        solution: "Put x=0:\n|1 0 0; 0 1 0; 0 0 1| = 1 = −(−α₁)(−α₂)(−α₃)(−α₄) = −α₁α₂α₃α₄\n\nSo α₁α₂α₃α₄ = −1."
      },
      {
        id: 66, section: "Mathematics", type: "mcq",
        questionText: "If ω is a non-real complex cube root of unity, then |1  ω  ω²; ω  ω²  1; ω²  ω  1| is equal to:",
        options: ["0", "1", "3", "2"],
        correctAnswer: 1,
        solution: "Apply C₁ → C₁+C₂+C₃:\nNew C₁ = [1+ω+ω², ω+ω²+1, ω²+ω+1]ᵀ = [0,0,0]ᵀ\n\nSince 1+ω+ω²=0 for cube roots of unity.\n\nA column of zeros → determinant = 0."
      },
      {
        id: 67, section: "Mathematics", type: "mcq",
        questionText: "The number of values of k for which the linear equations 4x+ky+2z=0, kx+4y+z=0, 2x+2y+z=0 possess a non-zero solution is:",
        options: ["1", "zero", "3", "2"],
        correctAnswer: 4,
        solution: "For non-zero solution: Δ=0\n|4  k  2|\n|k  4  1| = 0\n|2  2  1|\n\n4(4−2) − k(k−2) + 2(2k−8) = 0\n8 − k² + 2k + 4k − 16 = 0\n−k² + 6k − 8 = 0\nk² − 6k + 8 = 0\n(k−2)(k−4) = 0 → k=2 or k=4\n\nTwo values of k."
      },
      {
        id: 68, section: "Mathematics", type: "mcq",
        questionText: "The simultaneous equations kx+2y−z=1, (k−1)y−2z=2, (k+2)z=3 have only one solution when:",
        options: ["k=−2", "k=−1", "k=0", "k=1"],
        correctAnswer: 2,
        solution: "Upper triangular system: det = k(k−1)(k+2) ≠ 0\n\nFor unique solution: k ≠ 0, k ≠ 1, k ≠ −2.\n\nAmong the options, k=−1 is the only value that doesn't make det=0.\n\nSo k=−1 gives only one solution."
      },
      {
        id: 69, section: "Mathematics", type: "mcq",
        questionText: "The number of values of α for which the system x+y+z=α, αx+2αy+3z=−1, x+3αy+5z=4 is inconsistent:",
        options: ["0", "1", "2", "3"],
        correctAnswer: 2,
        solution: "For inconsistency, Δ=0 but at least one Δᵢ≠0.\n\nΔ = |1 1 1; α 2α 3; 1 3α 5|\n= α(5−9α) − (5α−3) + α(3α−2)\n= 3α²−2α − 5α+3 ... solving:\nα²−(5α−3)+3α²−2α = 0 → α=1\n\nAt α=1: Δ=0, Δ₁=7≠0 → inconsistent.\nSo exactly 1 value."
      },
      {
        id: 70, section: "Mathematics", type: "mcq",
        questionText: "If the system of equations x−2y+5z=3, 2x−y+z=1 and 11x−7y+pz=q has infinitely many solutions, then:",
        options: ["p+q=2", "p+q=10", "p−q=2", "p−q=5"],
        correctAnswer: 3,
        solution: "For infinite solutions: Δ=0 and Δ₁=Δ₂=Δ₃=0\n\nΔ=0: Solving → p=10\nΔ₃=0: Solving → q=8\n\np−q = 10−8 = 2"
      },
      // Integer type — Mathematics
      {
        id: 71, section: "Mathematics", type: "integer",
        questionText: "If |1+ax  1+bx  1+cx; 1+a₁x  1+b₁x  1+c₁x; 1+a₂x  1+b₂x  1+c₂x| = A₀+A₁x+A₂x²+A₃x³, then A₀ is equal to:",
        correctAnswer: 0,
        solution: "Put x=0:\n|1  1  1|\n|1  1  1| = A₀\n|1  1  1|\n\nAll three rows are identical → determinant = 0.\n\nSo A₀ = 0."
      },
      {
        id: 72, section: "Mathematics", type: "integer",
        questionText: "For unique values of λ and μ, the system x+y+z=6, x+2y+3z=14, 2x+5y+λz=μ has infinitely many solutions. Then (μ−λ)/4 is equal to:",
        correctAnswer: 7,
        solution: "For infinite solutions: Δ=0 and all Δᵢ=0.\n\nΔ=0: |1 1 1; 1 2 3; 2 5 λ|=0 → λ=8\n\nWith λ=8, solving Δ₁=Δ₂=Δ₃=0: μ=36\n\n(μ−λ)/4 = (36−8)/4 = 28/4 = 7"
      },
      {
        id: 73, section: "Mathematics", type: "integer",
        questionText: "If |3²+k  4²  3²+3+k; 4²+k  5²  4²+4+k; 5²+k  6²  5²+5+k| = 0, then find k.",
        correctAnswer: 1,
        solution: "Apply C₃→C₃−C₁:\n|3²+k  4²  3|\n|4²+k  5²  4|\n|5²+k  6²  5|\n\nApply R₂→R₂−R₁, R₃→R₃−R₂, then R₁→R₁−(R₂+R₃):\nAfter operations: get [2k−2]×(something) = 0\n\n2k−2=0 → k=1"
      },
      {
        id: 74, section: "Mathematics", type: "integer",
        questionText: "If a, b, c are in A.P. then the value of the determinant |2y+4  5y+7  8y+a; 3y+5  6y+8  9y+b; 4y+6  7y+9  10y+c| is:",
        correctAnswer: 0,
        solution: "Apply R₂→2R₂, then R₂→R₂−(R₁+R₃):\n\nSince a,b,c are in AP: 2b=a+c → 2b−(a+c)=0.\n\nThe middle row becomes all zeros after the operation:\n[0  0  2b−(a+c)] = [0  0  0]\n\nDeterminant = 0."
      },
      {
        id: 75, section: "Mathematics", type: "integer",
        questionText: "If pqr≠0 and the system (p+a)x+by+cz=0, ax+(q+b)y+cz=0, ax+by+(r+c)z=0 has a non-trivial solution, then the value of (a/p + b/q + c/r)² is:",
        correctAnswer: 1,
        solution: "For non-trivial solution: Δ=0.\n\nApply R₂→R₂−R₁ and R₃→R₃−R₁:\n|p+a  b  c|\n|−p  q  0|\n|−p  0  r|\n\nExpanding: pqr + q·pc + r·pb − ... = 0\n\nDividing by pqr: a/p + b/q + c/r = −1\n\n(a/p + b/q + c/r)² = (−1)² = 1"
      }
    ]
  }
  // ─────────────────────────────────────────────────────────────
  // ADD MORE TESTS HERE following the same structure
  // ─────────────────────────────────────────────────────────────
];

// Helper: group tests by subject
export const getTestsBySubject = () => {
  const grouped = {};
  tests.forEach(test => {
    const key = test.subject;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(test);
  });
  return grouped;
};

// Helper: get a test by id
export const getTestById = (id) => tests.find(t => t.id === id);
