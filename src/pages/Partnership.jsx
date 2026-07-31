import { db } from '@/lib/firebase';

import { useState } from "react";

import { Building2, Mail, FileText, MessageSquare, Send, CheckCircle, Loader2, Handshake } from "lucide-react";

export default function Partnership() {
  const [form, setForm] = useState({
    company_name: "",
    contact_email: "",
    proof: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const bgStyle = { background: "var(--app-bg)", color: "var(--app-text)" };
  const cardStyle = { background: "var(--app-surface)", border: "1px solid var(--app-border)" };
  const mutedStyle = { color: "var(--app-text-muted)" };
  const inputStyle = { background: "var(--app-surface)", border: "1px solid var(--app-border)", color: "var(--app-text)" };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.company_name || !form.contact_email || !form.proof) return;
    setSubmitting(true);
    const me = await db.auth.me().catch(() => null);
    await db.entities.PartnershipRequest.create({
      ...form,
      submitter_email: me?.email || form.contact_email,
      status: "pending",
    });
    setSubmitting(false);
    setDone(true);
  };

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={bgStyle}>
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/15 flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-black mb-3">Request Submitted!</h1>
          <p className="text-base mb-6" style={mutedStyle}>
            Thank you for your interest in partnering with Cognita. We'll review your request and get back to you at <strong>{form.contact_email}</strong>.
          </p>
          <button
            onClick={() => { setDone(false); setForm({ company_name: "", contact_email: "", proof: "", message: "" }); }}
            className="px-6 py-2.5 rounded-xl font-bold text-sm bg-violet-600 hover:bg-violet-500 text-white transition-all"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16 px-6 py-10" style={bgStyle}>
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="w-14 h-14 rounded-3xl bg-violet-500/15 flex items-center justify-center mx-auto mb-4">
            <Handshake className="w-7 h-7 text-violet-400" />
          </div>
          <h1 className="text-3xl font-black mb-3">Partnership & Collaboration</h1>
          <p style={mutedStyle} className="text-base leading-relaxed">
            Interested in partnering or collaborating with Cognita? Fill out the form below and our team will review your request.
          </p>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {[
            { icon: Building2, title: "Corporate Partnerships", desc: "Co-branded learning programs for your organization" },
            { icon: MessageSquare, title: "Content Collaboration", desc: "Contribute courses, resources, or study materials" },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-2xl p-4" style={cardStyle}>
              <Icon className="w-5 h-5 text-violet-400 mb-2" />
              <p className="font-bold text-sm mb-1">{title}</p>
              <p className="text-xs" style={mutedStyle}>{desc}</p>
            </div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="rounded-2xl p-6 space-y-5" style={cardStyle}>
          <h2 className="font-black text-lg mb-2">Request Form</h2>

          <div>
            <label className="text-xs font-bold block mb-1.5" style={mutedStyle}>
              Company / Organization Name *
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
              <input
                value={form.company_name}
                onChange={e => setForm(f => ({ ...f, company_name: e.target.value }))}
                placeholder="Acme Corporation"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none"
                style={inputStyle}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold block mb-1.5" style={mutedStyle}>
              Contact Email *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
              <input
                type="email"
                value={form.contact_email}
                onChange={e => setForm(f => ({ ...f, contact_email: e.target.value }))}
                placeholder="contact@company.com"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none"
                style={inputStyle}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold block mb-1.5" style={mutedStyle}>
              Proof of Company / Website URL *
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
              <input
                value={form.proof}
                onChange={e => setForm(f => ({ ...f, proof: e.target.value }))}
                placeholder="https://company.com or LinkedIn company page"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none"
                style={inputStyle}
              />
            </div>
            <p className="text-xs mt-1" style={mutedStyle}>Provide your company website, LinkedIn page, or other verifiable proof.</p>
          </div>

          <div>
            <label className="text-xs font-bold block mb-1.5" style={mutedStyle}>
              Partnership Proposal / Message
            </label>
            <textarea
              value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              placeholder="Describe your proposed partnership or collaboration in detail. What are you looking to achieve together with Cognita?"
              rows={5}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            disabled={submitting || !form.company_name || !form.contact_email || !form.proof}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white transition-all disabled:opacity-40 bg-violet-600 hover:bg-violet-500"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {submitting ? "Submitting..." : "Submit Partnership Request"}
          </button>
        </form>

        <p className="text-center text-xs mt-5" style={mutedStyle}>
          We typically respond within 3–5 business days. For urgent inquiries, please mention it in your message.
        </p>
      </div>
    </div>
  );
}