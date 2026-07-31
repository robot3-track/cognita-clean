import { db } from '@/lib/firebase';

import { useState, useEffect } from "react";

import { useTranslation } from "../hooks/useTranslation";
import { Search, Globe, Loader2, ArrowRight, BookOpen, Star, SlidersHorizontal } from "lucide-react";
import VerifiedBadge from "@/components/VerifiedBadge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function PublicDecks() {
  const { t } = useTranslation();
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [ratings, setRatings] = useState({});
  const [trending, setTrending] = useState({});
  const [userRatings, setUserRatings] = useState({});
  const [user, setUser] = useState(null);
  const [sortBy, setSortBy] = useState("trending"); // newest | rating | trending | most_cards

  useEffect(() => {
    const load = async () => {
      const me = await db.auth.me();
      setUser(me);
      const [d, allRatings, myRatings, sessions] = await Promise.all([
        db.entities.Deck.filter({ is_public: true }, "-updated_date", 2000),
        db.entities.DeckRating.list("-created_date", 1000),
        db.entities.DeckRating.filter({ user_email: me.email }),
        db.entities.StudySession.list("-created_date", 2000),
      ]);
      setDecks(d.filter(deck => (deck.card_count || 0) > 0));
      // Ratings
      const rMap = {};
      allRatings.forEach(r => {
        if (!rMap[r.deck_id]) rMap[r.deck_id] = { sum: 0, count: 0 };
        rMap[r.deck_id].sum += r.rating;
        rMap[r.deck_id].count += 1;
      });
      const rAvg = {};
      Object.entries(rMap).forEach(([id, { sum, count }]) => { rAvg[id] = { avg: sum / count, count }; });
      setRatings(rAvg);
      // Trending — weighted by recency: today=3pts, yesterday=2pts, last 7 days=1pt
      const now = Date.now();
      const tMap = {};
      sessions.forEach(s => {
        if (!s.deck_id || !s.created_date) return;
        const ageMs = now - new Date(s.created_date).getTime();
        const ageDays = ageMs / (1000 * 60 * 60 * 24);
        let weight = 0;
        if (ageDays < 1) weight = 3;
        else if (ageDays < 2) weight = 2;
        else if (ageDays < 7) weight = 1;
        if (weight > 0) tMap[s.deck_id] = (tMap[s.deck_id] || 0) + weight;
      });
      setTrending(tMap);
      // User ratings
      const myMap = {};
      myRatings.forEach(r => { myMap[r.deck_id] = r; });
      setUserRatings(myMap);
      setLoading(false);
    };
    load();
  }, []);

  const base = search.trim()
    ? decks.filter(d =>
        [d.title, d.subject, d.description, d.author_name].some(f =>
          f?.toLowerCase().includes(search.toLowerCase())
        )
      )
    : [...decks];

  const filtered = [...base].sort((a, b) => {
    if (sortBy === "rating") {
      const ra = ratings[a.id]?.avg || 0;
      const rb = ratings[b.id]?.avg || 0;
      return rb - ra;
    }
    if (sortBy === "trending") {
      return (trending[b.id] || 0) - (trending[a.id] || 0);
    }
    if (sortBy === "most_cards") {
      return (b.card_count || 0) - (a.card_count || 0);
    }
    // newest
    return new Date(b.created_date || 0) - new Date(a.created_date || 0);
  });

  const bgStyle = { background: "var(--app-bg)", color: "var(--app-text)" };
  const cardStyle = { background: "var(--app-surface)", border: "1px solid var(--app-border)" };
  const mutedStyle = { color: "var(--app-text-muted)" };

  return (
    <div className="min-h-screen pb-28 px-6 py-10" style={bgStyle}>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <Globe className="w-6 h-6 text-violet-400" />
            <h1 className="text-3xl font-black tracking-tight">{t('publicDecks')}</h1>
          </div>
          <p className="text-sm" style={mutedStyle}>{t('communityDecks')}</p>
        </div>

        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={mutedStyle} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t('searchBy')}
              className="w-full pl-11 pr-4 py-3 rounded-2xl text-sm outline-none"
              style={{ background: "var(--app-surface)", border: "1px solid var(--app-border)", color: "var(--app-text)" }}
            />
          </div>
          <div className="relative">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="h-full pl-3 pr-8 py-3 rounded-2xl text-sm font-semibold outline-none appearance-none cursor-pointer"
              style={{ background: "var(--app-surface)", border: "1px solid var(--app-border)", color: "var(--app-text)", colorScheme: "dark" }}
            >
              <option value="newest">{t('newest')}</option>
              <option value="rating">{t('topRated')}</option>
              <option value="trending">{t('trending')}</option>
              <option value="most_cards">{t('mostCards')}</option>
            </select>
            <SlidersHorizontal className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={mutedStyle} />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 rounded-3xl" style={cardStyle}>
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-10" />
            <p className="font-semibold" style={mutedStyle}>{t('noResults')}</p>
            <p className="text-sm mt-1" style={{ ...mutedStyle, opacity: 0.6 }}>Try a different search term</p>
          </div>
        ) : (
          <>
            <p className="text-xs font-medium mb-3" style={mutedStyle}>{filtered.length} deck{filtered.length !== 1 ? "s" : ""}</p>
            <div className="space-y-2">
              {filtered.map(deck => {
                const r = ratings[deck.id];
                const trendCount = trending[deck.id];
                const myR = userRatings[deck.id];
                const rateCard = async (stars) => {
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
                <div key={deck.id} className="rounded-2xl p-4" style={cardStyle}>
                  <Link to={createPageUrl(`Study?deck_id=${deck.id}`)}>  
                    <div className="flex items-center gap-4 cursor-pointer hover:opacity-90 transition-all">
                      <div className="w-10 h-10 rounded-xl shrink-0 overflow-hidden flex items-center justify-center" style={{ background: deck.color || "#4F46E5" }}>
                        {deck.cover_image_url ? <img src={deck.cover_image_url} alt="cover" className="w-full h-full object-cover" /> : deck.cover_sticker ? <span className="text-xl">{deck.cover_sticker}</span> : null}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <p className="font-semibold text-sm truncate">{deck.title}</p>
                          {deck.is_verified && <VerifiedBadge size={13} />}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-0.5">
                          <p className="text-xs" style={mutedStyle}>
                            {deck.author_name || "Anonymous"}{deck.subject ? ` · ${deck.subject}` : ""} · {deck.card_count || 0} cards
                          </p>
                          {trendCount > 0 && <span className="text-xs text-emerald-400 font-medium">🔥 trending</span>}
                          {r && <span className="flex items-center gap-0.5 text-xs text-amber-400"><Star className="w-3 h-3 fill-amber-400" />{r.avg.toFixed(1)} ({r.count})</span>}
                        </div>
                        {deck.description && (
                          <p className="text-xs mt-0.5 truncate" style={{ ...mutedStyle, opacity: 0.6 }}>{deck.description}</p>
                        )}
                      </div>
                      <ArrowRight className="w-4 h-4 shrink-0" style={mutedStyle} />
                    </div>
                  </Link>
                  <div className="flex items-center gap-1 mt-2 pl-1">
                    <span className="text-xs mr-1" style={mutedStyle}>{t('rate')}:</span>
                    {[1,2,3,4,5].map(s => (
                      <button key={s} onClick={() => rateCard(s)} className="transition-transform hover:scale-110">
                        <Star className={`w-4 h-4 ${(myR?.rating || 0) >= s ? "text-amber-400 fill-amber-400" : "text-amber-400/30"}`} />
                      </button>
                    ))}
                  </div>
                </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}