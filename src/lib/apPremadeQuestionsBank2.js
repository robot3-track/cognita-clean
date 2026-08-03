// ─── Additional AP Question Banks — HuG (V4, V5), Chemistry (V3), World History (V3) ──

// ─── AP Human Geography V4 ────────────────────────────────────────────────────
export const AP_HUMAN_GEO_V4 = {
  mcq: [
    {
      question: "A choropleth map of Africa shades countries with CDR > 15 per 1,000 darkest. Which stage of the DTM do these darkest-shaded countries MOST likely represent?",
      map_description: "A choropleth map of Africa showing crude death rate (CDR) per 1,000 population by country (2022). The darkest shading (CDR > 15) covers: Somalia, Chad, Sierra Leone, Central African Republic, and South Sudan. Medium shading (CDR 10–15) covers: Ethiopia, Angola, and DRC. Light shading (CDR < 10) covers: South Africa, Egypt, Morocco, and Algeria. A legend indicates CDR ranges with corresponding shade intensities.",
      stimulus_source: "UN World Population Prospects, 2022",
      stimulus_header: "Question 1 refers to the following map.",
      options: [
        "Stage 5 — CDR exceeds CBR, indicating natural decrease",
        "Stage 4 — low birth rates and low death rates",
        "Stage 2 — death rates declining but still elevated; high birth rates persist",
        "Stage 1 — pre-industrial equilibrium with high birth and death rates"
      ],
      correct: 2,
      explanation: "Stage 2 of the DTM features declining but still elevated death rates as basic healthcare and sanitation improve. The countries listed (Somalia, Chad, Sierra Leone) have high CDRs driven by conflict, poverty, and limited healthcare — consistent with early Stage 2. True Stage 1 populations are extremely rare today; Stage 4 has CDRs below 10.",
      skill: "Unit 2: Population & Migration Patterns",
      difficulty: "medium"
    },
    {
      question: "The table shows data for four cities. Based on the rank-size rule, what would be the expected population of City B if City A is the primate city with 10 million people?",
      table_data: {
        headers: ["City Rank", "City", "Actual Population (millions)", "Expected by Rank-Size Rule"],
        rows: [
          ["1 (Primate)", "City A", "10.0", "10.0"],
          ["2", "City B", "3.2", "?"],
          ["3", "City C", "1.9", "3.33"],
          ["4", "City D", "1.5", "2.5"]
        ]
      },
      stimulus_source: "Adapted from Zipf's Rank-Size Rule analysis",
      options: [
        "10.0 million (same as primate city)",
        "5.0 million (1/2 of primate city)",
        "2.5 million (1/4 of primate city)",
        "1.0 million (1/10 of primate city)"
      ],
      correct: 1,
      explanation: "Zipf's Rank-Size Rule predicts: population of rank-n city = primate city population / n. For rank 2: 10M / 2 = 5M. The actual population of 3.2M is significantly below expectation, suggesting an underdeveloped urban hierarchy or primate city dominance. The rule assumes a well-integrated national urban system.",
      skill: "Unit 7: Cities and Urban Land Use",
      difficulty: "medium"
    },
    {
      question: "A geographer studying language geography would classify Spanish, French, Portuguese, Italian, and Romanian as belonging to which language subfamily, and what was the PRIMARY mechanism of their diffusion across Europe and the Americas?",
      options: [
        "Germanic subfamily; diffused through Viking trade networks",
        "Romance subfamily; diffused through relocation diffusion as the Roman Empire spread Latin",
        "Slavic subfamily; diffused through military conquest by Slavic kingdoms",
        "Romance subfamily; diffused through hierarchical diffusion from the Catholic Church"
      ],
      correct: 1,
      explanation: "Romance languages evolved from Vulgar Latin (spoken Latin) as the Roman Empire expanded — a process of relocation diffusion where Latin-speaking Romans physically settled across Europe. The Church preserved formal Latin but Romance vernaculars evolved regionally. Spanish and Portuguese then spread to the Americas through colonial relocation diffusion (conquest and settlement).",
      skill: "Unit 3: Cultural Patterns and Processes",
      difficulty: "medium"
    },
    {
      question: "The graph shows crude birth rates (CBR) and crude death rates (CDR) for Japan from 1950 to 2020. Which conclusion is BEST supported?",
      chart_data: {
        type: "line",
        title: "Japan CBR and CDR per 1,000 Population, 1950–2020",
        data: [
          { year: "1950", cbr: 28, cdr: 10 },
          { year: "1960", cbr: 17, cdr: 8 },
          { year: "1970", cbr: 19, cdr: 7 },
          { year: "1980", cbr: 14, cdr: 6 },
          { year: "1990", cbr: 10, cdr: 7 },
          { year: "2000", cbr: 9, cdr: 8 },
          { year: "2010", cbr: 8, cdr: 9 },
          { year: "2020", cbr: 7, cdr: 11 }
        ],
        x_key: "year",
        y_keys: ["cbr", "cdr"],
        x_label: "Year",
        y_label: "Rate per 1,000"
      },
      stimulus_source: "World Bank Development Indicators, 2021",
      options: [
        "Japan has experienced consistent population growth since 1950 due to high birth rates",
        "Japan has transitioned to Stage 5 of the DTM, with CDR exceeding CBR and natural population decrease",
        "Japan's CDR consistently exceeded CBR throughout the entire period shown",
        "Japan's demographic transition stalled at Stage 3 due to high birth rates after 1990"
      ],
      correct: 1,
      explanation: "By 2010, Japan's CDR (9) exceeded its CBR (8), and by 2020 the gap widened to CDR=11, CBR=7. This CDR > CBR relationship, indicating natural population decrease, is characteristic of Stage 5 of the DTM. Japan is the world's most prominent example of Stage 5, with an aging population, very low fertility, and an absolute decline in natural increase.",
      skill: "Unit 2: Population & Migration Patterns",
      difficulty: "medium"
    },
    {
      question: "Rostow's Stages of Economic Growth model suggests that a country with export-oriented manufacturing, rising consumer demand, and active foreign direct investment is MOST likely in which stage?",
      options: [
        "Traditional society — subsistence agriculture dominates",
        "Preconditions for take-off — infrastructure investment begins",
        "Take-off — rapid industrialization and export-led growth",
        "Drive to maturity — diversified industrial base, self-sustaining growth"
      ],
      correct: 2,
      explanation: "The take-off stage in Rostow's model is marked by rapid industrialization, high savings and investment rates, export-led manufacturing growth, and significant foreign direct investment. Countries like South Korea in the 1970s–80s and China in the 1990s–2000s exemplified the take-off stage. The drive to maturity involves a more diversified, technologically advanced economy.",
      skill: "Unit 11: Industrialization and Development",
      difficulty: "medium"
    },
    {
      question: "Which of the following BEST describes the concept of 'blockbusting' as a historical urban geography phenomenon in the United States?",
      options: [
        "Government-sponsored construction of high-rise public housing in city centers",
        "Real estate agents inducing white homeowners to sell cheaply by warning of racial integration, then reselling at higher prices to Black families",
        "The process by which suburban malls replaced downtown retail districts",
        "Urban renewal policies demolishing ethnic neighborhoods to build highways"
      ],
      correct: 1,
      explanation: "Blockbusting was a real estate practice (prevalent 1950s–1970s) in which agents exploited white homeowners' fears of racial integration to panic-sell at depressed prices, then sold those homes to Black families at inflated prices. This contributed to white flight and residential segregation patterns visible on US urban maps today. The Fair Housing Act of 1968 made it illegal.",
      skill: "Unit 7: Urban Land Use",
      difficulty: "medium"
    },
    {
      question: "A country's census reveals that 42% of its workforce is employed in agriculture, 28% in manufacturing, and 30% in services. Based on this occupational structure, where would this country MOST likely be placed on Rostow's model?",
      options: [
        "Traditional society (Stage 1) — nearly all workers in agriculture",
        "Take-off (Stage 3) — significant industrial workforce alongside agricultural base",
        "Drive to maturity (Stage 4) — service sector already dominant",
        "High mass consumption (Stage 5) — overwhelmingly service economy"
      ],
      correct: 1,
      explanation: "A 28% manufacturing workforce alongside 42% agricultural employment suggests an economy actively industrializing — consistent with Rostow's take-off stage. The traditional society has >80% agricultural employment. Drive to maturity and high mass consumption are characterized by manufacturing below 25% and services dominant. This mixed structure places the country in take-off or early drive to maturity.",
      skill: "Unit 11: Development",
      difficulty: "hard"
    },
    {
      question: "The Sahel region of West Africa has experienced repeated severe droughts and desertification since the 1970s. Geographers studying this region would attribute the environmental crisis to which combination of factors?",
      options: [
        "Tectonic uplift creating rain shadows across the Sahara Desert",
        "Overgrazing, deforestation, and population pressure on marginal lands, combined with variable monsoon rainfall linked to climate change",
        "Colonial-era dam construction that permanently altered regional hydrology",
        "Urbanization drawing farmers away from productive agricultural land"
      ],
      correct: 1,
      explanation: "Desertification in the Sahel results from the interaction of physical and human factors: the physical driver is irregular and declining Saharan margin rainfall linked to ITCZ shifts and anthropogenic climate change. Human factors include overgrazing (goats and cattle destroying vegetation cover), fuelwood collection stripping trees, population growth forcing cultivation of marginal soils, and failed agricultural modernization. This feedback loop accelerates soil erosion and land degradation.",
      skill: "Unit 5: Agriculture and Rural Land Use",
      difficulty: "medium"
    },
    {
      question: "Which of the following BEST illustrates the concept of 'space-time compression' in human geography?",
      options: [
        "The construction of the Panama Canal reducing shipping distances between Atlantic and Pacific ports",
        "Advances in telecommunications and transportation technology that make distant places functionally closer by reducing travel and communication time",
        "The expansion of cities into formerly rural areas through suburbanization",
        "Government programs that standardize time zones across a country"
      ],
      correct: 1,
      explanation: "Space-time compression (Harvey, 1989) refers to the way technological innovations — jet travel, internet, containerized shipping, telecommunications — effectively shrink perceived distance by reducing the time and cost of connecting distant places. A New York business can communicate instantly with Shanghai; a traveler can cross the Atlantic in 7 hours vs. weeks by sailing ship. The Panama Canal reduces physical distance, not space-time compression.",
      skill: "Unit 1: Thinking Geographically",
      difficulty: "medium"
    },
    {
      question: "According to the epidemiological transition model, which sequence correctly orders the causes of death from Stage 2 to Stage 4?",
      options: [
        "Stage 2: chronic disease → Stage 3: infectious disease → Stage 4: degenerative disease",
        "Stage 2: infectious/parasitic disease → Stage 3: mixed infectious and chronic → Stage 4: degenerative/chronic disease",
        "Stage 2: war and famine → Stage 3: accidents and violence → Stage 4: cancer and heart disease",
        "Stage 2: malnutrition → Stage 3: obesity-related illness → Stage 4: infectious disease resurgence"
      ],
      correct: 1,
      explanation: "Omran's Epidemiological Transition Model parallels the DTM: Stage 2 = high mortality from infectious/parasitic diseases (cholera, malaria, plague) as CDR begins falling. Stage 3 = declining infectious disease, emerging chronic conditions. Stage 4 = degenerative and man-made diseases (cardiovascular disease, cancer) dominate as infectious disease is controlled through vaccines, antibiotics, and sanitation.",
      skill: "Unit 2: Population & Migration Patterns",
      difficulty: "hard"
    },
    {
      question: "According to Johann Heinrich von Thünen’s model of agricultural land use, which crop or agricultural activity is located closest to the central market city, and why?",
      options: [
        "Grains and wheat, because they require flat land adjacent to urban grain mills",
        "Dairy farming and market gardening, because produce spoils quickly and incurs high transport costs",
        "Livestock ranching, because animals require urban slaughterhouses nearby",
        "Forestry and fuelwood, because timber must be harvested near city construction zones"
      ],
      correct: 1,
      explanation: "Von Thünen's model places intensive dairy farming and market gardening in the innermost ring surrounding the market city. Because milk, eggs, and fresh vegetables are highly perishable and costly to transport without refrigeration, farmers pay higher land rents close to the market to minimize transit times and spoilage.",
      skill: "Unit 5: Agriculture and Rural Land Use",
      difficulty: "medium"
    },
    {
      question: "A multinational enterprise shifts its call center operations from Chicago to Bengaluru, India, while maintaining its corporate headquarters in Illinois. This economic spatial arrangement is BEST described as an example of:",
      options: [
        "Ecotourism and regional sustainable development",
        "The global division of labor and business process outsourcing (BPO)",
        "Import substitution industrialization (ISI)",
        "Fordist assembly-line manufacturing and agglomeration"
      ],
      correct: 1,
      explanation: "Outsourcing tertiary and quaternary business operations (like call centers or IT service desks) to countries with lower labor costs and large English-speaking educated populations illustrates the new international division of labor and business process outsourcing (BPO).",
      skill: "Unit 6: Industrial and Economic Development Patterns",
      difficulty: "easy"
    }
  ],
  frq: [
    {
      title: "AP Human Geography FRQ — Development Indicators and Core-Periphery",
      prompt: "Use the following data and your knowledge of AP Human Geography to answer all parts.",
      stimulus: "The table below shows development indicators for four countries:\n\nCountry | GNI/capita (PPP $) | HDI | % Urban | Infant Mortality (per 1,000)\nUSA | $65,100 | 0.926 | 83% | 5.4\nMexico | $19,900 | 0.758 | 81% | 12.9\nNigeria | $5,400 | 0.539 | 52% | 71.2\nNiger | $1,200 | 0.394 | 17% | 79.4",
      parts: [
        { label: "a", question: "Using Wallerstein's World-Systems Theory, classify each of the four countries as core, semi-periphery, or periphery. Justify each classification using specific data from the table.", points: 4, rubric: "1 pt per correct classification (USA=core, Mexico=semi-periphery, Nigeria=periphery or semi-periphery, Niger=periphery) with data justification. Accept Nigeria as semi-periphery if justified by its oil export economy." },
        { label: "b", question: "Explain TWO reasons why infant mortality rate is considered a more reliable development indicator than GNI per capita alone.", points: 4, rubric: "2 pts each: (1 pt reason; 1 pt explanation). Reasons: GNI/capita masks inequality (Gini coefficient); IMR reflects actual access to healthcare, sanitation, nutrition — not just average income; GNI doesn't capture informal economy accurately; IMR is harder to manipulate politically than GDP data." },
        { label: "c", question: "A development organization is considering which country to prioritize for aid investment. Using the data and geographic concepts, explain why Niger presents a more challenging development context than Nigeria despite both being classified as peripheral or semi-peripheral.", points: 2, rubric: "1 pt: Specific data comparison (Niger HDI 0.394 vs Nigeria 0.539; GNI $1,200 vs $5,400; IMR near identical but urban % much lower at 17%). 1 pt: Geographic reasoning — landlocked status, Sahelian climate, extremely low urbanization limiting agglomeration economies, or lack of oil wealth." }
      ]
    },
    {
      title: "AP Human Geography FRQ — Urban Hierarchy and Spatial Development",
      prompt: "Urban systems exhibit distinct structural patterns globally based on history, economics, and infrastructure.",
      stimulus: "Consider primate city patterns versus rank-size rule distributions across developing and developed nations.",
      parts: [
        { label: "a", question: "Define the term 'primate city' and identify ONE economic disadvantage a state faces when its urban network is dominated by a single primate city.", points: 2, rubric: "1 pt: Definition (a city that is more than twice as large as the second-largest city and overwhelmingly dominant politically/economically). 1 pt: Disadvantage (uneven regional investment, brain drain from rural areas, traffic congestion, hyper-urbanization strain on infrastructure)." },
        { label: "b", question: "Describe how edge cities differ from traditional Central Business Districts (CBDs) in terms of location and land use.", points: 2, rubric: "1 pt: Edge cities are located along outer suburban beltways/freeway intersections rather than downtown centers. 1 pt: Land use includes suburban office parks, retail complexes, and modern car-dependent infrastructure." }
      ]
    }
  ]
};

// ─── AP Human Geography V5 ────────────────────────────────────────────────────
export const AP_HUMAN_GEO_V5 = {
  mcq: [
    {
      question: "A country's government mandates that all official documents, schools, and media use a single national language, replacing dozens of regional dialects. This policy is BEST described as an example of:",
      options: [
        "Cultural syncretism — blending multiple linguistic traditions",
        "Linguistic imperialism — imposing a language to suppress minority cultures",
        "Official language policy as a centripetal force building national unity",
        "Relocation diffusion of language through voluntary migration"
      ],
      correct: 2,
      explanation: "A mandated national language is a classic centripetal force — it binds the state together by enabling communication, creating a shared national identity, and facilitating bureaucratic efficiency. While it can marginalize minority speakers (a legitimate critique), in the AP context it is categorized as a centripetal (unifying) force. Examples include Swahili in Tanzania, Mandarin in China, and Indonesian in Indonesia.",
      skill: "Unit 4: Political Patterns",
      difficulty: "medium"
    },
    {
      question: "The table shows agricultural data for selected countries. Which country's data BEST supports the argument that intensive subsistence agriculture can support very high population densities?",
      table_data: {
        headers: ["Country", "Population Density (per km²)", "% Labor in Agriculture", "Primary Crop", "Caloric Yield (kcal/ha/year)"],
        rows: [
          ["Bangladesh", "1,118", "38%", "Rice (wet)", "4,200,000"],
          ["Canada", "4", "2%", "Wheat (mechanized)", "890,000"],
          ["Brazil", "25", "9%", "Soybeans/corn", "2,100,000"],
          ["Australia", "3", "3%", "Wheat/sheep", "650,000"]
        ]
      },
      stimulus_source: "FAO Agricultural Database, 2020",
      options: [
        "Canada — large land area supports low-density extensive farming",
        "Brazil — export-oriented commercial agriculture drives economic development",
        "Bangladesh — wet rice cultivation's high caloric yield per hectare enables extreme population density",
        "Australia — extensive ranching provides food security for an isolated continent"
      ],
      correct: 2,
      explanation: "Bangladesh's data demonstrates that wet rice cultivation — labor-intensive, requiring irrigation and multiple harvests — produces extremely high caloric yields per hectare (4.2M kcal/ha), enabling the world's highest population density for a large country (1,118/km²). Rice paddy systems in Asia are the classic example of intensive subsistence agriculture supporting dense populations through high yields despite small farm sizes.",
      skill: "Unit 5: Agriculture",
      difficulty: "medium"
    },
    {
      question: "In Christaller's Central Place Theory, the concept of 'threshold' refers to:",
      options: [
        "The maximum distance consumers will travel to obtain a good or service",
        "The minimum market size (population) needed for a business to be financially viable",
        "The geographic boundary marking a city's formal administrative limits",
        "The elevation above which certain agricultural activities become economically unviable"
      ],
      correct: 1,
      explanation: "Threshold in Central Place Theory = the minimum population needed to support a good or service. High-order goods (hospitals, opera houses, car dealerships) have high thresholds — they need large populations to be profitable. Low-order goods (convenience stores, gas stations) have low thresholds. 'Range' is the complementary concept — the maximum distance consumers will travel. Together, threshold and range determine settlement hierarchies.",
      skill: "Unit 7: Urban Geography",
      difficulty: "easy"
    },
    {
      question: "The map shows areas of Sub-Saharan Africa where desertification has increased since 1970. Based on your knowledge of AP Human Geography, which factor MOST explains why the Sahel region shows the greatest desertification?",
      map_description: "A map of Sub-Saharan Africa showing desertification risk zones (2022). The darkest shading (highest desertification risk) covers: Mauritania, Mali, Niger, Sudan, and Ethiopia's lowlands — the Sahel belt running east-west across Africa south of the Sahara. Medium shading covers: northern Nigeria, northern Kenya, and the Ogaden region of Somalia. Light shading covers most of central and southern Africa. Borders are labeled; major rivers (Niger, Nile, Congo) are shown in blue.",
      stimulus_source: "UNCCD Global Assessment of Soil Degradation, 2022",
      options: [
        "High Sahel precipitation makes farming unsustainable, driving abandonment",
        "Population growth exceeding the land's carrying capacity combined with drought leads to overgrazing and soil degradation",
        "Declining temperatures in the Sahel reduce evapotranspiration and dry out soils",
        "Colonial-era boundaries created landlocked states that cannot access international food aid"
      ],
      correct: 1,
      explanation: "Desertification in the Sahel is primarily driven by the interaction of rapid population growth (high TFRs in countries like Niger and Mali), poverty forcing reliance on marginal lands, overgrazing (goats remove vegetation cover exposing topsoil), fuelwood cutting stripping trees, and variable/declining Sahelian rainfall linked to climate variability. The Sahel's location at the desert margin makes it climatically fragile.",
      skill: "Unit 2: Population & Rural Geography",
      difficulty: "medium"
    },
    {
      question: "The process by which a formerly working-class urban neighborhood attracts wealthier residents, increases property values, and displaces original residents is called:",
      options: [
        "Suburbanization — movement of middle class to urban fringe",
        "Blockbusting — panic-selling homes to exploit racial transition",
        "Gentrification — urban reinvestment attracting higher-income residents",
        "Filtering — older housing stock passing to lower-income residents"
      ],
      correct: 2,
      explanation: "Gentrification involves the upgrading of a neighborhood through private investment by higher-income newcomers, raising property values and rents, improving amenities, but often displacing lower-income original residents. Classic examples include Brooklyn (NYC), Brixton (London), and Capitol Hill (Seattle). It is a market-driven process unlike blockbusting (real estate manipulation) or filtering (natural housing market aging).",
      skill: "Unit 7: Urban Geography",
      difficulty: "easy"
    },
    {
      question: "Which of the following represents a PUSH factor in international migration theory?",
      options: [
        "Higher wages available in the destination country",
        "Better educational opportunities for children in the destination country",
        "Political persecution and civil war in the country of origin",
        "Cultural similarities making integration easier in the destination country"
      ],
      correct: 2,
      explanation: "Push factors compel people to leave their origin country (dangers, poverty, lack of opportunity, violence, persecution). Pull factors attract people to destination countries (economic opportunity, political freedom, family reunification). Political persecution and civil war are classic push factors — they force emigration. Higher wages, educational opportunities, and cultural fit are pull factors.",
      skill: "Unit 2: Migration",
      difficulty: "easy"
    },
    {
      question: "The map shows manufacturing job flows between the US Rust Belt and the US Sun Belt plus Mexico from 1970–2010. Which geographic concept MOST directly explains this pattern?",
      map_description: "A flow map of North America showing manufacturing job losses (red arrows) from states including Michigan, Ohio, Pennsylvania, and Illinois moving southward (blue arrows) to Alabama, Tennessee, Texas, and Georgia, and also southeast to northern Mexico's maquiladora zone (Tijuana, Ciudad Juárez, Monterrey). Arrow widths are proportional to job count. Numbers on arrows indicate thousands of jobs: Michigan-Alabama: 180,000; Ohio-Mexico: 145,000; Pennsylvania-Tennessee: 92,000. Legend: red = job loss area, blue = job gain area.",
      stimulus_source: "U.S. Bureau of Labor Statistics, 2012; INEGI Mexico",
      options: [
        "Intervening obstacles blocking manufacturing growth in the Rust Belt",
        "Weber's least cost theory — manufacturers seeking lower labor costs through deindustrialization",
        "Bid-rent theory — higher land costs in Rust Belt cities pushing out manufacturing",
        "Wallerstein's world systems — Rust Belt becoming peripheral as Sun Belt becomes core"
      ],
      correct: 1,
      explanation: "Alfred Weber's least cost theory predicts manufacturing locates where total costs (transport + labor + agglomeration) are minimized. Rising union wages, higher taxes, and aging infrastructure increased costs in Rust Belt cities. NAFTA (1994) reduced trade barriers with Mexico where wages were far lower, while right-to-work laws in Southern states reduced labor costs. This is textbook deindustrialization driven by labor cost optimization.",
      skill: "Unit 11: Industrialization and Development",
      difficulty: "hard"
    },
    {
      question: "A refugee who fled Syria in 2015 and traveled through Turkey, Greece, and Germany before settling in Sweden demonstrates which migration concept?",
      options: [
        "Step migration — moving in stages through intermediate locations toward final destination",
        "Chain migration — following family members who previously migrated",
        "Counter-urbanization — moving from urban to rural areas",
        "Forced migration — movement compelled entirely by environmental disaster"
      ],
      correct: 0,
      explanation: "Step migration involves moving in successive stages, often from rural to urban, or through a series of intermediate places before reaching the final destination. The Syrian refugee's path through Turkey → Greece → Germany → Sweden exemplifies step migration — each move brought them closer to a preferred destination. This contrasts with chain migration (following established social networks of prior migrants from the same origin).",
      skill: "Unit 2: Migration",
      difficulty: "medium"
    },
    {
      question: "According to Zipf's Rank-Size Rule, in a country with a primate city of 8 million people, what would be the expected population of the 4th-largest city?",
      options: [
        "4 million", "2 million", "1 million", "800,000"
      ],
      correct: 1,
      explanation: "Rank-Size Rule: population of rank-n city = primate city / n. For rank 4: 8,000,000 / 4 = 2,000,000. The rule assumes a well-developed, integrated urban hierarchy. Primate city countries (like France with Paris, or Argentina with Buenos Aires) violate the rule — the primate city is far larger than the rule would predict relative to smaller cities.",
      skill: "Unit 7: Urban Geography",
      difficulty: "easy"
    },
    {
      question: "The Hoyt Sector Model of urban land use differs from the Burgess Concentric Zone Model primarily in that Hoyt's model:",
      options: [
        "Places the Central Business District at the periphery rather than the center of the city",
        "Shows land uses arranged in sectors radiating outward along transportation routes rather than concentric rings",
        "Argues that no single urban center exists — instead multiple nuclei develop independently",
        "Applies only to cities in the Global South where colonial grid patterns were imposed"
      ],
      correct: 1,
      explanation: "Hoyt's Sector Model (1939) modified Burgess by showing that land use extends outward from the CBD in wedge-shaped sectors along transportation corridors (railways, highways). High-rent residential areas cluster in one sector, low-rent in another, industrial in another — all radiating from the center. Burgess shows concentric rings. The Multiple Nuclei Model (Harris & Ullman) is the third major model arguing for multiple independent nodes.",
      skill: "Unit 7: Urban Geography",
      difficulty: "medium"
    },
    {
      question: "Which boundary type is created by human decision after a cultural landscape has already been established, often leading to territorial disputes among cultural groups?",
      options: [
        "Antecedent boundary — drawn prior to widespread human settlement",
        "Subsequent boundary — drawn after settlement to accommodate existing cultural divisions",
        "Superimposed boundary — imposed by outside powers without regard to existing cultural patterns",
        "Relic boundary — no longer functions politically but remains visible on the landscape"
      ],
      correct: 2,
      explanation: "Superimposed boundaries are forced upon a region by external colonial or imperial powers ignoring established ethnic or cultural groupings. A classic example is the 1884 Berlin Conference partitioning Africa.",
      skill: "Unit 4: Political Patterns and Processes",
      difficulty: "medium"
    },
    {
      question: "In the context of political geography, which of the following serves as a classic CENTRIFUGAL force within a multinational state?",
      options: [
        "A well-maintained national highway and high-speed rail infrastructure",
        "Strong regional ethnic nationalism demanding political autonomy or devolution",
        "A national sports team competing in international tournaments",
        "A unified national educational curriculum taught in a single common language"
      ],
      correct: 1,
      explanation: "Centrifugal forces pull states apart and fragment unity. Subnational ethnic movements demanding regional autonomy (such as Catalans in Spain or Kurds in Iraq/Turkey) are strong centrifugal drivers.",
      skill: "Unit 4: Political Patterns and Processes",
      difficulty: "easy"
    }
  ],
  frq: [
    {
      title: "AP Human Geography FRQ — Migration and Demographic Change",
      prompt: "Use the following scenario and your knowledge of AP Human Geography to answer all parts.",
      stimulus: "Guatemala has experienced significant emigration since the 1990s, primarily to the United States. As of 2022, approximately 3 million Guatemalans (18% of the population) live in the US. Remittances from this diaspora totaled $18.1 billion in 2022, representing 19.8% of Guatemala's GDP — the highest remittance-to-GDP ratio in Central America. Meanwhile, Guatemala has a TFR of 2.7 and an HDI of 0.627, placing it in the 'medium human development' category.",
      parts: [
        { label: "a", question: "Identify TWO push factors and ONE pull factor that explain Guatemalan emigration to the United States. Use specific evidence or context from the scenario.", points: 6, rubric: "2 pts each push factor: (1 pt identification; 1 pt explanation). Push: poverty (HDI 0.627, low wages), gang violence and insecurity, lack of economic opportunity, land inequality, climate-related agricultural failure. Pull: higher wages in the US, rule of law/physical security, established Guatemalan diaspora communities (chain migration), family reunification. 2 pts pull factor." },
        { label: "b", question: "Explain how remittances can BOTH help AND harm long-term development in Guatemala. Use the data provided.", points: 4, rubric: "2 pts benefits: remittances raise household incomes ($18.1B = 19.8% GDP), reduce poverty, fund education and health costs, stabilize exchange rate. 2 pts harms: dependency on remittances substitutes for government development investment; brain drain as skilled workers emigrate; Dutch Disease — remittance inflows can raise local prices and hurt agricultural competitiveness; cyclical vulnerability to US economic downturns." }
      ]
    },
    {
      title: "AP Human Geography FRQ — Cultural Diffusion and Globalization",
      prompt: "Cultural traits diffuse globally through varied mechanisms, reshaping regional landscapes.",
      stimulus: "Analyze the global expansion of fast-food franchises and popular media across East and Southeast Asia.",
      parts: [
        { label: "a", question: "Define 'stimulus diffusion' and provide ONE real-world cultural example of this phenomenon.", points: 2, rubric: "1 pt: Definition (the spread of an underlying concept or idea even though a specific trait fails or is modified). 1 pt: Example (e.g., McDonald's offering vegetarian or specialized non-beef menus in India)." },
        { label: "b", question: "Explain how globalization can contribute to cultural homogenization while simultaneously sparking cultural divergence.", points: 2, rubric: "1 pt for homogenization (spread of global brands/media reduces regional landscape distinctiveness). 1 pt for divergence (local groups reasserting traditional religious or regional identity in opposition to Western media)." }
      ]
    }
  ]
};

// ─── AP Chemistry V3 ──────────────────────────────────────────────────────────
export const AP_CHEMISTRY_V3 = {
  mcq: [
    {
      question: "A student prepares a buffer by mixing 0.25 mol of acetic acid (pKa = 4.74) with 0.25 mol of sodium acetate in 1.0 L of solution. What is the pH of this buffer?",
      options: ["4.74", "7.00", "5.74", "3.74"],
      correct: 0,
      explanation: "Henderson-Hasselbalch equation: pH = pKa + log([A⁻]/[HA]) = 4.74 + log(0.25/0.25) = 4.74 + log(1) = 4.74 + 0 = 4.74. When the weak acid and conjugate base concentrations are equal, the pH equals the pKa. This is the maximum buffering capacity point of the acetate buffer system.",
      skill: "Unit 8: Acids, Bases, and Buffers",
      difficulty: "easy"
    },
    {
      question: "Based on the data in the table, which substance has the STRONGEST intermolecular forces?",
      table_data: {
        headers: ["Substance", "Molecular Formula", "Molar Mass (g/mol)", "Boiling Point (°C)"],
        rows: [
          ["Propane", "C₃H₈", "44", "−42"],
          ["Dimethyl ether", "C₂H₆O", "46", "−24"],
          ["Acetaldehyde", "C₂H₄O", "44", "20"],
          ["Ethanol", "C₂H₅OH", "46", "78"]
        ]
      },
      stimulus_source: "CRC Handbook of Chemistry and Physics, 2020",
      options: [
        "Propane — highest carbon content provides strong London dispersion forces",
        "Dimethyl ether — oxygen atom creates strong permanent dipole",
        "Acetaldehyde — carbonyl group enables strong hydrogen bonding",
        "Ethanol — hydroxyl group (-OH) enables hydrogen bonding with other ethanol molecules"
      ],
      correct: 3,
      explanation: "Boiling point reflects the strength of intermolecular forces (more energy needed to overcome stronger forces). Ethanol (78°C) has the highest boiling point despite similar molar mass to the others. The -OH group in ethanol enables hydrogen bonding (N-H, O-H, F-H donor to electronegative acceptor), which is the strongest type of intermolecular force among these. Acetaldehyde has a C=O group but no O-H hydrogen bond donor.",
      skill: "Unit 3: Intermolecular Forces and Properties",
      difficulty: "medium"
    },
    {
      question: "For the reaction: 2SO₂(g) + O₂(g) ⇌ 2SO₃(g), ΔH° = −198 kJ. Which change would INCREASE the equilibrium yield of SO₃?",
      options: [
        "Increasing temperature",
        "Decreasing pressure by increasing volume",
        "Adding a catalyst",
        "Increasing the concentration of SO₂"
      ],
      correct: 3,
      explanation: "Le Châtelier's principle: adding SO₂ (a reactant) shifts equilibrium to the right, increasing SO₃ yield. Temperature increase shifts exothermic reactions left (Le Châtelier) — reduces SO₃. Decreasing pressure shifts toward more moles of gas (left, from 2 to 3 moles) — reduces SO₃. A catalyst speeds up reaching equilibrium but does NOT change the equilibrium position or yield.",
      skill: "Unit 7: Equilibrium",
      difficulty: "medium"
    },
    {
      question: "A student performs a coffee cup calorimetry experiment mixing 50.0 mL of 1.0 M HCl with 50.0 mL of 1.0 M NaOH, both at 21.5°C. The final temperature is 28.2°C. The specific heat capacity of the solution is 4.18 J/g·°C and density ≈ 1.00 g/mL. What is the approximate heat released (q)?",
      options: [
        "q = −558 J (heat released by reaction)",
        "q = +558 J (heat absorbed by solution)",
        "q = −2,799 J (heat released by reaction)",
        "q = +2,799 J (heat absorbed by solution)"
      ],
      correct: 2,
      explanation: "q_solution = m × c × ΔT = 100.0 g × 4.18 J/g·°C × (28.2 − 21.5)°C = 100 × 4.18 × 6.7 = 2,800.6 ≈ 2,799 J absorbed by solution. Since the solution absorbs heat, q_rxn = −2,799 J (exothermic — heat is released by the reaction). The sign convention: q_solution is positive (temperature rose), q_reaction is negative.",
      skill: "Unit 6: Thermochemistry",
      difficulty: "hard"
    },
    {
      question: "The graph shows titration data for 25.00 mL of an unknown acid titrated with 0.100 M NaOH. Based on the shape of the curve, which conclusion about the acid is BEST supported?",
      chart_data: {
        type: "line",
        title: "Titration Curve: Unknown Acid vs. 0.100 M NaOH",
        data: [
          { vol_naoh: 0, ph: 2.9 },
          { vol_naoh: 5, ph: 3.8 },
          { vol_naoh: 10, ph: 4.4 },
          { vol_naoh: 12.5, ph: 4.74 },
          { vol_naoh: 15, ph: 5.1 },
          { vol_naoh: 20, ph: 5.8 },
          { vol_naoh: 24, ph: 6.8 },
          { vol_naoh: 25, ph: 8.7 },
          { vol_naoh: 26, ph: 11.0 },
          { vol_naoh: 30, ph: 12.0 }
        ],
        x_key: "vol_naoh",
        y_keys: ["ph"],
        x_label: "Volume NaOH added (mL)",
        y_label: "pH"
      },
      stimulus_source: "AP Chemistry experimental data",
      options: [
        "The acid is a strong acid — the initial pH is very low (below 1)",
        "The acid is a weak monoprotic acid with pKa ≈ 4.74, with equivalence point at 25.00 mL NaOH",
        "The acid is diprotic — two equivalence points are visible",
        "The pKa cannot be determined from a titration curve"
      ],
      correct: 1,
      explanation: "Key observations: (1) Initial pH = 2.9 indicates a weak acid (strong acid of this concentration would give pH ~1). (2) At half-equivalence point (12.5 mL added), pH = 4.74 → pKa = 4.74 (consistent with acetic acid). (3) Sharp inflection at 25.00 mL = equivalence point (1:1 molar ratio confirms monoprotic acid). (4) Basic equivalence point pH (8.7) confirms weak acid — the conjugate base hydrolyzes water.",
      skill: "Unit 8: Acids and Bases — Titrations",
      difficulty: "hard"
    },
    {
      question: "Which of the following electron configurations represents a transition metal in its ground state?",
      options: [
        "[Ar] 4s²3d⁵ (Mn, manganese)",
        "[Ar] 4s²4p⁶ (Krypton is a noble gas)",
        "[Ne] 3s²3p⁶ (Argon ground state)",
        "[Kr] 5s²4d¹⁰5p⁶ (Xenon noble gas)"
      ],
      correct: 0,
      explanation: "Transition metals are d-block elements characterized by partially filled d orbitals. Manganese [Ar] 4s²3d⁵ has 5 electrons in the 3d subshell — half-filled, which is a particularly stable configuration. The d orbitals are partially filled (1–9 electrons), which is the defining characteristic of transition metals. Noble gases have completely filled electron configurations.",
      skill: "Unit 1: Atomic Structure",
      difficulty: "medium"
    },
    {
      question: "At constant temperature, a 2.0 L sample of gas at 3.0 atm is compressed to 1.5 L. What is the new pressure? Which gas law does this demonstrate?",
      options: [
        "2.25 atm — Charles's Law (volume-temperature relationship)",
        "4.0 atm — Boyle's Law (inverse pressure-volume relationship)",
        "6.0 atm — Gay-Lussac's Law (pressure-temperature relationship)",
        "4.5 atm — Dalton's Law of Partial Pressures"
      ],
      correct: 1,
      explanation: "Boyle's Law: P₁V₁ = P₂V₂ (at constant temperature). P₂ = P₁V₁/V₂ = (3.0 atm × 2.0 L) / 1.5 L = 6.0/1.5 = 4.0 atm. Boyle's Law states pressure and volume are inversely proportional at constant temperature — compressing gas increases pressure. This is observed in syringe compression and respiratory mechanics.",
      skill: "Unit 3: Gases",
      difficulty: "easy"
    },
    {
      question: "The table shows standard reduction potentials. Which cell reaction has the HIGHEST standard cell potential (E°cell)?",
      table_data: {
        headers: ["Half-Reaction", "E° (V)"],
        rows: [
          ["F₂(g) + 2e⁻ → 2F⁻(aq)", "+2.87"],
          ["MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O", "+1.51"],
          ["Zn²⁺(aq) + 2e⁻ → Zn(s)", "−0.76"],
          ["Li⁺(aq) + e⁻ → Li(s)", "−3.05"]
        ]
      },
      stimulus_source: "Standard Reduction Potential Table",
      options: [
        "F₂ reduced + Li oxidized: E°cell = +2.87 − (−3.05) = +5.92 V",
        "F₂ reduced + Zn oxidized: E°cell = +2.87 − (−0.76) = +3.63 V",
        "MnO₄⁻ reduced + Zn oxidized: E°cell = +1.51 − (−0.76) = +2.27 V",
        "MnO₄⁻ reduced + Li oxidized: E°cell = +1.51 − (−3.05) = +4.56 V"
      ],
      correct: 0,
      explanation: "E°cell = E°cathode − E°anode. The strongest oxidizing agent (F₂, highest reduction potential +2.87V) pairs with the strongest reducing agent (Li, most negative reduction potential −3.05V). E°cell = +2.87 − (−3.05) = +5.92 V. This represents the greatest thermodynamic driving force. The most positive E°cell indicates the most spontaneous reaction.",
      skill: "Unit 9: Electrochemistry",
      difficulty: "hard"
    },
    {
      question: "Which of the following pairs of ions would form the MOST insoluble precipitate when their solutions are mixed?",
      table_data: {
        headers: ["Precipitate", "Ksp"],
        rows: [
          ["AgCl", "1.8 × 10⁻¹⁰"],
          ["PbSO₄", "1.6 × 10⁻⁸"],
          ["BaSO₄", "1.1 × 10⁻¹⁰"],
          ["CaCO₃", "3.3 × 10⁻⁹"]
        ]
      },
      stimulus_source: "CRC Handbook of Chemistry, Ksp at 25°C",
      options: [
        "Pb²⁺(aq) + SO₄²⁻(aq) — forms PbSO₄ (Ksp = 1.6 × 10⁻⁸)",
        "Ca²⁺(aq) + CO₃²⁻(aq) — forms CaCO₃ (Ksp = 3.3 × 10⁻⁹)",
        "Ba²⁺(aq) + SO₄²⁻(aq) — forms BaSO₄ (Ksp = 1.1 × 10⁻¹⁰)",
        "Ag⁺(aq) + Cl⁻(aq) — forms AgCl (Ksp = 1.8 × 10⁻¹⁰)"
      ],
      correct: 2,
      explanation: "The MOST insoluble compound has the LOWEST Ksp. BaSO₄ (Ksp = 1.1 × 10⁻¹⁰) has the lowest Ksp in this table, making it the most insoluble. Note: comparing Ksp values directly is only valid for compounds with the same stoichiometry (both BaSO₄ and AgCl are 1:1 salts). BaSO₄'s lower Ksp means fewer ions dissolve at equilibrium.",
      skill: "Unit 7: Solubility Equilibria",
      difficulty: "medium"
    },
    {
      question: "A molecular compound has the formula SF₄. Based on VSEPR theory, what is the electron geometry and molecular geometry?",
      options: [
        "Electron geometry: tetrahedral; Molecular geometry: tetrahedral",
        "Electron geometry: trigonal bipyramidal; Molecular geometry: see-saw",
        "Electron geometry: octahedral; Molecular geometry: square planar",
        "Electron geometry: trigonal planar; Molecular geometry: trigonal planar"
      ],
      correct: 1,
      explanation: "SF₄: S has 6 valence electrons, forms 4 bonds with F, leaving 1 lone pair on S. Total electron domains = 5 (4 bonded + 1 lone pair). VSEPR predicts trigonal bipyramidal electron geometry. The lone pair occupies an equatorial position (larger equatorial angles). With 4 bonded atoms and 1 lone pair: molecular geometry = see-saw (also called disphenoidal). Examples: SF₄, XeF₂ analogy helps remember the pattern.",
      skill: "Unit 2: Molecular Geometry — VSEPR",
      difficulty: "medium"
    },
    {
      question: "A reaction mechanism consists of two elementary steps:\nStep 1: A + B ⇌ AB (fast equilibrium)\nStep 2: AB + A → C + D (slow)\nWhich rate law is consistent with this mechanism?",
      options: [
        "Rate = k[A][B]",
        "Rate = k[A]²[B]",
        "Rate = k[AB][A]",
        "Rate = k[A][B]²"
      ],
      correct: 1,
      explanation: "The rate-determining step is Step 2: Rate = k₂[AB][A]. Since AB is an intermediate, we express its concentration from Step 1 equilibrium: Keq = [AB] / ([A][B]) → [AB] = Keq[A][B]. Substituting gives Rate = k₂ Keq [A]²[B] = k[A]²[B].",
      skill: "Unit 5: Kinetics",
      difficulty: "hard"
    },
    {
      question: "Which of the following element pairs will form a chemical bond with the HIGHEST degree of ionic character?",
      options: [
        "C and O",
        "Na and Cl",
        "Cs and F",
        "H and F"
      ],
      correct: 2,
      explanation: "Ionic character increases with a greater electronegativity difference between bonded atoms. Cesium (Cs) has the lowest electronegativity in this group, and Fluorine (F) has the highest electronegativity, yielding the largest electronegativity difference.",
      skill: "Unit 2: Molecular and Ionic Compound Structure and Properties",
      difficulty: "easy"
    }
  ],
  frq: [
    {
      title: "AP Chemistry FRQ — Thermodynamics and Spontaneity",
      prompt: "Answer the following questions about thermodynamics.",
      stimulus: "Consider the reaction: CaCO₃(s) → CaO(s) + CO₂(g)\nThermodynamic data at 298 K:\nΔH°f [CaCO₃(s)] = −1206.9 kJ/mol\nΔH°f [CaO(s)] = −635.1 kJ/mol\nΔH°f [CO₂(g)] = −393.5 kJ/mol\nS° [CaCO₃(s)] = 91.7 J/mol·K\nS° [CaO(s)] = 39.7 J/mol·K\nS° [CO₂(g)] = 213.8 J/mol·K",
      parts: [
        { label: "a", question: "Calculate ΔH° and ΔS° for this reaction at 298 K. Show all work.", points: 4, rubric: "2 pts ΔH°: products − reactants = (−635.1 + −393.5) − (−1206.9) = −1028.6 + 1206.9 = +178.3 kJ. 2 pts ΔS°: (39.7 + 213.8) − 91.7 = 253.5 − 91.7 = +161.8 J/mol·K (+0.1618 kJ/mol·K)." },
        { label: "b", question: "Calculate ΔG° at 298 K. Is this reaction spontaneous at room temperature? Explain.", points: 3, rubric: "1 pt: ΔG° = ΔH° − TΔS° = 178.3 − (298 × 0.1618) = 178.3 − 48.2 = +130.1 kJ/mol. 1 pt: Not spontaneous at 298 K (ΔG° > 0). 1 pt: The positive ΔH° (endothermic) dominates over the small TΔS° at room temperature." },
        { label: "c", question: "Calculate the minimum temperature at which this reaction becomes spontaneous. Explain what this temperature represents chemically.", points: 3, rubric: "1 pt: Set ΔG° = 0: T = ΔH°/ΔS° = 178,300 J ÷ 161.8 J/K = 1,102 K ≈ 829°C. 1 pt: Above 1102 K, the TΔS° term exceeds ΔH°, making ΔG° negative (spontaneous). 1 pt: Practically — this is the temperature needed for limestone decomposition in lime kilns (industrial CaO production)." }
      ]
    },
    {
      title: "AP Chemistry FRQ — Electrochemistry and Galvanic Cells",
      prompt: "A galvanic cell is constructed using a standard Zn/Zn²⁺ half-cell and a standard Cu/Cu²⁺ half-cell at 298 K.",
      stimulus: "E°(Zn²⁺/Zn) = −0.76 V; E°(Cu²⁺/Cu) = +0.34 V",
      parts: [
        { label: "a", question: "Write the balanced overall cell reaction and calculate E°cell for this galvanic cell.", points: 2, rubric: "1 pt: Reaction: Zn(s) + Cu²⁺(aq) → Zn²⁺(aq) + Cu(s). 1 pt: E°cell = E°cat − E°an = 0.34 V − (−0.76 V) = +1.10 V." },
        { label: "b", question: "Predict the effect on cell potential (Ecell) if [Zn²⁺] is increased to 2.0 M while [Cu²⁺] remains at 1.0 M. Justify using Le Châtelier's principle or the Nernst equation.", points: 2, rubric: "1 pt: Ecell decreases below 1.10 V. 1 pt: According to Nernst (E = E° − (RT/nF)ln Q), increasing product concentration [Zn²⁺] increases Q (Q = [Zn²⁺]/[Cu²⁺] > 1), which decreases Ecell." }
      ]
    }
  ]
};

// ─── AP World History V3 ──────────────────────────────────────────────────────
export const AP_WORLD_HISTORY_V3 = {
  mcq: [
    {
      question: "The graph shows world population growth from 1000 CE to 2000 CE. The MOST significant acceleration in growth visible in the 19th–20th centuries is BEST explained by:",
      chart_data: {
        type: "line",
        title: "World Population 1000–2000 CE (billions)",
        data: [
          { year: "1000", pop: 0.31 },
          { year: "1200", pop: 0.40 },
          { year: "1400", pop: 0.35 },
          { year: "1600", pop: 0.54 },
          { year: "1700", pop: 0.61 },
          { year: "1800", pop: 0.99 },
          { year: "1900", pop: 1.62 },
          { year: "1950", pop: 2.52 },
          { year: "2000", pop: 6.09 }
        ],
        x_key: "year",
        y_keys: ["pop"],
        x_label: "Year",
        y_label: "Population (billions)"
      },
      stimulus_source: "UN Population Division Historical Estimates, 2021",
      options: [
        "The Columbian Exchange introducing new crops that increased caloric availability globally",
        "Industrial Revolution improvements in medicine, sanitation, and agricultural productivity driving CDR decline while CBR remained high",
        "Mongol conquests that redistributed world population toward more productive agricultural zones",
        "Decline in the Black Death allowing European population to recover to 1347 levels"
      ],
      correct: 1,
      explanation: "The dramatic acceleration visible from 1800–2000 (0.99B to 6.09B) is primarily caused by the Industrial Revolution's impact: germ theory and improved sanitation dramatically reduced CDR; improved agricultural yields (mechanization, fertilizers, Green Revolution) reduced famine; modern medicine (vaccines, antibiotics) reduced infant/child mortality. The Columbian Exchange contributed to growth 1500–1800 but the 20th-century explosion is primarily an industrial/medical phenomenon.",
      skill: "Unit 5–6: Industrialization and Global Changes",
      difficulty: "medium"
    },
    {
      question: "The primary source excerpt BEST illustrates which argument about European imperialism in Africa?",
      stimulus: "\"We have a duty — a twofold duty — a duty to civilization and a duty to the African himself. The African continent is a vast treasure house of natural resources lying unused and undeveloped. It is for us, who have the knowledge and the capital and the enterprise, to develop these riches for the benefit of mankind. In doing so, we shall at the same time lift the African from his state of degradation, introduce him to the benefits of civilization, and make of him a productive member of human society.\"",
      stimulus_source: "British Colonial Secretary speech, c. 1895",
      stimulus_header: "Question 5 refers to the following primary source.",
      options: [
        "European imperialists were primarily motivated by humanitarian concerns for African welfare",
        "The 'civilizing mission' ideology was used to justify economic exploitation of African resources under a benevolent rhetorical framework",
        "British colonialism in Africa was primarily defensive — protecting trade routes from rival European powers",
        "Social Darwinism rejected the idea that African peoples could be 'elevated' through colonial contact"
      ],
      correct: 1,
      explanation: "This excerpt illustrates the 'civilizing mission' (mission civilisatrice) rhetoric that colonial powers used to legitimize resource extraction. The speaker simultaneously claims humanitarian motives ('lift the African from degradation') while revealing the economic motive ('vast treasure house... develop these riches'). Historians recognize this as ideological cover for imperialism — the 'dual mandate' of Lugard framing exploitation as uplift. Actual colonial policy prioritized resource extraction, not African welfare.",
      skill: "Unit 6: Imperialism and Responses",
      difficulty: "medium"
    },
    {
      question: "The table shows the ethnic and religious composition of four multi-ethnic states. Which country's demographic composition MOST closely resembles a situation likely to produce centrifugal pressures as described in AP World History themes?",
      table_data: {
        headers: ["Country", "Largest Ethnic Group (%)", "Major Religious Divide", "Official Language(s)"],
        rows: [
          ["Country A", "82%", "None significant", "1 official language"],
          ["Country B", "48%", "Sunni 60% vs. Shia 35%", "3 official languages"],
          ["Country C", "71%", "Christian 95%", "1 official language"],
          ["Country D", "98%", "Homogeneous", "1 official language"]
        ]
      },
      stimulus_source: "CIA World Factbook, 2022",
      options: [
        "Country A — dominant ethnic majority enables strong national cohesion",
        "Country B — significant ethnic minority + religious division + multiple official languages creates centrifugal pressures",
        "Country C — slight religious homogeneity prevents effective governance",
        "Country D — demographic uniformity eliminates all political competition"
      ],
      correct: 1,
      explanation: "Centrifugal forces pull states apart. Country B combines the most centrifugal factors: no ethnic majority, significant religious sectarian division (Sunni/Shia), and multiple official languages indicating linguistic diversity. This resembles Lebanon, Iraq, or Yugoslavia — states with overlapping ethnic, religious, and linguistic divisions that have experienced significant internal conflict and devolutionary pressures.",
      skill: "Unit 7: Political Geography",
      difficulty: "medium"
    },
    {
      question: "The Atlantic slave trade's most significant long-term demographic impact on West Africa was:",
      options: [
        "Complete depopulation of coastal zones, leaving interior regions overdeveloped",
        "Net population increase as trade goods enabled better nutrition and reduced famine",
        "Significant population loss and demographic distortion — particularly reduced male population — with lasting economic and political consequences",
        "Accelerated urbanization as trade networks concentrated populations in port cities"
      ],
      correct: 2,
      explanation: "Historians estimate 12–15 million Africans were enslaved and transported to the Americas (1500–1900). The slave trade disproportionately removed young adult males — the most economically productive population cohort — creating demographic imbalances. Scholars like Nathan Nunn have shown that regions most affected by the slave trade have persistently lower economic development, weaker state institutions, and lower social trust today. The trade also intensified internal African warfare as states raided neighbors to obtain enslaved people for sale.",
      skill: "Unit 4–5: Transatlantic Slave Trade",
      difficulty: "medium"
    },
    {
      question: "The map shows major overland and maritime trade routes of the 13th–15th centuries. Which conclusion is MOST directly supported by the pattern of trade routes shown?",
      map_description: "A world trade routes map covering 1200–1450 CE. The Silk Road overland route runs from Chang'an/Nanjing (China) west through Samarkand and Tabriz to Constantinople and Venice. A maritime Silk Road runs from Guangzhou (China) south through the Strait of Malacca, across the Indian Ocean to Calicut (India), Hormuz (Persian Gulf), and Aden (Red Sea), then to Cairo and Venice. The Trans-Saharan route connects Timbuktu and Mali Empire to Morocco and Cairo. The map labels: Mongol Empire territory (grey shading), Mamluk Egypt, Delhi Sultanate, Song/Yuan China, Italian city-states (Venice, Genoa). Key trade goods are annotated: silk and porcelain (East Asia), spices (Southeast Asia), cotton textiles (India), gold and ivory (West Africa), glass and silver (Europe).",
      stimulus_source: "Adapted from Janet Abu-Lughod, Before European Hegemony, 1989",
      options: [
        "European powers dominated world trade by controlling both overland and maritime routes",
        "The Islamic world (Muslim-majority states) occupied a central geographic position in global trade networks, connecting East Asian, African, South Asian, and European commerce",
        "Sub-Saharan Africa was completely isolated from world trade before European arrival",
        "Chinese commercial expansion had permanently replaced overland routes with maritime trade by 1300"
      ],
      correct: 1,
      explanation: "The map shows Muslim-majority states (Mamluk Egypt, Persian Gulf sultanates, Delhi Sultanate) serving as essential intermediaries in all major trade routes. The Indian Ocean trade network was dominated by Arab and Persian merchants; the Silk Road's western half ran through Muslim Central Asia and Persia; Trans-Saharan trade ran through Islamic North Africa. Abu-Lughod's 'world system before European hegemony' demonstrates that Islamic commercial networks integrated Eurasian and African commerce before European exploration.",
      skill: "Unit 3–4: Trade Networks",
      difficulty: "hard"
    },
    {
      question: "Meiji Japan's rapid industrialization after 1868 is BEST explained by which combination of factors?",
      options: [
        "Abundant natural resources including coal and iron deposits allowed self-sufficient industrialization",
        "American colonization of Japan forced technology transfer through unequal trade treaties",
        "A centralized state actively importing Western technology, sending students abroad, and restructuring society while preserving Japanese cultural identity",
        "Geographic isolation from European competition gave Japan time to develop independently"
      ],
      correct: 2,
      explanation: "The Meiji Restoration (1868) involved the Japanese state deliberately selecting and importing Western industrial, military, and administrative models — sending thousands of students to Europe and America (the Iwakura Mission), hiring Western technical experts (oyatoi gaikokujin), building railroads and industrial plants, adopting Western legal codes — while explicitly framing this as 'Western learning, Japanese spirit' (wakon yōsai) to preserve national identity. This top-down state-led modernization successfully avoided colonization unlike contemporaneous China.",
      skill: "Unit 6: Industrialization — Non-European Examples",
      difficulty: "medium"
    },
    {
      question: "Which of the following BEST explains why the Cold War remained 'cold' (avoiding direct military conflict between the US and USSR) despite intense ideological rivalry?",
      options: [
        "Both superpowers agreed in secret diplomatic protocols to avoid direct warfare",
        "Mutual Assured Destruction (MAD) — both possessed sufficient nuclear weapons to destroy civilization, making direct conflict irrational",
        "The United Nations Security Council veto system prevented either power from declaring war",
        "Economic interdependence through trade created incentives against warfare"
      ],
      correct: 1,
      explanation: "MAD doctrine emerged as both the US and USSR developed massive nuclear arsenals capable of second-strike retaliation. Rational calculation suggested neither could 'win' a nuclear exchange — mutual annihilation would result. This nuclear deterrence paradox — the threat of total destruction prevented total war. Proxy wars (Korea, Vietnam, Afghanistan) allowed competition without direct superpower confrontation. The Cuban Missile Crisis (1962) brought the world closest to a nuclear exchange, demonstrating MAD's precariousness.",
      skill: "Unit 8: Cold War",
      difficulty: "easy"
    },
    {
      question: "The economic chart shows GDP per capita for four countries from 1960–2000. Country X shows rapid growth from ~$1,500 to ~$25,000 over 40 years. Based on this pattern, Country X MOST likely represents which development trajectory?",
      chart_data: {
        type: "line",
        title: "GDP per Capita (PPP $) — Four Countries, 1960–2000",
        data: [
          { year: "1960", country_x: 1500, country_y: 12000, country_z: 400, country_w: 800 },
          { year: "1970", country_x: 3200, country_y: 14500, country_z: 500, country_w: 900 },
          { year: "1980", country_x: 7800, country_y: 17000, country_z: 550, country_w: 1100 },
          { year: "1990", country_x: 15000, country_y: 22000, country_z: 600, country_w: 1200 },
          { year: "2000", country_x: 25000, country_y: 35000, country_z: 700, country_w: 1800 }
        ],
        x_key: "year",
        y_keys: ["country_x", "country_y", "country_z", "country_w"],
        x_label: "Year",
        y_label: "GDP per Capita (PPP $)"
      },
      stimulus_source: "World Bank, 2021",
      options: [
        "Country X is Sub-Saharan Africa — modest but consistent growth",
        "Country X is the United States — maintaining high GDP throughout",
        "Country X is an East Asian Tiger economy (e.g., South Korea or Taiwan) — rapid export-led industrialization",
        "Country X is Latin America — commodity-dependent growth with periodic stagnation"
      ],
      correct: 2,
      explanation: "South Korea's GDP per capita rose from ~$1,560 (1960) to ~$17,200 (2000) — one of the most dramatic economic ascents in history. The 'East Asian Tiger' economies (South Korea, Taiwan, Hong Kong, Singapore) achieved rapid export-led industrialization through state investment in education, strategic industrial policy, and integration into global manufacturing chains. Country Y's consistently high GDP ($12,000–$35,000) resembles a developed Western economy.",
      skill: "Unit 8: Decolonization and Development",
      difficulty: "medium"
    },
    {
      question: "Which of the following BEST describes the 'Green Revolution' of the 1960s–1970s and its impact on developing nations?",
      options: [
        "A purely environmental movement that shifted agricultural land to organic farming practices",
        "The introduction of high-yield seed varieties, chemical fertilizers, and irrigation technology that dramatically increased food production in Asia and Latin America, reducing famine but creating new inequalities",
        "A wave of land reform programs redistributing land from large estates to peasant farmers throughout Latin America",
        "The mechanization of agriculture that eliminated the need for rural labor, enabling industrialization"
      ],
      correct: 1,
      explanation: "The Green Revolution (Norman Borlaug's high-yield wheat; IRRI rice varieties) dramatically increased grain yields in India, Mexico, and Southeast Asia through hybridized seeds, fertilizers, pesticides, and irrigation. It prevented predicted famines and increased food security. However, critics note: it favored wealthier farmers who could afford inputs; increased inequality; created water overuse and soil degradation; and reduced agricultural biodiversity. India's wheat production tripled 1965–1985.",
      skill: "Unit 8: Global Changes",
      difficulty: "medium"
    },
    {
      question: "The decolonization wave of the 1950s–1960s in Africa and Asia was MOST directly accelerated by which combination of factors?",
      options: [
        "European voluntary withdrawal due to the economic burden of maintaining colonies",
        "WWII weakening European powers, rising nationalist movements, Cold War pressure, and UN self-determination principles",
        "Soviet military support enabling colonial populations to overthrow European armies",
        "Economic sanctions imposed by the United States against colonial powers"
      ],
      correct: 1,
      explanation: "Decolonization resulted from converging factors: WWII devastated European economies and moral authority (How could colonial powers claim democratic values while maintaining colonies?). Nationalist movements strengthened — Indian National Congress, Kwame Nkrumah's CPP in Ghana, Algerian FLN. The Cold War pressured both superpowers to oppose formal colonialism (for different reasons: US anti-colonialism ideology; USSR encouraging anti-colonial movements). UN Charter Article 1 affirmed self-determination as a fundamental right.",
      skill: "Unit 8: Decolonization",
      difficulty: "medium"
    },
    {
      question: "Which of the following BEST describes the primary ideological motivation behind the Non-Aligned Movement established during the 1955 Bandung Conference?",
      options: [
        "To promote economic integration through regional free-trade zones in South America and Africa",
        "To maintain neutrality and autonomy from both US-led capitalist and Soviet-led communist blocs during the Cold War",
        "To demand the re-establishment of colonial administrative boundaries across post-colonial borders",
        "To establish a worldwide military alliance aimed at containing European imperial revival"
      ],
      correct: 1,
      explanation: "The Non-Aligned Movement (NAM), spearheaded by leaders like Nehru (India), Sukarno (Indonesia), and Nkrumah (Ghana) at Bandung in 1955, sought to chart an independent course for newly independent nations rather than joining NATO or the Warsaw Pact.",
      skill: "Unit 8: Cold War and Decolonization",
      difficulty: "medium"
    },
    {
      question: "The Columbian Exchange introduced American staple crops like potatoes, maize, and cassava to Afro-Eurasia. The MOST direct global demographic outcome of this biological exchange was:",
      options: [
        "A sudden collapse of urban populations across Asia due to agricultural displacement",
        "Significant long-term global population growth due to higher caloric yields per acre of land",
        "Immediate widespread famines across Western Europe caused by invasive plant diseases",
        "An absolute decline in African agricultural output as traditional grains were abandoned"
      ],
      correct: 1,
      explanation: "American crops like potatoes, maize, and cassava yielded significantly higher calories per acre than native Eurasian/African grains, fueling sustained demographic expansion across Europe, China, and Africa during the early modern era.",
      skill: "Unit 4: Transoceanic Interconnections",
      difficulty: "easy"
    }
  ],
  frq: [
    {
      title: "AP World History FRQ — Silk Road and Trade Networks, 600–1450 CE",
      prompt: "Evaluate the extent to which the Silk Road trade networks transformed societies across Eurasia between 600 and 1450 CE.",
      stimulus: "Consider changes and continuities in the following areas: goods traded, spread of disease and religion, role of merchant classes, and political control of trade routes.",
      parts: [
        { label: "a", question: "Describe TWO specific goods or commodities traded along the Silk Road and explain the significance of each to at least one society involved in the exchange.", points: 4, rubric: "2 pts each: (1 pt: names specific good; 1 pt: explains significance). Silk (China → West: status symbol, diplomatic gift, currency equivalent in Byzantine trade); spices (Southeast Asia/India → Middle East/Europe: food preservation, medical use, high value per weight); paper/printing (China → Islam/Europe: intellectual revolution, enabled book production, administration); plague (disease pathway 1340s, devastating mortality from Central Asia to Europe via Mongol postal system)." },
        { label: "b", question: "Explain how the Mongol Empire (1206–1368) BOTH facilitated AND disrupted Silk Road trade. Use specific evidence.", points: 4, rubric: "2 pts facilitated: Pax Mongolica — secured overland routes; reduced tolls within empire; Yam postal relay system; safe-conduct passes; encouraged merchant travel (Marco Polo, Ibn Battuta enabled). 2 pts disrupted: Mongol conquests destroyed Baghdad (1258), Samarkand, and agricultural infrastructure; bubonic plague spread via Mongol networks; fragmentation after 1350 disrupted security." },
        { label: "c", question: "To what extent was the Silk Road a 'road of religions'? Explain how at least TWO religions spread via trade networks.", points: 2, rubric: "1 pt each religion: Buddhism: spread from India to Central Asia, China, Japan via merchant networks and Buddhist monasteries along trade routes; Islam: Arab Muslim merchants spread Islam to Southeast Asia, West Africa via Indian Ocean and Trans-Saharan routes; Christianity (Nestorian): spread to Central Asia and China; each should explain the mechanism (merchant travel, diaspora communities, patronage)." }
      ]
    },
    {
      title: "AP World History FRQ — State Building and Land-Based Empires (1450–1750)",
      prompt: "Evaluate the extent to which land-based empires utilized bureaucratic methods and military elites to consolidate power between 1450 and 1750 CE.",
      stimulus: "Consider examples such as the Ottoman Empire, Safavid Empire, Mughal Empire, or Qing Dynasty China.",
      parts: [
        { label: "a", question: "Describe ONE specific administrative method or institution used by a land-based empire between 1450 and 1750 to collect revenue or maintain centralized control.", points: 2, rubric: "1 pt: Identifies institution (e.g., Ottoman Devshirme system / Janissaries, Mughal Zamindar system, Qing civil service exams). 1 pt: Explains how it strengthened central imperial authority." },
        { label: "b", question: "Explain ONE way in which rulers used monumental architecture or religious patronage to legitimize their imperial rule between 1450 and 1750.", points: 2, rubric: "1 pt: Identifies example (e.g., Mughal Taj Mahal, Ottoman Suleymaniye Mosque, Qing Temple of Heaven). 1 pt: Explains how the structure projected divine sanction, wealth, or imperial power." }
      ]
    }
  ]
};
