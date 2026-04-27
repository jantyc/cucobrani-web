"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp, FileText, X, Camera, ChevronLeft, ChevronRight } from "lucide-react";
import { DARK_WINE, WINE_RED, ACID_GREEN } from "@/lib/theme";
import type { YearData, YearTheme } from "@/lib/year-data";
import { formatPlaceWithTies } from "@/lib/results-ranking";
import { WhiteWineIcon } from "./WhiteWineIcon";

const PROGRAM_BG = "rgba(255,255,255,0.08)";

interface AccordionItemProps {
  title: React.ReactNode;
  entries: { place: number; name: string; sampleNumber?: string; wine: string; points?: number }[];
}

function formatSampleLabel(sampleNumber?: string) {
  const value = (sampleNumber ?? "").trim();
  if (!value) return "Vzorek č.—";
  if (/^[cč]\./i.test(value)) return `Vzorek ${value}`;
  return `Vzorek č.${value}`;
}

function AccordionItem({ title, entries }: AccordionItemProps) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem 0",
          background: "transparent",
          border: "none",
          cursor: "pointer",
        }}
      >
        <span style={{ fontFamily: "var(--font-bebas), sans-serif", fontSize: "1.15rem", letterSpacing: "0.06em", color: DARK_WINE }}>
          {title}
        </span>
        {open ? <ChevronUp size={18} style={{ color: WINE_RED }} /> : <ChevronDown size={18} style={{ color: WINE_RED }} />}
      </button>
      {open && (
        <div className="pb-4">
          {entries.length === 0 ? (
            <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.9rem", color: "#888" }}>
              V tomto ročníku tato kategorie nebyla hodnocena.
            </p>
          ) : (
            <>
              <div className="grid md:hidden" style={{ gap: "0.62rem" }}>
                {entries.map((e, i) => (
                  <div
                    key={`${e.place}-${e.name}`}
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid rgba(0,0,0,0.06)",
                      borderRadius: "12px",
                      boxShadow: "0 1px 5px rgba(0,0,0,0.03)",
                      padding: "0.72rem 0.8rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "0.55rem",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.55rem", minWidth: 0, flex: 1 }}>
                      <span
                        style={{
                          color: WINE_RED,
                          fontFamily: "var(--font-inter), sans-serif",
                          fontWeight: 700,
                          fontSize: "1.24rem",
                          lineHeight: 1,
                          width: "3.35rem",
                          whiteSpace: "nowrap",
                          flexShrink: 0,
                        }}
                      >
                        {formatPlaceWithTies(entries, i, (x) => x.points)}
                      </span>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.86rem", fontWeight: 700, color: "#222", lineHeight: 1.25, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {e.name}
                        </p>
                        <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.72rem", color: "#666", marginTop: "0.11rem", lineHeight: 1.28 }}>
                          {formatSampleLabel(e.sampleNumber)}
                        </p>
                        <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.72rem", color: "#575757", marginTop: "0.1rem", lineHeight: 1.28 }}>
                          {e.wine}
                        </p>
                      </div>
                    </div>
                    <span style={{ fontFamily: "var(--font-inter), sans-serif", color: WINE_RED, fontSize: "0.9rem", lineHeight: 1, fontWeight: 700, flexShrink: 0, whiteSpace: "nowrap" }}>
                      {e.points ?? "—"} b
                    </span>
                  </div>
                ))}
              </div>
              <table className="hidden md:table" style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.06)", fontFamily: "var(--font-inter), sans-serif", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#888" }}>
                    <th style={{ textAlign: "left", paddingBottom: "0.5rem", width: "40px" }}>#</th>
                    <th style={{ textAlign: "left", paddingBottom: "0.5rem", paddingLeft: "0.85rem" }}>Výrobce</th>
                    <th style={{ textAlign: "left", paddingBottom: "0.5rem", width: "120px" }}>Vzorek č.</th>
                    <th style={{ textAlign: "left", paddingBottom: "0.5rem" }}>Víno</th>
                    <th style={{ textAlign: "right", paddingBottom: "0.5rem" }}>Body</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((e, i) => (
                    <tr key={`${e.place}-${e.name}`} style={{ borderBottom: "1px solid rgba(0,0,0,0.04)", fontFamily: "var(--font-inter), sans-serif", fontSize: "0.9rem" }}>
                      <td style={{ padding: "0.6rem 0", color: WINE_RED, fontWeight: 700 }}>
                        {formatPlaceWithTies(entries, i, (x) => x.points)}
                      </td>
                      <td style={{ padding: "0.6rem 0 0.6rem 0.85rem", color: "#222" }}>{e.name}</td>
                      <td style={{ padding: "0.6rem 0", color: "#444" }}>{e.sampleNumber || "—"}</td>
                      <td style={{ padding: "0.6rem 0", color: "#555" }}>{e.wine}</td>
                      <td style={{ padding: "0.6rem 0", textAlign: "right", color: "#888" }}>{e.points ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function ThemeCard({ theme, onOpen }: { theme: YearTheme; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      style={{
        display: "flex",
        flexDirection: "column",
        textDecoration: "none",
        textAlign: "left",
        background: PROGRAM_BG,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderRadius: "10px",
        border: "1px solid rgba(255,255,255,0.1)",
        borderLeft: `3px solid ${ACID_GREEN}`,
        overflow: "hidden",
        cursor: theme.programPdfUrl ? "pointer" : "default",
        transition: "background 0.2s, border-color 0.2s",
        height: "100%",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.13)";
        (e.currentTarget as HTMLElement).style.borderLeftColor = "#C5F040";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = PROGRAM_BG;
        (e.currentTarget as HTMLElement).style.borderLeftColor = ACID_GREEN;
      }}
      disabled={!theme.programPdfUrl}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "1.25rem 1.5rem 0" }}>
        <span
          style={{
            width: "24px",
            height: "2px",
            backgroundColor: ACID_GREEN,
            display: "inline-block",
            borderRadius: "2px",
            flexShrink: 0,
          }}
        />
        <span
          style={{
            color: ACID_GREEN,
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "0.68rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          Téma & program
        </span>
      </div>
      <div style={{ padding: "0.75rem 1.5rem 1.25rem" }}>
        <h4
          style={{
            fontFamily: "var(--font-bebas), sans-serif",
            fontSize: "1.3rem",
            color: "#FFFFFF",
            letterSpacing: "0.05em",
            lineHeight: 1.1,
            fontWeight: 700,
            marginBottom: theme.sceneTitle ? "0.35rem" : "0",
          }}
        >
          {theme.title}
        </h4>
        {theme.sceneTitle && (
          <p
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "0.8rem",
              color: "rgba(255,255,255,0.9)",
              marginBottom: "0",
              fontWeight: 500,
            }}
          >
            Zpracování:{" "}
            <span
              style={{
                color: "#FFFFFF",
                fontWeight: 600,
              }}
            >
              {theme.sceneTitle}
            </span>
          </p>
        )}
        {theme.sceneDescription && (
          <p
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "0.8rem",
              color: "rgba(255,255,255,0.9)",
              lineHeight: 1.6,
              marginTop: "0.65rem",
              borderTop: "1px solid rgba(255,255,255,0.16)",
              paddingTop: "0.65rem",
            }}
          >
            {theme.sceneDescription}
          </p>
        )}
      </div>
      {theme.programThumbnailUrl && (
        <div style={{ padding: "0 1.25rem 1.25rem", marginTop: "auto" }}>
          <div
            style={{
              position: "relative",
              borderRadius: "7px",
              overflow: "hidden",
              border: "1px solid rgba(167,209,41,0.22)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <iframe
              src={theme.programThumbnailUrl}
              title="Náhled programu"
              style={{
                width: "100%",
                aspectRatio: "16/9",
                border: "none",
                display: "block",
                backgroundColor: "#20040a",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                background: "rgba(30,10,5,0.35)",
              }}
            >
              <FileText size={14} style={{ color: ACID_GREEN }} />
              <span
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "0.7rem",
                  color: "rgba(255,255,255,0.85)",
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                Otevřít program
              </span>
            </div>
          </div>
        </div>
      )}
    </button>
  );
}

function Lightbox({ images, initial, onClose }: { images: string[]; initial: number; onClose: () => void }) {
  const [idx, setIdx] = useState(initial);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setIdx((i) => (i - 1 + images.length) % images.length);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        setIdx((i) => (i + 1) % images.length);
      } else if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [images.length, onClose]);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.93)" }}
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        style={{ position: "absolute", top: "1.25rem", right: "1.25rem", color: "#fff", background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "50%", width: "40px", height: "40px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <X size={20} />
      </button>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setIdx((i) => (i - 1 + images.length) % images.length); }}
        style={{ position: "absolute", left: "1rem", color: "#fff", background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "50%", width: "48px", height: "48px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}
      >
        <ChevronLeft size={22} />
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={images[idx]}
        alt=""
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "90vw", maxHeight: "88vh", borderRadius: "8px", objectFit: "contain" }}
      />
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setIdx((i) => (i + 1) % images.length); }}
        style={{ position: "absolute", right: "1rem", color: "#fff", background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "50%", width: "48px", height: "48px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}
      >
        <ChevronRight size={22} />
      </button>
      <div style={{ position: "absolute", bottom: "1.5rem", color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-inter), sans-serif", fontSize: "0.82rem" }}>
        {idx + 1} / {images.length}
      </div>
    </div>
  );
}

interface CurrentEditionProps {
  latestYear: YearData | null;
}

export function CurrentEdition({ latestYear }: CurrentEditionProps) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [showProgramModal, setShowProgramModal] = useState(false);
  const gallerySectionRef = useRef<HTMLDivElement | null>(null);

  const PREVIEW_COUNT = 4;
  const gallery = latestYear?.gallery ?? [];
  const visiblePhotos = showAll ? gallery : gallery.slice(0, PREVIEW_COUNT);
  const hasAnyResults =
    !!latestYear &&
    (latestYear.results.white.length > 0 ||
      latestYear.results.red.length > 0 ||
      latestYear.winners.queenOfCellar ||
      latestYear.winners.audience ||
      latestYear.winners.worst);

  useEffect(() => {
    if (!latestYear || showAll) return;
    if (gallery.length <= PREVIEW_COUNT) return;
    if (!gallerySectionRef.current) return;

    const hidden = gallery.slice(PREVIEW_COUNT);
    let delayed: number | null = null;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.disconnect();

          const run = () => {
            for (const src of hidden) {
              const img = new Image();
              img.src = src;
            }
          };

          delayed = window.setTimeout(() => {
            if ("requestIdleCallback" in window) {
              (
                window as Window & {
                  requestIdleCallback?: (callback: () => void, opts?: { timeout: number }) => number;
                }
              ).requestIdleCallback?.(run, { timeout: 2000 });
            } else {
              run();
            }
          }, 250);
          break;
        }
      },
      { rootMargin: "300px 0px" }
    );

    observer.observe(gallerySectionRef.current);
    return () => {
      observer.disconnect();
      if (delayed !== null) window.clearTimeout(delayed);
    };
  }, [gallery, latestYear, showAll]);

  return (
    <section id="aktualni-rocnik" style={{ background: DARK_WINE }} className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <div className="flex items-center gap-3 mb-12">
          <span style={{ width: "40px", height: "3px", backgroundColor: ACID_GREEN, display: "inline-block", borderRadius: "2px" }} />
          <span style={{ color: ACID_GREEN, fontFamily: "var(--font-inter), sans-serif", fontSize: "0.78rem", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700 }}>
            Poslední ročník
          </span>
        </div>

        {latestYear ? (
          <>
            <h2
              style={{
                fontFamily: "var(--font-bebas), sans-serif",
                fontSize: "clamp(2.8rem, 5vw, 4.5rem)",
                color: "#FFFFFF",
                letterSpacing: "0.03em",
                lineHeight: 1,
                fontWeight: 700,
                marginBottom: "3rem",
              }}
            >
              {latestYear.edition}. ročník Čůčobraní — {latestYear.year}
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch mb-12">
              <div className="lg:col-span-2 flex flex-col gap-4">
                <div
                  style={{
                    background: WINE_RED,
                    borderRadius: "10px",
                    padding: "1.75rem 2rem",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div style={{ position: "absolute", top: "-20px", right: "-20px", fontSize: "8rem", opacity: 0.09, userSelect: "none" }}>🏆</div>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                    <span style={{ fontSize: "2rem" }}>🏆</span>
                    <div>
                      <p style={{ color: "rgba(255,255,255,0.9)", fontFamily: "var(--font-inter), sans-serif", fontSize: "0.75rem", letterSpacing: "0.11em", textTransform: "uppercase", fontWeight: 700, marginBottom: "0.25rem" }}>Královna sklepa</p>
                      <p style={{ fontFamily: "var(--font-bebas), sans-serif", fontSize: "1.9rem", color: "#FFFFFF", letterSpacing: "0.05em", lineHeight: 1.1, fontWeight: 700 }}>
                        {latestYear.winners.queenOfCellar
                          ? latestYear.winners.queenOfCellar.name
                          : "Bude doplněno po korunovaci."}
                      </p>
                      <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.9rem", color: "rgba(255,255,255,0.88)", marginTop: "0.2rem" }}>
                        {latestYear.winners.queenOfCellar
                          ? latestYear.winners.queenOfCellar.wine
                          : "Zatím sbíráme skleničky a hlasy."}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      icon: "white",
                      label: "1. místo – Bílá vína",
                      data: latestYear.winners.white,
                      fallbackName: "První bílá hvězda večera",
                      fallbackWine: "Ještě je v anonymní karafě.",
                    },
                    {
                      emoji: "🍷",
                      label: "1. místo – Červená vína",
                      data: latestYear.winners.red,
                      fallbackName: "Král červeného sklepa",
                      fallbackWine: "Dozraje, až doladíme výsledky.",
                    },
                    {
                      emoji: "🤢",
                      label: "Sračka roku",
                      data: latestYear.winners.worst,
                      fallbackName: "Naštěstí zatím beze jména",
                      fallbackWine: "Organizátoři stále doufají, že ji nenajdou.",
                    },
                    {
                      emoji: "👥",
                      label: "Cena diváků",
                      data: latestYear.winners.audience,
                      fallbackName: "Hlasování ještě běží",
                      fallbackWine: "Publikum se teprve shoduje na favoritu.",
                    },
                  ].map((w) => (
                    <div
                      key={w.label}
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "10px",
                        padding: "1.25rem 1.5rem",
                      }}
                    >
                      <span style={{ fontSize: "1.3rem", display: "block", marginBottom: "0.5rem" }}>
                        {"icon" in w && w.icon === "white" ? <WhiteWineIcon /> : (w as { emoji: string }).emoji}
                      </span>
                      <p
                        style={{
                          color: "rgba(255,255,255,0.9)",
                          fontFamily: "var(--font-inter), sans-serif",
                          fontSize: "0.7rem",
                          letterSpacing: "0.11em",
                          textTransform: "uppercase",
                          fontWeight: 700,
                          marginBottom: "0.3rem",
                        }}
                      >
                        {w.label}
                      </p>
                      <p
                        style={{
                          fontFamily: "var(--font-bebas), sans-serif",
                          fontSize: "1.3rem",
                          color: "#FFFFFF",
                          letterSpacing: "0.05em",
                          lineHeight: 1.1,
                          fontWeight: 700,
                        }}
                      >
                        {w.data ? (w.data as { name: string; wine: string }).name : w.fallbackName}
                      </p>
                      <p
                        style={{
                          fontFamily: "var(--font-inter), sans-serif",
                          fontSize: "0.82rem",
                          color: "rgba(255,255,255,0.88)",
                          marginTop: "0.15rem",
                        }}
                      >
                        {w.data ? (w.data as { name: string; wine: string }).wine : w.fallbackWine}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="lg:col-span-1 flex">
                {latestYear.theme ? (
                  <ThemeCard
                    theme={latestYear.theme}
                    onOpen={() => setShowProgramModal(true)}
                  />
                ) : (
                  <div
                    style={{
                      background: PROGRAM_BG,
                      backdropFilter: "blur(12px)",
                      WebkitBackdropFilter: "blur(12px)",
                      borderRadius: "10px",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderLeft: `3px solid ${ACID_GREEN}`,
                      padding: "1.5rem",
                      color: "rgba(255,255,255,0.3)",
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: "0.875rem",
                    }}
                  >
                    Téma ročníku se zatím ladí. Možná vzniklo spontánně u třetí skleničky a my ho teprve přepisujeme.
                  </div>
                )}
              </div>
            </div>

            <div style={{ background: "rgba(255,255,255,0.97)", borderRadius: "12px", padding: "2rem 2.5rem" }}>
              <div className="flex items-center justify-between mb-2">
                <h3 style={{ fontFamily: "var(--font-bebas), sans-serif", fontSize: "1.5rem", letterSpacing: "0.06em", color: DARK_WINE }}>Kompletní výsledky</h3>
                <span style={{ backgroundColor: ACID_GREEN, color: DARK_WINE, fontSize: "0.7rem", fontWeight: 700, padding: "2px 8px", borderRadius: "3px", letterSpacing: "0.05em", textTransform: "uppercase" }}>{latestYear.year}</span>
              </div>
              {!hasAnyResults ? (
                <p
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "0.9rem",
                    color: "#777",
                  }}
                >
                  Výsledky tohoto ročníku se teprve zanášejí. Organizátoři ještě střízliví a kontrolují tabulku.
                </p>
              ) : (
                <>
                  <AccordionItem title={<span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}><WhiteWineIcon size="label" /> <span>Bílá vína</span></span>} entries={latestYear.results.white} />
                  <AccordionItem
                    title={
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                        <span style={{ width: "1.55rem", display: "inline-flex", justifyContent: "center" }}>🍷</span>
                        <span>Červená vína</span>
                      </span>
                    }
                    entries={latestYear.results.red}
                  />
                </>
              )}
            </div>

            <div className="mt-10" ref={gallerySectionRef}>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <span style={{ width: "28px", height: "2px", backgroundColor: ACID_GREEN, display: "inline-block", borderRadius: "2px" }} />
                  <Camera size={14} style={{ color: ACID_GREEN }} />
                  <span style={{ color: ACID_GREEN, fontFamily: "var(--font-inter), sans-serif", fontSize: "0.75rem", letterSpacing: "0.13em", textTransform: "uppercase", fontWeight: 700 }}>Fotografie z akce</span>
                </div>
                {latestYear.hasGallery && gallery.length > PREVIEW_COUNT && (
                  <button
                    type="button"
                    onClick={() => setShowAll(!showAll)}
                    style={{ background: "transparent", border: "1px solid rgba(167,209,41,0.4)", color: ACID_GREEN, fontFamily: "var(--font-inter), sans-serif", fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600, padding: "5px 14px", borderRadius: "4px", cursor: "pointer" }}
                  >
                    {showAll ? "Zobrazit méně" : `Zobrazit vše (${gallery.length})`}
                  </button>
                )}
              </div>
              {latestYear.hasGallery && gallery.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {visiblePhotos.map((src, i) => (
                    <div
                      key={i}
                      role="button"
                      tabIndex={0}
                      onClick={() => setLightboxIdx(i)}
                      onKeyDown={(e) => e.key === "Enter" && setLightboxIdx(i)}
                      style={{
                        aspectRatio: "1",
                        borderRadius: "8px",
                        overflow: "hidden",
                        cursor: "pointer",
                        position: "relative",
                        border: "1px solid rgba(255,255,255,0.07)",
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt={`Foto ${i + 1}`}
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.25s, filter 0.25s", filter: "brightness(0.85)" }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.transform = "scale(1.05)";
                          (e.currentTarget as HTMLElement).style.filter = "brightness(1)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                          (e.currentTarget as HTMLElement).style.filter = "brightness(0.85)";
                        }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    background: "rgba(0,0,0,0.25)",
                    borderRadius: "10px",
                    padding: "1.75rem 2rem",
                    border: "1px dashed rgba(255,255,255,0.25)",
                    textAlign: "left",
                  }}
                >
                  <Camera size={20} style={{ color: "rgba(255,255,255,0.6)", marginBottom: "0.75rem" }} />
                  <p
                    style={{
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: "0.95rem",
                      color: "rgba(255,255,255,0.9)",
                      fontWeight: 500,
                    }}
                  >
                    Fotky se suší v temné komoře… respektive v telefonech účastníků. Jakmile je dostaneme, uvidíte je tady.
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "1rem", color: "rgba(255,255,255,0.9)", fontWeight: 500 }}>
            Zatím není k dispozici žádný publikovaný ročník.
          </p>
        )}
      </div>

      {lightboxIdx !== null && <Lightbox images={gallery} initial={lightboxIdx} onClose={() => setLightboxIdx(null)} />}
      {showProgramModal && latestYear?.theme?.programPdfUrl && (
        <div
          className="fixed inset-0 z-[210] flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.9)" }}
          onClick={() => setShowProgramModal(false)}
        >
          <button
            type="button"
            onClick={() => setShowProgramModal(false)}
            style={{
              position: "absolute",
              top: "1.25rem",
              right: "1.25rem",
              color: "#fff",
              background: "rgba(255,255,255,0.1)",
              border: "none",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={20} />
          </button>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(900px, 95vw)",
              height: "min(85vh, 900px)",
              backgroundColor: "#1b050a",
              borderRadius: "10px",
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <iframe
              src={latestYear.theme.programPdfUrl}
              title="Program večera"
              style={{ width: "100%", height: "100%", border: "none" }}
            />
          </div>
        </div>
      )}
    </section>
  );
}
