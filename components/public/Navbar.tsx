"use client";

import { useState, useEffect } from "react";
import { Menu, X, Wine } from "lucide-react";
import { WINE_RED, DARK_WINE, ACID_GREEN } from "@/lib/theme";

const navLinks = [
  { label: "Aktuality", href: "#aktualni-rocnik" },
  { label: "O nás", href: "#o-akci" },
  { label: "Archiv", href: "#archiv" },
  { label: "Místo konání", href: "#misto-konani" },
  { label: "Kontakt", href: "#kontakt" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function handleNav(href: string) {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-colors duration-300"
        style={{
          backgroundColor: scrolled ? DARK_WINE : "transparent",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-10 flex items-center justify-between h-16">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2 cursor-pointer"
            style={{
              fontFamily: "var(--font-bebas), sans-serif",
              color: "#fff",
              letterSpacing: "0.08em",
              fontSize: "1.4rem",
            }}
          >
            <Wine size={20} style={{ color: ACID_GREEN }} />
            Čůčobraní
          </button>

          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <button
                  type="button"
                  onClick={() => handleNav(link.href)}
                  className="cursor-pointer bg-transparent border-none p-0 text-[rgba(255,255,255,0.85)] hover:text-[#A7D129] transition-colors"
                  style={{
                    fontSize: "0.85rem",
                    fontFamily: "var(--font-inter), sans-serif",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    fontWeight: 500,
                  }}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="md:hidden p-2 cursor-pointer bg-transparent border-none text-white"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Zavřít menu" : "Otevřít menu"}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      <div
        className="fixed md:hidden flex flex-col pt-20 px-8 gap-2 transition-transform duration-300"
        style={{
          transform: menuOpen ? "translateX(0)" : "translateX(100%)",
          backgroundColor: DARK_WINE,
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          zIndex: 40,
        }}
      >
        <button
          type="button"
          className="absolute top-4 right-5 bg-transparent border-none cursor-pointer text-white"
          onClick={() => setMenuOpen(false)}
          aria-label="Zavřít"
        >
          <X size={28} />
        </button>
        {navLinks.map((link) => (
          <button
            key={link.href}
            type="button"
            onClick={() => handleNav(link.href)}
            className="bg-transparent border-none cursor-pointer w-full text-left text-[rgba(255,255,255,0.9)]"
            style={{
              fontFamily: "var(--font-bebas), sans-serif",
              fontSize: "2rem",
              letterSpacing: "0.06em",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              paddingBottom: "0.75rem",
              paddingTop: "0.75rem",
            }}
          >
            {link.label}
          </button>
        ))}
      </div>
    </>
  );
}
