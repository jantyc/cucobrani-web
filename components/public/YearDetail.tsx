"use client";

import { useEffect, useState } from "react";
import { X, ChevronDown, ChevronUp, Camera, FileText, ExternalLink, Scroll, ChevronLeft, ChevronRight } from "lucide-react";
import { DARK_WINE, WINE_RED, ACID_GREEN } from "@/lib/theme";
import type { YearData } from "@/lib/year-data";
import { formatPlaceWithTies } from "@/lib/results-ranking";
import { WhiteWineIcon } from "./WhiteWineIcon";
import {
  PREHISTORY_CARD_ID,
  PREHISTORY_ENTRIES,
  PREHISTORY_LABEL,
  PREHISTORY_LIST_TITLE,
  PREHISTORY_TITLE,
} from "@/lib/prehistory";
const LIGHT_BG = "#F6F4F1";

/** Malá ikona bílého vína jen pro karty vítězů v tomto modalu (pevná velikost 0.65rem). */
function WhiteWineIconSmall() {
  return (
    <span style={{ display: "inline-block", lineHeight: 1, verticalAlign: "middle" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/white-wine-glass.webp"
        alt=""
        role="presentation"
        style={{
          height: "1rem",
          width: "auto",
          maxWidth: "1rem",
          display: "inline-block",
          verticalAlign: "middle",
        }}
      />
    </span>
  );
}
const PROGRAM_BG = "#F6F4F1";

function SectionLoading({ text }: { text: string }) {
  return (
    <div
      style={{
        background: LIGHT_BG,
        borderRadius: "8px",
        border: "1px solid rgba(0,0,0,0.08)",
        padding: "1rem 1.1rem",
        display: "inline-flex",
        alignItems: "center",
        gap: "0.6rem",
      }}
    >
      <span
        style={{
          width: "0.9rem",
          height: "0.9rem",
          borderRadius: "50%",
          border: `2px solid rgba(122,30,44,0.2)`,
          borderTopColor: WINE_RED,
          animation: "cuco-spin 0.8s linear infinite",
          display: "inline-block",
        }}
      />
      <span
        style={{
          fontFamily: "var(--font-inter), sans-serif",
          fontSize: "0.85rem",
          color: "#666",
        }}
      >
        {text}
      </span>
    </div>
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
        className="absolute top-5 right-5"
        style={{ color: "#fff", background: "transparent", border: "none", cursor: "pointer" }}
      >
        <X size={32} />
      </button>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setIdx((i) => (i - 1 + images.length) % images.length); }}
        style={{
          position: "absolute",
          left: "1rem",
          color: "#fff",
          background: "rgba(255,255,255,0.1)",
          border: "none",
          borderRadius: "50%",
          width: "48px",
          height: "48px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ChevronLeft size={22} />
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={images[idx]}
        alt=""
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "90vw", maxHeight: "90vh", borderRadius: "8px", objectFit: "contain" }}
      />
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setIdx((i) => (i + 1) % images.length); }}
        style={{
          position: "absolute",
          right: "1rem",
          color: "#fff",
          background: "rgba(255,255,255,0.1)",
          border: "none",
          borderRadius: "50%",
          width: "48px",
          height: "48px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ChevronRight size={22} />
      </button>
      <div style={{ position: "absolute", bottom: "1.5rem", color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-inter), sans-serif", fontSize: "0.85rem" }}>
        {idx + 1} / {images.length}
      </div>
    </div>
  );
}

function AccordionResult({ title, entries }: { title: React.ReactNode; entries: { place: number; name: string; sampleNumber?: string; wine: string; points?: number }[] }) {
  const [open, setOpen] = useState(false);
  const formatSampleLabel = (sampleNumber?: string) => {
    const value = (sampleNumber ?? "").trim();
    if (!value) return "Vzorek č.—";
    if (/^[cč]\./i.test(value)) return `Vzorek ${value}`;
    return `Vzorek č.${value}`;
  };

  return (
    <div style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0.875rem 0",
          background: "transparent",
          border: "none",
          cursor: "pointer",
        }}
      >
        <span style={{ fontFamily: "var(--font-bebas), sans-serif", fontSize: "1.1rem", letterSpacing: "0.06em", color: DARK_WINE }}>{title}</span>
        {open ? <ChevronUp size={16} style={{ color: WINE_RED }} /> : <ChevronDown size={16} style={{ color: WINE_RED }} />}
      </button>
      {open && (
        <div className="pb-4">
          {entries.length === 0 ? (
            <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.875rem", color: "#888" }}>Nebyla hodnocena.</p>
          ) : (
            <>
              <div className="grid md:hidden" style={{ gap: "0.62rem" }}>
                {entries.map((e, i) => (
                  <div
                    key={`${e.place}-${e.name}`}
                    style={{
                      background: "#fff",
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
                        <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.86rem", color: "#222", fontWeight: 700, lineHeight: 1.25, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
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
                    <tr key={`${e.place}-${e.name}`} style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                      <td style={{ padding: "0.5rem 0", width: "30px", color: WINE_RED, fontFamily: "var(--font-inter), sans-serif", fontWeight: 700, fontSize: "0.875rem" }}>
                        {formatPlaceWithTies(entries, i, (x) => x.points)}
                      </td>
                      <td style={{ padding: "0.5rem 0 0.5rem 0.85rem", fontFamily: "var(--font-inter), sans-serif", fontSize: "0.875rem", color: "#222" }}>{e.name}</td>
                      <td style={{ padding: "0.5rem 0", fontFamily: "var(--font-inter), sans-serif", fontSize: "0.875rem", color: "#444" }}>{e.sampleNumber || "—"}</td>
                      <td style={{ padding: "0.5rem 0", fontFamily: "var(--font-inter), sans-serif", fontSize: "0.875rem", color: "#666" }}>{e.wine}</td>
                      <td style={{ padding: "0.5rem 0", textAlign: "right", fontFamily: "var(--font-inter), sans-serif", fontSize: "0.875rem", color: "#aaa" }}>{e.points ?? "—"}</td>
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

interface YearDetailProps {
  year: YearData;
  isDetailLoading?: boolean;
  onClose: () => void;
}

export function YearDetail({ year, isDetailLoading = false, onClose }: YearDetailProps) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [showProgramModal, setShowProgramModal] = useState(false);
  const [showAllGalleryPhotos, setShowAllGalleryPhotos] = useState(false);
  const [showAllGalleryButtonHovered, setShowAllGalleryButtonHovered] = useState(false);
  const isPrehistory = year.id === PREHISTORY_CARD_ID;

  const hasAnyResultsPieces =
    Boolean(year.winners.queenOfCellar || year.winners.audience || year.winners.worst) ||
    year.results.white.length > 0 ||
    year.results.red.length > 0;

  const isResultsPartial =
    hasAnyResultsPieces &&
    !(
      year.winners.queenOfCellar &&
      year.winners.audience &&
      year.winners.worst &&
      year.results.white.length > 0 &&
      year.results.red.length > 0
    );

  const hasGallery = year.hasGallery && year.gallery.length > 0;
  const hasProgram = Boolean(year.theme);

  const isCompletelySparse = !hasProgram && !hasAnyResultsPieces && !hasGallery;
  const galleryPreviewCount = 6;
  const visibleGallery = showAllGalleryPhotos ? year.gallery : year.gallery.slice(0, galleryPreviewCount);
  const hiddenGalleryCount = Math.max(0, year.gallery.length - galleryPreviewCount);

  useEffect(() => {
    if (showAllGalleryPhotos) return;
    if (year.gallery.length <= galleryPreviewCount) return;

    // Warm hidden gallery images only after modal is open.
    const hidden = year.gallery.slice(galleryPreviewCount);
    const run = () => {
      for (const src of hidden) {
        const img = new Image();
        img.src = src;
      }
    };

    const delayed = window.setTimeout(() => {
      if ("requestIdleCallback" in window) {
        (
          window as Window & {
            requestIdleCallback?: (callback: () => void, opts?: { timeout: number }) => number;
          }
        ).requestIdleCallback?.(run, { timeout: 2000 });
      } else {
        run();
      }
    }, 350);

    return () => window.clearTimeout(delayed);
  }, [showAllGalleryPhotos, year.gallery]);

  return (
    <>
      <div
        className="fixed inset-0 z-[100] flex items-end md:items-center justify-center"
        style={{ background: "rgba(0,0,0,0.6)" }}
        onClick={onClose}
      >
        <style>{`
          @keyframes cuco-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
        <div
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          style={{
            background: "#fff",
            borderRadius: "16px 16px 0 0",
            width: "100%",
            maxWidth: "750px",
            maxHeight: "90vh",
            overflowY: "auto",
          }}
          className="md:rounded-2xl md:m-4"
        >
          <div
            style={{
              background: DARK_WINE,
              borderRadius: "16px 16px 0 0",
              padding: "2rem 2rem 1.75rem",
              position: "relative",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                color: "rgba(255,255,255,0.7)",
                background: "rgba(255,255,255,0.1)",
                border: "none",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <X size={18} />
            </button>
            {isPrehistory && (
              <span style={{ color: ACID_GREEN, fontFamily: "var(--font-inter), sans-serif", fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700 }}>
                {PREHISTORY_LABEL}
              </span>
            )}
            <h2
              style={{
                fontFamily: "var(--font-bebas), sans-serif",
                fontSize: "2.4rem",
                color: "#FFFFFF",
                letterSpacing: "0.05em",
                lineHeight: 1.1,
                fontWeight: 700,
                marginTop: "0.3rem",
              }}
            >
              {isPrehistory ? PREHISTORY_TITLE : `Čůčobraní ${year.year}`}
            </h2>
            <p
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "0.78rem",
                color: isPrehistory ? "rgba(255,255,255,0.9)" : ACID_GREEN,
                marginTop: "0.5rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: isPrehistory ? "none" : "uppercase",
              }}
            >
              {year.description}
            </p>
            {isDetailLoading && (
              <p
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "0.8rem",
                  color: "rgba(255,255,255,0.85)",
                  marginTop: "0.45rem",
                }}
              >
                Načítám kompletní detail ročníku...
              </p>
            )}
            {isCompletelySparse && (
              <p
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "0.85rem",
                  color: "rgba(255,255,255,0.9)",
                  marginTop: "0.6rem",
                }}
              >
                Detail tohoto ročníku je jako zapomenutá demižónka ve sklepě – víme, že existoval, ale zbytek se ztratil v mlze času.
              </p>
            )}
          </div>

          <div style={{ padding: "2rem" }}>
            {isPrehistory ? (
              <div
                style={{
                  background: LIGHT_BG,
                  borderRadius: "10px",
                  border: "1px solid rgba(0,0,0,0.08)",
                  padding: "1.25rem 1.5rem",
                }}
              >
                <h3 style={{ fontFamily: "var(--font-bebas), sans-serif", fontSize: "1.4rem", letterSpacing: "0.06em", color: DARK_WINE, marginBottom: "0.9rem", fontWeight: 700 }}>
                  {PREHISTORY_LIST_TITLE}
                </h3>
                <div style={{ display: "grid", gap: "0.95rem" }}>
                  {PREHISTORY_ENTRIES.map((entry) => (
                    <div key={entry.year} style={{ borderBottom: "1px solid rgba(0,0,0,0.07)", paddingBottom: "0.8rem" }}>
                      <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.92rem", color: DARK_WINE, fontWeight: 700 }}>
                        {entry.year} - {entry.winner}
                      </p>
                      <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.88rem", color: "#555", marginTop: "0.2rem" }}>
                        Místo konání: {entry.location}
                      </p>
                      <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.88rem", color: "#555" }}>
                        Scénka: {entry.scene}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
            {year.theme ? (
              <>
                <h3 style={{ fontFamily: "var(--font-bebas), sans-serif", fontSize: "1.3rem", letterSpacing: "0.06em", color: DARK_WINE, fontWeight: 700, marginBottom: "0.75rem" }}>Téma a program</h3>
                <div style={{ background: PROGRAM_BG, borderRadius: "10px", borderLeft: `3px solid ${ACID_GREEN}`, overflow: "hidden", marginBottom: "1.75rem" }}>
                  <div style={{ padding: "1.25rem 1.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.65rem" }}>
                      <span style={{ display: "inline-block", width: "18px", height: "2px", backgroundColor: ACID_GREEN, borderRadius: "2px", flexShrink: 0 }} />
                      <Scroll size={11} style={{ color: ACID_GREEN }} />
                      <span style={{ color: ACID_GREEN, fontFamily: "var(--font-inter), sans-serif", fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700 }}>Téma ročníku</span>
                    </div>
                    <p style={{ fontFamily: "var(--font-bebas), sans-serif", fontSize: "1.3rem", color: DARK_WINE, letterSpacing: "0.04em", lineHeight: 1.1, fontWeight: 700, marginBottom: year.theme.sceneTitle ? "0.3rem" : "0" }}>{year.theme.title}</p>
                    {year.theme.sceneTitle && (
                      <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.78rem", color: "rgba(58,15,22,0.45)", marginBottom: "0", display: "flex", alignItems: "center", gap: "0.4rem", flexWrap: "wrap" }}>
                        <span style={{ display: "inline-block", background: "rgba(167,209,41,0.15)", color: ACID_GREEN, fontFamily: "var(--font-inter), sans-serif", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "1px 6px", borderRadius: "3px", border: "1px solid rgba(167,209,41,0.3)" }}>zpracování</span>
                        <span style={{ color: DARK_WINE, fontWeight: 600 }}>{year.theme.sceneTitle}</span>
                      </p>
                    )}
                    {year.theme.sceneDescription && (
                      <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.78rem", color: "rgba(58,15,22,0.55)", lineHeight: 1.6, marginTop: "0.6rem", borderTop: "1px solid rgba(167,209,41,0.2)", paddingTop: "0.6rem" }}>{year.theme.sceneDescription}</p>
                    )}
                  </div>
                  {year.theme.programPdfUrl && (
                    <div style={{ padding: "0 1.25rem 1.25rem" }}>
                      <button
                        type="button"
                        onClick={() => setShowProgramModal(true)}
                        style={{
                          width: "100%",
                          display: "flex",
                          gap: "0.75rem",
                          alignItems: "center",
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          padding: 0,
                          textAlign: "left",
                        }}
                      >
                        <div
                          style={{
                            width: "96px",
                            height: "64px",
                            borderRadius: "5px",
                            overflow: "hidden",
                            flexShrink: 0,
                            border: "1px solid rgba(167,209,41,0.4)",
                            backgroundColor: "#1b050a",
                            position: "relative",
                          }}
                        >
                          <iframe
                            src={`${year.theme.programPdfUrl}#page=1&zoom=page-fit&view=FitH&toolbar=0&navpanes=0&scrollbar=0`}
                            title="Náhled první stránky programu"
                            style={{
                              width: "100%",
                              height: "100%",
                              border: "none",
                              pointerEvents: "none",
                              backgroundColor: "#1b050a",
                            }}
                          />
                        </div>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.35rem",
                            color: ACID_GREEN,
                            fontFamily: "var(--font-inter), sans-serif",
                            fontSize: "0.78rem",
                            fontWeight: 600,
                            opacity: 0.9,
                            transition: "opacity 0.15s",
                          }}
                        >
                          <FileText size={13} />
                          {(!year.theme.title && !year.theme.sceneTitle && !year.theme.sceneDescription) && (
                            <span style={{ marginRight: "0.3rem" }}>
                              Podrobnosti o programu najdete v dochovaném PDF níže. O zbytku si musíme nechat vyprávět.
                            </span>
                          )}
                          {!(!year.theme.title && !year.theme.sceneTitle && !year.theme.sceneDescription) && "Program večera (PDF)"}
                          <ExternalLink size={11} style={{ opacity: 0.7 }} />
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div
                style={{
                  background: LIGHT_BG,
                  borderRadius: "10px",
                  border: "1px dashed rgba(0,0,0,0.12)",
                  padding: "1.5rem 1.75rem",
                  marginBottom: "1.75rem",
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-bebas), sans-serif",
                    fontSize: "1.2rem",
                    letterSpacing: "0.06em",
                    color: DARK_WINE,
                    fontWeight: 700,
                    marginBottom: "0.35rem",
                  }}
                >
                  Téma a program chybí
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "0.9rem",
                    color: "#555",
                    lineHeight: 1.6,
                  }}
                >
                  Program tohoto ročníku se tradoval jen ústně. Co se v sále dělo, vědí už jen pamětníci a pár pavouků na stropě.
                </p>
              </div>
            )}

            <h3 style={{ fontFamily: "var(--font-bebas), sans-serif", fontSize: "1.3rem", letterSpacing: "0.06em", color: DARK_WINE, fontWeight: 700, marginBottom: "1rem" }}>Vítězové</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {year.winners.queenOfCellar && (
                <div style={{ gridColumn: "1 / -1", background: WINE_RED, borderRadius: "8px", padding: "1rem 1.25rem" }}>
                  <p style={{ color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-inter), sans-serif", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600, marginBottom: "0.2rem" }}>🏆 Královna sklepa</p>
                  <p style={{ fontFamily: "var(--font-bebas), sans-serif", fontSize: "1.4rem", color: "#fff", letterSpacing: "0.04em", fontWeight: 700 }}>{year.winners.queenOfCellar.name}</p>
                  <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.85rem", color: "rgba(255,255,255,0.65)" }}>{year.winners.queenOfCellar.wine}</p>
                </div>
              )}
              {[
                { icon: "white", label: "Bílá vína", data: year.winners.white },
                { emoji: "🍷", label: "Červená vína", data: year.winners.red },
                { emoji: "👥", label: "Cena diváků", data: year.winners.audience },
                { emoji: "🤢", label: "Sračka roku", data: year.winners.worst },
              ]
                .filter((w) => w.data)
                .map((w) => (
                  <div key={w.label} style={{ background: LIGHT_BG, borderRadius: "8px", padding: "1rem 1.25rem" }}>
                    <p style={{ color: "#888", fontFamily: "var(--font-inter), sans-serif", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600, marginBottom: "0.2rem" }}>{"icon" in w && w.icon === "white" ? <><WhiteWineIconSmall /> {w.label}</> : <>{w.emoji} {w.label}</>}</p>
                    <p style={{ fontFamily: "var(--font-bebas), sans-serif", fontSize: "1.2rem", color: DARK_WINE, letterSpacing: "0.04em", fontWeight: 700 }}>{(w.data as { name: string; wine: string }).name}</p>
                    <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.82rem", color: "#666" }}>{(w.data as { name: string; wine: string }).wine}</p>
                  </div>
                ))}
            </div>

            <h3 style={{ fontFamily: "var(--font-bebas), sans-serif", fontSize: "1.3rem", letterSpacing: "0.06em", color: DARK_WINE, fontWeight: 700, marginBottom: "0.25rem" }}>Kompletní výsledky</h3>
            {isDetailLoading && !hasAnyResultsPieces ? (
              <div style={{ marginBottom: "1.2rem" }}>
                <SectionLoading text="Načítám kompletní výsledky..." />
              </div>
            ) : !hasAnyResultsPieces ? (
              <p
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "0.9rem",
                  color: "#555",
                  lineHeight: 1.6,
                  marginBottom: "1.5rem",
                }}
              >
                Kompletní výsledky tohoto ročníku bohužel nebyly dochovány. Zapisovatel pravděpodobně ochutnával víc, než by se slušelo.
              </p>
            ) : (
              <>
                {isResultsPartial && (
                  <p
                    style={{
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: "0.85rem",
                      color: "#777",
                      marginBottom: "0.75rem",
                    }}
                  >
                    Dochovaly se jen střípky – zbytek výsledků se rozpustil v sudu dějin.
                  </p>
                )}
                <AccordionResult title={<span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}><WhiteWineIcon size="label" /> <span>Bílá vína</span></span>} entries={year.results.white} />
                <AccordionResult
                  title={
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                      <span style={{ width: "1.55rem", display: "inline-flex", justifyContent: "center" }}>🍷</span>
                      <span>Červená vína</span>
                    </span>
                  }
                  entries={year.results.red}
                />
              </>
            )}

            <h3 style={{ fontFamily: "var(--font-bebas), sans-serif", fontSize: "1.3rem", letterSpacing: "0.06em", color: DARK_WINE, marginTop: "1.75rem", marginBottom: "1rem" }}>Fotogalerie</h3>
            {isDetailLoading && !hasGallery ? (
              <div style={{ marginBottom: "1rem" }}>
                <SectionLoading text="Načítám fotky z ročníku..." />
              </div>
            ) : !hasGallery ? (
              <div style={{ background: LIGHT_BG, borderRadius: "8px", padding: "2rem", textAlign: "center", color: "#888" }}>
                <Camera size={28} style={{ margin: "0 auto 0.75rem", color: "#ccc" }} />
                <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.9rem" }}>
                  Fotky z tohoto ročníku se nejspíš ztratily v šuplíku s rodinnými albíčky. Pokud nějaké najdete, ozvěte se organizátorům.
                </p>
              </div>
            ) : (
              <>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {year.gallery.length > 0 && year.gallery.length < 3 && (
                  <div className="col-span-2 sm:col-span-3 mb-1">
                    <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.8rem", color: "#777" }}>
                      Dochovalo se jen pár záběrů – zbytek zůstal v analogových foťácích a zapomenutých paměťovkách.
                    </p>
                  </div>
                )}
                {visibleGallery.map((img, i) => (
                  <div
                    key={i}
                    role="button"
                    tabIndex={0}
                    onClick={() => setLightboxIdx(i)}
                    onKeyDown={(e) => e.key === "Enter" && setLightboxIdx(i)}
                    style={{ aspectRatio: "1", borderRadius: "8px", overflow: "hidden", cursor: "pointer" }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt=""
                      loading={i < 6 ? "eager" : "lazy"}
                      decoding="async"
                      style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.2s" }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1.05)")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1)")}
                    />
                  </div>
                ))}
              </div>
              {year.gallery.length > galleryPreviewCount && (
                <div className="mt-5 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setShowAllGalleryPhotos((prev) => !prev)}
                    onMouseEnter={() => setShowAllGalleryButtonHovered(true)}
                    onMouseLeave={() => setShowAllGalleryButtonHovered(false)}
                    style={{
                      background: showAllGalleryButtonHovered ? WINE_RED : "#fff",
                      border: `1px solid ${WINE_RED}`,
                      borderRadius: "8px",
                      padding: "0.6rem 1.05rem",
                      cursor: "pointer",
                      color: showAllGalleryButtonHovered ? "#fff" : DARK_WINE,
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: "0.86rem",
                      fontWeight: 600,
                      transition: "all 0.2s ease",
                      boxShadow: showAllGalleryButtonHovered ? "0 8px 20px rgba(122,30,44,0.2)" : "none",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.45rem",
                    }}
                  >
                    <span>{showAllGalleryPhotos ? "Zobrazit méně fotek" : "Zobrazit všechny fotky"}</span>
                    {!showAllGalleryPhotos && hiddenGalleryCount > 0 && (
                      <span
                        style={{
                          backgroundColor: ACID_GREEN,
                          color: DARK_WINE,
                          borderRadius: "5px",
                          padding: "0.1rem 0.35rem",
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          lineHeight: 1,
                          minWidth: "1.35rem",
                          textAlign: "center",
                        }}
                      >
                        +{hiddenGalleryCount}
                      </span>
                    )}
                  </button>
                </div>
              )}
              </>
            )}
              </>
            )}
          </div>
        </div>
      </div>

      {lightboxIdx !== null && <Lightbox images={year.gallery} initial={lightboxIdx} onClose={() => setLightboxIdx(null)} />}
      {showProgramModal && year.theme?.programPdfUrl && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center"
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
              backgroundColor: "#f8f5f0",
              borderRadius: "10px",
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <iframe
              src={year.theme.programPdfUrl}
              title="Program večera"
              style={{ width: "100%", height: "100%", border: "none" }}
            />
          </div>
        </div>
      )}
    </>
  );
}
