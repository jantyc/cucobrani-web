"use client";

import { useState } from "react";
import { X, FileText } from "lucide-react";
import { DARK_WINE } from "@/lib/theme";

interface YearProgramDetailProps {
  title?: string | null;
  author?: string | null;
  description?: string | null;
  pdfUrl?: string | null;
}

export function YearProgramDetail({ title, author, description, pdfUrl }: YearProgramDetailProps) {
  const [open, setOpen] = useState(false);
  const hasProgram = title || author || description || pdfUrl;

  return (
    <>
      <section className="mb-8 p-6 rounded-xl bg-white border border-black/10">
        <h2
          className="mb-3"
          style={{
            fontFamily: "var(--font-bebas), sans-serif",
            fontSize: "1.25rem",
            color: DARK_WINE,
            letterSpacing: "0.06em",
            fontWeight: 700,
          }}
        >
          Téma a program
        </h2>
        {hasProgram ? (
          <>
            {title && (
              <p
                className="mb-1"
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  color: "#222222",
                  fontWeight: 700,
                }}
              >
                {title}
              </p>
            )}
            {author && (
              <p
                className="text-sm mb-2"
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  color: "#555555",
                  fontWeight: 500,
                }}
              >
                Zpracování: {author}
              </p>
            )}
            {description && (
              <p
                className="mb-4 whitespace-pre-line"
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  color: "#333333",
                  lineHeight: 1.7,
                }}
              >
                {description}
              </p>
            )}
            {pdfUrl && (
              <>
                {!title && !author && !description && (
                  <p
                    className="mb-3 text-sm"
                    style={{ fontFamily: "var(--font-inter), sans-serif", color: "#555555" }}
                  >
                    Podrobnosti o programu najdete v dochovaném PDF níže. O zbytku si musíme nechat vyprávět.
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-black/15 text-[#7A1E2C] text-sm font-medium hover:bg-black/5"
                  style={{ fontFamily: "var(--font-inter), sans-serif" }}
                >
                  <FileText size={16} />
                  Program večera (PDF)
                </button>
              </>
            )}
            {!pdfUrl && (title || description) && (
              <p
                className="mt-3 text-sm"
                style={{ fontFamily: "var(--font-inter), sans-serif", color: "#777777" }}
              >
                Všechny výtisky programu byly bohužel zničeny – asi při úklidu po poslední sklence.
              </p>
            )}
          </>
        ) : (
          <p
            className="mb-0"
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              color: "#333333",
              lineHeight: 1.7,
            }}
          >
            Program tohoto ročníku se tradoval jen ústně. Co se v sále dělo, vědí už jen pamětníci a pár pavouků na stropě.
          </p>
        )}
      </section>

      {open && pdfUrl && (
        <div
          className="fixed inset-0 z-[210] flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.9)" }}
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
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
              border: "1px solid rgba(0,0,0,0.15)",
            }}
          >
            <iframe src={pdfUrl} title="Program večera" style={{ width: "100%", height: "100%", border: "none" }} />
          </div>
        </div>
      )}
    </>
  );
}

