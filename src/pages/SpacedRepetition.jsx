import { db } from '@/lib/firebase';

import { useState, useEffect } from "react";

import { Brain, Check, AlertCircle, Zap, Loader2, BookOpen, Globe, Lock, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import LatexRenderer from "@/components/LatexRenderer";
import { useTranslation } from "../hooks/useTranslation";

const TODAY = new Date().toISOString().slice(0, 10);

function getDueDate(intervalDays) {
  const d = new Date();
  d.setDate(d.getDate() + Math.round(intervalDays));
  return d.toISOString().slice(0, 10);
}

export default function SpacedRepetition() {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [decks, setDecks] = useState([]);
  const [publicDecks, setPublicDecks] = useState([]);
  const [ratings, setRatings] = useState({});
  const [trending, setTrending] = useState({});
  const [userRatings, setUserRatings] = useState({});
  const [deckTab, setDeckTab] = useState("mine");
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [dueCards, setDueCards] = useState([]);
  const [srsMap, setSrsMap] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("pick"); // pick | review | done
  const [reviewed, setReviewed] = useState(0);

  useEffect(() => {
    db.auth.me().then(async (me) => {
      setUser(me);
      const today = new Date().toISOString().slice(0, 10);
      const [d, pub, allRatings, myRatings, sessions] = await Promise.all([
        db.entities.Deck.filter({ created_by: me.email }, "-updated_date", 30),
        db.entities.Deck.filter({ is_public: true }, "-updated_date", 30),
        db.entities.DeckRating.list("-created_date", 1000),
        db.entities.DeckRating.filter({ user_email: me.email }),
        db.entities.StudySession.list("-created_date", 500),
      ]);
      setDecks(d);
      setPublicDecks(pub);
      const rMap = {};
      allRatings.forEach(r => {
        if (!rMap[r.deck_id]) rMap[r.deck_id] = { sum: 0, count: 0 };
        rMap[r.deck_id].sum += r.rating;
        rMap[r.deck_id].count += 1;
      });
      const rAvg = {};
      Object.entries(rMap).forEach(([id, { sum, count }]) => { rAvg[id] = { avg: sum / count, count }; });
      setRatings(rAvg);
      const tMap = {};
      sessions.forEach(s => {
        if (s.created_date?.slice(0, 10) === today && s.deck_id) tMap[s.deck_id] = (tMap[s.deck_id] || 0) + 1;
      });
      setTrending(tMap);
      const myMap = {};
      myRatings.forEach(r => { myMap[r.deck_id] = r; });
      setUserRatings(myMap);
      setLoading(false);
    });
  }, []);

  const selectDeck = async (deck) => {
    setLoading(true);
    setSelectedDeck(deck);
    const [allCards, srsRecords] = await Promise.all([
      db.entities.Flashcard.filter({ deck_id: deck.id }),
      db.entities.SRSCard.filter({ deck_id: deck.id, user_email: user.email }),
    ]);
    const map = {};
    srsRecords.forEach(r => { map[r.card_id] = r; });
    setSrsMap(map);
    const due = allCards.filter(c => {
      const rec = map[c.id];
      if (!rec) return true; // never reviewed
      return (rec.due_date || TODAY) <= TODAY;
    });
    setDueCards(due);
    setCurrentIndex(0);
    setFlipped(false);
    setReviewed(0);
    setMode("review");
    setLoading(false);
  };

  const rateCard = async (rating) => {
    const card = dueCards[currentIndex];
    const rec = srsMap[card.id];
    let interval = rec?.interval_days || 1;
    let ease = rec?.ease_factor || 2.5;
    let reps = rec?.repetitions || 0;

    if (rating === "easy") {
      interval = Math.max(1, interval * ease);
      ease = Math.min(3.0, ease + 0.15);
      reps += 1;
    } else if (rating === "medium") {
      interval = Math.max(1, interval);
      reps += 1;
    } else {
      interval = 1;
      ease = Math.max(1.3, ease - 0.2);
      reps = 0;
    }

    const due_date = getDueDate(interval);
    const data = { user_email: user.email, card_id: card.id, deck_id: selectedDeck.id, interval_days: interval, ease_factor: ease, due_date, repetitions: reps };

    if (rec) {
      await db.entities.SRSCard.update(rec.id, data);
      setSrsMap(prev => ({ ...prev, [card.id]: { ...rec, ...data } }));
    } else {
      const created = await db.entities.SRSCard.create(data);
      setSrsMap(prev => ({ ...prev, [card.id]: created }));
    }

    setReviewed(r => r + 1);
    if (currentIndex < dueCards.length - 1) {
      setCurrentIndex(i => i + 1);
      setFlipped(false);
    } else {
      setMode("done");
    }
  };

  const bgStyle = { background: "var(--app-bg)", color: "var(--app-text)" };
  const cardStyle = { background: "var(--app-surface)", border: "1px solid var(--app-border)" };
  const mutedStyle = { color: "var(--app-text-muted)" };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={bgStyle}>
      <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
    </div>
  );

  if (mode === "done") return (
    <div className="min-h-screen flex items-center justify-center px-6" style={bgStyle}>
      <div className="max-w-sm w-full text-center rounded-3xl p-8" style={cardStyle}>
        <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-emerald-400" />
        </div>
        <h2 className="text-2xl font-black mb-2">{t('sessionComplete')}</h2>
        <p className="text-sm mb-6" style={mutedStyle}>{t('sessionCompleteReviewed')} <strong>{reviewed}</strong> {t('cards')}. {t('cardsScheduled')}</p>
        <div className="flex gap-3">
          <button onClick={() => setMode("pick")} className="flex-1 py-3 rounded-2xl text-sm font-semibold" style={cardStyle}>{t('pickDeck')}</button>
          <button onClick={() => selectDeck(selectedDeck)} className="flex-1 bg-violet-600 hover:bg-violet-500 text-white py-3 rounded-2xl text-sm font-semibold transition-all">{t('reviewAgain')}</button>
        </div>
      </div>
    </div>
  );

  if (mode === "review") {
    const card = dueCards[currentIndex];
    if (!card || dueCards.length === 0) return (
      <div className="min-h-screen flex items-center justify-center px-6" style={bgStyle}>
        <div className="max-w-sm w-full text-center rounded-3xl p-8" style={cardStyle}>
          <Brain className="w-12 h-12 text-violet-400 mx-auto mb-4" />
          <h2 className="text-xl font-black mb-2">{t('allCaughtUpSRS')}</h2>
          <p className="text-sm mb-6" style={mutedStyle}>{t('noCardsDueToday')}</p>
          <button onClick={() => setMode("pick")} className="w-full bg-violet-600 text-white py-3 rounded-2xl text-sm font-semibold">{t('backToDecks')}</button>
        </div>
      </div>
    );

    const rec = srsMap[card.id];
    const nextEasy = getDueDate(Math.max(1, (rec?.interval_days || 1) * (rec?.ease_factor || 2.5)));
    const nextMedium = getDueDate(Math.max(1, rec?.interval_days || 1));

    return (
      <div className="min-h-screen pb-28 px-6 py-10" style={bgStyle}>
        <div className="max-w-xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setMode("pick")} className="text-sm font-medium" style={mutedStyle}>{t('backToDecks')}</button>
            <span className="text-sm font-medium" style={mutedStyle}>{currentIndex + 1} / {dueCards.length}</span>
          </div>

          <div onClick={() => setFlipped(!flipped)}
            className="rounded-3xl p-10 min-h-64 flex items-center justify-center cursor-pointer mb-4 text-center select-none"
            style={cardStyle}
          >
            <div className="text-xl font-semibold leading-relaxed">
              <LatexRenderer text={flipped ? card.back : card.front} />
            </div>
          </div>
          <p className="text-xs text-center mb-6" style={mutedStyle}>{flipped ? t('answer') : t('tapToReveal')}</p>

          {flipped && (
            <div className="grid grid-cols-3 gap-3">
              <button onClick={() => rateCard("hard")} className="flex flex-col items-center gap-1 py-4 rounded-2xl font-semibold text-sm bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all">
                <AlertCircle className="w-5 h-5" />
                {t('hard')}
                <span className="text-xs opacity-70">{t('tomorrow')}</span>
              </button>
              <button onClick={() => rateCard("medium")} className="flex flex-col items-center gap-1 py-4 rounded-2xl font-semibold text-sm bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 transition-all">
                <BookOpen className="w-5 h-5" />
                {t('medium')}
                <span className="text-xs opacity-70">{nextMedium}</span>
              </button>
              <button onClick={() => rateCard("easy")} className="flex flex-col items-center gap-1 py-4 rounded-2xl font-semibold text-sm bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-all">
                <Zap className="w-5 h-5" />
                {t('easy')}
                <span className="text-xs opacity-70">{nextEasy}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28 px-6 py-10" style={bgStyle}>
      <div className="max-w-xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Link to={createPageUrl("Home")}><button className="text-sm font-medium" style={mutedStyle}>← {t('home')}</button></Link>
        </div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-violet-500/15 flex items-center justify-center">
            <Brain className="w-5 h-5 text-violet-400" />
          </div>
          <h1 className="text-2xl font-black">{t('spacedRepetition')}</h1>
        </div>
        <p className="text-sm mb-8" style={mutedStyle}>{t('srsDesc')}</p>

        {/* Deck tab selector */}
        <div className="flex gap-2 mb-5">
          <button onClick={() => setDeckTab("mine")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${deckTab === "mine" ? "bg-violet-500/20 text-violet-400" : "opacity-50 hover:opacity-80"}`}
            style={deckTab !== "mine" ? cardStyle : {}}>
            <Lock className="w-3.5 h-3.5" /> {t('myDecks2')}
          </button>
          <button onClick={() => setDeckTab("public")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${deckTab === "public" ? "bg-blue-500/20 text-blue-400" : "opacity-50 hover:opacity-80"}`}
            style={deckTab !== "public" ? cardStyle : {}}>
            <Globe className="w-3.5 h-3.5" /> {t('publicDecks2')}
          </button>
        </div>

        {(() => {
          const displayDecks = deckTab === "mine" ? decks : publicDecks;
          return displayDecks.length === 0 ? (
            <div className="text-center py-16 rounded-3xl" style={cardStyle}>
              <p className="text-sm" style={mutedStyle}>{deckTab === "mine" ? t('noCards') : t('noResults')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {displayDecks.map(deck => {
                const r = ratings[deck.id];
                const trendCount = trending[deck.id];
                const myR = userRatings[deck.id];
                const rateCard = async (e, stars) => {
                  e.stopPropagation();
                  if (myR) {
                    await db.entities.DeckRating.update(myR.id, { rating: stars });
                  } else {
                    const created = await db.entities.DeckRating.create({ deck_id: deck.id, user_email: user.email, rating: stars });
                    setUserRatings(prev => ({ ...prev, [deck.id]: created }));
                  }
                  setRatings(prev => {
                    const old = prev[deck.id] || { avg: 0, count: 0 };
                    const oldSum = (old.avg || 0) * (old.count || 0);
                    const newCount = myR ? old.count : old.count + 1;
                    const newSum = myR ? oldSum - (myR.rating || 0) + stars : oldSum + stars;
                    return { ...prev, [deck.id]: { avg: newSum / newCount, count: newCount } };
                  });
                };
                return (
                <div key={deck.id} className="rounded-3xl overflow-hidden" style={cardStyle}>
                  <button onClick={() => selectDeck(deck)}
                    className="w-full flex items-center gap-4 p-5 pb-3 text-left hover:opacity-90 transition-all"
                  >
                    <div className="w-10 h-10 rounded-2xl shrink-0 flex items-center justify-center" style={{ background: deck.color || "#4F46E5" }}>
                      <BookOpen className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm">{deck.title}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-0.5">
                        <p className="text-xs" style={mutedStyle}>{deck.card_count || 0} cards{deckTab === "public" && deck.author_name ? ` · ${deck.author_name}` : ""}</p>
                        {trendCount > 0 && <span className="text-xs text-emerald-400 font-medium">🔥 {trendCount} studying today</span>}
                        {r && <span className="flex items-center gap-0.5 text-xs text-amber-400"><Star className="w-3 h-3 fill-amber-400" />{r.avg.toFixed(1)} ({r.count})</span>}
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-violet-400">{t('reviewNeeded')} →</span>
                  </button>
                  {deckTab === "public" && (
                    <div className="flex items-center gap-1 px-5 pb-3">
                      <span className="text-xs mr-1" style={mutedStyle}>{t('rate')}:</span>
                      {[1,2,3,4,5].map(s => (
                        <button key={s} onClick={(e) => rateCard(e, s)} className="transition-transform hover:scale-110">
                          <Star className={`w-4 h-4 ${(myR?.rating || 0) >= s ? "text-amber-400 fill-amber-400" : "text-amber-400/30"}`} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                );
              })}
            </div>
          );
        })()}
      </div>
    </div>
  );
}