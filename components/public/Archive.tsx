"use client";

import { useState, useMemo } from "react";
import { Search, LayoutGrid, List, Camera, Trophy } from "lucide-react";
import { DARK_WINE, WINE_RED, ACID_GREEN, LIGHT_BG } from "@/lib/theme";
import type { YearData } from "@/lib/year-data";
import { YearDetail } from "./YearDetail";

type ViewMode = "grid" | "timeline";

function YearCard({ year, onClick }: { year: YearData; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "#fff" : "#FAF8F6",
        border: `1px solid ${hovered ? WINE_RED : "rgba(0,0,0,0.08)"}`,
        borderRadius: "12px",
        padding: "1.5rem",
        cursor: "pointer",
        transition: "all 0.2s ease",
        transform: hovered ? "translateY(-3px)" : "none",
        boxShadow: hovered ? "0 8px 24px rgba(122,30,44,0.12)" : "none",
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.72rem", color: WINE_RED, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>
            {year.edition}. ročník
          </span>
          <h3 style={{ fontFamily: "var(--font-bebas), sans-serif", fontSize: "2.2rem", color: DARK_WINE, letterSpacing: "0.04em", lineHeight: 1.0, marginTop: "0.1rem" }}>
            {year.year}
          </h3>
        </div>
        {year.hasGallery ? (
          <span style={{ display: "flex", alignItems: "center", gap: "4px", backgroundColor: ACID_GREEN, color: DARK_WINE, fontSize: "0.68rem", fontWeight: 700, padding: "3px 8px", borderRadius: "4px", letterSpacing: "0.04em", textTransform: "uppercase", fontFamily: "var(--font-inter), sans-serif" }}>
            <Camera size={10} /> Fotogalerie
          </span>
        ) : (
          <span style={{ backgroundColor: "rgba(0,0,0,0.05)", color: "#999", fontSize: "0.65rem", fontFamily: "var(--font-inter), sans-serif", padding: "3px 8px", borderRadius: "4px" }}>bez fotek</span>
        )}
      </div>
      <p
        style={{
          fontFamily: "var(--font-inter), sans-serif",
          fontSize: "0.85rem",
          color: "#555",
          lineHeight: 1.55,
          marginBottom: "1rem",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical" as const,
          overflow: "hidden",
        }}
      >
        {year.description}
      </p>
      {year.winners.queenOfCellar && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: "0.75rem" }}>
          <Trophy size={14} style={{ color: WINE_RED, flexShrink: 0 }} />
          <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.82rem", color: "#333", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            <strong>{year.winners.queenOfCellar.name}</strong> — {year.winners.queenOfCellar.wine}
          </span>
        </div>
      )}
    </div>
  );
}

function TimelineItem({ year, onClick }: { year: YearData; onClick: () => void }) {
  return (
    <div className="flex gap-6 group cursor-pointer pb-8" role="button" tabIndex={0} onClick={onClick} onKeyDown={(e) => e.key === "Enter" && onClick()}>
      <div className="flex flex-col items-center">
        <div style={{ width: "14px", height: "14px", borderRadius: "50%", backgroundColor: WINE_RED, border: "3px solid #fff", boxShadow: `0 0 0 2px ${WINE_RED}`, flexShrink: 0, marginTop: "4px" }} />
        <div style={{ width: "2px", flexGrow: 1, backgroundColor: "rgba(0,0,0,0.08)", minHeight: "60px" }} />
      </div>
      <div className="pb-8 flex-1">
        <div className="flex items-center gap-3 mb-1">
          <span style={{ fontFamily: "var(--font-bebas), sans-serif", fontSize: "1.8rem", color: DARK_WINE, letterSpacing: "0.04em", lineHeight: 1 }}>{year.year}</span>
          <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.72rem", color: WINE_RED, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>{year.edition}. ročník</span>
          {year.hasGallery && (
            <span style={{ backgroundColor: ACID_GREEN, color: DARK_WINE, fontSize: "0.65rem", fontWeight: 700, padding: "2px 6px", borderRadius: "3px", fontFamily: "var(--font-inter), sans-serif", display: "flex", alignItems: "center", gap: "3px" }}>
              <Camera size={9} /> Foto
            </span>
          )}
        </div>
        <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.875rem", color: "#666", lineHeight: 1.55, marginBottom: "0.5rem" }}>{year.description}</p>
        {year.winners.queenOfCellar && (
          <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.8rem", color: WINE_RED }}>🏆 {year.winners.queenOfCellar.name} — {year.winners.queenOfCellar.wine}</span>
        )}
      </div>
    </div>
  );
}

interface ArchiveProps {
  years: YearData[];
}

export function Archive({ years }: ArchiveProps) {
  const [search, setSearch] = useState("");
  const [view, setView] = useState<ViewMode>("grid");
  const [selectedYear, setSelectedYear] = useState<YearData | null>(null);

  const filtered = useMemo(() => {
    const searchLower = search.toLowerCase();
    return years.filter(
      (y) =>
        !search ||
        String(y.year).includes(searchLower) ||
        y.description.toLowerCase().includes(searchLower) ||
        y.winners.queenOfCellar?.name.toLowerCase().includes(searchLower) ||
        y.winners.queenOfCellar?.wine.toLowerCase().includes(searchLower) ||
        y.winners.white?.name.toLowerCase().includes(searchLower) ||
        y.winners.red?.name.toLowerCase().includes(searchLower)
    );
  }, [years, search]);

  return (
    <section id="archiv" style={{ backgroundColor: LIGHT_BG }} className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <div className="flex items-center gap-3 mb-4">
          <span style={{ width: "40px", height: "3px", backgroundColor: WINE_RED, display: "inline-block", borderRadius: "2px" }} />
          <span style={{ color: WINE_RED, fontFamily: "var(--font-inter), sans-serif", fontSize: "0.78rem", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600 }}>Archiv ročníků</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <h2 style={{ fontFamily: "var(--font-bebas), sans-serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", color: DARK_WINE, letterSpacing: "0.03em", lineHeight: 1 }}>Archiv ročníků</h2>
            <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.9rem", color: "#777", marginTop: "0.4rem" }}>více než 30 let odvahy ochutnávat</p>
          </div>
          <div style={{ display: "flex", gap: "4px", background: "#E8E4DF", borderRadius: "8px", padding: "4px" }}>
            {(["grid", "timeline"] as ViewMode[]).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                style={{
                  background: view === v ? "#fff" : "transparent",
                  border: "none",
                  borderRadius: "5px",
                  padding: "0.4rem 0.75rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  color: view === v ? DARK_WINE : "#888",
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "0.8rem",
                  fontWeight: view === v ? 600 : 400,
                  transition: "all 0.15s",
                  boxShadow: view === v ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                }}
              >
                {v === "grid" ? <LayoutGrid size={14} /> : <List size={14} />}
                {v === "grid" ? "Grid" : "Timeline"}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#aaa" }} />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Hledat rok, jméno výrobce, název vína…"
              style={{
                width: "100%",
                padding: "0.75rem 1rem 0.75rem 2.5rem",
                borderRadius: "8px",
                border: "1px solid rgba(0,0,0,0.1)",
                background: "#fff",
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "0.9rem",
                color: "#222",
                outline: "none",
              }}
            />
          </div>
        </div>

        {filtered.length < years.length && years.length > 0 && (
          <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.85rem", color: "#888", marginBottom: "1.5rem" }}>
            Zobrazeno {filtered.length} z {years.length} ročníků
          </p>
        )}

        {view === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((y) => (
              <YearCard key={y.id} year={y} onClick={() => setSelectedYear(y)} />
            ))}
          </div>
        )}

        {view === "timeline" && (
          <div className="max-w-2xl">
            {filtered.map((y) => (
              <TimelineItem key={y.id} year={y} onClick={() => setSelectedYear(y)} />
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "4rem 0" }}>
            <p style={{ fontFamily: "var(--font-bebas), sans-serif", fontSize: "2rem", color: "#ccc", letterSpacing: "0.06em" }}>Nic nenalezeno</p>
            <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.9rem", color: "#aaa", marginTop: "0.5rem" }}>Zkuste jiný vyhledávací výraz nebo filtr.</p>
          </div>
        )}
      </div>

      {selectedYear && <YearDetail year={selectedYear} onClose={() => setSelectedYear(null)} />}
    </section>
  );
}
