import { Award, Download } from "lucide-react";

export default function CourseCertificate({ course, userName, issuedAt }) {
  const date = issuedAt ? new Date(issuedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const handlePrint = () => {
    const win = window.open("", "_blank");
    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Certificate — ${course.title}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;600&display=swap');
          * { margin:0; padding:0; box-sizing:border-box; }
          body { background:#fff; display:flex; align-items:center; justify-content:center; min-height:100vh; font-family:'Inter',sans-serif; }
          .cert { width:800px; border:3px solid #7c3aed; border-radius:24px; padding:60px; text-align:center; position:relative; overflow:hidden; }
          .cert::before { content:''; position:absolute; inset:8px; border:1px solid #ede9fe; border-radius:18px; pointer-events:none; }
          .top { font-size:13px; letter-spacing:4px; text-transform:uppercase; color:#7c3aed; margin-bottom:12px; }
          .org { font-family:'Playfair Display',serif; font-size:32px; color:#1e1b4b; margin-bottom:4px; }
          .divider { width:80px; height:3px; background:linear-gradient(90deg,#7c3aed,#3b82f6); border-radius:2px; margin:16px auto; }
          .presented { font-size:14px; color:#6b7280; margin-bottom:8px; }
          .name { font-family:'Playfair Display',serif; font-size:40px; color:#1e1b4b; margin-bottom:8px; }
          .completed { font-size:14px; color:#6b7280; margin-bottom:6px; }
          .course { font-size:22px; font-weight:600; color:#4f46e5; margin-bottom:24px; }
          .desc { font-size:12px; color:#9ca3af; margin-bottom:32px; line-height:1.6; }
          .footer { display:flex; justify-content:space-between; align-items:flex-end; }
          .sig-line { width:160px; height:1px; background:#d1d5db; margin-bottom:6px; }
          .sig-label { font-size:11px; color:#9ca3af; letter-spacing:1px; text-transform:uppercase; }
          .badge { display:flex; flex-direction:column; align-items:center; gap:4px; }
          .badge-circle { width:56px; height:56px; border-radius:50%; background:linear-gradient(135deg,#7c3aed,#3b82f6); display:flex; align-items:center; justify-content:center; color:#fff; font-size:24px; }
          .cpd { font-size:10px; color:#9ca3af; }
          .emoji { font-size:48px; margin:8px 0; }
        </style>
      </head>
      <body>
        <div class="cert">
          <div class="top">Certificate of Completion</div>
          <div class="org">Cognita Learning</div>
          <div class="divider"></div>
          <div class="emoji">${course.emoji}</div>
          <div class="presented">This certifies that</div>
          <div class="name">${userName}</div>
          <div class="completed">has successfully completed</div>
          <div class="course">${course.title}</div>
          <div class="desc">This course included ${course.modules.length} modules of comprehensive video lessons,<br/>interactive quizzes, and assessments. CPD Certification Pending.</div>
          <div class="footer">
            <div>
              <div class="sig-line"></div>
              <div class="sig-label">Date Issued: ${date}</div>
            </div>
            <div class="badge">
              <div class="badge-circle">🏅</div>
              <div class="cpd">CPD Pending</div>
            </div>
            <div>
              <div class="sig-line"></div>
              <div class="sig-label">Cognita Platform</div>
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
    <div className="rounded-3xl overflow-hidden border-2" style={{ borderColor: "#7c3aed", background: "linear-gradient(135deg, rgba(124,58,237,0.08), rgba(59,130,246,0.08))" }}>
      <div className="p-8 text-center">
        <p className="text-xs font-bold tracking-widest uppercase text-violet-400 mb-2">Certificate of Completion</p>
        <p className="text-2xl font-black mb-1">Cognita Learning</p>
        <div className="text-5xl my-4">{course.emoji}</div>
        <p className="text-sm opacity-60 mb-1">This certifies that</p>
        <p className="text-2xl font-black text-violet-400 mb-1">{userName}</p>
        <p className="text-sm opacity-60 mb-1">has successfully completed</p>
        <p className="text-xl font-black mb-4">{course.title}</p>
        <div className="flex items-center justify-center gap-2 mb-4">
          <Award className="w-5 h-5 text-amber-400" />
          <span className="text-xs text-amber-400 font-semibold">CPD Certification Pending</span>
        </div>
        <p className="text-xs opacity-40 mb-6">Issued: {date}</p>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 mx-auto px-6 py-3 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 transition-all"
        >
          <Download className="w-4 h-4" /> Download / Print Certificate
        </button>
      </div>
    </div>
  );
}