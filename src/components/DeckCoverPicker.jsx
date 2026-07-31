import { db } from '@/lib/firebase';
import { useState, useRef } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";

const STICKERS = ["📚","🧠","⚡","🔬","🧪","📐","🌍","🎯","💡","🔭","📊","🎨","🏆","🦋","🌊","🔥","⭐","🚀","🦁","🐬","🌸","🎵","💻","🧬","📝"];

export default function DeckCoverPicker({ deck, isAuthor, onUpdate }) {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const cardStyle = { background: "var(--app-surface)", border: "1px solid var(--app-border)" };

  const uploadImage = async (file) => {
    setUploading(true);
    try {
      // 1. Convert the file to a base64 Data URL right inside the client browser
      const reader = new FileReader();
      
      const localBase64Url = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Failed to read local file asset'));
        
        // Use a balanced data string structure
        reader.readAsDataURL(file);
      });

      // 2. Persist the string safely back to the database entity record
      await db.entities.Deck.update(deck.id, { 
        cover_image_url: localBase64Url, 
        cover_sticker: null 
      });
      
      // 3. Update the component state view instantly
      onUpdate({ 
        cover_image_url: localBase64Url, 
        cover_sticker: null 
      });
      
    } catch (error) {
      console.error("Error updating cover asset image:", error);
      alert("Failed to assign cover asset image.");
    } finally {
      setUploading(false);
      setOpen(false);
    }
  };

  const pickSticker = async (sticker) => {
    await db.entities.Deck.update(deck.id, { cover_sticker: sticker, cover_image_url: null });
    if (onUpdate) onUpdate({ cover_sticker: sticker, cover_image_url: null });
    setOpen(false);
  };

  const clearCover = async () => {
    await db.entities.Deck.update(deck.id, { cover_image_url: null, cover_sticker: null });
    if (onUpdate) onUpdate({ cover_image_url: null, cover_sticker: null });
    setOpen(false);
  };

  const cover = deck?.cover_image_url
    ? <img src={deck.cover_image_url} alt="cover" className="w-full h-full object-cover rounded-2xl" />
    : deck?.cover_sticker
    ? <span className="text-3xl">{deck.cover_sticker}</span>
    : null;

  return (
    <div className="relative shrink-0">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center overflow-hidden relative"
        style={{ background: deck?.color || "#4F46E5" }}
      >
        {cover}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/50">
            <Loader2 className="w-5 h-5 text-white animate-spin" />
          </div>
        )}
        {isAuthor && !uploading && (
          <button
            onClick={() => setOpen(o => !o)}
            className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/0 hover:bg-black/40 transition-all group"
          >
            <ImagePlus className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-all" />
          </button>
        )}
      </div>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-16 left-0 z-50 rounded-2xl p-4 shadow-2xl w-72" style={cardStyle}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-bold">Deck Cover</p>
              <button onClick={() => setOpen(false)}><X className="w-4 h-4 opacity-50 hover:opacity-100" /></button>
            </div>

            <button
              onClick={() => fileRef.current?.click()}
              className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium mb-3 transition-all hover:opacity-80"
              style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)" }}>
              <ImagePlus className="w-4 h-4 text-violet-400" /> Upload Image
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden"
              onChange={e => e.target.files?.[0] && uploadImage(e.target.files[0])} />

            <p className="text-xs font-semibold mb-2" style={{ color: "var(--app-text-muted)" }}>Or pick a sticker</p>
            <div className="grid grid-cols-5 gap-1.5 mb-3">
              {STICKERS.map(s => (
                <button key={s} onClick={() => pickSticker(s)}
                  className={`h-10 rounded-xl text-xl flex items-center justify-center transition-all hover:scale-110 ${deck?.cover_sticker === s ? "ring-2 ring-violet-500" : ""}`}
                  style={{ background: "var(--app-bg)" }}>
                  {s}
                </button>
              ))}
            </div>

            {(deck?.cover_image_url || deck?.cover_sticker) && (
              <button onClick={clearCover} className="w-full py-2 rounded-xl text-xs font-medium text-red-400 hover:bg-red-500/10 transition-all">
                Remove cover
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}