import { db } from '@/lib/firebase';

import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "../hooks/useTranslation";

import { Users, UserPlus, Trophy, Clock, Check, X, Loader2, Search, Medal, Globe } from "lucide-react";

export default function Compete() {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [friendships, setFriendships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [addMsg, setAddMsg] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [publicLeaderboard, setPublicLeaderboard] = useState([]);
  const [tab, setTab] = useState("public");
  const [allUsers, setAllUsers] = useState([]);
  const searchTimeout = useRef(null);

  const buildLeaderboard = useCallback((me, fs, sessions) => {
    const myFs = fs.filter(f =>
      (f.requester_email === me?.email || f.recipient_email === me?.email) && f.status === "accepted"
    );
    const friendEmails = myFs.map(f =>
      f.requester_email === me?.email ? f.recipient_email : f.requester_email
    );
    const participantEmails = [me?.email, ...friendEmails].filter(Boolean);
    const stats = {};
    for (const email of participantEmails) {
      const userSessions = sessions.filter(s => {
        const se = (s.user_email || "").toLowerCase();
        const cb = (s.created_by || "").toLowerCase();
        const em = email.toLowerCase();
        return se === em || cb === em;
      });
      const quizSessions = userSessions.filter(s => s.session_type === "quiz" && s.quiz_score != null);
      const cardsReviewed = userSessions.filter(s => s.session_type !== "browsing").reduce((a, s) => a + (s.cards_reviewed || 0), 0);
      stats[email] = {
        email,
        name: email === me?.email ? (me?.full_name || "You") : (
          myFs.find(f => f.requester_email === email)?.requester_name ||
          myFs.find(f => f.recipient_email === email)?.recipient_name ||
          email
        ),
        minutes: userSessions.reduce((a, s) => a + (s.duration_minutes || 0), 0),
        cardsReviewed,
        avgScore: quizSessions.length > 0
          ? Math.round(quizSessions.reduce((a, s) => a + (s.quiz_score || 0), 0) / quizSessions.length)
          : 0,
        quizzes: quizSessions.length,
        isMe: email === me?.email,
      };
    }
    return Object.values(stats).sort((a, b) => b.cardsReviewed - a.cardsReviewed);
  }, []);

  const buildPublicLeaderboard = useCallback((sessions, usersData) => {
    const stats = {};
    sessions.filter(s => s.session_type !== "browsing").forEach(s => {
      const email = s.user_email || s.created_by || "";
      if (!email) return;
      if (!stats[email]) {
        const u = usersData.find(u => u.email === email);
        stats[email] = {
          email,
          name: u?.display_name || u?.full_name || email.split("@")[0],
          avatar: u?.profile_picture_url || null,
          minutes: 0,
          cardsReviewed: 0,
          quizTotal: 0,
          quizCount: 0,
        };
      }
      stats[email].minutes += s.duration_minutes || 0;
      stats[email].cardsReviewed += s.cards_reviewed || 0;
      if (s.session_type === "quiz" && s.quiz_score != null) {
        stats[email].quizTotal += s.quiz_score || 0;
        stats[email].quizCount++;
      }
    });
    return Object.values(stats)
      .map(e => ({ ...e, avgScore: e.quizCount > 0 ? Math.round(e.quizTotal / e.quizCount) : 0 }))
      .sort((a, b) => b.cardsReviewed - a.cardsReviewed)
      .slice(0, 50);
  }, []);

  const load = useCallback(async () => {
    const me = await db.auth.me();
    setUser(me);
    const [fs, sessions, allUsersData] = await Promise.all([
      db.entities.Friendship.list("-created_date", 100),
      db.entities.StudySession.list("-created_date", 2000),
      db.entities.User.list("-created_date", 500).catch(() => []),
    ]);
    setFriendships(fs);
    setAllUsers(allUsersData.filter(u => u.email !== me?.email));
    setLeaderboard(buildLeaderboard(me, fs, sessions));
    setPublicLeaderboard(buildPublicLeaderboard(sessions, allUsersData));
    setLoading(false);
  }, [buildLeaderboard, buildPublicLeaderboard]);

  useEffect(() => {
    load();
  }, [load]);

  const refreshLeaderboard = useCallback(async (currentUser) => {
    const [fs, sessions, allUsersData] = await Promise.all([
      db.entities.Friendship.list("-created_date", 100),
      db.entities.StudySession.list("-created_date", 2000),
      db.entities.User.list("-created_date", 500).catch(() => []),
    ]);
    setFriendships(fs);
    setLeaderboard(buildLeaderboard(currentUser, fs, sessions));
    setPublicLeaderboard(buildPublicLeaderboard(sessions, allUsersData));
  }, [buildLeaderboard, buildPublicLeaderboard]);

  // Live update leaderboard via real-time subscription
  useEffect(() => {
    const unsub = db.entities.StudySession.subscribe(() => {
      if (!user) return;
      refreshLeaderboard(user);
    });
    return unsub;
  }, [user, refreshLeaderboard]);

  // Live update friendships
  useEffect(() => {
    const unsub = db.entities.Friendship.subscribe(() => {
      if (!user) return;
      refreshLeaderboard(user);
    });
    return unsub;
  }, [user, refreshLeaderboard]);

  // Search users by name with debounce
  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    setSearchLoading(true);
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      const q = searchQuery.toLowerCase();
      const results = allUsers.filter(u =>
        (u.full_name && u.full_name.toLowerCase().includes(q)) ||
        (u.email && u.email.toLowerCase().includes(q))
      ).slice(0, 8);
      setSearchResults(results);
      setSearchLoading(false);
    }, 300);
  }, [searchQuery, allUsers]);

  const sendFriendRequest = async (targetUser) => {
    if (!targetUser || !user) return;
    const alreadyFriends = friendships.some(f =>
      (f.requester_email === user.email && f.recipient_email === targetUser.email) ||
      (f.recipient_email === user.email && f.requester_email === targetUser.email)
    );
    if (alreadyFriends) {
      setAddMsg({ type: "error", text: t('alreadyFriendsPending') });
      return;
    }
    setAdding(true);
    setAddMsg(null);
    await db.entities.Friendship.create({
      requester_email: user.email,
      requester_name: user.full_name || user.email,
      recipient_email: targetUser.email,
      recipient_name: targetUser.full_name || targetUser.email,
      status: "pending",
    });
    setAddMsg({ type: "success", text: `${t('friendRequestSent')} ${targetUser.full_name || targetUser.email}!` });
    setSearchQuery("");
    setSearchResults([]);
    const updated = await db.entities.Friendship.list("-created_date", 100);
    setFriendships(updated);
    setAdding(false);
  };

  const respondToRequest = async (id, status) => {
    await db.entities.Friendship.update(id, { status });
    const updated = await db.entities.Friendship.list("-created_date", 100);
    setFriendships(updated);
  };

  const removeFriend = async (id) => {
    setFriendships(prev => prev.filter(f => f.id !== id));
    await db.entities.Friendship.delete(id);
  };

  const pendingReceived = friendships.filter(f =>
    f.recipient_email === user?.email && f.status === "pending"
  );
  const myFriends = friendships.filter(f =>
    (f.requester_email === user?.email || f.recipient_email === user?.email) && f.status === "accepted"
  );
  const pendingSent = friendships.filter(f =>
    f.requester_email === user?.email && f.status === "pending"
  );

  const bgStyle = { background: "var(--app-bg)", color: "var(--app-text)" };
  const cardStyle = { background: "var(--app-surface)", border: "1px solid var(--app-border)" };
  const mutedStyle = { color: "var(--app-text-muted)" };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={bgStyle}>
      <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen pb-28 px-6 py-10" style={bgStyle}>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight mb-1">{t('compete')}</h1>
          <p className="text-sm" style={mutedStyle}>{t('competeDesc')}</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-1.5 rounded-2xl mb-6" style={cardStyle}>
          {[
            { id: "public", label: "Global", icon: Globe },
            { id: "leaderboard", label: "Friends", icon: Trophy },
            { id: "friends", label: t('friends'), icon: Users },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                tab === id
                  ? "bg-gradient-to-r from-violet-600/60 to-blue-600/60 text-white border border-violet-500/30"
                  : ""
              }`}
              style={tab !== id ? mutedStyle : {}}
            >
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>

        {/* Public Leaderboard */}
        {tab === "public" && (
          <div>
            <p className="text-xs font-semibold opacity-40 uppercase tracking-widest mb-4">🌐 All Cognita Users — Top 50 by Cards Reviewed</p>
            {publicLeaderboard.length === 0 ? (
              <div className="text-center py-16 rounded-3xl" style={cardStyle}>
                <Globe className="w-12 h-12 text-white/10 mx-auto mb-4" />
                <p className="font-semibold" style={mutedStyle}>No data yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {publicLeaderboard.map((entry, i) => {
                  const isMe = entry.email === user?.email;
                  return (
                    <div key={entry.email} className={`rounded-3xl p-4 flex items-center gap-4 ${isMe ? "ring-1 ring-violet-500/40" : ""}`} style={cardStyle}>
                      <div className={`w-9 h-9 rounded-2xl flex items-center justify-center text-base font-black shrink-0 ${
                        i === 0 ? "bg-amber-500/20 text-amber-400" :
                        i === 1 ? "bg-slate-500/20 text-slate-300" :
                        i === 2 ? "bg-orange-700/20 text-orange-400" :
                        "bg-white/[0.05] text-white/30 text-sm"
                      }`}>
                        {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                      </div>
                      {entry.avatar
                        ? <img src={entry.avatar} alt="" className="w-9 h-9 rounded-2xl object-cover shrink-0" />
                        : <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-violet-600/30 to-blue-600/30 flex items-center justify-center text-sm font-black shrink-0">{entry.name[0]?.toUpperCase()}</div>
                      }
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate">{isMe ? `${entry.name} (You)` : entry.name}</p>
                        <p className="text-xs mt-0.5" style={mutedStyle}>{entry.minutes}m studied · {entry.avgScore > 0 ? `${entry.avgScore}% avg` : "—"}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="flex items-center gap-1 justify-end text-violet-400 text-sm font-black">
                          <Medal className="w-3.5 h-3.5" /> {entry.cardsReviewed.toLocaleString()}
                        </div>
                        <p className="text-[10px] opacity-40 mt-0.5">cards</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Friends Leaderboard */}
        {tab === "leaderboard" && (
          <div>
            <p className="text-xs font-semibold opacity-40 uppercase tracking-widest mb-4">🏆 You + Your Friends</p>
            {leaderboard.length === 0 ? (
              <div className="text-center py-16 rounded-3xl" style={cardStyle}>
                <Trophy className="w-12 h-12 text-white/10 mx-auto mb-4" />
                <p className="font-semibold mb-1" style={mutedStyle}>{t('noFriendsYet')}</p>
                <p className="text-sm" style={{ ...mutedStyle, opacity: 0.6 }}>{t('addFriendsToSeeLeaderboard')}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {leaderboard.map((entry, i) => (
                  <div key={entry.email} className={`rounded-3xl p-5 flex items-center gap-4 ${entry.isMe ? "ring-1 ring-violet-500/40" : ""}`} style={cardStyle}>
                    <div className={`w-9 h-9 rounded-2xl flex items-center justify-center text-lg font-black shrink-0 ${
                      i === 0 ? "bg-amber-500/20 text-amber-400" :
                      i === 1 ? "bg-slate-500/20 text-slate-300" :
                      i === 2 ? "bg-orange-700/20 text-orange-400" :
                      "bg-white/[0.05] text-white/30"
                    }`}>
                      {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate">{entry.isMe ? `${entry.name} (You)` : entry.name}</p>
                      <p className="text-xs mt-0.5" style={mutedStyle}>{entry.email}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-1 justify-end text-violet-400 text-sm font-bold">
                        <Medal className="w-3.5 h-3.5" /> {entry.cardsReviewed} cards
                      </div>
                      <div className="flex items-center gap-1 justify-end mt-0.5 text-blue-400 text-xs font-medium">
                        <Clock className="w-3 h-3" /> {entry.minutes}m
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "friends" && (
          <div className="space-y-4">
            {/* Add friend by name search */}
            <div className="rounded-3xl p-5" style={cardStyle}>
              <h3 className="font-bold text-sm mb-3">{t('addFriend')}</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={mutedStyle} />
                <input
                  value={searchQuery}
                  onChange={e => { setSearchQuery(e.target.value); setAddMsg(null); }}
                  placeholder={t('searchByNameOrEmail')}
                  className="w-full pl-9 pr-4 py-2.5 rounded-2xl text-sm outline-none"
                  style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)", color: "var(--app-text)" }}
                />
                {searchLoading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-400 animate-spin" />}
              </div>

              {/* Dropdown results */}
              {searchResults.length > 0 && (
                <div className="mt-2 rounded-2xl overflow-hidden border" style={{ borderColor: "var(--app-border)" }}>
                  {searchResults.map((u, i) => (
                    <button
                      key={u.id || u.email}
                      onClick={() => sendFriendRequest(u)}
                      disabled={adding}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-violet-500/10 transition-all border-b last:border-0"
                      style={{ background: "var(--app-surface)", borderColor: "var(--app-border)" }}
                    >
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600/30 to-blue-600/30 flex items-center justify-center text-sm font-bold shrink-0">
                        {(u.full_name || u.email)?.[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{u.full_name || "Unknown"}</p>
                        <p className="text-xs truncate" style={mutedStyle}>{u.email}</p>
                      </div>
                      <UserPlus className="w-4 h-4 text-violet-400 shrink-0" />
                    </button>
                  ))}
                </div>
              )}

              {searchQuery.trim() && !searchLoading && searchResults.length === 0 && (
                <p className="text-xs mt-2" style={mutedStyle}>{t('noUsersFound')} "{searchQuery}"</p>
              )}

              {addMsg && (
                <p className={`text-sm mt-2 ${addMsg.type === "success" ? "text-emerald-400" : "text-red-400"}`}>{addMsg.text}</p>
              )}
            </div>

            {/* Pending requests received */}
            {pendingReceived.length > 0 && (
              <div className="rounded-3xl p-5" style={cardStyle}>
                <h3 className="font-bold text-sm mb-3 text-violet-400">{t('pendingRequests')} ({pendingReceived.length})</h3>
                <div className="space-y-2">
                  {pendingReceived.map(f => (
                    <div key={f.id} className="flex items-center justify-between gap-3 py-2">
                      <div>
                        <p className="text-sm font-medium">{f.requester_name || f.requester_email}</p>
                        <p className="text-xs" style={mutedStyle}>{f.requester_email}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => respondToRequest(f.id, "accepted")}
                          className="flex items-center gap-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                        >
                          <Check className="w-3.5 h-3.5" /> {t('accept')}
                        </button>
                        <button
                          onClick={() => respondToRequest(f.id, "declined")}
                          className="flex items-center gap-1 bg-red-600/10 hover:bg-red-600/20 text-red-400 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                        >
                          <X className="w-3.5 h-3.5" /> {t('decline')}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Friends list */}
            {myFriends.length > 0 && (
              <div className="rounded-3xl p-5" style={cardStyle}>
                <h3 className="font-bold text-sm mb-3">{t('myFriends')} ({myFriends.length})</h3>
                <div className="space-y-2">
                  {myFriends.map(f => {
                    const friendName = f.requester_email === user?.email
                      ? (f.recipient_name || f.recipient_email)
                      : (f.requester_name || f.requester_email);
                    const friendEmail = f.requester_email === user?.email ? f.recipient_email : f.requester_email;
                    return (
                      <div key={f.id} className="flex items-center justify-between gap-3 py-2 border-b last:border-0" style={{ borderColor: "var(--app-border)" }}>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600/30 to-blue-600/30 flex items-center justify-center text-sm font-bold">
                            {(friendName || friendEmail)[0]?.toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{friendName}</p>
                            <p className="text-xs" style={mutedStyle}>{friendEmail}</p>
                          </div>
                        </div>
                        <button onClick={() => removeFriend(f.id)} className="text-white/20 hover:text-red-400 p-1.5 rounded-lg transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {pendingSent.length > 0 && (
              <div className="rounded-3xl p-5" style={cardStyle}>
                <h3 className="font-bold text-sm mb-3" style={mutedStyle}>{t('sentRequests')}</h3>
                <div className="space-y-2">
                  {pendingSent.map(f => (
                    <div key={f.id} className="flex items-center justify-between py-2">
                      <p className="text-sm" style={mutedStyle}>{f.recipient_name || f.recipient_email}</p>
                      <span className="text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">{t('pending')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {myFriends.length === 0 && pendingReceived.length === 0 && pendingSent.length === 0 && (
              <div className="text-center py-12 rounded-3xl" style={cardStyle}>
                <Users className="w-12 h-12 mx-auto mb-3 opacity-10" />
                <p className="font-semibold mb-1" style={mutedStyle}>{t('noFriendsYet')}</p>
                <p className="text-sm" style={{ ...mutedStyle, opacity: 0.6 }}>{t('searchFriendsHint')}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}