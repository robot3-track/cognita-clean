import { Mail, FileText, ShieldCheck } from "lucide-react";
import FeedbackWidget from "./FeedbackWidget";
import { useTranslation } from "../hooks/useTranslation";
import { Link } from "react-router-dom";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="w-full mt-16 pt-6 pb-12 transition-colors duration-200">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Structured Grid Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-4">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <img 
                src="https://media.base44.com/images/public/69b097f35579053a78af47a3/43f8b728d_9e9c4097b_logo1.png" 
                alt="Cognita Logo" 
                className="h-7 w-auto object-contain"
              />
              <span className="font-extrabold text-base tracking-tight text-[var(--app-text)]">Cognita Study</span>
            </div>
            <p className="text-xs text-[var(--app-text-muted)] leading-relaxed max-w-sm">
              An intelligent, open-access study platform offering active recall flashcards, AI narration, practice test creation, and interactive study modes.
            </p>
            <p className="text-[11px] text-[var(--app-text-muted)] opacity-60 font-medium">
              Designed & Developed by Yohan Chang • Marina High School • 2026
            </p>
          </div>

          {/* Useful Navigation Links */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--app-text-muted)] opacity-80">Platform</h4>
            <ul className="space-y-2 text-xs font-semibold text-[var(--app-text)]">
              <li>
                <Link to="/documentation" className="hover:text-violet-400 inline-flex items-center gap-1.5 transition-colors">
                  <FileText className="w-3.5 h-3.5 text-violet-400" />
                  <span>Documentation & Terms</span>
                </Link>
              </li>
              <li>
                <a href="mailto:yohanychang@gmail.com" className="hover:text-violet-400 inline-flex items-center gap-1.5 transition-colors">
                  <Mail className="w-3.5 h-3.5 text-violet-400" />
                  <span>Contact Support</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Community & Feedback */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--app-text-muted)] opacity-80">Feedback & Legal</h4>
            <div className="space-y-3">
              <FeedbackWidget />
              <div className="flex items-center gap-1.5 text-[11px] text-[var(--app-text-muted)]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Encrypted & Safe Account Hub</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--app-text-muted)]" style={{ borderColor: "var(--app-border)" }}>
          <p className="font-medium">
            &copy; {new Date().getFullYear()} {t('copyrightText') || "Cognita. All rights reserved."}
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="hover:text-[var(--app-text)] transition-colors cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-[var(--app-text)] transition-colors cursor-pointer">Terms of Service</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
