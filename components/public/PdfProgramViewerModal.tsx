"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from "lucide-react";
import { loadPdfJs } from "@/lib/pdf-client";
import { ACID_GREEN, DARK_WINE, WINE_RED } from "@/lib/theme";

interface PdfProgramViewerModalProps {
  pdfUrl: string;
  title?: string;
  onClose: () => void;
}

type PdfPageInfo = {
  pageNumber: number;
  width: number;
  height: number;
};

const MIN_ZOOM = 0.65;
const MAX_ZOOM = 2.2;
const MOBILE_ZOOM_MIN = 1;

export function PdfProgramViewerModal({ pdfUrl, title = "Program večera", onClose }: PdfProgramViewerModalProps) {
  const [pages, setPages] = useState<PdfPageInfo[]>([]);
  const [zoom, setZoom] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileControls, setShowMobileControls] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const pageWrapRefs = useRef<Array<HTMLDivElement | null>>([]);
  const canvasRefs = useRef<Array<HTMLCanvasElement | null>>([]);
  const viewerScrollRef = useRef<HTMLDivElement | null>(null);
  const pagesRef = useRef<PdfPageInfo[]>([]);
  const currentPageRef = useRef(1);
  const skipScrollSyncUntilRef = useRef(0);
  const [viewportTick, setViewportTick] = useState(0);

  const pageTargetHeight = useMemo(() => {
    if (typeof window === "undefined") return 820;
    const vh = window.innerHeight;
    return Math.max(isMobile ? vh - 140 : vh - 165, 380);
  }, [isMobile]);

  const totalPages = pages.length;
  pagesRef.current = pages;
  currentPageRef.current = currentPage;

  const syncCurrentPageFromScroll = useCallback(() => {
    const root = viewerScrollRef.current;
    if (!root || totalPages === 0) return;
    if (Date.now() < skipScrollSyncUntilRef.current) return;

    const probeY = root.scrollTop + root.clientHeight * 0.22;
    let detected = 1;
    for (let i = 0; i < pageWrapRefs.current.length; i += 1) {
      const node = pageWrapRefs.current[i];
      if (!node) continue;
      if (probeY >= node.offsetTop) {
        detected = i + 1;
      } else {
        break;
      }
    }
    if (detected !== currentPageRef.current) {
      setCurrentPage(detected);
    }
  }, [totalPages]);

  const goToPage = useCallback((targetPage: number) => {
    const root = viewerScrollRef.current;
    const node = pageWrapRefs.current[targetPage - 1];
    if (!root || !node) return;

    skipScrollSyncUntilRef.current = Date.now() + 420;
    setCurrentPage(targetPage);
    root.scrollTo({
      top: Math.max(0, node.offsetTop - 2),
      behavior: "smooth",
    });
  }, []);

  const renderPage = useCallback(
    async (pageIndex: number) => {
      const pageInfo = pagesRef.current[pageIndex];
      const canvas = canvasRefs.current[pageIndex];
      const pageWrap = pageWrapRefs.current[pageIndex];
      if (!pageInfo || !canvas || !pageWrap) return;

      const pdfjs = await loadPdfJs();
      const loadingTask = pdfjs.getDocument({ url: pdfUrl, withCredentials: false });
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(pageInfo.pageNumber);

      const base = page.getViewport({ scale: 1 });
      const ratio = pageInfo.height / pageInfo.width;
      const containerWidth = Math.max(220, pageWrap.clientWidth - 6);
      const desktopTargetHeight = pageTargetHeight * zoom;
      const desktopTargetWidth = Math.max((desktopTargetHeight * pageInfo.width) / pageInfo.height, 220);
      const mobileFitWidth = containerWidth;

      const targetWidth = isMobile ? mobileFitWidth * zoom : desktopTargetWidth;
      const targetHeight = isMobile ? targetWidth * ratio : desktopTargetHeight;
      const dpr = window.devicePixelRatio || 1;
      const renderScale = (targetWidth * dpr) / base.width;
      const viewport = page.getViewport({ scale: renderScale });

      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      canvas.style.width = `${targetWidth}px`;
      canvas.style.height = `${targetHeight}px`;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      await page.render({ canvasContext: ctx, viewport }).promise;
    },
    [isMobile, pageTargetHeight, pdfUrl, zoom]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => {
      const mobile = mq.matches;
      setIsMobile(mobile);
      setZoom((z) => {
        const min = mobile ? MOBILE_ZOOM_MIN : MIN_ZOOM;
        return Math.max(min, z);
      });
    };
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const root = viewerScrollRef.current;
    if (!root) return;
    const onScroll = () => syncCurrentPageFromScroll();
    root.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      root.removeEventListener("scroll", onScroll);
    };
  }, [syncCurrentPageFromScroll]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onResize = () => setViewportTick((v) => v + 1);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadDoc() {
      try {
        setIsLoading(true);
        setLoadError(null);
        const pdfjs = await loadPdfJs();
        if (cancelled) return;
        const loadingTask = pdfjs.getDocument({ url: pdfUrl, withCredentials: false });
        const pdf = await loadingTask.promise;
        if (cancelled) return;

        const loadedPages: PdfPageInfo[] = [];
        for (let i = 1; i <= pdf.numPages; i += 1) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 1 });
          loadedPages.push({
            pageNumber: i,
            width: viewport.width,
            height: viewport.height,
          });
        }
        if (cancelled) return;
        setPages(loadedPages);
        setCurrentPage(1);
      } catch {
        if (!cancelled) {
          setLoadError("PDF se nepodařilo načíst.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadDoc();
    return () => {
      cancelled = true;
    };
  }, [pdfUrl]);

  useEffect(() => {
    if (pages.length === 0) return;
    let cancelled = false;

    async function renderAll() {
      for (let i = 0; i < pages.length; i += 1) {
        if (cancelled) return;
        await renderPage(i);
      }
    }

    void renderAll();
    return () => {
      cancelled = true;
    };
  }, [pages, renderPage, viewportTick]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (isMobile) return;

      if (event.key === "ArrowRight" || event.key === "PageDown") {
        event.preventDefault();
        const nextPage = Math.min(totalPages, currentPage + 1);
        goToPage(nextPage);
        return;
      }

      if (event.key === "ArrowLeft" || event.key === "PageUp") {
        event.preventDefault();
        const prevPage = Math.max(1, currentPage - 1);
        goToPage(prevPage);
        return;
      }

      const withCtrl = event.metaKey || event.ctrlKey;
      if (!withCtrl) return;
      const minZoom = isMobile ? MOBILE_ZOOM_MIN : MIN_ZOOM;
      if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        setZoom((z) => Math.min(MAX_ZOOM, Number((z + 0.1).toFixed(2))));
      } else if (event.key === "-") {
        event.preventDefault();
        setZoom((z) => Math.max(minZoom, Number((z - 0.1).toFixed(2))));
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [currentPage, goToPage, isMobile, onClose, totalPages]);

  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  return (
    <div
      className="fixed inset-0 z-[220]"
      style={{ background: "rgba(0,0,0,0.92)" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "absolute",
          inset: isMobile ? "0" : "2vh 2vw",
          borderRadius: isMobile ? "0" : "14px",
          background: "#080304",
          border: isMobile ? "none" : "1px solid rgba(255,255,255,0.12)",
          overflow: "hidden",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          style={{
            position: "absolute",
            top: "0.85rem",
            right: "0.85rem",
            zIndex: 6,
            color: "#fff",
            background: "rgba(255,255,255,0.15)",
            border: "none",
            borderRadius: "999px",
            width: "38px",
            height: "38px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
          aria-label="Zavřít PDF"
        >
          <X size={18} />
        </button>

        <div
          ref={viewerScrollRef}
          onClick={() => isMobile && setShowMobileControls((s) => !s)}
          style={{
            position: "absolute",
            inset: 0,
            overflowY: "auto",
            overflowX: "auto",
            padding: isMobile ? "4.25rem 0.6rem 5.5rem" : "4.3rem 1rem 5.2rem",
            WebkitOverflowScrolling: "touch",
            background: "#080304",
          }}
        >
          {isLoading && (
            <div
              style={{
                color: "rgba(255,255,255,0.85)",
                textAlign: "center",
                fontFamily: "var(--font-inter), sans-serif",
                marginTop: "4rem",
              }}
            >
              Načítám PDF...
            </div>
          )}
          {loadError && (
            <div
              style={{
                color: "#ffd2d2",
                textAlign: "center",
                fontFamily: "var(--font-inter), sans-serif",
                marginTop: "4rem",
              }}
            >
              {loadError}
            </div>
          )}

          {!isLoading && !loadError && (
            <div style={{ display: "grid", gap: isMobile ? "0.32rem" : "0.8rem" }}>
              {pages.map((page, index) => (
                <div
                  key={page.pageNumber}
                  ref={(node) => {
                    pageWrapRefs.current[index] = node;
                  }}
                  data-page-index={index}
                  style={{
                    background: "#000",
                    borderRadius: "10px",
                    minHeight: isMobile ? undefined : `${pageTargetHeight * zoom}px`,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: isMobile ? "0.1rem" : "0.2rem",
                  }}
                >
                  <canvas
                    ref={(node) => {
                      canvasRefs.current[index] = node;
                    }}
                    style={{
                      display: "block",
                      borderRadius: "6px",
                      boxShadow: "0 16px 38px rgba(0,0,0,0.38)",
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: "0.9rem",
            transform: "translateX(-50%)",
            zIndex: 7,
            display: "inline-flex",
            alignItems: "center",
            gap: "0.58rem",
            borderRadius: "999px",
            padding: "0.52rem 0.76rem",
            background: "rgba(16,5,8,0.9)",
            border: "1px solid rgba(255,255,255,0.16)",
            color: "#fff",
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "0.88rem",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
          }}
        >
          <span style={{ minWidth: "5.3rem", textAlign: "center", fontWeight: 700 }}>
            {Math.min(currentPage, Math.max(totalPages, 1))} / {Math.max(totalPages, 1)}
          </span>

          {(!isMobile || showMobileControls) && (
            <>
              <button
                type="button"
                onClick={() => {
                  const minZoom = isMobile ? MOBILE_ZOOM_MIN : MIN_ZOOM;
                  setZoom((z) => Math.max(minZoom, Number((z - 0.1).toFixed(2))));
                }}
                style={pillBtnStyle}
                aria-label="Oddálit"
              >
                <ZoomOut size={16} />
              </button>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(MAX_ZOOM, Number((z + 0.1).toFixed(2))))}
                style={pillBtnStyle}
                aria-label="Přiblížit"
              >
                <ZoomIn size={16} />
              </button>
              <button
                type="button"
                disabled={!canPrev}
                onClick={() => goToPage(Math.max(1, currentPage - 1))}
                style={{ ...pillBtnStyle, opacity: canPrev ? 1 : 0.45 }}
                aria-label="Předchozí stránka"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                disabled={!canNext}
                onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
                style={{ ...pillBtnStyle, opacity: canNext ? 1 : 0.45 }}
                aria-label="Další stránka"
              >
                <ChevronRight size={16} />
              </button>
            </>
          )}
        </div>

        {!isMobile && (
          <div
            style={{
              position: "absolute",
              left: "1rem",
              top: "0.95rem",
              zIndex: 6,
              color: ACID_GREEN,
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "0.75rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontWeight: 700,
              background: "rgba(16,5,8,0.65)",
              border: `1px solid ${WINE_RED}`,
              borderRadius: "999px",
              padding: "0.25rem 0.6rem",
            }}
          >
            {title}
          </div>
        )}
      </div>
    </div>
  );
}

const pillBtnStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "2.25rem",
  height: "2.25rem",
  borderRadius: "999px",
  border: `1px solid rgba(122,30,44,0.55)`,
  background: WINE_RED,
  color: ACID_GREEN,
  cursor: "pointer",
};
