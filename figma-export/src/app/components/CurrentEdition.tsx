import { useState } from "react";
import { ChevronDown, ChevronUp, FileText, Scroll, X, Camera } from "lucide-react";
import { yearsData, YearTheme } from "../data/cucobrani";

const DARK_WINE = "#3A0F16";
const WINE_RED = "#7A1E2C";
const ACID_GREEN = "#A7D129";
const LIGHT_BG = "#FAF8F6";

// Frosted glass — mléčné sklo s acid green akcenty
const PROGRAM_BG = "rgba(255,255,255,0.08)";
const PROGRAM_BORDER = ACID_GREEN;

const currentYear = yearsData[0];

interface AccordionItemProps {
  title: string;
  entries: { place: number; name: string; wine: string; points?: number }[];
}

function AccordionItem({ title, entries }: AccordionItemProps) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
      <button
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
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.15rem", letterSpacing: "0.06em", color: DARK_WINE }}>
          {title}
        </span>
        {open ? <ChevronUp size={18} style={{ color: WINE_RED }} /> : <ChevronDown size={18} style={{ color: WINE_RED }} />}
      </button>
      {open && (
        <div className="pb-4">
          {entries.length === 0 ? (
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", color: "#888" }}>
              V tomto ročníku tato kategorie nebyla hodnocena.
            </p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.06)", fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#888" }}>
                  <th style={{ textAlign: "left", paddingBottom: "0.5rem", width: "40px" }}>#</th>
                  <th style={{ textAlign: "left", paddingBottom: "0.5rem" }}>Výrobce</th>
                  <th style={{ textAlign: "left", paddingBottom: "0.5rem" }}>Víno</th>
                  <th style={{ textAlign: "right", paddingBottom: "0.5rem" }}>Body</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e) => (
                  <tr key={e.place} style={{ borderBottom: "1px solid rgba(0,0,0,0.04)", fontFamily: "'Inter', sans-serif", fontSize: "0.9rem" }}>
                    <td style={{ padding: "0.6rem 0", color: WINE_RED, fontWeight: 700 }}>{e.place}.</td>
                    <td style={{ padding: "0.6rem 0", color: "#222" }}>{e.name}</td>
                    <td style={{ padding: "0.6rem 0", color: "#555" }}>{e.wine}</td>
                    <td style={{ padding: "0.6rem 0", textAlign: "right", color: "#888" }}>{e.points ?? "—"}</td>
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

interface ThemeCardProps {
  theme: YearTheme;
}

function ThemeCard({ theme }: ThemeCardProps) {
  return (
    <a
      href={theme.programPdfUrl ?? "#"}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "flex",
        flexDirection: "column",
        textDecoration: "none",
        background: PROGRAM_BG,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderRadius: "10px",
        border: "1px solid rgba(255,255,255,0.1)",
        borderLeft: `3px solid ${ACID_GREEN}`,
        overflow: "hidden",
        cursor: "pointer",
        transition: "background 0.2s, border-color 0.2s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.13)";
        (e.currentTarget as HTMLElement).style.borderLeftColor = "#C5F040";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = PROGRAM_BG;
        (e.currentTarget as HTMLElement).style.borderLeftColor = ACID_GREEN;
      }}
    >
      {/* Green accent bar — stejný motiv jako section labels na stránce */}
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
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.68rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          Téma & program
        </span>
      </div>

      {/* Card body */}
      <div style={{ padding: "0.75rem 1.5rem 1.25rem" }}>
        {/* Title */}
        <h4
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "1.4rem",
            color: "#fff",
            letterSpacing: "0.04em",
            lineHeight: 1.1,
            marginBottom: theme.sceneTitle ? "0.35rem" : "0",
          }}
        >
          {theme.title}
        </h4>

        {/* Scene info */}
        {theme.sceneTitle && (
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: "rgba(255,255,255,0.45)", marginBottom: "0" }}>Zpracování: <span style={{ color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>{theme.sceneTitle}</span></p>
        )}

        {/* Description */}
        {theme.sceneDescription && (
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.8rem",
              color: "rgba(255,255,255,0.4)",
              lineHeight: 1.6,
              marginTop: "0.65rem",
              borderTop: "1px solid rgba(255,255,255,0.07)",
              paddingTop: "0.65rem",
            }}
          >
            {theme.sceneDescription}
          </p>
        )}
      </div>

      {/* PDF thumbnail */}
      {theme.programThumbnailUrl && (
        <div style={{ padding: "0 1.25rem 1.25rem", marginTop: "auto" }}>
          <div
            style={{
              position: "relative",
              borderRadius: "7px",
              overflow: "hidden",
              border: `1px solid rgba(167,209,41,0.22)`,
            }}
          >
            <img
              src={theme.programThumbnailUrl}
              alt="Náhled programu"
              style={{
                width: "100%",
                aspectRatio: "16/9",
                objectFit: "cover",
                display: "block",
                filter: "brightness(0.6)",
              }}
            />
            {/* Overlay */}
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
                  fontFamily: "'Inter', sans-serif",
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
    </a>
  );
}

function Lightbox({ images, initial, onClose }: { images: string[]; initial: number; onClose: () => void }) {
  const [idx, setIdx] = useState(initial);
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.93)" }}
      onClick={onClose}
    >
      <button
        onClick={onClose}
        style={{ position: "absolute", top: "1.25rem", right: "1.25rem", color: "#fff", background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "50%", width: "40px", height: "40px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <X size={20} />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); setIdx((i) => Math.max(0, i - 1)); }}
        style={{ position: "absolute", left: "1rem", color: "#fff", background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "50%", width: "48px", height: "48px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}
      >
        ‹
      </button>
      <img
        src={images[idx]}
        alt=""
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "90vw", maxHeight: "88vh", borderRadius: "8px", objectFit: "contain" }}
      />
      <button
        onClick={(e) => { e.stopPropagation(); setIdx((i) => Math.min(images.length - 1, i + 1)); }}
        style={{ position: "absolute", right: "1rem", color: "#fff", background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "50%", width: "48px", height: "48px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}
      >
        ›
      </button>
      <div style={{ position: "absolute", bottom: "1.5rem", color: "rgba(255,255,255,0.45)", fontFamily: "'Inter', sans-serif", fontSize: "0.82rem" }}>
        {idx + 1} / {images.length}
      </div>
    </div>
  );
}

export function CurrentEdition() {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  const PREVIEW_COUNT = 4;
  const gallery = currentYear.gallery ?? [];
  const visiblePhotos = showAll ? gallery : gallery.slice(0, PREVIEW_COUNT);

  return (
    <section id="aktualni-rocnik" style={{ background: DARK_WINE }} className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        {/* Label */}
        <div className="flex items-center gap-3 mb-12">
          <span style={{ width: "40px", height: "3px", backgroundColor: ACID_GREEN, display: "inline-block", borderRadius: "2px" }} />
          <span style={{ color: ACID_GREEN, fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600 }}>
            Aktuální ročník
          </span>
        </div>

        {/* Title */}
        <h2
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(2.5rem, 5vw, 5rem)",
            color: "#fff",
            letterSpacing: "0.03em",
            lineHeight: 1,
            marginBottom: "3rem",
          }}
        >
          {currentYear.edition}. ročník Čůčobraní — {currentYear.year}
        </h2>

        {/* Two-column layout: left = winners, right = theme */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start mb-12">
          {/* LEFT: Winners (2/3) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {/* Queen of cellar – full width of left column */}
            {currentYear.winners.queenOfCellar && (
              <div
                style={{
                  background: WINE_RED,
                  borderRadius: "10px",
                  padding: "1.75rem 2rem",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div style={{ position: "absolute", top: "-20px", right: "-20px", fontSize: "8rem", opacity: 0.06, userSelect: "none" }}>
                  🏆
                </div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                  <span style={{ fontSize: "2rem" }}>🏆</span>
                  <div>
                    <p style={{ color: "rgba(255,255,255,0.65)", fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600, marginBottom: "0.25rem" }}>
                      Královna sklepa
                    </p>
                    <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.9rem", color: "#fff", letterSpacing: "0.04em", lineHeight: 1.1 }}>
                      {currentYear.winners.queenOfCellar.name}
                    </p>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", color: "rgba(255,255,255,0.7)", marginTop: "0.2rem" }}>
                      {currentYear.winners.queenOfCellar.wine}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 2×2 grid for remaining winners */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { emoji: "🍷", label: "1. místo – Bílá vína", data: currentYear.winners.white },
                { emoji: "🍷", label: "1. místo – Červená vína", data: currentYear.winners.red },
                { emoji: "🤢", label: "Sračka roku", data: currentYear.winners.worst },
                { emoji: "👥", label: "Cena diváků", data: currentYear.winners.audience },
              ].map(
                (w) =>
                  w.data && (
                    <div
                      key={w.label}
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "10px",
                        padding: "1.25rem 1.5rem",
                      }}
                    >
                      <span style={{ fontSize: "1.3rem", display: "block", marginBottom: "0.5rem" }}>{w.emoji}</span>
                      <p style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600, marginBottom: "0.3rem" }}>
                        {w.label}
                      </p>
                      <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.3rem", color: "#fff", letterSpacing: "0.04em", lineHeight: 1.1 }}>
                        {(w.data as { name: string; wine: string }).name}
                      </p>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", color: "rgba(255,255,255,0.5)", marginTop: "0.15rem" }}>
                        {(w.data as { name: string; wine: string }).wine}
                      </p>
                    </div>
                  )
              )}
            </div>
          </div>

          {/* RIGHT: Theme + program card (1/3) */}
          <div className="lg:col-span-1">
            {currentYear.theme ? (
              <ThemeCard theme={currentYear.theme} />
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
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.875rem",
                }}
              >
                Téma tohoto ročníku zatím nebylo zveřejněno.
              </div>
            )}
          </div>
        </div>

        {/* Kompletní výsledky – accordion */}
        <div style={{ background: "rgba(255,255,255,0.97)", borderRadius: "12px", padding: "2rem 2.5rem" }}>
          <div className="flex items-center justify-between mb-2">
            <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.5rem", letterSpacing: "0.06em", color: DARK_WINE }}>
              Kompletní výsledky
            </h3>
            <span style={{ backgroundColor: ACID_GREEN, color: DARK_WINE, fontSize: "0.7rem", fontWeight: 700, padding: "2px 8px", borderRadius: "3px", letterSpacing: "0.05em", textTransform: "uppercase" }}>
              {currentYear.year}
            </span>
          </div>
          <AccordionItem title="🍷 Bílá vína" entries={currentYear.results.white} />
          <AccordionItem title="🍷 Červená vína" entries={currentYear.results.red} />
          <AccordionItem title="🌸 Růžová vína" entries={currentYear.results.rose} />
        </div>

        {/* Fotogalerie */}
        {currentYear.hasGallery && gallery.length > 0 && (
          <div className="mt-10">
            {/* Section label */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <span style={{ width: "28px", height: "2px", backgroundColor: ACID_GREEN, display: "inline-block", borderRadius: "2px" }} />
                <Camera size={14} style={{ color: ACID_GREEN }} />
                <span style={{ color: ACID_GREEN, fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700 }}>
                  Fotografie z akce
                </span>
              </div>
              {gallery.length > PREVIEW_COUNT && (
                <button
                  onClick={() => setShowAll(!showAll)}
                  style={{ background: "transparent", border: `1px solid rgba(167,209,41,0.4)`, color: ACID_GREEN, fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600, padding: "5px 14px", borderRadius: "4px", cursor: "pointer" }}
                >
                  {showAll ? "Zobrazit méně" : `Zobrazit vše (${gallery.length})`}
                </button>
              )}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {visiblePhotos.map((src, i) => (
                <div
                  key={i}
                  onClick={() => setLightboxIdx(i)}
                  style={{
                    aspectRatio: "1",
                    borderRadius: "8px",
                    overflow: "hidden",
                    cursor: "pointer",
                    position: "relative",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
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
                  {/* Hover overlay s acid green rámečkem */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      border: `2px solid ${ACID_GREEN}`,
                      borderRadius: "8px",
                      opacity: 0,
                      transition: "opacity 0.2s",
                      pointerEvents: "none",
                    }}
                    className="hover-border"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {lightboxIdx !== null && (
        <Lightbox images={gallery} initial={lightboxIdx} onClose={() => setLightboxIdx(null)} />
      )}
    </section>
  );
}