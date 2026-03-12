"use client";

import { useState, useMemo } from "react";
import { Search, LayoutGrid, List } from "lucide-react";
import Link from "next/link";
import type { YearForArchive } from "./Archive";
import { DARK_WINE, WINE_RED, ACID_GREEN } from "@/lib/theme";

type ViewMode = "grid" | "timeline";

interface ArchiveClientProps {
  years: YearForArchive[];
}

function YearCard({ year }: { year: YearForArchive }) {
  const displayYear = year.year ?? year.title ?? year.name ?? "—";
  const displayEdition = year.edition ? `${year.edition}. ročník` : "";

  return (
    <Link
      href={`/archiv/${year.id}`}
      className="block rounded-xl p-6 border border-black/10 bg-[#FAF8F6] hover:bg-white hover:border-[#7A1E2C] hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
      style={{ boxShadow: "0 0 0 transparent" }}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <span
            className="uppercase text-[0.72rem] font-semibold tracking-widest"
            style={{ color: WINE_RED, fontFamily: "var(--font-inter), sans-serif" }}
          >
            {displayEdition}
          </span>
          <h3
            className="mt-0.5"
            style={{
              fontFamily: "var(--font-bebas), sans-serif",
              fontSize: "2.2rem",
              color: DARK_WINE,
              letterSpacing: "0.04em",
              lineHeight: 1,
            }}
          >
            {displayYear}
          </h3>
        </div>
      </div>
      <p
        className="text-sm text-[#555] line-clamp-2"
        style={{ fontFamily: "var(--font-inter), sans-serif" }}
      >
        {year.title || year.name || `Ročník ${displayYear}`}
      </p>
    </Link>
  );
}

function TimelineItem({ year }: { year: YearForArchive }) {
  const displayYear = year.year ?? year.title ?? year.name ?? "—";
  const displayEdition = year.edition ? `${year.edition}. ročník` : "";

  return (
    <Link
      href={`/archiv/${year.id}`}
      className="flex gap-6 group cursor-pointer pb-8"
    >
      <div className="flex flex-col items-center">
        <div
          className="w-3.5 h-3.5 rounded-full flex-shrink-0 mt-1"
          style={{
            backgroundColor: WINE_RED,
            border: "3px solid #fff",
            boxShadow: `0 0 0 2px ${WINE_RED}`,
          }}
        />
        <div
          className="w-0.5 flex-grow min-h-[60px]"
          style={{ backgroundColor: "rgba(0,0,0,0.08)" }}
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-1">
          <span
            style={{
              fontFamily: "var(--font-bebas), sans-serif",
              fontSize: "1.8rem",
              color: DARK_WINE,
              letterSpacing: "0.04em",
              lineHeight: 1,
            }}
          >
            {displayYear}
          </span>
          <span
            className="uppercase text-[0.72rem] font-semibold tracking-widest"
            style={{ color: WINE_RED, fontFamily: "var(--font-inter), sans-serif" }}
          >
            {displayEdition}
          </span>
        </div>
        <p
          className="text-sm text-[#666]"
          style={{ fontFamily: "var(--font-inter), sans-serif" }}
        >
          {year.title || year.name || `Ročník ${displayYear}`}
        </p>
      </div>
    </Link>
  );
}

export function ArchiveClient({ years }: ArchiveClientProps) {
  const [search, setSearch] = useState("");
  const [view, setView] = useState<ViewMode>("grid");

  const filtered = useMemo(() => {
    if (!search.trim()) return years;
    const q = search.toLowerCase();
    return years.filter(
      (y) =>
        String(y.year ?? "").includes(q) ||
        (y.title ?? "").toLowerCase().includes(q) ||
        (y.name ?? "").toLowerCase().includes(q) ||
        (y.edition ?? "").toLowerCase().includes(q)
    );
  }, [years, search]);

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#aaa]"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Hledat rok, ročník…"
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-black/10 bg-white outline-none"
            style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.9rem" }}
          />
        </div>
        <div
          className="flex gap-1 p-1 rounded-lg"
          style={{ backgroundColor: "#E8E4DF" }}
        >
          {(["grid", "timeline"] as ViewMode[]).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all"
              style={{
                backgroundColor: view === v ? "#fff" : "transparent",
                color: view === v ? DARK_WINE : "#888",
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "0.8rem",
                fontWeight: view === v ? 600 : 400,
                boxShadow: view === v ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              }}
            >
              {v === "grid" ? <LayoutGrid size={14} /> : <List size={14} />}
              {v === "grid" ? "Grid" : "Timeline"}
            </button>
          ))}
        </div>
      </div>

      {filtered.length < years.length && years.length > 0 && (
        <p
          className="text-sm text-[#888] mb-6"
          style={{ fontFamily: "var(--font-inter), sans-serif" }}
        >
          Zobrazeno {filtered.length} z {years.length} ročníků
        </p>
      )}

      {view === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((y) => (
            <YearCard key={y.id} year={y} />
          ))}
        </div>
      )}

      {view === "timeline" && (
        <div className="max-w-2xl">
          {filtered.map((y) => (
            <TimelineItem key={y.id} year={y} />
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p
            style={{
              fontFamily: "var(--font-bebas), sans-serif",
              fontSize: "2rem",
              color: "#ccc",
              letterSpacing: "0.06em",
            }}
          >
            Nic nenalezeno
          </p>
          <p
            className="text-sm text-[#aaa] mt-2"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            Zkuste jiný vyhledávací výraz.
          </p>
        </div>
      )}
    </>
  );
}
