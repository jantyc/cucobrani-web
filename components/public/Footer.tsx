"use client";

import { Wine, Mail } from "lucide-react";
import { ACID_GREEN } from "@/lib/theme";

const navLinks = [
  { label: "O akci", href: "#o-akci" },
  { label: "Aktuální ročník", href: "#aktualni-rocnik" },
  { label: "Archiv", href: "#archiv" },
  { label: "Místo konání", href: "#misto-konani" },
  { label: "Kontakt", href: "#kontakt" },
];

export function Footer() {
  const handleNav = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer
      style={{
        backgroundColor: "#0f0408",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}
      className="py-12"
    >
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3" style={{ fontFamily: "var(--font-bebas), sans-serif", color: "#fff", letterSpacing: "0.08em", fontSize: "1.5rem" }}>
              <Wine size={18} style={{ color: ACID_GREEN }} />
              Čůčobraní
            </div>
            <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.82rem", color: "rgba(255,255,255,0.35)", lineHeight: 1.65, maxWidth: "240px" }}>
              Každoroční satirická soutěž domácích ovocných vín. Od roku 1989. Machovsko, Žďár nad Metují.
            </p>
          </div>

          <div>
            <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600, marginBottom: "1rem" }}>Navigace</p>
            <ul className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <button
                    type="button"
                    onClick={() => handleNav(link.href)}
                    style={{
                      color: "rgba(255,255,255,0.5)",
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: "0.875rem",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      transition: "color 0.15s",
                    }}
                    onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#fff")}
                    onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.5)")}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600, marginBottom: "1rem" }}>Kontakt</p>
            <a
              href="mailto:honza.tyc@gmail.com"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                color: ACID_GREEN,
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "0.875rem",
                textDecoration: "none",
                marginBottom: "0.5rem",
                transition: "opacity 0.15s",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.7")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
            >
              <Mail size={14} />
              honza.tyc@gmail.com
            </a>
            <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.8rem", color: "rgba(255,255,255,0.3)", lineHeight: 1.5 }}>
              Fotografie, připomínky,
              <br />
              nápady k webu.
            </p>
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "1.5rem", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
          <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.78rem", color: "rgba(255,255,255,0.2)" }}>© 2025 Čůčobraní · Žďár nad Metují · Machovsko</p>
          <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.78rem", color: "rgba(255,255,255,0.15)" }}>Akce organizovaná pro radost, nikoli pro zisk 🍷</p>
        </div>
      </div>
    </footer>
  );
}
