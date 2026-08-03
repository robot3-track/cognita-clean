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
      try {
        const user = await db.auth.me();
        setMe(user);
        if (user?.email) {
          const myEmail = user.email.toLowerCase();
          const [users, friends] = await Promise.all([
            db.entities.User.list("-created_date", 1000),
            db.entities.Friendship.filter({
              $or: [{ requester_email: myEmail }, { recipient_email: myEmail }]
            }),
          ]);
          setAllUsers(users.filter(u => u.email?.toLowerCase() !== myEmail));
          setFriendships(friends || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const isDev = me && DEV_EMAILS.includes(me.email);

  // Normalizes emails to lower-case so comparisons never fail due to capitalization differences
  const getFriendship = (userEmail) => {
    if (!me?.email || !userEmail) return null;
    const myEmail = me.email.toLowerCase();
    const targetEmail = userEmail.toLowerCase();

    return friendships.find(f => {
      const req = (f.requester_email || f.requesterEmail || "").toLowerCase();
      const rec = (f.recipient_email || f.recipientEmail || "").toLowerCase();
      return (req === myEmail && rec === targetEmail) || (rec === myEmail && req === targetEmail);
    });
  };

  const sendFriendRequest = async (targetUser) => {
    if (!me?.email) return;
    setPendingActions(p => ({ ...p, [targetUser.id]: "sending" }));
    const f = await db.entities.Friendship.create({
      requester_email: me.email.toLowerCase(),
      requester_name: me.full_name || me.email,
      recipient_email: targetUser.email.toLowerCase(),
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
        ((u.is_public || isDev) && (u.bio || "").toLowerCase().includes(search.toLowerCase()))
      )
    : allUsers;

  const friends = allUsers.filter(u => {
    const f = getFriendship(u.email);
    return f?.status === "accepted";
  });

  const pendingIncoming = friendships.filter(f => 
    (f.recipient_email || f.recipientEmail)?.toLowerCase() === me?.email?.toLowerCase() && f.status === "pending"
  );

  const bgStyle = { background: "var(--app-bg)", color: "var(--app-text)" };
  const cardStyle = { background: "var(--app-surface)", border: "1px solid var(--app-border)" };
  const mutedStyle = { color: "var(--app-text-muted)" };

  const UserCard = ({ u, compact = false }) => {
    const friendship = getFriendship(u.email);
    const isPublic = u.is_public || isDev;
    const displayName = u.display_name || u.full_name || u.email?.split("@")[0];
    const isMyEmail = me?.email?.toLowerCase() === u.email?.toLowerCase();
    const isAccepted = friendship?.status === "accepted";
    const isPending = friendship?.status === "pending";

    return (
      <div
        className="rounded-2xl p-4 cursor-pointer hover:scale-[1.01] transition-all"
        style={cardStyle}
        onClick={() => setViewingUser(u)}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600/30 to-blue-600/30 flex items-center justify-center text-sm font-bold shrink-0 overflow-hidden">
            {isPublic && u.profile_picture_url
              ? <img src={u.profile_picture_url} alt="" className="w-full h-full object-cover" />
              : displayName?.[0]?.toUpperCase()}
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
            {/* Show Add button ONLY if not myself AND no friendship record exists at all */}
            {!isMyEmail && !friendship && (
              <button
                onClick={() => sendFriendRequest(u)}
                disabled={!!pendingActions[u.id]}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white transition-all"
              >
                {pendingActions[u.id] ? <Loader2 className="w-3 h-3 animate-spin" /> : <UserPlus className="w-3 h-3" />}
                Add
              </button>
            )}

            {/* Pending states */}
            {isPending && (friendship.requester_email || friendship.requesterEmail)?.toLowerCase() === me?.email?.toLowerCase() && (
              <span className="text-xs px-2.5 py-1 rounded-xl opacity-50" style={cardStyle}>Pending</span>
            )}
            {isPending && (friendship.recipient_email || friendship.recipientEmail)?.toLowerCase() === me?.email?.toLowerCase() && (
              <div className="flex gap-1">
                <button onClick={() => respondToRequest(friendship, true)} className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all">
                  {pendingActions[friendship.id] === "accepting" ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                </button>
                <button onClick={() => respondToRequest(friendship, false)} className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-all">
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Friends state */}
            {isAccepted && (
              <span className="text-xs px-2.5 py-1.5 rounded-xl text-emerald-400 bg-emerald-500/15 font-semibold">Friends</span>
            )}

            {/* Declined state */}
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

  const UserModal = ({ u, onClose }) => {
    if (!u) return null;
    const isPublic = u.is_public || isDev;
    const friendship = getFriendship(u.email);
    const displayName = u.display_name || u.full_name || u.email?.split("@")[0];
    const isAccepted = friendship?.status === "accepted";
    const isPending = friendship?.status === "pending";

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <div className="relative w-full max-w-sm rounded-3xl p-6 shadow-2xl" style={{ background: "var(--app-surface-solid, var(--app-surface))", border: "1px solid var(--app-border)" }} onClick={e => e.stopPropagation()}>
          <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg opacity-40 hover:opacity-80">
            <X className="w-4 h-4" />
          </button>

          <div className="flex flex-col items-center mb-5">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-600/30 to-blue-600/30 flex items-center justify-center text-2xl font-black mb-3 overflow-hidden">
              {isPublic && u.profile_picture_url
                ? <img src={u.profile_picture_url} alt="" className="w-full h-full object-cover" />
                : displayName?.[0]?.toUpperCase()}
            </div>
            <h2 className="text-xl font-black">{displayName}</h2>
            <div className="flex items-center gap-1.5 mt-1">
              {isPublic ? <Globe className="w-3 h-3 text-violet-400" /> : <Lock className="w-3 h-3 opacity-30" />}
              <span className="text-xs" style={mutedStyle}>{isPublic ? "Public profile" : "Private account"}</span>
            </div>
          </div>

          {isPublic && u.bio && (
            <p className="text-sm text-center mb-5 px-2" style={mutedStyle}>{u.bio}</p>
          )}
          {!isPublic && (
            <p className="text-sm text-center mb-5 opacity-40">This account is private. Only their name is visible.</p>
          )}

          <div className="flex justify-center">
            {!friendship && (
              <button
                onClick={async () => { await sendFriendRequest(u); setViewingUser(null); }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white transition-all"
              >
                <UserPlus className="w-4 h-4" /> Add Friend
              </button>
            )}
            {isPending && (friendship.requester_email || friendship.requesterEmail)?.toLowerCase() === me?.email?.toLowerCase() && (
              <span className="text-sm px-5 py-2.5 rounded-xl opacity-50" style={cardStyle}>Request Sent</span>
            )}
            {isPending && (friendship.recipient_email || friendship.recipientEmail)?.toLowerCase() === me?.email?.toLowerCase() && (
              <div className="flex gap-2">
                <button onClick={() => { respondToRequest(friendship, true); setViewingUser(null); }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all">
                  <Check className="w-4 h-4" /> Accept
                </button>
                <button onClick={() => { respondToRequest(friendship, false); setViewingUser(null); }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-all">
                  <X className="w-4 h-4" /> Decline
                </button>
              </div>
            )}
            {isAccepted && (
              <div className="flex flex-col items-center gap-2">
                <span className="text-sm px-5 py-2 rounded-xl text-emerald-400 bg-emerald-500/15 font-semibold">✓ Friends</span>
                <button onClick={() => { removeFriend(friendship); setViewingUser(null); }} className="text-xs opacity-30 hover:opacity-60 transition-all">Remove friend</button>
              </div>
            )}
            {friendship?.status === "declined" && (
              <button
                onClick={async () => { await sendFriendRequest(u); setViewingUser(null); }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white transition-all"
              >
                <UserPlus className="w-4 h-4" /> Re-add Friend
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen pb-20" style={bgStyle}>
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
            {pendingIncoming.length > 0 && !search && (
              <div>
                <p className="text-xs font-bold uppercase tracking-widest opacity-40 mb-3">Friend Requests ({pendingIncoming.length})</p>
                <div className="space-y-2">
                  {pendingIncoming.map(f => {
                    const reqEmail = (f.requester_email || f.requesterEmail)?.toLowerCase();
                    const u = allUsers.find(u => u.email?.toLowerCase() === reqEmail);
                    if (!u) return null;
                    return <UserCard key={u.id} u={u} />;
                  })}
                </div>
              </div>
            )}

            {friends.length > 0 && !search && (
              <div>
                <p className="text-xs font-bold uppercase tracking-widest opacity-40 mb-3">My Friends ({friends.length})</p>
                <div className="space-y-2">
                  {friends.map(u => <UserCard key={u.id} u={u} />)}
                </div>
              </div>
            )}

            <div>
              <p className="text-xs font-bold uppercase tracking-widest opacity-40 mb-3">
                {search ? `Results for "${search}"` : "Global Directory on Cognita"}
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
