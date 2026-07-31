import { db } from '@/lib/firebase';

import { useState, useEffect } from "react";

import { Search, UserPlus, Check, X, Users, Globe, Lock, Loader2 } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";

export default function FriendsAndUsers() {
  const { t } = useTranslation();
  const [me, setMe] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [friendships, setFriendships] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [pendingActions, setPendingActions] = useState({}); // userId -> "sending"|"accepting"|"declining"
  const [viewingUser, setViewingUser] = useState(null);

  const DEV_EMAILS = ["yychang100@student.hbuhsd.edu", "yohanyinyuchang@gmail.com", "yohanchang@outlook.com"];

  useEffect(() => {
    const load = async () => {
      const user = await db.auth.me();
      setMe(user);
      const [users, friends] = await Promise.all([
        db.entities.User.list("-created_date", 500),
        db.entities.Friendship.filter({ $or: [{ requester_email: user.email }, { recipient_email: user.email }] }),
      ]);
      setAllUsers(users.filter(u => u.email !== user.email));
      setFriendships(friends);
      setLoading(false);
    };
    load().catch(() => setLoading(false));
  }, []);

  const isDev = me && DEV_EMAILS.includes(me.email);

  const getFriendship = (userEmail) => {
    return friendships.find(f =>
      (f.requester_email === me?.email && f.recipient_email === userEmail) ||
      (f.recipient_email === me?.email && f.requester_email === userEmail)
    );
  };

  const sendFriendRequest = async (targetUser) => {
    setPendingActions(p => ({ ...p, [targetUser.id]: "sending" }));
    const f = await db.entities.Friendship.create({
      requester_email: me.email,
      requester_name: me.full_name || me.email,
      recipient_email: targetUser.email,
      recipient_name: targetUser.full_name || targetUser.email,
      status: "pending",
    });
    setFriendships(prev => [...prev, f]);
    setPendingActions(p => { const n = { ...p }; delete n[targetUser.id]; return n; });
  };

  const respondToRequest = async (friendship, accept) => {
    setPendingActions(p => ({ ...p, [friendship.id]: accept ? "accepting" : "declining" }));
    const updated = await db.entities.Friendship.update(friendship.id, { status: accept ? "accepted" : "declined" });
    setFriendships(prev => prev.map(f => f.id === friendship.id ? updated : f));
    setPendingActions(p => { const n = { ...p }; delete n[friendship.id]; return n; });
  };

  const removeFriend = async (friendship) => {
    await db.entities.Friendship.delete(friendship.id);
    setFriendships(prev => prev.filter(f => f.id !== friendship.id));
  };

  const filteredUsers = search.trim()
    ? allUsers.filter(u =>
        (u.full_name || "").toLowerCase().includes(search.toLowerCase()) ||
        (u.display_name || "").toLowerCase().includes(search.toLowerCase()) ||
        (u.is_public && (u.bio || "").toLowerCase().includes(search.toLowerCase()))
      )
    : allUsers.slice(0, 50);

  const friends = allUsers.filter(u => {
    const f = getFriendship(u.email);
    return f?.status === "accepted";
  });

  const pendingIncoming = friendships.filter(f => f.recipient_email === me?.email && f.status === "pending");

  const bgStyle = { background: "var(--app-bg)", color: "var(--app-text)" };
  const cardStyle = { background: "var(--app-surface)", border: "1px solid var(--app-border)" };
  const mutedStyle = { color: "var(--app-text-muted)" };

  const UserCard = ({ u, compact = false }) => {
    const friendship = getFriendship(u.email);
    const isPublic = u.is_public || isDev;
    const displayName = u.display_name || u.full_name || u.email.split("@")[0];

    return (
      <div
        className={`rounded-2xl p-4 cursor-pointer hover:scale-[1.01] transition-all ${compact ? "" : ""}`}
        style={cardStyle}
        onClick={() => setViewingUser(u)}
      >
        <div className="flex items-center gap-3">
          {/* Profile Picture masked if account is private */}
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600/30 to-blue-600/30 flex items-center justify-center text-sm font-bold shrink-0 overflow-hidden">
            {isPublic && u.profile_picture_url
              ? <img src={u.profile_picture_url} alt="" className="w-full h-full object-cover" />
              : displayName[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="font-bold text-sm truncate">{displayName}</p>
              {isPublic ? <Globe className="w-3 h-3 text-violet-400 shrink-0" /> : <Lock className="w-3 h-3 opacity-30 shrink-0" />}
            </div>
            {isPublic && u.bio
              ? <p className="text-xs truncate" style={mutedStyle}>{u.bio}</p>
              : !isPublic ? <p className="text-xs" style={mutedStyle}>Private account</p>
              : <p className="text-xs opacity-30">No bio</p>}
          </div>
          <div onClick={e => e.stopPropagation()}>
            {!friendship && (
              <button
                onClick={() => sendFriendRequest(u)}
                disabled={!!pendingActions[u.id]}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white transition-all"
              >
                {pendingActions[u.id] ? <Loader2 className="w-3 h-3 animate-spin" /> : <UserPlus className="w-3 h-3" />}
                Add
              </button>
            )}
            {friendship?.status === "pending" && friendship.requester_email === me?.email && (
              <span className="text-xs px-2.5 py-1 rounded-xl opacity-50" style={cardStyle}>Pending</span>
            )}
            {friendship?.status === "pending" && friendship.recipient_email === me?.email && (
              <div className="flex gap-1">
                <button onClick={() => respondToRequest(friendship, true)} className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all">
                  {pendingActions[friendship.id] === "accepting" ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                </button>
                <button onClick={() => respondToRequest(friendship, false)} className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-all">
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            {friendship?.status === "accepted" && (
              <span className="text-xs px-2.5 py-1.5 rounded-xl text-emerald-400 bg-emerald-500/15 font-semibold">Friends</span>
            )}
            {friendship?.status === "declined" && (
              <button onClick={() => sendFriendRequest(u)} className="text-xs px-2.5 py-1.5 rounded-xl opacity-40 hover:opacity-80 transition-all" style={cardStyle}>
                Re-add
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // User detail modal
  const UserModal = ({ u, onClose }) => {
    if (!u) return null;
    const isPublic = u.is_public || isDev;
    const friendship = getFriendship(u.email);
    const displayName = u.display_name || u.full_name || u.email.split("@")[0];

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <div className="relative w-full max-w-sm rounded-3xl p-6 shadow-2xl" style={{ background: "var(--app-surface-solid, var(--app-surface))", border: "1px solid var(--app-border)" }} onClick={e => e.stopPropagation()}>
          <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg opacity-40 hover:opacity-80">
            <X className="w-4 h-4" />
          </button>

          {/* Avatar masked if account is private */}
          <div className="flex flex-col items-center mb-5">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-600/30 to-blue-600/30 flex items-center justify-center text-2xl font-black mb-3 overflow-hidden">
              {isPublic && u.profile_picture_url
                ? <img src={u.profile_picture_url} alt="" className="w-full h-full object-cover" />
                : displayName[0]?.toUpperCase()}
            </div>
            <h2 className="text-xl font-black">{displayName}</h2>
            <div className="flex items-center gap-1.5 mt-1">
              {isPublic ? <Globe className="w-3 h-3 text-violet-400" /> : <Lock className="w-3 h-3 opacity-30" />}
              <span className="text-xs" style={mutedStyle}>{isPublic ? "Public profile" : "Private account"}</span>
            </div>
          </div>

          {/* Bio — only for public */}
          {isPublic && u.bio && (
            <p className="text-sm text-center mb-5 px-2" style={mutedStyle}>{u.bio}</p>
          )}
          {!isPublic && (
            <p className="text-sm text-center mb-5 opacity-40">This account is private. Only their name is visible.</p>
          )}

          {/* Friend action */}
          <div className="flex justify-center">
            {!friendship && (
              <button
                onClick={async () => { await sendFriendRequest(u); setViewingUser(null); }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white transition-all"
              >
                <UserPlus className="w-4 h-4" /> Add Friend
              </button>
            )}
            {friendship?.status === "pending" && friendship.requester_email === me?.email && (
              <span className="text-sm px-5 py-2.5 rounded-xl opacity-50" style={cardStyle}>Request Sent</span>
            )}
            {friendship?.status === "pending" && friendship.recipient_email === me?.email && (
              <div className="flex gap-2">
                <button onClick={() => { respondToRequest(friendship, true); setViewingUser(null); }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all">
                  <Check className="w-4 h-4" /> Accept
                </button>
                <button onClick={() => { respondToRequest(friendship, false); setViewingUser(null); }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-all">
                  <X className="w-4 h-4" /> Decline
                </button>
              </div>
            )}
            {friendship?.status === "accepted" && (
              <div className="flex flex-col items-center gap-2">
                <span className="text-sm px-5 py-2 rounded-xl text-emerald-400 bg-emerald-500/15 font-semibold">✓ Friends</span>
                <button onClick={() => { removeFriend(friendship); setViewingUser(null); }} className="text-xs opacity-30 hover:opacity-60 transition-all">Remove friend</button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen pb-20" style={bgStyle}>
      {/* Header */}
      <div className="px-6 py-8 border-b" style={{ borderColor: "var(--app-border)" }}>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-2xl bg-violet-500/15 flex items-center justify-center">
              <Users className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h1 className="text-xl font-black">Friends & Users</h1>
              <p className="text-xs opacity-40">Search people and send friend requests</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={mutedStyle} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl text-sm outline-none"
              style={{ background: "var(--app-surface)", border: "1px solid var(--app-border)", color: "var(--app-text)" }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-6 space-y-6">
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 text-violet-500 animate-spin" /></div>
        ) : (
          <>
            {/* Pending incoming requests */}
            {pendingIncoming.length > 0 && !search && (
              <div>
                <p className="text-xs font-bold uppercase tracking-widest opacity-40 mb-3">Friend Requests ({pendingIncoming.length})</p>
                <div className="space-y-2">
                  {pendingIncoming.map(f => {
                    const u = allUsers.find(u => u.email === f.requester_email);
                    if (!u) return null;
                    return <UserCard key={u.id} u={u} />;
                  })}
                </div>
              </div>
            )}

            {/* Friends */}
            {friends.length > 0 && !search && (
              <div>
                <p className="text-xs font-bold uppercase tracking-widest opacity-40 mb-3">My Friends ({friends.length})</p>
                <div className="space-y-2">
                  {friends.map(u => <UserCard key={u.id} u={u} />)}
                </div>
              </div>
            )}

            {/* Search results / public users */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest opacity-40 mb-3">
                {search ? `Results for "${search}"` : "Public Profiles on Cognita"}
              </p>
              {filteredUsers.length === 0 ? (
                <div className="text-center py-12 rounded-3xl" style={cardStyle}>
                  <Users className="w-10 h-10 mx-auto mb-3 opacity-10" />
                  <p className="text-sm" style={mutedStyle}>No users found</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredUsers.map(u => <UserCard key={u.id} u={u} />)}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {viewingUser && <UserModal u={viewingUser} onClose={() => setViewingUser(null)} />}
    </div>
  );
}
