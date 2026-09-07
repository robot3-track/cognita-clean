import { db } from '@/lib/firebase';
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { COURSES, COURSE_CATEGORIES, LEVEL_LABELS } from "@/lib/courseData";
import {
  Search, Award, PlayCircle, CheckCircle, Clock, Zap, ChevronRight,
  BookOpen, Menu, Home, Trophy, Send, Loader2,
  Share2, FileText, Star, MessageSquare, ExternalLink, TrendingUp,
  Plus, Trash2, Upload, Layers, CheckSquare, Sparkles, GraduationCap, Compass
} from "lucide-react";
import CourseCertificate from "@/components/CourseCertificate";
import { useTranslation } from "@/hooks/useTranslation";

const DEV_EMAIL = "yychang100@student.hbuhsd.edu";

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
  <div className="fixed inset-0 z-[9999] flex overflow-hidden font-sans antialiased"
    style={{ background: S.bg, color: S.text }}>
    {children}
  </div>
);

const CATEGORY_ICONS = {
  all: Compass,
  Programming: PlayCircle,
  Engineering: Layers,
  "AP Sciences": Sparkles,
  "AP Mathematics": GraduationCap,
  "AP History & Social Science": BookOpen,
  "AP Computer Science": CheckSquare,
  Mathematics: GraduationCap,
  Sciences: Sparkles,
  "Coding Skills": Zap,
};

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
    <div className="p-6 border-t" style={{ borderColor: S.border }}>
      {avgRating && (
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1">
            {[1,2,3,4,5].map(s => (
              <Star key={s} className={`w-4 h-4 ${parseFloat(avgRating) >= s ? "text-amber-400 fill-amber-400" : "opacity-20"}`} />
            ))}
          </div>
          <span className="text-sm font-bold text-amber-500 tracking-tight">{avgRating}</span>
          <button onClick={() => setShowReviews(o => !o)} className="text-xs ml-2 font-medium opacity-70 hover:opacity-100 transition-opacity underline decoration-dotted">
            {courseReviews.length} review{courseReviews.length !== 1 ? "s" : ""}
          </button>
        </div>
      )}
      
      {showReviews && courseReviews.length > 0 && (
        <div className="mb-5 space-y-2.5 max-h-56 overflow-y-auto pr-1">
          {courseReviews.map(r => (
            <div key={r.id} className="p-3.5 rounded-xl text-xs transition-colors" style={{ background: S.surface, border: `1px solid ${S.border}` }}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold" style={{ color: S.text }}>{r.user_name || r.user_email}</span>
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(s => <Star key={s} className={`w-3 h-3 ${r.rating >= s ? "text-amber-400 fill-amber-400" : "opacity-20"}`} />)}
                </div>
              </div>
              {r.comment && <p style={{ color: S.muted }} className="leading-relaxed">{r.comment}</p>}
            </div>
          ))}
        </div>
      )}

      <p className="text-xs font-semibold mb-2" style={{ color: S.muted }}>
        {myReview ? "Your Review" : "Rate this Course"}
      </p>
      <div className="flex items-center gap-1.5 mb-3">
        {[1,2,3,4,5].map(s => (
          <button key={s} onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)} onClick={() => setRating(s)} className="p-0.5 focus:outline-none">
            <Star className={`w-5 h-5 transition-transform duration-150 hover:scale-110 ${(hover || rating) >= s ? "text-amber-400 fill-amber-400" : "opacity-25"}`} />
          </button>
        ))}
      </div>
      <textarea rows={2} value={comment} onChange={e => setComment(e.target.value)}
        placeholder="Share your experience with this course..."
        className="w-full px-3.5 py-2.5 rounded-xl text-xs outline-none resize-none mb-3 transition-all focus:ring-2 focus:ring-violet-500/20"
        style={{ background: S.surface, border: `1px solid ${S.border}`, color: S.text }} />
      <button onClick={submit} disabled={!rating || submitting}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm disabled:opacity-40 transition-all bg-violet-600 hover:bg-violet-700 active:scale-[0.98]">
        {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <MessageSquare className="w-3.5 h-3.5" />}
        {myReview ? "Update Review" : "Submit Review"}
      </button>
    </div>
  );
}

function CoursePublisher({ user, t }) {
  const EMPTY_MODULE = { id: "", title: "", videoId: "", summary: "" };
  const [form, setForm] = useState({
    title: "", link: "", color: "#8b5cf6", category: "Programming",
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
      title: "New Course Submitted for Publishing",
      message: `${user?.full_name || user?.email} submitted "${form.title}" (${form.modules.length} lessons). Review in DevDashboard > Course Apps.`,
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
    <div className="text-center py-16 px-8 rounded-2xl border bg-emerald-500/5 backdrop-blur-sm" style={{ borderColor: S.border }}>
      <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="w-8 h-8 text-emerald-500" />
      </div>
      <h2 className="text-2xl font-bold mb-2 tracking-tight" style={{ color: S.text }}>Course Submitted!</h2>
      <p className="text-xs max-w-md mx-auto leading-relaxed" style={{ color: S.muted }}>
        Your course content has been submitted for final review. The development team will register it into the course catalog shortly.
      </p>
      <button onClick={() => { setPublished(false); setForm({ title: "", link: "", color: "#8b5cf6", category: "Programming", level: "beginner", duration: "~5h", description: "", modules: [{ ...EMPTY_MODULE, id: `m-${Date.now()}` }] }); }}
        className="mt-6 px-6 py-2.5 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-700 text-white transition-all shadow-sm">
        Submit Another Course
      </button>
    </div>
  );

  const inputStyle = { background: S.surface, border: `1px solid ${S.border}`, color: S.text };

  return (
    <div className="space-y-6">
      <div className="border-b pb-5" style={{ borderColor: S.border }}>
        <h2 className="text-xl font-bold tracking-tight mb-1" style={{ color: S.text }}>{t("publishCourse")}</h2>
        <p className="text-xs" style={{ color: S.muted }}>{t("publishCourseDesc")}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="text-xs font-semibold block mb-1.5" style={{ color: S.muted }}>{t("courseTitle")} *</label>
          <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            placeholder="e.g. Introduction to React" className="w-full px-4 py-2.5 rounded-xl text-xs outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
            style={inputStyle} />
        </div>
        <div className="col-span-2">
          <label className="text-xs font-semibold block mb-1.5" style={{ color: S.muted }}>Cover Image CDN Link URL</label>
          <input value={form.link} onChange={e => setForm(f => ({ ...f, link: e.target.value }))}
            placeholder="https://example.com/image.png" className="w-full px-4 py-2.5 rounded-xl text-xs outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
            style={inputStyle} />
        </div>
        <div>
          <label className="text-xs font-semibold block mb-1.5" style={{ color: S.muted }}>Brand Color Accent</label>
          <div className="flex items-center gap-3 p-1.5 rounded-xl border" style={{ borderColor: S.border, background: S.surface }}>
            <input type="color" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
              className="w-9 h-8 rounded-lg cursor-pointer border-0 bg-transparent" />
            <span className="text-xs font-mono font-medium" style={{ color: S.muted }}>{form.color}</span>
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold block mb-1.5" style={{ color: S.muted }}>{t("courseCategory")}</label>
          <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            className="w-full px-3 py-2.5 rounded-xl text-xs outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
            style={inputStyle}>
            {["Programming", "Engineering", "AP Sciences", "AP Mathematics", "AP History & Social Science", "AP Computer Science", "Mathematics", "Sciences", "Coding Skills"].map(c =>
              <option key={c} value={c}>{c}</option>
            )}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold block mb-1.5" style={{ color: S.muted }}>{t("courseLevel")}</label>
          <select value={form.level} onChange={e => setForm(f => ({ ...f, level: e.target.value }))}
            className="w-full px-3 py-2.5 rounded-xl text-xs outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
            style={inputStyle}>
            {["beginner","intermediate","advanced","ap","engineering"].map(l =>
              <option key={l} value={l}>{l.toUpperCase()}</option>
            )}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold block mb-1.5" style={{ color: S.muted }}>Estimated Course Duration</label>
          <input value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
            placeholder="e.g. ~5h" className="w-full px-4 py-2.5 rounded-xl text-xs outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
            style={inputStyle} />
        </div>
        <div className="col-span-2">
          <label className="text-xs font-semibold block mb-1.5" style={{ color: S.muted }}>{t("courseDescription")} *</label>
          <textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            placeholder="What will students learn? Who is this course for?"
            className="w-full px-4 py-2.5 rounded-xl text-xs outline-none resize-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
            style={inputStyle} />
        </div>
      </div>

      <div className="pt-4 border-t" style={{ borderColor: S.border }}>
        <div className="flex items-center justify-between mb-4">
          <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: S.muted }}>Course Lessons ({form.modules.length})</p>
          <button onClick={addModule} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-violet-400 hover:bg-violet-500/10 border border-violet-500/30 transition-all">
            <Plus className="w-3.5 h-3.5" /> Add Lesson
          </button>
        </div>
        <div className="space-y-3.5">
          {form.modules.map((mod, i) => (
            <div key={mod.id} className="rounded-xl p-4 transition-all" style={{ background: S.surface, border: `1px solid ${S.border}` }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-violet-400">Lesson {i + 1}</span>
                {form.modules.length > 1 && (
                  <button onClick={() => removeModule(i)} className="text-rose-400 hover:text-rose-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-[10px] font-semibold block mb-1" style={{ color: S.muted }}>Lesson Title *</label>
                  <input value={mod.title} onChange={e => updateModule(i, "title", e.target.value)}
                    placeholder="e.g. Structural Mechanics Basics" className="w-full px-3 py-2 rounded-lg text-xs outline-none"
                    style={inputStyle} />
                </div>
                <div>
                  <label className="text-[10px] font-semibold block mb-1" style={{ color: S.muted }}>YouTube Video ID *</label>
                  <input value={mod.videoId} onChange={e => updateModule(i, "videoId", e.target.value)}
                    placeholder="e.g. dQw4w9WgXcQ" className="w-full px-3 py-2 rounded-lg text-xs outline-none font-mono"
                    style={inputStyle} />
                </div>
                <div>
                  <label className="text-[10px] font-semibold block mb-1" style={{ color: S.muted }}>Lesson Summary</label>
                  <input value={mod.summary} onChange={e => updateModule(i, "summary", e.target.value)}
                    placeholder="Key concepts covered..." className="w-full px-3 py-2 rounded-lg text-xs outline-none"
                    style={inputStyle} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button onClick={publishCourse}
        disabled={publishing || !form.title || !form.description || form.modules.some(m => !m.title || !m.videoId)}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs text-white uppercase tracking-wider transition-all disabled:opacity-40 bg-violet-600 hover:bg-violet-700 shadow-sm active:scale-[0.99]">
        {publishing ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving Course...</> : <><Upload className="w-4 h-4" /> Publish to Catalog</>}
      </button>
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
  const [dynamicCourses, setDynamicCourses] = useState([]);
  const [certModal, setCertModal] = useState(null);
  const [allReviews, setAllReviews] = useState([]);
  const [courseEnrollCounts, setCourseEnrollCounts] = useState({});

  useEffect(() => {
    db.auth.me().then(async me => {
      setUser(me);
      const [records, apps, reviews, allProgress, approvedDynamicApps] = await Promise.all([
        db.entities.CourseProgress.filter({ user_email: me.email }),
        db.entities.CourseApplication.filter({ applicant_email: me.email }),
        db.entities.CourseReview.list("-created_date", 500),
        db.entities.CourseProgress.list("-created_date", 1000),
        db.entities.CourseApplication.filter({ status: "approved" }),
      ]);
      
      const map = {};
      records.forEach(r => { map[r.course_id] = r; });
      setProgress(map);
      setMyApplications(apps);
      setAllReviews(reviews);
      
      const counts = {};
      allProgress.forEach(p => { counts[p.course_id] = (counts[p.course_id] || 0) + 1; });
      setCourseEnrollCounts(counts);

      const loadedDynamic = (approvedDynamicApps || []).map(app => {
        try {
          const parsed = JSON.parse(app.sample_outline);
          return {
            id: app.id,
            title: app.proposed_title || parsed.title,
            description: app.proposed_description || parsed.description,
            category: app.proposed_category || parsed.category,
            link: parsed.link || parsed.image || "",
            color: parsed.color || "#8b5cf6",
            level: parsed.level || "beginner",
            duration: parsed.duration || "~5h",
            modules: parsed.modules || [],
            type: parsed.type || "dynamic"
          };
        } catch (e) {
          return null;
        }
      }).filter(Boolean);
      
      setDynamicCourses(loadedDynamic);
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
      title: "📝 New Course Proposal",
      message: `${user?.full_name || user?.email} applied to create "${applyForm.proposed_title}". Review in DevDashboard > Course Apps.`,
      icon: "📝",
      link: "/DevDashboard",
    });
    setApplySubmitting(false);
    setApplyDone(true);
    setMyApplications(prev => [...prev, { ...applyForm, status: "pending" }]);
  };

  const combinedCoursesList = [...COURSES, ...dynamicCourses];

  const filtered = combinedCoursesList
    .filter(c => {
      const cat = COURSE_CATEGORIES.find(x => x.id === selectedCat);
      const matchCat = selectedCat === "all" ? true : cat?.filterType === "mini" ? c.type === "mini" : c.category === selectedCat;
      const matchSearch = !search.trim() || c.title.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase()) || c.category.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    })
    .sort((a, b) => (courseEnrollCounts[b.id] || 0) - (courseEnrollCounts[a.id] || 0));

  const myInProgress = combinedCoursesList.filter(c => progress[c.id] && !progress[c.id]?.completed && (progress[c.id]?.completed_lessons?.length || 0) > 0);
  const myCompleted = combinedCoursesList.filter(c => progress[c.id]?.completed);
  const hasApprovedApp = myApplications.some(a => a.status === "approved");

  const shareOnLinkedIn = (course) => {
    const text = encodeURIComponent(`I completed "${course.title}" on Cognita! 🎓`);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fcognita.app&summary=${text}`, "_blank");
  };
  const shareOnFacebook = (course) => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://cognita.app")}&quote=${encodeURIComponent(`I completed "${course.title}" on Cognita! 🎓`)}`, "_blank");
  };

  const inputStyle = { background: S.surface, border: `1px solid ${S.border}`, color: S.text };

  return (
    <FS>
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-[55] bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setSidebarOpen(false)} />
      )}
      <aside
        className={`fixed md:relative inset-y-0 left-0 z-[56] md:z-auto ${sidebarOpen ? "w-72 md:w-64" : "w-0 md:w-64"} shrink-0 flex flex-col transition-all duration-300 border-r overflow-y-auto overflow-x-hidden`}
        style={{ borderColor: S.border, background: S.navBg }}
      >
        <div className="flex items-center gap-3 px-6 py-5 border-b shrink-0" style={{ borderColor: S.border }}>
          <img src="https://media.base44.com/images/public/69b097f35579053a78af47a3/43f8b728d_9e9c4097b_logo1.png" alt="Cognita" className="w-6 h-6 rounded-md object-cover shrink-0 shadow-sm" />
          <span className="font-bold text-sm tracking-tight text-violet-500">Cognita Academy</span>
        </div>

        <button onClick={() => navigate("/")}
          className="flex items-center gap-2 mx-4 mt-4 px-3 py-2 rounded-xl text-xs font-semibold transition-all hover:bg-violet-500/10 opacity-80 hover:opacity-100"
          style={{ color: S.text }}>
          <Home className="w-3.5 h-3.5" /> Back to Dashboard
        </button>

        <div className="px-4 mt-6 space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-wider px-2 mb-2 opacity-50" style={{ color: S.muted }}>Navigation</p>
          {[
            { id: "browse", label: t("browseCourses"), icon: Compass },
            { id: "completed", label: `Completed (${myCompleted.length})`, icon: Trophy },
            { id: "apply", label: hasApprovedApp ? "Creator Studio" : "Propose a Course", icon: Award },
          ].map(tab => {
            const IconComponent = tab.icon;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${activeTab === tab.id ? "bg-violet-500/10 text-violet-400" : "opacity-70 hover:opacity-100 hover:bg-violet-500/5"}`}
                style={activeTab !== tab.id ? { color: S.text } : {}}>
                <IconComponent className="w-4 h-4 text-violet-400" />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {activeTab === "browse" && (
          <div className="px-4 mt-6 space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider px-2 mb-2 opacity-50" style={{ color: S.muted }}>{t("categories")}</p>
            {COURSE_CATEGORIES.map(cat => {
              const IconComponent = CATEGORY_ICONS[cat.id] || BookOpen;
              return (
                <button key={cat.id} onClick={() => setSelectedCat(cat.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all text-left ${selectedCat === cat.id ? "bg-violet-500/10 text-violet-400 font-bold" : "opacity-60 hover:opacity-100 hover:bg-violet-500/5"}`}
                  style={selectedCat !== cat.id ? { color: S.text } : {}}>
                  <IconComponent className="w-3.5 h-3.5 text-violet-400/80" />
                  <span className="truncate">{cat.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {myInProgress.length > 0 && activeTab === "browse" && (
          <div className="px-4 mt-6 mb-2">
            <p className="text-[10px] font-bold uppercase tracking-wider px-2 mb-2 opacity-50" style={{ color: S.muted }}>In Progress</p>
            {myInProgress.slice(0, 4).map(c => {
              const prog = progress[c.id];
              const pct = Math.round(((prog?.completed_lessons?.length || 0) / c.modules.length) * 100);
              return (
                <Link key={c.id} to={`/CourseView?id=${c.id}`}>
                  <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-violet-500/5 transition-all group">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ background: c.color }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate group-hover:text-violet-400 transition-colors" style={{ color: S.text }}>{c.title}</p>
                      <div className="w-full h-1 rounded-full mt-1.5 overflow-hidden" style={{ background: S.border }}>
                        <div className="h-full rounded-full transition-all duration-300" style={{ width: `${pct}%`, background: c.color }} />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="mt-auto mx-4 mb-4 px-4 py-3 rounded-xl shrink-0 border border-amber-500/20 bg-amber-500/5">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500 shrink-0" />
            <p className="text-[10px] text-amber-500 font-bold leading-tight uppercase tracking-wider">Certificates Available</p>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center gap-4 px-8 py-4 border-b shrink-0" style={{ borderColor: S.border, background: S.navBg }}>
          <button onClick={() => setSidebarOpen(o => !o)} className="md:hidden p-1.5 rounded-xl opacity-70 hover:opacity-100 transition-opacity" style={{ color: S.text }}>
            <Menu className="w-5 h-5" />
          </button>
          
          {activeTab === "browse" && (
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" style={{ color: S.muted }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search courses, skills, topics..."
                className="w-full pl-10 pr-4 py-2 rounded-xl text-xs outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
                style={inputStyle} />
            </div>
          )}
          
          {activeTab === "browse" && (
            <span className="text-xs font-medium shrink-0 ml-auto flex items-center gap-1.5 opacity-80" style={{ color: S.muted }}>
              <TrendingUp className="w-4 h-4 text-violet-400" /> {filtered.length} courses available
            </span>
          )}
          {activeTab !== "browse" && (
            <h1 className="font-bold text-sm ml-auto text-violet-400 tracking-tight" style={{ color: S.text }}>
              {activeTab === "completed" ? "Completed Courses" : hasApprovedApp ? "Publish Course" : "Submit Course Proposal"}
            </h1>
          )}
        </div>

        {activeTab === "browse" && (
          <div className="flex-1 overflow-y-auto px-8 py-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold tracking-tight mb-1" style={{ color: S.text }}>
                  {COURSE_CATEGORIES.find(c => c.id === selectedCat)?.label || "All Courses"}
                </h1>
                <p className="text-xs opacity-60" style={{ color: S.muted }}>Explore verified courses taught by educators & industry leaders.</p>
              </div>
            </div>

            {(selectedCat === "mini" || selectedCat === "Coding Skills") && (
              <div className="mb-8 p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 flex items-center gap-3">
                <Zap className="w-5 h-5 text-amber-500 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-amber-500 uppercase tracking-wider">Short Courses</p>
                  <p className="text-xs opacity-80" style={{ color: S.muted }}>Quick, focused modules designed to teach practical hands-on skills fast.</p>
                </div>
              </div>
            )}

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-28 text-center" style={{ color: S.muted }}>
                <BookOpen className="w-12 h-12 mb-3 opacity-20" />
                <p className="text-sm font-semibold opacity-70">No courses match your search criteria.</p>
                <p className="text-xs opacity-40 mt-1">Try searching for standard keywords like "Python", "Physics", or "AP".</p>
              </div>
            ) : (
              <CourseGrid courses={filtered} progress={progress} enrollCounts={courseEnrollCounts} allReviews={allReviews} isAllView={selectedCat === "all" || !!search.trim()} t={t} />
            )}
          </div>
        )}

        {activeTab === "completed" && (
          <div className="flex-1 overflow-y-auto px-8 py-8">
            {myCompleted.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-center" style={{ color: S.muted }}>
                <Trophy className="w-12 h-12 mb-3 opacity-20 text-amber-500" />
                <p className="text-sm font-bold">No Completed Courses Yet</p>
                <p className="text-xs mt-1 opacity-60">Finish all modules in a course to earn your verified certificate.</p>
              </div>
            ) : (
              <div className="space-y-4 max-w-4xl">
                <p className="text-xs uppercase font-bold tracking-wider mb-2 opacity-60" style={{ color: S.muted }}>
                  Your Certificates & Badges ({myCompleted.length})
                </p>
                {myCompleted.map(course => {
                  const prog = progress[course.id];
                  const issuedAt = prog?.certificate_issued_at;
                  return (
                    <div key={course.id} className="rounded-2xl overflow-hidden border shadow-sm transition-all hover:shadow-md" style={{ background: S.surface, borderColor: S.border }}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border-b" style={{ borderColor: S.border }}>
                        <div>
                          <p className="font-bold text-base tracking-tight" style={{ color: S.text }}>{course.title}</p>
                          <p className="text-xs mt-0.5 font-mono opacity-60" style={{ color: S.muted }}>
                            Issued: {issuedAt ? new Date(issuedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "In Progress"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => shareOnLinkedIn(course)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#0077b5] text-white hover:bg-[#006396] transition-all">
                            <ExternalLink className="w-3.5 h-3.5" /> LinkedIn
                          </button>
                          <button onClick={() => shareOnFacebook(course)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#1877f2] text-white hover:bg-[#166fe5] transition-all">
                            <Share2 className="w-3.5 h-3.5" /> Facebook
                          </button>
                          <button onClick={() => setCertModal(certModal?.id === course.id ? null : { ...course, issuedAt, userName: user?.full_name || user?.email })}
                            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all border border-amber-500/30 text-amber-500 bg-amber-500/10 hover:bg-amber-500/20">
                            <Award className="w-3.5 h-3.5" /> View Certificate
                          </button>
                        </div>
                      </div>
                      {certModal?.id === course.id && (
                        <div className="p-6 bg-black/5 dark:bg-white/5 border-b" style={{ borderColor: S.border }}>
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

        {activeTab === "apply" && (
          <div className="flex-1 overflow-y-auto px-8 py-8 max-w-3xl mx-auto w-full">
            {hasApprovedApp ? (
              <CoursePublisher user={user} t={t} />
            ) : applyDone ? (
              <div className="text-center py-16 border rounded-2xl bg-violet-500/5 backdrop-blur-sm" style={{ borderColor: S.border }}>
                <div className="w-14 h-14 bg-violet-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Send className="w-7 h-7 text-violet-400" />
                </div>
                <h2 className="text-xl font-bold tracking-tight mb-1" style={{ color: S.text }}>Proposal Submitted</h2>
                <p className="text-xs max-w-sm mx-auto leading-relaxed" style={{ color: S.muted }}>Your course proposal has been submitted. Our review team will process your application shortly.</p>
                <button onClick={() => { setApplyDone(false); setApplyForm({ proposed_title: "", proposed_description: "", proposed_category: "", qualifications: "", sample_outline: "", video_links: "" }); }}
                  className="mt-6 px-5 py-2.5 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-700 text-white transition-all shadow-sm">
                  Submit Another Proposal
                </button>
              </div>
            ) : (
              <>
                <div className="border-b pb-4 mb-6" style={{ borderColor: S.border }}>
                  <h2 className="text-xl font-bold tracking-tight mb-1" style={{ color: S.text }}>Propose a New Course</h2>
                  <p className="text-xs" style={{ color: S.muted }}>Fill in your course details and syllabus outline below to apply as a course creator.</p>
                </div>
                
                {myApplications.length > 0 && (
                  <div className="mb-6 space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-left opacity-60" style={{ color: S.muted }}>Your Active Submissions</p>
                    {myApplications.map((app, i) => (
                      <div key={i} className="flex items-center justify-between px-4 py-3 rounded-xl border" style={{ background: S.surface, borderColor: S.border }}>
                        <div className="flex items-center gap-3 min-w-0">
                          <FileText className="w-4 h-4 text-violet-400 shrink-0" />
                          <div className="truncate">
                            <p className="text-xs font-bold truncate" style={{ color: S.text }}>{app.proposed_title}</p>
                            <p className="text-[10px]" style={{ color: S.muted }}>{app.proposed_category}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide ${app.status === "approved" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : app.status === "rejected" ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"}`}>
                          {app.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="space-y-4">
                  {[
                    { label: "Proposed Title", key: "proposed_title", placeholder: "e.g. Introduction to Web Development" },
                    { label: "Category", key: "proposed_category", placeholder: "e.g. Programming, Engineering, AP Sciences..." },
                  ].map(({ label, key, placeholder }) => (
                    <div key={key}>
                      <label className="text-xs font-semibold block mb-1.5" style={{ color: S.muted }}>{label}</label>
                      <input value={applyForm[key]} onChange={e => setApplyForm(p => ({ ...p, [key]: e.target.value }))} placeholder={placeholder}
                        className="w-full px-4 py-2.5 rounded-xl text-xs outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
                        style={inputStyle} />
                    </div>
                  ))}
                  {[
                    { label: "Course Description", key: "proposed_description", placeholder: "What will students learn in this course?" },
                    { label: "Qualifications", key: "qualifications", placeholder: "Your background or experience with this topic" },
                    { label: "Lesson Outline", key: "sample_outline", placeholder: "List the main lessons or topics..." },
                    { label: "Video Links (Optional)", key: "video_links", placeholder: "YouTube links for reference, one per line" },
                  ].map(({ label, key, placeholder }) => (
                    <div key={key}>
                      <label className="text-xs font-semibold block mb-1.5" style={{ color: S.muted }}>{label}</label>
                      <textarea rows={3} value={applyForm[key]} onChange={e => setApplyForm(p => ({ ...p, [key]: e.target.value }))} placeholder={placeholder}
                        className="w-full px-4 py-2.5 rounded-xl text-xs outline-none resize-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
                        style={inputStyle} />
                    </div>
                  ))}
                  <button onClick={submitApplication} disabled={applySubmitting || !applyForm.proposed_title || !applyForm.qualifications || !applyForm.proposed_description}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs text-white uppercase tracking-wider transition-all disabled:opacity-40 bg-violet-600 hover:bg-violet-700 shadow-sm active:scale-[0.99]">
                    {applySubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : <><Send className="w-4 h-4" /> Submit Proposal</>}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
        <div key={cat} className="border-t pt-6" style={{ borderColor: S.border }}>
          <h2 className="text-xs font-bold mb-4 uppercase tracking-wider opacity-60" style={{ color: "var(--app-muted)" }}>{cat}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

  const coverImageUrl = course.link || course.image;
  const CategoryFallbackIcon = CATEGORY_ICONS[course.category] || BookOpen;

  return (
    <Link to={`/CourseView?id=${course.id}`} className="block h-full group">
      <div className="rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between border relative overflow-hidden h-full"
        style={{
          background: "var(--app-surface)",
          borderColor: isTrending ? "rgba(251,191,36,0.3)" : "var(--app-border)",
          minHeight: 240
        }}>
        <div>
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden shrink-0 bg-neutral-500/10 border border-neutral-500/15 group-hover:border-violet-500/30 transition-colors">
              {coverImageUrl ? (
                <img 
                  src={coverImageUrl} 
                  alt={course.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => { e.target.style.display = 'none'; }} 
                />
              ) : (
                <CategoryFallbackIcon className="w-6 h-6 text-neutral-400 group-hover:text-violet-400 transition-colors" />
              )}
            </div>
            
            <div className="flex flex-col items-end gap-1">
              {isTrending && (
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20">
                  POPULAR
                </span>
              )}
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider" style={{ background: `${level.color}15`, color: level.color }}>
                {level.label}
              </span>
              {done && <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5" />}
            </div>
          </div>
          
          <p className="font-bold text-base leading-snug mb-1.5 text-neutral-900 dark:text-neutral-100 group-hover:text-violet-400 transition-colors">{course.title}</p>
          <p className="text-xs leading-relaxed mb-4 opacity-70 line-clamp-2" style={{ color: "var(--app-muted)" }}>{course.description}</p>
        </div>

        <div>
          <div className="flex items-center gap-3 text-[11px] font-medium tracking-tight mb-3 flex-wrap opacity-75" style={{ color: "var(--app-muted)" }}>
            <span className="flex items-center gap-1"><PlayCircle className="w-3.5 h-3.5 text-violet-400" /> {total} Lessons</span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 opacity-60" /> {course.duration}</span>
            {avgRating && (
              <span className="flex items-center gap-1 text-amber-500 font-bold ml-auto">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> {avgRating}
              </span>
            )}
          </div>
          
          {started && !done && (
            <div className="mb-3">
              <div className="flex justify-between text-[10px] font-mono mb-1.5 opacity-60" style={{ color: "var(--app-muted)" }}>
                <span>Progress</span><span>{pct}%</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--app-border)" }}>
                <div className="h-full rounded-full transition-all duration-300" style={{ width: `${pct}%`, background: course.color }} />
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between border-t pt-3.5 mt-1" style={{ borderColor: "var(--app-border)" }}>
            <span className="text-xs font-bold transition-all group-hover:translate-x-0.5" style={{ color: course.color }}>
              {done ? "Completed ✓" : started ? "Resume →" : isMini ? "Start Lesson →" : "Start Course →"}
            </span>
            <ChevronRight className="w-4 h-4 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" style={{ color: "var(--app-text)" }} />
          </div>
        </div>
      </div>
    </Link>
  );
}
