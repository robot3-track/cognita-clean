
const PUB_ID = "ca-pub-3207455851065433";
const BANNER_SLOT = "6987810946";
const INTERSTITIAL_SLOT = "9494380740";
const AD_SCRIPT_ID = "adsense-script";

let scriptLoadPromise = null;

function loadAdScript() {
  if (scriptLoadPromise) return scriptLoadPromise;
  scriptLoadPromise = new Promise((resolve) => {
    if (document.getElementById(AD_SCRIPT_ID)) {
      // Script tag exists — wait for it or resolve immediately if already loaded
      const existing = document.getElementById(AD_SCRIPT_ID);
      if (window.adsbygoogle) { resolve(); return; }
      existing.addEventListener("load", resolve);
      existing.addEventListener("error", resolve);
      return;
    }
    const script = document.createElement("script");
    script.id = AD_SCRIPT_ID;
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${PUB_ID}`;
    script.crossOrigin = "anonymous";
    script.onload = resolve;
    script.onerror = resolve;
    document.head.appendChild(script);
  });
  return scriptLoadPromise;
}

// ─── Interstitial (unchanged logic) ──────────────────────────────────────────
let interstitialShownAt = 0;
const INTERSTITIAL_COOLDOWN = 60_000;

export function showInterstitialAd() {
  const now = Date.now();
  if (now - interstitialShownAt < INTERSTITIAL_COOLDOWN) return;
  interstitialShownAt = now;

  const overlay = document.createElement("div");
  overlay.id = "cognita-interstitial";
  overlay.style.cssText = `position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,0.88);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;`;

  const inner = document.createElement("div");
  inner.style.cssText = `background:#1a1a2e;border:1px solid rgba(255,255,255,0.1);border-radius:20px;padding:24px;max-width:360px;width:90%;text-align:center;`;

  const label = document.createElement("p");
  label.style.cssText = "color:rgba(255,255,255,0.35);font-size:11px;margin-bottom:12px;text-transform:uppercase;letter-spacing:1px;";
  label.textContent = "Advertisement";

  const ins = document.createElement("ins");
  ins.className = "adsbygoogle";
  ins.style.cssText = "display:block;width:300px;height:250px;margin:0 auto;";
  ins.setAttribute("data-ad-client", PUB_ID);
  ins.setAttribute("data-ad-slot", INTERSTITIAL_SLOT);
  ins.setAttribute("data-ad-format", "rectangle");
  ins.setAttribute("data-full-width-responsive", "false");

  const footer = document.createElement("div");
  footer.style.cssText = "display:flex;align-items:center;justify-content:space-between;margin-top:16px;gap:12px;";

  const countdown = document.createElement("span");
  countdown.style.cssText = "color:rgba(255,255,255,0.4);font-size:12px;min-width:80px;text-align:left;";
  countdown.textContent = "Close in 5s";

  const closeBtn = document.createElement("button");
  closeBtn.style.cssText = `background:rgba(139,92,246,0.2);border:1px solid rgba(139,92,246,0.3);color:#a78bfa;padding:10px 24px;border-radius:12px;font-weight:600;font-size:14px;cursor:pointer;opacity:0.4;pointer-events:none;`;
  closeBtn.textContent = "Continue →";

  footer.appendChild(countdown);
  footer.appendChild(closeBtn);
  inner.appendChild(label);
  inner.appendChild(ins);
  inner.appendChild(footer);
  overlay.appendChild(inner);
  document.body.appendChild(overlay);

  loadAdScript().then(() => {
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
  });

  let secondsLeft = 5;
  const tick = setInterval(() => {
    secondsLeft--;
    if (secondsLeft > 0) {
      countdown.textContent = `Close in ${secondsLeft}s`;
    } else {
      clearInterval(tick);
      countdown.textContent = "";
      closeBtn.style.opacity = "1";
      closeBtn.style.pointerEvents = "auto";
    }
  }, 1000);

  const close = () => { clearInterval(tick); overlay.remove(); };
  closeBtn.addEventListener("click", close);
  setTimeout(close, 30_000);
}

// ─── Banner Component ─────────────────────────────────────────────────────────
// Only renders visibly if Google actually fills the ad slot.
// Uses MutationObserver to detect when adsbygoogle inserts an iframe.
const SMART_LINK = "https://decidesqueak.com/h668trbaz?key=ca59d73aacdfe35327eaeddee08edbca";

export default function AdMobBanner() {
  // Ads are currently disabled
  return null;

   
  return (
    <a
      href="https://decidesqueak.com/h668trbaz?key=ca59d73aacdfe35327eaeddee08edbca"
      target="_blank"
      rel="noopener noreferrer"
      className="w-full flex flex-col items-center justify-center overflow-hidden"
      style={{
        position: "relative",
        zIndex: 1,
        background: "#0a0a0f",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "6px",
        minHeight: 66,
        textDecoration: "none",
        pointerEvents: "auto",
      }}
    >
      <span style={{ fontSize: 10, fontWeight: 500, color: "rgba(255,255,255,0.5)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 4 }}>
        advertisement
      </span>
      <div id="adsterra-banner-320x50" />
    </a>
  );
}