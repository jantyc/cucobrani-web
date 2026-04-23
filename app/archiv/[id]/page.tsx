import { createPublicClient } from "@/lib/supabase/public";
import { notFound } from "next/navigation";
import Link from "next/link";
import { DARK_WINE, WINE_RED } from "@/lib/theme";
import { YearProgramDetail } from "@/components/public/YearProgramDetail";
import { PREHISTORY_ENTRIES, PREHISTORY_LIST_TITLE, PREHISTORY_TITLE } from "@/lib/prehistory";
import { formatPlaceWithTies } from "@/lib/results-ranking";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = 300;

type ArchiveWineRow = {
  position: number;
  name: string | null;
  sample_number: string | null;
  wine: string | null;
  points: string | null;
};

function formatSampleLabel(sampleNumber: string | null) {
  const value = (sampleNumber ?? "").trim();
  if (!value) return "Vzorek č.—";
  if (/^[cč]\./i.test(value)) return `Vzorek ${value}`;
  return `Vzorek č.${value}`;
}

function normalizeArchiveWineRows(data: unknown): ArchiveWineRow[] {
  if (!Array.isArray(data)) return [];
  return data.map((row) => {
    const r = row as Record<string, unknown>;
    return {
      position: Number(r.position),
      name: (r.name as string | null) ?? null,
      sample_number: (r.sample_number as string | null | undefined) ?? null,
      wine: (r.wine as string | null) ?? null,
      points: (r.points as string | null) ?? null,
    };
  });
}

async function fetchWineRowsForArchive(
  supabase: ReturnType<typeof createPublicClient>,
  table: "year_results_white" | "year_results_red",
  yearId: string
) {
  const withSampleNumber = await supabase
    .from(table)
    .select("position, name, sample_number, wine, points")
    .eq("year_id", yearId)
    .order("position", { ascending: true });

  if (!withSampleNumber.error) {
    return withSampleNumber;
  }

  // Backward compatibility: DB ještě nemusí mít sample_number (migrace neproběhla).
  return supabase
    .from(table)
    .select("position, name, wine, points")
    .eq("year_id", yearId)
    .order("position", { ascending: true });
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  if (id === "prehistorie") {
    return {
      title: `${PREHISTORY_TITLE} | Čůčobraní – archiv`,
      description: "Přehled prehistorických ročníků Čůčobraní (1988-2001).",
    };
  }
  const supabase = createPublicClient();
  const { data } = await supabase.from("years").select("year, edition, title, name").eq("id", id).single();
  const title = data?.title || data?.name || (data?.year ? `Ročník ${data.year}` : "Ročník");
  return {
    title: `${title} | Čůčobraní – archiv`,
    description: `Detail ročníku Čůčobraní: ${title}. Výsledky soutěže, program, fotogalerie.`,
  };
}

export default async function YearPage({ params }: PageProps) {
  const { id } = await params;
  if (id === "prehistorie") {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "#F6F4F1" }}>
        <header className="border-b border-black/10 bg-white">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/#archiv" className="text-[#7A1E2C] font-medium hover:underline" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
              ← Zpět na archiv
            </Link>
            <Link href="/" className="font-semibold" style={{ fontFamily: "var(--font-bebas), sans-serif", letterSpacing: "0.08em", color: DARK_WINE, fontSize: "1.25rem" }}>
              Čůčobraní
            </Link>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="mb-4" style={{ fontFamily: "var(--font-bebas), sans-serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", color: DARK_WINE, letterSpacing: "0.04em" }}>
            {PREHISTORY_TITLE}
          </h1>
          <section className="mb-8 p-6 rounded-xl bg-white border border-black/10">
            <h2 className="mb-4" style={{ fontFamily: "var(--font-bebas), sans-serif", fontSize: "1.4rem", color: DARK_WINE, letterSpacing: "0.05em" }}>
              {PREHISTORY_LIST_TITLE}
            </h2>
            <div className="space-y-4">
              {PREHISTORY_ENTRIES.map((entry) => (
                <div key={entry.year} className="border-b border-black/10 pb-3 last:border-b-0">
                  <p className="text-[#2b1f1f]" style={{ fontFamily: "var(--font-inter), sans-serif", fontWeight: 700 }}>
                    {entry.year} - {entry.winner}
                  </p>
                  <p className="text-[#555]" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                    Místo konání: {entry.location}
                  </p>
                  <p className="text-[#555]" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                    Scénka: {entry.scene}
                  </p>
                </div>
              ))}
            </div>
          </section>
          <Link href="/" className="inline-block px-5 py-2.5 rounded text-white font-medium" style={{ backgroundColor: WINE_RED, fontFamily: "var(--font-inter), sans-serif" }}>
            Zpět na úvodní stránku
          </Link>
        </main>
      </div>
    );
  }

  const supabase = createPublicClient();

  const { data: year, error } = await supabase
    .from("years")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !year) notFound();

  const isPublished = year.status === "publikováno";
  let results: {
    queen: { name: string | null; wine: string | null; points: string | null } | null;
    audience: { name: string | null; wine: string | null; points: string | null } | null;
    worst: { name: string | null; wine: string | null; points: string | null } | null;
    white: ArchiveWineRow[];
    red: ArchiveWineRow[];
  } | null = null;

  if (isPublished) {
    try {
      const [q, a, w, wh, r] = await Promise.all([
        supabase.from("year_results_queen").select("name, wine, points").eq("year_id", id).maybeSingle(),
        supabase.from("year_results_audience").select("name, wine, points").eq("year_id", id).maybeSingle(),
        supabase.from("year_results_worst").select("name, wine, points").eq("year_id", id).maybeSingle(),
        fetchWineRowsForArchive(supabase, "year_results_white", id),
        fetchWineRowsForArchive(supabase, "year_results_red", id),
      ]);
      const hasAny = q.data || a.data || w.data || (wh.data && wh.data.length) || (r.data && r.data.length);
      if (hasAny) {
        results = {
          queen: q.data ?? null,
          audience: a.data ?? null,
          worst: w.data ?? null,
          white: normalizeArchiveWineRows(wh.data),
          red: normalizeArchiveWineRows(r.data),
        };
      }
    } catch {
      // Tabulky výsledků nemusí existovat (starší migrace)
    }
  }

  let gallery: { storage_path: string }[] = [];
  if (isPublished) {
    try {
      const { data } = await supabase
        .from("year_gallery")
        .select("storage_path")
        .eq("year_id", id)
        .order("sort_order", { ascending: true });
      gallery = data ?? [];
    } catch {
      // Storage bucket nebo tabulka nemusí existovat
    }
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const galleryUrls = gallery.map((g) =>
    g.storage_path.startsWith("http://") || g.storage_path.startsWith("https://")
      ? g.storage_path
      : `${supabaseUrl}/storage/v1/object/public/year-gallery/${g.storage_path}`
  );

  const hasProgram = Boolean(
    year.program_title || year.program_author || year.program_description || year.program_pdf_url
  );

  const hasAnyResultsPieces = Boolean(results);

  const displayTitle = year.title || year.name || (year.year ? `${year.edition || ""}. ročník – ${year.year}` : "Ročník");

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F6F4F1" }}>
      <header className="border-b border-black/10 bg-white">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/#archiv"
            className="text-[#7A1E2C] font-medium hover:underline"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            ← Zpět na archiv
          </Link>
          <Link
            href="/"
            className="font-semibold"
            style={{
              fontFamily: "var(--font-bebas), sans-serif",
              letterSpacing: "0.08em",
              color: DARK_WINE,
              fontSize: "1.25rem",
            }}
          >
            Čůčobraní
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1
          className="mb-2"
          style={{
            fontFamily: "var(--font-bebas), sans-serif",
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            color: DARK_WINE,
            letterSpacing: "0.04em",
          }}
        >
          {displayTitle}
        </h1>
        {!hasProgram && !results && galleryUrls.length === 0 && (
          <p className="text-[#666] mb-8" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
            Detail tohoto ročníku je jako zapomenutá demižónka ve sklepě – víme, že existoval, ale zbytek se ztratil v mlze času.
          </p>
        )}

        <YearProgramDetail
          title={year.program_title}
          author={year.program_author}
          description={year.program_description}
          pdfUrl={year.program_pdf_url}
        />

        <section className="mb-8 p-6 rounded-xl bg-white border border-black/10">
          <h2
            className="mb-4"
            style={{
              fontFamily: "var(--font-bebas), sans-serif",
              fontSize: "1.25rem",
              color: DARK_WINE,
            }}
          >
            Výsledky soutěže
          </h2>
          {!hasAnyResultsPieces ? (
            <p className="text-[#333]" style={{ fontFamily: "var(--font-inter), sans-serif", lineHeight: 1.6 }}>
              Kompletní výsledky tohoto ročníku bohužel nebyly dochovány. Zapisovatel pravděpodobně ochutnával víc, než by se slušelo.
            </p>
          ) : (
            <div className="space-y-6" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
              {results && (() => {
                const hasQueen = results.queen && (results.queen.name || results.queen.wine || results.queen.points);
                const hasAudience = results.audience && (results.audience.name || results.audience.wine || results.audience.points);
                const hasWorst = results.worst && (results.worst.name || results.worst.wine || results.worst.points);
                const hasWhite = results.white.length > 0;
                const hasRed = results.red.length > 0;
                const isPartial = (hasQueen || hasAudience || hasWorst || hasWhite || hasRed) &&
                  !(hasQueen && hasAudience && hasWorst && hasWhite && hasRed);
                return (
                  <>
                    {isPartial && (
                      <p className="text-sm text-[#777]">
                        Dochovaly se jen střípky – zbytek výsledků se rozpustil v sudu dějin.
                      </p>
                    )}
                    {hasQueen && (
                      <div>
                        <h3 className="text-sm font-semibold text-[#666] mb-1">Královna sklepa</h3>
                        <p className="text-[#333]">
                          {[results.queen?.name, results.queen?.wine, results.queen?.points].filter(Boolean).join(" – ")}
                        </p>
                      </div>
                    )}
                    {hasAudience && (
                      <div>
                        <h3 className="text-sm font-semibold text-[#666] mb-1">Cena diváků</h3>
                        <p className="text-[#333]">
                          {[results.audience?.name, results.audience?.wine, results.audience?.points].filter(Boolean).join(" – ")}
                        </p>
                      </div>
                    )}
                    {hasWorst && (
                      <div>
                        <h3 className="text-sm font-semibold text-[#666] mb-1">Sračka roku</h3>
                        <p className="text-[#333]">
                          {[results.worst?.name, results.worst?.wine, results.worst?.points].filter(Boolean).join(" – ")}
                        </p>
                      </div>
                    )}
                    {hasWhite && (
                      <div>
                        <h3 className="text-sm font-semibold text-[#666] mb-2">Bílá vína</h3>
                        <div className="md:hidden space-y-2.5">
                          {results.white.map((row, i) => (
                            <div key={i} className="rounded-xl border border-black/10 bg-white px-3.5 py-2.5 shadow-[0_1px_5px_rgba(0,0,0,0.03)] flex items-center justify-between gap-2.5">
                              <div className="min-w-0 flex-1 flex items-center gap-2.5">
                                <span className="w-[3.35rem] shrink-0 text-[1.24rem] leading-none font-bold text-[#7A1E2C] whitespace-nowrap">
                                  {formatPlaceWithTies(results.white, i, (x) => x.points)}
                                </span>
                                <div className="min-w-0">
                                  <p className="text-[0.86rem] font-bold text-[#222] leading-tight whitespace-nowrap overflow-hidden text-ellipsis">{row.name || "—"}</p>
                                  <p className="mt-0.5 text-[0.72rem] text-[#666] leading-tight">{formatSampleLabel(row.sample_number)}</p>
                                  <p className="mt-0.5 text-[0.72rem] text-[#575757] leading-tight">{row.wine || "—"}</p>
                                </div>
                              </div>
                              <span className="shrink-0 text-[0.9rem] leading-none font-bold text-[#7A1E2C] whitespace-nowrap">{row.points || "—"} b</span>
                            </div>
                          ))}
                        </div>
                        <table className="hidden md:table w-full border-collapse text-[#333]">
                          <thead>
                            <tr className="border-b border-black/10 text-xs uppercase tracking-[0.08em] text-[#888]">
                              <th className="text-left pb-2 w-10">#</th>
                              <th className="text-left pb-2 pl-3.5">Výrobce</th>
                              <th className="text-left pb-2 w-28">Vzorek č.</th>
                              <th className="text-left pb-2">Víno</th>
                              <th className="text-right pb-2">Body</th>
                            </tr>
                          </thead>
                          <tbody>
                            {results.white.map((row, i) => (
                              <tr key={i} className="border-b border-black/5 text-sm">
                                <td className="py-2 font-semibold text-[#7A1E2C]">
                                  {formatPlaceWithTies(results.white, i, (x) => x.points)}
                                </td>
                                <td className="py-2 pl-3.5">{row.name || "—"}</td>
                                <td className="py-2">{row.sample_number || "—"}</td>
                                <td className="py-2 text-[#666]">{row.wine || "—"}</td>
                                <td className="py-2 text-right text-[#777]">{row.points || "—"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                    {hasRed && (
                      <div>
                        <h3 className="text-sm font-semibold text-[#666] mb-2">Červená vína</h3>
                        <div className="md:hidden space-y-2.5">
                          {results.red.map((row, i) => (
                            <div key={i} className="rounded-xl border border-black/10 bg-white px-3.5 py-2.5 shadow-[0_1px_5px_rgba(0,0,0,0.03)] flex items-center justify-between gap-2.5">
                              <div className="min-w-0 flex-1 flex items-center gap-2.5">
                                <span className="w-[3.35rem] shrink-0 text-[1.24rem] leading-none font-bold text-[#7A1E2C] whitespace-nowrap">
                                  {formatPlaceWithTies(results.red, i, (x) => x.points)}
                                </span>
                                <div className="min-w-0">
                                  <p className="text-[0.86rem] font-bold text-[#222] leading-tight whitespace-nowrap overflow-hidden text-ellipsis">{row.name || "—"}</p>
                                  <p className="mt-0.5 text-[0.72rem] text-[#666] leading-tight">{formatSampleLabel(row.sample_number)}</p>
                                  <p className="mt-0.5 text-[0.72rem] text-[#575757] leading-tight">{row.wine || "—"}</p>
                                </div>
                              </div>
                              <span className="shrink-0 text-[0.9rem] leading-none font-bold text-[#7A1E2C] whitespace-nowrap">{row.points || "—"} b</span>
                            </div>
                          ))}
                        </div>
                        <table className="hidden md:table w-full border-collapse text-[#333]">
                          <thead>
                            <tr className="border-b border-black/10 text-xs uppercase tracking-[0.08em] text-[#888]">
                              <th className="text-left pb-2 w-10">#</th>
                              <th className="text-left pb-2 pl-3.5">Výrobce</th>
                              <th className="text-left pb-2 w-28">Vzorek č.</th>
                              <th className="text-left pb-2">Víno</th>
                              <th className="text-right pb-2">Body</th>
                            </tr>
                          </thead>
                          <tbody>
                            {results.red.map((row, i) => (
                              <tr key={i} className="border-b border-black/5 text-sm">
                                <td className="py-2 font-semibold text-[#7A1E2C]">
                                  {formatPlaceWithTies(results.red, i, (x) => x.points)}
                                </td>
                                <td className="py-2 pl-3.5">{row.name || "—"}</td>
                                <td className="py-2">{row.sample_number || "—"}</td>
                                <td className="py-2 text-[#666]">{row.wine || "—"}</td>
                                <td className="py-2 text-right text-[#777]">{row.points || "—"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          )}
        </section>

        <section className="mb-8 p-6 rounded-xl bg-white border border-black/10">
          <h2
            className="mb-4"
            style={{
              fontFamily: "var(--font-bebas), sans-serif",
              fontSize: "1.25rem",
              color: DARK_WINE,
            }}
          >
            Fotogalerie
          </h2>
          {galleryUrls.length === 0 ? (
            <p className="text-[#333]" style={{ fontFamily: "var(--font-inter), sans-serif", lineHeight: 1.6 }}>
              Fotky z tohoto ročníku se nejspíš ztratily v šuplíku s rodinnými albíčky. Pokud nějaké najdete, ozvěte se organizátorům.
            </p>
          ) : (
            <>
              {galleryUrls.length > 0 && galleryUrls.length < 3 && (
                <p className="text-sm text-[#777] mb-3" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                  Dochovalo se jen pár záběrů – zbytek zůstal v analogových foťácích a zapomenutých paměťovkách.
                </p>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {galleryUrls.map((url, i) => (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-lg overflow-hidden border border-black/10 aspect-square focus:ring-2 focus:ring-[#7A1E2C]/40"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  </a>
                ))}
              </div>
            </>
          )}
        </section>

        <Link
          href="/"
          className="inline-block px-5 py-2.5 rounded text-white font-medium"
          style={{ backgroundColor: WINE_RED, fontFamily: "var(--font-inter), sans-serif" }}
        >
          Zpět na úvodní stránku
        </Link>
      </main>
    </div>
  );
}
