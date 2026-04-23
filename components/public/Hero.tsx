"use client";

import { ChevronDown } from "lucide-react";
import { DARK_WINE, WINE_RED, ACID_GREEN, HERO_IMG } from "@/lib/theme";

interface HeroProps {
  upcomingText: string;
  upcomingLocation: string;
  upcomingDatetime: string;
}

export function Hero({ upcomingText, upcomingLocation, upcomingDatetime }: HeroProps) {
  function scrollToSection(id: string) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: DARK_WINE }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={HERO_IMG}
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        loading="eager"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, ${DARK_WINE}cc 0%, ${DARK_WINE}aa 40%, ${DARK_WINE}ee 100%)`,
        }}
      />

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto py-20">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-14"
          style={{
            backgroundColor: "rgba(167,209,41,0.15)",
            border: "1px solid rgba(167,209,41,0.3)",
          }}
        >
          <span
            style={{
              color: ACID_GREEN,
              fontSize: "0.78rem",
              fontFamily: "var(--font-inter), sans-serif",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            od roku 1988 · Machovsko–Policko · Žďár nad Metují
          </span>
        </div>

        <h1
          style={{
            fontFamily: "var(--font-bebas), sans-serif",
            fontSize: "clamp(5rem, 16vw, 14rem)",
            color: "#fff",
            letterSpacing: "0.03em",
            lineHeight: 0.9,
            margin: "0 0 1rem",
          }}
        >
          Čůčobraní
        </h1>

        <p
          style={{
            color: "#FFFFFF",
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
            maxWidth: "600px",
            margin: "0 auto 0.6rem",
            lineHeight: 1.6,
            fontWeight: 600,
          }}
        >
          Zavedená prestižní soutěž domácích ovocných vín.
        </p>
        <p
          style={{
            color: "rgba(255,255,255,0.9)",
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "clamp(0.875rem, 2vw, 1rem)",
            maxWidth: "560px",
            margin: "0 auto 1.75rem",
            lineHeight: 1.7,
            fontWeight: 500,
          }}
        >
          Tradiční setkání amatérských výrobců ovocných vín spojené se soutěží o Královnu sklepa.
          Odborná porota, divácká soutěž, putovní ceny, hudba, humor a občas i odvážné experimenty.
        </p>

        <div className="flex flex-col items-center gap-3 mb-6">
          <div
            style={{
              background: "rgba(167,209,41,0.08)",
              border: "1px solid rgba(167,209,41,0.35)",
              borderRadius: "14px",
              padding: "1.25rem 2rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.85rem",
            }}
          >
            <span
              style={{
                color: ACID_GREEN,
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "0.75rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              {upcomingText || "XXXVIII. ročník Čůčobraní se koná:"}
            </span>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <span
                style={{
                  backgroundColor: "rgba(167,209,41,0.12)",
                  border: "1px solid rgba(167,209,41,0.45)",
                  color: "#fff",
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  borderRadius: "99px",
                  padding: "0.5rem 1.25rem",
                  letterSpacing: "0.02em",
                }}
              >
                📍 {upcomingLocation || "Žďár nad Metují"}
              </span>
              <span
                style={{
                  backgroundColor: "rgba(167,209,41,0.12)",
                  border: "1px solid rgba(167,209,41,0.45)",
                  color: "#fff",
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  borderRadius: "99px",
                  padding: "0.5rem 1.25rem",
                  letterSpacing: "0.02em",
                }}
              >
                🕔 {upcomingDatetime || "30. ledna 2027 od 16:00"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => scrollToSection("aktualni-rocnik")}
            style={{
              backgroundColor: WINE_RED,
              color: "#fff",
              fontFamily: "var(--font-bebas), sans-serif",
              fontSize: "1.1rem",
              letterSpacing: "0.08em",
              padding: "0.85rem 2.2rem",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
              transition: "background-color 0.2s, transform 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "#9b2535";
              (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = WINE_RED;
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            }}
          >
            Zobrazit poslední ročník
          </button>
          <button
            type="button"
            onClick={() => scrollToSection("archiv")}
            style={{
              backgroundColor: "transparent",
              color: "#fff",
              fontFamily: "var(--font-bebas), sans-serif",
              fontSize: "1.1rem",
              letterSpacing: "0.08em",
              padding: "0.85rem 2.2rem",
              borderRadius: "4px",
              border: "1px solid rgba(255,255,255,0.35)",
              cursor: "pointer",
              transition: "border-color 0.2s, transform 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.8)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.35)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            }}
          >
            Procházet archiv
          </button>
        </div>
      </div>

      <div className="absolute bottom-8 left-0 right-0 flex justify-center animate-bounce">
        <ChevronDown size={28} style={{ color: "rgba(255,255,255,0.4)" }} />
      </div>
    </section>
  );
}
