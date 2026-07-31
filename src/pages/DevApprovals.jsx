import { db } from '@/lib/firebase';

import { useState, useEffect } from "react";

import { Shield, Loader2 } from "lucide-react";
import ApprovalsPanel from "../components/ApprovalsPanel";
import { checkDevPin } from "../lib/devPin";

const DEV_EMAILS = ["yychang100@student.hbuhsd.edu", "yohanyinyuchang@gmail.com", "yohanchang@outlook.com"];

function PinGate({ onUnlock }) {
  const [pin, setPin] = useState(["", "", "", "", ""]);
  const [error, setError] = useState(false);
  const refs = [0,1,2,3,4].map(() => ({ current: null }));

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

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--app-bg)", color: "var(--app-text)" }}>
      <div className="text-center max-w-xs w-full px-6">
        <Shield className="w-10 h-10 mx-auto mb-4 text-violet-400" />
        <h1 className="text-xl font-black mb-2">User Approvals</h1>
        <p className="text-sm mb-6 opacity-50">Enter your 5-digit PIN to continue</p>
        <div className="flex items-center justify-center gap-3 mb-4">
          {pin.map((d, i) => (
            <input key={i} ref={el => refs[i].current = el} type="password" inputMode="numeric" maxLength={1} value={d}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => { if (e.key === "Backspace" && !pin[i] && i > 0) refs[i-1].current?.focus(); }}
              className="w-12 h-14 text-center text-xl font-black rounded-2xl outline-none"
              style={{ background: "var(--app-surface)", border: `2px solid ${error ? "rgba(239,68,68,0.5)" : "var(--app-border)"}`, color: "var(--app-text)" }}
              autoFocus={i === 0}
            />
          ))}
        </div>
        {error && <p className="text-sm text-red-400 font-semibold">Incorrect PIN.</p>}
      </div>
    </div>
  );
}

export default function DevApprovals() {
  const [user, setUser] = useState(null);
  const [pinUnlocked, setPinUnlocked] = useState(false);
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);

  const bgStyle = { background: "var(--app-bg)", color: "var(--app-text)" };
  const cardStyle = { background: "var(--app-surface)", border: "1px solid var(--app-border)" };
  const mutedStyle = { color: "var(--app-text-muted)" };

  useEffect(() => {
    db.auth.me().then(me => {
      setUser(me);
      if (!DEV_EMAILS.includes(me.email)) { setLoading(false); return; }
      db.entities.PendingApproval.list("-created_date", 200).then(data => {
        setApprovals(data);
        setLoading(false);
      });
    }).catch(() => setLoading(false));
  }, []);

  // Subscribe to real-time updates
  useEffect(() => {
    const unsub = db.entities.PendingApproval.subscribe(event => {
      if (event.type === "create") setApprovals(prev => [event.data, ...prev]);
      else if (event.type === "update") setApprovals(prev => prev.map(a => a.id === event.id ? event.data : a));
      else if (event.type === "delete") setApprovals(prev => prev.filter(a => a.id !== event.id));
    });
    return unsub;
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center" style={bgStyle}><Loader2 className="w-8 h-8 animate-spin text-violet-500" /></div>;
  if (!user || !DEV_EMAILS.includes(user.email)) return (
    <div className="min-h-screen flex items-center justify-center" style={bgStyle}>
      <div className="text-center"><Shield className="w-12 h-12 mx-auto mb-4 text-red-400" /><p className="font-black text-xl">Access Denied</p></div>
    </div>
  );
  if (!pinUnlocked) return <PinGate onUnlock={() => setPinUnlocked(true)} />;

  return (
    <div className="min-h-screen pb-20" style={bgStyle}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-violet-500/15 flex items-center justify-center">
            <Shield className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black">User Approvals</h1>
            <p className="text-xs opacity-50">{approvals.filter(a => a.status === "pending").length} pending · live updates</p>
          </div>
        </div>
        <ApprovalsPanel
          approvals={approvals}
          onUpdate={(updated) => setApprovals(prev => prev.map(a => a.id === updated.id ? updated : a))}
          cardStyle={cardStyle}
          mutedStyle={mutedStyle}
        />
      </div>
    </div>
  );
}