import { useState } from "react";
import { ChevronDown } from "lucide-react";

// Detect language script from text
export function detectLanguage(text) {
  if (!text) return null;
  const s = text;
  if (/[\u3040-\u309F\u30A0-\u30FF]/.test(s)) return "japanese";
  if (/[\u4E00-\u9FFF]/.test(s)) return "chinese";
  if (/[\uAC00-\uD7AF\u1100-\u11FF]/.test(s)) return "korean";
  if (/[\u0600-\u06FF]/.test(s)) return "arabic";
  if (/[\u0400-\u04FF]/.test(s)) return "russian";
  if (/[\u0900-\u097F]/.test(s)) return "hindi";
  if (/[\u0370-\u03FF]/.test(s)) return "greek";
  return null;
}

const KEYBOARDS = {
  japanese: {
    label: "日本語",
    tabs: [
      {
        name: "Hiragana",
        rows: [
          ["あ","い","う","え","お"],
          ["か","き","く","け","こ"],
          ["さ","し","す","せ","そ"],
          ["た","ち","つ","て","と"],
          ["な","に","ぬ","ね","の"],
          ["は","ひ","ふ","へ","ほ"],
          ["ま","み","む","め","も"],
          ["や","ゆ","よ","ら","り"],
          ["る","れ","ろ","わ","を"],
          ["ん","っ","ー","、","。"],
          ["が","ぎ","ぐ","げ","ご"],
          ["ざ","じ","ず","ぜ","ぞ"],
          ["だ","ぢ","づ","で","ど"],
          ["ば","び","ぶ","べ","ぼ"],
          ["ぱ","ぴ","ぷ","ぺ","ぽ"],
        ],
      },
      {
        name: "Katakana",
        rows: [
          ["ア","イ","ウ","エ","オ"],
          ["カ","キ","ク","ケ","コ"],
          ["サ","シ","ス","セ","ソ"],
          ["タ","チ","ツ","テ","ト"],
          ["ナ","ニ","ヌ","ネ","ノ"],
          ["ハ","ヒ","フ","ヘ","ホ"],
          ["マ","ミ","ム","メ","モ"],
          ["ヤ","ユ","ヨ","ラ","リ"],
          ["ル","レ","ロ","ワ","ヲ"],
          ["ン","ッ","ー","、","。"],
        ],
      },
    ],
  },
  chinese: {
    label: "中文",
    tabs: [
      {
        name: "Common",
        rows: [
          ["的","一","是","在","不"],
          ["了","有","和","人","这"],
          ["中","大","为","上","个"],
          ["国","我","以","要","他"],
          ["时","来","用","们","生"],
          ["到","作","地","于","出"],
          ["就","分","对","成","会"],
          ["可","主","发","年","动"],
          ["同","工","也","能","下"],
          ["过","子","说","产","种"],
          ["面","而","方","后","多"],
          ["定","行","学","法","所"],
          ["民","得","经","十","三"],
          ["之","进","着","等","部"],
          ["度","家","电","力","里"],
          ["如","水","化","高","自"],
          ["二","理","起","小","物"],
          ["现","实","加","量","都"],
          ["两","体","制","机","当"],
          ["使","点","从","业","本"],
          ["去","把","性","好","应"],
          ["开","它","合","还","因"],
          ["由","其","些","然","前"],
          ["外","天","政","四","日"],
          ["那","社","义","事","平"],
          ["形","相","全","表","间"],
          ["样","与","关","各","重"],
          ["新","线","内","数","正"],
          ["心","反","你","明","看"],
          ["原","又","么","利","比"],
          ["或","但","质","气","第"],
          ["向","道","命","此","变"],
          ["条","只","没","结","解"],
          ["问","意","建","月","公"],
          ["无","系","军","很","情"],
          ["者","最","立","代","想"],
          ["已","通","并","提","直"],
          ["题","党","程","展","五"],
          ["想","计","特","运","什"],
          ["知","过","感","志","认"],
          ["价","境","流","技","回"],
          ["期","路","层","美","压"],
          ["命","终","革","果","断"],
          ["改","空","长","称","育"],
          ["何","手","机","按","设"],
          ["。","，","？","！","："],
        ],
      },
    ],
  },
  korean: {
    label: "한국어",
    tabs: [
      {
        name: "Hangul",
        rows: [
          ["ㅂ","ㅈ","ㄷ","ㄱ","ㅅ"],
          ["ㅁ","ㄴ","ㅇ","ㄹ","ㅎ"],
          ["ㅋ","ㅌ","ㅊ","ㅍ","ㄲ"],
          ["ㄸ","ㅃ","ㅆ","ㅉ","ㄳ"],
          ["ㅏ","ㅑ","ㅓ","ㅕ","ㅗ"],
          ["ㅛ","ㅜ","ㅠ","ㅡ","ㅣ"],
          ["ㅐ","ㅒ","ㅔ","ㅖ","ㅘ"],
          ["ㅙ","ㅚ","ㅝ","ㅞ","ㅟ"],
          ["ㅢ","가","나","다","라"],
          ["마","바","사","아","자"],
          ["차","카","타","파","하"],
          ["이","은","는","을","를"],
          ["에","의","와","과","도"],
          ["에서","로","으로","가","이"],
          ["。","，","？","！","·"],
        ],
      },
    ],
  },
  arabic: {
    label: "عربي",
    tabs: [
      {
        name: "Arabic",
        rows: [
          ["ض","ص","ث","ق","ف"],
          ["غ","ع","ه","خ","ح"],
          ["ج","د","ذ","ر","ز"],
          ["س","ش","ي","ب","ل"],
          ["ا","ت","ن","م","ك"],
          ["ة","ى","و","ء","ئ"],
          ["ؤ","إ","أ","آ","ـ"],
          ["ً","ٌ","ٍ","َ","ُ"],
          ["ِ","ّ","ْ","،","؟"],
        ],
      },
    ],
  },
  russian: {
    label: "Русский",
    tabs: [
      {
        name: "Cyrillic",
        rows: [
          ["й","ц","у","к","е"],
          ["н","г","ш","щ","з"],
          ["х","ъ","ф","ы","в"],
          ["а","п","р","о","л"],
          ["д","ж","э","я","ч"],
          ["с","м","и","т","ь"],
          ["б","ю","ё","ю","э"],
          [",",".","-","!","?"],
        ],
      },
    ],
  },
  hindi: {
    label: "हिन्दी",
    tabs: [
      {
        name: "Devanagari",
        rows: [
          ["अ","आ","इ","ई","उ"],
          ["ऊ","ए","ऐ","ओ","औ"],
          ["क","ख","ग","घ","ङ"],
          ["च","छ","ज","झ","ञ"],
          ["ट","ठ","ड","ढ","ण"],
          ["त","थ","द","ध","न"],
          ["प","फ","ब","भ","म"],
          ["य","र","ल","व","श"],
          ["ष","स","ह","क्ष","त्र"],
          ["ज्ञ","ा","ि","ी","ु"],
          ["ू","े","ै","ो","ौ"],
          ["ं","ः","्","।","?"],
        ],
      },
    ],
  },
  greek: {
    label: "Ελληνικά",
    tabs: [
      {
        name: "Greek",
        rows: [
          ["α","β","γ","δ","ε"],
          ["ζ","η","θ","ι","κ"],
          ["λ","μ","ν","ξ","ο"],
          ["π","ρ","σ","τ","υ"],
          ["φ","χ","ψ","ω","ς"],
          ["Α","Β","Γ","Δ","Ε"],
          ["Ζ","Η","Θ","Ι","Κ"],
          ["Λ","Μ","Ν","Ξ","Ο"],
          ["Π","Ρ","Σ","Τ","Υ"],
          ["Φ","Χ","Ψ","Ω","΄"],
          [",",".",";","!","?"],
        ],
      },
    ],
  },
};

export default function LanguageKeyboard({ lang, onKey, onBackspace, onSpace }) {
  const [activeTab, setActiveTab] = useState(0);
  const [collapsed, setCollapsed] = useState(false);

  const kb = KEYBOARDS[lang];
  if (!kb) return null;

  const tab = kb.tabs[activeTab];

  const cardStyle = { background: "var(--app-surface)", border: "1px solid var(--app-border)" };
  const mutedStyle = { color: "var(--app-text-muted)" };

  return (
    <div className="rounded-2xl overflow-hidden mb-4" style={cardStyle}>
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2" style={{ borderBottom: "1px solid var(--app-border)" }}>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-violet-400">{kb.label} Keyboard</span>
          {kb.tabs.length > 1 && kb.tabs.map((t, i) => (
            <button
              key={t.name}
              onClick={() => setActiveTab(i)}
              className={`text-xs px-2 py-0.5 rounded-lg font-semibold transition-all ${activeTab === i ? "bg-violet-500/20 text-violet-400" : "opacity-50 hover:opacity-80"}`}
            >
              {t.name}
            </button>
          ))}
        </div>
        <button onClick={() => setCollapsed(c => !c)} className="opacity-50 hover:opacity-80 transition-all">
          <ChevronDown className={`w-4 h-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
        </button>
      </div>

      {!collapsed && (
        <div className="p-2">
          {/* Key rows */}
          <div className="flex flex-wrap gap-1 mb-2">
            {tab.rows.flat().map((char, i) => (
              <button
                key={i}
                onMouseDown={e => { e.preventDefault(); onKey(char); }}
                className="px-2.5 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-80 active:scale-95"
                style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)", minWidth: 36 }}
              >
                {char}
              </button>
            ))}
          </div>
          {/* Control row */}
          <div className="flex gap-1">
            <button
              onMouseDown={e => { e.preventDefault(); onSpace(); }}
              className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all hover:opacity-80 active:scale-95"
              style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)" }}
            >
              Space
            </button>
            <button
              onMouseDown={e => { e.preventDefault(); onBackspace(); }}
              className="px-4 py-2 rounded-lg text-xs font-semibold transition-all hover:opacity-80 active:scale-95"
              style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)" }}
            >
              ⌫
            </button>
          </div>
        </div>
      )}
    </div>
  );
}