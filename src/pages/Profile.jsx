import { db } from '@/lib/firebase';
import { useState, useEffect, useRef } from "react";
import { User, Mail, Trash2, LogOut, ShieldAlert, Settings, Loader2, Edit3, Save, X, Globe, Lock, Camera, UserPlus, Check, ArrowLeft, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useTranslation } from "../hooks/useTranslation";
import { updateProfile } from "firebase/auth";

export default function Profile() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Check if viewing another user's profile
  const urlParams = new URLSearchParams(window.location.search);
  const viewEmail = urlParams.get("view");
  const [viewedUser, setViewedUser] = useState(null);
  const [viewLoading, setViewLoading] = useState(!!viewEmail);
  const [friendship, setFriendship] = useState(null);
  const [friendAction, setFriendAction] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [uploadingPic, setUploadingPic] = useState(false);
  const picInputRef = useRef(null);

  // Helper to ensure a user record exists in db.entities.User and update/create it safely
  const upsertUserData = async (currentUser, fieldsToUpdate) => {
    if (!currentUser?.email) return null;

    try {
      // Find existing user record by email
      const users = await db.entities.User.list("-created_date", 500).catch(() => []);
      const existing = users.find(u => u.email === currentUser.email);

      if (existing?.id) {
        // Update existing record
        await db.entities.User.update(existing.id, fieldsToUpdate);
      } else {
        // Create new record for this user if missing
        await db.entities.User.create({
          email: currentUser.email,
          display_name: currentUser.display_name || currentUser.full_name || currentUser.displayName || "",
          full_name: currentUser.display_name || currentUser.full_name || currentUser.displayName || "",
          bio: "",
          is_public: false,
          created_date: new Date().toISOString(),
          ...fieldsToUpdate,
        });
      }
    } catch (err) {
      console.warn("Failed to upsert user record in db.entities.User:", err);
    }
  };

  useEffect(() => {
    db.auth.me().then(async (u) => {
      if (!u) return;

      // Sync and retrieve full entity record to ensure custom fields are retained
      let dbUserRecord = null;
      try {
        const users = await db.entities.User.list("-created_date", 500).catch(() => []);
        dbUserRecord = users.find(usr => usr.email === u.email);

        // If no entity record exists yet for logged in user, create it now
        if (!dbUserRecord && u.email) {
          await upsertUserData(u, {
            display_name: u.display_name || u.displayName || u.email.split("@")[0],
            full_name: u.full_name || u.displayName || u.email.split("@")[0],
          });
          const refreshedUsers = await db.entities.User.list("-created_date", 500).catch(() => []);
          dbUserRecord = refreshedUsers.find(usr => usr.email === u.email);
        }
      } catch (e) {
        console.warn("Error fetching DB user record:", e);
      }

      // Merge auth user with DB record data
      const mergedUser = {
        ...u,
        id: dbUserRecord?.id || u.id,
        display_name: dbUserRecord?.display_name || u.display_name || u.displayName || "",
        full_name: dbUserRecord?.full_name || u.full_name || u.displayName || "",
        bio: dbUserRecord?.bio || u.bio || "",
        is_public: dbUserRecord?.is_public ?? u.is_public ?? false,
        profile_picture_url: dbUserRecord?.profile_picture_url || u.profile_picture_url || u.photoURL || "",
      };

      setUser(mergedUser);
      setEditName(mergedUser.display_name || mergedUser.full_name || "");
      setEditBio(mergedUser.bio || "");
      setIsPublic(mergedUser.is_public || false);

      if (viewEmail && viewEmail !== u.email) {
        db.entities.User.list("-created_date", 500).then(users => {
          const target = users.find(usr => usr.email === viewEmail);
          setViewedUser(target || null);
          setViewLoading(false);
          db.entities.Friendship.filter({ $or: [
            { requester_email: u.email, recipient_email: viewEmail },
            { recipient_email: u.email, requester_email: viewEmail },
          ]}).then(fs => setFriendship(fs[0] || null)).catch(() => {});
        }).catch(() => setViewLoading(false));
      }
    }).catch(() => {});
  }, [viewEmail]);

  const handleSaveProfile = async () => {
    setSaving(true);
    setSaveError("");
    try {
      const currentUser = db.auth.getCurrentUser?.();
      if (currentUser) {
        await updateProfile(currentUser, { displayName: editName });
      }

      const updates = {
        display_name: editName,
        full_name: editName,
        bio: editBio,
        is_public: isPublic
      };

      // Safely upsert user record in database entities collection
      await upsertUserData(user, updates);

      const refreshed = await db.auth.me();
      const updatedUser = {
        ...refreshed,
        ...user,
        ...updates,
      };

      setUser(updatedUser);
      setEditing(false);
    } catch (err) {
      console.error("Failed to save profile:", err);
      setSaveError(err?.message || "Failed to save profile changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleProfilePicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingPic(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64String = reader.result;
          const currentUser = db.auth.getCurrentUser?.();
          if (currentUser) {
            await updateProfile(currentUser, { photoURL: base64String });
          }

          // Safely save profile picture URL to user entity
          await upsertUserData(user, { profile_picture_url: base64String });

          const refreshed = await db.auth.me();
          setUser({
            ...refreshed,
            ...user,
            profile_picture_url: base64String
          });
        } catch (err) {
          console.error("Error saving picture data:", err);
        } finally {
          setUploadingPic(false);
        }
      };
      reader.onerror = () => {
        setUploadingPic(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setUploadingPic(false);
    }
  };

  const handleLogout = () => {
    db.auth.logout();
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      const [decks, sessions, quizzes, media, chats, friendships] = await Promise.all([
        db.entities.Deck.filter({ created_by: user.email }),
        db.entities.StudySession.filter({ created_by: user.email }),
        db.entities.Quiz.filter({ created_by: user.email }),
        db.entities.GeneratedMedia.filter({ created_by: user.email }),
        db.entities.ChatSession.filter({ created_by: user.email }),
        db.entities.Friendship.filter({ created_by: user.email }),
      ]);
      await Promise.all([
        ...decks.map(d => db.entities.Deck.delete(d.id)),
        ...sessions.map(s => db.entities.StudySession.delete(s.id)),
        ...quizzes.map(q => db.entities.Quiz.delete(q.id)),
        ...media.map(m => db.entities.GeneratedMedia.delete(m.id)),
        ...chats.map(c => db.entities.ChatSession.delete(c.id)),
        ...friendships.map(f => db.entities.Friendship.delete(f.id)),
      ]);
    } catch (e) {
      console.error(e);
    }
    db.auth.logout();
  };

  const sendFriendRequest = async () => {
    if (!user || !viewedUser) return;
    setFriendAction("sending");
    const f = await db.entities.Friendship.create({
      requester_email: user.email,
      requester_name: user.full_name || user.email,
      recipient_email: viewedUser.email,
      recipient_name: viewedUser.display_name || viewedUser.full_name || viewedUser.email,
      status: "pending",
    });
    setFriendship(f);
    setFriendAction(null);
  };

  const respondFriendRequest = async (accept) => {
    if (!friendship) return;
    setFriendAction(accept ? "accepting" : "declining");
    const updated = await db.entities.Friendship.update(friendship.id, { status: accept ? "accepted" : "declined" });
    setFriendship(updated);
    setFriendAction(null);
  };

  const bgStyle = { background: "var(--app-bg)", color: "var(--app-text)" };
  const cardStyle = { background: "var(--app-surface)", border: "1px solid var(--app-border)" };
  const mutedStyle = { color: "var(--app-text-muted)" };

  // --- Viewing another user's profile ---
  if (viewEmail && viewEmail !== user?.email) {
    if (viewLoading) return (
      <div className="min-h-screen flex items-center justify-center" style={bgStyle}>
        <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
      </div>
    );
    if (!viewedUser) return (
      <div className="min-h-screen flex items-center justify-center" style={bgStyle}>
        <p className="text-sm opacity-50">User not found.</p>
      </div>
    );

    const isPublicProfile = viewedUser.is_public;
    const displayName = viewedUser.display_name || viewedUser.full_name || viewedUser.email.split("@")[0];

    return (
      <div className="min-h-screen px-6 py-10 max-w-lg mx-auto" style={bgStyle}>
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm opacity-50 hover:opacity-80 mb-6 transition-all">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="rounded-3xl p-6 mb-4 shadow-xl" style={cardStyle}>
          <div className="flex flex-col items-center text-center mb-5">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-600/30 to-violet-600/30 border border-white/5 flex items-center justify-center text-2xl font-black mb-3 overflow-hidden shadow">
              {viewedUser.profile_picture_url
                ? <img src={viewedUser.profile_picture_url} alt="" className="w-full h-full object-cover" />
                : displayName[0]?.toUpperCase()}
            </div>
            <h1 className="text-2xl font-black">{displayName}</h1>
            <div className="flex items-center gap-1.5 mt-1">
              {isPublicProfile ? <Globe className="w-3.5 h-3.5 text-blue-400" /> : <Lock className="w-3.5 h-3.5 opacity-30" />}
              <span className="text-xs" style={mutedStyle}>{isPublicProfile ? "Public profile" : "Private account"}</span>
            </div>
            {isPublicProfile && viewedUser.bio && (
              <p className="text-sm mt-3 leading-relaxed" style={mutedStyle}>{viewedUser.bio}</p>
            )}
            {!isPublicProfile && (
              <p className="text-sm mt-3 opacity-40">This account is private.</p>
            )}
          </div>

          <div className="flex justify-center">
            {!friendship && (
              <button
                onClick={sendFriendRequest}
                disabled={!!friendAction}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white transition-all shadow-lg shadow-blue-600/20"
              >
                {friendAction ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                Add Friend
              </button>
            )}
            {friendship?.status === "pending" && friendship.requester_email === user?.email && (
              <span className="text-sm px-5 py-2.5 rounded-xl opacity-50" style={cardStyle}>Request Sent</span>
            )}
            {friendship?.status === "pending" && friendship.recipient_email === user?.email && (
              <div className="flex gap-2">
                <button onClick={() => respondFriendRequest(true)} disabled={!!friendAction} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all">
                  {friendAction === "accepting" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Accept
                </button>
                <button onClick={() => respondFriendRequest(false)} disabled={!!friendAction} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-all">
                  <X className="w-4 h-4" /> Decline
                </button>
              </div>
            )}
            {friendship?.status === "accepted" && (
              <span className="text-sm px-5 py-2 rounded-xl text-emerald-400 bg-emerald-500/15 font-bold">✓ Friends</span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-12 max-w-lg mx-auto pb-28" style={bgStyle}>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black tracking-tight">{t('profileTitle')}</h1>
        <Link to={createPageUrl("Settings")}>
          <button
            className="flex items-center justify-center rounded-2xl transition-all shadow-sm"
            style={{ minWidth: 44, minHeight: 44, ...cardStyle, color: "var(--app-text-muted)" }}
          >
            <Settings className="w-5 h-5" />
          </button>
        </Link>
      </div>

      {/* User Info Card */}
      <div className="rounded-3xl p-6 mb-4 shadow-xl" style={cardStyle}>
        <div className="flex items-center gap-4 mb-4">
          <div className="relative shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center overflow-hidden shadow-md border border-white/10">
              {user?.profile_picture_url
                ? <img src={user.profile_picture_url} alt="profile" className="w-full h-full object-cover" />
                : <User className="w-7 h-7 text-white" />}
            </div>
            <button
              onClick={() => picInputRef.current?.click()}
              disabled={uploadingPic}
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-blue-600 border-2 flex items-center justify-center hover:bg-blue-500 transition-all shadow"
              style={{ borderColor: "var(--app-surface)" }}
            >
              {uploadingPic ? <Loader2 className="w-3 h-3 text-white animate-spin" /> : <Camera className="w-3 h-3 text-white" />}
            </button>
            <input ref={picInputRef} type="file" accept="image/*" className="hidden" onChange={handleProfilePicUpload} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="font-bold text-lg truncate">{user?.display_name || user?.full_name || "—"}</div>
            <div className="flex items-center gap-1.5 text-sm mt-0.5 truncate" style={mutedStyle}>
              <Mail className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{user?.email || "—"}</span>
            </div>
            {user?.bio && !editing && (
              <p className="text-sm mt-1 leading-relaxed" style={mutedStyle}>{user.bio}</p>
            )}
          </div>

          <button
            onClick={() => setEditing(!editing)}
            className="p-2.5 rounded-xl opacity-60 hover:opacity-100 transition-all border border-white/5"
            style={{ color: "var(--app-text)", background: "var(--app-bg)" }}
          >
            {editing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
          </button>
        </div>

        {editing && (
          <div className="space-y-4 pt-4" style={{ borderTop: "1px solid var(--app-border)" }}>
            <div>
              <label className="text-xs font-semibold mb-1 block" style={mutedStyle}>{t('displayName')}</label>
              <input
                value={editName}
                onChange={e => setEditName(e.target.value)}
                placeholder={t('displayName')}
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none font-medium transition-all focus:border-blue-500"
                style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)", color: "var(--app-text)" }}
              />
            </div>
            <div>
              <label className="text-xs font-semibold mb-1 block" style={mutedStyle}>{t('bio')}</label>
              <textarea
                value={editBio}
                onChange={e => setEditBio(e.target.value)}
                placeholder={t('bio')}
                rows={3}
                className="w-full p-3 rounded-xl text-sm outline-none resize-none font-medium transition-all focus:border-blue-500"
                style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)", color: "var(--app-text)" }}
              />
            </div>
            <div className="flex items-center justify-between py-1">
              <div className="flex items-center gap-2">
                {isPublic ? <Globe className="w-4 h-4 text-blue-400" /> : <Lock className="w-4 h-4" style={mutedStyle} />}
                <span className="text-sm font-semibold">{t('publicProfile')}</span>
              </div>
              <button
                onClick={() => setIsPublic(!isPublic)}
                className={`w-11 h-6 rounded-full transition-colors relative ${isPublic ? "bg-blue-600" : "bg-black/20 dark:bg-white/20"}`}
              >
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${isPublic ? "left-5.5" : "left-0.5"}`} />
              </button>
            </div>

            {saveError && (
              <div className="flex items-center gap-2 p-3 rounded-xl text-xs bg-red-500/10 border border-red-500/20 text-red-400">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{saveError}</span>
              </div>
            )}

            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-600/20"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? t('savingProfile') : t('saveProfile')}
            </button>
          </div>
        )}
      </div>

      {/* Notifications Shortcut */}
      <Link to={createPageUrl("Settings")} className="block mb-3">
        <div className="w-full flex items-center gap-3 rounded-2xl px-5 text-sm font-semibold transition-all hover:brightness-105 shadow-sm" style={{ ...cardStyle, minHeight: 52 }}>
          <Settings className="w-4 h-4 text-blue-400" />
          <span>{t('notificationSettings')}</span>
          <span className="ml-auto text-xs opacity-50">→</span>
        </div>
      </Link>

      {/* Sign Out */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-3 rounded-2xl px-5 text-sm font-semibold transition-all mb-4 shadow-sm hover:brightness-105"
        style={{ ...cardStyle, minHeight: 52, color: "var(--app-text-muted)" }}
      >
        <LogOut className="w-4 h-4" />
        {t('signOut')}
      </button>

      {/* Account Deletion */}
      <div className="bg-red-950/25 border border-red-500/20 rounded-3xl p-5 shadow-lg">
        <div className="flex items-center gap-2 text-red-400 font-bold text-sm mb-1">
          <ShieldAlert className="w-4 h-4" />
          {t('dangerZone')}
        </div>
        <p className="text-sm mb-4" style={mutedStyle}>{t('deleteAccountDesc')}</p>

        {!confirmDelete ? (
          <button
            onClick={() => setConfirmDelete(true)}
            className="flex items-center gap-2 bg-red-600/15 hover:bg-red-600/25 border border-red-500/30 text-red-400 px-4 rounded-xl text-sm font-bold transition-all"
            style={{ minHeight: 44 }}
          >
            <Trash2 className="w-4 h-4" />
            {t('deleteMyAccount')}
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-red-300 text-sm font-semibold">{t('deleteConfirmMsg')}</p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 border text-sm font-bold transition-all rounded-xl"
                style={{ ...cardStyle, minHeight: 44, color: "var(--app-text-muted)" }}
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 disabled:opacity-60 text-white px-4 rounded-xl text-sm font-bold transition-all shadow-md shadow-red-600/20"
                style={{ minHeight: 44 }}
              >
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                {deleting ? t('deleting') : t('yesDelete')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
