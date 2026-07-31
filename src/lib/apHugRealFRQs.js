// ─── Real AP Human Geography FRQs from Official College Board Exams ──────────
// Source: College Board Released FRQs (2023, 2024, 2025)
// No year labels — questions are shuffled and presented without year attribution

export const AP_HUG_REAL_FRQS = [

  // ─── 2025 Set 1 — Q1: Supranational Organizations ────────────────────────
  {
    title: "AP Human Geography FRQ — Supranational Organizations and Sovereignty",
    prompt: "The European Union (EU) and Association of Southeast Asian Nations (ASEAN) are supranational organizations composed of independent member states.",
    stimulus: null,
    parts: [
      { label: "A", question: "Define the concept of an independent state.", points: 1,
        rubric: "1 pt: A state is a political unit with a permanent population, defined territory, a functioning government, and recognized sovereignty (supreme authority) over its territory. Must include sovereignty/self-governance." },
      { label: "B", question: "Describe one purpose of supranational organizations.", points: 1,
        rubric: "1 pt: Accept any: promote economic cooperation/free trade; provide collective security; resolve disputes peacefully; facilitate political cooperation; address shared challenges (climate, migration). Must be specific." },
      { label: "C", question: "Describe one global outcome of an increase in international trade.", points: 1,
        rubric: "1 pt: Accept: increased economic interdependence between countries; growth of global supply chains; spread of cultural practices; reduction of trade barriers; economic development in export-oriented countries." },
      { label: "D", question: "Explain how deindustrialization has affected the economy of core countries.", points: 1,
        rubric: "1 pt: Deindustrialization = decline of manufacturing in core (MDC) countries. Effects: shift to tertiary/quaternary service economy; loss of manufacturing jobs (Rust Belt); increased unemployment in former industrial cities; outsourcing to periphery/semi-periphery countries." },
      { label: "E", question: "Explain why international boundaries on land or at sea may lead to disputes over resources.", points: 1,
        rubric: "1 pt: Boundaries define territorial control over resources (oil, fish, minerals, water). Overlapping claims (exclusive economic zones, continental shelves) create conflict. Example: South China Sea disputes over fishing grounds and oil reserves; EEZ boundaries over offshore drilling rights." },
      { label: "F", question: "Explain how supranational organizations such as the EU or ASEAN may challenge the sovereignty of member states.", points: 1,
        rubric: "1 pt: Supranational organizations require member states to cede some sovereign decision-making to a higher governing body. EU example: EU regulations override national laws; EU Court of Justice decisions binding; monetary union (Eurozone) restricts monetary policy independence; freedom of movement limits border control." },
      { label: "G", question: "Explain how advances in communication technologies may affect state sovereignty.", points: 1,
        rubric: "1 pt: Communication technology allows information to flow across borders without government control, undermining state media monopolies and censorship. Example: social media enabling coordinated protest (Arab Spring); internet allowing citizens to access foreign news; cryptocurrencies bypassing national financial regulations; remote work reducing dependence on national economic systems." },
    ]
  },

  // ─── 2025 Set 1 — Q2: Japan Population Pyramid ────────────────────────────
  {
    title: "AP Human Geography FRQ — Japan Population Pyramid",
    prompt: "A population pyramid shows changes in population over time. A population pyramid breaks down the population by male and female and divides the population into five-year age groupings called cohorts.",
    stimulus: "Japan Population Pyramid, 2021 (Source: United States Census Bureau International Database)\n\nThe pyramid shows a narrow base (young cohorts 0–14 are small), a wide middle (ages 45–74 are the largest cohorts), and a narrowing top. Females outnumber males significantly in cohorts aged 80 and above. The youngest cohorts (0–4, 5–9) are among the smallest.",
    stimulus_image_description: "Japan Population Pyramid 2021 — narrow base, wide middle/top, female-heavy at 80+",
    parts: [
      { label: "A", question: "Identify the recent trend in fertility shown in the population pyramid.", points: 1,
        rubric: "1 pt: Declining/low fertility rate. The narrow base (small 0–14 cohorts) compared to larger middle-age cohorts indicates fertility has declined over recent decades. TFR is below replacement (currently ~1.2)." },
      { label: "B", question: "Based on the data shown in the population pyramid, describe the ratio of males to females in the Japanese population age 80 and above.", points: 1,
        rubric: "1 pt: Females significantly outnumber males age 80+. The bars for females are noticeably wider/longer than for males in the 80–84, 85–89, 90–94, 95–99, 100+ cohorts. Women's life expectancy in Japan (~88) exceeds men's (~81)." },
      { label: "C", question: "Describe one process that drives urbanization.", points: 1,
        rubric: "1 pt: Accept: rural-to-urban migration driven by economic opportunity (jobs in manufacturing/services); push factors from rural areas (agricultural mechanization reducing farm labor demand, poverty); pull factors to cities (higher wages, education, healthcare). Must identify a specific mechanism." },
      { label: "D", question: "Describe one factor that may lead to a decrease in total population within a more developed country.", points: 1,
        rubric: "1 pt: Accept: TFR below replacement rate (2.1); aging population with high CDR relative to CBR; emigration exceeding immigration; antinatalist policies; high cost of child-rearing reducing birth rates. Must be specific." },
      { label: "E", question: "Explain how a country's population pyramid can be used to predict the future needs of the population.", points: 1,
        rubric: "1 pt: Large youth cohort → predict future need for schools, pediatric healthcare, labor market growth. Large elderly cohort (Japan) → predict increased need for eldercare, pensions, healthcare spending, geriatric services; labor shortages; dependency ratio increases." },
      { label: "F", question: "Explain why the population pyramid provides limited information about immigration to cities in Japan.", points: 1,
        rubric: "1 pt: The national population pyramid shows age/sex structure for Japan as a whole, not urban vs. rural breakdowns. It cannot show: internal migration patterns from rural to urban areas; which age cohorts are migrating to cities; regional population distributions; whether urban cohorts differ from rural. The pyramid aggregates all Japanese residents regardless of location." },
      { label: "G", question: "Explain the degree to which a country's population growth rate may be affected by a pronatalist policy. (Response must indicate the degree [low, moderate, high] and provide an explanation.)", points: 1,
        rubric: "1 pt: Requires: (1) explicit statement of degree (low, moderate, or high) AND (2) explanation. Low/moderate is most defensible: Pronatalist policies (financial incentives, parental leave, childcare subsidies) have modest effects in MDCs. Japan's own policies have not reversed decline. Cultural, economic factors (high cost of living, career-family balance) override incentives. High degree is acceptable if explained with strong government enforcement." },
    ]
  },

  // ─── 2025 Set 1 — Q3: Milk and Pork Production Maps ──────────────────────
  {
    title: "AP Human Geography FRQ — Global Agricultural Production Patterns",
    prompt: "The global production of cow's milk and pork results in distinctive spatial patterns of contemporary agriculture and land use.",
    stimulus: "Map 1: Cow's Milk Production, 2018 (Source: Food and Agriculture Organization)\nHigh milk production: USA, Brazil, EU countries (Germany, France), India, China, Russia, Australia\nMedium milk production: Argentina, Mexico, parts of East Africa\nLow milk production: most of Sub-Saharan Africa, Southeast Asia, Middle East\n\nMap 2: Pork Production, 2018 (Source: Food and Agriculture Organization)\nHigh pork production: USA, Brazil, EU countries, China, Russia\nMedium pork production: Canada, Mexico, Vietnam, Philippines\nLow pork production: Sub-Saharan Africa, Middle East, North Africa, South Asia (India)",
    stimulus_image_description: "Two world choropleth maps showing cow milk production and pork production by country, 2018. High/medium/low shading.",
    parts: [
      { label: "A", question: "Identify an example of a culture trait.", points: 1,
        rubric: "1 pt: Any specific cultural practice, belief, or artifact: dietary restriction (halal, kosher, vegetarianism), specific food (sushi, tacos, injera), language, religion, clothing style, agricultural practice. Must be specific — 'culture' alone is insufficient." },
      { label: "B", question: "Describe the spatial pattern of cow's milk production in Africa, shown in Map 1.", points: 1,
        rubric: "1 pt: Milk production is concentrated in eastern and southern Africa (Kenya, Ethiopia, South Africa) and North Africa (Morocco, Egypt). Most of Sub-Saharan Africa (central, west) shows low production. Pattern reflects pastoral nomadism in some eastern regions and limited commercial dairy in most of the continent." },
      { label: "C", question: "Based on Map 1 and Map 2, compare the spatial patterns of cow's milk production and pork production in Asia. (Response must include both maps in the comparison.)", points: 1,
        rubric: "1 pt: Must reference BOTH maps. Key comparison: China is high in BOTH milk and pork. India is high in milk but very low/absent in pork (Hindu cultural restrictions + cow reverence). Middle East and South Asia show high milk but low/no pork (Islamic dietary laws prohibiting pork). Southeast Asia shows higher pork than milk production. Must explicitly compare patterns from both maps." },
      { label: "D", question: "Describe one environmental effect of agricultural land use such as commercial animal farms.", points: 1,
        rubric: "1 pt: Accept any: greenhouse gas emissions (methane from cattle, nitrous oxide from manure); water pollution (nutrient runoff from manure causing eutrophication); water use/depletion (high water footprint of animal production); deforestation for pasture land; soil degradation from overgrazing; biodiversity loss." },
      { label: "E", question: "Explain how the globalization of agriculture may affect local culture traits.", points: 1,
        rubric: "1 pt: Globalization introduces non-local foods into local markets, potentially displacing traditional foods and practices (acculturation/cultural imperialism). Example: fast food chains replacing local cuisine; imported grain disrupting traditional subsistence farming; commercial dairy replacing indigenous cattle practices. May also preserve culture through niche exports (cultural diffusion outward). Must explain mechanism." },
      { label: "F", question: "Explain why regions of agricultural production may become interdependent.", points: 1,
        rubric: "1 pt: Regions specialize based on comparative advantage (climate, soil, water) and trade surpluses for deficits. Example: Brazil exports beef to East Asia; USA exports soybeans to China; Netherlands exports dairy globally. Interdependence means supply disruptions in one region affect others. Commodity price fluctuations connect distant producers and consumers through global supply chains." },
      { label: "G", question: "Explain how domesticated animals such as pigs spatially diffused to create the spatial pattern shown on Map 2.", points: 1,
        rubric: "1 pt: Pigs were domesticated in multiple hearths (China, Near East ~8,000 BCE). Diffusion via: relocation diffusion through human migration and trade routes; European colonial expansion carried pigs to Americas and Pacific; Silk Road trade spread pig farming across Eurasia. Absence in Middle East/North Africa/South Asia reflects cultural barriers (religious prohibitions = barrier to diffusion), explaining low pork production despite diffusion elsewhere." },
    ]
  },

  // ─── 2025 Set 2 — Q1: Migration and Urban Challenges ─────────────────────
  {
    title: "AP Human Geography FRQ — Migration and Urban Landscapes",
    prompt: "Migration contributes to significant population growth and change in urban landscapes. As populations increase, urban areas face economic, social, and environmental challenges.",
    stimulus: null,
    parts: [
      { label: "A", question: "Describe one type of voluntary migration.", points: 1,
        rubric: "1 pt: Accept any specific type: economic migration (moving for job opportunities); retirement migration; amenity migration; step migration; chain migration (following established network); international labor migration (guest workers). Must be voluntary (not refugee/forced). Should briefly describe characteristics." },
      { label: "B", question: "Explain how migration may affect a city's economy.", points: 1,
        rubric: "1 pt: Accept positive or negative with explanation. Positive: migrants expand labor force, fill low-wage jobs, start businesses, pay taxes, contribute to demographic dividend. Negative: wage competition, strain on public services, informal economy growth. Remittances drain money from city economy. Must explain the causal mechanism." },
      { label: "C", question: "Describe one type of housing discrimination that may occur in urban areas.", points: 1,
        rubric: "1 pt: Accept any specific type: redlining (denial of services/mortgages to residents of minority neighborhoods); blockbusting (panic-selling tactics); steering (directing buyers toward segregated neighborhoods); exclusionary zoning; discriminatory rental practices; price gouging in informal settlements." },
      { label: "D", question: "Explain how a city's infrastructure affects society.", points: 1,
        rubric: "1 pt: Infrastructure (roads, water, sewer, transit, electricity, broadband) determines quality of life and economic opportunity. Good infrastructure: reduces travel time, enables economic activity, improves public health (clean water). Poor infrastructure: creates disparities, limits mobility, increases disease risk. Must explain a causal connection." },
      { label: "E", question: "Describe one challenge to sustainability in urban areas.", points: 1,
        rubric: "1 pt: Accept any: urban heat island effect; waste management; air/water pollution; energy consumption; urban sprawl consuming agricultural land; traffic congestion and carbon emissions; inadequate green space; informal settlements lacking services; flooding from impervious surfaces." },
      { label: "F", question: "Explain how urban design initiatives are intended to affect cities.", points: 1,
        rubric: "1 pt: Urban design initiatives (green building codes, mixed-use zoning, public transit investment, parks, pedestrian zones, urban renewal) aim to improve livability, environmental sustainability, economic vitality, and social equity. Example: transit-oriented development reduces car dependence; green roofs reduce urban heat. Must explain intended mechanism." },
      { label: "G", question: "Explain why urban design initiatives may be criticized.", points: 1,
        rubric: "1 pt: Accept: gentrification — improvements raise property values, displacing low-income residents. Initiatives may prioritize aesthetic/economic goals over affordable housing. Projects may serve wealthier neighborhoods, exacerbating spatial inequality. Community input may be ignored. Cost may be prohibitive for lower-income cities. Environmental benefits may greenwash developer interests." },
    ]
  },

  // ─── 2025 Set 2 — Q2: Food Exports Between Countries X and Y ──────────────
  {
    title: "AP Human Geography FRQ — Agricultural Trade and Economic Development",
    prompt: "Country X and Country Y have a long-established trade relationship in agricultural products. Country X is a developed country, and Country Y is a developing country.",
    stimulus: "Food Exports Between Country X and Country Y\n\nExports from Country X to Country Y — $19.1 Billion total:\n• Grains, fruits, vegetables: $8.2 billion (largest category)\n• Processed foods: $5.1 billion\n• Meat, dairy, seafood: $5.2 billion\n• Fats, vegetable oils: $0.6 billion\n\nExports from Country Y to Country X — $28.0 Billion total:\n• Grains, fruits, vegetables: $13.7 billion (largest category)\n• Meat, dairy, seafood: $11.8 billion\n• Processed foods: $2.3 billion\n• Fats, vegetable oils: $0.2 billion\n\nSource: Adapted from official trade data",
    parts: [
      { label: "A", question: "Using the data in the charts, identify the largest food export category between the two countries.", points: 1,
        rubric: "1 pt: Grains, fruits, and vegetables. This is the largest category in BOTH directions: $8.2B from X to Y and $13.7B from Y to X." },
      { label: "B", question: "Using the data in the charts, describe the difference between the two countries in the meat, dairy, and seafood category.", points: 1,
        rubric: "1 pt: Country Y exports significantly more meat, dairy, and seafood to Country X ($11.8B) than Country X exports to Country Y ($5.2B). Country Y has a trade surplus in this category; Country X a deficit. Country Y (developing) exports more than twice as much in this category." },
      { label: "C", question: "Define the concept of comparative advantage.", points: 1,
        rubric: "1 pt: Comparative advantage = the ability of a country (or producer) to produce a good or service at a LOWER OPPORTUNITY COST than another. Countries should specialize in and export goods where they have comparative advantage, even if they have absolute advantage in all goods. Must include the idea of opportunity cost or relative efficiency." },
      { label: "D", question: "Describe one effect of Green Revolution technologies on food supplies in developing countries.", points: 1,
        rubric: "1 pt: Positive: high-yield seed varieties (wheat, rice), chemical fertilizers, pesticides, irrigation increased crop yields dramatically — India's wheat production tripled 1965–1985. Negative: increased input costs excluded small farmers; monoculture increased vulnerability; chemical inputs caused environmental degradation; displaced traditional farming knowledge." },
      { label: "E", question: "Explain how advances in agricultural technology may increase the carrying capacity of land.", points: 1,
        rubric: "1 pt: Carrying capacity = maximum population an environment can sustain. Agricultural technology (irrigation, GMOs, fertilizers, precision agriculture) increases food output per unit of land, effectively raising the land's carrying capacity — more people can be fed from the same area. Must explain the mechanism connecting technology to increased supportable population." },
      { label: "F", question: "Explain the degree to which the economies of Country X and Country Y are interdependent. (Response must indicate the degree [low, moderate, high] and provide an explanation.)", points: 1,
        rubric: "1 pt: Requires degree AND explanation. High or moderate interdependence most defensible: combined trade = $47.1B; both countries are significant trade partners in multiple categories; disruption in one would significantly affect the other. Country Y exports MORE total ($28B vs $19.1B), suggesting Y depends on X as a market. Must include specific data." },
      { label: "G", question: "Explain how the charts provide limited information about economic development.", points: 1,
        rubric: "1 pt: The charts show only food trade volumes, not: GDP per capita, HDI, education levels, healthcare access, infrastructure, income distribution, poverty rates, or other development indicators. Trade data doesn't show who benefits from the trade (value added, profit distribution). Cannot determine quality of life or whether trade benefits are equitably distributed within each country." },
    ]
  },

  // ─── 2025 Set 2 — Q3: Saskatchewan and Finland Maps ──────────────────────
  {
    title: "AP Human Geography FRQ — Political Boundaries and Governance",
    prompt: "The two maps show political boundaries in Saskatchewan, Canada, and in Finland. Both Finland and Saskatchewan are home to populations of indigenous peoples with a significant amount of political autonomy. Finland is a member state of the European Union.",
    stimulus: "Map 1: Political Divisions in Saskatchewan, Canada (Source: Statistics Canada)\nShows Saskatchewan's internal rural municipalities, cities, and towns. Saskatoon is the largest city (square symbol); Regina is the provincial capital and second-largest city (star symbol). Saskatchewan is highlighted within Canada's provinces and territories.\n\nMap 2: Political Divisions in Finland (Source: ESRI Data Partners)\nShows Finland's municipalities. Helsinki is the national capital and largest city (star-with-circle symbol); Tampere is the second-largest city (square symbol). Finland is shown within the European Union context.",
    stimulus_image_description: "Two maps: Map 1 shows Saskatchewan's rural municipalities within Canada; Map 2 shows Finland's municipalities within Europe/EU",
    parts: [
      { label: "A", question: "Identify the scale of analysis used for Finland's political divisions in Map 2.", points: 1,
        rubric: "1 pt: Local scale (municipalities/cities/towns within Finland) OR national scale (Finland's internal divisions). Accept either — the map shows Finland's internal political divisions at the local/national scale. Must identify a geographic scale." },
      { label: "B", question: "Define geometric boundaries as shown in Map 1.", points: 1,
        rubric: "1 pt: Geometric boundaries are straight-line boundaries drawn without regard to physical or cultural features — often defined by latitude/longitude or surveyed lines. Saskatchewan's southern boundary with the US and its eastern/western provincial boundaries are examples of geometric (rectilinear/mathematical) boundaries. Contrast with physical (rivers, mountains) or cultural (ethnic/linguistic) boundaries." },
      { label: "C", question: "Describe one function of internal boundaries.", points: 1,
        rubric: "1 pt: Accept: define jurisdictions for administrative services (taxes, schools, police); organize electoral districts; allocate resources between governments; determine which laws apply in which area; create governance units for local representation; define rural municipality tax collection areas." },
      { label: "D", question: "Explain how the spatial organization of a country such as Canada is affected by a federal system of governance.", points: 1,
        rubric: "1 pt: In a federal system, power is constitutionally divided between national and subnational (provincial/state) governments. Canada's provinces have authority over education, healthcare, natural resources, etc. This creates spatial variation in policies across provinces — Saskatchewan may have different policies than Ontario. Provinces have their own boundaries, legislatures, and governance structures, creating a layered spatial political organization." },
      { label: "E", question: "Explain how the supranational organization shown in Map 2 may limit the actions of Finland as a member state.", points: 1,
        rubric: "1 pt: EU membership requires Finland to comply with EU regulations, directives, and court decisions that override Finnish national law. Examples: EU single market rules restrict trade barriers; Eurozone membership limits independent monetary policy; EU human rights directives must be implemented; EU environmental regulations apply; free movement of EU citizens limits Finnish immigration control. Finland cannot act unilaterally on matters under EU jurisdiction." },
      { label: "F", question: "Describe one characteristic of a cultural landscape that may reflect cultural beliefs and identities.", points: 1,
        rubric: "1 pt: Cultural landscape = human modification of natural environment reflecting cultural values. Accept: religious architecture (churches, mosques, temples); cemetery design; agricultural patterns (terraced fields, communal vs. individual farms); place names/toponyms; vernacular architecture; sacred sites; memorials and monuments; street patterns in historically planned cities." },
      { label: "G", question: "Explain how communication technologies may affect the cultural patterns of indigenous languages.", points: 1,
        rubric: "1 pt: Two directions possible — technology may threaten indigenous languages (dominant languages like English/Finnish dominate internet/media, accelerating language shift) OR technology may preserve/revitalize them (apps, social media, digital archives in indigenous languages; online communities of speakers; language learning apps; radio/video in indigenous languages connecting dispersed communities). Must explain the mechanism." },
    ]
  },

  // ─── 2024 Set 1 — Q1: Food and Carrying Capacity ─────────────────────────
  {
    title: "AP Human Geography FRQ — Food Security, Population, and Agriculture",
    prompt: "The availability of food in the context of a growing world population is influenced by many social, environmental, and economic factors.",
    stimulus: null,
    parts: [
      { label: "A", question: "Define the concept of carrying capacity.", points: 1,
        rubric: "1 pt: Carrying capacity = the maximum population size that an environment can sustainably support given available resources (food, water, land, energy). Must include the idea of sustainability/limits of the environment." },
      { label: "B", question: "Describe ONE way that humans have altered the environmental sustainability of agricultural lands.", points: 1,
        rubric: "1 pt: Accept: overuse of chemical fertilizers causing soil acidification/eutrophication; over-irrigation causing salinization; monoculture reducing biodiversity and soil health; deforestation for cropland; overgrazing leading to desertification; urban sprawl paving over prime farmland; soil compaction from heavy machinery." },
      { label: "C", question: "Explain how transportation technology has increased economies of scale in the agricultural sector of less developed countries.", points: 1,
        rubric: "1 pt: Transportation technology (refrigerated shipping, containerization, all-weather roads, port infrastructure) enables LDC farmers to access distant markets, justifying larger-scale production. Larger production lowers per-unit costs (economies of scale). Without transport technology, perishable goods can only serve local markets, limiting farm size. Must connect transportation → market access → scale → cost reduction." },
      { label: "D", question: "Explain a likely negative economic outcome of Green Revolution agricultural practices on rural communities.", points: 1,
        rubric: "1 pt: Negative outcomes: high input costs (fertilizers, pesticides, HYV seeds) increase debt for small farmers; consolidation of farmland as small farms fail; displacement of farm labor by mechanization; crop price depression as supply surges hurts subsistence farmers who sell surpluses; dependency on multinational agribusiness; environmental costs (groundwater depletion, chemical runoff) borne by rural communities." },
      { label: "E", question: "Explain ONE weakness of Malthusian theory in predicting the relationship between food production and population growth in contemporary society.", points: 1,
        rubric: "1 pt: Malthus (1798) predicted population grows geometrically while food grows arithmetically → eventual famine/war/disease. Weaknesses: underestimated technological innovation (Green Revolution, GMOs, precision agriculture); didn't account for demographic transition (fertility falls with development); food production grew faster than population in 20th century; improved distribution systems; birth control reduces population growth. Must identify a specific weakness." },
      { label: "F", question: "Explain how surplus food production has changed the global market for local agricultural products.", points: 1,
        rubric: "1 pt: Surplus production in MDCs (EU, USA) — subsidized by government — is exported at below-market prices, undercutting local farmers in LDCs. Local producers cannot compete with cheap imports, damaging local agricultural sectors. Or: food surpluses enable food aid, supporting populations in food-insecure regions but potentially undermining local market development." },
      { label: "G", question: "Explain the degree to which Green Revolution agricultural practices were effective in reducing hunger in less developed countries. (Response must indicate the degree [low, moderate, high] and provide an explanation.)", points: 1,
        rubric: "1 pt: Requires degree + explanation. Moderate most defensible: Green Revolution significantly increased yields (India, Mexico, Philippines) and prevented predicted famines, but did not eliminate hunger — benefits were uneven (wealthier farmers, irrigated areas), and absolute number of hungry people remained high. High also acceptable if focused on caloric production increases. Must give specific evidence." },
    ]
  },

  // ─── 2024 Set 1 — Q2: Asian Ethnic Neighborhoods in LA ───────────────────
  {
    title: "AP Human Geography FRQ — Ethnic Neighborhoods and Political Geography",
    prompt: "The map shows predominantly Asian ethnic neighborhoods in Los Angeles County, California. The names of the neighborhoods and the densities of the ethnic groups are identified on the map.",
    stimulus: "Selected Asian Ethnic Neighborhoods in Los Angeles County, California (Source: United States Census Bureau)\n\nKorean neighborhoods: Porter Ranch (north), La Crescenta-Montrose (northeast), Koreatown (central)\nChinese neighborhoods: Alhambra, Arcadia, Monterey Park, Rosemead, San Gabriel, San Marino (eastern cluster); Chinatown (central); Diamond Bar, Hacienda Heights, Rowland Heights, Walnut (southeast)\nFilipino neighborhoods: Panorama City, Downtown/Eagle Rock/East Hollywood, Carson/Long Beach (south), Artesia/Cerritos (southeast), Walnut/West Covina\nJapanese neighborhoods: Gardena, Rolling Hills, Torrance (southwest)\nHigh density areas shown in dark shading; medium density in gray.",
    stimulus_image_description: "Map of LA County showing Asian ethnic neighborhoods clustered in suburban eastern and southern areas",
    parts: [
      { label: "A", question: "Identify ONE neighborhood labeled on the map where two or more Asian ethnic groups reside.", points: 1,
        rubric: "1 pt: Accept: Walnut (Filipino + Chinese + Korean); Cerritos/Artesia (Filipino + Korean); Carson/Long Beach (Filipino overlap with other groups). Must name a specific neighborhood shown on the map with two identified ethnic groups." },
      { label: "B", question: "Describe the spatial pattern of Chinese ethnic neighborhoods labeled on the map.", points: 1,
        rubric: "1 pt: Chinese neighborhoods are concentrated in two clusters: (1) a large eastern suburban cluster (San Gabriel Valley — Alhambra, Arcadia, Monterey Park, Rosemead, San Gabriel, San Marino), and (2) a southeastern suburban cluster (Diamond Bar, Hacienda Heights, Rowland Heights, Walnut), plus Chinatown near downtown. Pattern shows suburban clustering in eastern LA County." },
      { label: "C", question: "Explain ONE way immigrants may choose to assimilate into their new place of residence.", points: 1,
        rubric: "1 pt: Assimilation = process of adopting the cultural norms of the host society. Examples: learning the dominant language (English); adopting local dietary habits; changing names to culturally familiar forms; intermarrying with members of the host culture; participating in mainstream cultural institutions (schools, workplaces, civic organizations). Must explain how the action integrates immigrants into dominant culture." },
      { label: "D", question: "Explain ONE way immigrants may preserve their ethnic traditions in their new place of residence.", points: 1,
        rubric: "1 pt: Cultural preservation strategies: establishing ethnic enclaves/neighborhoods; maintaining ethnic businesses and restaurants; celebrating traditional holidays/festivals; transmitting native language to children; ethnic churches/temples/mosques; ethnic newspapers/media; ethnic social organizations. Must explain how the strategy maintains cultural distinctiveness." },
      { label: "E", question: "Describe ONE way that ethnic neighborhoods may contribute to a sense of place in large metropolitan areas such as Los Angeles.", points: 1,
        rubric: "1 pt: Ethnic neighborhoods create distinct landscapes (signage in non-English languages, traditional architecture, ethnic businesses, cultural institutions) that make specific areas identifiable and meaningful to both residents and visitors. Koreatown, Chinatown, etc. give residents a feeling of community/belonging tied to shared cultural heritage, creating place-specific identity within a large anonymous metropolis." },
      { label: "F", question: "Explain how the process of redistricting may be used to decrease an ethnic community's political power.", points: 1,
        rubric: "1 pt: Redistricting (redrawing electoral district boundaries) can dilute ethnic communities' voting power through: cracking (splitting a concentrated community across multiple districts so it is a minority in each); packing (concentrating a community into one district, wasting votes and reducing influence in surrounding districts). Both reduce the community's ability to elect its preferred candidates." },
      { label: "G", question: "Explain how the process of redistricting may be used to increase an ethnic community's political power.", points: 1,
        rubric: "1 pt: Redistricting can increase power by creating majority-minority districts — drawing boundaries to concentrate a minority ethnic community into one district where it forms the majority of voters, ensuring the community can elect a representative of its choice. This was the intent of the Voting Rights Act majority-minority district provisions." },
    ]
  },

  // ─── 2024 Set 1 — Q3: Metacities and World Cities ────────────────────────
  {
    title: "AP Human Geography FRQ — Metacities, World Cities, and Globalization",
    prompt: "The world cities and metacities shown on the map are features of contemporary globalization and urbanization. The data table shows gross domestic product (GDP) per capita at the city and country scale.",
    stimulus: "Metacities and Top-Tier World Cities, 2020 (Source: United Nations)\n\nMap shows: Metacities (■) — Delhi, Mumbai, Shanghai, Tokyo/Yokohama, Beijing, Dhaka, Cairo, Mexico City, São Paulo. World cities (●) — New York City, Los Angeles, London, Paris, Amsterdam, Frankfurt, Hong Kong, Singapore, Manila. Metacity AND world city (⊕) — Tokyo, Hong Kong.\n\nSelected Cities Data:\nUrban Area | Pop 2000 | Pop 2020 | Growth | City GDP/cap | Country GDP/cap\nCairo | 13.6M | 20.9M | 54% | $4,865 | $3,609\nDhaka | 10.3M | 21.0M | 104% | $7,920 | $2,001\nNew York City | 17.9M | 18.8M | 5% | $86,615 | $63,529\nParis | 9.7M | 11.0M | 13% | $71,346 | $39,180\nSource: Values are estimates based on publicly available data.",
    parts: [
      { label: "A", question: "Identify ONE city on the map that is both a metacity and a world city.", points: 1,
        rubric: "1 pt: Tokyo (or Tokyo/Yokohama) OR Hong Kong. Both are shown with the combined metacity+world city symbol on the map." },
      { label: "B", question: "Describe the spatial pattern of world cities shown on the map.", points: 1,
        rubric: "1 pt: World cities are concentrated in the Global North — clustered in Western Europe (London, Paris, Amsterdam, Frankfurt) and North America (NYC, LA). Several are in Pacific Asia (Hong Kong, Singapore, Tokyo). Pattern reflects colonial economic history and global financial networks. Few world cities in Africa, Latin America, or South Asia — representing core-periphery spatial inequality." },
      { label: "C", question: "Compare the concept of a metacity with the concept of a world city. (Response must include both concepts in the comparison.)", points: 1,
        rubric: "1 pt: Must reference BOTH concepts. Metacity = an extremely large urban agglomeration with a population exceeding ~20 million. World city (global city) = a city that functions as a major node in the global economy, serving as a center of finance, corporate headquarters, media, and international organizations, regardless of its population size. A city can be a metacity (large population) without being a world city (global economic power), and vice versa. Tokyo is both." },
      { label: "D", question: "Explain ONE reason why the cities shown on the table have higher city GDP per capita than the country GDP per capita.", points: 1,
        rubric: "1 pt: Cities concentrate economic activity — agglomeration economies, financial services, corporate headquarters, skilled labor, infrastructure — producing higher output per person than the national average. Rural and less-developed regions of the same country drag down national GDP/cap. Dhaka's $7,920 vs Bangladesh's $2,001 shows rural Bangladesh far below Dhaka's urban productivity." },
      { label: "E", question: "Explain ONE way population growth in a metacity may challenge environmental sustainability.", points: 1,
        rubric: "1 pt: Rapid population growth in metacities (Cairo 54%, Dhaka 104%) stresses: water supply systems; waste management/sanitation; air quality from vehicle/industrial emissions; urban heat islands; flooding from inadequate drainage; loss of green space; informal settlements without proper infrastructure creating pollution. Must identify a specific environmental challenge and explain the mechanism." },
      { label: "F", question: "Explain ONE reason why migrants to metacities may have difficulty obtaining housing.", points: 1,
        rubric: "1 pt: Rapid in-migration exceeds formal housing supply → prices rise beyond migrant incomes; migrants lack credit history for mortgages; discrimination in formal housing markets; inadequate affordable housing construction; urban land speculation; zoning restricts affordable housing near job centers. Many migrants end up in informal settlements/slums (favelas, kampungs, shantytowns) as a result." },
      { label: "G", question: "Using the data from the table, explain the relationship between a city's level of economic development and the city's percent population growth over time.", points: 1,
        rubric: "1 pt: Inverse relationship — less economically developed cities (Dhaka, Cairo) have much higher population growth rates (104%, 54%) than more economically developed cities (NYC 5%, Paris 13%). High growth in developing-world metacities driven by high natural increase AND rural-to-urban migration. Developed world cities grow slowly (low birth rates, limited rural migration). Must use specific data from the table." },
    ]
  },

  // ─── 2024 Set 2 — Q1: Cultural Diffusion ─────────────────────────────────
  {
    title: "AP Human Geography FRQ — Cultural Diffusion and Landscape",
    prompt: "The interaction of people contributes to the spread of cultural practices that change over time and vary between places. Interactions among cultures can lead to new forms of cultural expression.",
    stimulus: null,
    parts: [
      { label: "A", question: "Describe ONE type of diffusion by which culture traits spread.", points: 1,
        rubric: "1 pt: Must name and describe one type: Expansion diffusion (trait spreads outward from origin while source retains it). Sub-types: contagious (person-to-person contact, like disease/religion), hierarchical (spreads through a hierarchy of power/size, city to city), or stimulus (idea spreads but changes form). Relocation diffusion: trait carried by people physically moving. Must correctly describe the mechanism." },
      { label: "B", question: "Describe the process of creolization of language.", points: 1,
        rubric: "1 pt: Creolization = when a simplified pidgin language (developed for trade/communication between speakers of different languages) becomes the primary native language of a community, developing its own grammar, vocabulary, and cultural richness. Examples: Haitian Creole (French + West African languages); Sranan Tongo (Suriname). Must include: origin from contact + stabilization as native tongue." },
      { label: "C", question: "Describe how the globalization of foods has influenced cultural patterns of food consumption.", points: 1,
        rubric: "1 pt: Globalization spreads food products and cuisines beyond their origin areas through trade, migration, and media. Examples: sushi restaurants in US cities; McDonald's in 100+ countries; avocado's global popularity from a Mexican staple; pizza's transformation from Italian to global. This changes local dietary patterns, displaces traditional foods, or creates fusion cuisines. Must describe a specific mechanism." },
      { label: "D", question: "Explain ONE way that agricultural land use practices may have negative environmental effects.", points: 1,
        rubric: "1 pt: Accept: deforestation for cropland (loses carbon storage, habitat); pesticide/fertilizer runoff (water eutrophication, dead zones); irrigation causing soil salinization or aquifer depletion; monoculture reducing biodiversity; livestock methane emissions; soil erosion from tillage. Must explain causal mechanism." },
      { label: "E", question: "Explain how a new style of music may be created as a result of cultural diffusion from different regions.", points: 1,
        rubric: "1 pt: When music traditions from different cultures meet (through migration, trade, colonialism, media), artists blend elements from each, creating hybrid/new genres. Examples: Jazz (West African rhythms + European harmonies + blues); reggae (Jamaican Rastafarian culture + American R&B); hip-hop (African-American + Jamaican DJ culture); Bossa Nova (Brazilian samba + American jazz). Must explain the diffusion mechanism." },
      { label: "F", question: "Explain how toponyms may result from the diffusion of religion across the cultural landscape.", points: 1,
        rubric: "1 pt: As religions spread, they leave their mark in place names. Examples: 'San/Santa/Saint' names in Americas from Spanish/French Catholic colonialism; 'Al-' Arabic prefixes in Spain from Islamic conquest; 'Church', 'Chapel', 'Minster' in English place names; '-abad' suffix in South Asian cities from Persian/Islamic influence. Toponyms reveal the historical geography of religious diffusion." },
      { label: "G", question: "Explain the degree to which the use of indigenous languages has been influenced by colonialism. (Response must indicate the degree [low, moderate, high] and provide an explanation.)", points: 1,
        rubric: "1 pt: High degree most defensible: Colonialism systematically suppressed indigenous languages through: mandatory use of colonial language in schools/government; outlawing indigenous languages; physical punishment for speaking indigenous languages in colonial schools; economic incentives for colonial language speakers. Result: hundreds of indigenous languages extinct or endangered. Examples: Native American languages, Aboriginal Australian languages. Must include degree AND explanation." },
    ]
  },

  // ─── 2024 Set 2 — Q2: Washington D.C. Metro Area ─────────────────────────
  {
    title: "AP Human Geography FRQ — Urban Transportation and Political Geography",
    prompt: "The map shows political jurisdictions and Metrorail, a subway system in the Washington, D.C., metropolitan area. The city and county jurisdictions shown on the map operate the Washington Metropolitan Area Transit Authority (WMATA), which runs Metrorail.",
    stimulus: "Washington, D.C., and Surrounding Jurisdictions (Source: ESRI Data Partners)\n\nMap shows: Washington D.C. (federal district) bordered by Maryland (Montgomery County, Prince Georges County) and Virginia (Arlington County, Fairfax County, City of Alexandria, City of Falls Church). Metrorail lines cross jurisdictional boundaries, connecting DC with suburban Maryland and Virginia. Transfer stations marked. Reagan National Airport in Arlington County. Potomac and Anacostia Rivers shown.",
    stimulus_image_description: "Map of DC metro area showing Metrorail crossing DC, Maryland, and Virginia jurisdictional boundaries",
    parts: [
      { label: "A", question: "Identify ONE type of boundary shown on the map.", points: 1,
        rubric: "1 pt: Accept any boundary type visible on the map: state boundary (Maryland/Virginia/DC); county border (Montgomery County/Prince Georges County); municipal boundary (City of Alexandria, City of Falls Church). Must name the boundary type AND identify it on the map." },
      { label: "B", question: "Describe ONE site characteristic of Washington, D.C., shown on the map.", points: 1,
        rubric: "1 pt: Site characteristics = physical features of the specific location. From the map: location at the confluence of the Potomac and Anacostia Rivers; presence of rivers creating natural boundaries; relatively flat terrain (implied by urban development pattern); diamond-shaped federal district. Must describe a physical/locational characteristic of DC itself shown on the map." },
      { label: "C", question: "Explain how political power is spatially distributed within a federal system of governance.", points: 1,
        rubric: "1 pt: In a federal system, political authority is constitutionally divided between a central national government and subnational territorial units (states, provinces). Each level has sovereignty over defined areas — states control education, criminal law, many taxes; federal controls defense, interstate commerce, foreign policy. This creates overlapping spatial jurisdictions — the same territory falls under both state and federal authority simultaneously. DC is unique as a federal district not governed by a state." },
      { label: "D", question: "Explain ONE way suburban sprawl is likely to negatively affect environmental sustainability in metropolitan areas.", points: 1,
        rubric: "1 pt: Suburban sprawl (low-density development spreading outward) effects: increased car dependence → more carbon emissions; loss of agricultural land and wetlands to development; increased impervious surfaces → stormwater runoff, flooding; urban heat island expansion; destruction of wildlife habitat and green corridors; longer utility infrastructure increases material and energy use." },
      { label: "E", question: "Describe ONE way transportation-oriented development, such as expanding a Metrorail line, may promote urban sustainability.", points: 1,
        rubric: "1 pt: Transit-oriented development (TOD) concentrates housing, commercial, and employment near transit stations, reducing car dependence. Benefits: reduced vehicle miles traveled → lower carbon emissions; higher-density development preserves open land; walkable communities reduce energy use; revitalizes urban areas; encourages mixed-use zoning. Must describe a specific sustainability benefit." },
      { label: "F", question: "Explain how regional transportation networks led to the development of edge cities.", points: 1,
        rubric: "1 pt: Highway/beltway construction created accessibility to suburban nodes previously isolated. Developers built office parks, shopping malls, and commercial centers at highway interchanges where land was cheap and accessible. Fairfax County's Tysons Corner (near I-495/I-66) exemplifies an edge city emerging at a highway node. Metrorail extension to Tysons further densified it. Transportation access = catalyst for edge city development." },
      { label: "G", question: "Explain how the geographic fragmentation of local governments could present a challenge to the Washington, D.C., metropolitan area's ability to construct a new Metrorail line.", points: 1,
        rubric: "1 pt: WMATA operates across DC, Maryland, and Virginia — each a separate political jurisdiction with different governments, budgets, and priorities. A new line requires: agreement among all affected jurisdictions on routing, cost-sharing, and land use; separate funding/approval processes in each legislature; zoning coordination across county lines; potential veto by any jurisdiction. Political fragmentation means no single authority can unilaterally plan or fund regional infrastructure." },
    ]
  },

  // ─── 2024 Set 2 — Q3: Demographic Transition Model ───────────────────────
  {
    title: "AP Human Geography FRQ — Demographic Transition and Population Policy",
    prompt: "The demographic transition model can be used to theorize the changes in a country's total population over time.",
    stimulus: "Demographic Transition Model diagram (stages 1-5 showing birth rate, death rate, and total population curves over time)\n\nDemographic Data for Selected Countries, 2019 (Source: World Bank):\nCountry | Birth Rate | Death Rate | Population Over Age 65\nCroatia | 9 | 13 | 21%\nEstonia | 11 | 12 | 20%\nGermany | 9 | 11 | 22%\nGreece | 8 | 12 | 22%\nJapan | 7 | 11 | 28%\nPortugal | 8 | 11 | 23%\nRomania | 10 | 13 | 19%",
    parts: [
      { label: "A", question: "Select ONE country listed in the table and identify its stage in the demographic transition model.", points: 1,
        rubric: "1 pt: Must name a country AND correctly identify the DTM stage with justification. All countries in the table are Stage 4 or 5 (low birth AND death rates; CDR ≥ CBR in most, indicating Stage 5). Japan (CBR=7, CDR=11, 28% age 65+) → Stage 5 is most defensible. Germany, Greece, Portugal, Croatia, Romania: CDR > CBR → Stage 5 or late Stage 4. Must justify using the data." },
      { label: "B", question: "Define the concept of a pronatalist policy.", points: 1,
        rubric: "1 pt: A government policy designed to INCREASE the birth rate/total fertility rate. Examples: financial incentives (baby bonuses, tax credits per child); subsidized childcare; extended parental leave; housing benefits for larger families. Aims to reverse population decline or maintain population size. Romania under Ceaușescu, Singapore's 1980s policy are examples." },
      { label: "C", question: "Explain ONE factor that affects birth rates as countries move from stage 3 to stage 4 in the demographic transition model.", points: 1,
        rubric: "1 pt: Stage 3→4 transition: birth rates fall from moderate to low. Factors: increased women's education and labor force participation → delayed marriage and childbearing; urbanization → children become economic costs rather than assets; access to contraception; declining infant mortality → fewer births needed to achieve desired family size; cultural shift toward smaller families. Must identify and explain a specific mechanism." },
      { label: "D", question: "Describe ONE likely economic effect when countries have negative population growth.", points: 1,
        rubric: "1 pt: Negative population growth → shrinking workforce → labor shortages; higher wages but reduced total economic output; increased dependency ratio (more retirees per worker); pension/healthcare systems under fiscal stress; housing market contraction; consumer market shrinkage; need for immigration to fill labor gaps; governments face increased social spending with reduced tax base." },
      { label: "E", question: "Based on the data shown in the table, describe a policy that a government might develop in response to demographic change.", points: 1,
        rubric: "1 pt: Data shows all countries have aging populations (high % 65+) and low/negative natural increase. Policy responses: pronatalist policies (baby bonuses, childcare); immigration policy to attract working-age immigrants; raising retirement age; pension reform; eldercare expansion; workforce retraining. Must reference the specific demographic data (aging, low birth rates, CDR > CBR) to justify the policy." },
      { label: "F", question: "Explain ONE reason why the life expectancy in urban areas may be higher than the life expectancy in the entire country.", points: 1,
        rubric: "1 pt: Urban areas have: better access to hospitals, specialist physicians, emergency care; higher incomes → better nutrition and healthcare; better infrastructure (clean water, sanitation); more educated population → better health behaviors and preventive care. Rural areas in same country may lack these advantages, dragging down national average life expectancy." },
      { label: "G", question: "Using the data in the table, explain how, over time, low birth rates may impact the country's percent of population over age 65.", points: 1,
        rubric: "1 pt: Low birth rates (e.g., Japan CBR=7) produce small young cohorts. Over decades, as these small cohorts age, they become a smaller share of the total working-age population. Meanwhile, existing large elderly cohorts remain. Result: the proportion of population 65+ INCREASES over time (already high: Japan 28%). Japan's aging trajectory shows this — small young cohorts today means an even higher elderly percentage in future decades." },
    ]
  },

  // ─── 2023 Set 2 — Q1: Territoriality and Sovereignty ─────────────────────
  {
    title: "AP Human Geography FRQ — Territoriality, Sovereignty, and Political Geography",
    prompt: "Political geographers analyze territoriality and sovereignty at a variety of scales, including regional, state, substate regional, and local.",
    stimulus: null,
    parts: [
      { label: "A", question: "Define the concept of territoriality in terms of political geography.", points: 1,
        rubric: "1 pt: Territoriality = the attempt by an individual, group, or state to affect, influence, or control people, phenomena, and relationships by delimiting and asserting control over a geographic area (territory). Includes marking, defending, and controlling defined space. At the state level: a state claims exclusive control over its defined territory and enforces this through law, military, and borders." },
      { label: "B", question: "Describe the concept of sovereignty as it relates to the state.", points: 1,
        rubric: "1 pt: Sovereignty = the supreme authority of a state to govern itself within its territorial boundaries without interference from external powers. A sovereign state has the right to make laws, collect taxes, conduct foreign policy, and use force within its territory. Recognized by other states. Core attribute of statehood in international law." },
      { label: "C", question: "Compare ONE difference in territorial organization between the governments of unitary states and the governments of federal states.", points: 1,
        rubric: "1 pt: Must compare BOTH. Unitary state: central government holds supreme authority; subnational units (regions, municipalities) have only delegated powers that can be revoked by the center; uniform laws across the state (France, Japan, UK). Federal state: constitutional division of power between national government and subnational units (states, provinces) that have their own sovereignty; subnational governments cannot be abolished by center (USA, Canada, Germany)." },
      { label: "D", question: "Recently, the United Kingdom decided to withdraw from the European Union. Explain ONE possible reason why sovereignty would play a role in the United Kingdom's decision to withdraw from the European Union.", points: 1,
        rubric: "1 pt: EU membership requires member states to accept EU regulations, Court of Justice decisions, and policies as supreme over national law. Brexit supporters argued this undermined UK parliamentary sovereignty — the principle that the UK Parliament is the supreme law-making authority. EU rules on immigration (free movement), trade, environmental standards, etc. constrained what the UK Parliament could independently decide. 'Take back control' summarized this sovereignty argument." },
      { label: "E", question: "During the United Kingdom's withdrawal from the European Union, some people in Scotland proposed independence from the United Kingdom. Explain ONE possible reason why territoriality would play a role in the devolution of a state.", points: 1,
        rubric: "1 pt: Scotland's independence movement reflects territorial identification — Scots define their national identity around a distinct territory, language, cultural practices, and political values separate from England. Scottish Parliament (Holyrood) represents territorial-based governance. Brexit showed England and Scotland voting differently (Scotland 62% Remain), intensifying territorial political divergence. Devolution: distinct territory + distinct political identity → demand for autonomous or independent governance over that territory." },
      { label: "F", question: "Local governments often divide cities into representative electoral districts. Explain how the process of redrawing district boundary lines may affect election results within a city.", points: 1,
        rubric: "1 pt: Redistricting (gerrymandering) alters which voters are grouped into each district, directly affecting election outcomes. Cracking splits a community across multiple districts (diluting its vote); packing concentrates a group into one district (wasting votes). District shape determines winner — same voters, different boundaries = different election results. Must explain the mechanism connecting boundary changes to outcomes." },
      { label: "G", question: "Explain why neighboring local governments may face challenges in providing transportation services to residents of a rapidly growing metropolitan area.", points: 1,
        rubric: "1 pt: Metropolitan areas cross multiple local government jurisdictions, each with separate budgets, priorities, planning processes, and legal authority. Coordinating regional transit requires: agreement on funding formulas; unified planning across jurisdictions; overcoming political opposition from jurisdictions that don't benefit equally; different land use regulations preventing transit-oriented development; lack of a regional authority with binding power over all jurisdictions." },
    ]
  },

  // ─── 2023 Set 2 — Q2: Development Indicators ─────────────────────────────
  {
    title: "AP Human Geography FRQ — Human Development and Sustainability",
    prompt: "In 1990 the United Nations (UN) began using the Human Development Index (HDI) to measure levels of development. In 2015 the UN established the Sustainable Development Goals (SDGs) to set targets for environmental quality, economic development, and social programs.",
    stimulus: "Development Indicators for Selected Countries, 2020 (Source: World Bank, UNICEF)\n\nCountry | GNI per Capita | % Workforce Agriculture | Total Fertility Rate | Mean Years Schooling (W/M) | Life Expectancy | Air Pollution Mortality Rate (per 100,000) | % Access Clean Fuels\nAfghanistan | $1,976 | 39% | 4.5 | 1.9/6.0 | 61 | 211 | 32%\nBrazil | $10,857 | 9% | 1.7 | 8.0/7.7 | 69 | 30 | 96%\nFinland | $46,343 | 3% | 1.6 | 12.6/12.3 | 81 | 7 | 100%",
    parts: [
      { label: "A", question: "Using the data categories in the table, identify ONE indicator that is used to calculate HDI scores.", points: 1,
        rubric: "1 pt: HDI = Life Expectancy Index + Education Index + Income Index. Accept: Life Expectancy (from the Life Expectancy column); Mean Years of Schooling/GNI per capita. Do NOT accept: TFR, air pollution mortality, clean fuels, % agriculture — these are NOT HDI components." },
      { label: "B", question: "Using a different indicator than the one identified in part A, explain why Brazil's HDI score is higher than that of Afghanistan.", points: 1,
        rubric: "1 pt: Must use an indicator NOT used in Part A. Examples: GNI/capita ($10,857 vs $1,976 — Brazil's higher income supports greater HDI); % access to clean fuels (96% vs 32%); women's education (8.0 vs 1.9 mean years — higher women's education correlates with higher HDI); air pollution mortality (30 vs 211 — lower rate reflects better development). Must compare specific data and explain the HDI connection." },
      { label: "C", question: "The UN and many countries have promoted sustainability principles. Describe ONE specific way that sustainability goals can respond to economic challenges.", points: 1,
        rubric: "1 pt: Accept: investment in renewable energy creates jobs while reducing fossil fuel dependence; sustainable agriculture increases long-term food security while reducing environmental degradation; ecotourism generates income while preserving biodiversity; green building codes reduce energy costs long-term; circular economy models reduce resource waste and create new industries. Must be specific and connect sustainability to economic benefit." },
      { label: "D", question: "Explain ONE reason why increasing women's access to education is likely to affect a country's total fertility rate.", points: 1,
        rubric: "1 pt: Education → delayed marriage and first birth; educated women have greater economic opportunities → higher opportunity cost of childbearing; better access to family planning information; greater autonomy in reproductive decisions; correlates with lower desired family size. Afghanistan's gender education gap (1.9 vs 6.0 years women vs men) and TFR of 4.5 vs Finland/Brazil below 2.0 illustrates this." },
      { label: "E", question: "SDG 8 is to 'promote sustained, inclusive and sustainable economic growth.' Explain ONE way in which a country's development of ecotourism might affect economic growth.", points: 1,
        rubric: "1 pt: Ecotourism (nature/sustainability-focused tourism) effects: generates foreign currency income; creates rural employment without traditional industrialization; provides incentive for conservation (environmental capital preserved); can develop infrastructure (roads, communications) benefiting local economy; limits destructive extractive industries. Must explain a specific economic mechanism." },
      { label: "F", question: "Using data from the table, explain how access to clean-burning fuels for people's homes relates to the life expectancy of a country's population.", points: 1,
        rubric: "1 pt: Must use DATA. Afghanistan: 32% clean fuel access, life expectancy 61. Brazil: 96%, life expectancy 69. Finland: 100%, life expectancy 81. Pattern: higher clean fuel access correlates with higher life expectancy. Indoor air pollution from burning wood/dung/coal causes respiratory disease, cardiovascular disease, childhood mortality. Clean fuels (gas, electricity) reduce indoor pollution → better health → longer life." },
      { label: "G", question: "Explain how ONE of the countries in the table would be classified according to Rostow's stages of economic growth.", points: 1,
        rubric: "1 pt: Must name a country and a Rostow stage with justification. Finland: High mass consumption (Stage 5) — $46,343 GNI/cap, 3% in agriculture, 100% clean fuels, high education. Afghanistan: Traditional society/Preconditions (Stage 1/2) — 39% in agriculture, low GNI, 32% clean fuels. Brazil: Take-off/Drive to maturity (Stage 3/4) — $10,857 GNI, 9% agriculture, significant industry. Must justify with data." },
    ]
  },

  // ─── 2023 Set 2 — Q3: Pastoral Nomadism in the Sahel ─────────────────────
  {
    title: "AP Human Geography FRQ — Pastoral Nomadism and the Sahel Region",
    prompt: "Pastoral nomadism is widely practiced in the Sahel region of Africa. The map and table provide information about spatial patterns and social tensions associated with this type of agriculture.",
    stimulus: "Pastoral Nomadism in the Sahel Region of Africa (Source: Food and Agriculture Organization)\n\nMap shows the Sahel belt (semiarid grassland between Sahara and tropical forest), covering Mauritania, Senegal, Mali, Burkina Faso, Niger, Chad, Sudan. Migration routes shown as arrows moving seasonally north-south. Protected natural areas shown in dark shading scattered across the Sahel. Atlantic Ocean to the west.\n\nSources of Tension Related to Pastoral Nomadism (Source: OECD):\nGroups | Potential Sources of Tension\nNomadic herders vs. crop farmers | Damage to fields by migrating herds; Overgrazing by migrating herds; Competition for access to water; Increasing size of crop farms\nNomadic herders vs. conservation organizations | Grazing of protected areas; Degradation of natural habitats\nNomadic herders vs. government officials | Failure to follow regulations on cross-border migration; Activities such as smuggling foreign goods",
    stimulus_image_description: "Map of Sahel region showing pastoral migration routes, protected areas, and Sahara boundary",
    parts: [
      { label: "A", question: "Describe ONE reason for the migration patterns shown on the map.", points: 1,
        rubric: "1 pt: Pastoral nomads follow seasonal rainfall and vegetation growth. In the wet season, herders move northward toward the Saharan margins as grasses grow. In the dry season, they move southward toward the more humid Sahel/savanna where water and pasture remain available. Migration tracks the movement of the Intertropical Convergence Zone (ITCZ). This transhumance pattern allows herds to exploit dispersed and variable resources." },
      { label: "B", question: "Describe ONE cause of desertification in the Sahel region.", points: 1,
        rubric: "1 pt: Accept: overgrazing by herds removes vegetation cover, exposing soil to wind erosion; deforestation for fuelwood and cropland removes root systems holding soil; population growth forcing cultivation of marginal lands; climate change reducing and variabilizing rainfall; soil compaction from heavy cattle hooves. Must identify a specific cause with brief description of mechanism." },
      { label: "C", question: "Explain how pastoral nomadism may affect the cultural landscape of the Sahel region.", points: 1,
        rubric: "1 pt: Pastoral nomadism creates a distinct cultural landscape: temporary/seasonal settlements (camps rather than permanent villages); worn migration paths/tracks visible on satellite imagery; water wells and seasonal water sources become culturally significant nodes; markets at seasonal gathering points; minimal permanent architecture; grazing-modified vegetation patterns; cultural exchange points where herders and farmers interact. Must connect nomadic practice to a specific landscape feature." },
      { label: "D", question: "Explain ONE way mixed-crop farming could be affected by climatic conditions.", points: 1,
        rubric: "1 pt: Mixed-crop farming (growing multiple crops simultaneously) in the Sahel is vulnerable to: drought reducing rainfall below crop minimum requirements; flood damage from intense rainfall events; irregular rainfall timing disrupting planting schedules; temperature extremes affecting crop maturity. Climate change is increasing rainfall variability in the Sahel, making mixed-crop yields less predictable." },
      { label: "E", question: "Using the map and table, explain why expanding protected natural areas may affect the migration routes of nomadic herders in the Sahel region.", points: 1,
        rubric: "1 pt: Must reference both map AND table. Map shows: protected areas (dark shading) are distributed across the Sahel migration corridor. Table shows: herders vs. conservation organizations conflict includes 'grazing of protected areas.' Expanding protected areas closes off land that herders have traditionally used for grazing and passage, forcing them to alter routes around protected zones — extending travel distances, increasing conflict with farmers as herders concentrate in remaining corridors, and reducing access to water sources within protected areas." },
      { label: "F", question: "Using the information in the table, explain why farmers' increased use of irrigation may increase conflicts with nomadic herders.", points: 1,
        rubric: "1 pt: Must reference the table. Table shows: nomadic herders vs. crop farmers includes 'competition for access to water.' Irrigation requires farmers to claim and monopolize water sources (wells, rivers, seasonal water points) that herders depend on for their livestock. Expanding irrigated farmland also increases the size of fields (table: 'increasing size of crop farms'), further restricting herder movement and increasing the chance of herd damage to crops. Both water competition and land enclosure intensify with irrigation." },
      { label: "G", question: "Explain the degree to which increased access to communication technologies may create cultural convergence among nomadic herders.", points: 1,
        rubric: "1 pt: Requires degree + explanation. Moderate most defensible: Communication technology (mobile phones, internet) connects dispersed nomadic communities to mainstream culture/media, promoting awareness of non-nomadic lifestyles and consumption patterns (convergence). However, nomads may use technology to reinforce nomadic culture (coordinating movements, maintaining traditions), not adopt sedentary culture. High degree: media exposure to global popular culture overrides local traditions. Low degree: remote areas have limited connectivity; nomadic lifestyle remains unchanged. Must include degree AND specific mechanism." },
    ]
  },

  // ─── 2023 Set 1 — Q1: Rate of Natural Increase ───────────────────────────
  {
    title: "AP Human Geography FRQ — Rate of Natural Increase and Population Policy",
    prompt: "The rate of natural increase (RNI), also known as the natural increase rate, helps geographers assess annual population growth or decline.",
    stimulus: null,
    parts: [
      { label: "A", question: "Define the concept of RNI.", points: 1,
        rubric: "1 pt: RNI = crude birth rate (CBR) minus crude death rate (CDR), expressed as a percentage of the population per year. It represents annual population change from births and deaths only, excluding migration. Formula: RNI = (CBR − CDR) / 10 (to convert per 1,000 to %). Or: the annual percent change in population not including immigration or emigration." },
      { label: "B", question: "Describe how a country may have a negative RNI.", points: 1,
        rubric: "1 pt: A country has negative RNI when the CDR exceeds the CBR — more people die each year than are born. This occurs in Stage 4/5 of the DTM when fertility rates fall below replacement and aging populations have high death rates. Examples: Japan, Germany, Eastern European countries where CDR > CBR." },
      { label: "C", question: "Compare ONE difference between RNI and the total fertility rate as indicators of population change.", points: 1,
        rubric: "1 pt: Must compare BOTH. RNI: measures annual population change from births AND deaths, expressed as percentage per year; annual statistic. TFR: estimates average number of children a woman will bear in her lifetime based on current age-specific fertility rates; measure of fertility only (no mortality); threshold of 2.1 = replacement rate. Key difference: RNI accounts for deaths; TFR only measures births. RNI can be negative; TFR cannot." },
      { label: "D", question: "Explain ONE reason why RNI in urban areas may vary significantly from RNI in rural areas in the same country.", points: 1,
        rubric: "1 pt: Urban areas have lower CBR (higher education, women's employment, higher childcare costs, less agricultural need for child labor) while CDR may be similar or lower (better healthcare). Rural areas often have higher CBR and sometimes higher CDR (less healthcare access). Net effect: urban RNI often lower than rural RNI in LDCs. In MDCs, pattern may differ due to selective rural-to-urban migration of young adults." },
      { label: "E", question: "Explain why there are often differences in doubling times between less developed countries and more developed countries.", points: 1,
        rubric: "1 pt: LDCs have higher RNI (high CBR not yet offset by CDR decline in early DTM stages) → shorter doubling times. MDCs have low or negative RNI (both CBR and CDR low, often CDR > CBR) → very long or infinite doubling times. Doubling time = 70/RNI%. A country with RNI of 3.5% doubles in 20 years; RNI of 0.5% doubles in 140 years." },
      { label: "F", question: "Explain ONE reason ethnonationalism might lead a government to promote pronatalist policies.", points: 1,
        rubric: "1 pt: Ethnonationalism = belief that ethnic/national identity should be central to political life. Government may promote pronatalist policies to: maintain or increase the size of a specific ethnic group relative to minorities (Israel's pronatalist incentives; Romania under Ceaușescu targeting Romanian population); ensure military manpower; maintain economic and political dominance of majority ethnic group. Children seen as demographic future of the nation." },
      { label: "G", question: "Explain the degree to which a unitary government may be more effective than a federal government in enforcing antinatalist policies. (Response must indicate the degree [low, moderate, high] and provide an explanation.)", points: 1,
        rubric: "1 pt: Requires degree + explanation. Moderate or high most defensible: Unitary governments can implement uniform nationwide antinatalist policies (China's one-child policy implemented centrally) without regional variation or subnational resistance. Federal governments face variation in policy implementation across states/provinces (some may resist enforcement). However, low is acceptable if: economic/cultural factors override governmental structure in determining fertility; both system types have succeeded and failed." },
    ]
  },

  // ─── 2023 Set 1 — Q2: Staple Food Crops ──────────────────────────────────
  {
    title: "AP Human Geography FRQ — Staple Food Crops and Agricultural Diffusion",
    prompt: "Staple food crops provide most of the carbohydrates in people's diets, and some staples are also used as animal feed or in the distillation of ethanol. Cassava is a root crop (tuber) that is the source of farinha, tapioca, and the pearls in bubble tea.",
    stimulus: "Per Capita Production of Staple Food Crops in Hearth-of-Domestication Countries (Source: FAO, United Nations)\n\nCrop hearths: Corn → Mexico; Potato → Peru; Rice → China and Mali; Yam → Niger River basin; Cassava → Amazon River basin\n\nCountry | Corn (lbs/cap) | Potato (lbs/cap) | Rice (lbs/cap) | Yam (lbs/cap) | Cassava (lbs/cap)\nBrazil | 1,056 | 39 | 108 | 3 | 183\nChina | 412 | 145 | 333 | 0 | 52\nMexico | 471 | 31 | 4 | 0 | 0\nNigeria | 121 | 15 | 93 | 549 | 618\nPeru | 107 | 362 | 216 | 0 | 13",
    parts: [
      { label: "A", question: "Describe the concept of an early hearth of domestication.", points: 1,
        rubric: "1 pt: A hearth of domestication is a location where humans first converted wild plant or animal species into domesticated, cultivated forms through selective breeding and agricultural practices. The crop or animal originates here before diffusing outward. Examples: Fertile Crescent (wheat, barley), Southeast Asia (rice), Central America (corn/maize). Must include the idea of origin/first cultivation." },
      { label: "B", question: "Identify the crop listed in the table that has diffused the least from its hearth of domestication to the countries listed in the table.", points: 1,
        rubric: "1 pt: Yams. The yam hearth is the Niger River basin (Nigeria/West Africa). In the table, ONLY Nigeria produces significant yams (549 lbs/capita). All other countries listed (Brazil, China, Mexico, Peru) show 0 yam production, indicating minimal diffusion from the West African hearth to these countries. Cassava shows some diffusion (Brazil 183; China 52) and rice has clearly diffused globally." },
      { label: "C", question: "Explain how food preferences can be a culture trait.", points: 1,
        rubric: "1 pt: A culture trait is a specific practice, belief, or artifact shared by a cultural group. Food preferences (what people eat, how they prepare food, what is considered edible or taboo) are culturally transmitted across generations and distinguish cultural groups. Example: Rice as a staple in East Asian cultures (cultural identity and daily practice); wheat bread in European cultures; yam in West African cuisines. Foods become symbols of cultural identity." },
      { label: "D", question: "Explain how the Columbian Exchange contributed to a crop's diffusion beyond its hearth of domestication.", points: 1,
        rubric: "1 pt: Columbian Exchange (1492+) = transfer of plants, animals, and diseases between Americas and Old World via European exploration/colonialism. European colonizers encountered New World crops (corn, potato, cassava, tomato) and transported them back to Europe, Africa, and Asia through relocation diffusion. Then colonial expansion spread these crops further. Brazil's high corn production (1,056 lbs/cap) reflects how the Columbian Exchange enabled New World crops to become globally significant." },
      { label: "E", question: "Explain how the data in the table support the concept of a crop's consumption pattern being the result of globalization.", points: 1,
        rubric: "1 pt: Globalization = economic, cultural, and technological integration across global distances. The data shows crops being produced far from their hearths: Brazil produces 1,056 lbs corn/cap (hearth: Mexico); Peru produces 216 lbs rice/cap (hearth: China/Mali); China produces 412 lbs corn/cap. This global production distribution reflects globalized trade networks, seed technology transfer, and changing food systems that move crops far beyond their origin areas." },
      { label: "F", question: "Explain why a crop may be farmed intensively in a less developed country and be farmed extensively in a more developed country.", points: 1,
        rubric: "1 pt: In LDCs: small farms, abundant low-wage labor, limited capital for machinery → intensive farming (high labor input per hectare, small plots, subsistence or local market focus). In MDCs: large farms, expensive labor, abundant capital and technology → extensive farming (mechanized, large-scale, few workers per hectare). Same crop (e.g., corn in Mexico vs. Iowa) is produced by fundamentally different methods reflecting factor endowments." },
      { label: "G", question: "Explain ONE way the global supply chain links crops such as those listed in the table to consumers in other countries.", points: 1,
        rubric: "1 pt: Global supply chain = network of producers, processors, transporters, wholesalers, and retailers. A crop grown in one country moves through: harvesting → processing/packaging → containerization → ocean shipping → port receiving → inland transport → wholesale distribution → retail sale. Cassava pearls from Southeast Asia reach US bubble tea shops via this chain. Must explain a specific stage or mechanism connecting production location to distant consumption." },
    ]
  },

  // ─── 2023 Set 1 — Q3: Boston/Providence Biotech Cluster ──────────────────
  {
    title: "AP Human Geography FRQ — High-Technology Industry and Urban Geography",
    prompt: "Since the 1980s, the northeastern United States has developed into a major global center of high-technology industry that specializes in the medical field.",
    stimulus: "Major Medical and Biotechnology Companies and Institutions in the Boston and Providence Region (Source: National Institutes of Health)\n\nInset map shows downtown Boston and Cambridge: Harvard University, MIT, Moderna, Harvard Medical School, Boston University, Northeastern University, Tufts University School of Medicine, Boston University School of Medicine. Major research hospitals (H symbol) clustered in Boston/Cambridge core.\n\nRegional map shows: Medical technology equipment manufacturers (◆) dispersed along Routes 128, 495, 90, 95. Biotechnology R&D firms (●) concentrated near Boston/Cambridge. Pharmaceutical manufacturers (▲) scattered in suburban locations. University of Massachusetts Medical School in Worcester. Brown University Medical School in Providence, Rhode Island.\n\nSelected Technology Research in Medical Field:\nBiotechnology: genetic engineering, biochemistry research, diagnostic/testing science\nGene therapies: cancer treatments, neurological treatments, rare/genetic disease treatments, antiviral treatments (e.g., Moderna)",
    stimulus_image_description: "Map showing biotech/medical cluster in Boston/Cambridge core with suburban dispersion along Route 128 corridor",
    parts: [
      { label: "A", question: "Describe the spatial pattern of the companies and institutions shown in the inset map.", points: 1,
        rubric: "1 pt: Agglomeration/clustering of similar economic activities concentrated in and around Boston/Cambridge. Universities and hospitals cluster along the Charles River (Cambridge/Boston core). Medical/biotech firms locate in close proximity to these knowledge institutions. Pattern is nucleated/concentrated, not dispersed." },
      { label: "B", question: "Describe the concept of a growth pole.", points: 1,
        rubric: "1 pt: A growth pole is a location (typically an innovative firm, university, or research institution) that generates new economic activity, innovation, and investment, attracting related businesses to cluster nearby. The growth pole creates economic expansion that spreads to the surrounding region (spread effects). MIT and Harvard function as growth poles for the Boston biotech cluster." },
      { label: "C", question: "Explain ONE way education infrastructure affects a region's potential for high-technology development.", points: 1,
        rubric: "1 pt: Universities produce skilled graduates (engineers, scientists, physicians) who remain in the region and join or found technology companies. Research universities generate intellectual property and innovation that spin off into new firms. Educational institutions attract researchers from elsewhere, building human capital. Boston's density of research universities (Harvard, MIT, BU, Northeastern, Tufts) provides a continuous supply of skilled workers for biotech firms." },
      { label: "D", question: "Explain how the pattern shown on the map resembles the galactic city model.", points: 1,
        rubric: "1 pt: The galactic city model (Harris, 1997) shows a dispersed metropolitan landscape with multiple suburban nodes connected by circumferential highways, without a single dominant center. The map shows: Boston CBD as major center; Route 128 and I-495 as circumferential beltways; suburban nodes (Worcester, Providence) with pharmaceutical and manufacturing firms at highway interchanges; decentralized development across the metro region. This polycentric, highway-dependent pattern reflects the galactic city model." },
      { label: "E", question: "Explain ONE way local economic changes may be a result of deindustrialization.", points: 1,
        rubric: "1 pt: Deindustrialization = loss of manufacturing industry from a region. Economic effects: manufacturing job loss → increased unemployment in affected communities; decline in wages for remaining workers; reduced local tax base → cuts in public services; vacant industrial land (brownfields); decline in retail and service sectors dependent on manufacturing workers' incomes. Boston's transition from textile/shoe manufacturing to biotech/services is an example." },
      { label: "F", question: "Explain how the products and services listed in the table demonstrate that this economy has moved into the quaternary sector.", points: 1,
        rubric: "1 pt: Quaternary sector = knowledge-based, information, research, and intellectual services (higher-order than manufacturing/tertiary). The listed products — genetic engineering, biochemistry research, diagnostic science, gene therapies — require highly educated workers, generate intellectual property rather than physical goods, involve R&D rather than manufacturing, and produce knowledge that is then licensed or applied. This is the defining characteristic of quaternary economic activity." },
      { label: "G", question: "The map focuses on a regional scale. Explain a possible limitation of drawing country scale conclusions from a regional scale map.", points: 1,
        rubric: "1 pt: A regional scale map shows detailed patterns for one area (Boston/Providence) but cannot represent national patterns. Limitation: the biotech cluster in Boston is not representative of all US regions — most regions lack this concentration. Drawing national conclusions (e.g., 'the US is a biotech leader') from regional data commits the ecological fallacy — applying region-specific findings to the whole. Other US regions may be very different (rural areas, manufacturing-dependent cities, less research university density)." },
    ]
  },
];

// ─── Helper: get shuffled pool of real FRQs ──────────────────────────────────
export function getShuffledRealFRQs(count = 2) {
  const shuffled = [...AP_HUG_REAL_FRQS];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}