import { AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export default function ConfirmDialog({ open, title, message, confirmText = "Delete", onConfirm, onCancel, danger = true }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <motion.div
        className="relative rounded-3xl p-6 max-w-sm w-full"
        style={{ background: "var(--app-surface-solid)", border: "1px solid var(--app-border)" }}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.15 }}
      >
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${danger ? "bg-red-500/15" : "bg-amber-500/15"}`}>
          <AlertTriangle className={`w-6 h-6 ${danger ? "text-red-400" : "text-amber-400"}`} />
        </div>
        <h3 className="font-black text-base mb-1">{title}</h3>
        <p className="text-sm mb-6" style={{ color: "var(--app-text-muted)" }}>{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-2xl font-semibold text-sm transition-all"
            style={{ background: "var(--app-surface)", border: "1px solid var(--app-border)" }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-3 rounded-2xl font-semibold text-sm text-white transition-all ${danger ? "bg-red-600 hover:bg-red-500" : "bg-amber-500 hover:bg-amber-400"}`}
          >
            {confirmText}
          </button>
        </div>
      </motion.div>
    </div>
  );
}