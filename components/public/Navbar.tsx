"use client";

import { useState, useEffect } from "react";
import { Menu, X, Wine } from "lucide-react";
import { DARK_WINE, ACID_GREEN } from "@/lib/theme";

const navLinks = [
  { label: "O akci", href: "#o-akci" },
  { label: "Poslední ročník", href: "#aktualni-rocnik" },
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

  const handleNav = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <nav
        style={{
          backgroundColor: scrolled ? DARK_WINE : "transparent",
          transition: "background-color 0.3s ease",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "none",
        }}
        className="fixed top-0 left-0 right-0 z-50"
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
            <Wine size={20} style={{ color: ACID_GREEN, transform: "translateY(-1px)" }} />
            <span style={{ fontWeight: 700 }}>Čůčobraní</span>
          </button>

          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <button
                  type="button"
                  onClick={() => handleNav(link.href)}
                  style={{
                    color: "rgba(255,255,255,0.96)",
                    fontSize: "0.85rem",
                    fontFamily: "var(--font-inter), sans-serif",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    fontWeight: 600,
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => ((e.target as HTMLElement).style.color = ACID_GREEN)}
                  onMouseLeave={(e) =>
                    ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.96)")
                  }
                  className="cursor-pointer bg-transparent border-none p-0"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="md:hidden p-2 cursor-pointer bg-transparent border-none"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ color: "#fff" }}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      <div
        style={{
          transform: menuOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s ease",
          backgroundColor: DARK_WINE,
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          zIndex: 40,
          pointerEvents: menuOpen ? "auto" : "none",
        }}
        className="fixed md:hidden flex flex-col pt-20 px-8 gap-2"
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          className="absolute top-4 right-5 bg-transparent border-none cursor-pointer"
          style={{ color: "#fff" }}
          onClick={() => setMenuOpen(false)}
        >
          <X size={28} />
        </button>
        {navLinks.map((link) => (
          <button
            key={link.href}
            type="button"
            onClick={() => handleNav(link.href)}
            style={{
              color: "rgba(255,255,255,0.98)",
              fontFamily: "var(--font-bebas), sans-serif",
              fontSize: "2rem",
              letterSpacing: "0.08em",
              textAlign: "left",
              borderBottom: "1px solid rgba(255,255,255,0.12)",
              paddingBottom: "0.75rem",
              paddingTop: "0.75rem",
            }}
            className="bg-transparent border-none cursor-pointer w-full"
          >
            {link.label}
          </button>
        ))}
      </div>
    </>
  );
}
