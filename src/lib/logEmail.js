import { db } from '@/lib/firebase';


export async function logEmail({ to_email, type, subject = "", status = "sent", error_message = "" }) {
  try {
    await db.entities.EmailLog.create({ to_email, type, subject, status, error_message: error_message || undefined });
  } catch (_) {
  }
}