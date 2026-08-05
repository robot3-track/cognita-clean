// ─── SAT Question Bank (Digital SAT Standard) ──────────────────────────────────
// Schema:
// R&W: { id, domain, skill, difficulty, stimulus, question, options[4], correct (0-3), explanation }
// Math (MCQ): { id, domain, skill, difficulty, stimulus, question, chart_data, table_data, image_url, options[4], correct (0-3), explanation }
// Math (Grid-In): { id, domain, skill, difficulty, stimulus, question, isGridIn: true, correctAnswers: ["4", "4.0", "12/3"], explanation }

// ─── READING & WRITING QUESTION POOL ──────────────────────────────────────────

export const SAT_RW_QUESTIONS = [
  // ---------------------------------------------------------------------------
  // CRAFT AND STRUCTURE
  // ---------------------------------------------------------------------------
  {
    id: "rw_cs_01",
    domain: "Craft and Structure",
    skill: "Words in Context",
    difficulty: "medium",
    stimulus: "The research team’s findings were initially met with skepticism by the academic community. However, after rigorous peer review and successful replication of the experiments across three independent laboratories, the paper’s conclusions were widely _______ as a major breakthrough in quantum computing.",
    question: "Which choice completes the text with the most logical and precise word or phrase?",
    options: ["embraced", "foreseen", "relinquished", "fabricated"],
    correct: 0,
    explanation: "Choice A is correct. 'Embraced' means accepted enthusiastically. The text contrasts initial skepticism with later acceptance following peer review and successful replication, making 'embraced' logical in context."
  },
  {
    id: "rw_cs_02",
    domain: "Craft and Structure",
    skill: "Text Structure and Purpose",
    difficulty: "hard",
    stimulus: "In her 1928 essay 'How It Feels to Be Colored Me,' Zora Neale Hurston rejects the contemporary tragic view of African American identity, declaring that she is 'not tragically colored.' Rather than viewing historical hardship as an indelible burden, Hurston portrays her identity as a dynamic source of strength and individuality. In doing so, she distinguishes her voice from that of writers who emphasized systemic grievances.",
    question: "Which choice best states the main purpose of the text?",
    options: [
      "To summarize the literary career and major works of Zora Neale Hurston",
      "To highlight Hurston’s unique perspective on identity in her 1928 essay",
      "To argue that 1920s African American literature ignored systemic hardships",
      "To compare Hurston’s fictional characters with those of her contemporaries"
    ],
    correct: 1,
    explanation: "Choice B is correct. The passage focuses specifically on Hurston's 1928 essay and how her perspective differed from others by rejecting a 'tragic view' of identity."
  },
  {
    id: "rw_cs_03",
    domain: "Craft and Structure",
    skill: "Cross-Text Connections",
    difficulty: "hard",
    stimulus: "Text 1:\nPhilosopher Julian Baggini argues that personal identity is not an immutable, single entity, but rather a 'bundle' of interconnected memories, experiences, and desires that change continuously over time. In his view, believing in a permanent core self is a psychological illusion.\n\nText 2:\nNeurologist Dr. Clara Vance asserts that while brain plasticity allows neural networks to reorganize, core autobiographical memory structures remain remarkably stable throughout adulthood, providing a persistent physiological anchor for individual identity.",
    question: "Based on the texts, how would Dr. Vance (Text 2) most likely respond to Baggini's position in Text 1 regarding the 'permanent core self'?",
    options: [
      "By agreeing that personal identity is entirely flexible and lacks any physical foundation in the brain",
      "By arguing that neural structures offer a stable physical basis for identity that Baggini dismisses as an illusion",
      "By claiming that autobiographical memory plays no meaningful role in shaping adult identity",
      "By asserting that psychological illusions are necessary for healthy brain plasticity"
    ],
    correct: 1,
    explanation: "Choice B is correct. Text 1 calls the permanent core self a 'psychological illusion.' Text 2 counters that stable memory structures in the brain provide a 'persistent physiological anchor' for identity, directly challenging Baggini's dismissal."
  },
  {
    id: "rw_cs_04",
    domain: "Craft and Structure",
    skill: "Words in Context",
    difficulty: "easy",
    stimulus: "Although the architect's initial blueprints appeared impossibly complex, the builder assured the client that the structural design was entirely _______ and could be completed within the standard timeline.",
    question: "Which choice completes the text with the most logical and precise word or phrase?",
    options: ["feasible", "superfluous", "redundant", "archaic"],
    correct: 0,
    explanation: "Choice A is correct. 'Feasible' means possible to do easily or conveniently. The context contrasts 'impossibly complex' with the builder's reassurance that it can be constructed on time."
  },

  // ---------------------------------------------------------------------------
  // INFORMATION AND IDEAS
  // ---------------------------------------------------------------------------
  {
    id: "rw_ii_01",
    domain: "Information and Ideas",
    skill: "Command of Evidence (Quantitative)",
    difficulty: "hard",
    stimulus: "A conservation team tracked the percentage of forest cover loss in four biodiversity hotspots between 2010 and 2020. The project leader hypothesized that regions with active community-led enforcement programs experienced significantly less deforestation than those relying solely on federal government oversight.",
    table_data: {
      headers: ["Hotspot Region", "Enforcement Type", "Forest Loss (2010–2020)"],
      rows: [
        ["Region A (Mesoamerica)", "Community-led", "3.2%"],
        ["Region B (Cerrado)", "Federal only", "11.8%"],
        ["Region C (Sundaland)", "Federal only", "14.1%"],
        ["Region D (Madagascar)", "Community-led", "2.9%"]
      ]
    },
    question: "Which choice best uses data from the table to evaluate the researcher's hypothesis?",
    options: [
      "Region A and Region D both lost over 10% of their forest cover despite community programs.",
      "Region B experienced higher deforestation than Region C because both used federal oversight.",
      "Regions A and D, which utilized community-led enforcement, lost under 3.5% of forest cover, compared to over 11% loss in Regions B and C.",
      "Region D experienced less forest loss than Region A, proving federal oversight is ineffective."
    ],
    correct: 2,
    explanation: "Choice C is correct. Regions A (3.2%) and D (2.9%) had community-led programs and lost under 3.5%, whereas federal-only Regions B (11.8%) and C (14.1%) lost far more, supporting the hypothesis."
  },
  {
    id: "rw_ii_02",
    domain: "Information and Ideas",
    skill: "Central Ideas and Details",
    difficulty: "medium",
    stimulus: "In marine ecosystems, kelp forests serve as crucial carbon sinks by absorbing dissolved carbon dioxide during photosynthesis. Recent oceanographic surveys reveal that when kelp fronds break off, a portion sinks into deep sea trenches where the organic carbon remains sequestered for centuries. This discovery suggests that coastal kelp ecosystems play a far larger role in long-term global climate regulation than atmospheric scientists previously estimated.",
    question: "Which choice best states the central idea of the text?",
    options: [
      "Deep sea trenches are devoid of life due to accumulating organic carbon.",
      "Kelp fronds break off primarily due to severe oceanic storm activity.",
      "Coastal kelp forests contribute significantly to long-term climate regulation by burying carbon in deep waters.",
      "Photosynthesis in marine plants is less effective at absorbing carbon than land-based forests."
    ],
    correct: 2,
    explanation: "Choice C is correct. The passage explains how kelp absorbs carbon and sinks to deep trenches for long-term storage, concluding that kelp plays a larger role in long-term climate regulation than previously realized."
  },
  {
    id: "rw_ii_03",
    domain: "Information and Ideas",
    skill: "Inferences",
    difficulty: "hard",
    stimulus: "Archaeologists excavating a 3rd-century BCE trading post in Northern Vietnam discovered Roman glass beads alongside Han Dynasty silk remnants and local bronze tools. Because local artisan workshops of that period lacked the furnace technology required to achieve the melting temperatures necessary for high-silica Roman glass, researchers concluded that _______.",
    question: "Which choice most logically completes the text?",
    options: [
      "local artisans taught Roman glassmakers how to manufacture high-silica glass",
      "the Roman glass beads were brought to the settlement through indirect long-distance trade networks",
      "Han Dynasty merchants produced imitation Roman glass using traditional bronze-melting furnaces",
      "the excavators misdated the trading post to the 3rd century BCE rather than the medieval era"
    ],
    correct: 1,
    explanation: "Choice B is correct. Since local workshops lacked the high-temperature technology to produce the glass locally, the presence of Roman glass indicates it must have been imported via trade networks."
  },

  // ---------------------------------------------------------------------------
  // EXPRESSION OF IDEAS
  // ---------------------------------------------------------------------------
  {
    id: "rw_ei_01",
    domain: "Expression of Ideas",
    skill: "Rhetorical Synthesis",
    difficulty: "medium",
    stimulus: "While taking notes for a research paper, a student recorded the following information:\n• Bioluminescence is the production and emission of light by a living organism.\n• It is primarily caused by a chemical reaction involving the molecule luciferin and the enzyme luciferase.\n• The comb jelly (Mnemiopsis leidyi) uses bioluminescence to startle predators in deep marine environments.\n• The railroad worm (Phrixothrix hirtus) emits red and greenish-yellow light to deter nocturnal predators on land.",
    question: "The student wants to contrast how bioluminescence is used in marine vs. terrestrial organisms. Which choice best uses relevant information from the notes to accomplish this goal?",
    options: [
      "Bioluminescence occurs when luciferin reacts with luciferase in both marine and terrestrial species.",
      "Both the marine comb jelly and terrestrial railroad worm emit light through identical chemical processes.",
      "While the marine comb jelly startles predators in deep ocean waters, the terrestrial railroad worm emits dual-colored light to deter land predators.",
      "The railroad worm is unique because it emits greenish-yellow light in terrestrial habitats."
    ],
    correct: 2,
    explanation: "Choice C is correct. It directly contrasts the marine species (comb jelly in ocean waters) with the terrestrial species (railroad worm on land) and their respective functions."
  },
  {
    id: "rw_ei_02",
    domain: "Expression of Ideas",
    skill: "Transitions",
    difficulty: "easy",
    stimulus: "The solar energy facility in the Mojave Desert was designed to operate at peak capacity during the sunniest months of the year. _______ during extended winter rainstorms, its power generation drops significantly, requiring backup energy from grid storage.",
    question: "Which choice completes the text with the most logical transition?",
    options: ["Consequently", "However", "Furthermore", "In addition"],
    correct: 1,
    explanation: "Choice B is correct. 'However' signals a contrast between peak performance in summer and the drop in power generation during winter rainstorms."
  },
  {
    id: "rw_ei_03",
    domain: "Expression of Ideas",
    skill: "Transitions",
    difficulty: "medium",
    stimulus: "Architect Maya Lin utilized subtle earthworks to create the Vietnam Veterans Memorial, embedding the structure directly into the landscape. _______ for the Civil Rights Memorial, she incorporated water as a central thematic element, sculpting water flowing over dark granite.",
    question: "Which choice completes the text with the most logical transition?",
    options: ["Similarly", "Consequently", "For example", "In contrast"],
    correct: 0,
    explanation: "Choice A is correct. 'Similarly' is appropriate here as it compares two artistic projects by the same architect where natural elements (earthworks, water) are integrated into stone memorials."
  },

  // ---------------------------------------------------------------------------
  // STANDARD ENGLISH CONVENTIONS
  // ---------------------------------------------------------------------------
  {
    id: "rw_sec_01",
    domain: "Standard English Conventions",
    skill: "Boundaries (Punctuation)",
    difficulty: "easy",
    stimulus: "In 1912, German meteorologist Alfred Wegener proposed the theory of continental _______ however, his ideas were largely dismissed by geologists at the time due to the lack of an identified driving mechanism.",
    question: "Which choice completes the text so that it conforms to the conventions of Standard English?",
    options: ["drift;", "drift", "drift,", "drift:"],
    correct: 0,
    explanation: "Choice A is correct. A semicolon (;) is needed to link two independent clauses connected by the conjunctive adverb 'however'."
  },
  {
    id: "rw_sec_02",
    domain: "Standard English Conventions",
    skill: "Form, Structure, and Sense (Subject-Verb Agreement)",
    difficulty: "medium",
    stimulus: "The collection of rare manuscripts, which includes several 15th-century illuminated psalters and rare maps, _______ stored in a climate-controlled vault under the university library.",
    question: "Which choice completes the text so that it conforms to the conventions of Standard English?",
    options: ["are", "is", "were", "have been"],
    correct: 1,
    explanation: "Choice B is correct. The singular subject 'The collection' requires the singular verb 'is'. The nonessential clause 'which includes...' does not change the subject."
  },
  {
    id: "rw_sec_03",
    domain: "Standard English Conventions",
    skill: "Form, Structure, and Sense (Modifiers)",
    difficulty: "hard",
    stimulus: "Having spent months cataloging indigenous plant species in the Amazon Basin, _______.",
    question: "Which choice completes the text so that it conforms to the conventions of Standard English?",
    options: [
      "a comprehensive botanical report was drafted by Dr. Elena Torres",
      "Dr. Elena Torres drafted a comprehensive botanical report",
      "the field research yielded a comprehensive botanical report",
      "the university received a comprehensive botanical report from Dr. Elena Torres"
    ],
    correct: 1,
    explanation: "Choice B is correct. The introductory modifying phrase 'Having spent months cataloging...' must logically modify the subject following the comma. 'Dr. Elena Torres' is the person who spent months cataloging."
  }
];

// ─── MATH QUESTION POOL ────────────────────────────────────────────────────────

export const SAT_MATH_QUESTIONS = [
  // ---------------------------------------------------------------------------
  // ALGEBRA
  // ---------------------------------------------------------------------------
  {
    id: "m_alg_01",
    domain: "Algebra",
    skill: "Linear Equations in Two Variables",
    difficulty: "medium",
    stimulus: null,
    question: "A catering company charges a flat setup fee of $150 plus $25 per guest for a banquet dinner. If the total bill for an event was $1,900, how many guests attended the banquet?",
    options: ["65", "70", "75", "80"],
    correct: 1,
    explanation: "Choice B is correct. Let g be the number of guests. 25g + 150 = 1900. Subtract 150: 25g = 1750. Divide by 25: g = 70."
  },
  {
    id: "m_alg_02",
    domain: "Algebra",
    skill: "Systems of Linear Equations",
    difficulty: "hard",
    stimulus: null,
    question: "In the system of equations below, k is a constant:\n3x + 6y = 12\nkx + 4y = 8\nFor what value of k does the system have infinitely many solutions?",
    isGridIn: true,
    correctAnswers: ["2", "2.0"],
    explanation: "For a system to have infinitely many solutions, the equations must be proportional. Notice that the constant in equation 1 (12) multiplied by (2/3) gives the constant in equation 2 (8): 12 * (2/3) = 8. Checking the y-coefficients: 6 * (2/3) = 4. Therefore, k = 3 * (2/3) = 2."
  },
  {
    id: "m_alg_03",
    domain: "Algebra",
    skill: "Linear Inequalities",
    difficulty: "easy",
    stimulus: null,
    question: "Which of the following values of x satisfies the inequality 4x - 7 > 21?",
    options: ["5", "6", "7", "8"],
    correct: 3,
    explanation: "Choice D is correct. Add 7: 4x > 28. Divide by 4: x > 7. Among the options, only 8 is strictly greater than 7."
  },

  // ---------------------------------------------------------------------------
  // ADVANCED MATH
  // ---------------------------------------------------------------------------
  {
    id: "m_adv_01",
    domain: "Advanced Math",
    skill: "Nonlinear Equations and Functions",
    difficulty: "hard",
    stimulus: null,
    question: "The function f is defined by f(x) = 3x² - 12x + 14. What is the minimum value of f(x)?",
    isGridIn: true,
    correctAnswers: ["2", "2.0"],
    explanation: "The minimum of f(x) = ax² + bx + c occurs at x = -b / (2a). Here x = -(-12)/(2*3) = 2. Evaluate f(2) = 3(2)² - 12(2) + 14 = 12 - 24 + 14 = 2."
  },
  {
    id: "m_adv_02",
    domain: "Advanced Math",
    skill: "Equivalent Expressions",
    difficulty: "medium",
    stimulus: null,
    question: "Which of the following expressions is equivalent to (2x + 5)(3x - 4)?",
    options: [
      "6x² - 20",
      "6x² + 7x - 20",
      "6x² - 7x - 20",
      "6x² + 23x - 20"
    ],
    correct: 1,
    explanation: "Choice B is correct. Expand: (2x)(3x) + (2x)(-4) + (5)(3x) + (5)(-4) = 6x² - 8x + 15x - 20 = 6x² + 7x - 20."
  },
  {
    id: "m_adv_03",
    domain: "Advanced Math",
    skill: "Radicals and Rational Exponents",
    difficulty: "hard",
    stimulus: null,
    question: "If x > 0 and x^(3/4) = 27, what is the value of x?",
    isGridIn: true,
    correctAnswers: ["81", "81.0"],
    explanation: "Raise both sides to the power of 4/3: x = (27)^(4/3). Cube root of 27 is 3. 3^4 = 81."
  },

  // ---------------------------------------------------------------------------
  // PROBLEM-SOLVING AND DATA ANALYSIS
  // ---------------------------------------------------------------------------
  {
    id: "m_psda_01",
    domain: "Problem-Solving and Data Analysis",
    skill: "Percentages & Data Interpretation",
    difficulty: "medium",
    chart_data: {
      type: "bar",
      title: "Quarterly Revenue (in Thousands of Dollars)",
      x_key: "quarter",
      y_keys: ["revenue"],
      x_label: "Quarter",
      y_label: "Revenue ($K)",
      data: [
        { quarter: "Q1", revenue: 120 },
        { quarter: "Q2", revenue: 150 },
        { quarter: "Q3", revenue: 180 },
        { quarter: "Q4", revenue: 225 }
      ]
    },
    question: "Based on the bar graph above, what was the percent increase in revenue from Q1 to Q4?",
    options: ["46.7%", "50.0%", "87.5%", "105.0%"],
    correct: 2,
    explanation: "Choice C is correct. Percent increase = [(225 - 120) / 120] * 100 = (105 / 120) * 100 = 87.5%."
  },
  {
    id: "m_psda_02",
    domain: "Problem-Solving and Data Analysis",
    skill: "Probability & Two-Way Tables",
    difficulty: "medium",
    table_data: {
      headers: ["Group", "Passed Test", "Failed Test", "Total"],
      rows: [
        ["Study Group A", "42", "8", "50"],
        ["Study Group B", "30", "20", "50"],
        ["Total", "72", "28", "100"]
      ]
    },
    question: "If a student who passed the test is selected at random, what is the probability that the student was in Study Group A?",
    options: ["42/100", "42/50", "42/72", "50/72"],
    correct: 2,
    explanation: "Choice C is correct. Condition: 'a student who passed the test' (total = 72). Favorable outcome: 'in Study Group A' (42). Probability = 42/72."
  },

  // ---------------------------------------------------------------------------
  // GEOMETRY AND TRIGONOMETRY
  // ---------------------------------------------------------------------------
  {
    id: "m_geo_01",
    domain: "Geometry and Trigonometry",
    skill: "Right Triangles and Trigonometry",
    difficulty: "hard",
    stimulus: null,
    question: "In right triangle ABC, angle C is 90°. If sin(A) = 3/5, what is the value of cos(B)?",
    isGridIn: true,
    correctAnswers: ["3/5", "0.6", ".6"],
    explanation: "In a right triangle, complementary acute angles A and B satisfy sin(A) = cos(B). Thus cos(B) = 3/5 or 0.6."
  },
  {
    id: "m_geo_02",
    domain: "Geometry and Trigonometry",
    skill: "Circles",
    difficulty: "hard",
    stimulus: null,
    question: "A circle in the xy-plane has equation (x - 4)² + (y + 3)² = 49. What is the radius of the circle?",
    isGridIn: true,
    correctAnswers: ["7", "7.0"],
    explanation: "The standard equation of a circle is (x - h)² + (y - k)² = r². Here r² = 49, so the radius r = √49 = 7."
  },
  {
    id: "m_geo_03",
    domain: "Geometry and Trigonometry",
    skill: "Area and Volume",
    difficulty: "medium",
    stimulus: null,
    question: "A right cylindrical tank has a radius of 3 meters and a height of 10 meters. What is the total volume of the tank, in cubic meters?",
    options: ["30π", "60π", "90π", "300π"],
    correct: 2,
    explanation: "Choice C is correct. Volume of a cylinder V = πr²h. V = π(3)²(10) = 90π."
  }
];

// ─── HELPER FUNCTIONS FOR MODULE & ADAPTIVE GENERATION ─────────────────────────

/**
 * Returns a set of questions for a specified SAT section (RW or Math)
 * @param {string} section - 'rw' | 'math'
 * @param {number} count - number of questions requested (default 27 for RW, 22 for Math)
 * @param {string} difficulty - 'easy' | 'medium' | 'hard' | 'all'
 */
export function getSatQuestions(section = "rw", count = 20, difficulty = "all") {
  const pool = section === "math" ? [...SAT_MATH_QUESTIONS] : [...SAT_RW_QUESTIONS];
  
  let filtered = pool;
  if (difficulty !== "all") {
    filtered = pool.filter(q => q.difficulty === difficulty);
    if (filtered.length === 0) filtered = pool; // Fallback if pool is empty
  }

  // Shuffle pool
  const shuffled = [...filtered];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Pad if requested count exceeds available pool
  const result = [];
  let idx = 0;
  while (result.length < count) {
    const q = shuffled[idx % shuffled.length];
    result.push({ ...q, instanceId: `${q.id}_${result.length}` });
    idx++;
  }

  return result;
}

/**
 * Validates a student grid-in response against accepted correct answer formats
 * @param {string} userString 
 * @param {Array<string>} correctAnswers 
 */
export function checkGridInAnswer(userString, correctAnswers = []) {
  if (!userString || typeof userString !== "string") return false;
  const cleanUser = userString.trim().toLowerCase();
  
  return correctAnswers.some(ans => {
    const cleanAns = ans.trim().toLowerCase();
    if (cleanUser === cleanAns) return true;

    // Numerical evaluation (e.g. 3/5 vs 0.6)
    try {
      const evalUser = evalFraction(cleanUser);
      const evalAns = evalFraction(cleanAns);
      if (evalUser !== null && evalAns !== null && Math.abs(evalUser - evalAns) < 0.001) {
        return true;
      }
    } catch {
      // Ignore parse errors
    }
    return false;
  });
}

function evalFraction(str) {
  if (str.includes("/")) {
    const parts = str.split("/");
    if (parts.length === 2) {
      const num = parseFloat(parts[0]);
      const den = parseFloat(parts[1]);
      if (!isNaN(num) && !isNaN(den) && den !== 0) return num / den;
    }
  }
  const parsed = parseFloat(str);
  return isNaN(parsed) ? null : parsed;
}
