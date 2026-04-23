"use client";

import { Wine, Mail } from "lucide-react";
import { ACID_GREEN } from "@/lib/theme";

const navLinks = [
  { label: "O akci", href: "#o-akci" },
  { label: "Poslední ročník", href: "#aktualni-rocnik" },
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
            <div
              className="flex items-center gap-2 mb-3"
              style={{
                fontFamily: "var(--font-bebas), sans-serif",
                color: "#fff",
                letterSpacing: "0.08em",
                fontSize: "1.5rem",
              }}
            >
              <Wine size={18} style={{ color: ACID_GREEN, transform: "translateY(-1px)" }} />
              Čůčobraní
            </div>
            <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.82rem", color: "rgba(255,255,255,0.8)", lineHeight: 1.65, maxWidth: "260px" }}>
              Tradiční setkání amatérských výrobců ovocných vín spojené se soutěží o Královnu sklepa. Odborná porota, divácká soutěž, putovní ceny, hudba, humor a občas i odvážné experimenty.
            </p>
          </div>

          <div>
            <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.6)", letterSpacing: "0.11em", textTransform: "uppercase", fontWeight: 700, marginBottom: "1rem" }}>Navigace</p>
            <ul className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <button
                    type="button"
                    onClick={() => handleNav(link.href)}
                    style={{
                      color: "rgba(255,255,255,0.9)",
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: "0.875rem",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      transition: "color 0.15s",
                    }}
                    onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#FFFFFF")}
                    onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.9)")}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.6)", letterSpacing: "0.11em", textTransform: "uppercase", fontWeight: 700, marginBottom: "1rem" }}>Kontakt</p>
            {[
              { name: "Petr Tyč", role: "Samozvaný ředitel soutěže Čůčobraní", email: "tycak2@gmail.com" },
              { name: "Libor Artur Martínek", role: "Technický ředitel soutěže Čůčobraní", email: "libor.martinek@gmail.com" },
              { name: "Jan Tyč", role: "Média, fotografie, web", email: "honza.tyc@gmail.com" },
            ].map((contact) => (
              <div key={contact.email} style={{ marginBottom: "0.95rem" }}>
                <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.83rem", color: "rgba(255,255,255,0.92)", fontWeight: 600 }}>
                  {contact.name}
                </p>
                <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.78rem", color: "rgba(255,255,255,0.65)", marginTop: "0.1rem", marginBottom: "0.28rem" }}>
                  {contact.role}
                </p>
                <a
                  href={`mailto:${contact.email}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    color: ACID_GREEN,
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "0.82rem",
                    textDecoration: "none",
                    transition: "opacity 0.15s",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.7")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
                >
                  <Mail size={14} />
                  {contact.email}
                </a>
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "1.5rem", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
          <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.78rem", color: "rgba(255,255,255,0.6)" }}>© 2025 Čůčobraní · Žďár nad Metují · Machovsko</p>
          <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.78rem", color: "rgba(255,255,255,0.5)" }}>Akce organizovaná pro radost, nikoli pro zisk 🍷</p>
        </div>
      </div>
    </footer>
  );
}
