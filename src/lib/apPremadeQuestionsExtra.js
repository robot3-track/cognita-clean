// ─── AP Premade Questions — Extra Banks (V2 sets + AP Japanese) ───────────────
// Each subject gets ~10 more MCQs and 1+ FRQ, giving 20+ MCQs per subject total.

// ─── AP Human Geography V3 ───────────────────────────────────────────────────
export const AP_HUMAN_GEO_V3 = {
  mcq: [
    {
      question: "The map shows population density across East and Southeast Asia. Which factor MOST explains the high-density clusters visible in the Yangtze River Delta, Red River Delta, and Java?",
      map_description: "A population density dot map of East and Southeast Asia. Dense black dots cluster in four regions: (1) North China Plain and Yangtze River Delta (Shanghai–Nanjing corridor); (2) the Pearl River Delta (Guangzhou–Shenzhen); (3) the Red River Delta in northern Vietnam (Hanoi); (4) the island of Java, Indonesia — especially the Jakarta–Surabaya corridor. Sparse dots appear in the Tibetan Plateau, Mongolian steppe, and Borneo interior. Cities labeled: Tokyo, Shanghai, Beijing, Manila, Jakarta, Hanoi.",
      stimulus_source: "NASA Socioeconomic Data and Applications Center, 2020",
      options: [
        "Proximity to mineral resources drove industrial migration to these regions",
        "Fertile river deltas and coastal plains support intensive wet-rice agriculture and modern industry, sustaining high population densities",
        "Government resettlement programs forcibly relocated populations to these areas",
        "Monsoon rainfall uniformly distributes across Asia, creating equal agricultural potential everywhere"
      ],
      correct: 1,
      explanation: "River deltas provide flat land, fertile alluvial soils, reliable water supply, and coastal trade access — ideal for wet-rice cultivation (Asia's caloric staple) and industrial development. The Yangtze Delta, Red River Delta, and Java's volcanic plains have sustained dense populations for millennia due to agricultural productivity. The Tibet-Qinghai Plateau and Mongolia are sparsely settled due to harsh climate and poor soils.",
      skill: "Unit 2: Population & Settlement",
      difficulty: "medium"
    },
    {
      question: "The table shows urbanization rates and per-capita GDP for selected African countries. Which conclusion is BEST supported?",
      table_data: {
        headers: ["Country", "Urban Pop. (%)", "GDP/capita (PPP $)", "Annual Urban Growth Rate"],
        rows: [
          ["Nigeria", "53%", "$5,100", "3.9%"],
          ["Ethiopia", "23%", "$2,800", "4.5%"],
          ["South Africa", "68%", "$13,200", "1.6%"],
          ["DRC", "47%", "$1,100", "4.3%"]
        ]
      },
      stimulus_source: "World Bank Development Indicators, 2022",
      options: [
        "Higher urbanization always correlates with higher GDP per capita in Africa",
        "DRC's combination of high urban growth and very low GDP suggests urbanization without commensurate economic development",
        "South Africa's slow urban growth indicates rural-to-urban migration has ended",
        "Ethiopia's low urbanization rate means it has the smallest total urban population"
      ],
      correct: 1,
      explanation: "DRC's 4.3% urban growth with only $1,100 GDP/capita exemplifies 'overurbanization' — rapid urban growth driven by rural push factors (conflict, poverty) rather than urban economic opportunity. This differs from South Africa's urban growth pattern, which is slower but tied to genuine economic development ($13,200 GDP/capita).",
      skill: "Unit 7: Cities and Urban Land Use",
      difficulty: "medium"
    },
    {
      question: "The graph shows global energy consumption by source from 1990–2022. Which trend has the MOST significant implications for environmental geography?",
      chart_data: {
        type: "line",
        title: "Global Primary Energy Consumption by Source (EJ/year)",
        data: [
          { year: "1990", fossil: 320, nuclear: 26, renewables: 12 },
          { year: "2000", fossil: 368, nuclear: 30, renewables: 18 },
          { year: "2010", fossil: 460, nuclear: 30, renewables: 42 },
          { year: "2015", fossil: 490, nuclear: 28, renewables: 72 },
          { year: "2020", fossil: 480, nuclear: 28, renewables: 110 },
          { year: "2022", fossil: 510, nuclear: 30, renewables: 145 }
        ],
        x_key: "year",
        y_keys: ["fossil", "nuclear", "renewables"],
        x_label: "Year",
        y_label: "Energy (EJ/year)"
      },
      stimulus_source: "Our World in Data, BP Statistical Review of World Energy, 2023",
      options: [
        "Renewable energy has completely replaced fossil fuels since 2020",
        "Fossil fuel consumption continues to increase in absolute terms despite rapid renewable growth, indicating the energy transition remains incomplete",
        "Nuclear energy is the fastest growing source of electricity globally",
        "Total energy consumption has declined since 2010 due to efficiency improvements"
      ],
      correct: 1,
      explanation: "Renewables grew rapidly (12→145 EJ) but fossil fuels also grew (320→510 EJ). This 'energy addition' rather than 'energy transition' means total carbon emissions continue rising. The gap between renewable growth and absolute fossil fuel consumption is the core challenge of the energy-climate nexus.",
      skill: "Unit 5: Agriculture and Resource Use",
      difficulty: "hard"
    },
    {
      question: "A geographer studying the 'friction of distance' would MOST expect which pattern in a city's retail geography?",
      options: [
        "High-order specialty stores distributed evenly across all neighborhoods",
        "Convenience goods stores widely distributed near residential areas; comparison goods concentrated in fewer, larger centers",
        "All retail concentrated in a single CBD regardless of city size",
        "Online shopping eliminating all geographic patterns in retail distribution"
      ],
      correct: 1,
      explanation: "Friction of distance (the cost/effort of travel) shapes retail geography: people will travel far for high-order goods (furniture, luxury items) but want convenience goods (groceries) nearby. This creates Christaller's hierarchy: many small-range low-order centers plus fewer, larger high-order centers.",
      skill: "Unit 7: Urban Geography",
      difficulty: "medium"
    },
    {
      question: "Which of the following represents a form of 'cultural syncretism'?",
      options: [
        "The displacement of indigenous languages by European colonial languages",
        "The development of Creole languages blending African, European, and indigenous elements in the Caribbean",
        "Strict preservation of cultural practices by an isolated group with no external contact",
        "The replacement of traditional dress with Western clothing in developing countries"
      ],
      correct: 1,
      explanation: "Cultural syncretism = the blending of two or more cultural traditions to create a new, hybrid form. Creole languages (Haitian Creole, Louisiana Creole) blend French, West African, and other elements — a classic example. Cultural displacement or replacement is acculturation, not syncretism.",
      skill: "Unit 3: Cultural Patterns",
      difficulty: "easy"
    },
    {
      question: "The Heartland Theory (Mackinder) predicted that control of which geographic area would determine global power?",
      options: [
        "The Rimland coastal areas of Eurasia and the Caribbean Basin",
        "The interior of Eurasia — inaccessible to sea power, rich in resources",
        "The world's major straits and chokepoints controlling maritime commerce",
        "The equatorial belt where population growth would generate global influence"
      ],
      correct: 1,
      explanation: "Halford Mackinder's 1904 Heartland Theory ('Who rules the Heartland commands the World-Island') identified Central Asia/Eastern Europe as the pivot area — inaccessible to naval power, with vast resources. This geopolitical theory influenced Cold War containment strategy and NATO expansion debates.",
      skill: "Unit 4: Political Patterns",
      difficulty: "medium"
    },
    {
      question: "Gentrification in inner-city neighborhoods is MOST directly characterized by which process?",
      options: [
        "Government-planned demolition of slums and construction of public housing",
        "Invasion of low-income areas by higher-income residents, raising property values and displacing original residents",
        "Suburbanization drawing middle-class residents away from city centers",
        "Industrial rezoning converting residential areas to commercial use"
      ],
      correct: 1,
      explanation: "Gentrification involves higher-income newcomers rehabilitating housing in low-income urban neighborhoods, raising property values and rents, ultimately displacing original lower-income residents. It is a market-driven process (not government-planned) associated with urban revitalization but criticized for displacement effects.",
      skill: "Unit 7: Urban Geography",
      difficulty: "easy"
    },
    {
      question: "The table shows language endangerment data. Which conclusion is MOST supported?",
      table_data: {
        headers: ["Region", "Total Languages", "Critically Endangered", "% of World Languages"],
        rows: [
          ["Papua New Guinea", "840", "50", "12%"],
          ["Sub-Saharan Africa", "2,100", "320", "30%"],
          ["Americas", "1,000", "450", "14%"],
          ["Europe", "280", "120", "4%"]
        ]
      },
      stimulus_source: "UNESCO Atlas of the World's Languages in Danger, 2022",
      options: [
        "Europe has proportionally more endangered languages than any other region",
        "The Americas have a high proportion of critically endangered languages, reflecting the impact of European colonization on indigenous linguistic diversity",
        "Papua New Guinea has more endangered languages than Sub-Saharan Africa",
        "Language endangerment is primarily concentrated in economically developed regions"
      ],
      correct: 1,
      explanation: "450 of 1,000 American languages (45%) are critically endangered — the highest proportional rate. This reflects centuries of colonial language policies (forced assimilation, residential schools, official language laws) that suppressed indigenous languages in favor of Spanish, Portuguese, English, and French.",
      skill: "Unit 3: Cultural Patterns",
      difficulty: "medium"
    },
    {
      question: "Which of the following is the BEST example of a 'primate city'?",
      options: [
        "New York City — one of several major US cities including Los Angeles, Chicago, and Houston",
        "Bangkok, Thailand — containing ~45% of Thailand's urban population and ~10× the population of the next largest city",
        "Stuttgart, Germany — a regional industrial center within a polycentric urban hierarchy",
        "Bangalore, India — a technology hub that has grown to rival Mumbai in economic output"
      ],
      correct: 1,
      explanation: "A primate city dominates its country's urban system, typically being more than twice the size of the second-largest city and disproportionately concentrated in national functions (politics, finance, culture). Bangkok exemplifies this: it contains ~45% of Thailand's total urban population. The US has multiple large cities with no single primate city.",
      skill: "Unit 7: Urban Geography",
      difficulty: "medium"
    },
    {
      question: "The map shows global refugee flows in 2022. Which pattern BEST supports the concept of 'forced migration'?",
      map_description: "A flow map of global refugee movements in 2022. Major flow arrows show: (1) Syria → Turkey (3.6M, thick red arrow northward); (2) Ukraine → Poland, Germany, Czech Republic (6M+, thick arrow westward across Europe); (3) Afghanistan → Pakistan and Iran (2.6M, arrows southeast); (4) South Sudan → Uganda and DRC (2M, arrow south). Arrow thickness is proportional to refugee count. A legend shows: red = conflict-driven; orange = climate-related; countries labeled.",
      stimulus_source: "UNHCR Global Trends Report, 2022",
      options: [
        "Refugees move freely based on economic opportunity in destination countries",
        "The largest flows originate from active conflict zones (Syria, Ukraine, Afghanistan), demonstrating that armed conflict is the primary driver of forced migration",
        "Climate change is the dominant cause of refugee movements globally in 2022",
        "Geographic proximity has no effect on refugee destination choices"
      ],
      correct: 1,
      explanation: "The map shows all major flows originate from active war zones (Syria 2011+, Ukraine 2022, Afghanistan). Forced migration occurs when people flee push factors (violence, persecution) without the voluntary choice characterizing economic migration. Geographic proximity matters (Syrians → Turkey, Ukrainians → Poland) because refugees often move to nearest safe countries.",
      skill: "Unit 2: Migration",
      difficulty: "medium"
    }
  ],
  frq: [
    {
      title: "AP Human Geography FRQ — Political Geography and Devolution",
      prompt: "Use your knowledge of AP Human Geography to answer all parts.",
      stimulus: "The United Kingdom's Brexit vote (2016) and Scottish independence referendum (2014) illustrate centrifugal forces within what was once considered a stable, unified nation-state. Scotland voted 62% to Remain in the EU in the Brexit referendum, while England voted to Leave. A 2021 poll showed 50% of Scots supporting independence. Catalonia, Spain held an unauthorized independence referendum in 2017; the Basque region of Spain and France maintains a distinct language and cultural identity.",
      parts: [
        { label: "a", question: "Define 'devolution' and explain ONE specific example from the passage of a centrifugal force driving devolutionary pressure within a European nation-state.", points: 3, rubric: "1 pt: Devolution = transfer of power from central government to regional authorities, short of full independence. 1 pt: Specific example (Scottish desire for independence driven by EU membership conflict; Catalan independence driven by cultural/linguistic distinctiveness; Brexit itself as England asserting independence from EU supranationalism). 1 pt: Explains WHY it's centrifugal (pulls the state apart)." },
        { label: "b", question: "Explain how the concept of 'stateless nations' applies to at least ONE group mentioned in the passage, and explain the geographic challenge this creates for nation-state coherence.", points: 3, rubric: "1 pt: Stateless nation = a culturally/ethnically distinct group without their own sovereign state (Basque, Catalan, Scottish). 1 pt: Applies correctly to one group. 1 pt: Geographic challenge — the state's territorial boundaries don't align with the nation's cultural boundaries, creating legitimacy tensions." },
        { label: "c", question: "From a geographic perspective, explain ONE economic argument FOR and ONE economic argument AGAINST Scottish independence.", points: 4, rubric: "2 pts FOR: Scotland's North Sea oil revenues; independent monetary/fiscal policy; control over trade policy. 2 pts AGAINST: Loss of pound sterling/currency uncertainty; trade barrier with England (Scotland's largest trading partner); relocation of financial sector from Edinburgh." }
      ]
    }
  ]
};

// ─── AP Biology V2 ───────────────────────────────────────────────────────────
export const AP_BIOLOGY_V2 = {
  mcq: [
    { question: "A bacterium has a mutation in the lac operon that prevents the repressor protein from binding to the operator. The MOST likely consequence is:", options: ["The lac operon is permanently off, producing no β-galactosidase", "The lac genes are constitutively expressed regardless of lactose presence", "The genes are expressed only when glucose is absent", "The mutation has no effect because the promoter still controls transcription"], correct: 1, explanation: "The lac repressor normally binds the operator to block transcription when lactose is absent. A mutation preventing repressor binding = operator always accessible = RNA polymerase always transcribes = constitutive (constant) expression of β-galactosidase, permease, and transacetylase regardless of environmental conditions.", skill: "Unit 6: Gene Expression and Regulation", difficulty: "hard" },
    { question: "During cellular respiration, which process produces the MOST ATP per molecule of glucose?", options: ["Glycolysis", "Pyruvate oxidation", "Krebs cycle", "Oxidative phosphorylation (electron transport chain)"], correct: 3, explanation: "The ETC/oxidative phosphorylation produces ~28–32 ATP per glucose via chemiosmosis driven by the proton gradient. Glycolysis: 2 ATP net. Pyruvate oxidation: 0 ATP directly. Krebs: 2 ATP. Total ~30-32 ATP; ~28-32 come from the ETC.", skill: "Unit 3: Cellular Energetics", difficulty: "easy" },
    { question: "The table shows amino acid sequences for a protein in five species. Which two species are MOST closely related?", table_data: { headers: ["Species", "Amino acid sequence (positions 1–8)"], rows: [["Human", "Met-Ala-Gly-Val-Thr-Ile-Pro-Leu"], ["Chimpanzee", "Met-Ala-Gly-Val-Thr-Ile-Pro-Leu"], ["Gorilla", "Met-Ala-Gly-Val-Ser-Ile-Pro-Leu"], ["Macaque", "Met-Ala-Gly-Val-Ser-Val-Pro-Leu"], ["Frog", "Met-Ser-Gly-Ile-Ser-Val-Pro-Val"]] }, options: ["Human and Gorilla", "Human and Chimpanzee", "Gorilla and Macaque", "Chimpanzee and Macaque"], correct: 1, explanation: "Identical amino acid sequences indicate the fewest mutations since divergence from a common ancestor. Human and Chimpanzee share the exact same 8-position sequence — indicating most recent common ancestry. Gorilla differs at position 5 (Thr→Ser). Molecular data like this supports the phylogenetic placement of chimpanzees as humans' closest living relatives.", skill: "Unit 7: Natural Selection and Evolution", difficulty: "medium" },
    { question: "Which of the following BEST describes the role of the sodium-potassium (Na⁺/K⁺) pump in maintaining resting membrane potential?", options: ["It allows passive diffusion of Na⁺ and K⁺ down their concentration gradients", "It actively transports 3 Na⁺ out and 2 K⁺ in per cycle, maintaining a net negative charge inside the cell", "It transports equal numbers of Na⁺ and K⁺ to maintain electrical neutrality", "It only functions during action potentials to restore ion balance"], correct: 1, explanation: "The Na⁺/K⁺ ATPase uses ATP to pump 3 Na⁺ ions out and 2 K⁺ ions in per cycle — an unequal exchange creating net negative charge inside. This maintains the ~−70 mV resting potential essential for neuron function. It is active (not passive) and runs continuously, not just during action potentials.", skill: "Unit 2: Cell Structure and Function", difficulty: "medium" },
    { question: "The graph shows population growth of bacteria in a closed flask. Which factor MOST likely explains the plateau (carrying capacity) reached after 12 hours?", chart_data: { type: "line", title: "Bacterial Population Growth in Closed Flask", data: [{ hours: 0, pop_millions: 0.01 }, { hours: 2, pop_millions: 0.05 }, { hours: 4, pop_millions: 0.5 }, { hours: 6, pop_millions: 5 }, { hours: 8, pop_millions: 30 }, { hours: 10, pop_millions: 85 }, { hours: 12, pop_millions: 100 }, { hours: 14, pop_millions: 100 }, { hours: 16, pop_millions: 99 }], x_key: "hours", y_keys: ["pop_millions"], x_label: "Time (hours)", y_label: "Population (millions)" }, options: ["The bacteria have exhausted their genetic variation and can no longer adapt", "Limiting factors (nutrient depletion, waste accumulation) have reduced growth rate to equal death rate", "Temperature in the flask decreases after 12 hours, slowing metabolism", "The bacteria have reached their maximum possible cell size"], correct: 1, explanation: "In logistic growth, carrying capacity (K) is reached when limiting factors (food depletion, toxic waste buildup, space) cause death rate = birth rate. In a closed flask, nutrients become exhausted and metabolic wastes (lactic acid, CO₂) accumulate — classic density-dependent limiting factors that stop population growth at K.", skill: "Unit 8: Ecology", difficulty: "medium" },
    { question: "Which of the following is an example of disruptive selection?", options: ["The average beak size in a bird population increases during drought when only large seeds are available", "Two extremes of shell color in a snail population are favored over the intermediate color because they camouflage better in two different microhabitats", "A cheetah population's running speed is maintained near an optimal average over many generations", "Flower color in a plant population shifts toward a single preferred color due to pollinator preference"], correct: 1, explanation: "Disruptive selection favors phenotypic extremes over the mean, potentially leading to two distinct phenotype classes. Snail shells with extreme colors (matching two different backgrounds) survive better than intermediate-colored snails — classic disruptive selection. Directional selection shifts the mean (option A), stabilizing selection maintains the mean (option C).", skill: "Unit 7: Natural Selection", difficulty: "medium" },
    { question: "In DNA replication, which enzyme is responsible for relieving the tension (supercoiling) ahead of the replication fork?", options: ["DNA polymerase III", "Helicase", "DNA topoisomerase", "Primase"], correct: 2, explanation: "As helicase unwinds the double helix, positive supercoils accumulate ahead of the replication fork. DNA topoisomerase (specifically gyrase in bacteria, topoisomerase I/II in eukaryotes) cuts and rejoins the DNA to relieve this torsional stress. Without topoisomerase, replication would stop due to excessive DNA tension.", skill: "Unit 6: DNA Replication and Expression", difficulty: "hard" },
    { question: "A student measures the rate of transpiration in a plant under four conditions. Which condition produces the HIGHEST rate?", table_data: { headers: ["Condition", "Temperature", "Humidity", "Wind"], rows: [["A", "20°C", "80%", "None"], ["B", "30°C", "20%", "Strong"], ["C", "20°C", "20%", "None"], ["D", "30°C", "80%", "Strong"]] }, options: ["Condition A", "Condition B", "Condition C", "Condition D"], correct: 1, explanation: "Transpiration rate increases with: (1) higher temperature (more evaporation energy), (2) lower humidity (steeper water vapor gradient from leaf to air), and (3) wind (removes humid air near stomata, maintaining gradient). Condition B maximizes all three factors: 30°C + 20% humidity + strong wind = maximum transpiration.", skill: "Unit 4: Plant Structure and Function", difficulty: "medium" },
    { question: "Which of the following BEST explains why cancer cells can divide indefinitely?", options: ["Cancer cells perform photosynthesis, providing unlimited energy for division", "Cancer cells typically overexpress telomerase, preventing telomere shortening that normally limits cell division", "Cancer cells have extra chromosomes that provide more genes for cellular processes", "Cancer cells consume nutrients faster than normal cells, fueling unlimited growth"], correct: 1, explanation: "Telomeres shorten with each cell division; when critically short, cells enter senescence (Hayflick limit). Telomerase rebuilds telomeres but is normally active only in germ cells and stem cells. Most cancers reactivate telomerase (or use ALT mechanisms) — allowing indefinite division. This is one of Hanahan & Weinberg's 'Hallmarks of Cancer.'", skill: "Unit 4: Cell Cycle and Cancer", difficulty: "medium" },
    { question: "The CRISPR-Cas9 system can be used to edit genomes because:", options: ["It creates random mutations throughout the genome to produce genetic variation", "The guide RNA directs the Cas9 nuclease to a specific DNA sequence, which is then cut and can be repaired or replaced", "It inserts new genes by using viral vectors to deliver DNA into cell nuclei", "It silences genes by methylating histones without altering the DNA sequence"], correct: 1, explanation: "CRISPR-Cas9 uses a guide RNA (gRNA) complementary to the target DNA sequence to direct the Cas9 endonuclease to a precise genomic location. Cas9 makes a double-strand cut, which can be repaired by non-homologous end joining (NHEJ, causing mutations) or homology-directed repair (HDR, inserting new sequences). This precision distinguishes CRISPR from older, less specific gene editing methods.", skill: "Unit 6: Biotechnology", difficulty: "medium" }
  ],
  frq: [
    {
      title: "AP Biology FRQ — Evolution and Population Genetics",
      prompt: "A population of beetles lives in a forest. Brown beetles are camouflaged against tree bark; green beetles are highly visible to predators. Initially the population is 60% brown (B allele, dominant) and 40% green (bb genotype).",
      stimulus: "Assume Hardy-Weinberg equilibrium initially. Allele frequencies: p (B) = 0.60, q (b) = 0.40.",
      parts: [
        { label: "a", question: "Calculate the expected frequencies of all three genotypes (BB, Bb, bb) under Hardy-Weinberg equilibrium. Show your work.", points: 3, rubric: "1 pt: BB = p² = 0.36. 1 pt: Bb = 2pq = 0.48. 1 pt: bb = q² = 0.16." },
        { label: "b", question: "A new bird predator moves in, selectively eating green beetles. After five generations, the green beetle frequency drops to 5%. Using Hardy-Weinberg logic, calculate the new b allele frequency.", points: 3, rubric: "1 pt: bb frequency = 0.05. 1 pt: q = √0.05 ≈ 0.224. 1 pt: p = 1 − 0.224 = 0.776. Accept slight rounding differences." },
        { label: "c", question: "Explain what type of natural selection is occurring and predict a long-term evolutionary consequence for the beetle population.", points: 4, rubric: "1 pt: Directional selection (shifting allele frequency toward brown). 1 pt: The b allele frequency decreases with each generation. 1 pt: Long-term: bb phenotype may become very rare; the B allele approaches fixation. 1 pt: This illustrates microevolution — a change in allele frequencies within a population over time." }
      ]
    }
  ]
};

// ─── AP Psychology V2 ────────────────────────────────────────────────────────
export const AP_PSYCHOLOGY_V2 = {
  mcq: [
    { question: "According to Piaget's theory, a child who pours water from a tall thin glass into a short wide glass and insists there is 'less water now' is demonstrating a lack of:", options: ["Object permanence", "Conservation", "Theory of mind", "Formal operational thinking"], correct: 1, explanation: "Conservation is the understanding that quantity remains the same despite changes in appearance (volume, shape). A child lacking conservation (preoperational stage, ~2-7 years) focuses on the perceptual feature (water level) rather than the logical invariance of volume. This is one of Piaget's most famous findings.", skill: "Unit 6: Developmental Psychology", difficulty: "easy" },
    { question: "The graph shows results of a divided attention experiment. Which conclusion is MOST supported?", chart_data: { type: "bar", title: "Task Performance Under Single vs. Dual Task Conditions", data: [{ condition: "Driving only", errors: 2 }, { condition: "Driving + radio", errors: 4 }, { condition: "Driving + conversation", errors: 7 }, { condition: "Driving + texting", errors: 21 }], x_key: "condition", y_keys: ["errors"], x_label: "Condition", y_label: "Driving Errors per 10 minutes" }, options: ["Radio listening impairs driving as much as texting", "Attentional demands increase with task similarity and cognitive load, with texting most severely impairing driving", "Conversation in the car is no more distracting than listening to radio", "Divided attention has no effect on well-practiced skills like driving"], correct: 1, explanation: "Attention is a limited resource (Kahneman's capacity model). Texting has extremely high cognitive load AND uses the same visual-motor systems as driving, causing 21 errors vs. 2 for driving alone. Conversation (7 errors) requires more cognitive processing than passive radio (4 errors), supporting the idea that task similarity and cognitive demand determine dual-task interference.", skill: "Unit 3: Sensation and Perception", difficulty: "medium" },
    { question: "Schachter and Singer's two-factor theory of emotion proposes that emotion results from:", options: ["Specific patterns of physiological arousal that uniquely identify each emotion", "Cognitive labels applied to generalized physiological arousal", "Brain structures (especially the amygdala) independently generating emotional experiences", "Social learning through observation of others' emotional expressions"], correct: 1, explanation: "Schachter-Singer (1962): emotion = physiological arousal + cognitive label. In their classic experiment, participants given epinephrine (arousal) inferred different emotions (euphoria or anger) based on the social context. The arousal itself was identical; the emotion differed based on the cognitive interpretation. This is also called the 'cognitive-physiological' or 'jukebox' theory of emotion.", skill: "Unit 7: Motivation and Emotion", difficulty: "medium" },
    { question: "A therapist asks a client to challenge cognitive distortions like 'I always fail' by examining evidence for and against this belief. This technique is MOST associated with:", options: ["Psychoanalytic free association", "Cognitive Behavioral Therapy (CBT)", "Client-centered (humanistic) therapy", "Systematic desensitization"], correct: 1, explanation: "CBT (Beck, Ellis) focuses on identifying and challenging distorted automatic thoughts and cognitive schemas. 'Examining evidence' against overgeneralization ('I always fail') is a core CBT technique called 'cognitive restructuring' or 'Socratic questioning.' Psychoanalysis focuses on unconscious; humanistic therapy on empathic acceptance; systematic desensitization on anxiety hierarchies.", skill: "Unit 9: Treatment of Psychological Disorders", difficulty: "easy" },
    { question: "The table shows results from a study on conformity. Which condition produced the MOST conformity?", table_data: { headers: ["Condition", "Group Size", "Unanimity", "Conformity Rate"], rows: [["1", "1 confederate", "Yes", "3%"], ["2", "3 confederates", "Yes", "32%"], ["3", "7 confederates", "Yes", "37%"], ["4", "7 confederates, 1 ally", "No", "6%"], ["5", "7 confederates", "No (1 dissenter)", "9%"]] }, options: ["Condition 3 — maximum group size with unanimity", "Condition 2 — smaller group is more persuasive per person", "Condition 4 — having an ally reduces conformity most effectively", "Condition 1 — individual judgment is most accurate with no group pressure"], correct: 0, explanation: "In Asch-style conformity research: conformity increases with group size up to ~4-5 people (diminishing returns beyond that), and requires unanimity. Condition 3 (7 unanimous confederates) produces maximum conformity (37%). Breaking unanimity (Conditions 4-5) dramatically reduces conformity — even one dissenter cuts conformity to 6-9%, showing unanimity is crucial.", skill: "Unit 9: Social Psychology", difficulty: "medium" },
    { question: "Which of the following provides the STRONGEST evidence for the role of genetics in psychological disorders?", options: ["Identical twins raised together have higher concordance rates than fraternal twins", "Identical twins raised APART have similar concordance rates for schizophrenia (~50%) as identical twins raised together", "Adopted children develop the same disorder as their adoptive parents", "The incidence of depression is identical across all cultures"], correct: 1, explanation: "The strongest genetic evidence comes from MZ twins raised apart — they share genes but not environment. If MZ twins apart show ~50% concordance for schizophrenia (compared to DZ twins' ~10-15%), this implicates genetic factors strongly. MZ twins raised together confound genetics and shared environment, making apart-raised twins the cleaner test.", skill: "Unit 8: Psychological Disorders — Etiology", difficulty: "hard" },
    { question: "In operant conditioning, which schedule of reinforcement produces behavior MOST resistant to extinction?", options: ["Fixed ratio", "Fixed interval", "Variable ratio", "Continuous reinforcement"], correct: 2, explanation: "Variable ratio schedules (reinforce after an unpredictable number of responses) produce the highest response rates AND greatest resistance to extinction. Slot machines use VR schedules — the unpredictable payoff creates persistent responding. Continuous reinforcement is easiest to extinguish because the learner immediately notices when reinforcement stops.", skill: "Unit 5: Learning — Operant Conditioning", difficulty: "medium" },
    { question: "The phenomenon where a person in a coma responds to their name more strongly than to other names BEST illustrates:", options: ["Top-down processing overriding sensory input", "Selective attention operating even without conscious awareness", "Short-term memory consolidation during unconscious states", "The cocktail party effect requiring full conscious attention"], correct: 1, explanation: "Selective attention (Cherry's cocktail party effect) allows the brain to process personally relevant stimuli — like one's own name — even without conscious awareness. EEG studies show increased P300 brain waves in response to the coma patient's own name, demonstrating that selective attention mechanisms function below the level of consciousness.", skill: "Unit 3: States of Consciousness", difficulty: "hard" },
    { question: "Which of the following BEST exemplifies the concept of 'heuristics' in decision-making?", options: ["Solving a calculus problem by applying a proven algorithm step-by-step", "Assuming a person is a librarian rather than a farmer because they are quiet and bookish, without considering base rates", "Using formal logic to evaluate all possible outcomes before deciding", "Repeating an experiment multiple times to verify results"], correct: 1, explanation: "Heuristics are mental shortcuts (quick, 'good enough' rules) — useful but subject to systematic biases. Assuming someone is a librarian based on stereotypical traits (representativeness heuristic) ignores base rates (there are far more farmers than librarians). Kahneman and Tversky's work showed heuristics often produce predictable errors in judgment.", skill: "Unit 7: Cognition — Thinking and Decision Making", difficulty: "medium" },
    { question: "The biological perspective on depression would MOST emphasize:", options: ["Unconscious conflicts stemming from unresolved childhood trauma", "Learned helplessness from repeated uncontrollable negative events", "Deficiencies in serotonin, norepinephrine, and/or dopamine neurotransmitter systems", "Negative automatic thoughts and cognitive distortions about self, world, and future"], correct: 2, explanation: "The biological/biomedical perspective emphasizes neurotransmitter imbalances — particularly the monoamine hypothesis: insufficient serotonin, norepinephrine, and dopamine. This is supported by the efficacy of SSRIs (raise serotonin), SNRIs, and MAOIs. Psychoanalytic = unconscious conflicts; behavioral = learned helplessness; cognitive = Beck's negative triad.", skill: "Unit 8: Psychological Disorders", difficulty: "easy" }
  ],
  frq: [
    {
      title: "AP Psychology FRQ — Biological Bases of Behavior",
      prompt: "A researcher studies the role of the prefrontal cortex (PFC) in decision-making by examining patients with PFC damage from traumatic brain injury.",
      stimulus: "Patients with PFC damage scored normally on IQ tests and personality measures, but showed dramatically impaired performance on gambling tasks requiring weighing long-term consequences. They also showed increased impulsive behavior in daily life despite intact knowledge of social norms.",
      parts: [
        { label: "a", question: "Identify the brain region mentioned and explain its PRIMARY function in normal behavior, providing ONE specific example of behavior it controls.", points: 3, rubric: "1 pt: Prefrontal cortex (frontal lobe). 1 pt: Controls executive functions — planning, decision-making, impulse control, working memory, social behavior. 1 pt: Specific example: resisting impulse to eat junk food; planning a schedule; adapting behavior based on consequences (accept any specific example)." },
        { label: "b", question: "The patients showed normal IQ but impaired real-life decision-making. Explain what this dissociation reveals about the relationship between intelligence and brain function.", points: 3, rubric: "1 pt: Different cognitive abilities are localized in different brain regions (modular organization). 1 pt: IQ tests measure general intelligence (parietal, temporal regions) independently of executive function. 1 pt: Reveals that rational knowledge (knowing what's right) and real-world decision-making (acting on it) are neurologically dissociable — Damasio's somatic marker hypothesis." },
        { label: "c", question: "Describe how a neuroscientist could use ONE brain imaging technique to study which brain areas are active when healthy participants make risky decisions. Name the technique and explain what it measures.", points: 4, rubric: "1 pt: Names fMRI (or PET or EEG). 1 pt: fMRI measures blood oxygen level-dependent (BOLD) signal — oxygenated blood flow increases to active brain areas. 1 pt: Experimental design — show gambling task while scanning; compare brain activity during risky vs. safe choices. 1 pt: Expected finding — prefrontal cortex, amygdala, and nucleus accumbens would show differential activation." }
      ]
    }
  ]
};

// ─── AP Calculus AB V2 ──────────────────────────────────────────────────────
export const AP_CALCULUS_AB_V2 = {
  mcq: [
    { question: "What is the derivative of f(x) = eˣ · cos(x)?", options: ["eˣ · cos(x) − eˣ · sin(x)", "eˣ · cos(x) + eˣ · sin(x)", "−eˣ · sin(x)", "eˣ · sin(x)"], correct: 0, explanation: "Product rule: d/dx[uv] = u'v + uv'. u = eˣ, u' = eˣ; v = cos(x), v' = −sin(x). f'(x) = eˣ·cos(x) + eˣ·(−sin(x)) = eˣcos(x) − eˣsin(x) = eˣ(cos x − sin x).", skill: "Unit 3: Differentiation — Product Rule", difficulty: "medium" },
    { question: "∫₀^π sin(x) dx = ?", options: ["0", "1", "2", "π"], correct: 2, explanation: "[−cos(x)]₀^π = −cos(π) − (−cos(0)) = −(−1) − (−1) = 1 + 1 = 2.", skill: "Unit 6: Integration", difficulty: "easy" },
    { question: "A function f is concave down on (a, b). Which statement is necessarily true?", options: ["f'(x) > 0 for all x in (a, b)", "f''(x) < 0 for all x in (a, b)", "f(x) has a local maximum at some point in (a, b)", "f'(x) is increasing on (a, b)"], correct: 1, explanation: "Concave down means the graph is 'frowning' — the slope is decreasing. f''(x) < 0 on (a,b) by definition. f'(x) can be positive, negative, or zero on the interval. A local max is possible but not guaranteed.", skill: "Unit 5: Analytical Applications", difficulty: "medium" },
    { question: "lim(x→2) (x²−4)/(x−2) = ?", options: ["0", "2", "4", "Does not exist"], correct: 2, explanation: "Factor: (x²−4)/(x−2) = (x+2)(x−2)/(x−2) = x+2 for x≠2. lim(x→2)(x+2) = 4.", skill: "Unit 1: Limits", difficulty: "easy" },
    { question: "Using implicit differentiation, find dy/dx for x² + y² = 25.", options: ["2x + 2y", "−x/y", "x/y", "−2x/(2y)"], correct: 1, explanation: "Differentiate both sides: 2x + 2y(dy/dx) = 0. Solve: dy/dx = −2x/(2y) = −x/y.", skill: "Unit 3: Implicit Differentiation", difficulty: "medium" },
    { question: "The area under the velocity curve v(t) from t=0 to t=5 represents:", options: ["Acceleration at t=5", "Total displacement over [0,5]", "Average velocity", "Instantaneous speed at t=2.5"], correct: 1, explanation: "The definite integral ∫₀⁵ v(t)dt gives displacement (signed change in position), not distance. If v(t) > 0 throughout, it equals total distance. This is the Fundamental Theorem of Calculus applied to motion.", skill: "Unit 8: Applications of Integration", difficulty: "easy" },
    { question: "For what value of x does f(x) = x³ − 3x² + 3 have a point of inflection?", options: ["x = 0", "x = 1", "x = 2", "x = 3"], correct: 1, explanation: "f'(x) = 3x² − 6x. f''(x) = 6x − 6. Set f''(x) = 0: 6x = 6, x = 1. Check sign change: f''(0) = −6 < 0; f''(2) = 6 > 0. Sign change confirms inflection at x = 1.", skill: "Unit 5: Second Derivative Test", difficulty: "medium" },
    { question: "∫ x·e^(x²) dx = ?", options: ["e^(x²) + C", "(1/2)e^(x²) + C", "2x·e^(x²) + C", "x²·e^(x²)/2 + C"], correct: 1, explanation: "U-substitution: u = x², du = 2x dx, so x dx = du/2. ∫ e^u · (du/2) = (1/2)e^u + C = (1/2)e^(x²) + C.", skill: "Unit 6: Integration — U-substitution", difficulty: "medium" },
    { question: "Mean Value Theorem guarantees that for f(x) = x² on [1,3], there exists c where f'(c) equals:", options: ["2", "4", "5", "The MVT does not apply"], correct: 1, explanation: "MVT: f'(c) = [f(b)−f(a)]/(b−a) = [9−1]/(3−1) = 8/2 = 4. f'(x) = 2x, so 2c = 4, c = 2. (c = 2 is in (1,3). ✓)", skill: "Unit 5: Mean Value Theorem", difficulty: "medium" },
    { question: "The volume of the solid formed by rotating y = √x (from x=0 to x=4) around the x-axis is:", options: ["4π", "8π", "16π", "32π"], correct: 1, explanation: "Disk method: V = π∫₀⁴ [√x]² dx = π∫₀⁴ x dx = π[x²/2]₀⁴ = π(16/2) = 8π.", skill: "Unit 8: Volume of Revolution", difficulty: "hard" }
  ],
  frq: [
    {
      title: "AP Calculus AB FRQ — Accumulation and the Fundamental Theorem",
      prompt: "A particle moves along the x-axis with velocity v(t) = t² − 4t + 3 for t ≥ 0.",
      stimulus: "The particle's initial position is x(0) = 2.",
      parts: [
        { label: "a", question: "Find all times t ≥ 0 when the particle is at rest. Determine if the particle is moving left or right just before and after each time.", points: 4, rubric: "1 pt: v(t) = (t−1)(t−3), so t = 1 and t = 3. 1 pt: t ∈ (0,1): v > 0 (right). t ∈ (1,3): v < 0 (left). t > 3: v > 0 (right). 2 pts for full correct analysis." },
        { label: "b", question: "Find the total distance traveled by the particle from t=0 to t=4.", points: 4, rubric: "1 pt: Distance = ∫₀¹ v dt + |∫₁³ v dt| + ∫₃⁴ v dt (absolute values). 1 pt: ∫₀¹ (t²−4t+3)dt = [t³/3−2t²+3t]₀¹ = 1/3−2+3 = 4/3. 1 pt: |∫₁³ ...| = |[t³/3−2t²+3t]₁³| = |(9−18+9)−(4/3)| = 4/3. 1 pt: ∫₃⁴ ... = [64/3−32+12]−[9−18+9] = 4/3. Total = 4/3+4/3+4/3 = 4." },
        { label: "c", question: "Find the position x(t) at t = 4.", points: 2, rubric: "1 pt: x(t) = x(0) + ∫₀⁴ v(t)dt = 2 + [t³/3 − 2t² + 3t]₀⁴ = 2 + (64/3 − 32 + 12) = 2 + (64/3 − 20). 1 pt: = 2 + 4/3 = 10/3 ≈ 3.33." }
      ]
    }
  ]
};

// ─── AP Macroeconomics V2 ────────────────────────────────────────────────────
export const AP_MACROECONOMICS_V2 = {
  mcq: [
    { question: "When the government decreases taxes by $100B and the MPC is 0.75, what is the total change in GDP via the tax multiplier?", options: ["$100B", "$300B", "$400B", "$75B"], correct: 1, explanation: "Tax multiplier = −MPC/(1−MPC) = −0.75/0.25 = −3. Change in GDP = −3 × (−$100B) = +$300B. Note: the tax multiplier is smaller than the spending multiplier (1/(1−MPC) = 4) because the first-round effect of a tax cut is saving (MPS = 0.25), not direct spending.", skill: "Unit 3: Fiscal Policy — Tax Multiplier", difficulty: "hard" },
    { question: "The table shows economic indicators for a country. Which combination is MOST consistent with a contractionary monetary policy response?", table_data: { headers: ["Indicator", "Current Value", "Target"], rows: [["Inflation", "7.2%", "2%"], ["Unemployment", "3.5%", "4-5%"], ["GDP Growth", "4.8%", "2-3%"], ["Federal Funds Rate", "0.25%", "—"]] }, options: ["Decrease the federal funds rate to stimulate more growth", "Increase the federal funds rate to reduce inflation and cool the economy", "Purchase government bonds to inject money into the banking system", "Decrease the reserve requirement to expand money supply"], correct: 1, explanation: "Inflation (7.2%) far exceeds the 2% target, unemployment is very low, and growth is above trend — classic overheating/inflationary gap. Contractionary monetary policy = raise federal funds rate → higher borrowing costs → less investment and consumption → AD shifts left → lower inflation. The Fed raised rates aggressively in 2022-2023 precisely for this reason.", skill: "Unit 4: Monetary Policy", difficulty: "medium" },
    { question: "If a country's real GDP grows by 3% while its population grows by 1%, what happens to real GDP per capita?", options: ["It falls by 2%", "It grows by approximately 2%", "It grows by 3%", "It stays the same"], correct: 1, explanation: "Real GDP per capita growth ≈ Real GDP growth − Population growth = 3% − 1% = 2%. This approximation holds for small percentages. GDP per capita is the primary measure of living standards — population growth dilutes GDP growth's welfare benefits.", skill: "Unit 2: Economic Indicators", difficulty: "easy" },
    { question: "The graph shows a country's business cycle over 10 years. What is happening at Point C?", chart_data: { type: "line", title: "Real GDP vs. Potential GDP (Business Cycle)", data: [{ year: 1, real_gdp: 95, potential: 100 }, { year: 2, real_gdp: 97, potential: 102 }, { year: 3, real_gdp: 105, potential: 104 }, { year: 4, real_gdp: 108, potential: 106 }, { year: 5, real_gdp: 110, potential: 108 }, { year: 6, real_gdp: 107, potential: 110 }, { year: 7, real_gdp: 103, potential: 112 }, { year: 8, real_gdp: 100, potential: 113 }, { year: 9, real_gdp: 102, potential: 115 }, { year: 10, real_gdp: 106, potential: 117 }], x_key: "year", y_keys: ["real_gdp", "potential"], x_label: "Year", y_label: "GDP Index" }, options: ["The economy is in a recessionary gap — output is below potential", "The economy is at its peak — real GDP equals potential GDP", "The economy is in an inflationary gap — real GDP exceeds potential", "The economy has entered a depression with permanently falling potential"], correct: 2, explanation: "At Point C (approximately years 3-5), real GDP exceeds potential GDP — an inflationary gap. This means the economy is producing beyond its sustainable capacity, typically accompanied by low unemployment, rising wages, and inflation. The AD-AS model shows the economy to the right of the LRAS curve.", skill: "Unit 3: Business Cycles", difficulty: "medium" },
    { question: "Which of the following is an example of an 'automatic stabilizer'?", options: ["Congress passing a $500B stimulus package in response to recession", "The Federal Reserve cutting interest rates during a downturn", "Unemployment insurance payments that automatically increase when unemployment rises", "A presidential executive order freezing prices during inflation"], correct: 2, explanation: "Automatic stabilizers are built-in fiscal mechanisms that automatically stimulate AD during recessions (without legislative action) and slow AD during expansions. Unemployment insurance increases payouts during recessions (preventing consumption from falling as much) and decreases during expansions. Progressive income taxes also act as automatic stabilizers.", skill: "Unit 3: Fiscal Policy — Automatic Stabilizers", difficulty: "easy" },
    { question: "Which of the following would MOST likely cause stagflation?", options: ["An increase in consumer confidence boosting spending", "A dramatic rise in oil prices increasing production costs across the economy", "The government increasing spending during a recession", "The Federal Reserve lowering interest rates to stimulate growth"], correct: 1, explanation: "Stagflation = simultaneous inflation + recession (rising unemployment). A supply shock (oil price spike, as in 1973 OPEC embargo and 2022 energy crisis) shifts SRAS LEFT — raising the price level (inflation) AND reducing output (recession). Demand-side factors alone cannot cause stagflation — they move price level and output in the same direction.", skill: "Unit 5: Inflation and Unemployment", difficulty: "medium" },
    { question: "The Loanable Funds Market interest rate MOST directly coordinates:", options: ["Government budget deficits and monetary policy", "The supply of savings by households and the demand for borrowing by firms and government", "International trade flows and currency exchange rates", "The relationship between inflation and nominal wages"], correct: 1, explanation: "The loanable funds model shows how real interest rates are determined by the interaction of savers (supply) and borrowers (demand for funds). At equilibrium, investment = saving. Higher real interest rates attract more saving (supply) and deter borrowing (demand), maintaining balance.", skill: "Unit 4: Financial Sector", difficulty: "medium" },
    { question: "A country with a fixed exchange rate finds its exports becoming less competitive internationally. Which policy could MOST directly restore competitiveness?", options: ["Raising domestic interest rates to attract foreign capital", "Devaluing the currency — reducing the fixed exchange rate to make exports cheaper", "Imposing tariffs on imports to reduce the trade deficit", "Increasing government spending to boost domestic demand"], correct: 1, explanation: "Devaluation (for fixed exchange rates) or depreciation (for floating rates) makes a country's exports cheaper in foreign currency terms, restoring competitiveness. Countries like China (managed exchange rate) and historical examples (UK 1967, Asian crisis countries 1997-98) have used devaluation to boost export competitiveness.", skill: "Unit 6: Open Economy — Exchange Rates", difficulty: "hard" },
    { question: "The 'crowding out' effect suggests that government borrowing:", options: ["Stimulates private investment by increasing confidence in the economy", "Raises real interest rates, reducing private investment and partially offsetting expansionary fiscal policy", "Has no effect on private sector activity", "Reduces the money supply directly through Treasury bond sales"], correct: 1, explanation: "When government borrows (issues bonds), it competes with private borrowers in the loanable funds market, raising real interest rates. Higher rates reduce private investment (I falls), partially offsetting the stimulus from increased G. The net multiplier effect of government spending is reduced by crowding out. This is a key argument against fiscal stimulus effectiveness.", skill: "Unit 3: Fiscal Policy — Crowding Out", difficulty: "hard" },
    { question: "Which of the following is NOT included in the calculation of the unemployment rate?", options: ["A worker who lost their job and is actively applying to new positions", "A person who gave up looking for work after 6 months (discouraged worker)", "A part-time worker who wants full-time work but cannot find it", "A recent college graduate who has been sending resumes for three months"], correct: 1, explanation: "The official unemployment rate (U-3) includes only those without jobs who are actively seeking work. Discouraged workers (who want jobs but have given up searching) are excluded — they are not counted in the labor force. This is why U-6 (broader unemployment) includes discouraged workers and underemployed part-time workers, and always exceeds the headline U-3 rate.", skill: "Unit 2: Unemployment", difficulty: "medium" }
  ],
  frq: [
    {
      title: "AP Macroeconomics FRQ — AD-AS and International Trade",
      prompt: "Assume Country X has a floating exchange rate and is experiencing a current account deficit. Its trading partner, Country Y, experiences rapid economic growth.",
      stimulus: "Country X data: Real GDP = $2.0T, Potential GDP = $2.2T, Inflation = 1.8%, Unemployment = 6.5%",
      parts: [
        { label: "a", question: "Is Country X experiencing a recessionary or inflationary gap? Draw and label an AD-AS diagram showing this situation.", points: 4, rubric: "1 pt: Recessionary gap (real GDP $2.0T < potential $2.2T). 1 pt: AD intersects SRAS to the LEFT of LRAS. 1 pt: Label AD, SRAS, LRAS, output gap. 1 pt: Price level and output correctly shown below potential." },
        { label: "b", question: "Country Y's rapid growth increases its demand for Country X's exports. Explain the sequence of effects on Country X's economy, using AD-AS terminology.", points: 4, rubric: "1 pt: X exports increase → net exports (NX) rise. 1 pt: AD shifts right (higher NX = higher aggregate demand). 1 pt: Output rises toward potential; unemployment falls. 1 pt: Price level rises somewhat; recessionary gap shrinks." },
        { label: "c", question: "How would Country X's floating exchange rate likely respond to increased export demand from Country Y, and how might this exchange rate change affect the size of the AD increase?", points: 2, rubric: "1 pt: Increased export demand → demand for Country X's currency rises → X's currency appreciates. 1 pt: Appreciated currency makes X's exports MORE expensive (less competitive), partially offsetting the AD increase — automatic stabilizer effect." }
      ]
    }
  ]
};

// ─── AP US History V2 ────────────────────────────────────────────────────────
export const AP_US_HISTORY_V2 = {
  mcq: [
    { question: "The excerpt from President Truman's 1947 address to Congress MOST directly represents which foreign policy doctrine?", stimulus: "I believe that it must be the policy of the United States to support free peoples who are resisting attempted subjugation by armed minorities or by outside pressures. I believe that we must assist free peoples to work out their own destinies in their own way... The free peoples of the world look to us for support in maintaining their freedoms.", stimulus_source: "President Harry Truman, Address to Congress, March 12, 1947", stimulus_header: "Question 1 refers to the following excerpt.", options: ["Monroe Doctrine extending US control over Latin American nations", "Truman Doctrine committing the US to containing communist expansion globally", "Marshall Plan providing economic assistance to rebuild European economies", "NSC-68 calling for massive military rearmament to confront Soviet power"], correct: 1, explanation: "The Truman Doctrine (1947) committed the US to supporting 'free peoples' resisting communist subversion or external pressure — initially Greece and Turkey. This marked the beginning of containment strategy, extending US commitments globally beyond the Western Hemisphere. It represented a fundamental departure from pre-WWII isolationism.", skill: "Period 8: Cold War Origins", difficulty: "medium" },
    { question: "The table shows land area owned by various groups after 1887. Which conclusion is MOST supported by the pattern shown?", table_data: { headers: ["Group", "Land Holdings 1887", "Land Holdings 1934", "Change"], rows: [["Native Americans (total)", "138 million acres", "48 million acres", "−65%"], ["Non-Indian homesteaders", "—", "90 million acres transferred", ""], ["Federal government (surplus)", "—", "~27 million acres retained", ""]] }, stimulus_source: "US Commission on Civil Rights, The Dawes Act and Its Legacy, 1981", options: ["The Dawes Act succeeded in creating a prosperous Native American landowning class", "The Dawes Act resulted in massive transfer of Native American land to white settlers and the federal government, undermining tribal sovereignty", "The federal government returned most surplus land to tribes by 1934", "Land loss was primarily due to voluntary sales at market rates"], correct: 1, explanation: "The Dawes Act (1887) allotted 160-acre parcels to individual Native Americans and opened 'surplus' reservation land to white settlement. The data shows a 65% reduction in Native American land — from 138M to 48M acres. Most went to white homesteaders (~90M acres) or the federal government. The Indian Reorganization Act (1934) ended allotment, recognizing its devastating effects.", skill: "Period 6: Gilded Age", difficulty: "medium" },
    { question: "President Roosevelt's 'New Deal' represented a significant expansion of federal power PRIMARILY because it:", options: ["Eliminated all state government authority over economic regulation", "Established the precedent that the federal government had responsibility for economic welfare and social safety nets", "Replaced capitalism with a socialist economic system", "Was unanimously supported by Congress, business, and the Supreme Court"], correct: 1, explanation: "The New Deal's historical significance was establishing the precedent that the federal government — not states, charities, or markets alone — bore responsibility for economic welfare. Programs like Social Security, banking regulation (FDIC), labor rights (NLRA), and unemployment insurance created the modern American welfare state.", skill: "Period 8: New Deal Era", difficulty: "medium" },
    { question: "The Civil Rights Act of 1964 was made possible by which combination of factors?", options: ["The Supreme Court ordered Congress to pass civil rights legislation after Brown v. Board of Education", "LBJ's political skill, the civil rights movement's moral pressure, and national reaction to Southern violence against peaceful protesters", "Northern states threatening to secede if Southern segregation continued", "A constitutional amendment removing states' rights to regulate public accommodations"], correct: 1, explanation: "The 1964 Act resulted from: LBJ using his congressional mastery to break a Southern filibuster; the mass mobilization of the civil rights movement (Birmingham campaign 1963, March on Washington); national TV coverage of police brutality against peaceful protesters shocking Northern white opinion; and the political momentum after JFK's assassination.", skill: "Period 8: Civil Rights Movement", difficulty: "medium" },
    { question: "The graph shows US income inequality (Gini coefficient) from 1940–2020. Which historical interpretation is BEST supported?", chart_data: { type: "line", title: "US Income Inequality (Gini Coefficient) 1940–2020", data: [{ year: 1945, gini: 0.37 }, { year: 1955, gini: 0.36 }, { year: 1965, gini: 0.36 }, { year: 1975, gini: 0.39 }, { year: 1980, gini: 0.40 }, { year: 1990, gini: 0.43 }, { year: 2000, gini: 0.46 }, { year: 2010, gini: 0.47 }, { year: 2020, gini: 0.49 }], x_key: "year", y_keys: ["gini"], x_label: "Year", y_label: "Gini Coefficient" }, options: ["The postwar era of 1945–1970 saw decreasing inequality, while deregulation and supply-side policies after 1980 coincided with rising inequality", "Inequality remained perfectly constant throughout the 20th century", "The New Deal eliminated income inequality permanently by 1940", "Income inequality peaked during WWII and has declined steadily since"], correct: 0, explanation: "The data shows relatively stable/declining inequality in the postwar era (the 'Great Compression' of WWII and New Deal era) followed by sharply rising inequality after 1980. This pattern is associated with Reagan-era tax cuts, deregulation, declining union membership, globalization, and technology displacing middle-skill workers — empirical support for historical arguments about inequality trends.", skill: "Period 9: Recent American History", difficulty: "hard" },
    { question: "Which of the following BEST explains why the United States entered World War I in April 1917?", options: ["Germany directly attacked American territory at Pearl Harbor", "The Zimmermann Telegram's proposal of a German-Mexican alliance and unrestricted submarine warfare threatening American lives and trade", "Congressional declaration of war after the Senate voted unanimously", "American munitions manufacturers lobbied Congress to enter the war to protect their profits"], correct: 1, explanation: "Multiple factors triggered US entry: Germany's resumption of unrestricted submarine warfare (Feb 1917) threatening US ships and lives; British interception of the Zimmermann Telegram proposing a German-Mexican military alliance against the US; and Wilson's idealistic goal of making the world 'safe for democracy.' Pearl Harbor was WWII (1941). Senate was not unanimous.", skill: "Period 7: WWI", difficulty: "medium" },
    { question: "The Second Great Awakening (early 19th century) MOST directly contributed to:", options: ["The secularization of American public life", "The abolitionist movement, temperance reform, and women's rights activism by linking religious conviction to social reform", "The spread of Catholicism as the dominant American religion", "The weakening of organized religion in frontier communities"], correct: 1, explanation: "The Second Great Awakening's revival theology emphasized individual responsibility and human capacity for moral improvement — inspiring reform movements. Charles Finney, Lyman Beecher, and others connected evangelical Christianity to abolition, temperance (WCTU), prison reform, and women's rights. The Seneca Falls Convention (1848) drew heavily on religious language about God-given equality.", skill: "Period 4: Reform Movements", difficulty: "medium" },
    { question: "The Korean War (1950–1953) ended with:", options: ["A decisive American victory restoring South Korea's original borders and capturing Pyongyang", "An armistice roughly along the 38th parallel, with no formal peace treaty — a military stalemate", "Chinese forces withdrawing entirely from the Korean peninsula", "North Korea surrendering unconditionally to UN forces"], correct: 1, explanation: "The Korean War ended in an armistice (July 27, 1953) — not a peace treaty — with the border restored approximately along the 38th parallel (where it began). It demonstrated the limits of containment: the US neither 'rolled back' communism in North Korea nor suffered defeat, but achieved its limited goal of defending South Korea. No formal peace treaty has ever been signed.", skill: "Period 8: Cold War — Korean War", difficulty: "medium" },
    { question: "The Great Migration (1910–1970) refers to:", options: ["European immigrants moving from East Coast cities to the Midwest during industrialization", "Millions of African Americans moving from the rural South to Northern and Western cities", "The westward migration of homesteaders following the Homestead Act of 1862", "Puerto Rican migration to New York City following WWII"], correct: 1, explanation: "The Great Migration involved approximately 6 million African Americans leaving the Jim Crow South (1910-1970) for industrial cities (Chicago, Detroit, New York, Los Angeles). Push factors: racial violence, sharecropping poverty, political disenfranchisement. Pull factors: industrial jobs, higher wages, political rights. It transformed Northern cities culturally and politically.", skill: "Period 7/8: African American History", difficulty: "easy" },
    { question: "The 'domino theory,' used to justify American involvement in Vietnam, held that:", options: ["Communist countries would inevitably collapse from internal contradictions within 50 years", "If one country fell to communism, neighboring countries would successively fall like dominoes", "American democracy would spread to communist nations through trade and engagement", "Military superiority would deter Soviet nuclear attack on Western Europe"], correct: 1, explanation: "The domino theory (articulated by Eisenhower, 1954) held that if South Vietnam fell to communism, other Southeast Asian nations would follow — Thailand, Laos, Cambodia, Indonesia. This justified massive American involvement despite the country's limited strategic importance. Post-Vietnam analysis showed neighboring countries did not automatically fall (Thailand, for example, remained non-communist).", skill: "Period 8: Vietnam War", difficulty: "easy" }
  ],
  frq: [
    {
      title: "AP US History LEQ — Progressive Era and Reform",
      prompt: "Evaluate the extent to which Progressive Era reforms (1890–1920) addressed the problems created by industrialization and urbanization in the United States.",
      stimulus: "Consider political reforms (direct democracy, regulatory agencies), labor reforms, and social welfare initiatives in your response.",
      parts: [
        { label: "a", question: "Describe TWO specific Progressive Era reforms and explain how each addressed a problem created by industrialization.", points: 4, rubric: "2 pts each: (1 pt reform identification; 1 pt explanation linking to industrialization). Examples: Sherman Antitrust Act/Clayton Act — broke up monopolies exploiting workers and consumers; Pure Food and Drug Act (1906) — regulated unsafe industrial food processing; 17th Amendment — direct election of senators corrupted by railroad/industrial money; OSHA-type workplace reforms; Federal Trade Commission." },
        { label: "b", question: "Explain ONE significant LIMITATION of Progressive Era reforms — either who was excluded from reform benefits or how reforms fell short of their goals.", points: 3, rubric: "1 pt: Identifies specific limitation. 1 pt: Explains mechanism. 1 pt: Provides evidence. Examples: African Americans systematically excluded (Wilson's segregation of federal workforce); women's suffrage achieved in 1920 but Black women in South couldn't vote; antitrust laws weakly enforced; immigration restriction targeted certain groups." },
        { label: "c", question: "How did the Progressive Era's reforms reflect broader debates about the proper role of the federal government in American economic life? Connect to the specific constitutional framework.", points: 3, rubric: "1 pt: Identifies the shift from laissez-faire to regulatory state. 1 pt: Constitutional connection (commerce clause expanding federal power; 16th Amendment income tax; debates over states vs. federal regulation). 1 pt: Historical significance — established precedent for New Deal and modern regulatory state." }
      ]
    }
  ]
};

// ─── AP World History V2 ─────────────────────────────────────────────────────
export const AP_WORLD_HISTORY_V2 = {
  mcq: [
    { question: "The map shows the spread of the Black Death in Europe from 1347–1353. Which conclusion is MOST directly supported?", map_description: "A map of Europe showing the spread of plague from 1347–1353 using concentric shading. The darkest shading (1347) covers Sicily, southern Italy, and southern France. By 1348: all of France, Iberia, Italy, most of the Holy Roman Empire. By 1349: England, Scandinavia begins. By 1351: reaches Poland and Lithuania. The map shows arrows from trade routes (Mediterranean ports, Silk Road terminus). Areas labeled: Venice, Genoa, Paris, London. A small area in Poland shows minimal impact (lighter shading). Note: arrows show disease following major trade routes.", stimulus_source: "Adapted from David Herlihy, The Black Death and the Transformation of the West, 1997", options: ["The plague spread from north to south, originating in Scandinavia", "The plague followed trade routes from the Mediterranean northward, consistent with the role of merchant shipping in spreading the disease", "Poland and Lithuania were unaffected due to geographic isolation from trade routes", "The Black Death spread at a uniform rate across all of Europe simultaneously"], correct: 1, explanation: "The map shows the plague moving along Mediterranean trade routes — Sicily (1347) → Italian city-states → French ports → inland. This reflects the historical record: infected rats on Genoese merchant ships brought plague from Black Sea ports (where Mongol trade brought it from Central Asia). Trade connectivity = disease vulnerability.", skill: "Unit 3: Transoceanic Interconnections", difficulty: "medium" },
    { question: "The Industrial Revolution's social consequences included which of the following MOST significantly?", options: ["Immediate improvement in living standards for all social classes", "The emergence of a working-class proletariat living in urban squalor, generating labor movements and socialist ideology", "Rural populations benefiting from agricultural mechanization before urban workers", "Women gaining full political equality as industrial employment gave them economic independence"], correct: 1, explanation: "Industrialization created massive urban working-class (proletariat) populations concentrated in factory towns (Manchester, Birmingham, Leeds) with dangerous conditions, 12-16 hour workdays, child labor, and unsanitary housing. Engels' 'Condition of the Working Class in England' (1845) documented this. These conditions spawned Owenism, Chartism, trade unionism, and Marxist theory.", skill: "Unit 5: Industrialization — Social Consequences", difficulty: "medium" },
    { question: "Which of the following BEST explains why the Chinese tributary system differed fundamentally from European colonial systems in the 15th–17th centuries?", options: ["China possessed superior military technology that prevented European-style conquest", "The tributary system sought symbolic acknowledgment of Chinese supremacy without extracting resources or establishing territorial control", "China had no interest in trade, relying entirely on domestic production", "European nations adopted the tributary system after encountering it in East Asia"], correct: 1, explanation: "The tributary system required neighboring states to acknowledge the Chinese emperor's superiority (ritual kowtow, tribute gifts) in exchange for trading rights and imperial recognition. Unlike European colonialism, China didn't systematically extract resources, establish permanent colonies, or exercise legal jurisdiction. This 'soft power' approach was fundamentally different from Portuguese/Spanish/Dutch extraction systems.", skill: "Unit 4: Transoceanic Interconnections", difficulty: "hard" },
    { question: "Mahatma Gandhi's strategy of non-violent civil disobedience (satyagraha) was MOST effective in achieving Indian independence because:", options: ["It immediately forced British military withdrawal due to physical resistance", "It delegitimized British rule by exposing the contradiction between Britain's democratic values and colonial oppression, mobilizing both Indian masses and international opinion", "The British government agreed with Gandhi's philosophical principles", "It was adopted by all Indian independence leaders without disagreement"], correct: 1, explanation: "Satyagraha worked by: (1) mobilizing India's masses through accessible symbolic acts (Salt March 1930); (2) exposing British hypocrisy — democracy for Britain, repression for colonies — which undermined moral legitimacy; (3) generating international press coverage of British violence against non-violent protesters; (4) making the cost of maintaining colonial rule higher than its benefits.", skill: "Unit 7: Imperialism and Independence Movements", difficulty: "medium" },
    { question: "The table shows trade data for European colonial powers in 1700. Which conclusion is MOST supported?", table_data: { headers: ["Colonial Power", "Primary Colonial Exports (to Europe)", "Primary European Exports (to colonies)"], rows: [["Spain/Portugal", "Silver, sugar, tobacco", "Manufactured goods, enslaved Africans"], ["Britain", "Tobacco, cotton, indigo, sugar", "Textiles, metal goods, enslaved Africans"], ["Netherlands", "Spices (VOC), sugar", "Textiles, arms, manufactured goods"], ["France", "Sugar (Caribbean), fur (Canada)", "Textiles, wine, enslaved Africans"]] }, stimulus_source: "Immanuel Wallerstein, The Modern World-System, 1980", options: ["Colonial trade benefited colonies equally by providing manufactured goods", "A consistent pattern of raw material extraction from colonies in exchange for manufactured goods and enslaved labor reveals the exploitative core-periphery structure of colonial trade", "The Netherlands profited less from colonial trade than Spain due to smaller territory", "Enslaved Africans were exported by colonies to European metropoles"], correct: 1, explanation: "The table consistently shows colonies exporting raw materials/agricultural commodities (silver, sugar, spices, tobacco) and receiving manufactured goods and enslaved labor. This is the core-periphery model: metropoles extract raw materials, add value through manufacturing, and sell back to periphery — capturing economic surplus. The forced labor system (slavery) enabled low-cost raw material production.", skill: "Unit 4: Global Trade and Colonialism", difficulty: "medium" },
    { question: "The Cold War arms race between the US and USSR (1949–1991) MOST directly created which global condition?", options: ["A series of direct military conflicts between American and Soviet troops in Europe", "Mutually Assured Destruction (MAD), where both superpowers possessed enough nuclear weapons to destroy civilization, paradoxically preventing direct conflict", "The elimination of conventional (non-nuclear) military forces in favor of nuclear deterrence", "A global arms treaty eliminating all nuclear weapons by 1970"], correct: 1, explanation: "MAD doctrine emerged when both superpowers achieved second-strike capability (ability to survive a first strike and retaliate). Rational calculation suggested neither side could 'win' a nuclear exchange — ensuring mutual annihilation discouraged direct conflict. This nuclear standoff pushed Cold War competition into proxy wars, ideological conflict, and the Space Race rather than direct superpower confrontation.", skill: "Unit 8: Cold War", difficulty: "medium" },
    { question: "Which of the following BEST describes the significance of the Haitian Revolution (1791–1804) in world history?", options: ["It was the first anti-colonial revolution in Latin America, inspiring Brazilian independence", "It was the only successful mass slave rebellion in history that resulted in the permanent abolition of slavery and the creation of an independent state", "It demonstrated that slavery was economically unsustainable, convincing planters across the Americas to voluntarily free enslaved people", "It created a democratic republic that immediately joined the international community as an equal partner"], correct: 1, explanation: "Haiti's revolution was historically unique: enslaved people, not elites, led the uprising; they defeated the most powerful European armies (French, Spanish, British); they permanently abolished slavery; and they created the world's first Black republic. But Haiti was diplomatically isolated and forced to pay reparations to France (until 1947!), demonstrating that formal independence didn't equal equality in the world system.", skill: "Unit 5: Revolutions", difficulty: "medium" },
    { question: "Decolonization in Africa after 1945 was MOST directly shaped by:", options: ["African military victories over European colonial armies across the continent", "A combination of mass nationalist movements, weakened European powers after WWII, Cold War pressure, and UN principles of self-determination", "A coordinated plan by European powers to transfer power gradually and peacefully", "The discovery of oil and mineral resources making colonies too valuable to relinquish voluntarily"], correct: 1, explanation: "Decolonization resulted from multiple factors converging: WWII weakened European powers economically and morally; US and USSR both opposed formal colonialism (for different reasons); UN Charter affirmed self-determination; African nationalist movements (Nkrumah, Kenyatta, Nasser) organized mass movements; and the cost of suppressing independence movements outweighed benefits in some cases.", skill: "Unit 8: Decolonization", difficulty: "medium" },
    { question: "The development of the printing press by Gutenberg (c. 1440) MOST directly facilitated:", options: ["Centralization of political power in European monarchies", "The rapid spread of Protestant Reformation ideas, undermining Catholic Church authority and standardizing vernacular languages", "The decline of literacy as manuscripts became obsolete", "The Ottoman Empire's military modernization through printed military manuals"], correct: 1, explanation: "The printing press dramatically lowered the cost of books, enabling mass distribution of Luther's 95 Theses (1517) and translated Bibles. Protestant ideas spread faster than the Church could suppress them. Print also standardized vernacular languages (German, French, English), contributing to national identity formation. This is a classic example of how technology drives cultural and political change.", skill: "Unit 4: Cultural Exchange", difficulty: "medium" },
    { question: "The graph shows global CO2 emissions by region from 1950–2020. Which conclusion is MOST supported?", chart_data: { type: "line", title: "Global CO₂ Emissions by Region (billion tonnes)", data: [{ year: "1960", usa: 3.0, europe: 2.8, china: 0.8, rest: 1.0 }, { year: "1980", usa: 5.0, europe: 4.5, china: 1.5, rest: 2.5 }, { year: "2000", usa: 6.0, europe: 4.2, china: 3.0, rest: 4.5 }, { year: "2010", usa: 5.5, europe: 3.8, china: 8.0, rest: 6.0 }, { year: "2020", usa: 5.0, europe: 3.2, china: 10.5, rest: 8.0 }], x_key: "year", y_keys: ["usa", "europe", "china", "rest"], x_label: "Year", y_label: "CO₂ (billion tonnes)" }, stimulus_source: "Global Carbon Project, 2022", options: ["The United States has always been the world's largest emitter", "China's emissions surpassed the US around 2006 and continued growing, reflecting its rapid industrialization, while Western nations' emissions declined slightly", "European emissions increased faster than Chinese emissions since 2000", "Global total emissions have declined since 2010 due to renewable energy adoption"], correct: 1, explanation: "The data shows China's explosive emission growth from 1.5 (1980) to 10.5 billion tonnes (2020), surpassing the US (now ~5 billion tonnes). This reflects China's rapid post-1978 industrialization (the world's factory). Western nations show slight decline reflecting deindustrialization and some decarbonization — but global totals continue rising due to developing world growth.", skill: "Unit 8: Contemporary Global Issues", difficulty: "medium" }
  ],
  frq: [
    {
      title: "AP World History FRQ — Imperialism: Continuity and Change",
      prompt: "Evaluate the extent to which European imperialism changed and continued from the period 1450–1750 to the period 1750–1900.",
      stimulus: "Consider the motives, methods, and geographic scope of imperial expansion in both periods.",
      parts: [
        { label: "a", question: "Describe TWO ways that European imperialism CHANGED between the two periods (1450–1750 and 1750–1900).", points: 4, rubric: "2 pts each: (1 pt change identified; 1 pt evidence). Changes: Geographic scope (1750-1900: interior Africa, South Asia as direct colonies vs. 1450-1750: coastal enclaves, trade monopolies); Methods (direct territorial control via settler colonialism, rather than mercantile trading posts); Economic basis (industrial capitalism requiring raw materials vs. mercantilist luxury trade); Administrative systems (direct governance replacing chartered company control)." },
        { label: "b", question: "Describe ONE way that European imperialism CONTINUED between the two periods and explain why this continuity persisted.", points: 3, rubric: "1 pt: Continuity identified (economic exploitation/resource extraction; racial hierarchy justifying domination; military superiority enabling expansion; Christian missionary activity). 1 pt: Evidence from both periods. 1 pt: Explanation of WHY — economic incentive structure, technological gap maintained, racial ideology persisted." },
        { label: "c", question: "Using ONE specific example, explain how ONE colonized society resisted European imperialism in either period.", points: 3, rubric: "1 pt: Specific example (Zulu resistance to British in South Africa; Sepoy Mutiny 1857; Ethiopian defeat of Italy at Adwa 1896; Aceh War in Indonesia; Maroon communities in Caribbean). 1 pt: Describes the method of resistance. 1 pt: Explains the outcome or significance." }
      ]
    }
  ]
};

// ─── AP Chemistry V2 ─────────────────────────────────────────────────────────
export const AP_CHEMISTRY_V2 = {
  mcq: [
    { question: "Which electron configuration represents a violation of Hund's Rule?", table_data: { headers: ["Species", "Electron Configuration (last subshell)"], rows: [["Option A", "2px↑↓, 2py empty, 2pz empty"], ["Option B", "2px↑, 2py↑, 2pz↑"], ["Option C", "2px↑, 2py↑, 2pz empty"], ["Option D", "2px↑↓, 2py↑↓, 2pz↑↓"]] }, options: ["Option A — paired electrons in one orbital before others are singly occupied", "Option B — each orbital has one electron", "Option C — two singly occupied orbitals", "Option D — all orbitals filled"], correct: 0, explanation: "Hund's Rule states that electrons fill degenerate orbitals singly before pairing. Option A violates this: pairing electrons in 2px before singly occupying 2py and 2pz. The correct filling for 3 electrons would be: 2px↑, 2py↑, 2pz↑ (Option B).", skill: "Unit 1: Atomic Structure and Electron Configuration", difficulty: "medium" },
    { question: "A reaction has ΔH° = −85 kJ/mol and ΔS° = −120 J/mol·K. At what temperature (approx.) does this reaction become NON-spontaneous?", options: ["Above 708 K", "Below 708 K", "Above 25°C", "The reaction is always spontaneous"], correct: 0, explanation: "ΔG° = ΔH° − TΔS°. Spontaneous when ΔG° < 0. Crossover: 0 = ΔH° − TΔS° → T = ΔH°/ΔS° = −85,000 J / (−120 J/K) = 708 K. Above 708 K: −TΔS° term becomes large positive, making ΔG° > 0 (non-spontaneous). At low T, favorable ΔH dominates.", skill: "Unit 9: Thermodynamics — Gibbs Free Energy", difficulty: "hard" },
    { question: "The concentration of H⁺ in a solution is 2.5 × 10⁻⁴ M. What is the pOH?", options: ["3.60", "10.40", "4.00", "−3.60"], correct: 1, explanation: "pH = −log(2.5×10⁻⁴) = −(log 2.5 + log 10⁻⁴) = −(0.40 − 4) = 3.60. pOH = 14 − pH = 14 − 3.60 = 10.40. At 25°C, pH + pOH = 14 (Kw = 10⁻¹⁴).", skill: "Unit 8: Acids and Bases", difficulty: "medium" },
    { question: "For the reaction: Fe₂O₃(s) + 3CO(g) → 2Fe(s) + 3CO₂(g), what is the expression for Kp?", options: ["Kp = [CO₂]³/[CO]³", "Kp = PCO₂³/PCO³", "Kp = [Fe]²[CO₂]³/([Fe₂O₃][CO]³)", "Kp = 1 (solids and gases cancel)"], correct: 1, explanation: "Kp uses partial pressures of GASES only — pure solids and liquids are omitted (activity = 1). Fe₂O₃(s) and Fe(s) are excluded. Kp = (PCO₂)³/(PCO)³. Since Δn(gas) = 3−3 = 0, Kp = Kc(RT)^0 = Kc.", skill: "Unit 7: Equilibrium", difficulty: "medium" },
    { question: "An electrochemical cell has E°cell = +0.80V. What is ΔG° for the reaction?", options: ["Positive, reaction is non-spontaneous", "Negative, reaction is spontaneous (ΔG° = −nFE°)", "Zero, reaction is at equilibrium", "Positive, reaction requires energy input"], correct: 1, explanation: "ΔG° = −nFE°cell. With E°cell = +0.80 V (positive), ΔG° is NEGATIVE (spontaneous). F = 96,485 C/mol. If n=2: ΔG° = −2(96485)(0.80) = −154,376 J ≈ −154 kJ. Positive E° = negative ΔG° = spontaneous galvanic cell.", skill: "Unit 9: Electrochemistry — Gibbs Energy", difficulty: "medium" },
    { question: "Which pair of compounds would form a buffer solution when combined in approximately equal moles?", options: ["HCl and NaCl (strong acid + conjugate base)", "CH₃COOH and CH₃COONa (weak acid + conjugate base)", "NaOH and NaCl (strong base + salt)", "HNO₃ and KNO₃ (strong acid + salt)"], correct: 1, explanation: "A buffer requires a weak acid and its conjugate base (or weak base + conjugate acid) in comparable concentrations. CH₃COOH (acetic acid, weak) + CH₃COO⁻ (acetate, conjugate base) is the classic buffer. HCl is a strong acid — it dissociates completely and cannot resist pH changes.", skill: "Unit 9: Buffers", difficulty: "easy" },
    { question: "In a first-order reaction, the half-life is 20 minutes. After 60 minutes, what fraction of reactant remains?", options: ["1/2", "1/4", "1/8", "1/3"], correct: 2, explanation: "60 min / 20 min per half-life = 3 half-lives. After 3 half-lives: (1/2)³ = 1/8. First-order half-life is constant regardless of initial concentration.", skill: "Unit 5: Kinetics — Half-Life", difficulty: "easy" },
    { question: "The lattice energy of NaCl is higher (more negative) than that of KCl. Which factor MOST explains this?", options: ["Na⁺ has higher charge than K⁺", "Na⁺ has smaller ionic radius than K⁺, allowing closer approach to Cl⁻ and stronger electrostatic attraction", "Cl⁻ forms stronger bonds with Na⁺ due to better orbital overlap", "NaCl is more soluble than KCl, releasing more energy"], correct: 1, explanation: "Lattice energy ∝ (charge product)/(ion radii sum). NaCl and KCl have identical charges (+1, −1). Na⁺ (radius 102 pm) is smaller than K⁺ (138 pm), allowing Na⁺ to get closer to Cl⁻ → stronger electrostatic attraction → higher (more negative) lattice energy. This is Coulomb's Law applied to ionic crystals.", skill: "Unit 2: Ionic Bonding and Lattice Energy", difficulty: "medium" },
    { question: "Which of the following is a colligative property?", options: ["Color of a solution", "Viscosity of a pure liquid", "Osmotic pressure of a solution", "Reactivity of a solute"], correct: 2, explanation: "Colligative properties depend on the NUMBER of dissolved particles, not their identity. Osmotic pressure (π = iMRT) is colligative. So are vapor pressure lowering, boiling point elevation, and freezing point depression. Color, viscosity, and reactivity depend on the specific identity of substances.", skill: "Unit 3: Solutions", difficulty: "easy" },
    { question: "The pKa of a weak acid is 4.5. At pH = 6.5, which form predominates in solution?", options: ["The acid form (HA) predominates", "The conjugate base (A⁻) predominates", "Equal amounts of HA and A⁻", "The acid is fully protonated"], correct: 1, explanation: "Henderson-Hasselbalch: pH = pKa + log([A⁻]/[HA]). 6.5 = 4.5 + log([A⁻]/[HA]) → log([A⁻]/[HA]) = 2 → [A⁻]/[HA] = 100. The base form (A⁻) is 100× more concentrated — it overwhelmingly predominates. When pH > pKa, the conjugate base dominates.", skill: "Unit 8/9: Acid-Base Chemistry", difficulty: "medium" }
  ],
  frq: [
    {
      title: "AP Chemistry FRQ — Kinetics and Rate Laws",
      prompt: "A student investigates the rate of the reaction: 2NO(g) + O₂(g) → 2NO₂(g)",
      stimulus: "Experimental data: Exp 1: [NO]=0.010M, [O₂]=0.010M, rate=1.0×10⁻⁴ M/s. Exp 2: [NO]=0.020M, [O₂]=0.010M, rate=4.0×10⁻⁴ M/s. Exp 3: [NO]=0.010M, [O₂]=0.020M, rate=2.0×10⁻⁴ M/s.",
      parts: [
        { label: "a", question: "Determine the rate law for this reaction and calculate the rate constant k. Include units.", points: 4, rubric: "1 pt: Comparing Exp 1&2: rate quadruples when [NO] doubles → order 2 in NO. 1 pt: Comparing Exp 1&3: rate doubles when [O₂] doubles → order 1 in O₂. 1 pt: Rate = k[NO]²[O₂]. 1 pt: k = rate/([NO]²[O₂]) = 1.0×10⁻⁴/((0.010)²(0.010)) = 100 M⁻²s⁻¹." },
        { label: "b", question: "Propose a two-step mechanism consistent with the overall equation and your rate law. Identify which step is rate-determining.", points: 3, rubric: "1 pt: Step 1 (slow/RDS): 2NO → N₂O₂. Step 2 (fast): N₂O₂ + O₂ → 2NO₂. 1 pt: The rate law from step 1 gives rate = k[NO]² — consistent if N₂O₂ is the intermediate. 1 pt: Step 1 is rate-determining (slow step)." },
        { label: "c", question: "Predict how the rate would change if the temperature is increased from 25°C to 35°C. Reference the Arrhenius equation qualitatively.", points: 3, rubric: "1 pt: Rate increases with temperature. 1 pt: Arrhenius equation: k = Ae^(−Ea/RT) — higher T increases e^(−Ea/RT) → larger k. 1 pt: More molecules have kinetic energy ≥ Ea at higher T → more effective collisions per unit time. Rule of thumb: rate approximately doubles per 10°C rise (for Ea ~ 50 kJ/mol)." }
      ]
    }
  ]
};

// ─── AP Statistics V2 ────────────────────────────────────────────────────────
export const AP_STATISTICS_V2 = {
  mcq: [
    { question: "A survey of 500 adults asks: 'Don't you agree that taxes are too high?' This is an example of:", options: ["A double-barreled question", "A leading question that may produce biased responses", "A stratified sampling design", "An appropriate voluntary response survey"], correct: 1, explanation: "This is a leading question — the phrasing 'Don't you agree...' suggests the expected answer, biasing responses toward agreement. Question wording is a major source of response bias in surveys. A neutral version would be: 'Do you believe taxes are too high, about right, or too low?'", skill: "Unit 3: Collecting Data", difficulty: "easy" },
    { question: "The probability that a randomly selected student passes Math is 0.70. The probability they pass English is 0.75. If these are independent, what is P(passes both)?", options: ["0.525", "0.145", "1.45", "0.050"], correct: 0, explanation: "P(A and B) = P(A) × P(B) for independent events = 0.70 × 0.75 = 0.525.", skill: "Unit 4: Probability", difficulty: "easy" },
    { question: "Which describes a strong, negative, linear relationship in a scatterplot?", options: ["r = 0.95, data fans out as x increases", "r = −0.92, data closely follows a line sloping downward left to right", "r = −0.20, curved pattern", "r = 0 with a perfect U-shape"], correct: 1, explanation: "r = −0.92 indicates strong (close to −1) and negative (downward slope) linear association. r only measures LINEAR association — a perfect U-shape would have r ≈ 0 despite a perfect relationship.", skill: "Unit 2: Exploring Two-Variable Data", difficulty: "easy" },
    { question: "In a normal distribution, approximately what percentage of data falls within 2 standard deviations of the mean?", options: ["68%", "90%", "95%", "99.7%"], correct: 2, explanation: "The empirical rule: ±1σ = 68%, ±2σ = 95%, ±3σ = 99.7%. This is the 68-95-99.7 rule fundamental to normal distribution problems.", skill: "Unit 1: Normal Distribution", difficulty: "easy" },
    { question: "A histogram of exam scores is strongly left-skewed. Which measure of center BEST represents the typical score?", options: ["Mean, because it uses all data values", "Median, because it is resistant to extreme low scores pulling the mean down", "Mode, because it identifies the most common score", "The midrange (average of max and min)"], correct: 1, explanation: "Left-skewed distributions have a tail of low values pulling the mean below the median. The median is resistant (robust) to outliers/skew, making it a better center measure when data is skewed. The mean is pulled toward the tail.", skill: "Unit 1: Exploring Data — Measures of Center", difficulty: "medium" },
    { question: "The margin of error for a 95% confidence interval is ±4 points. To cut this to ±2 points, by what factor must the sample size increase?", options: ["Double (×2)", "Triple (×3)", "Quadruple (×4)", "No change needed"], correct: 2, explanation: "ME = z*(σ/√n). To halve ME: ME/2 = z*(σ/√(4n)) — you need 4× the sample size (√(4n) = 2√n). The margin of error is inversely proportional to √n, so halving ME requires 4× more observations.", skill: "Unit 6: Confidence Intervals", difficulty: "hard" },
    { question: "Which of the following is an example of Simpson's Paradox?", options: ["A correlation that is positive in one sample but negative in another", "A trend that appears in combined data but reverses when data is separated by a lurking variable", "A statistically significant result that has no practical significance", "A confidence interval that does not contain the sample statistic"], correct: 1, explanation: "Simpson's Paradox: an association present in combined data reverses (or disappears) when data is disaggregated. Classic example: Hospital A has higher overall survival rates than B, but Hospital B has better survival for both mild AND severe patients (because B treats more severe cases). The lurking variable (severity) reverses the conclusion.", skill: "Unit 1: Exploring Data", difficulty: "hard" },
    { question: "A researcher wants to test if a coin is biased toward heads. She flips it 100 times and gets 58 heads. What are the hypotheses?", options: ["H₀: p = 0.5, Hₐ: p ≠ 0.5 (two-tailed)", "H₀: p = 0.5, Hₐ: p > 0.5 (one-tailed)", "H₀: p = 0.58, Hₐ: p > 0.58", "H₀: p > 0.5, Hₐ: p = 0.5"], correct: 1, explanation: "The researcher suspects bias toward heads (p > 0.5), not just any bias, making this a one-tailed test. H₀ = claim of fairness (p = 0.5). Hₐ = researcher's suspicion (p > 0.5). If suspecting any bias (either direction), use two-tailed.", skill: "Unit 6: Setting Up Hypothesis Tests", difficulty: "medium" },
    { question: "The expected value of a random variable X with P(X=1)=0.3, P(X=2)=0.5, P(X=3)=0.2 is:", options: ["2.0", "1.9", "1.5", "2.5"], correct: 1, explanation: "E(X) = Σ x·P(x) = 1(0.3) + 2(0.5) + 3(0.2) = 0.3 + 1.0 + 0.6 = 1.9.", skill: "Unit 4: Expected Value", difficulty: "easy" },
    { question: "A matched pairs t-test is MOST appropriate when:", options: ["Comparing means of two completely independent groups", "Each subject in one group is paired with a unique subject in another group, or each subject provides two measurements", "Comparing proportions from two different populations", "Testing whether a single population mean equals a specified value"], correct: 1, explanation: "Matched pairs: each observation in one group is linked to a specific observation in the other (before/after, twins, matched demographics). The test analyzes differences within pairs, reducing variability from individual differences. Unlike two-sample t-test where samples are independent.", skill: "Unit 7: Matched Pairs", difficulty: "medium" }
  ],
  frq: [
    {
      title: "AP Statistics FRQ — Experimental Design and Inference",
      prompt: "A school district wants to test whether a new tutoring program improves math scores. They have 120 students available.",
      stimulus: "Students are assigned to either the tutoring program (treatment) or no tutoring (control) for one semester. Pre-test and post-test scores are available.",
      parts: [
        { label: "a", question: "Describe a completely randomized experiment design for this study. Explain how you would randomly assign students and why randomization is important.", points: 4, rubric: "1 pt: Randomly assign 60 to treatment, 60 to control. Method: number students 1-120, use random number table or calculator to select 60 for treatment; rest are control. 1 pt: All students take pre-test, receive treatment/control for one semester, then take post-test. 1 pt: Why randomize — balances known and unknown confounding variables (prior math ability, SES) between groups. 1 pt: Allows causal inference — any difference in outcomes can be attributed to the tutoring program." },
        { label: "b", question: "The mean post-test score gain was +8.2 points for tutored students and +3.1 points for control students. A two-sample t-test gives t = 2.4, p = 0.019. Interpret these results at α = 0.05.", points: 3, rubric: "1 pt: p = 0.019 < α = 0.05 → reject H₀. 1 pt: Statistically significant evidence that the tutoring program increases mean score gain compared to no tutoring. 1 pt: Cannot conclude causation from this t-test alone (need to reference the experimental design to support causation)." },
        { label: "c", question: "A parent argues: 'students who wanted tutoring signed up voluntarily, so the results are biased.' Explain why the experimental design does or does not address this concern.", points: 3, rubric: "1 pt: The experimental design randomly assigns students — they did NOT self-select. 1 pt: This eliminates the self-selection bias (motivated students choosing tutoring). 1 pt: The parent's concern would be valid for an observational study, but random assignment ensures the groups are comparable in motivation and other characteristics." }
      ]
    }
  ]
};

// ─── AP US Government V2 ─────────────────────────────────────────────────────
export const AP_US_GOV_V2 = {
  mcq: [
    { question: "The War Powers Resolution (1973) MOST directly attempted to:", options: ["Grant the President unlimited authority to deploy troops for 90 days without congressional approval", "Require the President to notify Congress within 48 hours of deploying troops and limit unauthorized combat to 60 days", "Transfer all military command authority to Congress", "Establish the Joint Chiefs of Staff as the primary decision-making body for military operations"], correct: 1, explanation: "The War Powers Resolution was passed over Nixon's veto to reassert congressional war-making authority after Vietnam. It requires: notification within 48 hours of troop deployment; withdrawal of troops within 60 days (plus 30-day withdrawal) unless Congress authorizes; and consultation. Presidents have generally disputed its constitutionality, complying minimally.", skill: "Separation of Powers — War Powers", difficulty: "medium" },
    { question: "Which of the following BEST describes the difference between 'expressed powers' and 'implied powers' of Congress?", options: ["Expressed powers are found in the Bill of Rights; implied powers come from judicial decisions", "Expressed powers are explicitly listed in Article I; implied powers are reasonably inferred from expressed powers via the Necessary and Proper Clause", "Expressed powers belong to Congress; implied powers are reserved for the states", "There is no constitutional distinction — all congressional powers must be explicitly stated"], correct: 1, explanation: "Article I, Section 8 lists Congress's expressed (enumerated) powers (coin money, declare war, regulate commerce). The Elastic Clause (Necessary and Proper Clause) allows Congress to enact laws 'necessary and proper' for executing expressed powers — these are implied powers. McCulloch v. Maryland (1819) firmly established implied powers.", skill: "Legislative Branch — Congressional Powers", difficulty: "medium" },
    { question: "Which constitutional clause has been used MOST broadly to expand federal regulatory power over the economy in the 20th century?", options: ["The Supremacy Clause (Article VI)", "The Commerce Clause (Article I, Section 8)", "The General Welfare Clause", "The Fourteenth Amendment's Equal Protection Clause"], correct: 1, explanation: "The Commerce Clause ('regulate commerce... among the several states') was broadly interpreted in Wickard v. Filburn (1942) — allowing regulation of even home-grown wheat that never entered interstate commerce. This New Deal-era expansion enabled federal regulation of labor (NLRA), civil rights (Civil Rights Act 1964), and environmental law (Clean Air Act) far beyond interstate trade.", skill: "Federalism — Commerce Clause", difficulty: "medium" },
    { question: "The table shows committee assignments in the 117th Congress. Which conclusion is MOST supported?", table_data: { headers: ["Committee", "Total Members", "Democratic Members", "Republican Members", "% Democrat"], rows: [["Ways and Means", "39", "25", "14", "64%"], ["Armed Services", "57", "30", "27", "53%"], ["Judiciary", "41", "24", "17", "59%"], ["Rules", "13", "9", "4", "69%"]] }, stimulus_source: "House of Representatives, 117th Congress (2021-2022)", options: ["Minority party has no representation on any committee", "The majority party controls committee composition and leadership, giving it significant agenda-setting power", "Committee assignments are determined by the President", "All committees have equal party ratios regardless of majority party status"], correct: 1, explanation: "The majority party (Democrats in 117th Congress) controls committee ratios and chairs all committees. The Rules Committee (69% Democrat) is especially significant — it controls what legislation reaches the floor and under what rules. This is a key source of majority party power in the House.", skill: "Congress — Committee System", difficulty: "medium" },
    { question: "Marbury v. Madison (1803) established judicial review by:", options: ["Constitutional amendment granting the Supreme Court authority over state laws", "Chief Justice Marshall's ruling that the Court had power to declare a federal law (Judiciary Act of 1789, Section 13) unconstitutional", "Congress explicitly granting the Court power to review executive actions", "The Court's inherent authority recognized in Article III"], correct: 1, explanation: "Marshall's strategic ruling denied Marbury his commission (avoiding a confrontation with Jefferson he would lose) while establishing the doctrine: the Constitution is supreme law; laws violating it are void; the courts decide what the law means. This self-granted power wasn't in Article III explicitly — it was inferred from constitutional supremacy.", skill: "Judicial Branch — Judicial Review", difficulty: "medium" },
    { question: "Political parties perform which ESSENTIAL function in a democracy according to political scientists?", options: ["They are mentioned in Article II of the Constitution as required governing institutions", "They serve as linkage institutions connecting citizens to government by recruiting candidates, organizing elections, and shaping policy", "They eliminate the need for interest groups by representing all citizens equally", "They are required by the Seventeenth Amendment to organize Senate elections"], correct: 1, explanation: "Political parties as linkage institutions: recruit and nominate candidates, organize elections, help voters identify policy positions, coordinate government action, and hold officials accountable. Parties are NOT in the Constitution (Madison warned against 'factions' in Federalist 10) — they developed organically. They are one of several linkage institutions alongside interest groups, media, and elections.", skill: "Political Parties as Linkage Institutions", difficulty: "medium" },
    { question: "Which of the following BEST describes the 'revolving door' phenomenon in American politics?", options: ["The re-election pattern where most incumbents win multiple terms", "The movement of individuals between government positions and the private sector (especially lobbying)", "The process by which bills move between House and Senate committees", "The regular exchange of party control of Congress every two years"], correct: 1, explanation: "The revolving door: government officials/staffers move to private sector lobbying jobs using their government connections, then sometimes return to government. Critics argue this creates conflicts of interest — officials may make decisions benefiting future employers. Examples: former members of Congress becoming lobbyists, FDA officials joining pharmaceutical companies.", skill: "Interest Groups and Lobbying", difficulty: "easy" },
    { question: "Which Supreme Court case MOST directly addressed the constitutionality of the individual mandate in the Affordable Care Act?", options: ["McCulloch v. Maryland — established federal taxing power", "NFIB v. Sebelius (2012) — upheld the mandate as a tax under Congress's taxing power", "Marbury v. Madison — established judicial review of legislation", "Gibbons v. Ogden — established congressional commerce power"], correct: 1, explanation: "NFIB v. Sebelius (2012): Chief Justice Roberts' majority upheld the ACA mandate as valid exercise of Congress's taxing power (penalty for not having insurance = tax). However, Roberts joined conservatives in holding the Commerce Clause did NOT authorize mandating activity (activity vs. inactivity distinction).", skill: "Constitutional Law — Commerce and Taxing Powers", difficulty: "hard" },
    { question: "Which of the following MOST accurately describes the role of the Vice President under the Constitution?", options: ["The VP serves as the chief executive when the President travels abroad", "The VP presides over the Senate and votes in case of a tie, and succeeds the President if the office becomes vacant", "The VP has authority to reject Cabinet nominations if they conflict with Senate interests", "The VP chairs the National Security Council and coordinates intelligence agencies"], correct: 1, explanation: "Article I places the VP as President of the Senate (presiding officer) with a tiebreaking vote. Article II designates the VP as first in the succession line. In practice, the VP rarely presides over the Senate and the role has evolved into primarily an executive advisory role — but constitutionally, the VP is a legislative officer.", skill: "The Executive Branch — Vice President", difficulty: "medium" },
    { question: "Interest groups influence public policy PRIMARILY through which mechanism?", options: ["Directly voting on legislation in committees as non-elected members", "Lobbying — providing information, campaign contributions, and grassroots mobilization to influence elected officials", "Appointing federal judges who share their policy preferences", "Issuing executive orders when Congress fails to act on their priorities"], correct: 1, explanation: "Interest groups primarily influence policy through: direct lobbying (meeting with legislators, providing research/testimony); campaign contributions via PACs/Super PACs; grassroots mobilization (generating constituent pressure); litigation; and media campaigns. They cannot vote in Congress, appoint judges (that's the President), or issue executive orders.", skill: "Interest Groups and Policy", difficulty: "easy" }
  ],
  frq: [
    {
      title: "AP US Government FRQ — Comparative Political Institutions",
      prompt: "Answer all parts using your knowledge of AP US Government and Politics.",
      stimulus: "The United States uses a presidential system where the executive and legislative branches are separately elected and have overlapping powers. In contrast, most European democracies use parliamentary systems where the executive (Prime Minister) is chosen by and must maintain confidence of the legislature.",
      parts: [
        { label: "a", question: "Identify ONE advantage and ONE disadvantage of the US presidential system compared to a parliamentary system.", points: 4, rubric: "2 pts advantage: Separation of powers prevents concentration of authority; fixed terms provide stability; direct democratic mandate for executive. 2 pts disadvantage: Gridlock when different parties control branches; limited accountability (President cannot be removed except by impeachment); coalition-building difficult." },
        { label: "b", question: "Explain how the principle of 'checks and balances' is illustrated by ONE specific constitutional interaction between the President and Congress.", points: 3, rubric: "1 pt: Names specific check (veto power; override by 2/3 majority; Senate confirmation of appointments; congressional war powers; impeachment). 1 pt: Explains how it limits the power of one branch. 1 pt: Gives specific constitutional provision (Article I/II reference or specific amendment)." },
        { label: "c", question: "Explain why the Framers were concerned about both tyranny and gridlock in designing the Constitution, and identify ONE specific constitutional mechanism that addresses each concern.", points: 3, rubric: "1 pt: Tyranny concern — feared concentrated power (monarchy-like); gridlock concern — feared ineffective government under Articles of Confederation. 1 pt: Mechanism against tyranny: separation of powers, bicameralism, Bill of Rights. 1 pt: Mechanism against gridlock: stronger executive, elastic clause, supremacy clause (compared to Articles)." }
      ]
    }
  ]
};

// ─── AP Calculus BC V2 ───────────────────────────────────────────────────────
export const AP_CALCULUS_BC_V2 = {
  mcq: [
    { question: "What is the Maclaurin series for sin(x)?", options: ["1 − x²/2! + x⁴/4! − ...", "x − x³/3! + x⁵/5! − ...", "x + x³/3! + x⁵/5! + ...", "1 + x + x²/2! + ..."], correct: 1, explanation: "sin(x) = Σ (−1)ⁿ x^(2n+1)/(2n+1)! = x − x³/6 + x⁵/120 − ... The even-powered Maclaurin is cos(x). eˣ uses all powers with positive terms.", skill: "Unit 10: Taylor/Maclaurin Series", difficulty: "easy" },
    { question: "The slope of the tangent line to the polar curve r = 1 + cos(θ) at θ = π/2 is:", options: ["0", "−1", "1", "Undefined"], correct: 1, explanation: "dy/dx = (dr/dθ·sinθ + r·cosθ)/(dr/dθ·cosθ − r·sinθ). dr/dθ = −sinθ. At θ=π/2: r = 1+cos(π/2) = 1; dr/dθ = −sin(π/2) = −1. Numerator: (−1)(1) + 1(0) = −1. Denominator: (−1)(0) − 1(1) = −1. Slope = −1/(−1) = 1. Wait: numerator = −1·sin(π/2) + r·cos(π/2) = −1(1) + 1(0) = −1. Denominator = −1·cos(π/2) − r·sin(π/2) = 0 − 1 = −1. dy/dx = −1/−1 = 1.", skill: "Unit 9: Polar Coordinates", difficulty: "hard" },
    { question: "Does the series Σ 1/n^(1/2) (n=1 to ∞) converge or diverge?", options: ["Converges — terms approach zero", "Diverges — p-series with p = 1/2 ≤ 1", "Converges — ratio test gives L < 1", "Cannot be determined without more information"], correct: 1, explanation: "This is a p-series with p = 1/2. P-series Σ 1/nᵖ converges if p > 1, diverges if p ≤ 1. Since 1/2 ≤ 1, the series diverges. Note: terms approaching 0 is NECESSARY but NOT SUFFICIENT for convergence (the harmonic series 1/n also has terms → 0 but diverges).", skill: "Unit 10: Series Convergence — P-Series", difficulty: "medium" },
    { question: "Solve the differential equation dy/dx = 2xy with initial condition y(0) = 3.", options: ["y = 3e^(x²)", "y = e^(2x²) + 2", "y = 3e^(2x)", "y = 3x² + 3"], correct: 0, explanation: "Separate: dy/y = 2x dx. Integrate: ln|y| = x² + C. y = Ae^(x²). Apply IC: y(0) = A = 3. y = 3e^(x²).", skill: "Unit 7: Differential Equations — Separable", difficulty: "medium" },
    { question: "Which convergence test is MOST appropriate for Σ n²/(n³ + 1)?", options: ["Geometric series formula", "Limit Comparison Test with 1/n", "Alternating Series Test", "Root Test"], correct: 1, explanation: "For large n: n²/(n³+1) ≈ n²/n³ = 1/n (harmonic series). Limit Comparison Test: lim [n²/(n³+1)] / (1/n) = lim n³/(n³+1) = 1 > 0. Since Σ 1/n diverges and limit = 1 (finite positive), Σ n²/(n³+1) also diverges.", skill: "Unit 10: Series — Limit Comparison Test", difficulty: "medium" },
    { question: "What is ∫₀^∞ e^(−x) dx (improper integral)?", options: ["Diverges", "0", "1", "∞"], correct: 2, explanation: "∫₀^b e^(−x) dx = [−e^(−x)]₀^b = −e^(−b) + 1. As b→∞: −e^(−b) → 0. Limit = 1. Converges to 1.", skill: "Unit 6: Improper Integrals", difficulty: "easy" },
    { question: "A logistic growth model has dP/dt = 0.4P(1 − P/500). What is the carrying capacity?", options: ["0.4", "200", "500", "1000"], correct: 2, explanation: "Logistic equation: dP/dt = rP(1 − P/K). Here K = 500 (carrying capacity). At P = K, growth = 0. The intrinsic rate r = 0.4.", skill: "Unit 7: Differential Equations — Logistic Growth", difficulty: "easy" },
    { question: "The series Σ (−1)ⁿ/(n² + 1) converges absolutely because:", options: ["The terms alternate and decrease to 0", "Σ 1/(n²+1) converges (comparison to convergent p-series 1/n², p=2>1)", "The ratio test gives limit exactly 1", "The terms approach 0 as n → ∞"], correct: 1, explanation: "Absolute convergence: Σ |aₙ| = Σ 1/(n²+1). Compare to 1/n² (p=2>1, converges). By Limit Comparison: lim [1/(n²+1)]/(1/n²) = n²/(n²+1) → 1. Since Σ 1/n² converges and limit > 0, Σ 1/(n²+1) converges. Therefore the original alternating series converges ABSOLUTELY.", skill: "Unit 10: Absolute Convergence", difficulty: "medium" },
    { question: "Use Euler's method with step h=0.5 to approximate y(1) for dy/dx = x + y, y(0) = 1.", options: ["1.5", "2.0", "2.5", "3.0"], correct: 2, explanation: "Step 1: x₀=0, y₀=1. y₁ = y₀ + h·f(x₀,y₀) = 1 + 0.5(0+1) = 1.5. Step 2: x₁=0.5, y₁=1.5. y₂ = 1.5 + 0.5(0.5+1.5) = 1.5 + 0.5(2) = 1.5 + 1.0 = 2.5.", skill: "Unit 7: Euler's Method", difficulty: "medium" },
    { question: "The parametric curve x = 3cos(t), y = 4sin(t) traces what shape?", options: ["A circle of radius 3", "An ellipse with semi-axes a=3 (x) and b=4 (y)", "A parabola", "A hyperbola"], correct: 1, explanation: "x = 3cos(t) → x/3 = cos(t); y = 4sin(t) → y/4 = sin(t). cos²(t) + sin²(t) = 1 → (x/3)² + (y/4)² = 1. This is an ellipse with semi-major axis b=4 (y-direction) and semi-minor axis a=3 (x-direction).", skill: "Unit 9: Parametric Equations — Curves", difficulty: "easy" }
  ],
  frq: [
    {
      title: "AP Calculus BC FRQ — Differential Equations and Euler's Method",
      prompt: "Consider the differential equation dy/dx = xy − 1.",
      stimulus: "Initial condition: y(0) = 2.",
      parts: [
        { label: "a", question: "Find the slope at (0, 2) and sketch the direction of the solution curve. Then find all points where the slope equals 0.", points: 3, rubric: "1 pt: slope at (0,2): 0(2)−1 = −1. 1 pt: Direction — slope negative, curve decreasing at (0,2). 1 pt: Slope = 0 when xy − 1 = 0 → y = 1/x. This is a hyperbola in the first and third quadrants." },
        { label: "b", question: "Use Euler's method with two steps of h = 0.5 to approximate y(1).", points: 3, rubric: "1 pt: Step 1: x=0, y=2, slope = 0(2)−1 = −1. y₁ = 2 + 0.5(−1) = 1.5. 1 pt: Step 2: x=0.5, y=1.5, slope = 0.5(1.5)−1 = −0.25. y₂ = 1.5 + 0.5(−0.25) = 1.375. 1 pt: y(1) ≈ 1.375." },
        { label: "c", question: "Is your Euler's method approximation an overestimate or underestimate of the actual value? Justify using the concavity of the solution.", points: 4, rubric: "2 pts: Find d²y/dx² (implicit differentiation): dy/dx = xy−1. d²y/dx² = y + x(dy/dx) = y + x(xy−1). At (0,2): d²y/dx² = 2 + 0 = 2 > 0 (concave up near x=0). 2 pts: Euler's method uses tangent line approximations; if the curve is concave up, the tangent line lies BELOW the curve → Euler's method underestimates the actual y value." }
      ]
    }
  ]
};

// ─── AP Microeconomics V2 ────────────────────────────────────────────────────
export const AP_MICROECONOMICS_V2 = {
  mcq: [
    { question: "A firm in a perfectly competitive market is producing at output where P = $20, ATC = $25, and MC = $20. In the short run, the firm should:", options: ["Shut down immediately since it is losing money", "Continue producing if P ≥ AVC (it covers variable costs and part of fixed costs)", "Increase price to $25 to cover ATC", "Expand output until MC exceeds ATC"], correct: 1, explanation: "Short-run shutdown rule: produce if P ≥ AVC (price covers variable costs — fixed costs are sunk). Even though P ($20) < ATC ($25), if P ≥ AVC, losses are smaller than shutting down (which would still incur fixed costs). Firm should produce if AVC ≤ $20.", skill: "Unit 3: Perfect Competition — Short Run", difficulty: "hard" },
    { question: "A natural monopoly exists when:", options: ["A single firm controls all natural resources needed for production", "Long-run average costs continuously decrease over the entire range of market demand, making one firm more efficient than multiple competitors", "The government legally prohibits competition in a market", "A firm holds patents on all competing technologies"], correct: 1, explanation: "Natural monopoly: economies of scale are so large that one firm can serve the entire market at lower average cost than two or more firms (e.g., water utilities, electrical grids). Duplicating infrastructure is economically wasteful. This justifies public utility regulation or public ownership.", skill: "Unit 4: Monopoly — Natural Monopoly", difficulty: "medium" },
    { question: "If demand for a good is perfectly inelastic, an excise tax on producers:", options: ["Is borne entirely by producers, since they cannot raise prices", "Is borne entirely by consumers, who pay the full tax through higher prices", "Is shared equally between producers and consumers", "Creates a large deadweight loss"], correct: 1, explanation: "With perfectly inelastic demand, consumers have no ability to reduce quantity regardless of price increase — demand curve is vertical. Producers can pass the ENTIRE tax to consumers as price increases. Tax incidence falls fully on buyers. No deadweight loss occurs because quantity doesn't change.", skill: "Unit 2: Tax Incidence and Elasticity", difficulty: "hard" },
    { question: "The table shows production possibilities for two workers. Who has a comparative advantage in producing shirts?", table_data: { headers: ["Worker", "Max Shirts (hrs)", "Max Pants (hrs)"], rows: [["Ana", "10", "5"], ["Bob", "8", "8"]] }, options: ["Ana, because she produces more shirts per hour", "Bob, because his opportunity cost of shirts is lower (1 pant per shirt vs 0.5 for Ana)", "Ana, because her opportunity cost of shirts is 0.5 pants, which is less than Bob's 1 pant", "Neither has comparative advantage"], correct: 2, explanation: "Comparative advantage: lowest opportunity cost. Ana's OC of 1 shirt = 5/10 = 0.5 pants. Bob's OC of 1 shirt = 8/8 = 1 pant. Ana's OC (0.5 pants) < Bob's OC (1 pant) → Ana has comparative advantage in shirts. Bob has comparative advantage in pants (OC = 1 shirt vs Ana's OC of 2 shirts for pants).", skill: "Unit 1: Comparative Advantage", difficulty: "medium" },
    { question: "Which of the following is an example of price discrimination?", options: ["A firm charging the same price to all customers regardless of quantity purchased", "Airlines charging different fares to business travelers and leisure travelers for identical seats", "A government setting a price floor above equilibrium", "A monopolist setting price above marginal cost"], correct: 1, explanation: "Price discrimination: charging different prices to different consumers for the same good based on willingness to pay. Airlines charge business travelers more (inelastic demand — travel required by job) and leisure travelers less (elastic demand — discretionary). This increases producer surplus by capturing more consumer surplus.", skill: "Unit 4: Monopoly — Price Discrimination", difficulty: "easy" },
    { question: "In the long run, if a competitive firm earns positive economic profit, the market will:", options: ["Remain in equilibrium since profits signal market efficiency", "Attract new entrants, increasing supply, lowering price until economic profit = 0", "See existing firms collude to maintain high prices", "See the government impose price controls to limit excess profits"], correct: 1, explanation: "Positive economic profit signals to outside firms that this market earns above-normal returns. Free entry → new firms enter → market supply increases → price falls → economic profit erodes to zero (long-run equilibrium where P = min ATC). This is the self-correcting mechanism of perfect competition.", skill: "Unit 3: Long-Run Competitive Equilibrium", difficulty: "easy" },
    { question: "The deadweight loss from a monopoly occurs because:", options: ["The monopolist earns profit that should go to consumers", "The monopolist restricts output below the competitive level, preventing mutually beneficial transactions from occurring", "The monopolist charges a price above average total cost", "Monopoly eliminates all consumer surplus"], correct: 1, explanation: "DWL = value of transactions that would occur under competition but don't under monopoly. At Qm (monopoly output), there are units where consumers' willingness to pay exceeds MC — they'd gain surplus, the firm would gain profit — but the monopolist doesn't produce them. This foregone social value is DWL, representing inefficiency.", skill: "Unit 4: Monopoly — Deadweight Loss", difficulty: "medium" },
    { question: "A subsidy to producers of electric vehicles will MOST likely:", options: ["Decrease the supply of EVs and raise their market price", "Increase the supply of EVs, lower equilibrium price, and increase quantity sold", "Only affect producers without changing consumer prices", "Create a price floor above equilibrium"], correct: 1, explanation: "A production subsidy reduces producers' effective costs → supply curve shifts right → equilibrium price falls and quantity rises. The benefit is shared: consumers pay lower prices, producers receive higher net revenue (price + subsidy). Subsidies are often used to correct positive externalities (EVs have positive environmental externalities).", skill: "Unit 2: Supply and Demand — Subsidies", difficulty: "easy" },
    { question: "Which market structure is characterized by few firms, interdependence (each firm considers rivals' reactions), and barriers to entry?", options: ["Perfect competition", "Monopolistic competition", "Oligopoly", "Monopsony"], correct: 2, explanation: "Oligopoly features: few large firms (e.g., 3-5 dominant players), high entry barriers (capital, patents, brand loyalty), mutual interdependence (firm's profit depends on rivals' choices — game theory applies). Examples: auto industry, airline industry, smartphone manufacturers.", skill: "Unit 4: Market Structures — Oligopoly", difficulty: "easy" },
    { question: "When the government imposes a price ceiling BELOW the market equilibrium price:", options: ["Quantity supplied increases and a surplus develops", "Quantity demanded exceeds quantity supplied, creating a shortage", "The market reaches a new equilibrium at the ceiling price", "Both supply and demand increase to eliminate the surplus"], correct: 1, explanation: "Price ceiling below equilibrium: lower price → quantity demanded > quantity supplied → shortage (excess demand). Rent control is a classic example — below-market rents increase quantity of apartments demanded while reducing quantity supplied, creating housing shortages.", skill: "Unit 2: Price Controls", difficulty: "easy" }
  ],
  frq: [
    {
      title: "AP Microeconomics FRQ — Monopolistic Competition",
      prompt: "The restaurant industry is often cited as an example of monopolistic competition.",
      stimulus: "In the short run, a restaurant earns positive economic profit. In the long run, the market is in equilibrium.",
      parts: [
        { label: "a", question: "Draw and label a short-run monopolistic competition graph showing this firm earning positive economic profit. Include: D, MR, ATC, MC, profit-maximizing P and Q, and shade the profit area.", points: 5, rubric: "1 pt: Downward-sloping demand with MR below (twice as steep). 1 pt: U-shaped ATC, upward-sloping MC. 1 pt: Profit max at MR=MC → Qm. 1 pt: Price at Pm on demand curve above ATC. 1 pt: Profit rectangle shaded = (Pm − ATC) × Qm." },
        { label: "b", question: "Explain the long-run adjustment process. How does the graph change in long-run equilibrium?", points: 3, rubric: "1 pt: Positive profit attracts new entrants (no barriers). 1 pt: New entrants offering similar (but differentiated) products reduce demand for this firm — demand curve shifts left and becomes more elastic. 1 pt: LR equilibrium: demand curve tangent to ATC, P = ATC, economic profit = 0." },
        { label: "c", question: "Is a monopolistically competitive firm productively efficient in long-run equilibrium? Explain.", points: 2, rubric: "1 pt: NOT productively efficient — P > minimum ATC. 1 pt: In LR equilibrium, demand is tangent to ATC on the downward-sloping portion, not at the minimum. This excess capacity/waste is the cost of product variety (the 'waste' of monopolistic competition)." }
      ]
    }
  ]
};

// ─── AP Japanese Language ────────────────────────────────────────────────────
export const AP_JAPANESE_V1 = {
  mcq: [
    {
      question: "Read the following conversation. Which response BEST completes it in natural Japanese?\n\nA: すみません、この電車は東京に行きますか。\nB: ________",
      options: [
        "はい、東京に行きます。次の駅ですよ。",
        "東京は遠いです。バスで行ってください。",
        "いいえ、東京はここではありません。",
        "電車は好きじゃないです。"
      ],
      correct: 0,
      explanation: "Person A asks 'Excuse me, does this train go to Tokyo?' A natural and helpful response confirms 'Yes, it goes to Tokyo. It's the next station.' Options B-D are grammatically awkward or contextually inappropriate responses to this question.",
      skill: "Interpersonal Communication — Transportation/Travel",
      difficulty: "easy"
    },
    {
      question: "The passage describes a Japanese cultural practice. Read it and answer the question.\n\n「日本では、家に入る前に靴を脱ぎます。これは、家の中を清潔に保つためです。また、他の人の家を訪問するとき、手ぶらで行くのはよくないと思われています。」\n\nAccording to the passage, what is considered impolite when visiting someone's home?",
      stimulus: "「日本では、家に入る前に靴を脱ぎます。これは、家の中を清潔に保つためです。また、他の人の家を訪問するとき、手ぶらで行くのはよくないと思われています。」",
      stimulus_source: "AP Japanese Language reading passage",
      stimulus_header: "Question 2 refers to the following passage.",
      options: [
        "Wearing shoes inside the house",
        "Going to someone's home empty-handed (without a gift)",
        "Talking too loudly",
        "Arriving too early"
      ],
      correct: 1,
      explanation: "手ぶらで行く (tebura de iku) means 'to go empty-handed' — going without a gift. The passage states this is 'not considered good' (よくないと思われています). This reflects Japanese cultural emphasis on gift-giving (omiyage/temiyage) when visiting homes.",
      skill: "Interpretive Reading — Japanese Culture",
      difficulty: "medium"
    },
    {
      question: "Which particle correctly completes the sentence?\n\n「私は毎朝コーヒー___飲みます。」",
      options: ["が", "を", "に", "で"],
      correct: 1,
      explanation: "「を」is the direct object particle marking what is directly acted upon by the verb 飲みます (nomu = to drink). 'I drink coffee every morning.' が marks the subject in some contexts; に marks direction/time/indirect object; で marks location of action or means.",
      skill: "Language — Japanese Particles",
      difficulty: "easy"
    },
    {
      question: "Read the email and choose the BEST interpretation.\n\n「田中様、先日はお世話になりました。ご提案いただいた件について、社内で検討した結果、ぜひ進めたいと思っております。つきましては、来週ご都合のよい日時をお知らせいただけますでしょうか。」",
      stimulus: "田中様、先日はお世話になりました。ご提案いただいた件について、社内で検討した結果、ぜひ進めたいと思っております。つきましては、来週ご都合のよい日時をお知らせいただけますでしょうか。",
      stimulus_source: "Business correspondence email",
      stimulus_header: "Question 4 refers to the following business email.",
      options: [
        "The writer is declining a proposal and asking for alternatives",
        "The writer is accepting a proposal and requesting a meeting time next week",
        "The writer is asking for more information about a proposal",
        "The writer is apologizing for a delay in responding"
      ],
      correct: 1,
      explanation: "「ぜひ進めたいと思っております」= 'We would very much like to move forward.' 「来週ご都合のよい日時をお知らせいただけますでしょうか」= 'Could you let us know a convenient time next week?' This is a formal business email accepting a proposal and requesting a meeting appointment.",
      skill: "Interpretive Reading — Business Communication",
      difficulty: "medium"
    },
    {
      question: "Which of the following sentences uses て-form (te-form) correctly to express sequence?",
      options: [
        "学校に行くして、勉強します。",
        "学校に行って、勉強します。",
        "学校に行けば、勉強します。",
        "学校に行くなら、勉強します。"
      ],
      correct: 1,
      explanation: "The て-form (te-form) connects sequential actions. 行く (iku, to go) → 行って (itte). The sentence means 'I go to school, and then study.' Option A incorrectly adds して after the dictionary form. Options C (conditional ば-form) and D (conditional なら) express conditions, not sequences.",
      skill: "Language — Te-Form and Sequential Actions",
      difficulty: "medium"
    },
    {
      question: "The graph shows Japanese population trends from 1970-2050 (projected). Which conclusion is MOST supported?",
      chart_data: {
        type: "line",
        title: "Japan Population by Age Group (millions), 1970-2050",
        data: [
          { year: "1970", working_age: 72, elderly: 7, youth: 25 },
          { year: "1990", working_age: 86, elderly: 15, youth: 22 },
          { year: "2010", working_age: 81, elderly: 30, youth: 17 },
          { year: "2025", working_age: 74, elderly: 38, youth: 14 },
          { year: "2050", working_age: 52, elderly: 38, youth: 11 }
        ],
        x_key: "year",
        y_keys: ["working_age", "elderly", "youth"],
        x_label: "Year",
        y_label: "Population (millions)"
      },
      stimulus_source: "National Institute of Population and Social Security Research, Japan, 2023",
      options: [
        "Japan's population is growing, with the elderly population increasing due to immigration",
        "Japan faces a demographic crisis with a shrinking working-age population and rapidly growing elderly population, creating economic and social challenges",
        "Youth population is growing, indicating future economic recovery",
        "The working-age population will remain stable through 2050"
      ],
      correct: 1,
      explanation: "The data shows working-age population falling from 86M (1990) to 52M (2050) while elderly population grows from 15M to 38M. This 'inverted pyramid' demographic structure is Japan's well-documented crisis: fewer workers supporting more retirees, straining pension systems, healthcare, and economic growth. Japan has the world's oldest population.",
      skill: "Interpretive Reading — Japanese Society and Demographics",
      difficulty: "medium"
    },
    {
      question: "Which expression is MOST appropriate when receiving a gift in Japanese?",
      options: [
        "「もったいないですね。」(What a waste!)",
        "「もらってあげます。」(I'll take it from you.)",
        "「まあ、こんなもの。」(Oh, something like this.)",
        "「これはすてきですね。わざわざありがとうございます。」(How lovely. Thank you for going out of your way.)"
      ],
      correct: 3,
      explanation: "Culturally appropriate gift-receiving in Japan involves expressing thanks and appreciation. 「わざわざありがとうございます」('Thank you for going out of your way') shows gratitude for the giver's effort. The other options are rude (もったいない/waste), condescending (もらってあげます uses wrong directionality), or dismissive (こんなもの).",
      skill: "Interpersonal Communication — Social Customs",
      difficulty: "easy"
    },
    {
      question: "Read the following paragraph and identify the MAIN idea:\n\n「近年、日本でもカフェで仕事をする人が増えています。ノートパソコンを持って、コーヒーを飲みながら、一人で静かに仕事をしたい人が多いようです。しかし、長時間一つのコーヒーだけで席を占拠することは、店側にとって問題となっています。」",
      stimulus: "近年、日本でもカフェで仕事をする人が増えています。ノートパソコンを持って、コーヒーを飲みながら、一人で静かに仕事をしたい人が多いようです。しかし、長時間一つのコーヒーだけで席を占拠することは、店側にとって問題となっています。",
      stimulus_header: "Question 8 refers to the following passage.",
      options: [
        "Japanese people have stopped going to cafes because of remote work",
        "Working from cafes is increasing in Japan, but it creates challenges for cafes when people occupy seats for long periods",
        "Japanese cafes only serve coffee and do not allow food",
        "Remote work has been completely banned in Japan"
      ],
      correct: 1,
      explanation: "The passage states: (1) Working at cafes is increasing in Japan. (2) Many people want to work quietly alone with a laptop over coffee. (3) However (しかし), occupying seats for long periods with only one coffee is becoming a problem for cafe owners. The main idea captures both the trend and its challenge.",
      skill: "Interpretive Reading — Social Issues",
      difficulty: "medium"
    },
    {
      question: "Which of the following correctly uses the verb 「〜ていただく」(te-itadaku) in a polite request?",
      options: [
        "「書類をチェックしてやります。」 (I'll check the documents for you.)",
        "「書類をチェックしていただけますか。」 (Could you check the documents for me?)",
        "「書類をチェックしてあげる。」 (I'll check the documents for you — casual)",
        "「書類をチェックしてほしい。」 (I want you to check the documents — blunt)"
      ],
      correct: 1,
      explanation: "〜ていただく is the humble form expressing that the speaker humbly receives an action done by someone of higher status. 「〜ていただけますか」= 'Could you please (do something for me)?' — the most polite request form. Using 〜てやる (option A) is condescending; 〜てあげる (C) is casual/condescending; 〜てほしい (D) is direct/blunt and inappropriate in formal settings.",
      skill: "Language — Keigo (Honorific Language)",
      difficulty: "hard"
    },
    {
      question: "Based on the schedule below, what can you conclude about Yamada's availability?\n\n月曜日：会議 9:00-12:00\n火曜日：出張（東京）\n水曜日：会議 14:00-16:00、懇親会 18:00-\n木曜日：有給休暇\n金曜日：プレゼン準備 終日",
      table_data: {
        headers: ["Day", "Schedule"],
        rows: [
          ["Monday (月)", "Meeting 9:00-12:00"],
          ["Tuesday (火)", "Business trip (Tokyo)"],
          ["Wednesday (水)", "Meeting 14:00-16:00, Social gathering 18:00-"],
          ["Thursday (木)", "Paid leave (vacation)"],
          ["Friday (金)", "Presentation prep — all day"]
        ]
      },
      options: [
        "Yamada is available for a 10am meeting on Wednesday",
        "Yamada could be reached for a short meeting on Monday afternoon",
        "Yamada is in the office every day this week",
        "Yamada has no free time all week"
      ],
      correct: 1,
      explanation: "Monday's meeting is 9:00-12:00 (morning only). The afternoon (afternoon = 午後) is not scheduled. Yamada would be available Monday afternoon. Tuesday: business trip (out of office). Wednesday: afternoon and evening meetings. Thursday: vacation. Friday: all-day preparation.",
      skill: "Interpretive Reading — Schedules/Practical Japanese",
      difficulty: "medium"
    }
  ],
  frq: [
    {
      title: "AP Japanese Language FRQ — Interpersonal and Presentational Writing",
      prompt: "You will write in Japanese for both parts of this question.",
      stimulus: "Part 1: Your Japanese friend Haruki is visiting your city for the first time next month. He messages you asking for recommendations.\nPart 2: Write a paragraph about a Japanese cultural practice you find interesting and would like to learn more about.",
      parts: [
        {
          label: "a",
          question: "Write a response to Haruki in Japanese (50-80 characters) recommending at least TWO specific things to do or see in your city, using natural, informal Japanese appropriate for a friend.",
          points: 5,
          rubric: "1 pt: Uses appropriate casual/friendly register (〜よ、〜ね、〜じゃん etc.). 1 pt: Recommends at least 2 specific activities with reasons. 1 pt: Uses 〜がいいよ/〜に行こう/〜がおすすめ type recommendation language. 1 pt: Grammatically accurate te-forms, particles, verb endings. 1 pt: Culturally appropriate and natural flow."
        },
        {
          label: "b",
          question: "Write a paragraph in Japanese (100-120 characters) about ONE Japanese cultural practice (e.g., 茶道、祭り、武道、食文化 etc.) that you find interesting. Explain what it is, why you find it interesting, and one thing you would like to learn about it.",
          points: 10,
          rubric: "2 pts: Clearly identifies a specific cultural practice with accurate description. 2 pts: Explains personal interest with specific detail. 2 pts: Appropriate use of 〜について、〜ことが、〜と思う etc. 2 pts: Varied vocabulary and sentence structures. 2 pts: Accurate grammar (particles, verb conjugations, te-form, たい形)."
        },
        {
          label: "c",
          question: "Your school is hosting a Japanese exchange student. Write a brief welcome message (40-60 characters) in polite Japanese (丁寧語) that introduces yourself and expresses that you look forward to showing them around.",
          points: 5,
          rubric: "1 pt: Appropriate polite register (〜です、〜ます). 1 pt: Self-introduction with name/grade. 1 pt: Expresses anticipation (楽しみにしています/よろしくお願いします). 1 pt: Culturally appropriate greeting. 1 pt: Grammar accuracy."
        }
      ]
    }
  ]
};