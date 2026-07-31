// ─── AP Premade Question Bank ─────────────────────────────────────────────────
// Based on official AP Classroom style questions, publicly released exams,
// and College Board curriculum frameworks. Multiple versions per subject.

// Each question: { question, stimulus, stimulus_source, stimulus_header,
//   options[4], correct(0-3), explanation, skill, difficulty,
//   table_data|chart_data|map_description (optional) }

// ─── AP Human Geography ───────────────────────────────────────────────────────
const AP_HUMAN_GEO_V1 = {
  mcq: [
    {
      question: "Based on the data in the table, which country is MOST likely in Stage 4 of the Demographic Transition Model?",
      stimulus_header: "Questions 1–3 refer to the following demographic data table.",
      stimulus_source: "UN World Population Prospects, 2022",
      table_data: {
        headers: ["Country", "CBR (per 1,000)", "CDR (per 1,000)", "TFR", "% Urban"],
        rows: [
          ["Niger", "45", "9", "6.9", "17"],
          ["India", "18", "7", "2.1", "36"],
          ["Germany", "9", "12", "1.6", "77"],
          ["Brazil", "14", "6", "1.7", "87"],
        ]
      },
      options: [
        "Niger, because its high CBR indicates early industrialization",
        "India, because its TFR has just reached replacement level",
        "Germany, because its CDR exceeds its CBR, suggesting natural decrease",
        "Brazil, because its high urbanization drives fertility decline"
      ],
      correct: 2,
      explanation: "Stage 4 of the DTM is characterized by low birth rates AND low death rates, often with CDR approaching or exceeding CBR. Germany's CDR (12) exceeds its CBR (9), indicating natural decrease — a hallmark of Stage 4/5. Niger (Stage 2), India (Stage 3), and Brazil (late Stage 3/early 4) don't fit as precisely.",
      skill: "Unit 2: Population & Migration Patterns",
      difficulty: "medium"
    },
    {
      question: "Which of the following BEST explains the pattern shown in the map?",
      stimulus_header: "Question 2 refers to the following map description.",
      map_description: "A choropleth map of South Asia and Southeast Asia displaying total fertility rates (TFR) by country in 2022. Afghanistan and Timor-Leste show the darkest shading (TFR > 4.5). India shows medium shading (TFR ~2.1). Thailand, Singapore, and South Korea show the lightest shading (TFR < 1.5). Countries are labeled. A legend indicates: dark = high TFR, light = low TFR.",
      stimulus_source: "World Bank Development Indicators, 2022",
      options: [
        "Countries with high TFRs are exclusively located in landlocked regions",
        "Higher levels of economic development and women's education correlate with lower TFRs",
        "TFR is primarily determined by a country's dominant religion",
        "Coastal access universally leads to lower fertility rates through trade exposure"
      ],
      correct: 1,
      explanation: "The most robust explanation for spatial variation in TFR is the correlation with Human Development Index (HDI) components — particularly women's education levels and economic opportunity. Singapore and South Korea's very low TFRs reflect high GDP per capita and near-universal female tertiary education. Afghanistan's high TFR correlates with low female literacy and limited economic development.",
      skill: "Unit 2: Population & Migration Patterns",
      difficulty: "medium"
    },
    {
      question: "The gravity model of migration would predict the GREATEST migration flow between which pair of cities?",
      options: [
        "A city of 500,000 and a city of 200,000 located 50 km apart",
        "A city of 5,000,000 and a city of 3,000,000 located 800 km apart",
        "A city of 1,000,000 and a city of 1,000,000 located 100 km apart",
        "A city of 500,000 and a city of 500,000 located 200 km apart"
      ],
      correct: 2,
      explanation: "The gravity model calculates interaction as (P1 × P2) / distance². Option C: (1M × 1M) / 100² = 1,000,000,000,000 / 10,000 = 100,000,000. Option A: (500K × 200K) / 50² = 100,000,000,000 / 2,500 = 40,000,000. Option B: (5M × 3M) / 800² = 15,000,000,000,000 / 640,000 = 23,437,500. Option C yields the highest interaction value.",
      skill: "Unit 2: Population & Migration Patterns",
      difficulty: "hard"
    },
    {
      question: "A city exhibits a pattern where low-income residents live in the inner ring surrounding the CBD, middle-income residents in a transitional zone, and high-income residents in outer suburbs. Which urban model BEST describes this pattern?",
      options: [
        "Harris and Ullman Multiple Nuclei Model",
        "Hoyt Sector Model",
        "Burgess Concentric Zone Model",
        "Latin American City Model (Griffin-Ford)"
      ],
      correct: 2,
      explanation: "The Burgess Concentric Zone Model describes cities as a series of rings expanding outward from the CBD, with a Zone of Transition (low-income/industrial), then working-class, middle-class, and commuter zones. This matches the described pattern. Hoyt's Sector Model shows wedge-shaped sectors along transportation routes. The Multiple Nuclei Model has multiple nodes. Griffin-Ford applies to Latin American cities with a different internal structure.",
      skill: "Unit 7: Cities and Urban Land Use Patterns",
      difficulty: "medium"
    },
    {
      question: "The map shows manufacturing output shifting from the US Rust Belt to southern states and Mexico between 1970–2010. This pattern BEST illustrates which geographic concept?",
      map_description: "A flow map of North America showing manufacturing jobs (represented by proportional arrows) moving from states including Michigan, Ohio, Pennsylvania, and Indiana southward to Alabama, Tennessee, Texas, and into northern Mexico (Monterrey, Ciudad Juárez). Arrows are thickest for Michigan–Alabama and Ohio–Mexico flows. A legend indicates arrow width proportional to job count (thousands).",
      stimulus_source: "Bureau of Labor Statistics, 2012",
      options: [
        "Counterurbanization driven by urban push factors",
        "Least cost theory and the search for lower labor costs (deindustrialization)",
        "Core-periphery model reversal as the periphery develops industrial capacity",
        "Bid-rent theory applied to manufacturing land use decisions"
      ],
      correct: 1,
      explanation: "Alfred Weber's least cost theory predicts firms locate to minimize transportation, labor, and agglomeration costs. As union wages rose in the US Rust Belt and right-to-work laws reduced labor costs in southern states and NAFTA opened Mexican labor markets, manufacturing relocated. This is textbook deindustrialization driven by Weber's labor cost considerations, not counterurbanization (a residential phenomenon) or bid-rent (an intra-urban model).",
      skill: "Unit 11: Industrialization and Economic Development",
      difficulty: "hard"
    },
    {
      question: "According to Von Thünen's model, which agricultural activity would MOST likely be found in the outermost ring, farthest from the central market?",
      options: [
        "Market gardening and dairy farming",
        "Intensive crop farming requiring frequent transport",
        "Extensive livestock ranching on large land areas",
        "Forestry for construction materials and fuel"
      ],
      correct: 2,
      explanation: "Von Thünen's model organizes agriculture by transportation cost and land rent. The innermost ring contains dairy/market gardening (perishable, high transport cost). Moving outward: forestry (heavy/bulky), field crops (grain), then livestock ranching (animals walk to market, low transport cost per unit value). Ranching occupies the outermost ring because low land costs offset distance, and animals are self-transporting.",
      skill: "Unit 5: Agriculture and Rural Land Use",
      difficulty: "medium"
    },
    {
      question: "The data in the chart BEST support which conclusion about Sub-Saharan African urbanization?",
      stimulus_header: "Question 7 refers to the following chart.",
      chart_data: {
        type: "bar",
        title: "Urban Population Growth Rate vs. Economic Growth Rate (% annual) — Sub-Saharan Africa, 2000–2020",
        data: [
          { period: "2000-05", urbanization: 4.2, gdp_growth: 4.0 },
          { period: "2005-10", urbanization: 4.5, gdp_growth: 5.8 },
          { period: "2010-15", urbanization: 4.3, gdp_growth: 4.2 },
          { period: "2015-20", urbanization: 4.4, gdp_growth: 2.9 }
        ],
        x_key: "period",
        y_keys: ["urbanization", "gdp_growth"],
        x_label: "Period",
        y_label: "Annual Growth Rate (%)"
      },
      stimulus_source: "World Bank, 2021",
      options: [
        "Urbanization in Sub-Saharan Africa is entirely driven by rural economic development",
        "Urban growth rates consistently exceed GDP growth rates, suggesting urbanization without equivalent economic development",
        "GDP growth reliably predicts urbanization rates with a 5-year lag",
        "Urbanization rates declined as GDP growth slowed after 2015"
      ],
      correct: 1,
      explanation: "In 2015–2020, urbanization (4.4%) significantly exceeded GDP growth (2.9%), and this pattern of urban growth outpacing economic growth appears across periods. This is characteristic of 'overurbanization' — a phenomenon common in Sub-Saharan Africa where rural push factors (drought, conflict, land scarcity) drive urban migration faster than formal urban economies can absorb workers.",
      skill: "Unit 7: Cities and Urban Land Use Patterns",
      difficulty: "hard"
    },
    {
      question: "Which of the following represents an example of a centripetal force within a nation-state?",
      options: [
        "Regional dialects that prevent national communication",
        "A federal system that grants autonomous powers to ethnic regions",
        "A shared national language used in schools, media, and government",
        "Separatist movements demanding independence for minority populations"
      ],
      correct: 2,
      explanation: "Centripetal forces bind a state together and promote national unity. A shared national language (like English in the US or Swahili in Tanzania) is a classic centripetal force — enabling communication, shared media, and national identity formation. Centrifugal forces (regional dialects, autonomy demands, separatism) pull states apart.",
      skill: "Unit 4: Political Patterns and Processes",
      difficulty: "easy"
    },
    {
      question: "The table shows land use data for an agricultural region. Which crop arrangement is MOST consistent with the principles of Bid-Rent Theory?",
      table_data: {
        headers: ["Distance from City Center (km)", "Primary Land Use", "Avg. Land Value ($/acre)"],
        rows: [
          ["0–5", "Commercial/CBD", "$85,000"],
          ["5–15", "Intensive vegetables & dairy", "$8,500"],
          ["15–40", "Grain crops (wheat, corn)", "$2,200"],
          ["40–80", "Cattle ranching", "$450"],
          ["80+", "Extensive sheep grazing", "$120"]
        ]
      },
      stimulus_source: "USDA Agricultural Land Values Survey, 2020",
      options: [
        "The data contradict bid-rent theory because land values are too variable",
        "Land values and intensity of use decline with distance, consistent with bid-rent theory",
        "Cattle ranching should be closer to the city center than grain farming",
        "The pattern shows that all agricultural uses bid equally for land"
      ],
      correct: 1,
      explanation: "Bid-rent theory predicts that different land uses can afford to pay decreasing rents as distance from the urban core increases, with the highest-value users (commercial) outbidding others near the center. The table perfectly illustrates this: intensive uses (vegetables, dairy) near the city at high land values, transitioning to extensive uses (ranching) at low values far from center.",
      skill: "Unit 5: Agriculture and Rural Land Use",
      difficulty: "medium"
    },
    {
      question: "A geographer studying language diffusion would MOST likely classify the spread of English through former British colonies as an example of:",
      options: [
        "Relocation diffusion through voluntary migration of English speakers",
        "Contagious diffusion spreading uniformly from a British hearth",
        "Hierarchical diffusion imposed through colonial political and educational structures",
        "Stimulus diffusion adapting British linguistic elements to local contexts"
      ],
      correct: 2,
      explanation: "Hierarchical diffusion occurs when a trait spreads from positions of power or authority downward. British colonialism imposed English through administrative systems, schools, courts, and media — not through voluntary migration or uniform neighbor-to-neighbor spread. While relocation diffusion occurred to a degree with settlers, the primary mechanism was top-down colonial imposition.",
      skill: "Unit 3: Cultural Patterns and Processes",
      difficulty: "medium"
    }
  ],
  frq: [
    {
      title: "AP Human Geography FRQ — Urban Models and Development",
      prompt: "Use the following data and your knowledge of AP Human Geography to answer all parts of the question.",
      stimulus: "A rapidly growing city in Nigeria (population: 3.2 million, growing at 4.1% annually) is experiencing severe urban challenges. Recent satellite imagery shows informal settlements (slums) occupying 45% of the urban footprint, concentrated in the inner ring surrounding the traditional CBD. A new expressway connects the CBD to affluent suburbs 25 km away. The city has attracted a new electronics manufacturing plant in a special economic zone (SEZ) 18 km from the CBD.",
      parts: [
        {
          label: "a",
          question: "Identify ONE urban model and explain how it applies to the city described. Use specific evidence from the description to support your answer.",
          points: 2,
          rubric: "1 pt: Correctly identifies a model (e.g., Concentric Zone Model, Latin American City Model, or multiple nuclei). 1 pt: Accurately links model features to specific evidence from the description (informal settlements in inner ring, affluent suburbs with expressway access, SEZ as secondary nucleus)."
        },
        {
          label: "b",
          question: "Explain TWO reasons why rapid urbanization in Sub-Saharan African cities like this one often produces informal settlements rather than formal housing. Reference specific push and pull factors.",
          points: 4,
          rubric: "2 pts each (1 pt: identifies rural push or urban pull factor; 1 pt: explains mechanism linking factor to informal settlement formation). Acceptable: rural drought/conflict → sudden influx exceeds formal housing supply; wage gap → migrants cannot afford formal housing; planning capacity lagging behind growth rate."
        },
        {
          label: "c",
          question: "Explain how the new special economic zone (SEZ) 18 km from the CBD reflects the principles of either Weber's Least Cost Theory or Rostow's Stages of Economic Growth. Use geographic reasoning to connect the SEZ to the broader development context of the city.",
          points: 3,
          rubric: "1 pt: Correctly names and defines Weber's or Rostow's framework. 1 pt: Applies the framework to the SEZ location or function (e.g., SEZ reduces labor costs = Weber; SEZ represents take-off stage = Rostow). 1 pt: Connects to the broader development context (e.g., Nigeria using SEZs to attract FDI as part of a structural shift from primary to secondary sector)."
        }
      ]
    }
  ]
};

const AP_HUMAN_GEO_V2 = {
  mcq: [
    {
      question: "The graph shows population pyramids for two countries in 2020. Country A has a wide base that narrows sharply at age 15, while Country B has a relatively uniform width from age 0–50, narrowing only above age 65. Which conclusion is BEST supported by these pyramids?",
      stimulus_header: "Question 1 refers to the following population pyramid descriptions.",
      map_description: "Two side-by-side population pyramids. Country A (left): Wide base at ages 0–4 (male 8.2%, female 7.9%), sharp narrowing at 15–19 (male 5.1%, female 4.8%), very narrow above 50. Country B (right): Uniform width from 0–4 (male 2.8%, female 2.6%) through 45–49 (male 3.1%, female 3.3%), narrowing noticeably only above 65. Both pyramids labeled with age groups 0-4 through 75+.",
      stimulus_source: "UN Population Division, 2020",
      options: [
        "Country A has a higher dependency ratio and faces challenges from aging population",
        "Country B is in Stage 2 of the DTM and experiencing rapid population growth",
        "Country A is in an early DTM stage with high youth dependency; Country B shows slow or negative growth",
        "Country B's pyramid indicates higher infant mortality than Country A"
      ],
      correct: 2,
      explanation: "Country A's wide base with sharp narrowing indicates high birth rates but also high child/youth mortality — characteristic of Stage 2 of the DTM (high birth rates, declining death rates). High youth dependency ratio results. Country B's uniform distribution with narrowing only at older ages indicates low birth and death rates, slow natural increase — consistent with Stage 4 (possibly nearing Stage 5).",
      skill: "Unit 2: Population & Migration Patterns",
      difficulty: "hard"
    },
    {
      question: "Wallerstein's World Systems Theory would classify the following countries in which way?",
      table_data: {
        headers: ["Country", "Primary Export", "GDP per Capita (PPP)", "Manufacturing % GDP"],
        rows: [
          ["United States", "High-tech goods, services", "$65,000", "18%"],
          ["Democratic Republic of Congo", "Cobalt, copper ore", "$1,100", "6%"],
          ["Mexico", "Auto parts, electronics", "$21,000", "31%"],
          ["Bangladesh", "Garments (low-wage)", "$5,600", "28%"]
        ]
      },
      stimulus_source: "World Bank, 2021",
      options: [
        "USA = core; DRC = periphery; Mexico = semi-periphery; Bangladesh = semi-periphery",
        "USA = core; DRC = periphery; Mexico = semi-periphery; Bangladesh = periphery",
        "USA = core; DRC = semi-periphery; Mexico = periphery; Bangladesh = periphery",
        "USA = semi-periphery; DRC = periphery; Mexico = core; Bangladesh = semi-periphery"
      ],
      correct: 1,
      explanation: "Core countries (USA) dominate high-value production and services. Periphery countries (DRC) export raw materials at low prices. Semi-periphery countries (Mexico) have mixed roles — significant manufacturing but dependent on core investment. Bangladesh, despite manufacturing, operates at the lowest-wage end of global supply chains with minimal value-added, placing it in the periphery.",
      skill: "Unit 11: Industrialization and Economic Development",
      difficulty: "hard"
    },
    {
      question: "A country's fertility rate drops from 5.2 to 1.8 over 30 years as GDP per capita increases from $800 to $12,000. This relationship MOST directly illustrates:",
      options: [
        "The epidemiological transition replacing communicable diseases with chronic diseases",
        "The demographic dividend as a growing workforce boosts economic output",
        "Malthusian theory predicting population checks through preventive measures",
        "The relationship between economic development and falling birth rates described by the DTM"
      ],
      correct: 3,
      explanation: "The Demographic Transition Model predicts that as countries industrialize and per-capita income rises, birth rates fall (Stage 3→4 transition). This occurs through urbanization (children become economic liabilities), rising women's education/labor participation, and access to family planning. The scenario directly illustrates this Stage 3 transition.",
      skill: "Unit 2: Population & Migration Patterns",
      difficulty: "medium"
    },
    {
      question: "The map shows language family distributions across Africa. The large area covered by Bantu languages across sub-Saharan Africa BEST illustrates which concept?",
      map_description: "A language family map of Africa. The Afro-Asiatic family (green) dominates North Africa and the Horn. The Niger-Congo family, specifically Bantu languages (blue), covers a massive continuous area from Cameroon/Gabon southeast through the DRC, then east through Kenya/Tanzania, and south through Zimbabwe, Mozambique, to South Africa. The Nilo-Saharan family (orange) appears in isolated pockets in Sudan and East Africa. The Khoisan family (yellow) appears in small areas of southern Africa. Labels indicate major languages: Swahili (East Africa), Zulu (South Africa), Lingala (DRC).",
      stimulus_source: "Ethnologue: Languages of the World, 2022",
      options: [
        "Relocation diffusion of Bantu peoples from a West African hearth over millennia",
        "Hierarchical diffusion through colonial administrative language imposition",
        "Contagious diffusion spreading uniformly from multiple simultaneous origins",
        "Reverse hierarchical diffusion from rural periphery to urban centers"
      ],
      correct: 0,
      explanation: "The Bantu Expansion (c. 3000 BCE–1000 CE) represents one of history's largest migrations — Bantu-speaking farmers relocated from a hearth in present-day Cameroon/Nigeria and spread their languages through physical movement across sub-Saharan Africa. This is relocation diffusion: the people physically moved and brought their language with them. Colonial languages (French, English) spread hierarchically, but the pre-colonial Bantu pattern is relocation diffusion.",
      skill: "Unit 3: Cultural Patterns and Processes",
      difficulty: "hard"
    },
    {
      question: "Based on the data in the chart, which conclusion about global remittances is BEST supported?",
      chart_data: {
        type: "bar",
        title: "Top 5 Remittance-Receiving Countries as % of GDP, 2021",
        data: [
          { country: "Tonga", remittance_pct_gdp: 44 },
          { country: "Lebanon", remittance_pct_gdp: 38 },
          { country: "Tajikistan", remittance_pct_gdp: 34 },
          { country: "El Salvador", remittance_pct_gdp: 26 },
          { country: "Honduras", remittance_pct_gdp: 25 }
        ],
        x_key: "country",
        y_keys: ["remittance_pct_gdp"],
        x_label: "Country",
        y_label: "Remittances as % of GDP"
      },
      stimulus_source: "World Bank Migration and Development Brief, 2022",
      options: [
        "Large, developed economies rely most heavily on remittances for economic stability",
        "Small, economically fragile states with significant diaspora populations are most dependent on remittances",
        "Remittances universally decrease as a share of GDP as emigration increases",
        "Countries in the same geographic region share identical remittance dependency levels"
      ],
      correct: 1,
      explanation: "Tonga, Lebanon, Tajikistan, El Salvador, and Honduras share key characteristics: they are small or mid-sized economies with significant emigrant populations in wealthy destination countries (US, Gulf states, Russia). When remittances constitute 25–44% of GDP, the sending economy becomes dangerously dependent on diaspora income — a pattern reflecting high emigration relative to GDP size, not absolute remittance volume.",
      skill: "Unit 2: Population & Migration Patterns",
      difficulty: "medium"
    },
    {
      question: "A region's place names include 'Rio Grande,' 'San Francisco,' 'Los Angeles,' and 'Santa Fe.' These toponyms MOST likely reflect which cultural process?",
      options: [
        "Indigenous Nahuatl language survival in the post-colonial landscape",
        "French colonial imposition of Catholic religious place names",
        "Spanish colonial imposition and the cultural landscape left by colonialism",
        "Anglicization of Native American place names by early US settlers"
      ],
      correct: 2,
      explanation: "Spanish colonial toponyms (place names) across the American Southwest reflect the cultural imprint of Spanish colonialism (1540–1821). 'Rio' (river), 'San/Santa' (saint), 'Los/Las' (the) are Spanish language markers. This is the cultural landscape — the visible human imprint on the physical environment. The region was Spanish/Mexican territory before US annexation (Treaty of Guadalupe Hidalgo, 1848).",
      skill: "Unit 3: Cultural Patterns and Processes",
      difficulty: "easy"
    },
    {
      question: "Christaller's Central Place Theory would predict which of the following settlement patterns?",
      options: [
        "Cities grow randomly based on resource availability and founder decisions",
        "Larger cities have larger market areas and offer higher-order goods than smaller towns",
        "Settlement size is determined primarily by distance from navigable waterways",
        "All settlements of the same size offer identical goods regardless of location"
      ],
      correct: 1,
      explanation: "Christaller's Central Place Theory hierarchically organizes settlements. High-order central places (large cities) offer specialized goods/services (hospitals, universities, professional sports) that require large threshold populations and generate large ranges. Low-order places (villages) offer convenience goods (groceries, gas). This hierarchy means larger cities always offer a superset of goods available in smaller towns.",
      skill: "Unit 7: Cities and Urban Land Use Patterns",
      difficulty: "medium"
    },
    {
      question: "The table shows agricultural statistics for two regions. Which conclusion is MOST supported by the data?",
      table_data: {
        headers: ["Metric", "Iowa Corn Belt (USA)", "Ganges Plain (India)"],
        rows: [
          ["Farm size (avg. hectares)", "160", "1.4"],
          ["Mechanization rate", "98%", "22%"],
          ["Yield per hectare (tons)", "11.2", "2.8"],
          ["Labor per hectare (person-days)", "0.8", "42"],
          ["Irrigation rate", "15%", "65%"]
        ]
      },
      stimulus_source: "FAO Agricultural Database, 2020",
      options: [
        "The Iowa Corn Belt uses extensive agriculture while the Ganges Plain uses intensive agriculture",
        "The Ganges Plain is more productive per hectare than Iowa due to higher irrigation rates",
        "Iowa's mechanization produces higher yields per labor input while the Ganges Plain is labor-intensive",
        "Both regions practice subsistence agriculture at different scales"
      ],
      correct: 2,
      explanation: "Iowa's 98% mechanization and 0.8 person-days per hectare versus Ganges' 22% mechanization and 42 person-days per hectare shows a fundamental contrast: commercial extensive mechanized agriculture vs. intensive smallholder labor-intensive farming. Iowa has 4× higher yields per hectare due to mechanization, hybrid seeds, and inputs — but the Ganges Plain's yield per labor unit is clearly lower. Option A is partially correct (Iowa is extensive in land use but intensive in capital/technology).",
      skill: "Unit 5: Agriculture and Rural Land Use",
      difficulty: "hard"
    },
    {
      question: "Which of the following BEST describes the concept of 'sense of place' as used in human geography?",
      options: [
        "The precise GPS coordinates and administrative boundaries of a location",
        "The subjective human meanings, memories, and emotional attachments associated with a location",
        "The economic value and land rent assigned to a location by real estate markets",
        "The physical environmental characteristics that distinguish one location from another"
      ],
      correct: 1,
      explanation: "Sense of place refers to the subjective, experiential qualities that make a location meaningful to people — the memories, cultural practices, emotional bonds, and identities attached to a specific place. This is distinct from absolute location (GPS coordinates), land value (economic geography), or site characteristics (physical geography).",
      skill: "Unit 1: Thinking Geographically",
      difficulty: "easy"
    },
    {
      question: "The Sahel region of Africa has experienced increasing desertification since the 1970s. Geographers studying this region would MOST likely attribute this to which combination of factors?",
      options: [
        "Tectonic plate movement expanding the Sahara Desert southward through geological processes",
        "Climate change increasing aridity combined with overgrazing, deforestation, and agricultural pressure",
        "European colonial land grabs that forced indigenous farmers onto marginal lands",
        "Urbanization drawing population away from rural areas, reducing agricultural maintenance"
      ],
      correct: 1,
      explanation: "Desertification in the Sahel results from a complex interaction of physical and human factors. Reduced and variable rainfall (linked to climate variability and anthropogenic climate change) lowers soil moisture; simultaneously, population pressure drives overgrazing (especially cattle and goats removing vegetation cover), fuelwood collection, and expansion of cultivation onto marginal soils. Both are needed for the full explanation.",
      skill: "Unit 5: Agriculture and Rural Land Use",
      difficulty: "medium"
    }
  ],
  frq: [
    {
      title: "AP Human Geography FRQ — Migration and Political Geography",
      prompt: "Use your knowledge of AP Human Geography to answer all parts.",
      stimulus: "In 2015, over 1 million asylum seekers entered the European Union, primarily from Syria, Afghanistan, and Iraq, crossing the Aegean Sea from Turkey to Greece. This 'migration crisis' prompted Hungary to build a border fence, led to the reintroduction of border controls within the Schengen Area, and produced significant political polarization across EU member states. By 2020, EU irregular border crossings had declined to approximately 125,000 annually.",
      parts: [
        {
          label: "a",
          question: "Identify and explain TWO push factors that drove Syrians to flee to Europe in 2015. Be specific about conditions in Syria.",
          points: 4,
          rubric: "2 pts each (1 pt factor identification, 1 pt explanation): Civil war/violence/Assad regime bombing of civilian areas; collapse of economic infrastructure/destruction of livelihoods; UNHCR refugee camp conditions in Turkey/Jordan (secondary push); political persecution. Must be specific to Syrian context."
        },
        {
          label: "b",
          question: "Explain how the European Union's political geography made managing the 2015 migration crisis particularly challenging. Reference at least ONE specific EU treaty or agreement in your response.",
          points: 3,
          rubric: "1 pt: Identifies a specific framework (Schengen Agreement free movement; Dublin Regulation assigning responsibility to first-entry country; Frontex jurisdiction limits). 1 pt: Explains how it created challenges (e.g., Dublin places burden on Greece/Italy as entry points; Schengen open borders made containment difficult). 1 pt: Connects to the supranational vs. national sovereignty tension."
        },
        {
          label: "c",
          question: "Geographers argue that the decline in EU irregular crossings after 2016 reflects 'externalization' of border control. Define externalization and explain ONE way the EU used this approach to reduce migration flows.",
          points: 3,
          rubric: "1 pt: Defines externalization as shifting migration control to non-EU states or to the migrants' region of origin/transit. 1 pt: Specific example (EU-Turkey Deal March 2016 — Turkey agreed to accept returned migrants in exchange for €6B and visa liberalization; partnering with Libyan Coast Guard). 1 pt: Explains the geographic mechanism — deterrence moves the point of interception away from EU territory."
        }
      ]
    }
  ]
};

// ─── AP US History ────────────────────────────────────────────────────────────
const AP_US_HISTORY_V1 = {
  mcq: [
    {
      question: "The excerpt BEST supports which interpretation of the period immediately following the Civil War?",
      stimulus: "We have seen the last of negro supremacy in the South, and thank God for it. The negroes were duped by unscrupulous carpetbaggers from the North who used them as mere instruments for their own aggrandizement. The negro himself, as far as we can judge, is satisfied with his position and is willing to leave political affairs to the superior white race. The South will manage her own affairs in her own way.",
      stimulus_source: "Southern newspaper editorial, 1877 (following Hayes-Tilden Compromise)",
      stimulus_header: "Questions 1–2 refer to the following primary source excerpt.",
      options: [
        "Southern Democrats had accepted the Fourteenth and Fifteenth Amendments as legitimate constitutional changes",
        "The end of Reconstruction allowed white supremacist ideology to reassert control of Southern political narratives",
        "African Americans had voluntarily withdrawn from political participation after Reconstruction",
        "Northern Republicans successfully protected Black voting rights through federal enforcement"
      ],
      correct: 1,
      explanation: "This editorial from 1877 — the year of the Compromise of 1877 that ended Reconstruction — exemplifies the 'Lost Cause' narrative and white supremacist ideology that justified the systematic disenfranchisement of Black Southerners. The language ('negro supremacy,' 'superior white race') and timing confirm that Reconstruction's end enabled the reassertion of white political control. The framing is propagandistic, not reflective of Black preferences.",
      skill: "Period 5: Reconstruction and Its Aftermath",
      difficulty: "medium"
    },
    {
      question: "Which development MOST directly contributed to the conditions described in the excerpt in Question 1?",
      options: [
        "The Supreme Court's ruling in Plessy v. Ferguson (1896) establishing separate but equal doctrine",
        "The withdrawal of federal troops from the South following the Compromise of 1877",
        "The passage of the Civil Rights Act of 1866 guaranteeing equal citizenship",
        "The ratification of the Fifteenth Amendment guaranteeing voting rights regardless of race"
      ],
      correct: 1,
      explanation: "The Compromise of 1877, which resolved the disputed 1876 presidential election, resulted in Republicans accepting Hayes as president in exchange for withdrawing federal troops from the South. Without military enforcement of Reconstruction-era amendments, Southern Democratic governments (Redeemer governments) rapidly implemented Black Codes, poll taxes, literacy tests, and eventually Jim Crow laws that effectively nullified Black voting rights.",
      skill: "Period 5: Reconstruction and Its Aftermath",
      difficulty: "medium"
    },
    {
      question: "The chart shows US immigration data by region of origin from 1820–1920. The shift visible after 1880 BEST supports which historical argument?",
      chart_data: {
        type: "bar",
        title: "US Immigration by Region of Origin (thousands per decade)",
        data: [
          { decade: "1820-29", northwestern_europe: 128, southeastern_europe: 3, asia: 1, americas: 12 },
          { decade: "1850-59", northwestern_europe: 2450, southeastern_europe: 15, asia: 42, americas: 18 },
          { decade: "1880-89", northwestern_europe: 3500, southeastern_europe: 380, asia: 65, americas: 35 },
          { decade: "1900-09", northwestern_europe: 1910, southeastern_europe: 5750, asia: 155, americas: 380 },
          { decade: "1910-19", northwestern_europe: 1410, southeastern_europe: 3750, asia: 98, americas: 520 }
        ],
        x_key: "decade",
        y_keys: ["northwestern_europe", "southeastern_europe", "asia"],
        x_label: "Decade",
        y_label: "Immigrants (thousands)"
      },
      stimulus_source: "US Census Bureau Historical Statistics, 1976",
      options: [
        "US nativist sentiment was strongest during periods of lowest total immigration",
        "The shift from Northwestern to Southeastern European immigration fueled nativist campaigns and restrictive legislation",
        "Asian immigration remained the primary political concern throughout the 1880–1920 period",
        "Total immigration to the United States declined steadily throughout this period"
      ],
      correct: 1,
      explanation: "The dramatic rise of immigration from Southern and Eastern Europe (Italy, Russia, Austria-Hungary, Poland) after 1880 — visible in the data — fed nativist anxieties about racial composition and assimilation. This 'new immigration' from Catholic and Jewish communities fueled the American Protective Association, the Immigration Restriction League, and ultimately the Emergency Quota Act (1921) and Immigration Act of 1924, which used national origin quotas specifically designed to favor Northwestern Europeans.",
      skill: "Period 7: Emergence of Modern America",
      difficulty: "hard"
    },
    {
      question: "Madison's argument in Federalist No. 10 addressed the 'problem of faction' primarily by arguing that:",
      stimulus: "The smaller the society, the fewer probably will be the distinct parties and interests composing it; the fewer the distinct parties and interests, the more frequently will a majority be found of the same party; and the smaller the number of individuals composing a majority, and the smaller the compass within which they are placed, the more easily will they concert and execute their plans of oppression. Extend the sphere, and you take in a greater variety of parties and interests; you make it less probable that a majority of the whole will have a common motive to invade the rights of other citizens.",
      stimulus_source: "James Madison, Federalist No. 10, 1787",
      stimulus_header: "Question 4 refers to the following excerpt from Federalist No. 10.",
      options: [
        "A direct democracy would protect minority rights by giving all citizens equal voice",
        "A large republic would contain so many competing factions that no single faction could dominate",
        "A strong executive would prevent legislative factions from abusing power",
        "Religious institutions should have no role in government to prevent sectarian factions"
      ],
      correct: 1,
      explanation: "Madison's central argument in Federalist No. 10 was that a large republic (extended sphere) would better control factions than a small direct democracy. More geographic territory means more diverse interests, making it harder for any single faction to form a majority coalition capable of oppressing minorities. This argument provided the theoretical foundation for the Constitution's federal republic structure.",
      skill: "Period 3: Revolution and the New Nation",
      difficulty: "medium"
    },
    {
      question: "President Roosevelt's decision to use executive power to mediate the 1902 United Mine Workers strike MOST directly reflected which Progressive Era principle?",
      options: [
        "Laissez-faire economics trusting market forces to resolve labor disputes naturally",
        "Federal government responsibility to protect the public interest and regulate economic power",
        "Social Darwinism arguing that workers must compete without government protection",
        "States' rights doctrine limiting federal intervention in local labor matters"
      ],
      correct: 1,
      explanation: "When anthracite coal miners struck in 1902, threatening winter fuel shortages, TR threatened to seize the mines and ordered federal mediation — the first time a president actively sided with labor against capital, or at least insisted on fair arbitration. This reflected Progressive Era beliefs that government had an active responsibility to regulate capitalism in the public interest, rejecting laissez-faire and using executive power expansively.",
      skill: "Period 7: Emergence of Modern America",
      difficulty: "medium"
    },
    {
      question: "The table shows data about the United States economy during 1929–1933. These trends MOST directly challenged which prevailing economic ideology?",
      table_data: {
        headers: ["Year", "GDP (billions $)", "Unemployment Rate", "Bank Failures", "Dow Jones (year-end)"],
        rows: [
          ["1929", "$105.2", "3.2%", "659", "248"],
          ["1930", "$92.2", "8.7%", "1,350", "165"],
          ["1931", "$77.4", "15.9%", "2,293", "77"],
          ["1932", "$60.3", "23.6%", "1,453", "60"],
          ["1933", "$57.7", "24.9%", "4,000+", "99"]
        ]
      },
      stimulus_source: "US Bureau of Economic Analysis; FDIC Historical Statistics, 2000",
      options: [
        "Keynesian economics arguing for government deficit spending to stimulate demand",
        "Laissez-faire capitalism and classical economic theory predicting self-correcting markets",
        "Mercantilism advocating protectionist trade policies to accumulate gold reserves",
        "Social Gospel movement connecting economic prosperity to moral reform"
      ],
      correct: 1,
      explanation: "Classical economics held that markets were self-correcting — recessions would naturally heal through wage/price adjustments. The catastrophic sustained decline shown (GDP falling 45%, unemployment reaching 24.9% over four years, massive bank failures) directly challenged Say's Law and laissez-faire doctrine. The data's implication is that markets failed to self-correct, providing the empirical foundation for Keynesian intervention and the New Deal.",
      skill: "Period 8: The Great Depression and New Deal",
      difficulty: "medium"
    },
    {
      question: "Which of the following BEST explains why the Emancipation Proclamation of January 1, 1863, had a limited immediate practical effect on enslaved people?",
      options: [
        "The Proclamation required ratification by the Confederate states to take legal effect",
        "It applied only to Confederate-held states where the Union had no enforcement authority",
        "Lincoln lacked constitutional authority to free enslaved people in any state",
        "The Proclamation was immediately challenged and overturned by the Supreme Court"
      ],
      correct: 1,
      explanation: "The Emancipation Proclamation applied only to the Confederate states in rebellion — areas where the Union government had no actual administrative control. Border states (Kentucky, Missouri, Maryland, Delaware) and areas already under Union control (Tennessee, parts of Virginia) were explicitly exempted. This made it largely a war measure and propaganda tool, not a comprehensive emancipation — that required the 13th Amendment (1865).",
      skill: "Period 5: Civil War and Reconstruction",
      difficulty: "medium"
    },
    {
      question: "The Dawes Act of 1887 attempted to 'solve' the 'Indian problem' primarily through:",
      options: [
        "Recognizing tribal sovereignty and establishing permanent reservations with federal protection",
        "Forced removal of all remaining Native American tribes to territories west of the Mississippi",
        "Breaking up communal tribal landholdings into individual allotments to promote assimilation",
        "Granting citizenship to Native Americans in exchange for military service"
      ],
      correct: 2,
      explanation: "The Dawes Severalty Act divided communal reservation lands into individual 160-acre allotments assigned to Native American families, with 'surplus' reservation land opened to white settlement. The explicit goal was forced assimilation — eliminating tribal culture and collective identity by turning Native Americans into individual property-owning farmers in the American model. By 1934, Native Americans had lost approximately 90 million of their original 138 million acres.",
      skill: "Period 6: Gilded Age",
      difficulty: "medium"
    },
    {
      question: "Martin Luther King Jr.'s 'Letter from Birmingham Jail' (1963) was MOST directly a response to:",
      options: [
        "FBI Director J. Edgar Hoover's accusations that King was a Communist sympathizer",
        "Governor George Wallace's inauguration speech promising 'segregation forever'",
        "A statement by white Alabama clergymen calling civil rights demonstrations 'unwise and untimely'",
        "President Kennedy's reluctance to introduce federal civil rights legislation"
      ],
      correct: 2,
      explanation: "King wrote the Letter from Birmingham Jail in April 1963 in response to a public statement signed by eight white Birmingham clergymen ('A Call for Unity') that criticized the timing and methods of the Birmingham Campaign demonstrations. King addressed their concerns about civil disobedience, the urgency of action, and the role of the church — arguing that the 'wait' for gradual change had lasted 340 years.",
      skill: "Period 8: Post-WWII America and Civil Rights",
      difficulty: "medium"
    },
    {
      question: "The graph shows American public opinion on Vietnam War involvement from 1965–1973. The MOST accurate interpretation of the trend is:",
      chart_data: {
        type: "line",
        title: "Gallup Poll: 'Was it a mistake to send troops to Vietnam?' (% saying Yes)",
        data: [
          { year: "1965", pct_mistake: 24 },
          { year: "1966", pct_mistake: 35 },
          { year: "1967", pct_mistake: 46 },
          { year: "1968", pct_mistake: 53 },
          { year: "1969", pct_mistake: 58 },
          { year: "1970", pct_mistake: 61 },
          { year: "1971", pct_mistake: 61 },
          { year: "1973", pct_mistake: 60 }
        ],
        x_key: "year",
        y_keys: ["pct_mistake"],
        x_label: "Year",
        y_label: "% Saying 'Mistake'"
      },
      stimulus_source: "Gallup Organization Historical Polls, 1965–1973",
      options: [
        "American public opinion consistently supported the war effort throughout the conflict",
        "Opposition to the war grew steadily, crossing majority opposition by 1968",
        "The Tet Offensive in January 1968 caused opposition to fall from 53% to 35%",
        "Anti-war sentiment peaked immediately after the Gulf of Tonkin Resolution in 1964"
      ],
      correct: 1,
      explanation: "The data clearly shows public opposition growing from 24% (1965) to above 50% by 1968 — a majority. The Tet Offensive (January 1968) was a turning point: despite US military claiming progress, the massive coordinated attacks on South Vietnamese cities shocked Americans who believed the administration's optimistic reports. Walter Cronkite's editorial declaring the war a 'stalemate' following Tet is often cited as crystallizing this shift.",
      skill: "Period 8: Post-WWII America and Cold War",
      difficulty: "medium"
    }
  ],
  frq: [
    {
      title: "AP US History Document-Based Question — Reconstruction",
      prompt: "Evaluate the extent to which Reconstruction (1865–1877) succeeded in achieving its goals of racial equality and reintegrating the Confederate states.",
      stimulus: "Consider the following in your response: the passage and initial enforcement of the Reconstruction Amendments, the establishment of the Freedmen's Bureau, Black political participation during Radical Reconstruction, and the forces that led to Reconstruction's end.",
      parts: [
        {
          label: "a",
          question: "Describe TWO achievements of Reconstruction that advanced the goals of racial equality, providing specific evidence from the period 1865–1877.",
          points: 4,
          rubric: "2 pts each: (1 pt: identifies specific achievement; 1 pt: provides specific evidence). Examples: 14th Amendment equal protection/citizenship; 15th Amendment voting rights; Black officeholding (Hiram Revels, Joseph Rainey, 16 Black congressmen); Freedmen's Bureau established schools/hospitals; Black literacy rates increased from ~5% to ~20% by 1880."
        },
        {
          label: "b",
          question: "Explain TWO factors that undermined Reconstruction and prevented it from fully achieving racial equality.",
          points: 4,
          rubric: "2 pts each: Ku Klux Klan terrorism suppressing Black voting (Force Acts only partially effective); Supreme Court limiting 14th Amendment (Slaughterhouse Cases 1873, Civil Rights Cases 1883); Compromise of 1877 withdrawing federal troops; Congressional Republican fatigue with Southern resistance; economic panic of 1873 shifting Northern focus."
        },
        {
          label: "c",
          question: "Historians debate whether Reconstruction represents a 'splendid failure' (Du Bois) or a 'tragic era' (Dunning). Using specific evidence, explain which interpretation you find more persuasive and why.",
          points: 2,
          rubric: "1 pt: Takes a clear position with explicit acknowledgment of the other view. 1 pt: Supports position with at least one specific piece of evidence not used in parts a or b."
        }
      ]
    }
  ]
};

// ─── AP Biology ───────────────────────────────────────────────────────────────
const AP_BIOLOGY_V1 = {
  mcq: [
    {
      question: "The graph shows enzyme activity at different temperatures. Based on the data, which conclusion about enzyme structure BEST explains the pattern observed at temperatures above 45°C?",
      stimulus_header: "Questions 1–2 refer to the following enzyme activity data.",
      chart_data: {
        type: "line",
        title: "Enzyme Activity vs. Temperature for Human Salivary Amylase",
        data: [
          { temp_c: 10, activity: 12 },
          { temp_c: 20, activity: 35 },
          { temp_c: 30, activity: 68 },
          { temp_c: 37, activity: 100 },
          { temp_c: 40, activity: 88 },
          { temp_c: 45, activity: 45 },
          { temp_c: 50, activity: 15 },
          { temp_c: 60, activity: 2 }
        ],
        x_key: "temp_c",
        y_keys: ["activity"],
        x_label: "Temperature (°C)",
        y_label: "Relative Enzyme Activity (%)"
      },
      stimulus_source: "Adapted from standard biochemistry experimental data",
      options: [
        "Substrate concentration decreases at higher temperatures, reducing reaction rate",
        "High temperatures cause denaturation of the enzyme's tertiary structure, altering the active site",
        "Above 45°C, all substrate molecules have been consumed, limiting the reaction",
        "High temperatures increase activation energy, slowing the reaction"
      ],
      correct: 1,
      explanation: "The sharp decline above 45°C results from thermal denaturation — excessive heat disrupts the non-covalent bonds (hydrogen bonds, ionic bonds, hydrophobic interactions) maintaining the enzyme's 3D tertiary structure. This deforms the active site's specific shape, preventing substrate binding (induced fit disruption). This is irreversible for most enzymes. The initial increase from 10–37°C reflects increased molecular kinetic energy, not structural change.",
      skill: "Unit 3: Cellular Energetics — Enzyme Function",
      difficulty: "medium"
    },
    {
      question: "A researcher studying salivary amylase would MOST likely predict which result if the pH is changed from 7 to 2?",
      options: [
        "Activity increases because lower pH provides more hydrogen ions as cofactors",
        "Activity decreases because pH 2 denatures the enzyme by disrupting ionic bonds and H-bonds in its active site",
        "Activity remains constant because enzymes function identically across all pH levels",
        "Activity temporarily decreases then recovers as the enzyme adapts to the new pH"
      ],
      correct: 1,
      explanation: "Salivary amylase has an optimal pH of ~7. At pH 2, the highly acidic environment protonates key amino acid residues in the active site, disrupting ionic interactions and hydrogen bonds that maintain the enzyme's 3D structure and active site geometry. This is why food entering the stomach (pH 1.5–3.5) stops starch digestion — amylase is denatured by gastric acid.",
      skill: "Unit 3: Cellular Energetics — Enzyme Function",
      difficulty: "medium"
    },
    {
      question: "The table shows Hardy-Weinberg allele frequency data for a population. Which conclusion is SUPPORTED by the data?",
      table_data: {
        headers: ["Generation", "Allele A frequency (p)", "Allele a frequency (q)", "Observed AA freq.", "Expected AA freq. (p²)"],
        rows: [
          ["1", "0.70", "0.30", "0.490", "0.490"],
          ["2", "0.70", "0.30", "0.489", "0.490"],
          ["3", "0.70", "0.30", "0.491", "0.490"],
          ["4", "0.62", "0.38", "0.384", "0.384"],
          ["5", "0.55", "0.45", "0.302", "0.303"]
        ]
      },
      stimulus_source: "Simulated population genetics data",
      options: [
        "Generations 1–3 show evidence of natural selection acting on the A allele",
        "The population in generations 1–3 is in Hardy-Weinberg equilibrium, but allele frequencies change in generations 4–5, suggesting evolutionary forces are acting",
        "Generations 4–5 show evidence of a population bottleneck eliminating the A allele",
        "The population is violating Hardy-Weinberg equilibrium throughout all five generations"
      ],
      correct: 1,
      explanation: "Generations 1–3 show stable allele frequencies (p=0.70, q=0.30) and observed genotype frequencies matching expected (p² = 0.490), indicating Hardy-Weinberg equilibrium — no evolutionary forces are acting. The significant shift in generations 4–5 (p dropping from 0.70 to 0.55) indicates a violation of H-W equilibrium assumptions, suggesting natural selection, genetic drift, migration, or non-random mating is occurring.",
      skill: "Unit 8: Ecology and Population Genetics",
      difficulty: "hard"
    },
    {
      question: "During cellular respiration, the net ATP yield from glycolysis of one glucose molecule is:",
      options: [
        "38 ATP molecules",
        "36 ATP molecules",
        "2 ATP molecules",
        "4 ATP molecules"
      ],
      correct: 2,
      explanation: "Glycolysis (in the cytoplasm) produces 4 ATP via substrate-level phosphorylation but INVESTS 2 ATP in the energy investment phase, for a NET of 2 ATP per glucose. Additionally, 2 NADH and 2 pyruvate are produced. The 36–38 ATP total includes products from the Krebs cycle and oxidative phosphorylation in the mitochondria — not from glycolysis alone.",
      skill: "Unit 3: Cellular Energetics — Cellular Respiration",
      difficulty: "easy"
    },
    {
      question: "A plant cell placed in a hypertonic solution (high solute concentration) would MOST likely undergo which process?",
      options: [
        "Turgor — the cell swells due to water entering by osmosis",
        "Plasmolysis — the cell membrane pulls away from the cell wall as water exits by osmosis",
        "Lysis — the cell wall ruptures due to excessive osmotic pressure",
        "Active transport — the cell pumps solutes in to equalize concentration"
      ],
      correct: 1,
      explanation: "In a hypertonic solution, solute concentration outside the cell exceeds that inside. Water moves out by osmosis (from low solute/high water potential to high solute/low water potential). In plant cells, this causes the cytoplasm and vacuole to shrink, pulling the plasma membrane away from the rigid cell wall — this is plasmolysis. The cell wall prevents lysis; animal cells (no cell wall) would crenate instead.",
      skill: "Unit 2: Cell Structure and Function — Membrane Transport",
      difficulty: "easy"
    },
    {
      question: "The data table shows the results of an experiment testing the effect of substrate concentration on enzyme reaction rate. Which conclusion is BEST supported?",
      table_data: {
        headers: ["Substrate Conc. (mM)", "Reaction Rate (μmol/min)", "Notes"],
        rows: [
          ["0.5", "12", ""],
          ["1.0", "22", ""],
          ["2.0", "38", ""],
          ["4.0", "58", ""],
          ["8.0", "74", ""],
          ["16.0", "83", ""],
          ["32.0", "85", "Plateau approaching"],
          ["64.0", "86", "Maximum rate (Vmax)"]
        ]
      },
      stimulus_source: "Adapted from Michaelis-Menten enzyme kinetics experiment",
      options: [
        "Reaction rate increases linearly with substrate concentration at all concentrations tested",
        "The reaction rate plateaus at high substrate concentrations because all enzyme active sites are saturated",
        "The decline in rate increase at high concentrations indicates enzyme denaturation",
        "Substrate concentration has no effect on reaction rate above 8 mM"
      ],
      correct: 1,
      explanation: "This is classic Michaelis-Menten kinetics. At low substrate concentrations, adding more substrate greatly increases reaction rate (more substrate-enzyme collisions). As substrate increases, active sites become increasingly occupied. At Vmax (~86 μmol/min at 64 mM), all enzyme active sites are saturated — every active site is constantly occupied, and reaction rate is limited by the enzyme turnover rate, not substrate availability.",
      skill: "Unit 3: Cellular Energetics — Enzyme Kinetics",
      difficulty: "medium"
    },
    {
      question: "A cross between two heterozygous parents (Aa × Aa) produces 400 offspring. According to Mendelian genetics, approximately how many offspring would be expected to show the dominant phenotype?",
      options: [
        "100 offspring (25%)",
        "200 offspring (50%)",
        "300 offspring (75%)",
        "400 offspring (100%)"
      ],
      correct: 2,
      explanation: "Aa × Aa produces the ratio AA : 2Aa : aa = 1:2:1. Genotypically: 25% AA, 50% Aa, 25% aa. The dominant phenotype is expressed by both AA (homozygous dominant) and Aa (heterozygous) = 75% of offspring. 25% show the recessive phenotype (aa). 75% × 400 = 300 offspring expected to show the dominant phenotype.",
      skill: "Unit 5: Heredity — Mendelian Genetics",
      difficulty: "easy"
    },
    {
      question: "Which of the following BEST explains why the electron transport chain (ETC) is located on the inner mitochondrial membrane?",
      options: [
        "The inner membrane provides structural support to prevent electron leakage into the cytoplasm",
        "The membrane's impermeability to H⁺ ions allows the ETC to build a proton gradient used to drive ATP synthesis via ATP synthase",
        "The cristae folds minimize the surface area available for electron transfer proteins",
        "Location in the matrix (inside the inner membrane) allows direct access to oxygen molecules"
      ],
      correct: 1,
      explanation: "The ETC pumps H⁺ ions (protons) from the mitochondrial matrix into the intermembrane space, creating an electrochemical gradient (high H⁺ concentration outside the inner membrane). The inner membrane's impermeability to H⁺ is critical — it forces protons to re-enter the matrix ONLY through ATP synthase (chemiosmosis), where their movement drives rotation of ATP synthase and phosphorylation of ADP to ATP (the vast majority of cellular ATP).",
      skill: "Unit 3: Cellular Energetics — Oxidative Phosphorylation",
      difficulty: "medium"
    },
    {
      question: "During meiosis, which event is responsible for generating genetic variation through the exchange of genetic material between homologous chromosomes?",
      options: [
        "Independent assortment of chromosomes at metaphase I",
        "Replication of DNA during S phase before meiosis begins",
        "Crossing over (recombination) during prophase I",
        "Separation of sister chromatids during anaphase II"
      ],
      correct: 2,
      explanation: "Crossing over occurs during prophase I when homologous chromosomes form tetrads (bivalents) and non-sister chromatids exchange segments at chiasmata. This creates recombinant chromosomes with novel allele combinations not present in either parent. Independent assortment also generates variation (maternal/paternal chromosome combinations), but crossing over is the specific mechanism involving physical exchange of genetic material.",
      skill: "Unit 4: Cell Communication and Cell Cycle",
      difficulty: "medium"
    },
    {
      question: "The phylogenetic tree shows evolutionary relationships among four species. Based on the tree, Species B and C share a most recent common ancestor that lived approximately 50 million years ago. Which inference is BEST supported?",
      map_description: "A phylogenetic tree showing four species (A, B, C, D) as leaf nodes. Reading left to right: Species A branches off first from the base (120 mya). Then the remaining lineage splits into two clades: one containing Species D (80 mya divergence) and one clade containing Species B and C, which share a most recent common ancestor at 50 mya. A time axis runs along the bottom from 130 mya to present. Branch lengths are proportional to time.",
      stimulus_source: "Hypothetical phylogenetic analysis using molecular clock data",
      options: [
        "Species A and D are more closely related to each other than either is to Species B or C",
        "Species B and C are more closely related to each other than either is to Species A or D",
        "Species D and C diverged before Species B and C diverged",
        "Species A is ancestral to all other species shown"
      ],
      correct: 1,
      explanation: "Phylogenetic trees show evolutionary relationships based on common ancestry. Species sharing a more recent common ancestor are more closely related. B and C share a common ancestor at 50 mya — more recently than B/C's relationship to D (who diverged 80 mya from the B-C-D ancestor) or to A (who diverged 120 mya). Closer shared ancestry = greater genetic similarity and more recent divergence.",
      skill: "Unit 7: Natural Selection and Evolution",
      difficulty: "medium"
    }
  ],
  frq: [
    {
      title: "AP Biology FRQ — Cellular Respiration and Photosynthesis",
      prompt: "A student investigates the relationship between light intensity and the rate of photosynthesis in Elodea (aquatic plant). The student measures oxygen bubble production per minute at different light intensities with CO₂ concentration held constant at 0.04%.",
      stimulus: "Results: At 0 lux: 0 bubbles/min; At 500 lux: 8 bubbles/min; At 1000 lux: 15 bubbles/min; At 2000 lux: 23 bubbles/min; At 4000 lux: 27 bubbles/min; At 8000 lux: 28 bubbles/min.",
      parts: [
        {
          label: "a",
          question: "Identify the independent and dependent variables in this experiment, and explain what the oxygen bubbles represent in terms of the light reactions of photosynthesis.",
          points: 3,
          rubric: "1 pt: IV = light intensity; DV = oxygen bubble production rate. 1 pt: Oxygen is produced in the light reactions (photolysis of water in PSII): 2H₂O → 4H⁺ + 4e⁻ + O₂. 1 pt: Bubble rate is a proxy for photosynthetic rate/electron transport chain activity."
        },
        {
          label: "b",
          question: "Explain the plateau in oxygen production observed at high light intensities (4000–8000 lux). Identify the factor that is MOST likely limiting the reaction at this point and justify your answer biochemically.",
          points: 3,
          rubric: "1 pt: Light is no longer the limiting factor above ~4000 lux (light saturation point reached). 1 pt: Identifies CO₂ concentration (Calvin cycle) or enzyme concentration (RuBisCO) as the new limiting factor. 1 pt: Biochemical justification — even with maximum electron flow through light reactions, the Calvin cycle's rate is limited by CO₂ substrate availability for RuBisCO/carbon fixation."
        },
        {
          label: "c",
          question: "The student repeats the experiment at 0.08% CO₂ concentration. Predict and explain how the graph would change at high light intensities, and identify which specific step in photosynthesis would be most affected.",
          points: 3,
          rubric: "1 pt: The plateau would be higher (higher maximum photosynthetic rate) and/or shift to higher light intensity. 1 pt: CO₂ is a substrate for RuBisCO in the Calvin cycle (carbon fixation: CO₂ + RuBP → 2 × 3-PGA); doubling CO₂ increases available substrate. 1 pt: Specifically affects the Calvin cycle (light-independent reactions) — carbon fixation step catalyzed by RuBisCO."
        }
      ]
    }
  ]
};

// ─── AP Psychology ────────────────────────────────────────────────────────────
const AP_PSYCHOLOGY_V1 = {
  mcq: [
    {
      question: "The graph shows the results of a memory experiment testing the serial position effect. Which conclusion is BEST supported by the data?",
      chart_data: {
        type: "line",
        title: "Free Recall Accuracy by Word Position in List (n=120 participants)",
        data: [
          { position: 1, recall_pct: 82 },
          { position: 2, recall_pct: 75 },
          { position: 3, recall_pct: 55 },
          { position: 5, recall_pct: 38 },
          { position: 8, recall_pct: 28 },
          { position: 11, recall_pct: 25 },
          { position: 14, recall_pct: 28 },
          { position: 17, recall_pct: 42 },
          { position: 19, recall_pct: 72 },
          { position: 20, recall_pct: 85 }
        ],
        x_key: "position",
        y_keys: ["recall_pct"],
        x_label: "Word Position in List",
        y_label: "Recall Accuracy (%)"
      },
      stimulus_source: "Adapted from Murdock (1962) free recall paradigm",
      options: [
        "The recency effect reflects long-term memory consolidation of recently presented items",
        "Both the primacy and recency effects demonstrate superior recall for words in early and late list positions respectively, supporting dual-store memory theory",
        "Words in the middle of the list are recalled best because they receive the most rehearsal",
        "The primacy effect occurs because early words benefit from contextual cues at list onset"
      ],
      correct: 1,
      explanation: "The U-shaped curve shows the classic serial position effect: high recall for early words (primacy effect — transferred to long-term memory through rehearsal) and for final words (recency effect — still in short-term/working memory at recall). The primacy effect supports the multi-store model: early items receive more rehearsal cycles, moving them to LTM. The recency effect reflects items still in STM's limited-capacity buffer.",
      skill: "Unit 7: Cognition — Memory",
      difficulty: "medium"
    },
    {
      question: "In Milgram's obedience experiments (Yale University, 1961–1963), participants were instructed to administer electric shocks to a 'learner' for each incorrect answer. Approximately what percentage of participants delivered the maximum 450-volt shock?",
      options: [
        "10–15% of participants",
        "25–30% of participants",
        "45–50% of participants",
        "60–65% of participants"
      ],
      correct: 3,
      explanation: "In Milgram's baseline condition (experimenter present in lab, learner in adjacent room), approximately 65% (26/40) of participants delivered the maximum 450-volt shock despite the learner's apparent distress. This was far higher than predicted by psychiatric experts (who estimated 1–2%) and demonstrated the power of legitimate authority, situational pressure, and incremental commitment in producing obedient behavior.",
      skill: "Unit 9: Social Psychology — Conformity and Obedience",
      difficulty: "medium"
    },
    {
      question: "According to Maslow's Hierarchy of Needs, a refugee living in a camp with inadequate food and shelter would MOST urgently be motivated by:",
      options: [
        "Esteem needs, including recognition and status within the refugee community",
        "Physiological needs, including food, water, and safety",
        "Love and belonging needs, including social connection with other refugees",
        "Self-actualization needs, pursuing personal potential in difficult circumstances"
      ],
      correct: 1,
      explanation: "Maslow's hierarchy is hierarchically ordered — lower-level needs must be substantially met before higher-level needs become primary motivators. Physiological needs (food, water, warmth, sleep) and safety needs (security, shelter) form the base. A refugee without adequate food/shelter has unmet physiological needs at the base of the hierarchy, making these the dominant motivational force regardless of social or esteem desires.",
      skill: "Unit 6: Motivation, Emotion, and Personality",
      difficulty: "easy"
    },
    {
      question: "Ivan Pavlov's experiments with dogs demonstrated that after conditioning, the dog salivated to the sound of a bell. In classical conditioning terminology, the bell AFTER conditioning is called the:",
      options: [
        "Unconditioned stimulus (UCS)",
        "Unconditioned response (UCR)",
        "Conditioned stimulus (CS)",
        "Neutral stimulus (NS)"
      ],
      correct: 2,
      explanation: "Classical conditioning progression: Bell (Neutral Stimulus) → paired with Food (UCS) → produces Salivation (UCR). After repeated pairings, Bell alone produces Salivation. The bell is now a Conditioned Stimulus (CS) — a previously neutral stimulus that, through association with the UCS, now triggers a Conditioned Response (CR). Before conditioning it's a NS; during/after conditioning it becomes a CS.",
      skill: "Unit 4: Learning — Classical Conditioning",
      difficulty: "easy"
    },
    {
      question: "The table shows results from Bandura's Bobo Doll study (1961). Which conclusion is MOST directly supported by the data?",
      table_data: {
        headers: ["Condition", "Avg. Aggressive Acts (children)", "Physical Aggression", "Verbal Aggression"],
        rows: [
          ["Aggressive model (live)", "83", "38", "45"],
          ["Aggressive model (film)", "76", "36", "40"],
          ["Aggressive model (cartoon)", "72", "30", "42"],
          ["No model (control)", "54", "18", "36"],
          ["Non-aggressive model", "42", "15", "27"]
        ]
      },
      stimulus_source: "Adapted from Bandura, Ross & Ross (1961, 1963) observational learning studies",
      options: [
        "Children show aggression only when directly rewarded for aggressive behavior",
        "Children who observed aggressive models showed significantly more aggression than those in non-aggressive or no-model conditions, supporting observational learning theory",
        "Live models produce exactly twice the aggression of film models, demonstrating media ineffectiveness",
        "Control group children showed no aggression, suggesting aggression is entirely learned"
      ],
      correct: 1,
      explanation: "Bandura's research showed children imitated aggressive behaviors they observed — whether from live adults, film, or cartoon models — at significantly higher rates than control or non-aggressive model groups. This was foundational evidence for Social Learning Theory (now Social Cognitive Theory): learning occurs through observation and vicarious reinforcement, without direct reward to the learner. Children reproduced specific behaviors (bobo doll punching, verbal comments) modeled by adults.",
      skill: "Unit 4: Learning — Observational Learning",
      difficulty: "medium"
    },
    {
      question: "A therapist using systematic desensitization to treat a client's elevator phobia would MOST likely proceed in which order?",
      options: [
        "Immediately expose the client to a crowded elevator to extinguish fear through flooding",
        "Have the client imagine elevators while relaxed, then gradually increase real-world exposure from least to most feared stimuli",
        "Use positive reinforcement each time the client successfully avoids elevator anxiety",
        "Identify unconscious conflicts driving the phobia through free association and dream analysis"
      ],
      correct: 1,
      explanation: "Systematic desensitization (Wolpe, 1958) is a behavioral therapy based on classical conditioning counterconditioning. It combines deep muscle relaxation with graduated exposure through an anxiety hierarchy: 1) Build relaxation response; 2) Create hierarchy from least to most feared stimuli; 3) Pair relaxation with increasingly anxiety-provoking stimuli, starting with imagination before real-world exposure. It is NOT flooding (immediate full exposure), positive reinforcement (operant conditioning), or psychoanalysis.",
      skill: "Unit 8: Clinical Psychology — Treatment Approaches",
      difficulty: "medium"
    },
    {
      question: "A student scores in the 84th percentile on a standardized psychology exam with mean = 100 and SD = 15. Approximately what is the student's score?",
      options: [
        "84",
        "100",
        "115",
        "130"
      ],
      correct: 2,
      explanation: "On a normal distribution, the 84th percentile corresponds approximately to one standard deviation above the mean. Mean = 100, SD = 15. 100 + 15 = 115. Verification: ~68% of scores fall within ±1 SD (85th–15th = 70%), so the 84th percentile is approximately the mean + 1 SD. More precisely, z = 1.00 corresponds to the 84.13th percentile.",
      skill: "Unit 1: Research Methods and Statistics",
      difficulty: "medium"
    },
    {
      question: "Which of the following BEST illustrates the fundamental attribution error?",
      options: [
        "A driver cut me off in traffic — he must be a reckless, aggressive person (ignoring that he might be rushing to a hospital)",
        "I failed the test because it was unfairly difficult, but my classmate failed because she didn't study",
        "Athletes attribute wins to skill and losses to bad luck",
        "People tend to vote for candidates who share their political views"
      ],
      correct: 0,
      explanation: "The fundamental attribution error (Ross, 1977) is the tendency to over-attribute others' behavior to dispositional (internal, stable personality) factors while underweighting situational factors. Option A shows this: attributing the driver's behavior to character ('reckless person') while ignoring situational explanations (emergency). Option B is the actor-observer bias. Option C is self-serving bias.",
      skill: "Unit 9: Social Psychology — Attribution Theory",
      difficulty: "medium"
    },
    {
      question: "According to the DSM-5 criteria, which of the following is MOST characteristic of major depressive disorder (MDD)?",
      options: [
        "Periods of elevated mood alternating with depressive episodes over at least two years",
        "At least two weeks of depressed mood or loss of interest/pleasure, with 5+ symptoms including changes in sleep, appetite, and concentration",
        "Persistent and excessive worry about multiple areas of life, with physical symptoms, for at least 6 months",
        "Recurrent intrusive thoughts and compulsive behaviors that the person recognizes as excessive"
      ],
      correct: 1,
      explanation: "DSM-5 criteria for MDD require a two-week period of depressed mood or anhedonia (loss of interest/pleasure), plus at least 5 of 9 symptoms: depressed mood, anhedonia, weight/appetite change, sleep disturbance, psychomotor changes, fatigue, worthlessness/guilt, concentration difficulty, suicidal ideation. Option A describes dysthymia/PDD or bipolar. Option C is generalized anxiety disorder. Option D is obsessive-compulsive disorder.",
      skill: "Unit 7: Clinical Psychology — Psychological Disorders",
      difficulty: "medium"
    },
    {
      question: "A researcher studying the heritability of intelligence finds that identical twins raised apart show an IQ correlation of 0.75, while fraternal twins raised apart show a correlation of 0.38. This MOST strongly suggests:",
      options: [
        "Intelligence is entirely determined by genetics, as environment has no effect",
        "Both genetic factors and shared environmental experiences contribute equally to intelligence",
        "Genetic factors make a substantial contribution to intelligence, though environment also plays a role",
        "The data are inconclusive because twins cannot represent the general population"
      ],
      correct: 2,
      explanation: "The classic behavioral genetics logic: identical (MZ) twins share 100% of genes; fraternal (DZ) twins share ~50%. MZ twins raised APART still show high IQ correlation (0.75), attributing much of this to genetic similarity. The fact that fraternal twins raised apart correlate lower (0.38, approximately 50% of the MZ correlation) is consistent with genetic contribution proportional to genetic similarity. However, MZ twins don't correlate 1.0, indicating environmental influences also matter.",
      skill: "Unit 5: Developmental Psychology — Nature vs. Nurture",
      difficulty: "hard"
    }
  ],
  frq: [
    {
      title: "AP Psychology FRQ — Research Methods and Learning",
      prompt: "A psychologist wants to test whether background music improves memory performance. She randomly assigns 60 college students to three groups: silence, classical music, or hip-hop music. All groups study the same 20-word list for 5 minutes, then complete a free recall test.",
      stimulus: "Results: Silence group recalled 14.2 words (SD=2.1); Classical music recalled 15.8 words (SD=2.3); Hip-hop recalled 11.4 words (SD=3.1). Statistical analysis showed p < 0.05 for the classical vs. hip-hop comparison.",
      parts: [
        {
          label: "a",
          question: "Identify the independent variable, dependent variable, and ONE extraneous variable the researcher controlled for in this experiment.",
          points: 3,
          rubric: "1 pt each: IV = type of background music (3 levels: silence, classical, hip-hop). DV = number of words correctly recalled. Controlled variable: same 20-word list / same 5-minute study time / random assignment / same testing environment. Must be a variable actually mentioned or implied in the design."
        },
        {
          label: "b",
          question: "The researcher concludes that 'classical music causes better memory than silence.' Evaluate this conclusion using the results provided. Is it justified? Identify ONE threat to internal validity that could undermine the conclusion.",
          points: 4,
          rubric: "2 pts for evaluation: The classical vs. silence difference (14.2 vs 15.8) may not have been statistically tested (only classical vs. hip-hop showed p<0.05); researcher cannot conclude causality from silence comparison without significance data. 2 pts for threat: demand characteristics (students guessing hypothesis); experimenter bias if music was chosen subjectively; potential confound if groups differed in pre-existing music listening habits (though random assignment partially addresses this)."
        },
        {
          label: "c",
          question: "Using your knowledge of cognitive psychology, explain ONE theoretical reason why hip-hop music might impair memory performance compared to silence. Reference a specific memory theory or research finding.",
          points: 3,
          rubric: "1 pt: Names a specific theory/finding (Baddeley's Working Memory Model; cognitive load theory; the 'irrelevant sound effect'). 1 pt: Explains the mechanism (e.g., hip-hop's lyrics occupy the phonological loop/articulatory rehearsal system, which is also used for verbal encoding of word lists, causing interference). 1 pt: Connects specifically to the word-list memory task."
        }
      ]
    }
  ]
};

// ─── AP Calculus AB ───────────────────────────────────────────────────────────
const AP_CALCULUS_AB_V1 = {
  mcq: [
    {
      question: "If f(x) = 3x⁴ − 5x³ + 2x − 7, what is f'(x)?",
      options: [
        "12x³ − 15x² + 2",
        "12x³ − 5x² + 2",
        "12x⁴ − 15x³ + 2x",
        "3x³ − 5x² + 2"
      ],
      correct: 0,
      explanation: "Using the power rule d/dx[xⁿ] = nxⁿ⁻¹: d/dx[3x⁴] = 12x³; d/dx[−5x³] = −15x²; d/dx[2x] = 2; d/dx[−7] = 0. Therefore f'(x) = 12x³ − 15x² + 2.",
      skill: "Unit 2: Differentiation — Power Rule",
      difficulty: "easy"
    },
    {
      question: "The graph shows the function f(x). Based on the graph, at which x-value does f'(x) change from negative to positive, indicating a local minimum?",
      chart_data: {
        type: "line",
        title: "f(x) = x³ − 6x² + 9x − 2",
        data: [
          { x: 0, fx: -2 },
          { x: 0.5, fx: 1.125 },
          { x: 1, fx: 2 },
          { x: 1.5, fx: 1.375 },
          { x: 2, fx: 0 },
          { x: 2.5, fx: -0.875 },
          { x: 3, fx: -2 },
          { x: 3.5, fx: -1.375 },
          { x: 4, fx: 2 },
          { x: 4.5, fx: 7.375 }
        ],
        x_key: "x",
        y_keys: ["fx"],
        x_label: "x",
        y_label: "f(x)"
      },
      stimulus_source: "Graph of f(x) = x³ − 6x² + 9x − 2",
      options: [
        "x = 1",
        "x = 2",
        "x = 3",
        "x = 4"
      ],
      correct: 2,
      explanation: "For f(x) = x³ − 6x² + 9x − 2, f'(x) = 3x² − 12x + 9 = 3(x² − 4x + 3) = 3(x−1)(x−3). Setting f'(x) = 0: x = 1 or x = 3. First derivative test: for x < 1, f'(x) > 0 (increasing); for 1 < x < 3, f'(x) < 0 (decreasing); for x > 3, f'(x) > 0 (increasing). f' changes negative→positive at x = 3, indicating a local minimum.",
      skill: "Unit 5: Analytical Applications of Differentiation",
      difficulty: "medium"
    },
    {
      question: "∫(6x² − 4x + 3)dx = ?",
      options: [
        "12x − 4 + C",
        "2x³ − 2x² + 3x + C",
        "6x³ − 4x² + 3x + C",
        "2x³ − 2x + C"
      ],
      correct: 1,
      explanation: "Using the power rule for integration ∫xⁿdx = xⁿ⁺¹/(n+1) + C: ∫6x²dx = 6x³/3 = 2x³; ∫(−4x)dx = −4x²/2 = −2x²; ∫3dx = 3x. Therefore ∫(6x² − 4x + 3)dx = 2x³ − 2x² + 3x + C.",
      skill: "Unit 6: Integration and Accumulation",
      difficulty: "easy"
    },
    {
      question: "The table shows values of a continuous function f. Which of the following statements is necessarily true about f?",
      table_data: {
        headers: ["x", "f(x)"],
        rows: [
          ["1", "−3"],
          ["2", "1"],
          ["3", "−1"],
          ["4", "5"],
          ["5", "2"]
        ]
      },
      options: [
        "f has a zero between x = 1 and x = 2 only",
        "f has zeros in the intervals (1,2) and (2,3)",
        "f has at least two zeros by the Intermediate Value Theorem",
        "f cannot have a zero between x = 4 and x = 5"
      ],
      correct: 2,
      explanation: "The Intermediate Value Theorem (IVT) states that if f is continuous on [a,b] and N is between f(a) and f(b), then there exists c ∈ (a,b) with f(c) = N. Between x=1 and x=2: f changes from −3 to 1 (crosses zero → 1 zero). Between x=2 and x=3: f changes from 1 to −1 (crosses zero → 1 zero). IVT guarantees at least one zero in each interval, so at least 2 zeros total.",
      skill: "Unit 1: Limits and Continuity — IVT",
      difficulty: "medium"
    },
    {
      question: "What is lim(x→0) [sin(5x)/x]?",
      options: [
        "0",
        "1",
        "5",
        "Does not exist"
      ],
      correct: 2,
      explanation: "Using the fundamental limit lim(x→0) [sin(x)/x] = 1, we can rewrite: sin(5x)/x = 5 · sin(5x)/(5x). As x→0, 5x→0, so lim(x→0) sin(5x)/(5x) = 1. Therefore the limit = 5 · 1 = 5. Alternatively, by L'Hôpital's Rule (0/0 form): lim [sin(5x)/x] = lim [5cos(5x)/1] = 5cos(0) = 5.",
      skill: "Unit 1: Limits and Continuity",
      difficulty: "medium"
    },
    {
      question: "A particle moves along the x-axis. Its position at time t is given by x(t) = t³ − 9t² + 24t. At what time(s) is the particle at rest?",
      options: [
        "t = 3 only",
        "t = 2 and t = 4",
        "t = 4 only",
        "t = 0 and t = 3"
      ],
      correct: 1,
      explanation: "A particle is at rest when velocity = 0. Velocity v(t) = x'(t) = 3t² − 18t + 24 = 3(t² − 6t + 8) = 3(t − 2)(t − 4). Setting v(t) = 0: t − 2 = 0 or t − 4 = 0, so t = 2 or t = 4. The particle is at rest at t = 2 and t = 4.",
      skill: "Unit 4: Contextual Applications of Differentiation",
      difficulty: "medium"
    },
    {
      question: "Using the Fundamental Theorem of Calculus, if F(x) = ∫₁ˣ (t² + 2t) dt, then F'(x) = ?",
      options: [
        "∫₁ˣ (2t + 2) dt",
        "x² + 2x",
        "(x³/3 + x²) − (1/3 + 1)",
        "x² + 2"
      ],
      correct: 1,
      explanation: "By the Fundamental Theorem of Calculus Part 1: if F(x) = ∫ₐˣ f(t)dt, then F'(x) = f(x). Here f(t) = t² + 2t, so F'(x) = x² + 2x. No computation of the antiderivative is needed — the derivative of the integral with variable upper bound simply substitutes the upper bound into the integrand.",
      skill: "Unit 6: Integration — Fundamental Theorem of Calculus",
      difficulty: "medium"
    },
    {
      question: "Which of the following gives the area between f(x) = x² and g(x) = x on the interval [0, 1]?",
      options: [
        "∫₀¹ (x² − x) dx",
        "∫₀¹ (x − x²) dx",
        "∫₀¹ (x² + x) dx",
        "∫₀¹ x² dx − ∫₀¹ x dx"
      ],
      correct: 1,
      explanation: "On [0,1], comparing f(x) = x² and g(x) = x: at x = 0.5, x = 0.5 > x² = 0.25, so g(x) ≥ f(x) throughout (0,1). Area between curves = ∫₀¹ [top − bottom] dx = ∫₀¹ (x − x²) dx. Note: Option D equals Option A = ∫₀¹(x² − x)dx, which would give a negative value. The area must be computed as (upper − lower).",
      skill: "Unit 8: Applications of Integration",
      difficulty: "medium"
    },
    {
      question: "If f(x) = sin(x²), then f'(x) using the chain rule is:",
      options: [
        "cos(x²)",
        "2x cos(x²)",
        "cos(2x)",
        "2x sin(x²)"
      ],
      correct: 1,
      explanation: "Chain rule: d/dx[f(g(x))] = f'(g(x)) · g'(x). Here outer function f(u) = sin(u), inner function g(x) = x². f'(u) = cos(u), g'(x) = 2x. Therefore d/dx[sin(x²)] = cos(x²) · 2x = 2x cos(x²).",
      skill: "Unit 3: Differentiation — Chain Rule",
      difficulty: "easy"
    },
    {
      question: "A company's profit function is P(x) = −x³ + 12x² − 45x + 50 where x is units produced (in thousands). What production level maximizes profit?",
      options: [
        "x = 3",
        "x = 5",
        "x = 9",
        "x = 12"
      ],
      correct: 1,
      explanation: "To maximize, find critical points: P'(x) = −3x² + 24x − 45 = −3(x² − 8x + 15) = −3(x − 3)(x − 5). P'(x) = 0 at x = 3 and x = 5. Second derivative test: P''(x) = −6x + 24. P''(3) = −18 + 24 = 6 > 0 → local min at x = 3. P''(5) = −30 + 24 = −6 < 0 → local MAX at x = 5. Maximum profit at x = 5 (thousand units).",
      skill: "Unit 5: Analytical Applications — Optimization",
      difficulty: "hard"
    }
  ],
  frq: [
    {
      title: "AP Calculus AB FRQ — Related Rates and Integration",
      prompt: "Do not use a calculator on this question. Show all work clearly.",
      stimulus: "A conical tank (vertex down) has radius 4 meters and height 8 meters. Water is flowing into the tank at a constant rate of 2 m³/min.",
      parts: [
        {
          label: "a",
          question: "Express the volume V of water in the tank as a function of the water's height h only. (Hint: Use similar triangles to express radius r in terms of h.)",
          points: 3,
          rubric: "1 pt: Uses similar triangles: r/h = 4/8 = 1/2, so r = h/2. 1 pt: Substitutes into cone volume formula: V = (1/3)πr²h. 1 pt: Final answer V = (1/3)π(h/2)²(h) = πh³/12."
        },
        {
          label: "b",
          question: "How fast is the water level rising when the water is 3 meters deep? Give exact answer with units.",
          points: 4,
          rubric: "1 pt: Differentiates V = πh³/12 with respect to t: dV/dt = (π/4)h² · dh/dt. 1 pt: Substitutes given values: dV/dt = 2 m³/min, h = 3 m. 1 pt: Solves: 2 = (π/4)(9)(dh/dt) → dh/dt = 8/(9π). 1 pt: Correct units: m/min."
        },
        {
          label: "c",
          question: "Using the result from part (a), set up (but do not evaluate) the definite integral for the volume of water when the tank is filled from h = 0 to h = 6 meters. Then evaluate it.",
          points: 3,
          rubric: "1 pt: Sets up ∫₀⁶ (πh²/4) dh (taking derivative of πh³/12 then integrating — or recognizing V(6) = π(6)³/12). 1 pt: Evaluates: [πh³/12]₀⁶ = π(216)/12 − 0. 1 pt: Final answer = 18π m³."
        }
      ]
    }
  ]
};

// ─── AP Macroeconomics ────────────────────────────────────────────────────────
const AP_MACROECONOMICS_V1 = {
  mcq: [
    {
      question: "The graph shows the AD-AS model for an economy in long-run equilibrium. If consumer confidence suddenly falls sharply, which shift would MOST accurately represent the short-run effect?",
      chart_data: {
        type: "line",
        title: "AD-AS Model: US Economy (Stylized)",
        data: [
          { output: 80, price_level: 140 },
          { output: 90, price_level: 125 },
          { output: 100, price_level: 110 },
          { output: 110, price_level: 98 },
          { output: 120, price_level: 88 }
        ],
        x_key: "output",
        y_keys: ["price_level"],
        x_label: "Real GDP (billions $)",
        y_label: "Price Level (CPI index)"
      },
      stimulus_source: "Stylized AD-AS diagram based on macroeconomic theory",
      options: [
        "The LRAS curve shifts right, increasing potential output",
        "The SRAS curve shifts right, reducing price level and increasing output",
        "The AD curve shifts left, reducing both price level and real GDP in the short run",
        "The AD curve shifts right, increasing both price level and real GDP"
      ],
      correct: 2,
      explanation: "Consumer confidence is a component of consumption (C), which is part of aggregate demand (AD = C + I + G + NX). Falling confidence reduces consumption spending → AD curve shifts LEFT. This reduces both the price level and real GDP in the short run, creating a recessionary gap (output below LRAS/potential). The SRAS and LRAS curves are unaffected by demand-side changes.",
      skill: "Unit 3: National Income and Price Determination",
      difficulty: "medium"
    },
    {
      question: "Based on the data in the table, which country has the HIGHEST opportunity cost for producing 1 unit of wheat?",
      table_data: {
        headers: ["Country", "Wheat (units/hour)", "Cloth (units/hour)"],
        rows: [
          ["Country A", "4", "2"],
          ["Country B", "3", "6"],
          ["Country C", "8", "4"],
          ["Country D", "2", "2"]
        ]
      },
      options: [
        "Country A (opportunity cost = 0.5 units of cloth)",
        "Country B (opportunity cost = 2 units of cloth)",
        "Country C (opportunity cost = 0.5 units of cloth)",
        "Country D (opportunity cost = 1 unit of cloth)"
      ],
      correct: 1,
      explanation: "Opportunity cost of wheat = cloth given up per unit of wheat. Country A: 2/4 = 0.5 cloth. Country B: 6/3 = 2 cloth. Country C: 4/8 = 0.5 cloth. Country D: 2/2 = 1 cloth. Country B has the highest opportunity cost (must give up 2 units of cloth for each unit of wheat), meaning Country B has a comparative DISADVANTAGE in wheat and should specialize in cloth.",
      skill: "Unit 1: Basic Economic Concepts — Comparative Advantage",
      difficulty: "medium"
    },
    {
      question: "The chart shows US federal funds rate from 2000–2023. The policy represented by the near-zero rates from 2008–2015 is MOST consistent with:",
      chart_data: {
        type: "line",
        title: "Federal Funds Rate (%) — United States, 2000–2023",
        data: [
          { year: 2000, rate: 6.5 },
          { year: 2001, rate: 3.5 },
          { year: 2003, rate: 1.0 },
          { year: 2006, rate: 5.25 },
          { year: 2008, rate: 0.25 },
          { year: 2010, rate: 0.25 },
          { year: 2013, rate: 0.25 },
          { year: 2015, rate: 0.5 },
          { year: 2018, rate: 2.5 },
          { year: 2020, rate: 0.25 },
          { year: 2022, rate: 4.25 },
          { year: 2023, rate: 5.25 }
        ],
        x_key: "year",
        y_keys: ["rate"],
        x_label: "Year",
        y_label: "Federal Funds Rate (%)"
      },
      stimulus_source: "Federal Reserve Bank of St. Louis (FRED), 2024",
      options: [
        "Contractionary monetary policy aimed at reducing inflationary pressure",
        "Expansionary monetary policy aimed at stimulating output and employment after the 2008 recession",
        "Neutral monetary policy maintaining steady economic growth at potential GDP",
        "Fiscal policy conducted by Congress through tax cuts and spending increases"
      ],
      correct: 1,
      explanation: "The Federal Reserve lowered the federal funds rate to near zero (0–0.25%) following the 2008 financial crisis and maintained this through 2015 as expansionary monetary policy. Low federal funds rates lower borrowing costs → banks make cheaper loans → investment (I) and consumption (C) increase → AD shifts right → output and employment increase. This is textbook expansionary monetary policy responding to a recessionary gap.",
      skill: "Unit 4: Financial Sector — Monetary Policy",
      difficulty: "medium"
    },
    {
      question: "If the required reserve ratio is 10% and the Fed purchases $50 million in government securities through open market operations, what is the MAXIMUM potential increase in the money supply?",
      options: [
        "$5 million",
        "$50 million",
        "$500 million",
        "$5,000 million"
      ],
      correct: 2,
      explanation: "Money multiplier = 1/reserve ratio = 1/0.10 = 10. Maximum change in money supply = initial deposit × money multiplier = $50 million × 10 = $500 million. The Fed's open market purchase injects $50M into bank reserves; through repeated deposit-loan-deposit cycles, the money supply expands by up to $500M (assuming all excess reserves are lent and all loans are re-deposited).",
      skill: "Unit 4: Financial Sector — Money Multiplier",
      difficulty: "medium"
    },
    {
      question: "Which of the following would be included in the calculation of GDP using the expenditure approach?",
      options: [
        "A used car sold between private citizens for $15,000",
        "Transfer payments (Social Security benefits) paid by the federal government",
        "A new aircraft purchased by Delta Airlines for $180 million",
        "Stock market transactions totaling $2 trillion in daily trading volume"
      ],
      correct: 2,
      explanation: "GDP measures the market value of all FINAL goods and services produced domestically in a given period. GDP = C + I + G + NX. A new aircraft purchased by a business is INVESTMENT (I). Used car sales are excluded (already counted in GDP when produced). Transfer payments are excluded (no production occurs). Stock transactions are financial transfers, not production of new goods/services.",
      skill: "Unit 2: Economic Indicators — GDP",
      difficulty: "medium"
    },
    {
      question: "According to the Phillips Curve relationship, which combination is MOST likely during a period of high aggregate demand (inflationary gap)?",
      options: [
        "High unemployment and high inflation (stagflation)",
        "Low unemployment and high inflation",
        "Low unemployment and low inflation",
        "High unemployment and low inflation"
      ],
      correct: 1,
      explanation: "The original Phillips Curve (A.W. Phillips, 1958) showed an inverse relationship between unemployment and inflation in the short run. During an inflationary gap (AD exceeds LRAS): firms demand more labor → unemployment falls; simultaneously, excess demand pushes prices up → inflation rises. Low unemployment + high inflation characterizes this scenario. Stagflation (option A) violates the short-run Phillips Curve tradeoff.",
      skill: "Unit 5: Inflation, Unemployment, and Stabilization Policies",
      difficulty: "medium"
    },
    {
      question: "The table shows current account balance data for four countries. Which country's current account position is MOST consistent with a net borrower status?",
      table_data: {
        headers: ["Country", "Exports ($B)", "Imports ($B)", "Current Account Balance"],
        rows: [
          ["Germany", "1,540", "1,320", "+$220B"],
          ["United States", "2,100", "2,800", "−$700B"],
          ["China", "2,590", "2,070", "+$520B"],
          ["Japan", "700", "640", "+$60B"]
        ]
      },
      stimulus_source: "IMF World Economic Outlook Database, 2022",
      options: [
        "Germany, because its exports exceed imports",
        "China, because its surplus funds investment abroad",
        "United States, because its current account deficit means it borrows from abroad to fund excess spending",
        "Japan, because its small surplus provides minimal financing for global investment"
      ],
      correct: 2,
      explanation: "A current account deficit means a country imports more than it exports — it is spending more than it produces domestically. To fund this excess spending, it must borrow from (or sell assets to) foreign creditors → it is a NET BORROWER. The US deficit of $700B means it is the world's largest net borrower, financed by capital account surpluses (foreign investment in US assets). Germany, China, and Japan are net lenders/savers.",
      skill: "Unit 6: Open Economy — Balance of Payments",
      difficulty: "medium"
    },
    {
      question: "Suppose the Consumer Price Index (CPI) was 180 in 2020 and 198 in 2022. What was the inflation rate over this two-year period?",
      options: [
        "9%",
        "10%",
        "18%",
        "20%"
      ],
      correct: 1,
      explanation: "Inflation rate = (CPI₂ − CPI₁)/CPI₁ × 100 = (198 − 180)/180 × 100 = 18/180 × 100 = 10%. This is the total inflation over the two-year period, not annualized. Note: 180/180 = 1.00; 18/180 = 0.10 = 10%.",
      skill: "Unit 2: Economic Indicators — Inflation",
      difficulty: "easy"
    },
    {
      question: "An increase in labor productivity (output per worker) would MOST likely cause which shift in the AD-AS model?",
      options: [
        "AD shifts right (increases)",
        "SRAS shifts left (decreases, increasing price level)",
        "LRAS and SRAS shift right (increase), representing economic growth",
        "Only the SRAS shifts right while LRAS remains fixed"
      ],
      correct: 2,
      explanation: "Labor productivity growth means workers produce more per unit of labor → LOWER per-unit production costs → SRAS shifts right (price level falls, output rises for same price level). More importantly, higher productivity increases the productive CAPACITY of the economy → LRAS also shifts right (potential GDP increases). This represents long-run economic growth, not just a short-run supply change.",
      skill: "Unit 3: National Income and Price Determination",
      difficulty: "medium"
    },
    {
      question: "If the government increases spending by $100 billion and the marginal propensity to consume (MPC) is 0.8, what is the total change in GDP according to the multiplier model?",
      options: [
        "$100 billion",
        "$180 billion",
        "$400 billion",
        "$500 billion"
      ],
      correct: 3,
      explanation: "Fiscal multiplier = 1/(1 − MPC) = 1/(1 − 0.8) = 1/0.2 = 5. Total change in GDP = initial spending increase × multiplier = $100B × 5 = $500 billion. The multiplier captures the ripple effect: $100B government spending → $80B of additional consumer spending (MPC=0.8) → $64B more → etc., converging to $500B total increase.",
      skill: "Unit 3: National Income — Fiscal Multiplier",
      difficulty: "medium"
    }
  ],
  frq: [
    {
      title: "AP Macroeconomics FRQ — Monetary Policy and the Banking System",
      prompt: "Assume the economy is experiencing a recessionary gap. The Federal Open Market Committee (FOMC) decides to conduct expansionary monetary policy.",
      stimulus: "Data: Required reserve ratio = 0.20; Commercial Bank A has $10 million in excess reserves; Current federal funds rate = 5%; Target federal funds rate after policy = 3%.",
      parts: [
        {
          label: "a",
          question: "Identify the specific open market operation the Fed would use to implement expansionary policy, and explain the TRANSMISSION MECHANISM from this action to increased real GDP. Use specific economic terminology.",
          points: 4,
          rubric: "1 pt: Fed purchases government bonds/securities (open market purchase). 1 pt: Mechanism step 1 — purchase injects reserves into banking system. 1 pt: Mechanism step 2 — increased reserves → federal funds rate falls → banks make more loans at lower interest rates. 1 pt: Mechanism step 3 — cheaper borrowing → investment (I) and consumption (C) increase → AD shifts right → real GDP and employment increase."
        },
        {
          label: "b",
          question: "If Bank A uses all $10 million in excess reserves to make new loans, and the reserve ratio is 0.20, what is the maximum change in the money supply? Show your calculation.",
          points: 3,
          rubric: "1 pt: Money multiplier = 1/RR = 1/0.20 = 5. 1 pt: Maximum ΔMS = $10M × 5. 1 pt: Answer = $50 million."
        },
        {
          label: "c",
          question: "Draw and label an AD-AS diagram showing the effect of successful expansionary monetary policy on a recessionary gap. Identify the new equilibrium's price level and output relative to the initial recessionary gap equilibrium.",
          points: 3,
          rubric: "1 pt: Correctly draws initial recessionary gap (AD₁ intersects SRAS below LRAS/potential output). 1 pt: Shows AD₂ shifting right to close the gap (intersects SRAS at or near LRAS). 1 pt: Labels: higher price level (PL₁ → PL₂), higher real output (Y₁ → Yp), approaching potential output on LRAS."
        }
      ]
    }
  ]
};

import {
  AP_WORLD_HISTORY_V1,
  AP_CHEMISTRY_V1,
  AP_STATISTICS_V1,
  AP_US_GOV_V1,
  AP_CALCULUS_BC_V1,
  AP_MICROECONOMICS_V1,
} from "./apPremadeQuestions2.js";

import {
  AP_HUMAN_GEO_V3,
  AP_BIOLOGY_V2,
  AP_PSYCHOLOGY_V2,
  AP_CALCULUS_AB_V2,
  AP_MACROECONOMICS_V2,
  AP_US_HISTORY_V2,
  AP_WORLD_HISTORY_V2,
  AP_CHEMISTRY_V2,
  AP_STATISTICS_V2,
  AP_US_GOV_V2,
  AP_CALCULUS_BC_V2,
  AP_MICROECONOMICS_V2,
  AP_JAPANESE_V1,
} from "./apPremadeQuestionsExtra.js";

import {
  AP_HUMAN_GEO_V4,
  AP_HUMAN_GEO_V5,
  AP_CHEMISTRY_V3,
  AP_WORLD_HISTORY_V3,
} from "./apPremadeQuestionsBank2.js";

import { AP_HUG_REAL_FRQS } from "./apHugRealFRQs.js";

// ─── Master Question Bank ─────────────────────────────────────────────────────
export const PREMADE_QUESTION_BANK = {
  "AP Human Geography": [AP_HUMAN_GEO_V1, AP_HUMAN_GEO_V2, AP_HUMAN_GEO_V3, AP_HUMAN_GEO_V4, AP_HUMAN_GEO_V5],
  "AP US History": [AP_US_HISTORY_V1, AP_US_HISTORY_V2],
  "AP World History": [AP_WORLD_HISTORY_V1, AP_WORLD_HISTORY_V2, AP_WORLD_HISTORY_V3],
  "AP Biology": [AP_BIOLOGY_V1, AP_BIOLOGY_V2],
  "AP Chemistry": [AP_CHEMISTRY_V1, AP_CHEMISTRY_V2, AP_CHEMISTRY_V3],
  "AP Psychology": [AP_PSYCHOLOGY_V1, AP_PSYCHOLOGY_V2],
  "AP Statistics": [AP_STATISTICS_V1, AP_STATISTICS_V2],
  "AP Calculus AB": [AP_CALCULUS_AB_V1, AP_CALCULUS_AB_V2],
  "AP Calculus BC": [AP_CALCULUS_BC_V1, AP_CALCULUS_BC_V2],
  "AP Macroeconomics": [AP_MACROECONOMICS_V1, AP_MACROECONOMICS_V2],
  "AP Microeconomics": [AP_MICROECONOMICS_V1, AP_MICROECONOMICS_V2],
  "AP US Government": [AP_US_GOV_V1, AP_US_GOV_V2],
  "AP Japanese Language": [AP_JAPANESE_V1],
};

// ─── Helper: get a random version for a subject ───────────────────────────────
export function getPremadeVersion(subject) {
  const versions = PREMADE_QUESTION_BANK[subject];
  if (!versions || versions.length === 0) return null;
  return versions[Math.floor(Math.random() * versions.length)];
}

// ─── Helper: check if premade questions exist for a subject ───────────────────
export function hasPremade(subject) {
  return !!(PREMADE_QUESTION_BANK[subject]?.length > 0);
}

// ─── Helper: get ALL MCQs for a subject pooled from all versions ──────────────
function getAllMCQsForSubject(subject) {
  const versions = PREMADE_QUESTION_BANK[subject];
  if (!versions || versions.length === 0) return [];
  const pool = [];
  for (const v of versions) {
    if (v.mcq) pool.push(...v.mcq);
  }
  return pool;
}

// ─── Helper: get N random questions from a subject (MCQ) — pools all versions ─
export function getPremadeMCQ(subject, count) {
  const pool = getAllMCQsForSubject(subject);
  if (!pool.length) return null;
  
  const requested = count || 20;
  
  // Shuffle base pool
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  // If we have enough questions, slice to exact count
  if (shuffled.length >= requested) {
    return shuffled.slice(0, requested);
  }
  
  // Otherwise pad by cycling through shuffled pool again
  const result = [...shuffled];
  let idx = 0;
  while (result.length < requested) {
    result.push({ ...shuffled[idx % shuffled.length] });
    idx++;
  }
  return result.slice(0, requested);
}

// ─── Helper: get a random FRQ from pooled FRQs for a subject ─────────────────
export function getPremadeFRQ(subject) {
  // For AP Human Geography, use the real College Board FRQs (shuffled)
  if (subject === "AP Human Geography") {
    const shuffled = [...AP_HUG_REAL_FRQS];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, 2);
  }

  const versions = PREMADE_QUESTION_BANK[subject];
  if (!versions || versions.length === 0) return null;
  // Pool all FRQs across all versions
  const pool = [];
  for (const v of versions) {
    if (v.frq) pool.push(...v.frq);
  }
  if (!pool.length) return null;
  // Return 2 random FRQs (shuffle and pick first 2)
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, 2);
}

// ─── Helper: get total premade MCQ count for a subject ───────────────────────
export function getPremadeMCQCount(subject) {
  return getAllMCQsForSubject(subject).length;
}