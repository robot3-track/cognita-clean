import { Shield, FileText, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const SECTIONS = [
  {
    title: "1. Acceptance of Terms",
    content: `By accessing or using Cognita ("the App"), you agree to be bound by these Terms & Conditions. If you do not agree, please do not use the App. These terms apply to all users, including students, teachers, and visitors.`,
  },
  {
    title: "2. Description of Service",
    content: `Cognita is a free AI-powered study platform that provides flashcard creation, quiz generation, spaced repetition, audio lessons, classroom tools, and community features. Some features require an account. AI-generated content is provided for educational purposes and may not always be fully accurate.`,
  },
  {
    title: "3. User Accounts",
    content: `You are responsible for maintaining the confidentiality of your account credentials. You must provide accurate information during registration. You may not share your account or use another person's account. We reserve the right to suspend or terminate accounts that violate these terms.`,
  },
  {
    title: "4. User-Generated Content",
    content: `You retain ownership of content you create (flashcard decks, notes, messages). By making content public, you grant Cognita a non-exclusive license to display it to other users. You must not post content that is harmful, infringing, or illegal. We may remove content that violates these terms without notice.`,
  },
  {
    title: "5. AI Credits & Surveys",
    content: `AI credits are provided daily at no cost and may be supplemented through optional third-party surveys (CPX Research). Credits are non-transferable and have no monetary value. Survey participation is entirely voluntary. We are not responsible for third-party survey content.`,
  },
  {
    title: "6. Privacy & Data",
    content: `We collect only the data necessary to operate the App (email, flashcards, study sessions). We do not sell your personal data to third parties. Flashcard decks and chats are private by default. See our Security Practices page for full details on how your data is protected.`,
  },
  {
    title: "7. Prohibited Conduct",
    content: `You agree not to: (a) attempt to reverse-engineer or scrape the App; (b) upload malicious code; (c) harass or abuse other users; (d) misuse AI credits; (e) impersonate other users or staff; (f) use the App for commercial gain without written permission.`,
  },
  {
    title: "8. Intellectual Property",
    content: `The Cognita name, logo, and platform code are the intellectual property of the developer. AI-generated flashcard content is provided under fair use for educational purposes. You may not reproduce or distribute the platform's interface or branding without permission.`,
  },
  {
    title: "9. Disclaimer of Warranties",
    content: `Cognita is provided "as is" without warranties of any kind. We do not guarantee that the App will be error-free or uninterrupted. AI-generated content may contain inaccuracies and should not be relied upon as a sole source of information for high-stakes decisions.`,
  },
  {
    title: "10. Limitation of Liability",
    content: `To the fullest extent permitted by law, Cognita and its developer shall not be liable for any indirect, incidental, or consequential damages arising from your use of the App, including loss of data or study materials.`,
  },
  {
    title: "11. Changes to Terms",
    content: `We may update these Terms & Conditions at any time. Continued use of the App after changes are posted constitutes your acceptance of the new terms. Material changes will be communicated via in-app notification.`,
  },
  {
    title: "12. Contact",
    content: `For questions about these terms, please contact us through the App's feedback widget or reach out at the contact information provided in the App settings.`,
  },
];

export default function TermsAndConditions() {
  const bgStyle = { background: "var(--app-bg)", color: "var(--app-text)" };
  const cardStyle = { background: "var(--app-surface)", border: "1px solid var(--app-border)" };
  const mutedStyle = { color: "var(--app-text-muted)" };

  return (
    <div className="min-h-screen pb-28 px-5 py-12" style={bgStyle}>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-blue-500/25">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-3">Terms &amp; Conditions</h1>
          <p className="text-sm" style={mutedStyle}>Last updated: April 2026 · Effective immediately</p>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
            <Link to={createPageUrl("SecurityPractices")}>
              <button className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">
                <Shield className="w-3.5 h-3.5" /> Security Practices <ChevronRight className="w-3 h-3" />
              </button>
            </Link>
          </div>
        </div>

        {/* Intro callout */}
        <div className="rounded-2xl p-5 mb-8 border border-blue-500/20 bg-blue-500/5">
          <p className="text-sm leading-relaxed" style={mutedStyle}>
            These Terms &amp; Conditions govern your use of <strong style={{ color: "var(--app-text)" }}>Cognita</strong>, a free AI-powered study platform. Please read them carefully. By using Cognita you agree to these terms.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {SECTIONS.map((s) => (
            <div key={s.title} className="rounded-2xl p-6" style={cardStyle}>
              <h2 className="font-bold text-sm mb-2">{s.title}</h2>
              <p className="text-sm leading-relaxed" style={mutedStyle}>{s.content}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-10 text-center">
          <p className="text-xs" style={mutedStyle}>
            Questions? Use the feedback widget in the app or visit the{" "}
            <Link to={createPageUrl("About")} className="text-violet-400 hover:underline">About page</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}