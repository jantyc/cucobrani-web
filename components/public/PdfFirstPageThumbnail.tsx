"use client";

import { useEffect, useRef, useState } from "react";
import { FileText } from "lucide-react";
import { loadPdfJs } from "@/lib/pdf-client";
import { ACID_GREEN } from "@/lib/theme";

interface PdfFirstPageThumbnailProps {
  pdfUrl: string;
  className?: string;
  style?: React.CSSProperties;
}

export function PdfFirstPageThumbnail({ pdfUrl, className, style }: PdfFirstPageThumbnailProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let renderTask: { cancel: () => void; promise: Promise<void> } | null = null;
    let resizeObserver: ResizeObserver | null = null;

    async function run() {
      try {
        setHasError(false);
        const pdfjs = await loadPdfJs();
        if (cancelled) return;

        const loadingTask = pdfjs.getDocument({ url: pdfUrl, withCredentials: false });
        const pdf = await loadingTask.promise;
        if (cancelled) return;

        const page = await pdf.getPage(1);
        if (cancelled) return;

        const render = async () => {
          const wrap = wrapRef.current;
          const canvas = canvasRef.current;
          if (!wrap || !canvas) return;

          const width = Math.max(1, wrap.clientWidth);
          const height = Math.max(1, wrap.clientHeight);
          const dpr = window.devicePixelRatio || 1;
          const base = page.getViewport({ scale: 1 });
          const fitScale = Math.min(width / base.width, height / base.height);
          const drawWidth = base.width * fitScale;
          const drawHeight = base.height * fitScale;
          const drawX = (width - drawWidth) / 2;
          const drawY = (height - drawHeight) / 2;

          canvas.width = Math.floor(width * dpr);
          canvas.height = Math.floor(height * dpr);
          canvas.style.width = `${width}px`;
          canvas.style.height = `${height}px`;

          const ctx = canvas.getContext("2d");
          if (!ctx) return;

          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.scale(dpr, dpr);
          ctx.fillStyle = "#12050a";
          ctx.fillRect(0, 0, width, height);

          const viewport = page.getViewport({ scale: fitScale });
          renderTask?.cancel();
          renderTask = page.render({
            canvasContext: ctx,
            viewport,
            transform: [1, 0, 0, 1, drawX, drawY],
          });
          await renderTask.promise;
        };

        await render();
        if (cancelled) return;

        resizeObserver = new ResizeObserver(() => {
          void render();
        });
        if (wrapRef.current) {
          resizeObserver.observe(wrapRef.current);
        }
      } catch {
        if (!cancelled) {
          setHasError(true);
        }
      }
    }

    void run();

    return () => {
      cancelled = true;
      renderTask?.cancel();
      resizeObserver?.disconnect();
    };
  }, [pdfUrl]);

  return (
    <div
      ref={wrapRef}
      className={className}
      style={{
        position: "relative",
        background: "#12050a",
        border: "1px solid rgba(167,209,41,0.35)",
        borderRadius: "6px",
        overflow: "hidden",
        ...style,
      }}
    >
      <canvas ref={canvasRef} />
      {hasError && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.35rem",
            color: ACID_GREEN,
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "0.7rem",
            background: "rgba(18,5,10,0.88)",
          }}
        >
          <FileText size={12} />
          PDF
        </div>
      )}
    </div>
  );
}
