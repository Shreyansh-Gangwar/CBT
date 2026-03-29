// All 20 questions with correct answers extracted from PDF solution pages
// Options index: A=0, B=1, C=2, D=3

export const questions = [
  {
    id: 1,
    options: ["2sin²2θ / sinθ","8cos³θ − 4cosθ + 6","2sin2θ / sinθ","8cos³θ + 4cosθ + 6"],
    answer: 1,
    explanation: "Expand: Δ = C(C²−1) − 1(C−6). With C=2cosθ: Δ = 2cosθ(4cos²θ−1) − (2cosθ−6) = 8cos³θ − 4cosθ + 6."
  },
  {
    id: 2,
    options: ["−2 + √2","2 − √2","−2 − √2","1"],
    answer: 2,
    explanation: "Expanding by Sarrus rule: Δ = 1 + e^(i3π/4) + e^(−i3π/4) − 3 = −2 + 2cos(3π/4) = −2 − √2."
  },
  {
    id: 3,
    options: ["Cannot be less than 1","Is greater than −8","Is less than −8","Must be greater than 8"],
    answer: 1,
    explanation: "Expanding: abc + 2 − (a+b+c) > 0 ⟹ abc > (a+b+c) − 2. Test a=−1, b=0, c=1: abc=0 > −2. Hence abc > −8."
  },
  {
    id: 4,
    options: ["x₁x₂x₃ + y₁y₂y₃","x₁x₂x₃y₁y₂y₃","x₂x₃y₂y₃ + x₃x₁y₃y₁ + x₁x₂y₁y₂","0"],
    answer: 3,
    explanation: "Write Δ = Δ₁ + y₁Δ₂. After C₂→C₂−C₁, C₃→C₃−C₁ on Δ₁: columns become proportional ⟹ Δ₁=0. Similarly Δ₂=0. Hence Δ=0."
  },
  {
    id: 5,
    options: ["1","0","3","2"],
    answer: 3,
    explanation: "Apply C₁→C₁+C₂+C₃. Since a²+b²+c²+2=0, the common factor emerges. After R₁→R₁−R₂, R₂→R₂−R₃: f(x)=(x−1)², degree 2."
  },
  {
    id: 6,
    options: ["25","24","23","21"],
    answer: 3,
    explanation: "Put x=0: a₀ = det([0,−1,3; 1,2,−3; −3,4,0]) = 0(0+12)−(−1)(0−9)+3(4+6) = 0+9+30−18 = 21."
  },
  {
    id: 7,
    options: ["Non-negative","Non-positive","Negative","Positive"],
    answer: 2,
    explanation: "After R₁→R₁−R₂, R₂→R₂−R₃: det = (x−1)²(x−3). For x<1: (x−1)²>0 and (x−3)<0, so det is strictly negative."
  },
  {
    id: 8,
    options: ["[z]","[y]","[x]","None of these"],
    answer: 0,
    explanation: "For −1≤x<0: [x]=−1; 0≤y<1: [y]=0; 1≤z<2: [z]=1. Substituting: det = |0,0,1; −1,1,1; −1,0,2| = 1 = [z]."
  },
  {
    id: 9,
    options: ["2","−2","1/2","−1/2"],
    answer: 3,
    explanation: "det(A⁻¹) = |1,−2; −2,2| = 2−4 = −2. Since det(A) = 1/det(A⁻¹) = 1/(−2) = −1/2."
  },
  {
    id: 10,
    options: ["(14)⁴","(14)³","(14)²","(14)¹"],
    answer: 0,
    explanation: "For n=3: det(adj(adj A)) = |A|^((n−1)²) = |A|^4. det(A) = 14, so answer = 14⁴."
  },
  {
    id: 11,
    options: ["f(α) + f(β) + f(λ)","f(α)f(β) + f(β)f(λ) + f(γ) + f(α)","f(α)f(β)f(γ)","−f(α)f(β)f(γ)"],
    answer: 3,
    explanation: "|a,b,c; b,c,a; c,a,b| = −(a³+b³+c³−3abc) = −(a+b+c)(a+bω+cω²)(a+bω²+cω) = −f(α)f(β)f(γ)."
  },
  {
    id: 12,
    options: ["1","−2","2","ω"],
    answer: 2,
    explanation: "After C₂→C₂+C₃ and using 1+ω=−ω²: −x²+4x−4=0 ⟹ (x−2)²=0 ⟹ x=2."
  },
  {
    id: 13,
    options: ["−2","−1","0","1"],
    answer: 2,
    explanation: "cos²54°+sin²54°=1 and cot135°=−1. Apply C₁→C₁+C₂+C₃: each row in C₁ sums to 0 ⟹ det=0."
  },
  {
    id: 14,
    options: ["n","n − 1","n + 1","None of these"],
    answer: 2,
    explanation: "Taking x^5 common, comparing exponent structure for det to vanish ∀x∈R: a+1 = n+2 ⟹ a = n+1."
  },
  {
    id: 15,
    options: ["sin x = 0","cos x = 0","a = 0","cos x = (1+a²)/2a"],
    answer: 0,
    explanation: "After C₁→C₁+C₃−2cosxC₂: (1+a²−2acosx)sinx=0. Since a≠1 means (1+a²)/2a > 1, so cosx>1 is impossible. Hence sinx=0."
  },
  {
    id: 16,
    options: ["C = ϕ","n(B) = n(C)","A = B ∪ C","n(B) = 2n(C)"],
    answer: 1,
    explanation: "C is non-empty (e.g. a permutation matrix with det=−1 exists). By symmetry of row-swaps, n(B)=n(C). Both B and C are subsets of A, and A=B∪C."
  },
  {
    id: 17,
    options: ["−1","1","−2","2"],
    answer: 3,
    explanation: "From det=0 after R₁→R₁−R₂, R₂→R₂−R₃: r(p−a)(q−b)+b(p−a)(r−c)+a(q−b)(r−c)=0. Dividing and rearranging: p/(p−a) + q/(q−b) + r/(r−c) = 2."
  },
  {
    id: 18,
    options: ["n = 2","n = −2","n = −1","n = 1"],
    answer: 2,
    explanation: "RHS degree: (y−z)(z−x)(x−y)·(1/X+1/Y+1/Z) has degree 3−1=2 (if X,Y,Z are x,y,z). LHS column degrees sum: 3n+5. Setting 3n+5=2 gives n=−1."
  },
  {
    id: 19,
    options: ["1","−1","2","0"],
    answer: 3,
    explanation: "The inequality forces (ax−b)²+(bx−c)²+(cx−d)²=0, so a/b=b/c=c/d ⟹ b²=ac ⟹ 2logb=loga+logc. Then R₁→R₁−2R₂ makes first column zero ⟹ det=0."
  },
  {
    id: 20,
    options: ["−6","−5","−4","4"],
    answer: 0,
    explanation: "|A|=5−6=−1. |A²⁰⁰⁹−5A²⁰⁰⁸|=|A²⁰⁰⁸|·|A−5I|=(−1)²⁰⁰⁸·|(−4,2;3,0)|=1·(0−6)=−6."
  },
]
