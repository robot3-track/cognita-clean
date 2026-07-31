import { db } from '@/lib/firebase';

import { useState, useEffect } from "react";

export default function OurPartners() {
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    db.entities.PartnerImage.list("order", 50).then(setPartners).catch(() => {});
  }, []);

  if (partners.length === 0) return null;

  return (
    <div className="w-full py-8 border-t" style={{ borderColor: "var(--app-border)" }}>
      <p className="text-center text-xs font-bold uppercase tracking-widest mb-6 opacity-40" style={{ color: "var(--app-text)" }}>
        Our Partners
      </p>
      <div className="flex flex-wrap justify-center gap-8" style={{ alignItems: "center" }}>
        {partners.map(p => {
          const img = (
            <img
              src={p.image_url}
              alt={p.name || "Partner"}
              title={p.name || ""}
              style={{ opacity: 0.5, height: "40px", width: "auto", maxWidth: "120px", objectFit: "contain", display: "block" }}
              className="transition-opacity hover:opacity-80"
            />
          );
          if (p.link_url) {
            return (
              <a
                key={p.id}
                href={p.link_url.startsWith("http") ? p.link_url : `https://${p.link_url}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", height: "40px", flexShrink: 0 }}
              >
                {img}
              </a>
            );
          }
          return (
            <span key={p.id} style={{ display: "flex", alignItems: "center", height: "40px", flexShrink: 0 }}>
              {img}
            </span>
          );
        })}
      </div>
    </div>
  );
}