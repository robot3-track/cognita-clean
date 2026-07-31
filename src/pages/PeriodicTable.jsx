import { useState, useMemo } from "react";
import { X, Search, Atom } from "lucide-react";

// ── Element Data ──────────────────────────────────────────────────────────────
const ELEMENTS = [
  { n:1,  sym:"H",  name:"Hydrogen",      mass:1.008,    cat:"nonmetal",        period:1, group:1,  phase:"gas",    eConfig:"1s¹",                    en:2.20, mp:-259.1, bp:-252.9, density:0.0000899, discovered:1766, discoverer:"Cavendish",    shells:[1],                summary:"The lightest and most abundant element in the universe. Makes up about 75% of all normal matter by mass." },
  { n:2,  sym:"He", name:"Helium",         mass:4.003,    cat:"noble-gas",       period:1, group:18, phase:"gas",    eConfig:"1s²",                    en:null, mp:-272.2, bp:-268.9, density:0.000164,  discovered:1868, discoverer:"Janssen",      shells:[2],                summary:"Noble gas, second most abundant in the universe. Used in balloons, MRI scanners, and as a cooling agent." },
  { n:3,  sym:"Li", name:"Lithium",        mass:6.941,    cat:"alkali-metal",    period:2, group:1,  phase:"solid",  eConfig:"[He] 2s¹",               en:0.98, mp:180.5,  bp:1342,   density:0.534,     discovered:1817, discoverer:"Arfwedson",   shells:[2,1],              summary:"Lightest metal element. Used in batteries, glass, and psychiatric medications." },
  { n:4,  sym:"Be", name:"Beryllium",      mass:9.012,    cat:"alkaline-earth",  period:2, group:2,  phase:"solid",  eConfig:"[He] 2s²",               en:1.57, mp:1287,   bp:2469,   density:1.85,      discovered:1798, discoverer:"Vauquelin",   shells:[2,2],              summary:"Strong, lightweight metal used in aerospace and nuclear industries. Highly toxic." },
  { n:5,  sym:"B",  name:"Boron",          mass:10.811,   cat:"metalloid",       period:2, group:13, phase:"solid",  eConfig:"[He] 2s² 2p¹",           en:2.04, mp:2077,   bp:4000,   density:2.34,      discovered:1808, discoverer:"Davy",         shells:[2,3],              summary:"Metalloid used in glass, ceramics, and as a neutron absorber in nuclear reactors." },
  { n:6,  sym:"C",  name:"Carbon",         mass:12.011,   cat:"nonmetal",        period:2, group:14, phase:"solid",  eConfig:"[He] 2s² 2p²",           en:2.55, mp:3550,   bp:4027,   density:2.267,     discovered:"ancient", discoverer:"ancient", shells:[2,4],           summary:"Basis of all organic life. Exists as diamond, graphite, graphene, and fullerenes." },
  { n:7,  sym:"N",  name:"Nitrogen",       mass:14.007,   cat:"nonmetal",        period:2, group:15, phase:"gas",    eConfig:"[He] 2s² 2p³",           en:3.04, mp:-210,   bp:-195.8, density:0.001251,  discovered:1772, discoverer:"Rutherford",  shells:[2,5],              summary:"Makes up 78% of Earth's atmosphere. Essential for amino acids and nucleic acids." },
  { n:8,  sym:"O",  name:"Oxygen",         mass:15.999,   cat:"nonmetal",        period:2, group:16, phase:"gas",    eConfig:"[He] 2s² 2p⁴",           en:3.44, mp:-218.8, bp:-183,   density:0.001429,  discovered:1774, discoverer:"Priestley",   shells:[2,6],              summary:"Essential for respiration and combustion. Third most abundant element in the universe." },
  { n:9,  sym:"F",  name:"Fluorine",       mass:18.998,   cat:"halogen",         period:2, group:17, phase:"gas",    eConfig:"[He] 2s² 2p⁵",           en:3.98, mp:-219.6, bp:-188.1, density:0.001696,  discovered:1886, discoverer:"Moissan",     shells:[2,7],              summary:"Most electronegative element. Highly reactive halogen used in toothpaste and Teflon." },
  { n:10, sym:"Ne", name:"Neon",           mass:20.180,   cat:"noble-gas",       period:2, group:18, phase:"gas",    eConfig:"[He] 2s² 2p⁶",           en:null, mp:-248.6, bp:-246.1, density:0.000900,  discovered:1898, discoverer:"Ramsay",      shells:[2,8],              summary:"Noble gas famous for its use in bright red-orange neon signs." },
  { n:11, sym:"Na", name:"Sodium",         mass:22.990,   cat:"alkali-metal",    period:3, group:1,  phase:"solid",  eConfig:"[Ne] 3s¹",               en:0.93, mp:97.8,   bp:883,    density:0.971,     discovered:1807, discoverer:"Davy",         shells:[2,8,1],            summary:"Highly reactive alkali metal. Essential electrolyte in biological systems." },
  { n:12, sym:"Mg", name:"Magnesium",      mass:24.305,   cat:"alkaline-earth",  period:3, group:2,  phase:"solid",  eConfig:"[Ne] 3s²",               en:1.31, mp:650,    bp:1090,   density:1.738,     discovered:1755, discoverer:"Black",        shells:[2,8,2],            summary:"Lightweight structural metal. Central atom in chlorophyll." },
  { n:13, sym:"Al", name:"Aluminum",       mass:26.982,   cat:"post-transition", period:3, group:13, phase:"solid",  eConfig:"[Ne] 3s² 3p¹",           en:1.61, mp:660.3,  bp:2519,   density:2.698,     discovered:1825, discoverer:"Ørsted",       shells:[2,8,3],            summary:"Most abundant metal in Earth's crust. Lightweight and corrosion-resistant." },
  { n:14, sym:"Si", name:"Silicon",        mass:28.086,   cat:"metalloid",       period:3, group:14, phase:"solid",  eConfig:"[Ne] 3s² 3p²",           en:1.90, mp:1414,   bp:3265,   density:2.329,     discovered:1824, discoverer:"Berzelius",    shells:[2,8,4],            summary:"Semiconductor that forms the basis of modern electronics and computer chips." },
  { n:15, sym:"P",  name:"Phosphorus",     mass:30.974,   cat:"nonmetal",        period:3, group:15, phase:"solid",  eConfig:"[Ne] 3s² 3p³",           en:2.19, mp:44.2,   bp:280.5,  density:1.82,      discovered:1669, discoverer:"Brand",        shells:[2,8,5],            summary:"Essential for DNA, RNA, ATP, and bone mineral. Found in fertilizers and detergents." },
  { n:16, sym:"S",  name:"Sulfur",         mass:32.065,   cat:"nonmetal",        period:3, group:16, phase:"solid",  eConfig:"[Ne] 3s² 3p⁴",           en:2.58, mp:115.2,  bp:444.6,  density:2.067,     discovered:"ancient", discoverer:"ancient", shells:[2,8,6],           summary:"Yellow non-metal used in sulfuric acid production. Smells like rotten eggs as H₂S." },
  { n:17, sym:"Cl", name:"Chlorine",       mass:35.453,   cat:"halogen",         period:3, group:17, phase:"gas",    eConfig:"[Ne] 3s² 3p⁵",           en:3.16, mp:-101.5, bp:-34.0,  density:0.003214,  discovered:1774, discoverer:"Scheele",      shells:[2,8,7],            summary:"Highly reactive halogen. Used in water purification and PVC production." },
  { n:18, sym:"Ar", name:"Argon",          mass:39.948,   cat:"noble-gas",       period:3, group:18, phase:"gas",    eConfig:"[Ne] 3s² 3p⁶",           en:null, mp:-189.3, bp:-185.8, density:0.001784,  discovered:1894, discoverer:"Rayleigh",     shells:[2,8,8],            summary:"Third most abundant gas in Earth's atmosphere. Used as inert shielding gas in welding." },
  { n:19, sym:"K",  name:"Potassium",      mass:39.098,   cat:"alkali-metal",    period:4, group:1,  phase:"solid",  eConfig:"[Ar] 4s¹",               en:0.82, mp:63.4,   bp:759,    density:0.862,     discovered:1807, discoverer:"Davy",         shells:[2,8,8,1],          summary:"Essential mineral nutrient. Critical for nerve and muscle function in the body." },
  { n:20, sym:"Ca", name:"Calcium",        mass:40.078,   cat:"alkaline-earth",  period:4, group:2,  phase:"solid",  eConfig:"[Ar] 4s²",               en:1.00, mp:842,    bp:1484,   density:1.55,      discovered:1808, discoverer:"Davy",         shells:[2,8,8,2],          summary:"Most abundant mineral in the human body. Makes up bones and teeth." },
  { n:21, sym:"Sc", name:"Scandium",       mass:44.956,   cat:"transition",      period:4, group:3,  phase:"solid",  eConfig:"[Ar] 3d¹ 4s²",           en:1.36, mp:1541,   bp:2830,   density:2.989,     discovered:1879, discoverer:"Nilson",       shells:[2,8,9,2],          summary:"Rare transition metal used in aerospace alloys and high-intensity lighting." },
  { n:22, sym:"Ti", name:"Titanium",       mass:47.867,   cat:"transition",      period:4, group:4,  phase:"solid",  eConfig:"[Ar] 3d² 4s²",           en:1.54, mp:1668,   bp:3287,   density:4.507,     discovered:1791, discoverer:"Gregor",       shells:[2,8,10,2],         summary:"Strong, lightweight, corrosion-resistant metal used in aircraft and medical implants." },
  { n:23, sym:"V",  name:"Vanadium",       mass:50.942,   cat:"transition",      period:4, group:5,  phase:"solid",  eConfig:"[Ar] 3d³ 4s²",           en:1.63, mp:1910,   bp:3407,   density:6.11,      discovered:1801, discoverer:"del Río",      shells:[2,8,11,2],         summary:"Hard metal used in steel alloys. Found in fossil fuels and some organisms." },
  { n:24, sym:"Cr", name:"Chromium",       mass:51.996,   cat:"transition",      period:4, group:6,  phase:"solid",  eConfig:"[Ar] 3d⁵ 4s¹",           en:1.66, mp:1907,   bp:2671,   density:7.15,      discovered:1797, discoverer:"Vauquelin",   shells:[2,8,13,1],         summary:"Shiny, hard metal that gives stainless steel its corrosion resistance." },
  { n:25, sym:"Mn", name:"Manganese",      mass:54.938,   cat:"transition",      period:4, group:7,  phase:"solid",  eConfig:"[Ar] 3d⁵ 4s²",           en:1.55, mp:1246,   bp:2061,   density:7.44,      discovered:1774, discoverer:"Gahn",         shells:[2,8,13,2],         summary:"Essential trace element. Used in steel production and dry-cell batteries." },
  { n:26, sym:"Fe", name:"Iron",           mass:55.845,   cat:"transition",      period:4, group:8,  phase:"solid",  eConfig:"[Ar] 3d⁶ 4s²",           en:1.83, mp:1538,   bp:2861,   density:7.874,     discovered:"ancient", discoverer:"ancient", shells:[2,8,14,2],         summary:"Most used metal in the world. Core of Earth. Carries oxygen in hemoglobin." },
  { n:27, sym:"Co", name:"Cobalt",         mass:58.933,   cat:"transition",      period:4, group:9,  phase:"solid",  eConfig:"[Ar] 3d⁷ 4s²",           en:1.88, mp:1495,   bp:2927,   density:8.9,       discovered:1735, discoverer:"Brandt",       shells:[2,8,15,2],         summary:"Used in magnets, superalloys, and lithium-ion batteries. Gives blue color to glass." },
  { n:28, sym:"Ni", name:"Nickel",         mass:58.693,   cat:"transition",      period:4, group:10, phase:"solid",  eConfig:"[Ar] 3d⁸ 4s²",           en:1.91, mp:1455,   bp:2913,   density:8.908,     discovered:1751, discoverer:"Cronstedt",    shells:[2,8,16,2],         summary:"Corrosion-resistant metal used in stainless steel, batteries, and coins." },
  { n:29, sym:"Cu", name:"Copper",         mass:63.546,   cat:"transition",      period:4, group:11, phase:"solid",  eConfig:"[Ar] 3d¹⁰ 4s¹",          en:1.90, mp:1084.6, bp:2562,   density:8.96,      discovered:"ancient", discoverer:"ancient", shells:[2,8,18,1],         summary:"Excellent electrical conductor. Used in wiring, plumbing, and coins throughout history." },
  { n:30, sym:"Zn", name:"Zinc",           mass:65.38,    cat:"transition",      period:4, group:12, phase:"solid",  eConfig:"[Ar] 3d¹⁰ 4s²",          en:1.65, mp:419.5,  bp:907,    density:7.134,     discovered:1746, discoverer:"Marggraf",     shells:[2,8,18,2],         summary:"Essential trace element. Used in galvanizing steel and as a dietary supplement." },
  { n:31, sym:"Ga", name:"Gallium",        mass:69.723,   cat:"post-transition", period:4, group:13, phase:"solid",  eConfig:"[Ar] 3d¹⁰ 4s² 4p¹",     en:1.81, mp:29.8,   bp:2229,   density:5.907,     discovered:1875, discoverer:"Lecoq",        shells:[2,8,18,3],         summary:"Melts just above room temperature (29.8°C). Used in semiconductors and LEDs." },
  { n:32, sym:"Ge", name:"Germanium",      mass:72.64,    cat:"metalloid",       period:4, group:14, phase:"solid",  eConfig:"[Ar] 3d¹⁰ 4s² 4p²",     en:2.01, mp:938.2,  bp:2833,   density:5.323,     discovered:1886, discoverer:"Winkler",      shells:[2,8,18,4],         summary:"Semiconductor predicted by Mendeleev before discovery. Used in fiber optics." },
  { n:33, sym:"As", name:"Arsenic",        mass:74.922,   cat:"metalloid",       period:4, group:15, phase:"solid",  eConfig:"[Ar] 3d¹⁰ 4s² 4p³",     en:2.18, mp:817,    bp:614,    density:5.776,     discovered:"ancient", discoverer:"ancient", shells:[2,8,18,5],         summary:"Toxic metalloid used historically as a poison. Used in semiconductors and wood preservatives." },
  { n:34, sym:"Se", name:"Selenium",       mass:78.96,    cat:"nonmetal",        period:4, group:16, phase:"solid",  eConfig:"[Ar] 3d¹⁰ 4s² 4p⁴",     en:2.55, mp:221,    bp:685,    density:4.809,     discovered:1817, discoverer:"Berzelius",    shells:[2,8,18,6],         summary:"Essential trace element. Used in photovoltaic cells and photocopiers." },
  { n:35, sym:"Br", name:"Bromine",        mass:79.904,   cat:"halogen",         period:4, group:17, phase:"liquid", eConfig:"[Ar] 3d¹⁰ 4s² 4p⁵",     en:2.96, mp:-7.3,   bp:59.0,   density:3.122,     discovered:1826, discoverer:"Balard",       shells:[2,8,18,7],         summary:"One of only two liquid elements at room temperature. Used in flame retardants." },
  { n:36, sym:"Kr", name:"Krypton",        mass:83.798,   cat:"noble-gas",       period:4, group:18, phase:"gas",    eConfig:"[Ar] 3d¹⁰ 4s² 4p⁶",     en:null, mp:-157.4, bp:-153.2, density:0.003749,  discovered:1898, discoverer:"Ramsay",      shells:[2,8,18,8],         summary:"Noble gas used in high-powered lasers and certain fluorescent lights." },
  { n:37, sym:"Rb", name:"Rubidium",       mass:85.468,   cat:"alkali-metal",    period:5, group:1,  phase:"solid",  eConfig:"[Kr] 5s¹",               en:0.82, mp:39.3,   bp:688,    density:1.532,     discovered:1861, discoverer:"Bunsen",       shells:[2,8,18,8,1],       summary:"Soft, highly reactive alkali metal used in atomic clocks and glass manufacturing." },
  { n:38, sym:"Sr", name:"Strontium",      mass:87.62,    cat:"alkaline-earth",  period:5, group:2,  phase:"solid",  eConfig:"[Kr] 5s²",               en:0.95, mp:777,    bp:1382,   density:2.64,      discovered:1790, discoverer:"Crawford",     shells:[2,8,18,8,2],       summary:"Gives red color to fireworks. Radioactive Sr-90 is a dangerous nuclear fission product." },
  { n:39, sym:"Y",  name:"Yttrium",        mass:88.906,   cat:"transition",      period:5, group:3,  phase:"solid",  eConfig:"[Kr] 4d¹ 5s²",           en:1.22, mp:1522,   bp:3345,   density:4.472,     discovered:1794, discoverer:"Gadolin",      shells:[2,8,18,9,2],       summary:"Used in phosphors for TV screens, superconductors, and cancer treatment." },
  { n:40, sym:"Zr", name:"Zirconium",      mass:91.224,   cat:"transition",      period:5, group:4,  phase:"solid",  eConfig:"[Kr] 4d² 5s²",           en:1.33, mp:1852,   bp:4409,   density:6.52,      discovered:1789, discoverer:"Klaproth",     shells:[2,8,18,10,2],      summary:"Extremely resistant to corrosion. Used as cladding for nuclear fuel rods." },
  { n:41, sym:"Nb", name:"Niobium",        mass:92.906,   cat:"transition",      period:5, group:5,  phase:"solid",  eConfig:"[Kr] 4d⁴ 5s¹",           en:1.60, mp:2477,   bp:4744,   density:8.57,      discovered:1801, discoverer:"Hatchett",     shells:[2,8,18,12,1],      summary:"Superconductor at low temperatures. Used in high-strength steel alloys." },
  { n:42, sym:"Mo", name:"Molybdenum",     mass:95.96,    cat:"transition",      period:5, group:6,  phase:"solid",  eConfig:"[Kr] 4d⁵ 5s¹",           en:2.16, mp:2623,   bp:4639,   density:10.22,     discovered:1778, discoverer:"Scheele",      shells:[2,8,18,13,1],      summary:"High melting point metal essential for enzymes in nitrogen fixation." },
  { n:43, sym:"Tc", name:"Technetium",     mass:98,       cat:"transition",      period:5, group:7,  phase:"solid",  eConfig:"[Kr] 4d⁵ 5s²",           en:1.90, mp:2157,   bp:4265,   density:11.5,      discovered:1937, discoverer:"Perrier",      shells:[2,8,18,13,2],      summary:"First artificially produced element. Tc-99m is widely used in medical imaging." },
  { n:44, sym:"Ru", name:"Ruthenium",      mass:101.07,   cat:"transition",      period:5, group:8,  phase:"solid",  eConfig:"[Kr] 4d⁷ 5s¹",           en:2.20, mp:2334,   bp:4150,   density:12.37,     discovered:1844, discoverer:"Klaus",        shells:[2,8,18,15,1],      summary:"Hard, rare platinum-group metal used as catalyst and in electrical contacts." },
  { n:45, sym:"Rh", name:"Rhodium",        mass:102.91,   cat:"transition",      period:5, group:9,  phase:"solid",  eConfig:"[Kr] 4d⁸ 5s¹",           en:2.28, mp:1964,   bp:3695,   density:12.41,     discovered:1803, discoverer:"Wollaston",    shells:[2,8,18,16,1],      summary:"Rarest and most valuable platinum-group metal. Critical in catalytic converters." },
  { n:46, sym:"Pd", name:"Palladium",      mass:106.42,   cat:"transition",      period:5, group:10, phase:"solid",  eConfig:"[Kr] 4d¹⁰",              en:2.20, mp:1554.9, bp:2963,   density:12.023,    discovered:1803, discoverer:"Wollaston",    shells:[2,8,18,18],        summary:"Platinum-group metal used in catalytic converters and electronics." },
  { n:47, sym:"Ag", name:"Silver",         mass:107.87,   cat:"transition",      period:5, group:11, phase:"solid",  eConfig:"[Kr] 4d¹⁰ 5s¹",          en:1.93, mp:961.8,  bp:2162,   density:10.49,     discovered:"ancient", discoverer:"ancient", shells:[2,8,18,18,1],       summary:"Best electrical and thermal conductor of all metals. Used in jewelry and electronics." },
  { n:48, sym:"Cd", name:"Cadmium",        mass:112.41,   cat:"transition",      period:5, group:12, phase:"solid",  eConfig:"[Kr] 4d¹⁰ 5s²",          en:1.69, mp:321.1,  bp:767,    density:8.65,      discovered:1817, discoverer:"Stromeyer",    shells:[2,8,18,18,2],      summary:"Toxic heavy metal used in NiCd batteries and as a neutron absorber in reactors." },
  { n:49, sym:"In", name:"Indium",         mass:114.82,   cat:"post-transition", period:5, group:13, phase:"solid",  eConfig:"[Kr] 4d¹⁰ 5s² 5p¹",     en:1.78, mp:156.6,  bp:2072,   density:7.31,      discovered:1863, discoverer:"Reich",        shells:[2,8,18,18,3],      summary:"Soft, silvery metal used in touchscreen coatings (ITO) and flat panel displays." },
  { n:50, sym:"Sn", name:"Tin",            mass:118.71,   cat:"post-transition", period:5, group:14, phase:"solid",  eConfig:"[Kr] 4d¹⁰ 5s² 5p²",     en:1.96, mp:231.9,  bp:2602,   density:7.287,     discovered:"ancient", discoverer:"ancient", shells:[2,8,18,18,4],       summary:"Non-toxic metal used to plate steel (tin cans) and in bronze and solder alloys." },
  { n:51, sym:"Sb", name:"Antimony",       mass:121.76,   cat:"metalloid",       period:5, group:15, phase:"solid",  eConfig:"[Kr] 4d¹⁰ 5s² 5p³",     en:2.05, mp:630.6,  bp:1587,   density:6.685,     discovered:"ancient", discoverer:"ancient", shells:[2,8,18,18,5],       summary:"Brittle metalloid used in flame retardants, batteries, and alloys." },
  { n:52, sym:"Te", name:"Tellurium",      mass:127.60,   cat:"metalloid",       period:5, group:16, phase:"solid",  eConfig:"[Kr] 4d¹⁰ 5s² 5p⁴",     en:2.10, mp:449.5,  bp:988,    density:6.232,     discovered:1782, discoverer:"Müller",       shells:[2,8,18,18,6],      summary:"Rare metalloid used in CdTe solar cells and thermoelectric devices." },
  { n:53, sym:"I",  name:"Iodine",         mass:126.90,   cat:"halogen",         period:5, group:17, phase:"solid",  eConfig:"[Kr] 4d¹⁰ 5s² 5p⁵",     en:2.66, mp:113.5,  bp:184.3,  density:4.933,     discovered:1811, discoverer:"Courtois",     shells:[2,8,18,18,7],      summary:"Essential trace element for thyroid hormones. Used as antiseptic and in photography." },
  { n:54, sym:"Xe", name:"Xenon",          mass:131.29,   cat:"noble-gas",       period:5, group:18, phase:"gas",    eConfig:"[Kr] 4d¹⁰ 5s² 5p⁶",     en:null, mp:-111.8, bp:-108.1, density:0.005887,  discovered:1898, discoverer:"Ramsay",      shells:[2,8,18,18,8],      summary:"Noble gas used in flash lamps, ion propulsion engines, and medical imaging." },
  { n:55, sym:"Cs", name:"Cesium",         mass:132.91,   cat:"alkali-metal",    period:6, group:1,  phase:"solid",  eConfig:"[Xe] 6s¹",               en:0.79, mp:28.4,   bp:671,    density:1.873,     discovered:1860, discoverer:"Bunsen",       shells:[2,8,18,18,8,1],    summary:"Defines the SI unit of time. Used in atomic clocks accurate to 1 second in 300 million years." },
  { n:56, sym:"Ba", name:"Barium",         mass:137.33,   cat:"alkaline-earth",  period:6, group:2,  phase:"solid",  eConfig:"[Xe] 6s²",               en:0.89, mp:727,    bp:1897,   density:3.594,     discovered:1808, discoverer:"Davy",         shells:[2,8,18,18,8,2],    summary:"Heavy alkaline earth metal. Barium sulfate is used as a radiocontrast agent." },
  { n:57, sym:"La", name:"Lanthanum",      mass:138.91,   cat:"lanthanide",      period:6, group:null, phase:"solid", eConfig:"[Xe] 5d¹ 6s²",          en:1.10, mp:920,    bp:3464,   density:6.162,     discovered:1839, discoverer:"Mosander",     shells:[2,8,18,18,9,2],    summary:"Soft rare-earth metal that starts the lanthanide series. Used in camera lenses." },
  { n:58, sym:"Ce", name:"Cerium",         mass:140.12,   cat:"lanthanide",      period:6, group:null, phase:"solid", eConfig:"[Xe] 4f¹ 5d¹ 6s²",      en:1.12, mp:798,    bp:3443,   density:6.770,     discovered:1803, discoverer:"Berzelius",   shells:[2,8,18,19,9,2],    summary:"Most abundant rare-earth element. Used in catalytic converters and glass polishing." },
  { n:59, sym:"Pr", name:"Praseodymium",   mass:140.91,   cat:"lanthanide",      period:6, group:null, phase:"solid", eConfig:"[Xe] 4f³ 6s²",           en:1.13, mp:931,    bp:3520,   density:6.77,      discovered:1885, discoverer:"von Welsbach", shells:[2,8,18,21,8,2],    summary:"Rare-earth metal used in powerful magnets, aircraft engines, and flint lighter alloys." },
  { n:60, sym:"Nd", name:"Neodymium",      mass:144.24,   cat:"lanthanide",      period:6, group:null, phase:"solid", eConfig:"[Xe] 4f⁴ 6s²",           en:1.14, mp:1016,   bp:3074,   density:7.01,      discovered:1885, discoverer:"von Welsbach", shells:[2,8,18,22,8,2],    summary:"Creates the strongest permanent magnets known. Used in electric motors and speakers." },
  { n:61, sym:"Pm", name:"Promethium",     mass:145,      cat:"lanthanide",      period:6, group:null, phase:"solid", eConfig:"[Xe] 4f⁵ 6s²",           en:1.13, mp:1042,   bp:3000,   density:7.26,      discovered:1945, discoverer:"Marinsky",     shells:[2,8,18,23,8,2],    summary:"Only radioactive lanthanide with no stable isotopes. Used in nuclear batteries." },
  { n:62, sym:"Sm", name:"Samarium",       mass:150.36,   cat:"lanthanide",      period:6, group:null, phase:"solid", eConfig:"[Xe] 4f⁶ 6s²",           en:1.17, mp:1072,   bp:1794,   density:7.52,      discovered:1879, discoverer:"Boisbaudran",  shells:[2,8,18,24,8,2],    summary:"Used in SmCo permanent magnets and cancer treatment via Sm-153." },
  { n:63, sym:"Eu", name:"Europium",       mass:151.96,   cat:"lanthanide",      period:6, group:null, phase:"solid", eConfig:"[Xe] 4f⁷ 6s²",           en:null, mp:822,    bp:1529,   density:5.244,     discovered:1901, discoverer:"Demarçay",    shells:[2,8,18,25,8,2],    summary:"Most reactive rare-earth element. Used in fluorescent lights and euro banknote security." },
  { n:64, sym:"Gd", name:"Gadolinium",     mass:157.25,   cat:"lanthanide",      period:6, group:null, phase:"solid", eConfig:"[Xe] 4f⁷ 5d¹ 6s²",      en:1.20, mp:1312,   bp:3273,   density:7.90,      discovered:1880, discoverer:"de Marignac",  shells:[2,8,18,25,9,2],    summary:"Used as MRI contrast agent. Exceptional neutron absorption cross-section." },
  { n:65, sym:"Tb", name:"Terbium",        mass:158.93,   cat:"lanthanide",      period:6, group:null, phase:"solid", eConfig:"[Xe] 4f⁹ 6s²",           en:null, mp:1356,   bp:3230,   density:8.23,      discovered:1843, discoverer:"Mosander",     shells:[2,8,18,27,8,2],    summary:"Used in solid-state devices, fuel cells, and sonar systems." },
  { n:66, sym:"Dy", name:"Dysprosium",     mass:162.50,   cat:"lanthanide",      period:6, group:null, phase:"solid", eConfig:"[Xe] 4f¹⁰ 6s²",          en:1.22, mp:1412,   bp:2567,   density:8.551,     discovered:1886, discoverer:"Boisbaudran",  shells:[2,8,18,28,8,2],    summary:"Has highest magnetic strength at room temp. Used in neodymium magnets and nuclear reactors." },
  { n:67, sym:"Ho", name:"Holmium",        mass:164.93,   cat:"lanthanide",      period:6, group:null, phase:"solid", eConfig:"[Xe] 4f¹¹ 6s²",          en:1.23, mp:1474,   bp:2700,   density:8.795,     discovered:1878, discoverer:"Soret",        shells:[2,8,18,29,8,2],    summary:"Highest magnetic moment of any natural element. Used in magnets and lasers." },
  { n:68, sym:"Er", name:"Erbium",         mass:167.26,   cat:"lanthanide",      period:6, group:null, phase:"solid", eConfig:"[Xe] 4f¹² 6s²",          en:1.24, mp:1529,   bp:2868,   density:9.066,     discovered:1843, discoverer:"Mosander",     shells:[2,8,18,30,8,2],    summary:"Used as dopant in optical fibers for long-distance communication (EDFA amplifiers)." },
  { n:69, sym:"Tm", name:"Thulium",        mass:168.93,   cat:"lanthanide",      period:6, group:null, phase:"solid", eConfig:"[Xe] 4f¹³ 6s²",          en:1.25, mp:1545,   bp:1950,   density:9.321,     discovered:1879, discoverer:"Cleve",        shells:[2,8,18,31,8,2],    summary:"Rarest of naturally occurring lanthanides. Used in portable X-ray devices." },
  { n:70, sym:"Yb", name:"Ytterbium",      mass:173.04,   cat:"lanthanide",      period:6, group:null, phase:"solid", eConfig:"[Xe] 4f¹⁴ 6s²",          en:null, mp:819,    bp:1196,   density:6.965,     discovered:1878, discoverer:"de Marignac",  shells:[2,8,18,32,8,2],    summary:"Used in atomic clocks, stress gauges, and as laser medium." },
  { n:71, sym:"Lu", name:"Lutetium",       mass:174.97,   cat:"lanthanide",      period:6, group:null, phase:"solid", eConfig:"[Xe] 4f¹⁴ 5d¹ 6s²",     en:1.27, mp:1663,   bp:3402,   density:9.841,     discovered:1907, discoverer:"Urbain",       shells:[2,8,18,32,9,2],    summary:"Densest and hardest lanthanide. Used in PET scan detectors and catalysts." },
  { n:72, sym:"Hf", name:"Hafnium",        mass:178.49,   cat:"transition",      period:6, group:4,  phase:"solid",  eConfig:"[Xe] 4f¹⁴ 5d² 6s²",     en:1.30, mp:2233,   bp:4603,   density:13.31,     discovered:1923, discoverer:"Coster",       shells:[2,8,18,32,10,2],   summary:"Very similar to zirconium. Used in nuclear reactor control rods and microchip gates." },
  { n:73, sym:"Ta", name:"Tantalum",       mass:180.95,   cat:"transition",      period:6, group:5,  phase:"solid",  eConfig:"[Xe] 4f¹⁴ 5d³ 6s²",     en:1.50, mp:3017,   bp:5458,   density:16.65,     discovered:1802, discoverer:"Ekeberg",      shells:[2,8,18,32,11,2],   summary:"Highly corrosion-resistant metal used in capacitors in phones and laptops." },
  { n:74, sym:"W",  name:"Tungsten",       mass:183.84,   cat:"transition",      period:6, group:6,  phase:"solid",  eConfig:"[Xe] 4f¹⁴ 5d⁴ 6s²",     en:2.36, mp:3422,   bp:5555,   density:19.25,     discovered:1783, discoverer:"d'Elhuyar",    shells:[2,8,18,32,12,2],   summary:"Highest melting point of all elements (3422°C). Used in light bulb filaments and armor-piercing rounds." },
  { n:75, sym:"Re", name:"Rhenium",        mass:186.21,   cat:"transition",      period:6, group:7,  phase:"solid",  eConfig:"[Xe] 4f¹⁴ 5d⁵ 6s²",     en:1.90, mp:3186,   bp:5596,   density:21.02,     discovered:1925, discoverer:"Noddack",      shells:[2,8,18,32,13,2],   summary:"Second highest melting point. Used in jet engine turbine blades and catalysts." },
  { n:76, sym:"Os", name:"Osmium",         mass:190.23,   cat:"transition",      period:6, group:8,  phase:"solid",  eConfig:"[Xe] 4f¹⁴ 5d⁶ 6s²",     en:2.20, mp:3033,   bp:5012,   density:22.59,     discovered:1803, discoverer:"Tennant",      shells:[2,8,18,32,14,2],   summary:"Densest naturally occurring element (22.59 g/cm³). Used in fountain pen tips." },
  { n:77, sym:"Ir", name:"Iridium",        mass:192.22,   cat:"transition",      period:6, group:9,  phase:"solid",  eConfig:"[Xe] 4f¹⁴ 5d⁷ 6s²",     en:2.20, mp:2446,   bp:4428,   density:22.56,     discovered:1803, discoverer:"Tennant",      shells:[2,8,18,32,15,2],   summary:"Second densest element. K-Pg boundary iridium anomaly evidence of asteroid impact." },
  { n:78, sym:"Pt", name:"Platinum",       mass:195.08,   cat:"transition",      period:6, group:10, phase:"solid",  eConfig:"[Xe] 4f¹⁴ 5d⁹ 6s¹",     en:2.28, mp:1768.3, bp:3825,   density:21.45,     discovered:1735, discoverer:"Ulloa",        shells:[2,8,18,32,17,1],   summary:"Precious metal used in catalytic converters, jewelry, and fuel cells." },
  { n:79, sym:"Au", name:"Gold",           mass:196.97,   cat:"transition",      period:6, group:11, phase:"solid",  eConfig:"[Xe] 4f¹⁴ 5d¹⁰ 6s¹",    en:2.54, mp:1064.2, bp:2856,   density:19.30,     discovered:"ancient", discoverer:"ancient", shells:[2,8,18,32,18,1],    summary:"Highly unreactive precious metal. Used in jewelry, electronics, and as currency for millennia." },
  { n:80, sym:"Hg", name:"Mercury",        mass:200.59,   cat:"transition",      period:6, group:12, phase:"liquid", eConfig:"[Xe] 4f¹⁴ 5d¹⁰ 6s²",    en:2.00, mp:-38.8,  bp:356.7,  density:13.534,    discovered:"ancient", discoverer:"ancient", shells:[2,8,18,32,18,2],    summary:"Only metal liquid at room temperature. Used in thermometers and fluorescent bulbs." },
  { n:81, sym:"Tl", name:"Thallium",       mass:204.38,   cat:"post-transition", period:6, group:13, phase:"solid",  eConfig:"[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p¹",en:1.62, mp:304,    bp:1473,   density:11.85,     discovered:1861, discoverer:"Crookes",      shells:[2,8,18,32,18,3],   summary:"Highly toxic metal formerly used as rat poison. Used in infrared detectors." },
  { n:82, sym:"Pb", name:"Lead",           mass:207.2,    cat:"post-transition", period:6, group:14, phase:"solid",  eConfig:"[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p²",en:2.33, mp:327.5,  bp:1749,   density:11.34,     discovered:"ancient", discoverer:"ancient", shells:[2,8,18,32,18,4],    summary:"Dense, toxic heavy metal. Used in radiation shielding, batteries, and historically in pipes and paint." },
  { n:83, sym:"Bi", name:"Bismuth",        mass:208.98,   cat:"post-transition", period:6, group:15, phase:"solid",  eConfig:"[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p³",en:2.02, mp:271.4,  bp:1564,   density:9.747,     discovered:1400, discoverer:"unknown",      shells:[2,8,18,32,18,5],   summary:"Heaviest stable element. Used in Pepto-Bismol and as non-toxic alternative to lead shot." },
  { n:84, sym:"Po", name:"Polonium",       mass:209,      cat:"post-transition", period:6, group:16, phase:"solid",  eConfig:"[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁴",en:2.00, mp:254,    bp:962,    density:9.196,     discovered:1898, discoverer:"Curie",        shells:[2,8,18,32,18,6],   summary:"Highly radioactive element discovered by Marie Curie. Used in anti-static devices." },
  { n:85, sym:"At", name:"Astatine",       mass:210,      cat:"halogen",         period:6, group:17, phase:"solid",  eConfig:"[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁵",en:2.20, mp:302,    bp:337,    density:null,      discovered:1940, discoverer:"Corson",       shells:[2,8,18,32,18,7],   summary:"Rarest naturally occurring element. Most stable isotope has half-life of 8.1 hours." },
  { n:86, sym:"Rn", name:"Radon",          mass:222,      cat:"noble-gas",       period:6, group:18, phase:"gas",    eConfig:"[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁶",en:null, mp:-71,    bp:-61.7,  density:0.00973,   discovered:1900, discoverer:"Dorn",         shells:[2,8,18,32,18,8],   summary:"Radioactive noble gas and leading cause of lung cancer after smoking. Formed from radium decay." },
  { n:87, sym:"Fr", name:"Francium",       mass:223,      cat:"alkali-metal",    period:7, group:1,  phase:"solid",  eConfig:"[Rn] 7s¹",               en:0.70, mp:27,     bp:677,    density:null,      discovered:1939, discoverer:"Perey",        shells:[2,8,18,32,18,8,1], summary:"Second rarest naturally occurring element. Extremely radioactive alkali metal." },
  { n:88, sym:"Ra", name:"Radium",         mass:226,      cat:"alkaline-earth",  period:7, group:2,  phase:"solid",  eConfig:"[Rn] 7s²",               en:0.90, mp:700,    bp:1737,   density:5.5,       discovered:1898, discoverer:"Curie",        shells:[2,8,18,32,18,8,2], summary:"Intensely radioactive element discovered by Marie Curie. Used in early cancer treatments." },
  { n:89, sym:"Ac", name:"Actinium",       mass:227,      cat:"actinide",        period:7, group:null, phase:"solid", eConfig:"[Rn] 6d¹ 7s²",          en:1.10, mp:1051,   bp:3198,   density:10.07,     discovered:1899, discoverer:"Debierne",     shells:[2,8,18,32,18,9,2], summary:"Highly radioactive element that glows blue in the dark. Used in neutron production." },
  { n:90, sym:"Th", name:"Thorium",        mass:232.04,   cat:"actinide",        period:7, group:null, phase:"solid", eConfig:"[Rn] 6d² 7s²",           en:1.30, mp:1750,   bp:4788,   density:11.72,     discovered:1829, discoverer:"Berzelius",    shells:[2,8,18,32,18,10,2],summary:"Slightly radioactive. Proposed as safer nuclear fuel alternative to uranium." },
  { n:91, sym:"Pa", name:"Protactinium",   mass:231.04,   cat:"actinide",        period:7, group:null, phase:"solid", eConfig:"[Rn] 5f² 6d¹ 7s²",       en:1.50, mp:1568,   bp:4027,   density:15.37,     discovered:1913, discoverer:"Fajans",       shells:[2,8,18,32,20,9,2], summary:"Rare, highly toxic, radioactive metal. Intermediate product in uranium decay." },
  { n:92, sym:"U",  name:"Uranium",        mass:238.03,   cat:"actinide",        period:7, group:null, phase:"solid", eConfig:"[Rn] 5f³ 6d¹ 7s²",       en:1.38, mp:1135,   bp:4131,   density:19.05,     discovered:1789, discoverer:"Klaproth",     shells:[2,8,18,32,21,9,2], summary:"Heaviest naturally occurring element. Fuel for nuclear reactors and atomic bombs." },
  { n:93, sym:"Np", name:"Neptunium",      mass:237,      cat:"actinide",        period:7, group:null, phase:"solid", eConfig:"[Rn] 5f⁴ 6d¹ 7s²",       en:1.36, mp:644,    bp:4000,   density:20.45,     discovered:1940, discoverer:"McMillan",     shells:[2,8,18,32,22,9,2], summary:"First transuranium element discovered. Named after Neptune, next planet after Uranus." },
  { n:94, sym:"Pu", name:"Plutonium",      mass:244,      cat:"actinide",        period:7, group:null, phase:"solid", eConfig:"[Rn] 5f⁶ 7s²",           en:1.28, mp:640,    bp:3228,   density:19.816,    discovered:1940, discoverer:"Seaborg",      shells:[2,8,18,32,24,8,2], summary:"Used in nuclear weapons and reactors. Pu-238 powers deep space probes like Voyager." },
  { n:95, sym:"Am", name:"Americium",      mass:243,      cat:"actinide",        period:7, group:null, phase:"solid", eConfig:"[Rn] 5f⁷ 7s²",           en:1.30, mp:1176,   bp:2011,   density:13.67,     discovered:1944, discoverer:"Seaborg",      shells:[2,8,18,32,25,8,2], summary:"Synthetic transuranium element found in household smoke detectors (Am-241)." },
  { n:96, sym:"Cm", name:"Curium",         mass:247,      cat:"actinide",        period:7, group:null, phase:"solid", eConfig:"[Rn] 5f⁷ 6d¹ 7s²",       en:1.30, mp:1345,   bp:3110,   density:13.51,     discovered:1944, discoverer:"Seaborg",      shells:[2,8,18,32,25,9,2], summary:"Named after Pierre and Marie Curie. Used in spacecraft power systems." },
  { n:97, sym:"Bk", name:"Berkelium",      mass:247,      cat:"actinide",        period:7, group:null, phase:"solid", eConfig:"[Rn] 5f⁹ 7s²",           en:1.30, mp:986,    bp:null,   density:14.79,     discovered:1949, discoverer:"Seaborg",      shells:[2,8,18,32,27,8,2], summary:"Synthetic actinide element named after Berkeley, California. No practical uses." },
  { n:98, sym:"Cf", name:"Californium",    mass:251,      cat:"actinide",        period:7, group:null, phase:"solid", eConfig:"[Rn] 5f¹⁰ 7s²",          en:1.30, mp:900,    bp:null,   density:15.1,      discovered:1950, discoverer:"Seaborg",      shells:[2,8,18,32,28,8,2], summary:"Strong neutron emitter used in portable neutron sources for metal detectors and cancer therapy." },
  { n:99, sym:"Es", name:"Einsteinium",    mass:252,      cat:"actinide",        period:7, group:null, phase:"solid", eConfig:"[Rn] 5f¹¹ 7s²",          en:1.30, mp:860,    bp:null,   density:null,      discovered:1952, discoverer:"Ghiorso",      shells:[2,8,18,32,29,8,2], summary:"Named after Albert Einstein. First produced in the 1952 Ivy Mike nuclear test debris." },
  { n:100,sym:"Fm", name:"Fermium",        mass:257,      cat:"actinide",        period:7, group:null, phase:"solid", eConfig:"[Rn] 5f¹² 7s²",          en:1.30, mp:1527,   bp:null,   density:null,      discovered:1952, discoverer:"Ghiorso",      shells:[2,8,18,32,30,8,2], summary:"Named after Enrico Fermi. Heaviest element that can be produced via neutron bombardment." },
  { n:101,sym:"Md", name:"Mendelevium",    mass:258,      cat:"actinide",        period:7, group:null, phase:"solid", eConfig:"[Rn] 5f¹³ 7s²",          en:1.30, mp:827,    bp:null,   density:null,      discovered:1955, discoverer:"Seaborg",      shells:[2,8,18,32,31,8,2], summary:"Named after Dmitri Mendeleev, creator of the periodic table. Produced in tiny quantities." },
  { n:102,sym:"No", name:"Nobelium",       mass:259,      cat:"actinide",        period:7, group:null, phase:"solid", eConfig:"[Rn] 5f¹⁴ 7s²",          en:1.30, mp:827,    bp:null,   density:null,      discovered:1958, discoverer:"Flerov",       shells:[2,8,18,32,32,8,2], summary:"Named after Alfred Nobel. Difficult to produce — only a few atoms at a time." },
  { n:103,sym:"Lr", name:"Lawrencium",     mass:266,      cat:"actinide",        period:7, group:null, phase:"solid", eConfig:"[Rn] 5f¹⁴ 7s² 7p¹",     en:1.30, mp:1627,   bp:null,   density:null,      discovered:1961, discoverer:"Ghiorso",      shells:[2,8,18,32,32,8,3], summary:"Named after Ernest Lawrence, inventor of the cyclotron. Last of the actinide series." },
  { n:104,sym:"Rf", name:"Rutherfordium",  mass:267,      cat:"transition",      period:7, group:4,  phase:"solid",  eConfig:"[Rn] 5f¹⁴ 6d² 7s²",     en:null, mp:2100,   bp:5500,   density:23.2,      discovered:1964, discoverer:"Flerov",       shells:[2,8,18,32,32,10,2],summary:"Named after Ernest Rutherford. First transactinide element, only a few atoms produced." },
  { n:105,sym:"Db", name:"Dubnium",        mass:268,      cat:"transition",      period:7, group:5,  phase:"solid",  eConfig:"[Rn] 5f¹⁴ 6d³ 7s²",     en:null, mp:null,   bp:null,   density:29.3,      discovered:1968, discoverer:"Flerov",       shells:[2,8,18,32,32,11,2],summary:"Named after Dubna, Russia. Highly radioactive with half-life of only 28 hours." },
  { n:106,sym:"Sg", name:"Seaborgium",     mass:269,      cat:"transition",      period:7, group:6,  phase:"solid",  eConfig:"[Rn] 5f¹⁴ 6d⁴ 7s²",     en:null, mp:null,   bp:null,   density:35.0,      discovered:1974, discoverer:"Ghiorso",      shells:[2,8,18,32,32,12,2],summary:"Named after Glenn T. Seaborg. Only element named after a living person at time of naming." },
  { n:107,sym:"Bh", name:"Bohrium",        mass:270,      cat:"transition",      period:7, group:7,  phase:"solid",  eConfig:"[Rn] 5f¹⁴ 6d⁵ 7s²",     en:null, mp:null,   bp:null,   density:37.1,      discovered:1981, discoverer:"Münzenberg",   shells:[2,8,18,32,32,13,2],summary:"Named after Niels Bohr. Extremely radioactive, only a few atoms have ever been made." },
  { n:108,sym:"Hs", name:"Hassium",        mass:277,      cat:"transition",      period:7, group:8,  phase:"solid",  eConfig:"[Rn] 5f¹⁴ 6d⁶ 7s²",     en:null, mp:null,   bp:null,   density:40.7,      discovered:1984, discoverer:"Armbruster",   shells:[2,8,18,32,32,14,2],summary:"Named after the German state Hesse. Heaviest element with known chemical properties." },
  { n:109,sym:"Mt", name:"Meitnerium",     mass:278,      cat:"transition",      period:7, group:9,  phase:"solid",  eConfig:"[Rn] 5f¹⁴ 6d⁷ 7s²",     en:null, mp:null,   bp:null,   density:37.4,      discovered:1982, discoverer:"Münzenberg",   shells:[2,8,18,32,32,15,2],summary:"Named after Lise Meitner. Only element named after a non-mythological woman." },
  { n:110,sym:"Ds", name:"Darmstadtium",   mass:281,      cat:"transition",      period:7, group:10, phase:"solid",  eConfig:"[Rn] 5f¹⁴ 6d⁸ 7s²",     en:null, mp:null,   bp:null,   density:null,      discovered:1994, discoverer:"Armbruster",   shells:[2,8,18,32,32,16,2],summary:"Named after Darmstadt, Germany. Synthesized atom by atom in particle accelerators." },
  { n:111,sym:"Rg", name:"Roentgenium",    mass:282,      cat:"transition",      period:7, group:11, phase:"solid",  eConfig:"[Rn] 5f¹⁴ 6d¹⁰ 7s¹",    en:null, mp:null,   bp:null,   density:null,      discovered:1994, discoverer:"Armbruster",   shells:[2,8,18,32,32,18,1],summary:"Named after Wilhelm Röntgen, discoverer of X-rays. Half-life of about 26 seconds." },
  { n:112,sym:"Cn", name:"Copernicium",    mass:285,      cat:"transition",      period:7, group:12, phase:"gas",    eConfig:"[Rn] 5f¹⁴ 6d¹⁰ 7s²",    en:null, mp:null,   bp:null,   density:null,      discovered:1996, discoverer:"Hofmann",      shells:[2,8,18,32,32,18,2],summary:"Named after Nicolaus Copernicus. May be a gas at room temperature due to relativistic effects." },
  { n:113,sym:"Nh", name:"Nihonium",       mass:286,      cat:"post-transition", period:7, group:13, phase:"solid",  eConfig:"[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p¹",en:null, mp:null,   bp:null,   density:null,      discovered:2004, discoverer:"Morita",       shells:[2,8,18,32,32,18,3],summary:"Named after Japan (Nihon in Japanese). First element discovered in Asia." },
  { n:114,sym:"Fl", name:"Flerovium",      mass:289,      cat:"post-transition", period:7, group:14, phase:"solid",  eConfig:"[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p²",en:null, mp:null,   bp:null,   density:null,      discovered:1999, discoverer:"Oganessian",   shells:[2,8,18,32,32,18,4],summary:"Named after Flerov Laboratory. May behave like a noble gas due to relativistic effects." },
  { n:115,sym:"Mc", name:"Moscovium",      mass:290,      cat:"post-transition", period:7, group:15, phase:"solid",  eConfig:"[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p³",en:null, mp:null,   bp:null,   density:null,      discovered:2003, discoverer:"Oganessian",   shells:[2,8,18,32,32,18,5],summary:"Named after Moscow Oblast. Decays very rapidly through alpha emission." },
  { n:116,sym:"Lv", name:"Livermorium",    mass:293,      cat:"post-transition", period:7, group:16, phase:"solid",  eConfig:"[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁴",en:null, mp:null,   bp:null,   density:null,      discovered:2000, discoverer:"Oganessian",   shells:[2,8,18,32,32,18,6],summary:"Named after Lawrence Livermore National Laboratory. Heaviest element in group 16." },
  { n:117,sym:"Ts", name:"Tennessine",     mass:294,      cat:"halogen",         period:7, group:17, phase:"solid",  eConfig:"[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁵",en:null, mp:null,   bp:null,   density:null,      discovered:2010, discoverer:"Oganessian",   shells:[2,8,18,32,32,18,7],summary:"Named after Tennessee, USA. Second heaviest known element. Extremely short-lived." },
  { n:118,sym:"Og", name:"Oganesson",      mass:294,      cat:"noble-gas",       period:7, group:18, phase:"solid",  eConfig:"[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁶",en:null, mp:null,   bp:null,   density:null,      discovered:2002, discoverer:"Oganessian",   shells:[2,8,18,32,32,18,8],summary:"Heaviest known element. Named after Yuri Oganessian. Predicted to be solid, unlike other noble gases." },
];

// ── Category colors ───────────────────────────────────────────────────────────
const CAT_CONFIG = {
  "alkali-metal":    { label: "Alkali Metal",         bg: "#ef4444", light: "#fee2e2" },
  "alkaline-earth":  { label: "Alkaline Earth Metal", bg: "#f97316", light: "#ffedd5" },
  "lanthanide":      { label: "Lanthanide",           bg: "#a855f7", light: "#f3e8ff" },
  "actinide":        { label: "Actinide",             bg: "#ec4899", light: "#fce7f3" },
  "transition":      { label: "Transition Metal",     bg: "#facc15", light: "#fef9c3" },
  "post-transition": { label: "Post-transition Metal",bg: "#84cc16", light: "#f0fdf4" },
  "metalloid":       { label: "Metalloid",            bg: "#14b8a6", light: "#f0fdfa" },
  "nonmetal":        { label: "Nonmetal",             bg: "#22c55e", light: "#dcfce7" },
  "halogen":         { label: "Halogen",              bg: "#06b6d4", light: "#cffafe" },
  "noble-gas":       { label: "Noble Gas",            bg: "#6366f1", light: "#eef2ff" },
};

// ── Grid positions ────────────────────────────────────────────────────────────
function getPos(el) {
  if (el.group && el.period <= 7) {
    if (el.n >= 57 && el.n <= 71) return { row: 9, col: el.n - 57 + 4 };
    if (el.n >= 89 && el.n <= 103) return { row: 10, col: el.n - 89 + 4 };
    return { row: el.period, col: el.group };
  }
  if (el.n >= 57 && el.n <= 71) return { row: 9, col: el.n - 57 + 4 };
  if (el.n >= 89 && el.n <= 103) return { row: 10, col: el.n - 89 + 4 };
  return null;
}

// ── Electron Shell Diagram ────────────────────────────────────────────────────
function ShellDiagram({ shells }) {
  const maxR = 54;
  const cx = 64, cy = 64;
  const radii = [14, 24, 34, 44, 54, 62, 68];
  return (
    <svg width="128" height="128" viewBox="0 0 128 128">
      {shells.map((count, i) => {
        const r = radii[i];
        const angles = Array.from({ length: count }, (_, j) => (j * 2 * Math.PI) / count - Math.PI / 2);
        return (
          <g key={i}>
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(139,92,246,0.3)" strokeWidth="1" />
            {angles.map((a, j) => (
              <circle key={j} cx={cx + r * Math.cos(a)} cy={cy + r * Math.sin(a)} r="3" fill="#a78bfa" />
            ))}
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r="8" fill="#7c3aed" />
      <circle cx={cx} cy={cy} r="3" fill="white" />
    </svg>
  );
}

// ── Element Detail Modal ──────────────────────────────────────────────────────
function ElementModal({ el, onClose }) {
  const cfg = CAT_CONFIG[el.cat] || { label: el.cat, bg: "#6b7280", light: "#f3f4f6" };
  const isDark = document.documentElement.classList.contains("dark");
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl"
        style={{ background: "var(--app-surface-solid, #1a1a2e)", border: "1px solid var(--app-border)", maxHeight: "90vh", overflowY: "auto" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4" style={{ background: `${cfg.bg}22`, borderBottom: "1px solid var(--app-border)" }}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl flex flex-col items-center justify-center shrink-0" style={{ background: cfg.bg }}>
                <span className="text-[10px] font-bold text-white opacity-80">{el.n}</span>
                <span className="text-3xl font-black text-white leading-none">{el.sym}</span>
                <span className="text-[8px] text-white opacity-80 mt-0.5">{el.mass}</span>
              </div>
              <div>
                <h2 className="text-2xl font-black">{el.name}</h2>
                <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold mt-1" style={{ background: `${cfg.bg}30`, color: cfg.bg }}>{cfg.label}</span>
                <p className="text-xs mt-1 opacity-60">Period {el.period}{el.group ? `, Group ${el.group}` : ""}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 transition-all opacity-60 hover:opacity-100">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Summary */}
          <p className="text-sm leading-relaxed opacity-80">{el.summary}</p>

          {/* Shell diagram */}
          <div className="flex items-center gap-4">
            <ShellDiagram shells={el.shells} />
            <div className="flex-1">
              <p className="text-xs font-bold mb-1 opacity-50 uppercase tracking-wider">Electron Configuration</p>
              <p className="text-sm font-mono font-bold">{el.eConfig}</p>
              <p className="text-xs font-bold mt-2 mb-1 opacity-50 uppercase tracking-wider">Shell Distribution</p>
              <p className="text-sm font-mono">{el.shells.join(" · ")}</p>
            </div>
          </div>

          {/* Properties grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Atomic Mass", value: el.mass ? `${Number(el.mass).toFixed(2)} u` : "—" },
              { label: "Phase (STP)", value: el.phase ? el.phase.charAt(0).toUpperCase() + el.phase.slice(1) : "—" },
              { label: "Electronegativity", value: el.en != null ? `${Number(el.en).toFixed(2)} (Pauling)` : "N/A" },
              { label: "Density", value: el.density != null ? `${Number(el.density).toFixed(2)} g/cm³` : "—" },
              { label: "Melting Point", value: el.mp != null ? `${Number(el.mp).toFixed(2)}°C` : "—" },
              { label: "Boiling Point", value: el.bp != null ? `${Number(el.bp).toFixed(2)}°C` : "—" },
              { label: "Discovered", value: el.discovered != null ? String(el.discovered) : "—" },
              { label: "Discoverer", value: el.discoverer || "—" },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl p-3" style={{ background: "var(--app-surface)", border: "1px solid var(--app-border)" }}>
                <p className="text-[10px] font-bold uppercase tracking-wider opacity-40 mb-0.5">{label}</p>
                <p className="text-sm font-semibold">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Element Cell ──────────────────────────────────────────────────────────────
function ElementCell({ el, onClick, highlight, dimmed, small }) {
  const cfg = CAT_CONFIG[el.cat] || { bg: "#6b7280" };
  const opacity = dimmed ? 0.15 : 1;
  const border = highlight ? `2px solid ${cfg.bg}` : "1px solid rgba(255,255,255,0.08)";
  const sz = small ? "w-7 h-7" : "w-full";
  return (
    <div
      onClick={() => onClick(el)}
      title={el.name}
      className={`${sz} aspect-square rounded cursor-pointer transition-all duration-150 hover:scale-110 hover:z-10 flex flex-col items-center justify-center relative`}
      style={{ background: `${cfg.bg}${dimmed ? "22" : "33"}`, border, opacity, minWidth: small ? 28 : undefined }}
    >
      <span className="text-[6px] leading-none opacity-60">{el.n}</span>
      <span className={`font-black leading-none ${small ? "text-[8px]" : "text-[10px] sm:text-xs"}`}>{el.sym}</span>
      {!small && <span className="text-[5px] leading-none opacity-50 hidden sm:block truncate w-full text-center px-0.5">{el.mass}</span>}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function PeriodicTable() {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState(null);
  const [filterPhase, setFilterPhase] = useState(null);
  const [hoveredCat, setHoveredCat] = useState(null);

  const bgStyle = { background: "var(--app-bg)", color: "var(--app-text)" };

  const searchLower = search.toLowerCase();
  const matchedNums = useMemo(() => {
    if (!search && !filterCat && !filterPhase) return null;
    return new Set(
      ELEMENTS.filter(el => {
        const matchSearch = !search || el.name.toLowerCase().includes(searchLower) || el.sym.toLowerCase().includes(searchLower) || String(el.n) === search;
        const matchCat = !filterCat || el.cat === filterCat;
        const matchPhase = !filterPhase || el.phase === filterPhase;
        return matchSearch && matchCat && matchPhase;
      }).map(el => el.n)
    );
  }, [search, filterCat, filterPhase]);

  const activeCat = hoveredCat || filterCat;

  // Build 10-row grid (periods 1-7 + 2 lanthanide/actinide rows)
  const grid = useMemo(() => {
    const g = Array.from({ length: 10 }, () => Array(19).fill(null));
    ELEMENTS.forEach(el => {
      const pos = getPos(el);
      if (pos) g[pos.row - 1][pos.col - 1] = el;
    });
    return g;
  }, []);

  return (
    <div className="min-h-screen pb-20" style={bgStyle}>
      <div className="px-3 sm:px-6 py-6 max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center shrink-0">
            <Atom className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight">Interactive Periodic Table</h1>
            <p className="text-xs opacity-50">118 elements · Click any element for full details</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 opacity-40" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search element, symbol, number..."
              className="pl-9 pr-3 py-2 rounded-xl text-sm outline-none w-60"
              style={{ background: "var(--app-surface)", border: "1px solid var(--app-border)", color: "var(--app-text)" }}
            />
          </div>
          <select
            value={filterPhase || ""}
            onChange={e => setFilterPhase(e.target.value || null)}
            className="px-3 py-2 rounded-xl text-sm outline-none"
            style={{ background: "var(--app-surface)", border: "1px solid var(--app-border)", color: "var(--app-text)" }}
          >
            <option value="">All Phases</option>
            <option value="solid">Solid</option>
            <option value="liquid">Liquid</option>
            <option value="gas">Gas</option>
          </select>
          {(search || filterCat || filterPhase) && (
            <button onClick={() => { setSearch(""); setFilterCat(null); setFilterPhase(null); }}
              className="px-3 py-2 rounded-xl text-xs font-semibold opacity-60 hover:opacity-100 transition-all"
              style={{ background: "var(--app-surface)", border: "1px solid var(--app-border)" }}>
              Clear Filters
            </button>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {Object.entries(CAT_CONFIG).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => setFilterCat(filterCat === key ? null : key)}
              onMouseEnter={() => setHoveredCat(key)}
              onMouseLeave={() => setHoveredCat(null)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all hover:scale-105"
              style={{
                background: filterCat === key ? cfg.bg : `${cfg.bg}22`,
                color: filterCat === key ? "white" : cfg.bg,
                border: `1px solid ${cfg.bg}44`,
                opacity: filterCat && filterCat !== key ? 0.4 : 1,
              }}
            >
              <span className="w-2 h-2 rounded-sm shrink-0" style={{ background: cfg.bg }} />
              {cfg.label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto pb-2">
          <div style={{ minWidth: 580 }}>
            {/* Group numbers */}
            <div className="grid mb-1" style={{ gridTemplateColumns: `repeat(18, minmax(0, 1fr))`, gap: 2 }}>
              {Array.from({ length: 18 }, (_, i) => (
                <div key={i} className="text-center text-[8px] opacity-30 font-bold">{i + 1}</div>
              ))}
            </div>

            {grid.map((row, rowIdx) => {
              if (rowIdx === 7) return (
                <div key={rowIdx} className="grid mt-1" style={{ gridTemplateColumns: `repeat(18, minmax(0, 1fr))`, gap: 2 }}>
                  {Array.from({ length: 18 }, (_, i) => (
                    <div key={i} className="aspect-square" />
                  ))}
                </div>
              );

              const periodLabel = rowIdx < 7 ? rowIdx + 1 : rowIdx === 8 ? "La" : "Ac";
              return (
                <div key={rowIdx} className="flex items-center gap-0.5 mb-0.5">
                  <span className="text-[8px] opacity-30 font-bold w-3 shrink-0 text-right mr-0.5">{periodLabel}</span>
                  <div className="flex-1 grid" style={{ gridTemplateColumns: `repeat(18, minmax(0, 1fr))`, gap: 2 }}>
                    {row.slice(0, 18).map((el, colIdx) => {
                      if (!el) return <div key={colIdx} className="aspect-square" />;
                      const isHighlighted = !matchedNums || matchedNums.has(el.n);
                      const isCatMatch = !activeCat || el.cat === activeCat;
                      const dim = (matchedNums && !matchedNums.has(el.n)) || (activeCat && !isCatMatch);
                      return (
                        <ElementCell
                          key={el.n}
                          el={el}
                          onClick={setSelected}
                          highlight={isHighlighted && isCatMatch}
                          dimmed={dim}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Lanthanide / Actinide label bridge */}
            <div className="mt-3 flex items-center gap-2 text-[9px] opacity-40 font-semibold pl-4">
              <span className="w-2 h-2 rounded-sm" style={{ background: CAT_CONFIG.lanthanide.bg }} />
              <span>Lanthanides (57–71)</span>
              <span className="mx-2 opacity-30">·</span>
              <span className="w-2 h-2 rounded-sm" style={{ background: CAT_CONFIG.actinide.bg }} />
              <span>Actinides (89–103)</span>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-4 flex flex-wrap gap-4 text-xs opacity-50">
          <span>💡 <strong>{ELEMENTS.filter(e => e.phase === "solid").length}</strong> solids</span>
          <span>💧 <strong>{ELEMENTS.filter(e => e.phase === "liquid").length}</strong> liquids</span>
          <span>💨 <strong>{ELEMENTS.filter(e => e.phase === "gas").length}</strong> gases</span>
          <span>⚛️ <strong>118</strong> total elements</span>
          <span>🔬 <strong>{ELEMENTS.filter(e => e.discovered !== "ancient").length}</strong> lab-discovered</span>
        </div>

        {/* Search results list */}
        {matchedNums && matchedNums.size > 0 && search && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {ELEMENTS.filter(e => matchedNums.has(e.n)).map(el => {
              const cfg = CAT_CONFIG[el.cat] || { bg: "#6b7280", label: el.cat };
              return (
                <button key={el.n} onClick={() => setSelected(el)}
                  className="flex items-center gap-3 p-3 rounded-2xl text-left hover:scale-[1.02] transition-all"
                  style={{ background: "var(--app-surface)", border: "1px solid var(--app-border)" }}>
                  <div className="w-10 h-10 rounded-xl flex flex-col items-center justify-center shrink-0" style={{ background: cfg.bg }}>
                    <span className="text-[8px] text-white opacity-70">{el.n}</span>
                    <span className="text-sm font-black text-white">{el.sym}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate">{el.name}</p>
                    <p className="text-[10px] opacity-50">{cfg.label}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      {selected && <ElementModal el={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}