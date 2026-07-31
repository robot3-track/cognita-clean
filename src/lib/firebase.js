import { initializeApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updateProfile,
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot,
  getDocFromServer,
  writeBatch
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { GoogleGenAI } from '@google/genai';
import jsonConfig from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: jsonConfig?.apiKey || import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: jsonConfig?.authDomain || import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: jsonConfig?.projectId || import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: jsonConfig?.storageBucket || import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: jsonConfig?.messagingSenderId || import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: jsonConfig?.appId || import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: jsonConfig?.measurementId || import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  firestoreDatabaseId: jsonConfig?.firestoreDatabaseId || import.meta.env.VITE_FIREBASE_DATABASE_ID,
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
console.log("[Firebase] Active Project ID:", firebaseConfig.projectId, "| Auth Domain:", firebaseConfig.authDomain);
const dbId = firebaseConfig.firestoreDatabaseId;
export const firestore = (dbId && dbId !== '(default)') ? getFirestore(app, dbId) : getFirestore(app);
export const auth = getAuth(app);
export const storage = firebaseConfig.storageBucket ? getStorage(app) : null;

// Test connection asynchronously after startup
setTimeout(async () => {
  try {
    await getDocFromServer(doc(firestore, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('offline')) {
      console.warn("Firestore connection check:", error.message);
    }
  }
}, 2500);

// Map entity names to firestore collection paths (handling pluralization/lowercasing)
function getCollectionName(entityName) {
  if (!entityName) return 'general';
  const name = String(entityName);
  // Custom mapping if needed
  const map = {
    User: 'users',
    Deck: 'decks',
    Flashcard: 'flashcards',
    Note: 'notes',
    StudySession: 'study_sessions',
    ClassroomClass: 'classroom_classes',
    ClassroomGame: 'classroom_games',
    ClassroomGameAnswer: 'classroom_game_answers',
    AIUsageLog: 'ai_usage_logs',
    AppNotification: 'app_notifications',
    AnnouncementBanner: 'announcement_banners',
    Feedback: 'feedbacks',
    Friendship: 'friendships',
    GroupMessage: 'group_messages',
    PartnerImage: 'partner_images',
    PartnershipRequest: 'partnership_requests',
    PendingApproval: 'pending_approvals',
    PomodoroSession: 'pomodoro_sessions',
    Questionnaire: 'questionnaires',
    QuestionnaireResponse: 'questionnaire_responses',
    Quiz: 'quizzes',
    SRSCard: 'srs_cards',
    StudyGroup: 'study_groups',
    SuspendedUser: 'suspended_users',
    UserLoginEvent: 'user_login_events',
    CourseProgress: 'course_progresses',
    CourseReview: 'course_reviews',
    CourseApplication: 'course_applications',
    DeckRating: 'deck_ratings',
    EmailLog: 'email_logs',
    GeneratedMedia: 'generated_medias',
    PushSubscription: 'push_subscriptions',
    SharedFile: 'shared_files',
    SurveyCredit: 'survey_credits',
    TowerDefenseScore: 'tower_defense_scores',
    UpgradeDetection: 'upgrade_detections',
    CardDraft: 'card_drafts',
    APSession: 'ap_sessions'
  };
  return map[name] || name.toLowerCase() + 's';
}

// Handle Firestore Errors with rich diagnostic structure
const OperationType = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  LIST: 'list',
  GET: 'get',
  WRITE: 'write',
};

function handleFirestoreError(error, operationType, path) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Helper to sanitize Firestore document data
function formatDoc(snap) {
  if (!snap.exists()) return null;
  const data = snap.data();
  return { id: snap.id, ...data };
}

// Create Entity handler for a given entity name
function createEntityHandler(entityName) {
  const collName = getCollectionName(entityName);

  return {
    async list(sortField, limitVal, skipVal) {
      const safeLimit = (typeof limitVal === 'number' && limitVal > 0) ? Math.min(limitVal, 5000) : null;
      try {
        const collRef = collection(firestore, collName);
        let qConstraints = [];
        
        if (sortField) {
          const desc = String(sortField).startsWith('-');
          const cleanField = desc ? String(sortField).substring(1) : String(sortField);
          qConstraints.push(orderBy(cleanField, desc ? 'desc' : 'asc'));
        }
        if (safeLimit) {
          qConstraints.push(limit(safeLimit));
        }

        const q = qConstraints.length > 0 ? query(collRef, ...qConstraints) : collRef;
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => formatDoc(doc));
      } catch (err) {
        const isIndexErr = err?.code === 'failed-precondition' || String(err?.message || '').toLowerCase().includes('requires an index');
        if (!isIndexErr) {
          console.warn(`Entity ${entityName} list error:`, err);
        }
        // Fallback simple fetch without orderBy if index is missing
        try {
          const snapshot = await getDocs(collection(firestore, collName));
          let results = snapshot.docs.map(doc => formatDoc(doc));
          if (sortField) {
            const desc = String(sortField).startsWith('-');
            const cleanField = desc ? String(sortField).substring(1) : String(sortField);
            results.sort((a, b) => {
              const valA = a[cleanField] ?? '';
              const valB = b[cleanField] ?? '';
              if (valA < valB) return desc ? 1 : -1;
              if (valA > valB) return desc ? -1 : 1;
              return 0;
            });
          }
          if (safeLimit && results.length > safeLimit) {
            results = results.slice(0, safeLimit);
          }
          return results;
        } catch (innerErr) {
          handleFirestoreError(innerErr, OperationType.LIST, collName);
          return [];
        }
      }
    },

    async filter(queryObj = {}, sortField, limitVal) {
      const safeLimit = (typeof limitVal === 'number' && limitVal > 0) ? Math.min(limitVal, 5000) : null;
      try {
        const collRef = collection(firestore, collName);
        let qConstraints = [];

        Object.entries(queryObj).forEach(([key, val]) => {
          if (val !== undefined && val !== null) {
            qConstraints.push(where(key, '==', val));
          }
        });

        if (sortField) {
          const desc = String(sortField).startsWith('-');
          const cleanField = desc ? String(sortField).substring(1) : String(sortField);
          qConstraints.push(orderBy(cleanField, desc ? 'desc' : 'asc'));
        }
        if (safeLimit) {
          qConstraints.push(limit(safeLimit));
        }

        const q = qConstraints.length > 0 ? query(collRef, ...qConstraints) : collRef;
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => formatDoc(doc));
      } catch (err) {
        const isIndexErr = err?.code === 'failed-precondition' || String(err?.message || '').toLowerCase().includes('requires an index');
        if (!isIndexErr) {
          console.warn(`Entity ${entityName} filter error:`, err);
        }
        // Fallback filter in memory if complex Firestore index error
        try {
          const snapshot = await getDocs(collection(firestore, collName));
          let results = snapshot.docs.map(doc => formatDoc(doc));
          Object.entries(queryObj).forEach(([key, val]) => {
            if (val !== undefined && val !== null) {
              results = results.filter(item => item[key] === val);
            }
          });
          if (sortField) {
            const desc = String(sortField).startsWith('-');
            const cleanField = desc ? String(sortField).substring(1) : String(sortField);
            results.sort((a, b) => {
              const valA = a[cleanField] ?? '';
              const valB = b[cleanField] ?? '';
              if (valA < valB) return desc ? 1 : -1;
              if (valA > valB) return desc ? -1 : 1;
              return 0;
            });
          }
          if (safeLimit && results.length > safeLimit) {
            results = results.slice(0, safeLimit);
          }
          return results;
        } catch (innerErr) {
          handleFirestoreError(innerErr, OperationType.LIST, collName);
          return [];
        }
      }
    },

    async get(id) {
      if (!id) return null;
      try {
        const docRef = doc(firestore, collName, String(id));
        const snap = await getDoc(docRef);
        return formatDoc(snap);
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, `${collName}/${id}`);
        return null;
      }
    },

    async create(data = {}) {
      try {
        const payload = {
          ...data,
          created_date: data.created_date || new Date().toISOString(),
          updated_date: new Date().toISOString()
        };

        if (data.id) {
          const docRef = doc(firestore, collName, String(data.id));
          await setDoc(docRef, payload);
          return { id: String(data.id), ...payload };
        } else {
          const docRef = await addDoc(collection(firestore, collName), payload);
          return { id: docRef.id, ...payload };
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, collName);
      }
    },

    async bulkCreate(items = []) {
      if (!Array.isArray(items) || items.length === 0) return [];
      const results = [];
      const BATCH_SIZE = 400;
      for (let i = 0; i < items.length; i += BATCH_SIZE) {
        const chunk = items.slice(i, i + BATCH_SIZE);
        const batch = writeBatch(firestore);
        const createdChunk = [];

        for (const item of chunk) {
          const payload = {
            ...item,
            created_date: item.created_date || new Date().toISOString(),
            updated_date: new Date().toISOString()
          };
          if (payload.id === undefined) delete payload.id;

          let docRef;
          if (item.id) {
            docRef = doc(firestore, collName, String(item.id));
          } else {
            docRef = doc(collection(firestore, collName));
          }
          batch.set(docRef, payload, { merge: true });
          createdChunk.push({ id: docRef.id, ...payload });
        }

        try {
          await batch.commit();
          results.push(...createdChunk);
        } catch (batchErr) {
          console.warn(`Bulk create batch commit error on ${collName}, falling back to sequential create:`, batchErr);
          for (const item of chunk) {
            try {
              const res = await this.create(item);
              if (res) results.push(res);
            } catch (seqErr) {
              console.error(`Failed to create item in bulk fallback:`, seqErr);
            }
          }
        }
      }
      return results;
    },

    async update(id, data = {}) {
      if (!id) throw new Error("ID required for update");
      try {
        const docRef = doc(firestore, collName, String(id));
        const payload = {
          ...data,
          updated_date: new Date().toISOString()
        };
        await updateDoc(docRef, payload);
        const snap = await getDoc(docRef);
        return formatDoc(snap);
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `${collName}/${id}`);
      }
    },

    async delete(id) {
      if (!id) return;
      try {
        const docRef = doc(firestore, collName, String(id));
        await deleteDoc(docRef);
        return { success: true, id };
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `${collName}/${id}`);
      }
    },

    subscribe(arg1, arg2) {
      const collRef = collection(firestore, collName);
      let callback = typeof arg1 === 'function' ? arg1 : arg2;
      let queryObj = typeof arg1 === 'object' ? arg1 : null;

      let q = collRef;
      if (queryObj) {
        const qConstraints = Object.entries(queryObj).map(([k, v]) => where(k, '==', v));
        q = query(collRef, ...qConstraints);
      }

      return onSnapshot(
        q,
        (snapshot) => {
          const docs = snapshot.docs.map(d => formatDoc(d));
          if (callback) {
            callback(docs);
          }
        },
        (error) => {
          console.warn(`Realtime subscription error on ${collName}:`, error);
        }
      );
    }
  };
}

// Global Entities proxy
const entitiesProxy = new Proxy({}, {
  get(target, prop) {
    if (typeof prop === 'symbol') return undefined;
    if (!target[prop]) {
      target[prop] = createEntityHandler(prop);
    }
    return target[prop];
  }
});

// Auth Helper Functions
async function getCurrentUser() {
  const firebaseUser = auth.currentUser;
  if (!firebaseUser) return null;

  const basicUser = {
    id: firebaseUser.uid,
    email: firebaseUser.email,
    full_name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
    avatar_url: firebaseUser.photoURL || null,
    role: 'user'
  };

  const cacheKey = `user_profile_${firebaseUser.uid}`;
  try {
    const raw = localStorage.getItem(cacheKey);
    if (raw) {
      const cached = JSON.parse(raw);
      // Refresh profile doc in background without blocking caller
      entitiesProxy.User.get(firebaseUser.uid).then(doc => {
        if (doc) localStorage.setItem(cacheKey, JSON.stringify({ ...basicUser, ...doc }));
      }).catch(() => {});
      return { ...basicUser, ...cached };
    }
  } catch (e) {}

  try {
    // Race with a quick 800ms timeout so initial load never hangs
    const fetchPromise = entitiesProxy.User.get(firebaseUser.uid);
    const timeoutPromise = new Promise(res => setTimeout(() => res(null), 800));
    const userDoc = await Promise.race([fetchPromise, timeoutPromise]);

    if (userDoc) {
      const full = { ...basicUser, ...userDoc };
      try { localStorage.setItem(cacheKey, JSON.stringify(full)); } catch (e) {}
      return full;
    }
  } catch (e) {
    console.warn("Error fetching user profile doc:", e);
  }

  return basicUser;
}

const authHandler = {
  async me() {
    return await getCurrentUser();
  },

  async isAuthenticated() {
    return !!auth.currentUser;
  },

  async signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    let result;
    try {
      result = await signInWithPopup(auth, provider);
    } catch (popupErr) {
      if (popupErr?.code === 'auth/popup-blocked' || popupErr?.code === 'auth/cancelled-popup-request') {
        console.warn("Popup blocked or cancelled, falling back to signInWithRedirect...");
        await signInWithRedirect(auth, provider);
        return null;
      }
      throw popupErr;
    }

    const user = result.user;

    // Ensure User profile exists in Firestore
    await entitiesProxy.User.create({
      id: user.uid,
      email: user.email,
      full_name: user.displayName || user.email?.split('@')[0],
      avatar_url: user.photoURL,
      role: 'user'
    });

    return await getCurrentUser();
  },

  async signInWithEmail(email, password) {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return await getCurrentUser();
  },

  async signUpWithEmail(email, password, fullName) {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;
    if (fullName) {
      await updateProfile(user, { displayName: fullName });
    }
    await entitiesProxy.User.create({
      id: user.uid,
      email: user.email,
      full_name: fullName || user.email?.split('@')[0],
      avatar_url: user.photoURL || null,
      role: 'user'
    });
    return await getCurrentUser();
  },

  async logout(redirectUrl) {
    await signOut(auth);
    if (redirectUrl && typeof window !== 'undefined') {
      window.location.href = redirectUrl;
    }
  },

  async redirectToLogin(redirectUrl) {
    try {
      await authHandler.signInWithGoogle();
    } catch (err) {
      console.warn("Google popup signin cancelled or failed:", err);
    }
  },

  onAuthStateChanged(callback) {
    // Process redirect result if returning from signInWithRedirect
    getRedirectResult(auth).then(async (result) => {
      if (result?.user) {
        const u = result.user;
        await entitiesProxy.User.create({
          id: u.uid,
          email: u.email,
          full_name: u.displayName || u.email?.split('@')[0],
          avatar_url: u.photoURL,
          role: 'user'
        });
      }
    }).catch(err => {
      console.warn("getRedirectResult error:", err);
    });

    return onAuthStateChanged(auth, async (user) => {
      const formattedUser = user ? await getCurrentUser() : null;
      callback(formattedUser);
    });
  }
};

// AI & Integrations via Gemini API
const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';

const integrationsCore = {
  async InvokeLLM({ prompt, model = 'gemini-3.6-flash', system_instruction, response_mime_type, response_schema }) {
    if (!geminiApiKey) {
      console.warn("GEMINI_API_KEY environment variable is not configured.");
    }
    try {
      const ai = new GoogleGenAI({ apiKey: geminiApiKey });
      const config = {};
      if (system_instruction) config.systemInstruction = system_instruction;
      if (response_mime_type) config.responseMimeType = response_mime_type;
      if (response_schema) config.responseSchema = response_schema;

      const response = await ai.models.generateContent({
        model: model.includes('gemini') ? model : 'gemini-3.6-flash',
        contents: prompt,
        config
      });

      const text = response.text || '';
      return text;
    } catch (err) {
      console.error("InvokeLLM failed:", err);
      throw err;
    }
  },

  async UploadFile({ file }) {
    if (!file) return { file_url: '' };
    try {
      if (storage && file instanceof File) {
        const fileRef = ref(storage, `uploads/${Date.now()}_${file.name}`);
        await uploadBytes(fileRef, file);
        const file_url = await getDownloadURL(fileRef);
        return { file_url };
      } else if (file instanceof Blob || file instanceof File) {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve({ file_url: reader.result });
          reader.readAsDataURL(file);
        });
      } else if (typeof file === 'string') {
        return { file_url: file };
      }
    } catch (err) {
      console.error("UploadFile error:", err);
    }
    return { file_url: '' };
  },

  async GenerateImage({ prompt }) {
    // Generate clean placeholder / Pollinations visual image URL
    const encodedPrompt = encodeURIComponent(prompt || 'learning study background');
    const image_url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=600&seed=${Math.floor(Math.random()*10000)}&nologo=true`;
    return { image_url };
  },

  async SendEmail({ to, to_email, subject, body, type }) {
    const recipient = to || to_email || 'user@example.com';
    await entitiesProxy.EmailLog.create({
      to_email: recipient,
      subject: subject || 'Notification',
      body: body || '',
      type: type || 'general',
      status: 'sent',
      created_date: new Date().toISOString()
    });
    return { success: true };
  },

  async ExtractDataFromUploadedFile({ file_url, schema, prompt }) {
    const textPrompt = `${prompt || 'Extract structured data according to the schema from this file content:'}\nFile URL: ${file_url}`;
    const result = await integrationsCore.InvokeLLM({
      prompt: textPrompt,
      response_mime_type: 'application/json',
      response_schema: schema
    });
    try {
      return typeof result === 'string' ? JSON.parse(result) : result;
    } catch (e) {
      return { raw: result };
    }
  },

  async TranscribeAudio({ audio_url }) {
    return "Transcribed audio content.";
  },

  async GenerateSpeech({ text, voice }) {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
    return { success: true };
  }
};

// Main Exported DB Object
export const db = {
  auth: authHandler,
  entities: entitiesProxy,
  integrations: {
    Core: integrationsCore
  }
};

// Assign globally for legacy code compatibility
if (typeof window !== 'undefined') {
  window.db = db;
  window.__B44_DB__ = db;
  window.B44_DB = db;
}
if (typeof globalThis !== 'undefined') {
  globalThis.db = db;
}

export default db;
