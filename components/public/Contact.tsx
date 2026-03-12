"use client";

import { Mail, Camera } from "lucide-react";
import { LIGHT_BG, DARK_WINE, WINE_RED } from "@/lib/theme";

const organizers = [
  { name: "Petr Tyč", role: "Samozvaný ředitel soutěže Čůčobraní", emoji: "🍷" },
  { name: "Libor Artur Martínek", role: "Technický ředitel soutěže Čůčobraní", emoji: "⚙️" },
  { name: "Jiří Kača Zocher", role: "Mistr banja a člen organizačního výboru", emoji: "🪕" },
];

export function Contact() {
  return (
    <section id="kontakt" style={{ background: LIGHT_BG }} className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <div className="flex items-center gap-3 mb-4">
          <span style={{ width: "40px", height: "3px", backgroundColor: WINE_RED, display: "inline-block", borderRadius: "2px" }} />
          <span style={{ color: WINE_RED, fontFamily: "var(--font-inter), sans-serif", fontSize: "0.78rem", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600 }}>Kontakt</span>
        </div>
        <h2
          style={{
            fontFamily: "var(--font-bebas), sans-serif",
            fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
            color: DARK_WINE,
            letterSpacing: "0.03em",
            lineHeight: 1,
            marginBottom: "3rem",
          }}
        >
          Kontakt
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.78rem", color: "#999", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600, marginBottom: "1.5rem" }}>Organizační výbor</p>
            <div className="flex flex-col gap-4">
              {organizers.map((org) => (
                <div
                  key={org.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1.25rem",
                    background: "#fff",
                    border: "1px solid rgba(0,0,0,0.07)",
                    borderRadius: "10px",
                    padding: "1.25rem 1.5rem",
                  }}
                >
                  <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: WINE_RED, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", flexShrink: 0 }}>
                    {org.emoji}
                  </div>
                  <div>
                    <p style={{ fontFamily: "var(--font-bebas), sans-serif", fontSize: "1.3rem", color: DARK_WINE, letterSpacing: "0.05em", lineHeight: 1.1 }}>{org.name}</p>
                    <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.82rem", color: "#777", marginTop: "0.2rem" }}>{org.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.78rem", color: "#999", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600, marginBottom: "1.5rem" }}>Web a materiály</p>
            <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.07)", borderRadius: "12px", padding: "2rem", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "50%", backgroundColor: WINE_RED, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Camera size={20} style={{ color: "#fff" }} />
                </div>
                <div>
                  <p style={{ fontFamily: "var(--font-bebas), sans-serif", fontSize: "1.3rem", color: DARK_WINE, letterSpacing: "0.05em", lineHeight: 1.1, marginBottom: "0.5rem" }}>Honza Tyč</p>
                  <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.9rem", color: "#666", lineHeight: 1.6, marginBottom: "1rem" }}>
                    Máte fotografie z Čůčobraní, připomínky nebo nápady k webu? Pošlete je na:
                  </p>
                  <a
                    href="mailto:honza.tyc@gmail.com"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      color: WINE_RED,
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: "1rem",
                      fontWeight: 600,
                      textDecoration: "none",
                      transition: "opacity 0.2s",
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.75")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
                  >
                    <Mail size={16} />
                    honza.tyc@gmail.com
                  </a>
                </div>
              </div>
            </div>
            <div style={{ borderLeft: `3px solid ${WINE_RED}`, paddingLeft: "1.25rem" }}>
              <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.9rem", color: "#888", lineHeight: 1.7, fontStyle: "italic" }}>
                „Čůčobraní je akce organizovaná partou lidí, kteří to dělají pro radost. Nikoli jako komerční event."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
