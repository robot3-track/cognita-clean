import { useState } from "react";

const Icons = {
  Download: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  Verified: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
};

export default function CourseCertificate({ course = {}, userName = "Valued Student", issuedAt, instructorName = "Cognita Academic Board" }) {
  const safeTitle = course?.title || course?.name || "Course Completion";
  const safeName = userName || "Valued Student";
  const moduleCount = course?.modules?.length || course?.lessons?.length || 0;
  
  const date = issuedAt 
    ? new Date(issuedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) 
    : new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const certId = `COG-${Math.floor(100000 + Math.random() * 900000)}`;

  const handlePrint = () => {
    const win = window.open("", "_blank");
    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Certificate — ${safeTitle}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@400;500;600&display=swap');
          * { margin:0; padding:0; box-sizing:border-box; }
          body { background:#f8fafc; display:flex; align-items:center; justify-content:center; min-height:100vh; font-family:'Inter',sans-serif; color:#0f172a; padding:20px; }
          .cert-container { width:900px; background:#ffffff; border:1px solid #cbd5e1; box-shadow:0 10px 25px -5px rgba(0,0,0,0.05); padding:16px; }
          .cert-inner { border:2px solid #0056D2; padding:50px 60px; position:relative; }
          .header { display:flex; justify-size:space-between; justify-content:space-between; align-items:center; margin-bottom:40px; border-bottom:1px solid #e2e8f0; padding-bottom:20px; }
          .brand { font-size:22px; font-weight:700; color:#0056D2; letter-spacing:-0.5px; }
          .cert-id { font-size:11px; font-family:monospace; color:#64748b; }
          .body { text-align:left; }
          .sub-title { font-size:12px; font-weight:600; text-transform:uppercase; letter-spacing:1.5px; color:#475569; margin-bottom:16px; }
          .recipient-label { font-size:14px; color:#64748b; margin-bottom:8px; }
          .name { font-family:'EB Garamond',serif; font-size:42px; font-weight:700; color:#0f172a; margin-bottom:20px; line-height:1.1; }
          .statement { font-size:15px; color:#334155; line-height:1.6; margin-bottom:12px; max-w:650px; }
          .course-title { font-family:'EB Garamond',serif; font-size:28px; font-weight:700; color:#0056D2; margin-bottom:24px; }
          .details { font-size:13px; color:#64748b; line-height:1.6; margin-bottom:48px; max-width:600px; }
          .footer { display:flex; justify-content:space-between; align-items:flex-end; border-t:1px solid #e2e8f0; pt:30px; }
          .sig-block { width:220px; }
          .sig-line { width:100%; height:1px; background:#94a3b8; margin-bottom:8px; }
          .sig-name { font-size:13px; font-weight:600; color:#1e293b; }
          .sig-title { font-size:11px; color:#64748b; }
          .verify-badge { display:flex; align-items:center; gap:8px; background:#f0f7ff; border:1px solid #bae6fd; padding:8px 14px; border-radius:6px; font-size:11px; font-weight:500; color:#0284c7; }
        </style>
      </head>
      <body>
        <div class="cert-container">
          <div class="cert-inner">
            <div class="header">
              <div class="brand">cognita</div>
              <div class="cert-id">Verify at cognita.org/verify/${certId}</div>
            </div>
            
            <div class="body">
              <div class="sub-title">Course Certificate</div>
              <div class="recipient-label">This is to certify that</div>
              <div class="name">${safeName}</div>
              <div class="statement">has successfully completed an online non-credit course authorized by Cognita and offered through the Cognita learning platform.</div>
              <div class="course-title">${safeTitle}</div>
              <div class="details">
                ${moduleCount > 0 ? `Comprising ${moduleCount} modules of structured academic coursework, practical assessments, and verified evaluations.` : 'Comprising structured academic coursework, practical assessments, and verified evaluations.'}
              </div>
            </div>

            <div class="footer">
              <div class="sig-block">
                <div class="sig-line"></div>
                <div class="sig-name">${instructorName}</div>
                <div class="sig-title">Authorized Representative</div>
              </div>

              <div class="verify-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>
                </svg>
                <span>Verified Certificate</span>
              </div>

              <div class="sig-block" style="text-align:right;">
                <div class="sig-line"></div>
                <div class="sig-name">${date}</div>
                <div class="sig-title">Date Issued</div>
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 500);
  };

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl text-slate-100">
      <div className="p-6 sm:p-8 bg-slate-950/40">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-6">
          <span className="text-sm font-bold tracking-tight text-blue-500">cognita</span>
          <span className="text-[10px] font-mono text-slate-500">ID: {certId}</span>
        </div>

        <div className="space-y-3 mb-6">
          <p className="text-[11px] font-mono tracking-wider uppercase text-slate-400">Official Certificate</p>
          <p className="text-xs text-slate-400">This certifies that</p>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-100">{safeName}</h2>
          <p className="text-xs text-slate-400">has completed</p>
          <h3 className="text-base sm:text-lg font-serif font-bold text-blue-400 leading-snug">{safeTitle}</h3>
        </div>

        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-blue-950/30 border border-blue-900/50 mb-6">
          <Icons.Verified className="w-4 h-4 text-blue-400 shrink-0" />
          <span className="text-xs text-blue-300 font-medium">Verified Online Course Certificate</span>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-[11px] text-slate-400 mb-6">
          <span>Issued: {date}</span>
          <span>Cognita Platform</span>
        </div>

        <button
          onClick={handlePrint}
          className="w-full h-10 rounded-lg font-medium text-xs text-white bg-blue-600 hover:bg-blue-500 transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          <Icons.Download className="w-3.5 h-3.5" />
          <span>Download Printable PDF</span>
        </button>
      </div>
    </div>
  );
}
