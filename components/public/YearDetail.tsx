"use client";

import { useState } from "react";
import { X, ChevronDown, ChevronUp, Camera, FileText, ExternalLink, Scroll } from "lucide-react";
import { DARK_WINE, WINE_RED, ACID_GREEN } from "@/lib/theme";
import type { YearData } from "@/lib/year-data";

const LIGHT_BG = "#F6F4F1";
const PROGRAM_BG = "#F6F4F1";

function Lightbox({ images, initial, onClose }: { images: string[]; initial: number; onClose: () => void }) {
  const [idx, setIdx] = useState(initial);
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
        onClick={(e) => { e.stopPropagation(); setIdx((i) => Math.max(0, i - 1)); }}
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
        ‹
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
        onClick={(e) => { e.stopPropagation(); setIdx((i) => Math.min(images.length - 1, i + 1)); }}
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
        ›
      </button>
      <div style={{ position: "absolute", bottom: "1.5rem", color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-inter), sans-serif", fontSize: "0.85rem" }}>
        {idx + 1} / {images.length}
      </div>
    </div>
  );
}

function AccordionResult({ title, entries }: { title: string; entries: { place: number; name: string; wine: string; points?: number }[] }) {
  const [open, setOpen] = useState(false);
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
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                {entries.map((e) => (
                  <tr key={`${e.place}-${e.name}`} style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                    <td style={{ padding: "0.5rem 0", width: "30px", color: WINE_RED, fontFamily: "var(--font-inter), sans-serif", fontWeight: 700, fontSize: "0.875rem" }}>{e.place}.</td>
                    <td style={{ padding: "0.5rem 0", fontFamily: "var(--font-inter), sans-serif", fontSize: "0.875rem", color: "#222" }}>{e.name}</td>
                    <td style={{ padding: "0.5rem 0", fontFamily: "var(--font-inter), sans-serif", fontSize: "0.875rem", color: "#666" }}>{e.wine}</td>
                    <td style={{ padding: "0.5rem 0", textAlign: "right", fontFamily: "var(--font-inter), sans-serif", fontSize: "0.875rem", color: "#aaa" }}>{e.points ?? ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

interface YearDetailProps {
  year: YearData;
  onClose: () => void;
}

export function YearDetail({ year, onClose }: YearDetailProps) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  return (
    <>
      <div
        className="fixed inset-0 z-[100] flex items-end md:items-center justify-center"
        style={{ background: "rgba(0,0,0,0.6)" }}
        onClick={onClose}
      >
        <div
          onClick={(e) => e.stopPropagation()}
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
            <span style={{ color: ACID_GREEN, fontFamily: "var(--font-inter), sans-serif", fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>
              {year.edition}. ročník
            </span>
            <h2
              style={{
                fontFamily: "var(--font-bebas), sans-serif",
                fontSize: "2.4rem",
                color: "#fff",
                letterSpacing: "0.04em",
                lineHeight: 1.1,
                marginTop: "0.3rem",
              }}
            >
              Čůčobraní {year.year}
            </h2>
            <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.9rem", color: "rgba(255,255,255,0.6)", marginTop: "0.5rem" }}>{year.description}</p>
          </div>

          <div style={{ padding: "2rem" }}>
            {year.theme && (
              <>
                <h3 style={{ fontFamily: "var(--font-bebas), sans-serif", fontSize: "1.3rem", letterSpacing: "0.06em", color: DARK_WINE, marginBottom: "0.75rem" }}>Téma a program</h3>
                <div style={{ background: PROGRAM_BG, borderRadius: "10px", borderLeft: `3px solid ${ACID_GREEN}`, overflow: "hidden", marginBottom: "1.75rem" }}>
                  <div style={{ padding: "1.25rem 1.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.65rem" }}>
                      <span style={{ display: "inline-block", width: "18px", height: "2px", backgroundColor: ACID_GREEN, borderRadius: "2px", flexShrink: 0 }} />
                      <Scroll size={11} style={{ color: ACID_GREEN }} />
                      <span style={{ color: ACID_GREEN, fontFamily: "var(--font-inter), sans-serif", fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700 }}>Téma ročníku</span>
                    </div>
                    <p style={{ fontFamily: "var(--font-bebas), sans-serif", fontSize: "1.3rem", color: DARK_WINE, letterSpacing: "0.04em", lineHeight: 1.1, marginBottom: year.theme.sceneTitle ? "0.3rem" : "0" }}>{year.theme.title}</p>
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
                  {year.theme.programThumbnailUrl && (
                    <div style={{ padding: "0 1.25rem 1.25rem", display: "flex", gap: "0.75rem", alignItems: "center" }}>
                      <div style={{ width: "80px", height: "56px", borderRadius: "5px", overflow: "hidden", flexShrink: 0, border: "1px solid rgba(167,209,41,0.15)" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={year.theme.programThumbnailUrl} alt="Náhled programu" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.75)" }} />
                      </div>
                      <a
                        href={year.theme.programPdfUrl ?? "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", color: ACID_GREEN, fontFamily: "var(--font-inter), sans-serif", fontSize: "0.78rem", fontWeight: 600, textDecoration: "none", opacity: 0.9, transition: "opacity 0.15s" }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.9")}
                      >
                        <FileText size={13} />
                        Program večera (PDF)
                        <ExternalLink size={11} style={{ opacity: 0.7 }} />
                      </a>
                    </div>
                  )}
                </div>
              </>
            )}

            <h3 style={{ fontFamily: "var(--font-bebas), sans-serif", fontSize: "1.3rem", letterSpacing: "0.06em", color: DARK_WINE, marginBottom: "1rem" }}>Vítězové</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {year.winners.queenOfCellar && (
                <div style={{ gridColumn: "1 / -1", background: WINE_RED, borderRadius: "8px", padding: "1rem 1.25rem" }}>
                  <p style={{ color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-inter), sans-serif", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600, marginBottom: "0.2rem" }}>🏆 Královna sklepa</p>
                  <p style={{ fontFamily: "var(--font-bebas), sans-serif", fontSize: "1.4rem", color: "#fff", letterSpacing: "0.04em" }}>{year.winners.queenOfCellar.name}</p>
                  <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.85rem", color: "rgba(255,255,255,0.65)" }}>{year.winners.queenOfCellar.wine}</p>
                </div>
              )}
              {[
                { emoji: "🍷", label: "Bílá vína", data: year.winners.white },
                { emoji: "🍷", label: "Červená vína", data: year.winners.red },
                { emoji: "👥", label: "Cena diváků", data: year.winners.audience },
                { emoji: "🤢", label: "Sračka roku", data: year.winners.worst },
              ]
                .filter((w) => w.data)
                .map((w) => (
                  <div key={w.label} style={{ background: LIGHT_BG, borderRadius: "8px", padding: "1rem 1.25rem" }}>
                    <p style={{ color: "#888", fontFamily: "var(--font-inter), sans-serif", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600, marginBottom: "0.2rem" }}>{w.emoji} {w.label}</p>
                    <p style={{ fontFamily: "var(--font-bebas), sans-serif", fontSize: "1.2rem", color: DARK_WINE, letterSpacing: "0.04em" }}>{(w.data as { name: string; wine: string }).name}</p>
                    <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.82rem", color: "#666" }}>{(w.data as { name: string; wine: string }).wine}</p>
                  </div>
                ))}
            </div>

            <h3 style={{ fontFamily: "var(--font-bebas), sans-serif", fontSize: "1.3rem", letterSpacing: "0.06em", color: DARK_WINE, marginBottom: "0.25rem" }}>Kompletní výsledky</h3>
            <AccordionResult title="🍷 Bílá vína" entries={year.results.white} />
            <AccordionResult title="🍷 Červená vína" entries={year.results.red} />
            <AccordionResult title="🌸 Růžová vína" entries={year.results.rose} />

            <h3 style={{ fontFamily: "var(--font-bebas), sans-serif", fontSize: "1.3rem", letterSpacing: "0.06em", color: DARK_WINE, marginTop: "1.75rem", marginBottom: "1rem" }}>Fotogalerie</h3>
            {!year.hasGallery || year.gallery.length === 0 ? (
              <div style={{ background: LIGHT_BG, borderRadius: "8px", padding: "2rem", textAlign: "center", color: "#888" }}>
                <Camera size={28} style={{ margin: "0 auto 0.75rem", color: "#ccc" }} />
                <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.9rem" }}>Fotografie z tohoto ročníku zatím nemáme.</p>
                <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.8rem", color: "#bbb", marginTop: "0.3rem" }}>Možná je někdo zapomněl vyvolat.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {year.gallery.map((img, i) => (
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
                      style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.2s" }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1.05)")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1)")}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {lightboxIdx !== null && <Lightbox images={year.gallery} initial={lightboxIdx} onClose={() => setLightboxIdx(null)} />}
    </>
  );
}
