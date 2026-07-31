import { db } from '@/lib/firebase';

// Comprehensive backup & restore system for all app data
import { useState, useRef } from "react";

import { Download, Upload, Loader2 } from "lucide-react";

// ─── Download helpers ─────────────────────────────────────────────────────────
async function fetchAllPaginated(entity, sort = "-created_date", batchSize = 200, onProgress) {
  let all = [];
  let skip = 0;
  while (true) {
    const batch = await entity.list(sort, batchSize, skip);
    if (!batch || batch.length === 0) break;
    all = [...all, ...batch];
    skip += batch.length;
    onProgress?.(all.length);
    if (batch.length < batchSize) break;
    await new Promise(r => setTimeout(r, 300));
  }
  return all;
}

function downloadJson(data, filename) {
  const parts = [JSON.stringify(data, null, 2)];
  const blob = new Blob(parts, { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

// ─── Flashcard backup — split by batches of 20 decks ─────────────────────────
async function downloadFlashcardsInChunks(setStatus, CHUNK_SIZE = 20) {
  setStatus("Fetching deck list...");
  let allDecks = [];
  let skip = 0;
  while (true) {
    const batch = await db.entities.Deck.list("-updated_date", 50, skip);
    if (!batch || batch.length === 0) break;
    allDecks = [...allDecks, ...batch];
    skip += batch.length;
    setStatus(`Fetched ${allDecks.length} decks...`);
    if (batch.length < 50) break;
    await new Promise(r => setTimeout(r, 300));
  }

  const total = allDecks.length;
  const numChunks = Math.ceil(total / CHUNK_SIZE);
  setStatus(`${total} decks found. Downloading in ${numChunks} file(s) of ${CHUNK_SIZE} decks each...`);
  await new Promise(r => setTimeout(r, 100));

  for (let ci = 0; ci < numChunks; ci++) {
  const chunk = allDecks.slice(ci * CHUNK_SIZE, (ci + 1) * CHUNK_SIZE);
  const results = [];
  for (let i = 0; i < chunk.length; i++) {
    const deck = chunk[i];
    setStatus(`Chunk ${ci + 1}/${numChunks} — Deck ${i + 1}/${chunk.length}: "${deck.title}" (${results.reduce((s, d) => s + d.cards.length, 0)} cards so far)`);
    let cards = [];
    let cardSkip = 0;
    while (true) {
      const cb = await db.entities.Flashcard.filter({ deck_id: deck.id }, "-created_date", 500, cardSkip);
      if (!cb || cb.length === 0) break;
      cards = [...cards, ...cb];
      cardSkip += cb.length;
      if (cb.length < 500) break;
      // Pause between card pages to avoid rate limit
      await new Promise(r => setTimeout(r, 300));
    }
    results.push({
      id: deck.id, title: deck.title, subject: deck.subject, description: deck.description,
      color: deck.color, folder: deck.folder, is_public: deck.is_public,
      author_email: deck.author_email, author_name: deck.author_name,
      card_count: deck.card_count, created_by: deck.created_by, created_date: deck.created_date,
      cover_image_url: deck.cover_image_url || "", // ✨ Added custom cover image
      cover_sticker: deck.cover_sticker || "",         // ✨ Added custom cover sticker
      cards: cards.map(c => ({ id: c.id, front: c.front, back: c.back, difficulty: c.difficulty, author_email: c.author_email })),
    });
    // Pause between each deck to stay under rate limit
    await new Promise(r => setTimeout(r, 400));
  }
  const date = new Date().toISOString().slice(0, 10);
  downloadJson(results, `cognita_decks_part${ci + 1}of${numChunks}_${date}.json`);
  setStatus(`✅ Downloaded chunk ${ci + 1}/${numChunks}. Pausing before next...`);
  if (ci < numChunks - 1) await new Promise(r => setTimeout(r, 2000));
  }
  setStatus(`✅ All done! ${numChunks} file(s) downloaded covering ${total} decks.`);
}

// ─── BACKUP_TYPES ─────────────────────────────────────────────────────────────
const BACKUP_TYPES = [
  {
    id: "users",
    label: "👤 Users",
    desc: "All user profiles, roles, bios, and account info",
    color: "text-blue-400",
    download: async (setStatus) => {
      setStatus("Fetching users...");
      const users = await db.entities.User.list("-created_date");
      setStatus(`${users.length} users fetched. Downloading...`);
      downloadJson(users, `cognita_users_${new Date().toISOString().slice(0, 10)}.json`);
      setStatus(`✅ Downloaded ${users.length} users.`);
    },
    restore: async (data, setStatus) => {
      if (!Array.isArray(data)) throw new Error("Expected an array of users");
      setStatus(`Fetching current users to match by email...`);
      
      // Fetch all existing users in this app and build an email→id map
      let existingUsers = [];
      let skip = 0;
      while (true) {
        const batch = await db.entities.User.list("-created_date", 200, skip);
        if (!batch || batch.length === 0) break;
        existingUsers = [...existingUsers, ...batch];
        skip += batch.length;
        if (batch.length < 200) break;
      }
      
      const emailToId = {};
      for (const u of existingUsers) {
        if (u.email) emailToId[u.email] = u.id;
      }
      
      setStatus(`Found ${existingUsers.length} users in this app. Importing data...`);
      let updated = 0, created = 0; // Changed 'skipped' to 'created'
      
      for (let i = 0; i < data.length; i++) {
        const u = data[i];
        const targetId = emailToId[u.email];
        
        if (targetId) {
          // 1. User exists: Update them
          await db.entities.User.update(targetId, {
            role: u.role,
            bio: u.bio,
            display_name: u.display_name,
            is_public: u.is_public,
          }).catch(() => {});
          updated++;
        } else {
          // 2. User DOES NOT exist: Create them!
          // Make sure you include the email and original ID so they can be matched later
          await db.entities.User.create({
            id: u.id, // Crucial: preserve their original ID so relations don't break
            email: u.email,
            role: u.role,
            bio: u.bio,
            display_name: u.display_name,
            is_public: u.is_public,
            created_date: u.created_date || new Date().toISOString()
          }).catch(() => {});
          created++;
        }
        
        if ((updated + created) % 10 === 0) {
          setStatus(`Processed ${updated + created} users...`);
        }
      }
      setStatus(`✅ Done! Updated ${updated} existing users and created ${created} new users.`);
    }
  },
  {
    id: "partners",
    label: "🤝 Partner Logos",
    desc: "Partner images, names, links, and ordering",
    color: "text-violet-400",
    download: async (setStatus) => {
      setStatus("Fetching partners...");
      const partners = await db.entities.PartnerImage.list("order", 200);
      setStatus(`${partners.length} partners fetched. Downloading...`);
      downloadJson(partners, `cognita_partners_${new Date().toISOString().slice(0, 10)}.json`);
      setStatus(`✅ Downloaded ${partners.length} partners.`);
    },
    restore: async (data, setStatus) => {
      if (!Array.isArray(data)) throw new Error("Expected array");
      setStatus(`Importing ${data.length} partner records...`);
      for (let i = 0; i < data.length; i++) {
        const p = data[i];
        setStatus(`Creating partner ${i + 1}/${data.length}: ${p.name || "—"}`);
        await db.entities.PartnerImage.create({
          image_url: p.image_url,
          name: p.name || "",
          link_url: p.link_url || "",
          order: p.order ?? i,
        });
      }
      setStatus(`✅ Imported ${data.length} partners.`);
    }
  },
  {
    id: "ratings",
    label: "⭐ Deck Ratings",
    desc: "All user ratings on public decks",
    color: "text-amber-400",
    download: async (setStatus) => {
      setStatus("Fetching ratings...");
      const ratings = await fetchAllPaginated(db.entities.DeckRating, "-created_date", 500,
        n => setStatus(`Fetched ${n} ratings...`));
      setStatus(`${ratings.length} ratings. Downloading...`);
      downloadJson(ratings, `cognita_ratings_${new Date().toISOString().slice(0, 10)}.json`);
      setStatus(`✅ Downloaded ${ratings.length} ratings.`);
    },
    restore: async (data, setStatus) => {
      if (!Array.isArray(data)) throw new Error("Expected array");
      setStatus(`Importing ${data.length} ratings in batches...`);
      const BATCH = 50;
      for (let i = 0; i < data.length; i += BATCH) {
        const batch = data.slice(i, i + BATCH);
        await db.entities.DeckRating.bulkCreate(batch.map(r => ({
          deck_id: r.deck_id, user_email: r.user_email, rating: r.rating,
        })));
        setStatus(`Imported ${Math.min(i + BATCH, data.length)}/${data.length}...`);
      }
      setStatus(`✅ Imported ${data.length} ratings.`);
    }
  },
  {
    id: "announcements",
    label: "📢 Announcements",
    desc: "All announcement banners (active and inactive)",
    color: "text-orange-400",
    download: async (setStatus) => {
      setStatus("Fetching announcements...");
      const items = await db.entities.AnnouncementBanner.list("-created_date", 200);
      downloadJson(items, `cognita_announcements_${new Date().toISOString().slice(0, 10)}.json`);
      setStatus(`✅ Downloaded ${items.length} announcements.`);
    },
    restore: async (data, setStatus) => {
      if (!Array.isArray(data)) throw new Error("Expected array");
      for (let i = 0; i < data.length; i++) {
        const b = data[i];
        setStatus(`Creating announcement ${i + 1}/${data.length}...`);
        await db.entities.AnnouncementBanner.create({
          message: b.message, type: b.type, active: b.active,
          link: b.link || null, created_by_name: b.created_by_name || "Restored",
        });
      }
      setStatus(`✅ Imported ${data.length} announcements.`);
    }
  },
  {
    id: "partnership_requests",
    label: "🏢 Partnership Requests",
    desc: "Partnership request submissions",
    color: "text-emerald-400",
    download: async (setStatus) => {
      setStatus("Fetching partnership requests...");
      const items = await db.entities.PartnershipRequest.list("-created_date", 500);
      downloadJson(items, `cognita_partnership_requests_${new Date().toISOString().slice(0, 10)}.json`);
      setStatus(`✅ Downloaded ${items.length} requests.`);
    },
    restore: async (data, setStatus) => {
      if (!Array.isArray(data)) throw new Error("Expected array");
      for (let i = 0; i < data.length; i++) {
        const r = data[i];
        setStatus(`Creating request ${i + 1}/${data.length}...`);
        await db.entities.PartnershipRequest.create({
          company_name: r.company_name, contact_email: r.contact_email,
          proof: r.proof, message: r.message, status: r.status || "pending",
          submitter_email: r.submitter_email || "",
        });
      }
      setStatus(`✅ Imported ${data.length} partnership requests.`);
    }
  },
  {
    id: "study_sessions",
    label: "📊 Study Sessions",
    desc: "All user study session data",
    color: "text-cyan-400",
    download: async (setStatus) => {
      setStatus("Fetching study sessions...");
      const items = await fetchAllPaginated(db.entities.StudySession, "-created_date", 500,
        n => setStatus(`Fetched ${n} sessions...`));
      downloadJson(items, `cognita_study_sessions_${new Date().toISOString().slice(0, 10)}.json`);
      setStatus(`✅ Downloaded ${items.length} sessions.`);
    },
    restore: async (data, setStatus) => {
      if (!Array.isArray(data)) throw new Error("Expected array");
      const BATCH = 100;
      for (let i = 0; i < data.length; i += BATCH) {
        const batch = data.slice(i, i + BATCH);
        setStatus(`Importing sessions ${i + 1}–${Math.min(i + BATCH, data.length)}/${data.length}...`);
        await db.entities.StudySession.bulkCreate(batch.map(s => ({
          deck_id: s.deck_id, cards_reviewed: s.cards_reviewed, cards_correct: s.cards_correct,
          duration_minutes: s.duration_minutes, session_type: s.session_type,
          quiz_score: s.quiz_score, quiz_total: s.quiz_total, user_email: s.user_email,
        })));
      }
      setStatus(`✅ Imported ${data.length} sessions.`);
    }
  },
  {
    id: "login_events",
    label: "🔑 Login Events",
    desc: "User login history",
    color: "text-pink-400",
    download: async (setStatus) => {
      setStatus("Fetching login events...");
      const items = await fetchAllPaginated(db.entities.UserLoginEvent, "-created_date", 500,
        n => setStatus(`Fetched ${n} events...`));
      downloadJson(items, `cognita_login_events_${new Date().toISOString().slice(0, 10)}.json`);
      setStatus(`✅ Downloaded ${items.length} login events.`);
    },
    restore: async (data, setStatus) => {
      if (!Array.isArray(data)) throw new Error("Expected array");
      const BATCH = 100;
      for (let i = 0; i < data.length; i += BATCH) {
        const batch = data.slice(i, i + BATCH);
        await db.entities.UserLoginEvent.bulkCreate(batch.map(e => ({
          user_email: e.user_email, user_name: e.user_name, platform: e.platform,
        })));
        setStatus(`Imported ${Math.min(i + BATCH, data.length)}/${data.length}...`);
      }
      setStatus(`✅ Imported ${data.length} login events.`);
    }
  },
  {
    id: "srs_cards",
    label: "🧠 SRS Cards",
    desc: "Spaced repetition scheduling data for all users",
    color: "text-indigo-400",
    download: async (setStatus) => {
      setStatus("Fetching SRS cards...");
      const items = await fetchAllPaginated(db.entities.SRSCard, "-created_date", 500,
        n => setStatus(`Fetched ${n} SRS cards...`));
      downloadJson(items, `cognita_srs_cards_${new Date().toISOString().slice(0, 10)}.json`);
      setStatus(`✅ Downloaded ${items.length} SRS cards.`);
    },
    restore: async (data, setStatus) => {
      if (!Array.isArray(data)) throw new Error("Expected array");
      const BATCH = 100;
      for (let i = 0; i < data.length; i += BATCH) {
        const batch = data.slice(i, i + BATCH);
        setStatus(`Importing SRS cards ${i + 1}–${Math.min(i + BATCH, data.length)}/${data.length}...`);
        await db.entities.SRSCard.bulkCreate(batch.map(c => ({
          user_email: c.user_email, card_id: c.card_id, deck_id: c.deck_id,
          interval_days: c.interval_days, ease_factor: c.ease_factor,
          due_date: c.due_date, repetitions: c.repetitions,
        })));
        await new Promise(r => setTimeout(r, 200));
      }
      setStatus(`✅ Imported ${data.length} SRS cards.`);
    }
  },
  {
    id: "pomodoro_sessions",
    label: "🍅 Pomodoro Sessions",
    desc: "Pomodoro focus session history and stats",
    color: "text-red-400",
    download: async (setStatus) => {
      setStatus("Fetching Pomodoro sessions...");
      const items = await fetchAllPaginated(db.entities.PomodoroSession, "-created_date", 500,
        n => setStatus(`Fetched ${n} sessions...`));
      downloadJson(items, `cognita_pomodoro_${new Date().toISOString().slice(0, 10)}.json`);
      setStatus(`✅ Downloaded ${items.length} Pomodoro sessions.`);
    },
    restore: async (data, setStatus) => {
      if (!Array.isArray(data)) throw new Error("Expected array");
      const BATCH = 100;
      for (let i = 0; i < data.length; i += BATCH) {
        const batch = data.slice(i, i + BATCH);
        setStatus(`Importing ${i + 1}–${Math.min(i + BATCH, data.length)}/${data.length}...`);
        await db.entities.PomodoroSession.bulkCreate(batch.map(s => ({
          user_email: s.user_email, user_name: s.user_name, status: s.status,
          session_count: s.session_count, total_focus_minutes: s.total_focus_minutes,
        })));
        await new Promise(r => setTimeout(r, 200));
      }
      setStatus(`✅ Imported ${data.length} Pomodoro sessions.`);
    }
  },
  {
    id: "ap_sessions",
    label: "📝 AP Sessions",
    desc: "AP test prep session history",
    color: "text-purple-400",
    download: async (setStatus) => {
      setStatus("Fetching AP sessions...");
      const items = await fetchAllPaginated(db.entities.APSession, "-created_date", 500,
        n => setStatus(`Fetched ${n} AP sessions...`));
      downloadJson(items, `cognita_ap_sessions_${new Date().toISOString().slice(0, 10)}.json`);
      setStatus(`✅ Downloaded ${items.length} AP sessions.`);
    },
    restore: async (data, setStatus) => {
      if (!Array.isArray(data)) throw new Error("Expected array");
      const BATCH = 50;
      for (let i = 0; i < data.length; i += BATCH) {
        const batch = data.slice(i, i + BATCH);
        setStatus(`Importing ${i + 1}–${Math.min(i + BATCH, data.length)}/${data.length}...`);
        await db.entities.APSession.bulkCreate(batch.map(s => ({ ...s, id: undefined })));
        await new Promise(r => setTimeout(r, 300));
      }
      setStatus(`✅ Imported ${data.length} AP sessions.`);
    }
  },
  {
    id: "course_progress",
    label: "🎓 Course Progress",
    desc: "User course enrollment and completion data",
    color: "text-green-400",
    download: async (setStatus) => {
      setStatus("Fetching course progress...");
      const items = await fetchAllPaginated(db.entities.CourseProgress, "-created_date", 500,
        n => setStatus(`Fetched ${n} records...`));
      downloadJson(items, `cognita_course_progress_${new Date().toISOString().slice(0, 10)}.json`);
      setStatus(`✅ Downloaded ${items.length} course progress records.`);
    },
    restore: async (data, setStatus) => {
      if (!Array.isArray(data)) throw new Error("Expected array");
      const BATCH = 100;
      for (let i = 0; i < data.length; i += BATCH) {
        const batch = data.slice(i, i + BATCH);
        setStatus(`Importing ${i + 1}–${Math.min(i + BATCH, data.length)}/${data.length}...`);
        await db.entities.CourseProgress.bulkCreate(batch.map(p => ({ ...p, id: undefined })));
        await new Promise(r => setTimeout(r, 200));
      }
      setStatus(`✅ Imported ${data.length} records.`);
    }
  },
  {
    id: "friendships",
    label: "👥 Friendships",
    desc: "Friend connections and pending requests",
    color: "text-sky-400",
    download: async (setStatus) => {
      setStatus("Fetching friendships...");
      const items = await fetchAllPaginated(db.entities.Friendship, "-created_date", 500,
        n => setStatus(`Fetched ${n} friendships...`));
      downloadJson(items, `cognita_friendships_${new Date().toISOString().slice(0, 10)}.json`);
      setStatus(`✅ Downloaded ${items.length} friendships.`);
    },
    restore: async (data, setStatus) => {
      if (!Array.isArray(data)) throw new Error("Expected array");
      const BATCH = 100;
      for (let i = 0; i < data.length; i += BATCH) {
        const batch = data.slice(i, i + BATCH);
        setStatus(`Importing ${i + 1}–${Math.min(i + BATCH, data.length)}/${data.length}...`);
        await db.entities.Friendship.bulkCreate(batch.map(f => ({
          requester_email: f.requester_email, requester_name: f.requester_name,
          recipient_email: f.recipient_email, recipient_name: f.recipient_name,
          status: f.status,
        })));
        await new Promise(r => setTimeout(r, 200));
      }
      setStatus(`✅ Imported ${data.length} friendships.`);
    }
  },
  {
    id: "chat_sessions",
    label: "💬 Chat Sessions",
    desc: "AI chat history (all messages)",
    color: "text-teal-400",
    download: async (setStatus) => {
      setStatus("Fetching chat sessions...");
      const items = await fetchAllPaginated(db.entities.ChatSession, "-created_date", 200,
        n => setStatus(`Fetched ${n} chats...`));
      downloadJson(items, `cognita_chats_${new Date().toISOString().slice(0, 10)}.json`);
      setStatus(`✅ Downloaded ${items.length} chat sessions.`);
    },
    restore: async (data, setStatus) => {
      if (!Array.isArray(data)) throw new Error("Expected array");
      for (let i = 0; i < data.length; i++) {
        const c = data[i];
        if (i % 10 === 0) setStatus(`Importing chat ${i + 1}/${data.length}...`);
        await db.entities.ChatSession.create({ title: c.title, messages: c.messages || [] });
        await new Promise(r => setTimeout(r, 150));
      }
      setStatus(`✅ Imported ${data.length} chat sessions.`);
    }
  },
  {
    id: "upgrade_detection",
    label: "⭐ Upgrade / Credits",
    desc: "User AI credit upgrades and unlimited access records",
    color: "text-yellow-400",
    download: async (setStatus) => {
      setStatus("Fetching upgrade records...");
      const items = await fetchAllPaginated(db.entities.UpgradeDetection, "-created_date", 500,
        n => setStatus(`Fetched ${n} records...`));
      downloadJson(items, `cognita_upgrade_detection_${new Date().toISOString().slice(0, 10)}.json`);
      setStatus(`✅ Downloaded ${items.length} upgrade records.`);
    },
    restore: async (data, setStatus) => {
      if (!Array.isArray(data)) throw new Error("Expected array");
      const BATCH = 100;
      for (let i = 0; i < data.length; i += BATCH) {
        const batch = data.slice(i, i + BATCH);
        setStatus(`Importing ${i + 1}–${Math.min(i + BATCH, data.length)}/${data.length}...`);
        await db.entities.UpgradeDetection.bulkCreate(batch.map(u => ({
          user_email: u.user_email, unlimited_access: u.unlimited_access, notes: u.notes,
        })));
        await new Promise(r => setTimeout(r, 200));
      }
      setStatus(`✅ Imported ${data.length} upgrade records.`);
    }
  },
  {
    id: "survey_credits",
    label: "🎁 Survey Credits",
    desc: "Survey reward credit records per user",
    color: "text-lime-400",
    download: async (setStatus) => {
      setStatus("Fetching survey credits...");
      const items = await fetchAllPaginated(db.entities.SurveyCredit, "-created_date", 500,
        n => setStatus(`Fetched ${n} credits...`));
      downloadJson(items, `cognita_survey_credits_${new Date().toISOString().slice(0, 10)}.json`);
      setStatus(`✅ Downloaded ${items.length} survey credits.`);
    },
    restore: async (data, setStatus) => {
      if (!Array.isArray(data)) throw new Error("Expected array");
      const BATCH = 100;
      for (let i = 0; i < data.length; i += BATCH) {
        const batch = data.slice(i, i + BATCH);
        setStatus(`Importing ${i + 1}–${Math.min(i + BATCH, data.length)}/${data.length}...`);
        await db.entities.SurveyCredit.bulkCreate(batch.map(c => ({
          user_email: c.user_email, amount: c.amount, reason: c.reason, applied: c.applied,
        })));
        await new Promise(r => setTimeout(r, 200));
      }
      setStatus(`✅ Imported ${data.length} survey credits.`);
    }
  },
  {
    id: "feedback",
    label: "💬 Feedback",
    desc: "User feedback submissions",
    color: "text-orange-400",
    download: async (setStatus) => {
      setStatus("Fetching feedback...");
      const items = await fetchAllPaginated(db.entities.Feedback, "-created_date", 500,
        n => setStatus(`Fetched ${n} feedback items...`));
      downloadJson(items, `cognita_feedback_${new Date().toISOString().slice(0, 10)}.json`);
      setStatus(`✅ Downloaded ${items.length} feedback items.`);
    },
    restore: async (data, setStatus) => {
      if (!Array.isArray(data)) throw new Error("Expected array");
      const BATCH = 100;
      for (let i = 0; i < data.length; i += BATCH) {
        const batch = data.slice(i, i + BATCH);
        setStatus(`Importing ${i + 1}–${Math.min(i + BATCH, data.length)}/${data.length}...`);
        await db.entities.Feedback.bulkCreate(batch.map(f => ({
          user_email: f.user_email, user_name: f.user_name, message: f.message,
          rating: f.rating, page: f.page,
        })));
        await new Promise(r => setTimeout(r, 200));
      }
      setStatus(`✅ Imported ${data.length} feedback items.`);
    }
  },
  {
    id: "notes",
    label: "📝 Notes",
    desc: "User personal notes",
    color: "text-yellow-400",
    download: async (setStatus) => {
      setStatus("Fetching notes...");
      const items = await fetchAllPaginated(db.entities.Note, "-created_date", 500,
        n => setStatus(`Fetched ${n} notes...`));
      downloadJson(items, `cognita_notes_${new Date().toISOString().slice(0, 10)}.json`);
      setStatus(`✅ Downloaded ${items.length} notes.`);
    },
    restore: async (data, setStatus) => {
      if (!Array.isArray(data)) throw new Error("Expected array");
      const BATCH = 100;
      for (let i = 0; i < data.length; i += BATCH) {
        const batch = data.slice(i, i + BATCH);
        setStatus(`Importing ${i + 1}–${Math.min(i + BATCH, data.length)}/${data.length}...`);
        await db.entities.Note.bulkCreate(batch.map(n => ({ ...n, id: undefined })));
        await new Promise(r => setTimeout(r, 200));
      }
      setStatus(`✅ Imported ${data.length} notes.`);
    }
  },
  {
    id: "questionnaires",
    label: "❓ Questionnaires & Responses",
    desc: "All questionnaires and user responses",
    color: "text-fuchsia-400",
    download: async (setStatus) => {
      setStatus("Fetching questionnaires...");
      const qs = await fetchAllPaginated(db.entities.Questionnaire, "-created_date", 200,
        n => setStatus(`Fetched ${n} questionnaires...`));
      setStatus("Fetching responses...");
      const rs = await fetchAllPaginated(db.entities.QuestionnaireResponse, "-created_date", 500,
        n => setStatus(`Fetched ${n} responses...`));
      downloadJson({ questionnaires: qs, responses: rs }, `cognita_questionnaires_${new Date().toISOString().slice(0, 10)}.json`);
      setStatus(`✅ Downloaded ${qs.length} questionnaires, ${rs.length} responses.`);
    },
    restore: async (data, setStatus) => {
      const qs = data?.questionnaires || (Array.isArray(data) ? data : []);
      const rs = data?.responses || [];
      for (let i = 0; i < qs.length; i++) {
        const q = qs[i];
        setStatus(`Creating questionnaire ${i + 1}/${qs.length}: ${q.title}`);
        await db.entities.Questionnaire.create({
          title: q.title, description: q.description,
          questions: q.questions, active: q.active,
        });
        await new Promise(r => setTimeout(r, 200));
      }
      const BATCH = 100;
      for (let i = 0; i < rs.length; i += BATCH) {
        const batch = rs.slice(i, i + BATCH);
        setStatus(`Importing responses ${i + 1}–${Math.min(i + BATCH, rs.length)}/${rs.length}...`);
        await db.entities.QuestionnaireResponse.bulkCreate(batch.map(r => ({
          questionnaire_id: r.questionnaire_id, user_email: r.user_email, answers: r.answers,
        })));
        await new Promise(r => setTimeout(r, 200));
      }
      setStatus(`✅ Imported ${qs.length} questionnaires, ${rs.length} responses.`);
    }
  },
  {
    id: "suspended_users",
    label: "🚫 Suspended / Banned Users",
    desc: "Moderation records — suspensions and bans",
    color: "text-red-400",
    download: async (setStatus) => {
      setStatus("Fetching moderation records...");
      const items = await fetchAllPaginated(db.entities.SuspendedUser, "-created_date", 500,
        n => setStatus(`Fetched ${n} records...`));
      downloadJson(items, `cognita_suspended_users_${new Date().toISOString().slice(0, 10)}.json`);
      setStatus(`✅ Downloaded ${items.length} moderation records.`);
    },
    restore: async (data, setStatus) => {
      if (!Array.isArray(data)) throw new Error("Expected array");
      for (let i = 0; i < data.length; i++) {
        const s = data[i];
        if (i % 20 === 0) setStatus(`Importing ${i + 1}/${data.length}...`);
        await db.entities.SuspendedUser.create({
          user_email: s.user_email, reason: s.reason, status: s.status,
          trigger: s.trigger, details: s.details, reviewed_by: s.reviewed_by,
        });
        await new Promise(r => setTimeout(r, 150));
      }
      setStatus(`✅ Imported ${data.length} moderation records.`);
    }
  },
  {
    id: "ai_usage_logs",
    label: "🤖 AI Usage Logs",
    desc: "AI call logs for all users (provider, feature, prompt length)",
    color: "text-violet-400",
    download: async (setStatus) => {
      setStatus("Fetching AI usage logs...");
      const items = await fetchAllPaginated(db.entities.AIUsageLog, "-created_date", 500,
        n => setStatus(`Fetched ${n} logs...`));
      downloadJson(items, `cognita_ai_usage_logs_${new Date().toISOString().slice(0, 10)}.json`);
      setStatus(`✅ Downloaded ${items.length} AI usage log records.`);
    },
    restore: async (data, setStatus) => {
      if (!Array.isArray(data)) throw new Error("Expected array");
      const BATCH = 100;
      for (let i = 0; i < data.length; i += BATCH) {
        const batch = data.slice(i, i + BATCH);
        setStatus(`Importing ${i + 1}–${Math.min(i + BATCH, data.length)}/${data.length}...`);
        await db.entities.AIUsageLog.bulkCreate(batch.map(l => ({
          user_email: l.user_email, provider: l.provider, feature: l.feature,
          prompt_length: l.prompt_length, success: l.success,
        })));
        await new Promise(r => setTimeout(r, 200));
      }
      setStatus(`✅ Imported ${data.length} AI usage log records.`);
    }
  },
  {
    id: "pending_approvals",
    label: "🛡️ Verify Requests (PendingApprovals)",
    desc: "Deck verification requests from users",
    color: "text-blue-400",
    download: async (setStatus) => {
      setStatus("Fetching pending approvals...");
      const items = await fetchAllPaginated(db.entities.PendingApproval, "-created_date", 500,
        n => setStatus(`Fetched ${n} records...`));
      downloadJson(items, `cognita_pending_approvals_${new Date().toISOString().slice(0, 10)}.json`);
      setStatus(`✅ Downloaded ${items.length} pending approval records.`);
    },
    restore: async (data, setStatus) => {
      if (!Array.isArray(data)) throw new Error("Expected array");
      const BATCH = 100;
      for (let i = 0; i < data.length; i += BATCH) {
        const batch = data.slice(i, i + BATCH);
        setStatus(`Importing ${i + 1}–${Math.min(i + BATCH, data.length)}/${data.length}...`);
        await db.entities.PendingApproval.bulkCreate(batch.map(p => ({ ...p, id: undefined })));
        await new Promise(r => setTimeout(r, 200));
      }
      setStatus(`✅ Imported ${data.length} pending approval records.`);
    }
  },
  {
    id: "shared_files",
    label: "📁 Shared Files",
    desc: "Community-shared resource files",
    color: "text-cyan-400",
    download: async (setStatus) => {
      setStatus("Fetching shared files...");
      const items = await fetchAllPaginated(db.entities.SharedFile, "-created_date", 500,
        n => setStatus(`Fetched ${n} files...`));
      downloadJson(items, `cognita_shared_files_${new Date().toISOString().slice(0, 10)}.json`);
      setStatus(`✅ Downloaded ${items.length} shared file records.`);
    },
    restore: async (data, setStatus) => {
      if (!Array.isArray(data)) throw new Error("Expected array");
      const BATCH = 100;
      for (let i = 0; i < data.length; i += BATCH) {
        const batch = data.slice(i, i + BATCH);
        setStatus(`Importing ${i + 1}–${Math.min(i + BATCH, data.length)}/${data.length}...`);
        await db.entities.SharedFile.bulkCreate(batch.map(f => ({ ...f, id: undefined })));
        await new Promise(r => setTimeout(r, 200));
      }
      setStatus(`✅ Imported ${data.length} shared file records.`);
    }
  },
];

// ─── Individual backup card ───────────────────────────────────────────────────
function BackupCard({ type, cardStyle, mutedStyle }) {
  const [dlStatus, setDlStatus] = useState("");
  const [dlLoading, setDlLoading] = useState(false);
  const [rstStatus, setRstStatus] = useState("");
  const [rstLoading, setRstLoading] = useState(false);
  const fileRef = useRef(null);

  const handleDownload = async () => {
    setDlLoading(true);
    setDlStatus("Starting...");
    await type.download(setDlStatus);
    setDlLoading(false);
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setRstLoading(true);
    setRstStatus("Reading file...");
    const text = await file.text();
    const data = JSON.parse(text);
    await type.restore(data, setRstStatus);
    setRstLoading(false);
    e.target.value = "";
  };

  return (
    <div className="rounded-2xl p-5" style={cardStyle}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className={`font-black text-base ${type.color}`}>{type.label}</h3>
          <p className="text-xs mt-0.5" style={mutedStyle}>{type.desc}</p>
        </div>
      </div>
      <div className="flex gap-2 flex-wrap mb-3">
        <button
          onClick={handleDownload}
          disabled={dlLoading}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white px-4 py-2 rounded-xl font-semibold text-xs transition-all"
        >
          {dlLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
          {dlLoading ? "Downloading..." : "Download"}
        </button>
        <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleFileSelect} />
        <button
          onClick={() => fileRef.current?.click()}
          disabled={rstLoading}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white px-4 py-2 rounded-xl font-semibold text-xs transition-all"
        >
          {rstLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
          {rstLoading ? "Importing..." : "Import"}
        </button>
      </div>
      {dlStatus && (
        <p className="text-xs font-medium" style={dlStatus.startsWith("✅") ? { color: "#34d399" } : { color: "var(--app-text-muted)" }}>
          {dlStatus}
        </p>
      )}
      {rstStatus && (
        <p className="text-xs font-medium mt-1" style={rstStatus.startsWith("✅") ? { color: "#34d399" } : rstStatus.startsWith("❌") ? { color: "#f87171" } : { color: "var(--app-text-muted)" }}>
          {rstStatus}
        </p>
      )}
    </div>
  );
}

// ─── Flashcard-specific backup card ──────────────────────────────────────────
function FlashcardBackupCard({ cardStyle, mutedStyle }) {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [rstStatus, setRstStatus] = useState("");
  const [rstLoading, setRstLoading] = useState(false);
  const [chunkSize, setChunkSize] = useState(20);
  const fileRef = useRef(null);

  const handleDownload = async () => {
    setLoading(true);
    setStatus("Starting...");
    await downloadFlashcardsInChunks(setStatus, chunkSize);
    setLoading(false);
  };

  const handleRestore = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setRstLoading(true);
    setRstStatus("Reading file...");
    const text = await file.text();
    const backup = JSON.parse(text);
    if (!Array.isArray(backup)) { setRstStatus("❌ Invalid format."); setRstLoading(false); return; }
    setRstStatus(`Found ${backup.length} decks. Importing...`);
    
    let imported = 0, totalCards = 0;
    
    for (let i = 0; i < backup.length; i++) {
      const d = backup[i];
      setRstStatus(`Deck ${i + 1}/${backup.length}: ${d.title}`);
      
      // ✨ FIX: Added `cover_image_url` and `cover_sticker` to restore custom covers
      const deck = await db.entities.Deck.create({
        id: d.id, 
        title: d.title || "Untitled", subject: d.subject || "", description: d.description || "",
        color: d.color || "#4F46E5", folder: d.folder || "", is_public: d.is_public || false,
        author_email: d.author_email || d.created_by || "", author_name: d.author_name || "",
        card_count: (d.cards || []).length, created_by: d.created_by || d.author_email || "",
        created_date: d.created_date,
        cover_image_url: d.cover_image_url || "", 
        cover_sticker: d.cover_sticker || ""
      });

      if (d.cards?.length > 0) {
        for (let j = 0; j < d.cards.length; j += 100) {
          const batch = d.cards.slice(j, j + 100);
          
          // ✨ FIX: Added `id: c.id` to preserve original flashcard IDs
          await db.entities.Flashcard.bulkCreate(batch.map(c => ({
            id: c.id, 
            front: c.front, back: c.back, difficulty: c.difficulty || "medium",
            deck_id: deck.id, // This now safely uses the preserved original ID!
            author_email: c.author_email || d.author_email || "",
          })));
          totalCards += batch.length;
        }
      }
      imported++;
    }
    setRstStatus(`✅ Imported ${imported} decks and ${totalCards} cards.`);
    setRstLoading(false);
    e.target.value = "";
  };

  return (
    <div className="rounded-2xl p-5" style={cardStyle}>
      <h3 className="font-black text-base text-violet-400 mb-1">🃏 Flashcard Decks</h3>
      <p className="text-xs mb-3" style={mutedStyle}>
        Downloads ALL decks + flashcards. Split into multiple files to avoid browser hanging.
      </p>
      <div className="flex items-center gap-2 mb-3">
        <label className="text-xs font-bold" style={mutedStyle}>Decks per file:</label>
        {[10, 20, 30, 50].map(n => (
          <button
            key={n}
            onClick={() => setChunkSize(n)}
            className={`text-xs px-2.5 py-1 rounded-lg font-bold transition-all ${chunkSize === n ? "bg-violet-600 text-white" : "opacity-50 hover:opacity-80"}`}
            style={chunkSize !== n ? { background: "var(--app-bg)", border: "1px solid var(--app-border)" } : {}}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="flex gap-2 flex-wrap mb-3">
        <button
          onClick={handleDownload}
          disabled={loading}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white px-4 py-2 rounded-xl font-semibold text-xs transition-all"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
          {loading ? "Downloading..." : "Download (split files)"}
        </button>
        <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleRestore} />
        <button
          onClick={() => fileRef.current?.click()}
          disabled={rstLoading}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white px-4 py-2 rounded-xl font-semibold text-xs transition-all"
        >
          {rstLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
          {rstLoading ? "Importing..." : "Import file"}
        </button>
      </div>
      {status && (
        <p className="text-xs font-medium" style={status.startsWith("✅") ? { color: "#34d399" } : { color: "var(--app-text-muted)" }}>
          {status}
        </p>
      )}
      {rstStatus && (
        <p className="text-xs font-medium mt-1" style={rstStatus.startsWith("✅") ? { color: "#34d399" } : rstStatus.startsWith("❌") ? { color: "#f87171" } : { color: "var(--app-text-muted)" }}>
          {rstStatus}
        </p>
      )}
    </div>
  );
}

// ─── Main exported panel ─────────────────────────────────────────────────────
export default function DataBackupRestore({ cardStyle, mutedStyle }) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl p-4 mb-2" style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)" }}>
        <p className="text-xs font-bold text-amber-400 mb-1">⚠️ Import Warning</p>
        <p className="text-xs" style={mutedStyle}>
          Import ADDS new records — it does not replace or deduplicate existing ones.
          For User imports, it updates existing users by ID. For others, new records are created.
          Always download a fresh backup before importing.
        </p>
      </div>

      <FlashcardBackupCard cardStyle={cardStyle} mutedStyle={mutedStyle} />

      {BACKUP_TYPES.map(type => (
        <BackupCard key={type.id} type={type} cardStyle={cardStyle} mutedStyle={mutedStyle} />
      ))}
    </div>
  );
}
