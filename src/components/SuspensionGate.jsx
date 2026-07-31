import { useSuspensionGate } from "@/hooks/useSuspensionGate";
import { ShieldOff, Ban } from "lucide-react";

/**
 * Wraps children — shows a block screen if user is suspended or banned.
 */
export default function SuspensionGate({ user, children }) {
  const { suspended, status } = useSuspensionGate(user);

  if (!suspended) return children;

  const isBanned = status === "banned";

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: "var(--app-bg)", color: "var(--app-text)" }}>
      <div className="max-w-sm w-full text-center rounded-3xl p-10" style={{ background: "var(--app-surface)", border: "1px solid var(--app-border)" }}>
        <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-5 ${isBanned ? "bg-red-500/15" : "bg-amber-500/15"}`}>
          {isBanned ? <Ban className="w-8 h-8 text-red-400" /> : <ShieldOff className="w-8 h-8 text-amber-400" />}
        </div>
        <h1 className="text-2xl font-black mb-2">{isBanned ? "Account Banned" : "Account Suspended"}</h1>
        <p className="text-sm leading-relaxed" style={{ color: "var(--app-text-muted)" }}>
          {isBanned
            ? "Your account has been permanently banned for violating our terms of service."
            : "Your account has been temporarily suspended due to suspicious activity. An administrator will review your account shortly. If this is a mistake, please contact support."}
        </p>
      </div>
    </div>
  );
}