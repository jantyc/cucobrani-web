"use client";

import { Wine } from "lucide-react";
import { ACID_GREEN } from "@/lib/theme";

const navLinks = [
  { label: "O akci", href: "#o-akci" },
  { label: "Aktuální ročník", href: "#aktualni-rocnik" },
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
        backgroundColor: "#0f0408",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <div>
            <div
              className="flex items-center gap-2 mb-3 text-white"
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
              className="text-white/35 text-sm leading-relaxed max-w-[240px]"
              style={{ fontFamily: "var(--font-inter), sans-serif" }}
            >
              Každoroční satirická soutěž domácích ovocných vín. Od roku 1989. Machovsko, Žďár nad
              Metují.
            </p>
          </div>

          <div>
            <p
              className="uppercase text-[0.72rem] tracking-widest font-semibold text-white/30 mb-4"
              style={{ fontFamily: "var(--font-inter), sans-serif" }}
            >
              Navigace
            </p>
            <ul className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <button
                    type="button"
                    onClick={() => handleNav(link.href)}
                    className="text-white/50 hover:text-white/80 text-sm bg-transparent border-none cursor-pointer transition-colors"
                    style={{ fontFamily: "var(--font-inter), sans-serif" }}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p
              className="uppercase text-[0.72rem] tracking-widest font-semibold text-white/30 mb-4"
              style={{ fontFamily: "var(--font-inter), sans-serif" }}
            >
              Admin
            </p>
            <a
              href="/admin"
              className="text-white/50 hover:text-white/80 text-sm transition-colors"
              style={{ fontFamily: "var(--font-inter), sans-serif" }}
            >
              Přihlásit se do administrace
            </a>
          </div>
        </div>

        <div
          className="pt-8 border-t border-white/5 text-white/25 text-sm"
          style={{ fontFamily: "var(--font-inter), sans-serif" }}
        >
          © {new Date().getFullYear()} Čůčobraní. Všechna práva vyhrazena.
        </div>
      </div>
    </footer>
  );
}
