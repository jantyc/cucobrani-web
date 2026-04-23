"use client";

import { Mail } from "lucide-react";
import { LIGHT_BG, DARK_WINE, WINE_RED } from "@/lib/theme";

const organizers = [
  {
    name: "Petr Tyč",
    role: "Samozvaný ředitel soutěže Čůčobraní",
    email: "tycak2@gmail.com",
    emoji: "🍷",
  },
  {
    name: "Libor Artur Martínek",
    role: "Technický ředitel soutěže Čůčobraní",
    email: "libor.martinek@gmail.com",
    emoji: "⚙️",
  },
  {
    name: "Jan Tyč",
    role: "Média, fotografie, web",
    email: "honza.tyc@gmail.com",
    emoji: "📷",
  },
];

export function Contact() {
  return (
    <section id="kontakt" style={{ background: LIGHT_BG }} className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <div className="flex items-center gap-3 mb-4">
          <span style={{ width: "40px", height: "3px", backgroundColor: WINE_RED, display: "inline-block", borderRadius: "2px" }} />
          <span style={{ color: WINE_RED, fontFamily: "var(--font-inter), sans-serif", fontSize: "0.78rem", letterSpacing: "0.13em", textTransform: "uppercase", fontWeight: 700 }}>
            Kontakt
          </span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <h2
            style={{
              fontFamily: "var(--font-bebas), sans-serif",
              fontSize: "clamp(2.8rem, 5vw, 4.5rem)",
              color: DARK_WINE,
              letterSpacing: "0.03em",
              lineHeight: 1,
              fontWeight: 700,
            }}
          >
            Kontakt
          </h2>
          <p
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "clamp(0.92rem, 1.5vw, 1.05rem)",
              color: "#8B8B8B",
              lineHeight: 1.6,
              fontWeight: 600,
              maxWidth: "360px",
              textAlign: "right",
            }}
          >
            „Akce organizovaná partou lidí pro radost, nikoli jako komerční event."
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {organizers.map((org) => (
            <div
              key={org.name}
              style={{
                background: "#fff",
                border: "1px solid rgba(0,0,0,0.06)",
                borderRadius: "12px",
                padding: "1.55rem 1.55rem 1.35rem",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 10px 24px rgba(58,15,22,0.12)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(122,30,44,0.22)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,0,0,0.06)";
              }}
            >
              <div style={{ width: "52px", height: "52px", borderRadius: "50%", backgroundColor: WINE_RED, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.35rem", flexShrink: 0, marginBottom: "1rem" }}>
                {org.emoji}
              </div>
              <p style={{ fontFamily: "var(--font-bebas), sans-serif", fontSize: "2rem", color: DARK_WINE, letterSpacing: "0.035em", lineHeight: 1.04, fontWeight: 700 }}>
                {org.name}
              </p>
              <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.95rem", color: "#777", marginTop: "0.45rem", fontWeight: 500, lineHeight: 1.5 }}>
                {org.role}
              </p>
              <div style={{ borderTop: "1px solid rgba(0,0,0,0.07)", marginTop: "1.3rem", paddingTop: "1rem" }}>
                <a
                  href={`mailto:${org.email}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    color: DARK_WINE,
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "1.05rem",
                    fontWeight: 600,
                    textDecoration: "none",
                    transition: "opacity 0.2s",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.72")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
                >
                  <Mail size={16} />
                  {org.email}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
