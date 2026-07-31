import { db } from '@/lib/firebase';


/**
 * Log an outbound email to the EmailLog entity for DevDashboard tracking.
 * Fire-and-forget — never throws.
 */
export async function logEmail({ to_email, type, subject = "", status = "sent", error_message = "" }) {
  try {
    await db.entities.EmailLog.create({ to_email, type, subject, status, error_message: error_message || undefined });
  } catch (_) {
    // silently ignore — logging should never break UX
  }
}