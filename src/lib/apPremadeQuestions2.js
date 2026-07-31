// ─── AP Premade Question Bank — Part 2 ───────────────────────────────────────
// Additional subjects: World History, Chemistry, Statistics, US Gov, Calc BC, Microecon

// ─── AP World History ─────────────────────────────────────────────────────────
export const AP_WORLD_HISTORY_V1 = {
  mcq: [
    {
      question: "The excerpt BEST illustrates which characteristic of the Mongol Empire in the 13th century?",
      stimulus: "The Mongols showed a remarkable tolerance for the religions of conquered peoples. Genghis Khan exempted clergy of all religions from taxation. In Persia, the Ilkhanate court included Buddhist, Christian, Muslim, and Zoroastrian advisors simultaneously. A papal envoy sent to the Mongol court reported that Christian services were openly conducted in the khan's camp.",
      stimulus_source: "Adapted from J.J. Saunders, The History of the Mongol Conquests, 1971",
      stimulus_header: "Questions 1–2 refer to the following passage.",
      options: [
        "Mongol rulers converted to each religion of conquered peoples to consolidate power",
        "Religious tolerance was a pragmatic tool for maintaining control over diverse subject populations",
        "The Mongols created a unified monotheistic religion across Eurasia",
        "Religious diversity undermined Mongol political authority in the long run"
      ],
      correct: 1,
      explanation: "The Mongols practiced religious tolerance primarily as a pragmatic administrative strategy — exempting clergy from taxation prevented resistance, while allowing religious diversity prevented unified opposition. This 'imperial tolerance' was characteristic of large conquest empires seeking to administer heterogeneous populations.",
      skill: "Unit 3: Empires and Exchange Networks",
      difficulty: "medium"
    },
    {
      question: "The map shows the Silk Road trade network at its height (~1250 CE). Which conclusion is MOST directly supported by the route patterns shown?",
      map_description: "A trade route map of Eurasia circa 1250 CE showing the Silk Road network. Land routes connect Chang'an/Beijing westward through Dunhuang, Samarkand, and Baghdad to Constantinople and Venice. Sea routes connect Guangzhou through the Strait of Malacca, across the Indian Ocean to Calicut and Hormuz, then to Aden and Alexandria. Goods: silk and porcelain moving westward; gold, silver, and horses moving eastward.",
      stimulus_source: "Adapted from Janet Abu-Lughod, Before European Hegemony, 1989",
      options: [
        "Trade flowed exclusively overland due to dangers of Indian Ocean navigation",
        "The Silk Road connected multiple civilizations across Eurasia and facilitated the exchange of goods, ideas, and diseases",
        "Chang'an was the primary terminus for both land and sea routes",
        "Islamic merchants were excluded from Silk Road trade by Mongol restrictions"
      ],
      correct: 1,
      explanation: "The Silk Road (both overland and maritime) connected East Asia, Central Asia, the Middle East, and Europe, facilitating not only luxury goods exchange but also the spread of Buddhism, Islam, and the Black Death. No single civilization controlled these networks exclusively.",
      skill: "Unit 3: Land-Based Empires and Exchange Networks",
      difficulty: "medium"
    },
    {
      question: "The table shows demographic data for three regions before and after the Black Death (1347–1353). Which conclusion is BEST supported?",
      table_data: {
        headers: ["Region", "Population ~1340", "Population ~1380", "% Decline", "Recovery by 1500?"],
        rows: [
          ["Western Europe", "74 million", "45 million", "~39%", "Partial (~60M)"],
          ["China (Yuan/early Ming)", "85 million", "65 million", "~24%", "Yes (~100M)"],
          ["Middle East (Mamluk)", "8 million", "4 million", "~50%", "No (~6M)"]
        ]
      },
      stimulus_source: "Adapted from William McNeill, Plagues and Peoples, 1976",
      options: [
        "The Black Death affected all regions equally",
        "Regional variations in mortality reflect differences in population density, trade connectivity, and institutional responses",
        "China experienced greater mortality than Europe due to its position as the pandemic's origin point",
        "The Middle East recovered fastest due to its central position in global trade networks"
      ],
      correct: 1,
      explanation: "The significant variation in mortality rates (Western Europe 39%, China 24%, Middle East 50%) reflects the complex interaction of population density, sanitation, urban crowding, trade exposure, and institutional healthcare capacity. The Mamluk Sultanate's high mortality and slow recovery reflects its dense urban-trade network.",
      skill: "Unit 3: Transoceanic Interconnections — Disease",
      difficulty: "hard"
    },
    {
      question: "The Atlantic slave trade graph shows the volume of enslaved Africans transported by century. Which pattern is MOST historically significant?",
      chart_data: {
        type: "bar",
        title: "Estimated Volume of Atlantic Slave Trade by Century",
        data: [
          { century: "1501-1600", enslaved_thousands: 328 },
          { century: "1601-1700", enslaved_thousands: 1875 },
          { century: "1701-1800", enslaved_thousands: 6133 },
          { century: "1801-1900", enslaved_thousands: 3330 }
        ],
        x_key: "century",
        y_keys: ["enslaved_thousands"],
        x_label: "Century",
        y_label: "Enslaved Persons (thousands)"
      },
      stimulus_source: "Slave Voyages Database, Emory University, 2023",
      options: [
        "The slave trade peaked in the 18th century, coinciding with the height of plantation agriculture in the Americas",
        "The slave trade declined steadily after 1600 due to growing abolitionist sentiment",
        "The 16th century saw the highest volume due to initial Spanish colonization",
        "The 19th century saw higher volumes than the 17th century despite abolitionist legislation"
      ],
      correct: 0,
      explanation: "The 18th century peak (6.1 million) coincides with explosive growth of sugar, tobacco, and cotton plantations in the Caribbean and Americas. The 19th-century decline reflects British abolitionism and the 1807 British ban on the slave trade.",
      skill: "Unit 4: Transoceanic Interconnections — Atlantic System",
      difficulty: "medium"
    },
    {
      question: "Enlightenment political philosophy MOST directly influenced which concept in the excerpt?",
      stimulus: "We hold these truths to be self-evident, that all men are created equal, that they are endowed by their Creator with certain unalienable Rights, that among these are Life, Liberty and the pursuit of Happiness. That to secure these rights, Governments are instituted among Men, deriving their just powers from the consent of the governed.",
      stimulus_source: "Declaration of Independence, Thomas Jefferson, 1776",
      stimulus_header: "Question 5 refers to the following excerpt.",
      options: [
        "The concept of divine right monarchy as articulated by Bossuet",
        "John Locke's natural rights theory and social contract",
        "Thomas Hobbes's Leviathan arguing for absolute sovereign authority",
        "Montesquieu's advocacy for hereditary aristocracy"
      ],
      correct: 1,
      explanation: "The Declaration's language directly echoes John Locke's Second Treatise: natural rights (life, liberty, property), government by consent, and the right to revolt when government violates those rights. Jefferson borrowed heavily from Locke's framework.",
      skill: "Unit 5: Revolutions — Enlightenment Causes",
      difficulty: "easy"
    },
    {
      question: "The table shows adoption of key industrial indicators by country. Which factor MOST explains Britain's head start in industrialization?",
      table_data: {
        headers: ["Country", "First railway (year)", "Steam engines (1850)", "Coal output (tons, 1850)"],
        rows: [
          ["Britain", "1825", "~500,000", "50 million"],
          ["France", "1832", "~27,000", "5 million"],
          ["German states", "1835", "~19,000", "6 million"],
          ["Russia", "1838", "~1,500", "0.3 million"]
        ]
      },
      stimulus_source: "Adapted from Joel Mokyr, The Enlightened Economy, 2009",
      options: [
        "Britain's constitutional monarchy provided stability lacking in continental monarchies",
        "Britain had superior coal and iron resources, a market economy, capital access, colonial trade networks, and early patent protections",
        "Britain's island geography prevented continental competitors from copying innovations",
        "The Church of England's Protestant work ethic uniquely motivated British workers"
      ],
      correct: 1,
      explanation: "Britain's industrial advantage resulted from multiple reinforcing factors: abundant coal/iron, canal infrastructure, agricultural enclosures freeing labor, Glorious Revolution institutions protecting property rights, access to colonial raw materials, and patent protection since 1624. No single factor explains it alone.",
      skill: "Unit 5: Industrialization — Causes and Spread",
      difficulty: "hard"
    },
    {
      question: "Which of the following BEST explains how the Berlin Conference (1884–1885) accelerated European imperialism in Africa?",
      options: [
        "It gave African chiefs the opportunity to negotiate treaty terms with European powers",
        "It established rules for colonization that legitimized European territorial claims and prevented conflict among European powers",
        "It created a free-trade zone allowing African merchants to sell goods directly to European markets",
        "It required European powers to develop infrastructure in any territory they claimed"
      ],
      correct: 1,
      explanation: "The Berlin Conference formalized the 'Scramble for Africa' by establishing rules: effective occupation was required to claim territory, and powers had to notify each other of new claims. African representatives were entirely absent. By 1914, 90% of Africa was European-controlled.",
      skill: "Unit 6: New Imperialism",
      difficulty: "medium"
    },
    {
      question: "Which development MOST directly caused the shift to second-phase globalization in the late 19th century?",
      options: [
        "The invention of the printing press enabling mass communication",
        "The construction of the Suez Canal, transcontinental railroads, and submarine telegraph cables",
        "The adoption of the gold standard by major economies",
        "The establishment of international trade organizations"
      ],
      correct: 1,
      explanation: "The 'second phase' of globalization (1850–1914) was enabled by the Suez Canal (1869), transcontinental railroads, and submarine telegraph cables (transatlantic 1866), which collectively compressed space and time for trade and communication.",
      skill: "Unit 6: Industrial Age — Technology and Globalization",
      difficulty: "medium"
    },
    {
      question: "The Haitian Revolution (1791–1804) was historically unique because it was:",
      options: [
        "The first successful revolt against colonial rule anywhere in the Americas",
        "The only successful large-scale slave revolt that produced an independent nation",
        "Inspired directly by the French Revolution without Haitian initiative",
        "Led by free mixed-race planters who later reimposed a caste system"
      ],
      correct: 1,
      explanation: "Led by Toussaint Louverture and Jean-Jacques Dessalines, enslaved people defeated the French, Spanish, and British armies and established Haiti in 1804 — the first Black republic and only successful mass slave rebellion resulting in permanent abolition and national independence.",
      skill: "Unit 5: Revolutions — Atlantic World",
      difficulty: "medium"
    },
    {
      question: "The graph shows GDP per capita by world region from 1500–2000. Which interpretation is MOST supported by the divergence visible after 1820?",
      chart_data: {
        type: "line",
        title: "GDP Per Capita by World Region, 1500–2000 (1990 International $)",
        data: [
          { year: "1500", western_europe: 771, china: 600, africa: 400 },
          { year: "1700", western_europe: 1024, china: 600, africa: 421 },
          { year: "1820", western_europe: 1202, china: 600, africa: 420 },
          { year: "1870", western_europe: 2087, china: 530, africa: 444 },
          { year: "1913", western_europe: 3457, china: 552, africa: 585 },
          { year: "1950", western_europe: 4594, china: 439, africa: 852 },
          { year: "1973", western_europe: 11417, china: 839, africa: 1365 },
          { year: "2000", western_europe: 19002, china: 3425, africa: 1489 }
        ],
        x_key: "year",
        y_keys: ["western_europe", "china", "africa"],
        x_label: "Year",
        y_label: "GDP Per Capita (1990 Int'l $)"
      },
      stimulus_source: "Adapted from Angus Maddison, The World Economy: Historical Statistics, 2003",
      options: [
        "China experienced the same economic growth as Western Europe after 1820",
        "The Great Divergence after 1820 reflects differential industrialization, with Western Europe accelerating while Asia and Africa stagnated under colonial extraction",
        "Africa's GDP per capita surpassed China's throughout this period",
        "All regions experienced parallel growth with gaps explained by population differences"
      ],
      correct: 1,
      explanation: "The data shows the 'Great Divergence' — Western Europe's exponential growth after 1820 vs. stagnation/decline in China and Africa. Western Europe leveraged industrialization, colonial resource extraction, and global trade, while China suffered from internal disruption and Africa from colonial exploitation.",
      skill: "Unit 5/6: Industrialization and Imperialism — Global Inequality",
      difficulty: "hard"
    }
  ],
  frq: [
    {
      title: "AP World History FRQ — Comparing Empire-Building Strategies",
      prompt: "Use your knowledge of AP World History to answer all parts of the following question.",
      stimulus: "Between 1450 and 1750, several land-based empires expanded using different methods. The Ottoman Empire expanded through military conquest and absorbed diverse ethnic and religious populations using the millet system. The Mughal Empire relied on Akbar's policy of religious syncretism and administrative incorporation of local elites. The Ming and early Qing dynasties used a tribute system to extend influence over neighboring states without direct annexation.",
      parts: [
        {
          label: "a",
          question: "Compare ONE similarity and ONE difference in how the Ottoman and Mughal Empires incorporated conquered peoples into their administrative systems.",
          points: 4,
          rubric: "Similarity (2 pts): Both used non-indigenous elites in administration (devshirme/janissaries; Mughal incorporation of Rajput chiefs). Both ruled over religiously diverse populations using selective tolerance. Difference (2 pts): Ottomans used the millet system to administer separate religious communities; Mughals under Akbar promoted active religious syncretism (Din-i-Ilahi) and intermarriage."
        },
        {
          label: "b",
          question: "Explain how ONE internal factor and ONE external factor contributed to the decline of ONE of the empires mentioned (Ottoman, Mughal, or Ming/Qing) between 1700 and 1850.",
          points: 4,
          rubric: "Internal (2 pts): Janissary corps resisting modernization (Ottoman); Aurangzeb's reversal of Akbar's tolerance alienating Hindus (Mughal); late Qing corruption and White Lotus Rebellion (Qing). External (2 pts): Ottoman military losses to Russia/Austria; British East India Company displacing Mughal authority; European trade disrupting Chinese silver imports."
        },
        {
          label: "c",
          question: "Explain how the tribute system used by the Ming and early Qing dynasties BOTH projected Chinese power AND limited it compared to direct colonial rule practiced by European empires in the same period.",
          points: 2,
          rubric: "1 pt: Tribute projected power by establishing symbolic hierarchies without expensive military occupation. 1 pt: Limitation — tribute provided no mechanisms for resource extraction or territorial control; European direct colonialism enabled systematic extraction unavailable under tribute."
        }
      ]
    }
  ]
};

// ─── AP Chemistry ─────────────────────────────────────────────────────────────
export const AP_CHEMISTRY_V1 = {
  mcq: [
    {
      question: "A student performs a titration of 25.00 mL of an unknown HCl solution with 0.1000 M NaOH. The equivalence point is reached after adding 32.50 mL of NaOH. What is the concentration of the HCl solution?",
      options: ["0.0769 M", "0.1300 M", "0.1000 M", "0.0308 M"],
      correct: 1,
      explanation: "Moles NaOH = 0.1000 M × 0.03250 L = 0.003250 mol. [HCl] = 0.003250 mol / 0.02500 L = 0.1300 M. Simple 1:1 stoichiometry for strong acid-strong base titration.",
      skill: "Unit 9: Acids, Bases, and Buffers — Titrations",
      difficulty: "medium"
    },
    {
      question: "The titration curve shows a weak acid titrated with strong base. At which volume of NaOH added is the solution acting as the MOST effective buffer?",
      chart_data: {
        type: "line",
        title: "Titration Curve: Weak Acid (HA) vs. 0.100 M NaOH",
        data: [
          { vol_naoh_ml: 0, pH: 2.87 }, { vol_naoh_ml: 10, pH: 3.96 },
          { vol_naoh_ml: 25, pH: 4.96 }, { vol_naoh_ml: 40, pH: 6.36 },
          { vol_naoh_ml: 50, pH: 8.72 }, { vol_naoh_ml: 55, pH: 11.68 }
        ],
        x_key: "vol_naoh_ml", y_keys: ["pH"],
        x_label: "Volume NaOH Added (mL)", y_label: "pH"
      },
      options: ["0 mL (pure weak acid)", "25 mL (half-equivalence point)", "50 mL (equivalence point)", "55 mL (past equivalence)"],
      correct: 1,
      explanation: "Maximum buffering at the half-equivalence point (25 mL) where [HA] = [A⁻] and pH = pKa. The buffer can equally resist acid or base addition; the curve is flattest here.",
      skill: "Unit 9: Acids, Bases, and Buffers",
      difficulty: "hard"
    },
    {
      question: "The table shows standard reduction potentials. Which combination produces the GREATEST cell potential?",
      table_data: {
        headers: ["Half-Reaction", "E° (V)"],
        rows: [
          ["F₂ + 2e⁻ → 2F⁻", "+2.87"], ["MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O", "+1.51"],
          ["Cu²⁺ + 2e⁻ → Cu", "+0.34"], ["Zn²⁺ + 2e⁻ → Zn", "−0.76"], ["Li⁺ + e⁻ → Li", "−3.04"]
        ]
      },
      options: ["F₂ cathode, Zn anode (+3.63 V)", "Cu²⁺ cathode, Zn anode (+1.10 V)", "MnO₄⁻ cathode, Li anode (+4.55 V)", "F₂ cathode, Li anode (+5.91 V)"],
      correct: 3,
      explanation: "E°cell = E°cathode − E°anode. F₂ cathode (+2.87) with Li anode (−3.04): 2.87 − (−3.04) = 5.91 V — the highest possible combination from these half-reactions.",
      skill: "Unit 8: Electrochemistry",
      difficulty: "hard"
    },
    {
      question: "Which molecule has a bent molecular geometry and is polar?",
      options: ["CO₂ (linear, nonpolar)", "H₂O (bent, polar)", "BF₃ (trigonal planar, nonpolar)", "CH₄ (tetrahedral, nonpolar)"],
      correct: 1,
      explanation: "H₂O has 2 bonding pairs and 2 lone pairs on oxygen → bent molecular geometry. The O-H bond dipoles don't cancel due to the bent shape, making H₂O polar (net dipole 1.85 D).",
      skill: "Unit 2: Molecular Geometry and Polarity",
      difficulty: "easy"
    },
    {
      question: "A sample of ¹⁴C has initial activity of 800 dis/min. After 11,460 years (2 half-lives), what is the expected activity?",
      options: ["400 dis/min", "200 dis/min", "100 dis/min", "800 dis/min"],
      correct: 1,
      explanation: "After 1 half-life: 800 → 400. After 2 half-lives: 400 → 200 dis/min. Radioactive decay is first-order: A = A₀(½)ⁿ.",
      skill: "Unit 4: Chemical Kinetics — Radioactive Decay",
      difficulty: "easy"
    },
    {
      question: "Which change shifts N₂(g) + 3H₂(g) ⇌ 2NH₃(g) + heat equilibrium to the RIGHT?",
      options: ["Increasing temperature", "Decreasing pressure by increasing volume", "Adding a catalyst", "Increasing pressure by decreasing volume"],
      correct: 3,
      explanation: "Left: 4 mol gas → Right: 2 mol gas. Increasing pressure favors fewer moles of gas (right). Temperature increase shifts exothermic equilibria left. Catalysts speed both directions equally — they don't shift equilibrium.",
      skill: "Unit 7: Equilibrium — Le Chatelier's Principle",
      difficulty: "medium"
    },
    {
      question: "For 2H₂O₂(aq) → 2H₂O(l) + O₂(g), first order with k = 0.015 s⁻¹. With [H₂O₂]₀ = 0.80 M, what is [H₂O₂] after 60 seconds?",
      options: ["0.80 M", "0.40 M", "0.31 M", "0.22 M"],
      correct: 2,
      explanation: "[H₂O₂] = 0.80 × e^(−0.015 × 60) = 0.80 × e^(−0.90) = 0.80 × 0.4066 ≈ 0.325 M ≈ 0.31 M.",
      skill: "Unit 4: Chemical Kinetics — Integrated Rate Laws",
      difficulty: "hard"
    },
    {
      question: "Which correctly predicts relative boiling points of CH₄, NH₃, and H₂O?",
      options: ["CH₄ > NH₃ > H₂O", "H₂O > NH₃ > CH₄", "NH₃ > H₂O > CH₄", "All similar"],
      correct: 1,
      explanation: "H₂O (100°C) has strong O-H hydrogen bonds. NH₃ (−33°C) has weaker N-H hydrogen bonds. CH₄ (−161°C) has only London dispersion. Stronger IMF → higher boiling point.",
      skill: "Unit 3: Intermolecular Forces",
      difficulty: "medium"
    },
    {
      question: "10.0 g NaCl (MM = 58.44 g/mol) dissolved in 200.0 g water. Boiling point? (Kb = 0.512°C/m)",
      options: ["100.00°C", "100.44°C", "100.88°C", "101.75°C"],
      correct: 2,
      explanation: "mol NaCl = 10/58.44 = 0.171 mol. m = 0.171/0.200 = 0.856 mol/kg. i = 2 (NaCl → Na⁺ + Cl⁻). ΔTb = 2 × 0.512 × 0.856 = 0.877 ≈ 0.88°C. BP = 100.88°C.",
      skill: "Unit 3: Solutions and Colligative Properties",
      difficulty: "medium"
    },
    {
      question: "In 2Al(s) + Fe₂O₃(s) → Al₂O₃(s) + 2Fe(s), aluminum is BEST described as:",
      options: ["The oxidizing agent", "The reducing agent, because it loses electrons and causes Fe to be reduced", "Neither oxidized nor reduced", "The catalyst"],
      correct: 1,
      explanation: "Al: 0 → +3 (oxidized = loses electrons = REDUCING AGENT). Fe: +3 → 0 (reduced). The reducing agent loses electrons and causes reduction of the other species.",
      skill: "Unit 4: Redox Reactions",
      difficulty: "easy"
    }
  ],
  frq: [
    {
      title: "AP Chemistry FRQ — Equilibrium and Thermodynamics",
      prompt: "Answer all parts. Show all work for calculations.",
      stimulus: "The following equilibrium exists at 500 K: 2SO₂(g) + O₂(g) ⇌ 2SO₃(g). At equilibrium: [SO₂] = 0.50 M, [O₂] = 0.25 M, [SO₃] = 0.60 M. ΔH° = −198 kJ/mol.",
      parts: [
        {
          label: "a",
          question: "Calculate Kc at 500 K. Show your setup.",
          points: 3,
          rubric: "1 pt: Kc = [SO₃]²/([SO₂]²[O₂]). 1 pt: (0.60)²/((0.50)²(0.25)) = 0.36/0.0625. 1 pt: Kc = 5.76."
        },
        {
          label: "b",
          question: "Predict how Kc changes if temperature increases to 700 K. Explain using Le Chatelier's Principle.",
          points: 4,
          rubric: "2 pts: Exothermic → increasing T shifts LEFT; treat heat as product, adding heat shifts left. 2 pts: Kc DECREASES for exothermic reactions when T increases — [SO₃] decreases, [SO₂][O₂] increase."
        },
        {
          label: "c",
          question: "If volume is suddenly halved at constant temperature, explain qualitatively what happens to equilibrium position.",
          points: 3,
          rubric: "1 pt: Halving volume doubles pressure. 1 pt: Left = 3 mol gas (2 SO₂ + 1 O₂); Right = 2 mol gas. 1 pt: Le Chatelier shifts RIGHT (fewer moles of gas) to relieve increased pressure. Kc unchanged (T constant)."
        }
      ]
    }
  ]
};

// ─── AP Statistics ────────────────────────────────────────────────────────────
export const AP_STATISTICS_V1 = {
  mcq: [
    {
      question: "A clinical trial tests a vaccine with 1,000 per group. The table shows results. Which conclusion is MOST supported?",
      table_data: {
        headers: ["Group", "Infected", "Not Infected", "Infection Rate"],
        rows: [["Vaccine", "30", "970", "3.0%"], ["Placebo", "120", "880", "12.0%"]]
      },
      stimulus_source: "Hypothetical clinical trial data",
      options: [
        "The vaccine caused a reduction with 100% certainty",
        "The data suggest vaccine association with lower infection rates, but statistical significance testing is needed",
        "Since 30 vaccinated were infected, the vaccine is ineffective",
        "The placebo group's 12% rate is the natural infection rate"
      ],
      correct: 1,
      explanation: "The observed difference (3% vs 12%) is suggestive but requires a significance test (chi-square or z-test for proportions) to rule out sampling variability. Data alone only support an 'association,' not causation.",
      skill: "Unit 6: Inference for Categorical Data",
      difficulty: "medium"
    },
    {
      question: "A researcher finds r = 0.87 between study hours and exam scores. Which interpretation is MOST appropriate?",
      options: [
        "87% of students who study more will score higher",
        "One additional hour causes scores to increase by 0.87 points",
        "There is a strong positive linear association, but correlation does not imply causation",
        "Study hours explain 87% of score variability"
      ],
      correct: 2,
      explanation: "r = 0.87 = strong positive association. Correlation ≠ causation. The coefficient of determination is r² = 0.757 (75.7%), not 87%.",
      skill: "Unit 2: Exploring Relationships",
      difficulty: "medium"
    },
    {
      question: "A hypothesis test yields p = 0.03 at α = 0.05. Which conclusion is correct?",
      options: [
        "There is a 3% probability the null hypothesis is true",
        "We reject H₀; statistically significant evidence against H₀ at the 5% level",
        "We fail to reject H₀ because the p-value is small",
        "The alternative hypothesis is proven true with 97% confidence"
      ],
      correct: 1,
      explanation: "p = 0.03 < α = 0.05 → reject H₀. The p-value is the probability of results as extreme as observed IF H₀ were true — not the probability H₀ is true.",
      skill: "Unit 6: Inference for Means — Significance Testing",
      difficulty: "medium"
    },
    {
      question: "Random sample n=64, x̄=1150, s=120. 95% confidence interval for the true mean?",
      options: ["(1120.6, 1179.4)", "(1110.0, 1190.0)", "(1130.6, 1169.4)", "(1121.8, 1178.2)"],
      correct: 0,
      explanation: "95% CI: 1150 ± 1.96 × (120/√64) = 1150 ± 1.96 × 15 = 1150 ± 29.4 = (1120.6, 1179.4).",
      skill: "Unit 6: Confidence Intervals for Means",
      difficulty: "medium"
    },
    {
      question: "Normal distribution μ=70, σ=10. What percentage falls between 60 and 90?",
      options: ["68%", "81.5%", "95%", "99.7%"],
      correct: 1,
      explanation: "P(60 < X < 90) = P(−1 < Z < 2). P(Z<2) = 0.9772; P(Z<−1) = 0.1587. 0.9772 − 0.1587 = 0.8185 ≈ 81.5%.",
      skill: "Unit 1: Normal Distribution",
      difficulty: "hard"
    },
    {
      question: "Which would MOST compromise internal validity of an experiment comparing two teaching methods?",
      options: [
        "Using a random sample from one school district",
        "Assigning students based on GPA rather than randomly",
        "Using a double-blind procedure",
        "Controlling for socioeconomic status"
      ],
      correct: 1,
      explanation: "Non-random assignment by GPA introduces selection bias — pre-existing differences between groups could explain outcomes, not the teaching method. Random assignment is the gold standard for ensuring comparable groups.",
      skill: "Unit 3: Collecting Data — Experimental Design",
      difficulty: "medium"
    },
    {
      question: "Regression line ŷ = −210 + 5.1x predicts weight from height. For height=70 in, actual weight=165 lbs. What is the residual?",
      options: ["+18.0 lbs", "−18.0 lbs", "+165 lbs", "0 lbs"],
      correct: 0,
      explanation: "Predicted: ŷ = −210 + 5.1(70) = −210 + 357 = 147 lbs. Residual = actual − predicted = 165 − 147 = +18 lbs.",
      skill: "Unit 2: Regression — Residuals",
      difficulty: "medium"
    },
    {
      question: "Chi-square test for independence on a 3×4 contingency table. Degrees of freedom?",
      options: ["12", "7", "6", "11"],
      correct: 2,
      explanation: "df = (rows − 1)(columns − 1) = (3−1)(4−1) = 2 × 3 = 6.",
      skill: "Unit 8: Chi-Square Tests",
      difficulty: "easy"
    },
    {
      question: "Stratified sample of 300 from school: 9th (400), 10th (350), 11th (250). How many 9th graders?",
      options: ["100", "120", "150", "300"],
      correct: 1,
      explanation: "Total = 1000. 9th grade proportion = 400/1000 = 0.40. 0.40 × 300 = 120 students.",
      skill: "Unit 3: Sampling Methods",
      difficulty: "easy"
    },
    {
      question: "X ~ N(50, 8²) and Y ~ N(30, 6²) are independent. Standard deviation of (X − Y)?",
      options: ["2", "10", "14", "100"],
      correct: 1,
      explanation: "Var(X − Y) = Var(X) + Var(Y) = 64 + 36 = 100. SD = √100 = 10. Variances add for both sum and difference of independent variables.",
      skill: "Unit 4: Combining Random Variables",
      difficulty: "medium"
    }
  ],
  frq: [
    {
      title: "AP Statistics FRQ — Inference for Means",
      prompt: "A school district claims average commute time is 25 minutes. A researcher suspects it is higher and surveys a random sample.",
      stimulus: "n = 36, x̄ = 28.2 minutes, s = 9.0 minutes. Data appear approximately normally distributed with no extreme outliers.",
      parts: [
        {
          label: "a",
          question: "State the null and alternative hypotheses. Define any parameters used.",
          points: 2,
          rubric: "1 pt: H₀: μ = 25 minutes (μ = true mean commute for all students). 1 pt: Hₐ: μ > 25 minutes (one-tailed, researcher suspects higher)."
        },
        {
          label: "b",
          question: "Calculate the test statistic and p-value. State whether you reject or fail to reject H₀ at α = 0.05.",
          points: 4,
          rubric: "1 pt: t = (28.2 − 25)/(9/√36) = 3.2/1.5 = 2.133. 1 pt: df = 35; p ≈ 0.020 (one-tail). 1 pt: p = 0.020 < 0.05, reject H₀. 1 pt: Correct direction (one-tailed)."
        },
        {
          label: "c",
          question: "Construct a 95% confidence interval for the true mean commute time. Interpret in context.",
          points: 4,
          rubric: "1 pt: t* ≈ 2.030 (df=35). 1 pt: CI = 28.2 ± 2.030 × 1.5 = (25.155, 31.245). 1 pt: Interpretation — 95% confident the true mean commute for all students is between 25.2 and 31.2 minutes. 1 pt: Notes 25 is near lower bound, consistent with rejecting H₀."
        }
      ]
    }
  ]
};

// ─── AP US Government ─────────────────────────────────────────────────────────
export const AP_US_GOV_V1 = {
  mcq: [
    {
      question: "The excerpt BEST reflects which constitutional principle?",
      stimulus: "If men were angels, no government would be necessary. If angels were to govern men, neither external nor internal controls on government would be necessary. In framing a government which is to be administered by men over men, the great difficulty lies in this: you must first enable the government to control the governed; and in the next place oblige it to control itself.",
      stimulus_source: "James Madison, Federalist No. 51, 1788",
      stimulus_header: "Questions 1–2 refer to the following excerpt.",
      options: [
        "Popular sovereignty as the sole basis for legitimacy",
        "Separation of powers and checks and balances to prevent tyranny",
        "Federalism as the primary mechanism for controlling government",
        "Judicial review as the ultimate check on legislative power"
      ],
      correct: 1,
      explanation: "Federalist No. 51 is Madison's defense of separation of powers and checks and balances. 'Ambition must be made to counteract ambition' — each branch must have constitutional means to resist encroachment by others.",
      skill: "Foundational Documents — Federalist Papers",
      difficulty: "medium"
    },
    {
      question: "Which would MOST directly support a 'strict constructionist' interpretation of the Constitution?",
      options: [
        "Expanding federal power through the necessary and proper clause",
        "Limiting federal action to powers specifically enumerated in the Constitution's text",
        "Using judicial precedent to extend civil rights protections beyond original language",
        "Allowing the executive to conduct foreign affairs without congressional oversight"
      ],
      correct: 1,
      explanation: "Strict constructionism (textualism/originalism) holds that the Constitution should be interpreted based on its literal text and founders' original intent, limiting government to enumerated powers.",
      skill: "Constitutional Interpretation",
      difficulty: "medium"
    },
    {
      question: "The chart shows Supreme Court ideological composition by era. Which trend is MOST significant for contemporary constitutional law?",
      chart_data: {
        type: "bar",
        title: "Supreme Court: Liberal vs. Conservative Justices by Era",
        data: [
          { era: "1960-69", liberal: 7, conservative: 2 },
          { era: "1970-79", liberal: 4, conservative: 5 },
          { era: "1990-99", liberal: 4, conservative: 5 },
          { era: "2010-19", liberal: 4, conservative: 5 },
          { era: "2020-24", liberal: 3, conservative: 6 }
        ],
        x_key: "era", y_keys: ["liberal", "conservative"],
        x_label: "Era", y_label: "Number of Justices"
      },
      stimulus_source: "Adapted from Martin-Quinn Ideal Point Estimates, 2024",
      options: [
        "The Court's ideological composition has remained perfectly balanced since 1960",
        "The shift from liberal majority in the 1960s to consistent conservative majorities reflects the long-term impact of presidential appointment power",
        "Democratic presidents have appointed more justices than Republicans since 1970",
        "The Court becomes more liberal as precedent accumulates"
      ],
      correct: 1,
      explanation: "The shift from Warren Court's 7-2 liberal majority to consistent conservative majorities since Nixon demonstrates presidential appointment power's long-term significance — justices serve for life, shaping jurisprudence for decades.",
      skill: "The Judicial Branch — Appointments and Ideology",
      difficulty: "medium"
    },
    {
      question: "The table shows voter turnout by demographic. Which conclusion is MOST supported?",
      table_data: {
        headers: ["Demographic", "Turnout 2000", "Turnout 2020", "Change"],
        rows: [
          ["Age 18–29", "36%", "52%", "+16 pts"],
          ["Age 65+", "70%", "76%", "+6 pts"],
          ["Hispanic", "27%", "53%", "+26 pts"]
        ]
      },
      stimulus_source: "US Census Bureau, 2020",
      options: [
        "Youth turnout exceeded elderly turnout in 2020",
        "Hispanic voter turnout increased the most in percentage points, suggesting growing political mobilization",
        "Turnout among all demographics remained stable since 2000",
        "Black voter turnout declined between 2000 and 2020"
      ],
      correct: 1,
      explanation: "Hispanic voter turnout increased 26 percentage points (27%→53%) — the largest increase shown. Elderly turnout (76%) still exceeds youth (52%) in 2020, contradicting option A.",
      skill: "Political Participation — Voting and Elections",
      difficulty: "medium"
    },
    {
      question: "Which BEST illustrates federalism as established by the Tenth Amendment?",
      options: [
        "Congress passes the Civil Rights Act of 1964 using the Commerce Clause",
        "The Supreme Court overturns a state law",
        "California establishes vehicle emission standards stricter than federal standards",
        "The President uses executive orders to implement immigration policy"
      ],
      correct: 2,
      explanation: "The Tenth Amendment reserves powers not delegated to the federal government to the states. California setting stricter emission standards exemplifies state police powers — 'laboratories of democracy.'",
      skill: "Federalism — Division of Powers",
      difficulty: "medium"
    },
    {
      question: "New York Times Co. v. United States (1971) MOST directly established which principle?",
      options: [
        "The government can impose prior restraint when national security is threatened",
        "The press has near-absolute protection from prior restraint under the First Amendment",
        "The executive has exclusive authority to classify government documents",
        "Congress must authorize the president before invoking national security for censorship"
      ],
      correct: 1,
      explanation: "The Pentagon Papers case (6-3) ruled that the Nixon administration could NOT prevent publication of classified Vietnam War documents. Prior censorship is nearly always unconstitutional under the First Amendment.",
      skill: "Civil Liberties — First Amendment",
      difficulty: "medium"
    },
    {
      question: "Which BEST describes the effect of Citizens United v. FEC (2010)?",
      options: [
        "It restricted corporate political spending by classifying it as commercial speech",
        "It eliminated all campaign finance limits for individuals",
        "It held corporations have First Amendment rights, allowing unlimited independent political expenditures",
        "It established the FEC framework to regulate Super PACs"
      ],
      correct: 2,
      explanation: "Citizens United (5-4) held that the First Amendment prohibits restricting independent political expenditures by corporations. The ruling allowed unlimited 'independent expenditures,' enabling Super PACs — but direct campaign contributions remained limited.",
      skill: "Political Participation — Campaign Finance",
      difficulty: "hard"
    },
    {
      question: "The iron triangle model of policymaking involves which three components?",
      options: [
        "President, Congress, and Supreme Court",
        "Congressional committees, executive agencies, and interest groups",
        "Political parties, media organizations, and think tanks",
        "Federal agencies, state governments, and local governments"
      ],
      correct: 1,
      explanation: "Iron triangles: (1) Congressional subcommittees (authorize programs/oversight), (2) executive/regulatory agencies (implement policy), (3) interest groups (provide campaign support/expertise). Each benefits mutually, creating stable policy that resists outside reform.",
      skill: "Policy-Making Process — Interest Groups and Bureaucracy",
      difficulty: "medium"
    },
    {
      question: "A senator filibusters a judicial nomination. Which mechanism could MOST directly overcome this?",
      options: [
        "A presidential veto of the filibuster",
        "A supermajority of 60 Senate votes invoking cloture under Rule XXII",
        "The House passing a companion bill",
        "A Supreme Court injunction ordering a floor vote"
      ],
      correct: 1,
      explanation: "Cloture (Senate Rule XXII) requires 60 votes to end debate/filibuster. The 'nuclear option' lowered cloture threshold for nominations to 51 votes. The filibuster is a Senate procedural rule — president and courts have no authority over it.",
      skill: "Legislative Branch — Congressional Procedures",
      difficulty: "medium"
    },
    {
      question: "Which constitutional provision has been MOST frequently used to nationalize the Bill of Rights and apply it to states?",
      options: [
        "The Supremacy Clause (Article VI)",
        "The Due Process Clause of the Fourteenth Amendment",
        "The Privileges and Immunities Clause of Article IV",
        "The Commerce Clause of Article I"
      ],
      correct: 1,
      explanation: "Selective incorporation uses the Fourteenth Amendment's Due Process Clause to apply most Bill of Rights provisions to states, beginning with Gitlow v. NY (1925). The Privileges or Immunities Clause was narrowly interpreted in The Slaughterhouse Cases (1873).",
      skill: "Civil Liberties — Incorporation Doctrine",
      difficulty: "hard"
    }
  ],
  frq: [
    {
      title: "AP US Government FRQ — Concept Application: Citizens United",
      prompt: "Answer all parts. Use your knowledge of AP US Government and Politics.",
      stimulus: "In 2010, the Supreme Court decided Citizens United v. Federal Election Commission (5-4). Citizens United, a nonprofit corporation, wanted to air a film critical of Hillary Clinton within 30 days of the 2008 presidential primary. The Bipartisan Campaign Reform Act (BCRA) prohibited corporations from using general treasury funds for electioneering communications within 30 days of a primary. The Court struck down this restriction.",
      parts: [
        {
          label: "a",
          question: "Identify the constitutional clause the majority used to strike down the BCRA restriction, and explain their reasoning.",
          points: 3,
          rubric: "1 pt: First Amendment (freedom of speech). 1 pt: Political speech doesn't lose constitutional protection simply because its source is a corporation. 1 pt: Content-based restriction on political speech subject to strict scrutiny, which the government couldn't satisfy."
        },
        {
          label: "b",
          question: "Explain ONE argument by the dissent or critics that Citizens United undermines democratic principles.",
          points: 2,
          rubric: "2 pts: Corporate spending can outspend individuals, drowning out citizen voices. OR: Creates corruption/quid pro quo risks. OR: Gives wealthy corporations disproportionate electoral influence, undermining political equality. Need argument + explanation."
        },
        {
          label: "c",
          question: "Explain how Citizens United interacts with the concept of linkage institutions. Use 'linkage institution' correctly.",
          points: 3,
          rubric: "1 pt: Linkage institutions connect citizens to government (parties, interest groups, media, elections). 1 pt: Citizens United enables unlimited independent expenditures → Super PACs become major linkage institutions. 1 pt: Campaign messaging increasingly reflects donor priorities over grassroots preferences, distorting how citizen preferences reach policymakers."
        }
      ]
    }
  ]
};

// ─── AP Calculus BC ───────────────────────────────────────────────────────────
export const AP_CALCULUS_BC_V1 = {
  mcq: [
    {
      question: "What is the sum of the convergent geometric series Σ (3/4)ⁿ for n = 0 to ∞?",
      options: ["3", "4", "12", "The series diverges"],
      correct: 1,
      explanation: "Sum = a/(1−r) = 1/(1−3/4) = 1/(1/4) = 4. Since |r| = 3/4 < 1, the series converges.",
      skill: "Unit 10: Infinite Series",
      difficulty: "easy"
    },
    {
      question: "x(t) = t² − 1, y(t) = 2t³ − 3t. What is dy/dx when t = 1?",
      options: ["3", "1/2", "3/2", "6"],
      correct: 2,
      explanation: "dy/dx = (dy/dt)/(dx/dt). dy/dt = 6t²−3; dx/dt = 2t. At t=1: dy/dt=3, dx/dt=2. dy/dx = 3/2.",
      skill: "Unit 9: Parametric Equations",
      difficulty: "medium"
    },
    {
      question: "Use the ratio test for Σ n!/2ⁿ (n = 1 to ∞). What does the ratio test indicate?",
      options: ["Converges, limit = 0", "Diverges, limit = ∞", "Converges, limit = 1/2", "Inconclusive, limit = 1"],
      correct: 1,
      explanation: "|aₙ₊₁/aₙ| = (n+1)/2 → ∞ as n → ∞. Since L > 1, the series DIVERGES.",
      skill: "Unit 10: Series — Ratio Test",
      difficulty: "hard"
    },
    {
      question: "Find the area enclosed by r = 2cos(θ) from θ = 0 to θ = π.",
      options: ["π", "2π", "4π", "π/2"],
      correct: 0,
      explanation: "A = (1/2)∫₀^π 4cos²θ dθ = ∫₀^π (1+cos2θ)/1 dθ... A = 2∫₀^π cos²θ dθ = 2∫₀^π (1+cos2θ)/2 dθ = [θ + sin2θ/2]₀^π = π.",
      skill: "Unit 9: Polar — Area",
      difficulty: "hard"
    },
    {
      question: "Interval of convergence for Σ (x−2)ⁿ/3ⁿ (n = 0 to ∞)?",
      options: ["(−1, 5]", "(−1, 5)", "[−1, 5]", "x = 2 only"],
      correct: 1,
      explanation: "|( x−2)/3| < 1 → |x−2| < 3 → −1 < x < 5. At x=±1: series diverges. IOC: (−1, 5).",
      skill: "Unit 10: Power Series — Interval of Convergence",
      difficulty: "medium"
    },
    {
      question: "Using first four terms of the Taylor series for e^x, approximate e^0.1.",
      options: ["1.1000", "1.1052", "1.1000 + 1/300", "1.0952"],
      correct: 1,
      explanation: "e^0.1 ≈ 1 + 0.1 + 0.01/2 + 0.001/6 = 1 + 0.1 + 0.005 + 0.000167 ≈ 1.1052.",
      skill: "Unit 10: Taylor and Maclaurin Series",
      difficulty: "medium"
    },
    {
      question: "Evaluate ∫₁^∞ 1/x² dx.",
      options: ["Diverges", "∞", "1", "2"],
      correct: 2,
      explanation: "lim(b→∞) [−x⁻¹]₁^b = lim(b→∞)(−1/b + 1) = 1. Converges to 1. (p-series with p=2 > 1).",
      skill: "Unit 6: Improper Integrals",
      difficulty: "medium"
    },
    {
      question: "x(t) = cos(t), y(t) = sin(t). Arc length from t = 0 to t = π?",
      options: ["1", "π", "2", "2π"],
      correct: 1,
      explanation: "L = ∫₀^π √(sin²t + cos²t) dt = ∫₀^π 1 dt = π. Half the circumference of a unit circle.",
      skill: "Unit 9: Arc Length — Parametric",
      difficulty: "medium"
    },
    {
      question: "Which correctly classifies Σ (−1)ⁿ/n (n=1 to ∞)?",
      options: ["Diverges by nth term test", "Converges absolutely by ratio test", "Converges conditionally by alternating series test, not absolutely", "Converges absolutely since terms < 1/n"],
      correct: 2,
      explanation: "Alternating series test: converges (bₙ=1/n decreasing → 0). Absolute: Σ 1/n = harmonic series → diverges. Therefore CONDITIONALLY convergent.",
      skill: "Unit 10: Conditional vs. Absolute Convergence",
      difficulty: "hard"
    },
    {
      question: "Find d²y/dx² for x = t³, y = t² at t = 1.",
      options: ["−2/9", "2/9", "2/3", "1/3"],
      correct: 0,
      explanation: "dy/dx = 2t/(3t²) = 2/(3t). d/dt(dy/dx) = −2/(3t²). d²y/dx² = [−2/(3t²)]/(3t²) = −2/(9t⁴). At t=1: −2/9.",
      skill: "Unit 9: Parametric — Second Derivative",
      difficulty: "hard"
    }
  ],
  frq: [
    {
      title: "AP Calculus BC FRQ — Power Series and Convergence",
      prompt: "Do not use a calculator. Show all work.",
      stimulus: "Consider the function f(x) = 1/(1+x²).",
      parts: [
        {
          label: "a",
          question: "Using the geometric series formula, write the first four nonzero terms and general term of the power series for f(x) centered at x = 0. State the interval of convergence.",
          points: 4,
          rubric: "1 pt: 1/(1−(−x²)) = Σ(−1)ⁿx^(2n). 1 pt: First four terms: 1 − x² + x⁴ − x⁶. 1 pt: General term: (−1)ⁿx^(2n). 1 pt: IOC: |−x²| < 1 → |x| < 1 → (−1, 1). Endpoints diverge."
        },
        {
          label: "b",
          question: "Use the series from part (a) to write the first four nonzero terms for arctan(x). Evaluate at x = 1 and explain its significance.",
          points: 4,
          rubric: "1 pt: arctan(x) = x − x³/3 + x⁵/5 − x⁷/7 + ... (integrate term by term). 1 pt: General term: (−1)ⁿx^(2n+1)/(2n+1). 1 pt: At x=1: 1 − 1/3 + 1/5 − 1/7 + ... 1 pt: This equals π/4 (Leibniz formula), since arctan(1) = π/4."
        },
        {
          label: "c",
          question: "Determine whether the series from part (b) converges at x = 1. Name the test and justify.",
          points: 2,
          rubric: "1 pt: Alternating Series Test (bₙ = 1/(2n+1) > 0, decreasing, lim → 0). 1 pt: Series converges conditionally at x = 1. Not absolutely convergent since Σ 1/(2n+1) diverges (comparison to harmonic)."
        }
      ]
    }
  ]
};

// ─── AP Microeconomics ────────────────────────────────────────────────────────
export const AP_MICROECONOMICS_V1 = {
  mcq: [
    {
      question: "If a $0.50/gallon excise tax is imposed on gasoline producers, what is the MOST likely effect?",
      options: [
        "Supply curve shifts right, reducing equilibrium price",
        "Supply curve shifts left, increasing price consumers pay and reducing equilibrium quantity",
        "Demand curve shifts left as consumers respond to higher prices",
        "Both price and quantity increase"
      ],
      correct: 1,
      explanation: "Excise tax on producers increases cost of production → supply curve shifts LEFT. This raises consumer price, lowers after-tax producer price, and reduces equilibrium quantity, creating deadweight loss.",
      skill: "Unit 2: Supply and Demand — Tax Incidence",
      difficulty: "medium"
    },
    {
      question: "The table shows a firm's cost data. At what output should the firm produce if market price = $25?",
      table_data: {
        headers: ["Output (Q)", "Total Cost ($)", "Marginal Cost ($)", "Marginal Revenue ($)"],
        rows: [
          ["0", "20", "—", "—"], ["1", "35", "15", "25"], ["2", "46", "11", "25"],
          ["3", "60", "14", "25"], ["4", "78", "18", "25"], ["5", "100", "22", "25"],
          ["6", "126", "26", "25"]
        ]
      },
      options: ["Q = 4", "Q = 5", "Q = 6", "Q = 3"],
      correct: 1,
      explanation: "Produce where MR = MC. At Q=5: MC=$22 < MR=$25 (produce). At Q=6: MC=$26 > MR=$25 (don't produce). Optimal: Q=5.",
      skill: "Unit 3: Perfect Competition — Profit Maximization",
      difficulty: "medium"
    },
    {
      question: "Monopolist: P = 100 − 2Q, MC = 20. Profit-maximizing price and quantity?",
      options: ["P = 60, Q = 20", "P = 60, Q = 40", "P = 20, Q = 40", "P = 80, Q = 10"],
      correct: 0,
      explanation: "MR = 100 − 4Q. Set MR = MC: 100 − 4Q = 20 → Q = 20. P = 100 − 2(20) = 60.",
      skill: "Unit 4: Imperfect Competition — Monopoly",
      difficulty: "hard"
    },
    {
      question: "Cross-price elasticity of demand between A and B is +2.5. This indicates A and B are:",
      options: [
        "Complementary goods — price increase in B increases demand for A",
        "Substitute goods — price increase in B increases demand for A",
        "Inferior goods",
        "Normal goods with identical income elasticities"
      ],
      correct: 1,
      explanation: "Positive cross-price elasticity = substitutes. When B's price rises, demand for A rises — consumers substitute A for B. Negative = complements.",
      skill: "Unit 1: Elasticity",
      difficulty: "easy"
    },
    {
      question: "The Lorenz curve: bottom 40% earn 10%, bottom 80% earn 45%. Which conclusion is MOST supported?",
      options: [
        "Perfect income equality exists",
        "Significant income inequality exists, with top 20% earning 55% of income",
        "The Gini coefficient equals zero",
        "The top 20% earn 45% of total income"
      ],
      correct: 1,
      explanation: "If bottom 80% earn 45%, top 20% earn 55% — highly concentrated. Gini coefficient cannot be zero given this inequality.",
      skill: "Unit 4: Income Distribution",
      difficulty: "medium"
    },
    {
      question: "Which MOST accurately describes a negative externality?",
      options: [
        "A cost paid by a producer that reduces total output",
        "A cost imposed on third parties not involved in a transaction, causing overproduction relative to social optimum",
        "A benefit consumers enjoy that the producer cannot charge for",
        "A market condition where one firm dominates an industry"
      ],
      correct: 1,
      explanation: "Negative externality: private MPC < social MSC → overproduction. Remedies: Pigouvian tax, cap-and-trade, regulation.",
      skill: "Unit 4: Market Failure — Externalities",
      difficulty: "easy"
    },
    {
      question: "The table shows MRP data. Market wage = $15/hour. How many workers should the firm hire?",
      table_data: {
        headers: ["Workers", "MRP ($/hour)"],
        rows: [["1","$35"],["2","$28"],["3","$22"],["4","$17"],["5","$14"],["6","$10"]]
      },
      options: ["3 workers", "4 workers", "5 workers", "6 workers"],
      correct: 1,
      explanation: "Hire until MRP = wage. At 4 workers: MRP=$17 > $15 (hire). At 5: MRP=$14 < $15 (don't hire). Optimal: 4 workers.",
      skill: "Unit 5: Factor Markets — Labor",
      difficulty: "medium"
    },
    {
      question: "The kinked demand curve model for oligopoly predicts which of the following?",
      options: [
        "Prices are highly flexible and respond immediately to cost changes",
        "Prices tend to be sticky because rivals match price decreases but not price increases",
        "Oligopolies earn zero economic profit in the long run",
        "One firm always acts as price leader"
      ],
      correct: 1,
      explanation: "Kinked demand (Sweezy): rivals match price cuts (demand inelastic below kink) but not increases (demand elastic above kink). This creates price rigidity — small cost changes don't change the profit-maximizing price.",
      skill: "Unit 4: Imperfect Competition — Oligopoly",
      difficulty: "hard"
    },
    {
      question: "Consumer surplus is BEST defined as:",
      options: [
        "Total revenue above variable costs",
        "The difference between maximum willingness to pay and the price actually paid",
        "The amount by which quantity supplied exceeds quantity demanded",
        "Producer profit minus fixed costs"
      ],
      correct: 1,
      explanation: "Consumer surplus = willingness to pay − price paid. Graphically, the area below the demand curve and above market price.",
      skill: "Unit 2: Welfare Analysis",
      difficulty: "easy"
    },
    {
      question: "In the long run, a perfectly competitive firm earns:",
      options: [
        "Positive economic profit due to barriers to entry",
        "Zero economic profit because free entry eliminates above-normal returns",
        "Negative economic profit, forcing all firms to exit",
        "Positive accounting profit but zero economic profit"
      ],
      correct: 3,
      explanation: "Long-run equilibrium: economic profit = 0 (free entry/exit). Firms still earn positive accounting profit (includes normal return on capital). P = minimum ATC (productive efficiency).",
      skill: "Unit 3: Perfect Competition — Long-Run Equilibrium",
      difficulty: "medium"
    }
  ],
  frq: [
    {
      title: "AP Microeconomics FRQ — Market Structures and Externalities",
      prompt: "Use your knowledge of AP Microeconomics to answer all parts.",
      stimulus: "A pharmaceutical company holds a patent on a life-saving drug, giving it monopoly power. Production creates chemical waste polluting a nearby river (negative externality). The marginal social cost (MSC) exceeds marginal private cost (MPC) by $30 per unit at all output levels.",
      parts: [
        {
          label: "a",
          question: "Draw and label a monopoly graph showing: demand, MR, MPC, profit-maximizing price (Pm) and quantity (Qm), and the area of deadweight loss (DWL) from monopoly power.",
          points: 4,
          rubric: "1 pt: Downward-sloping demand with MR below demand (twice as steep for linear). 1 pt: MPC intersecting MR at Qm; price at Pm on demand curve above MPC. 1 pt: DWL triangle between Qm and competitive quantity. 1 pt: All curves correctly labeled."
        },
        {
          label: "b",
          question: "Add the MSC curve. Explain how the socially optimal quantity compares to monopolist's output and competitive output.",
          points: 3,
          rubric: "1 pt: MSC = MPC + $30, parallel and above MPC. 1 pt: Socially optimal Q (MSC = demand) < competitive Q. 1 pt: Qmonopoly < Qsocial optimum < Qcompetitive. The monopolist partially offsets the negative externality by restricting output."
        },
        {
          label: "c",
          question: "Identify ONE government policy that could improve market efficiency, considering BOTH the monopoly and externality problems.",
          points: 3,
          rubric: "Pigouvian tax of $30 per unit (1 pt: internalizes externality; 1 pt: applied to monopolist; 1 pt: may worsen monopoly DWL analysis). OR: Compulsory licensing (1 pt: reduces monopoly power; 1 pt: increases competition; 1 pt: may reduce innovation incentives)."
        }
      ]
    }
  ]
};