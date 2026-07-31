import { db } from '@/lib/firebase';

import { useState, useEffect } from "react";

import { Loader2, BookOpen, ChevronRight, Star } from "lucide-react";
import { Link } from "react-router-dom";

function StarRating({ rating, count }) {
  if (!count) return null;
  return (
    <span className="flex items-center gap-1 text-[10px]" style={{ color: "var(--app-text-muted)" }}>
      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
      {rating.toFixed(1)} ({count})
    </span>
  );
}

export default function DeckPicker({ targetPage, title }) {
  const [tab, setTab] = useState("mine");
  const [myDecks, setMyDecks] = useState([]);
  const [publicDecks, setPublicDecks] = useState([]);
  const [ratings, setRatings] = useState({}); // deck_id -> { avg, count }
  const [trending, setTrending] = useState({}); // deck_id -> count
  const [loading, setLoading] = useState(true);

  const bgStyle = { background: "var(--app-bg)", color: "var(--app-text)" };
  const cardStyle = { background: "var(--app-surface)", border: "1px solid var(--app-border)" };
  const mutedStyle = { color: "var(--app-text-muted)" };

  useEffect(() => {
    const load = async () => {
      const me = await db.auth.me();
      const today = new Date().toISOString().slice(0, 10);
      const [mine, pub, allRatings, todaySessions] = await Promise.all([
        db.entities.Deck.filter({ created_by: me.email }, "-updated_date", 50),
        db.entities.Deck.filter({ is_public: true }, "-updated_date", 50),
        db.entities.DeckRating.list("-created_date", 500),
        db.entities.StudySession.list("-created_date", 500),
      ]);

      // Compute ratings per deck
      const ratingMap = {};
      allRatings.forEach(r => {
        if (!ratingMap[r.deck_id]) ratingMap[r.deck_id] = { sum: 0, count: 0 };
        ratingMap[r.deck_id].sum += r.rating;
        ratingMap[r.deck_id].count += 1;
      });
      const ratingAvg = {};
      Object.entries(ratingMap).forEach(([id, { sum, count }]) => {
        ratingAvg[id] = { avg: sum / count, count };
      });

      // Compute trending (sessions today per deck)
      const trendMap = {};
      todaySessions.forEach(s => {
        if (s.created_date && s.created_date.slice(0, 10) === today && s.deck_id) {
          trendMap[s.deck_id] = (trendMap[s.deck_id] || 0) + 1;
        }
      });

      setMyDecks(mine);
      setPublicDecks(pub.filter(d => d.created_by !== me.email));
      setRatings(ratingAvg);
      setTrending(trendMap);
      setLoading(false);
    };
    load();
  }, []);

  const decks = tab === "mine" ? myDecks : publicDecks;

  return (
    <div className="min-h-screen pb-28 px-5 py-10" style={bgStyle}>
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-black mb-1">Choose a Deck</h1>
        <p className="text-sm mb-5" style={mutedStyle}>Pick a deck to start {title}</p>

        {/* Tabs */}
        <div className="flex gap-2 mb-5">
          {["mine", "public"].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${tab === t ? "bg-violet-500/20 border-violet-500/50 text-violet-400" : "opacity-60 hover:opacity-100"}`}
              style={tab !== t ? cardStyle : {}}
            >
              {t === "mine" ? "My Decks" : "Community Decks"}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 text-violet-500 animate-spin" /></div>
        ) : (
          <div className="space-y-2">
            {decks.map(deck => {
              const r = ratings[deck.id];
              const t = trending[deck.id];
              return (
                <Link key={deck.id} to={`/${targetPage}?deck_id=${deck.id}`}>
                  <div className="flex items-center gap-4 rounded-2xl p-4 cursor-pointer transition-all duration-200 hover:scale-[1.01] hover:shadow-sm" style={cardStyle}>
                    <div className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center" style={{ background: deck.color || "#4F46E5" }}>
                      <BookOpen className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{deck.title}</p>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <p className="text-xs" style={mutedStyle}>{deck.card_count || 0} cards</p>
                        {t > 0 && <span className="text-xs text-emerald-400 font-medium">🔥 {t} studying today</span>}
                        {r && <StarRating rating={r.avg} count={r.count} />}
                        {tab === "public" && deck.author_name && <span className="text-xs" style={mutedStyle}>by {deck.author_name}</span>}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 shrink-0" style={mutedStyle} />
                  </div>
                </Link>
              );
            })}
            {decks.length === 0 && (
              <p className="text-sm text-center py-10" style={mutedStyle}>
                {tab === "mine" ? <>No decks yet. <Link to="/Decks" className="text-violet-400">Create one first</Link></> : "No community decks available yet."}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}