import { db } from '@/lib/firebase';

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { Users, UserPlus, MessageCircle, Bell, Flag, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Creates a persistent notification for a specific user
export async function createAppNotification({ recipient_email, title, message, icon = "bell", link = "" }) {
  try {
    await db.entities.AppNotification.create({ recipient_email, title, message, icon, link, read: false });
  } catch (e) {
    console.error("Failed to create notification", e);
  }
}

export default function NotificationBanner() {
  const [notifications, setNotifications] = useState([]);
  const userRef = useRef(null);
  const shownIdsRef = useRef(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    let unsubFriend, unsubGroup, unsubNotif;

    db.auth.me().then(async (u) => {
      if (!u) return;
      userRef.current = u;

      // --- 1. Subscribe to AppNotification (card reports, study reminders, etc.) ---
      // Poll every 10 seconds for new unread notifications for this user
      const pollNotifications = async () => {
        try {
          const notifs = await db.entities.AppNotification.filter({ recipient_email: u.email, read: false });
          for (const n of notifs) {
            if (!shownIdsRef.current.has(n.id)) {
              shownIdsRef.current.add(n.id);
              showBanner({
                id: n.id,
                icon: n.icon || "bell",
                title: n.title,
                message: n.message,
                link: n.link || "",
              });
              // Mark as read after showing
              db.entities.AppNotification.update(n.id, { read: true }).catch(() => {});
            }
          }
        } catch {}
      };

      pollNotifications();
      const pollInterval = setInterval(pollNotifications, 10000);

      // --- Streak reminder ---
      const STREAK_REMINDER_KEY = `cognita_streak_reminder_${u.email}_${new Date().toISOString().slice(0, 10)}`;
      if (!localStorage.getItem(STREAK_REMINDER_KEY)) {
        try {
          const today = new Date().toISOString().slice(0, 10);
          const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
          const sessions = await db.entities.StudySession.filter({ user_email: u.email });
          const studiedToday = sessions.some(s => s.created_date?.slice(0, 10) === today);
          const studiedYesterday = sessions.some(s => s.created_date?.slice(0, 10) === yesterday);
          if (!studiedToday && studiedYesterday) {
            localStorage.setItem(STREAK_REMINDER_KEY, "1");
            showBanner({
              id: "streak_reminder_" + today,
              icon: "streak",
              title: "🔥 Keep your streak alive!",
              message: "You studied yesterday — study today to keep your streak going!",
            });
          }
        } catch {}
      }

      // --- 2. Real-time: AppNotification subscribe ---
      unsubNotif = db.entities.AppNotification.subscribe((event) => {
        const me = userRef.current;
        if (!me) return;
        if (event.type !== "create") return;
        if (event.data?.recipient_email !== me.email) return;
        if (shownIdsRef.current.has(event.data.id)) return;
        shownIdsRef.current.add(event.data.id);
        showBanner({
          id: event.data.id || ("notif_" + Date.now()),
          icon: event.data.icon || "bell",
          title: event.data.title,
          message: event.data.message,
          link: event.data.link || "",
        });
        db.entities.AppNotification.update(event.data.id, { read: true }).catch(() => {});
      });

      // Request push permission on load
      if ("Notification" in window && Notification.permission === "default") {
        Notification.requestPermission().catch(() => {});
      }

      // --- 3. Friend requests ---
      unsubFriend = db.entities.Friendship.subscribe((event) => {
        const me = userRef.current;
        if (!me) return;
        if (event.type === "create" && event.data?.recipient_email === me.email) {
          const msg = `${event.data.requester_name || event.data.requester_email} sent you a friend request`;
          showBanner({ id: "friend_" + event.id, icon: "friend", title: "New Friend Request", message: msg });
          sendPushNotification("New Friend Request", msg);
        }
        if (event.type === "update" && event.data?.requester_email === me.email && event.data?.status === "accepted") {
          const msg = `${event.data.recipient_name || event.data.recipient_email} accepted your friend request`;
          showBanner({ id: "friendacc_" + event.id, icon: "friend", title: "Friend Request Accepted", message: msg });
        }
      });

      // --- 4. Group added ---
      const prevMembers = {};
      const myGroups = new Set();
      try {
        const groups = await db.entities.StudyGroup.list("-created_date", 500);
        groups.forEach(g => {
          prevMembers[g.id] = g.members || [];
          if ((g.members || []).includes(u.email)) myGroups.add(g.id);
        });
      } catch (e) {
        console.warn("NotificationBanner: failed to load groups", e);
      }

      unsubGroup = db.entities.StudyGroup.subscribe((event) => {
        const me = userRef.current;
        if (!me) return;
        const newMems = event.data?.members || [];
        const prev = prevMembers[event.id] || [];
        const wasAdded = newMems.includes(me.email) && !prev.includes(me.email);
        prevMembers[event.id] = newMems;
        if (newMems.includes(me.email)) myGroups.add(event.id);
        else myGroups.delete(event.id);
        if (wasAdded) {
          const msg = `You've been added to "${event.data?.name}"`;
          showBanner({ id: "group_" + event.id + "_" + Date.now(), icon: "group", title: "Added to Study Group", message: msg });
          sendPushNotification("Added to Study Group", msg);
        }
      });

      // Group messages are now handled via AppNotification records (persistent, works offline)
      // The poll above picks them up. No separate GroupMessage subscription needed here.

      return () => clearInterval(pollInterval);
    }).catch(() => {});

    return () => {
      unsubFriend?.();
      unsubGroup?.();
      unsubNotif?.();
    };
  }, []);

  const sendPushNotification = (title, body) => {
    if ("Notification" in window && Notification.permission === "granted") {
      try { new Notification(title, { body, icon: "/favicon.ico" }); } catch {}
    }
  };

  const showBanner = (notif) => {
    setNotifications(prev => {
      if (prev.find(n => n.id === notif.id)) return prev;
      return [...prev, { ...notif, timestamp: Date.now() }];
    });
    // No auto-dismiss — stays until user clicks X
  };

  const dismiss = (id) => setNotifications(prev => prev.filter(n => n.id !== id));

  const iconEl = (icon) => {
    if (icon === "group") return <Users className="w-4 h-4 text-violet-400" />;
    if (icon === "message") return <MessageCircle className="w-4 h-4 text-blue-400" />;
    if (icon === "friend") return <UserPlus className="w-4 h-4 text-emerald-400" />;
    if (icon === "flag") return <Flag className="w-4 h-4 text-red-400" />;
    if (icon === "streak") return <span className="text-base">🔥</span>;
    return <Bell className="w-4 h-4 text-amber-400" />;
  };

  const iconBg = (icon) => {
    if (icon === "group") return "bg-violet-500/20";
    if (icon === "message") return "bg-blue-500/20";
    if (icon === "friend") return "bg-emerald-500/20";
    if (icon === "flag") return "bg-red-500/20";
    if (icon === "streak") return "bg-orange-500/20";
    return "bg-amber-500/20";
  };

  return (
    <div className="fixed top-4 right-4 z-[999] flex flex-col gap-2 max-w-xs w-full pointer-events-none">
      <AnimatePresence>
        {notifications.map(notif => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, x: 60, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className={`pointer-events-auto flex items-start gap-3 rounded-2xl px-4 py-3 shadow-xl ${notif.link ? "cursor-pointer hover:opacity-90 active:scale-[0.98] transition-all" : ""}`}
            style={{ background: "var(--app-surface-solid, var(--app-surface))", border: "1px solid var(--app-border)" }}
            onClick={() => {
              if (notif.link) {
                navigate(notif.link);
                dismiss(notif.id);
              }
            }}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${iconBg(notif.icon)}`}>
              {iconEl(notif.icon)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold" style={{ color: "var(--app-text)" }}>{notif.title}</p>
              <p className="text-xs mt-0.5 leading-snug" style={{ color: "var(--app-text-muted)" }}>{notif.message}</p>
              {notif.link && <p className="text-[10px] mt-1 text-violet-400 font-semibold">Tap to open →</p>}
            </div>
            <button onClick={(e) => { e.stopPropagation(); dismiss(notif.id); }} className="p-1 rounded-lg opacity-40 hover:opacity-80 shrink-0">
              <X className="w-3.5 h-3.5" style={{ color: "var(--app-text)" }} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}