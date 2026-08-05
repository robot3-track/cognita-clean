import { db } from '@/lib/firebase';

import { useState, useEffect, useRef } from "react";

import LynxApiPanel from "../components/LynxApiPanel";
import { Loader2, Shield, CheckCircle2, Ban, Megaphone, X, UserX, Heart, Trash2, Plus, FileQuestion, Link, Lock, Handshake, TrendingUp, GraduationCap, Pencil, Save, ImagePlus } from "lucide-react";
import VerifiedBadge from "@/components/VerifiedBadge";
import DataBackupRestore from "../components/DataBackupRestore";
import GitExportPanel from "../components/GitExportPanel";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { TYPE_CONFIG } from "../components/DevAnnouncementBanner";
import UsageTab from "../components/UsageTab";
import { checkDevPin } from "../lib/devPin";

const DEV_EMAILS = ["yychang100@student.hbuhsd.edu", "yohanyinyuchang@gmail.com", "yohanchang@outlook.com", "cognita@boss.com"];

function ModerationTab({ suspensions, onUpdate, cardStyle, mutedStyle }) {
  const [updating, setUpdating] = useState(null);

  const setStatus = async (record, newStatus) => {
    setUpdating(record.id);
    const updated = await db.entities.SuspendedUser.update(record.id, { status: newStatus, reviewed_by: "admin" });
    onUpdate(updated);
    setUpdating(null);
  };

  if (suspensions.length === 0) {
    return (
      <div className="text-center py-16 rounded-2xl" style={cardStyle}>
        <Shield className="w-10 h-10 mx-auto mb-3 text-emerald-400" />
        <p className="font-bold mb-1">No suspicious activity</p>
        <p className="text-sm" style={mutedStyle}>All users are in good standing.</p>
      </div>
    );
  }

  const statusColor = { suspended: "text-amber-400 bg-amber-500/10 border-amber-500/20", cleared: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", banned: "text-red-400 bg-red-500/10 border-red-500/20" };

  return (
    <div className="space-y-3">
      {suspensions.map(s => (
        <div key={s.id} className="rounded-2xl p-5" style={cardStyle}>
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <p className="font-bold text-sm">{s.user_email}</p>
              <p className="text-xs mt-0.5" style={mutedStyle}>{new Date(s.created_date).toLocaleString()}</p>
            </div>
            <span className={`px-2.5 py-1 rounded-xl text-xs font-bold border ${statusColor[s.status] || ""}`}>{s.status}</span>
          </div>
          {s.trigger && <p className="text-xs mb-1"><span className="font-semibold">Trigger:</span> {s.trigger}</p>}
          {s.details && <p className="text-xs mb-3" style={mutedStyle}>{s.details}</p>}
          <p className="text-xs mb-3" style={mutedStyle}><span className="font-semibold">Reason:</span> {s.reason}</p>
          <div className="flex gap-2">
            <button
              onClick={() => setStatus(s, "cleared")}
              disabled={updating === s.id || s.status === "cleared"}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 disabled:opacity-40 transition-all"
            >
              {updating === s.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />} Clear & Restore
            </button>
            <button
              onClick={() => setStatus(s, "banned")}
              disabled={updating === s.id || s.status === "banned"}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 disabled:opacity-40 transition-all"
            >
              {updating === s.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Ban className="w-3 h-3" />} Permanently Ban
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function DirectBanPanel({ users, suspensions, onBanAdded, cardStyle, mutedStyle }) {
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [banning, setBanning] = useState(null);
  const [done, setDone] = useState(null);

  const alreadyBanned = (emailToCheck) =>
    suspensions.some(s => s.user_email === emailToCheck && (s.status === "banned" || s.status === "suspended"));

  const doBan = async (targetEmail) => {
    if (!targetEmail || !reason.trim()) return;
    setBanning(targetEmail);
    const record = await db.entities.SuspendedUser.create({
      user_email: targetEmail,
      reason: reason.trim(),
      status: "banned",
      trigger: "admin_direct_ban",
      details: "Manually banned by developer via DevDashboard Direct Ban panel.",
      reviewed_by: "admin",
    });
    onBanAdded(record);
    setBanning(null);
    setDone(targetEmail);
    setEmail("");
    setTimeout(() => setDone(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Quick ban by email */}
      <div className="rounded-2xl p-6" style={cardStyle}>
        <h2 className="font-black text-lg mb-1 flex items-center gap-2">
          <UserX className="w-5 h-5 text-red-400" /> Direct Ban by Email
        </h2>
        <p className="text-sm mb-4" style={mutedStyle}>
          Immediately ban any user by email. No AI flag required. The user will see a suspension screen on next login.
        </p>
        <div className="space-y-3">
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="user@email.com"
            className="w-full px-4 py-3 rounded-xl text-sm outline-none"
            style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)", color: "var(--app-text)" }} />
          <input value={reason} onChange={e => setReason(e.target.value)} placeholder="Reason for ban (required)"
            className="w-full px-4 py-3 rounded-xl text-sm outline-none"
            style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)", color: "var(--app-text)" }} />
          <button
            onClick={() => doBan(email.trim())}
            disabled={!email.trim() || !reason.trim() || !!banning || alreadyBanned(email.trim())}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all"
          >
            {banning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Ban className="w-4 h-4" />}
            {alreadyBanned(email.trim()) ? "Already banned" : "Ban User"}
          </button>
          {done && <p className="text-sm text-emerald-400 font-semibold">✅ {done} has been banned.</p>}
        </div>
      </div>

      {/* Ban from user list */}
      <div className="rounded-2xl p-5" style={cardStyle}>
        <h3 className="font-bold text-sm mb-3">Ban from User List</h3>
        <div className="space-y-2">
          {users.map(u => {
            const isBanned = alreadyBanned(u.email);
            return (
              <div key={u.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)" }}>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold truncate">{u.full_name || "—"}</p>
                  <p className="text-[10px] truncate" style={mutedStyle}>{u.email}</p>
                </div>
                {isBanned ? (
                  <button
                    onClick={async () => {
                      const s = suspensions.find(s => s.user_email === u.email && (s.status === "banned" || s.status === "suspended"));
                      if (!s) return;
                      setBanning(u.email);
                      await db.entities.SuspendedUser.update(s.id, { status: "cleared", reviewed_by: "admin" });
                      onBanAdded({ ...s, status: "cleared" }); // reuse callback to trigger parent refresh
                      setBanning(null);
                    }}
                    disabled={!!banning}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 disabled:opacity-40 transition-all"
                  >
                    {banning === u.email ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />} Unban
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      const r = prompt(`Reason for banning ${u.email}:`);
                      if (r) { setReason(r); doBan(u.email); }
                    }}
                    disabled={!!banning}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 disabled:opacity-40 transition-all"
                  >
                    <Ban className="w-3 h-3" /> Ban
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CourseApplicationsPanel({ cardStyle, mutedStyle }) {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    db.entities.CourseApplication.list("-created_date", 100).then(data => {
      setApps(data);
      setLoading(false);
    });
  }, []);

  const setStatus = async (id, status, notes = "") => {
    setUpdating(id);
    const updated = await db.entities.CourseApplication.update(id, { status, reviewer_notes: notes });
    setApps(prev => prev.map(a => a.id === id ? updated : a));
    setUpdating(null);
  };

  if (loading) return <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-violet-400" /></div>;
  if (apps.length === 0) return <div className="text-center py-16 rounded-2xl" style={cardStyle}><p className="font-bold mb-1">No applications yet</p><p className="text-sm" style={mutedStyle}>When users apply to create courses, they'll appear here.</p></div>;

  const statusColor = { pending: "text-amber-400 bg-amber-500/10 border-amber-500/20", approved: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", rejected: "text-red-400 bg-red-500/10 border-red-500/20" };

  return (
    <div className="space-y-4">
      <p className="text-sm" style={mutedStyle}>{apps.filter(a => a.status === "pending").length} pending, {apps.length} total</p>
      {apps.map(app => (
        <div key={app.id} className="rounded-2xl p-5" style={cardStyle}>
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <p className="font-black text-base">{app.proposed_title}</p>
              <p className="text-xs mt-0.5" style={mutedStyle}>{app.applicant_email} · {app.proposed_category}</p>
            </div>
            <span className={`px-2.5 py-1 rounded-xl text-xs font-bold border ${statusColor[app.status] || ""}`}>{app.status}</span>
          </div>
          <div className="space-y-2 mb-4 text-sm">
            {app.proposed_description && <div><span className="text-xs font-bold opacity-50">Description: </span>{app.proposed_description}</div>}
            {app.qualifications && <div><span className="text-xs font-bold opacity-50">Qualifications: </span>{app.qualifications}</div>}
            {app.sample_outline && <div><span className="text-xs font-bold opacity-50">Outline: </span>{app.sample_outline}</div>}
          </div>
          <div className="flex gap-2 flex-wrap">
            {app.status === "pending" && (<>
              <button onClick={() => setStatus(app.id, "approved")} disabled={updating === app.id}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 disabled:opacity-40 transition-all">
                {updating === app.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />} Approve
              </button>
              <button onClick={() => setStatus(app.id, "rejected")} disabled={updating === app.id}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 disabled:opacity-40 transition-all">
                {updating === app.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Ban className="w-3 h-3" />} Reject
              </button>
            </>)}
            {app.status === "approved" && (
              <button onClick={() => setStatus(app.id, "pending")} disabled={updating === app.id}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 disabled:opacity-40 transition-all">
                {updating === app.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <X className="w-3 h-3" />} Unapprove
              </button>
            )}
            {app.status === "rejected" && (
              <button onClick={() => setStatus(app.id, "pending")} disabled={updating === app.id}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 disabled:opacity-40 transition-all">
                {updating === app.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />} Reinstate
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function UserSyncButton({ cardStyle, mutedStyle }) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState('');

  const runUserSync = async () => {
    setIsSyncing(true);
    setSyncStatus('Starting deep synchronization scan...');
    try {
      setSyncStatus('Scanning Study Sessions...');
      const sessions = await db.entities.StudySession.list("-created_date", 30000).catch(() => []);
      
      setSyncStatus('Scanning User Login Events...');
      const loginEvents = await db.entities.UserLoginEvent.list("-created_date", 30000).catch(() => []);

      // Aggregate all unique active emails found across activity logs
      const activeEmails = new Set([
        ...sessions.map(s => s.user_email || s.email),
        ...loginEvents.map(e => e.user_email || e.email || e.userEmail)
      ].filter(Boolean));

      setSyncStatus('Fetching master user directory...');
      const existingProfiles = await db.entities.User.list(null, 20000).catch(() => []);

      // Create a map grouping existing profiles by normalized email
      const profilesByEmail = new Map();
      existingProfiles.forEach(u => {
        if (!u.email) return;
        const normalizedEmail = String(u.email).toLowerCase().trim();
        if (!profilesByEmail.has(normalizedEmail)) {
          profilesByEmail.set(normalizedEmail, []);
        }
        profilesByEmail.get(normalizedEmail).push(u);
      });

      let healedCount = 0;
      let mergedCount = 0;

      for (const rawEmail of activeEmails) {
        const cleanEmail = String(rawEmail).toLowerCase().trim();
        const baseName = cleanEmail.split('@')[0];
        const formattedName = baseName.charAt(0).toUpperCase() + baseName.slice(1);

        const matchedSession = sessions.find(s => String(s.user_email || s.email).toLowerCase().trim() === cleanEmail);
        const matchedEvent = loginEvents.find(e => String(e.user_email || e.email || e.userEmail).toLowerCase().trim() === cleanEmail);
        const potentialUserId = matchedSession?.userId || matchedSession?.user_id || matchedEvent?.userId || matchedEvent?.user_id || null;

        const matchingProfiles = profilesByEmail.get(cleanEmail) || [];

        if (matchingProfiles.length > 0) {
          // --- PROFILE ALREADY EXISTS: MERGE DATA ---
          setSyncStatus(`Merging data for existing user: ${cleanEmail}...`);
          const primaryProfile = matchingProfiles[0];

          // Check for missing fields that need filling or merging
          const mergePayload = {};
          if (!primaryProfile.full_name || primaryProfile.full_name === cleanEmail) {
            mergePayload.full_name = formattedName;
          }
          if (!primaryProfile.created_date && (matchedSession?.created_date || matchedEvent?.created_date)) {
            mergePayload.created_date = matchedSession?.created_date || matchedEvent?.created_date;
          }
          mergePayload.updated_date = new Date().toISOString();

          // Merge updates into existing user document
          await db.entities.User.update(primaryProfile.id, {
            ...primaryProfile,
            ...mergePayload,
          });
          mergedCount++;

          // Clean up extraneous duplicate profile records for the same email if present
          if (matchingProfiles.length > 1) {
            for (let i = 1; i < matchingProfiles.length; i++) {
              await db.entities.User.delete(matchingProfiles[i].id).catch(() => {});
            }
          }
        } else {
          // --- NO PROFILE EXISTS: CREATE NEW RECOVERED PROFILE ---
          setSyncStatus(`Healing missing profile: ${cleanEmail}...`);

          const newProfilePayload = {
            email: cleanEmail,
            full_name: formattedName,
            role: 'user',
            bio: '',
            created_date: matchedSession?.created_date || matchedEvent?.created_date || new Date().toISOString(),
            updated_date: new Date().toISOString()
          };

          if (potentialUserId) {
            newProfilePayload.id = potentialUserId;
          }

          const createdUser = await db.entities.User.create(newProfilePayload);
          profilesByEmail.set(cleanEmail, [createdUser]);
          healedCount++;
        }
      }

      setSyncStatus(`✅ Complete! Recovered ${healedCount} missing profiles and merged ${mergedCount} existing profiles.`);
    } catch (err) {
      console.error(err);
      setSyncStatus(`❌ Sync failed: ${err.message || err}`);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="rounded-2xl p-4 mb-4 border border-dashed text-xs" style={{ ...cardStyle, borderColor: 'var(--app-border)' }}>
      <h3 className="text-sm font-bold text-indigo-400 mb-1">🔄 User Profile Synchronization</h3>
      <p className="text-xs mb-3" style={mutedStyle}>
        Scans background operational logs (Sessions, Logins) to find active users, merging existing matching profiles or recovering missing ones without creating duplicates.
      </p>
      <button
        onClick={runUserSync}
        disabled={isSyncing}
        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-2"
      >
        {isSyncing ? 'Synchronizing Records...' : 'Scan & Sync Profiles'}
      </button>
      {syncStatus && (
        <p className="text-xs font-mono mt-2 p-2 bg-black/30 rounded border border-zinc-800 text-zinc-300 break-all">
          {syncStatus}
        </p>
      )}
    </div>
  );
}

function AnnouncementPanel({ cardStyle, mutedStyle, user }) {
  const [banners, setBanners] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [newType, setNewType] = useState("info");
  const [newLink, setNewLink] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    const all = await db.entities.AnnouncementBanner.list("-created_date", 30);
    setBanners(all);
  };

  const post = async () => {
    if (!newMsg.trim()) return;
    setLoading(true);
    await db.entities.AnnouncementBanner.create({
      message: newMsg.trim(),
      type: newType,
      active: true,
      created_by_name: user?.full_name || "Admin",
      link: newLink.trim() || null,
    });
    setNewMsg(""); setNewLink("");
    await fetchAll();
    setLoading(false);
  };

  const deactivate = async (id) => {
    await db.entities.AnnouncementBanner.update(id, { active: false });
    fetchAll();
  };

  const reactivate = async (id) => {
    await db.entities.AnnouncementBanner.update(id, { active: true });
    fetchAll();
  };

  const deleteB = async (id) => {
    await db.entities.AnnouncementBanner.delete(id);
    fetchAll();
  };

  const typeConfig = TYPE_CONFIG || {
    info: { bg: "rgba(59,130,246,0.12)", border: "rgba(59,130,246,0.35)", text: "rgb(147,197,253)" },
    warning: { bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.35)", text: "rgb(252,211,77)" },
    error: { bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.35)", text: "rgb(252,165,165)" },
    success: { bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.35)", text: "rgb(110,231,183)" },
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl p-6" style={cardStyle}>
        <h2 className="font-black text-lg mb-1 flex items-center gap-2"><Megaphone className="w-5 h-5 text-violet-400" /> Post Announcement</h2>
        <p className="text-sm mb-4" style={mutedStyle}>Send a banner message visible to all users at the top of every page. Optionally add a link.</p>
        <textarea
          value={newMsg}
          onChange={e => setNewMsg(e.target.value)}
          placeholder="e.g. 🔧 Maintenance window tonight from 11 PM–1 AM. Expect brief downtime."
          rows={3}
          className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none mb-3"
          style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)", color: "var(--app-text)" }}
        />
        <div className="flex items-center gap-2 mb-3">
          <Link className="w-4 h-4 shrink-0 opacity-50" />
          <input
            value={newLink}
            onChange={e => setNewLink(e.target.value)}
            placeholder="Optional link URL (e.g. https://example.com)"
            className="flex-1 px-3 py-2 rounded-xl text-sm outline-none"
            style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)", color: "var(--app-text)" }}
          />
        </div>
        <div className="flex gap-2 mb-3">
          {["info","warning","error","success"].map(t => (
            <button key={t} onClick={() => setNewType(t)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${newType === t ? "ring-2 ring-violet-500" : "opacity-50 hover:opacity-80"}`}
              style={{ background: typeConfig[t].bg, color: typeConfig[t].text, border: `1px solid ${typeConfig[t].border}` }}>
              {t}
            </button>
          ))}
        </div>
        <button onClick={post} disabled={!newMsg.trim() || loading}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Megaphone className="w-4 h-4" />}
          Post Announcement
        </button>
      </div>

      <div className="rounded-2xl p-5" style={cardStyle}>
        <h3 className="font-bold text-sm mb-3">All Banners</h3>
        {banners.length === 0 && <p className="text-sm" style={mutedStyle}>No announcements yet.</p>}
        <div className="space-y-2">
          {banners.map(b => {
            const cfg = typeConfig[b.type] || typeConfig.info;
            return (
              <div key={b.id} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm" style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.text }}>
                <div className="flex-1 min-w-0">
                  <span>{b.message}</span>
                  {b.link && <a href={b.link} target="_blank" rel="noopener noreferrer" className="ml-2 text-xs underline opacity-70">🔗 link</a>}
                </div>
                <span className={`text-xs font-bold shrink-0 ${b.active ? "text-emerald-400" : "opacity-40"}`}>{b.active ? "LIVE" : "off"}</span>
                {b.active ? (
                  <button onClick={() => deactivate(b.id)} className="shrink-0 opacity-60 hover:opacity-100 text-xs font-semibold">Disable</button>
                ) : (
                  <button onClick={() => reactivate(b.id)} className="shrink-0 opacity-60 hover:opacity-100 text-xs font-semibold text-emerald-400">Enable</button>
                )}
                <button onClick={() => deleteB(b.id)} className="shrink-0 opacity-40 hover:opacity-80">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function QuestionnairePanel({ cardStyle, mutedStyle }) {
  const [questionnaires, setQuestionnaires] = useState([]);
  const [responses, setResponses] = useState([]);
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([{ id: "q1", text: "", type: "text", options: [] }]);
  const [saving, setSaving] = useState(false);
  const [viewResponses, setViewResponses] = useState(null);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    const [qs, rs] = await Promise.all([
      db.entities.Questionnaire.list("-created_date", 50),
      db.entities.QuestionnaireResponse.list("-created_date", 500),
    ]);
    setQuestionnaires(qs);
    setResponses(rs);
    setLoading(false);
  };

  const addQuestion = () => {
    setQuestions(prev => [...prev, { id: `q${Date.now()}`, text: "", type: "text", options: [] }]);
  };

  const updateQuestion = (idx, field, value) => {
    setQuestions(prev => prev.map((q, i) => i === idx ? { ...q, [field]: value } : q));
  };

  const removeQuestion = (idx) => {
    setQuestions(prev => prev.filter((_, i) => i !== idx));
  };

  const save = async () => {
    if (!title.trim() || questions.some(q => !q.text.trim())) return;
    setSaving(true);
    await db.entities.Questionnaire.create({ title: title.trim(), description: description.trim(), questions, active: true });
    setTitle(""); setDescription(""); setQuestions([{ id: "q1", text: "", type: "text", options: [] }]);
    setCreating(false);
    await fetchAll();
    setSaving(false);
  };

  const toggleActive = async (q) => {
    await db.entities.Questionnaire.update(q.id, { active: !q.active });
    setQuestionnaires(prev => prev.map(x => x.id === q.id ? { ...x, active: !x.active } : x));
  };

  const deleteQ = async (id) => {
    await db.entities.Questionnaire.delete(id);
    setQuestionnaires(prev => prev.filter(x => x.id !== id));
  };

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-violet-400" /></div>;

  const responsesFor = (id) => responses.filter(r => r.questionnaire_id === id);

  return (
    <div className="space-y-5">
      <div className="rounded-2xl p-5" style={cardStyle}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-black text-lg flex items-center gap-2"><FileQuestion className="w-5 h-5 text-violet-400" /> Questionnaires</h2>
          <button
            onClick={() => setCreating(c => !c)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-violet-500/15 text-violet-400 hover:bg-violet-500/25 transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> New
          </button>
        </div>

        {creating && (
          <div className="mb-5 p-4 rounded-2xl space-y-3" style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)" }}>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Questionnaire title *"
              className="w-full px-3 py-2 rounded-xl text-sm outline-none"
              style={{ background: "var(--app-surface)", border: "1px solid var(--app-border)", color: "var(--app-text)" }} />
            <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Description (optional)"
              className="w-full px-3 py-2 rounded-xl text-sm outline-none"
              style={{ background: "var(--app-surface)", border: "1px solid var(--app-border)", color: "var(--app-text)" }} />
            <p className="text-xs font-bold opacity-50">Questions</p>
            {questions.map((q, i) => (
              <div key={q.id} className="p-3 rounded-xl space-y-2" style={{ background: "var(--app-surface)", border: "1px solid var(--app-border)" }}>
                <div className="flex gap-2">
                  <input value={q.text} onChange={e => updateQuestion(i, "text", e.target.value)} placeholder={`Question ${i+1} *`}
                    className="flex-1 px-3 py-2 rounded-lg text-xs outline-none"
                    style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)", color: "var(--app-text)" }} />
                  <select value={q.type} onChange={e => updateQuestion(i, "type", e.target.value)}
                    className="px-2 py-1 rounded-lg text-xs outline-none"
                    style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)", color: "var(--app-text)" }}>
                    <option value="text">Text</option>
                    <option value="multiple_choice">Multiple Choice</option>
                    <option value="rating">Rating (1-5)</option>
                  </select>
                  <button onClick={() => removeQuestion(i)} className="p-1 text-red-400 hover:bg-red-500/10 rounded-lg">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                {q.type === "multiple_choice" && (
                  <input
                    value={(q.options || []).join(", ")}
                    onChange={e => updateQuestion(i, "options", e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                    placeholder="Options separated by commas"
                    className="w-full px-3 py-1.5 rounded-lg text-xs outline-none"
                    style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)", color: "var(--app-text)" }}
                  />
                )}
              </div>
            ))}
            <div className="flex gap-2">
              <button onClick={addQuestion} className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold opacity-60 hover:opacity-100 border transition-all" style={{ border: "1px solid var(--app-border)" }}>
                <Plus className="w-3 h-3" /> Add Question
              </button>
              <button onClick={save} disabled={saving || !title.trim()}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold bg-violet-600 text-white hover:bg-violet-500 disabled:opacity-40 transition-all">
                {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : null} Save & Activate
              </button>
            </div>
          </div>
        )}

        {questionnaires.length === 0 && !creating && (
          <p className="text-sm" style={mutedStyle}>No questionnaires yet. Create one to ask users questions on login.</p>
        )}

        <div className="space-y-3">
          {questionnaires.map(q => {
            const rCount = responsesFor(q.id).length;
            return (
              <div key={q.id} className="rounded-xl p-4" style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)" }}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm">{q.title}</p>
                    {q.description && <p className="text-xs opacity-50 mt-0.5">{q.description}</p>}
                    <p className="text-xs mt-1 text-violet-400">{(q.questions || []).length} questions · {rCount} responses</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => setViewResponses(viewResponses === q.id ? null : q.id)}
                      className="text-xs px-2 py-1 rounded-lg font-semibold opacity-60 hover:opacity-100 transition-all border" style={{ border: "1px solid var(--app-border)" }}>
                      Responses
                    </button>
                    <button onClick={() => toggleActive(q)}
                      className={`text-xs px-2 py-1 rounded-lg font-bold transition-all ${q.active ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/10 text-red-400 opacity-60"}`}>
                      {q.active ? "LIVE" : "off"}
                    </button>
                    <button onClick={() => deleteQ(q.id)} className="p-1 text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                {viewResponses === q.id && (
                  <div className="mt-4 space-y-3">
                    {responsesFor(q.id).length === 0 && <p className="text-xs opacity-40 py-2">No responses yet.</p>}
                    {responsesFor(q.id).map(r => (
                      <div key={r.id} className="rounded-xl p-3 space-y-2" style={{ background: "var(--app-surface)", border: "1px solid var(--app-border)" }}>
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-bold text-violet-400">{r.user_email}</p>
                          <p className="text-[10px] opacity-40">{new Date(r.created_date).toLocaleString()}</p>
                        </div>
                        <div className="space-y-1.5">
                          {(q.questions || []).map((question, qi) => {
                            const answer = (r.answers || []).find(a => a.question_id === question.id || a.questionId === question.id) || (r.answers || [])[qi];
                            return (
                              <div key={question.id || qi} className="rounded-lg px-3 py-2" style={{ background: "var(--app-bg)" }}>
                                <p className="text-[10px] font-bold opacity-50 mb-0.5">{question.text}</p>
                                <p className="text-xs font-semibold">{answer?.value ?? <span className="opacity-30">No answer</span>}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function PartnersPanel({ cardStyle, mutedStyle }) {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [linkInput, setLinkInput] = useState("");
  const fileRef = useRef(null);

  useEffect(() => {
    db.entities.PartnerImage.list("order", 50).then(data => {
      setPartners(data);
      setLoading(false);
    });
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    try {
      // 🛡️ Read the file locally into a Base64 string to completely bypass storage bucket CORS
      const reader = new FileReader();
      
      reader.onloadend = async () => {
        try {
          const base64ImageUrl = reader.result;

          // Save the raw data URL directly into your database document entity
          const record = await db.entities.PartnerImage.create({
            image_url: base64ImageUrl, // Stored safely as local data text string
            name: nameInput.trim() || file.name,
            link_url: linkInput.trim() || "",
            order: partners.length,
          });

          setPartners(prev => [...prev, record]);
          setNameInput("");
          setLinkInput("");
          setUploading(false);
          e.target.value = "";
        } catch (innerErr) {
          console.error("Failed to save database partner record:", innerErr);
          setUploading(false);
        }
      };

      reader.onerror = () => {
        console.error("Local file reading failed.");
        setUploading(false);
      };

      reader.readAsDataURL(file);

    } catch (err) {
      console.error("CORS bypass upload wrapper failure:", err);
      setUploading(false);
    }
  };

  const deletePartner = async (id) => {
    await db.entities.PartnerImage.delete(id);
    setPartners(prev => prev.filter(p => p.id !== id));
  };

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-violet-400" /></div>;

  return (
    <div className="space-y-5">
      <div className="rounded-2xl p-6" style={cardStyle}>
        <h2 className="font-black text-lg mb-1 flex items-center gap-2">
          <ImagePlus className="w-5 h-5 text-violet-400" /> Upload Partner Logo
        </h2>
        <p className="text-sm mb-4" style={mutedStyle}>
          Logos appear at 50% opacity at the bottom of every page under "Our Partners".
        </p>
        <div className="space-y-3">
          <input
            value={nameInput}
            onChange={e => setNameInput(e.target.value)}
            placeholder="Partner / company name (optional)"
            className="w-full px-4 py-3 rounded-xl text-sm outline-none"
            style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)", color: "var(--app-text)" }}
          />
          <input
            value={linkInput}
            onChange={e => setLinkInput(e.target.value)}
            placeholder="Link URL when logo clicked (optional, e.g. https://partner.com)"
            className="w-full px-4 py-3 rounded-xl text-sm outline-none"
            style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)", color: "var(--app-text)" }}
          />
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
            {uploading ? "Uploading..." : "Choose Image & Upload"}
          </button>
        </div>
      </div>

      {partners.length === 0 ? (
        <div className="text-center py-12 rounded-2xl" style={cardStyle}>
          <p className="opacity-40 text-sm">No partner logos yet.</p>
        </div>
      ) : (
        <div className="rounded-2xl p-5" style={cardStyle}>
          <h3 className="font-bold text-sm mb-4">Current Partners ({partners.length})</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {partners.map(p => (
              <div key={p.id} className="relative group rounded-xl overflow-hidden border flex flex-col items-center p-4" style={{ borderColor: "var(--app-border)", background: "var(--app-bg)" }}>
                <img src={p.image_url} alt={p.name || "Partner"} className="h-12 object-contain mb-2" style={{ opacity: 0.5 }} />
                {p.name && <p className="text-xs font-semibold text-center truncate w-full">{p.name}</p>}
                {p.link_url && <p className="text-[10px] text-violet-400 truncate w-full text-center">{p.link_url}</p>}
                <button
                  onClick={() => deletePartner(p.id)}
                  className="mt-2 text-xs px-2.5 py-1 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function AIUsagePanel({ cardStyle, mutedStyle }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.entities.AIUsageLog.list("-created_date", 20000).then(data => {
      setLogs(data);
      setLoading(false);
    });
    // Live updates
    const unsub = db.entities.AIUsageLog.subscribe((event) => {
      if (event.type === "create") {
        setLogs(prev => [event.data, ...prev]);
      } else if (event.type === "update") {
        setLogs(prev => prev.map(l => l.id === event.id ? event.data : l));
      } else if (event.type === "delete") {
        setLogs(prev => prev.filter(l => l.id !== event.id));
      }
    });
    return unsub;
  }, []);

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-violet-400" /></div>;

  const lynxTotal = logs.filter(l => l.provider === "lynx").length;
  const geminiTotal = logs.filter(l => l.provider === "gemini").length;
  const cohereTotal = logs.filter(l => l.provider === "cohere").length;
  const claudeTotal = logs.filter(l => l.provider === "claude").length;
  const firebaseTotal = logs.filter(l => l.provider === "firebase").length;
  const openrouterTotal = logs.filter(l => l.provider === "openrouter").length;
  const nvidiaTotal = logs.filter(l => l.provider === "nvidia").length;
  const groqTotal = logs.filter(l => l.provider === "groq").length;
  const total = logs.length;

  const lynxSuccess = logs.filter(l => l.provider === "lynx" && l.success !== false).length;
  const geminiSuccess = logs.filter(l => l.provider === "gemini" && l.success !== false).length;
  const cohereSuccess = logs.filter(l => l.provider === "cohere" && l.success !== false).length;
  const firebaseSuccess = logs.filter(l => l.provider === "firebase" && l.success !== false).length;
  const claudeSuccess = logs.filter(l => l.provider === "claude" && l.success !== false).length;
  const openrouterSuccess = logs.filter(l => l.provider === "openrouter" && l.success !== false).length;
  const nvidiaSuccess = logs.filter(l => l.provider === "nvidia" && l.success !== false).length;
  const groqSuccess = logs.filter(l => l.provider === "groq" && l.success !== false).length;

  // Feature breakdown mapping keys
  const featureCounts = {};
  logs.forEach(l => {
    const k = l.feature || "unknown";
    if (!featureCounts[k]) featureCounts[k] = { lynx: 0, gemini: 0, cohere: 0, claude: 0, firebase: 0, openrouter: 0, nvidia: 0, groq: 0 };
    featureCounts[k][l.provider] = (featureCounts[k][l.provider] || 0) + 1;
  });
  
  const features = Object.entries(featureCounts).sort((a, b) => 
    (b[1].lynx + b[1].gemini + b[1].cohere + b[1].claude + (b[1].firebase || 0) + (b[1].openrouter || 0) + (b[1].nvidia || 0) + (b[1].groq || 0)) - 
    (a[1].lynx + a[1].gemini + a[1].cohere + a[1].claude + (a[1].firebase || 0) + (a[1].openrouter || 0) + (a[1].nvidia || 0) + (a[1].groq || 0))
  );

  // Recent 50 logs
  const recent = logs.slice(0, 50);

  return (
    <div className="space-y-5">
      {/* Totals Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total AI Calls", value: total, color: "text-white", success: null },
          { label: "⚡ Lynx API", value: lynxTotal, color: "text-amber-400", success: lynxSuccess },
          { label: "🔵 Gemini API", value: geminiTotal, color: "text-blue-400", success: geminiSuccess },
          { label: "🟢 Cohere API", value: cohereTotal, color: "text-teal-400", success: cohereSuccess },
          { label: "🟠 Claude API", value: claudeTotal, color: "text-orange-400", success: claudeSuccess },
          { label: "🔥 Firebase AI", value: firebaseTotal, color: "text-violet-400", success: firebaseSuccess },
          { label: "🧠 OpenRouter", value: openrouterTotal, color: "text-pink-400", success: openrouterSuccess },
          { label: "🟩 NVIDIA API", value: nvidiaTotal, color: "text-green-500", success: nvidiaSuccess },
          { label: "🚀 Groq API", value: groqTotal, color: "text-red-400", success: groqSuccess },
        ].map(stat => (
          <div key={stat.label} className="rounded-2xl p-5 text-center" style={cardStyle}>
            <div className={`text-3xl font-black mb-1 ${stat.color}`}>{stat.value}</div>
            <div className="text-xs font-semibold" style={mutedStyle}>{stat.label}</div>
            {stat.success !== null && (
              <div className="text-[10px] mt-1 opacity-40">{stat.success} success</div>
            )}
          </div>
        ))}
      </div>

      {/* Provider split chart */}
      {total > 0 && (
        <div className="rounded-2xl p-5" style={cardStyle}>
          <h3 className="font-bold text-sm mb-3">Provider Split</h3>
          <div className="flex h-6 rounded-full overflow-hidden mb-2">
            <div className="bg-amber-500 transition-all" style={{ width: `${(lynxTotal / total) * 100}%` }} />
            <div className="bg-blue-500 transition-all" style={{ width: `${(geminiTotal / total) * 100}%` }} />
            <div className="bg-teal-500 transition-all" style={{ width: `${(cohereTotal / total) * 100}%` }} />
            <div className="bg-orange-500 transition-all" style={{ width: `${(claudeTotal / total) * 100}%` }} />
            <div className="bg-violet-600 transition-all" style={{ width: `${(firebaseTotal / total) * 100}%` }} />
            <div className="bg-pink-500 transition-all" style={{ width: `${(openrouterTotal / total) * 100}%` }} />
            <div className="bg-green-600 transition-all" style={{ width: `${(nvidiaTotal / total) * 100}%` }} />
            <div className="bg-red-500 transition-all" style={{ width: `${(groqTotal / total) * 100}%` }} />
          </div>
          <div className="flex gap-4 text-xs flex-wrap">
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-500 inline-block" /><span style={mutedStyle}>Lynx {Math.round((lynxTotal / total) * 100)}%</span></div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-blue-500 inline-block" /><span style={mutedStyle}>Gemini {Math.round((geminiTotal / total) * 100)}%</span></div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-teal-500 inline-block" /><span style={mutedStyle}>Cohere {Math.round((cohereTotal / total) * 100)}%</span></div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-orange-500 inline-block" /><span style={mutedStyle}>Claude {Math.round((claudeTotal / total) * 100)}%</span></div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-violet-600 inline-block" /><span style={mutedStyle}>Firebase {Math.round((firebaseTotal / total) * 100)}%</span></div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-pink-500 inline-block" /><span style={mutedStyle}>OpenRouter {Math.round((openrouterTotal / total) * 100)}%</span></div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-green-600 inline-block" /><span style={mutedStyle}>Nvidia {Math.round((nvidiaTotal / total) * 100)}%</span></div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-red-500 inline-block" /><span style={mutedStyle}>Groq {Math.round((groqTotal / total) * 100)}%</span></div>
          </div>
        </div>
      )}

      {/* Feature breakdown list */}
      {features.length > 0 && (
        <div className="rounded-2xl p-5" style={cardStyle}>
          <h3 className="font-bold text-sm mb-3">Usage by Feature</h3>
          <div className="space-y-2">
            {features.map(([feature, counts]) => {
              const ft = (counts.lynx || 0) + (counts.gemini || 0) + (counts.cohere || 0) + (counts.claude || 0) + (counts.firebase || 0) + (counts.openrouter || 0) + (counts.nvidia || 0) + (counts.groq || 0);
              return (
                <div key={feature} className="flex items-center gap-3">
                  <span className="text-xs font-mono w-36 truncate" style={mutedStyle}>{feature}</span>
                  <div className="flex-1 flex h-4 rounded-full overflow-hidden" style={{ background: "var(--app-bg)" }}>
                    {counts.lynx > 0 && <div className="bg-amber-500/80" style={{ width: `${(counts.lynx / ft) * 100}%` }} />}
                    {counts.gemini > 0 && <div className="bg-blue-500/80" style={{ width: `${(counts.gemini / ft) * 100}%` }} />}
                    {counts.cohere > 0 && <div className="bg-teal-500/80" style={{ width: `${(counts.cohere / ft) * 100}%` }} />}
                    {counts.claude > 0 && <div className="bg-orange-500/80" style={{ width: `${(counts.claude / ft) * 100}%` }} />}
                    {counts.firebase > 0 && <div className="bg-violet-600/80" style={{ width: `${(counts.firebase / ft) * 100}%` }} />}
                    {counts.openrouter > 0 && <div className="bg-pink-500/80" style={{ width: `${(counts.openrouter / ft) * 100}%` }} />}
                    {counts.nvidia > 0 && <div className="bg-green-600/80" style={{ width: `${(counts.nvidia / ft) * 100}%` }} />}
                    {counts.groq > 0 && <div className="bg-red-500/80" style={{ width: `${(counts.groq / ft) * 100}%` }} />}
                  </div>
                  <span className="text-xs font-black w-8 text-right">{ft}</span>
                  <span className="text-[10px] opacity-60 w-72 text-right">⚡{counts.lynx || 0} 🔵{counts.gemini || 0} 🟢{counts.cohere || 0} 🟠{counts.claude || 0} 🔥{counts.firebase || 0} 🧠{counts.openrouter || 0} 🟩{counts.nvidia || 0} 🚀{counts.groq || 0}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent logs data row elements */}
      <div className="rounded-2xl overflow-hidden" style={cardStyle}>
        <div className="px-5 py-3 border-b font-bold text-sm" style={{ borderColor: "var(--app-border)" }}>
          Recent AI Calls (last 50)
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--app-border)" }}>
              {["Time", "User", "Feature", "Provider", "Status"].map(h => (
                <th key={h} className="text-left px-4 py-2 font-bold" style={mutedStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recent.map(log => (
              <tr key={log.id} style={{ borderBottom: "1px solid var(--app-border)" }}>
                <td className="px-4 py-2" style={mutedStyle}>{new Date(log.created_date).toLocaleTimeString()}</td>
                <td className="px-4 py-2 truncate max-w-[120px]" style={mutedStyle}>{log.user_email?.split("@")[0] || "—"}</td>
                <td className="px-4 py-2 font-mono">{log.feature || "—"}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-0.5 rounded-lg font-bold ${
                    log.provider === "lynx" ? "bg-amber-500/15 text-amber-400" : 
                    log.provider === "gemini" ? "bg-blue-500/15 text-blue-400" : 
                    log.provider === "cohere" ? "bg-teal-500/15 text-teal-400" : 
                    log.provider === "claude" ? "bg-orange-500/15 text-orange-400" : 
                    log.provider === "openrouter" ? "bg-pink-500/15 text-pink-400" : 
                    log.provider === "nvidia" ? "bg-green-500/15 text-green-400" : 
                    log.provider === "groq" ? "bg-red-500/15 text-red-400" :
                    "bg-violet-500/15 text-violet-400"
                  }`}>
                    {log.provider === "lynx" ? "⚡ Lynx" : 
                     log.provider === "gemini" ? "🔵 Gemini" : 
                     log.provider === "cohere" ? "🟢 Cohere" : 
                     log.provider === "claude" ? "🟠 Claude" : 
                     log.provider === "openrouter" ? "🧠 OpenRouter" : 
                     log.provider === "nvidia" ? "🟩 Nvidia" : 
                     log.provider === "groq" ? "🚀 Groq" :
                     "🔥 Firebase"}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <span className={log.success === false ? "text-red-400" : "text-emerald-400"}>
                    {log.success === false ? "✗ fail" : "✓ ok"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PinGate({ onUnlock }) {
  const [pin, setPin] = useState(["", "", "", "", ""]);
  const [error, setError] = useState(false);
  const refs = [useRef(), useRef(), useRef(), useRef(), useRef()];

  const handleChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...pin];
    next[i] = val;
    setPin(next);
    setError(false);
    if (val && i < 4) refs[i + 1].current?.focus();
    if (next.every(d => d !== "") && next.join("").length === 5) {
    if (checkDevPin(next.join(""))) {
        onUnlock();
      } else {
        setError(true);
        setPin(["", "", "", "", ""]);
        refs[0].current?.focus();
      }
    }
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !pin[i] && i > 0) refs[i - 1].current?.focus();
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--app-bg)", color: "var(--app-text)" }}>
      <div className="text-center max-w-xs w-full px-6">
        <div className="w-14 h-14 rounded-2xl bg-violet-500/15 flex items-center justify-center mx-auto mb-5">
          <Lock className="w-7 h-7 text-violet-400" />
        </div>
        <h1 className="text-xl font-black mb-2">Developer Dashboard</h1>
        <p className="text-sm mb-6 opacity-50">Enter your 5-digit PIN to continue</p>
        <div className="flex items-center justify-center gap-3 mb-4">
          {pin.map((d, i) => (
            <input
              key={i}
              ref={refs[i]}
              type="password"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              className={`w-12 h-14 text-center text-xl font-black rounded-2xl outline-none transition-all ${error ? "border-red-500 bg-red-500/10" : "border-violet-500/30 focus:border-violet-500"}`}
              style={{ background: "var(--app-surface)", border: `2px solid ${error ? "rgba(239,68,68,0.5)" : "var(--app-border)"}`, color: "var(--app-text)" }}
              autoFocus={i === 0}
            />
          ))}
        </div>
        {error && <p className="text-sm text-red-400 font-semibold">Incorrect PIN. Try again.</p>}
      </div>
    </div>
  );
}

function ClassroomPanel({ cardStyle, mutedStyle }) {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // class id being edited
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    db.entities.ClassroomClass.list("-created_date", 200).then(data => {
      setClasses(data);
      setLoading(false);
    });
  }, []);

  const startEdit = (cls) => {
    setEditing(cls.id);
    setEditData({ name: cls.name, teacher_email: cls.teacher_email, teacher_name: cls.teacher_name || "", subject: cls.subject || "" });
  };

  const saveEdit = async (cls) => {
    setSaving(true);
    const updated = await db.entities.ClassroomClass.update(cls.id, editData);
    setClasses(prev => prev.map(c => c.id === cls.id ? updated : c));
    setEditing(null);
    setSaving(false);
  };

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-violet-400" /></div>;

  return (
    <div className="space-y-4">
      <p className="text-sm" style={mutedStyle}>{classes.length} classes total</p>
      {classes.length === 0 && (
        <div className="text-center py-16 rounded-2xl" style={cardStyle}>
          <GraduationCap className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-bold mb-1">No classrooms yet</p>
        </div>
      )}
      {classes.map(cls => (
        <div key={cls.id} className="rounded-2xl p-5" style={cardStyle}>
          {editing === cls.id ? (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold opacity-50 block mb-1">Class Name</label>
                <input value={editData.name} onChange={e => setEditData(d => ({ ...d, name: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl text-sm outline-none"
                  style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)", color: "var(--app-text)" }} />
              </div>
              <div>
                <label className="text-xs font-bold opacity-50 block mb-1">Teacher Email</label>
                <input value={editData.teacher_email} onChange={e => setEditData(d => ({ ...d, teacher_email: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl text-sm outline-none"
                  style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)", color: "var(--app-text)" }} />
              </div>
              <div>
                <label className="text-xs font-bold opacity-50 block mb-1">Teacher Name</label>
                <input value={editData.teacher_name} onChange={e => setEditData(d => ({ ...d, teacher_name: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl text-sm outline-none"
                  style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)", color: "var(--app-text)" }} />
              </div>
              <div>
                <label className="text-xs font-bold opacity-50 block mb-1">Subject</label>
                <input value={editData.subject} onChange={e => setEditData(d => ({ ...d, subject: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl text-sm outline-none"
                  style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)", color: "var(--app-text)" }} />
              </div>
              <div className="flex gap-2">
                <button onClick={() => saveEdit(cls)} disabled={saving}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-violet-600 text-white hover:bg-violet-500 disabled:opacity-40 transition-all">
                  {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />} Save
                </button>
                <button onClick={() => setEditing(null)} className="px-3 py-2 rounded-xl text-xs font-semibold opacity-60 hover:opacity-100 transition-all" style={{ border: "1px solid var(--app-border)" }}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-black text-base">{cls.name}</p>
                <p className="text-xs mt-0.5" style={mutedStyle}>Teacher: {cls.teacher_email}</p>
                {cls.subject && <p className="text-xs" style={mutedStyle}>Subject: {cls.subject}</p>}
                <p className="text-xs mt-1" style={mutedStyle}>{(cls.student_emails || []).length} students · Code: {cls.join_code}</p>
              </div>
              <button onClick={() => startEdit(cls)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 transition-all shrink-0">
                <Pencil className="w-3 h-3" /> Edit
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function PartnershipPanel({ cardStyle, mutedStyle }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    db.entities.PartnershipRequest.list("-created_date", 100).then(data => {
      setRequests(data);
      setLoading(false);
    });
  }, []);

  const setStatus = async (id, status) => {
    setUpdating(id);
    const updated = await db.entities.PartnershipRequest.update(id, { status });
    setRequests(prev => prev.map(r => r.id === id ? updated : r));
    setUpdating(null);
  };

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-violet-400" /></div>;

  const statusColor = {
    pending: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    approved: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    rejected: "text-red-400 bg-red-500/10 border-red-500/20",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-bold">Partnership Requests ({requests.length})</p>
        <div className="flex gap-3 text-xs" style={mutedStyle}>
          <span>⏳ {requests.filter(r => r.status === "pending").length} pending</span>
          <span>✅ {requests.filter(r => r.status === "approved").length} approved</span>
        </div>
      </div>
      {requests.length === 0 && (
        <div className="text-center py-16 rounded-2xl" style={cardStyle}>
          <Handshake className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-bold mb-1">No partnership requests yet</p>
          <p className="text-sm" style={mutedStyle}>Requests submitted via the Partnership page will appear here.</p>
        </div>
      )}
      {requests.map(r => (
        <div key={r.id} className="rounded-2xl p-5" style={cardStyle}>
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <p className="font-black text-base">{r.company_name}</p>
              <p className="text-xs mt-0.5" style={mutedStyle}>{r.contact_email} · {new Date(r.created_date).toLocaleDateString()}</p>
            </div>
            <span className={`px-2.5 py-1 rounded-xl text-xs font-bold border ${statusColor[r.status] || ""}`}>{r.status}</span>
          </div>
          {r.proof && (
            <div className="mb-2 text-sm">
              <span className="text-xs font-bold opacity-50">Proof: </span>
              <a href={r.proof.startsWith("http") ? r.proof : `https://${r.proof}`} target="_blank" rel="noopener noreferrer" className="text-violet-400 underline text-xs">{r.proof}</a>
            </div>
          )}
          {r.message && (
            <div className="mb-4 text-sm">
              <span className="text-xs font-bold opacity-50">Message: </span>
              <p className="text-xs mt-1" style={mutedStyle}>{r.message}</p>
            </div>
          )}
          <div className="flex gap-2">
            {r.status === "pending" && (
              <>
                <button onClick={() => setStatus(r.id, "approved")} disabled={updating === r.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 disabled:opacity-40 transition-all">
                  {updating === r.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />} Approve
                </button>
                <button onClick={() => setStatus(r.id, "rejected")} disabled={updating === r.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 disabled:opacity-40 transition-all">
                  {updating === r.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Ban className="w-3 h-3" />} Reject
                </button>
              </>
            )}
            {r.status !== "pending" && (
              <button onClick={() => setStatus(r.id, "pending")} disabled={updating === r.id}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 disabled:opacity-40 transition-all">
                {updating === r.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <X className="w-3 h-3" />} Reset to Pending
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function DevDashboard() {
  const [user, setUser] = useState(null);
  const [pinUnlocked, setPinUnlocked] = useState(false);
  const [tab, setTab] = useState("overview");
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const initialLoadRef = useRef(false);

  const bgStyle = { background: "var(--app-bg)", color: "var(--app-text)" };
  const cardStyle = { background: "var(--app-surface)", border: "1px solid var(--app-border)" };
  const mutedStyle = { color: "var(--app-text-muted)" };

  // Browser notification for pending actions
  const notifCheckRef = useRef(false);
  const requestAndNotify = async (pendingApps, pendingSuspensions) => {
    if (!("Notification" in window)) return;
    if (Notification.permission === "default") await Notification.requestPermission();
    if (Notification.permission !== "granted") return;
    if (pendingApps > 0) {
      new Notification("Cognita Dev — Action Required", {
        body: `${pendingApps} pending course application${pendingApps > 1 ? "s" : ""} awaiting review.`,
        icon: "/favicon.ico",
      });
    }
    if (pendingSuspensions > 0) {
      new Notification("Cognita Dev — Moderation", {
        body: `${pendingSuspensions} suspended user${pendingSuspensions > 1 ? "s" : ""} awaiting review.`,
        icon: "/favicon.ico",
      });
    }
  };

  useEffect(() => {
    // 1. StrictMode / Fast-refresh structural guard to prevent double-firing queries
    if (initialLoadRef.current) return;
    initialLoadRef.current = true;

    let isMounted = true;

    db.auth.me().then(async (me) => {
      if (!isMounted) return;
      setUser(me);
      
      // Authorization Check: Bails out early if the logged-in email is not allowed
      if (!me || !DEV_EMAILS.includes(me.email)) { 
        setLoading(false); 
        return; 
      }

      // 🛡️ SELF-HEALING GUARD: Verify the logged-in admin's own profile document exists
      try {
        const myProfile = await db.entities.User.get(me.id || me.uid);
        if (!myProfile) {
          console.warn("⚠️ Admin authenticated but profile document was missing! Auto-generating entry.");
          const baseName = (me.email || "Admin").split('@')[0];
          const formattedName = baseName.charAt(0).toUpperCase() + baseName.slice(1);
          
          await db.entities.User.create({
            id: me.id || me.uid,
            email: me.email,
            full_name: formattedName,
            role: 'admin',
            is_public: true,
            bio: 'Profile automatically recovered during dashboard load.',
            created_date: new Date().toISOString(),
            updated_date: new Date().toISOString()
          });
        }
      } catch (err) {
        console.error("Self-healing check failed on initialization:", err);
      }

      try {
        // Parallel Batch Fetch 1
        const [feedback, sessions, decks, users, ratings] = await Promise.all([
          db.entities.Feedback.list("-created_date", 2000).catch(() => []),
          db.entities.StudySession.list("-created_date", 20000).catch(() => []),
          db.entities.Deck.list("-updated_date", 20000).catch(() => []),
          db.entities.User.list("-created_date", 20000).catch(() => []), // <-- Safely reads the user directory
          db.entities.DeckRating.list("-created_date", 5000).catch(() => []),
        ]);

        // Parallel Batch Fetch 2
        const [suspensions, apps, friendships, apSessions, loginEvents, verifyRequests] = await Promise.all([
          db.entities.SuspendedUser.list("-created_date", 2000).catch(() => []),
          db.entities.CourseApplication.list("-created_date", 1000).catch(() => []),
          db.entities.Friendship.list("-created_date", 5000).catch(() => []),
          db.entities.APSession.list("-created_date", 5000).catch(() => []),
          db.entities.UserLoginEvent.list("-created_date", 10000).catch(() => []),
          db.entities.PendingApproval.list("-created_date", 2000).catch(() => []),
        ]);

        // Only apply state updates if the user hasn't already closed or switched tabs
        if (isMounted) {
          setData({ feedback, sessions, decks, users, ratings, suspensions, apps, friendships, apSessions, loginEvents, verifyRequests });
          setLoading(false);

          // Send browser system notifications for pending actions (runs once per session)
          if (!notifCheckRef.current) {
            notifCheckRef.current = true;
            const pendingApps = (apps || []).filter(a => a.status === "pending").length;
            const pendingSus = (suspensions || []).filter(s => s.status === "suspended").length;
            if (pendingApps > 0 || pendingSus > 0) requestAndNotify(pendingApps, pendingSus);
          }
        }
      } catch (error) {
        console.error("Dashboard parallel read failure:", error);
        if (isMounted) setLoading(false);
      }
    });

    // Cleanup block handles unmounting instances gracefully
    return () => {
      isMounted = false;
    };
  }, []); // Keep explicitly tied to mount lifecycle

  if (loading) return <div className="min-h-screen flex items-center justify-center" style={bgStyle}><Loader2 className="w-8 h-8 text-violet-500 animate-spin" /></div>;

  if (!user || !DEV_EMAILS.includes(user.email)) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={bgStyle}>
        <div className="text-center">
          <Shield className="w-12 h-12 mx-auto mb-4 text-red-400" />
          <h1 className="text-xl font-black mb-2">Access Denied</h1>
          <p style={mutedStyle}>This page is restricted to developers only.</p>
        </div>
      </div>
    );
  }

  if (!pinUnlocked) {
    return <PinGate onUnlock={() => setPinUnlocked(true)} />;
  }

  const { feedback = [], sessions = [], decks = [], users = [], ratings = [], suspensions = [], apps = [], friendships = [], apSessions = [], loginEvents = [], verifyRequests = [] } = data;
  const pendingSuspensions = suspensions.filter(s => s.status === "suspended");
  const pendingApps = apps.filter(a => a.status === "pending");
  const totalMinutes = sessions.reduce((s, ss) => s + (ss.duration_minutes || 0), 0);
  const totalCards = sessions.reduce((s, ss) => s + (ss.cards_reviewed || 0), 0);
  const publicDecks = decks.filter(d => d.is_public);
  const avgRating = ratings.length > 0 ? (ratings.reduce((s, r) => s + r.rating, 0) / ratings.length).toFixed(1) : "N/A";

  const tabs = [
    { id: "overview", label: "📊 Overview" },
    { id: "analytics", label: "📈 Analytics" },
    { id: "vercel-analytics", label: "🔺 Vercel Analytics" },
    { id: "usage", label: "⚡ Usage & AI" },
    { id: "feedback", label: "💬 Feedback" },
    { id: "users", label: `👤 Users (${users.length})` },
    { id: "ban", label: "🚫 Direct Ban" },
    { id: "friendships", label: "❤️ Friendships" },
    { id: "decks", label: "📚 Decks" },
    { id: "verify_requests", label: `🛡️ Verify Requests${data.verifyRequests?.filter(r => r.status === "pending").length > 0 ? ` (${data.verifyRequests.filter(r => r.status === "pending").length})` : ""}` },
    { id: "timespent", label: "🕐 Time Spent" },
    { id: "sessions", label: "⏱️ Sessions" },
    { id: "moderation", label: `🚨 Moderation & Announce${pendingSuspensions.length > 0 ? ` (${pendingSuspensions.length})` : ""}` },
    { id: "backup", label: "🛡️ Backup" },
    { id: "questionnaires", label: "❓ Questionnaires" },
    { id: "applications", label: `📝 Course Apps${pendingApps.length > 0 ? ` (${pendingApps.length})` : ""}` },
    { id: "partnerships", label: "🤝 Partnerships" },
    { id: "classrooms", label: "🎓 Classrooms" },
    { id: "partners", label: "🖼️ Our Partners" },
    { id: "lynx", label: "⚡ Lynx API" },
    { id: "export", label: "📦 Export / GitHub" },
  ];

  return (
    <div className="min-h-screen pb-20" style={bgStyle}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-violet-500/15 flex items-center justify-center">
            <Shield className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black">Developer Dashboard</h1>
            <p className="text-xs" style={mutedStyle}>Internal admin view — {user.email}</p>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap mb-6">
          {tabs.map(tb => (
            <button key={tb.id} onClick={() => setTab(tb.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${tab === tb.id ? "bg-violet-500 text-white" : "opacity-60 hover:opacity-90"}`}
              style={tab !== tb.id ? { background: "var(--app-surface)", border: "1px solid var(--app-border)" } : {}}>
              {tb.label}
            </button>
          ))}
        </div>

        {tab === "overview" && (() => {
          // Build daily activity data for last 14 days
          const today = new Date();
          const dailyData = Array.from({ length: 14 }, (_, i) => {
            const d = new Date(today);
            d.setDate(d.getDate() - (13 - i));
            const key = d.toISOString().slice(0, 10);
            const daySessions = sessions.filter(s => s.created_date?.slice(0, 10) === key);
            const uniqueUsers = new Set(daySessions.map(s => s.user_email || s.created_by)).size;
            return {
              date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
              sessions: daySessions.length,
              users: uniqueUsers,
              minutes: Math.round(daySessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0)),
            };
          });

          return (
            <div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {[
                  { label: "Total Users", value: users.length, icon: "👤" },
                  { label: "Total Decks", value: decks.length, icon: "📚" },
                  { label: "Study Sessions", value: sessions.length.toLocaleString(), icon: "⏱️" },
                  { label: "Feedback Items", value: feedback.length, icon: "💬" },
                  { label: "Minutes Studied", value: totalMinutes.toLocaleString(), icon: "⏰" },
                  { label: "Cards Reviewed", value: totalCards.toLocaleString(), icon: "🃏" },
                  { label: "Public Decks", value: publicDecks.length, icon: "🌐" },
                  { label: "Avg Rating", value: avgRating, icon: "⭐" },
                ].map(stat => (
                  <div key={stat.label} className="rounded-2xl p-4" style={cardStyle}>
                    <div className="text-2xl mb-1">{stat.icon}</div>
                    <div className="text-xl font-black">{stat.value}</div>
                    <div className="text-xs" style={mutedStyle}>{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Activity Graph */}
              <div className="rounded-2xl p-5 mb-5" style={cardStyle}>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4 text-violet-400" />
                  <h2 className="font-bold text-sm">User Activity Trends (Last 14 Days)</h2>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={dailyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: "var(--app-text-muted)" }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "var(--app-text-muted)" }} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{ background: "var(--app-surface)", border: "1px solid var(--app-border)", borderRadius: 12, fontSize: 12 }}
                      labelStyle={{ color: "var(--app-text)", fontWeight: "bold" }}
                    />
                    <Bar dataKey="sessions" name="Sessions" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="users" name="Active Users" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1.5 text-xs"><span className="w-3 h-3 rounded bg-violet-500 shrink-0" /><span style={mutedStyle}>Sessions</span></div>
                  <div className="flex items-center gap-1.5 text-xs"><span className="w-3 h-3 rounded bg-cyan-500 shrink-0" /><span style={mutedStyle}>Active Users</span></div>
                </div>
              </div>

              <div className="rounded-2xl p-5" style={cardStyle}>
                <h2 className="font-bold text-sm mb-3">📈 Recent Study Activity (last 20 sessions)</h2>
                <div className="space-y-2">
                  {sessions.slice(0, 20).map(s => (
                    <div key={s.id} className="flex items-center gap-3 text-xs">
                      <span style={mutedStyle}>{new Date(s.created_date).toLocaleDateString()}</span>
                      <span className="flex-1 truncate font-medium">{s.user_email || s.created_by || "unknown"}</span>
                      <span className="text-violet-400">{s.session_type || "flashcards"}</span>
                      <span className="font-bold">{s.duration_minutes || 0}m</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}

        {tab === "analytics" && (() => {
          const today = new Date();
          const last30 = Array.from({ length: 30 }, (_, i) => {
            const d = new Date(today);
            d.setDate(d.getDate() - (29 - i));
            const key = d.toISOString().slice(0, 10);
            const dayLogins = loginEvents.filter(e => e.created_date?.slice(0, 10) === key);
            const daySessions = sessions.filter(s => s.created_date?.slice(0, 10) === key && s.session_type !== "browsing");
            const dayCards = daySessions.reduce((sum, s) => sum + (s.cards_reviewed || 0), 0);
            const dayMinutes = daySessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0);
            return {
              date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
              logins: dayLogins.length,
              sessions: daySessions.length,
              cards: dayCards,
              minutes: dayMinutes,
            };
          });

          // Session type breakdown
          const sessionTypeCounts = {};
          sessions.forEach(s => {
            const t2 = s.session_type || "flashcards";
            sessionTypeCounts[t2] = (sessionTypeCounts[t2] || 0) + 1;
          });
          const sessionTypePie = Object.entries(sessionTypeCounts).map(([name, value]) => ({ name, value }));
          const PIE_COLORS = ["#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"];

          // Login platform breakdown
          const platformCounts = {};
          loginEvents.forEach(e => {
            const p = e.platform || "desktop";
            platformCounts[p] = (platformCounts[p] || 0) + 1;
          });
          const platformPie = Object.entries(platformCounts).map(([name, value]) => ({ name, value }));

          // Top users by login count
          const loginsByUser = {};
          loginEvents.forEach(e => { loginsByUser[e.user_email] = (loginsByUser[e.user_email] || 0) + 1; });
          const topLoginUsers = Object.entries(loginsByUser).sort((a, b) => b[1] - a[1]).slice(0, 10);

          // Top users by study time
          const minutesByUser = {};
          sessions.filter(s => s.session_type !== "browsing").forEach(s => {
            const email = s.user_email || s.created_by || "unknown";
            minutesByUser[email] = (minutesByUser[email] || 0) + (s.duration_minutes || 0);
          });
          const topStudyUsers = Object.entries(minutesByUser).sort((a, b) => b[1] - a[1]).slice(0, 10)
            .map(([email, minutes]) => ({ email: email.split("@")[0], minutes }));

          // Cards reviewed per day (last 14 days)
          const last14 = last30.slice(16);

          return (
            <div className="space-y-6">
              {/* Summary stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Total Logins", value: loginEvents.length.toLocaleString(), icon: "🔑", color: "text-violet-400" },
                  { label: "Unique Logins (30d)", value: new Set(loginEvents.filter(e => { const d = new Date(e.created_date); return (today - d) / 86400000 <= 30; }).map(e => e.user_email)).size, icon: "👥", color: "text-blue-400" },
                  { label: "Avg Logins/User", value: users.length > 0 ? (loginEvents.length / users.length).toFixed(1) : "—", icon: "📊", color: "text-emerald-400" },
                  { label: "Total Study Min", value: sessions.filter(s => s.session_type !== "browsing").reduce((s, ss) => s + (ss.duration_minutes || 0), 0).toLocaleString(), icon: "⏱️", color: "text-amber-400" },
                ].map(stat => (
                  <div key={stat.label} className="rounded-2xl p-4" style={cardStyle}>
                    <div className="text-xl mb-1">{stat.icon}</div>
                    <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
                    <div className="text-xs mt-0.5" style={mutedStyle}>{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Daily Logins — 30 days */}
              <div className="rounded-2xl p-5" style={cardStyle}>
                <h2 className="font-bold text-sm mb-4 flex items-center gap-2">🔑 Daily Logins (Last 30 Days)</h2>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={last30} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" tick={{ fontSize: 9, fill: "var(--app-text-muted)" }} tickLine={false} axisLine={false} interval={4} />
                    <YAxis tick={{ fontSize: 10, fill: "var(--app-text-muted)" }} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background: "var(--app-surface)", border: "1px solid var(--app-border)", borderRadius: 12, fontSize: 12 }} labelStyle={{ color: "var(--app-text)", fontWeight: "bold" }} />
                    <Bar dataKey="logins" name="Logins" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Daily Cards Reviewed — 14 days */}
              <div className="rounded-2xl p-5" style={cardStyle}>
                <h2 className="font-bold text-sm mb-4 flex items-center gap-2">🃏 Daily Cards Reviewed (Last 14 Days)</h2>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={last14} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" tick={{ fontSize: 9, fill: "var(--app-text-muted)" }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "var(--app-text-muted)" }} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background: "var(--app-surface)", border: "1px solid var(--app-border)", borderRadius: 12, fontSize: 12 }} labelStyle={{ color: "var(--app-text)", fontWeight: "bold" }} />
                    <Line type="monotone" dataKey="cards" name="Cards" stroke="#06b6d4" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="minutes" name="Minutes" stroke="#10b981" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
                <div className="flex gap-4 mt-2">
                  <div className="flex items-center gap-1.5 text-xs"><span className="w-3 h-0.5 bg-cyan-500 inline-block" /><span style={mutedStyle}>Cards</span></div>
                  <div className="flex items-center gap-1.5 text-xs"><span className="w-3 h-0.5 bg-emerald-500 inline-block" /><span style={mutedStyle}>Minutes</span></div>
                </div>
              </div>

              {/* Pie charts row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl p-5" style={cardStyle}>
                  <h2 className="font-bold text-sm mb-4">📚 Session Types</h2>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie data={sessionTypePie} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                        {sessionTypePie.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: "var(--app-surface)", border: "1px solid var(--app-border)", borderRadius: 12, fontSize: 12 }} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="rounded-2xl p-5" style={cardStyle}>
                  <h2 className="font-bold text-sm mb-4">📱 Login Platform</h2>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie data={platformPie} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                        {platformPie.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: "var(--app-surface)", border: "1px solid var(--app-border)", borderRadius: 12, fontSize: 12 }} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Top users by study time */}
              <div className="rounded-2xl p-5" style={cardStyle}>
                <h2 className="font-bold text-sm mb-3">⏱️ Top 10 Users by Study Time</h2>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={topStudyUsers} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 10, fill: "var(--app-text-muted)" }} tickLine={false} axisLine={false} />
                    <YAxis type="category" dataKey="email" tick={{ fontSize: 10, fill: "var(--app-text-muted)" }} tickLine={false} axisLine={false} width={90} />
                    <Tooltip contentStyle={{ background: "var(--app-surface)", border: "1px solid var(--app-border)", borderRadius: 12, fontSize: 12 }} formatter={(v) => [`${v} min`, "Study time"]} />
                    <Bar dataKey="minutes" name="Minutes" fill="#10b981" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Top users by login count */}
              <div className="rounded-2xl p-5" style={cardStyle}>
                <h2 className="font-bold text-sm mb-3">🔑 Top 10 Users by Login Count</h2>
                <div className="space-y-2">
                  {topLoginUsers.map(([email, count], i) => (
                    <div key={email} className="flex items-center gap-3">
                      <span className="text-xs font-black w-5 text-right opacity-40">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium truncate">{email}</span>
                          <span className="text-xs font-black text-violet-400 shrink-0 ml-2">{count}</span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--app-bg)" }}>
                          <div className="h-full rounded-full bg-violet-500" style={{ width: `${(count / topLoginUsers[0][1]) * 100}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}

        {tab === "usage" && (
          <div className="space-y-8">
            <UsageTab users={users} apSessions={apSessions} sessions={sessions} cardStyle={cardStyle} mutedStyle={mutedStyle} onRefresh={async () => {
              const [freshUsers, freshAp] = await Promise.all([
                db.entities.User.list("-created_date", 1000),
                db.entities.APSession.list("-created_date", 500),
              ]);
              setData(d => ({ ...d, users: freshUsers, apSessions: freshAp }));
            }} />
            <div>
              <h2 className="font-black text-base mb-4 flex items-center gap-2">🤖 AI Provider Usage</h2>
              <AIUsagePanel cardStyle={cardStyle} mutedStyle={mutedStyle} />
            </div>
          </div>
        )}

        {tab === "vercel-analytics" && (
          <div 
            className="rounded-2xl p-8 text-center flex flex-col items-center justify-center border h-[50vh]" 
            style={{ ...cardStyle, borderColor: 'var(--app-border)' }}
          >
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-xl mb-4">
              🔺
            </div>
            <h3 className="text-sm font-bold text-zinc-100 mb-2">Vercel Analytics Console</h3>
            <p className="text-xs max-w-sm mb-6" style={mutedStyle}>
              Vercel security parameters prevent embedding the live admin console directly. Click below to launch your analytics stream in a secure window.
            </p>
            <a
              href="https://vercel.com/yohanyinyuchang-4896s-projects/cognitastudyfirebase/analytics"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-white text-black hover:bg-zinc-200 text-xs font-bold rounded-xl transition-all inline-flex items-center gap-2"
            >
              Launch Dashboard ↗
            </a>
          </div>
        )}

        {tab === "feedback" && (
          <div className="space-y-4">
            {(feedback || []).slice(0, 100).map(f => (
              <div key={f.id || f.created_date || Math.random()} className="rounded-2xl p-4 space-y-2 text-xs border" style={{ ...cardStyle, borderColor: 'var(--app-border)' }}>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-400">{f.user_email || f.email || "Anonymous User"}</span>
                  <span style={mutedStyle}>
                    {f.created_date ? new Date(f.created_date).toLocaleDateString() : "—"}
                  </span>
                </div>
                <p className="text-zinc-200 bg-black/10 p-2.5 rounded-xl border border-zinc-800/40 whitespace-pre-wrap">{f.content || f.message || "No content provided."}</p>
                {f.category && (
                  <span className="inline-block px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-400 font-mono text-[10px]">
                    {f.category}
                  </span>
                )}
              </div>
            ))}
            {feedback.length === 0 && (
              <p className="text-center py-6" style={mutedStyle}>No feedback submissions found.</p>
            )}
          </div>
        )}

        {tab === "users" && (
          <div className="space-y-2">
            {/* FIXED: Reading from the dynamic state tracker variable if 'users' comes from 'data.users' */}
            {(users || []).map(u => {
              // Safe fallback computation for the text avatar letter icon
              const userString = u.full_name || u.email || "U";
              const initialLetter = userString[0]?.toUpperCase() || "U";
              
              return (
                <div key={u.id || u.email || Math.random()} className="rounded-2xl px-4 py-3 flex items-center gap-3" style={cardStyle}>
                  
                  {/* Profile Picture Frame */}
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600/30 to-blue-600/30 flex items-center justify-center text-sm font-bold shrink-0 overflow-hidden">
                    {u.profile_picture_url
                      ? <img src={u.profile_picture_url} alt="" className="w-full h-full object-cover" />
                      : initialLetter}
                  </div>

                  {/* User Account Info Segment */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">{u.display_name || u.full_name || u.email?.split('@')[0] || "—"}</p>
                    <p className="text-xs truncate" style={mutedStyle}>{u.email || "No email uploaded"}</p>
                    {u.bio && <p className="text-xs truncate opacity-40">{u.bio}</p>}
                  </div>

                  {/* Action Controls Column */}
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Public / Private Badge */}
                    <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${u.is_public ? "bg-emerald-500/15 text-emerald-400" : "bg-white/[0.04] text-slate-400"}`}>
                      {u.is_public ? "public" : "private"}
                    </span>
                    
                    {/* Account Role Badge */}
                    <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${u.role === "admin" ? "bg-violet-500/20 text-violet-400" : "bg-blue-500/10 text-blue-400"}`}>
                      {u.role || "user"}
                    </span>

                    {/* Moderate Profile Picture Action Button */}
                    {u.profile_picture_url && (
                      <button
                        onClick={async () => {
                          if (window.confirm(`Remove profile picture for ${u.email || 'this user'}?`)) {
                            await db.entities.User.update(u.id, { profile_picture_url: null });
                            // Assures your state container handles the collection updates cleanly
                            if (typeof setData === "function") {
                              setData(d => {
                                const baseList = d.users || (Array.isArray(d) ? d : []);
                                const updatedList = baseList.map(x => x.id === u.id ? { ...x, profile_picture_url: null } : x);
                                return d.users ? { ...d, users: updatedList } : updatedList;
                              });
                            }
                          }
                        }}
                        className="text-xs px-2 py-1 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all font-semibold"
                        title="Remove profile picture"
                      >
                        🚫 Pic
                      </button>
                    )}

                    {/* Toggle Public / Private Overrides (Shows lock control option for all visibility modes) */}
                    <button
                      onClick={async () => {
                        const targetPublicState = !u.is_public;
                        await db.entities.User.update(u.id, { is_public: targetPublicState });
                        if (typeof setData === "function") {
                          setData(d => {
                            const baseList = d.users || (Array.isArray(d) ? d : []);
                            const updatedList = baseList.map(x => x.id === u.id ? { ...x, is_public: targetPublicState } : x);
                            return d.users ? { ...d, users: updatedList } : updatedList;
                          });
                        }
                      }}
                      className={`text-xs px-2 py-1 rounded-lg transition-all font-semibold ${
                        u.is_public 
                          ? "bg-amber-500/10 text-amber-400 hover:bg-amber-500/20" 
                          : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                      }`}
                      title={u.is_public ? "Make profile private" : "Make profile public"}
                    >
                      {u.is_public ? "🔒 Hide" : "🔓 Expose"}
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {tab === "decks" && (
          <div className="space-y-2">
            {(decks || []).slice(0, 100).map(d => (
              <div key={d.id || d.title || Math.random()} className="flex items-center gap-3 px-4 py-3 rounded-2xl" style={cardStyle}>
                <div className="w-4 h-4 rounded shrink-0" style={{ background: d.color || "#4F46E5" }} />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-bold truncate">{d.title || "Untitled Deck"}</p>
                    {d.is_verified && <VerifiedBadge size={13} />}
                  </div>
                  <p className="text-xs truncate" style={mutedStyle}>
                    {d.author_email || d.created_by || "System"} · {d.subject || "—"}
                  </p>
                </div>
                
                <span className="text-xs font-bold shrink-0">{d.card_count || 0} cards</span>
                {d.is_public && <span className="text-xs px-2 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-400 shrink-0">public</span>}
                
                <button
                  onClick={async () => {
                    const newVal = !d.is_verified;
                    const currentAdminEmail = user?.email || "admin";
                    await db.entities.Deck.update(d.id, { is_verified: newVal, verified_by: newVal ? currentAdminEmail : null });
                    
                    if (typeof setData === "function") {
                      setData(prev => {
                        const baseList = prev?.decks || (Array.isArray(prev) ? prev : []);
                        const updatedList = baseList.map(x => x.id === d.id ? { ...x, is_verified: newVal, verified_by: newVal ? currentAdminEmail : null } : x);
                        return prev?.decks ? { ...prev, decks: updatedList } : updatedList;
                      });
                    }
                  }}
                  className={`text-xs px-2 py-1 rounded-lg font-bold transition-all shrink-0 ${d.is_verified ? "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30" : "bg-white/5 opacity-40 hover:opacity-80"}`}
                  title={d.is_verified ? "Remove verified badge" : "Mark as verified"}
                >
                  {d.is_verified ? "✓ Verified" : "Verify"}
                </button>
              </div>
            ))}
            {(decks || []).length === 0 && (
              <p className="text-center py-6 text-xs" style={mutedStyle}>No flashcard decks found.</p>
            )}
          </div>
        )}

        {tab === "ban" && (
          <DirectBanPanel users={users} suspensions={suspensions} onBanAdded={(s) => setData(d => ({ ...d, suspensions: d.suspensions.some(x => x.id === s.id) ? d.suspensions.map(x => x.id === s.id ? s : x) : [...d.suspensions, s] }))} cardStyle={cardStyle} mutedStyle={mutedStyle} />
        )}

        {tab === "friendships" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-bold">All Friendships ({friendships.length})</p>
              <div className="flex gap-3 text-xs" style={mutedStyle}>
                <span>✅ {friendships.filter(f => f.status === "accepted").length} accepted</span>
                <span>⏳ {friendships.filter(f => f.status === "pending").length} pending</span>
                <span>❌ {friendships.filter(f => f.status === "declined").length} declined</span>
              </div>
            </div>
            {friendships.length === 0 && <p className="text-sm" style={mutedStyle}>No friendships yet.</p>}
            {friendships.map(f => (
              <div key={f.id} className="flex items-center gap-3 px-4 py-3 rounded-2xl" style={cardStyle}>
                <Heart className={`w-4 h-4 shrink-0 ${f.status === "accepted" ? "text-pink-400 fill-pink-400" : "text-muted-foreground opacity-40"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold truncate">{f.requester_email} → {f.recipient_email}</p>
                  <p className="text-[10px] mt-0.5" style={mutedStyle}>{new Date(f.created_date).toLocaleDateString()}</p>
                </div>
                {/* Status selector */}
                <select
                  value={f.status}
                  onChange={async (e) => {
                    const newStatus = e.target.value;
                    await db.entities.Friendship.update(f.id, { status: newStatus });
                    setData(d => ({ ...d, friendships: d.friendships.map(x => x.id === f.id ? { ...x, status: newStatus } : x) }));
                  }}
                  className="text-[10px] font-bold px-2 py-1 rounded-lg outline-none cursor-pointer"
                  style={{
                    background: f.status === "accepted" ? "rgba(16,185,129,0.15)" : f.status === "declined" ? "rgba(239,68,68,0.15)" : "rgba(245,158,11,0.15)",
                    color: f.status === "accepted" ? "#34d399" : f.status === "declined" ? "#f87171" : "#fbbf24",
                    border: "1px solid transparent",
                  }}
                >
                  <option value="pending">pending</option>
                  <option value="accepted">accepted</option>
                  <option value="declined">declined</option>
                </select>
                <button
                  onClick={async () => {
                    await db.entities.Friendship.delete(f.id);
                    setData(d => ({ ...d, friendships: d.friendships.filter(x => x.id !== f.id) }));
                  }}
                  className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-all shrink-0"
                  title="Delete friendship"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {tab === "moderation" && (
          <div className="space-y-8">
            <div>
              <h2 className="font-black text-base mb-4 flex items-center gap-2"><Megaphone className="w-4 h-4 text-violet-400" /> Announcements</h2>
              <AnnouncementPanel cardStyle={cardStyle} mutedStyle={mutedStyle} user={user} />
            </div>
            <div>
              <h2 className="font-black text-base mb-4 flex items-center gap-2"><Shield className="w-4 h-4 text-red-400" /> Moderation</h2>
              <ModerationTab suspensions={suspensions} onUpdate={(updated) => setData(d => ({ ...d, suspensions: d.suspensions.map(s => s.id === updated.id ? updated : s) }))} cardStyle={cardStyle} mutedStyle={mutedStyle} />
            </div>
          </div>
        )}

        {tab === "backup" && (
          <div className="space-y-4">
            <UserSyncButton cardStyle={cardStyle} mutedStyle={mutedStyle} />
            <DataBackupRestore cardStyle={cardStyle} mutedStyle={mutedStyle} />
          </div>
        )}

        {tab === "questionnaires" && (
          <QuestionnairePanel cardStyle={cardStyle} mutedStyle={mutedStyle} />
        )}

        {tab === "applications" && (
          <CourseApplicationsPanel cardStyle={cardStyle} mutedStyle={mutedStyle} />
        )}

        {tab === "partnerships" && (
          <PartnershipPanel cardStyle={cardStyle} mutedStyle={mutedStyle} />
        )}

        {tab === "classrooms" && (
          <ClassroomPanel cardStyle={cardStyle} mutedStyle={mutedStyle} />
        )}

        {tab === "partners" && (
          <PartnersPanel cardStyle={cardStyle} mutedStyle={mutedStyle} />
        )}

        {tab === "verify_requests" && (() => {
          const reqs = data.verifyRequests || [];
          const pending = reqs.filter(r => r.status === "pending");
          return (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <p className="text-sm font-bold">Deck Verification Requests ({reqs.length})</p>
                <div className="flex gap-3 text-xs" style={mutedStyle}>
                  <span>⏳ {pending.length} pending</span>
                  <span>✅ {reqs.filter(r => r.status === "approved").length} approved</span>
                  <span>❌ {reqs.filter(r => r.status === "rejected").length} rejected</span>
                </div>
              </div>
              {reqs.length === 0 && (
                <div className="text-center py-16 rounded-2xl" style={cardStyle}>
                  <p className="font-bold mb-1">No verification requests</p>
                  <p className="text-sm" style={mutedStyle}>Deck owners can request a verified badge from their deck page.</p>
                </div>
              )}
              {reqs.map(req => (
                <div key={req.id} className="rounded-2xl p-5" style={cardStyle}>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="font-black text-base">{req.deck_title || "Untitled Deck"}</p>
                      <p className="text-xs mt-0.5" style={mutedStyle}>{req.requester_email} · {req.requester_name}</p>
                      <p className="text-[10px] mt-0.5" style={mutedStyle}>{new Date(req.created_date).toLocaleString()}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-xl text-xs font-bold border ${req.status === "pending" ? "bg-amber-500/10 border-amber-500/20 text-amber-400" : req.status === "approved" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400"}`}>{req.status}</span>
                  </div>
                  {req.deck_id && (
                    <a href={`/Study?deck_id=${req.deck_id}`} target="_blank" rel="noopener noreferrer" className="text-xs text-violet-400 underline mb-3 block">View Deck →</a>
                  )}
                  <div className="flex gap-2 flex-wrap">
                    {req.status === "pending" && (<>
                      <button onClick={async () => {
                        await db.entities.PendingApproval.update(req.id, { status: "approved" });
                        if (req.deck_id) {
                          await db.entities.Deck.update(req.deck_id, { is_verified: true, verified_by: user.email });
                          // notify owner
                          db.entities.AppNotification.create({ recipient_email: req.requester_email, title: "✅ Deck Verified!", message: `Your deck "${req.deck_title}" has been granted a verified badge!`, icon: "badge", read: false }).catch(() => {});
                        }
                        setData(d => ({ ...d, verifyRequests: d.verifyRequests.map(r => r.id === req.id ? { ...r, status: "approved" } : r), decks: d.decks.map(dk => dk.id === req.deck_id ? { ...dk, is_verified: true } : dk) }));
                      }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all">
                        <CheckCircle2 className="w-3 h-3" /> Approve & Verify
                      </button>
                      <button onClick={async () => {
                        await db.entities.PendingApproval.update(req.id, { status: "rejected" });
                        db.entities.AppNotification.create({ recipient_email: req.requester_email, title: "❌ Verification Not Approved", message: `Your verification request for "${req.deck_title}" was not approved at this time.`, icon: "bell", read: false }).catch(() => {});
                        setData(d => ({ ...d, verifyRequests: d.verifyRequests.map(r => r.id === req.id ? { ...r, status: "rejected" } : r) }));
                      }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all">
                        <Ban className="w-3 h-3" /> Reject
                      </button>
                    </>)}
                    {req.status === "approved" && (
                      <button onClick={async () => {
                        await db.entities.PendingApproval.update(req.id, { status: "pending" });
                        if (req.deck_id) await db.entities.Deck.update(req.deck_id, { is_verified: false, verified_by: null });
                        setData(d => ({ ...d, verifyRequests: d.verifyRequests.map(r => r.id === req.id ? { ...r, status: "pending" } : r), decks: d.decks.map(dk => dk.id === req.deck_id ? { ...dk, is_verified: false } : dk) }));
                      }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-all">
                        <X className="w-3 h-3" /> Revoke Verification
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          );
        })()}

        {tab === "lynx" && <LynxApiPanel cardStyle={cardStyle} mutedStyle={mutedStyle} />}
        {tab === "export" && <GitExportPanel cardStyle={cardStyle} mutedStyle={mutedStyle} />}

        {tab === "timespent" && (() => {
          // Aggregate total time (browsing + studying) per user
          const timeByUser = {};
          sessions.forEach(s => {
            const email = s.user_email || s.created_by || "unknown";
            if (!timeByUser[email]) timeByUser[email] = { studying: 0, browsing: 0 };
            if (s.session_type === "browsing") {
              timeByUser[email].browsing += s.duration_minutes || 0;
            } else {
              timeByUser[email].studying += s.duration_minutes || 0;
            }
          });
          const sorted = Object.entries(timeByUser)
            .map(([email, t]) => ({ email, studying: t.studying, browsing: t.browsing, total: t.studying + t.browsing }))
            .sort((a, b) => b.total - a.total);

          return (
            <div className="rounded-2xl overflow-hidden" style={cardStyle}>
              <div className="px-4 py-3 border-b flex items-center gap-3" style={{ borderColor: "var(--app-border)" }}>
                <span className="text-sm font-bold">Time Spent Per User</span>
                <span className="text-xs" style={mutedStyle}>browsing + studying combined · {sorted.length} users</span>
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--app-border)" }}>
                    {["User", "Study Time", "Browsing Time", "Total Time"].map(h => (
                      <th key={h} className="text-left px-4 py-3 font-bold" style={mutedStyle}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((row, i) => (
                    <tr key={row.email} style={{ borderBottom: "1px solid var(--app-border)", background: i % 2 === 0 ? "transparent" : "rgba(139,92,246,0.03)" }}>
                      <td className="px-4 py-3 truncate max-w-[180px] font-medium">{row.email}</td>
                      <td className="px-4 py-3 text-violet-400 font-bold">{row.studying}m</td>
                      <td className="px-4 py-3 text-blue-400">{row.browsing}m</td>
                      <td className="px-4 py-3 font-black">{row.total}m</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })()}

        {tab === "sessions" && (
          <div className="rounded-2xl overflow-hidden" style={cardStyle}>
            <table className="w-full text-xs">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--app-border)" }}>
                  {["User", "Type", "Cards", "Duration", "Date"].map(h => (
                    <th key={h} className="text-left px-4 py-3 font-bold" style={mutedStyle}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sessions.filter(s => s.session_type !== "browsing").slice(0, 100).map(s => (
                  <tr key={s.id} style={{ borderBottom: "1px solid var(--app-border)" }}>
                    <td className="px-4 py-3 truncate max-w-[120px]" style={mutedStyle}>{s.user_email || s.created_by || "—"}</td>
                    <td className="px-4 py-3">{s.session_type || "flashcards"}</td>
                    <td className="px-4 py-3 font-bold">{s.cards_reviewed || 0}</td>
                    <td className="px-4 py-3">{s.duration_minutes || 0}m</td>
                    <td className="px-4 py-3" style={mutedStyle}>
                      {s.created_date ? new Date(s.created_date).toLocaleDateString() : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
