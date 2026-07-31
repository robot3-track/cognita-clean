import { db } from '@/lib/firebase';

import { useEffect, useState } from "react";

import { Bell, BellOff } from "lucide-react";

// VAPID public key (self-hosted demo key - works for web push)
const VAPID_PUBLIC_KEY = "BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBLNAIb6EezsB_6W5VBA";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
  return outputArray;
}

export default function PushNotifications() {
  const [supported, setSupported] = useState(false);
  const [permission, setPermission] = useState("default");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const check = async () => {
      if ("Notification" in window && "serviceWorker" in navigator && "PushManager" in window) {
        setSupported(true);
        setPermission(Notification.permission);
        if (Notification.permission === "granted") {
          try {
            const reg = await navigator.serviceWorker.ready;
            const sub = await reg.pushManager.getSubscription();
            setSubscribed(!!sub);
          } catch {}
        }
      }
    };
    check();
  }, []);

  // Register service worker
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  const subscribe = async () => {
    setLoading(true);
    try {
      const permission = await Notification.requestPermission();
      setPermission(permission);
      if (permission !== "granted") { setLoading(false); return; }

      const reg = await navigator.serviceWorker.ready;
      let sub = await reg.pushManager.getSubscription();
      if (!sub) {
        sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        });
      }
      const user = await db.auth.me();
      await db.entities.PushSubscription.create({
        user_email: user?.email || "",
        endpoint: sub.endpoint,
        subscription_json: JSON.stringify(sub),
        platform: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ? "mobile" : "desktop",
      });
      setSubscribed(true);
      // Show a test notification
      reg.showNotification("Cognita", {
        body: "Push notifications enabled! You'll get study reminders.",
        icon: "/icon-192.png",
        badge: "/icon-192.png",
        vibrate: [200, 100, 200],
        tag: "cognita-welcome",
      });
    } catch (e) {
      console.error("Push subscribe error:", e);
    }
    setLoading(false);
  };

  const unsubscribe = async () => {
    setLoading(true);
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) await sub.unsubscribe();
      const user = await db.auth.me();
      const subs = await db.entities.PushSubscription.filter({ user_email: user?.email });
      for (const s of subs) await db.entities.PushSubscription.delete(s.id);
      setSubscribed(false);
    } catch {}
    setLoading(false);
  };

  if (!supported) return null;

  return (
    <button
      onClick={subscribed ? unsubscribe : subscribe}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
        subscribed
          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
          : "bg-violet-500/10 text-violet-400 border border-violet-500/20"
      }`}
      title={subscribed ? "Disable push notifications" : "Enable push notifications"}
    >
      {subscribed ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
      {subscribed ? "Notifications On" : "Enable Notifications"}
    </button>
  );
}