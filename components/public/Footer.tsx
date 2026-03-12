"use client";

import { Wine, Facebook, Instagram } from "lucide-react";
import { ACID_GREEN, DARK_WINE } from "@/lib/theme";

const menuLinks = [
  { label: "Aktuality", href: "#aktualni-rocnik" },
  { label: "O akci", href: "#o-akci" },
  { label: "Archiv", href: "#archiv" },
  { label: "Místo konání", href: "#misto-konani" },
  { label: "Kontakt", href: "#kontakt" },
];

export function Footer() {
  function handleNav(href: string) {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <footer
      className="py-12"
      style={{
        backgroundColor: DARK_WINE,
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Sloupec 1 – logo, copyright, adresa (dle Figmy) */}
          <div>
            <div
              className="flex items-center gap-2 mb-4 text-white"
              style={{
                fontFamily: "var(--font-bebas), sans-serif",
                letterSpacing: "0.08em",
                fontSize: "1.5rem",
              }}
            >
              <Wine size={18} style={{ color: ACID_GREEN }} />
              Čůčobraní
            </div>
            <p
              className="text-white/70 text-sm leading-relaxed mb-2"
              style={{ fontFamily: "var(--font-inter), sans-serif" }}
            >
              © {new Date().getFullYear()} Čůčobraní. Všechna práva vyhrazena.
            </p>
            <p className="text-white/50 text-sm" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
              Žďár nad Metují, Machovsko
            </p>
          </div>

          {/* Sloupec 2 – MENU (dle Figmy) */}
          <div>
            <p
              className="uppercase text-[0.72rem] tracking-widest font-semibold text-white/50 mb-4"
              style={{ fontFamily: "var(--font-inter), sans-serif" }}
            >
              Menu
            </p>
            <ul className="flex flex-col gap-2">
              {menuLinks.map((link) => (
                <li key={link.href}>
                  <button
                    type="button"
                    onClick={() => handleNav(link.href)}
                    className="text-white/70 hover:text-white text-sm bg-transparent border-none cursor-pointer transition-colors text-left"
                    style={{ fontFamily: "var(--font-inter), sans-serif" }}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Sloupec 3 – Sledujte nás (dle Figmy) */}
          <div>
            <p
              className="uppercase text-[0.72rem] tracking-widest font-semibold text-white/50 mb-4"
              style={{ fontFamily: "var(--font-inter), sans-serif" }}
            >
              Sledujte nás
            </p>
            <div className="flex gap-3">
              <a href="#" aria-label="Facebook" className="text-white/70 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" aria-label="Instagram" className="text-white/70 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" aria-label="Youtube" className="text-white/70 hover:text-white transition-colors text-sm font-medium" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                Youtube
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
