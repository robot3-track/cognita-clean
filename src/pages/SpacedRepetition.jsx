import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Brain,
  Check,
  AlertCircle,
  Zap,
  Loader2,
  BookOpen,
  Globe,
  Lock,
  Star,
  Search,
  ArrowLeft,
  ChevronRight,
  Flame,
} from "lucide-react";

import { db } from "@/lib/firebase";
import { createPageUrl } from "@/utils";
import LatexRenderer from "@/components/LatexRenderer";
import { useTranslation } from "../hooks/useTranslation";

const TODAY = new Date().toISOString().slice(0, 10);

function getDueDate(intervalDays) {
  const date = new Date();
  date.setDate(date.getDate() + Math.round(intervalDays));
  return date.toISOString().slice(0, 10);
}

export default function SpacedRepetition() {
  const { t } = useTranslation();

  // User & Data State
  const [user, setUser] = useState(null);
  const [decks, setDecks] = useState([]);
  const [publicDecks, setPublicDecks] = useState([]);
  const [ratings, setRatings] = useState({});
  const [trending, setTrending] = useState({});
  const [userRatings, setUserRatings] = useState({});

  // Navigation & Study State
  const [deckTab, setDeckTab] = useState("mine");
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [dueCards, setDueCards] = useState([]);
  const [srsMap, setSrsMap] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("pick");
  const [reviewedCount, setReviewedCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function initializeData() {
      try {
        const currentUser = await db.auth.me();
        if (!isMounted) return;
        setUser(currentUser);

        const today = new Date().toISOString().slice(0, 10);
        const [userDecks, publicDecksData, allRatings, myRatings, sessions] = await Promise.all([
          db.entities.Deck.filter({ created_by: currentUser.email }, "-updated_date", 30),
          db.entities.Deck.filter({ is_public: true }, "-updated_date", 30),
          db.entities.DeckRating.list("-created_date", 1000),
          db.entities.DeckRating.filter({ user_email: currentUser.email }),
          db.entities.StudySession.list("-created_date", 500),
        ]);

        if (!isMounted) return;

        setDecks(userDecks);
        setPublicDecks(publicDecksData);

        // Process overall deck ratings
        const ratingAccumulator = {};
        allRatings.forEach((r) => {
          if (!ratingAccumulator[r.deck_id]) {
            ratingAccumulator[r.deck_id] = { sum: 0, count: 0 };
          }
          ratingAccumulator[r.deck_id].sum += r.rating;
          ratingAccumulator[r.deck_id].count += 1;
        });

        const computedAverages = {};
        Object.entries(ratingAccumulator).forEach(([deckId, { sum, count }]) => {
          computedAverages[deckId] = { avg: sum / count, count };
        });
        setRatings(computedAverages);

        // Process trending sessions
        const trendingMap = {};
        sessions.forEach((s) => {
          if (s.created_date?.slice(0, 10) === today && s.deck_id) {
            trendingMap[s.deck_id] = (trendingMap[s.deck_id] || 0) + 1;
          }
        });
        setTrending(trendingMap);

        // Process user's own ratings
        const personalRatingsMap = {};
        myRatings.forEach((r) => {
          personalRatingsMap[r.deck_id] = r;
        });
        setUserRatings(personalRatingsMap);
      } catch (error) {
        console.error("Failed to load spaced repetition data:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    initializeData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSelectDeck = async (deck) => {
    setLoading(true);
    setSelectedDeck(deck);

    try {
      const [allCards, srsRecords] = await Promise.all([
        db.entities.Flashcard.filter({ deck_id: deck.id }),
        db.entities.SRSCard.filter({ deck_id: deck.id, user_email: user.email }),
      ]);

      const cardSrsMap = {};
      srsRecords.forEach((r) => {
        cardSrsMap[r.card_id] = r;
      });
      setSrsMap(cardSrsMap);

      const due = allCards.filter((card) => {
        const record = cardSrsMap[card.id];
        if (!record) return true;
        return (record.due_date || TODAY) <= TODAY;
      });

      setDueCards(due);
      setCurrentIndex(0);
      setFlipped(false);
      setReviewedCount(0);
      setMode("review");
    } catch (error) {
      console.error("Error launching deck review:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRateCard = async (rating) => {
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

    const dueDate = getDueDate(interval);
    const srsPayload = {
      user_email: user.email,
      card_id: card.id,
      deck_id: selectedDeck.id,
      interval_days: interval,
      ease_factor: ease,
      due_date: dueDate,
      repetitions: reps,
    };

    if (rec) {
      await db.entities.SRSCard.update(rec.id, srsPayload);
      setSrsMap((prev) => ({ ...prev, [card.id]: { ...rec, ...srsPayload } }));
    } else {
      const createdRecord = await db.entities.SRSCard.create(srsPayload);
      setSrsMap((prev) => ({ ...prev, [card.id]: createdRecord }));
    }

    setReviewedCount((prev) => prev + 1);

    if (currentIndex < dueCards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setFlipped(false);
    } else {
      setMode("done");
    }
  };

  const handleRateDeckStars = async (e, deck, stars) => {
    e.stopPropagation();
    const existingRating = userRatings[deck.id];

    if (existingRating) {
      await db.entities.DeckRating.update(existingRating.id, { rating: stars });
    } else {
      const newRating = await db.entities.DeckRating.create({
        deck_id: deck.id,
        user_email: user.email,
        rating: stars,
      });
      setUserRatings((prev) => ({ ...prev, [deck.id]: newRating }));
    }

    setRatings((prev) => {
      const currentStats = prev[deck.id] || { avg: 0, count: 0 };
      const currentSum = (currentStats.avg || 0) * (currentStats.count || 0);

      const updatedCount = existingRating ? currentStats.count : currentStats.count + 1;
      const updatedSum = existingRating
        ? currentSum - (existingRating.rating || 0) + stars
        : currentSum + stars;

      return {
        ...prev,
        [deck.id]: {
          avg: updatedSum / updatedCount,
          count: updatedCount,
        },
      };
    });
  };

  const containerStyle = { background: "var(--app-bg)", color: "var(--app-text)" };
  const cardStyle = { background: "var(--app-surface)", border: "1px solid var(--app-border)" };
  const mutedStyle = { color: "var(--app-text-muted)" };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={containerStyle}>
        <Loader2 className="w-7 h-7 text-violet-500 animate-spin" />
      </div>
    );
  }

  // Completion Screen
  if (mode === "done") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={containerStyle}>
        <div className="max-w-md w-full text-center rounded-2xl p-8 shadow-sm" style={cardStyle}>
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
            <Check className="w-7 h-7 text-emerald-500" />
          </div>
          <h2 className="text-xl font-bold tracking-tight mb-2">{t("sessionComplete")}</h2>
          <p className="text-sm mb-6 leading-relaxed" style={mutedStyle}>
            {t("sessionCompleteReviewed")} <strong>{reviewedCount}</strong> {t("cards")}.{" "}
            {t("cardsScheduled")}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setMode("pick")}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/5"
              style={cardStyle}
            >
              {t("pickDeck")}
            </button>
            <button
              onClick={() => handleSelectDeck(selectedDeck)}
              className="flex-1 bg-violet-600 hover:bg-violet-500 text-white py-2.5 rounded-xl text-sm font-medium transition-colors"
            >
              {t("reviewAgain")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active Review Screen
  if (mode === "review") {
    const card = dueCards[currentIndex];

    if (!card || dueCards.length === 0) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4" style={containerStyle}>
          <div className="max-w-md w-full text-center rounded-2xl p-8 shadow-sm" style={cardStyle}>
            <Brain className="w-10 h-10 text-violet-500 mx-auto mb-4" />
            <h2 className="text-lg font-bold mb-1">{t("allCaughtUpSRS")}</h2>
            <p className="text-sm mb-6" style={mutedStyle}>
              {t("noCardsDueToday")}
            </p>
            <button
              onClick={() => setMode("pick")}
              className="w-full bg-violet-600 hover:bg-violet-500 text-white py-2.5 rounded-xl text-sm font-medium transition-colors"
            >
              {t("backToDecks")}
            </button>
          </div>
        </div>
      );
    }

    const currentRecord = srsMap[card.id];
    const nextEasyDate = getDueDate(
      Math.max(1, (currentRecord?.interval_days || 1) * (currentRecord?.ease_factor || 2.5))
    );
    const nextMediumDate = getDueDate(Math.max(1, currentRecord?.interval_days || 1));

    return (
      <div className="min-h-screen pb-20 px-4 py-8" style={containerStyle}>
        <div className="max-w-xl mx-auto">
          {/* Header Controls */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setMode("pick")}
              className="flex items-center gap-1 text-sm font-medium hover:opacity-80 transition-opacity"
              style={mutedStyle}
            >
              <ArrowLeft className="w-4 h-4" />
              {t("backToDecks")}
            </button>
            <span className="text-xs font-semibold tracking-wide uppercase" style={mutedStyle}>
              {currentIndex + 1} of {dueCards.length}
            </span>
          </div>

          {/* Flashcard Area */}
          <div
            onClick={() => setFlipped(!flipped)}
            className="rounded-2xl p-8 min-h-[18rem] flex items-center justify-center cursor-pointer mb-3 text-center select-none transition-shadow hover:shadow-md"
            style={cardStyle}
          >
            <div className="text-lg font-medium leading-relaxed">
              <LatexRenderer text={flipped ? card.back : card.front} />
            </div>
          </div>
          <p className="text-xs text-center mb-6" style={mutedStyle}>
            {flipped ? t("answer") : t("tapToReveal")}
          </p>

          {/* Rating Buttons */}
          {flipped && (
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleRateCard("hard")}
                className="flex flex-col items-center gap-1 py-3 px-2 rounded-xl text-sm font-medium bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 transition-colors"
              >
                <AlertCircle className="w-4 h-4" />
                <span>{t("hard")}</span>
                <span className="text-[11px] opacity-75">{t("tomorrow")}</span>
              </button>

              <button
                onClick={() => handleRateCard("medium")}
                className="flex flex-col items-center gap-1 py-3 px-2 rounded-xl text-sm font-medium bg-amber-500/10 border border-amber-500/20 text-amber-500 hover:bg-amber-500/20 transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                <span>{t("medium")}</span>
                <span className="text-[11px] opacity-75">{nextMediumDate}</span>
              </button>

              <button
                onClick={() => handleRateCard("easy")}
                className="flex flex-col items-center gap-1 py-3 px-2 rounded-xl text-sm font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20 transition-colors"
              >
                <Zap className="w-4 h-4" />
                <span>{t("easy")}</span>
                <span className="text-[11px] opacity-75">{nextEasyDate}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Deck Selection View
  const availableDecks = deckTab === "mine" ? decks : publicDecks;
  const filteredDecks = availableDecks.filter((deck) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    const matchesTitle = deck.title?.toLowerCase().includes(query);
    const matchesAuthor = deck.author_name?.toLowerCase().includes(query);
    return matchesTitle || matchesAuthor;
  });

  return (
    <div className="min-h-screen pb-20 px-4 py-8" style={containerStyle}>
      <div className="max-w-xl mx-auto">
        <div className="mb-6">
          <Link
            to={createPageUrl("Home")}
            className="inline-flex items-center gap-1 text-sm font-medium hover:opacity-80 transition-opacity"
            style={mutedStyle}
          >
            <ArrowLeft className="w-4 h-4" />
            {t("home")}
          </Link>
        </div>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
            <Brain className="w-5 h-5 text-violet-500" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{t("spacedRepetition")}</h1>
        </div>
        <p className="text-sm mb-6" style={mutedStyle}>
          {t("srsDesc")}
        </p>

        <div className="relative mb-4">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={mutedStyle} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search decks by title or author..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-violet-500/30"
            style={cardStyle}
          />
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setDeckTab("mine")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
              deckTab === "mine"
                ? "bg-violet-500/10 text-violet-500 border border-violet-500/20"
                : "opacity-70 hover:opacity-100"
            }`}
            style={deckTab !== "mine" ? cardStyle : {}}
          >
            <Lock className="w-3.5 h-3.5" />
            {t("myDecks2")}
          </button>
          <button
            onClick={() => setDeckTab("public")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
              deckTab === "public"
                ? "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                : "opacity-70 hover:opacity-100"
            }`}
            style={deckTab !== "public" ? cardStyle : {}}
          >
            <Globe className="w-3.5 h-3.5" />
            {t("publicDecks2")}
          </button>
        </div>

        {filteredDecks.length === 0 ? (
          <div className="text-center py-12 rounded-2xl" style={cardStyle}>
            <p className="text-sm" style={mutedStyle}>
              {deckTab === "mine" ? t("noCards") : t("noResults")}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredDecks.map((deck) => {
              const ratingData = ratings[deck.id];
              const activeTodayCount = trending[deck.id];
              const userRating = userRatings[deck.id];

              return (
                <div key={deck.id} className="rounded-2xl overflow-hidden transition-all" style={cardStyle}>
                  <button
                    onClick={() => handleSelectDeck(deck)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-3.5 min-w-0 pr-2">
                      <div
                        className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center text-white"
                        style={{ backgroundColor: deck.color || "#4F46E5" }}
                      >
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm truncate">{deck.title}</p>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-0.5">
                          <span className="text-xs" style={mutedStyle}>
                            {deck.card_count || 0} cards
                            {deckTab === "public" && deck.author_name ? ` · ${deck.author_name}` : ""}
                          </span>
                          {activeTodayCount > 0 && (
                            <span className="inline-flex items-center gap-1 text-xs text-emerald-500 font-medium">
                              <Flame className="w-3 h-3" />
                              {activeTodayCount} studying today
                            </span>
                          )}
                          {ratingData && (
                            <span className="inline-flex items-center gap-1 text-xs text-amber-500">
                              <Star className="w-3 h-3 fill-amber-500" />
                              {ratingData.avg.toFixed(1)} ({ratingData.count})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 text-xs font-semibold text-violet-500">
                      <span>{t("reviewNeeded")}</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </button>

                  {deckTab === "public" && (
                    <div className="flex items-center gap-2 px-4 pb-3 pt-1 border-t border-black/5 dark:border-white/5">
                      <span className="text-xs" style={mutedStyle}>
                        {t("rate")}:
                      </span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((starValue) => {
                          const isFilled = (userRating?.rating || 0) >= starValue;
                          return (
                            <button
                              key={starValue}
                              onClick={(e) => handleRateDeckStars(e, deck, starValue)}
                              className="p-0.5 hover:scale-110 transition-transform"
                            >
                              <Star
                                className={`w-3.5 h-3.5 ${
                                  isFilled ? "text-amber-400 fill-amber-400" : "text-amber-400/30"
                                }`}
                              />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
