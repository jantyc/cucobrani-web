import { ArchiveClient } from "./ArchiveClient";
import { DARK_WINE, WINE_RED, LIGHT_BG } from "@/lib/theme";

export interface YearForArchive {
  id: string;
  year?: number | null;
  edition?: string | null;
  title?: string | null;
  name?: string | null;
  status?: string | null;
}

interface ArchiveProps {
  years: YearForArchive[];
}

export function Archive({ years }: ArchiveProps) {
  return (
    <section id="archiv" style={{ backgroundColor: LIGHT_BG }} className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-10 h-0.5 rounded-sm block" style={{ backgroundColor: WINE_RED }} />
          <span
            className="uppercase text-xs font-semibold tracking-widest"
            style={{ color: WINE_RED, fontFamily: "var(--font-inter), sans-serif" }}
          >
            Historie
          </span>
        </div>
        <div className="mb-10">
          <h2
            style={{
              fontFamily: "var(--font-bebas), sans-serif",
              fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
              color: DARK_WINE,
              letterSpacing: "0.03em",
              lineHeight: 1,
            }}
          >
            Archiv ročníků
          </h2>
          <p
            className="mt-2 text-[#777]"
            style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.9rem" }}
          >
            více než 30 let odvahy ochutnávat
          </p>
        </div>

        <ArchiveClient years={years} />
      </div>
    </section>
  );
}
