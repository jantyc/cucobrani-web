"use client";

import { useEffect } from "react";
import Link from "next/link";
import { DARK_WINE, ACID_GREEN } from "@/lib/theme";

export default function NotFoundPage() {
  useEffect(() => {
    document.title = "404 – Stránka nenalezena | Čůčobraní";
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden relative">
      {/* Background image – plná plocha za obsahem */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/404-background.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: 0,
        }}
      />
      {/* Tmavý overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(58,15,22,0.85), rgba(58,15,22,0.75), rgba(58,15,22,0.9))",
          zIndex: 1,
        }}
      />

      <div className="relative z-[2] max-w-[800px] mx-auto px-8 text-center">
        {/* Hlavní nadpis */}
        <div className="mb-8">
          <h1
            style={{
              fontFamily: "var(--font-bebas), sans-serif",
              fontSize: "clamp(6rem, 14vw, 11.25rem)",
              color: "#fff",
              letterSpacing: "0.06em",
              lineHeight: 1.1,
              marginBottom: "0.25rem",
            }}
          >
            404
          </h1>
          <p
            style={{
              fontFamily: "var(--font-bebas), sans-serif",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              color: "#fff",
              letterSpacing: "0.04em",
              lineHeight: 1.2,
            }}
          >
            Stránka nenalezena
          </p>
        </div>

        {/* Popis – nový text z designu */}
        <div className="mb-8">
          <p
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "1.25rem",
              lineHeight: "2rem",
              color: "rgba(255,255,255,0.85)",
              maxWidth: "560px",
              margin: "0 auto",
            }}
          >
            Tato stránka se nevydařila asi jako poslední sračka roku. Raději se vraťte na hlavní
            stránku, kde najdete pouze ověřené a kvalitní obsah.
          </p>
        </div>

        {/* Info box – odrážky */}
        <div
          className="mb-10 max-w-[480px] mx-auto px-6 py-4 rounded-[10px]"
          style={{
            backgroundColor: "rgba(167,209,41,0.08)",
            border: "1px solid rgba(167,209,41,0.25)",
          }}
        >
          <div className="flex flex-col items-center gap-3">
            <div
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontWeight: 600,
                color: ACID_GREEN,
                fontSize: "11px",
                letterSpacing: "0.11em",
                textTransform: "uppercase",
                textAlign: "center",
              }}
            >
              🍷 Možné příčiny této chyby:
            </div>
            <div
              className="flex flex-col gap-1.5 text-[14px] leading-[20px]"
              style={{ color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-inter), sans-serif" }}
            >
              {["Překlep v adrese", "Stránka byla odstraněna", "Odkaz je zastaralý"].map((label) => (
                <div key={label} className="flex items-center gap-2">
                  <span style={{ color: ACID_GREEN }}>•</span>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tlačítko domů */}
        <Link
          href="/"
          className="inline-flex items-center justify-center px-10 py-4 rounded-[4px]"
          style={{
            backgroundColor: "#7A1E2C",
            color: "#fff",
            fontFamily: "var(--font-bebas), sans-serif",
            fontSize: "1.1rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            border: "none",
            cursor: "pointer",
            transition: "background-color 0.2s, transform 0.15s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = "#9b2535";
            (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = "#7A1E2C";
            (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
          }}
        >
          Vrátit se na hlavní stránku
        </Link>
      </div>
    </div>
  );
}

