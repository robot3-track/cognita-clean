import { db } from '@/lib/firebase';
import { useState, useEffect } from "react";
import { Crown, Mail, CheckCircle, ShieldAlert, FileText, ArrowUpRight, Sparkles } from "lucide-react";
import FeedbackWidget from "./FeedbackWidget";
import { useTranslation } from "../hooks/useTranslation";
import { Link } from "react-router-dom";

function PayPalLogo({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.554 6.227A4.2 4.2 0 0 0 15.783 4H9.257a.75.75 0 0 0-.74.63L6.04 18.795a.45.45 0 0 0 .444.52h3.217l.81-5.134-.025.16a.75.75 0 0 1 .74-.63h1.54c3.025 0 5.393-1.23 6.085-4.787.02-.104.038-.206.053-.305a3.6 3.6 0 0 0-.35-2.392Z" fill="#009CDE"/>
      <path d="M19.904 8.619c-.015.099-.033.2-.053.305-.692 3.557-3.06 4.787-6.085 4.787h-1.54a.75.75 0 0 0-.74.63l-.81 5.134-.23 1.46a.394.394 0 0 0 .39.458h2.73a.658.658 0 0 0 .65-.554l.027-.138.515-3.27.033-.179a.658.658 0 0 1 .65-.555h.409c2.653 0 4.731-1.077 5.337-4.194.254-1.302.122-2.388-.483-3.15a2.616 2.616 0 0 0-.8-.734Z" fill="#012169"/>
      <path d="M19.203 8.325a5.45 5.45 0 0 0-.671-.149 8.524 8.524 0 0 0-1.353-.099h-4.104a.658.658 0 0 0-.65.555l-.874 5.534-.025.16a.75.75 0 0 1 .74-.63h1.54c3.025 0 5.393-1.23 6.085-4.787.02-.104.038-.206.053-.305a3.834 3.834 0 0 0-.74-.279Z" fill="#003087"/>
    </svg>
  );
}

export default function Footer({ userEmail }) {
  const { t } = useTranslation();
  const [upgradeStatus, setUpgradeStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userEmail) { setLoading(false); return; }
    checkStatus();
    const unsub = db.entities.UpgradeDetection.subscribe(() => checkStatus());
    return unsub;
  }, [userEmail]);

  const checkStatus = async () => {
    const records = await db.entities.UpgradeDetection.filter({ user_email: userEmail });
    setUpgradeStatus(records[0] || null);
    setLoading(false);
  };

  const handleUpgradeClick = async () => {
    window.open("https://www.paypal.com/paypalme/YCMusicModels", "_blank");
    if (!upgradeStatus) {
      await db.entities.UpgradeDetection.create({
        user_email: userEmail,
        is_unlimited: false,
        payment_status: "pending",
      });
      checkStatus();
    }
  };

  const cardStyle = { background: "var(--app-surface)", border: "1px solid var(--app-border)" };
  const mutedStyle = { color: "var(--app-text-muted)" };

  const isUnlimited = upgradeStatus?.is_unlimited === true && upgradeStatus?.payment_status === "confirmed";
  const isPending = upgradeStatus?.payment_status === "pending";

  return (
    <footer className="w-full space-y-6 mt-14 pb-8">
      
      {/* Unlimited Upgrade / Status Banner */}
      {!isUnlimited ? (
        <div 
          className="relative overflow-hidden rounded-2xl p-5 border bg-gradient-to-r from-violet-600/[0.06] via-indigo-500/[0.03] to-transparent shadow-sm backdrop-blur-sm transition-all hover:border-violet-500/30"
          style={cardStyle}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 text-violet-400 flex items-center justify-center shrink-0 border border-violet-500/20 shadow-inner">
                <Crown className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-sm text-[var(--app-text)]">
                    {t('donateForUnlimited') || "Get Unlimited Access"}
                  </h4>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
                    <Sparkles className="w-2.5 h-2.5" /> Pro
                  </span>
                </div>
                <p className="text-xs mt-0.5" style={mutedStyle}>
                  Remove daily limits and study without interruptions.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-center">
              {isPending && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-500 text-xs font-semibold border border-amber-500/20 shadow-sm animate-pulse">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Checking payment...</span>
                </div>
              )}
              <button
                onClick={handleUpgradeClick}
                className="inline-flex items-center gap-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-violet-600/20 hover:shadow-violet-600/30 active:scale-[0.98]"
              >
                <PayPalLogo className="w-3.5 h-3.5 fill-white" />
                <span>Support Cognita</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl p-4 border bg-emerald-500/[0.04] border-emerald-500/20 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <CheckCircle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-400">Unlimited Tier Active</p>
              <p className="text-[11px] opacity-75" style={mutedStyle}>Thank you for supporting Cognita!</p>
            </div>
          </div>
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
        </div>
      )}

      {/* Footer Navigation & Links */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-5 pt-6 border-t border-dashed" style={{ borderColor: "var(--app-border)" }}>
        
        {/* Support Email & Documentation Link */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 sm:gap-6 text-xs w-full md:w-auto">
          <div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity" style={mutedStyle}>
            <Mail className="w-4 h-4 shrink-0 text-violet-400" />
            <span>
              Payment questions?{" "}
              <a href="mailto:yohanychang@gmail.com" className="text-violet-400 font-bold hover:underline">
                Contact support
              </a>
            </span>
          </div>

          <span className="hidden sm:inline text-gray-600/40">•</span>

          <Link 
            to="/documentation" 
            className="inline-flex items-center gap-1.5 font-bold text-violet-400 hover:text-violet-300 group transition-colors"
          >
            <FileText className="w-4 h-4 opacity-80" />
            <span>Terms & Docs</span>
            <ArrowUpRight className="w-3 h-3 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </Link>
        </div>

        {/* Feedback Widget & Copyright */}
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-5 w-full md:w-auto">
          <FeedbackWidget />
          <span className="text-xs opacity-50 font-medium tracking-tight text-center sm:text-right shrink-0" style={mutedStyle}>
            &copy; {new Date().getFullYear()} {t('copyrightText') || "Cognita. All rights reserved."}
          </span>
        </div>

      </div>
    </footer>
  );
}
