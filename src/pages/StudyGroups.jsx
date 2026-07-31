import { db } from '@/lib/firebase';

import { useState, useEffect, useRef } from "react";
import { useTranslation } from "../hooks/useTranslation";

import { Plus, Users, Send, Loader2, Trash2, ArrowLeft, MessageCircle, UserMinus, UserCheck, UserX, UserPlus, X, Smile } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import ConfirmDialog from "@/components/ConfirmDialog";
import EmojiPicker from "@/components/EmojiPicker";

const OWNER_EMAIL = "yychang100@student.hbuhsd.edu";

export default function StudyGroups() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const groupId = params.get("group_id");
  if (groupId) return <GroupChat key={groupId} groupId={groupId} />;
  return <GroupList />;
}

function isGroupOwner(group, userEmail) {
  return group.owner_email === userEmail || group.created_by === userEmail || userEmail === OWNER_EMAIL;
}

function GroupList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [inviteEmails, setInviteEmails] = useState("");
  const [addMemberEmail, setAddMemberEmail] = useState({});
  const [allUsers, setAllUsers] = useState([]);
  const [userSuggestions, setUserSuggestions] = useState({});
  const [confirm, setConfirm] = useState(null); // { type, data }

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const [me, g] = await Promise.all([
      db.auth.me(),
      db.entities.StudyGroup.list("-created_date", 50),
    ]);
    setUser(me);
    setGroups(g);
    try {
      const users = await db.entities.User.list();
      setAllUsers(users);
    } catch { setAllUsers([]); }
    setLoading(false);
  };

  const createGroup = async () => {
    if (!name.trim()) return;
    const extraMembers = inviteEmails.split(",").map(e => e.trim()).filter(e => e && e.includes("@"));
    const members = [user.email, ...extraMembers];
    const group = await db.entities.StudyGroup.create({
      name: name.trim(),
      description: description.trim(),
      subject: subject.trim(),
      members,
      member_count: members.length,
      owner_email: user.email,
    });
    setGroups(prev => [group, ...prev]);
    setName(""); setDescription(""); setSubject(""); setInviteEmails("");
    setShowCreate(false);
  };

  const addMember = async (group, email) => {
    const resolvedEmail = email.trim();
    if (!resolvedEmail || !resolvedEmail.includes("@")) return;
    const members = group.members || [];
    if (members.includes(resolvedEmail)) return;
    const newMembers = [...members, resolvedEmail];
    const updated = await db.entities.StudyGroup.update(group.id, { members: newMembers, member_count: newMembers.length });
    setGroups(prev => prev.map(g => g.id === group.id ? updated : g));
    setAddMemberEmail(prev => ({ ...prev, [group.id]: "" }));
    setUserSuggestions(prev => ({ ...prev, [group.id]: [] }));
  };

  const handleAddMemberInput = (groupId, value) => {
    setAddMemberEmail(prev => ({ ...prev, [groupId]: value }));
    if (value.length < 2) { setUserSuggestions(prev => ({ ...prev, [groupId]: [] })); return; }
    const q = value.toLowerCase();
    const matches = allUsers.filter(u => (u.full_name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q))).slice(0, 5);
    setUserSuggestions(prev => ({ ...prev, [groupId]: matches }));
  };

  const requestJoin = async (group) => {
    const requests = group.join_requests || [];
    if (requests.includes(user.email)) return;
    const updated = await db.entities.StudyGroup.update(group.id, { join_requests: [...requests, user.email] });
    setGroups(prev => prev.map(g => g.id === group.id ? updated : g));
  };

  const acceptRequest = async (group, email) => {
    const members = [...(group.members || []), email];
    const requests = (group.join_requests || []).filter(r => r !== email);
    const updated = await db.entities.StudyGroup.update(group.id, { members, member_count: members.length, join_requests: requests });
    setGroups(prev => prev.map(g => g.id === group.id ? updated : g));
  };

  const denyRequest = async (group, email) => {
    const requests = (group.join_requests || []).filter(r => r !== email);
    const updated = await db.entities.StudyGroup.update(group.id, { join_requests: requests });
    setGroups(prev => prev.map(g => g.id === group.id ? updated : g));
  };

  const removeMember = async (group, email) => {
    const members = (group.members || []).filter(m => m !== email);
    const updated = await db.entities.StudyGroup.update(group.id, { members, member_count: members.length });
    setGroups(prev => prev.map(g => g.id === group.id ? updated : g));
  };

  const leaveGroup = async (group) => {
    const members = (group.members || []).filter(m => m !== user.email);
    const updated = await db.entities.StudyGroup.update(group.id, { members, member_count: members.length });
    setGroups(prev => prev.map(g => g.id === group.id ? updated : g));
    setConfirm(null);
  };

  const deleteGroup = async (id) => {
    setGroups(prev => prev.filter(g => g.id !== id));
    await db.entities.StudyGroup.delete(id);
    setConfirm(null);
  };

  const bgStyle = { background: "var(--app-bg)", color: "var(--app-text)" };
  const cardStyle = { background: "var(--app-surface)", border: "1px solid var(--app-border)" };
  const mutedStyle = { color: "var(--app-text-muted)" };
  const inputStyle = { background: "var(--app-bg)", border: "1px solid var(--app-border)", color: "var(--app-text)" };

  return (
    <div className="min-h-screen pb-28 px-6 py-10" style={bgStyle}>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight mb-1">{t('groups')}</h1>
            <p className="text-sm" style={mutedStyle}>{t('groupsDesc')}</p>
          </div>
          <button onClick={() => setShowCreate(!showCreate)} className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all">
            <Plus className="w-4 h-4" /> {t('createGroup')}
          </button>
        </div>

        {showCreate && (
          <div className="rounded-3xl p-6 mb-6" style={cardStyle}>
            <h3 className="font-bold mb-4">{t('createGroup')}</h3>
            <div className="space-y-3">
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Group name *" className="w-full px-4 py-3 rounded-2xl text-sm outline-none" style={inputStyle} />
              <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Subject (e.g. Biology)" className="w-full px-4 py-3 rounded-2xl text-sm outline-none" style={inputStyle} />
              <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description..." rows={2} className="w-full px-4 py-3 rounded-2xl text-sm outline-none resize-none" style={inputStyle} />
              <input value={inviteEmails} onChange={e => setInviteEmails(e.target.value)} placeholder="Invite members by email (comma-separated)" className="w-full px-4 py-3 rounded-2xl text-sm outline-none" style={inputStyle} />
              <div className="flex gap-3">
                <button onClick={() => setShowCreate(false)} className="flex-1 py-3 rounded-2xl text-sm font-semibold" style={cardStyle}>{t('cancel')}</button>
                <button onClick={createGroup} disabled={!name.trim()} className="flex-1 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white py-3 rounded-2xl text-sm font-semibold transition-all">{t('createGroup')}</button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 text-violet-500 animate-spin" /></div>
        ) : groups.length === 0 ? (
          <div className="text-center py-16 rounded-3xl" style={cardStyle}>
            <Users className="w-12 h-12 mx-auto mb-4 opacity-10" />
            <p className="font-semibold" style={mutedStyle}>No study groups yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {groups.map(group => {
              const isMember = (group.members || []).includes(user?.email);
              const isOwner = isGroupOwner(group, user?.email);
              const hasRequested = (group.join_requests || []).includes(user?.email);
              return (
                <div key={group.id} className="rounded-3xl p-5" style={cardStyle}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm">{group.name}</p>
                      <p className="text-xs mt-0.5" style={mutedStyle}>
                        {group.subject && <span>{group.subject} · </span>}
                        {group.member_count || 0} member{(group.member_count || 0) !== 1 ? "s" : ""}
                      </p>
                      {group.description && <p className="text-xs mt-1 line-clamp-2" style={mutedStyle}>{group.description}</p>}
                    </div>
                    <div className="flex gap-2 shrink-0 flex-wrap justify-end">
                      {isMember ? (
                        <>
                          <button onClick={() => navigate(`/StudyGroups?group_id=${group.id}`)} className="flex items-center gap-1.5 bg-violet-500/20 text-violet-400 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-violet-500/30 transition-all">
                            <MessageCircle className="w-3.5 h-3.5" /> {t('chat')}
                          </button>
                          {!isOwner && (
                            <button onClick={() => setConfirm({ type: "leave", data: group })} className="px-3 py-2 rounded-xl text-xs font-semibold opacity-50 hover:opacity-80 transition-all" style={cardStyle}>
                              Leave
                            </button>
                          )}
                        </>
                      ) : (
                        <button onClick={() => requestJoin(group)} disabled={hasRequested} className="flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 px-3 py-2 rounded-xl text-xs font-semibold disabled:opacity-50">
                          <Plus className="w-3.5 h-3.5" />
                          {hasRequested ? "Requested" : "Request to Join"}
                        </button>
                      )}
                      {isOwner && (
                        <button onClick={() => setConfirm({ type: "delete_group", data: group })} className="p-2 rounded-xl opacity-30 hover:opacity-80 text-red-400 transition-all">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {isOwner && (
                    <div className="mt-3 pt-3 space-y-3" style={{ borderTop: "1px solid var(--app-border)" }}>
                      <div className="relative">
                        <div className="flex gap-2">
                          <input
                            value={addMemberEmail[group.id] || ""}
                            onChange={e => handleAddMemberInput(group.id, e.target.value)}
                            onKeyDown={e => e.key === "Enter" && addMember(group, addMemberEmail[group.id] || "")}
                            placeholder="Add member by name or email..."
                            className="flex-1 px-3 py-2 rounded-xl text-xs outline-none"
                            style={inputStyle}
                          />
                          <button onClick={() => addMember(group, addMemberEmail[group.id] || "")} disabled={!addMemberEmail[group.id]?.includes("@")} className="flex items-center gap-1 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white px-3 py-2 rounded-xl text-xs font-semibold transition-all">
                            <UserPlus className="w-3.5 h-3.5" /> Add
                          </button>
                        </div>
                        {(userSuggestions[group.id] || []).length > 0 && (
                          <div className="absolute z-10 left-0 right-0 mt-1 rounded-xl overflow-hidden shadow-lg" style={cardStyle}>
                            {userSuggestions[group.id].map(u => (
                              <button key={u.id} onClick={() => { setAddMemberEmail(prev => ({ ...prev, [group.id]: u.email })); setUserSuggestions(prev => ({ ...prev, [group.id]: [] })); }} className="w-full text-left px-3 py-2 text-xs hover:bg-violet-500/10 flex items-center gap-2">
                                <span className="font-semibold">{u.full_name || u.email}</span>
                                {u.full_name && <span style={mutedStyle}>{u.email}</span>}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {(group.join_requests || []).length > 0 && (
                        <div>
                          <p className="text-xs font-semibold mb-1.5 text-amber-400">Join Requests ({group.join_requests.length})</p>
                          <div className="space-y-1.5">
                            {group.join_requests.map(email => (
                              <div key={email} className="flex items-center justify-between gap-2">
                                <p className="text-xs truncate" style={mutedStyle}>{email}</p>
                                <div className="flex gap-1.5">
                                  <button onClick={() => acceptRequest(group, email)} className="flex items-center gap-1 bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-lg text-xs font-semibold"><UserCheck className="w-3 h-3" /> Accept</button>
                                  <button onClick={() => denyRequest(group, email)} className="flex items-center gap-1 bg-red-500/10 text-red-400 px-2 py-1 rounded-lg text-xs font-semibold"><UserX className="w-3 h-3" /> Deny</button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <p className="text-xs font-semibold mb-1.5" style={mutedStyle}>Members ({(group.members || []).length})</p>
                        <div className="space-y-1">
                          {(group.members || []).map(email => (
                            <div key={email} className="flex items-center justify-between gap-2">
                              <p className="text-xs truncate" style={mutedStyle}>
                                {email} {email === user?.email && <span className="text-violet-400">(you)</span>}
                              </p>
                              {email !== user?.email && (
                                <button onClick={() => removeMember(group, email)} className="p-1 rounded-lg opacity-30 hover:opacity-80 text-red-400 transition-all"><UserMinus className="w-3 h-3" /></button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={confirm?.type === "delete_group"}
        title="Delete Group?"
        message={`Are you sure you want to delete "${confirm?.data?.name}"? All messages will be lost.`}
        confirmText="Delete Group"
        onConfirm={() => deleteGroup(confirm.data.id)}
        onCancel={() => setConfirm(null)}
      />
      <ConfirmDialog
        open={confirm?.type === "leave"}
        title="Leave Group?"
        message={`Are you sure you want to leave "${confirm?.data?.name}"?`}
        confirmText="Leave"
        danger={false}
        onConfirm={() => leaveGroup(confirm.data)}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
}

function GroupChat({ groupId }) {
  const [group, setGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyTo, setReplyTo] = useState(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    loadData();
    const unsub = db.entities.GroupMessage.subscribe((event) => {
      if (event.type === "create" && event.data?.group_id === groupId) {
        setMessages(prev => {
          if (prev.find(m => m.id === event.data.id)) return prev;
          return [...prev, event.data];
        });
      }
    });
    return unsub;
  }, [groupId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadData = async () => {
    const [me, groups, msgs] = await Promise.all([
      db.auth.me(),
      db.entities.StudyGroup.filter({ id: groupId }),
      db.entities.GroupMessage.filter({ group_id: groupId }, "created_date", 200),
    ]);
    setUser(me);
    setGroup(groups[0] || null);
    setMessages(msgs);
    setLoading(false);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const text = input.trim();
    setInput("");
    setReplyTo(null);
    setShowEmoji(false);
    const msgData = {
      group_id: groupId,
      sender_email: user.email,
      sender_name: user.full_name || user.email,
      content: text,
    };
    if (replyTo) {
      msgData.reply_to = {
        id: replyTo.id,
        sender_name: replyTo.sender_name,
        content: replyTo.content.slice(0, 100),
      };
    }
    const msg = await db.entities.GroupMessage.create(msgData);

    // Notify all OTHER group members (persistent — works for offline users too)
    const groupLink = `/StudyGroups?group_id=${groupId}`;
    const otherMembers = (group?.members || []).filter(email => email !== user.email);
    await Promise.all(otherMembers.map(recipientEmail =>
      db.entities.AppNotification.create({
        recipient_email: recipientEmail,
        title: `💬 ${user.full_name || user.email} in ${group?.name || "Group Chat"}`,
        message: text.length > 100 ? text.slice(0, 100) + "…" : text,
        icon: "message",
        link: groupLink,
        read: false,
      })
    ));
  };

  const bgStyle = { background: "var(--app-bg)", color: "var(--app-text)" };
  const cardStyle = { background: "var(--app-surface)", border: "1px solid var(--app-border)" };
  const mutedStyle = { color: "var(--app-text-muted)" };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={bgStyle}>
      <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
    </div>
  );

  return (
    <div className="flex flex-col" style={{ ...bgStyle, height: "100dvh" }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 shrink-0" style={{ borderBottom: "1px solid var(--app-border)", background: "var(--app-nav-bg)" }}>
        <Link to={createPageUrl("StudyGroups")}>
          <button className="p-2 rounded-xl opacity-60 hover:opacity-100 transition-all">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setShowMembers(true)}>
          <p className="font-bold text-sm truncate">{group?.name || "Group Chat"}</p>
          <p className="text-xs" style={mutedStyle}>{group?.member_count || 0} members · tap to view</p>
        </div>
        <button onClick={() => setShowMembers(true)} className="p-2 rounded-xl opacity-60 hover:opacity-100 transition-all">
          <Users className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2" onClick={() => setShowEmoji(false)}>
        {messages.length === 0 && (
          <div className="text-center py-16">
            <MessageCircle className="w-10 h-10 mx-auto mb-3 opacity-10" />
            <p className="text-sm" style={mutedStyle}>No messages yet. Start the conversation!</p>
          </div>
        )}
        {messages.map((msg, i) => {
          const isMe = msg.sender_email === user?.email;
          return (
            <div key={msg.id || i} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div className="max-w-[78%]">
                {/* Reply preview in message */}
                {msg.reply_to && (
                  <div className={`text-xs px-3 py-1.5 rounded-xl mb-1 border-l-2 ${isMe ? "border-violet-300/50 bg-violet-700/20 text-violet-200/70" : "border-violet-500/50 bg-violet-500/10"}`}>
                    <p className="font-bold text-violet-400 text-[10px] mb-0.5">{msg.reply_to.sender_name}</p>
                    <p className="truncate opacity-70">{msg.reply_to.content}</p>
                  </div>
                )}
                <div
                  className={`px-4 py-3 rounded-2xl text-sm leading-relaxed cursor-pointer hover:opacity-90 transition-opacity ${isMe ? "bg-violet-600 text-white rounded-br-sm" : "rounded-bl-sm"}`}
                  style={!isMe ? cardStyle : {}}
                  onClick={() => { setReplyTo(msg); inputRef.current?.focus(); }}
                  title="Click to reply"
                >
                  {!isMe && <p className="text-[10px] font-semibold mb-1 text-violet-400">{msg.sender_name}</p>}
                  <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Reply preview bar */}
      {replyTo && (
        <div className="px-4 py-2 shrink-0 flex items-center gap-2 border-t border-violet-500/20" style={{ background: "rgba(139,92,246,0.05)" }}>
          <div className="w-0.5 h-8 bg-violet-500 rounded-full shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-violet-400">Replying to {replyTo.sender_name}</p>
            <p className="text-xs truncate" style={mutedStyle}>{replyTo.content}</p>
          </div>
          <button onClick={() => setReplyTo(null)} className="p-1 opacity-50 hover:opacity-100 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Emoji picker */}
      {showEmoji && (
        <div className="px-4 pb-2 shrink-0 relative">
          <EmojiPicker onSelect={e => { setInput(prev => prev + e); inputRef.current?.focus(); }} onClose={() => setShowEmoji(false)} />
        </div>
      )}

      {/* Input */}
      <div className="px-4 py-3 pb-24 md:pb-4 shrink-0" style={{ borderTop: "1px solid var(--app-border)", background: "var(--app-nav-bg)" }}>
        <div className="flex gap-2 max-w-3xl mx-auto items-center">
          <div className="relative">
            <button
              onClick={() => setShowEmoji(!showEmoji)}
              className={`p-2 rounded-xl transition-all ${showEmoji ? "opacity-100 text-violet-400" : "opacity-50 hover:opacity-80"}`}
            >
              <Smile className="w-5 h-5" />
            </button>
          </div>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder={replyTo ? "Type a reply..." : "Type a message..."}
            className="flex-1 px-4 py-3 rounded-2xl text-sm outline-none"
            style={{ background: "var(--app-surface)", border: "1px solid var(--app-border)", color: "var(--app-text)" }}
            onClick={() => setShowEmoji(false)}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white px-4 py-3 rounded-2xl transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Members panel */}
      {showMembers && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowMembers(false)} />
          <div className="relative w-72 h-full flex flex-col overflow-hidden" style={{ background: "var(--app-surface-solid)", borderLeft: "1px solid var(--app-border)" }}>
            <div className="flex items-center justify-between px-5 py-4 shrink-0" style={{ borderBottom: "1px solid var(--app-border)" }}>
              <h3 className="font-bold">Members ({(group?.members || []).length})</h3>
              <button onClick={() => setShowMembers(false)} className="p-1 opacity-60 hover:opacity-100 transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {(group?.members || []).map(email => (
                <div key={email} className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: "var(--app-surface)", border: "1px solid var(--app-border)" }}>
                  <div className="w-9 h-9 rounded-full bg-violet-500/20 flex items-center justify-center shrink-0">
                    <span className="text-xs font-black text-violet-400">{email[0]?.toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate">{email}</p>
                    <div className="flex gap-1 mt-0.5">
                      {isGroupOwner({ ...group, created_by: group?.created_by }, email) && (
                        <span className="text-[10px] text-violet-400 font-bold">Owner</span>
                      )}
                      {email === user?.email && <span className="text-[10px] text-emerald-400 font-bold">You</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}