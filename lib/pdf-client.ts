"use client";

let workerConfigured = false;
let cachedPdfJs: Promise<{
  GlobalWorkerOptions: { workerSrc: string };
  getDocument: (params: { url: string; withCredentials: boolean }) => {
    promise: Promise<{
      numPages: number;
      getPage: (pageNumber: number) => Promise<{
        getViewport: (params: { scale: number }) => { width: number; height: number };
        render: (params: {
          canvasContext: CanvasRenderingContext2D;
          viewport: { width: number; height: number };
          transform?: number[];
        }) => { promise: Promise<void>; cancel: () => void };
      }>;
    }>;
  };
}> | null = null;

const PDFJS_URL = "https://cdn.jsdelivr.net/npm/pdfjs-dist@5.4.296/build/pdf.min.mjs";
const PDFJS_WORKER_URL = "https://cdn.jsdelivr.net/npm/pdfjs-dist@5.4.296/build/pdf.worker.min.mjs";

export async function loadPdfJs() {
  if (!cachedPdfJs) {
    cachedPdfJs = import(/* webpackIgnore: true */ PDFJS_URL) as Promise<{
      GlobalWorkerOptions: { workerSrc: string };
      getDocument: (params: { url: string; withCredentials: boolean }) => {
        promise: Promise<{
          numPages: number;
          getPage: (pageNumber: number) => Promise<{
            getViewport: (params: { scale: number }) => { width: number; height: number };
            render: (params: {
              canvasContext: CanvasRenderingContext2D;
              viewport: { width: number; height: number };
              transform?: number[];
            }) => { promise: Promise<void>; cancel: () => void };
          }>;
        }>;
      };
    }>;
  }
  const pdfjs = await cachedPdfJs;

  if (!workerConfigured) {
    pdfjs.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL;
    workerConfigured = true;
  }

  return pdfjs;
}
