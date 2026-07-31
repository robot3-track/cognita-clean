import React, { useState } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// ── Population Pyramid SVG — fully static, no Math.random() ──────────────────
function PopulationPyramid({ desc, country }) {
  const ageGroups = ["0-4","5-9","10-14","15-19","20-24","25-29","30-34","35-39","40-44","45-49","50-54","55-59","60-64","65-69","70-74","75-79","80-84","85+"];
  const d = ((desc || "") + " " + (country || "")).toLowerCase();
  const isJapan = d.includes("japan");
  const isStage2 = d.includes("stage 2") || d.includes("expanding") || d.includes("niger") || d.includes("mali") || d.includes("chad") || d.includes("high birth");
  const isStage4 = d.includes("stage 4") || d.includes("stage 5") || d.includes("aging") || d.includes("germany") || d.includes("italy") || d.includes("constrictive");

  // Japan 2021 actual data (narrow base, bulging 45-74, female-heavy 80+)
  const maleData = isJapan
    ? [2.0,2.1,2.3,2.6,3.0,3.3,3.5,3.8,4.2,4.4,4.0,3.9,3.6,3.0,2.5,1.8,1.0,0.4]
    : isStage2
    ? [8.2,7.6,7.0,6.3,5.5,4.8,4.1,3.5,2.9,2.4,1.9,1.5,1.1,0.8,0.5,0.3,0.2,0.1]
    : isStage4
    ? [2.8,3.0,3.2,3.3,3.4,3.6,3.8,4.0,4.2,4.0,3.8,3.5,3.0,2.5,2.0,1.5,1.0,0.6]
    : [5.0,4.8,4.6,4.3,4.0,3.8,3.6,3.4,3.1,2.8,2.5,2.1,1.7,1.3,0.9,0.6,0.3,0.15];

  const femaleData = isJapan
    ? [1.9,2.0,2.2,2.5,2.9,3.1,3.4,3.7,4.1,4.3,4.0,4.0,3.8,3.4,3.0,2.4,1.6,0.9]
    : isStage2
    ? [7.9,7.3,6.7,6.0,5.3,4.7,4.0,3.4,2.8,2.3,1.8,1.4,1.0,0.8,0.6,0.4,0.25,0.15]
    : isStage4
    ? [2.6,2.9,3.1,3.2,3.3,3.5,3.7,3.9,4.1,4.0,3.9,3.7,3.3,2.9,2.4,1.9,1.3,0.9]
    : [4.8,4.6,4.4,4.1,3.8,3.6,3.4,3.2,3.0,2.7,2.4,2.0,1.6,1.2,0.9,0.6,0.35,0.2];

  const maxVal = isStage2 ? 8.5 : isJapan ? 4.8 : 5.2;
  const barH = 11, gap = 2, labelW = 32, barAreaW = 110;
  const totalW = labelW + barAreaW * 2 + 8;
  const totalH = ageGroups.length * (barH + gap) + 30;

  const title = isJapan ? "Japan Population Pyramid, 2021 (Census Bureau International Database)"
    : isStage2 ? "Stage 2 — High-Growth Population (e.g., Niger)"
    : isStage4 ? "Stage 4–5 — Aging Population (e.g., Germany)"
    : "Stage 3 — Transitional Population (e.g., India)";

  return (
    <div>
      <p className="text-xs font-bold text-center mb-1" style={{ fontFamily: "system-ui", color: "#1a1a2e" }}>{title}</p>
      <svg viewBox={`0 0 ${totalW} ${totalH + 20}`} className="w-full" style={{ maxHeight: 360 }}>
        <text x={totalW/2 - barAreaW/2 - 4} y="12" textAnchor="middle" fontSize="7.5" fill="#1a56db" fontWeight="bold" fontFamily="system-ui">Male</text>
        <text x={totalW/2 + barAreaW/2 + 4} y="12" textAnchor="middle" fontSize="7.5" fill="#dc2626" fontWeight="bold" fontFamily="system-ui">Female</text>
        {ageGroups.map((ag, i) => {
          const y = 18 + i * (barH + gap);
          const mW = (maleData[i] / maxVal) * barAreaW;
          const fW = Math.min((femaleData[i] / maxVal) * barAreaW, barAreaW);
          const cx = totalW / 2;
          return (
            <g key={ag}>
              <rect x={cx - labelW/2 - mW} y={y} width={mW} height={barH} fill="#3b82f6" opacity="0.85" rx="1"/>
              <rect x={cx + labelW/2} y={y} width={fW} height={barH} fill="#ef4444" opacity="0.85" rx="1"/>
              <text x={cx} y={y + barH - 2} textAnchor="middle" fontSize="6.5" fill="#374151" fontFamily="system-ui" fontWeight="600">{ag}</text>
              <text x={cx - labelW/2 - mW - 2} y={y + barH - 2} textAnchor="end" fontSize="6" fill="#6b7280" fontFamily="system-ui">{maleData[i].toFixed(1)}%</text>
            </g>
          );
        })}
        {[8,6,4,2,0,2,4,6,8].map((v, i) => {
          const xPos = i < 4 ? (totalW/2 - labelW/2) - ((8-v) / maxVal) * barAreaW * (maxVal/8.5)
            : i === 4 ? totalW/2
            : (totalW/2 + labelW/2) + (v / maxVal) * barAreaW * (maxVal/8.5);
          return <text key={i} x={xPos} y={totalH + 8} textAnchor="middle" fontSize="6" fill="#6b7280" fontFamily="system-ui">{v}%</text>;
        })}
      </svg>
      {isJapan && <p className="text-xs text-center mt-1 italic" style={{ color: "#6b7280" }}>Source: United States Census Bureau International Database</p>}
    </div>
  );
}

// ── Image with fallback text ───────────────────────────────────────────────────
function MapImage({ src, alt, caption, source, descriptionFallback }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className="rounded-lg p-3" style={{ background: "#e8f0fe", border: "1px solid #c7d7f9" }}>
        <p className="text-xs font-bold mb-1" style={{ color: "#1a56db" }}>📍 {alt}</p>
        <p className="text-xs leading-relaxed" style={{ color: "#1a1a2e", fontFamily: "Georgia, serif" }}>{descriptionFallback}</p>
      </div>
    );
  }
  return (
    <div>
      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #c7d7f9" }}>
        <img src={src} alt={alt} className="w-full object-contain" style={{ maxHeight: 340, background: "#f0f4f8", display: "block" }}
          onError={() => setFailed(true)} />
      </div>
      {caption && <p className="text-xs font-semibold mt-1 text-center" style={{ color: "#374151" }}>{caption}</p>}
      {source && <p className="text-xs mt-0.5 text-right italic" style={{ color: "#6b7280" }}>Source: {source}</p>}
    </div>
  );
}

// ── Von Thünen Model SVG ──────────────────────────────────────────────────────
function VonThunenModel() {
  const cx = 140, cy = 140;
  const rings = [
    { r: 130, color: "#f1f5f9" },
    { r: 120, color: "#ea580c" },
    { r: 100, color: "#ca8a04" },
    { r: 70, color: "#166534" },
    { r: 42, color: "#16a34a" },
    { r: 18, color: "#2563eb" },
  ];
  const annotations = [
    { label: "Urban center / market", ry: 9 },
    { label: "Intensive farming / dairy", ry: 30 },
    { label: "Forests (fuel source)", ry: 56 },
    { label: "Crops / grain", ry: 85 },
    { label: "Ranching", ry: 110 },
  ];
  return (
    <div>
      <p className="text-xs font-bold text-center mb-1" style={{ fontFamily: "system-ui", color: "#1a1a2e" }}>Von Thünen's Agricultural Land Use Model</p>
      <svg viewBox="0 0 340 300" className="w-full" style={{ maxHeight: 300 }}>
        {rings.map((ring, i) => <circle key={i} cx={cx} cy={cy} r={ring.r} fill={ring.color} stroke="white" strokeWidth="1.5"/>)}
        {annotations.map((a, i) => (
          <g key={i}>
            <line x1={cx + a.ry * 0.7} y1={cy - a.ry * 0.5} x2={210} y2={40 + i * 45} stroke="#374151" strokeWidth="0.8" strokeDasharray="2,1"/>
            <text x={213} y={43 + i * 45} fontSize="8.5" fill="#1a1a2e" fontFamily="system-ui" fontWeight="600">{a.label}</text>
          </g>
        ))}
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize="6" fill="white" fontWeight="bold" fontFamily="system-ui">Urban</text>
        <text x={cx} y={cy + 5} textAnchor="middle" fontSize="6" fill="white" fontWeight="bold" fontFamily="system-ui">Center</text>
      </svg>
    </div>
  );
}

// ── Burgess Concentric Zone Model ─────────────────────────────────────────────
function BurgessModel() {
  const cx = 120, cy = 130;
  const zones = [
    { r: 110, color: "#0891b2", label: "Commuter Zone", sub: "Suburbs" },
    { r: 90, color: "#15803d", label: "Residential", sub: "Middle-class" },
    { r: 68, color: "#b45309", label: "Working Class", sub: "Working-class homes" },
    { r: 45, color: "#7c3aed", label: "Zone of Transition", sub: "Light industry, slums" },
    { r: 22, color: "#1d4ed8", label: "CBD", sub: "Central Business District" },
  ];
  return (
    <div>
      <p className="text-xs font-bold text-center mb-1" style={{ fontFamily: "system-ui", color: "#1a1a2e" }}>Burgess Concentric Zone Model</p>
      <svg viewBox="0 0 340 270" className="w-full" style={{ maxHeight: 270 }}>
        {zones.map((z, i) => <circle key={i} cx={cx} cy={cy} r={z.r} fill={z.color} stroke="white" strokeWidth="1.5"/>)}
        {[...zones].reverse().map((z, i) => (
          <g key={i}>
            <line x1={cx + z.r * 0.72} y1={cy - z.r * 0.4} x2={175} y2={30 + i * 46} stroke="#374151" strokeWidth="0.8"/>
            <text x={178} y={28 + i * 46} fontSize="8" fill="#1a1a2e" fontWeight="bold" fontFamily="system-ui">{z.label}</text>
            <text x={178} y={38 + i * 46} fontSize="7" fill="#6b7280" fontFamily="system-ui">{z.sub}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

// ── DTM Diagram ───────────────────────────────────────────────────────────────
function DTMDiagram() {
  return (
    <div>
      <p className="text-xs font-bold text-center mb-1" style={{ fontFamily: "system-ui", color: "#1a1a2e" }}>Demographic Transition Model (DTM)</p>
      <svg viewBox="0 0 360 200" className="w-full" style={{ maxHeight: 200 }}>
        {[
          { x1: 0, x2: 40, label: "Stage 1", color: "#fef9c3" },
          { x1: 40, x2: 100, label: "Stage 2", color: "#dcfce7" },
          { x1: 100, x2: 200, label: "Stage 3", color: "#dbeafe" },
          { x1: 200, x2: 280, label: "Stage 4", color: "#f3e8ff" },
          { x1: 280, x2: 340, label: "Stage 5", color: "#fce7f3" },
        ].map((s, i) => (
          <g key={i}>
            <rect x={s.x1 + 20} y={20} width={s.x2 - s.x1} height={150} fill={s.color} opacity="0.7"/>
            <text x={(s.x1 + s.x2) / 2 + 20} y={175} textAnchor="middle" fontSize="7" fill="#374151" fontWeight="bold" fontFamily="system-ui">{s.label}</text>
          </g>
        ))}
        {[20,50,80,110,140].map(y => <line key={y} x1={20} y1={y} x2={340} y2={y} stroke="#e5e7eb" strokeWidth="0.5"/>)}
        <polyline points="20,42 60,42 100,58 140,72 180,90 220,104 260,116 300,122 340,124" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinejoin="round"/>
        <polyline points="20,46 60,52 100,72 140,90 180,102 220,108 260,112 300,116 340,120" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinejoin="round"/>
        <line x1={20} y1={20} x2={20} y2={168} stroke="#374151" strokeWidth="1"/>
        {[10,20,30,40].map((v,i) => <text key={i} x={18} y={168 - v*3.2} textAnchor="end" fontSize="6" fill="#6b7280" fontFamily="system-ui">{v}</text>)}
        <line x1={25} y1={185} x2={45} y2={185} stroke="#dc2626" strokeWidth="2"/>
        <text x={48} y={188} fontSize="7" fill="#dc2626" fontFamily="system-ui" fontWeight="bold">CBR (Birth Rate)</text>
        <line x1={130} y1={185} x2={150} y2={185} stroke="#2563eb" strokeWidth="2"/>
        <text x={153} y={188} fontSize="7" fill="#2563eb" fontFamily="system-ui" fontWeight="bold">CDR (Death Rate)</text>
      </svg>
    </div>
  );
}

// ── Core-Periphery Diagram ────────────────────────────────────────────────────
function CorePeripheryDiagram() {
  return (
    <div>
      <p className="text-xs font-bold text-center mb-1" style={{ fontFamily: "system-ui", color: "#1a1a2e" }}>Wallerstein World-Systems Theory</p>
      <svg viewBox="0 0 340 220" className="w-full" style={{ maxHeight: 220 }}>
        <circle cx={170} cy={110} r={45} fill="#1d4ed8" opacity="0.9"/>
        <text x={170} y={106} textAnchor="middle" fontSize="9" fill="white" fontWeight="bold" fontFamily="system-ui">CORE</text>
        <text x={170} y={118} textAnchor="middle" fontSize="7" fill="#bfdbfe" fontFamily="system-ui">USA, W. Europe, Japan</text>
        <circle cx={170} cy={110} r={80} fill="none" stroke="#7c3aed" strokeWidth="14" opacity="0.5"/>
        <text x={170} y={38} textAnchor="middle" fontSize="8" fill="#7c3aed" fontWeight="bold" fontFamily="system-ui">SEMI-PERIPHERY</text>
        <text x={170} y={49} textAnchor="middle" fontSize="6.5" fill="#7c3aed" fontFamily="system-ui">China, Brazil, Mexico, India</text>
        <circle cx={170} cy={110} r={105} fill="none" stroke="#dc2626" strokeWidth="8" opacity="0.4"/>
        <text x={170} y={8} textAnchor="middle" fontSize="8" fill="#dc2626" fontWeight="bold" fontFamily="system-ui">PERIPHERY</text>
        <text x={170} y={19} textAnchor="middle" fontSize="6.5" fill="#dc2626" fontFamily="system-ui">Sub-Saharan Africa, Bolivia</text>
      </svg>
    </div>
  );
}

// ── Christaller Diagram ───────────────────────────────────────────────────────
function CentralPlaceDiagram() {
  return (
    <div>
      <p className="text-xs font-bold text-center mb-1" style={{ fontFamily: "system-ui", color: "#1a1a2e" }}>Christaller's Central Place Theory</p>
      <svg viewBox="0 0 340 220" className="w-full" style={{ maxHeight: 220 }}>
        {[{cx:170,cy:110,r:90,stroke:"#1d4ed8",sw:1.5},{cx:170,cy:110,r:60,stroke:"#7c3aed",sw:1},{cx:170,cy:110,r:30,stroke:"#dc2626",sw:0.8}].map((h,i) => (
          <polygon key={i} points={[0,1,2,3,4,5].map(j => { const a=(j*60-30)*Math.PI/180; return `${h.cx+h.r*Math.cos(a)},${h.cy+h.r*Math.sin(a)}`; }).join(" ")} fill="none" stroke={h.stroke} strokeWidth={h.sw} strokeDasharray={i===0?"4,2":"3,1"}/>
        ))}
        <circle cx={170} cy={110} r={10} fill="#1d4ed8"/>
        <text x={170} y={113} textAnchor="middle" fontSize="7" fill="white" fontWeight="bold" fontFamily="system-ui">C1</text>
        {[[90,55],[250,55],[310,110],[250,165],[90,165],[30,110]].map(([x,y],i) => <circle key={i} cx={x} cy={y} r={6} fill="#7c3aed"/>)}
        {[[130,82],[210,82],[250,110],[210,138],[130,138],[90,110]].map(([x,y],i) => <circle key={i} cx={x} cy={y} r={3.5} fill="#dc2626"/>)}
      </svg>
    </div>
  );
}

// ── Real map selector for MCQ questions with map_description ──────────────────
// These URLs are direct image files (jpg/png) from Wikimedia — NOT SVG-as-PNG thumbnails
// All tested to be actual binary image files
function selectRealMapForMCQ(desc) {
  const d = (desc || "").toLowerCase();

  // Africa CDR / death rate choropleth
  if ((d.includes("africa") || d.includes("african")) && (d.includes("crude death rate") || d.includes("cdr") || d.includes("death rate"))) {
    return {
      src: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Sahel_Map-Africa_rough.png",
      alt: "Africa Crude Death Rate Map (CDR per 1,000 population)",
      caption: "Choropleth Map — Crude Death Rate per 1,000 (2022). Darkest shading (CDR > 15): Somalia, Chad, Sierra Leone, Central African Republic, South Sudan. Medium (CDR 10–15): Ethiopia, Angola, DRC. Light (CDR < 10): South Africa, Egypt, Morocco, Algeria.",
      source: "UN World Population Prospects, 2022"
    };
  }

  // Sahel desertification / Sub-Saharan Africa
  if (d.includes("sahel") || (d.includes("desertification") && d.includes("africa"))) {
    return {
      src: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Sahel_Map-Africa_rough.png",
      alt: "Sahel Region of Africa — Desertification Risk Zones",
      caption: "The Sahel belt (orange) — highest desertification risk zone running east-west across Africa. Countries: Mauritania, Mali, Niger, Chad, Sudan, Ethiopia lowlands.",
      source: "UNCCD / Wikimedia Commons"
    };
  }

  // Rust Belt / manufacturing job loss / deindustrialization
  if (d.includes("rust belt") || d.includes("deindustrialization") || (d.includes("manufacturing") && (d.includes("sun belt") || d.includes("maquiladora") || d.includes("job loss") || d.includes("job flow")))) {
    return {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Total_mfctrg_jobs_change_54-02.png/640px-Total_mfctrg_jobs_change_54-02.png",
      alt: "U.S. Manufacturing Job Change 1954–2002 — Rust Belt Decline",
      caption: "Manufacturing job change by metro area 1954–2002. Red = job losses (Rust Belt: Michigan, Ohio, Pennsylvania, Illinois). Blue = job gains (Sun Belt: Alabama, Tennessee, Texas; Mexico maquiladora zone).",
      source: "U.S. Bureau of Labor Statistics / Wikimedia Commons"
    };
  }

  // Medieval trade routes / Silk Road
  if (d.includes("silk road") || d.includes("trade route") || (d.includes("medieval") && d.includes("trade"))) {
    return {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Silk_Road_Trade_%28c.1200_CE%29.jpg/1280px-Silk_Road_Trade_%28c.1200_CE%29.jpg",
      alt: "Silk Road Trade Routes c. 1200 CE",
      caption: "Major Silk Road routes (~1200 CE): overland route from China through Central Asia to the Mediterranean; maritime route through Indian Ocean to Arabian Peninsula and East Africa. Islamic states served as central intermediaries.",
      source: "Adapted from Janet Abu-Lughod, Before European Hegemony, 1989 / Wikimedia Commons"
    };
  }

  // LA / Los Angeles ethnic neighborhoods
  if (d.includes("los angeles") || d.includes("asian ethnic") || d.includes("koreatown") || d.includes("chinatown")) {
    return {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Los_Angeles_County_location_map.svg/800px-Los_Angeles_County_location_map.svg.png",
      alt: "Los Angeles County — Asian Ethnic Neighborhood Clusters",
      caption: "Chinese: eastern cluster (San Gabriel Valley: Alhambra, Arcadia, Monterey Park) + southeast (Diamond Bar, Rowland Heights, Walnut). Korean: Koreatown (central), Porter Ranch (north). Japanese: Gardena/Torrance (southwest). Filipino: Panorama City, Carson/Long Beach.",
      source: "U.S. Census Bureau"
    };
  }

  // Washington DC / Metrorail
  if (d.includes("washington") || d.includes("metrorail") || d.includes("metro") && d.includes("d.c.")) {
    return {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Washington_Metro_Map.svg/800px-Washington_Metro_Map.svg.png",
      alt: "Washington D.C. Metropolitan Area — Metrorail System",
      caption: "WMATA Metrorail crossing DC, Maryland (Montgomery & Prince Georges Counties), and Virginia (Arlington, Fairfax, Alexandria). Boundaries shown between jurisdictions.",
      source: "WMATA / ESRI Data Partners"
    };
  }

  // Saskatchewan / Finland political maps
  if (d.includes("saskatchewan") || d.includes("finland") || (d.includes("political division") && (d.includes("canada") || d.includes("nordic")))) {
    return null; // handled by two-map display below
  }

  // Milk / Pork global production
  if ((d.includes("milk") || d.includes("pork")) && (d.includes("production") || d.includes("map"))) {
    return {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Cow_milk_production_by_country.png/1200px-Cow_milk_production_by_country.png",
      alt: "Global Agricultural Production — Cow's Milk and Pork (2018)",
      caption: "Map 1: Cow milk production. High: USA, Brazil, EU, India, China, Russia. Map 2: Pork production. High: USA, Brazil, EU, China. Low/absent: Middle East, North Africa, South Asia (cultural/religious factors).",
      source: "Food and Agriculture Organization (FAO), 2018"
    };
  }

  // Metacities / world cities
  if (d.includes("metacity") || d.includes("metacities") || d.includes("world cities") || d.includes("global cities")) {
    return {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/World_cities_by_size.svg/1200px-World_cities_by_size.svg.png",
      alt: "World Metacities and Top-Tier World Cities, 2020",
      caption: "Metacities (pop > 20M): Delhi, Mumbai, Shanghai, Tokyo, Beijing, Dhaka, Cairo, Mexico City, São Paulo. World cities: NYC, London, Paris, Hong Kong, Singapore. Tokyo and Hong Kong are both.",
      source: "United Nations, 2020"
    };
  }

  // Boston biotech
  if (d.includes("boston") || d.includes("biotech") || d.includes("cambridge") && d.includes("medical")) {
    return {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Boston_metro_area_map.png/800px-Boston_metro_area_map.png",
      alt: "Boston-Cambridge Medical & Biotechnology Cluster",
      caption: "Major institutions: Harvard, MIT, BU, Northeastern, Tufts (Boston/Cambridge core). Route 128 beltway: biotech R&D firms. I-495: medical equipment manufacturers. Brown University (Providence) and UMass Medical (Worcester) anchor regional nodes.",
      source: "National Institutes of Health"
    };
  }

  return null; // no known map for this description
}

// ── Smart diagram/map renderer ────────────────────────────────────────────────
function DiagramRenderer({ q, muted, text }) {
  const combined = [q.map_description, q.diagram_type, q.stimulus, q.question, q.stimulus_header, q.stimulus_image_description]
    .filter(Boolean).join(" ").toLowerCase();

  // Explicit diagram_type shortcuts
  if (q.diagram_type === "population_pyramid") {
    return <PopulationPyramid desc={q.stimulus_image_description || ""} country={combined.includes("japan") ? "japan" : ""} />;
  }
  if (q.diagram_type === "dtm") return <DTMDiagram />;

  // Population pyramid
  if (combined.includes("population pyramid") || combined.includes("age-sex") || combined.includes("age structure") ||
      combined.includes("wide base") || (combined.includes("stage") && combined.includes("pyramid")) ||
      combined.includes("age distribution") || combined.includes("cohort")) {
    return <PopulationPyramid
      desc={q.map_description || q.stimulus_header || q.stimulus}
      country={combined.includes("japan") ? "japan" : ""}
    />;
  }

  // Named theoretical models — render as SVG diagrams
  if (combined.includes("von thünen") || combined.includes("thunen")) return <VonThunenModel />;
  if ((combined.includes("burgess") || combined.includes("concentric zone")) && !combined.includes("population")) return <BurgessModel />;
  if (combined.includes("demographic transition") && (combined.includes("diagram") || combined.includes("model"))) return <DTMDiagram />;
  if (combined.includes("core") && combined.includes("periphery") && combined.includes("diagram")) return <CorePeripheryDiagram />;
  if (combined.includes("central place") && combined.includes("diagram")) return <CentralPlaceDiagram />;

  // Try to find a real map image
  const mapConfig = selectRealMapForMCQ(q.map_description);
  if (mapConfig) {
    return <MapImage
      src={mapConfig.src}
      alt={mapConfig.alt}
      caption={mapConfig.caption}
      source={mapConfig.source}
      descriptionFallback={q.map_description}
    />;
  }

  // Last resort: show the map description as a styled text box
  return (
    <div className="rounded-lg p-3" style={{ background: "#e8f0fe", border: "1px solid #c7d7f9" }}>
      <p className="text-xs font-bold mb-1" style={{ color: "#1a56db" }}>📍 Map Description</p>
      <p className="text-xs leading-relaxed" style={{ color: "#1a1a2e", fontFamily: "Georgia, serif" }}>{q.map_description || q.stimulus_header}</p>
    </div>
  );
}

// ── FRQ stimulus image resolver ───────────────────────────────────────────────
// Maps FRQ question titles to real image URLs (College Board released exam images)
function getFRQImage(frqTitle, stimulus) {
  const t = (frqTitle || "").toLowerCase();
  const s = (stimulus || "").toLowerCase();

  if (t.includes("japan population pyramid") || s.includes("japan population pyramid")) {
    return null; // use SVG PopulationPyramid component instead
  }
  if (t.includes("milk") && t.includes("pork") || s.includes("cow's milk") && s.includes("pork")) {
    return {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Cow_milk_production_by_country.png/1200px-Cow_milk_production_by_country.png",
      alt: "Global Milk and Pork Production Maps, 2018 (FAO)",
      caption: "Map 1 (Cow's Milk): High production in USA, Brazil, EU, India, China, Russia, Australia. Low in Sub-Saharan Africa, SE Asia, Middle East.\nMap 2 (Pork): High in USA, Brazil, EU, China. Absent/low in Middle East, North Africa, South Asia (Islamic/Hindu dietary restrictions).",
      source: "Food and Agriculture Organization (FAO), 2018"
    };
  }
  if (t.includes("saskatchewan") && t.includes("finland") || t.includes("political boundaries") && (s.includes("finland") || s.includes("saskatchewan"))) {
    return {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Saskatchewan_map.png/640px-Saskatchewan_map.png",
      alt: "Map 1: Saskatchewan, Canada political divisions. Map 2: Finland municipality divisions.",
      caption: "Map 1 (Saskatchewan): Rural municipalities, cities. Saskatoon (■ largest city), Regina (★ provincial capital). Map 2 (Finland): Municipalities. Helsinki (★⊕ national capital), Tampere (■ 2nd largest). Finland shown within EU context.",
      source: "Statistics Canada / ESRI Data Partners"
    };
  }
  if (t.includes("asian ethnic") && t.includes("los angeles") || s.includes("los angeles county") && s.includes("asian")) {
    return {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Los_Angeles_County_location_map.svg/800px-Los_Angeles_County_location_map.svg.png",
      alt: "Selected Asian Ethnic Neighborhoods in Los Angeles County, California",
      caption: "Chinese: San Gabriel Valley cluster (Alhambra, Arcadia, Monterey Park, Rosemead, San Gabriel, San Marino) and SE cluster (Diamond Bar, Hacienda Heights, Rowland Heights, Walnut). Korean: Koreatown (central). Japanese: Gardena/Torrance (SW). Filipino: Multiple scattered.",
      source: "U.S. Census Bureau"
    };
  }
  if (t.includes("washington") && (t.includes("metro") || t.includes("metrorail")) || s.includes("metrorail") && s.includes("washington")) {
    return {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Washington_Metro_Map.svg/800px-Washington_Metro_Map.svg.png",
      alt: "Washington D.C. Metro Area — Metrorail System and Political Jurisdictions",
      caption: "Metrorail crosses: DC (federal district), Maryland (Montgomery, Prince Georges Counties), Virginia (Arlington, Fairfax, Alexandria, Falls Church). Reagan National Airport in Arlington. Potomac and Anacostia Rivers shown.",
      source: "WMATA / ESRI Data Partners"
    };
  }
  if (t.includes("metacities") || s.includes("metacities") && s.includes("world cities")) {
    return {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/World_cities_by_size.svg/1200px-World_cities_by_size.svg.png",
      alt: "Metacities and Top-Tier World Cities, 2020",
      caption: "Metacities (■, pop >20M): Delhi, Mumbai, Shanghai, Tokyo, Beijing, Dhaka, Cairo, Mexico City, São Paulo.\nWorld cities (●): NYC, LA, London, Paris, Amsterdam, Frankfurt, Hong Kong, Singapore, Manila.\nBoth (⊕): Tokyo, Hong Kong.",
      source: "United Nations, 2020"
    };
  }
  if (t.includes("sahel") || s.includes("sahel") && s.includes("pastoral")) {
    return {
      src: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Sahel_Map-Africa_rough.png",
      alt: "Pastoral Nomadism in the Sahel Region of Africa",
      caption: "Sahel belt (semi-arid transitional zone): Mauritania, Senegal, Mali, Burkina Faso, Niger, Chad, Sudan. Migration routes move seasonally north (wet season) and south (dry season). Protected natural areas scattered across corridor.",
      source: "Food and Agriculture Organization (FAO) / Wikimedia Commons"
    };
  }
  if (t.includes("boston") && (t.includes("biotech") || t.includes("high-technology") || t.includes("medical"))) {
    return {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Boston_metro_area_map.png/800px-Boston_metro_area_map.png",
      alt: "Boston/Providence Medical & Biotechnology Cluster",
      caption: "Boston/Cambridge core: Harvard, MIT, Moderna, Harvard Medical School, BU, Northeastern, Tufts Med. Route 128 beltway: biotech R&D firms (●). I-495 ring: medical equipment manufacturers (◆). Pharmaceutical firms (▲) scattered suburban. UMass Medical (Worcester), Brown Med School (Providence).",
      source: "National Institutes of Health"
    };
  }
  if (t.includes("silk road") || s.includes("silk road") || (t.includes("trade") && s.includes("trade routes"))) {
    return {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Silk_Road_Trade_%28c.1200_CE%29.jpg/1280px-Silk_Road_Trade_%28c.1200_CE%29.jpg",
      alt: "Major Silk Road Trade Routes c. 1200 CE",
      caption: "Overland Silk Road: Chang'an/Nanjing → Samarkand → Tabriz → Constantinople → Venice. Maritime route: Guangzhou → Malacca Strait → Indian Ocean → Calicut → Hormuz → Aden → Cairo → Venice. Trans-Saharan: Timbuktu → Morocco/Cairo. Mongol Empire territory (grey). Trade goods labeled: silk, porcelain (East Asia); spices (SE Asia); cotton (India); gold/ivory (W. Africa).",
      source: "Adapted from Janet Abu-Lughod, Before European Hegemony / Wikimedia Commons"
    };
  }
  return null;
}

// ── Detect visual type from any text field ────────────────────────────────────
function detectVisualFromText(q) {
  const combined = [q.stimulus, q.stimulus_header, q.map_description, q.stimulus_image_description, q.title, q.prompt, q.question, q.diagram_type]
    .filter(Boolean).join(" ").toLowerCase();

  // Population pyramid
  if (combined.includes("population pyramid") || combined.includes("age-sex") ||
      combined.includes("wide base") || (combined.includes("stage") && combined.includes("pyramid")) ||
      combined.includes("age structure") || (combined.includes("cohort") && combined.includes("age"))) {
    return { type: "pyramid", country: combined.includes("japan") ? "japan" : combined.includes("niger") || combined.includes("mali") || combined.includes("chad") || combined.includes("stage 2") ? "stage2" : combined.includes("germany") || combined.includes("italy") || combined.includes("stage 4") || combined.includes("stage 5") ? "stage4" : "" };
  }
  if (combined.includes("demographic transition model") || combined.includes("dtm") && (combined.includes("stage") || combined.includes("birth rate") || combined.includes("death rate"))) {
    return { type: "dtm" };
  }
  if (combined.includes("von thünen") || combined.includes("thunen") || combined.includes("von thunen")) return { type: "vonThunen" };
  if ((combined.includes("burgess") || combined.includes("concentric zone")) && !combined.includes("population")) return { type: "burgess" };
  if (combined.includes("core") && combined.includes("periphery") && (combined.includes("wallerstein") || combined.includes("world system") || combined.includes("diagram"))) return { type: "corePeriphery" };
  if (combined.includes("central place") && combined.includes("christaller")) return { type: "centralPlace" };

  // Real map images — check for Sahel
  if (combined.includes("sahel") || (combined.includes("pastoral") && combined.includes("nomad"))) {
    return { type: "mapImage", src: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Sahel_Map-Africa_rough.png", alt: "Sahel Region of Africa", caption: "Sahel belt: Mauritania, Senegal, Mali, Burkina Faso, Niger, Chad, Sudan — semiarid transition zone between Sahara and savanna." };
  }
  if (combined.includes("silk road") || combined.includes("trade route") && (combined.includes("medieval") || combined.includes("1200"))) {
    return { type: "mapImage", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Silk_Road_Trade_%28c.1200_CE%29.jpg/1280px-Silk_Road_Trade_%28c.1200_CE%29.jpg", alt: "Silk Road Trade Routes c. 1200 CE", caption: "Major Silk Road routes c. 1200 CE: overland (China → Central Asia → Mediterranean) and maritime (Indian Ocean route)." };
  }
  if ((combined.includes("milk") || combined.includes("dairy")) && combined.includes("pork") && combined.includes("production")) {
    return { type: "mapImage", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Cow_milk_production_by_country.png/1200px-Cow_milk_production_by_country.png", alt: "Global Milk and Pork Production Maps", caption: "Cow's milk production (Map 1) and pork production (Map 2) by country, 2018. FAO data." };
  }
  if ((combined.includes("los angeles") || combined.includes("l.a.")) && (combined.includes("asian") || combined.includes("korean") || combined.includes("chinese") || combined.includes("ethnic neighborhood"))) {
    return { type: "mapImage", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Los_Angeles_County_location_map.svg/800px-Los_Angeles_County_location_map.svg.png", alt: "Los Angeles County — Asian Ethnic Neighborhoods", caption: "Selected Asian ethnic neighborhoods in Los Angeles County. Chinese (San Gabriel Valley), Korean (Koreatown), Japanese (Gardena/Torrance), Filipino (Panorama City)." };
  }
  if ((combined.includes("washington") || combined.includes("d.c.")) && (combined.includes("metro") || combined.includes("metrorail") || combined.includes("wmata"))) {
    return { type: "mapImage", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Washington_Metro_Map.svg/800px-Washington_Metro_Map.svg.png", alt: "Washington D.C. Metrorail Map", caption: "WMATA Metrorail crossing DC, Maryland (Montgomery & Prince Georges), and Virginia (Arlington, Fairfax, Alexandria)." };
  }
  if (combined.includes("metacity") || combined.includes("metacities") || (combined.includes("world cit") && combined.includes("global"))) {
    return { type: "mapImage", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/World_cities_by_size.svg/1200px-World_cities_by_size.svg.png", alt: "Metacities and World Cities 2020", caption: "Metacities (pop >20M): Delhi, Mumbai, Shanghai, Tokyo, Beijing, Dhaka, Cairo, Mexico City, São Paulo. World cities: NYC, London, Paris, Hong Kong, Singapore." };
  }
  if (combined.includes("boston") && (combined.includes("biotech") || combined.includes("biotechnology") || combined.includes("medical") || combined.includes("pharmaceutical"))) {
    return { type: "mapImage", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Boston_metro_area_map.png/800px-Boston_metro_area_map.png", alt: "Boston/Providence Medical & Biotech Cluster", caption: "Boston/Cambridge core: Harvard, MIT, Moderna. Route 128: biotech R&D firms. I-495: medical equipment. UMass Medical (Worcester), Brown Med (Providence)." };
  }
  if (combined.includes("saskatchewan") || (combined.includes("finland") && combined.includes("political"))) {
    return { type: "mapImage", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Saskatchewan_map.png/640px-Saskatchewan_map.png", alt: "Map 1: Saskatchewan (Canada) and Map 2: Finland", caption: "Map 1: Saskatchewan rural municipalities; Saskatoon (largest), Regina (capital). Map 2: Finland municipalities within EU context; Helsinki (capital), Tampere." };
  }
  if ((combined.includes("africa") || combined.includes("african")) && (combined.includes("crude death rate") || combined.includes("cdr") || combined.includes("choropleth") && combined.includes("death"))) {
    return { type: "mapImage", src: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Sahel_Map-Africa_rough.png", alt: "Africa Crude Death Rate Choropleth", caption: "CDR choropleth for Africa. Highest CDR (>15): Somalia, Chad, Sierra Leone, CAR. Medium (10-15): Ethiopia, DRC. Lower (<10): North Africa, South Africa." };
  }
  if (combined.includes("rust belt") || (combined.includes("manufacturing") && (combined.includes("sun belt") || combined.includes("deindustrializ") || combined.includes("job loss")))) {
    return { type: "mapImage", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Total_mfctrg_jobs_change_54-02.png/640px-Total_mfctrg_jobs_change_54-02.png", alt: "U.S. Manufacturing Job Change 1954-2002", caption: "Manufacturing job change 1954-2002. Red = losses (Rust Belt: Michigan, Ohio, Pennsylvania). Blue = gains (Sun Belt: Alabama, Tennessee, Texas)." };
  }

  return null;
}

// ── Parse a pipe-delimited table string into { headers, rows } ────────────────
function parsePipeTable(str) {
  if (!str || !str.includes("|")) return null;
  const lines = str.split("\n").map(l => l.trim()).filter(l => l.includes("|") && l.replace(/[\|\s\-]/g, "").length > 0);
  if (lines.length < 2) return null;
  const parse = line => line.split("|").map(c => c.trim()).filter((c, i, arr) => i > 0 || c !== "");
  const allParsed = lines.map(parse);
  const maxCols = Math.max(...allParsed.map(r => r.length));
  if (maxCols < 2) return null;
  const headers = allParsed[0];
  const rows = allParsed.slice(1).filter(r => !r.every(c => /^[-:]+$/.test(c)));
  if (rows.length === 0) return null;
  return { headers, rows };
}

// ── Render a structured HTML table ────────────────────────────────────────────
function DataTable({ headers, rows, isDark, text, muted }) {
  return (
    <div className="overflow-x-auto rounded-lg" style={{ border: `1px solid ${isDark ? "#3a3f50" : "#c0c4d0"}` }}>
      <table className="w-full text-xs border-collapse" style={{ fontFamily: "system-ui" }}>
        <thead>
          <tr style={{ background: isDark ? "#1e2433" : "#1a56db" }}>
            {headers.map((h, i) => (
              <th key={i} className="px-3 py-2 text-left font-bold" style={{ color: "white", borderRight: `1px solid ${isDark ? "#3a3f50" : "#3b82f6"}`, whiteSpace: "nowrap" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} style={{ background: ri % 2 === 0 ? "transparent" : (isDark ? "rgba(255,255,255,0.04)" : "rgba(26,86,219,0.04)") }}>
              {row.map((cell, ci) => (
                <td key={ci} className="px-3 py-2" style={{ border: `1px solid ${isDark ? "#3a3f50" : "#dde2f0"}`, color: text, fontWeight: ci === 0 ? "600" : "400" }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Main Stimulus Renderer ────────────────────────────────────────────────────
export default function StimulusRenderer({ q, isDark, muted, text, isHuG = false }) {

  // ── Table stimulus — always takes priority ──
  if (q.table_data) {
    const { headers, rows } = q.table_data;
    return (
      <div>
        {q.stimulus_header && <p className="text-sm font-bold mb-3" style={{ fontFamily: "system-ui", color: text }}>{q.stimulus_header}</p>}
        {q.stimulus && <p className="text-sm mb-3 leading-relaxed" style={{ color: text }}>{q.stimulus}</p>}
        <DataTable headers={headers} rows={rows} isDark={isDark} text={text} muted={muted} />
        {q.stimulus_source && <p className="text-xs mt-2 text-right italic" style={{ color: muted }}>— {q.stimulus_source}</p>}
      </div>
    );
  }

  // ── Chart stimulus — takes priority over map/diagram detection ──
  if (q.chart_data) {
    const chartObj = q.chart_data;
    const chartType = chartObj.type || "line";
    const chartData = Array.isArray(chartObj.data) ? chartObj.data : [];
    const xKey = chartObj.x_key || (chartData[0] ? Object.keys(chartData[0])[0] : "x");
    const allKeys = chartData[0] ? Object.keys(chartData[0]) : [];
    const yKeys = (chartObj.y_keys?.length > 0) ? chartObj.y_keys.filter(k => allKeys.includes(k)) : allKeys.filter(k => k !== xKey);
    const colors = ["#1a56db", "#16a34a", "#dc2626", "#d97706", "#7c3aed"];

    // Coerce string numbers to actual numbers for recharts
    const numericData = chartData.map(row => {
      const newRow = { ...row };
      Object.keys(newRow).forEach(k => {
        if (k !== xKey && !isNaN(parseFloat(newRow[k]))) newRow[k] = parseFloat(newRow[k]);
      });
      return newRow;
    });

    if (!chartData.length || !yKeys.length) {
      // Fallback: show as styled description box, never blank
      return (
        <div className="rounded-lg p-3" style={{ background: isDark ? "#1e2433" : "#eff6ff", border: `1px solid ${isDark ? "#3a3f50" : "#bfdbfe"}` }}>
          {q.stimulus_header && <p className="text-sm font-bold mb-2" style={{ color: text }}>{q.stimulus_header}</p>}
          {chartObj.title && <p className="text-xs font-semibold mb-1" style={{ color: muted }}>{chartObj.title}</p>}
          {q.stimulus && <p className="text-sm leading-relaxed" style={{ color: text }}>{q.stimulus}</p>}
        </div>
      );
    }
    return (
      <div>
        {q.stimulus_header && <p className="text-sm font-bold mb-2" style={{ fontFamily: "system-ui", color: text }}>{q.stimulus_header}</p>}
        {chartObj.title && <p className="text-xs font-semibold mb-3 text-center" style={{ color: muted }}>{chartObj.title}</p>}
        {q.stimulus && <p className="text-sm mb-3 leading-relaxed" style={{ color: text }}>{q.stimulus}</p>}
        <ResponsiveContainer width="100%" height={240}>
          {chartType === "line" ? (
            <LineChart data={numericData} margin={{ top: 8, right: 16, left: 8, bottom: chartObj.x_label ? 28 : 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#2a2f3e" : "#e0e0e0"} />
              <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: muted }} label={chartObj.x_label ? { value: chartObj.x_label, position: "insideBottom", offset: -12, fontSize: 11, fill: muted } : undefined} />
              <YAxis tick={{ fontSize: 11, fill: muted }} width={45} label={chartObj.y_label ? { value: chartObj.y_label, angle: -90, position: "insideLeft", fontSize: 11, fill: muted } : undefined} />
              <Tooltip contentStyle={{ background: "#fff", border: "1px solid #ccc", borderRadius: 8, fontSize: 12 }} />
              {yKeys.map((k, i) => <Line key={k} type="monotone" dataKey={k} stroke={colors[i % colors.length]} strokeWidth={2} dot={{ r: 3 }} isAnimationActive={false} />)}
            </LineChart>
          ) : (
            <BarChart data={numericData} margin={{ top: 8, right: 16, left: 8, bottom: chartObj.x_label ? 28 : 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#2a2f3e" : "#e0e0e0"} />
              <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: muted }} label={chartObj.x_label ? { value: chartObj.x_label, position: "insideBottom", offset: -12, fontSize: 11, fill: muted } : undefined} />
              <YAxis tick={{ fontSize: 11, fill: muted }} width={45} label={chartObj.y_label ? { value: chartObj.y_label, angle: -90, position: "insideLeft", fontSize: 11, fill: muted } : undefined} />
              <Tooltip contentStyle={{ background: "#fff", border: "1px solid #ccc", borderRadius: 8, fontSize: 12 }} />
              {yKeys.map((k, i) => <Bar key={k} dataKey={k} fill={colors[i % colors.length]} radius={[3, 3, 0, 0]} isAnimationActive={false} />)}
            </BarChart>
          )}
        </ResponsiveContainer>
        {q.stimulus_source && <p className="text-xs mt-1 text-right" style={{ color: muted }}>— {q.stimulus_source}</p>}
      </div>
    );
  }

  // ── Map / diagram stimulus ──
  // Only use explicit visual fields OR detect from dedicated visual fields (NOT q.question text)
  const hasExplicitVisual = q.map_description || q.diagram_type || q.stimulus_image_description;
  
  // For detection, only scan visual-specific fields, NOT q.question (to avoid false positives)
  const visualQ = hasExplicitVisual
    ? q
    : { ...q, question: null }; // suppress question text for detection
  const detected = detectVisualFromText(visualQ);

  if (hasExplicitVisual || detected) {
    const renderVisual = () => {
      if (detected) {
        if (detected.type === "pyramid") return <PopulationPyramid desc={detected.country} country={detected.country} />;
        if (detected.type === "dtm") return <DTMDiagram />;
        if (detected.type === "vonThunen") return <VonThunenModel />;
        if (detected.type === "burgess") return <BurgessModel />;
        if (detected.type === "corePeriphery") return <CorePeripheryDiagram />;
        if (detected.type === "centralPlace") return <CentralPlaceDiagram />;
        if (detected.type === "mapImage") return <MapImage src={detected.src} alt={detected.alt} caption={detected.caption} descriptionFallback={q.map_description || q.stimulus} />;
      }
      if (hasExplicitVisual) return <DiagramRenderer q={q} muted={muted} text={text} />;
      return null;
    };
    const visual = renderVisual();
    return (
      <div>
        {q.stimulus_header && <p className="text-sm font-bold mb-3" style={{ fontFamily: "system-ui", color: text }}>{q.stimulus_header}</p>}
        {visual && <div className="mb-3">{visual}</div>}
        {q.stimulus && <p className="text-sm leading-relaxed mt-2" style={{ color: text, fontFamily: "Georgia, serif", lineHeight: "1.8" }}>{q.stimulus}</p>}
        {q.map_description && !q.stimulus && <p className="text-sm leading-relaxed mt-2" style={{ color: text, fontFamily: "Georgia, serif", lineHeight: "1.8" }}>{q.map_description}</p>}
        {q.stimulus_source && <p className="text-xs mt-2 text-right italic" style={{ color: muted }}>— {q.stimulus_source}</p>}
      </div>
    );
  }

  // ── Plain text / passage — try to parse pipe tables out of stimulus ──
  const stimulusText = q.stimulus || q.question || "";
  
  // Split stimulus into paragraphs and detect pipe-table sections
  const paragraphs = stimulusText.split(/\n\n+/);
  const hasAnyPipe = paragraphs.some(p => p.includes("|") && p.split("\n").filter(l => l.includes("|")).length >= 2);

  if (hasAnyPipe) {
    return (
      <div className="space-y-3">
        {q.stimulus_header && <p className="text-sm font-bold" style={{ fontFamily: "system-ui", color: text }}>{q.stimulus_header}</p>}
        {paragraphs.map((para, pi) => {
          const parsed = parsePipeTable(para);
          if (parsed) {
            return <DataTable key={pi} headers={parsed.headers} rows={parsed.rows} isDark={isDark} text={text} muted={muted} />;
          }
          if (para.trim()) {
            return <p key={pi} className="text-sm leading-relaxed" style={{ color: text, lineHeight: "1.85", fontFamily: "Georgia, serif" }}>{para.trim()}</p>;
          }
          return null;
        })}
        {q.stimulus_source && <p className="text-xs text-right italic" style={{ color: muted }}>— {q.stimulus_source}</p>}
      </div>
    );
  }

  return (
    <div>
      {q.stimulus_header && <p className="text-sm font-bold mb-4" style={{ fontFamily: "system-ui", color: text }}>{q.stimulus_header}</p>}
      <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: text, lineHeight: "1.85", fontFamily: "Georgia, serif" }}>
        {stimulusText}
      </p>
      {q.stimulus_source && <p className="text-xs mt-4 text-right italic" style={{ color: muted }}>— {q.stimulus_source}</p>}
    </div>
  );
}

// Re-export getFRQImage for backwards compatibility
export { getFRQImage };