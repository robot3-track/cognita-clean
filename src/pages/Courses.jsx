import { db } from '@/lib/firebase';

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { COURSES, COURSE_CATEGORIES, LEVEL_LABELS } from "@/lib/courseData";
import {
  Search, Award, PlayCircle, CheckCircle, Clock, Zap, ChevronRight,
  BookOpen, Menu, Home, Trophy, Send, Loader2,
  Share2, FileText, Star, MessageSquare, ExternalLink, TrendingUp,
  Plus, Trash2, Upload
} from "lucide-react";
import CourseCertificate from "@/components/CourseCertificate";
import { useTranslation } from "@/hooks/useTranslation";

const DEV_EMAIL = "yychang100@student.hbuhsd.edu";

// ── Theme-aware style helpers ─────────────────────────────────────────────────
// These use CSS variables set by the app's theme system (see Settings / applyTheme)
const S = {
  bg:          "var(--app-bg)",
  surface:     "var(--app-surface)",
  surfaceSolid:"var(--app-surface-solid)",
  border:      "var(--app-border)",
  text:        "var(--app-text)",
  muted:       "var(--app-muted)",
  navBg:       "var(--app-nav-bg)",
};

const FS = ({ children }) => (
  <div className="fixed inset-0 z-[9999] flex overflow-hidden"
    style={{ background: S.bg, color: S.text, fontFamily: "system-ui, sans-serif" }}>
    {children}
  </div>
);

// ── Course Review Panel ───────────────────────────────────────────────────────
function CourseReviewPanel({ course, user, allReviews, onReviewSubmitted }) {
  const myReview = allReviews.find(r => r.course_id === course.id && r.user_email === user?.email);
  const courseReviews = allReviews.filter(r => r.course_id === course.id);
  const [rating, setRating] = useState(myReview?.rating || 0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState(myReview?.comment || "");
  const [submitting, setSubmitting] = useState(false);
  const [showReviews, setShowReviews] = useState(false);

  const avgRating = courseReviews.length
    ? (courseReviews.reduce((s, r) => s + r.rating, 0) / courseReviews.length).toFixed(1)
    : null;

  const submit = async () => {
    if (!rating) return;
    setSubmitting(true);
    if (myReview) {
      const updated = await db.entities.CourseReview.update(myReview.id, { rating, comment });
      onReviewSubmitted(updated, "update");
    } else {
      const created = await db.entities.CourseReview.create({
        course_id: course.id, user_email: user.email,
        user_name: user.full_name || user.email, rating, comment,
      });
      onReviewSubmitted(created, "create");
    }
    setSubmitting(false);
  };

  return (
    <div className="p-5 border-t" style={{ borderColor: S.border }}>
      {avgRating && (
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            {[1,2,3,4,5].map(s => (
              <Star key={s} className={`w-3.5 h-3.5 ${parseFloat(avgRating) >= s ? "text-amber-400 fill-amber-400" : "opacity-20"}`} />
            ))}
          </div>
          <span className="text-sm font-bold text-amber-400">{avgRating}</span>
          <button onClick={() => setShowReviews(o => !o)} className="text-xs ml-1 underline opacity-40 hover:opacity-80">
            {courseReviews.length} review{courseReviews.length !== 1 ? "s" : ""}
          </button>
        </div>
      )}
      {showReviews && courseReviews.length > 0 && (
        <div className="mb-4 space-y-2 max-h-40 overflow-y-auto">
          {courseReviews.map(r => (
            <div key={r.id} className="px-3 py-2.5 rounded-xl text-xs" style={{ background: S.surface, border: `1px solid ${S.border}` }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold" style={{ color: S.text }}>{r.user_name || r.user_email}</span>
                <div className="flex">
                  {[1,2,3,4,5].map(s => <Star key={s} className={`w-3 h-3 ${r.rating >= s ? "text-amber-400 fill-amber-400" : "opacity-20"}`} />)}
                </div>
              </div>
              {r.comment && <p style={{ color: S.muted }} className="leading-relaxed">{r.comment}</p>}
            </div>
          ))}
        </div>
      )}
      <p className="text-xs font-bold mb-2" style={{ color: S.muted }}>
        {myReview ? "Your Review" : "Rate this Course"}
      </p>
      <div className="flex items-center gap-1 mb-2">
        {[1,2,3,4,5].map(s => (
          <button key={s} onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)} onClick={() => setRating(s)}>
            <Star className={`w-5 h-5 transition-all ${(hover || rating) >= s ? "text-amber-400 fill-amber-400" : "opacity-25"}`} />
          </button>
        ))}
      </div>
      <textarea rows={2} value={comment} onChange={e => setComment(e.target.value)}
        placeholder="Share what you learned... (optional)"
        className="w-full px-3 py-2 rounded-xl text-xs outline-none resize-none mb-2"
        style={{ background: S.surface, border: `1px solid ${S.border}`, color: S.text }} />
      <button onClick={submit} disabled={!rating || submitting}
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white disabled:opacity-40 transition-all"
        style={{ background: "rgba(139,92,246,0.7)" }}>
        {submitting ? <Loader2 className="w-3 h-3 animate-spin" /> : <MessageSquare className="w-3 h-3" />}
        {myReview ? "Update Review" : "Submit Review"}
      </button>
    </div>
  );
}

// ── Course Publishing Tool (for approved applicants) ──────────────────────────
function CoursePublisher({ user, t }) {
  const EMPTY_MODULE = { id: "", title: "", videoId: "", summary: "" };
  const [form, setForm] = useState({
    title: "", emoji: "📚", color: "#8b5cf6", category: "Programming",
    level: "beginner", duration: "~5h", description: "", modules: [{ ...EMPTY_MODULE, id: `m-${Date.now()}` }]
  });
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);

  const updateModule = (i, key, val) => {
    setForm(f => {
      const mods = [...f.modules];
      mods[i] = { ...mods[i], [key]: val };
      return { ...f, modules: mods };
    });
  };
  const addModule = () => setForm(f => ({ ...f, modules: [...f.modules, { ...EMPTY_MODULE, id: `m-${Date.now()}` }] }));
  const removeModule = (i) => setForm(f => ({ ...f, modules: f.modules.filter((_, idx) => idx !== i) }));

  const publishCourse = async () => {
    if (!form.title || !form.description || form.modules.some(m => !m.title || !m.videoId)) return;
    setPublishing(true);
    await db.entities.AppNotification.create({
      recipient_email: DEV_EMAIL,
      title: "📢 New Course Submitted for Publishing",
      message: `${user?.full_name || user?.email} submitted "${form.title}" (${form.modules.length} modules). Review in DevDashboard > Course Apps.`,
      icon: "📚",
      link: "/DevDashboard",
    });
    await db.entities.CourseApplication.create({
      applicant_email: user?.email,
      applicant_name: user?.full_name || user?.email,
      proposed_title: form.title,
      proposed_description: form.description,
      proposed_category: form.category,
      qualifications: "Approved creator — publishing course",
      sample_outline: JSON.stringify(form),
      status: "pending",
    });
    setPublishing(false);
    setPublished(true);
  };

  if (published) return (
    <div className="text-center py-20">
      <div className="text-6xl mb-4">🎉</div>
      <h2 className="text-2xl font-black mb-2" style={{ color: S.text }}>Course Submitted!</h2>
      <p className="text-sm" style={{ color: S.muted }}>
        Your course has been submitted for final review. The developer will add it to the catalog shortly.
      </p>
      <button onClick={() => { setPublished(false); setForm({ title: "", emoji: "📚", color: "#8b5cf6", category: "Programming", level: "beginner", duration: "~5h", description: "", modules: [{ ...EMPTY_MODULE, id: `m-${Date.now()}` }] }); }}
        className="mt-6 px-6 py-2.5 rounded-xl text-sm font-bold bg-violet-600 hover:bg-violet-500 text-white transition-all">
        Submit Another
      </button>
    </div>
  );

  const inputStyle = { background: S.surface, border: `1px solid ${S.border}`, color: S.text };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black mb-1" style={{ color: S.text }}>{t("publishCourse")}</h2>
        <p className="text-sm mb-5" style={{ color: S.muted }}>{t("publishCourseDesc")}</p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="col-span-2">
            <label className="text-xs font-bold block mb-1.5" style={{ color: S.muted }}>{t("courseTitle")} *</label>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Introduction to React" className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
              style={inputStyle} />
          </div>
          <div>
            <label className="text-xs font-bold block mb-1.5" style={{ color: S.muted }}>{t("courseEmoji")}</label>
            <input value={form.emoji} onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none text-center text-xl"
              style={inputStyle} />
          </div>
          <div>
            <label className="text-xs font-bold block mb-1.5" style={{ color: S.muted }}>{t("courseColor")}</label>
            <div className="flex items-center gap-2">
              <input type="color" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                className="w-12 h-10 rounded-xl cursor-pointer border-0 bg-transparent" />
              <span className="text-xs" style={{ color: S.muted }}>{form.color}</span>
            </div>
          </div>
          <div>
            <label className="text-xs font-bold block mb-1.5" style={{ color: S.muted }}>{t("courseCategory")}</label>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
              style={inputStyle}>
              {["Programming", "Engineering", "AP Sciences", "AP Mathematics", "AP History & Social Science", "AP Computer Science", "Mathematics", "Sciences", "Coding Skills"].map(c =>
                <option key={c} value={c}>{c}</option>
              )}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold block mb-1.5" style={{ color: S.muted }}>{t("courseLevel")}</label>
            <select value={form.level} onChange={e => setForm(f => ({ ...f, level: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
              style={inputStyle}>
              {["beginner","intermediate","advanced","ap","engineering"].map(l =>
                <option key={l} value={l}>{l}</option>
              )}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold block mb-1.5" style={{ color: S.muted }}>{t("courseDuration")}</label>
            <input value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
              placeholder="~10h" className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
              style={inputStyle} />
          </div>
          <div className="col-span-2">
            <label className="text-xs font-bold block mb-1.5" style={{ color: S.muted }}>{t("courseDescription")} *</label>
            <textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="What will students learn? Who is it for?"
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none"
              style={inputStyle} />
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: S.muted }}>{t("modules")} ({form.modules.length})</p>
            <button onClick={addModule} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-violet-400 transition-all hover:bg-violet-500/20"
              style={{ border: "1px solid rgba(139,92,246,0.3)" }}>
              <Plus className="w-3.5 h-3.5" /> {t("addModule")}
            </button>
          </div>
          <div className="space-y-3">
            {form.modules.map((mod, i) => (
              <div key={mod.id} className="rounded-2xl p-4" style={{ background: S.surface, border: `1px solid ${S.border}` }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-violet-400">Module {i + 1}</span>
                  {form.modules.length > 1 && (
                    <button onClick={() => removeModule(i)} className="text-red-400 hover:text-red-300 transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="col-span-2">
                    <label className="text-[10px] font-bold block mb-1" style={{ color: S.muted }}>{t("moduleTitle")} *</label>
                    <input value={mod.title} onChange={e => updateModule(i, "title", e.target.value)}
                      placeholder="e.g. Introduction to Components" className="w-full px-3 py-2 rounded-xl text-xs outline-none"
                      style={inputStyle} />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold block mb-1" style={{ color: S.muted }}>{t("moduleVideoId")} *</label>
                    <input value={mod.videoId} onChange={e => updateModule(i, "videoId", e.target.value)}
                      placeholder="dQw4w9WgXcQ" className="w-full px-3 py-2 rounded-xl text-xs outline-none font-mono"
                      style={inputStyle} />
                    <p className="text-[9px] mt-0.5" style={{ color: S.muted }}>The part after ?v= in the YouTube URL</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold block mb-1" style={{ color: S.muted }}>{t("moduleSummary")}</label>
                    <input value={mod.summary} onChange={e => updateModule(i, "summary", e.target.value)}
                      placeholder="What does this lesson cover?" className="w-full px-3 py-2 rounded-xl text-xs outline-none"
                      style={inputStyle} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button onClick={publishCourse}
          disabled={publishing || !form.title || !form.description || form.modules.some(m => !m.title || !m.videoId)}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white transition-all disabled:opacity-40 bg-violet-600 hover:bg-violet-500">
          {publishing ? <><Loader2 className="w-4 h-4 animate-spin" /> {t("publishingBtn")}</> : <><Upload className="w-4 h-4" /> {t("publishBtn")}</>}
        </button>
      </div>
    </div>
  );
}

export default function Courses() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");
  const [progress, setProgress] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("browse");
  const [applyForm, setApplyForm] = useState({ proposed_title: "", proposed_description: "", proposed_category: "", qualifications: "", sample_outline: "", video_links: "" });
  const [applySubmitting, setApplySubmitting] = useState(false);
  const [applyDone, setApplyDone] = useState(false);
  const [myApplications, setMyApplications] = useState([]);
  const [certModal, setCertModal] = useState(null);
  const [allReviews, setAllReviews] = useState([]);
  const [courseEnrollCounts, setCourseEnrollCounts] = useState({});

  useEffect(() => {
    db.auth.me().then(async me => {
      setUser(me);
      const [records, apps, reviews, allProgress] = await Promise.all([
        db.entities.CourseProgress.filter({ user_email: me.email }),
        db.entities.CourseApplication.filter({ applicant_email: me.email }),
        db.entities.CourseReview.list("-created_date", 500),
        db.entities.CourseProgress.list("-created_date", 1000),
      ]);
      const map = {};
      records.forEach(r => { map[r.course_id] = r; });
      setProgress(map);
      setMyApplications(apps);
      setAllReviews(reviews);
      const counts = {};
      allProgress.forEach(p => { counts[p.course_id] = (counts[p.course_id] || 0) + 1; });
      setCourseEnrollCounts(counts);
    }).catch(() => {});
  }, []);

  const handleReviewSubmitted = (review, type) => {
    setAllReviews(prev =>
      type === "create" ? [...prev, review] : prev.map(r => r.id === review.id ? review : r)
    );
  };

  const submitApplication = async () => {
    if (!applyForm.proposed_title || !applyForm.qualifications) return;
    setApplySubmitting(true);
    await db.entities.CourseApplication.create({
      ...applyForm, applicant_email: user?.email,
      applicant_name: user?.full_name || user?.email, status: "pending",
    });
    await db.entities.AppNotification.create({
      recipient_email: DEV_EMAIL,
      title: "📝 New Course Application",
      message: `${user?.full_name || user?.email} applied to create "${applyForm.proposed_title}". Review in DevDashboard > Course Apps.`,
      icon: "📝",
      link: "/DevDashboard",
    });
    setApplySubmitting(false);
    setApplyDone(true);
    setMyApplications(prev => [...prev, { ...applyForm, status: "pending" }]);
  };

  const filtered = COURSES
    .filter(c => {
      const cat = COURSE_CATEGORIES.find(x => x.id === selectedCat);
      const matchCat = selectedCat === "all" ? true : cat?.filterType === "mini" ? c.type === "mini" : c.category === selectedCat;
      const matchSearch = !search.trim() || c.title.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase()) || c.category.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    })
    .sort((a, b) => (courseEnrollCounts[b.id] || 0) - (courseEnrollCounts[a.id] || 0));

  const myInProgress = COURSES.filter(c => progress[c.id] && !progress[c.id]?.completed && (progress[c.id]?.completed_lessons?.length || 0) > 0);
  const myCompleted = COURSES.filter(c => progress[c.id]?.completed);
  const hasApprovedApp = myApplications.some(a => a.status === "approved");

  const shareOnLinkedIn = (course) => {
    const text = encodeURIComponent(`I just completed "${course.title}" on Cognita Learning! 🎓`);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fcognita.app&summary=${text}`, "_blank");
  };
  const shareOnFacebook = (course) => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://cognita.app")}&quote=${encodeURIComponent(`I just completed "${course.title}" on Cognita Learning! 🎓`)}`, "_blank");
  };

  const inputStyle = { background: S.surface, border: `1px solid ${S.border}`, color: S.text };

  return (
    <FS>
      {/* ── SIDEBAR ─────────────────────────────────────────────────────── */}
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-[55] bg-black/50"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={`
          fixed md:relative inset-y-0 left-0 z-[56] md:z-auto
          ${sidebarOpen ? "w-screen md:w-60" : "w-0"}
          shrink-0 flex flex-col transition-all duration-300 border-r overflow-y-auto overflow-x-hidden
        `}
        style={{ borderColor: S.border, background: S.navBg }}
      >
        <div className="flex items-center gap-2.5 px-5 py-4 border-b shrink-0" style={{ borderColor: S.border }}>
          <img src="https://media.base44.com/images/public/69b097f35579053a78af47a3/43f8b728d_9e9c4097b_logo1.png" alt="Cognita" className="w-7 h-7 rounded-lg object-cover shrink-0" />
          <span className="font-black text-base tracking-tight" style={{ color: S.text }}>Cognita Learn</span>
        </div>

        <button onClick={() => navigate("/")}
          className="flex items-center gap-2 mx-3 mt-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all hover:bg-black/5 dark:hover:bg-white/5 opacity-60 hover:opacity-100"
          style={{ color: S.text }}>
          <Home className="w-3.5 h-3.5" /> {t("backToApp")}
        </button>

        <div className="px-3 mt-4 space-y-0.5">
          <p className="text-[10px] font-bold uppercase tracking-widest px-2 mb-2" style={{ color: S.muted }}>Navigation</p>
          {[
            { id: "browse", label: t("browseCourses"), emoji: "📚" },
            { id: "completed", label: `${t("myCompleted")} (${myCompleted.length})`, emoji: "🏆" },
            { id: "apply", label: t("createCourse"), emoji: hasApprovedApp ? "🚀" : "✏️" },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all text-left ${activeTab === tab.id ? "bg-violet-500/15 text-violet-500 font-semibold" : "opacity-60 hover:opacity-100"}`}
              style={activeTab !== tab.id ? { color: S.text } : {}}>
              <span className="text-base leading-none">{tab.emoji}</span>
              <span className="truncate">{tab.label}</span>
            </button>
          ))}
        </div>

        {activeTab === "browse" && (
          <div className="px-3 mt-4 space-y-0.5">
            <p className="text-[10px] font-bold uppercase tracking-widest px-2 mb-2" style={{ color: S.muted }}>{t("categories")}</p>
            {COURSE_CATEGORIES.map(cat => (
              <button key={cat.id} onClick={() => setSelectedCat(cat.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all text-left ${selectedCat === cat.id ? "bg-violet-500/15 text-violet-500 font-semibold" : "opacity-50 hover:opacity-100"}`}
                style={selectedCat !== cat.id ? { color: S.text } : {}}>
                <span className="leading-none">{cat.emoji}</span>
                <span className="truncate">{cat.label}</span>
              </button>
            ))}
          </div>
        )}

        {myInProgress.length > 0 && activeTab === "browse" && (
          <div className="px-3 mt-4 mb-2">
            <p className="text-[10px] font-bold uppercase tracking-widest px-2 mb-2" style={{ color: S.muted }}>{t("continueLearning")}</p>
            {myInProgress.slice(0, 4).map(c => {
              const prog = progress[c.id];
              const pct = Math.round(((prog?.completed_lessons?.length || 0) / c.modules.length) * 100);
              return (
                <Link key={c.id} to={`/CourseView?id=${c.id}`}>
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-all">
                    <span className="text-sm leading-none">{c.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate" style={{ color: S.text }}>{c.title}</p>
                      <div className="w-full h-1 rounded-full mt-1" style={{ background: S.border }}>
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: c.color }} />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="mt-auto mx-3 mb-4 px-3 py-2.5 rounded-xl shrink-0" style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.25)" }}>
          <div className="flex items-center gap-2">
            <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <p className="text-[10px] text-amber-500 font-semibold leading-tight">CPD Certification Pending</p>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT ──────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-3.5 border-b shrink-0" style={{ borderColor: S.border, background: S.navBg }}>
          <button onClick={() => setSidebarOpen(o => !o)} className="p-1.5 rounded-lg transition-all opacity-60 hover:opacity-100" style={{ color: S.text }}>
            <Menu className="w-4 h-4" />
          </button>
          {activeTab === "browse" && (
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: S.muted }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search courses, skills, topics..."
                className="w-full pl-9 pr-4 py-2 rounded-xl text-sm outline-none"
                style={inputStyle} />
            </div>
          )}
          {activeTab === "browse" && (
            <span className="text-xs font-semibold shrink-0 flex items-center gap-1.5" style={{ color: S.muted }}>
              <TrendingUp className="w-3.5 h-3.5" /> {t("trendingFirst")} · {filtered.length} {t("courses")}
            </span>
          )}
          {activeTab !== "browse" && (
            <h1 className="font-black text-base" style={{ color: S.text }}>
              {activeTab === "completed" ? `🏆 ${t("completedCourses")}` : hasApprovedApp ? `🚀 ${t("publishCourse")}` : `✏️ ${t("createCourse")}`}
            </h1>
          )}
        </div>

        {/* ── BROWSE TAB ── */}
        {activeTab === "browse" && (
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="flex items-center gap-3 mb-6">
              <h1 className="text-xl font-black" style={{ color: S.text }}>
                {COURSE_CATEGORIES.find(c => c.id === selectedCat)?.label || t("browseCourses")}
              </h1>
              {selectedCat === "all" && !search && (
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold" style={{ background: "rgba(139,92,246,0.12)", color: "#8b5cf6" }}>
                  {COURSES.length} total
                </span>
              )}
            </div>
            {(selectedCat === "mini" || selectedCat === "Coding Skills") && (
              <div className="mb-6 p-4 rounded-2xl" style={{ background: "rgba(251,191,36,0.07)", border: "1px solid rgba(251,191,36,0.2)" }}>
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <p className="text-sm font-bold text-amber-500">{t("quickSkills")}</p>
                </div>
                <p className="text-xs" style={{ color: S.muted }}>{t("quickSkillsDesc")}</p>
              </div>
            )}
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24" style={{ color: S.muted }}>
                <BookOpen className="w-12 h-12 mb-3 opacity-30" />
                <p className="opacity-50">{t("noCoursesFound")}</p>
              </div>
            ) : (
              <CourseGrid courses={filtered} progress={progress} enrollCounts={courseEnrollCounts} allReviews={allReviews} isAllView={selectedCat === "all" || !!search.trim()} t={t} />
            )}
          </div>
        )}

        {/* ── COMPLETED TAB ── */}
        {activeTab === "completed" && (
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {myCompleted.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32" style={{ color: S.muted }}>
                <Trophy className="w-16 h-16 mb-4 opacity-30" />
                <p className="text-lg font-bold">{t("noCompletedCourses")}</p>
                <p className="text-sm mt-1 opacity-70">{t("finishCourseMsg")}</p>
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-sm" style={{ color: S.muted }}>
                  {t("shareAchievements").replace("{n}", myCompleted.length)}
                </p>
                {myCompleted.map(course => {
                  const prog = progress[course.id];
                  const issuedAt = prog?.certificate_issued_at;
                  return (
                    <div key={course.id} className="rounded-2xl overflow-hidden" style={{ background: S.surface, border: `1px solid ${S.border}` }}>
                      <div className="flex items-center gap-4 p-5 border-b" style={{ borderColor: S.border }}>
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ background: `${course.color}20` }}>
                          {course.emoji}
                        </div>
                        <div className="flex-1">
                          <p className="font-black" style={{ color: S.text }}>{course.title}</p>
                          <p className="text-xs mt-0.5" style={{ color: S.muted }}>
                            Completed {issuedAt ? new Date(issuedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : ""}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap justify-end">
                          <button onClick={() => shareOnLinkedIn(course)}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all hover:opacity-90"
                            style={{ background: "#0077b5", color: "white" }}>
                            <ExternalLink className="w-3.5 h-3.5" /> LinkedIn
                          </button>
                          <button onClick={() => shareOnFacebook(course)}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all hover:opacity-90"
                            style={{ background: "#1877f2", color: "white" }}>
                            <Share2 className="w-3.5 h-3.5" /> Facebook
                          </button>
                          <button onClick={() => setCertModal(certModal?.id === course.id ? null : { ...course, issuedAt, userName: user?.full_name || user?.email })}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all hover:opacity-90"
                            style={{ background: "rgba(251,191,36,0.15)", color: "#d97706" }}>
                            <Award className="w-3.5 h-3.5" /> Certificate
                          </button>
                        </div>
                      </div>
                      {certModal?.id === course.id && (
                        <div className="p-5 border-b" style={{ borderColor: S.border }}>
                          <CourseCertificate course={course} userName={certModal.userName} issuedAt={certModal.issuedAt} />
                        </div>
                      )}
                      <CourseReviewPanel course={course} user={user} allReviews={allReviews} onReviewSubmitted={handleReviewSubmitted} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── APPLY / PUBLISH TAB ── */}
        {activeTab === "apply" && (
          <div className="flex-1 overflow-y-auto px-6 py-6 max-w-2xl mx-auto w-full">
            {user?.email === DEV_EMAIL && (
              <div className="mb-6 p-4 rounded-2xl" style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.25)" }}>
                <p className="text-sm font-bold text-violet-500">👋 You're the developer! You can create courses directly.</p>
                <p className="text-xs mt-1" style={{ color: S.muted }}>Applications from other users will appear in the DevDashboard for your review.</p>
              </div>
            )}

            {hasApprovedApp ? (
              <CoursePublisher user={user} t={t} />
            ) : applyDone ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-2xl font-black mb-2" style={{ color: S.text }}>{t("applicationSubmitted")}</h2>
                <p className="text-sm" style={{ color: S.muted }}>{t("applicationSubmittedDesc")}</p>
                <button onClick={() => { setApplyDone(false); setApplyForm({ proposed_title: "", proposed_description: "", proposed_category: "", qualifications: "", sample_outline: "", video_links: "" }); }}
                  className="mt-6 px-6 py-2.5 rounded-xl text-sm font-bold bg-violet-600 hover:bg-violet-500 text-white transition-all">
                  {t("submitAnother")}
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-black mb-1" style={{ color: S.text }}>{t("proposeCourse")}</h2>
                <p className="text-sm mb-6" style={{ color: S.muted }}>{t("proposeDesc")}</p>
                {myApplications.length > 0 && (
                  <div className="mb-6 space-y-2">
                    <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: S.muted }}>{t("yourApplications")}</p>
                    {myApplications.map((app, i) => (
                      <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: S.surface, border: `1px solid ${S.border}` }}>
                        <FileText className="w-4 h-4 shrink-0" style={{ color: S.muted }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate" style={{ color: S.text }}>{app.proposed_title}</p>
                          <p className="text-xs" style={{ color: S.muted }}>{app.proposed_category}</p>
                        </div>
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${app.status === "approved" ? "bg-emerald-500/15 text-emerald-600" : app.status === "rejected" ? "bg-red-500/15 text-red-500" : "bg-amber-500/15 text-amber-600"}`}>
                          {app.status === "approved" ? t("approved") : app.status === "rejected" ? t("rejected") : t("pending")}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="space-y-4">
                  {[
                    { label: t("proposedTitle"), key: "proposed_title", placeholder: "e.g. Introduction to Machine Learning" },
                    { label: t("categoryField"), key: "proposed_category", placeholder: "e.g. AP Sciences, Engineering, Programming..." },
                  ].map(({ label, key, placeholder }) => (
                    <div key={key}>
                      <label className="text-xs font-bold block mb-1.5" style={{ color: S.muted }}>{label}</label>
                      <input value={applyForm[key]} onChange={e => setApplyForm(p => ({ ...p, [key]: e.target.value }))} placeholder={placeholder}
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                        style={inputStyle} />
                    </div>
                  ))}
                  {[
                    { label: t("courseDescField"), key: "proposed_description", placeholder: "What will students learn? Who is it for?" },
                    { label: t("qualificationsField"), key: "qualifications", placeholder: "Why are you qualified to teach this?" },
                    { label: t("sampleOutline"), key: "sample_outline", placeholder: "List 3–6 proposed modules..." },
                    { label: t("videoLinks"), key: "video_links", placeholder: "Paste YouTube URLs for proposed lesson videos, one per line." },
                  ].map(({ label, key, placeholder }) => (
                    <div key={key}>
                      <label className="text-xs font-bold block mb-1.5" style={{ color: S.muted }}>{label}</label>
                      <textarea rows={3} value={applyForm[key]} onChange={e => setApplyForm(p => ({ ...p, [key]: e.target.value }))} placeholder={placeholder}
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
                        style={inputStyle} />
                    </div>
                  ))}
                  <button onClick={submitApplication} disabled={applySubmitting || !applyForm.proposed_title || !applyForm.qualifications || !applyForm.proposed_description || !(applyForm.video_links || "").trim()}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white transition-all disabled:opacity-40 bg-violet-600 hover:bg-violet-500">
                    {applySubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> {t("submitting")}</> : <><Send className="w-4 h-4" /> {t("submitApplication")}</>}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </FS>
  );
}

function CourseGrid({ courses, progress, enrollCounts, allReviews, isAllView, t }) {
  if (isAllView) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map(c => <CourseCard key={c.id} course={c} prog={progress[c.id]} enrollCount={enrollCounts[c.id] || 0} reviews={allReviews.filter(r => r.course_id === c.id)} t={t} />)}
      </div>
    );
  }
  const isMixed = [...new Set(courses.map(c => c.category))].length > 1;
  if (!isMixed) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map(c => <CourseCard key={c.id} course={c} prog={progress[c.id]} enrollCount={enrollCounts[c.id] || 0} reviews={allReviews.filter(r => r.course_id === c.id)} t={t} />)}
      </div>
    );
  }
  const groups = {};
  courses.forEach(c => {
    if (!groups[c.category]) groups[c.category] = [];
    groups[c.category].push(c);
  });
  return (
    <div className="space-y-10">
      {Object.entries(groups).map(([cat, list]) => (
        <div key={cat}>
          <h2 className="text-sm font-bold mb-4 uppercase tracking-widest" style={{ color: "var(--app-muted)" }}>{cat}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {list.map(c => <CourseCard key={c.id} course={c} prog={progress[c.id]} enrollCount={enrollCounts[c.id] || 0} reviews={allReviews.filter(r => r.course_id === c.id)} t={t} />)}
          </div>
        </div>
      ))}
    </div>
  );
}

function CourseCard({ course, prog, enrollCount, reviews, t }) {
  const completedLessons = prog?.completed_lessons?.length || 0;
  const total = course.modules.length;
  const pct = Math.round((completedLessons / total) * 100);
  const done = prog?.completed;
  const started = completedLessons > 0;
  const level = LEVEL_LABELS[course.level] || LEVEL_LABELS.beginner;
  const isMini = course.type === "mini";
  const isTrending = enrollCount >= 2;
  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null;

  return (
    <Link to={`/CourseView?id=${course.id}`}>
      <div className="group rounded-2xl p-5 cursor-pointer transition-all hover:scale-[1.02] flex flex-col"
        style={{
          background: "var(--app-surface)",
          border: `1px solid ${isTrending ? "rgba(251,191,36,0.25)" : "var(--app-border)"}`,
          minHeight: 200
        }}>
        <div className="flex items-start justify-between mb-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ background: `${course.color}18`, border: `1px solid ${course.color}30` }}>
            {course.emoji}
          </div>
          <div className="flex flex-col items-end gap-1">
            {isTrending && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-amber-500" style={{ background: "rgba(251,191,36,0.12)" }}>
                🔥 {enrollCount} enrolled
              </span>
            )}
            {isMini && !isTrending && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-amber-500" style={{ background: "rgba(251,191,36,0.12)" }}>
                <Zap className="w-2.5 h-2.5" /> {course.duration}
              </span>
            )}
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: `${level.color}18`, color: level.color }}>
              {level.label}
            </span>
            {done && <CheckCircle className="w-4 h-4 text-emerald-500" />}
          </div>
        </div>
        <p className="font-black text-sm leading-snug mb-1" style={{ color: "var(--app-text)" }}>{course.title}</p>
        <p className="text-xs leading-relaxed mb-3 flex-1" style={{ color: "var(--app-muted)" }}>{course.description}</p>
        <div className="flex items-center gap-3 text-[11px] mb-3 flex-wrap" style={{ color: "var(--app-muted)" }}>
          <span className="flex items-center gap-1"><PlayCircle className="w-3 h-3" /> {total} {isMini ? "lesson" : "modules"}</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {course.duration}</span>
          {avgRating && (
            <span className="flex items-center gap-1 text-amber-500">
              <Star className="w-3 h-3 fill-amber-500" /> {avgRating}
            </span>
          )}
        </div>
        {started && !done && (
          <div>
            <div className="flex justify-between text-[10px] mb-1" style={{ color: "var(--app-muted)" }}>
              <span>Progress</span><span>{pct}%</span>
            </div>
            <div className="h-1 rounded-full overflow-hidden" style={{ background: "var(--app-border)" }}>
              <div className="h-full rounded-full" style={{ width: `${pct}%`, background: course.color }} />
            </div>
          </div>
        )}
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs font-semibold" style={{ color: course.color }}>
            {done ? "Completed ✓" : started ? "Continue →" : isMini ? "Start (quick!) →" : "Start Course →"}
          </span>
          <ChevronRight className="w-4 h-4 opacity-30 group-hover:opacity-70 transition-all" style={{ color: "var(--app-text)" }} />
        </div>
      </div>
    </Link>
  );
}