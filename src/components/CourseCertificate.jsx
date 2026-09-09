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
  ),
  Printer: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="6 9 6 2 18 2 18 9" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="8" />
    </svg>
  )
};

export default function CourseCertificate({ 
  course = {}, 
  userName = "Valued Student", 
  issuedAt, 
  instructorName = "Yohan Chang",
  logoUrl = "https://media.base44.com/images/public/69b097f35579053a78af47a3/43f8b728d_9e9c4097b_logo1.png"
}) {
  const [recipientName, setRecipientName] = useState(userName);

  const safeTitle = course?.title || course?.name || "Course Completion";
  const safeName = recipientName || "Valued Student";
  const moduleCount = course?.modules?.length || course?.lessons?.length || 0;
  
  const date = issuedAt 
    ? new Date(issuedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) 
    : new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const handlePrint = () => {
    const win = window.open("", "_blank");
    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Certificate — ${safeTitle}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Great+Vibes&family=Inter:wght@400;500;600&display=swap');
          * { margin:0; padding:0; box-sizing:border-box; }
          body { background:#f8fafc; display:flex; align-items:center; justify-content:center; min-height:100vh; font-family:'Inter',sans-serif; color:#0f172a; padding:20px; }
          .cert-container { width:900px; background:#ffffff; border:1px solid #cbd5e1; box-shadow:0 10px 25px -5px rgba(0,0,0,0.05); padding:16px; }
          .cert-inner { border:2px solid #0056D2; padding:50px 60px; position:relative; }
          .header { display:flex; justify-content:space-between; align-items:center; margin-bottom:40px; border-bottom:1px solid #e2e8f0; padding-bottom:20px; }
          .logo-img { height:40px; width:auto; object-fit:contain; }
          .body { text-align:left; }
          .sub-title { font-size:12px; font-weight:600; text-transform:uppercase; letter-spacing:1.5px; color:#475569; margin-bottom:16px; }
          .recipient-label { font-size:14px; color:#64748b; margin-bottom:8px; }
          .name { font-family:'EB Garamond',serif; font-size:42px; font-weight:700; color:#0f172a; margin-bottom:20px; line-height:1.1; }
          .statement { font-size:15px; color:#334155; line-height:1.6; margin-bottom:12px; max-width:650px; }
          .course-title { font-family:'EB Garamond',serif; font-size:28px; font-weight:700; color:#0056D2; margin-bottom:24px; }
          .details { font-size:13px; color:#64748b; line-height:1.6; margin-bottom:48px; max-width:600px; }
          .footer { display:flex; justify-content:space-between; align-items:flex-end; border-top:1px solid #e2e8f0; padding-top:30px; }
          .sig-block { width:220px; position:relative; }
          .cursive-sig { font-family:'Great Vibes', cursive; font-size:32px; color:#1e293b; position:absolute; top:-32px; left:0; width:100%; text-align:left; }
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
              <img src="${logoUrl}" alt="Cognita Logo" class="logo-img" />
            </div>
            
            <div class="body">
              <div class="sub-title">Course Certificate</div>
              <div class="recipient-label">This is to certify that</div>
              <div class="name">${safeName}</div>
              <div class="statement">has successfully completed an online non-credit course authorized by Cognita and offered through the Cognita learning platform.</div>
              <div class="course-title">${safeTitle}</div>
              <div class="details">
                ${moduleCount > 0 ? `Comprising ${moduleCount} modules of structured academic coursework, practical assessments, and evaluations.` : 'Comprising structured academic coursework, practical assessments, and evaluations.'}
              </div>
            </div>

            <div class="footer">
              <div class="sig-block">
                <div class="cursive-sig">${instructorName}</div>
                <div class="sig-line"></div>
                <div class="sig-name">${instructorName}</div>
                <div class="sig-title">Academic Board Representative</div>
              </div>

              <div class="verify-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>
                </svg>
                <span>Official Certificate</span>
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
          <img src={logoUrl} alt="Cognita Logo" className="h-8 w-auto object-contain" />
        </div>

        <div className="space-y-4 mb-6">
          <p className="text-[11px] font-mono tracking-wider uppercase text-slate-400">Official Certificate</p>
          
          <div>
            <label className="block text-xs text-slate-400 mb-1">Student Name (Editable):</label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-sm font-serif font-bold text-slate-100 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <p className="text-xs text-slate-400">Has completed</p>
            <h3 className="text-base sm:text-lg font-serif font-bold text-blue-400 leading-snug mt-1">{safeTitle}</h3>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/60 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icons.Verified className="w-4 h-4 text-blue-400 shrink-0" />
            <span className="text-xs text-blue-300 font-medium">Academic Board Verified</span>
          </div>
          <span className="text-xs italic text-slate-400 font-serif">{instructorName}</span>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-[11px] text-slate-400 mb-6">
          <span>Issued: {date}</span>
          <span>Cognita Platform</span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handlePrint}
            className="flex-1 h-10 rounded-lg font-medium text-xs text-white bg-blue-600 hover:bg-blue-500 transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <Icons.Printer className="w-3.5 h-3.5" />
            <span>Print Certificate</span>
          </button>
          <button
            onClick={handlePrint}
            className="h-10 px-4 rounded-lg font-medium text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 border border-slate-700"
          >
            <Icons.Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>
    </div>
  );
}
