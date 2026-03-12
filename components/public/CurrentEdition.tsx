import { DARK_WINE, WINE_RED, LIGHT_BG } from "@/lib/theme";
import Link from "next/link";

interface YearBasic {
  id: string;
  year?: number | null;
  edition?: string | null;
  title?: string | null;
  name?: string | null;
  program_title?: string | null;
  program_pdf_url?: string | null;
}

interface CurrentEditionProps {
  latestYear: YearBasic | null;
}

export function CurrentEdition({ latestYear }: CurrentEditionProps) {
  const title = latestYear?.title || latestYear?.name || (latestYear?.year ? `${latestYear.edition || ""}. ročník Čůčobraní – ${latestYear.year}` : null);

  return (
    <section id="aktualni-rocnik" style={{ backgroundColor: LIGHT_BG }} className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-10 h-0.5 rounded-sm block" style={{ backgroundColor: WINE_RED }} />
          <span
            className="uppercase text-xs font-semibold tracking-widest"
            style={{ color: WINE_RED, fontFamily: "var(--font-inter), sans-serif" }}
          >
            Aktuálně
          </span>
        </div>
        <h2
          style={{
            fontFamily: "var(--font-bebas), sans-serif",
            fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
            color: DARK_WINE,
            letterSpacing: "0.03em",
            lineHeight: 1,
            marginBottom: "0.5rem",
          }}
        >
          Poslední ročník
        </h2>
        <p className="text-[#777] text-sm mb-8" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
          Zjistěte, jak dopadl poslední ročník, nahlédněte do fotogalerie a videozáznamů.
        </p>

        {latestYear ? (
          <div
            className="rounded-xl p-8 border border-black/10 bg-white max-w-2xl"
            style={{ boxShadow: "0 4px 24px rgba(122,30,44,0.08)" }}
          >
            <p
              className="text-xs uppercase tracking-widest font-semibold mb-2"
              style={{ color: WINE_RED, fontFamily: "var(--font-inter), sans-serif" }}
            >
              {latestYear.edition || ""}. ročník
            </p>
            <h3
              className="mb-4"
              style={{
                fontFamily: "var(--font-bebas), sans-serif",
                fontSize: "2rem",
                letterSpacing: "0.04em",
                color: DARK_WINE,
              }}
            >
              {title}
            </h3>
            {latestYear.program_title && (
              <p
                className="text-[#555] mb-4"
                style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "1rem" }}
              >
                Program: {latestYear.program_title}
              </p>
            )}
            <Link
              href={`/archiv/${latestYear.id}`}
              className="inline-block px-6 py-3 rounded text-white font-medium transition-colors hover:opacity-90"
              style={{
                backgroundColor: WINE_RED,
                fontFamily: "var(--font-inter), sans-serif",
              }}
            >
              Zobrazit výsledky a fotogalerii
            </Link>
          </div>
        ) : (
          <p
            className="text-[#666]"
            style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "1rem" }}
          >
            Zatím není k dispozici žádný publikovaný ročník. Po přidání ročníků v administraci se zde
            zobrazí poslední.
          </p>
        )}
      </div>
    </section>
  );
}
