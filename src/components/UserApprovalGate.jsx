import { db } from '@/lib/firebase';

import { useState, useEffect } from "react";

import { Loader2, Clock, XCircle } from "lucide-react";

const DEV_EMAILS = ["yychang100@student.hbuhsd.edu", "yohanyinyuchang@gmail.com", "yohanchang@outlook.com"];

export default function UserApprovalGate({ user, children }) {
  const [status, setStatus] = useState("loading"); // loading | approved | pending | rejected

  useEffect(() => {
    if (!user?.email) return;
    // Dev accounts bypass approval
    if (DEV_EMAILS.includes(user.email) || user.role === "admin") {
      setStatus("approved");
      return;
    }
    db.entities.PendingApproval.filter({ user_email: user.email })
      .then(records => {
        const record = records[0];
        if (!record) {
          // No record = existing user before this system, let them through
          setStatus("approved");
        } else {
          setStatus(record.status || "pending");
        }
      })
      .catch(() => setStatus("approved")); // On error, don't block
  }, [user?.email]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--app-bg)" }}>
        <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--app-bg)", color: "var(--app-text)" }}>
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/15 flex items-center justify-center mx-auto mb-5">
            <Clock className="w-8 h-8 text-amber-400" />
          </div>
          <h1 className="text-2xl font-black mb-2">Awaiting Approval</h1>
          <p className="opacity-50 text-sm mb-6">
            Your account (<span className="font-semibold">{user?.email}</span>) is pending review by the developer. You'll be able to sign in once approved.
          </p>
          <button
            onClick={() => db.auth.logout("/")}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold opacity-60 hover:opacity-100 transition-all"
            style={{ border: "1px solid var(--app-border)" }}
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  if (status === "rejected") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--app-bg)", color: "var(--app-text)" }}>
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-red-500/15 flex items-center justify-center mx-auto mb-5">
            <XCircle className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-2xl font-black mb-2">Access Denied</h1>
          <p className="opacity-50 text-sm mb-6">
            Your account request was not approved. Please contact the developer if you believe this is a mistake.
          </p>
          <button
            onClick={() => db.auth.logout("/")}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold opacity-60 hover:opacity-100 transition-all"
            style={{ border: "1px solid var(--app-border)" }}
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return children;
}