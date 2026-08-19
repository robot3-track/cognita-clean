import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { redeemReferralCode, generateReferralCode } from "@/lib/referrals";
import { addSurveyBonus } from "@/components/aiUsageLimit";
import { Copy, Check, Users, Gift, ArrowRight, Loader2 } from "lucide-react";

export default function ReferralPage() {
  const [user, setUser] = useState(null);
  const [inputCode, setInputCode] = useState("");
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [stats, setStats] = useState({ count: 0, creditsEarned: 0 });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    async function loadReferralData() {
      try {
        const me = await db.auth.me();
        if (!me) return;

        let currentUser = me;

        // Auto-generate and save referral code if the user doesn't have one
        if (!currentUser.referral_code) {
          const newCode = generateReferralCode(currentUser.email || currentUser.id || "USER");
          
          if (db.entities?.User?.update && currentUser.id) {
            await db.entities.User.update(currentUser.id, { referral_code: newCode });
          }
          
          currentUser = { ...currentUser, referral_code: newCode };
        }

        setUser(currentUser);

        if (currentUser?.email) {
          const referrals = await db.entities.Referral.filter({ referrer_email: currentUser.email });
          const totalCredits = (referrals || []).reduce((sum, r) => sum + (r.reward_granted || 0), 0);
          setStats({ count: referrals ? referrals.length : 0, creditsEarned: totalCredits });
        }
      } catch (err) {
        console.error("Failed to load referral data:", err);
      } finally {
        setInitializing(false);
      }
    }

    loadReferralData();
  }, []);

  const referralCode = user?.referral_code || "";
  const referralLink = referralCode ? `${window.location.origin}/Referral?ref=${referralCode}` : "";

  const handleCopyCode = () => {
    if (!referralCode) return;
    navigator.clipboard.writeText(referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleRedeem = async (e) => {
    e.preventDefault();
    if (!inputCode.trim() || !user?.email) return;

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await redeemReferralCode(user.email, inputCode.trim());
      const rewardAmount = res?.reward || 5;

      // Increment local cache & sync directly to server + emit global usage update event
      addSurveyBonus(user.email, rewardAmount, `Redeemed promo code: ${inputCode.trim()}`);

      setMessage({ type: "success", text: `Code applied! You earned +${rewardAmount} AI credits.` });
      setInputCode("");
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Unable to redeem code." });
    } finally {
      setLoading(false);
    }
  };

  if (initializing) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-[var(--app-text-muted)]">
        <Loader2 className="w-6 h-6 animate-spin text-violet-500" />
        <p className="text-xs font-medium animate-pulse">Loading referral details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8 text-[var(--app-text)]">
      
      {/* Header & Stats */}
      <div className="border-b border-[var(--app-border)] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-violet-600 dark:text-violet-400">
            <Gift className="w-4 h-4" />
            <span>Referrals & Rewards</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Invite friends, get credits</h1>
          <p className="text-sm text-[var(--app-text-muted)] max-w-md">
            Give friends 5 AI credits when they sign up with your code. You'll get 5 credits too.
          </p>
        </div>

        {/* Compact Stat Badge */}
        <div className="flex items-center gap-6 bg-[var(--app-surface)] border border-[var(--app-border)] px-5 py-3 rounded-xl self-start md:self-auto">
          <div>
            <p className="text-xs text-[var(--app-text-muted)] font-medium">Successful Invites</p>
            <p className="text-lg font-bold">{stats.count}</p>
          </div>
          <div className="h-8 w-px bg-[var(--app-border)]" />
          <div>
            <p className="text-xs text-[var(--app-text-muted)] font-medium">Credits Earned</p>
            <p className="text-lg font-bold text-violet-600 dark:text-violet-400">+{stats.creditsEarned}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Share Section */}
        <div className="border border-[var(--app-border)] bg-[var(--app-surface)] rounded-xl p-5 space-y-5">
          <div className="flex items-center gap-2 font-medium text-sm">
            <Users className="w-4 h-4 text-[var(--app-text-muted)]" />
            <span>Your Invite Details</span>
          </div>

          {/* Referral Code Box */}
          <div className="space-y-1.5">
            <label className="text-xs text-[var(--app-text-muted)] font-medium">Referral Code</label>
            <div className="flex gap-2">
              <div className="flex-1 px-3 py-2 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg font-mono font-semibold text-sm tracking-wider flex items-center justify-between">
                <span>{referralCode}</span>
              </div>
              <button
                onClick={handleCopyCode}
                disabled={!referralCode}
                className="px-3.5 py-2 border border-[var(--app-border)] hover:bg-[var(--app-bg)] rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 shrink-0"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? "Copied" : "Copy Code"}</span>
              </button>
            </div>
          </div>

          {/* Direct Link Box */}
          <div className="space-y-1.5">
            <label className="text-xs text-[var(--app-text-muted)] font-medium">Share Link</label>
            <div className="flex gap-2">
              <input
                readOnly
                value={referralLink}
                className="flex-1 min-w-0 px-3 py-2 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg text-xs outline-none truncate text-[var(--app-text-muted)]"
              />
              <button
                onClick={handleCopyLink}
                disabled={!referralLink}
                className="px-3.5 py-2 border border-[var(--app-border)] hover:bg-[var(--app-bg)] rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 shrink-0"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? "Copied" : "Copy Link"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Redeem Section */}
        <div className="border border-[var(--app-border)] bg-[var(--app-surface)] rounded-xl p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-medium text-sm">
              <Gift className="w-4 h-4 text-[var(--app-text-muted)]" />
              <span>Redeem a Promo Code</span>
            </div>
            <p className="text-xs text-[var(--app-text-muted)]">
              Have a code from a friend? Enter it here to collect your 5 bonus credits.
            </p>
          </div>

          <form onSubmit={handleRedeem} className="space-y-3">
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="e.g. USER-9F8A"
              className="w-full px-3 py-2 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-lg text-xs font-mono uppercase outline-none focus:border-violet-500 transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !inputCode.trim()}
              className="w-full py-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <>
                  <span>Claim Credits</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {message.text && (
            <div className={`text-xs px-3 py-2.5 rounded-lg border ${
              message.type === "success" 
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400" 
                : "bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400"
            }`}>
              {message.text}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
