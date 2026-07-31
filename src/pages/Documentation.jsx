import { useState } from "react";
import { 
  BookOpen, ShieldCheck, Scale, FileText, Globe, 
  HelpCircle, UserCheck, MessageSquare, 
  Sparkles, Key, AlertTriangle, ExternalLink
} from "lucide-react";

export default function Documentation() {
  const [activeSection, setActiveSection] = useState("about");

  const sections = [
    { id: "about", label: "About Cognita Study", icon: BookOpen },
    { id: "terms-acceptance", label: "1. Acceptance of Terms", icon: UserCheck },
    { id: "terms-service", label: "2. Description of Service", icon: Sparkles },
    { id: "terms-accounts", label: "3. User Accounts", icon: Key },
    { id: "terms-content", label: "4. User Content", icon: MessageSquare },
    { id: "terms-credits", label: "5. AI Credits & Surveys", icon: Scale },
    { id: "terms-privacy", label: "6. Privacy & Data", icon: ShieldCheck },
    { id: "terms-prohibited", label: "7. Prohibited Conduct", icon: AlertTriangle },
    { id: "terms-ip", label: "8. Intellectual Property", icon: FileText },
    { id: "terms-warranties", label: "9. Disclaimer of Warranties", icon: AlertTriangle },
    { id: "terms-liability", label: "10. Limitation of Liability", icon: Scale },
    { id: "terms-changes", label: "11. Changes to Terms", icon: FileText },
    { id: "terms-contact", label: "12. Contact Support", icon: HelpCircle },
    { id: "terms-domains", label: "Official Domains & Safety", icon: Globe }
  ];

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 flex">
      
      {/* Sidebar - Desktop Only */}
      <aside className="w-64 hidden lg:block border-r border-slate-800/60 p-6 sticky top-0 h-screen overflow-y-auto shrink-0 bg-slate-950/40 backdrop-blur-md">
        <div className="flex items-center gap-2.5 mb-8 px-2">
          <img 
            src="https://media.base44.com/images/public/69b097f35579053a78af47a3/43f8b728d_9e9c4097b_logo1.png" 
            alt="Cognita Logo" 
            className="w-7 h-7 rounded-lg border border-slate-800 p-0.5"
          />
          <span className="font-black text-sm tracking-tight text-white">Documentation</span>
        </div>

        <nav className="space-y-1">
          {sections.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => scrollToSection(sec.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-xs font-semibold transition-all group ${
                  isActive 
                    ? "bg-violet-600/10 text-violet-400 border border-violet-500/20 shadow-sm" 
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 border border-transparent"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-violet-400" : "text-slate-50 opacity-40 group-hover:opacity-80"}`} />
                <span className="truncate">{sec.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl px-6 md:px-12 py-10 md:py-16 overflow-y-auto space-y-12">
        
        <div className="absolute top-[-10%] right-[5%] w-[40vw] h-[40vw] rounded-full bg-violet-600/5 blur-[120px] pointer-events-none" />

        {/* Header Summary Layer */}
        <section id="about" className="space-y-4 pt-4 scroll-mt-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-800 bg-slate-900/40 text-[10px] font-bold tracking-wider text-violet-400 uppercase">
            Platform Matrix & Legal Framework
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
            Cognita Project Documentation
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed font-medium">
            Cognita Study is a student-made project meant to help elevate academic performances and experiences for all students around the world. We strive to provide free AI services, whether it be generating videos, audios, flashcards, quizzes, tests, and/or tutors and AI chat. As we do so, we also take into account of the matter of your privacy very seriously.
          </p>
          <div className="p-4 rounded-2xl border border-slate-800/80 bg-slate-900/20 text-xs text-slate-400 leading-relaxed">
            <span className="font-bold text-white block mb-1">Notice to all users:</span>
            These Terms & Conditions govern your use of Cognita, a free AI-powered study platform. Please read them carefully. By using Cognita you agree to these terms.
          </div>
        </section>

        <div className="h-px bg-gradient-to-r from-slate-800/60 to-transparent" />

        {/* Terms Sections */}
        <div className="space-y-10">
          
          <div id="terms-acceptance" className="scroll-mt-16 space-y-2">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-violet-400 text-sm font-mono">01.</span> Acceptance of Terms
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed pl-6">
              By accessing or using Cognita ("the App"), you agree to be bound by these Terms & Conditions. If you do not agree, please do not use the App. These terms apply to all users, including students, teachers, and visitors.
            </p>
          </div>

          <div id="terms-service" className="scroll-mt-16 space-y-2">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-violet-400 text-sm font-mono">02.</span> Description of Service
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed pl-6">
              Cognita is a free AI-powered study platform that provides flashcard creation, quiz generation, spaced repetition, audio lessons, classroom tools, and community features. Some features require an account. AI-generated content is provided for educational purposes and may not always be fully accurate.
            </p>
          </div>

          <div id="terms-accounts" className="scroll-mt-16 space-y-2">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-violet-400 text-sm font-mono">03.</span> User Accounts
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed pl-6">
              You are responsible for maintaining the confidentiality of your account credentials. You must provide accurate information during registration. You may not share your account or use another person's account. We reserve the right to suspend or terminate accounts that violate these terms.
            </p>
          </div>

          <div id="terms-content" className="scroll-mt-16 space-y-2">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-violet-400 text-sm font-mono">04.</span> User-Generated Content
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed pl-6">
              You retain ownership of content you create (flashcard decks, notes, messages). By making content public, you grant Cognita a non-exclusive license to display it to other users. You must not post content that is harmful, infringing, or illegal. We may remove content that violates these terms without notice.
            </p>
          </div>

          <div id="terms-credits" className="scroll-mt-16 space-y-2">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-violet-400 text-sm font-mono">05.</span> AI Credits & Surveys
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed pl-6">
              AI credits are provided daily at no cost and may be supplemented through optional third-party surveys (CPX Research). Credits are non-transferable and have no monetary value. Survey participation is entirely voluntary. We are not responsible for third-party survey content.
            </p>
          </div>

          <div id="terms-privacy" className="scroll-mt-16 space-y-2">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-violet-400 text-sm font-mono">06.</span> Privacy & Data Framework
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed pl-6">
              We collect only the data necessary to operate the App (email, flashcards, study sessions). We do not sell your personal data to third parties. Flashcard decks and chats are private by default. See our Security Practices page for full details on how your data is protected.
            </p>
          </div>

          <div id="terms-prohibited" className="scroll-mt-16 space-y-2">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-violet-400 text-sm font-mono">07.</span> Prohibited Conduct Matrix
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed pl-6">
              You agree not to: (a) attempt to reverse-engineer or scrape the App; (b) upload malicious code; (c) harass or abuse other users; (d) misuse AI credits; (e) impersonate other users or staff; (f) use the App for commercial gain without written permission.
            </p>
          </div>

          <div id="terms-ip" className="scroll-mt-16 space-y-2">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-violet-400 text-sm font-mono">08.</span> Intellectual Property
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed pl-6">
              The Cognita name, logo, and platform code are the intellectual property of the developer. AI-generated flashcard content is provided under fair use for educational purposes. You may not reproduce or distribute the platform's interface or branding without permission.
            </p>
          </div>

          <div id="terms-warranties" className="scroll-mt-16 space-y-2">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-violet-400 text-sm font-mono">09.</span> Disclaimer of Warranties
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed pl-6">
              Cognita is provided "as is" without warranties of any kind. We do not guarantee that the App will be error-free or uninterrupted. AI-generated content may contain inaccuracies and should not be relied upon as a sole source of information for high-stakes decisions.
            </p>
          </div>

          <div id="terms-liability" className="scroll-mt-16 space-y-2">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-violet-400 text-sm font-mono">10.</span> Limitation of Liability
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed pl-6">
              To the fullest extent permitted by law, Cognita and its developer shall not be liable for any indirect, incidental, or consequential damages arising from your use of the App, including loss of data or study materials.
            </p>
          </div>

          <div id="terms-changes" className="scroll-mt-16 space-y-2">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-violet-400 text-sm font-mono">11.</span> Changes to Terms
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed pl-6">
              We may update these Terms & Conditions at any time. Continued use of the App after changes are posted constitutes your acceptance of the new terms. Material changes will be communicated via in-app notification.
            </p>
          </div>

          <div id="terms-contact" className="scroll-mt-16 space-y-2">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-violet-400 text-sm font-mono">12.</span> Contact Protocol
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed pl-6">
              For questions about these terms, please contact us through the App's feedback widget or reach out at the contact information provided in the App settings.
            </p>
          </div>

          {/* Secure Verified Domains Panel with all 3 domains */}
          <div id="terms-domains" className="scroll-mt-16 p-5 rounded-2xl border border-dashed border-slate-800 bg-slate-900/10 space-y-4">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Globe className="w-4 h-4 text-violet-400" />
              <h4>Official Secure Domains</h4>
            </div>
            <p className="text-xs text-slate-400 leading-normal">
              To value your safety as a user, we want to make sure each user knows which domains we officially run on for your security. Do not submit authentication credentials outside of these verified URLs:
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {[
                "https://cognitastudy.me",
                "https://cognita.ai.studio",
                "https://cognitastudy.vercel.app"
              ].map((domain) => (
                <a 
                  key={domain}
                  href={domain}
                  target="_blank" 
                  rel="noreferrer" 
                  className="inline-flex items-center gap-2 bg-slate-900 border border-slate-800/80 hover:border-violet-500/40 px-3 py-1.5 rounded-xl text-[11px] font-bold text-violet-400 transition-all shadow-sm"
                >
                  <span>{domain.replace("https://", "")}</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Developer Attribution Footnote */}
        <footer className="pt-8 border-t border-slate-900 text-center text-[11px] text-slate-500 font-medium">
          &copy; {new Date().getFullYear()} Cognita Study • Built by Yohan Chang • Marina High School Student Project
        </footer>

      </main>

    </div>
  );
}